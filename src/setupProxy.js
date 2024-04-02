const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        '/api/v1/booklover',
        createProxyMiddleware({
            target: 'http://127.0.0.1:8000', // Укажите URL вашего API
            changeOrigin: true,
        })
    );
};