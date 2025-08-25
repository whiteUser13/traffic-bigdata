<template>
  <div>
    <div id="leftHeader">
      <i :class="asideCollapseButtonIcon" @click="changeAsideCollapse"></i>

      <el-breadcrumb id="first-breadcrumb" separator="/">
        <el-breadcrumb-item>
          <span>交通大数据可视化协同平台</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span>{{ currentPage.label }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div id="rightHeader">
      <el-dropdown style="float: right; cursor: pointer">
        <div>
          <img
            :src="user.avatar"
            alt=""
            style="
              width: 30px;
              border-radius: 150%;
              position: relative;
              top: 10px;
              right: 5px;
            " />
          <span style="margin-right: 5px; color: white">
            {{ user.nickname }}
          </span>
          <i class="el-icon-arrow-down" style="color: white"></i>
        </div>
        <el-dropdown-menu
          slot="dropdown"
          style="margin-right: 35px; width: 90px; text-align: center">
          <el-dropdown-item>
            <router-link to="/person">
              <span style="text-decoration: none">个人信息</span>
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="text-decoration: none" @click="handleUserLogout">
              退出
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import NavigationStore from "@/store/NavigationStore"

export default {
  name: "Header",
  props: ["asideCollapseButtonIcon", "user"],
  data() {
    return {}
  },
  methods: {
    handleUserLogout() {
      this.$router.push("/login")
      localStorage.removeItem("user")
      this.$message.success("退出成功")
    },

    changeAsideCollapse() {
      this.$emit("changeAsideCollapse")
    },
  },
  computed: {
    currentPage() {
      return NavigationStore.state.currentPage //需要监听的数据
    },
  },
}
</script>

<style lang="less" scoped>
#leftHeader {
  float: left;

  i {
    cursor: pointer;
    color: white;
    font-size: 20px;
  }

  #first-breadcrumb {
    display: inline-block;
    margin-left: 10px;

    span {
      font-size: 18px;
    }
  }

  .el-breadcrumb {
    span {
      color: white;
    }
  }
}
</style>
