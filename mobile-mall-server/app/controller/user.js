const Controller = require('egg').Controller;
const { codeMap: statusCode, errorRep, isSuccess, loginRules } = require('../public/common');
const { encrypt } = require('../public/crypt');
const fs = require('node:fs/promises');

const getRendomStr = () => Math.random().toString(16).slice(-8);

class UserController extends Controller {
  async login() {
    const { ctx, app, config } = this;
    const { name, password } = ctx.request.body;
    const nameTest = loginRules.username.test(name);
    const passwordTest = loginRules.password.test(password);

    if (!nameTest || !passwordTest) {
        return {
            ...errorRep,
            message: '用户账号或密码格式不正确'
        }
    }
    const user = await app.mysql.get('user', { name });
    let result;
    let message;

    if (user) {
        if (password !== user.password) {
            return {
                code: statusCode.ERROR,
                message: '密码错误',
            };
        } else {
            result = user
        }
    } else {
        const cart = await app.mysql.insert('cart', { productList: JSON.stringify([]) });
        let cartId;
        if (cart && isSuccess(cart)) {
            cartId = cart.insertId;
        } else {
            return errorRep;
        }

        const data = {
            name,
            nickName: null,
            password,
            payPassword: '123456',
            avatar: null,
            likeList: JSON.stringify([]),
            addressList: JSON.stringify([]),
            cart: cartId,
            order: JSON.stringify([]),
        };
        result = await app.mysql.insert('user', data);
        if (!result || !isSuccess(result)) {
            return errorRep;
        }
        result = await app.mysql.get('user', { name });
        if (!result || !isSuccess(result)) {
            return errorRep;
        }
        message = '用户注册成功';
    }

    return {
        code: statusCode.SUCCESS,
        data: {
            ...result,
            likeList: JSON.parse(result.likeList),
            addressList: JSON.parse(result.addressList),
            token: encrypt(`${result.id}`),
        },
        message,
    }
  }

  async updateCollect() {
    const { ctx, app } = this;
    const { userInfo, request } = ctx;
    const { body } = request;
    const newErrorRep = {
        ...errorRep,
        errcode: statusCode.ERROR,
    };
    const newSuccessRep ={
        message: '',
        data: null,
        errcode: 0
    };
    
    if (!userInfo.likeList || body.product_id !== 0 && !body.product_id) {
        newErrorRep.message = userInfo.message;
        newErrorRep.errcode = userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED;
        return newErrorRep;
    }
    
    const list = JSON.parse(userInfo.likeList);
    if (list.some(item => item.product_id === body.product_id)) {
        return newSuccessRep;
    }
    const product = await app.mysql.get('product', { id: body.product_id })
    if (!product) {
        return newErrorRep;
    }
    list.push({
        product_id: body.product_id,
        name: product.name,
        price: product.price,
        cover: product.cover,
    });
    const result = await app.mysql.update('user', { id: userInfo.id, likeList: JSON.stringify(list) });
    
    if (!result || !isSuccess(result)) {
        newErrorRep.message = userInfo.message;
        return newErrorRep;
    }

    return newSuccessRep;
  }

  async deleteCollect() {
    const { ctx, app } = this;
    const { query, userInfo } = ctx;
    const newErrorRep = {
        ...errorRep,
        errcode: statusCode.ERROR,
    };
    const newSuccessRep ={
        message: '',
        data: null,
        errcode: 0
    };

    if (!userInfo.likeList || query.product_id !== 0 && !query.product_id) {
        newErrorRep.message = userInfo.message;
        newErrorRep.errcode = userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED;
        return newErrorRep;
    }
    
    const list = JSON.parse(userInfo.likeList);
    if (!list.some(item => item.product_id === query.product_id)) {
        return newSuccessRep;
    }
    const index = list.findIndex(item => item.product_id === query.product_id);
    list.splice(index, 1);
    const result = await app.mysql.update('user', { id: userInfo.id, likeList: JSON.stringify(list) });
    if (!result) {
        return newErrorRep;
    }

    return newSuccessRep;
  }

