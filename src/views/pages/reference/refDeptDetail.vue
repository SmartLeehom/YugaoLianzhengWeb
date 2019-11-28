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
        <span class="query-title" style="vertical-align: top">附件列表</span>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
    </div>

    <div style="position: fixed; bottom: 120px; left: 50%;">
      <el-button type="danger" class="submit-btn" @click="save()">保存</el-button>
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
                refName: '',
                content: '',
                createdByName: '',
                createdAt: '',
                constNone: 'none',
                fileList: []
            }
        },
        mounted(){
            this.getDepts()
            this.getRefTypes()
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
                console.log(val);
                this.selectedDept = val;
                this.selectedDeptName = "";
            },
            reftypeChanges(val){
                console.log(val);
                this.selectedReftype = val;
            },
            getDetail(id){
              this.$api.get('reference/findById?id='+id,null,res=>{
                this.createdByName = res.data.createdBy;
                this.createdAt = res.data.createdAt;
                this.selectedDept = res.data.department;
                this.selectedReftype=res.data.type;
                this.content = res.data.content;
                this.refName = res.data.projectName;
            })
                // var d = new Date();
                // this.createdByName = '张三';
                // this.createdAt = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
                // this.selectedDept = 3;
                // this.selectedReftype=3;
                // this.content = '廉政资料说明-new';
                // this.refName = '廉政资料-new-name';
            },
            save(){
                // 保存数据
                var obj = {
                          	"title":this.refName,
                          	"type":this.selectedReftype,
                          	"departmentId":this.selectedDept,
                            "departmentName":this.selectedDeptName,
                          	"project":"",
                          	"projectName":"",
                          	"content":this.content,
                            "createdById":this.createdByName,
                          	"createdByName":this.createdByName,
                          	"createdAt":this.createdAt
                          };
                this.$api.post('reference/addOrUpdate',obj,res=>{})
                history.go(-1);
            },
            cancel(){
                history.go(-1);
            },

            //附件相关
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            }
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
