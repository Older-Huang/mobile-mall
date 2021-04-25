<template>
	<div class="">
		<van-nav-bar title="设置头像" left-text="返回" left-arrow @click-left="$router.replace({path:'/me'})"
			class="nav_border" />
		<div class="showAvatar">
			<img :src="imgSrc" alt="" ref="img">
		</div>

		<div class="btns">
			<input type="file" ref="file" style="display:none" @change="fileChange" />
			<van-button type="info" size="large" @click="selectImg">选择图片</van-button>
			<van-button type="primary" size="large" @click="uploadAvatar">上传图片</van-button>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		IMGURl,
		reqUploadAvatar
	} from 'network/api'
	export default {

		name: '',
		data() {
			return {
				imgUrl: IMGURl
			}
		},
		methods: {
			...mapMutations(["changeAvatar"]),
			//上传图片
			async uploadAvatar() {
				//判断文件长度
				if (this.$refs.file.files.length <= 0) return this.$toast("请先选择图片")
				let formData = new FormData()
				formData.append("avatar", this.$refs.file.files[0])
				const {
					errcode,
					data
				} = await reqUploadAvatar(formData)
				if (errcode !== 0) return this.$toast("上传失败")
				this.changeAvatar(data.avatar)
				this.$router.replace("/me")
			},
			fileChange() {
				//取文件的第一个
				let file = this.$refs.file.files[0]
				//创建读取文件的对象
				let reader = new FileReader()
				//读去文件内容
				reader.readAsDataURL(file)
				reader.onload = () => {
					this.$refs.img.src = reader.result
				}
			},
			//点击选择图片
			selectImg() {
				this.$refs.file.click()
			},
		},
		computed: {
			...mapState(["userInfo"]),
			imgSrc() {
				const {
					avatar
				} = this.userInfo
				console.log(avatar)
				return avatar ? this.imgUrl + avatar : require('assets/img/profile.png')
			}
		}

	}
</script>

<style lang="less" scoped>
	.avatar {
		background: #f8f8f8;
		height: 100vh;
	}

	.btns {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.showAvatar {
		width: 100px;
		height: 100px;
		border: 1px solid #eee;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
		border-radius: 50%;
		margin: auto;
		margin-top: 100px;

		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
</style>
