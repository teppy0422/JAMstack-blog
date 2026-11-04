(function () {
  var cachedScreenDetails = null;
  // window.open()で既存ウィンドウを再指定すると2ndにフォーカスが奪われるため、
  // 中身の同期にはBroadcastChannelを使い、2nd側が自分でlocation.hrefを書き換える
  var display2Channel = ('BroadcastChannel' in window) ? new BroadcastChannel('ssc_display2_sync') : null;
  async function getSecondScreen() {
      if (!('getScreenDetails' in window)) return null;
      try {
          cachedScreenDetails = cachedScreenDetails || await window.getScreenDetails();
          var screens = cachedScreenDetails.screens;
          var current = cachedScreenDetails.currentScreen;
          for (var i = 0; i < screens.length; i++) {
              if (screens[i] !== current) return screens[i];
          }
      } catch (e) {
          console.warn('Window Management API is unavailable or was denied:', e);
      }
      return null;
  }
  window.openOnDisplay2 = async function (url, windowName) {
      var width = 1280, height = 800;
      var left = 50, top = 50;
      var screen = await getSecondScreen();
      if (screen) {
          left = screen.left + 50;
          top = screen.top + 50;
      }
  return window.open(url, windowName || 'display2Window',
          'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
  };
  // 2nd用ウィンドウが実際に開いている間だけlocalStorageにフラグを立てる。
  // 1st側は矢印キー操作のたびにフルページ遷移するためJS変数では開閉状態を保持できない。
  if (/_2nd\.html$/.test(window.location.pathname)) {
      localStorage.setItem('ssc_display2_open', '1');
      window.addEventListener('pagehide', function (e) {
          if (!e.persisted) localStorage.removeItem('ssc_display2_open');
      });
      // 1st側からの同期メッセージを受け取り、自分自身で遷移する(window.open()経由だとフォーカスが奪われるため)
      if (display2Channel) {
          display2Channel.addEventListener('message', function (e) {
              if (e.data && e.data.url) window.location.href = e.data.url;
          });
      }
      // localStorageへの書き込みは同期的に確定するため、1st側がその直後に即座に
      // 自分自身のページ遷移をしても(BroadcastChannelと違って)通知が失われない。
      // storageイベントは書き込んだ側のウィンドウには発火しないため、2nd側だけがこれを拾う。
      window.addEventListener('storage', function (e) {
          if (e.key !== 'ssc_display2_nav' || !e.newValue) return;
          try {
              var data = JSON.parse(e.newValue);
              if (data && data.url) window.location.href = data.url;
          } catch (err) {}
      });
      // 全画面になっていない間だけ、画面の四隅を結ぶ×印を表示して一目で分かるようにする
      // main_2nd.js側がresize時にdocument.body.innerHTMLをまっさらな状態に戻して
      // 再描画するため(フルスクリーン維持のためリロードを使わない)、その際に消えた
      // このインジケータを作り直せるよう、生成部分を関数として外から呼べるようにしておく
      var fsIndicator = null;
      function createFsIndicator() {
          fsIndicator = document.createElement('div');
          fsIndicator.id = 'fullscreenIndicator';
          fsIndicator.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;';
          fsIndicator.innerHTML = '<svg width="100%" height="100%" style="position:absolute;top:0;left:0;">' +
              '<line x1="0" y1="0" x2="100%" y2="100%" stroke="red" stroke-width="4" stroke-opacity="0.6"/>' +
              '<line x1="100%" y1="0" x2="0" y2="100%" stroke="red" stroke-width="4" stroke-opacity="0.6"/>' +
              '</svg>' +
              '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:red;font-weight:bold;font-size:2em;text-align:center;line-height:1.4;white-space:nowrap;text-shadow:0 0 6px #000,0 0 6px #000,0 0 6px #000;">F11を押してフルスクリーンにして<br>赤いバツを消してください</div>';
          document.body.appendChild(fsIndicator);
          updateFsIndicator();
      }
      // document.fullscreenElementはrequestFullscreen()経由の時しかセットされない。
      // F11によるブラウザ本体の全画面化はページ側からは検知できないため、
      // ウィンドウの実サイズが画面サイズと一致しているかどうかもあわせて見る。
      function updateFsIndicator() {
          if (!fsIndicator) return;
          var isFull = !!document.fullscreenElement || window.innerHeight >= screen.height - 2;
          fsIndicator.style.display = isFull ? 'none' : 'block';
      }
      document.addEventListener('fullscreenchange', updateFsIndicator);
      window.addEventListener('resize', updateFsIndicator);
      // プレゼンの埋め込み用: 資料の中(1st の下の枠)に出している時は、F11 の×印を出さない
      if (window.parent === window) {
          createFsIndicator();
          window.__sscReattachFsIndicator = createFsIndicator;
      }
  }
  // 2nd用ウィンドウが開いている時だけ、その表示先を更新する(開いていなければ何もしない)
  window.updateDisplay2IfOpen = function (url) {
      if (localStorage.getItem('ssc_display2_open') === '1') {
          try {
              localStorage.setItem('ssc_display2_nav', JSON.stringify({ url: url, t: Date.now() }));
          } catch (e) {}
          if (display2Channel) {
              display2Channel.postMessage({ url: url });
          } else {
              window.open(url, 'display2Window'); // BroadcastChannel非対応時のフォールバック
          }
          return true;
      }
      return false;
  };
  function requestFs() {
      var el = document.documentElement;
      if (!el.requestFullscreen) return Promise.reject(new Error('Fullscreen API not supported'));
      return el.requestFullscreen();
  }
  window.enableAutoFullscreen = function () {
      // プレゼンの埋め込み用: 資料の中(見えない枠)の 2nd は全画面にしない。キーが 2nd に届くと 2nd が全画面で出てしまうので
      if (window.parent !== window) return;
      requestFs().catch(function () {
          function onFirstInteraction() {
              document.removeEventListener('click', onFirstInteraction);
              document.removeEventListener('keydown', onFirstInteraction);
              requestFs().catch(function (err) {
                  console.warn('Fullscreen request failed:', err);
              });
          }
          document.addEventListener('click', onFirstInteraction);
          document.addEventListener('keydown', onFirstInteraction);
      });
  };
})();
