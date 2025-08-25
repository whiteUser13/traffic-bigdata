<template>
  <div style="color: #666; font-size: 14px; padding: 15px; position: relative">
    <div class="jieshao">
      <h1
        style="font-size: 22px; padding-left: 55px; margin: 15px 10px 5px 0px">
        交通大数据可视化协同平台
      </h1>
      <span style="display: block; padding-left: 55px; padding-bottom: 8px">
        当前版本：v1.0.0（该平台在持续维护中，相关工具与搜索正在更新，感谢大家的支持）
      </span>
      <span style="display: inline-block; padding-left: 820px"></span>
      <span
        style="
          display: inline-block;
          color: #00ccff;
          background-color: #102e44;
          width: 520px;
          text-align: center;
        ">
        Transportation big data comprehensive visualization management platform
      </span>
      <div style="width: 93%; margin-left: 55px; margin-top: 30px">
        <p style="font-size: 16px">
          交通大数据可视化协同平台可以实现多模式交通出行轨迹大数据的入库管理，并基于多种风格地图兼具科学性和美观性的多种可视化效果展示分析。
          用户可以选择数据在用户本地，不上传服务器，直接使用“数据可视化”标签页下的功能即可，
          或者使用“数据空间”标签页下的功能，上传用户本地数据文件入服务器数据库后再进行可视化
          (数据在服务器的数据库中保留，方便下次直接调用)。
        </p>
      </div>
    </div>

    <div class="xiaoguo">
      <h1
        style="
          position: absolute;
          top: -25px;
          left: 60px;
          font-size: 22px;
          color: #ffffff;
        ">
        效果示例图
      </h1>
      <div @click="gotolinktaxiTrace" class="item taxinTrace">
        <div class="shuomingImg1"></div>
        <div class="shuoming">
          <b>三维轨迹图：</b>
          根据车辆运行路线在地图上绘制出相应的三维路线图，同时定义状态的颜色赋给线路。
        </div>
      </div>
      <div @click="gotolinkThreeDimensional" class="item ThreeDimensional">
        <div class="shuomingImg2"></div>
        <div class="shuoming">
          <b>三维柱状图：</b>
          通过热力映射数据分布情况，颜色和高度体现出车辆密度。数量等级八个等级，分别用不同的颜色来表示。
        </div>
      </div>
      <div @click="gotolinkScatterDiagram" class="item ScatterDiagram">
        <div class="shuomingImg3"></div>
        <div class="shuoming">
          <b>散点图：</b>
          将所有的数据以点的形式展现在地图上,帮助我们从宏观的角度快速看出不同地理位置上数据的分布特征。
        </div>
      </div>
      <div @click="gotolinkGrid" class="item Grid">
        <div class="shuomingImg4"></div>
        <div class="shuoming">
          <b>网格图：</b>
          将展示区域划分为100x100的网格，统计每个网格内的出租车数据数量，并对其进行展示，数量等级分为8个等级......。
        </div>
      </div>
      <div @click="gotolinkodLine" class="item odLine">
        <div class="shuomingImg5"></div>
        <div class="shuoming">
          <b>OD流飞线图：</b>
          是一种用于表示地理空间数据之间移动量的可视化方式......
        </div>
      </div>
      <div @click="gotolinkAggregation" class="item Aggregation">
        <div class="shuomingImg6"></div>
        <div class="shuoming">
          <b>聚合图：</b>
          将界面窗口中的数据点的个数进行统计，在每个单元格内显示颜色和数字......
        </div>
      </div>
      <div @click="gotolinkHot" class="item Hot">
        <div class="shuomingImg7"></div>
        <div class="shuoming">
          <b>热力图：</b>
          是使用不同的颜色表示车辆的密度，颜色越深表示车辆越密集。使用红色代表最高密度，蓝色或紫色代表最低密度
        </div>
      </div>
      <div @click="gotolinkSvector" class="item Svector">
        <div class="shuomingImg8"></div>
        <div class="shuoming">
          <b>向量场：</b>
          是将车辆的运动方向和速度以向量的形式处理和投影计算，绘制流线完成向量场可视化模型，从而反映出车辆的拥堵趋势、聚集状态
        </div>
      </div>
      <div @click="gotolinkHighAccuracyHot" class="item HighAccuracyHot">
        <div class="shuomingImg9"></div>
        <div class="shuoming">
          <b>高精热力图：</b>
          是使用不同的颜色表示车辆的密度，与普通热力图相比渲染效果更精细
        </div>
      </div>
    </div>

    <div class="md-container">
      <h1>数据上传操作方式：</h1>
      <!--    数据上传操作方式-->
      <p style="text-align: start; line-height: 2">1、文本数据上传</p>
      <p style="text-align: start; line-height: 2">
        支持格式为xlsx、csv、geojson，请上传有明确表头的，标准行列的一维表格数据，请勿上传带有合并单元格的数据，会出现数据读取失败。
      </p>
      <p style="text-align: start; line-height: 2">2、矢量数据上传</p>
      <p style="text-align: start; line-height: 2">
        支持格式为shp格式的面数据，文件大小不超过2M。
      </p>
      <p style="text-align: start; line-height: 2">3、表头读取</p>
      <p style="text-align: start; line-height: 2">
        系统默认读取数据中的第一行作为表头，为了在后续编辑中方便操作和识别，请正确命名表头，并在上传时选择对应的字段。
      </p>
      <p style="text-align: start; line-height: 2">4、数据格式</p>
      <!--点类型数据-->
      <p style="text-align: start; line-height: 2">
        1）轨迹点数据
        <el-button size="small" class="Button" @click="downloadDemoPoint">
          下载点数据模板
        </el-button>
      </p>
      <p style="text-align: start; line-height: 2">
        轨迹点数据格式为：[标识ID],[经度],[纬度]经纬度在不同的两列，示例数据如下：
      </p>
      <table
        border="1"
        class="md-table"
        style="
          width: 98%;
          border: 1px solid #dddddd;
          border-collapse: collapse;
          text-align: start;
          line-height: 1.5;
        ">
        <tbody>
          <tr>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">车辆ID(CID)</p>
            </td>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">经度(LNG)</p>
            </td>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">纬度(LAT)</p>
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
                5741276
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.244
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.8491
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
                5741277
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.304
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.9622
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
                5741278
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.244
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.8491
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
                …
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                …
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                …
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
                5741280
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.504
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                40.0094
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 轨迹线数据类型-->
      <p style="text-align: start; line-height: 2">
        2）轨迹线数据
        <el-button size="small" class="Button" @click="downloadDemoLine">
          下载轨迹线数据模板
        </el-button>
      </p>
      <p style="text-align: start; line-height: 2">
        轨迹线数据格式为：[时间戳],[载客状态],[经度],[纬度],轨迹点的经纬度在不同的两列，示例数据如下：
      </p>
      <table
        border="1"
        class="md-table"
        style="
          width: 98%;
          border: 1px solid #dddddd;
          border-collapse: collapse;
          text-align: start;
          line-height: 1.5;
        ">
        <tbody>
          <tr>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">Time</p>
            </td>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">Status</p>
            </td>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">经度(LNG)</p>
            </td>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">纬度(LAT)</p>
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
                346
              </p>
            </td>
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
                116.387
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.9497
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
                429
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                0
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.439
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.9499
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
                433
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                0
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.313
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.8951
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- OD线数据类型-->
      <p style="text-align: start; line-height: 2">
        3）OD线数据
        <el-button size="small" class="Button" @click="downloadDemoOD">
          下载OD线数据模板
        </el-button>
      </p>
      <p style="text-align: start; line-height: 2">
        OD线数据格式为：[起点经度],[起点纬度],[终点经度],[终点纬度],OD点的经纬度在不同的四列，示例数据如下：
      </p>
      <table
        border="1"
        class="md-table"
        style="
          width: 98%;
          border: 1px solid #dddddd;
          border-collapse: collapse;
          text-align: start;
          line-height: 1.5;
        ">
        <tbody>
          <tr>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">起点经度(oLNG)</p>
            </td>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">起点纬度(oLAT)</p>
            </td>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">终点经度(dLNG)</p>
            </td>
            <td
              style="
                background: rgba(9, 43, 67, 0.63);
                text-align: center;
                vertical-align: middle;
              ">
              <p style="line-height: 1.5">终点纬度(dLAT)</p>
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
                116.426
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.954
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.387
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.9497
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
                116.444
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.9089
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.439
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.9499
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
                116.357
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.8974
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.313
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.8951
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
                …
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                …
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                …
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                …
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
                116.456
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                39.9552
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                116.42
              </p>
            </td>
            <td>
              <p
                style="
                  text-align: center;
                  vertical-align: middle;
                  line-height: 1.5;
                ">
                40.0384
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <!--<p style="text-align:start;line-height:2">4）面类型数据</p>-->

      <!--<p style="text-align:start;line-height:2">-->
      <!--  面数据类型需要上传的格式为：Shp文件(坐标系为WGS84地理坐标系)</p>-->
      <p style="text-align: start; line-height: 2">5、数据量与文件大小</p>
      <p style="display: block; padding-bottom: 50px">
        单份数据文件，最多包含80万行数据，超过限制会导致数据上传失败。
      </p>
    </div>

    <el-dialog
      style="
        background-color: #ffffff00;
        box-shadow: 0 0px 0px rgb(0 0 0 / 30%);
      "
      :visible.sync="dialogVisible"
      width="70%">
      <div class="video">
        <video-player
          class="video-player-box"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"></video-player>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "video.js/dist/video-js.css"
