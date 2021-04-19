<template>
	<div class="pItemContent">
		<van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="$router.back()" class="nav-border" fixed />
		<main class="mainContent">
			<!-- 轮播图 -->
			<van-swipe class="my-swipe" :autoplay="1500" indicator-color="#1989fa">
				<van-swipe-item v-for="item in detialData.imgList" :key="item.id">
					<img :src="item.path" alt="" />
				</van-swipe-item>
			</van-swipe>

			<!-- 标题 价格 -->
			<van-cell-group>
				<van-cell :title="detialData.name" :label="detialData.price" />
			</van-cell-group>

			<!-- 销量  -->
			<van-cell-group>
				<van-cell>
					<van-row>
						<van-col span="10">免运费</van-col>
						<van-col span="14">剩余：{{ detialData.stock || 0 }}</van-col>
					</van-row>
				</van-cell>
				<van-cell>
					<van-row>
						<van-col span="10">销量：{{ detialData.sales }}</van-col>
						<van-col span="14">收藏：{{ detialData.likes }}</van-col>
					</van-row>
				</van-cell>
			</van-cell-group>

			<!-- 参数切换 -->
			<van-tabs v-model="active" sticky offset-top="46px">
				<van-tab title="图片">
					<img v-for="item in detialData.detailImgList" :key="item.id" :src="item.path" alt="" />
				</van-tab>
				<van-tab title="参数">
					<van-cell-group>
						<van-cell v-for="item in detialData.properties" :key="item.id">
							<van-row>
								<van-col span="10">{{ item.name }}</van-col>
								<van-col span="14">{{ item.detail }}</van-col>
							</van-row>
						</van-cell>
					</van-cell-group>
				</van-tab>
			</van-tabs>
		</main>

		<!-- GoodsAction 底部购物车参数 -->
		<van-goods-action>
		  <van-goods-action-icon icon="like-o" text="客服"/>
		  <van-goods-action-icon icon="cart-o" text="购物车"/>
		  <van-goods-action-button type="warning" text="加入购物车" />
		  <van-goods-action-button type="danger" text="立即购买" />
		</van-goods-action>
	</div>
</template>

<script>
	import {
		reqDetailData
	} from 'network/api'
	export default {
		name: 'Detial',
		data() {
			return {
				detialData: {}, //商品详情页数据
				active: 0
			}
		},
		created() {
			this.getDetialData()
		},
		methods: {
			async getDetialData() {
				//this.$route.query.id 拿到点击商品的id
				let {
					data
				} = await reqDetailData(this.$route.query.id)
				this.detialData = data
				console.log(this.detialData)
			}
		}

	}
</script>

<style lang="less" scoped>
	.my-swipe .van-swipe-item {
		color: #fff;
		height: 6rem;
		text-align: center;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.van-cell__label {
		color: #f50;
	}

	.van-row {
		font-size: 12px;
	}

	.van-tabs img {
		width: 100%;
	}
</style>
