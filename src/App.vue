<template>
  <div id="app">
    <router-view/>
       <!-- 底部公司信息 -->
       <footer class="footer">
      <img :src="require('@/assets/image/logo.jpg')" class="footer-logo" />
      <span class="footer-text">版权所有 © 中慧图策（北京）科技有限公司</span>
    </footer>
  </div>
</template>

<script>

</script>

<style>
#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

footer.footer {
  margin-top: auto;
  background-color: #f1f1f1;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
}

.footer-logo {
  height: 20px;
  margin-right: 10px;
}

.footer-text {
  font-size: 14px;
}
</style>