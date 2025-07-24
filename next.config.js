const path = require("path");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  trailingSlash: true,
  experimental: {
    // appDir: true,
    // optimizeFonts: true,
    // optimizeCss: true, // CSSの最適化を有効化
  },
  // pages/blog/[id].tsxからapp/blogs/[id]/page.tsxに変更したから一時的に変換
  // blog/からのリダイレクトが必要なくなったら削除してOK。たぶん2025年末までくらい
  async redirects() {
    return [
      {
        source: "/blog/:id",
        destination: "/blogs/:id",
        permanent: true, // 308 Redirect
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!config.resolve.fallback) config.resolve.fallback = {};

    // ✅ canvasモジュールをfalseにして無視させる（クライアントのみで使う前提）
    config.resolve.fallback.canvas = false;

    // ✅ KonvaのNode用バージョンが使われないように除外（KonvaのNode向けを外す）
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        "konva/lib/index-node": "commonjs konva/lib/index-node",
      });
    }

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
});
