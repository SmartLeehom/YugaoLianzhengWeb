<template>
  <div>
    <div class="reference-department-header">
      <span class="reference-department-title">{{title}}</span>
    </div>

    <div class="reference-department-query">
      <span class="query-title">所属项目</span>
      <el-select v-model="selectedProject" style="width:180px; margin-right: 15px" @change="projectChanges" placeholder="请选择或输入搜索" filterable :disabled="!isEdit">
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
      <div style="margin-top: 15px;">
        <span class="query-title" style="vertical-align: top; float: left; margin-right: 10px">附件列表</span>
        <el-upload
          :on-preview="download"
          :before-remove="removeFile"
          ref="fileUpload"
          :headers="fileHeaders"
          class="upload-demo"
          :with-credentials="true"
          action="#"
          :http-request="uploadFile"
          :disabled="!isEdit"
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
    import baseUrl from "../../../utils/baseUrl";
    import utils from "../../../utils/utils";
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
                fileList: [],
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
                this.$api.get('project/list',null, res=>{
                    if(res.code.toString() != '0'){
                        this.$message('项目数据查询失败')
                        return;
                    }

                    this.projects=[];
                    for(let i=0; i<res.data.length; i++){
                        this.projects.push({key: res.data[i].sysProjectId, value: res.data[i].name})
                    }
                })
            },
            getRefTypes(){
                this.refTypes = [
                    {key: 4, value: "廉政交底现场照片"},
                    {key: 5, value: "廉政告知函"},
                ]
            },
            projectChanges(val){
                // val为key
                //console.log(val);
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
                    this.selectedProject = res.data.project.toString();
                    this.selectedReftype=res.data.referenceType;
                    this.content = res.data.content;
                    this.refName = res.data.title;

                    // 获取附件列表
                    this.$api.get('file/list',{businessId: id, moduleId: 3, createdBy: null, page: 1, size: 100}, res=>{
                        this.fileList = res.list;
                    })
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
                let projectDetail = this.projects.find(item=>item.key.toString() == this.selectedProject.toString());
                let isNewAdded = true;

                let data = null;
                let fileIds = [];
                for(var i=0; i<this.fileRes.length; i++){
                    fileIds.push(this.fileRes[i].lianzhengFileId);
                }

                if(this.referenceEntity){
                    this.referenceEntity.project = this.selectedProject;
                    this.referenceEntity.type = "3";
                    this.referenceEntity.referenceType = this.selectedReftype;
                    this.referenceEntity.title = this.refName;
                    this.referenceEntity.content = this.content;

                    data = this.referenceEntity;
                    data.fileIds = fileIds;
                    isNewAdded = false;
                }
                else{
                    data = {
                        "title":this.refName,
                        "type":"3",
                        "referenceType": this.selectedReftype,
                        "departmentId":"",
                        "departmentName":"",
                        "project":this.selectedProject,
                        "projectName":projectDetail.name,
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

                    // 如果是新增的数据，还需要新增待办事项给 固定人员+项目负责人
                    console.log(isNewAdded)
                    if(isNewAdded){
                        let userIds = utils.SupervisionIds;
                        console.log(userIds)

                        // 获取项目负责人
                        // 。。待完成
                        this.$api.get('user/userinfo?username='+projectDetail.responserName,null, user=>{
                            if(user.code.toString() == '0' && user.data && user.data.userId){
                                userIds.push(user.data.userId);
                            }

                            // 推送接口
                            let undoData = [];
                            for(let u=0; u<userIds.length; u++){
                                undoData.push({
                                    lianzhengReferenceId: res.data.lianzhengReferenceId,
                                    type: 1,
                                    dueBy: userIds[u],
                                    finishedBy: '',
                                    dueAt: null,
                                    finishedAt: null,
                                    createdBy: sessionStorage.getItem('userId'),
                                    createdAt: new Date(),
                                    updatedBy: sessionStorage.getItem('userId'),
                                    updatedAt:  new Date(),
                                    status: 0,
                                    remarks: '',
                                });
                            }
                            this.$api.post('undo/addList', undoData, res=>{
                                if(res.code.toString() != "0"){
                                    this.$message("廉政资料上传成功，生成待阅事项异常，请联系管理员处理")
                                    this.clear()
                                    history.go(-1);
                                }

                                this.$message("保存成功")
                                this.clear()
                                history.go(-1);
                            })
                        })
                    }
                    else{
                        this.$message("保存成功")
                        this.clear();
                        history.go(-1);
                    }
                })
            },
            cancel(){
                this.clear();
                history.go(this.returnBack);
            },
            clear(){
                this.referenceEntity = null;
                this.createdByName = null;
                this.createdAt = null;
                this.selectedProject = null;
                this.selectedReftype=null;
                this.content = null;
                this.refName = null;
            },
            //附件相关
            removeFile(file){
                let id = this.fileMap[file.uid] ? this.fileMap[file.uid] : file.lianzhengFileId;
                this.$api.get('file/delete',{id: id}, res=>{
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
                    this.$message("上传成功")
                    return false;
                })
            },
            download(file){
                let id = this.fileMap[file.uid] ? this.fileMap[file.uid] : file.lianzhengFileId;
                var url = baseUrl.serverUrl+'/file/download?fileId='+id;
                window.location.href = url;
            }
        }
    }
</script>

<style scoped>
  @import url("../../../assets/css/ref-dept.css");

  .reference-detail{
    margin-top: 21px;
  }

  .full-widith{
    width: 90%;
  }
</style>
