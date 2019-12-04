<template>
  <div class="reference">
    <div class="left-nav">
      <el-row class="tac" style="margin-top: -25px">
        <el-col :span="4">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            text-color="#828386"
            active-text-color="#dd1519">
            <el-menu-item index="dept" :class="activeIndex=='dept'?'secNav selected':'secNav'">
              <span slot="title">集团与部门资料</span>
              <span style="float: right">{{">>"}}</span>
            </el-menu-item>
            <el-menu-item index="project" :class="activeIndex=='project'?'secNav selected':'secNav'">
              <span slot="title">工程项目资料</span>
              <span style="float: right">{{">>"}}</span>
            </el-menu-item>
            <el-menu-item index="missing" :class="activeIndex=='missing'?'secNav selected':'secNav'">
              <span slot="title">资料缺失分析</span>
              <span style="float: right">{{">>"}}</span>
            </el-menu-item>
            <el-menu-item index="refmodule" :class="activeIndex=='refmodule'?'secNav selected':'secNav'">
              <span slot="title">资料模板下载</span>
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
        name: "reference",
        data(){
            return {
                iframeUrl: 'dept',
                activeIndex: 'dept',
            }
        },
        watch(){
        },
        mounted(){
            if(this.$route.params.route){
                this.iframeUrl = this.$route.params.route
                this.activeIndex = this.$route.params.route
                this.$router.push({
                    name: this.$route.params.route
                })
            }
            else if(this.$route.params.id && this.$route.params.type){
                if(["1","2"].indexOf(this.$route.params.type.toString()) >= 0){
                    this.iframeUrl = 'dept'
                    this.activeIndex = 'dept'
                    this.$router.push({
                        name: 'refDeptDetail',
                        params:{id: this.$route.params.id, type: "集团与部门资料", title: this.$route.params.title, isEdit: this.$route.params.isEdit, returnBack:-2}
                    })
                }
                else{
                    this.iframeUrl = 'project'
                    this.activeIndex = 'project'
                    this.$router.push({
                        name: 'refProjDetail',
                        params:{id: this.$route.params.id, type: "工程项目资料", title: this.$route.params.title, isEdit: this.$route.params.isEdit, returnBack:-2}
                    })
                }
            }
            else{
                this.$router.push({
                    name: this.iframeUrl
                })
            }
        },
        methods:{
            handleSelect(key, keyPath) {
                this.iframeUrl = '';
                this.activeIndex = key;
                this.$router.push({
                    name: `${key}`
                })
            },
        }
    }
</script>

<style scoped>
  @import url("../../../assets/css/reference.css");
</style>
