

<template>
  <div class="order-box">
    <s-header :name="'我的订单'" :back="'/user'"></s-header>
    <van-tabs @click-tab="onChangeTab" :color="'#1baeae'" :title-active-color="'#1baeae'" class="order-tab" v-model="state.status">
      <van-tab title="全部" name=''></van-tab>
      <van-tab title="待付款" name="0"></van-tab>
      <van-tab title="待确认" name="1"></van-tab>
      <van-tab title="待发货" name="2"></van-tab>
      <van-tab title="已发货" name="3"></van-tab>
      <van-tab title="交易完成" name="4"></van-tab>
    </van-tabs>
    <div class="content">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="order-list-refresh">
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
          @offset="10"
        >
          <div v-for="(item, index) in state.list" :key="index" class="order-item-box" @click="goTo(item.orderNo)">
            <div class="order-item-header">
              <span>订单时间：{{ item.createTime }}</span>
              <span>{{ item.orderStatusString }}</span>
            </div>
            <van-card
              v-for="one in item.newBeeMallOrderItemVOS"
              :key="one.orderId"
              :num="one.goodsCount"
              :price="one.sellingPrice"
              desc="全场包邮"
              :title="one.goodsName"
              :thumb="$filters.prefix(one.goodsCoverImg)"
            />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import sHeader from '@/components/SimpleHeader.vue'
import { getOrderList } from '@/service/order'
import { useRouter } from 'vue-router'

const router = useRouter()
const state = reactive({
  status: '',
  loading: false,
  finished: false,
  refreshing: false,
  list: [],
  page: 1,
  totalPage: 0
})

const loadData = async () => {
  const { data, data: { list } } = await getOrderList({ pageNumber: state.page, status: state.status })
  state.list = state.list.concat(list)
  state.totalPage = data.totalPage
  state.loading = false;
  if (state.page >= data.totalPage) state.finished = true
}

const onChangeTab = ({ name }) => {
  // 这里 Tab 最好采用点击事件，@click，如果用 @change 事件，会默认进来执行一次。
  state.status = name
  onRefresh()
}

const goTo = (id) => {
  router.push({ path: '/order-detail', query: { id } })
}

const goBack = () => {
  router.go(-1)
}

const onLoad = () => {
  if (!state.refreshing && state.page < state.totalPage) {
    console.log(state.page)
    console.log(state.totalPage)
    state.page = state.page + 1
  }
  if (state.refreshing) {
    state.list = [];
    state.refreshing = false;
  }
  loadData()
}

const onRefresh = () => {
  state.refreshing = true
  state.finished = false
  state.loading = true
  state.page = 1
  onLoad()
}
</script>

<style lang="scss" scoped>
  @use '../common/style/mixin' as *;
  .order-box {
    .order-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      @include fj();
      @include wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      @include boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .order-name {
        font-size: 14px;
      }
    }
    .order-tab {
      position: fixed;
      left: 0;
      z-index: 1000;
      width: 100%;
      border-bottom: 1px solid #e9e9e9;
    }
    .skeleton {
      margin-top: 60px;
    }
    .content {
      height: calc(~"(100vh - 70px)");
      overflow: hidden;
      overflow-y: scroll; 
      margin-top: 34px;
    }
    .order-list-refresh {
      .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .van-pull-refresh__head {
        background: #f9f9f9;
      }
      .order-item-box {
        margin: 20px 10px;
        background-color: #fff;
        .order-item-header {
          padding: 10px 20px 0 20px;
          display: flex;
          justify-content: space-between;
        }
        .van-card {
          background-color: #fff;
          margin-top: 0;
        }
      }
    }
  }
</style>
