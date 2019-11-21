<template>
  <div class="layout">
    <el-container class="layout-container">
      <el-header class="layout-header">
        <div class="layout-header-top">
            <img :src="logo" alt class="logo"/>
            <span class="name">工程管理廉政风险防控信息化系统</span>
        </div>
      </el-header>

      <el-container class="layout-container">
        <el-main>
          <router-view v-if="true" />
          <iframe
            class="iframe"
            id="iframe"
            v-else
            :src="iframeUrl"
            alllowtransparency="true"
            frameborder="0"
          ></iframe>
        </el-main>
      </el-container>

      <el-footer>

      </el-footer>
    </el-container>
  </div>
</template>

<script>
    import { Container, Header, Footer, Aside, Main, Menu, MenuItem, MenuItemGroup, Submenu, Tooltip, Popover, Form, FormItem, CheckboxGroup, Checkbox, Input, Button, Dialog } from 'element-ui'
    import { mapState } from 'vuex'
    export default {
        name: 'layout',
        data() {
            return{
                iframeUrl: '',
                logo: require('../../assets/img/logo.png'),
            }
        },
        components: {
        },
        watch: {
        },
        mounted() {
        },
        methods: {
        },
    }
</script>

<style>
  @import url("../../assets/css/layout.css");
</style>

<style lang="less">
  .el-container {
    display: flex;
    flex-direction: column;
    height: 100%;

    & > .layout-container {
      flex: 1;
      overflow: hidden;
    }
  }
</style>


