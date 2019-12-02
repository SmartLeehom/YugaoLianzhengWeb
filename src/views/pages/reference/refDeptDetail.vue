<template>
  <div>
    <div class="reference-department-header">
      <span class="reference-department-title">{{title}}</span>
    </div>

    <div class="reference-department-query">
      <span class="query-title">所属部门</span>
      <el-select v-model="selectedDept" style="width:180px; margin-right: 15px" @change="deptChanges" placeholder="请选择" :disabled="!isEdit">
        <el-option v-for="item in depts" :key="item.fid" :label="item.fname" :value="item.fid"> </el-option>
      </el-select>

      <span class="query-title">资料类型</span>
      <el-select v-model="selectedReftype" style="width:180px; margin-right: 15px" @change="reftypeChanges" placeholder="请选择" :disabled="!isEdit">
        <el-option v-for="item in refTypes" :key="item.lianzhengReferenceFileTypeId" :label="item.name" :value="item.lianzhengReferenceFileTypeId"> </el-option>
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
          :before-remove="removeFile"
          ref="fileUpload"
          :headers="fileHeaders"
          class="upload-demo"
          :with-credentials="true"
          action="#"
          :http-request="uploadFile"
          :file-list="fileList">
          <el-button size="small" v-if="isEdit">点击上传</el-button>
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
                depts: [],
                refTypes: [],
                selectedDept: '',
                selectedDeptName: '',
                selectedReftype: '',
                selectedReftypeName: '',
                refName: '',
                content: '',
                createdByName: '',
                createdAt: '',
                constNone: 'none',
                fileList: [],
                returnBack: -1,
                fileRes: [],
                fileHeaders:{
                    "Content-Type":"multipart/form-data"
                },
                fileMap:{},
                referenceEntity:{}
            }
        },
        mounted(){
            this.returnBack = this.$route.params.returnBack ? this.$route.params.returnBack : -1;
            this.getDepts()
            this.getRefTypes()

            console.log('------------------------------------11111')
            if(this.$route.params.id){
                this.getDetail(this.$route.params.id)
            }
        },
        methods:{
            getDepts(){
              this.$api.get('org/list',null,res=>{
              this.depts=res.data
            })
                // this.depts=[
                //     {key: 1, value: "一部"},
                //     {key: 2, value: "二部"},
                //     {key: 3, value: "三部"},
                // ]
            },
            getRefTypes(){
              this.$api.get('referenceFileType/findList?referenceTypeId=1',null,res=>{
              this.refTypes=res.list
            })
                // this.refTypes = [
                //     {key: 1, value: "廉政专题教育会图文资料"},
                //     {key: 2, value: "廉政约谈图文资料"},
                //     {key: 3, value: "廉洁从业承诺书"}
                // ]
            },
            deptChanges(val){
                // val为key
                this.selectedDept = val;
                var item = this.depts.find(d=>d.fid == val);
                this.selectedDeptName = item.fname;
            },
            reftypeChanges(val){
                console.log(val);
                this.selectedReftype = val;
                var item = this.refTypes.find(d=>d.lianzhengReferenceFileTypeId == val);
                this.selectedReftypeName = item.name;
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
                    this.selectedDept = res.data.departmentId;
                    this.selectedReftype=res.data.referenceType.toString();
                    this.content = res.data.content;
                    this.refName = res.data.title;

                    // 获取附件列表
                    this.$api.get('file/list',{businessId: id, moduleId: 3, createdBy: null, page: 1, size: 100}, res=>{
                        this.fileList = res.list;
                    })
                })
            },
            save(){
                if(!this.selectedDept){
                    this.$message("请选择部门")
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
                    this.referenceEntity.departmentId = this.selectedDept;
                    this.referenceEntity.departmentName = this.selectedDeptName;
                    this.referenceEntity.referenceType = this.selectedReftype;
                    this.referenceEntity.title = this.refName;
                    this.referenceEntity.content = this.content;
                    this.referenceEntity.type = "1";
                    this.referenceEntity.createdById = "";
                    this.referenceEntity.createdByName = this.createdByName;

                    data = this.referenceEntity;
                    data.fileIds = fileIds;
                }
                else{
                    data = {
                        "title":this.refName,
                        "type": "1",
                        "referenceType": this.selectedReftype,
                        "departmentId":this.selectedDept,
                        "departmentName":this.selectedDeptName,
                        "project":"",
                        "projectName":"",
                        "content":this.content,
                        "createdById":this.createdByName,
                        "createdByName":this.createdByName,
                        "createdAt":this.createdAt,
                        "fileIds": fileIds,
                    };
                }

                this.$api.post('reference/addOrUpdate',data,res=>{
                    if(res.code.toString() != "0"){
                        this.$message("保存失败")
                        return false;
                    }

                    this.$message("保存成功")
                    this.clear()
                    history.go(this.returnBack);
                })
            },
            cancel(){
                this.clear()
                history.go(this.returnBack);
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

                    return false;
                })
            },
            clear(){
                this.referenceEntity = null;
                this.createdByName = null;
                this.createdAt = null;
                this.selectedDept = null;
                this.selectedReftype=null;
                this.content = null;
                this.refName = null;
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
