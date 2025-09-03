<template>
  <div class="net-page">
    <h1 class="net-title">
      多网融合数据管理
      <span class="subtitle">
        ——多网融合是指将公共交通、市郊铁路和城市轨道交通等多种交通网络进行整合，实现高效协同的一体化交通网络。这一概念在现代化都市圈的发展中尤为重要，旨在提升交通投资质量，促进区域协同发展。
      </span>
      <el-button type="text" @click="introDialogVisible = true">
        点击查看模拟实验介绍
      </el-button>
    </h1>

    <el-dialog
      title="模拟实验介绍"
      :visible.sync="introDialogVisible"
      width="70%"
      custom-class="custom-dialog"
      :modal-append-to-body="false">
      <div class="intro">
        <h2 style="color: #409eff">模拟实验介绍</h2>
        <div class="content">
          <p class="first-title">1.流程简介</p>
          <div>
            （1）输入所需的数据源；
            <br />
            （2）选取“节点-区域-流动”模型；
            <br />
            （3）进行3个维度、6个类别、24个指标的计算；
            <br />
            （4）得到模型散点分析结果、模型类别分析结果、站点聚类数量和类别
          </div>

          <p class="first-title">
            2.数据说明
            <el-button
              size="small"
              class="Button"
              type="primary"
              plain
              @click="downloadSubwayDemoIndex">
              下载地铁站经纬度模板
            </el-button>
            <el-button
              size="small"
              class="Button"
              type="primary"
              plain
              @click="downloadClusterDemoIndex">
              下载地铁刷卡数据
            </el-button>
          </p>
          <p class="second-title">1）公交、地铁IC刷卡数据</p>
          <div class="text-indent">
            包含IC卡号、交通方式、线路、OD
            站点名称、经纬度、出发与到达时间等信息；单个文件不超过10MB。
          </div>
          <p class="second-title">2）POI兴趣点数据</p>
          <div class="text-indent">
            包含名称、坐标、类型等基础信息；单个文件不超过10MB。
          </div>
          <p class="second-title">3）建筑数据</p>
          <div class="text-indent">
            包含名称、坐标、类型等基础信息；单个文件不超过10MB。
          </div>

          <p class="first-title">3.模型构建</p>
          <div class="text-indent">
            （1）NP（Node-Place，节点-场所）模型
            常规的NP模型由荷兰阿姆斯特丹大学的卢卡·贝托里尼（Luca
            Bertolini）教授于1990年代提出。NP模型通过平面直角坐标系图加以呈现，Y轴表示节点性能（站点可达性），X轴表示场所性能（站点地区城市活动的强度和多样性）。依据节点-场所性能值的相对大小，NP模型用以评价站点的协同发展程度，并划分了五类站点类型：平衡型站点、压力型站点、从属型站点、失衡节点型站点和失衡场所型站点。通过调整节点-场所性能达到平衡状态，为站点和TOD路径的制定提供了理论支撑。
            <br />
            （2）NMD（Node-Mobility-District，节点-区域-流动）模型
            NP模型主要用于评估单个站点在单一网络中的平衡状态，其理论基础在于交通与土地利用的静态互动。然而，它对评估两网（轨道交通与地面公交）之间的动态融合绩效不足。我们基于国内外通用的NP模型指标，并结合北京城市交通发展建设规划和交通需求以及两网融合数据的可获取性，创新性地提出NMD模型。旨在构建一个能够响应政策导向和交通网络间的分析框架，以直接服务于两网融合这一具体的规划政策目标。
          </div>
          <p class="first-title">4.指标计算</p>
          <div>
            （1）对评价正负指标进行max-min标准化处理;
            <br />
            （2）进行K-means++聚类；
            <br />
            （3）介数中心性和邻近中心性的计算基于复杂网络分析，将地铁线路转换为网络结构；
            <br />
            （4）一体化研究范围功能混合度和一体化管控范围功能混合度通过站域内POI的混合度表达，采用香农熵计算；
            <br />
            （5）高峰系数和均衡系数根据高峰小时和平峰小时计算；
            <br />
            （6）基于层次分析法（AHP）的专家打分，对不同指标的重要性进行判断；
            <br />
            （7）基于主成分分析法（PCA）确定不同指标的权重，对评价指标进行优化；
            <br />
            （8）将每个指标与其对应的权重相乘，形成加权数据集。
          </div>
        </div>
      </div>
      <div class="intro-end"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="introDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <hr class="net-divider" />

    <!-- 四列布局 -->
    <div class="net-columns">
      <!-- 第一列：数据操作 -->
      <div class="net-column">
        <!-- <h2>数据上传</h2> -->
        <div style="display: flex; align-items: center; gap: 10px">
          <h2 style="margin: 0">数据上传</h2>

          <!-- 下拉框选择服务器的 Excel 文件 -->
          <select v-model="selectedFile" style="padding: 5px">
            <option disabled value="">服务器数据</option>
            <option v-for="file in serverFiles" :key="file" :value="file">
              {{ file }}
            </option>
          </select>

          <!-- 上传按钮 -->
          <button
            type="primary"
            @click="confirmUpload"
            style="
              padding: 5px 10px;
              background: #67c23a;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">
            确认上传
          </button>

          <!-- 移除按钮 -->
          <button
            @click="removeFile"
            style="
              padding: 5px 10px;
              background: #f44336;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">
            移除文件
          </button>
        </div>
        <!-- 四张图上传入口 -->
        <div class="upload-icons">
          <label
            class="upload-item"
            :class="{ active: activeUpload === '公交刷卡数据' }"
            @click="handleUploadClick('公交刷卡数据')">
            <img src="../../assets/image/Net/bus.png" alt="轨迹上传" />
            <div class="upload-text">公交刷卡数据</div>
            <span
              v-if="activeUpload === '公交刷卡数据'"
              class="close-btn"
              @click.stop="clearActive('upload')">
              ×
            </span>
          </label>

          <label
            class="upload-item"
            :class="{ active: activeUpload === '地铁刷卡数据' }"
            @click="handleUploadClick('地铁刷卡数据')">
            <img src="../../assets/image/Net/subway.png" alt="图2" />
            <div class="upload-text">地铁刷卡数据</div>
            <span
              v-if="activeUpload === '地铁刷卡数据'"
              class="close-btn"
              @click.stop="clearActive('upload')">
              ×
            </span>
          </label>

          <label
            class="upload-item"
            :class="{ active: activeUpload === 'POI数据' }"
            @click="handleUploadClick('POI数据')">
            <img src="../../assets/image/Net/POI.png" alt="图3" />
            <div class="upload-text">POI数据</div>
            <span
              v-if="activeUpload === 'POI数据'"
              class="close-btn"
              @click.stop="clearActive('upload')">
              ×
            </span>
          </label>

          <label
            class="upload-item"
            :class="{ active: activeUpload === '建筑面积数据' }"
            @click="handleUploadClick('建筑面积数据')">
            <img src="../../assets/image/Net/building.png" alt="图4" />
            <div class="upload-text">建筑面积数据</div>
            <span
              v-if="activeUpload === '建筑面积数据'"
              class="close-btn"
              @click.stop="clearActive('upload')">
              ×
            </span>
          </label>
        </div>
        <!-- 预览按钮 -->
        <el-button type="success" @click="previewFile" style="margin-top: 20px">
          预览已上传文件
        </el-button>

        <!-- 表格预览 -->
        <div
          v-if="previewData.length > 0"
          class="file-preview"
          style="color: white; position: relative">
          <!-- 关闭按钮 -->
          <span
            @click="closePreview"
            style="
              position: absolute;
              top: 5px;
              right: 15px;
              cursor: pointer;
              font-size: 22px;
              color: white;
              z-index: 10;
            ">
            ×
          </span>

          <h3>文件预览：{{ previewName }}</h3>
          <el-table
            :data="previewData"
            border
            height="400"
            style="width: 90%; margin-top: 10px"
            header-cell-style=" color: black; font-weight: bold;"
            cell-style=" color: black;">
            <el-table-column
              v-for="col in previewColumns"
              :key="col"
              :prop="col"
              :label="col"
              align="center" />
          </el-table>
        </div>

        <!-- 拖拽上传弹窗 -->
        <el-dialog
          title="上传文件"
          :visible.sync="uploadDialogVisible"
          width="30%">
          <div class="dialog-body">
            <p style="margin-bottom: 10px">
              当前上传类型：{{ currentUploadType }}
            </p>
            <el-upload
              class="upload-demo"
              drag
              :auto-upload="false"
              :on-change="handleFileChange"
              multiple
              accept=".xlsx,.csv,.geojson"
              ref="uploader">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                仅支持 .xlsx/.csv/.geojson 格式
              </div>
            </el-upload>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="uploadDialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="confirmUpload">
              确认上传
            </el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 第二列：模型 -->
      <h2>模型选择</h2>
      <div class="upload-icons">
        <label
          class="upload-item"
          :class="{ active: activeModel === 'NP-model' }"
          @click="handleModelClick('NP-model')">
          <img src="../../assets/image/Net/NP-model.png" alt="NP模型" />
          <div class="upload-text">NP模型散点图</div>
          <span
            v-if="activeModel === 'NP-model'"
            class="close-btn"
            @click.stop="clearActive('model')">
            ×
          </span>
        </label>

        <label
          class="upload-item"
          :class="{ active: activeModel === 'NMD-model' }"
          @click="handleModelClick('NMD-model')">
          <img src="../../assets/image/Net/NMD-model.png" alt="NMD模型" />
          <div class="upload-text">NMD模型聚类</div>
          <span
            v-if="activeModel === 'NMD-model'"
            class="close-btn"
            @click.stop="clearActive('model')">
            ×
          </span>
        </label>
      </div>

      <!-- 第三列：分析 -->
      <h2>分析</h2>
      <div class="upload-icons">
        <label
          class="upload-item"
          :class="{
            active: activeAnalysis === '模型散点分析',
            disabled: !isScatterEnabled /* 新增：不可用时加样式 */,
          }"
          @click="handleAnalysisClick('模型散点分析')">
          <img
            src="../../assets/image/Net/Model scatter analysis.png"
            alt="散点上传分析" />
          <div class="upload-text">模型散点分析</div>
          <span
            v-if="activeAnalysis === '模型散点分析'"
            class="close-btn"
            @click.stop="clearActive('analysis')">
            ×
          </span>
        </label>

        <label
          class="upload-item"
          :class="{
            active: activeAnalysis === '模型类别分析',
            disabled: !isCategoryEnabled,
          }"
          @click="handleAnalysisClick('模型类别分析')">
          <img
            src="../../assets/image/Net/Model category analysis.png"
            alt="类别上传分析" />
          <div class="upload-text">模型类别分析(聚类结果)</div>
          <span
            v-if="activeAnalysis === '模型类别分析'"
            class="close-btn"
            @click.stop="clearActive('analysis')">
            ×
          </span>
        </label>

        <label
          class="upload-item"
          :class="{
            active: activeAnalysis === '聚类数量与类别分析',
            disabled: !isClusterEnabled,
          }"
          @click="handleAnalysisClick('聚类数量与类别分析')">
          <img
            src="../../assets/image/Net/Cluster quantity and category analysis.png"
            alt="聚类上传分析" />
          <div class="upload-text">聚类数量与类别分析（碎石图）</div>
          <span
            v-if="activeAnalysis === '聚类数量与类别分析'"
            class="close-btn"
            @click.stop="clearActive('analysis')">
            ×
          </span>
        </label>
      </div>
      <!-- 下载按钮 -->
      <button
        @click="downloadImage"
        style="
          padding: 5px 10px;
          color: white;
          border: none;
          background-color: #67c23a;
          border-radius: 4px;
          cursor: pointer;
        ">
        下载图片
      </button>
      <!-- 显示可视化结果 -->
      <div v-if="visualizationUrl" style="margin-top: 20px">
        <img :src="visualizationUrl" style="max-width: 50%" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import urls from "@/api/neturls"

