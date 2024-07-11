<template>
	<div class="cart">
		<van-nav-bar title="购物车" left-text="返回" left-arrow @click-left="$router.back()" class="nav-border" fixed />
		<main class="mainContent cartMain">
			<template v-if="isCartNull">
				<van-checkbox v-model="item.checked" v-for="item in cartList" :key="item.product_id"
					@change="itemChangeCheck(item)">
					<van-card :price="item.price.toFixed(2)" :title="item.name" :thumb="item.cover" @click.stop>
						<template #footer>
							<van-tag type="danger" size="large" @click="itemDel(item.product_id)">删除</van-tag>
							<van-stepper v-model="item.count" disable-input @change="itemChangeVal(item)" />
						</template>
					</van-card>
				</van-checkbox>
			</template>
			<template v-else>
				<div class="cartNull">
					<div class="cartNull-content">
						<van-icon name="warning-o" />
						<p>您的购物车为空</p>
					</div>
				</div>
			</template>
		</main>
		<template v-if="isDisButton">
			<van-submit-bar :price="totalPrice" button-text="提交订单" class="tab_border"  @submit="onSubmit">
				共计：{{totalCount}}件
			</van-submit-bar>
		</template>
		<template v-else>
			<van-submit-bar :price="totalPrice" button-text="提交订单" disabled class="tab_border">
				共计：{{totalCount}}件
			</van-submit-bar>
		</template>
	</div>
</template>

<script>
	import storage from 'utils/storage'
	import {
		reqCartAll,
		reqUpdateCart,
		reqDelCart
	} from 'network/api'
	export default {
		name: 'Cart',
		data() {
			return {
				checked: true, //复选框的状态
				proNum: 0, //总共多少件
				sum: 0, //购物车商品的总和
				cartList: [] //购物车商品列表
			}
		},
		created() {
			this.getCartDate();
		},
		methods: {
			//跳转到确定订单页面
			onSubmit(){
				//将要购买的商品数据存放到本地存储当中
				this.$router.push({ path: '/orderConfirm', query: { cart: 1 } });
				let orderList =[]
				this.cartList.forEach(item =>{
					if(item.checked){
						let {product_id,price,name,cover,count} = item
						orderList.push({product_id,price,name,cover,count})
					}
				})
				storage.session.set("orderList",orderList);
			},
			//删除商品
			async itemDel(product_id) {
				//删除当前点击的商品
				await reqDelCart(product_id);
				//将删除的这一项从列表中移除
				this.cartList = this.cartList.filter(item => item.product_id != product_id)
			},
			//步进器 方法与复选框一样
			async itemChangeVal(item) {
				let {
					product_id,
					count
				} = item
				await reqUpdateCart({
					product_id,
					count
				});
			},

			//复选框的状态
			async itemChangeCheck(item) {
				//取出当前商品数据中的check的状态
				let {
					checked,
					product_id
				} = item;
				//保留check的状态
				await reqUpdateCart({
					product_id,
					checked
				})
			},
			

			//获取购物车数据
			async getCartDate() {
				//查看购物车中的数据
				//获取购物车中的数据
				const {
					data
				} = await reqCartAll();

				this.cartList = data;
			}
			
		},
		computed: {
			//总计商品件数
			totalPrice() {
				if(!this.cartList) return 0
			return this.cartList.reduce((pre, cur) => {
				return cur.checked ? pre + cur.count*cur.price : pre
				}, 0)*100
				// return this.sum
			},
			
			//总计商品件数
			totalCount() {
				if(!this.cartList) return 0
			return this.cartList.reduce((pre, cur) => {
				return cur.checked ? pre + cur.count : pre
				}, 0)
				// return this.proNum
			},
			//判断购物车是否为空
			isCartNull() {
				if(!this.cartList) return false
				if(this.cartList.length > 0) return true
				return false
			},
			//是否禁用提交按钮
			isDisButton(){
				if(!this.cartList) return false
				if(this.cartList.length > 0) return true
			}
		}
	}
</script>

<style lang="less" scoped>
	.cartMain {
		background: #fbfbfb;
		padding: .08rem;
		overflow-y: scroll;

		.cartNull {
			position: fixed;
			width: 100%;
			height: 100%;
			left: 50%;
			transform: translate(-50%);
			text-align: center;
			background: rgba(150, 150, 150, .1);

			.cartNull-content {
				padding-top: 15vh;

				.van-icon {
					font-size: 1.8rem;
					color: rgba(150, 150, 150, .4);
				}

				p {
					color: rgba(150, 150, 150, .4);
					font-size: .48rem;
				}
			}

		}

		.van-checkbox {
			padding: .2rem;
			margin-bottom: .16rem;
			box-shadow: 0 0 2px rgba(1, 1, 1, .9);

			.van-card__price {
				color: #f50;
			}

			.van-card__footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			/deep/ .van-checkbox__label {
				flex: 1,
			}

			.van-stepper {
				display: inline-block;
			}
		}

	}
</style>
