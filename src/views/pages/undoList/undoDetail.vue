<template>
    <div>
      <div class="reference-department-header">
        <span class="reference-department-title">{{title}}</span>
      </div>

      <div style="width: 100%; text-align: center; margin-top: 50px">
        <span style="font-size: 18px; font-weight: bold">消息内容</span>
      </div>
      <div style="width: 100%; text-align: center; margin-top: 21px; border-bottom: 1px solid #828386; padding-bottom: 15px">
        <span style="font-size: 14px; ">{{createdAt}}</span>
      </div>

      <div style="width: 100%; margin-top: 40px">
        <span >{{remarks}}</span>
        <el-button
          class="edit_green"
          type="text"
          size="small"
          v-if="isToView"
          @click="viewReferenceDetail()"
        >前往查看</el-button>
      </div>
    </div>
</template>

<script>
    export default {
        name: "undoDetail",
        data(){
            return{
                title: '首页 > 消息中心 > 详情',
                createdAt: '',
                remarks: '',
                isToView: true,
                entity: null
            }
        },
        mounted(){
            if(this.$route.params.id){
                this.getData(this.$route.params.id)
            }
            else{
                this.$message('请重新打开页面')
            }
        },
        methods:{
            getData(id){
                this.$api.get('undo/detail?id='+id, null, res=>{
                    if(res.code.toString() != '0' || !res.data){
                        this.$message('查询数据失败')
                        return;
                    }

                    this.entity = res.data;
                    this.createdAt = res.data.createdAt.split(' ')[0]
                    this.remarks = res.data.remarks;
                    this.isToView = res.data.type.toString() == '1';
                    if(this.isToView){
                        this.updateEntityStatus()
                    }
                });
            },
            //修改状态
            updateEntityStatus(){
                this.entity.status = 1;
                this.$api.post('undo/addOrUpdate', this.entity, res=>{
                })
            },
            viewReferenceDetail(){
                this.$api.get('reference/findById',{id: this.entity.lianzhengReferenceId}, res=> {
                    if (res.code.toString() != "0") {
                        this.$message("查询失败")
                        return false;
                    }

                    if(res.data.type.toString() == "1"){
                        // 进入集团部门资料详情查看页面
                        this.iframeUrl = 'reference'
                        this.$router.push({
                            name: 'reference',
                            params:{id: res.data.lianzhengReferenceId, type: "1", title: res.data.title, isEdit: false, returnBack:-1}
                        })
                    }
                    else{
                        // 进入工程资料详情查看页面
                        this.iframeUrl = 'reference'
                        this.$router.push({
                            name: 'reference',
                            params:{id: res.data.lianzhengReferenceId, type: "3", title: res.data.title, isEdit: false, returnBack:-1}
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
  @import url("../../../assets/css/ref-dept.css");
</style>
