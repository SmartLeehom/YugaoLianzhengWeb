<template>
  <div class="mgmt-central">
    <div class="reference-department-header">
      <span class="reference-department-title">{{"资料模板管理"}}</span>
      <el-button type="danger" style="float: right; margin-right: 100px" @click="dialogFormVisible=true">新增<i class="el-icon-plus el-icon--right"></i></el-button>
    </div>

    <div class="mgmt-central-dongtai-list-box" style="margin-top: 15px">
      <el-table :data="pageData" class="table-wrap" style="width: 100%" max-height="520px">
        <el-table-column prop="order" label="序号" width="100px">
        </el-table-column>
        <el-table-column prop="title" label="模板标题" width="300px">
        </el-table-column>
        <el-table-column prop="statusDesc" label="模板状态" width="140px">
        </el-table-column>
        <el-table-column prop="createdAt" label="生成时间" width="140px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewDetail(scope.row.fileUrl)">预览</el-button>
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="deleteDt(scope.row.id, scope.row.title)"
            >删除</el-button>
            <el-button
              class="del_danger"
              type="text"
              size="small"
              @click="publish(scope.row.id)"
              v-if="scope.row.status==0"
            >发布</el-button>
            <el-button
              class="del_danger"
              type="text"
              size="small"
              v-if="scope.row.status==1"
              @click="withdraw(scope.row.id)"
            >取消发布</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        style="text-align: center"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>

      <el-dialog title="廉政资料模板" :visible.sync="dialogFormVisible" :append-to-body="true" custom-class="mgmt-central-report-detail">
        <div>
          <span class="dialog-title" :v-model="title">模板标题</span>
          <el-input v-model="title" class="small-dialog-value" placeholder="请输入模板标题"></el-input>
        </div>

        <div class="dialog-row">
          <span class="dialog-title" style="float: left">关联附件</span>

          <el-upload
            accept=".pdf"
            ref="fileUpload"
            :before-remove="removeFile"
            :http-request="uploadFile"
            :headers="fileHeaders"
            class="upload-demo"
            action="#"
            :limit="1"
            :file-list="fileList">
            <el-button size="small" >点击上传</el-button>
            <div style="margin-left: 80px" slot="tip" class="el-upload__tip">只能上传一份pdf文件</div>
          </el-upload>
        </div>

        <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cancel()">取 消</el-button>
        <el-button type="danger" @click="save()">确 定</el-button>
      </span>
      </el-dialog>

      <el-dialog :visible.sync="dialogPdfVisible" :append-to-body="true" class="preview-pdf">
        <p class="arrow" style="text-align: center">
          <!-- // 上一页 -->
          <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}" style="color: #ed0909;cursor: pointer; font-weight: bold">{{"<< &nbsp;&nbsp;"}}</span>
          <span style="color: #828386; font-weight: bold">{{currentPage}} / {{pdfPageCount}}</span>
          <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pdfPageCount}" style="color: #ed0909;cursor: pointer;  font-weight: bold">{{"&nbsp;&nbsp;&nbsp;>>"}}</span>
        </p>
        <pdf ref="pdf" :src="pdfUrl" style="width: 100%; height: 800px; overflow: scroll" :page="currentPage" @num-pages="pdfPageCount=$event" @page-loaded="currentPage=$event" @loaded="loadPdfHandler"></pdf>
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
        name: "reportMgmt",
        data(){
            return {
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pageData: [],
                dialogFormVisible: false,
                fileList: [],
                title: '',
                moduleEntity: null,
                fileHeaders:{
                    "Content-Type":"multipart/form-data"
                },
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
                this.$api.get('file/list?moduleId=5&page='+this.pageIndex+'&size='+this.pageSize, null, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("查询数据失败")
                        return;
                    }

                    this.pageData = [];
                    let order =(this.pageIndex-1)*this.pageSize + 1;
                    for(let i=0; i<res.list.length; i++){
                        var fileUrl = baseUrl.localUrl + res.list[i].url;
                        this.pageData.push({fileUrl: fileUrl, id: res.list[i].lianzhengFileId, order: order, title: res.list[i].remarks, statusDesc: res.list[i].status.toString() == 1 ? "已发布" : "未发布", status: res.list[i].status, createdAt: res.list[i].createdAt.split(' ')[0]})
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
            deleteDt(id){
                this.$api.get('means/delete', {fileId: id}, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("操作失败");
                        return;
                    }

                    this.$message("操作成功");
                    this.getData();
                    return;
                })
            },
            publish(id){
                this.$api.get('means/publish', {fileId: id}, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("操作失败");
                        return;
                    }

                    this.$message("操作成功");
                    this.getData();
                    return;
                })
            },
            withdraw(id){
                this.$api.get('means/cancle', {fileId: id}, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("操作失败");
                        return;
                    }

                    this.$message("操作成功");
                    this.getData();
                    return;
                })
            },
            save(){
                if(!this.title || this.title.length<1){
                    this.$message('请输入标题');
                    return false;
                }
                if(this.fileList.length < 1){
                    this.$message('请上传资料模板附件');
                    return false;
                }

                let data = {};
                if(this.moduleEntity){
                    data = this.moduleEntity;
                    data.title = this.title;
                    data.fileId = data.lianzhengFileId;
                }
                else{
                    data.title = this.title;
                    data.fileId = this.fileList[0].lianzhengFileId;
                }

                console.log('开始保存数据')
                this.$api.get('means/save', data, res=>{
                    console.log('接口调用完成')
                    console.log(res);
                    if(res.code.toString() != '0'){
                        this.$message('保存失败');
                        return false;
                    }

                    this.$message('保存成功');
                    this.clear();
                    this.dialogFormVisible = false;

                    this.getData();
                });


            },
            cancel(){
                this.clear();
                this.dialogFormVisible = false;
            },
            clear(){
                this.moduleEntity = null;
                this.title = null;
                this.fileList = [];
            },
            //附件相关
            removeFile(file){
                this.$api.get('file/delete',{id: file.lianzhengFileId}, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("删除失败")
                        return false;
                    }

                    this.fileList = this.fileList.filter(item=>item.lianzhengFileId == file.lianzhengFileId);
                    this.$message("删除成功")
                    return true;
                })
            },
            uploadFile(data){
                let param = new FormData(); //创建form对象
                param.append('file',data.file);

                this.$api.post('means/upload',param, res=>{
                    console.log(res);
                    let filedata = res.data;
                    this.fileList = [];
                    this.fileList.push(filedata);

                    return false;
                })
            },
            viewDetail(fileUrl){
                this.dialogPdfVisible = true;

                this.pdfUrl = pdf.createLoadingTask(fileUrl)
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

<style>
  @import url("../../../assets/css/ref-dept.css");
  @import url("../../../assets/css/mgmt-central.css");
</style>
