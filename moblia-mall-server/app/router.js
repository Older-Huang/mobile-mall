// app/router.js
module.exports = app => {
    const { router, controller, config } = app;
    const baseURL = config.$baseURL || '';

    // home
    router.get(`${baseURL}/`, controller.home.index);
    router.get(`${baseURL}/product/pagination`, controller.home.product);
    router.get(`${baseURL}/product`, controller.home.productInfo);
    router.get(`${baseURL}/img`, controller.home.img);
    router.get(`${baseURL}/data/city`, controller.home.country);

    // user
    router.post(`${baseURL}/user/signin`, controller.user.login);
    router.get(`${baseURL}/user/info`, controller.user.fetchUserInfo);
    router.post(`${baseURL}/product_like/create`, controller.user.updateCollect);
    router.get(`${baseURL}/product_like/delete`, controller.user.deleteCollect);
    router.get(`${baseURL}/product_like/all`, controller.user.fetchCollect);
    router.post(`${baseURL}/cart/update`, controller.user.updateCart);
    router.get(`${baseURL}/cart/all`, controller.user.fetchCart);
    router.get(`${baseURL}/cart/delete`, controller.user.deleteCart);
    router.post(`${baseURL}/user_address/create`, controller.user.createAddress);
    router.post(`${baseURL}/user_address/update`, controller.user.updateAddress);
    router.get(`${baseURL}/user_address/delete`, controller.user.deleteAddress);
    router.post(`${baseURL}/user/setting`, controller.user.updateUserInfo);
    router.post(`${baseURL}/user/avatar`, controller.user.updateUserInfo);
    router.post(`${baseURL}/user/updatePassword`, controller.user.updateUserInfo);
    router.post(`${baseURL}/user/updatePayPassword`, controller.user.updateUserInfo);

    // order
    router.post(`${baseURL}/order/create`, controller.order.createOrder);
    router.post(`${baseURL}/order/pay`, controller.order.payOrder);
    router.get(`${baseURL}/order`, controller.order.fetchOrder);
    router.get(`${baseURL}/order/pagination`, controller.order.fetchOrderAll);
};
