<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  * {
    margin: 0;
    padding: 0;
  }
  html,
  #app {
    min-width: 1366px;
    // min-height: 700px;
    height: 100%;
    -ms-overflow-style: scrollbar;
    font-family: 'Microsoft YaHei', 'PingFangSC-Regular';
  }

  body {
    min-width: 1366px;
    height: 100%;
    // height: auto;
    // min-height: 100%;
    // min-height: 700px;
    // height: 100%;
    -ms-overflow-style: scrollbar;
  }
  /*自定义滚动条颜色*/
  ::-webkit-scrollbar {
    width: 0;
    height: 10px;
    background-color: transparent;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: transparent;
  }
  /*自定义滚动条颜色结束*/
  ::-webkit-scrollbar-corner {
    background-color: transparent;
  } /* 横向滚动条和纵向滚动条相交处尖角的颜色 */
</style>