import { videoPlayer } from "vue-video-player"

export default {
  name: "Home",
  components: {
    videoPlayer,
  },
  data() {
    return {
      dialogVisible: false,
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: true, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
    }
  },
  methods: {
    video(item) {
      this.dialogVisible = true
      this.playerOptions.sources[0].src = item.videoUrl
    },

    gotolinktaxiTrace() {
      this.$router.push("/taxi-trace")
    },

    gotolinkThreeDimensional() {
      this.$router.push("/three-dimension")
    },

    gotolinkScatterDiagram() {
      this.$router.push("/scatter")
    },

    gotolinkGrid() {
      this.$router.push("/grid")
    },

    gotolinkodLine() {
      this.$router.push("/OD-density-cluster")
    },

    gotolinkAggregation() {
      this.$router.push("/aggregation")
    },

    gotolinkHot() {
      this.$router.push("/hot")
    },

    gotolinkSvector() {
      this.$router.push("/svector")
    },

    gotolinkHighAccuracyHot() {
      this.$router.push("/high-accuracy-hot")
    },

    downloadDemoPoint() {
      window.location.href = "./static/dataTemplate/点数据模板.xlsx"
    },

    downloadDemoLine() {
      window.location.href = "./static/dataTemplate/轨迹线数据模板.xlsx"
    },

    downloadDemoOD() {
      window.location.href = "./static/dataTemplate/OD线数据模板.xlsx"
    },
  },
  created() {
    window.addEventListener(
      "mousewheel",
      function (event) {
        if (event.ctrlKey === true || event.metaKey) {
          event.preventDefault()
        }
      },
      { passive: false }
    )
  },
}
</script>

