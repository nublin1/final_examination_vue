const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./", // Устанавливаем относительный путь
  devServer: {
    webSocketServer: false
  },  
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      // load which style file you want to import globally
      patterns: [path.resolve(__dirname, "@/src/assets/styles.scss")],
    },
  },
});