  async updateCart() {
    const { ctx, app, config } = this;
    const { userInfo, request } = ctx;
    const { body } = request;
    const { product_id, count, checked } = body;
    const productId = Number(product_id);
    const newErrorRep = {
        ...errorRep,
        errcode: statusCode.ERROR,
    };
    const newSuccessRep ={
        message: '',
        data: null,
        errcode: 0
    };

    if (!userInfo.cart || productId !== 0 && !productId) {
        newErrorRep.message = userInfo.message;
        newErrorRep.errcode = userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED;
        return newErrorRep;
    }
    
    const cartInfo = await app.mysql.get('cart', { id: userInfo.cart });
    if (!cartInfo) {
        return newErrorRep;
    }
    let cartList = JSON.parse(cartInfo.productList);
    const product = cartList.find(item => item.product_id === productId)
    if (product) {
        if (count !== undefined) {
            product.count = count;
        }
        if (checked !== undefined) {
            product.checked = checked;
        }
        if (count === undefined && checked === undefined) {
            product.count++;
        }
    } else {
        cartList.push({
            checked: false,
            product_id: productId,
            count: 1,
        });
    }

    const result = await app.mysql.update('cart', { id: userInfo.cart, productList: JSON.stringify(cartList) });
    if (!result || !isSuccess(result)) {
        return newErrorRep;
    }
    
    return newSuccessRep;
  }

  async fetchCart () {
    const { ctx, app } = this;
    const { userInfo } = ctx;

    if (!userInfo.cart) {
        return {
            ...errorRep,
            message: userInfo.message || '',
            errcode: userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED,
        };
    }
    const result = await app.mysql.get('cart', { id: userInfo.cart });
    if (!result) {
        return errorRep;
    }
    
    let { productList } = result;
    productList = JSON.parse(productList);
    const requestList = [];
    for (let i = 0; i < productList.length; i++) {
        const { product_id } = productList[i];
        requestList.push(app.mysql.get('product', { id: product_id }));
    }
    let data = await Promise.all(requestList);
    data = data.map(item => {
        if (!item) {
            return {};
        }
        const cartItem = productList.find(product => Number(product.product_id) === item.id)

        return {
            ...(cartItem || {}),
            product_id: item.id,
            name: item.name,
            cover: item.cover,
            price: item.price,
        };
    })

    return {
        message: '',
        data,
        errcode: 0
    }
  }

  async deleteCart () {
    const { ctx, app } = this;
    const { userInfo, query } = ctx;
    const newSuccessRep ={
        message: '',
        data: null,
        errcode: 0
    };
    const newErrorRep = {
        ...errorRep,
        errcode: statusCode.ERROR,
    };

    if (!userInfo.cart || !query.product_id) {
        return {
            ...errorRep,
            message: userInfo.message || '',
            errcode: userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED,
        };
    }
    const cartInfo = await app.mysql.get('cart', { id: userInfo.cart });
    if (!cartInfo) {
        return errorRep;
    }
    let { productList } = cartInfo;
    productList = JSON.parse(productList);
    const index = productList.findIndex(item => item.product_id === Number(query.product_id));
    if (index === -1) {
        return newSuccessRep;
    }
    productList.splice(index, 1);
    const result = await app.mysql.update('cart', { id: userInfo.cart, productList: JSON.stringify(productList) });
    if (!result || !isSuccess(result)) {
        return newErrorRep;
    }

    return newSuccessRep;
  }

  async createAddress () {
    const { ctx, app } = this;
    const { userInfo, request } = ctx;
    const newSuccessRep ={
        message: '',
        data: null,
        errcode: 0
    };
    const newErrorRep = {
        ...errorRep,
        errcode: statusCode.ERROR,
    };

    if (!userInfo.addressList || !request.body.name) {
        return {
            ...errorRep,
            message: userInfo.message || '',
            errcode: userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED,
        };
    }
    const addressList = JSON.parse(userInfo.addressList);
    const data = {
        ...request.body,
        id: getRendomStr(),
    }
    addressList.push(data);
    const result = await app.mysql.update('user', { id: userInfo.id, addressList: JSON.stringify(addressList) });
    if (!result || !isSuccess(result)) {
        return newErrorRep;
    }

    return {
        ...newSuccessRep,
        data,
    };
  }

  async updateAddress () {
    const { ctx, app } = this;
    const { userInfo, query, request } = ctx;
    const newSuccessRep ={
        message: '',
        data: null,
        errcode: 0
    };
    const newErrorRep = {
        ...errorRep,
        errcode: statusCode.ERROR,
    };

    if (!userInfo.addressList || !query.id || !request.body.name) {
        return {
            ...errorRep,
            message: userInfo.message || '',
            errcode: userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED,
        };
    }
    const addressList = JSON.parse(userInfo.addressList);
    let address = addressList.find(item => item.id === query.id);
    if (address) {
        let index = addressList.findIndex(item => item.id === query.id);
        address = {
            ...request.body
        };
        addressList.splice(index, 1, address);
    } else {
        addressList.push({
            ...request.body,
            id: getRendomStr(),
        });
    }
    const result = await app.mysql.update('user', { id: userInfo.id, addressList: JSON.stringify(addressList) });
    if (!result || !isSuccess(result)) {
        return newErrorRep;
    }

    return newSuccessRep;
  }

