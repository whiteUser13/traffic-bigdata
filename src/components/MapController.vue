<template>
  <div id="menuLeft" :class="{ shrink: isShrink }">
    <div id="minisize-btn">
      <el-tooltip effect="dark" content="收起" placement="bottom-start">
        <el-button
          icon="el-icon-top-left"
          circle
          type="primary"
          @click="isShrink = true"></el-button>
      </el-tooltip>
    </div>

    <div id="maxsize-btn" v-if="isShrink" @click="isShrink = false">
      <i class="el-icon-full-screen"></i>
    </div>

    <div id="screenshot-btn">
      <el-tooltip effect="dark" content="截图" placement="bottom-start">
        <el-button
          icon="el-icon-camera"
          circle
          type="success"
          @click="takeScreenshot"></el-button>
      </el-tooltip>
    </div>

    <!-- 加载数据-->

    <div v-if="!controllerAttribute.isNeedCustomLoadData">
      <div>
        <h5>加载服务器数据</h5>

        <div class="load-data">
          <div>
            <el-select
              style="margin-right: 4px"
              v-model="selectedOnlineData"
              placeholder="服务器数据"
              @change="handleOnlineDataLoad">
              <el-option
                v-for="(item, index) in onlineDataList"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>

          <el-button
            style="width: 120px; padding: 7px 0px"
            v-for="(type, index) in controllerAttribute.mapType"
            :key="index"
            type="primary"
            size="mini"
            @click="handleDataRender(type)"
            :disabled="isRenderButtonDisabled">
            {{ "生成" + type }}
          </el-button>
        </div>
      </div>

      <div class="load-local-file">
        <h5>加载本地数据</h5>
        <FileUploader
          :dataExplain="'上传的数据应包含所需字段'"
          @data-sent="handleLocalDataLoad"
          ref="FileUploader">
          <el-select
            v-for="field in controllerAttribute.fieldConfig"
            :key="field.field"
            v-model="selectedField[field.field]"
            :placeholder="`请选择${field.description}字段`">
            <el-option
              v-for="(header, index) in localDataHeaders"
              :key="index"
              :label="header"
              :value="header"></el-option>
          </el-select>
          <el-button
            v-for="(type, index) in controllerAttribute.mapType"
            :key="index"
            type="primary"
            @click="handleDataRender(type)">
            {{ type }}
          </el-button>
        </FileUploader>
      </div>

      <!-- 加载shp -->

      <div v-if="controllerAttribute.isNeedShpLoader">
        <h5>加载shp(可选)</h5>
        <div class="load-shp-content">
          <div style="margin-right: 5px">
            <el-select
              v-model="selectedOnlineShp"
              placeholder="服务器shp"
              @change="handleOnlineShpLoad">
              <el-option
                v-for="(item, index) in onlineShpList"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>

          <el-upload
            action="null"
            :limit="1"
            :show-file-list="false"
            :before-upload="() => false"
            :on-change="handleLocalShpLoad">
            <el-button type="primary" style="margin-left: 0">上传shp</el-button>
          </el-upload>
          <el-button @click="clearShp" type="danger">移除</el-button>
        </div>
      </div>
    </div>

    <!-- 自定义样式-->

    <div v-if="controllerAttribute.mapType[0] === '热力图'">
      <h5>选择地图样式</h5>
      <div style="display: flex; align-items: center">
        <el-select
          v-model="mapAttribute.selectedStyle"
          placeholder="选择地图样式"
          @change="updateStyle">
          <el-option
            v-for="(style, index) in controllerAttribute.mapStyleList"
            :key="index"
            :label="style.name"
            :value="style"></el-option>
        </el-select>

        <colorPicker
          style="margin-left: 4px"
          v-model="mapAttribute.selectedColor"
          @change="updateColor"
          v-if="controllerAttribute.isNeedCustomColor" />
      </div>
    </div>

    <!-- 其他功能，使用slot在各个地图组件中实现 -->

    <div>
      <slot name="other"></slot>
    </div>
  </div>
</template>

<script>
import FileUploader from "@/components/FileUploader.vue"
import DataStore from "@/store/DataStore"
import html2canvas from "html2canvas"
import dayjs from "dayjs"

