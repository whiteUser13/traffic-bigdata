<template>
  <div id="simu-app">
    <MapController
      :controllerAttribute="controllerAttribute"
      ref="MapController">
      <template v-slot:other>
        <h5>上传自定义数据</h5>
        <div class="upload-custom-data">
          <el-upload
            ref="uploadPointShp"
            :multiple="true"
            :auto-upload="false"
            class="upload-point-shp"
            accept=".shp,.shx,.dbf,.prj,.sbn,.sbx,.cpg"
            action="javascript;"
            :headers="headers"
            :on-change="pointFileHandleChange"
            :on-remove="removePointFile"
            :file-list="pointFileList">
            <el-button slot="trigger" size="mini" type="primary">
              点状shp上传
            </el-button>
            <el-button
              style="margin-left: 5px"
              type="success"
              @click="submitPointShpUpload">
              上传
            </el-button>
          </el-upload>
          <div class="road-upload" style="margin-top: 4px">
            <el-upload
              ref="uploadRoad"
              :multiple="true"
              :auto-upload="false"
              class="upload-road-shp"
              accept=".shp,.shx,.dbf,.prj,.sbn,.sbx,.cpg"
              action="javascript;"
              :headers="headers"
              :on-change="polygonFileHandleChange"
              :on-remove="removePolygonFile"
              :file-list="polygonFileList">
              <el-button slot="trigger" size="mini" type="primary">
                面状shp上传
              </el-button>
              <el-button
                style="margin-left: 5px"
                type="success"
                @click="submitPolygonUpload">
                上传
              </el-button>
              <div
                slot="tip"
                class="el-upload__tip"
                style="color: white; margin-top: 2px; font-weight: 100">
                请上传.shp, .dbf, .shx , .cpg等必要文件，且不超过30MB
              </div>
            </el-upload>
          </div>
        </div>
        <h5>加载服务器数据</h5>
        <div class="loadServerData">
          <el-select
            style="margin-right: 4px"
            v-model="path.pointShp"
            :change="pointOptionsChange"
            placeholder="点状shp数据">
            <el-option
              v-for="item in pointFileOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-select
            style="margin-right: 4px"
            v-model="path.polygonShp"
            :change="polygonOptionsChange"
            placeholder="面状shp数据">
            <el-option
              v-for="item in polygonFileOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>

          <div class="simu-num">
            <span style="color: white; margin-right: 5px; font-size: 16px">
              模拟次数:
            </span>
            <el-input
              style="width: 80px"
              type="number"
              max="200"
              min="1"
              v-model="simuNum"
              placeholder=""></el-input>
          </div>

          <el-button
            type="primary"
            @click="generateSimuPath"
            style="margin-left: 4px">
            模拟
          </el-button>
          <el-button
            type="primary"
            @click="generateHeatmap"
            :disabled="!featureGeojson">
            热力图
          </el-button>
        </div>
        <h5>模拟实验介绍</h5>
        <el-button type="text" @click="introDialogVisible = true">
          点击查看模拟实验介绍
        </el-button>
        <!-- <h5>数据修改</h5>
        <el-button type="text" @click="indexDialogVisible = true">
          指标修改
        </el-button> -->
      </template>
    </MapController>

    <el-dialog
      title="模拟实验介绍"
      :visible.sync="introDialogVisible"
      width="70%">
      <div class="intro">
        <h2>模拟实验介绍</h2>
        <div class="content">
          <p class="first-title">1.流程简介</p>
          <div>
            1.计算出面状shp数据中每个面的19个指标值（计算公式见4）指标计算）。
            2.将计算好指标值添加到面状shp数据的属性表当中，确保每个面对应的指标值正确无误。
            3.点状shp数据要与面状shp数据保持区域一致。 4.上传点状和面状shp数据。
            5.选择已经上传的shp数据和模拟次数进行模拟。
            6.点击生成热力图可以查看行人热力图。
          </div>

          <p class="first-title">2.数据说明</p>
          <p class="second-title">1）面状shp数据</p>
          <div>
            必须为SHP格式（Shapefile）的面状数据,不接受点、线或其他格式（如GeoJSON、KML等）;
            可以是 街区边界、行政区划、地块范围
            等面状矢量数据;数据应包含完整的几何信息（.shp）和属性表（.dbf）;单个文件不超过10MB。
          </div>
          <p class="second-title">2）线状shp数据</p>
          <div>
            必须为SHP格式（Shapefile）的面状数据,不接受点、面或其他格式（如GeoJSON、KML等）;
            可以是 高速公路、国道、省道等
            等线状矢量数据;数据应包含完整的几何信息（.shp）和属性表（.dbf）;单个文件不超过10MB。
          </div>
          <p class="second-title">
            3）指标数据
            <el-button
              size="small"
              class="Button"
              type="primary"
              plain
              @click="downloadDemoIndex">
              下载面状shp属性数据模板
            </el-button>
          </p>
          <div>指标数据需要添加到面状shp数据的属性表当中</div>
          <table
            border="1"
            class="md-table"
            style="
              width: 100%;
              border: 1px solid gray;
              border-collapse: collapse;
              text-align: start;
              line-height: 1;
              margin-top: 10px;
            ">
            <tbody>
              <tr>
                <td style="text-align: center; vertical-align: middle">
                  <p style="line-height: 1">道路shp文件ID(id)</p>
                </td>
                <td style="text-align: center; vertical-align: middle">
                  <p style="line-height: 1">指标1(index_1)</p>
                </td>
                <td style="text-align: center; vertical-align: middle">
                  <p style="line-height: 1">指标2(index_2)</p>
                </td>
                <td style="text-align: center; vertical-align: middle">
                  <p style="line-height: 1">...</p>
                </td>
                <td style="text-align: center; vertical-align: middle">
                  <p style="line-height: 1">指标n(index_n)</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    1
                  </p>
                </td>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    指标值
                  </p>
                </td>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    指标值
                  </p>
                </td>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    指标值
                  </p>
                </td>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    指标值
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    2
                  </p>
                </td>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    指标值
                  </p>
                </td>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    指标值
                  </p>
                </td>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    指标值
                  </p>
                </td>
                <td>
                  <p
                    style="
                      text-align: center;
                      vertical-align: middle;
                      line-height: 1.5;
                    ">
                    指标值
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 8px; margin-bottom: 0">
            4）指标计算
            <el-button
              size="small"
              class="Button"
              type="primary"
              plain
              @click="downloadIndexFormula">
              下载指标计算说明
            </el-button>
          </p>
        </div>
      </div>
      <div class="intro-end"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="introDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="指标计算" :visible.sync="indexDialogVisible" width="70%">
      <div class="index-compute">
        <span>选择数据:</span>
        <el-select
          style="margin-right: 4px"
          v-model="alterFilePath"
          :change="polygonOptionsChange"
          placeholder="选择想要修改的数据">
          <el-option
            v-for="item in polygonFileOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-button
          type="primary"
          @click="readShpAttr"
          :disabled="!alterFilePath">
          读取
        </el-button>
        <!-- 表格 -->
        <table
          v-if="attrTable.columns.length"
          border="1"
          cellspacing="0"
          cellpadding="6">
          <thead>
            <tr>
              <th v-for="col in attrTable.columns" :key="col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in attrTable.rows" :key="idx">
              <td v-for="col in attrTable.columns" :key="col">
                {{ row[col] }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="index-select">
          <p>请选择各指标对应的属性名</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="indexDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <div ref="MapContainer" id="map">
      <div class="legend">
        <ColorLegend
          v-if="isLegendVisible"
          :rgbaColors="colors"
          :colorValues="colorValues"></ColorLegend>
      </div>
    </div>
  </div>
</template>

<script>
// 引入 axios
import axios from "axios"
import urls from "@/api/urls"
// import L from "leaflet"
import { L, baseLayers } from "../../components/simu/map"
import { gradientColor } from "../../utils/gradientColor"
import { shpFileCheck } from "../../utils/fileCheck"
import ColorLegend from "@/components/ColorLegend.vue"
import MapController from "@/components/MapController.vue"

export default {
  name: "SimuMock",
  components: { ColorLegend, MapController },
  data() {
    return {
      controllerAttribute: {
        mapType: ["模拟仿真"],
        isNeedShpLoader: true,
        isNeedCustomColor: false,
        isNeedCustomLoadData: true,
        // 控制MapController从服务器请求何种数据. 可填写 'point' 'trace' 'od'
        requiredDataType: "point",
        // 用于控制FileUploader界面需要哪些字段
        fieldConfig: [
          { field: "lng", description: "经度" },
          { field: "lat", description: "纬度" },
        ],
      },
      introDialogVisible: false,
      indexDialogVisible: false,
      alterFilePath: "", //选择修改的文件路径
      attrTable: {
        columns: [],
        rows: [],
        loading: false,
        error: null,
      },
      indexOptions: [
        {
          value: "建筑密",
          label: "建筑密度",
        },
        {
          value: "容积率",
          label: "容积率",
        },
        {
          value: "POI_shanno",
          label: "功能混合度",
        },
        {
          value: "POI密度",
          label: "POI密度",
        },
        {
          value: "richness_n",
          label: "土地利用多样性",
        },
        {
          value: "口袋公",
          label: "口袋公园比例",
        },
        {
          value: "影像绿",
          label: "平面绿化率",
        },
        {
          value: "绿视率",
          label: "绿视率",
        },
        {
          value: "天空开",
          label: "天空开阔度",
        },
        {
          value: "人行空",
          label: "步行连续度",
        },
        {
          value: "车行空",
          label: "土地利用多样性",
        },
        {
          value: "界面围",
          label: "界面围合度",
        },
        {
          value: "建筑物",
          label: "建筑连续性",
        },
        {
          value: "可达性",
          label: "公共空间可达性",
        },
        {
          value: "安全设",
          label: "安全设施占比",
        },
        {
          value: "integratio",
          label: "整合度",
        },
        {
          value: "选择度",
          label: "选择度",
        },
        {
          value: "地铁可达",
          label: "地铁可达性",
        },
        {
          value: "小径密度",
          label: "小径密度",
        },
      ],
      map: null,
      mapType: "高德地图",
      layerController: null,
      pathOverlyerGroup: null,
      personMarkerGroup: null,
      personIconOptions: {
        iconUrl: "/static/walk.png",
        iconSize: [20, 20],
      },
      headers: { "Access-Control-Allow-Origin": "*" },
      polygonFileList: [],
      pointFileList: [],

      allowedFormat: ["shp", "dbf", "shx", "prj", "sbn", "sbx", "cpg"],
      mustFormat: ["shp", "dbf", "shx", "cpg"],
      //shp文件上传到服务器上的路径
      path: {
        pointShp: "",
        polygonShp: "",
      },
      pointFileOptions: [],
      polygonFileOptions: [
        // {
        //   label: "test1.shp",
        //   value:
        //     "D:\\PostgraduateStudy\\trafficdata\\polygon_shp\\Export_Output.shp",
        // },
      ],

      featureGeojson: null,
      renderFeatureCollection: {
        type: "FeatureCollection",
        features: [],
      },
      currentPathIds: [], //当前模拟选取的所有id，不重复
      pathIds: [], //所有道路的id
      pathIdFrequency: [], //每条路径当前出现的频率

      simuNum: 20,
      colors: ["rgb(0,249,26)", "rgb(255,147,0)", "rgb(255,39,0)"],
      colorValues: [],
      isLegendVisible: false,
      startValue: 1,
      endValue: 10,

      //热力图
      heatDataList: [],
      heatmapOptions: {
        radius: 5,
        minOpacity: 0.8,
        gradient: {
          0.2: "#00f",
          0.3: "#0ff",
          0.5: "#0f0",
          0.7: "#ff0",
          1: "#f00",
        },
      },
      heatMapLayer: null,
    }
  },
  watch: {},
  created() {
    // 在组件创建时调用后端接口
    // 调用并接收返回值
    this.getShpFiles("point").then((data) => {
      console.log("函数返回的数据：", data)
      // 循环添加到 pointFileOptions
      data.forEach((item) => {
        this.pointFileOptions.push({
          value: item.path,
          label: item.file_name,
        })
      })
    })
    this.getShpFiles("polygon").then((data) => {
      console.log("函数返回的数据：", data)
      // 循环添加到 pointFileOptions
      data.forEach((item) => {
        this.polygonFileOptions.push({
          value: item.path,
          label: item.file_name,
        })
      })
    })
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.map = L.map("map", {
        // crs: L.CRS.EPSG4326,
        preferCanvas: true,
      }).setView([39.9, 116.4], 13)
      this.layerController = L.control
        .layers(baseLayers, {}, { position: "topright" })
        .addBaseLayer(
          L.layerGroup([
            L.tileLayer(
              "http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=eb6b544bedefd775ae5f50daea5def8d",
              { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
            ),
            L.tileLayer(
              "http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=eb6b544bedefd775ae5f50daea5def8d",
              { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
            ),
          ]).addTo(this.map),
          "天地图"
        )
        .addTo(this.map)
      this.pathOverlyerGroup = L.layerGroup().addTo(this.map)
      // this.personMarkerGroup = L.featureGroup().addTo(this.map)
      // this.layerController.addOverlay(this.personMarkerGroup, "行人")
      this.layerController.addOverlay(this.pathOverlyerGroup, "行人轨迹")
      this.map.eachLayer(function (layer) {
        console.log(layer)
      })
    },
    /*  输入速度，返回路程所需时间
     poi格式为[lat,lng]
     speed单位是m/s
    */
    averageSpeed(speed, startPoi, endPoi) {
      // 第一个点
      let latlng = L.latLng(startPoi[0], startPoi[1])
      // 第二个点
      let latlng2 = L.latLng(endPoi[0], endPoi[1])
      // 计算结果单位为米
      let distance = latlng.distanceTo(latlng2)
      let time = distance / speed
      return time
    },
    downloadDemoIndex() {
      window.location.href = "./static/dataTemplate/指标数据模板.xlsx"
    },
    downloadIndexFormula() {
      window.location.href = "./static/dataTemplate/指标计算.pdf"
    },
    pointFileHandleChange(file, list) {
      this.pointFileList.push(file)
    },
    removePointFile(file, fileList) {
      let index = this.pointFileList.findIndex(
        (existFile) => existFile.uid === file.uid
      )
      this.pointFileList.splice(index, 1)
    },
    async submitPointShpUpload() {
      console.log(this.$refs.uploadPointShp)

      if (!shpFileCheck.isSingleFile(this.pointFileList)) {
        this.$message.error("不能上传多个shp文件")
        return
      }
      //判断格式是否超出范围，是否包含必须的格式
      let suffix = shpFileCheck.fileSuffix(this.pointFileList)
      let isAllowedFormat = shpFileCheck.allowedFileFormat(
        this.allowedFormat,
        suffix,
        this.mustFormat
      )
      console.log(isAllowedFormat)
      //数据上传不合法
      if (!isAllowedFormat) {
        return
      }
      let formData = new FormData() //  用FormData存放上传文件
      this.pointFileList.forEach((file) => {
        formData.append("file", file.raw)
      })
      axios
        .post(urls.uploadPointShp, formData, {
          headers: {
            // "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            let response = res.data
            console.log(res.data)

            if (response.code === 200) {
              this.$message.success("操作成功")
              let uploadedFileName =
                this.pointFileList[0].name.split(".").shift() + ".shp"
              this.pointFileList.splice(0, this.pointFileList.length)
              // this.path.pointShp = response.shp_path
              this.pointFileOptions.push({
                label: uploadedFileName,
                value: response.shp_path,
              })
            } else {
              this.$message.error(response.msg)
            }
          } else {
            this.$message.error("网络错误")
          }
        })
        .catch((err) => {
          this.$message.error(err.response.data.error)
        })
    },
    getShpFiles(type) {
      return axios
        .get(urls.getShpFile, {
          params: {
            shpfileType: type,
          },
        })
        .then((res) => {
          return res.data.data // 依旧存到 data
        })
        .catch((err) => {
          console.error("接口请求出错：", err)
          return [] // 出错时返回空数组
        })
    },
    async readShpAttr() {
      if (!this.alterFilePath) {
        alert("请输入shp文件路径")
        return
      }
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(urls.readShpAttr, {
          params: { path: this.alterFilePath },
        })
        this.attrTable.columns = res.data.columns || []
        this.attrTable.rows = res.data.rows || []
        // this.attrTable.meta = {
        //   feature_count: res.data.feature_count,
        //   geometry_type: res.data.geometry_type,
        //   crs: res.data.crs,
        // }
      } catch (err) {
        this.attrTable.error = err.message || "请求失败"
      } finally {
        this.attrTable.loading = false
      }
    },
    polygonFileHandleChange(file, list) {
      this.polygonFileList.push(file)
    },
    removePolygonFile(file, fileList) {
      let index = this.polygonFileList.findIndex(
        (existFile) => existFile.uid === file.uid
      )
      this.polygonFileList.splice(index, 1)
    },

    async submitPolygonUpload() {
      if (!shpFileCheck.isSingleFile(this.polygonFileList)) {
        this.$message.error("不能上传多个shp文件")
        return
      }
      //判断格式是否超出范围，是否包含必须的格式
      let suffix = shpFileCheck.fileSuffix(this.polygonFileList)
      let isAllowedFormat = shpFileCheck.allowedFileFormat(
        this.allowedFormat,
        suffix,
        this.mustFormat
      )
      //数据上传不合法
      if (!isAllowedFormat) {
        return
      }
      let formData = new FormData() //  用FormData存放上传文件
      this.polygonFileList.forEach((file) => {
        formData.append("file", file.raw)
      })
      axios
        .post(urls.uploadPolygonShp, formData, {
          headers: {
            // "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            let response = res.data
            console.log(response)
            if (response.code === 200) {
              this.$message.success("操作成功")
              let uploadedFileName =
                this.polygonFileList[0].name.split(".").shift() + ".shp"
              this.polygonFileList.splice(0, this.polygonFileList.length)
              // this.path.polygonShp = response.shp_path
              this.polygonFileOptions.push({
                label: uploadedFileName,
                value: response.shp_path,
              })
            } else {
              this.$message.error(response.msg)
            }
          } else {
            this.$message.error("网络错误")
          }
        })
        .catch((err) => {
          this.$message.error(err.response.data.error)
        })
    },
    pointOptionsChange(item) {
      console.log(item)
    },
    polygonOptionsChange(item) {
      console.log(item)
    },
    generateSimuPath() {
      if (!(this.path.pointShp && this.path.polygonShp)) {
        this.$message.error("请上传或选择已上传的文件")
        return
      }
      this.map.eachLayer(function (layer) {
        console.log(layer)
        // this.map.removeLayer(layer)
      })
      const eventSource = new EventSource(
        urls.mock +
          "?pointPath=" +
          this.path.pointShp +
          "&polygonPath=" +
          this.path.polygonShp +
          "&simuNum=" +
          this.simuNum
      )
      this.endValue = Math.floor(this.simuNum / 2)
      this.isLegendVisible = true
      this.colorValues.splice(0, this.colorValues.length)
      this.colorValues.push(
        ...this.colorRange(this.startValue, this.endValue, this.colors)
      )

      // let colorArr = gradientColor("#2fe967", "#f94e4e", 10)
      // this.colors.push(...colorArr)
      eventSource.onmessage = function (e) {
        const data = JSON.parse(e.data)
        console.log(data)
        if (data.iteration == 1) {
          //获取geojson数据，所有路径的geojson数据只在第一次返回
          this.featureGeojson = JSON.parse(data.geojson)
          // let center = this.featureGeojson
          //清空之前存储的路径信息
          this.currentPathIds = []
          this.pathIds = []
          this.pathIdFrequency = []
          //存储所有id的信息
          this.featureGeojson.features.forEach((el) => {
            this.pathIds.push(el.Id)
            this.pathIdFrequency.push(0)
          })
        }
        this.$forceUpdate()
        //存储当前的路径id，去重
        data.pathArr.forEach((element) => {
          if (!this.currentPathIds.includes(element)) {
            this.currentPathIds.push(element)
            this.pathIdFrequency[this.pathIds.indexOf(element)] = 1
          } else {
            this.pathIdFrequency[this.pathIds.indexOf(element)] += 1
          }
        })

        this.renderFeatureCollection.features.splice(
          0,
          this.renderFeatureCollection.features.length
        )

        data.pathArr.forEach((id) => {
          let index = this.featureGeojson.features.findIndex(
            (element) => element.Id == id
          )
          let pathFrequency = this.pathIdFrequency[this.pathIds.indexOf(id)]
          //给feature添加color属性
          let color = this.getColorByFrequency(
            pathFrequency,
            this.colorValues,
            this.colors
          )
          this.featureGeojson.features[index].properties.color = color
          this.renderFeatureCollection.features.push([
            this.featureGeojson.features[index],
          ])
          let overlayer = L.geoJSON(this.featureGeojson.features[index], {
            style: function (feature) {
              return { color: feature.properties.color, weight: 5 }
            },
          }).addTo(this.map)
          this.pathOverlyerGroup.addLayer(overlayer)
        })

        console.log(data.pathline)

        let speed = 200
        let latlngs = data.pathline
        // let colorIndex = data.iteration - 1
        // if (colorIndex >= colorArr.length) {
        //   colorIndex = data.iteration % colorArr.length
        // }
        // let polyline = L
        //   .polyline(latlngs, { color: colorArr[colorIndex] })
        //   .addTo(this.map)
        // zoom the map to the polyline
        // this.map.fitBounds(polyline.getBounds())
        let personIcon = L.icon(this.personIconOptions)
        let marker = L.marker(latlngs[0], { icon: personIcon }).addTo(this.map)

        let currentIndex = 1
        let fx = new L.PosAnimation()
        let pos = this.map.latLngToLayerPoint(latlngs[currentIndex])
        let time = this.averageSpeed(
          speed,
          latlngs[currentIndex - 1],
          latlngs[currentIndex]
        )
        fx.run(marker._icon, pos, time, (0, 0, 0.73, 0.73))
        fx.on("end", () => {
          currentIndex += 1
          if (currentIndex == latlngs.length) {
            currentIndex = 1
            marker.setLatLng(latlngs[currentIndex - 1])
          }
          let pos = this.map.latLngToLayerPoint(latlngs[currentIndex])
          let time = this.averageSpeed(
            speed,
            latlngs[currentIndex - 1],
            latlngs[currentIndex]
          )
          fx.run(marker._icon, pos, time, (0, 0, 0.73, 0.73))
        })
        this.map.on("zoomstart", () => {
          fx.off()
          fx.stop() //stop会触发end事件，所以先把事件清楚
          marker.setLatLng(latlngs[currentIndex - 1])
        })
        this.map.on("zoomend", () => {
          let pos = this.map.latLngToLayerPoint(latlngs[currentIndex])
          let time = this.averageSpeed(
            speed,
            latlngs[currentIndex - 1],
            latlngs[currentIndex]
          )
          fx.run(marker._icon, pos, time, (0, 0, 0.73, 0.73))
          fx.on("end", () => {
            currentIndex += 1
            if (currentIndex == latlngs.length) {
              currentIndex = 1
              marker.setLatLng(latlngs[currentIndex - 1])
            }
            let pos = this.map.latLngToLayerPoint(latlngs[currentIndex])
            let time = this.averageSpeed(
              speed,
              latlngs[currentIndex - 1],
              latlngs[currentIndex]
            )
            fx.run(marker._icon, pos, time, (0, 0, 0.73, 0.73))
          })
        })
        // this.personMarkerGroup.addLayer(marker)
      }.bind(this)
      eventSource.onerror = function () {
        console.log("EventSource failed.")
        eventSource.close()
      }
    },
    colorRange(start, end, colorArr) {
      let interval = Math.floor((end - start + 1) / colorArr.length)
      let range = []
      for (let i = 0; i < colorArr.length; i++) {
        let val = start + interval * (i + 1)
        range.push(val)
      }
      return range
    },
    getColorByFrequency(frequency, range, colors) {
      //range为从小到大排序的数值数组
      let colorIndex = range.findIndex((el) => el >= frequency)
      if (colorIndex == -1) {
        return colors[colors.length - 1]
      }
      return colors[colorIndex]
    },
    generateHeatmap() {
      this.heatDataList.splice(0, this.heatDataList.length)
      if (this.heatMapLayer) {
        this.heatMapLayer.remove()
        this.layerController.removeLayer(this.heatMapLayer)
      }
      console.log(this.featureGeojson)
      if (!this.featureGeojson) return
      let maxFrequency = Math.max(...this.pathIdFrequency)
      this.featureGeojson.features.forEach((el) => {
        let frequency = this.pathIdFrequency[this.pathIds.indexOf(el.Id)]
        if (frequency == 0) {
          return
        } else {
          let valve = frequency / maxFrequency
          el.geometry.coordinates.forEach((lnglat) => {
            this.heatDataList.push([lnglat[1], lnglat[0], valve])
          })
        }
      })
      this.heatMapLayer = L.heatLayer(
        this.heatDataList,
        this.heatmapOptions
      ).addTo(this.map)
      this.layerController.addOverlay(this.heatMapLayer, "行人热力图")
    },
  },
}
</script>

<style lang="less" scoped>
#simu-app {
  position: relative;
  width: 100%;
  height: 100%;
  #map {
    height: 100%;
    width: 100%;
    .legend {
      position: absolute;
      right: 10px;
      bottom: 10px;
      z-index: 1000; //leaflet动画层为100
    }
  }

  .loadServerData {
    display: flex;
    flex-direction: row;

    // align-items: center;
    flex-wrap: wrap; /* 主轴方向溢出时换行 */
    justify-content: flex-start; /* 左对齐 */
    gap: 2px;
    .simu-num {
      display: flex;
      align-items: center;
      height: 30px;
      vertical-align: text-top;
    }
  }

  .intro {
    background-image: url("../../assets/image/Home/kuang3.png");
    background-size: 100%;
    background-repeat: no-repeat;
    margin: 0 50px;
    padding: 0px 20px;
    h2 {
      text-indent: 1.2em;
      line-height: 10px;
      color: #409eff;
      margin: 0;
      font-size: 20px;
    }
    .content {
      padding-top: 20px;
      .first-title {
        margin: 8px 0;
        font-weight: bold;
      }
      .second-title {
        margin: 8px 0;
      }
      div {
        text-indent: 2em;
      }
      math {
        margin: 8px 0;
      }
    }
  }
  .intro-end {
    height: 58px;
    margin-left: 50px;
    margin-right: 49px;

    background-image: url("../../assets/image/Home/kuang3.png");
    background-position: 0px 58px;
    background-size: 100%;
  }
}
</style>
