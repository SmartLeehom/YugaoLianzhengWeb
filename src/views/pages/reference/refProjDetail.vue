<template>
  <div>
    <div class="reference-department-header">
      <span class="reference-department-title">{{title}}</span>
    </div>

    <div class="reference-department-query">
      <span class="query-title">所属项目</span>
      <el-select v-model="selectedProject" style="width:180px; margin-right: 15px" @change="projectChanges" placeholder="请选择" :disabled="!isEdit">
        <el-option v-for="item in projects" :key="item.key" :label="item.value" :value="item.key"> </el-option>
      </el-select>

      <span class="query-title">资料类型</span>
      <el-select v-model="selectedReftype" style="width:180px; margin-right: 15px" @change="reftypeChanges" placeholder="请选择" :disabled="!isEdit">
        <el-option v-for="item in refTypes" :key="item.key" :label="item.value" :value="item.key"> </el-option>
      </el-select>

        <span v-if="!isEdit" class="query-title" style="margin-right: 18px; margin-left: 5px">上传人</span><span v-if="!isEdit" class="query-title" style="margin-right: 30px; font-size: 16px; color: #36373b">{{createdByName}}</span>
        <span v-if="!isEdit" class="query-title" style="margin-right: 18px">上传时间</span><span v-if="!isEdit" class="query-title" style="margin-right: 15px; font-size: 16px; color: #36373b">{{createdAt}}</span>
    </div>

    <div class="reference-detail">
      <div>
        <span class="query-title">资料名称</span>
        <el-input :disabled="!isEdit" v-model="refName" class="input-text full-widith" placeholder="请输入搜索内容"></el-input>
      </div>
      <div style="margin-top: 15px; height: 180px">
        <span class="query-title" style="vertical-align: top">资料说明</span>
        <el-input
          :disabled="!isEdit"
          type="textarea"
          placeholder="请输入内容"
          :resize="constNone"
          rows="8"
          v-model="content"
          class="input-text full-widith">
        </el-input>

        <!--<textarea v-model="content" class="input-text full-widith"  style="max-height: 200px; min-height: 200px; resize: none"></textarea>-->
      </div>
      <div style="margin-top: 15px;" v-if="isEdit">
        <span class="query-title" style="vertical-align: top; float: left; margin-right: 10px">附件列表</span>
        <el-upload
          :before-remove="removeFile"
          ref="fileUpload"
          :headers="fileHeaders"
          class="upload-demo"
          :with-credentials="true"
          action="#"
          :http-request="uploadFile"
          :file-list="fileList">
          <el-button size="small" >点击上传</el-button>
        </el-upload>
      </div>
    </div>

    <div style="position: fixed; bottom: 120px; left: 50%;">
      <el-button type="danger" class="submit-btn" @click="save()" v-if="isEdit">保存</el-button>
      <el-button type="danger" class="submit-btn"@click="cancel()">返回</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "refDetail",
        data(){
            return{
                title: this.$route.params.id ? "廉政资料 > " + this.$route.params.type + " > " + this.$route.params.title : "廉政资料 > " + this.$route.params.type,
                isEdit: this.$route.params.isEdit === 1,
                projects: [],
                refTypes: [],
                selectedProject: '',
                selectedReftype: '',
                refName: '',
                content: '',
                createdByName: '',
                createdAt: '',
                constNone: 'none',
                returnBack: -1,
                fileRes: [],
                fileHeaders:{
                    "Content-Type":"multipart/form-data"
                },
                fileMap:{},
                referenceEntity: null,
            }
        },
        mounted(){
            this.returnBack = this.$route.params.returnBack ? this.$route.params.returnBack : -1;
            this.getDepts()
            this.getRefTypes()
            if(this.$route.params.id){
                this.getDetail(this.$route.params.id)
            }
        },
        methods:{
            getDepts(){
                this.projects=[
                    {key: 1, value: "项目1"},
                    {key: 2, value: "项目2"},
                    {key: 3, value: "项目3"},
                ]
            },
            getRefTypes(){
                this.refTypes = [
                    {key: 4, value: "廉政交底现场照片"},
                    {key: 5, value: "廉政告知函"},
                ]
            },
            projectChanges(val){
                // val为key
                console.log(val);
                this.selectedProject = val;
            },
            reftypeChanges(val){
                this.selectedReftype = val;
            },
            getDetail(id){
                this.$api.get('reference/findById',{id: id}, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("查询失败")
                        return false;
                    }

                    this.referenceEntity = res.data;

                    this.createdByName = res.data.createdBy;
                    this.createdAt = res.data.createdAt;
                    this.selectedProject = res.data.project;
                    this.selectedReftype=res.data.referenceType;
                    this.content = res.data.content;
                    this.refName = res.data.title;
                })
            },
            save(){
                // 保存数据
                if(!this.selectedProject){
                    this.$message("请选择项目")
                    return false;
                }

                if(!this.selectedReftype){
                    this.$message("请选择资料类型")
                    return false;
                }

                if(!this.refName){
                    this.$message("请输入资料名称")
                    return false;
                }

                // 保存
                let data = null;
                let fileIds = [];
                for(var i=0; i<this.fileRes.length; i++){
                    fileIds.push(this.fileRes[i].lianzhengFileId);
                }

                if(this.referenceEntity){
                    this.referenceEntity.project = this.selectedProject;
                    this.referenceEntity.type = 0;
                    this.referenceEntity.referenceType = this.selectedReftype;
                    this.referenceEntity.title = this.refName;
                    this.referenceEntity.content = this.content;

                    data = this.referenceEntity;
                    data.fileIds = fileIds;
                }
                else{
                    data = {
                        "title":this.refName,
                        "type":0,
                        "referenceType": this.selectedReftype,
                        "departmentId":"",
                        "departmentName":"",
                        "project":this.selectedProject,
                        "projectName":"",
                        "content":this.content,
                        "createdById":this.createdByName,
                        "createdByName":this.createdByName,
                        "createdAt":this.createdAt,
                        "fileIds": fileIds
                    };
                }

                this.$api.post('reference/addOrUpdate',data,res=>{
                    if(res.code.toString() != "0"){
                        this.$message("保存失败")
                        return false;
                    }

                    this.$message("保存成功")
                    history.go(this.returnBack);
                })
            },
            cancel(){
                history.go(this.returnBack);
            },

            //附件相关
            removeFile(file){
                this.$api.get('file/delete',{id: this.fileMap[file.uid]}, res=>{
                    if(res.code.toString() != "0"){
                        this.$message("删除失败")
                        return false;
                    }

                    this.fileRes = this.fileRes.filter(item=>item.lianzhengFileId == this.fileMap[file.uid]);
                    this.$message("删除成功")
                    return true;
                })
            },
            uploadFile(data){
                let param = new FormData(); //创建form对象
                param.append('file',data.file);

                this.$api.post('file/upload',param, res=>{
                    let filedata = res.data;
                    this.fileRes.push(filedata);

                    this.fileMap[data.file.uid] = filedata.lianzhengFileId;

                    return false;
                })
            },
        }
    }
</script>

<style>
  @import url("../../../assets/css/ref-dept.css");

  .reference-detail{
    margin-top: 21px;
  }

  .full-widith{
    width: 90%;
  }
</style>
