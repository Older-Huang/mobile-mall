const { encrypt, dencrypt } = require('../public/crypt');

module.exports = (options, app) => {
    return async function validateAuthorizationMiddleware(ctx, next) {
        const { header } = ctx.request;

        if (header.authorization) {
            let id;
            try {
                id = dencrypt(header.authorization);
            } catch (error) {
                id = null;
                ctx.userInfo = {
                    message: '登录认证已过期，请重新登陆',
                }
            }
            if (id) {
                const result = await app.mysql.get('user', { id });
                ctx.userInfo = result || {};
            }
        }

        return await next();
    };
};
