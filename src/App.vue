<template>
  <div id="app">
    <el-container>
      <el-header height="40px">
        <Header/>
      </el-header>
      <el-main style="padding: 0px;background: white">
        <router-view/>
      </el-main>
      <el-footer height="30px">
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  name: 'app',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
html, body, h1, h2, h3, h4, h5, h6, hr, p, dl, dt, dd, ul, ol, li, pre, button, input, textarea, th, td {
  margin: 0px;
  padding: 0px;
}

#app {
  /*height: 100vh;*/
}

.el-header, .el-footer {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 30px;
}

</style>
