module.exports = {
  trailingSlash: true,
  experimental: {
    // appDir: true,
    // optimizeFonts: true,
    // optimizeCss: true, // CSSの最適化を有効化
  },
  async redirects() {
    return [
      {
        source: "/blog/:id",
        destination: "/blogs/:id",
        permanent: true, // 308 Redirect
      },
    ];
  },
  webpack: (config, options) => {
    config.resolve.alias["@"] = path.resolve(__dirname); // ← これを追加

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

const path = require("path");