<style lang="less" scoped>
img {
  position: relative;
  left: 75%;
  transform: translateX(-50%);
}

.jieshao {
  margin-left: 28px;
  margin-top: 20px;
  width: 95%;
  height: 240px;
  background-image: url("../../assets/image/Home/kuang111.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #ffffff;
  overflow: auto;
}

.xiaoguo {
  position: relative;
  top: 40px;
  width: 95%;
  background-image: url("../../assets/image/Home/kuang2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-left: 28px;
  padding: 40px 100px;

  justify-content: center; /* 居中对齐 */
  gap: 30px; /* 元素之间的间距 */

  display: flex;
  flex-wrap: wrap;
  //justify-content: space-between;

  color: #333333;
}

.item {
  //flex: 1 1 calc(33.33% - 40px); /* 一行显示三个 */
  margin: 10px;
  box-sizing: border-box;
}

.item:hover {
  cursor: pointer;
}

.shuomingImg1,
.shuomingImg2,
.shuomingImg3,
.shuomingImg4,
.shuomingImg5,
.shuomingImg6,
.shuomingImg7,
.shuomingImg8,
.shuomingImg9 {
  width: 400px;
  height: 250px;
  margin-top: 20px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.shuomingImg1 {
  background-image: url("../../assets/image/Home/1taxiTrace.png");
}

.shuomingImg2 {
  background-image: url("../../assets/image/Home/2threeDimensional.png");
}

.shuomingImg3 {
  background-image: url("../../assets/image/Home/3scatterDiagram.png");
}

.shuomingImg4 {
  background-image: url("../../assets/image/Home/4grid.png");
}

.shuomingImg5 {
  background-image: url("../../assets/image/Home/5ODLine.png");
}

.shuomingImg6 {
  background-image: url("../../assets/image/Home/6aggregation.png");
}

.shuomingImg7 {
  background-image: url("../../assets/image/Home/7hot.png");
}

.shuomingImg8 {
  background-image: url("../../assets/image/Home/8svector.png");
}

.shuomingImg9 {
  background-image: url("../../assets/image/Home/9HIigh.png");
}

.shuoming {
  width: 400px;
  height: 70px;
  background-color: white;
}

.md-container {
  position: relative;
  top: 80px;
  left: 28px;
  width: 95%;
  background-image: url("../../assets/image/Home/kuang3.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #ffffff;
  padding-left: 50px;
}

.el-message-box {
  display: inline-block;
  padding-bottom: 10px;
  vertical-align: middle;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  font-size: 18px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  text-align: left;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
</style>
