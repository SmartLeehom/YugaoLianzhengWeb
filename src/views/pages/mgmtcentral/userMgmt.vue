<template>
  <div class="mgmt-central">
    <div class="reference-department-header">
      <span class="reference-department-title">{{"用户角色管理"}}</span>
      <el-button type="danger" style="float: right; margin-right: 100px">新增<i class="el-icon-plus el-icon--right"></i></el-button>
    </div>

    <div class="mgmt-central-dongtai-list-box" style="margin-top: 15px">
      <el-table :data="pageData" class="table-wrap" style="width: 100%" max-height="520px">
        <el-table-column prop="order" label="序号" width="100px">
        </el-table-column>
        <el-table-column prop="userName" label="用户账号" width="200px">
        </el-table-column>
        <el-table-column prop="userRole" label="用户角色" width="200px">
        </el-table-column>
        <el-table-column prop="statusDesc" label="账号状态" width="160px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="deleteUsr(scope.row.id)"
            >删除</el-button>
            <el-button
              class="del_danger"
              type="text"
              size="small"
              @click="setStatus(scope.row.id, 1)"
              v-if="scope.row.status==0"
            >启用</el-button>
            <el-button
              class="del_danger"
              type="text"
              size="small"
              v-if="scope.row.status==1"
              @click="setStatus(scope.row.id, 0)"
            >禁用</el-button>
            <el-button type="text" size="small" @click="editDetail(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" @click="resetPwd(scope.row.id)">重置密码</el-button>
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
        name: "userMgmt",
        data(){
            return {
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pageData: [],
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                this.pageData=[
                ]
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
            // 删除
            deleteUsr(id){

            },
            // 启用、禁用
            setStatus(id, status){

            },
            // 编辑
            editDetail(id){

            },
            // 重置密码
            resetPwd(id){

            },
        }
    }
</script>

<style scoped>
  @import url("../../../assets/css/ref-dept.css");
  @import url("../../../assets/css/mgmt-central.css");
</style>
