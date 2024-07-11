const codeMap = {
    SUCCESS: 200,
    ERROR: 400,
    EXPIRED: 9001,
};

const errorRep = {
    code: codeMap.ERROR,
    message: '',
    data: null,
};

const isSuccess = res => res?.affectedRows === 1;

const loginRules = {
    username: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
    password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
};

const orderStatusMap = {
    NON_PAYMENT: 0, // 未支付
    PAID: 1,        // 已支付（未发货）
    DELIVERED: 2,   // 已发货
    CLOSER_THE_DEAL: 3, // 完成交易
}

module.exports = {
    codeMap,
    errorRep,
    isSuccess,
    loginRules,
    orderStatusMap,
}
