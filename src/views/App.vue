<template>
  <div class="content">
     <Search-Bar 
        v-model:title="data.title"
        @search="onSearch"
     >
     </Search-Bar>
     <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in data.swipeArr" :key="index">
        <img v-lazy="image.index_pic" class="carousel-img"/>
      </van-swipe-item>
    </van-swipe>
    <div class="column sys-flex">
      <div v-for="(item,index) in data.columnArr" :key="index" class="sys-flex-column flex-center" @click="goDetail(item.id, item.title)"> 
        <img v-lazy="item.index_pic" alt="">
        <span class="title">{{item.title}}</span>
      </div>
    </div>
    <div class="shape-area"></div>
    <div class="main">
      <div class="sys-flex flex-between flex-center category">
        <div @click="Popup('all')">
          不限
          <van-icon name="arrow-down" />
        </div>
         <div @click="Popup('price')">
          价格
          <van-icon name="arrow-down" />
        </div>
         <div @click="Popup('type')">
          {{data.mode == 'house' ? '户型' : '车型'}}
          <van-icon name="arrow-down" />
        </div>
        <van-popup v-model:show="data.showPicker" round position="bottom">
          <van-picker
            :columns="data.chooseColumn"
            @cancel="data.showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
      </div>
      <van-list
          v-model:loading="data.loading"
          :finished="data.finished"
          finished-text="我是有底线的"
          :immediate-check="false"
          @load="onLoad"
          v-show="data.list.length"
        >
        <div v-for="item in data.list" :key="item" class="list sys-flex" @click="goDetail(item.id, item.title)">
          <img v-lazy="item.index_pic" alt="">
          <div class="sys-flex-column right-aside" v-if="data.mode == 'house'">
            <span class="title">{{item.title}}</span>
            <span class="address">{{item.address}}</span>
            <span class="house_type house_area">户型:{{item.house_type}} / 建面:{{item.build_area}}</span>
            <span class="price">{{item.price}}<i>元/㎡</i></span>
          </div>
          <div class="sys-flex-column right-aside" v-else>
            <span class="title">{{item.title}}</span>
            <span class="address">{{item.address}}</span>
            <span class="tel" v-if="item.tel">电话: {{item.tel}}</span>
            <span class="house_type house_area description">{{item.brief}}</span>
          </div>
        </div>
        </van-list>
         <van-empty 
         class="custom-image" 
         image="http://m2o.yqrtv.com/assets/images/mxu/error/img_nothing.png" 
         description="暂无数据" 
         v-show="!data.list.length"
         />
    </div>
  </div>
</template>

<script setup>
  import { Toast } from 'vant';
  import { defineProps, reactive, onMounted,ref } from 'vue'
  import SearchBar from 'comps/SearchBar.vue'
  import  * as API  from '../api';
  const { getSwipeList, getMiddleList, getBottomList, getType } = API.default
  const data = reactive({
    columnArr: [],
    swipeArr:[],
    list:[],
    showPicker:false,
    real_page:1,
    page:0,
    num:5,
    title:'',
    loading: false,
    finished: false,
    chooseColumn: [],
    options:{},
    mode: import.meta.env.MODE
  })
  let columns = new Map([
    [
      'all',
      [
        { text: '不限', value: '' , type: 'all'},
      ]
    ],
    [
      'price',
      [
        { text: '不限', value: '' , type: 'price_sort'},
        { text: '升序', value: 'asc', type: 'price_sort' },
        { text: '降序', value: 'desc', type: 'price_sort'  },
      ]
    ],
    [
      'type',
      [
         { text: '不限', value: '' , type: `${data.mode}_type`},
      ]
    ]
  ]);
  const isCilent = ref(SmartCity.isSmartCityApp())
  const Popup= (type) => {
    data.chooseColumn = columns.get(type)
    data.showPicker = true
  }
  const onConfirm = (res) => {
      data.real_page = 1,
      data.page = 0,
      data.num = 5
      data.list = []
      data.loading = true
      data.showPicker = false
      res.type == 'all' && (data.options = {})
      res.value == '' ? delete data.options[res.type] : data.options[res.type] = res.value
      getList()
  };
  const onSearch = (value) => {
    data.real_page = 1,
    data.page = 0,
    data.num = 5
    data.options['title'] = value
    // value.value == '' ? data.options = {} : data.options['title'] = value
    data.list = []
    data.loading = true
    getList()
  }
  const getSwipe = () => {
    getSwipeList().then((res) => {
      res.data?.map((item) => data.swipeArr.push({ index_pic: item.index_pic }))
    })
  }
  const getColumn = () => {
    getMiddleList().then((res) => {
      res.data?.map((item) => data.columnArr.push(
        { 
          id: item.id,
          index_pic: item.index_pic, 
          title: item.title,
        }
      ))
    })
  }
  const getTypes = () => {
    getType().then((res) => {
      res.data?.map((item, index) => {
        columns.get('type')[index + 1] = {
          text: item,
          value: item,
          type: `${data.mode}_type`
        }
      })
    })
  }
  const getList = () => {
    const param = {
      page: data.page,
      num: data.num,
      ...data.options
    }
    getBottomList(param).then((res) => {
      if(res.data.length) {
         res.data.map((item) => data.list.push(
          { 
            index_pic: item.index_pic, 
            title: item.title,
            brief: item.brief,
            id: item.id,
            ...item._extend 
          }
        ))
        if(data.real_page == 1) {
           Toast.clear()
        }
        data.loading = false;
      } else {
        data.finished = true;
      }
    })
  }
  const goDetail = (id, title) => {
    console.log(location.origin)
    // isCilent.value ?  SmartCity.linkTo({ innerLink: `${location.origin}/detail.html?id=${id}&title=${title}`}) : window.location.href = `./detail.html?id=${id}&title=${title}`
    isCilent.value ?  SmartCity.linkTo({ innerLink: `http://share.yqrtv.com/dist.${data.mode}/detail.html?id=${id}&title=${title}`}) : window.location.href = `./detail.html?id=${id}&title=${title}`
  }
  const onLoad = () => {
    data.real_page++ 
    data.page =  (data.real_page - 1) * data.num
    getList()
  };
  onMounted(() => {
    getSwipe();
    getTypes();
    getColumn();
    getList();
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
  })
</script>

<style lang="scss" scoped>
  @import "./src/assets/style/index.scss";
  .content {
    .carousel-img {
      width: 375px;
      height: 212px;
      object-fit: cover;
    }
    .column {
      flex-wrap: wrap;
      div {
        width: 25%;
        margin:10px 0;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-bottom: 4px;
        }
        .title {
          font-size: 12px;
          color: #7d8083;
        }
      }
    }
    .main {
      padding:0 20px;
      .category {
        color: #666;
        font-size: 14px;
        margin-bottom: 16px;
        height: 40px;
      }
      .list {
      margin-top: 16px;
       img {
         width:110px;
         height:100px;
         margin-right: 12px;
         border-radius: 4px;
       }
       .right-aside {
         span {
           display: block;
         }
         .title {
           font-size: 18px;
           color: #333;
           font-weight: 500;
           margin-bottom: 12px;
         }
         .address,.house_type {
           font-size: 12px;
           color: #999;
           margin-bottom: 4px;
         }
         .price {
           font-weight: 500;
           font-size: 16px;
           color:#F87703;
         }
         .description {
           font-size: 12px;
           @extend .price
         }
         .tel {
            font-size: 12px;
            color: #999;
            margin-bottom: 4px;
         }
       }
      }
    }
  }
</style>