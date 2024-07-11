<template>
	<div class="pItemContent">
		<van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="$router.back()" class="nav-border" fixed />
		<main class="mainContent">
			<!-- 轮播图 -->
			<van-swipe class="my-swipe" :autoplay="1500" indicator-color="#1989fa">
				<van-swipe-item v-for="item in detialData.imgList" :key="item.id">
					<img v-lazy="item.path" alt="" />
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
			<!-- 判断当前商品是否已经收藏 -->
			<van-goods-action-icon :icon="isLike ? 'like' : 'like-o'" text="收藏" @click="likeClick" />
			<van-goods-action-icon icon="cart-o" text="购物车" @click="cartClick" />
			<van-goods-action-button type="warning" text="加入购物车" @click="addCart" />
			<van-goods-action-button type="danger" text="立即购买" @click="buyClick" />
		</van-goods-action>
	</div>
</template>

<script>
	import storage from 'utils/storage'
	import {
		reqDetailData,
		reqLikePro,
		reqDelLike,
		reqUpdateCart
	} from 'network/api'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		name: 'Detial',
		data() {
			return {
				detialData: {}, //商品详情页数据
				active: 0 //tabs切换的下标
			}
		},
		//调用函数，开始时请求详情页数据
		created() {
			this.getDetialData();
		},
		methods: {
			...mapMutations(["changeLikeList"]),
			//点击购买 跳转到订单页
			buyClick() {
				//跳转订单页面
				//判断是否登录 ，没有登录 禁止存储数据
				if(!storage.session.get("token") || !this.userInfo){return this.$router.push("/login")};
				//从商品数据中取出订单所需要的信息
				const {id:product_id,imgList,name,price} = this.detialData;
				const cover = imgList[0].path;
				storage.session.set("orderList",[{product_id,cover,name,price,count:1}])
				this.$router.push("/orderConfirm");
			},
			//加入购物车
			async addCart() {
				//查看errcode 是0 或者 901101 就加入购物车成功
				//判errcode 来确定是否成功
				const {
					errcode,
				} = await reqUpdateCart({
					product_id: this.$route.query.id
				})
				if (errcode === 0 || errcode === 901101) return this.$toast('加入成功');
				this.$toast('加入失败')
				return ;
			},
			//点击购物车跳转到购物车界面
			cartClick() {
				this.$router.push("/cart");
			},
			//点击收藏 判断是否登录
			async likeClick() {
				const {
					id
				} = this.$route.query;

				if (this.isLike) {
					//已经收藏 需要取消收藏
					const {
						errcode,
					} = await reqDelLike(id)
					if (errcode !== 0) {
						return ;
					}
					this.changeLikeList(id)
				} else {
					//没有收藏 需要收藏
					const {
						errcode,
					} = await reqLikePro(id)
					if (errcode !== 0) {
						return ;
					}
					//从当前商品中取出id 名字等属性
					const {
						id: product_id,
						price,
						name,
						cover
					} = this.detialData
					this.changeLikeList({
						product_id,
						price,
						name,
						cover
					})
				}
			},
			//请求数据
			async getDetialData() {
				//this.$route.query.id 拿到点击商品的id
				const {
					data
				} = await reqDetailData(this.$route.query.id);
				this.detialData = data?.data ||  {};
			}
		},
		computed: {
			...mapState(['userInfo']),
			isLike() {
				//获取当前用户收藏商品的数据列表
				//第一次进入的时候state中还没有数据，some为空，给likeList取反
				if (!this.userInfo?.likeList) return;
				//判断当前商品 是否已经收藏
				return this.userInfo?.likeList.some(item => String(item.product_id) === this.$route.query.id);
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