export default {
  data() {
    return {
      serverFiles: [], // 从后端获取的 Excel 文件列表
      selectedFile: "", // 当前选择的文件
      introDialogVisible: false,
      uploadDialogVisible: false,
      currentUploadType: "",
      file: null, // 上传的文件
      previewUrl: "", // 预览地址
      previewName: "", // 文件名
      previewData: [], // 预览的数据
      previewColumns: [], // 预览表头
      visualizationUrl: "", // 后端返回的图片路径
      selectedModel: null, // 当前选择的模型
      isScatterEnabled: false, // 控制是否启用“模型散点分析”按钮
      isCategoryEnabled: false, // 控制是否启用“模型类别分析”按钮
      isClusterEnabled: false, // 控制是否启用“聚类数量与类别分析”按钮
      // activeButton: "",  // 新增：当前高亮的按钮

      // ===== 新增：每个模块的“单选”高亮状态 =====
      activeUpload: "", // 新增：上传模块高亮
      activeModel: "", // 新增：模型模块高亮
      activeAnalysis: "", // 新增：分析模块高亮
    }
  },
  methods: {
    //下载示例文件
    downloadSubwayDemoIndex() {
      window.location.href = "./static/dataTemplate/地铁站经纬度.xlsx"
    },
    downloadClusterDemoIndex() {
      window.location.href = "./static/dataTemplate/8个指标数据汇总.csv"
    },
    //  =================加载服务器示例数据=================
    async fetchServerFiles() {
      const res = await fetch(urls.get_file)
      const data = await res.json()
      this.serverFiles = data.files
      this.selectedFile = ""
    },
    async removeFile() {
      if (!this.selectedFile) return
      await fetch(urls.remove_file + `filename=${this.selectedFile}`, {
        method: "DELETE",
      })
      this.fetchServerFiles() // 移除后刷新列表
    },

    // ================= 上传模块 =================
    // 新增：统一处理上传按钮点击（设置高亮 + 打开上传弹窗）
    handleUploadClick(name) {
      // 新增
      this.activeUpload = name // 上传模块单选高亮
      this.openUploadDialog(name) // 调原方法
    },
    // 新增：设置按钮高亮
    setActive(name) {
      this.activeButton = name
    },
    // 打开上传弹窗
    openUploadDialog(type) {
      this.currentUploadType = type
      this.uploadDialogVisible = true
    },

    // 文件选择
    handleFileChange(file) {
      this.file = file.raw
    },

    // 关闭表格
    closePreview() {
      this.previewData = []
      this.previewName = ""
    },

    //确认上传
    async confirmUpload() {
      try {
        if (this.file) {
          // 本地拖拽上传
          const formData = new FormData()
          formData.append("file", this.file)

          const response = await axios.post(urls.upload, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })

          this.$message.success(response.data.message || "上传成功！")
          this.previewName = response.data.filename
        } else if (this.selectedFile) {
          // 服务器已有文件
          const response = await axios.post(urls.server_file, {
            filename: this.selectedFile,
          })

          this.$message.success(response.data.message || "选择成功！")
          this.previewName = response.data.filename
        } else {
          this.$message.warning("请先选择文件！")
          return
        }

        this.uploadDialogVisible = false

        // 清空状态
        this.file = null
        if (this.$refs.uploader) {
          this.$refs.uploader.clearFiles()
        }
      } catch (error) {
        console.error(error)
        this.$message.error("操作失败！")
      }
    },
    //移除文件
    async removeFile() {
      if (!this.selectedFile) {
        this.$message.warning("当前没有选择文件！")
        return
      }
      // 只是清空前端选择，不删除后端文件
      this.selectedFile = ""
      this.$message.success("已取消选择文件，请重新选择！")
    },

    // 预览文件
    async previewFile() {
      if (!this.previewName) {
        this.$message.warning("请先上传文件！")
        return
      }

      try {
        const response = await axios.get(urls.preview + this.previewName)
        if (response.data.data) {
          this.previewData = response.data.data
          this.previewColumns = Object.keys(this.previewData[0] || {}) // 自动生成表头
          this.$message.success("预览成功！")
        } else {
          this.$message.error(response.data.message || "预览失败！")
        }
      } catch (error) {
        console.error(error)
        this.$message.error("预览失败！")
      }
    },

    // ================= 模型模块 =================
    // 新增：统一处理模型点击（设置高亮 + 启用状态）
    handleModelClick(model) {
      // 新增
      this.activeModel = model // 模块单选高亮
      this.handleModelSelect(model) // 调原方法
    },

    // 选择模型并启用相应的按钮
    handleModelSelect(model) {
      // 清空之前的可视化结果
      this.visualizationUrl = null

      this.selectedModel = model

      // 根据选择的模型启用按钮
      if (model === "NP-model") {
        this.isScatterEnabled = true
        this.isCategoryEnabled = false
        this.isClusterEnabled = false
      } else if (model === "NMD-model") {
        this.isScatterEnabled = true
        this.isCategoryEnabled = true
        this.isClusterEnabled = true
      }
    },

    // ================= 分析模块 =================
    // 新增：统一处理分析点击（先判断可用，再高亮与分析）
    handleAnalysisClick(name) {
      // 新增
      if (name === "模型散点分析" && !this.isScatterEnabled) {
        this.$message.warning("当前数据不支持分析！")
        return
      }
      if (name === "模型类别分析" && !this.isCategoryEnabled) {
        this.$message.warning("当前数据不支持分析！")
        return
      }
      if (name === "聚类数量与类别分析" && !this.isClusterEnabled) {
        this.$message.warning("当前数据不支持分析！")
        return
      }
      this.activeAnalysis = name // 模块单选高亮
      this.uploadAndAnalyze(name) // 调原方法
    },

    // 上传并分析
    uploadAndAnalyze(method) {
      if (!this.previewName) {
        this.$message.warning("请先上传文件！")
        return
      }

      const formData = new FormData()
      formData.append("filename", this.previewName) // 上传文件名

      // 根据选择的模型配置分析方法
      if (this.selectedModel === "NP-model") {
        if (method === "模型散点分析") {
          formData.append("method", "scatter") // 走 run_scatter
        } else {
          this.$message.warning("当前数据不支持分析！")
          return
        }
      } else if (this.selectedModel === "NMD-model") {
        if (method === "模型散点分析") {
          // formData.append("method", "scatter");
          formData.append("method", "category")
          formData.append("plot", "scatter")
        } else if (method === "模型类别分析") {
          formData.append("method", "category")
          formData.append("plot", "map")
        } else if (method === "聚类数量与类别分析") {
          formData.append("method", "category")
          formData.append("plot", "elbow")
        }
      }

      axios
        .post(urls.analyze, formData, {
          responseType: "blob",
        })
        .then((res) => {
          const url = URL.createObjectURL(res.data)
          this.visualizationUrl = url // 更新显示图片
        })
        .catch((err) => {
          console.error(err)
          this.$message.error("可视化失败！")
        })
    },
    // ================= 公共：取消高亮 =================
    clearActive(section) {
      // 新增
      if (section === "upload") {
        this.activeUpload = ""
      } else if (section === "model") {
        this.activeModel = ""
      } else if (section === "analysis") {
        this.activeAnalysis = ""
      }
      // 清空输出图片
      this.visualizationUrl = ""
    },
    //下载生成的图片
    downloadImage() {
      if (!this.visualizationUrl) {
        alert("没有生成图片!")
        return
      }
      // 创建隐藏的 <a> 标签进行下载
      const link = document.createElement("a")
      link.href = this.visualizationUrl
      link.download = "result.png" // 下载时的文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  },
  mounted() {
    this.fetchServerFiles()
  },
}
</script>

<style lang="less" scoped>
.upload-item.disabled {
  /* 新增：不可用按钮的视觉反馈 */
  opacity: 0.5;
  pointer-events: none; /* 不可点击 */
}
.close-btn {
  /* 新增：右上角 × */
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background: #ff4d4f;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 0 0 2px #fff;
}

:deep(.custom-dialog) {
  margin-top: 5vh !important;
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
    margin: 0;
    padding-left: 1%;
    font-size: 20px;
  }
  .content {
    padding-top: 20px;
    .first-title {
      margin: 8px 0;
      font-weight: bold;
    }
    .second-title {
      margin: 0;
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

/* 新增：按钮高亮样式 */
.upload-item.active {
  border: 2px solid #409eff; /* ElementUI 的主题蓝色 */
  border-radius: 8px;
  background-color: rgba(64, 158, 255, 0.1);
}

/* 表格整体背景透明 */
::v-deep(.el-table),
::v-deep(.el-table__expanded-cell) {
  background: transparent !important;
}
::v-deep(.el-table tr) {
  background: transparent !important;
}
/* 表头透明 + 白字 */
::v-deep(.el-table th) {
  background: transparent !important;
  color: white !important;
  font-weight: bold;
  font-size: 14px;
}

/* 表体透明 + 白字 */
::v-deep(.el-table td) {
  background: transparent !important;
  color: white !important;
}

.upload-icons {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.upload-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 140px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 6px;
  transition: transform 0.2s ease;
}

.upload-item:hover {
  transform: scale(1.05);
}

.upload-item img {
  width: 140px;
  height: 110px;
  object-fit: contain;
}

.upload-text {
  color: white;
  font-size: 14px;
  text-align: center;
}

.hidden-file-input {
  display: none;
}

.net-title {
  color: white;
}
/* 保持原有样式基础上新增 */
.section {
  margin-bottom: 20px;
}

.search-input {
  width: 180px;
  padding: 8px;
  margin-right: 8px;
  border: 1px solid #666;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.action-btn {
  padding: 8px 16px;
  background: #409eff;
  border: none;
  color: white;
  cursor: pointer;
  margin: 4px 0;
}

.file-input {
  margin: 10px 0;
}

.file-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  margin: 8px 0;
  border-radius: 4px;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 18px;
  cursor: pointer;
}

.mapping-row {
  margin: 6px 0;
}

.field-select {
  width: 100%;
  padding: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid #666;
}

.page-btn {
  background: none;
  border: 1px solid #666;
  color: white;
  padding: 4px 8px;
  margin: 0 2px;
}

.page-btn.active {
  background: #409eff;
  border-color: #409eff;
}

.data-actions {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.net-page h2 {
  font-size: 20px;
  margin-bottom: 12px;
  color: white;
}

.dialog-body {
  text-align: center;
  padding: 10px;
}

.net-column h2 {
  font-size: 20px;
  margin-bottom: 12px;
  color: white !important;
}
</style>