export default {
  name: "MapController",
  components: { FileUploader },
  props: ["controllerAttribute"],
  data() {
    return {
      // 控制菜单是否缩放
      isShrink: false,

      /*
         以下两个功能用于控制用户能否开始渲染地图。
         默认情况下，isRenderAvailable和isRenderButtonDisabled都为false，即此时用户可以点击按钮，
      但是不能渲染地图。此时用户点击按钮将得到“请选择数据或者字段”的引导提示。
         而当用户从下拉框中选择了数据后，MapController开始从服务器请求数据，由于数据较大可能需要较长时间，
      此时isRenderButtonDisabled将被赋值为true，按钮被禁用，用户不能点击按钮。
         当MapController完成请求数据这一过程后，isRenderAvailable将赋值为true，isRenderButtonDisabled
      将赋值为false，此时用户即可以点击按钮开始渲染地图。
      */
      isRenderAvailable: false,
      isRenderButtonDisabled: false,

      // 服务器数据
      onlineDataList: [],
      selectedOnlineData: "",
      // 服务器shp
      onlineShpList: [],
      selectedOnlineShp: "",

      // 从本地上传的文件表头
      localDataHeaders: [],

      // FileUploader中的字段选项
      selectedField: {},

      // 要传递给MapContainer的数据
      mapAttribute: {
        // 声明地图类型，以调用不同的地图加载方法
        mapType: "",
        // 待渲染的数据
        renderData: [],
        // 数据是否为本地数据
        isLocalData: false,
        // 颜色选择器
        selectedColor: "rgba(46, 139, 87, 0.9)",
        // 样式选择器
        selectedStyle: {},
        // 待渲染的shp
        shpData: {},
      },
    }
  },
  watch: {
    selectedField: {
      handler() {
        const notMatchedField = this.controllerAttribute.fieldConfig.filter(
          (item) => {
            return this.selectedField[item.field] === undefined || ""
          }
        )

        if (notMatchedField.length > 0) {
          this.isRenderAvailable = false
        } else {
          this.isRenderAvailable = true
        }
      },
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    // 任何情况下都请求shp列表
    DataStore.commit("getOnlineShpList")
    this.onlineShpList = DataStore.state.onlineShpList.children
    // 按照requiredDataType请求对应的数据
    DataStore.commit(
      "getOnlineDataList",
      this.controllerAttribute.requiredDataType
    )
    this.onlineDataList = DataStore.state.onlineDataList.children
  },

  beforeDestroy() {
    DataStore.commit("resetOnlineDataList")
    DataStore.commit("resetOnlineShpList")
  },

  methods: {
    // region 加载数据

    handleOnlineDataLoad() {
      const message = this.$message({
        message: "正在从服务器请求数据",
        duration: 0,
      })

      this.isRenderButtonDisabled = true

      const StringMap = {
        point: "/taxiData/clickHot",
        trace: "/traceData/clickTrace",
        od: "/lineData/clickOD",
      }

      this.request
        .get(StringMap[this.controllerAttribute.requiredDataType], {
          params: {
            userId: JSON.parse(localStorage.getItem("user")).id,
            downSelectData: this.selectedOnlineData,
          },
        })
        .then((res) => {
          this.mapAttribute.renderData = res.data
          message.close()
          this.$message({
            message: "请求服务器数据成功",
            type: "success",
          })
          this.isRenderButtonDisabled = false
          this.isRenderAvailable = true
        })
    },

    handleLocalDataLoad(data) {
      // 置空已选择的字段
      this.selectedField = {}
      this.localDataHeaders = Object.keys(data[0])
      this.mapAttribute.renderData = data
    },

    handleDataRender(mapType) {
      if (!this.isRenderAvailable) {
        this.$message({
          message: "尚未选择数据或字段填写不完整",
          type: "error",
        })
      } else {
        this.mapAttribute.mapType = mapType
        this.updateData()
      }
    },

    // endregion

    // region 加载Shp

    handleOnlineShpLoad() {
      this.request
        .post(
          "/file/byid/" + JSON.parse(localStorage.getItem("user")).id,
          { downSelectData: this.selectedOnlineShp },
          { responseType: "blob" }
        )
        .then((res) => {
          this.handleShpRender(new Blob([res]))
        })
    },

    handleLocalShpLoad(localShp) {
      this.handleShpRender(localShp.raw)
    },

    handleShpRender(arrayBuffer) {
      // 此处将this复制给that是因为FileReader中的this将指向从VueComponent改变到FileReader实例
      const that = this
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(arrayBuffer)
      fileReader.onload = function () {
        const shapeFile = require("shapefile")
        shapeFile.read(this.result).then((shpData) => {
          that.mapAttribute.shpData = shpData
          that.updateShpData()
        })
      }
    },

    // endregion

    //  region 向MapContainer传递数据

    // 以下几个函数应按照需求在各个MapContainer中得到实现
    updateData() {
      this.$emit("updateData", this.mapAttribute)
    },
    updateColor() {
      this.$emit("updateColor", this.mapAttribute.selectedColor)
    },
    updateStyle() {
      this.$emit("updateStyle", this.mapAttribute.selectedStyle)
    },
    updateShpData() {
      this.$emit("updateShpData", this.mapAttribute.shpData)
    },
    clearShp() {
      //解决当点击移除shp后，下拉框的值没有清空的问题
      this.selectedOnlineShp = ""
      this.$emit("clearShp")
    },

    // endregion

    // region 截屏

    takeScreenshot() {
      // 获取需要截图的元素
      const MapContainer = this.$parent.$refs.MapContainer

      // 使用html2canvas进行截图
      html2canvas(MapContainer, {
        useCORS: true,
        scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
        allowTaint: true, // 允许跨域图片
      }).then((canvas) => {
        document.body.appendChild(canvas)
        const formattedDate = dayjs().format("YYYYMMDDHHmmss")

        // 创建一个Blob对象
        canvas.toBlob((blob) => {
          // 创建一个下载链接
          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          // 设置图片名称为用户输入的名称
          link.download = `${formattedDate}.png` // 下载的图片名称
          // 点击下载链接进行下载
          link.click()
        }, "image/png") // 指定图片格式为PNG
      })
    },

    // endregion
  },
}
</script>

<style scoped>
#menuLeft {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 360px;
  padding: 16px;
  z-index: 9;

  font-size: 20px;
  font-weight: 700;
  color: white;

  background-color: rgba(49, 51, 53, 0.7);
  background-image: url("@/assets/image/public_resource/mapCtrl_bgimg.png");
  background-size: 100% 100%;
  border-radius: 8px;

  transition: transform 0.5s ease;
  transform-origin: top left;
}

