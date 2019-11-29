<template>
  <div class="mgmt-central">
    <div class="reference-department-header">
      <span class="reference-department-title">{{"廉政报告管理"}}</span>
      <el-button type="danger" style="float: right; margin-right: 100px" @click="dialogFormVisible = true">新增<i class="el-icon-plus el-icon--right"></i></el-button>
    </div>

    <div class="mgmt-central-dongtai-list-box" style="margin-top: 15px">
      <el-table :data="pageData" class="table-wrap" style="width: 100%" max-height="520px">
        <el-table-column prop="order" label="序号" width="100px">
        </el-table-column>
        <el-table-column prop="reportTitle" label="报告标题" width="300px">
        </el-table-column>
        <el-table-column prop="statusDesc" label="报告状态" width="140px">
        </el-table-column>
        <el-table-column prop="createDate" label="生成时间" width="140px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewDetail(scope.row.reportId)">预览</el-button>
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="deleteDt(scope.row.reportId, scope.row.title)"
              v-if="scope.row.statusCode!=2"
            >删除</el-button>
            <el-button
              class="del_danger"
              type="text"
              size="small"
              @click="publish(scope.row.reportId)"
              v-if="scope.row.statusCode==0"
            >发布</el-button>
            <el-button
              class="del_danger"
              type="text"
              size="small"
              v-if="scope.row.statusCode==1"
              @click="withdraw(scope.row.reportId)"
            >取消发布</el-button>
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

      <el-dialog title="廉政报告" :visible.sync="dialogFormVisible" :append-to-body="true" custom-class="mgmt-central-report-detail">
        <div>
          <span class="dialog-title">报告标题</span>
          <el-input v-model="reportTitle" class="small-dialog-value" placeholder="请输入文章标题"></el-input>
        </div>
        <div class="dialog-row">
          <span class="dialog-title">报告周期</span>
          <el-date-picker
            v-model="periodStart"
            type="datetime"
            placeholder="开始日期" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
          -
          <el-date-picker
            v-model="periodEnd"
            type="datetime"
            placeholder="开始日期" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </div>
        <div class="dialog-row">
          <span class="dialog-title" style="float: left">关联附件</span>

          <el-upload
            accept=".pdf"
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :limit="1"
            :file-list="fileList">
            <el-button size="small" >点击上传</el-button>
            <div style="margin-left: 80px" slot="tip" class="el-upload__tip">只能上传一份pdf文件</div>
          </el-upload>
        </div>

        <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="danger" @click="addReport()">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    export default {
        name: "reportMgmt",
        data(){
            return {
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pageData: [],
                dialogFormVisible: false,
                reportTitle: '',
                periodStart: null,
                periodEnd: null,
                fileList: []
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                this.$api.get('report/list?type=0&page=1&size=10',null,res=>{
                  this.pageData=res.list;
                  let order = (this.pageIndex-1)*this.pageSize+1;
                  for(var i=0; i<this.pageData.length; i++){
                      this.pageData[i].order = order;
                      order ++;
                  }

                  this.pageIndex=res.pagebar.page;
                  this.totalSize=res.pagebar.size;
                  this.totalPage=res.pagebar.total;
              })
                // this.pageData=[
                //     {order: 1, title: '动态1', statusDesc: '已发布', status: 1, createdAt: '2019-11-23', id:1},
                //     {order: 1, title: '动态1', statusDesc: '草稿', status: 0, createdAt: '2019-11-23', id:1}
                // ]
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
            viewDetail(id){
              this.$api.get('report/detail?id='+id,null,res=>{
                this.reportTitle=res.data.reportTitle;
                this.periodStart=res.data.fromDate;
                this.periodEnd=res.data.toDate;
                this.dialogFormVisible=true;
              })
            },
            deleteDt(id){
              this.$api.get('report/delete?id='+id,null,res=>{
              })
            },
            publish(id){
              this.$api.get('report/publish?id='+id,null,res=>{
              })
            },
            withdraw(id){
              this.$api.get('report/cancel?id='+id,null,res=>{
              })
            },
            addReport(){
                this.dialogFormVisible = false;
                var obj = {
                  "reportTitle":this.reportTitle,
                  "fromDate":this.periodStart,
                  "toDate":this.periodEnd,
                  "createUserId":1,
                  "createUserName":"yangrenshan"
                };
                this.$api.post('report/save',obj,res=>{
                })
            }
        }
    }
</script>

<style>
  @import url("../../../assets/css/ref-dept.css");
  @import url("../../../assets/css/mgmt-central.css");
</style>
