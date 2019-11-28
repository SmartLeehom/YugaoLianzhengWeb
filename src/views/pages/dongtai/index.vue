<template>
  <div>
    <div class="reference-department-header">
      <span class="reference-department-title">廉政动态</span>
    </div>
    <div class="reference-module-table">
      <div class="reference-module-item-box" style="max-height: 540px; overflow: scroll">
        <div class="reference-module-item" v-for="(item_f1, index_f1) in moduleData" :key="index_f1" @click="showdetail(item_f1)">
          <div class="reference-module-item-img">
            <img class="avatar-img" :src="item_f1.img" />
          </div>

          <div class="reference-module-item-content">
            <div class="reference-module-item-content-box" style="margin-top: 5px">
              <span class="reference-module-item-content-title" >{{item_f1.title}}</span>
            </div>
            <div class="reference-module-item-content-box" style="margin-top: 15px">
              <span class="reference-module-item-content-desc">{{item_f1.content}}</span>
            </div>
            <div class="reference-module-item-content-box" style="margin-top: 15px">
              <span class="reference-module-item-content-desc">发布时间：{{item_f1.createdAt}}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <el-pagination
      class="pagination"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10,20,30]"
      :page-size="pageSize"
      :total="totalPage"
      style="text-align: center"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
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
                    {id:1, img: require('../../../assets/img/bg_顶部.png'), title: '动态1', content: '123456', createdAt: '2019-1-1'},
                    {id:1, img: require('../../../assets/img/bg_底部.png'), title: '动态2', content: '789022', createdAt: '2019-1-1'},
                    {id:1, img: require('../../../assets/img/bg_顶部.png'), title: '动态1', content: '123456', createdAt: '2019-1-1'},
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
            showdetail(item){
                console.log(item.id);
            },
        }
    }
</script>

<style scoped>
  .reference-module-item{
    height: 100px;
    margin-top: 15px;
    width: 100%;
    overflow: hidden;
    cursor: pointer;
  }
  .reference-module-item-img{
    width: 18%;
    float: left;
  }
  .reference-module-item-content{
    width: 79%;
    float: right;
  }
  .avatar-img{
    width: 100%;
  }

  .reference-module-item-content-box{
    margin-left: 15px;
  }

  .reference-module-item-content-title{
    font-weight: bold;
    font-size: 16px;
    font-family: "Microsoft YaHei";
    color: #36373b;
  }

  .reference-module-item-content-desc{
    font-size: 14px;
    font-family: "Microsoft YaHei";
    color: #828386;
  }
</style>
