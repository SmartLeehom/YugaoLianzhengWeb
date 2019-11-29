<template>
  <div class="reference-department">
    <div class="reference-department-header">
      <span class="reference-department-title">{{"廉政资料 > 集团与部门资料"}}</span>
    </div>

    <div class="reference-department-query">
      <span class="query-title">部门</span>
      <el-select v-model="depts.key" style="width:180px; margin-right: 15px" @change="deptChanges" placeholder="请选择">
        <el-option v-for="item in depts" :key="item.fid" :label="item.fname" :value="item.fid"> </el-option>
      </el-select>

      <span class="query-title">资料类型</span>
      <el-select v-model="refTypes.key" style="width:180px; margin-right: 15px" @change="reftypeChanges" placeholder="请选择">
        <el-option v-for="item in refTypes" :key="item.lianzhengReferenceFileTypeId" :label="item.name" :value="item.lianzhengReferenceFileTypeId"> </el-option>
      </el-select>

      <span class="query-title">关键词</span>
      <el-input v-model="keyPattern" style="width: 180px" placeholder="请输入搜索内容"></el-input>

      <el-button type="danger" class="submit-btn" style="margin-left: 10px" @click="queryRefList()">查询</el-button>
      <el-button type="danger" class="submit-btn"@click="addRef()">新增</el-button>
    </div>

    <div class="reference-department-list">
      <el-table :data="refData" class="table-wrap" style="width: 100%" max-height="460px">
        <el-table-column prop="type" label="资料类型" width="200px">
        </el-table-column>
        <el-table-column prop="title" label="资料名称" width="220px">
        </el-table-column>
        <el-table-column prop="departmentName" label="部门" width="140px">
        </el-table-column>
        <el-table-column prop="createdByName" label="上传人" width="100px">
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
                depts: [],
                refTypes: [],
                keyPattern: '',
                selectedDept: '',
                selectedDeptName: '',
                selectedReftype: '',
                selectedReftypeName: '',
                refData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
            }
        },
        mounted(){
            this.getDepts()
            this.getRefTypes()
            this.getRefData()
        },
        methods: {
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
                this.selectedReftype = val;
                var item = this.refTypes.find(d=>d.lianzhengReferenceFileTypeId == val);
                this.selectedReftypeName = item.name;
            },

            queryRefList(){
                console.log(this.selectedDept + '--' + this.selectedReftype + '--' + this.keyPattern);
                this.$api.get('reference/findList?type=0&page=1&referenceType='+this.selectedReftype+'&size=10&pattern='+this.keyPattern,null,res=>{
                this.refData=res.list;
                this.pageIndex=res.pagebar.page;
                this.totalSize=res.pagebar.size;
                this.totalPage=res.pagebar.total;
              })
            },
            addRef(){
                this.$router.push({
                    name: "refDeptDetail",
                    params: {type: '集团与部门资料', isEdit: 1},
                })
            },
            getRefData(){
              this.$api.get('reference/findList?type=0&page=1&size=10',null,res=>{
              this.refData=res.list;
              this.pageIndex=res.pagebar.page;
              this.totalSize=res.pagebar.size;
              this.totalPage=res.pagebar.total;
            })
                // this.refData=[
                //     {lianzhengReferenceId: 1, typeName: "廉政专题教育会图文资料", title: "廉政资料1", deptName: "一部", createdByName: "张三", createdAt: "2019-11-26"}
                // ]
                // this.totalPage = 1
            },
            viewDetail(id, title){
                this.$router.push({
                    name: "refDeptDetail",
                    params: {id: id, type: "集团与部门资料", title: title, isEdit: 0},
                })
            },
            editDetail(id, title){
                this.$router.push({
                    name: "refDeptDetail",
                    params: {id: id, type: '集团与部门资料', title: title, isEdit: 1},
                })
            },
            deleteRef(id){
                console.log(id);
                this.$api.post('reference/delete?id='+id,null,res=>{
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

<style>
  @import url("../../../assets/css/ref-dept.css");
  @import url("../../../assets/css/mgmt-central.css");
</style>
