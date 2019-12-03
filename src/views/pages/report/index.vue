<template>
  <div>
    <div class="reference-department-header">
      <span class="reference-department-title">廉政报告</span>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true" class="preview-pdf">
      <p class="arrow" style="text-align: center">
        <!-- // 上一页 -->
        <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}" style="color: #ed0909;cursor: pointer; font-weight: bold">{{"<< &nbsp;&nbsp;"}}</span>
        <span style="color: #828386; font-weight: bold">{{currentPage}} / {{pageCount}}</span>
        <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}" style="color: #ed0909;cursor: pointer;  font-weight: bold">{{"&nbsp;&nbsp;&nbsp;>>"}}</span>
      </p>
      <pdf ref="pdf" :src="pdfUrl" style="width: 100%; height: 800px; overflow: scroll" :page="currentPage" @num-pages="pageCount=$event" @page-loaded="currentPage=$event" @loaded="loadPdfHandler"></pdf>
    </el-dialog>
    <div class="reference-module-table">
      <el-table :data="moduleData" class="table-wrap" style="width: 100%" max-height="520px">
        <el-table-column prop="order" label="报告编号" width="200px">
        </el-table-column>
        <el-table-column prop="reportTitle" label="模板名称" width="350px">
        </el-table-column>
        <el-table-column prop="createDate" label="上传时间" width="160px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="158">
          <template slot-scope="scope">
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="download(scope.row.reportId)"
            >下载</el-button>

            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="view(scope.row.reportId)"
            >查阅</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10,20,30]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
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
                pageCount: 0, // pdf文件总页数
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
              this.$api.get('report/list?type=0&page=1&size=10',null,res=>{
                  if(res.code != "0"){
                      this.$message("查询失败")
                      return
                  }

              this.moduleData=res.list;

                  var order = (this.pageIndex-1)*this.pageSize + 1;
                  for(var i=0; i<this.moduleData.length; i++){
                      this.moduleData[i].order = order;
                      order ++;
                  }

              this.pageIndex=res.pagebar.page;
              this.totalSize=res.pagebar.size;
              this.totalPage=res.pagebar.total;
            })
                // this.moduleData = [
                //     {id: 1, num: 1, moduleName: '模板1', uploadDate: '2010-1-1'}
                // ]
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
                var url = baseUrl.serverUrl+'/file/download?businessId='+id+'&moduleId=4';
                window.location.href = url;
            },
            view(id){
                //预览附件
                this.dialogFormVisible = true;
                console.log(baseUrl.serverUrl+'/file/preview?businessId='+id+'&moduleId=4');
                this.pdfUrl = pdf.createLoadingTask(baseUrl.serverUrl+'file/preview?businessId='+id+'&moduleId=4')
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

<style scoped>
  @import url("../../../assets/css/ref-dept.css");
</style>