  async deleteAddress () {
    const { ctx, app } = this;
    const { userInfo, query } = ctx;
    const newSuccessRep ={
        message: '',
        data: null,
        errcode: 0
    };
    const newErrorRep = {
        ...errorRep,
        errcode: statusCode.ERROR,
    };

    if (!userInfo.addressList || !query.id) {
        return {
            ...errorRep,
            message: userInfo.message || '',
            errcode: userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED,
        };
    }
    const addressList = JSON.parse(userInfo.addressList);
    let index = addressList.findIndex(item => item.id === query.id);
    if (index === -1) {
        return newSuccessRep;
    }
    addressList.splice(index, 1);
    const result = await app.mysql.update('user', { id: userInfo.id, addressList: JSON.stringify(addressList) });
    if (!result || !isSuccess(result)) {
        return newErrorRep;
    }

    return newSuccessRep;
  }

  async fetchCollect() {
    const { ctx } = this;
    const { userInfo } = ctx;

    if (!userInfo.id) {
        return {
            ...errorRep,
            message: userInfo.message || '',
            errcode: statusCode.EXPIRED,
        };
    }

    return {
        message: '',
        data: JSON.parse(userInfo.likeList),
        errcode: 0,
    }
  }

  async fetchUserInfo() {
    const { ctx } = this;
    const { userInfo } = ctx;

    if (!userInfo.id) {
        return {
            ...errorRep,
            message: userInfo.message || '',
            errcode: statusCode.EXPIRED,
        };
    }

    return {
        message: '',
        data: {
            ...userInfo,
            likeList: JSON.parse(userInfo.likeList),
            addressList: JSON.parse(userInfo.addressList),
            avatar: userInfo.avatar ? userInfo.avatar.data : null,
        },
        errcode: 0,
    }
  }

  async updateUserInfo() {
    const { ctx, app } = this;
    const { userInfo, request, getFileStream } = ctx;
    const { body, url, files } = request;
    const newSuccessRep = {
        message: '',
        data: null,
        errcode: 0,
    };
    const newErrorRep = {
        ...errorRep,
        errcode: statusCode.ERROR,
    };

    if (!userInfo.id) {
        return {
            ...errorRep,
            message: userInfo.message || '',
            errcode: statusCode.EXPIRED,
        };
    }

    let result;
    if (body.nickname) {
        if (body.nickname === userInfo.nickName) {
            return newSuccessRep;
        }
        result = await app.mysql.update('user', { id: userInfo.id, nickName: body.nickname });
        
    }
    if (url.endsWith('/avatar')) {
        const avatarFile = files[0];
        try {
            const avatarBuffer = await fs.readFile(avatarFile.filepath);
            const res = await app.mysql.insert('img', { img: avatarBuffer });
            if (!res || !isSuccess(res)) {
                return newErrorRep;
            }
            const avatarPath = `/api/v2/img?id=${res.insertId}`;
            result = await app.mysql.update('user', { id: userInfo.id, avatar: avatarPath });
            newSuccessRep.data = {
                avatar: avatarPath,
            };
        } finally {
            await fs.unlink(avatarFile.filepath);
        }
    }
    if (body.password) {
        if (url.endsWith('/updatePassword')) {
            if (userInfo.password !== body.password) {
                return {
                    ...newErrorRep,
                    message: '旧密码不正确',
                };
            }
            if (userInfo.password === body.newPassword) {
                return {
                    ...newErrorRep,
                    message: '新旧密码不能相同',
                };
            }
            if (!loginRules.password.test(body.newPassword)) {
                return {
                    ...newErrorRep,
                    message: '新密码格式不正确',
                };
            }
            result = await app.mysql.update('user', { id: userInfo.id, password: body.newPassword });
        } else {
            if (userInfo.payPassword !== body.password) {
                return {
                    ...newErrorRep,
                    message: '旧密码不正确',
                };
            }
            if (userInfo.payPassword === body.newPassword) {
                return {
                    ...newErrorRep,
                    message: '新旧密码不能相同',
                };
            }
            result = await app.mysql.update('user', { id: userInfo.id, payPassword: body.newPassword });
        }
    }
    if (!result || !isSuccess(result)) {
        return newErrorRep;
    }

    return newSuccessRep;
  }
}

module.exports = UserController;