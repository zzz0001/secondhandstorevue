<template>
  <div id="app">
    <el-container>
      <el-header height="40px" v-show="$route.meta.show">
        <Header/>
      </el-header>

      <el-main style="padding: 0px;background: white">
        <keep-alive v-if="getLogin">
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive || !getLogin"/>
      </el-main>

      <el-footer height="30px" v-show="$route.meta.show">
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
  },
  computed:{
    getLogin(){
      return this.$store.getters.getIsLogin
    }
  },
}
</script>

<style>
html, body, h1, h2, h3, h4, h5, h6, hr, p, dl, dt, dd, ul, ol, li, pre, button, input, textarea, th, td {
  margin: 0px;
  padding: 0px;
}

#app {
}

html {
  overflow-x: hidden;
  overflow-y: auto;
}
body {
  width: 100vw;
  overflow: hidden;
  padding-left: calc(100vw - 5);
}

.el-header, .el-footer {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 30px;
}
::-webkit-scrollbar {
  width: 5px; /*竖向*/
  height: 5px;/*横向*/
}

/*滚动条的滑块*/
::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 3px;
}
</style>
