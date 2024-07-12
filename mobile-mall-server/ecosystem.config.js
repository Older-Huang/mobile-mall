
module.exports = {
    apps : [{
      name: 'egg-project',
      script: 'npm',
      args: 'start',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    }],
};
