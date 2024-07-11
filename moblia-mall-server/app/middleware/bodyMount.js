module.exports = (options, app) => {
    return async function bodyMountMiddleware(ctx, next) {
      const result = await next();
      ctx.body = result;
    };
};
