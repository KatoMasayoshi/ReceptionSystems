// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // motion.devのESModules対応（.mjs ファイルの読み込みを許可）
        webpackConfig.module.rules.push({
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        });
  
        return webpackConfig;
      }
    }
  };
  