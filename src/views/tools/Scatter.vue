<template>
  <div id="scatterMap">
    <MapController
      @updateData="updateData"
      @updateShpData="updateShpData"
      @clearShp="clearShp"
      :controllerAttribute="controllerAttribute"
      ref="MapController">
      <template v-slot:other>
        <!-- 左侧地图自定义样式 -->
        <h5>左侧地图样式</h5>
        <div id="colors-select">
          <el-select
            style="width: 100px"
            v-model="leftSelectedStyle"
            placeholder="地图样式"
            @change="updateLeftStyle">
            <el-option
              v-for="style in controllerAttribute.mapStyleList"
              :key="style.name"
              :label="style.name"
              :value="style"></el-option>
          </el-select>

          <!-- 点形状选择框插入到这里 -->
          <div
            style="
              display: flex;
              align-items: center;
              margin: 0 8px;
              width: 120px;
            ">
            <el-select
              v-model="leftSelectedShape"
              placeholder="点形状"
              @change="updateLeftShape">
              <el-option label="点形状:圆形" value="circle"></el-option>
              <el-option label="点形状:三角形" value="triangle"></el-option>
              <el-option label="点形状:矩形" value="rect"></el-option>
            </el-select>
          </div>
          <span style="font-size: 14px">点颜色:</span>
          <!-- 原 colorPicker 保持不变 -->
          <colorPicker
            style="margin-left: 4px"
            v-model="leftSelectedColor"
            @change="updateLeftColor"
            v-if="controllerAttribute.isNeedCustomColor" />
        </div>
        <h5>右侧地图样式</h5>
        <div id="colors-select">
          <el-select
            style="width: 100px"
            v-model="rightSelectedStyle"
            placeholder="地图样式"
            @change="updateRightStyle">
            <el-option
              v-for="style in controllerAttribute.mapStyleList"
              :key="style.name"
              :label="style.name"
              :value="style"></el-option>
          </el-select>

          <!-- 点形状选择框插入到这里 -->
          <div
            style="
              display: flex;
              align-items: center;
              margin: 0 8px;
              width: 120px;
            ">
            <el-select
              v-model="rightSelectedShape"
              placeholder="点形状"
              @change="updateRightShape">
              <el-option label="点形状:圆形" value="circle"></el-option>
              <el-option label="点形状:三角形" value="triangle"></el-option>
              <el-option label="点形状:矩形" value="rect"></el-option>
            </el-select>
          </div>
          <span style="font-size: 14px">点颜色:</span>
          <!-- 原 colorPicker 保持不变 -->
          <colorPicker
            style="margin-left: 4px"
            v-model="rightSelectedColor"
            @change="updateRightColor"
            v-if="controllerAttribute.isNeedCustomColor" />
        </div>
      </template>
    </MapController>

    <div ref="MapContainer" style="height: 100%; width: 100%">
      <div class="leftmap">
        <div
          ref="LeftMapContainer"
          id="map_container"
          style="height: 100%; width: 100%"></div>
      </div>
      <div class="middlemap"></div>
      <div class="rightmap">
        <div ref="RightMapContainer" id="partScatter"></div>
      </div>
    </div>
  </div>
</template>

<script>
import "echarts-gl"
import "echarts/extension/bmap/bmap"
import baiduMapStyle from "@/assets/js/baiduMapStyle/style"
import MapController from "@/components/MapController.vue"
import * as mapvgl from "mapvgl"

