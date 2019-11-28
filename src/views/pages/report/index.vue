<template>
  <div>
    <div class="reference-department-header">
      <span class="reference-department-title">廉政报告</span>
    </div>
    <div class="reference-module-table">
      <el-table :data="moduleData" class="table-wrap" style="width: 100%" max-height="520px">
        <el-table-column prop="num" label="报告编号" width="200px">
        </el-table-column>
        <el-table-column prop="moduleName" label="模板名称" width="350px">
        </el-table-column>
        <el-table-column prop="uploadDate" label="上传时间" width="160px">
        </el-table-column>
        <el-table-column prop="action" label="操作" width="158">
          <template slot-scope="scope">
            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="download(scope.row.id)"
            >下载</el-button>

            <el-button
              class="edit_green"
              type="text"
              size="small"
              @click="view(scope.row.id)"
            >查阅</el-button>
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
    export default {
        name: "refmodule",
        data(){
            return {
                moduleData: [],
                totalPage: 1,
                pageIndex: 1,
                pageSize: 10,
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                this.moduleData = [
                    {id: 1, num: 1, moduleName: '模板1', uploadDate: '2010-1-1'}
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
            download(id){
                //下载附件
            },
            view(id){
                //预览附件
            }
        }
    }
</script>

<style>
  @import url("../../../assets/css/ref-dept.css");
</style>
