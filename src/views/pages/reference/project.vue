<template>
  <div class="reference-department">
    <div class="reference-department-header">
      <span class="reference-department-title">{{"廉政资料 > 工程项目资料"}}</span>
    </div>

    <div class="reference-department-query">
      <span class="query-title">项目</span>
      <el-select v-model="projects.key" filterable style="width:180px; margin-right: 15px" @change="projectChanges" placeholder="请选择或输入搜索">
        <el-option v-for="item in projects" :key="item.key" :label="item.value" :value="item.key"> </el-option>
      </el-select>

      <span class="query-title">资料类型</span>
      <el-select v-model="refTypes.key" style="width:180px; margin-right: 15px" @change="reftypeChanges" placeholder="请选择">
        <el-option v-for="item in refTypes" :key="item.lianzhengReferenceTypeId" :label="item.name" :value="item.lianzhengReferenceTypeId"> </el-option>
      </el-select>

      <span class="query-title">关键词</span>
      <el-input v-model="keyPattern" style="width: 180px" placeholder="请输入搜索内容"></el-input>

      <el-button type="danger" class="submit-btn" style="margin-left: 10px" @click="queryRefList()">查询</el-button>
      <el-button type="danger" class="submit-btn"@click="addRef()">新增</el-button>
    </div>

    <div class="reference-department-list">
      <el-table :data="refData" class="table-wrap" style="width: 100%" max-height="460px">
        <el-table-column prop="typeName" label="资料类型" width="200px">
        </el-table-column>
        <el-table-column prop="title" label="资料名称" width="220px">
        </el-table-column>
        <el-table-column prop="projectName" label="项目" width="140px">
        </el-table-column>
        <el-table-column prop="createdBy" label="上传人" width="100px">
        </el-table-column>
        <el-table-column prop="createdAt" label="上传时间" width="140px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewDetail(scope.row.lianzhengReferenceId, scope.row.title)">查看</el-button>
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="editDetail(scope.row.lianzhengReferenceId, scope.row.title)"
            >编辑</el-button>
            <el-button
              class="del_danger"
              type="text"
              size="small"
              @click="deleteRef(scope.row.lianzhengReferenceId)"
            >删除</el-button>
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
  </div>
</template>

<script>
    export default {
        name: "list",
        data(){
            return{
                projects: [],
                refTypes: [],
                keyPattern: '',
                selectedProject: '',
                selectedReftype: '',
                refData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
            }
        },
        mounted(){
            this.getProjects()
            this.getRefTypes()
            this.getRefData()
        },
        methods: {
            getProjects(){
                this.$api.get('project/list',null, res=>{
                    if(res.code.toString() != '0'){
                        this.$message('项目数据查询失败')
                        return;
                    }

                    this.projects=[];
                    for(let i=0; i<res.list.length; i++){
                        this.projects.push({key: res.list[i].sysProjectId, value: res.list[i].name})
                    }
                })
            },
            getRefTypes(){
                this.$api.get('referenceFileType/findList?referenceTypeId=3',null, res=>{
                this.refTypes=res.list
              })
                // this.refTypes = [
                //     {key: 4, value: "廉政交底现场照片"},
                //     {key: 5, value: "廉政告知函"},
                // ]
            },
            projectChanges(val){
                // val为key
                console.log(val);
                this.selectedProject = val;
            },
            reftypeChanges(val){
                console.log(val);
                this.selectedReftype = val;
            },

            queryRefList(){
                //console.log(this.selectedProject + '--' + this.selectedReftype + '--' + this.keyPattern);
                this.$api.get('reference/findList?type=3&page='+this.pageIndex+'&referenceType='+this.selectedReftype+'&size='+this.pageSize+'&pattern='+this.keyPattern,null,res=> {
                    this.refData = res.list;

                    for(let i=0; i<this.refData.length; i++){
                        if(this.refData[i].referenceType.toString() == "4"){
                            this.refData[i].typeName = "廉政交底现场照片"
                        }
                        else if(this.refData[i].referenceType.toString() == "5"){
                            this.refData[i].typeName = "廉政告知函"
                        }
                    }

                    this.pageIndex = res.pagebar.page;
                    this.totalSize = res.pagebar.size;
                    this.totalPage = res.pagebar.total;
                })
            },
            addRef(){
                this.$router.push({
                    name: "refProjDetail",
                    params: {type: '工程项目资料', isEdit: 1},
                })
            },
            getRefData(){
              this.$api.get('reference/findList?type=3&page='+this.pageIndex+'&size='+this.pageSize,null,res=>{
              this.refData=res.list;
                  for(let i=0; i<this.refData.length; i++){
                      if(this.refData[i].referenceType.toString() == "4"){
                          this.refData[i].typeName = "廉政交底现场照片"
                      }
                      else if(this.refData[i].referenceType.toString() == "5"){
                          this.refData[i].typeName = "廉政告知函"
                      }
                  }

                  this.pageIndex=res.pagebar.page;
              this.totalSize=res.pagebar.size;
              this.totalPage=res.pagebar.total;
              })
                // this.refData=[
                //     {lianzhengReferenceId: 1, typeName: "廉政专题教育会图文资料", title: "廉政资料1", projectName: "项目1", createdByName: "张三", createdAt: "2019-11-26"}
                // ]
                // this.totalPage = 1
            },
            viewDetail(id, title){
                this.$router.push({
                    name: "refProjDetail",
                    params: {id: id, type: '工程项目资料', title: title, isEdit: 0},
                })
            },
            editDetail(id, title){
                this.$router.push({
                    name: "refProjDetail",
                    params: {id: id, type: '工程项目资料', title: title, isEdit: 1},
                })
            },
            deleteRef(id){
                this.$api.post('reference/delete?id='+id,null,res=>{
                    this.queryRefList();
                })
            },
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getRefData()
            },
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getRefData()
            },
        }
    }
</script>

<style scoped>
  @import url("../../../assets/css/ref-dept.css");
</style>
