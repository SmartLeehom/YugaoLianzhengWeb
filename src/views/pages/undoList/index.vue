<template>
  <div>
    <div class="reference-department-header">
      <span class="reference-department-title">首页 > 消息中心</span>
    </div>

    <div class="reference-department-query">
      <span class="query-title">开始日期</span>
      <el-date-picker
        v-model="startDate"
        type="datetime"
        placeholder="开始日期" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px; margin-right: 15px"
      ></el-date-picker>

      <span class="query-title">结束日期</span>
      <el-date-picker
        v-model="endDate"
        type="datetime"
        placeholder="开始日期" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px; margin-right: 15px"
      ></el-date-picker>

      <span class="query-title">消息类型</span>
      <el-select v-model="msgTypes.key" style="width:180px; margin-right: 15px" @change="msgtypeChanges" clearable placeholder="请选择">
        <el-option v-for="item in msgTypes" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>

      <span class="query-title">消息状态</span>
      <el-select v-model="msgStatus.key" style="width:180px; margin-right: 15px" @change="msgstatusChanges" clearable  placeholder="请选择">
        <el-option v-for="item in msgStatus" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>

      <el-button type="danger" class="submit-btn" style="margin-left: 10px" @click="getData()">查询</el-button>
    </div>

    <div class="reference-module-table" style="margin-top: 21px">
      <el-table :data="undoList" class="table-wrap" style="width: 100%" max-height="520px">
        <el-table-column prop="statusDesc" label="消息状态" width="200px">
        </el-table-column>
        <el-table-column prop="typeDesc" label="消息类型" width="200px">
        </el-table-column>
        <el-table-column prop="remarks" label="消息内容" width="480px">
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间" width="160px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="158px">
          <template slot-scope="scope">
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="gotoDetail(scope.row.lianzhengUndoId)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10,20,30]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
    import baseUrl from "../../../utils/baseUrl";
    export default {
        name: "undoList",
        data(){
            return {
                undoList: [],
                totalPage: 1,
                pageIndex: 1,
                pageSize: 10,
                startDate: null,
                endDate: null,
                selectedType: null,
                selectedStatus: null,
                msgTypes: [{id:1, name: '待阅'}, {id:2, name: '待办'}],
                msgStatus: [{id: '0', name: '未处理'}, {id: '1', name: '已处理'}],
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                var url = 'undo/findList?page='+this.pageIndex+'&size='+this.pageSize+'&dueBy='+sessionStorage.getItem('userId');
                if(this.selectedType && this.selectedType.toString().length > 0){
                    url += '&type='+this.selectedType
                }
                if(this.selectedStatus && this.selectedStatus.toString().length > 0){
                    url += '&status='+this.selectedStatus
                }
                if(this.selectedStatus && this.selectedStatus.toString().length > 0){
                    url += '&status='+this.selectedStatus
                }
                if(this.startDate && this.startDate.toString().length > 0){
                    url += '&startDate='+this.startDate
                }
                if(this.endDate && this.endDate.toString().length > 0){
                    url += '&endDate='+this.endDate
                }

              this.$api.get(url,null,res=>{
                  if(res.code != "0"){
                      this.$message("查询失败")
                      return
                  }

                  this.undoList=res.list;

                  for(var i=0; i<this.undoList.length; i++){
                      this.undoList[i].statusDesc = this.undoList[i].status == 0 ? '未处理' : '已处理';
                      this.undoList[i].typeDesc = this.undoList[i].type == 1 ? '待阅' : '待办';
                      this.undoList[i].createdAt = this.undoList[i].createdAt.split(' ')[0]
                  }

                  this.pageIndex=res.pagebar.page;
                  this.pageSize=res.pagebar.size;
                  this.totalPage=res.pagebar.total;
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
            msgtypeChanges(val){
                this.selectedType = val;
            },
            msgstatusChanges(val){
                this.selectedStatus = val;
            },
            gotoDetail(id){
                this.$router.push({
                    name: 'undoDetail',
                    params: {id: id}
                })
            }
        }
    }
</script>

<style scoped>
  @import url("../../../assets/css/ref-dept.css");
</style>
