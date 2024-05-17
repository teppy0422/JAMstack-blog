module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glb|gltf|mp3)$/,
      use: {
        loader: "file-loader",
      },
    });
    return config;
  },
};