export default {
  name: "Scatter",
  components: { MapController },
  data() {
    return {
      controllerAttribute: {
        mapType: ["散点图"],
        isNeedShpLoader: true,
        isNeedCustomColor: true,
        requiredDataType: "point",
        fieldConfig: [
          { field: "lng", description: "经度" },
          { field: "lat", description: "纬度" },
        ],
        mapStyleList: [
          { name: "月光白", value: baiduMapStyle[0] },
          { name: "幽林绿", value: baiduMapStyle[1] },
          { name: "深海蓝", value: baiduMapStyle[2] },
          { name: "翠野绿", value: baiduMapStyle[3] },
          { name: "春芽青", value: baiduMapStyle[4] },
          { name: "沙漠黄", value: baiduMapStyle[5] },
        ],
      },
      leftSelectedStyle: baiduMapStyle[0], // 左侧地图默认样式
      leftSelectedColor: "rgba(46, 139, 87, 0.9)", // 左侧地图默认颜色

      rightSelectedStyle: baiduMapStyle[1],
      rightSelectedColor: "rgba(46, 139, 87, 0.9)",

      leftSelectedShape: "circle",
      rightSelectedShape: "circle",
    }
  },

  mounted() {
    this.initLeftmap()
    this.initRightMap()

    this.updateLeftStyle(this.leftSelectedStyle)
    this.updateLeftColor(this.leftSelectedColor)
  },

  methods: {
    initLeftmap() {
      this.leftMapInstance = new BMapGL.Map("map_container", {
        restrictCenter: false,
        style: baiduMapStyle[0],
        preserveDrawingBuffer: true,
      })
      this.leftMapInstance.enableKeyboard()
      this.leftMapInstance.enableScrollWheelZoom()
      this.leftMapInstance.enableInertialDragging()
      this.leftMapInstance.enableContinuousZoom()
      this.leftMapInstance.setDisplayOptions({
        indoor: false,
        poi: true,
        skyColors: ["rgba(5, 5, 30, 0.01)", "rgba(5, 5, 30, 1.0)"],
      })
      this.leftMapInstance.centerAndZoom(new BMapGL.Point(116.4, 39.95), 12)
      this.leftMapInstance.setTilt(0)
      this.leftMapInstance.setHeading(0)

      this.leftView = new mapvgl.View({
        map: this.leftMapInstance,
        preserveDrawingBuffer: true,
      })
    },

    initRightMap() {
      this.rightMapInstance = this.$echarts.init(this.$refs.RightMapContainer)
      this.rightMapInstance.setOption({
        bmap: {
          center: [116.4, 39.95],
          zoom: 12,
          roam: true,
        },
      })
      this.rightMapModel = this.rightMapInstance
        .getModel()
        .getComponent("bmap")
        .getBMap()
    },

    updateData(mapAttribute) {
      this.leftView.removeAllLayers()
      this.rightScatterData = []
      this.renderRightScatterMap()

      this.selectedLeftColor = mapAttribute.selectedColor
      this.selectedRightColor = mapAttribute.selectedColor
      this.handleRawScatterData(mapAttribute.renderData)
      this.$message({
        message: mapAttribute.mapType + "加载完成",
        type: "success",
      })
      this.$refs.MapController.$refs.FileUploader.closePopup()
    },

    handleRawScatterData(rawScatterData) {
      this.leftScatterData = rawScatterData.map((p) => ({
        geometry: {
          type: "Point",
          coordinates: [p.lng, p.lat],
        },
      }))
      this.rightScatterData = []
      for (let i = 1; i < rawScatterData.length; i++) {
        if (rawScatterData[i - 1].cid !== rawScatterData[i].cid) {
          this.rightScatterData.push([
            Number(rawScatterData[i - 1].lng) + 0.0125,
            Number(rawScatterData[i - 1].lat) + 0.007,
          ])
        }
      }
      this.renderLeftScatterMap()
      this.renderRightScatterMap()
    },

    renderLeftScatterMap() {
      this.leftView.addLayer(
        new mapvgl.PointLayer({
          blend: "lighter",
          shape: this.leftSelectedShape,
          color: this.selectedLeftColor,
          size: 3,
          data: this.leftScatterData,
        })
      )
    },

    renderRightScatterMap() {
      const option = {
        series: [
          {
            name: "散点图2",
            type: "scatterGL",
            coordinateSystem: "bmap",
            data: this.rightScatterData,
            symbol: this.rightSelectedShape,
            progressive: 1e6,
            progressiveThreshold: 100,
            symbolSize: 5,
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
            },
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: this.selectedRightColor,
              },
            },
            zlevel: 3,
          },
        ],
      }
      this.rightMapInstance.setOption(option)
    },

    updateShpData(shpData) {
      if (!this.shpLayer) {
        this.shpLayer = new BMapGL.FillLayer({
          crs: "GCJ02",
          autoSelect: true,
          border: true,
          style: {
            fillOpacity: 0.3,
            strokeWeight: 1,
            strokeColor: "blue",
          },
        })
      }
      this.shpLayer.setData(shpData)
      this.leftMapInstance.addNormalLayer(this.shpLayer)
    },

    clearShp() {
      this.leftMapInstance.removeNormalLayer(this.shpLayer)
    },

    updateLeftColor(selectedColor) {
      if (!this.leftScatterData || !this.leftScatterData.length) return
      this.selectedLeftColor = selectedColor
      this.leftView.removeAllLayers()
      this.renderLeftScatterMap()
    },

    updateRightColor(selectedColor) {
      const temp = this.rightScatterData
      this.rightScatterData = []
      this.renderRightScatterMap()
      this.rightScatterData = temp
      this.selectedRightColor = selectedColor
      this.renderRightScatterMap()
    },

    updateLeftStyle(mapStyle) {
      this.leftMapInstance.setMapStyleV2({ styleJson: mapStyle.value })
    },

    updateRightStyle(mapStyle) {
      this.rightMapModel.setMapStyle({ styleJson: mapStyle.value })
    },

    updateLeftShape(newShape) {
      this.leftSelectedShape = newShape
      this.leftView.removeAllLayers()
      this.renderLeftScatterMap()
    },

    updateRightShape(newShape) {
      const temp = this.rightScatterData
      this.rightScatterData = []
      this.renderRightScatterMap()
      this.rightScatterData = temp
      this.rightSelectedShape = newShape
      this.renderRightScatterMap()
    },
  },
}
</script>

<style scoped>
html,
body,
#scatterMap {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
}

.leftmap {
  height: 100%;
  float: left;
  width: 49%;
  margin: 0;
  padding: 0;
}

.middlemap {
  float: left;
  width: 0.1%;
  height: 100%;
  background-color: #113097;
}

.rightmap {
  height: 100%;
  float: left;
  width: 50.9%;
  margin: 0;
  padding: 0;
  background-color: #00ccff;
}

#partScatter {
  width: 100%;
  height: 100%;
}
#colors-select {
  display: flex;
  align-items: center;
}
</style>
