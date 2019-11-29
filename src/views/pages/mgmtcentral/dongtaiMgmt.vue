<template>
  <div class="mgmt-central">
    <div class="reference-department-header">
      <span class="reference-department-title">{{"廉政动态管理"}}</span>
      <el-button type="danger" style="float: right; margin-right: 100px" @click="dialogFormVisible = true">新增<i class="el-icon-plus el-icon--right"></i></el-button>
    </div>

    <div class="mgmt-central-remarks-box">
      <span class="mgmt-central-remarks">{{"前4篇廉政动态文章展示在首页"}}</span>
    </div>

    <div class="mgmt-central-dongtai-list-box">
      <el-table :data="pageData" class="table-wrap" style="width: 100%" max-height="460px">
        <el-table-column prop="order" label="序号" width="100px">
        </el-table-column>
        <el-table-column prop="title" label="文章标题" width="300px">
        </el-table-column>
        <el-table-column prop="statusDesc" label="文章状态" width="140px">
        </el-table-column>
        <el-table-column prop="createdAt" label="上传时间" width="140px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewDetail(scope.row.id)">预览</el-button>
            <el-button
              class="del_danger"
              type="text"
              size="small"
              @click="edit(scope.row.id)"
              v-if="scope.row.status==0"
            >编辑</el-button>
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

    </div>

    <el-dialog title="廉政动态" :visible.sync="dialogFormVisible" :append-to-body="true" :before-close="closeDialog" custom-class="mgmt-central-dongtai-detail">
      <div>
        <span class="dialog-title">文章标题</span>
        <el-input v-model="dongtaiTitle" class="dialog-value" placeholder="请输入文章标题"></el-input>
      </div>
      <div class="dialog-row">
        <span class="dialog-title" style="vertical-align: top">内容简介</span>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          :resize="constNone"
          rows="4"
          v-model="dongtaiContent"
          class="dialog-value">
        </el-input>
      </div>
      <div class="dialog-row">
        <span class="dialog-title" style="float: left">封面图片</span>

        <el-upload
          :headers="fileHeaders"
          accept="image/*"
          action="#"
          list-type="picture-card"
          :file-list="imgList"
          ref="imgUpload"
          :limit="1"
          :http-request="uploadFile">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url" alt=""
            >
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>

              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog width="25%" :visible.sync="dialogImgVisible" :append-to-body="true">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>

      <div class="dialog-row">
        <span class="dialog-title" style="float: left">关联附件</span>

        <el-upload
          :before-remove="removeFile"
          ref="fileUpload"
          :headers="fileHeaders"
          accept=".pdf"
          class="upload-demo"
          :with-credentials="true"
          action="#"
          :limit="1"
          :http-request="uploadFile"
          :file-list="fileList">
          <el-button size="small" >点击上传</el-button>
          <div style="margin-left: 80px" slot="tip" class="el-upload__tip">只能上传一份pdf文件</div>
        </el-upload>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="closeDialog">取 消</el-button>
        <el-button type="danger" @click="addOrUpdateDongtai()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "dongtaiMgmt",
        data(){
            return {
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pageData: [],
                dialogFormVisible: false,
                dongtaiTitle: '',
                constNone: 'none',
                dongtaiContent: '',
                dialogImgVisible: false,
                dialogImageUrl: '',
                imgList: [],
                fileList: [],
                fileRes: null,
                imgRes: null,
                fileHeaders:{
                    "Content-Type":"multipart/form-data"
                },
                autoUpload: false,
                editEntity: null,
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                /*this.pageData=[
                    {order: 1, title: '动态1', statusDesc: '已发布', status: 1, createdAt: '2019-11-23', id:1},
                    {order: 1, title: '动态1', statusDesc: '草稿', status: 0, createdAt: '2019-11-23', id:1}
                ]*/

                let param={
                    page: this.pageIndex,
                    size: this.pageSize
                };

                this.$api.get('dongtai/findList',param, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("查询失败")
                        return;
                    }

                    this.totalPage = res.pagebar.total;

                    this.pageData = [];
                    var order = (this.pageIndex-1) * this.pageSize + 1;

                    for(var i=0; i<res.list.length; i++){
                        var item = res.list[i];
                        var obj={
                            order: order,
                            title: item.title,
                            statusDesc: item.status.toString() == "1" ? "已发布" : "未发布",
                            status: item.status ? parseInt(item.status) : 0,
                            createdAt: item.createdAt.split(' ')[0],
                            id: item.lianzhengDongtaiId
                        };
                        this.pageData.push(obj);
                        order ++;
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
            // 预览
            viewDetail(id){

            },
            // 编辑
            edit(id){
                // 初始化数据
                this.$api.get('dongtai/findById',{id: id}, res=>{
                    this.editEntity = res.data;

                    this.dongtaiContent = this.editEntity.content;
                    this.dongtaiTitle = this.editEntity.title;

                    this.dialogFormVisible = true;
                })
            },
            // 删除动态
            deleteDt(id){
                this.$api.post('dongtai/delete',{id: id}, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("删除失败")
                        return false;
                    }
                    this.$message("删除成功");

                    this.getData();
                })
            },
            // 发布
            publish(id){

            },
            // 取消发布
            withdraw(id){

            },
            // 新增一条动态
            addDongtai(){
                this.dialogFormVisible = false;
            },
            removeFile(){
                this.$api.get('file/delete',{id: this.fileRes.lianzhengFileId}, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("删除失败")
                        return false;
                    }

                    this.fileRes = null;
                    this.$message("删除成功")
                    return true;
                })
            },
            handleRemove(file) {
                let fileList = this.$refs.imgUpload.uploadFiles;
                let index = fileList.findIndex( fileItem => {
                    return fileItem.uid === file.uid
                })
                fileList.splice(index, 1)

                this.$api.get('file/delete',{id: this.imgRes.lianzhengFileId}, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("删除失败")
                        return;
                    }

                    imgRes = null;
                    this.$message("删除成功")
                    return false;
                })
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImgVisible = true;
            },
            handleDownload(file) {
            },
            imgUploadCheck(){
                if(this.$refs.imgUpload.uploadFiles.length > 0){
                    this.$message('只能上传一张封面图片。请先删除原来的图片后，再重新上传');
                    return false;
                }
            },
            uploadFile(data){
                let param = new FormData(); //创建form对象
                param.append('file',data.file);

                this.$api.post('file/upload',param, res=>{
                    console.log(res.data);
                    let filedata = res.data;
                    if(filedata.suffix.indexOf('pdf')>=0){
                        this.fileRes=filedata
                    }
                    else{
                        this.imgRes=filedata
                    }

                    return false;
                })
            },
            addOrUpdateDongtai(){
                if(!this.dongtaiTitle || this.trim(this.dongtaiTitle).length < 1){
                    this.$message('请输入动态标题')
                    return;
                }
                if(!this.dongtaiContent || this.trim(this.dongtaiContent).length < 1){
                    this.$message('请输入动态内容')
                    return;
                }
                if(!this.fileRes){
                    this.$message('请上传附件')
                    return;
                }
                if(!this.imgRes){
                    this.$message('请上传封面图片')
                    return;
                }

                if(this.editEntity){
                    // 编辑
                    this.editEntity.title = this.dongtaiTitle
                    this.editEntity.content = this.dongtaiContent

                    this.editEntity.imageId =  this.imgRes.lianzhengFileId;
                    this.editEntity.fileId =  this.fileRes.lianzhengFileId;

                    this.$api.post('dongtai/addOrUpdate',this.editEntity, res=>{
                        if(res.code.toString() != "0"){
                            this.$message("保存失败，请重新提交")
                            return;
                        }

                        this.getData()
                        this.closeDialog();
                    })
                }
                else{
                    let data={
                        title: this.dongtaiTitle,
                        content: this.dongtaiContent,
                        status: 0,
                        imageId: this.imgRes.lianzhengFileId,
                        fileId: this.fileRes.lianzhengFileId,
                    };

                    this.$api.post('dongtai/addOrUpdate',data, res=>{
                        if(res.code.toString() != "0"){
                            this.$message("保存失败，请重新提交")
                            return;
                        }

                        this.getData()
                        this.closeDialog();
                    })
                }

            },
            trim(str){
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            closeDialog(){
                this.fileRes = null
                this.imgRes = null
                this.dongtaiTitle = null
                this.dongtaiContent = null
                this.editEntity = null


                this.$refs.imgUpload.clearFiles();
                this.$refs.fileUpload.clearFiles();

                this.dialogFormVisible = false;
            }
        }
    }
</script>

<style>
  @import url("../../../assets/css/ref-dept.css");
  @import url("../../../assets/css/mgmt-central.css");

</style>
