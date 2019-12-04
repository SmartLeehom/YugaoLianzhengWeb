<template>
  <div class="mgmt-central">
    <div class="reference-department-header">
      <span class="reference-department-title">{{"用户角色管理"}}</span>
      <el-button type="danger" style="float: right; margin-right: 20px" @click="dialogFormVisible=true">新增<i class="el-icon-plus el-icon--right"></i></el-button>
    </div>

    <div class="mgmt-central-dongtai-list-box" style="margin-top: 15px">
      <el-table :data="pageData" class="table-wrap" style="width: 100%" max-height="520px">
        <el-table-column prop="order" label="序号" width="100px">
        </el-table-column>
        <el-table-column prop="userName" label="用户账号" width="120px">
        </el-table-column>
        <el-table-column prop="userRole" label="用户角色" width="140px">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="140px">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180px">
        </el-table-column>
        <el-table-column prop="statusDesc" label="账号状态" width="100px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="240px">
          <template slot-scope="scope">
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="deleteUsr(scope.row.id)"
              v-if="false"
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
            <el-button type="text" size="small" @click="resetPwd(scope.row.id)" v-if="false">重置密码</el-button>
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

    <el-dialog title="用户角色" :visible.sync="dialogFormVisible" :append-to-body="true" width="30%">
      <div>
        <span class="dialog-title" >用户名</span>
        <el-input v-model="userName" class="small-dialog-value" placeholder="请输入用户名"></el-input>
      </div>
      <div class="dialog-row">
        <span class="dialog-title" >手机号</span>
        <el-input v-model="mobile" class="small-dialog-value" placeholder="请输入手机号"></el-input>
      </div>
      <div class="dialog-row">
        <span class="dialog-title" >邮箱&nbsp;&nbsp;&nbsp;</span>
        <el-input v-model="email" class="small-dialog-value" placeholder="请输入邮箱"></el-input>
      </div>
      <div class="dialog-row">
        <span class="dialog-title">角色&nbsp;&nbsp;&nbsp;</span>
        <el-select v-model="selectedRoles" class="small-dialog-value"  multiple placeholder="请选择角色">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cancel()">取 消</el-button>
        <el-button type="danger" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import baseUrl from "../../../utils/baseUrl";
    export default {
        name: "userMgmt",
        data(){
            return {
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pageData: [],
                dialogFormVisible: false,
                userName: '',
                mobile: '',
                email: '',
                selectedRoles: [],
                roles: [{
                    value: '1',
                    label: '普通用户'
                },{
                    value: '2',
                    label: '管理员'
                }, ],
                editEntity: null,
                editUserId: null,
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                this.$api.get('user/list?page='+this.pageIndex+'&size='+this.pageSize,null, res=>{
                    if(res.code.toString() != '0'){
                        this.$message('查询失败')
                        return;
                    }

                    this.pageData = [];
                    let order = (this.pageIndex - 1)*this.pageSize + 1;
                    for(let i=0; i<res.list.length; i++){
                        let item = res.list[i];
                        let roleNames = '';
                        for(let j=0; j<item.roleEntityList.length; j++){
                            roleNames += item.roleEntityList[j].roleName + ','
                        }

                        this.pageData.push({
                            order: order++,
                            userName: item.username,
                            mobile: item.mobile,
                            email: item.email,
                            status: item.status,
                            statusDesc: item.status == 1 ? '正常' : (item.status == 0 ? '停用' : '删除'),
                            id: item.userId,
                            userRole: roleNames.substr(0, roleNames.length - 1),
                        })
                    }
                });
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
                let url = status == 0 ? 'user/disable?userId='+id : 'user/enable?userId='+id
                if(true){
                    this.$api.get(url,null, res=>{
                        if(res.code.toString() != '0'){
                            this.$message('操作失败')
                            return;
                        }

                        this.$message('操作成功')
                        this.getData();
                    });
                }
            },
            // 编辑
            editDetail(id){
                // 初始化数据
                this.$api.get('user/detail?userId='+id, null, res=>{
                    if(res.code.toString() != '0'){
                        this.$message('查询失败')
                        return;
                    }
                    this.editEntity = res.data;

                    this.editUserId = res.data.userId
                    this.mobile = res.data.mobile
                    this.email = res.data.email
                    this.userName = res.data.username

                    this.editEntity = res.data;

                    for(let j=0; j<res.data.roleEntityList.length; j++){
                        this.selectedRoles.push(res.data.roleEntityList[j].roleId.toString());
                    }

                    this.dialogFormVisible = true;
                })
            },
            // 重置密码
            resetPwd(id){

            },
            cancel(){
                this.clear();
                this.dialogFormVisible = false;
            },
            addUser(){
                if(!this.userName){
                    this.$message("请输入用户名")
                    return;
                }
                if(!this.mobile){
                    this.$message("请输入手机号")
                    return;
                }
                if(this.selectedRoles.length < 1){
                    this.$message("请选择用户角色")
                    return;
                }

                let params = {userId: ''};

                if(this.editUserId){
                    params = this.editEntity;
                }

                params.mobile = this.mobile
                params.email = this.email
                params.username = this.userName
                params.roleEntityList = [];
                for(var i=0; i<this.selectedRoles.length; i++){
                    let selectRoleName = this.roles.find(item=>item.value==this.selectedRoles[i]).label;
                    params.roleEntityList.push({"roleId": parseInt(this.selectedRoles[i]), roleName: selectRoleName})
                }

                this.$api.post('user/save',params,res=>{
                    if(res.code.toString() != '0'){
                        this.$message("保存失败")
                        return;
                    }
                    this.$message("保存成功")
                    this.getData()
                    this.clear();
                    this.dialogFormVisible = false;
                })
            },
            clear(){
                this.userName='';
                this.mobile='';
                this.email='';
                this.selectedRoles=[];
                this.editUserId = null;
                this.editEntity = null;
            }
        }
    }
</script>

<style scoped>
  @import url("../../../assets/css/ref-dept.css");
  @import url("../../../assets/css/mgmt-central.css");
</style>
