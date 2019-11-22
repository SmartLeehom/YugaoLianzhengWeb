<template>
  <div class="layout">
    <el-container class="layout-container" direction="vertical">
      <el-header class="layout-header" style="height: 280px">
        <div class="layout-header-top">
            <img :src="logo" alt class="logo"/>
            <span class="title">工程管理廉政风险防控信息化系统</span>
        </div>

        <div class="layout-header-menu">
          <el-menu :default-active="activeIndex" class="top-menu" mode="horizontal" @select="handleSelect" text-color="#ed0909" active-text-color="#ed0909"  background-color="rgba(0,0,0,0)">
            <el-menu-item index="home" :class="activeIndex=='home'?'top-menu-item selected':'top-menu-item'">首页</el-menu-item>
            <el-menu-item index="reference" :class="activeIndex=='reference'?'top-menu-item selected':'top-menu-item'">廉政资料</el-menu-item>
            <el-menu-item index="management" :class="activeIndex=='management'?'top-menu-item selected':'top-menu-item'">项目监管</el-menu-item>
            <el-menu-item index="report" :class="activeIndex=='report'?'top-menu-item selected':'top-menu-item'">廉政报告</el-menu-item>
          </el-menu>

          <el-popover
            v-model="logoutPopover"
            popper-class="header-popover"
            placement="bottom"
            width="250"
            trigger="hover"
          >
            <ul class="operate-list">
              <li @click="dialogFormPwd=true">修改密码</li>
              <li @click="">登出</li>
            </ul>
            <div class="name" slot="reference">
              <img :src="userLogo" class="userlogo">
              <span class="username">{{userName}}</span>
              <i
                v-if="!logoutPopover"
                class="arrow el-icon-arrow-down"
              ></i>
              <i v-else class="arrow el-icon-arrow-up"></i>
            </div>
          </el-popover>
        </div>
      </el-header>

      <el-container class="mainpage">
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
    </el-container>
  </div>
</template>

<script>
    import { Container, Header, Aside, Main, Menu, MenuItem, MenuItemGroup, Submenu, Tooltip, Popover, Form, FormItem, CheckboxGroup, Checkbox, Input, Button, Dialog } from 'element-ui'
    import { mapState } from 'vuex'
    export default {
        name: 'layout',
        data() {
            return{
                iframeUrl: '',
                logo: require('../../assets/img/logo.png'),
                userLogo: require('../../assets/img/userlogo.jpg'),
                activeIndex: 'home',
                userName: "用户名",
                logoutPopover: false,
            }
        },
        components: {
        },
        watch: {
        },
        mounted() {
        },
        methods: {
            handleSelect(key, keyPath) {
                this.activeIndex = key;

                this.iframeUrl = ''
                this.$router.push({
                    name: `${key}`
                })
            }
        }
    }
</script>

<style>
  @import url("../../assets/css/layout.css");


</style>

<style lang="less">
  .name {
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-right: 750px;
    width: 150px;

    .arrow {
      margin-left: 6px;
    }
  }

  .header-popover {
    padding-left: 0;
    padding-right: 0;
    & > ul {
      list-style-type: none;
      & > li {
        text-align: left;
        line-height: 40px;
        padding: 0 10px;
        cursor: pointer;
        &:hover {
          color: #fff;
          background-color: #a1ccf9;
        }
      }
      .selected-children-menu{
        color: #fff;
        background:#69A9ED;
        box-shadow:0px 4px 8px 0px rgba(105,169,237,0.55);
      }
    }
  }


</style>