#menuLeft h5 {
  /* display: inline-block;
  white-space: nowrap; */
  height: 20px;
  /* width: 50%; */
  /* line-height: 100%; */
  line-height: 18px;
  margin: 4px 0px 4px 0px;

  padding: 6px 0px 6px 10px;
  background-image: url("@/assets/image/public_resource/btn_bgimg.png");
  background-size: auto 100%;
  background-repeat: no-repeat;
}
#menuLeft .load-data {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: space-between;
  gap: 6px 0px;
}
#menuLeft .load-data ::v-deep(.el-input__inner) {
  height: 30px !important;
}
#menuLeft .load-data .el-button {
  margin-left: 0px;
  margin-right: 4px;
}
#menuLeft .load-data div {
  display: flex;
  align-items: center;
}

#menuLeft .load-shp-content {
  display: flex;
  align-items: center;
}
/* elemenui的选择器与按钮对齐 */
#menuLeft .load-shp-content div {
  display: flex;
  align-items: center;
}
#minisize-btn {
  position: absolute;
  top: 12px;
  right: 12px;
}

#screenshot-btn {
  position: absolute;
  top: 12px;
  right: 48px;
}

#maxsize-btn {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 19;

  border-radius: 20px;
  background-color: black;
  opacity: 0.6;
  cursor: pointer;
  font-size: 200px;

  display: flex;
  justify-content: center;
  align-items: center;
}

#maxsize-btn i {
  opacity: 0;
  transition: opacity 0.2s ease;
}

#maxsize-btn:hover i {
  opacity: 1;
}

.shrink {
  transform: scale(0.2);
}

.el-cascader,
.el-select {
  width: 120px; /* 修改输入框宽度 */
  height: 30px;
}

.el-button {
  margin-left: 4px;
  height: 30px;
  vertical-align: center;
}
</style>
