// 4-1: 40.サブ図の枠。スクロールして見えた所から順に、横から入ってくる(teppy.link/downloads のモーダルと同じ見せ方)
(function () {
  [].forEach.call(document.querySelectorAll('.submodal .smbody'), function (body) {
    var items = body.querySelectorAll('.smitem');
    if (!window.IntersectionObserver) {
      [].forEach.call(items, function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { root: body, threshold: 0.15 });
    [].forEach.call(items, function (e) { io.observe(e); });
  });
})();
