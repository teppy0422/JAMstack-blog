// CSSだけのimport(`import "./style.css"` や `import "@fontsource/yomogi"`)用の型宣言。
// TypeScript 6 の noUncheckedSideEffectImports でエディタがエラーにするのを防ぐ
declare module "*.css";
declare module "@fontsource/*";
