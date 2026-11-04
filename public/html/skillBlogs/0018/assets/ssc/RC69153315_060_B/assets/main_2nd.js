// 3Dプリント治具に合わせた画像のスケール・位置調整用の固定値。
// VBAでHTML/JSを再生成すると以下のDEFAULT値に上書きされるため、
// 現場で調整した値はlocalStorageに保存し、再生成後もそちらを優先して読み込む。
var SSC_CALIBRATION_KEY = 'ssc_calibration';
// プレゼン用: 校正値は localStorage に保存せず、プレゼンのページ(window.top)のメモリに置く(再読み込みでデフォルトに戻る)
function sscCalGet() { try { return window.top.__sscCalibration || null; } catch (e) { return null; } }
function sscCalSet(v) { try { window.top.__sscCalibration = v; } catch (e) {} }
var DEFAULT_BLINK_SHRINK_RATIO = 0.6;
// 3Dプリント治具に合わせた画像のスケール・位置調整用の固定値(要調整)
var DEFAULT_PX_PER_MM = 4.1; // プレゼンの埋め込み用(元は 1920 / 290)
var DEFAULT_OFFSET_X_PX = 0;
var DEFAULT_OFFSET_Y_PX = 42;
var DEFAULT_RADIUS_SCALE = 6;
var DEFAULT_BLINK_COLOR_OVERRIDE = '#39FF14';
var DEFAULT_BLINK_SHAPE = 'square';
var DEFAULT_IMAGE_BRIGHTNESS = 1;
// 0で無効、100で「輪が画像と同じ大きさまで広がる」レーダーエフェクトの強さ
var DEFAULT_RADAR_EFFECT = 1;
// 点滅の速さ(1秒あたりの回数)。0なら点滅せず常時点灯
var DEFAULT_BLINK_SPEED = 0;
// パルス(輪)が広がるアニメーションの速さ(1秒あたりの回数)。0ならアニメーションを止める
var DEFAULT_RADAR_SPEED = 1;
var DEFAULT_RADAR_DIRECTION = 'in';
function loadCalibration() {
  var saved = {};
  try {
    saved = JSON.parse(sscCalGet()) || {};
  } catch (e) {
    saved = {};
  }
  return {
    BLINK_SHRINK_RATIO: typeof saved.BLINK_SHRINK_RATIO === 'number' ? saved.BLINK_SHRINK_RATIO : DEFAULT_BLINK_SHRINK_RATIO,
    PX_PER_MM: typeof saved.PX_PER_MM === 'number' ? saved.PX_PER_MM : DEFAULT_PX_PER_MM,
    OFFSET_X_PX: typeof saved.OFFSET_X_PX === 'number' ? saved.OFFSET_X_PX : DEFAULT_OFFSET_X_PX,
    OFFSET_Y_PX: typeof saved.OFFSET_Y_PX === 'number' ? saved.OFFSET_Y_PX : DEFAULT_OFFSET_Y_PX,
    RADIUS_SCALE: typeof saved.RADIUS_SCALE === 'number' ? saved.RADIUS_SCALE : DEFAULT_RADIUS_SCALE,
    RADAR_EFFECT: typeof saved.RADAR_EFFECT === 'number' ? saved.RADAR_EFFECT : DEFAULT_RADAR_EFFECT,
    BLINK_SPEED: typeof saved.BLINK_SPEED === 'number' ? saved.BLINK_SPEED : DEFAULT_BLINK_SPEED,
    RADAR_SPEED: typeof saved.RADAR_SPEED === 'number' ? saved.RADAR_SPEED : DEFAULT_RADAR_SPEED,
    RADAR_DIRECTION: typeof saved.RADAR_DIRECTION === 'string' ? saved.RADAR_DIRECTION : DEFAULT_RADAR_DIRECTION,
    BLINK_COLOR_OVERRIDE: typeof saved.BLINK_COLOR_OVERRIDE === 'string' ? saved.BLINK_COLOR_OVERRIDE : DEFAULT_BLINK_COLOR_OVERRIDE,
																																						BLINK_SHAPE: typeof saved.BLINK_SHAPE === 'string' ? saved.BLINK_SHAPE : DEFAULT_BLINK_SHAPE,
																																							IMAGE_BRIGHTNESS: typeof saved.IMAGE_BRIGHTNESS === 'number' ? saved.IMAGE_BRIGHTNESS : DEFAULT_IMAGE_BRIGHTNESS
  };
}
var _calibration = loadCalibration();
var BLINK_SHRINK_RATIO = _calibration.BLINK_SHRINK_RATIO;
var PX_PER_MM = _calibration.PX_PER_MM;
var OFFSET_X_PX = _calibration.OFFSET_X_PX;
var OFFSET_Y_PX = _calibration.OFFSET_Y_PX;
var RADIUS_SCALE = _calibration.RADIUS_SCALE;
var BLINK_COLOR_OVERRIDE = _calibration.BLINK_COLOR_OVERRIDE;
var BLINK_SHAPE = _calibration.BLINK_SHAPE;
var IMAGE_BRIGHTNESS = _calibration.IMAGE_BRIGHTNESS;
var RADAR_EFFECT = _calibration.RADAR_EFFECT;
var BLINK_SPEED = _calibration.BLINK_SPEED;
var RADAR_SPEED = _calibration.RADAR_SPEED;
var RADAR_DIRECTION = _calibration.RADAR_DIRECTION;
// setPositionFromDataAttributes()を再実行する際、前回作成分のsetIntervalが残ったまま
// 積み重ならないように、発行したinterval IDをここに集めて次回実行時にまとめて解除する
var __sscIntervals = [];
var BLINK_SHAPE_CLIP_PATHS = {
  x: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
};
function applyBlinkShape(div) {
	var clip = BLINK_SHAPE_CLIP_PATHS[BLINK_SHAPE];
	if (clip) {
		div.style.clipPath = clip;
	}
}
// レーダーエフェクト: 形状(BLINK_SHAPE)とは独立した「点滅の色/サイズ」と同格のオプション。
// 本体は常時点灯のまま、周りに輪が広がって消えるのを繰り返す(blinkRadarクラス)。
// RADAR_EFFECTが0なら何もしない。100なら、輪の最大サイズが画像(holeを含む画像)の
// 大きさに達するまで広がる(はみ出さないよう、幅・高さ両方の比率のうち小さい方を採用)。
// 中間値はその割合で線形補間する
function applyRadarEffect(div, holeWidthPx, holeHeightPx, imageWidthPx, imageHeightPx) {
  // 校正用ページ(Calibration_2nd.html)は全キャビティ(100個超)が対象のため、パルスを
  // 全部同時に出すと輪だらけで何も見えなくなる。このページでは常にパルスを無効化する
  if (/Calibration_2nd\.html/i.test(window.location.pathname)) return;
  if (!RADAR_EFFECT || RADAR_EFFECT <= 0) return;
  if (!holeWidthPx || !holeHeightPx) return;
  // 対角線基準にすることで、100%の時に輪が画像の四隅まで届くようにする
  // (幅・高さどちらか短い方に合わせるだけだと、長い方の辺には届かないため)
  var holeDiagonal = Math.sqrt(holeWidthPx * holeWidthPx + holeHeightPx * holeHeightPx);
  var imageDiagonal = Math.sqrt(imageWidthPx * imageWidthPx + imageHeightPx * imageHeightPx);
  var targetScale = imageDiagonal / holeDiagonal;
  if (!isFinite(targetScale) || targetScale < 1) targetScale = 1;
  var maxScale = 1 + (targetScale - 1) * RADAR_EFFECT;
  // 本体(div)にclip-path(バツ・星)が付いていると、輪も一緒に切り取られて見えなくなるため、
  // 本体とは別の要素として、本体の中心に重ねて置く(clip-pathの影響を受けない)。
  // パルスは本体の縦横比・角の丸みに関わらず常にxy比1:1の正円にするため、
  // 本体の長い方の辺を直径とする正方形を、本体と中心が一致するように配置する。
  // 拡大アニメーションはtransform:scale(GPU合成でスムーズ)を使う。線の太さは
  // CSS側で拡大率の逆数を細かいキーフレームで補正して一定に保つ
  var diameter = Math.max(holeWidthPx, holeHeightPx);
  var divLeft = parseFloat(div.style.left) || 0;
  var divTop = parseFloat(div.style.top) || 0;
  var ring = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  ring.setAttribute('viewBox', '0 0 100 100');
  ring.setAttribute('preserveAspectRatio', 'none');
  ring.style.position = 'absolute';
  ring.style.overflow = 'visible';
  ring.style.zIndex = '1';
  ring.style.left = (divLeft + holeWidthPx / 2 - diameter / 2) + 'px';
  ring.style.top = (divTop + holeHeightPx / 2 - diameter / 2) + 'px';
  ring.style.width = diameter + 'px';
  ring.style.height = diameter + 'px';
  ring.style.color = div.style.backgroundColor;
  // 虹モードの時はパルスの輪も同じように色を変化させる(outerのsvgにかけることで、
  // ringCircle自身が持つ拡大アニメーションのanimationプロパティと衝突しない)
  if (BLINK_COLOR_OVERRIDE === 'rainbow') {
      ring.classList.add('blinkRainbow');
  }
  var ringCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ringCircle.setAttribute('class', 'blinkRadar');
  ringCircle.setAttribute('cx', '50');
  ringCircle.setAttribute('cy', '50');
  ringCircle.setAttribute('r', '50');
  ringCircle.setAttribute('fill', 'none');
  ringCircle.setAttribute('stroke', 'currentColor');
  ringCircle.setAttribute('stroke-width', '3');
  ringCircle.setAttribute('vector-effect', 'non-scaling-stroke');
  ringCircle.style.setProperty('--radar-max-scale', maxScale);
  ringCircle.style.animationDirection = (RADAR_DIRECTION === 'out') ? 'reverse' : 'normal';
  if (!RADAR_SPEED || RADAR_SPEED <= 0) {
      ringCircle.style.animation = 'none';
  } else {
      ringCircle.style.setProperty('--radar-duration', (1 / RADAR_SPEED) + 's');
  }
  ring.appendChild(ringCircle);
  document.body.appendChild(ring);
  return ring;
}
// 点滅の速さ(1秒あたりの回数)。0なら点滅させず常時点灯にする
function applyBlinkSpeed(div) {
  // 虹モードの時は点滅の速さの設定に関わらず、常に10固定で回転させる
  var speed = (BLINK_COLOR_OVERRIDE === 'rainbow') ? 10 : BLINK_SPEED;
  if (!speed || speed <= 0) {
      div.style.animation = 'none';
      return;
  }
  div.style.setProperty('--blink-duration', (1 / speed) + 's');
}
// コンソールから window.setCalibration({PX_PER_MM: 7, OFFSET_X_PX: -10, OFFSET_Y_PX: 50}) のように
// 一部の値だけ渡して保存できる。保存後はリロードすると反映される。
window.setCalibration = function (partial) {
  var current = loadCalibration();
  for (var key in partial) {
    if (Object.prototype.hasOwnProperty.call(current, key)) {
      current[key] = partial[key];
    }
  }
  sscCalSet(JSON.stringify(current));
  console.log('SSC calibration saved. リロードすると反映されます。', current);
};
// 保存済みの調整値を破棄し、コード内のDEFAULT値に戻す
window.resetCalibration = function () {
  sscCalSet(null);
  console.log('SSC calibration reset to defaults. リロードすると反映されます。');
};
// 現在のcavを示す十字線。実物のケースの穴は1mm以下と小さく、点灯dotだけでは
// 隣の穴と見分けづらいため、画面端から伸ばして大まかな位置を示す。ただし
// 画像(実物のコネクタガイドが被さって隠れる範囲)の内側は、密集した小さい穴同士が
// 交差でごちゃつくのを避けるため線を引かない(コネクタガイドより画面の方が大きいので、
// 画像の外側の線は作業者から見える)
function buildImageGapCrosshair(cx, cy, imgLeft, imgTop, imgWidth, imgHeight, color) {
    // 校正用ページ(Calibration_2nd.html)は全キャビティが対象のため、十字線を全部出すと
    // 線だらけになってしまう。このページでは常に十字線を無効化する(レーダーエフェクトと同じ扱い)
    if (/Calibration_2nd\.html/i.test(window.location.pathname)) return [];
    var segs = [];
    function makeSeg(l, t, w, h) {
        if (w <= 0 || h <= 0) return;
        var el = document.createElement('div');
        // 点滅ではなく常時点灯にする(blinkSmoothは付けない)
        el.classList.add('blinkCrosshair');
        el.style.position = 'absolute';
        el.style.left = l;
        el.style.top = t;
        el.style.width = w;
        el.style.height = h;
        el.style.backgroundColor = color;
        el.style.pointerEvents = 'none';
        document.body.appendChild(el);
        segs.push(el);
    }
    var imgRight = imgLeft + imgWidth, imgBottom = imgTop + imgHeight;
    makeSeg((cx - 1.5) + 'px', '0', '3px', imgTop + 'px');
    makeSeg((cx - 1.5) + 'px', imgBottom + 'px', '3px', 'calc(100vh - ' + imgBottom + 'px)');
    makeSeg('0', (cy - 1.5) + 'px', imgLeft + 'px', '3px');
    makeSeg(imgRight + 'px', (cy - 1.5) + 'px', 'calc(100vw - ' + imgRight + 'px)', '3px');
    return segs;
}
// singleImageの点滅座標を取得する。新形式(隣接する<script type="application/json" class="blink-coords-data">)を優先し、
// 旧形式(data-blink-coords属性へのカンマ区切り文字列)にも後方互換で対応する
function getSingleImageBlinkPoints(imgEl) {
    var sib = imgEl.nextElementSibling;
    if (sib && sib.tagName === 'SCRIPT' && sib.getAttribute('type') === 'application/json' && sib.classList.contains('blink-coords-data')) {
        try {
            return JSON.parse(sib.textContent);
        } catch (e) {
            console.warn('blink-coords-data の JSON 解析に失敗しました', e);
            return [];
        }
    }
    var legacy = imgEl.getAttribute('data-blink-coords');
    if (!legacy) return [];
    return legacy.split(';').map(function (entry) {
        entry = entry.trim();
        if (!entry) return null;
        var p = entry.split(',');
        return {
            x: parseFloat(p[0]), y: parseFloat(p[1]), w: parseFloat(p[2]), h: parseFloat(p[3]),
            composition: (p[4] || '').trim(), color: (p[5] || '').trim(), radius: parseFloat(p[6]),
            bgColor: p[7], borderColor: p[8], Text: p[9], blink: p[10]
        };
    }).filter(function (p) { return p !== null; });
}
function setPositionFromDataAttributes() {
	__sscIntervals.forEach(function (id) { clearInterval(id); });
	__sscIntervals = [];
	// 表(ヘッダー表+dataTable)の下端(tag2の行の基準位置)
	// dataTableの行数はユーザーが随時編集するため、固定値ではなく実際の描画結果から求める
	var dataTable = document.querySelector(".dataTable");
	var tableBottom = dataTable
		? dataTable.getBoundingClientRect().bottom + window.scrollY
		: window.innerHeight * 0.3;
		var firstTableBox = document.querySelector('.tableBox');
		var tagRowHeight = firstTableBox ? firstTableBox.offsetHeight : 20;
		var tagRowBottomMargin = 20;
		var tagRowTop = window.innerHeight - tagRowBottomMargin - tagRowHeight;
		var viewTop = tableBottom;
		var viewHeight = tagRowTop - viewTop;
	// topImage/bottomImageの2枚を上下に均等配置する場合の1枠分の高さ
	// ※将来1?6枚に対応する場合は、この「2」を画像枚数Nに置き換え、
	//   imageSlotHeight = viewHeight / N として枠を並べるループに拡張する想定
	var imageSlotHeight = viewHeight / 2;
	var mainSvg = document.getElementById('mainSvg');
	if (mainSvg) {
		mainSvg.style.top = tagRowTop + 'px';
		mainSvg.style.height = tagRowHeight + 15 + 'px';
	}
	// dividerSvg(topImage/bottomImageの区切り線)は画像エリア全体を基準に配置する
	var dividerSvg = document.getElementById("dividerSvg");
	if (dividerSvg) {
		dividerSvg.style.top = viewTop + "px";
		dividerSvg.style.height = viewHeight + "px";
	}
	var boxes = document.getElementsByClassName('box');
	var positions = [];
	for (var i = 0; i < boxes.length; i++) {
		(function(box) {
			if (box.classList.contains('tableBox')) return; // テーブル直下用は別ループで処理
			var xRatio = parseFloat(box.getAttribute('data-x'));
			var yRatio = parseFloat(box.getAttribute('data-y'));
			var valuesAttr = box.getAttribute('data-values');
			var values = valuesAttr ? valuesAttr.split(',') : [];
			var wireColorAttr = box.getAttribute('data-wire-color');
			var wireColors = wireColorAttr ? wireColorAttr.split(',') : [];
			var colorAttr = box.getAttribute('data-color');
			var colors = colorAttr ? colorAttr.split(',') : [];
			var lineColorAttr = box.getAttribute('data-line-color');
			var lineColors = lineColorAttr ? lineColorAttr.split(',') : [];
			var existAttr = box.getAttribute('data-exist');
			var exists = existAttr ? existAttr.split(',') : [];
			if (values.length > 1) {
				var index = 0;
				var slideText = document.createElement('span');
				slideText.textContent = values[0];
				box.style.backgroundColor = colors[0];
				box.innerHTML = '';
				box.appendChild(slideText);
				// プログレスバーのコンテナを作成
				var progressContainer = document.createElement('div');
				progressContainer.classList.add('progress-container');
				// プログレスバーを作成
				var progressBars = [];
				for (var i = 0; i < values.length; i++) {
					var progressBar = document.createElement('div');
					progressBar.classList.add('progress-bar');
					progressBar.style.width = (100 / values.length) + '%';
					progressContainer.appendChild(progressBar);
					progressBars.push(progressBar);
				}
				// プログレスバーをボックスに追加
				box.appendChild(progressContainer);
				__sscIntervals.push(setInterval(function() {
					index = (index + 1) % values.length;
					slideText.textContent = values[index];
					box.innerHTML = ''; 
					box.appendChild(slideText);
					box.appendChild(progressContainer); // プログレスバーを再度追加
					// プログレスバーのアクティブ状態を更新
					for (var i = 0; i < progressBars.length; i++) {
						var bar = progressBars[i];
						if (i <= index) {
							bar.classList.add('active');
						} else {
							bar.classList.remove('active');
						}
					}
					if (wireColors[index] !== "") {
						box.classList.add('blink-border');
						box.style.setProperty('--blink-border-color', wireColors[index]);
									box.style.setProperty('--line-color', lineColors[0]);   
						if (exists[index] === "1"){
							box.style.backgroundColor = colors[index];
							box.style.cursor = 'pointer';
							box.onclick = function() {
								window.location.href = values[index] + ".html";
							};
						}else{
							box.style.backgroundColor = "#CCC";
						}
					} else {
						box.classList.remove('blink-border');
					}
					box.style.backgroundColor = colors[index];
				}, 1000));
			} else if (values.length === 1) {
				var slideText = document.createElement('span');
				slideText.textContent = values[0];
				box.innerHTML = ''; 
				if (wireColors.length > 0){
					box.style.setProperty('--blink-border-color', wireColors[0]);
					box.classList.add('blink-border');
				}
				box.style.setProperty('--line-color', lineColors[0]);
				if (exists[0] === "1"){
					box.style.backgroundColor = colors[0];
					box.style.cursor = 'pointer';
					box.addEventListener('click', function() {
					window.location.href = "../../56_配索図_誘導/" + getCurrentProductFolder() + "/" + values[0] + ".html";
					});
				}else{box.style.userSelect = 'none';
					box.style.backgroundColor = "#CCC";
				}
				box.appendChild(slideText);
			}
			var maxWidth = window.innerWidth;
			var maxHeight = window.innerHeight;
			// 指数から計算した位置に配置
			var left = (xRatio / 100) * maxWidth - (box.offsetWidth / 2);
			var top = (yRatio / 100) * maxHeight - (box.offsetHeight / 2);
			// 重なりをチェックして、重なる場合はtopを調整
			for (var j = 0; j < positions.length; j++) {
				var pos = positions[j];
				if (top < pos.bottom && top + box.offsetHeight > pos.top && left < pos.right && left + box.offsetWidth > pos.left) {
					top = pos.bottom + 2; // 重なりが発生した場合、topを調整
				}
			}
			box.style.left = left + 'px';
			box.style.top = top + 'px';
			// 現在の要素の位置を保存
			positions.push({
				top: top,
				bottom: top + box.offsetHeight,
				left: left,
				right: left + box.offsetWidth
			});
			//もしidの末尾がtag2ならば、tagと線で繋ぐ
			if (box.id && box.id.endsWith('tag2')) {
				var baseId = box.id.slice(0, -1); // 'tag2'を除いたIDを取得
				var targetBox = document.getElementById(baseId);
				if (targetBox) {
					var targetRect = targetBox.getBoundingClientRect();
					var targetLeft = targetRect.left + targetBox.offsetWidth / 2;
					var targetTop = targetRect.top + targetBox.offsetHeight / 2;
			
					// SVG要素を作成して線を描画
					var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					svg.setAttribute("width", "100%");
					svg.setAttribute("height", "100%");
					svg.style.position = "absolute";
					svg.style.top = "0";
					svg.style.left = "0";
					document.body.appendChild(svg);
			
					var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
					line.setAttribute("x1", left + box.offsetWidth / 2);
					line.setAttribute("y1", top + box.offsetHeight / 2);
					line.setAttribute("x2", targetLeft);
					line.setAttribute("y2", targetTop);
					line.setAttribute("stroke", "#FE5151");
					line.setAttribute("stroke-opacity", "0.5");
					line.setAttribute("stroke-width", "1");
					svg.appendChild(line);
				}
			}
		})(boxes[i]);
	}
	// テーブル直下に表示する要素(左からの%位置のみ指定、縦位置はテーブル下端に固定)
	var tableBoxes = document.getElementsByClassName("tableBox");
	for (var t = 0; t < tableBoxes.length; t++) {
		var tableBox = tableBoxes[t];
		var xRatio = parseFloat(tableBox.getAttribute("data-x"));
		var valuesAttr = tableBox.getAttribute("data-values");
		var values = valuesAttr ? valuesAttr.split(",") : [];
		var colorAttr = tableBox.getAttribute("data-color");
		var colors = colorAttr ? colorAttr.split(",") : [];
		var lineColorAttr = tableBox.getAttribute("data-line-color");
		var lineColors = lineColorAttr ? lineColorAttr.split(",") : [];
		if (values.length > 0) {
			var slideText = document.createElement("span");
			slideText.textContent = values[0];
			tableBox.innerHTML = "";
			tableBox.appendChild(slideText);
			tableBox.style.setProperty("--line-color", lineColors[0]);
			tableBox.style.backgroundColor = colors[0];
		}
		var left = (xRatio / 100) * window.innerWidth - tableBox.offsetWidth / 2;
		tableBox.style.left = left + "px";
		tableBox.style.top = tagRowTop + "px";
	}
	// data-connectで指定された端末タグを線でつなぐ
	// 1個なら中央から下に縦線だけ、2個なら1個目の中央から下→横→2個目の中央まで上、という段差状の線を引く
	if (mainSvg) {
		var connectAttr = mainSvg.getAttribute("data-connect");
		var connectIds = connectAttr ? connectAttr.split(",") : [];
		var connectColor = mainSvg.getAttribute("data-color") || "#FFF";
		var svgNS = "http://www.w3.org/2000/svg";
		var svgRect = mainSvg.getBoundingClientRect();
		var drawLine = function (x1, y1, x2, y2) {
			var line = document.createElementNS(svgNS, "line");
			line.setAttribute("x1", x1);
			line.setAttribute("y1", y1);
			line.setAttribute("x2", x2);
			line.setAttribute("y2", y2);
			line.setAttribute("stroke", connectColor);
			line.setAttribute("stroke-width", "2");
			mainSvg.appendChild(line);
		};
		if (connectIds.length === 1) {
			var box1 = document.getElementById(connectIds[0]);
			if (box1) {
				var rect1 = box1.getBoundingClientRect();
				var x1 = rect1.left + rect1.width / 2 - svgRect.left;
				var y1 = rect1.top + rect1.height / 2 - svgRect.top;
				var yEnd = y1 + 10;
				drawLine(x1, y1, x1, yEnd);
				var dot = document.createElementNS(svgNS, "circle");
				dot.setAttribute("cx", x1);
				dot.setAttribute("cy", yEnd);
				dot.setAttribute("r", "2");
				dot.setAttribute("fill", connectColor);
				mainSvg.appendChild(dot);
			}
		} else if (connectIds.length === 2) {
			var boxA = document.getElementById(connectIds[0]);
			var boxB = document.getElementById(connectIds[1]);
			if (boxA && boxB) {
				var rectA = boxA.getBoundingClientRect();
				var rectB = boxB.getBoundingClientRect();
				var xA = rectA.left + rectA.width / 2 - svgRect.left;
				var yA = rectA.top + rectA.height / 2 - svgRect.top;
				var xB = rectB.left + rectB.width / 2 - svgRect.left;
				var yB = rectB.top + rectB.height / 2 - svgRect.top;
				var yDown = yA + 10;
				drawLine(xA, yA, xA, yDown);
				drawLine(xA, yDown, xB, yDown);
				drawLine(xB, yDown, xB, yB);
			}
		}
	}
	var circles = document.getElementsByClassName('circle');
	for (var k = 0; k < circles.length; k++) {
		var circle = circles[k];
		var xRatio = parseFloat(circle.getAttribute('data-x'));
		var yRatio = parseFloat(circle.getAttribute('data-y'));
		var backGroundColor = circle.getAttribute('data-backgroundcolor');
		var maxWidth = window.innerWidth;
		var maxHeight = window.innerHeight;
		// 指数から計算した位置に配置
		var left = (xRatio / 100) * maxWidth - (circle.offsetWidth / 2);
		var top = (yRatio / 100) * maxHeight - (circle.offsetHeight / 2);
		circle.style.backgroundColor = backGroundColor;
		circle.style.left = left + 'px';
		circle.style.top = top + 'px';
	}
	// wireBoxの位置を指定したタグの右端に設置
	var wireBoxes = document.querySelectorAll('.wireBox');
	for (var j = 0; j < wireBoxes.length; j++) {
		var wireBox = wireBoxes[j];
		var tagId = wireBox.getAttribute('data-tag');
		if (tagId) {
			var tagElement = document.getElementById(tagId);
			if (tagElement) {
				var tagRect = tagElement.getBoundingClientRect();
				var valuesAry = wireBox.getAttribute('data-value').split(',');
				var colorsAry = wireBox.getAttribute('data-color').split(',');
				var compositionAry = wireBox.getAttribute('data-composition').split(',');
				var currentRight = tagRect.right + window.scrollX + 1;
				var initialTop = tagRect.top + window.scrollY ;
				var currentTop = initialTop;
				for (var cnt = 0; cnt < colorsAry.length; cnt++) {
					var colors = colorsAry[cnt].split(':');
					var values = valuesAry[cnt].split(':');
					var compositions = compositionAry[cnt].split(':');
					for (var index = 0; index < colors.length; index++) {
						var color = colors[index].split('/');
						var backColor = color[0] || color[0]; // デフォルトの色を設定 
						var foreColor = color[1] || color[1]; // デフォルトの色を設定
						var fontColor = color[2] || color[2]; // デフォルトの色を設定
						var newWireBox = document.createElement('div');
						newWireBox.className = 'wireBox';
						newWireBox.style.position = 'absolute';
						newWireBox.style.width = '1.2vw'; // 幅を設定
						newWireBox.style.height = (1.2 / colors.length) + 'vw'; // 高さを設定
						newWireBox.style.fontSize = colors.length > 1 ? '.6vw' : '.8vw'; // colors.lengthが1以上なら小さく
						newWireBox.style.backgroundColor = backColor;
						newWireBox.style.borderRadius = '.2vw';
						newWireBox.style.color = fontColor;
						newWireBox.style.textAlign = 'center';
						newWireBox.style.textShadow = `
							0.5px 0.5px 0.5px ${backColor}, 
							-0.5px -0.5px 0.5px ${backColor}, 
							0.5px -0.5px 0.5px ${backColor}, 
							-0.5px 0.5px 0.5px ${backColor}, 
							0.5px 0 0.5px ${backColor}, 
							-0.5px 0 0.5px ${backColor}, 
							0 0.5px 0.5px ${backColor}, 
							0 -0.5px 0.5px ${backColor}`;
						newWireBox.textContent = values[index];
						if (compositions && compositions[index]) {
							newWireBox.style.cursor = 'pointer';
							(function(composition) {
								newWireBox.addEventListener('click', function() {
									window.location.href = "../../56_配索図_誘導/" + getCurrentProductFolder() + "/" + composition + ".html";
								});
							})(compositions[index]);
						}
						// 斜めの線を模様として設定
						newWireBox.style.backgroundImage = `linear-gradient(135deg, transparent 35%, ${foreColor} 35%, ${foreColor} 65%, transparent 65%)`;
						newWireBox.style.backgroundSize = '100% 100%';
						newWireBox.style.left = currentRight + 'px';
						newWireBox.classList.add('upDown' + (cnt % 3));
						document.body.appendChild(newWireBox);
						var topDetail = 0;
						if (colors.length > 1){
							if (index == 0){
								topDetail = currentTop + (newWireBox.clientHeight * index) -1.5;
							}else{
								topDetail = currentTop + (newWireBox.clientHeight * index) + 1.5;
							}
						}else{
							topDetail = currentTop + (newWireBox.clientHeight * index) ;
						}
						var newWireBoxHeight = newWireBox.clientHeight;
						var centerOffset = (window.innerHeight * 0.695) - (newWireBoxHeight / 2);
						newWireBox.style.top = topDetail + 'px'; // data-specialが"1"の場合は69.5vhの中心に設定
						
						// 次の wireBox の位置を調整
						var newWireBoxRect = newWireBox.getBoundingClientRect();
						if (colors.length === index + 1){
							currentRight = newWireBoxRect.right + 1; 
						}
						// 画面の幅100%からはみ出ないように調整
						if (currentRight + newWireBox.offsetWidth +2 > window.innerWidth ) {
							currentRight = tagRect.right + window.scrollX;
							currentTop += newWireBox.clientHeight + 3;
						}
					}
				}
				// 元の wireBox 要素を非表示にする
				wireBox.style.display = 'none';
			}
		}
	}
	var imageBoxes = document.getElementsByClassName('imageBox');
	var occupiedPositions = []; // 占有された位置を記録する配列
	for (var l = 0; l < imageBoxes.length; l++) {
		(function(imageBox) {
			var aspectRatioAttr = imageBox.getAttribute('data-aspect-ratio');
			var aspectRatios = aspectRatioAttr ? aspectRatioAttr.split(',') : [];
			var srcAttr = imageBox.getAttribute('data-src');
			var srcs = srcAttr ? srcAttr.split(',') : [];
			var tagId = imageBox.getAttribute('data-tag');
			var top, left;
			// タグが指定されている場合、そのタグの下に配置
			if (tagId) {
				var tagElement = document.getElementById(tagId);
				if (tagElement) {
					var tagRect = tagElement.getBoundingClientRect();
					top = tagRect.bottom + window.scrollY; // 要素の下端の位置
					left = tagRect.left + window.scrollX; // 要素の左端の位置
				}
			}
			if (srcs.length > 1) {
				var index = 0;
				__sscIntervals.push(setInterval(function() {
					index = (index + 1) % srcs.length;
					imageBox.style.backgroundImage = 'url(' + srcs[index] + ')';
					var aspectRatio = aspectRatios[index] || aspectRatios[0];
					var width = imageBox.clientWidth;
					var height = width / aspectRatio;
					imageBox.style.left = left + 'px';
				}, 1000));
			} else if (srcs.length === 1) {
				imageBox.style.backgroundImage = 'url(' + srcs[0] + ')';
				var aspectRatio = aspectRatios[0];
				var width = imageBox.clientWidth;
				var height = width / aspectRatio;
				imageBox.style.height = height + 'px';
				imageBox.style.left = left + 'px';
				imageBox.style.top = top + 'px';
			}
			// 縦横比に基づいて高さを設定
			if (aspectRatios[0] > 1) {
				var width = 5 + "vw";
				var height = parseFloat(width) / aspectRatios[0] + "vw";
			} else {
				var height = 5 + "vw";
				var width = parseFloat(height) * aspectRatios[0] + "vw";
			}
			imageBox.style.width = width ;
			imageBox.style.height = height ;
			// 重ならない位置に修正
			var boxRect = imageBox.getBoundingClientRect();
			var moved = false; // 移動フラグ
						while (occupiedPositions.some(function(pos) {
				return boxRect.right > pos.left && 
				boxRect.left < pos.right && 
				boxRect.bottom > pos.top && 
				boxRect.top < pos.bottom;
			})) {
				top += 5; 
				imageBox.style.top = top + 'px';
				boxRect = imageBox.getBoundingClientRect(); // 新しい位置を取得
				moved = true; // 移動フラグを設定
			}
			// 画面の幅100%からはみ出ないように調整
			if (boxRect.right > window.innerWidth) {
				imageBox.style.left =  left -(boxRect.right - window.innerWidth)  + 'px';
			} else {
				imageBox.style.left = left + 'px';
			}
			imageBox.style.top = top + 'px';
			boxRect = imageBox.getBoundingClientRect();
			// 占有された位置を記録
			occupiedPositions.push({
				src: srcAttr,
				left: boxRect.left,
				right: boxRect.right,
				top: boxRect.top,
				bottom: boxRect.bottom
			});
			// 画像を背景として設定
			imageBox.style.backgroundImage = 'url(' + srcs[0] + ')';
			// 移動した場合は曲線を引く
			if (moved && tagId) {
				var svg = document.querySelector('svg');
				var newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); // 新しいSVG要素を作成
				newSvg.style.position = 'absolute';
				newSvg.style.top = '0';
				newSvg.style.left = '0';
				newSvg.style.width = '100%';
				newSvg.style.height = '100%';
				newSvg.style.zIndex = '1000'; // 最前面に設定
				var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				// 始点と終点の座標を取得
				var x1 = tagRect.left + tagRect.width / 2;
				var y1 = tagRect.bottom + window.scrollY;
				var x2 = boxRect.left + boxRect.width / 2;
				var y2 = boxRect.top + window.scrollY;
				// 中間点の座標を計算（曲がる方向を逆にする）
				var midX1 = x1 + (x2 - x1) / 3;
				var midY1 = (y1 + y2) / 2;
				var midX2 = x1 + 2 * (x2 - x1) / 3;
				var midY2 = (y1 + y2) / 2;
				// パスのデータを設定
				var pathData = `M ${x1},${y1} C ${midX1},${midY1} ${midX2},${midY2} ${x2},${y2}`;
				path.setAttribute('d', pathData);
				path.setAttribute('stroke', '#FE5151');
				path.setAttribute('stroke-width', '2');
				path.setAttribute('stroke-opacity', '0.5'); // 透過度を設定
				path.setAttribute('fill', 'none');
				path.classList.add('blinkWire');
				newSvg.appendChild(path); // 新しいSVGにパスを追加
				document.body.appendChild(newSvg); // 新しいSVGをドキュメントに追加
			}
		})(imageBoxes[l]);
	}
	var bottomImages = document.getElementsByClassName('bottomImage');
	for (var m = 0; m < bottomImages.length; m++) {
		var bottomImage = bottomImages[m];
		var src = bottomImage.getAttribute('data-src');
		var aspectRatio = parseFloat(bottomImage.getAttribute('data-aspect-ratio'));
		var position = bottomImage.getAttribute('data-position');
		var blinkCoords = bottomImage.getAttribute('data-blink-coords');
		var terminalTag = bottomImage.getAttribute('data-terminal-tag');
		// 画像を背景として設定
		// data-rotate=180の場合、box・レーダー輪をsingleImageの子要素にして回転に追従させるが、
		// filterはCSSの仕様上、要素自身だけでなくその子要素全体に掛かってしまう(box等の明るさまで
		// 変わってしまう)ため、画像本体は別のimageLayer子要素に分離し、filterはそちらだけに掛ける
		bottomImage.style.backgroundImage = 'url(' + src + ')';
		bottomImage.style.filter = 'brightness(' + IMAGE_BRIGHTNESS + ')';
		// 最大幅と最大高さを設定
		var maxWidth = window.innerWidth * 0.5; // 50vw
		var maxHeight = window.innerHeight * 0.3; // 30vh
		// 縦横比に基づいて高さと幅を計算
		var width = maxWidth;
		var height = width / aspectRatio;
		if (height > maxHeight) {
			height = maxHeight;
			width = height * aspectRatio;
		}
		bottomImage.style.width = width + 'px';
			bottomImage.style.height = height + 'px';
		var radius = width / height * 4;
		// 位置を設定
		if (position === 'left') {
			bottomImage.style.left = '0';
			bottomImage.style.right = 'auto';
			left = 0;
		} else if (position === 'right') {
			bottomImage.style.right = '0';
			bottomImage.style.left = 'auto';
			left = window.innerWidth - bottomImage.clientWidth;
		} else{
			var leftPercentage = parseFloat(position);
			var left = (leftPercentage / 100) * window.innerWidth;
			var bottomImageWidth = bottomImage.offsetWidth;
			left = left - (bottomImageWidth /2);
			// leftとbottomImageの幅の合計が画面の横幅を超える場合、leftを調整
			if (left + bottomImageWidth > window.innerWidth) {
				left = window.innerWidth - bottomImageWidth;
			}else if (left < 0){
				left = 0;
			}
			bottomImage.style.left = left + 'px';
			bottomImage.style.right = 'auto';
		}
		// data-blink-coordsが設定されていない場合はスキップ
		if (!blinkCoords) continue;
		blinkCoords = blinkCoords.split(';');
		for (var i = 0; i < blinkCoords.length; i++) {
			var coord = blinkCoords[i];
			var parts = coord.split(',');
			var blinkX = parseFloat(parts[0]);
			var blinkY = parseFloat(parts[1]);
			var blinkW = parseFloat(parts[2]);
			var blinkH = parseFloat(parts[3]);
			var composition = parts[4];
			var color = parts[5];
			var radius = parts[6];
			if (!color || color === '#') continue;
			var blinkXPos = (blinkX / 100) * bottomImage.clientWidth;
			var blinkYPos = (blinkY / 100) * bottomImage.clientHeight;
			var blinkWidth = (width / 100) * bottomImage.clientWidth;
			var blinkHeight = (height / 100) * bottomImage.clientHeight;
			// 中心を保ったままwidth/heightを縮小(隣の穴への光漏れ対策)
			blinkXPos += blinkWidth * (1 - BLINK_SHRINK_RATIO) / 2;
			blinkYPos += blinkHeight * (1 - BLINK_SHRINK_RATIO) / 2;
			blinkWidth *= BLINK_SHRINK_RATIO;
			blinkHeight *= BLINK_SHRINK_RATIO;
			// 要素が100vhを超える場合の対策(Bon/Terで発生するかも)
			if (top + blinkYPos + blinkHeight > window.innerHeight) {
				blinkHeight = window.innerHeight - top - blinkYPos;
			}
			// 30vhを超える場合は切り取る
			var maxHeight = window.innerHeight * 0.3;
			if (blinkYPos + blinkHeight > maxHeight) {
				blinkHeight = maxHeight - blinkYPos;
			}
			// 50vwを超える場合は切り取る
			var maxWidth = window.innerWidth * 0.5;
			if (blinkXPos + blinkWidth > maxWidth) {
				blinkWidth = maxWidth - blinkXPos;
			}
			var blinkDiv = document.createElement('div');
			blinkDiv.classList.add('blinkHole');
			blinkDiv.style.position = 'absolute';
			blinkDiv.style.left = (left + blinkXPos) + 'px';
			blinkDiv.style.top = (top + blinkYPos) + 'px';
			blinkDiv.style.width = blinkWidth + 'px';
			blinkDiv.style.height = blinkHeight + 'px';
			blinkDiv.style.borderRadius = (radius * RADIUS_SCALE) + "%";
          if (BLINK_COLOR_OVERRIDE === 'rainbow') {
              blinkDiv.style.backgroundColor = '#F07070';
              blinkDiv.classList.add('blinkRainbow');
          } else {
              blinkDiv.style.backgroundColor = BLINK_COLOR_OVERRIDE || color;
          }
          applyBlinkShape(blinkDiv);
          applyBlinkSpeed(blinkDiv);
          applyRadarEffect(blinkDiv, blinkWidth, blinkHeight, bottomImage.clientWidth, bottomImage.clientHeight);
          if (composition) {
				blinkDiv.style.cursor = 'pointer';
				(function(comp) {
					blinkDiv.addEventListener('click', function() {
						window.location.href = comp + ".html";
					});
				})(composition);
			}
			document.body.appendChild(blinkDiv);
		}
		// terminaltagまでの線を引く
		var terminalTagId = bottomImage.getAttribute('data-terminal-tag');
		if (terminalTagId) {
			var terminalTag = document.getElementById(terminalTagId);
			if (terminalTag) {
				var terminalRect = terminalTag.getBoundingClientRect();
				var bottomImageRect = bottomImage.getBoundingClientRect();
				var svg = document.querySelector('svg');
				if (!svg) {
					svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					svg.style.position = 'absolute';
					svg.style.top = '0';
					svg.style.left = '0';
					svg.style.width = '100%';
					svg.style.height = '100%';
					svg.style.zIndex = '1000'; // 最前面に設定
					document.body.appendChild(svg);
				}
				var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				var x1 = terminalRect.left + terminalRect.width / 2;
				var y1 = terminalRect.bottom + window.scrollY;
				var x2 = bottomImageRect.left + bottomImageRect.width / 2;
				var y2 = bottomImageRect.top + window.scrollY;
				// 曲線のパスデータを作成
				var pathData = `M ${x1},${y1} C ${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;
				path.setAttribute('d', pathData);
				path.setAttribute('stroke', '#FE5151');
				path.setAttribute('stroke-width', '1');
				path.setAttribute('stroke-opacity', '0.5'); // 透過度を設定
				path.setAttribute('fill', 'none');
				path.classList.add('blinkWire');
				svg.appendChild(path);
			}
		}
	}
	// コネクタ1個だけの場合、画像エリア全体(viewTop?画面下端)の中央(上下左右)に表示する
	var singleImages = document.getElementsByClassName('singleImage');
	for (var m = 0; m < singleImages.length; m++) {
		var singleImage = singleImages[m];
		var src = singleImage.getAttribute('data-src');
		var aspectRatio = parseFloat(singleImage.getAttribute('data-aspect-ratio'));
		var blinkPoints = getSingleImageBlinkPoints(singleImage);
		var realWidthMM = parseFloat(singleImage.getAttribute('data-real-width-mm'));
		// 画像の回転角度(0/90/180/270)。現状は180のみ対応(1stディスプレイと同じ仕様)
		var rotateAngle = parseInt(singleImage.getAttribute('data-rotate'), 10) || 0;
		var rotatedBoxes = [], rotatedRadar = [];
		// 画像を背景として設定
		var imageLayer = singleImage.querySelector(':scope > .singleImageLayer');
		if (!imageLayer) {
			imageLayer = document.createElement('div');
			imageLayer.className = 'singleImageLayer';
			imageLayer.style.position = 'absolute';
			imageLayer.style.left = '0';
			imageLayer.style.top = '0';
			imageLayer.style.width = '100%';
			imageLayer.style.height = '100%';
			imageLayer.style.backgroundSize = 'contain';
			imageLayer.style.backgroundPosition = 'center';
			imageLayer.style.backgroundRepeat = 'no-repeat';
			imageLayer.style.pointerEvents = 'none';
			singleImage.insertBefore(imageLayer, singleImage.firstChild);
		}
		imageLayer.style.backgroundImage = 'url(' + src + ')';
		imageLayer.style.filter = 'brightness(' + IMAGE_BRIGHTNESS + ')';
		var width, height, left, top;
		if (!isNaN(realWidthMM) && realWidthMM > 0) {
			// 実寸(1:1)表示。画面をはみ出た分は中央基準で切り捨てる(body側でoverflow:hidden)
			width = realWidthMM * PX_PER_MM;
			height = width / aspectRatio;
			left = (window.innerWidth - width) / 2 + OFFSET_X_PX;
			top = (window.innerHeight - height) / 2 + OFFSET_Y_PX;
		} else {
			// data-real-width-mmが無い場合は従来通りの表示(画面内に収める)
			var dataTable = document.querySelector('.dataTable') || document.querySelector('table');
			var tableBottom = dataTable ? (dataTable.getBoundingClientRect().bottom + window.scrollY) : 0;
			var firstTableBox = document.querySelector('.tableBox');
			var tagRowHeight = firstTableBox ? firstTableBox.offsetHeight : 20;
			var tagRowBottomMargin = 20;
			var tagRowTop = window.innerHeight - tagRowBottomMargin - tagRowHeight;
			var viewTop = tableBottom;
			var viewHeight = tagRowTop - viewTop;
			var maxWidth = window.innerWidth * 0.8; // 80vw
			var maxHeight = viewHeight;
			width = maxWidth;
			height = width / aspectRatio;
			if (height > maxHeight) {
				height = maxHeight;
				width = height * aspectRatio;
			}
			left = (window.innerWidth - width) / 2;
			top = viewTop + (viewHeight - height) / 2;
		}
		singleImage.style.width = width + 'px';
		singleImage.style.height = height + 'px';
		singleImage.style.left = left + 'px';
		singleImage.style.top = top + 'px';
		// data-blink-coordsが設定されていない場合はスキップ
		if (!blinkPoints.length) continue;
		for (var i = 0; i < blinkPoints.length; i++) {
			var pt = blinkPoints[i];
			var blinkX = pt.x;
			var blinkY = pt.y;
			var blinkW = pt.w;
			var blinkH = pt.h;
			var composition = pt.composition;
			var color = pt.color;
			var radius = pt.radius;
			if (!color || color === '#') continue;
			var blinkXPos = (blinkX / 100) * singleImage.clientWidth;
			var blinkYPos = (blinkY / 100) * singleImage.clientHeight;
			var blinkWidth = (blinkW / 100) * singleImage.clientWidth;
			var blinkHeight = (blinkH / 100) * singleImage.clientHeight;
			// 中心を保ったままwidth/heightを縮小(隣の穴への光漏れ対策)
			blinkXPos += blinkWidth * (1 - BLINK_SHRINK_RATIO) / 2;
			blinkYPos += blinkHeight * (1 - BLINK_SHRINK_RATIO) / 2;
			blinkWidth *= BLINK_SHRINK_RATIO;
			blinkHeight *= BLINK_SHRINK_RATIO;
			var blinkDiv = document.createElement('div');
			blinkDiv.classList.add('blinkHole');
			blinkDiv.style.position = 'absolute';
			blinkDiv.style.left = (left + blinkXPos) + 'px';
			blinkDiv.style.top = (top + blinkYPos) + 'px';
			blinkDiv.style.width = blinkWidth + 'px';
			blinkDiv.style.height = blinkHeight + 'px';
			if (BLINK_COLOR_OVERRIDE === 'rainbow') {
                blinkDiv.style.backgroundColor = '#F07070';
                blinkDiv.classList.add('blinkRainbow');
            } else {
                blinkDiv.style.backgroundColor = BLINK_COLOR_OVERRIDE || color;
            }
          blinkDiv.style.borderRadius = (radius * RADIUS_SCALE) + '%';
          applyBlinkShape(blinkDiv);
          applyBlinkSpeed(blinkDiv);
          var radarRing = applyRadarEffect(blinkDiv, blinkWidth, blinkHeight, singleImage.clientWidth, singleImage.clientHeight);
          if (radarRing) rotatedRadar.push(radarRing);
          var crosshairColor = (BLINK_COLOR_OVERRIDE === 'rainbow') ? '#F07070' : (BLINK_COLOR_OVERRIDE || color);
          var targetCx = left + blinkXPos + blinkWidth / 2;
          var targetCy = top + blinkYPos + blinkHeight / 2;
          if (rotateAngle === 180) {
              targetCx = left + width - (blinkXPos + blinkWidth / 2);
              targetCy = top + height - (blinkYPos + blinkHeight / 2);
          }
          buildImageGapCrosshair(targetCx, targetCy, left, top, width, height, crosshairColor);
          if (composition) {
				blinkDiv.style.cursor = 'pointer';
				(function(comp) {
					blinkDiv.addEventListener('click', function() {
						window.location.href = comp + ".html";
					});
				})(composition);
			}
			document.body.appendChild(blinkDiv);
			rotatedBoxes.push(blinkDiv);
		}
        // 回転指定(180°)がある場合、box・レーダーエフェクトの輪をsingleImageのローカル座標に
        // 変換して子要素にし、singleImage自体をrotate(180deg)することでまとめて反転させる
        // (1stディスプレイと同じ方式。テキストが無いため逆回転は不要)
        if (rotateAngle === 180) {
            var toLocalCoord = function(el) {
                var elLeft = parseFloat(el.style.left), elTop = parseFloat(el.style.top);
                el.style.left = (elLeft - left) + 'px';
                el.style.top = (elTop - top) + 'px';
                singleImage.appendChild(el);
            };
            rotatedBoxes.forEach(toLocalCoord);
            rotatedRadar.forEach(toLocalCoord);
            singleImage.style.transformOrigin = 'center center';
            singleImage.style.transform = 'rotate(180deg)';
        }
	}
	document.addEventListener("DOMContentLoaded", function() {
		var terms = document.querySelectorAll(".term");
		for (var i = 0; i < terms.length; i++) {
			var term = terms[i];
			var terminal = term.getAttribute("data-terminal");
			var color = term.getAttribute("data-color");
			var targetElement = document.getElementById(terminal + "tag");
			if (targetElement) {
				targetElement.setAttribute("data-wire-color", color);
			}
		}
	});
	__sscIntervals.push(setInterval(function() {
		var myTElements = document.getElementsByClassName('myT');
		if (myTElements.length > 0) {
			myTElements[0].focus();
		}
	}, 500));
}
// フルスクリーン化などによるresizeでページごとリロードすると、ブラウザ仕様上
// フルスクリーンが強制解除されてしまうため、リロードの代わりに使う「まっさらな状態」を
// ここで保存しておく(この時点ではまだdisplay2.js未読み込みのため、fsIndicator等の
// 動的要素は含まれない)
var __sscBodySnapshot = document.body.innerHTML;
// データ属性から位置を設定
setPositionFromDataAttributes();
// resize時にページ全体をリロードする代わりに、body内容を上のまっさらな状態へ戻してから
// 位置計算をやり直す(＝実質的な再描画)。ページ遷移を伴わないため、resizeの原因が
// フルスクリーン化であってもフルスクリーンが解除されない
function __sscRerenderDisplay2() {
	document.body.innerHTML = __sscBodySnapshot;
	setPositionFromDataAttributes();
	// display2.js側で作った全画面インジケータ(×印)もbodyごと消えているため作り直す
	if (typeof window.__sscReattachFsIndicator === 'function') {
		window.__sscReattachFsIndicator();
	}
}
window.__sscRerenderDisplay2 = __sscRerenderDisplay2;
// リサイズ時にレイアウトを再計算する
if (window.addEventListener) {
	window.addEventListener('resize', function() {
		setTimeout(function() {
		__sscRerenderDisplay2();
	}, 500); // 0.5秒後に再計算
});
} else if (window.attachEvent) { // IE8用のフォールバック
	window.attachEvent('onresize', function() {
		setTimeout(function() {
		__sscRerenderDisplay2();
	}, 500); // 0.5秒後に再計算
});
}
