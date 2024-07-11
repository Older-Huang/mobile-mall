// config/config.default.js
exports.keys = '720356071982';

// 基础路径
exports.$baseURL = '/api';

// 配置全局中间件
exports.middleware = ['bodyMount', 'validateAuthorization'];

// 配置MySQL
exports.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '119.23.70.54',
      // 端口号
      port: '3306',
      // 用户名
      user: 'ecology',
      // 密码
      password: 'Weaver@2023',
      // 数据库名
      database: 'moblia_mall'
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false
};

// 开启安全防护
exports.security = {
  csrf: {
    headerName: 'x-csrf-token',
    // useSession: true, // 默认为 false，当设置为 true 时，将把 csrf token 保存到 Session 中
    // sessionName: 'token', // Session 中的字段名，默认为 csrfToken
  },
};

// 文件上传后开启file模式
exports.multipart = {
  mode: 'file',
};
