<template>
  <header class="sys-flex">
    <van-icon
      name="arrow-left"
      color="#999"
      class="arrow-left"
      @click="goBack()"
      v-if="!isCilent"
    />
    <van-search
      v-model="title"
      shape="round"
      placeholder="搜索关键字"
      input-align="center"
      left-icon="''"
      show-action
      @clear="search()"
    >
      <template #action>
        <div @click="search()"><van-icon name="search" /></div>
      </template>
    </van-search>
  </header>
</template>

<script setup>
import { defineProps, ref } from "vue";
const props = defineProps({
  title: String,
});
// 不用ref包裹，打包后的代码会报错
const title = ref(props.title)
const isCilent = ref(SmartCity.isSmartCityApp())
const goBack = () => {
  isCilent.value ? SmartCity.goBack() : history.go(-1)
}
const emit = defineEmit(['search'])
const search = () => {
  emit('search', title)
}
</script>

<style scoped lang="scss">
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
    .n-input {
      border-radius: 100px !important;
    }
  }
}
</style>
