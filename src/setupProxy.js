const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/selfserver1',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      pathRewrite: { '^/selfserver1': '' },
      changeOrigin: true,
    })
  );
};