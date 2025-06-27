import Script from "next/script";

export default function CustomHead() {
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      {/* Adobe Fonts スクリプト読み込み */}
      {/* <Script
        id="adobe-fonts"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(d) {
                var config = {
                  kitId: 'xwt4sjt',
                  scriptTimeout: 3000,
                  async: true
                },
                h=d.documentElement,t=setTimeout(function(){
                  h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";
                },config.scriptTimeout),
                tk=d.createElement("script"),f=false,
                s=d.getElementsByTagName("script")[0],a;
                h.className+=" wf-loading";
                tk.src='https://use.typekit.net/'+config.kitId+'.js';
                tk.async=true;
                tk.onload=tk.onreadystatechange=function(){
                  a=this.readyState;
                  if(f||a&&a!="complete"&&a!="loaded") return;
                  f=true; clearTimeout(t);
                  try { Typekit.load(config) } catch(e) {}
                };
                s.parentNode.insertBefore(tk,s)
              })(document);
            `,
        }}
      />

      <Script
        id="adobe-fonts-2"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(d) {
                var config = {
                  kitId: 'xwt4sjt', // 新しい kit ID に差し替え
                  scriptTimeout: 3000,
                  async: true
                },
                h=d.documentElement,t=setTimeout(function(){
                  h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";
                },config.scriptTimeout),
                tk=d.createElement("script"),f=false,
                s=d.getElementsByTagName("script")[0],a;
                h.className+=" wf-loading";
                tk.src='https://use.typekit.net/'+config.kitId+'.js';
                tk.async=true;
                tk.onload=tk.onreadystatechange=function(){
                  a=this.readyState;
                  if(f||a&&a!="complete"&&a!="loaded") return;
                  f=true; clearTimeout(t);
                  try { Typekit.load(config) } catch(e) {}
                };
                s.parentNode.insertBefore(tk,s)
              })(document);
            `,
        }}
      /> */}
    </>
  );
}
