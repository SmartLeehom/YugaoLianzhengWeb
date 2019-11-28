<template>
  <div class="reference">
    <div class="left-nav">
      <el-row class="tac" style="margin-top: -25px">
        <el-col :span="4">
          <el-menu
            default-active="dongtaiMgmt"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            text-color="#828386"
            active-text-color="#dd1519">
            <el-menu-item index="dongtaiMgmt" class="secNav selected">
              <span slot="title">廉政动态管理</span>
              <span style="float: right">{{">>"}}</span>
            </el-menu-item>
            <el-menu-item index="reportMgmt" class="secNav selected">
              <span slot="title">廉政报告管理</span>
              <span style="float: right">{{">>"}}</span>
            </el-menu-item>
            <el-menu-item index="userMgmt" class="secNav selected">
              <span slot="title">用户角色管理</span>
              <span style="float: right">{{">>"}}</span>
            </el-menu-item>
            <el-menu-item index="refmoduleMgmt" class="secNav selected">
              <span slot="title">资料模板管理</span>
              <span style="float: right">{{">>"}}</span>
            </el-menu-item>
          </el-menu>
        </el-col>

        <el-col :span="20">
          <el-container class="reference-page">
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
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
    export default {
        name: "mgmtcentral",
        data(){
            return {
                iframeUrl: 'dongtaiMgmt',
            }
        },
        mounted(){
            this.$router.push({
                name: this.iframeUrl
            })
        },
        methods:{
            handleSelect(key, keyPath) {
                this.iframeUrl = '';
                this.$router.push({
                    name: `${key}`
                })
            }
        }
    }
</script>

<style>
  @import url("../../../assets/css/reference.css");
</style>
