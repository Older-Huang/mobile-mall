const Controller = require('egg').Controller;
const { codeMap: statusCode, errorRep, isSuccess, orderStatusMap } = require('../public/common');

class OrderController extends Controller {
    async createOrder() {
        const { ctx, app } = this;
        const { userInfo, request } = ctx;
        const { body } = request;
        const newSuccessRep ={
            message: '',
            data: null,
            errcode: 0
        };
        const newErrorRep = {
            ...errorRep,
            errcode: statusCode.ERROR,
        };

        if (!userInfo.order || !body.user_address_id) {
            return {
                ...errorRep,
                message: userInfo.message || '',
                errcode: userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED,
            };
        }
        const order = await app.mysql.insert('order', {
            addressId: body.user_address_id,
            productList: JSON.stringify(body.orderProductList),
            orderStatus: orderStatusMap.NON_PAYMENT,
            cart: body.cart ? userInfo.cart : null,
        });
        if (!order || !isSuccess(order)) {
            return newErrorRep;
        }
        console.log(body);
        const userOrder = JSON.parse(userInfo.order);
        userOrder.unshift(order.insertId);
        const result = await app.mysql.update('user', {
            id: userInfo.id,
            order: JSON.stringify(userOrder),
        });
        if (!result || !isSuccess(result)) {
            return newErrorRep;
        }

        return {
            ...newSuccessRep,
            data: {
                id: order.insertId,
            },
        }
    }

    async payOrder() {
        const { ctx, app } = this;
        const { userInfo, request, query } = ctx;
        const { body } = request;
        const newSuccessRep ={
            message: '',
            data: null,
            errcode: 0
        };
        const newErrorRep = {
            ...errorRep,
            errcode: statusCode.ERROR,
        };

        if (!userInfo.order || !query.order_id) {
            return {
                ...errorRep,
                message: userInfo.message || '',
                errcode: userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED,
            };
        }
        const userOrder = JSON.parse(userInfo.order);
        if (!userOrder.includes(Number(query.order_id))) {
            return {
                ...newErrorRep,
                errmsg: '订单不存在',
            };
        }
        if (body.pay_password !== userInfo.payPassword) {
            return {
                ...newErrorRep,
                errmsg: '支付密码错误',
            };
        }
        const order = await app.mysql.get('order', { id: query.order_id });
        if (!order) {
            return newErrorRep;
        }
        let productList;
        if (order.cart) {
            const userCart = await app.mysql.get('cart', { id: order.cart });
            if (!userCart) {
                return newErrorRep;
            }
            productList = JSON.parse(userCart.productList);
            const res = await app.mysql.update('cart', {
                id: order.cart,
                productList: JSON.stringify(productList.filter(item => !item.checked)),
            });
            if (!res || !isSuccess(res)) {
                return newErrorRep;
            }
        }
        const result = await app.mysql.update('order', { id: query.order_id, orderStatus: orderStatusMap.PAID });
        if (!result || !isSuccess(result)) {
            await app.mysql.update('cart', {
                id: order.cart,
                productList: JSON.stringify(productList),
            });
            return newErrorRep;
        }

        return newSuccessRep;
    }

    async fetchOrder() {
        const { ctx, app } = this;
        const { query, userInfo } = ctx;
        const newErrorRep = {
            ...errorRep,
            errcode: statusCode.ERROR,
        };
    
        if (!userInfo.order || !query.id) {
            return {
                ...errorRep,
                message: userInfo.message || '',
                errcode: userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED,
            };
        }
        const queryId = Number(query.id);
        const userOrder = JSON.parse(userInfo.order);
        if (!userOrder.includes(queryId)) {
            return {
                ...newErrorRep,
                message: '订单不存在',
            };
        }
        const result = await app.mysql.get('order', { id: queryId });
        if (!result) {
            return newErrorRep;
        }
        const userAddress = JSON.parse(userInfo.addressList).find(item => item.id === result.addressId);

        return {
            message: '',
            data: {
                id: result.id,
                userAddress,
                orderProducts: JSON.parse(result.productList),
                order_status: result.orderStatus,
            },
            errcode: 0,
        }
    }

    async fetchOrderAll() {
        const { ctx, app } = this;
        const { userInfo, query } = ctx;
        const size = 10;
        const newErrorRep = {
            ...errorRep,
            errcode: statusCode.ERROR,
        };

        if (!userInfo.order || !query.page) {
            return {
                ...errorRep,
                message: userInfo.message || '',
                errcode: userInfo.id ? newErrorRep.errcode : statusCode.EXPIRED,
            };
        }
        const userOrder = JSON.parse(userInfo.order);
        let totalCount;
        let requestList = [];
        let data;
        if (query.status) {
            requestList = userOrder.map(item => {
                return app.mysql.get('order', { id: item });
            });
            const resultList = await Promise.all(requestList);
            data = resultList.filter(item => item.orderStatus === Number(query.status));
            totalCount = data.length;
        } else {
            totalCount = userOrder.length;
            const startIndex = (query.page - 1) * size;
            requestList = userOrder.slice(startIndex, startIndex + size);
            
            if (requestList.length === 0) {
                data = [];
            } else {
                requestList = requestList.map(item => {
                    return app.mysql.get('order', { id: item });
                });
                data = await Promise.all(requestList);
            }
        }
        data = data.map(item => {
            if (!item) {
                return {};
            }

            return {
                id: item.id,
                orderProducts: JSON.parse(item.productList),
            };
        });
        const totalPages = totalCount % size > 0 ? Math.floor(totalCount / size) + 1 : Math.floor(totalCount / size);

        return {
            message: '',
            data: {
                data,
                totalPages,
            },
            errcode: 0,
        }
    }
}

module.exports = OrderController;
