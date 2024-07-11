<template>
  <div class="">
    <!-- navbar -->
    <van-nav-bar
      title="选择城市"
      :left-text="loactionCity"
      left-arrow
      @click-left="$router.back()"
      class="nav_border"
      fixed
    />
    <main style="margin-top:47px">
      <van-index-bar>
        <template v-for="(value, index) in cityList">
          <van-index-anchor :index="index !== 0 ? value.id : '常用地区'" />
          <van-cell :title="item.name" v-for="item in value.children" :key="item.id"  @click="selectCity(item.name)"/>
        </template>
      </van-index-bar>
    </main>
  </div>
</template>

<script>
import { mapState , mapMutations} from 'vuex'
import { reqCityAll } from 'network/api'

export default {
  name: '',
  data() {
    return {
      cityList: {},
    }
  },
  created() {
    this.getCityList()
  },
  methods: {
    ...mapMutations(["changeLoactionCity"]),
    //选择城市
    selectCity(city){
      this.changeLoactionCity(city)
      this.$router.back()
    },
    //获取城市列表
    async getCityList() {
      const { data } = await reqCityAll();
      this.cityList = data?.address || [];
    },
  },
  computed: {
    ...mapState(['loactionCity']),
  },
}
</script>

<style lang="less" scoped>
main{
  height: calc(100vh - 46px);
  overflow-y:scroll;
}
</style>
