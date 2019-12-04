<template>
  <div>
    <div class="reference-department-header">
      <span class="reference-department-title">廉政资料 > 模板下载</span>
    </div>
    <div class="reference-module-table">
      <el-table :data="moduleData" class="table-wrap" style="width: 100%" max-height="540px">
        <el-table-column prop="order" label="报告编号" width="200px">
        </el-table-column>
        <el-table-column prop="moduleName" label="模板名称" width="280px">
        </el-table-column>
        <el-table-column prop="uploadDate" label="上传时间" width="160px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="158">
          <template slot-scope="scope">
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="preview(scope.row.fileUrl)"
            >查阅</el-button>
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="download(scope.row.id)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10,20,50,100]"
        :page-size="pageSize"
        :total="totalPage"
        style="text-align: center"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>

      <el-dialog :visible.sync="dialogPdfVisible" :append-to-body="true" :fullscreen="true" style="height: 100%">
        <div style="position: fixed; top: 60px; z-index:999; _position:absolute; _bottom:auto; width: 100%;">
          <p class="arrow" style=" text-align: center; width: 100%">
            <!-- // 上一页 -->
            <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}" style="color: #ed0909;cursor: pointer; font-weight: bold">{{"<< &nbsp;&nbsp;"}}</span>
            <span style="color: #828386; font-weight: bold">{{currentPage}} / {{pdfPageCount}}</span>
            <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pdfPageCount}" style="color: #ed0909;cursor: pointer;  font-weight: bold">{{"&nbsp;&nbsp;&nbsp;>>"}}</span>
          </p>
        </div>
        <div>
          <pdf ref="pdf" :src="pdfUrl" style="width: 100%;" :page="currentPage" @num-pages="pdfPageCount=$event" @page-loaded="currentPage=$event" @loaded="loadPdfHandler"></pdf>
        </div>


      </el-dialog>

    </div>
  </div>
</template>

<script>
    import pdf from 'vue-pdf'
    import baseUrl from "../../../utils/baseUrl";
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
                pdfPageCount: 0, // pdf文件总页数
                dialogPdfVisible: false,
                pdfUrl: '',
                currentPage: 0,
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                this.$api.get('file/list?status=1&moduleId=5&page='+this.pageIndex+'&size='+this.pageSize, null, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("查询数据失败")
                        return;
                    }

                    this.moduleData = [];
                    let order =(this.pageIndex-1)*this.pageSize + 1;

                    console.log(res.list.length);
                    for(let i=0; i<res.list.length; i++){
                        var fileUrl = baseUrl.localUrl + res.list[i].url;
                        console.log(fileUrl);
                        this.moduleData.push({fileUrl: fileUrl, id: res.list[i].lianzhengFileId, order: order, moduleName: res.list[i].remarks, uploadDate: res.list[i].updatedAt.split(' ')[0]})
                        order++;
                    }

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
            download(id){
                //下载附件
                var url = baseUrl.serverUrl+'/file/download?businessId='+id+'&moduleId=5';
                window.location.href = url;
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

            preview(fileUrl){
                this.dialogPdfVisible = true;

                this.pdfUrl = pdf.createLoadingTask(fileUrl)
            },
        }
    }
</script>

<style scoped>
@import url("../../../assets/css/ref-dept.css");
@import url("../../../assets/css/mgmt-central.css");
</style>
