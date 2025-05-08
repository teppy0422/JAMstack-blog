module.exports = {
  trailingSlash: true,
  experimental: {
    // optimizeFonts: true,
    // appDir: true,
  },
  webpack: (config, options) => {
    // glb/gltf/mp3用のloader
    config.module.rules.push({
      test: /\.(glb|gltf|mp3)$/,
      use: {
        loader: "file-loader",
      },
    });

    // SVGをReactコンポーネントとして使えるようにする
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
