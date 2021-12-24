const { merge } = require("webpack-merge");
const commonConfiguration = require("./webpack.common.js");

module.exports = merge(commonConfiguration, {
  mode: "development",
  devServer: {
    port: 8080,
    compress: true,
    open: true,
    // host: "0.0.0.0",
    // contentBase: "./dist",
    // https: false,
    // useLocalIp: true,
  },
});
