<template>
  <div class="reference-analysis">
    <div class="reference-department-header">
      <span class="reference-department-title">{{"廉政资料 > 资料缺失分析"}}</span>
    </div>
    <div style="border-bottom: lightgray 1px solid; padding-bottom: 15px">
      <div style="margin: 15px 0;">
        <span class="sub-title" style="font-size: 15px">项目缺失详细信息</span>
      </div>

      <span class="query-title">项目名称</span>
      <el-select v-model="selectedProject" style="width:180px; margin-right: 15px" @change="projectChanges" placeholder="请选择" >
        <el-option v-for="item in projects" :key="item.key" :label="item.value" :value="item.key"> </el-option>
      </el-select>

      <span class="query-title">部门名称</span>
      <el-select v-model="selectedDept" style="width:180px; margin-right: 15px" @change="deptChanges" placeholder="请选择" >
        <el-option v-for="item in depts" :key="item.key" :label="item.value" :value="item.key"> </el-option>
      </el-select>

      <el-button type="danger" class="submit-btn" style="margin-left: 10px" @click="queryList()">查询</el-button>
    </div>
    <div class="reference-analysis-list">
      <div style="margin: 15px 0;">
        <span class="sub-title" style="margin-right: 15px; font-size: 15px">资料缺失</span><span class="sub-title-val" >{{amount}}</span><span class="sub-title"  style="font-size: 15px">项</span>
      </div>
      <div class="reference-analysis-table">
        <el-table :data="analysisData" class="table-wrap" style="width: 100%" max-height="400px">
          <el-table-column prop="typeName" label="资料类型" width="200px">
          </el-table-column>
          <el-table-column prop="projectName" label="所属项目" width="220px">
          </el-table-column>
          <el-table-column prop="deptName" label="负责部门" width="140px">
          </el-table-column>
          <el-table-column prop="dueDate" label="规定上传时间" width="120px">
          </el-table-column>
          <el-table-column prop="missingDay" label="已缺失天数" width="140px">
          </el-table-column>
          <el-table-column prop="action" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                class="edit_green"
                type="text"
                size="small"
                @click="uploadRef(scope.row.type)"
              >前往上传</el-button>
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
          :page-sizes="[10,20,50,100]"
          :page-size="pageSize"
          :total="totalPage"
          style="text-align: center"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "refAnalysis",
        data(){
            return{
                projects: [],
                depts: [],
                selectedProject: '',
                selectedDept: '',
                amount: 8,
                analysisData: [],
                totalPage: 0,
                pageIndex: 1,
                pageSize: 6,
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                this.getAmount()
                this.getDepts()
                this.getProjects()

                this.totalPage = this.amount;
                this.analysisData = [
                    {id: 1, typeName: "廉政专题教育会图文资料", type: 1, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                    {id: 2, typeName: "廉政专题教育会图文资料", type: 1, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                    {id: 3, typeName: "廉政专题教育会图文资料", type: 1, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                    {id: 4, typeName: "廉政专题教育会图文资料", type: 1, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                    {id: 3, typeName: "廉政交底现场照片", type: 4, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                    {id: 4, typeName: "廉政交底现场照片", type: 4, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                    {id: 3, typeName: "廉政交底现场照片", type: 4, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                    {id: 4, typeName: "廉政交底现场照片", type: 4, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                    {id: 3, typeName: "廉政交底现场照片", type: 4, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                    {id: 4, typeName: "廉政交底现场照片", type: 4, deptName: "部门1", projectName: "项目1", dueDate: "2019-1-1", missingDay: "5"},
                ]
            },
            getAmount(){
                this.amount = 8;
            },
            getDepts(){
                this.depts=[
                    {key: 1, value: "一部"},
                    {key: 2, value: "二部"},
                    {key: 3, value: "三部"},
                ]
            },
            getProjects(){
                this.projects=[
                    {key: 1, value: "项目1"},
                    {key: 2, value: "项目2"},
                    {key: 3, value: "项目3"},
                ]
            },
            projectChanges(val){
                // val为key
                this.selectedProject = val;
            },
            deptChanges(val){
                // val为key
                this.selectedDept = val;
            },
            queryList(){

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
            uploadRef(type){
                if([1,2,3].indexOf(type) >= 0){
                    this.$router.push({
                        name: "dept",
                    })
                }
                else{
                    this.$router.push({
                        name: "project",
                    })
                }
            }
        }
    }
</script>

<style scoped>
@import url("../../../assets/css/ref-dept.css");
@import url("../../../assets/css/mgmt-central.css");
  .sub-title{
    font-weight: bold;
    color: #36373b;
    font-family: "Microsoft YaHei";
  }
  .sub-title-val{
    font-weight: bold;
    color: #fa8e1a;
    margin-right: 15px;
    font-size: 18px;
    font-family: "Microsoft YaHei";
  }
</style>
