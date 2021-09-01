<template>
  <div class="content">
    <van-nav-bar
      left-text="返回"
      left-arrow
      @click-left="goBack"
      v-if="!isCilent"
    />
    <div>
      <img v-lazy="data.index_pic" alt="" class="cover" />
    </div>
    <div class="house_image sys-flex" v-if="data.mode =='house'">
      <div v-for="(item,index) in data.house_image" :key="item.id"  @click="preview(data.house_image, index)">
        <img v-lazy="item" alt="" />
      </div>
    </div>
    <div class="shape-area"></div>
    <div class="detail">
      <div class="sys-flex-column center"  v-if="data.mode =='house'">
          <span class="title">{{ data.title }}</span>
          <span class="house_type house_area">户型:{{ data.extend.house_type }} / 建面:{{data.extend.build_area}}</span>
          <span class="price">{{ data.extend.price }}<i>元/㎡</i></span>
          <span class="address">售楼地址:{{ data.extend.address }}</span>
          <span class="address">房产地址:{{ data.extend.address }}</span>
      </div>
      <div class="sys-flex-column center"  v-else>
          <span class="title">{{ data.title }}</span>
          <span class="brand" v-if="data.extend.brand">主营品牌:{{data.extend.brand}}</span>
          <span class="description">{{data.brief}}</span>
           <span class="tel" v-if="data.extend.tel">电话: {{data.extend.tel}}</span>
          <span class="address" v-if="data.extend.address">地址: {{ data.extend.address }}</span>
      </div>
    </div>
     <div class="shape-area"></div>
     <div class="layout">
       <span>{{data.mode =='house' ? '楼盘图' : '车型图'}}</span>
     </div>
     <!-- 房产 -->
     <div class="house_layout_image sys-flex" v-if="data.mode =='house'">
      <div v-for="item in data.house_layout_image" :key="item.id" @click="preview(data.house_layout_image, index)">
        <img v-lazy="item" alt=""/>
      </div>
    </div>
    <!-- 车行 -->
    <div class="house_layout_image sys-flex" v-else>
      <div v-for="item in data.car_model_image" :key="item.id" @click="preview(data.house_layout_image, index)">
        <img v-lazy="item" alt=""/>
      </div>
    </div>
    <div class="shape-area"></div>
    <div class="layout">
        <span>{{data.mode =='house' ? '售楼处' : '店面图'}}</span>
    </div>
     <!-- 房产 -->
    <div class="house_sale_image sys-flex" v-if="data.mode =='house'">
      <div v-for="item in data.house_sale_image" :key="item.id">
        <img v-lazy="item" alt="" @click="preview(data.house_sale_image, index)"/>
      </div>
    </div>
     <!-- 车行 -->
    <div class="house_sale_image sys-flex" v-else>
      <div v-for="item in data.car_4s" :key="item.id">
        <img v-lazy="item" alt="" @click="preview(data.house_sale_image, index)"/>
      </div>
    </div>
    <div class="booking" v-if="data.extend.tel">
      <van-button type="primary" block :url="`tel:${data.extend.tel}`" color="#0383f8;" v-if="!isCilent">{{data.book_tel}}</van-button>
      <van-button type="primary" block color="#0383f8;" v-else @click="call(data.extend.tel)">{{data.book_tel}}</van-button>
    </div>
  </div>
</template>

<script setup>
import { ImagePreview, Toast } from "vant";
import { defineProps, reactive, onMounted, ref } from "vue";
 import SearchBar from 'comps/SearchBar.vue'
import  * as API  from '../api';
  const { getDetail } = API.default
const id = new URLSearchParams(location.search).get("id");
const data = reactive({
  swipeArr: [],
  key: "",
  index_pic: "",
  show: false,
  index: 0,
  house_image: [],
  house_layout_image: [],
  house_sale_image: [],
  car_4s: [],
  car_model_image:[],
  extend: {},
  book_tel: import.meta.env.VITE_APP_BOOK,
  title:'',
  mode: import.meta.env.MODE
});
const isCilent = ref(SmartCity.isSmartCityApp())
const getData = () => {
  getDetail({ id: id }).then((res) => {
    let response = res.data.data
    if (response) {
      Toast.clear();
      data.index_pic = response.indexpic.host + response.indexpic.filepath + response.indexpic.filename;
      data.title = response.title;
      data.brief = response.brief;
      data.extend = response._extend;
      data.house_image = response.house_image?.map(item => item.pic.host + item.pic.filepath + item.pic.filename);
      data.house_layout_image = response.house_layout_image?.map(item => item.pic.host + item.pic.filepath + item.pic.filename);
      data.house_sale_image = response.house_sale_image?.map(item => item.pic.host + item.pic.filepath + item.pic.filename);
      data.car_4s = response.car_4s?.map(item => item.pic.host + item.pic.filepath + item.pic.filename);
      data.car_model_image = response.car_model_image?.map(item => item.pic.host + item.pic.filepath + item.pic.filename);
    }
  });
};
const preview = (images,index) => {
  ImagePreview({
    images: images,
    startPosition: index,
  });
};
const goBack = () => {
  isCilent.value ? SmartCity.goBack() : history.go(-1)
}
const call = (tel) => {
  SmartCity.makeCall({
    tel : tel
  });
}
const onSearch = (value) => {
    data.real_page = 1,
    data.page = 0,
    data.num = 5
    value == '' ? data.options = {} : data.options['title'] = value
    data.list = []
    data.loading = true
    getHouseList()
}
onMounted(() => {
  getData();
  Toast.loading({
    message: "加载中...",
    forbidClick: true,
    loadingType: "spinner",
  });
});
</script>

<style lang="scss" scoped>
@import "./src/assets/style/index.scss";
.content {
  padding-bottom: 18px;
  header {
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    .arrow-left {
      font-size: 18px;
      margin-left: 8px;
    }
    .van-search {
      width: 375px;
      margin-right: 10px;
      .n-input {
        border-radius: 100px !important;
      }
    }
  }
  .cover {
    width: 375px;
    height: 212px;
    object-fit: cover;
  }
  .detail {
    padding: 0 16px;
    margin: 16px 0;
    .center {
      span {
        display: block;
      }
      .title {
        font-size: 18px;
        color: #333;
        font-weight: 500;
        margin-bottom: 12px;
      }
      .address,
      .house_type {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }
      .price {
        font-weight: 500;
        font-size: 16px;
        color: #f87703;
        margin-bottom: 6px;
      }
      .description {
        font-size:16px;
        @extend .price
      }
      .tel {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }
      .brand {
        @extend .tel
      }
    }
  }
  .layout {
    margin-top: 18px;
    padding: 0 16px;
    font-size: 16px;
    font-weight: 500;
    color: #333333;
  }
  .house_image {
    padding: 0 16px;
    div {
      overflow-x: auto;
      flex-wrap: nowrap;
    }
    img {
      width: 110px;
      height: 110px;
    }
  }
  .house_layout_image {
    padding: 0 16px;
    margin-bottom: 16px;
    div {
      margin-top:6px;
    }
    flex-wrap: wrap;
     img {
      width: 110px;
      height: 100px;
      border-radius: 4px;
    }
    :nth-child(3n-1) {
      margin:6px 7px 0 6px;
    }
  }
  .house_sale_image {
    @extend .house_layout_image
  }
  .booking {
    position: fixed;
    bottom: 19px;
    left: 16px;
    button {
      border-radius: 12px;
      width: 343px;
      text-align: center;
    }
  }
}
</style>