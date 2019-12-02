<template>
  <div>
    <div class="reference-department-header">
      <span class="reference-department-title">廉政动态</span>
    </div>
    <div class="reference-module-table">
      <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true" class="preview-pdf">
        <p class="arrow" style="text-align: center">
          <!-- // 上一页 -->
          <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}" style="color: #ed0909;cursor: pointer; font-weight: bold">{{"<< &nbsp;&nbsp;"}}</span>
          <span style="color: #828386; font-weight: bold">{{currentPage}} / {{pdfPageCount}}</span>
          <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pdfPageCount}" style="color: #ed0909;cursor: pointer;  font-weight: bold">{{"&nbsp;&nbsp;&nbsp;>>"}}</span>
        </p>
        <pdf ref="pdf" :src="pdfUrl" style="width: 100%; height: 800px; overflow: scroll" :page="currentPage" @num-pages="pdfPageCount=$event" @page-loaded="currentPage=$event" @loaded="loadPdfHandler"></pdf>
      </el-dialog>


      <div class="reference-module-item-box" style="max-height: 540px; overflow: scroll">
        <div class="reference-module-item" v-for="(item_f1, index_f1) in moduleData" :key="index_f1" @click="showdetail(item_f1)">
          <div class="reference-module-item-img">
            <img class="avatar-img" :src="item_f1.img" />
          </div>

          <div class="reference-module-item-content">
            <div class="reference-module-item-content-box" style="margin-top: 5px">
              <span class="reference-module-item-content-title" >{{item_f1.title}}</span>
            </div>
            <div class="reference-module-item-content-box" style="margin-top: 15px">
              <span class="reference-module-item-content-desc">{{item_f1.content}}</span>
            </div>
            <div class="reference-module-item-content-box" style="margin-top: 15px">
              <span class="reference-module-item-content-desc">发布时间：{{item_f1.createdAt}}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <el-pagination
      class="pagination"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10,20,30]"
      :page-size="pageSize"
      :total="totalPage"
      style="text-align: center"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
  import baseUrl from "../../../utils/baseUrl";
  import pdf from 'vue-pdf'
    export default {
        components:{
            pdf:pdf
        },
        name: "refmodule",
        data(){
            return {
                moduleData: [],
                totalPage: 1,
                pageIndex: 1,
                pageSize: 10,
                pdfUrl: null,
                dialogFormVisible: false,
                currentPage: 0, // pdf文件页码
                pdfPageCount: 0, // pdf文件总页数
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                this.$api.get('dongtai/findList',{page: this.pageIndex, size: this.pageSize}, res=>{
                    let tempList = res.list;

                    for(let i=0; i<tempList.length; i++){
                        var item = tempList[i];
                        this.moduleData.push({id:item.lianzhengDongtaiId, img: baseUrl.fileUrl+"businessId="+item.lianzhengDongtaiId+"&moduleId=2", title: item.title, content: item.content, createdAt: item.createdAt, fileUrl: baseUrl.fileUrl + "businessId="+item.lianzhengDongtaiId+"&moduleId=1"});
                    }

                    this.currentTitle = this.titles[0];

                    this.dialogFormVisible = true;
                })
            },
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getData()
            },
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getData()
            },
            showdetail(item){
                this.dialogFormVisible = true;
                this.pdfUrl = pdf.createLoadingTask(item.fileUrl)
            },

            changePdfPage(val) {
                // console.log(val)
                if (val === 0 && this.currentPage > 1) {
                    this.currentPage--;
                    // console.log(this.currentPage)
                }
                if (val === 1 && this.currentPage < this.pdfPageCount) {
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

<style scoped>
  .reference-module-item{
    height: 100px;
    margin-top: 15px;
    width: 100%;
    overflow: hidden;
    cursor: pointer;
  }
  .reference-module-item-img{
    width: 18%;
    float: left;
  }
  .reference-module-item-content{
    width: 79%;
    float: right;
  }
  .avatar-img{
    width: 100%;
  }

  .reference-module-item-content-box{
    margin-left: 15px;
  }

  .reference-module-item-content-title{
    font-weight: bold;
    font-size: 16px;
    font-family: "Microsoft YaHei";
    color: #36373b;
  }

  .reference-module-item-content-desc{
    font-size: 14px;
    font-family: "Microsoft YaHei";
    color: #828386;
  }
</style>
