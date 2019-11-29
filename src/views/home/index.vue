<template>
  <div class="home">
    <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true" class="preview-pdf">
      <p class="arrow" style="cursor: pointer">
        <!-- // 上一页 -->
        <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">{{"<< "}}</span>
        {{currentPage}} / {{pageCount}}
        <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">{{" >>"}}</span>
      </p>
      <pdf ref="pdf" :src="pdfUrl" style="width: 100%; height: 800px; overflow: scroll" :page="currentPage" @num-pages="pageCount=$event" @page-loaded="currentPage=$event" @loaded="loadPdfHandler"></pdf>
    </el-dialog>
    <div class="left-panel">
      <div class="left-top-div">
        <div class="dongtai">
          <span class="title">廉政动态</span>
          <span class="left-more" style="cursor: pointer" @click="gotoPage('dongtai')">{{"更多>>"}}</span>
        </div>

        <div class="show-dongtai-info">
          <div class="main-img-panel" :style="'background-image: url('+photos[activePhoto]+');'" @click="previewDongtai">
            <div class="dongtai-title-div">
              <span class="dongtai-title">{{currentTitle}}</span>
            </div>

          </div>
          <div class="avatar-list">
            <div
              v-for="(photo, index) in photos"
              :src="photo"
              :key="index"
              @click="changePhoto(index)"
              :class="{'active': activePhoto == index}" :style="'width: 100%; height: 24%; background-image: url('+photo+'); background-size : cover; margin-top: '+(index== 0?'0':'3px')+''">
            </div>
          </div>
        </div>
      </div>

      <div class="left-bottom-div">
        <div class="lianzheng-reference">
          <div class="dongtai">
            <span class="title">廉政资料</span>
            <span class="left-bottom-more" @click="gotoPage('reference')">{{"更多>>"}}</span>
          </div>

          <div class="show-dongtai-info">
            <div class="reference-box" v-for="(item_f1, index_f1) in lzReferences" :key="index_f1" @click="lookReference(item_f1)">
              <span :class="item_f1.isRead?'readDot':'unReadDot'"></span>
              <h3 class="reference_title">
                {{ item_f1.title }}
              </h3>
            </div>
          </div>
        </div>

        <div class="reference-module">
          <div class="dongtai">
            <span class="title" >资料模板</span>
            <span class="left-bottom-more" @click="gotoPage('refmodule')">{{"更多>>"}}</span>
          </div>

          <div class="show-dongtai-info">
            <div class="reference-box download-reference" v-for="(item_f1, index_f1) in lzReferenceModules" :key="index_f1" @click="lookReference(item_f1)">
              <span class="readDot"></span>
              <h3 class="reference_title">
                {{ item_f1.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="right-panel" style="float: right">
      <div class="waiting-box">
        <div class="dongtai">
          <span class="title">待办&消息</span>
          <span class="ringt-more">{{"更多>>"}}</span>
        </div>

        <div class="right-panel-box">
          <div class="reference-box" v-for="(item_f1, index_f1) in lzWait2Do" :key="index_f1" @click="">
            <span class="waiting2DoReadDot"></span>
            <h3 class="reference_title reference-waiting-do-title">
              {{ item_f1.remarks }}
            </h3>
          </div>
        </div>
      </div>

      <div class="analysis-box">
        <div class="dongtai">
          <span class="title">廉政分析</span>
          <!--<span class="ringt-more" style="width: 74%">{{"更多>>"}}</span>-->
        </div>

        <div class="right-panel-box" @click="gotoPage('missing')">
          <div class="top-analysis">
            <div class="left-analysis">
              <span class="analysis-value">{{referenceMissingAmount}}</span><br/>
              <span class="analysis-title">廉政资料缺失项</span>
            </div>
            <div class="right-analysis">
              <span class="analysis-value">{{projectMissingAmount}}</span><br/>
              <span class="analysis-title">项目缺失项</span>
            </div>
          </div>
          <div class="bottom-analysis">
            <div class="left-analysis" style="margin-top: 15px">
              <span class="analysis-value">{{referencePer}}</span><br/>
              <span class="analysis-title">廉政资料完整度</span>
            </div>
            <div class="right-analysis" style="margin-top: 15px">
              <span class="analysis-value">{{projectPer}}</span><br/>
              <span class="analysis-title">项目健康度</span>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-box">
        <div class="dongtai">
          <span class="title">廉政信箱</span>
          <!--<span class="ringt-more" style="width: 74%">{{"更多>>"}}</span>-->
        </div>

        <div class="right-panel-box">
          <div class="tel-box">
            <span class="contact-title">电话</span>
            <span class="contact-value">023-63026020</span>
          </div>
          <div class="email-box">
            <span class="contact-title">邮件</span>
            <span class="contact-value">yugaojiandu@163.com</span>
          </div>
          <div class="addr-box">
            <span class="contact-title">地址</span>
            <span class="contact-value">重庆市两江新区金渝大道16号 监察审计部</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
    import $ from 'jquery';
    import baseUrl from "../../utils/baseUrl";
    import pdf from 'vue-pdf'

    export default {
        components:{
            pdf:pdf
        },
        name: "home",
        data(){
            return{
                photos:[
                ],
                activePhoto: 0,
                titles:[
                ],
                currentTitle: '',
                lzReferences: [],  // 廉政资料
                lzReferenceModules: [],  // 资料模板
                lzWait2Do: [],  //待办待阅
                referenceMissingAmount: 0,  // 资料缺失项
                projectMissingAmount: 0,  //项目缺失项
                referencePer: '0%',  //资料完整度
                projectPer: '0%',  //项目完整度
                pageDongtai: 'dongtai',
                dongtaiIds: [],
                pdfUrl: null,
                dialogFormVisible: false,
                currentPage: 0, // pdf文件页码
                pdfPageCount: 0, // pdf文件总页数
            }
        },
        mounted () {
            this.changePhoto(0)
            document.addEventListener("keydown", (event) => {
                if (event.which == 37)
                    this.previousPhoto()
                if (event.which == 39)
                    this.nextPhoto()
            })
            this.getDongtai()
            this.getReferences()
            this.getReferenceModule()
            this.getWait2Do()
            this.getAnalysis()
        },
        methods: {
            previewDongtai(){
                let currentId = this.dongtaiIds[this.activePhoto];
                console.log(currentId);

                this.dialogFormVisible = true;

                this.pdfUrl = pdf.createLoadingTask("http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf")
                //this.pdfUrl = "http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf";
            },
            changePhoto (index) {
                this.activePhoto = index;
                this.currentTitle = this.titles[index];
            },
            nextPhoto () {
                this.changePhoto( this.activePhoto+1 < this.photos.length ? this.activePhoto+1 : 0 )
            },
            previousPhoto () {
                this.changePhoto( this.activePhoto-1 >= 0 ? this.activePhoto-1 : this.photos.length-1 )
            },
            getDongtai(){
                this.$api.get('dongtai/findList',{page: 1, size: 4}, res=>{
                    this.photos = [];
                    this.titles = [];
                    this.dongtaiIds = [];
                    let tempList = res.list;

                    for(let i=0; i<tempList.length; i++){
                        var item = tempList[i];
                        this.photos.push(baseUrl.fileUrl+"businessId="+item.lianzhengDongtaiId+"&moduleId=2");
                        this.titles.push(item.title);
                        this.dongtaiIds.push(item.lianzhengDongtaiId);
                    }

                    this.currentTitle = this.titles[0];
                })
            },
            //廉政资料
            getReferences(){
              this.$api.get('reference/findList?type=0&page=1&size=5',null,res=>{
              this.lzReferences=res.list
            })
                // this.lzReferences = [
                //     {title:"廉政资料1", isRead: true},
                //     {title:"廉政资料2", isRead: false},
                //     {title:"廉政资料3", isRead: true},
                //     {title:"廉政资料4", isRead: false},
                //     {title:"廉政资料5", isRead: true}
                // ]
            },
            //资料模板
            getReferenceModule(){
                this.lzReferenceModules = [
                    {title:"资料模板1", isRead: true},
                    {title:"资料模板2", isRead: false},
                    {title:"资料模板3", isRead: true},
                    {title:"资料模板4", isRead: false},
                    {title:"资料模板5", isRead: true}
                ]
            },
            // 查看资料详情
            lookReference(reference){
                this.$router.push({
                    name: "reference",
                    params: {id: reference.lianzhengReferenceId, type: reference.type, title: reference.title, isEdit: 0}
                })
            },
            // 待办、待阅事项
            getWait2Do(){
                this.$api.get('undo/findList?page=1&size=4',null,res=>{
                this.lzWait2Do=res.list
              })
                // this.lzWait2Do = [
                //     {title:"待办事项1", isRead: true},
                //     {title:"待阅事项1", isRead: false},
                //     {title:"待办事项2", isRead: true},
                //     {title:"待阅事项2", isRead: false}
                // ]
            },
            // 廉政分析
            getAnalysis(){

            },

            gotoPage(name){
                if(name == 'refmodule'){
                    this.$router.push({
                        name: `${name}`,
                        params: {route: 'refmodule'}
                    })
                }
                else if(name == 'missing'){
                    this.$router.push({
                        name: "reference",
                        params: {route: 'missing'}
                    })
                }
                else{
                    this.$router.push({
                        name: `${name}`
                    })
                }
            },

            changePdfPage(val) {
                // console.log(val)
                if (val === 0 && this.currentPage > 1) {
                    this.currentPage--;
                    // console.log(this.currentPage)
                }
                if (val === 1 && this.currentPage < this.pageCount) {
                    this.currentPage++;
                    // console.log(this.currentPage)
                }
            },

            // pdf加载时
            loadPdfHandler(e) {
                this.currentPage = 1; // 加载的时候先加载第一页
            },
        }
    }
</script>

<style>
  @import url("../../assets/css/home.css");
</style>
