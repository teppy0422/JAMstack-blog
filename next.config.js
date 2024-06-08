module.exports = {
  experimental: {
    // optimizeFonts: true,
  },
  //必要なのか分からない
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glb|gltf|mp3)$/, // |mp3を追記
      use: {
        loader: "file-loader",
      },
    });
    return config;
  },
};
