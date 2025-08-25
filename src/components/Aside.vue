<template>
  <el-menu
    :default-active="currentPage.index"
    class="el-menu-vertical-demo"
    :collapse="isAsideCollapse"
    background-color="transparent"
    text-color="#fff"
    active-text-color="#ffd04b"
    :unique-opened="true">
    <div id="title">
      <img src="@/assets/image/Home/logo.png" />
      <b v-show="!isAsideCollapse">交通大数据可视化</b>
    </div>

    <!-- 动态渲染菜单列表 -->
    <template v-for="menu in menus">
      <!-- 不含子菜单 -->
      <el-menu-item
        v-if="!menu.children"
        :index="menu.name"
        @click="clickMenu(menu.name)">
        <i :class="menu.icon" />
        <span slot="title">{{ menu.label }}</span>
      </el-menu-item>

      <!-- 含子菜单 -->
      <el-submenu v-else :index="menu.label">
        <span slot="title">
          <i :class="menu.icon" />
          {{ menu.label }}
        </span>

        <template v-for="subMenu in menu.children">
          <!-- 不含二级子菜单-->
          <el-menu-item
            v-if="!subMenu.children"
            :index="subMenu.name"
            @click="clickMenu(subMenu.name)">
            <i :class="subMenu.icon" />
            <span slot="title">{{ subMenu.label }}</span>
          </el-menu-item>
          <!-- 含二级子菜单 -->
          <el-submenu v-else :index="subMenu.label">
            <span slot="title">
              <i :class="subMenu.icon" />
              {{ subMenu.label }}
            </span>
            <el-menu-item
              v-for="subSubMenu in subMenu.children"
              :key="subSubMenu.name"
              :index="subSubMenu.name"
              @click="clickMenu(subSubMenu.name)">
              <span slot="title">{{ subSubMenu.label }}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
import NavigationStore from "@/store/NavigationStore"

export default {
  name: "Aside",
  props: ["isAsideCollapse"],
  data() {
    return {
      menus: NavigationStore.state.menus,
      currentPage: NavigationStore.state.currentPage,

      toolsTipContent: {
        scatter:
          "散点图是将所有的数据以点的形式展现在地图上,帮助我们从宏观的角度快速看出不同地理位置上数据的分布特征",
        hot: "热力图是使用不同的颜色表示车辆的密度，颜色越深表示车辆越密集。使用红色代表最高密度，蓝色或紫色代表最低密度",
        hightAccuracyHot:
          "高精热力图是使用不同的颜色表示车辆的密度，与普通热力图相比渲染效果更精细",
        grid: "网格图是将展示区域划分为100x100的网格，统计每个网格内的出租车数据数量，并对其进行展示，数量等级分为8个等级，将所输数据进行八等分，并以不同颜色进行展示",
        svector:
          "向量场是将车辆的运动方向和速度以向量的形式处理和投影计算，绘制流线完成向量场可视化模型，从而直观地反映出车辆的拥堵趋势、聚集状态等信息。",
        threeDimensional:
          "三维柱状图通过热力映射数据分布情况，颜色和高度体现出车辆密度。数量等级为5、10、20、30、40、50、80、100八个等级，分别用不同的颜色来表示。",
        aggregation:
          "聚合图将当前界面窗口60×60像素中的数据点的个数进行统计聚合，在每个单元格内显示颜色和数字，颜色深浅和数字代表对应单元格内数据的值大小。",
        taxiTrace:
          "三维轨迹图是根据车辆运行路线在地图上绘制出相应的三维路线图，同时定义状态的颜色赋给线路。",
        OD_Density_Cluster:
          "OD流飞线图用于表示地理空间数据之间移动量的可视化方式",
      },
    }
  },

  methods: {
    clickMenu(name) {
      this.$router.replace({
        name: name,
      })
    },
  },
}
</script>

<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu-vertical-demo {
  background-image: url("../assets/image/Home/zuo.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  /*rgba(40,140,234, 0.9))*/
  /*  background-image: url("../assets/image/Home/zuo90.png");*/
}

.el-menu {
  height: 100%;
  border: none;
  i {
    color: #00ccff;
    vertical-align: top;
  }
  span {
    font-size: 18px;
    font-weight: bold;
    i {
      margin-right: 0 !important;
      vertical-align: baseline !important;
    }
  }
  //修改子菜单的字体大小
  .el-submenu .el-menu {
    .el-menu-item span {
      font-size: 16px;
    }
  }
  .el-submenu__title {
    // span {
    //   font-size: 16px;
    // }
  }
  #title {
    height: 60px;
    line-height: 60px;
    text-align: center;

    img {
      width: 30px;
      position: relative;
      top: 9px;
      // margin-right: 4px;
    }

    b {
      color: white;
      font-size: 20px;
      font-weight: lighter;
      font-weight: bold;
    }
  }
}

.el-menu-item,
.el-menu-item.is-active,
.el-submenu .el-submenu__title {
  background-color: transparent !important;
}

::-webkit-scrollbar {
  width: 0 !important;
}

.menus {
  height: 56px;
  margin: 0;
  padding: 0;
}
</style>
