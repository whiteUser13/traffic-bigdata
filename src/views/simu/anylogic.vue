<template>
  <div id="simu-app">
    <div class="anylogic-page">
      <!-- Anylogic iframe -->
      <iframe
        class="anylogic-iframe"
        allow="fullscreen"
        src="https://cloud.anylogic.com/assets/embed?modelId=b7895833-9ecd-40bc-9786-055d37787b58"></iframe>

      <!-- 打开按钮 -->
      <el-button type="primary" @click="introDialogVisible = true">
        查看模拟实验介绍
      </el-button>

      <!-- 弹窗介绍 -->
      <el-dialog
        title="模拟实验介绍"
        :visible.sync="introDialogVisible"
        width="70%"
        custom-class="custom-dialog"
        :modal-append-to-body="false">
        <!-- 顶部框 -->
        <div class="intro">
          <h2>混合交通流模拟</h2>
          <div class="content">
            <p class="first-title">1. 模拟实验流程简介</p>
            <div>
              （1）收集并准备道路数据、人流数据和车流数据，确保数据来源可靠且格式正确。
              <br />
              （2）对道路数据进行预处理，包括道路拓扑结构、道路属性（车道数、限速等）清理与补全。
              <br />
              （3）对人流和车流数据进行时间序列整理和空间配准，确保与道路数据的地理坐标体系一致。
              <br />
              （4）将处理后的数据导入 Anylogic
              模型，并设置人车交互相关参数（行人步速、车辆速度、让行规则等）。
              <br />
              （5）配置模拟时长、时间步长和实验次数，运行人车交互仿真。
              <br />
              （6）输出并分析结果，包括行人延误时间、车辆通行效率、安全事件等指标。
            </div>

            <p class="first-title">2. 数据说明</p>

            <p class="second-title">1）道路数据</p>
            <div class="text-indent">
              必须为 SHP
              格式（Shapefile）的线状数据，包含道路中心线或车道信息；属性表中建议包含道路
              ID、道路等级、限速、车道数和方向等信息；坐标系统统一为
              WGS84；单个文件不超过 20MB。
            </div>

            <p class="second-title">2）红绿灯数据</p>
            <div class="text-indent">
              需要输入路口 ID、各相位时长及周期长度等信息，用于控制交通信号。
            </div>

            <p class="second-title">3）人流数据</p>
            <div class="text-indent">
              通过参数输入，包括行人起点位置、行人速率和初始人数；可指定行人在不同时间段的出行速率或数量，也可以设置不同起点和方向，实现多批次行人同时出行的模拟。
            </div>

            <p class="second-title">4）车流数据</p>
            <div class="text-indent">
              通过参数输入，包括车辆起点位置、车辆速率和初始化车辆数；可设置不同类型的车辆、不同起点以及不同的行驶速率，实现多路段、多类型车辆同时出行的模拟；还可以根据时间段调整车辆流量，以模拟早晚高峰或不同交通状况。
            </div>

            <p class="second-title">5）实验参数配置</p>

            <table
              border="1"
              class="md-table"
              style="
                width: 100%;
                border: 1px solid #dddddd;
                border-collapse: collapse;
                text-align: start;
                margin-top: 10px;
              ">
              <tbody>
                <tr>
                  <td
                    style="
                      background: rgba(9, 43, 67, 0.63);
                      text-align: center;
                      color: #fff;
                    ">
                    参数名称
                  </td>
                  <td
                    style="
                      background: rgba(9, 43, 67, 0.63);
                      text-align: center;
                      color: #fff;
                    ">
                    说明
                  </td>
                  <td
                    style="
                      background: rgba(9, 43, 67, 0.63);
                      text-align: center;
                      color: #fff;
                    ">
                    建议值
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center">模拟时长</td>
                  <td>整个实验运行的总时间</td>
                  <td style="text-align: center">3600秒（1小时）</td>
                </tr>
                <tr>
                  <td style="text-align: center">时间步长</td>
                  <td>仿真更新的最小时间间隔</td>
                  <td style="text-align: center">0.5秒</td>
                </tr>
                <tr>
                  <td style="text-align: center">行人平均步速</td>
                  <td>行人行走速度的平均值</td>
                  <td style="text-align: center">1.4 m/s</td>
                </tr>
                <tr>
                  <td style="text-align: center">车辆平均速度</td>
                  <td>车辆在道路上的平均行驶速度</td>
                  <td style="text-align: center">30 km/h</td>
                </tr>
                <tr>
                  <td style="text-align: center">让行规则</td>
                  <td>人车交互时的优先通行规则</td>
                  <td style="text-align: center">车辆让行行人</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 底部框 -->
        <div class="intro-end"></div>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="introDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "Anylogic",
  data() {
    return {
      introDialogVisible: false,
    }
  },
  methods: {
    downloadDemoIndex() {
      console.log("下载数据模板")
    },
  },
}
</script>

<style scoped>
.anylogic-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.anylogic-iframe {
  width: 100%;
  height: 80vh;
  border: none;
  margin-bottom: 20px;
}
.md-table tbody td {
  text-align: center;
}

/* intro 样式加框 */
.intro {
  background-image: url("../../assets/image/Home/kuang3.png");
  background-size: 100%;
  background-repeat: no-repeat;
  margin: 0 50px;
  padding: 0px 20px;
}
.intro h2 {
  text-indent: 1.2em;
  line-height: 10px;
  margin: 0;
  padding-left: 1%;
  font-size: 20px;
  color: #409eff;
}
.intro .content {
  padding-top: 20px;
}
.intro .first-title {
  margin: 8px 0;
  font-weight: bold;
}
.intro .second-title {
  margin: 0;
}
.text-indent {
  text-indent: 2em;
}
.intro-end {
  height: 58px;
  margin-left: 50px;
  margin-right: 49px;
  background-image: url("../../assets/image/Home/kuang3.png");
  background-position: 0px 58px;
  background-size: 100%;
}
</style>
