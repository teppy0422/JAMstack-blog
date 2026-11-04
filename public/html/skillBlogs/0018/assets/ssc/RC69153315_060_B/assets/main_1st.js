// プレゼン用: 校正値は localStorage に保存せず、プレゼンのページ(window.top)のメモリに置く(再読み込みでデフォルトに戻る)
function sscCalGet() { try { return window.top.__sscCalibration || null; } catch (e) { return null; } }
function sscCalSet(v) { try { window.top.__sscCalibration = v; } catch (e) {} }
// ストライプ色(ColorVal)ごとの登録フォント色(ColorValFont)。Excelのcolorシートから動的に作成
var SSC_STRIPE_FONT_MAP = {"#FF0000":"#FF0000","#050505":"#FFFFFF","#FCFCFC":"#000000","#F00000":"#FFFFFF","#00BA54":"#FFFFFF","#FFFF00":"#000000","#A25900":"#FFFFFF","#006EFF":"#FFFFFF","#FFA0B1":"#000000","#BABABA":"#000000","#99FFCC":"#000000","#65E2FF":"#000000","#BA44FF":"#FFFFFF","#FF8211":"#000000","#CD9800":"#FFFFFF","#FFB366":"#000000","#646464":"#FFFFFF","#5D5D5D":"#FFFFFF","#ADADAD":"#000000","#CBCBCB":"#000000","#063406":"#FFFFFF","#FFEF8F":"#000000","#EAEA59":"#000000","#06064A":"#FFFFFF","#3F0600":"#FFFFFF","#D6B641":"#000000","#644A8D":"#FFFFFF","#DCB9FF":"#000000","#FF5A00":"#FFFFFF","#BABABA":"#000000","#FCFCFC":"#000000","#E65A00":"#FFFFFF","#81D8D0":"#FFFFFF","#BABABA":"#000000","#000000":"#FFFFFF","#000000":"#FFFFFF","#000000":"#FFFFFF"};
// 黒(ColorName="B")のColorVal。液晶が黒背景のため黒だけ特別扱いする
// このページが置かれている製品品番フォルダ名(自分自身の親フォルダ名)を取得する。
// 配索図_誘導側へ遷移する際、品番を決め打ちせず現在表示中の品番に合わせるために使う
function getCurrentProductFolder() {
    var segments = window.location.pathname.split('/');
    return segments[segments.length - 2] || '';
}
// divクリックによる「56_配索図_誘導」への遷移は、入力欄からの遷移(checkText)と違い
// ページの実在確認をしていなかったため、対応する配索図ページが無いと素の404が表示されてしまっていた。
// 遷移前にHEADリクエストで実在確認し、無ければ専用のnotFound.htmlへ遷移させる
// (reason=wiringで、通常の「存在しない端末/構成ナンバーです」とは別の専用メッセージを表示する。
// notFound.html側で数秒後に元のページへ自動的に戻る仕組みは既存のまま)
function navigateOrNotFound(target) {
    var xhr = new XMLHttpRequest();
    try {
        xhr.open('HEAD', target, false);
        xhr.send();
    } catch (e) {}
    window.location.href = (xhr.status === 200) ? target : "notfound.html?reason=wiring";
}
var SSC_BLACK_COLOR_VAL = "#050505";
// 点滅アニメーションの基準時刻。box(blinkStripeBox)と連結バーはスクリプト実行中の
// 異なるタイミングで作成されるため、それぞれ個別にanimationを開始すると、わずかな
// 作成タイミングの差でも点滅の位相がずれて見えてしまう。全ての点滅要素をこの共通の
// 基準時刻からの経過時間で揃えたanimation-delay(負の値)で開始させることで、
// 作成順に関わらず同じ位相で点滅するようにする
var SSC_BLINK_ANIM_START = performance.now();
// 点滅要素(box・連結バー共通)に、基準時刻に揃えた点滅アニメーションを適用する
function applySyncedBlink(el, blinkRate) {
    if (blinkRate === 0) {
        el.style.animation = 'none';
        return;
    }
    var duration = (blinkRate !== null && blinkRate !== undefined && !isNaN(blinkRate) && blinkRate > 0) ? (1 / blinkRate) : 0.7;
    el.style.animationName = 'blinkHole';
    el.style.animationTimingFunction = 'linear';
    el.style.animationIterationCount = 'infinite';
    el.style.animationDuration = duration + 's';
    var elapsed = (performance.now() - SSC_BLINK_ANIM_START) / 1000;
    el.style.animationDelay = '-' + (elapsed % duration) + 's';
}
// キャビティ内テキストの縁取り(text-shadow)を、ぼかし無しのくっきりした輪郭で作る
// (blur付きshadowだと文字がボワーっと滲むため、8方向へのオフセットのみで太さemの縁取りにする。
// pxではなくem(そのテキスト自身のフォントサイズ比)にすることで、通常表示と完成形モーダルの
// ようにフォントサイズが大きく異なる場所でも、同じ太さの見え方になる)
function buildOutlineShadow(color, em) {
    var offsets = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    return offsets.map(function (o) {
        return (o[0] * em) + 'em ' + (o[1] * em) + 'em 0 ' + color;
    }).join(', ');
}
// 詰め栓(空栓プラグ)の目印。中央に細い3本線のアスタリスク(*)を描く。
// 縁取りが二重に交差して見えないよう、まず縁取り色(plugFontColor)で少し太い棒を3本描き、
// その上に本来の太さ(長辺の10%)の棒をplugColorで重ね描きすることで、継ぎ目の無い
// 一筆書き状の縁取りにする(棒同士は同色で重なるため内側の境界線は見えない)
function buildPlugAsterisk(fillColor, strokeColor, boxW, boxH) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + boxW + ' ' + boxH);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    var maxDim = Math.max(boxW, boxH);
    var cx = boxW / 2, cy = boxH / 2;
    var halfLenInner = maxDim * 0.4;
    var halfWidthInner = maxDim * 0.05;
    var borderThickness = Math.max(1, maxDim * 0.04);
    function addBars(halfWidth, halfLen, color) {
        for (var a = 0; a < 180; a += 60) {
            var bar = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            var pts = [
                (cx - halfWidth) + ',' + (cy - halfLen),
                (cx + halfWidth) + ',' + (cy - halfLen),
                (cx + halfWidth) + ',' + (cy + halfLen),
                (cx - halfWidth) + ',' + (cy + halfLen)
            ].join(' ');
            bar.setAttribute('points', pts);
            bar.setAttribute('transform', 'rotate(' + a + ' ' + cx + ' ' + cy + ')');
            bar.setAttribute('fill', color);
            svg.appendChild(bar);
        }
    }
    addBars(halfWidthInner + borderThickness, halfLenInner + borderThickness, strokeColor);
    addBars(halfWidthInner, halfLenInner, fillColor);
    return svg;
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
// 同じ作業番号を持つdiv群(members: [{cx,cy}, ...])を、最小全域木(MST)で結ぶ辺を求める。
// 距離が近いもの同士を優先的に繋ぐことで、1列/L字/分岐等どんな配置でも全メンバーが
// 1つに繋がって見えるようにする(要素数は数個程度のため、シンプルなO(n^2)のPrim法で十分)
function buildGroupMstEdges(members) {
    var n = members.length;
    var edges = [];
    if (n < 2) return edges;
    var inTree = [true];
    for (var i = 1; i < n; i++) inTree.push(false);
    var dist = function (i, j) {
        var dx = members[i].cx - members[j].cx, dy = members[i].cy - members[j].cy;
        return Math.sqrt(dx * dx + dy * dy);
    };
    for (var step = 1; step < n; step++) {
        var bestFrom = -1, bestTo = -1, bestDist = Infinity;
        for (var a = 0; a < n; a++) {
            if (!inTree[a]) continue;
            for (var b = 0; b < n; b++) {
                if (inTree[b]) continue;
                var d = dist(a, b);
                if (d < bestDist) { bestDist = d; bestFrom = a; bestTo = b; }
            }
        }
        if (bestTo === -1) break;
        inTree[bestTo] = true;
        edges.push([bestFrom, bestTo]);
    }
    return edges;
}
// 2点(m1)?(m2)を、水平→垂直の帯(エルボー)で繋ぐ。同じ行/列同士なら自然に直線になり、
// L字の角にあたる場合は直角に曲がって繋がる。divが横に隣接する場合はその間に、
// 太さ(高さ)がdivの30%の小さいdivを1つ追加する(上下だけボーダーを付け、左右は
// 付けない)。縦に隣接する場合も同様(幅30%、左右だけボーダー)。30%にすることで、
// 個々の穴の位置(境界)が分かる程度は残しつつ、繋がっていることも分かるようにする
function drawGroupConnector(container, m1, m2, color) {
    var cx1 = m1.cx, cy1 = m1.cy, cx2 = m2.cx, cy2 = m2.cy;
    var blinkRate = m1.blinkRate;
    var borderColor = m1.borderColor || '#fff';
    var hasH = Math.abs(cx1 - cx2) > 0.5;
    var hasV = Math.abs(cy1 - cy2) > 0.5;
    var createdBars = [];
    // divより前面に重ねて描く(背面だと、boxが半透明になる点滅の途中で連結バーが
    // 薄く透けて見えてしまうため)
    function makeBar(x, y, w, h, bg) {
        var el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.boxSizing = 'border-box';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.width = w + 'px';
        el.style.height = h + 'px';
        el.style.backgroundColor = bg;
        el.style.zIndex = 25;
        el.style.pointerEvents = 'none';
        applySyncedBlink(el, blinkRate);
        container.appendChild(el);
        createdBars.push(el);
        return el;
    }
    if (hasH) {
        var dirX = cx2 >= cx1 ? 1 : -1;
        var hStart = cx1 + dirX * (m1.width / 2);
        // 縦方向の繋がりも無い(直線)場合はm2の端まで、あれば(L字)曲がり角で止める
        var hEnd = hasV ? cx2 : (cx2 - dirX * (m2.width / 2));
        var hLeft = Math.min(hStart, hEnd), hRight = Math.max(hStart, hEnd);
        var hThickness = m1.height * 0.3;
        var hSeg = makeBar(hLeft, cy1 - hThickness / 2, hRight - hLeft, hThickness, color);
        hSeg.style.borderTop = '1px solid ' + borderColor;
        hSeg.style.borderBottom = '1px solid ' + borderColor;
        if (m1.el) m1.el.style[dirX > 0 ? 'borderRight' : 'borderLeft'] = 'none';
        if (!hasV && m2.el) m2.el.style[dirX > 0 ? 'borderLeft' : 'borderRight'] = 'none';
    }
    if (hasV) {
        var dirY = cy2 >= cy1 ? 1 : -1;
        var vEnd = cy2 - dirY * (m2.height / 2);
        // 横方向の繋がりも無い(直線)場合はm1の端まで、あれば(L字)曲がり角で止める
        var vStart = hasH ? cy1 : (cy1 + dirY * (m1.height / 2));
        var vTop = Math.min(vStart, vEnd), vBottom = Math.max(vStart, vEnd);
        var vThickness = m2.width * 0.3;
        var vSeg = makeBar(cx2 - vThickness / 2, vTop, vThickness, vBottom - vTop, color);
        vSeg.style.borderLeft = '1px solid ' + borderColor;
        vSeg.style.borderRight = '1px solid ' + borderColor;
        if (m2.el) m2.el.style[dirY > 0 ? 'borderTop' : 'borderBottom'] = 'none';
        if (!hasH && m1.el) m1.el.style[dirY > 0 ? 'borderBottom' : 'borderTop'] = 'none';
    }
    return createdBars;
}
function setPositionFromDataAttributes() {
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
	var mainSvg = document.getElementById("mainSvg");
	if (mainSvg) {
		mainSvg.style.top = tagRowTop + "px";
		mainSvg.style.height = tagRowHeight + 15 + "px";
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
				setInterval(function() {
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
									navigateOrNotFound("../../56_配索図_誘導/" + getCurrentProductFolder() + "/" + values[index] + ".html");
								};
						}else{
							box.style.backgroundColor = "#CCC";
						}
					} else {
						box.classList.remove('blink-border');
					}
					box.style.backgroundColor = colors[index];
				}, 1000);
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
					navigateOrNotFound("../../56_配索図_誘導/" + getCurrentProductFolder() + "/" + values[0] + ".html");
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
			if (values[0]) {
				tableBox.style.cursor = "pointer";
				(function (pageNum) {
					tableBox.addEventListener("click", function () {
						showTerminalFinalState(pageNum);
					});
				})(values[0]);
			}
		}
		var left = (xRatio / 100) * window.innerWidth - tableBox.offsetWidth / 2;
		tableBox.style.left = left + "px";
		tableBox.style.top = tagRowTop + "px";
	}
	renderProductionCounter();
	// data-connectで指定された端末タグを強調表示する(点滅色は2ndディスプレイ校正で選んだ色を優先)
	if (mainSvg) {
		var connectAttr = mainSvg.getAttribute("data-connect");
		var connectIds = connectAttr ? connectAttr.split(",") : [];
		var connectColor = mainSvg.getAttribute("data-color") || "#FFF";
		try {
			var savedCal = JSON.parse(sscCalGet()) || { BLINK_COLOR_OVERRIDE: '#39FF14' };
			if (savedCal && typeof savedCal.BLINK_COLOR_OVERRIDE === 'string' && savedCal.BLINK_COLOR_OVERRIDE) {
				connectColor = savedCal.BLINK_COLOR_OVERRIDE;
			}
		} catch (e) {}
		for (var ci = 0; ci < connectIds.length; ci++) {
			var targetBox = document.getElementById(connectIds[ci]);
			if (targetBox) {
				targetBox.style.setProperty('--blink-color-a', targetBox.style.backgroundColor || targetBox.getAttribute('data-color'));
				targetBox.style.setProperty('--blink-color-b', connectColor);
				targetBox.classList.add('blinkTwoColors');
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
		// 画像の回転角度(0/90/180/270)。現状は180のみ対応(90/270は縦横比の入れ替えが別途必要なため保留)
		var rotateAngle = parseInt(singleImage.getAttribute('data-rotate'), 10) || 0;
		var rotatedBoxes = [], rotatedCrosshair = [], rotatedBars = [];
		// 画像を背景として設定
		singleImage.style.backgroundImage = 'url(' + src + ')';
		// テーブル/tagRowの下端を残り領域の開始位置とする
		var dataTable = document.querySelector('.dataTable') || document.querySelector('table');
		var tableBottom = dataTable ? (dataTable.getBoundingClientRect().bottom + window.scrollY) : 0;
		// tagRow(端末タグの行)は画面最下段に固定表示し、図を配置できる残り領域はテーブル下端からtagRow手前までとする
		var firstTableBox = document.querySelector('.tableBox');
		var tagRowHeight = firstTableBox ? firstTableBox.offsetHeight : 20;
		var tagRowBottomMargin = 20;
		var tagRowTop = window.innerHeight - tagRowBottomMargin - tagRowHeight;
		var viewTop = tableBottom;
		var viewHeight = tagRowTop - viewTop;
		// 最大幅と最大高さを設定(残り領域いっぱいに、アスペクト比は変更しない)
		var maxWidth = window.innerWidth * 0.9; // 90vw
		var maxHeight = viewHeight;
		var width = maxWidth;
		var height = width / aspectRatio;
		if (height > maxHeight) {
			height = maxHeight;
			width = height * aspectRatio;
		}
		singleImage.style.width = width + 'px';
		singleImage.style.height = height + 'px';
		// 左右中央
		var left = (window.innerWidth - width) / 2;
		singleImage.style.left = left + 'px';
		// 上下中央(残り領域内)
		var top = viewTop + (viewHeight - height) / 2;
		singleImage.style.top = top + 'px';
        // 点滅座標が無い場合はスキップ
        if (!blinkPoints.length) continue;
        // 同じ作業番号を持つdiv同士が物理的に繋がっている(3連端子等)ことが視覚的に
        // 分かるよう、作業番号ごとに表示されているdivの中心座標等を記録しておき、
        // ループの最後にまとめて連結バーを描く
        var workNumGroups = {};
        for (var i = 0; i < blinkPoints.length; i++) {
            var pt = blinkPoints[i];
            var composition = pt.composition;
            var color = pt.color;
            var radius = pt.radius;
            // 任意項目: 背景色, 枠線色, 表示テキスト。省略時は既定値を使用
            var bgColor = (pt.bgColor && String(pt.bgColor).trim() !== '') ? String(pt.bgColor).trim() : color;
            var borderColor = (pt.borderColor && String(pt.borderColor).trim() !== '') ? String(pt.borderColor).trim() : '#fff';
            var wireSizeDisplay = pt.wireSize ? String(pt.wireSize).replace(/F/g, '').slice(0, 3) : '';
            var boxText = (pt.text && String(pt.text).trim() !== '') ? String(pt.text).trim() : (wireSizeDisplay || composition || '');
            // 点滅速度(1秒あたりの回数)。0で点滅無し、省略時は既定の速さ
            var blinkRate = (pt.blink !== undefined && pt.blink !== null && String(pt.blink).trim() !== '') ? parseFloat(pt.blink) : null;
            var blinkXPos = (pt.x / 100) * singleImage.clientWidth;
            var blinkYPos = (pt.y / 100) * singleImage.clientHeight;
            var blinkWidth = (pt.w / 100) * singleImage.clientWidth;
            var blinkHeight = (pt.h / 100) * singleImage.clientHeight;
            var isActiveHole = color && color.trim() !== '' && color.trim() !== '#';
            var fontColor = SSC_STRIPE_FONT_MAP[bgColor.trim().toUpperCase()] || ((pt.fontColor && String(pt.fontColor).trim() !== '' && String(pt.fontColor).trim() !== '#') ? String(pt.fontColor).trim() : '');
            // 詰め栓(空栓プラグ)。plugColorはcavごとの区別ではなく製品単位でほぼ一律に
            // 出力されているため、それだけでは判定できない。電線が入るcav(composition指定あり)は
            // 現在の作業順でまだ光っていない(isActiveHole=false)だけの場合があり、
            // 将来的に必ず電線が入るので詰め栓表示にしてはいけない。
            // よってcomposition(≒wireSize)が無い、本当に電線が来ないcavだけを対象にする
            var plugColorVal = pt.plugColor ? String(pt.plugColor).trim() : '';
            var plugFontColorVal = pt.plugFontColor ? String(pt.plugFontColor).trim() : '';
            var isPlugged = plugColorVal !== '' && plugColorVal !== '#' && (!composition || String(composition).trim() === '');
			var blinkDiv = document.createElement('div');
			blinkDiv.style.position = 'absolute';
			blinkDiv.style.left = (left + blinkXPos) + 'px';
			blinkDiv.style.top = (top + blinkYPos) + 'px';
			blinkDiv.style.width = blinkWidth + 'px';
			blinkDiv.style.height = blinkHeight + 'px';
			blinkDiv.style.borderRadius = radius + "%";
            if (isActiveHole) {
                blinkDiv.classList.add('blinkStripeBox');
                blinkDiv.style.setProperty('--stripe-color', bgColor);
                blinkDiv.style.backgroundColor = color;
                if (color.trim().toUpperCase() === SSC_BLACK_COLOR_VAL.toUpperCase()) {
                    blinkDiv.style.border = 'none';
                } else {
                    blinkDiv.style.borderColor = borderColor;
                }
                var textSpan = document.createElement('span');
                textSpan.className = 'blinkStripeBoxText';
                textSpan.innerHTML = boxText.split('.').join('<span style="font-size:0.5em">.</span>');
                if (fontColor) {
                    textSpan.style.color = fontColor;
                    if (color.trim().toUpperCase() !== bgColor.trim().toUpperCase()) {
                        textSpan.style.textShadow = buildOutlineShadow(bgColor, 0.12);
                    } else {
                        textSpan.style.textShadow = 'none';
                    }
                }
                blinkDiv.appendChild(textSpan);
                applySyncedBlink(blinkDiv, blinkRate);
            } else if (isPlugged) {
                blinkDiv.classList.add('blinkPlug');
                blinkDiv.style.backgroundColor = plugColorVal;
                blinkDiv.appendChild(buildPlugAsterisk(plugColorVal, plugFontColorVal || '#000', blinkWidth, blinkHeight));
            } else {
                blinkDiv.classList.add('blinkHole');
                blinkDiv.style.backgroundColor = color;
            }
            // 電線色が重複する場合の識別用に端子に付けるマジックの色。
            // divの右下にティアドロップ(しずく)形状で表示する。
            // サイズ・位置はVBAのBoxMagicPen(オートシェイプ版)を参考に、
            // 短辺の約27%のサイズ・右端は隙間無く揃え・下端はholeから少しはみ出す形にする
            var feltColorVal = pt.feltColor ? String(pt.feltColor).trim() : '';
            if (isActiveHole && feltColorVal && feltColorVal !== '#') {
                var feltSize = Math.min(blinkWidth, blinkHeight) * 0.38 * 0.7;
                var feltDrop = document.createElement('div');
                feltDrop.style.position = 'absolute';
                feltDrop.style.right = '0';
                feltDrop.style.bottom = (-blinkHeight * 0.02) + 'px';
                feltDrop.style.width = feltSize + 'px';
                feltDrop.style.height = feltSize + 'px';
                feltDrop.style.boxSizing = 'border-box';
                feltDrop.style.background = feltColorVal;
                feltDrop.style.border = '1px solid ' + (pt.feltColorBorder ? String(pt.feltColorBorder).trim() : '#000');
                feltDrop.style.borderRadius = '50% 50% 50% 0';
                feltDrop.style.transform = 'rotate(180deg)';
                feltDrop.style.transformOrigin = 'center';
                feltDrop.style.pointerEvents = 'none';
                feltDrop.style.zIndex = 22;
                blinkDiv.appendChild(feltDrop);
            }
            // 同じ作業番号(pt.workNum)を持つ、実際に表示されているdiv同士の中心座標を集計
            if (isActiveHole && pt.workNum && String(pt.workNum) !== '0') {
                var gLeft = left + blinkXPos, gTop = top + blinkYPos;
                var gCx = gLeft + blinkWidth / 2, gCy = gTop + blinkHeight / 2;
                var gMember = { cx: gCx, cy: gCy, width: blinkWidth, height: blinkHeight, blinkRate: blinkRate, el: blinkDiv, borderColor: (color.trim().toUpperCase() === SSC_BLACK_COLOR_VAL.toUpperCase()) ? '#fff' : borderColor };
                var grp = workNumGroups[pt.workNum];
                if (!grp) {
                    // 連結バーは背景色(bgColor)だと白い縞模様と紛れて見えにくいことがあるため、
                    // よりコントラストの付く色(color)を使う
                    workNumGroups[pt.workNum] = { members: [gMember], color: color };
                } else {
                    grp.members.push(gMember);
                }
            }
			if (composition) {
				blinkDiv.style.cursor = 'pointer';
						(function(comp) {
						blinkDiv.addEventListener('click', function() {
						navigateOrNotFound("../../56_配索図_誘導/" + getCurrentProductFolder() + "/" + comp + ".html");
						});
						})(composition);
			}
			document.body.appendChild(blinkDiv);
			rotatedBoxes.push(blinkDiv);
            // 点滅している穴(色が実際に指定されているもの)の中心を通る十字線を画面いっぱいに表示。点滅無し(blink:0)の場合は表示しない
            // 電線が無いcav(hasWire:false、端子のみ挿入)は十字線を表示しない
            if (isActiveHole && blinkRate !== 0 && pt.hasWire !== false) {
				// このdiv自身は十字線より前面に出し、自分の上を通る線でテキストが隠れないようにする
				blinkDiv.style.zIndex = 21;
				var crosshairCenterX = left + blinkXPos + blinkWidth / 2;
				var crosshairCenterY = top + blinkYPos + blinkHeight / 2;
				var vLine = document.createElement('div');
				vLine.classList.add('blinkCrosshair');
				vLine.classList.add('blinkSmooth');
				vLine.style.position = 'absolute';
				vLine.style.left = (crosshairCenterX - 1.5) + 'px';
				vLine.style.top = '0';
				vLine.style.width = '3px';
				vLine.style.height = '100vh';
				vLine.style.backgroundImage = 'linear-gradient(to right, ' + color + ' 0px, ' + color + ' 1px, ' + bgColor + ' 2px, ' + color + ' 2px, ' + color + ' 3px)';
				vLine.style.pointerEvents = 'none';
				document.body.appendChild(vLine);
				rotatedCrosshair.push(vLine);
					var hLine = document.createElement('div');
					hLine.classList.add('blinkCrosshair');
					hLine.classList.add('blinkSmooth');
					hLine.style.position = 'absolute';
					hLine.style.left = '0';
					hLine.style.top = (crosshairCenterY - 1.5) + 'px';
					hLine.style.width = '100vw';
					hLine.style.height = '3px';
					hLine.style.backgroundImage = 'linear-gradient(to bottom, ' + color + ' 0px, ' + color + ' 1px, ' + bgColor + ' 2px, ' + color + ' 2px, ' + color + ' 3px)';
					hLine.style.pointerEvents = 'none';
					document.body.appendChild(hLine);
					rotatedCrosshair.push(hLine);
					// 交点は縦横どちらの線が上に来ても見た目が変わらないよう、専用の小さい正方形を最前面に重ねる
					var centerDot = document.createElement('div');
					centerDot.classList.add('blinkCrosshair');
					centerDot.classList.add('blinkSmooth');
					centerDot.style.position = 'absolute';
					centerDot.style.left = (crosshairCenterX - 1.5) + 'px';
					centerDot.style.top = (crosshairCenterY - 1.5) + 'px';
					centerDot.style.width = '3px';
					centerDot.style.height = '3px';
					centerDot.style.backgroundColor = bgColor;
				centerDot.style.pointerEvents = 'none';
				document.body.appendChild(centerDot);
				rotatedCrosshair.push(centerDot);
			}
		}
        // 同じ作業番号を持つdivが2個以上表示されている場合、それらが繋がっている
        // (3連端子等)ことが視覚的に分かるよう、div同士の隙間だけを細い帯で繋ぐ。
        // 外接矩形で囲む方式だと、隣接する別グループの枠と重なって見分けにくくなる問題や、
        // div同士が隙間なく並んでいると枠線が見えにくい問題があったため、この方式にした
        for (var wnKey in workNumGroups) {
            var wnMembers = workNumGroups[wnKey].members;
            if (wnMembers.length < 2) continue;
            var wnColor = workNumGroups[wnKey].color;
            // 最小全域木(MST)で全メンバーを結ぶ辺を求める(L字等どんな配置でも、
            // 全メンバーが繋がって見えるようにするため)
            var mstEdges = buildGroupMstEdges(wnMembers);
            for (var ei = 0; ei < mstEdges.length; ei++) {
                var m1 = wnMembers[mstEdges[ei][0]];
                var m2 = wnMembers[mstEdges[ei][1]];
                var newBars = drawGroupConnector(document.body, m1, m2, wnColor);
                rotatedBars = rotatedBars.concat(newBars);
            }
        }
        // 回転指定(180°)がある場合、box・十字線・連結バーをsingleImageのローカル座標に変換して
        // singleImageの子要素にし、singleImage自体をrotate(180deg)することで画像・穴・ラベルの
        // 位置をまとめて反転させる。文字だけは逆回転で正立に戻す
        if (rotateAngle === 180) {
            var toLocalCoord = function(el) {
                var elLeft = parseFloat(el.style.left), elTop = parseFloat(el.style.top);
                el.style.left = (elLeft - left) + 'px';
                el.style.top = (elTop - top) + 'px';
                singleImage.appendChild(el);
            };
            rotatedBoxes.forEach(toLocalCoord);
            rotatedCrosshair.forEach(toLocalCoord);
            rotatedBars.forEach(toLocalCoord);
            singleImage.style.transformOrigin = 'center center';
            singleImage.style.transform = 'rotate(180deg)';
            var rotatedTextSpans = singleImage.querySelectorAll('.blinkStripeBoxText');
            for (var rti = 0; rti < rotatedTextSpans.length; rti++) {
                rotatedTextSpans[rti].style.transform = 'rotate(180deg)';
            }
        }
	}
	// プレゼンの埋め込み用: 0.5秒毎に入力欄へフォーカスを移す処理は消した(資料の他の所の操作を邪魔するため)
}
// タブレット(Android等)では入力欄にフォーカスが移るたびに画面キーボードが出るため、inputmode='none' でキーボードを出さない
// (バーコードリーダーの入力はそのまま使える)。入力欄を指でタップした時だけキーボードを出し、フォーカスが外れたら元に戻す。
(function () { var els = document.getElementsByClassName('myT'); for (var i = 0; i < els.length; i++) { els[i].setAttribute('inputmode', 'none'); els[i].addEventListener('pointerdown', function () { this.removeAttribute('inputmode'); }); els[i].addEventListener('blur', function () { this.setAttribute('inputmode', 'none'); }); } })();
// 生産本数カウント: 品番フォルダごとに、作業番号の中間地点のページを通過してから
// 最終ページ→先頭ページに進んだタイミングで1本とカウントする(逆走・往復での過剰カウント防止)。
// 日付が変わったら自動的に0にリセットされる。
var SSC_PRODUCTION_KEY = 'ssc_production_count';
var SSC_PRODUCTION_FLAGS_KEY = 'ssc_production_flags';
// 1本あたりの所要時間計測(モチベーション用)。
// 「作業番号」=ページ番号ごとに所要時間を計測する。SSC_SPEED_PAGE_HISTORY_KEYは日付をまたいで
// 持ち越す、品番+ページ番号ごとの累積実績。休憩を挟んで通常の4倍以上かかった場合は、その
// ページ番号自身の累積中央値を「採用値」として使うことで、休憩による極端な数字が作業者の目に
// 触れないようにする(ページごとの難易度差を1つの基準に混ぜないため、品番全体ではなく
// ページ番号ごとに基準を持つ)。
// SSC_SPEED_LAST_PAGE_KEYは「今どのページに何時何分に入ったか」。次のページに進んだ(≒作業番号が
// 完了した)瞬間に、このページの所要時間が確定する。
// SSC_SPEED_CYCLE_ACCUM_KEYは、1本(先頭ページ?最終ページ一周)ぶんの、各ページ所要時間(採用値)の
// 合計を品番ごとに積み上げる一時集計。1本カウントアップ時にこの合計を「1本の所要時間」として使い、
// リセットする。
// SSC_SPEED_TODAY_KEY / SSC_SPEED_PREV_DAY_KEY は「今日の平均」と「前回その品番を作業した日との
// 差分」表示用(品番ごとの1本合計を集計)。
var SSC_SPEED_PAGE_HISTORY_KEY = 'ssc_speed_page_history';
var SSC_SPEED_LAST_PAGE_KEY = 'ssc_speed_last_page';
var SSC_SPEED_CYCLE_ACCUM_KEY = 'ssc_speed_cycle_accum';
var SSC_SPEED_TODAY_KEY = 'ssc_speed_today';
var SSC_SPEED_PREV_DAY_KEY = 'ssc_speed_prev_day';
// 1本完了直後は次のページへ即座に遷移してしまいポップアップを表示しきれないため、
// 値を一時保存しておいて次のページの読み込み時に表示する(showPendingSpeedPopupIfAny参照)
var SSC_SPEED_PENDING_POPUP_KEY = 'ssc_speed_pending_popup';
var SSC_SPEED_PAGE_HISTORY_MAX = 200;
// 品番ごとの「1本の合計時間」の履歴(日をまたいで持ち越す)。ポップアップの「平均との比較」の
// 基準値として使う。作業者交代時は全品番まとめてリセットできる(resetSpeedHistoryAll)
var SSC_SPEED_CYCLE_HISTORY_KEY = 'ssc_speed_cycle_history';
var SSC_SPEED_CYCLE_HISTORY_MAX = 200;
function getTodayStr() {
  var d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}
function getCurrentFolder() {
  var parts = window.location.pathname.split('/').filter(function (p) { return p; });
  return parts.length >= 2 ? parts[parts.length - 2] : '';
}
function loadProductionData() {
  var data = null;
  try {
    data = JSON.parse(localStorage.getItem(SSC_PRODUCTION_KEY));
  } catch (e) {}
  var today = getTodayStr();
  if (!data || data.date !== today) {
    data = { date: today, counts: {} };
  }
  return data;
}
function saveProductionData(data) {
  localStorage.setItem(SSC_PRODUCTION_KEY, JSON.stringify(data));
}
function loadProductionFlags() {
  var flags = null;
  try {
    flags = JSON.parse(localStorage.getItem(SSC_PRODUCTION_FLAGS_KEY));
  } catch (e) {}
  return flags || {};
}
function saveProductionFlags(flags) {
  localStorage.setItem(SSC_PRODUCTION_FLAGS_KEY, JSON.stringify(flags));
}
window.markMidpointPassed = function () {
  var flags = loadProductionFlags();
  var folder = getCurrentFolder();
  flags[folder] = true;
  saveProductionFlags(flags);
  console.log('[SSC production] markMidpointPassed folder=' + folder + ' page=' + window.location.pathname);
};
window.incrementProductionCount = function () {
  var flags = loadProductionFlags();
  var folder = getCurrentFolder();
  console.log('[SSC production] incrementProductionCount called folder=' + folder + ' flag=' + flags[folder]);
  if (flags[folder]) {
    var data = loadProductionData();
    data.counts[folder] = (data.counts[folder] || 0) + 1;
    saveProductionData(data);
    flags[folder] = false;
    saveProductionFlags(flags);
    console.log('[SSC production] counted! new total=' + data.counts[folder]);
    // 最終ページ(=最後の作業番号)もここで清算してから、1本ぶんの合計を確定させる
    closeOutCurrentPageDuration();
    var accum = loadSpeedCycleAccum();
    var cycle = accum[folder];
    if (cycle && cycle.count > 0) {
      // 平均との比較表示に使うため、今回の記録を積む「前」の平均を基準値として使う
      var speedBaselineAvg = getCycleAverage(folder);
      recordCycleTotal(folder, cycle.sum, cycle.pages || []);
      // ここで直接ポップアップを出しても、この直後に次のページへ遷移してしまい
      // 表示される間もなく消えてしまうため、値だけ保存して次のページの読み込み時に表示する
      localStorage.setItem(SSC_SPEED_PENDING_POPUP_KEY, JSON.stringify({ ms: cycle.sum, avg: speedBaselineAvg }));
    }
    accum[folder] = { sum: 0, count: 0, pages: [] };
    saveSpeedCycleAccum(accum);
  } else {
    console.log('[SSC production] NOT counted (flag was not set)');
  }
};
function median(values) {
  var sorted = values.slice().sort(function (a, b) { return a - b; });
  var mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function formatSpeedDuration(ms) {
  var totalSec = Math.round(ms / 1000);
  var m = Math.floor(totalSec / 60);
  var s = totalSec % 60;
  return m > 0 ? (m + '.' + (s < 10 ? '0' : '') + s + 's') : (s + 's');
}
// 「本日の実績」モーダルの「平均」「前回作業日との差分」用のフォーマット。formatSpeedDurationの
// 「M.SSs」(分.秒)表記だと数分単位の見た目になり紛らわしいため、常に秒単位(小数第一位を四捨五入した整数)の表記にする
function formatSecondsShort(ms) {
  return Math.round(ms / 1000) + 's';
}
// 「本日の実績の詳細」モーダルのタイム表示用。「0:00」(分:秒、秒は2桁ゼロ埋め)形式にする
function formatMinSec(ms) {
  var totalSec = Math.round(ms / 1000);
  var m = Math.floor(totalSec / 60);
  var s = totalSec % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}
function getCurrentPageNum() {
  var m = window.location.pathname.match(/(\d+)\.html$/);
  return m ? m[1] : null;
}
function loadPageHistory() {
  var data = null;
  try { data = JSON.parse(localStorage.getItem(SSC_SPEED_PAGE_HISTORY_KEY)); } catch (e) {}
  return data || {};
}
function savePageHistory(data) {
  localStorage.setItem(SSC_SPEED_PAGE_HISTORY_KEY, JSON.stringify(data));
}
function loadLastPageEntry() {
  var data = null;
  try { data = JSON.parse(localStorage.getItem(SSC_SPEED_LAST_PAGE_KEY)); } catch (e) {}
  return data || null;
}
function saveLastPageEntry(entry) {
  localStorage.setItem(SSC_SPEED_LAST_PAGE_KEY, JSON.stringify(entry));
}
function clearLastPageEntry() {
  localStorage.removeItem(SSC_SPEED_LAST_PAGE_KEY);
}
function loadSpeedCycleAccum() {
  var data = null;
  try { data = JSON.parse(localStorage.getItem(SSC_SPEED_CYCLE_ACCUM_KEY)); } catch (e) {}
  return data || {};
}
function saveSpeedCycleAccum(data) {
  localStorage.setItem(SSC_SPEED_CYCLE_ACCUM_KEY, JSON.stringify(data));
}
// 直前に記録されていたページ(作業番号)を「今、離れた」ものとして所要時間を確定させる。
// 品番をまたいでいた場合(別の品番を触り始めていた)は比較にならないので記録せず捨てる。
// 比較できる記録が無い(そのページに初めて来た/アプリを初めて使った)場合はnullを返す。
// 確定した所要時間がそのページ番号の累積中央値の4倍以上なら休憩などの異常値とみなし、
// 採用値はその中央値に置き換える(実測値は返り値にのみ含め、履歴には残さない)。
// 逆に中央値の半分以下(2倍速い)の場合は誤操作(次へを連打した等)の可能性が高いとみなし、
// 同じく中央値を採用する。この「速すぎ」のケースは中央値の計算対象からも除外する
// (履歴に残すと、誤操作由来の短い値に中央値そのものが引っ張られてしまうため)。
// どちらのケースで中央値を採用したかはreason('fast'/'slow')として持たせ、詳細画面で
// 「中央値(速すぎ)」「中央値(遅すぎ)」のように区別して表示できるようにする
function closeOutCurrentPageDuration() {
  var last = loadLastPageEntry();
  if (!last) return null;
  var folder = getCurrentFolder();
  clearLastPageEntry();
  if (last.folder !== folder) {
    return null;
  }
  var now = Date.now();
  var raw = now - last.enteredAt;
  var pageHistory = loadPageHistory();
  var folderPages = pageHistory[folder] || {};
  var pageTimes = folderPages[last.page] || [];
  var flagged = false;
  var tooFast = false;
  var reason = null;
  var effective = raw;
  if (pageTimes.length > 0) {
    var baseline = median(pageTimes);
    var tooSlow = raw >= baseline * 4;
    tooFast = baseline > 0 && raw <= baseline * 0.5;
    flagged = tooSlow || tooFast;
    reason = tooFast ? 'fast' : (tooSlow ? 'slow' : null);
    effective = flagged ? baseline : raw;
  }
  if (!tooFast) {
    pageTimes.push(effective);
    if (pageTimes.length > SSC_SPEED_PAGE_HISTORY_MAX) pageTimes.shift();
    folderPages[last.page] = pageTimes;
    pageHistory[folder] = folderPages;
    savePageHistory(pageHistory);
  }
  var accum = loadSpeedCycleAccum();
  var cur = accum[folder] || { sum: 0, count: 0, pages: [] };
  if (!cur.pages) cur.pages = [];
  cur.sum += effective;
  cur.count += 1;
  cur.pages.push({ page: last.page, effective: effective, flagged: flagged, reason: reason });
  accum[folder] = cur;
  saveSpeedCycleAccum(accum);
  return { page: last.page, raw: raw, effective: effective, flagged: flagged, reason: reason };
}
// 1本ぶんの合計時間を、今日の実績(平均・前回作業日との差分の元データ)として記録する。
// pages(作業番号ごとの内訳、中央値に置き換わったかのフラグ付き)も一緒に保存しておくことで、
// 詳細画面でその1本をクリックしたときに内訳を出せるようにする
function recordCycleTotal(folder, totalMs, pages) {
  var today = loadTodaySpeedData();
  if (!today.folders[folder]) today.folders[folder] = { entries: [] };
  today.folders[folder].entries.push({ effective: totalMs, completedAt: Date.now(), pages: pages || [] });
  saveTodaySpeedData(today);
  var hist = loadCycleHistory();
  var arr = hist[folder] || [];
  arr.push(totalMs);
  if (arr.length > SSC_SPEED_CYCLE_HISTORY_MAX) arr.shift();
  hist[folder] = arr;
  saveCycleHistory(hist);
}
function loadCycleHistory() {
  var data = null;
  try { data = JSON.parse(localStorage.getItem(SSC_SPEED_CYCLE_HISTORY_KEY)); } catch (e) {}
  return data || {};
}
function saveCycleHistory(data) {
  localStorage.setItem(SSC_SPEED_CYCLE_HISTORY_KEY, JSON.stringify(data));
}
// 品番ごとの「1本の合計時間」の平均(持ち越し履歴の単純平均)。実績が無ければnull
function getCycleAverage(folder) {
  var hist = loadCycleHistory();
  var arr = hist[folder];
  if (!arr || !arr.length) return null;
  var sum = arr.reduce(function (a, v) { return a + v; }, 0);
  return sum / arr.length;
}
// 品番ごとの直近10本の推移を、YouTube Studioのリアルタイムパフォーマンスのような
// 小さな折れ線(スパークライン)で表示する。値・軸ラベルは出さず、形だけで傾向を見せる。
// マウスオーバーで「直近10本の推移」とわかるよう独自ツールチップ(attachSscTooltip)を付与する。
// データが2件未満(推移を描けない)場合はnullを返す
function buildCycleSparkline(folder, w, h, markLast) {
  var hist = loadCycleHistory()[folder] || [];
  var svg = buildSparklineFromValues(hist.slice(-10), w, h, markLast);
  if (!svg) return null;
  var wrap = document.createElement('span');
  attachSscTooltip(wrap, '直近10本の推移');
  wrap.style.cssText = 'display:inline-flex;flex:0 0 auto;line-height:0;cursor:default;';
  wrap.appendChild(svg);
  return wrap;
}
// buildCycleSparklineの中身。生の数値配列を直接渡して描く版(詳細画面のページ別推移でも使う)
function buildSparklineFromValues(recent, w, h, markLast) {
  if (!recent || recent.length < 2) return null;
  w = w || 56;
  h = h || 22;
  var max = Math.max.apply(null, recent);
  var min = Math.min.apply(null, recent);
  var range = max - min || 1;
  // 速い(値が小さい)方を上にする(遅い方が上だと直感に反するため、他の速度表示と向きを揃える)
  function toY(v) { return ((v - min) / range) * h; }
  var points = recent.map(function (v, i) {
    var x = (i / (recent.length - 1)) * w;
    return x.toFixed(1) + ',' + toY(v).toFixed(1);
  }).join(' ');
  var areaPoints = points + ' ' + w + ',' + h + ' 0,' + h;
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  // ページ背景の配線図用に "svg{position:absolute;width:100%;height:100%;...}" という
  // グローバルルールがあり、このSVGにも効いてしまうため、style属性で明示的に上書きする。
  // pointer-events:noneだとマウスホバー自体を受け付けずツールチップ用のマウスイベントが
  // 拾えなくなるため、ここではautoのままにする(クリック等は特に処理していないので副作用は無い)
  svg.style.cssText = 'display:block;flex:0 0 auto;overflow:visible;position:static;' +
      'width:' + w + 'px;height:' + h + 'px;top:auto;left:auto;pointer-events:auto;';
  // エリア塗り(area)は折れ線の下側しか塗らないため、線の上側(空白部分)はSVG的に
  // 何も描画されていない透明な領域になり、pointer-eventsをautoにしても当たり判定が無く
  // ホバーが素通りしてしまう。全面を覆う透明な矩形を最背面に敷いて、
  // どこにカーソルを置いても確実にホバー判定されるようにする
  var hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  hitArea.setAttribute('x', 0);
  hitArea.setAttribute('y', 0);
  hitArea.setAttribute('width', w);
  hitArea.setAttribute('height', h);
  hitArea.setAttribute('fill', 'transparent');
  svg.appendChild(hitArea);
  // 中央値の位置に、基準線として点線を1本引く(推移の線より背面に、薄い色で)
  var medianY = toY(median(recent));
  var medianLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  medianLine.setAttribute('x1', 0);
  medianLine.setAttribute('x2', w);
  medianLine.setAttribute('y1', medianY.toFixed(1));
  medianLine.setAttribute('y2', medianY.toFixed(1));
  medianLine.setAttribute('stroke', 'rgba(255,255,255,0.35)');
  medianLine.setAttribute('stroke-width', '1');
  medianLine.setAttribute('stroke-dasharray', '2,2');
  var area = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  area.setAttribute('points', areaPoints);
  area.setAttribute('fill', 'rgba(240,112,112,0.25)');
  var line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  line.setAttribute('points', points);
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', '#F07070');
  line.setAttribute('stroke-width', '1.5');
  line.setAttribute('stroke-linejoin', 'round');
  line.setAttribute('stroke-linecap', 'round');
  svg.appendChild(medianLine);
  svg.appendChild(area);
  svg.appendChild(line);
  // 完了ポップアップでは、今回の値がどこかひと目でわかるよう最新点だけ丸印で強調する
  if (markLast) {
    var lastDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    lastDot.setAttribute('cx', w);
    lastDot.setAttribute('cy', toY(recent[recent.length - 1]).toFixed(1));
    lastDot.setAttribute('r', 2.4);
    lastDot.setAttribute('fill', '#F07070');
    lastDot.setAttribute('stroke', '#fff');
    lastDot.setAttribute('stroke-width', '1');
    svg.appendChild(lastDot);
  }
  return svg;
}
// 速度の基準(ページごとの中央値履歴・1本合計の平均履歴)を全品番まとめてリセットする。
// 作業者が交代した時に、前の作業者のペースを新しい作業者の基準にしないために使う
function resetSpeedHistoryAll() {
  localStorage.removeItem(SSC_SPEED_PAGE_HISTORY_KEY);
  localStorage.removeItem(SSC_SPEED_CYCLE_HISTORY_KEY);
}
function loadPrevDaySpeed() {
  var data = null;
  try { data = JSON.parse(localStorage.getItem(SSC_SPEED_PREV_DAY_KEY)); } catch (e) {}
  return data || {};
}
function savePrevDaySpeed(data) {
  localStorage.setItem(SSC_SPEED_PREV_DAY_KEY, JSON.stringify(data));
}
// 日付が変わったタイミングで、直前の日の「今日の平均」をSSC_SPEED_PREV_DAY_KEYへ退避してから
// SSC_SPEED_TODAY_KEYを空にする(前回作業日との差分表示に使うため、日付が変わっても消えない)
function archivePreviousDaySpeed(outgoingData) {
  var prev = loadPrevDaySpeed();
  Object.keys(outgoingData.folders).forEach(function (folder) {
    var entries = outgoingData.folders[folder].entries;
    if (!entries || !entries.length) return;
    var sum = entries.reduce(function (a, e) { return a + e.effective; }, 0);
    prev[folder] = { date: outgoingData.date, avg: sum / entries.length };
  });
  savePrevDaySpeed(prev);
}
function loadTodaySpeedData() {
  var data = null;
  try { data = JSON.parse(localStorage.getItem(SSC_SPEED_TODAY_KEY)); } catch (e) {}
  var today = getTodayStr();
  if (!data || data.date !== today) {
    if (data && data.date) archivePreviousDaySpeed(data);
    data = { date: today, folders: {} };
  }
  return data;
}
function saveTodaySpeedData(data) {
  localStorage.setItem(SSC_SPEED_TODAY_KEY, JSON.stringify(data));
}
function getTodayAvgForFolder(folder) {
  var today = loadTodaySpeedData();
  var f = today.folders[folder];
  if (!f || !f.entries.length) return null;
  var sum = f.entries.reduce(function (a, e) { return a + e.effective; }, 0);
  return sum / f.entries.length;
}
// ポップアップの登場(拡大しながらフェードイン)?退場(フェードアウト)アニメーション。
// :hoverと同じ理由で1度だけ<style>タグを挿入する
var sscSpeedPopupStyle = document.createElement('style');
sscSpeedPopupStyle.textContent =
  '@keyframes sscSpeedPopupIn {' +
  '0%{transform:translate(-50%,-50%) scale(0.5);opacity:0;}' +
  '15%{transform:translate(-50%,-50%) scale(1.15);opacity:1;}' +
  '25%{transform:translate(-50%,-50%) scale(1);opacity:1;}' +
  '80%{transform:translate(-50%,-50%) scale(1);opacity:1;}' +
  '100%{transform:translate(-50%,-50%) scale(1);opacity:0;}' +
  '}';
document.head.appendChild(sscSpeedPopupStyle);
// モーダルパネル共通のスクロールバー装飾。指定しないとOS標準のスクロールバーがそのまま出て
// 周囲の暗い配色から浮いてしまうため、幅を標準の半分程度・テーマ色に合わせたデザインにする
var sscModalScrollStyle = document.createElement('style');
sscModalScrollStyle.textContent =
  '.sscModalPanel{scrollbar-width:thin;scrollbar-color:#F07070 #333;}' +
  '.sscModalPanel::-webkit-scrollbar{width:7px;}' +
  '.sscModalPanel::-webkit-scrollbar-track{background:#333;border-radius:4px;}' +
  '.sscModalPanel::-webkit-scrollbar-thumb{background:#F07070;border-radius:4px;}' +
  '.sscModalPanel::-webkit-scrollbar-thumb:hover{background:#ff8f8f;}';
document.head.appendChild(sscModalScrollStyle);
// ポップアップ表示に合わせて鳴らすSE。
// 以前はWeb Audio API(AudioContext)でその場で生成していたが、AudioContextは
// ページ側でユーザー操作が起きるまで自動再生がブロックされることがあり、
// 1本完了直後に別ページへ遷移してから鳴らす今の作りとは相性が悪い(現場PCで無音になる
// 不具合の原因になった)。<audio>要素(new Audio().play())は同じ環境で問題なく
// 自動再生できているため、事前に用意した短い音声ファイルを鳴らす方式に変更した。
// positive=true(平均より速い/初回計測)は明るい2音の上昇音、falseは平均より遅い時の落ち着いた単音
function playSpeedPopupSound(positive) {
  try {
    var audio = new Audio((positive ? '../complete_fast.wav' : '../complete_slow.wav'));
    audio.play().catch(function () {});
  } catch (e) {}
}
// 1本完了時に、その所要時間(採用値)を3秒だけ画面中央に表示する。
// avgに品番の「1本合計」の平均(getCycleAverage)を渡すと、平均より速いか遅いかを
// 色(緑/赤)と差分テキストで表示する。avgが無い(その品番の初回計測)場合は比較なしで表示する
function showSpeedPopup(ms, avg) {
  var existing = document.getElementById('sscSpeedPopup');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  var hasAvg = typeof avg === 'number' && !isNaN(avg);
  var faster = hasAvg && ms <= avg;
  var accentColor = hasAvg ? (faster ? '#7CFC9A' : '#FF8A8A') : '#F07070';
  var el = document.createElement('div');
  el.id = 'sscSpeedPopup';
  el.style.cssText = 'position:fixed;top:50%;left:50%;text-align:center;' +
      'background:rgba(34,34,34,0.94);color:#fff;font-weight:bold;' +
      'padding:0.6em 1.4em;border-radius:12px;z-index:9999;pointer-events:none;' +
      'border:2px solid ' + accentColor + ';animation:sscSpeedPopupIn 3s ease forwards;';
  var timeEl = document.createElement('div');
  timeEl.textContent = formatSecondsShort(ms);
  timeEl.style.cssText = 'font-size:3vw;line-height:1.2;white-space:nowrap;';
  el.appendChild(timeEl);
  if (hasAvg) {
    var diff = ms - avg;
    var diffEl = document.createElement('div');
    diffEl.style.cssText = 'font-size:1.3vw;margin-top:0.2em;color:' + accentColor + ';white-space:nowrap;';
    // 「本日の実績」モーダルと矢印の意味を統一する: ▲(緑)=速い、▼(赤)=同じか遅い
    diffEl.textContent = '平均比 ' + (faster ? '▲' : '▼') + formatSecondsShort(Math.abs(diff));
    el.appendChild(diffEl);
  }
  // 内訳モーダルと同じ直近20本の推移グラフを、この場でも見えるように表示する
  var sparkline = buildCycleSparkline(getCurrentFolder(), 90, 34, true);
  if (sparkline) {
    var sparklineWrap = document.createElement('div');
    sparklineWrap.style.cssText = 'display:flex;justify-content:center;margin-top:0.4em;';
    sparklineWrap.appendChild(sparkline);
    el.appendChild(sparklineWrap);
  }
  document.body.appendChild(el);
  playSpeedPopupSound(!hasAvg || faster);
  setTimeout(function () {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 3000);
}
// 1本完了時に予約しておいたポップアップがあれば、このページで表示して消費する
function showPendingSpeedPopupIfAny() {
  var pending = localStorage.getItem(SSC_SPEED_PENDING_POPUP_KEY);
  if (pending === null) return;
  localStorage.removeItem(SSC_SPEED_PENDING_POPUP_KEY);
  var data = null;
  try { data = JSON.parse(pending); } catch (e) {}
  if (!data) return;
  showSpeedPopup(data.ms, data.avg);
}
function closeProductionBreakdown() {
  var el = document.getElementById('sscProductionBreakdown');
  if (el && el.parentNode) el.parentNode.removeChild(el);
  hideSscTooltip();
}
// ネイティブのtitle属性によるツールチップはブラウザが表示位置を決めてしまい(カーソルの右下等)、
// 内容がカーソルに重なることがある。位置を制御するため、独自の簡易ツールチップに置き換える。
// カーソル位置を基準に右上へ表示することで、カーソル自身と文字が重ならないようにする
var sscTooltipEl = null;
function showSscTooltip(text, clientX, clientY) {
  if (!sscTooltipEl) {
    sscTooltipEl = document.createElement('div');
    sscTooltipEl.style.cssText = 'position:fixed;z-index:10000;background:#111;color:#fff;' +
        'font-size:0.75em;padding:0.3em 0.6em;border-radius:4px;border:1px solid #555;' +
        'pointer-events:none;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.5);';
    document.body.appendChild(sscTooltipEl);
  }
  sscTooltipEl.textContent = text;
  sscTooltipEl.style.left = (clientX + 10) + 'px';
  sscTooltipEl.style.top = (clientY - 10) + 'px';
  sscTooltipEl.style.transform = 'translateY(-100%)';
  sscTooltipEl.style.display = 'block';
}
function hideSscTooltip() {
  if (sscTooltipEl) sscTooltipEl.style.display = 'none';
}
// 要素にネイティブtitleの代わりの独自ツールチップを付与する
function attachSscTooltip(el, text) {
  el.addEventListener('mouseenter', function (e) {
    showSscTooltip(text, e.clientX, e.clientY);
  });
  el.addEventListener('mouseleave', hideSscTooltip);
}
function showProductionBreakdown() {
  closeProductionBreakdown();
  var data = loadProductionData();
  var folders = Object.keys(data.counts).sort();
  var overlay = document.createElement('div');
  overlay.id = 'sscProductionBreakdown';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
  var panel = document.createElement('div');
  panel.style.cssText = 'background:#222;color:#fff;padding:1.5em 2em;border-radius:8px;min-width:16em;max-height:80vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
  panel.classList.add('sscModalPanel');
  var titleRow = document.createElement('div');
  titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1em;margin:0 0 1em;border-bottom:2px solid #F07070;padding-bottom:0.3em;';
  var titleLeft = document.createElement('div');
  titleLeft.style.cssText = 'display:flex;align-items:center;gap:0.5em;';
  var title = document.createElement('h2');
  title.textContent = '本日の実績';
  title.style.cssText = 'margin:0;font-size:1.2em;';
  var timingHelpBtn = document.createElement('button');
  timingHelpBtn.type = 'button';
  timingHelpBtn.title = 'タイム測定のルール';
  timingHelpBtn.setAttribute('aria-label', 'タイム測定のルール');
  timingHelpBtn.style.cssText = 'flex:0 0 auto;width:1.8em;height:1.8em;padding:0;background:transparent;color:#F07070;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;';
  timingHelpBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" style="position:static;width:100%;height:100%;display:block;pointer-events:none;"><path d="M11,18h2v-2h-2V18z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M12,6c-2.21,0-4,1.79-4,4h2c0-1.1,0.9-2,2-2s2,0.9,2,2c0,2-3,1.75-3,5h2c0-2.25,3-2.5,3-5C16,7.79,14.21,6,12,6z"/></svg>';
  timingHelpBtn.addEventListener('click', function () {
    window.openTimingRuleModal();
  });
  titleLeft.appendChild(title);
  titleLeft.appendChild(timingHelpBtn);
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '閉じる';
  closeBtn.style.cssText = 'flex:0 0 auto;padding:0.4em 1em;background:#F07070;color:#262626;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
  closeBtn.addEventListener('click', closeProductionBreakdown);
  titleRow.appendChild(titleLeft);
  titleRow.appendChild(closeBtn);
  panel.appendChild(titleRow);
  if (folders.length === 0) {
    var empty = document.createElement('div');
    empty.textContent = '本日の実績はまだありません';
    empty.style.cssText = 'color:#ccc;';
    panel.appendChild(empty);
  }
  folders.forEach(function (folder) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1em;padding:0.3em 0;border-bottom:1px solid #444;';
    // 品番とスパークラインをまとめて左側に置く(以前はスパークラインが本数/平均側に
    // くっついて右寄せになっていたが、推移は品番に対する情報なので品番側(左)に揃える)
    var left = document.createElement('div');
    left.style.cssText = 'display:flex;align-items:center;gap:0.6em;min-width:0;';
    var name = document.createElement('span');
    name.textContent = folder;
    name.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    var right = document.createElement('div');
    right.style.cssText = 'text-align:right;';
    var count = document.createElement('div');
    count.textContent = data.counts[folder] + '本';
    count.style.cssText = 'font-weight:bold;';
    right.appendChild(count);
    var avgMs = getTodayAvgForFolder(folder);
    if (avgMs !== null) {
      var avgEl = document.createElement('div');
      avgEl.style.cssText = 'font-size:0.75em;color:#ccc;white-space:nowrap;cursor:default;';
      var avgValueSpan = document.createElement('span');
      avgValueSpan.textContent = '平均 ' + formatSecondsShort(avgMs);
      attachSscTooltip(avgValueSpan, '本日この品番を完成させた全本数の平均タイム');
      avgEl.appendChild(avgValueSpan);
      var prev = loadPrevDaySpeed()[folder];
      if (prev) {
        // ▲(緑)=前回作業日より速い、▼(赤)=前回作業日と同じか遅い
        var diff = avgMs - prev.avg;
        var isFaster = diff < 0;
        var diffColor = isFaster ? '#7CFC9A' : '#FF8A8A';
        var diffSpan = document.createElement('span');
        diffSpan.style.color = diffColor;
        diffSpan.textContent = ' (' + (isFaster ? '▲' : '▼') + formatSecondsShort(Math.abs(diff)) + ')';
        attachSscTooltip(diffSpan, '前回作業日の平均タイムとの差');
        avgEl.appendChild(diffSpan);
      }
      right.appendChild(avgEl);
    }
    var sparkline = buildCycleSparkline(folder);
    left.appendChild(name);
    if (sparkline) left.appendChild(sparkline);
    row.appendChild(left);
    row.appendChild(right);
    panel.appendChild(row);
  });
  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:0.6em;margin-top:1em;';
  // 誤操作防止のため、ボタンを押すと「削除しますか?」+はい/いいえに切り替わる2段階確認方式
  var resetContainer = document.createElement('div');
  resetContainer.style.cssText = 'display:flex;align-items:center;gap:0.5em;';
  function renderResetIdle() {
    resetContainer.innerHTML = '';
    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = '平均値のリセット';
    attachSscTooltip(resetBtn, 'タイム測定の基準(ページごとの履歴・1本合計の履歴)をリセットします。作業者交代時などに');
    resetBtn.style.cssText = 'padding:0.5em 1em;font-size:0.85em;background:transparent;color:#F07070;border:1px solid #F07070;border-radius:4px;cursor:pointer;white-space:nowrap;';
    resetBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      renderResetConfirm();
    });
    resetContainer.appendChild(resetBtn);
  }
  function renderResetConfirm() {
    resetContainer.innerHTML = '';
    var label = document.createElement('span');
    label.textContent = '削除しますか?';
    label.style.cssText = 'font-size:0.8em;color:#FF8A8A;white-space:nowrap;';
    var yesBtn = document.createElement('button');
    yesBtn.type = 'button';
    yesBtn.textContent = 'はい';
    yesBtn.style.cssText = 'padding:0.4em 0.8em;font-size:0.8em;background:#FF8A8A;color:#262626;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
    yesBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      resetSpeedHistoryAll();
      showProductionBreakdown();
    });
    var noBtn = document.createElement('button');
    noBtn.type = 'button';
    noBtn.textContent = 'いいえ';
    noBtn.style.cssText = 'padding:0.4em 0.8em;font-size:0.8em;background:transparent;color:#888;border:1px solid #555;border-radius:4px;cursor:pointer;';
    noBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      renderResetIdle();
    });
    resetContainer.appendChild(label);
    resetContainer.appendChild(yesBtn);
    resetContainer.appendChild(noBtn);
  }
  renderResetIdle();
  btnRow.appendChild(resetContainer);
  // 本日の実績一覧(1本ごとの完了記録)への入口
  var detailBtn = document.createElement('button');
  detailBtn.type = 'button';
  detailBtn.textContent = '詳細';
  detailBtn.style.cssText = 'padding:0.5em 1em;font-size:0.85em;background:#F07070;color:#262626;font-weight:bold;border:none;border-radius:4px;cursor:pointer;white-space:nowrap;';
  detailBtn.addEventListener('click', function () {
    window.openProductionDetailModal();
  });
  btnRow.appendChild(detailBtn);
  panel.appendChild(btnRow);
  overlay.appendChild(panel);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeProductionBreakdown(); });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') {
      closeProductionBreakdown();
      document.removeEventListener('keydown', onEsc);
    }
  });
  document.body.appendChild(overlay);
}
function closeProductionDetailModal() {
  var el = document.getElementById('sscProductionDetailModal');
  if (el && el.parentNode) el.parentNode.removeChild(el);
}
// 本日完成した「1本あたりの合計タイム」を、完了時刻・品番・タイムの3列で一覧表示する。
// 上ほど新しい(完了時刻の降順)。completedAtが無い古い記録(この項目を追加する前に
// 記録されたもの)は時刻欄を「-」にし、並び順としては一番古い扱いにする
window.openProductionDetailModal = function () {
  closeProductionDetailModal();
  var today = loadTodaySpeedData();
  var rows = [];
  Object.keys(today.folders).forEach(function (folder) {
    var entries = (today.folders[folder].entries || []).slice();
    // 「前回生産」との比較は同じ品番同士でなければ意味が無いため、品番ごとに完了時刻の昇順で
    // 並べてから、直前の1本(prevEffective)をそれぞれのエントリに持たせておく
    entries.sort(function (a, b) { return (a.completedAt || 0) - (b.completedAt || 0); });
    entries.forEach(function (entry, idx) {
      rows.push({
        folder: folder,
        effective: entry.effective,
        completedAt: entry.completedAt || 0,
        pages: entry.pages || [],
        prevEffective: idx > 0 ? entries[idx - 1].effective : null,
        // 作業番号ごとの内訳を「前回生産」の同じ作業番号と比較するために、直前の1本のpagesも持たせておく
        prevPages: idx > 0 ? (entries[idx - 1].pages || []) : null
      });
    });
  });
  rows.sort(function (a, b) { return b.completedAt - a.completedAt; });
  var overlay = document.createElement('div');
  overlay.id = 'sscProductionDetailModal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
  var panel = document.createElement('div');
  panel.style.cssText = 'background:#222;color:#fff;padding:1.5em 2em;border-radius:8px;width:min(30em,92vw);max-height:80vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
  panel.classList.add('sscModalPanel');
  var titleRow = document.createElement('div');
  titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1em;margin:0 0 0.3em;';
  var title = document.createElement('h2');
  title.textContent = '本日の実績の詳細';
  title.style.cssText = 'margin:0;font-size:1.2em;';
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '閉じる';
  closeBtn.style.cssText = 'flex:0 0 auto;padding:0.4em 1em;background:#F07070;color:#262626;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
  closeBtn.addEventListener('click', closeProductionDetailModal);
  titleRow.appendChild(title);
  titleRow.appendChild(closeBtn);
  panel.appendChild(titleRow);
  if (rows.length === 0) {
    var empty = document.createElement('div');
    empty.textContent = '本日の実績はまだありません';
    empty.style.cssText = 'color:#ccc;';
    panel.appendChild(empty);
  } else {
    var headerRow = document.createElement('div');
    headerRow.style.cssText = 'display:flex;gap:1em;padding:0.25em 0;border-bottom:2px solid #F07070;color:#F07070;font-weight:bold;';
    var hTime = document.createElement('span');
    hTime.textContent = '完了時刻';
    hTime.style.cssText = 'flex:0 0 60px;font-size:0.8em;';
    var hFolder = document.createElement('span');
    hFolder.textContent = '製品品番';
    hFolder.style.cssText = 'flex:1 1 auto;font-size:0.8em;';
    var hTimeVal = document.createElement('span');
    hTimeVal.textContent = 'タイム';
    // データ側のタイム値(timeValEl)と同じ固定幅にして、左端がタイム値の表示領域の左端に揃うようにする
    hTimeVal.style.cssText = 'flex:0 0 48px;text-align:left;font-size:0.8em;';
    headerRow.appendChild(hTime);
    headerRow.appendChild(hFolder);
    headerRow.appendChild(hTimeVal);
    panel.appendChild(headerRow);
    // 品番が切り替わるところで背景の縞を1段切り替える(同じ品番が続く間は同じ帯)。
    // 品番の違いをひと目で区別しやすくするための、よくある定番の表現
    var lastFolder = null, stripeOn = true;
    rows.forEach(function (r) {
      if (r.folder !== lastFolder) {
        stripeOn = !stripeOn;
        lastFolder = r.folder;
      }
      var rowStripeBg = stripeOn ? 'background:rgba(240,112,112,0.08);' : '';
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:1em;padding:0.25em 0;border-bottom:1px solid #444;cursor:pointer;' + rowStripeBg;
      var timeEl = document.createElement('span');
      timeEl.style.cssText = 'flex:0 0 60px;color:#ccc;';
      if (r.completedAt) {
        var d = new Date(r.completedAt);
        timeEl.textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
      } else {
        timeEl.textContent = '-';
      }
      var folderEl = document.createElement('span');
      folderEl.textContent = r.folder;
      folderEl.style.cssText = 'flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
      var timeValEl = document.createElement('span');
      timeValEl.textContent = formatMinSec(r.effective);
      // 行ごとに文字数が変わっても縦の位置が揃うよう、幅をautoではなく固定にする(hTimeVal側と同じ幅)
      timeValEl.style.cssText = 'flex:0 0 48px;font-weight:bold;text-align:right;';
      row.appendChild(timeEl);
      row.appendChild(folderEl);
      row.appendChild(timeValEl);
      // 「本日の実績」モーダルの前回作業日比較と同じ緑=速い/赤=同じか遅いの色分け。
      // ここでの比較対象は同じ品番の「前回生産」(直前に完成させた1本)。
      // ▲▼の矢印は付けず、色だけで速い/遅いを表現する(色分けだけで十分わかりやすいため)。
      // 比較対象が無い行(その品番の本日1本目)でも「-」で同じ幅の列を確保し、
      // タイムの値の位置が行によってずれないようにする
      var prodDiffEl = document.createElement('span');
      prodDiffEl.style.cssText = 'flex:0 0 56px;text-align:right;';
      if (r.prevEffective !== null) {
        var prodDiff = r.effective - r.prevEffective;
        var prodFaster = prodDiff < 0;
        prodDiffEl.style.color = prodFaster ? '#7CFC9A' : '#FF8A8A';
        prodDiffEl.textContent = formatSecondsShort(Math.abs(prodDiff));
      } else {
        prodDiffEl.style.color = '#666';
        prodDiffEl.textContent = '-';
      }
      row.appendChild(prodDiffEl);
      panel.appendChild(row);
      // クリックで、その1本を構成した作業番号ごとのタイム内訳を開閉する。
      // grid-template-rowsを0fr⇔1frでトランジションさせる定番テクニックで、開閉をアニメーションさせる
      // (中身の高さを事前計算しなくても自然に追従する。件数は多くても数十行程度なので負荷は軽い)
      var pagesPanel = document.createElement('div');
      pagesPanel.style.cssText = 'display:grid;grid-template-rows:0fr;transition:grid-template-rows 0.25s ease;overflow:hidden;' + rowStripeBg;
      var pagesInner = document.createElement('div');
      // 作業番号の列を製品品番(folderEl)の左端に揃える(完了時刻の幅60px+行のgap1em ぶん右にずらす)
      // 縦方向のpadding(0.3em/0.5em)はpagesInner自身には付けない。グリッド行が0frになっても
      // アイテム自身のpaddingは残ってしまい、閉じた状態で完全な高さ0にならないため
      // (中身のpRowのmarginとして持たせることで、行と一緒にきちんと0まで畳めるようにする)
      pagesInner.style.cssText = 'min-height:0;overflow:hidden;padding-left:calc(60px + 1em);';
      if (r.pages && r.pages.length) {
        r.pages.forEach(function (p, pIdx) {
          var pRow = document.createElement('div');
          // 上下の余白(0.3em/0.5em)は最初/最後の行のmarginとして持たせる(pagesInner自身の
          // paddingにはしない。paddingだとgrid-template-rows:0frでも残ってしまうため)
          var pRowMargin = (pIdx === 0 ? 'margin-top:0.3em;' : '') + (pIdx === r.pages.length - 1 ? 'margin-bottom:0.5em;' : '');
          pRow.style.cssText = 'display:flex;gap:1em;padding:0.1em 0;font-size:0.85em;' + pRowMargin;
          var pPage = document.createElement('span');
          // 通常時は製品品番(folderEl)と同じ色(白)、中央値採用時は中央値のフォント色に揃える
          pPage.style.cssText = 'flex:1 1 auto;' + (p.flagged ? 'color:#e6c89e;' : 'color:#fff;');
          pPage.textContent = p.page;
          if (p.flagged) {
            // 中央値を採用した理由(速すぎ/遅すぎ)を区別して表示する。reasonが無い古い記録は
            // 理由不明のため「中央値」とだけ表示する
            var pReasonLabel = p.reason === 'fast' ? 'はやすぎ' : (p.reason === 'slow' ? '遅すぎ' : '');
            var pFlagLabel = document.createElement('span');
            pFlagLabel.textContent = ' 中央値' + (pReasonLabel ? '(' + pReasonLabel + ')' : '');
            pPage.appendChild(pFlagLabel);
          }
          // タイムの値・比較を、製品品番側の行(timeValEl・prodDiffEl)と同じ幅・右揃えに揃える。
          // 時間の文字色も、通常時は製品品番と同じ色(白)にする(中央値採用時は今まで通り)
          var pTimeVal = document.createElement('span');
          pTimeVal.textContent = formatMinSec(p.effective);
          pTimeVal.style.cssText = 'flex:0 0 48px;text-align:right;' + (p.flagged ? 'color:#e6c89e;' : 'color:#fff;');
          var pDiffEl = document.createElement('span');
          pDiffEl.style.cssText = 'flex:0 0 56px;text-align:right;';
          // 中央値を採用した(実測ではない)行は比較対象として不適切なため「-」にする。
          // それ以外は、同じ作業番号の「前回生産」時の値と比較する
          var prevP = (!p.flagged && r.prevPages) ? r.prevPages.filter(function (pp) { return pp.page === p.page; })[0] : null;
          if (prevP) {
            var pDiff = p.effective - prevP.effective;
            var pFaster = pDiff < 0;
            pDiffEl.style.color = pFaster ? '#7CFC9A' : '#FF8A8A';
            pDiffEl.textContent = formatSecondsShort(Math.abs(pDiff));
          } else {
            pDiffEl.style.color = '#666';
            pDiffEl.textContent = '-';
          }
          pRow.appendChild(pPage);
          pRow.appendChild(pTimeVal);
          pRow.appendChild(pDiffEl);
          pagesInner.appendChild(pRow);
        });
      } else {
        var pNone = document.createElement('div');
        pNone.textContent = '内訳のデータがありません(この機能を追加する前に記録された1本です)';
        pNone.style.cssText = 'color:#888;font-size:0.8em;margin:0.3em 0 0.5em;';
        pagesInner.appendChild(pNone);
      }
      pagesPanel.appendChild(pagesInner);
      panel.appendChild(pagesPanel);
      row.addEventListener('click', function () {
        pagesPanel.style.gridTemplateRows = pagesPanel.style.gridTemplateRows === '1fr' ? '0fr' : '1fr';
      });
    });
  }
  overlay.appendChild(panel);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeProductionDetailModal(); });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') {
      closeProductionDetailModal();
      document.removeEventListener('keydown', onEsc);
    }
  });
  document.body.appendChild(overlay);
};
function renderProductionCounter() {
  var data = loadProductionData();
  var total = 0;
  for (var key in data.counts) { total += data.counts[key]; }
  var el = document.getElementById('sscProductionCounter');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sscProductionCounter';
    // 文字色は他のtdと同じ(table側のcolor: var(--table-text-color)を継承)。
    // 背景は無し、ボーダーは文字色と同じ色で1本引く。font-sizeもtable側の
    // レスポンシブ指定(table, .myBのfont-size)をそのまま継承させる
    // line-heightを指定しないと、行ボックスの余白の影響でalign-items:centerでも
    // テキストが箱の中心よりわずかに上に見えてしまうため、line-height:1で行ボックスを
    // フォントの実サイズに合わせる。それでもなお和文フォントの字形の重心が em の
    // 幾何中心よりわずかに上にあるため、padding-topをbottomよりわずかに大きくして
    // 見た目の中心を揃える
    el.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;height:2.6vw;font-size:1.5em;margin-left:0.5em;padding:0 0.3em;border:1px solid var(--table-text-color);border-radius:0.4vw;font-weight:bold;cursor:pointer;white-space:nowrap;line-height:1;';
    // ヘッダーのtableには「操作用要素(input/button)以外のクリックで品番選択ページへ
    // 遷移する」グローバルなハンドラがある。このdivはinput/buttonではなく引っかから
    // ないため、伝播を止めてページ遷移を防ぐ
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      showProductionBreakdown();
    });
    // 「調整」ボタンと同じtd内、その右に配置する。
    // ボタンとカウンターそれぞれにvertical-alignを指定する方式だと、高さの違う
    // inline要素同士でのベースライン計算がずれやすいため、両方を1つのflex
    // コンテナに入れてalign-items:centerで確実に上下中央を揃える
    var testBtn = document.getElementById('openTestDisplay2Btn');
    if (testBtn && testBtn.parentNode) {
      var wrap = document.createElement('span');
      wrap.style.cssText = 'display:inline-flex;align-items:center;';
      testBtn.parentNode.insertBefore(wrap, testBtn);
      wrap.appendChild(testBtn);
      wrap.appendChild(el);
    } else {
      document.body.appendChild(el);
    }
  }
  el.textContent = total + '本';
  console.log('[SSC production] renderProductionCounter page=' + window.location.pathname + ' data=' + JSON.stringify(data));
}
// tagRow下部の端末タグ(32/20/46/15など)をクリックすると、その端末の
// 完成形(全キャビティを色付きで点滅無し表示)をモーダルで見せる。
// 端末番号とページ番号は別物なので、terminalPageMap.json(端末番号→代表ページ番号)経由で解決する
var sscTerminalPageMap = null;
function loadTerminalPageMap() {
  if (sscTerminalPageMap) return sscTerminalPageMap;
  sscTerminalPageMap = {};
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'terminalPageMap.json', false);
    xhr.send();
    if (xhr.status === 200) {
      sscTerminalPageMap = JSON.parse(xhr.responseText) || {};
    }
  } catch (e) {}
  return sscTerminalPageMap;
}
function closeTerminalFinalState() {
  var el = document.getElementById('sscTerminalFinalStateOverlay');
  if (el && el.parentNode) el.parentNode.removeChild(el);
}
// 完成形オーバーレイの各キャビティdivの上段・下段に何を表示するかの選択
// (4択: 構成No/電線サイズ/相手端末/電線長)。
// 選択内容はlocalStorageに保存し、ページ遷移後も維持する。
var SSC_TERMINAL_FIELD_KEY = 'ssc_terminal_final_state_fields';
var SSC_TERMINAL_FIELD_OPTIONS = [
  { key: 'composition', label: '構成No' },
  { key: 'wireSize', label: '電線サイズ' },
  { key: 'oppositeTerminal', label: '相手端末' },
  { key: 'finalLength', label: '電線長' }
];
function loadTerminalFieldSelection() {
  var sel = { top: 'composition', bottom: 'wireSize' };
  try {
    var saved = JSON.parse(localStorage.getItem(SSC_TERMINAL_FIELD_KEY));
    if (saved && saved.top) sel.top = saved.top;
    if (saved && saved.bottom) sel.bottom = saved.bottom;
  } catch (e) {}
  return sel;
}
function saveTerminalFieldSelection(sel) {
  localStorage.setItem(SSC_TERMINAL_FIELD_KEY, JSON.stringify(sel));
}
function renderTerminalFieldText(container, field, pt) {
  var raw = pt[field];
  if (field === 'wireSize') {
    var wireSizeStr = raw ? String(raw).replace(/F/g, '').slice(0, 3) : '';
    container.innerHTML = wireSizeStr.split('.').join('<span style="font-size:0.5em">.</span>');
  } else {
    container.textContent = raw || '';
  }
}
function buildTerminalFieldSelectorBar(current, onSelect) {
  var bar = document.createElement('div');
  bar.style.cssText = 'display:flex;background:#1a1a1a;border-top:1px solid #F07070;';
  SSC_TERMINAL_FIELD_OPTIONS.forEach(function (opt, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = opt.label;
    var active = opt.key === current;
    btn.style.cssText = 'flex:1;border:none;cursor:pointer;font-size:1em;font-weight:bold;padding:0.1em 0;' +
        (i > 0 ? 'border-left:1px solid #F07070;' : '') +
        (active ? 'background:#F07070;color:#262626;' : 'background:#222;color:#888;');
    btn.addEventListener('click', function () { onSelect(opt.key); });
    bar.appendChild(btn);
  });
  return bar;
}
// 完成形モーダル内の色付きdivは、マウスオーバーで拡大して見やすくする。
// hole(cav)単位の枠(sscHoleWrap)ごと拡大することで、1つのholeに複数wireがあっても
// お互いが重なって隠れることなく、両方とも見えるようにする。
// :hoverはインラインstyleでは書けないため、1度だけ<style>タグを挿入する
var sscTerminalFinalStateHoverStyle = document.createElement('style');
// 拡大の倍率は文字サイズによって毎回変わる(JS側でmouseenter時に計算する)ため、
// ここではアニメーションのtransitionだけを指定する
sscTerminalFinalStateHoverStyle.textContent = '#sscTerminalFinalStateOverlay .sscHoleWrap{transition:transform 0.15s ease;}' +
  '@keyframes sscFeltWiggle{0%,100%{transform:rotate(170deg);}50%{transform:rotate(190deg);}}';
document.head.appendChild(sscTerminalFinalStateHoverStyle);
function showTerminalFinalState(terminalNum) {
  if (!terminalNum) return;
  var map = loadTerminalPageMap();
  var pageNum = map[terminalNum] || terminalNum;
  var xhr = new XMLHttpRequest();
  try {
    xhr.open('GET', pageNum + '.html', false);
    xhr.send();
  } catch (e) {
    return;
  }
  if (xhr.status !== 200) return;
  var doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');
  var img = doc.querySelector('.singleImage');
  if (!img) return;
  var src = img.getAttribute('data-src');
  var aspectRatio = parseFloat(img.getAttribute('data-aspect-ratio'));
  var rotate180 = img.getAttribute('data-rotate') === '180';
  var points = [];
  var pointsRaw = img.nextElementSibling;
  if (pointsRaw && pointsRaw.tagName === 'SCRIPT' && pointsRaw.classList.contains('blink-coords-data')) {
    try {
      points = JSON.parse(pointsRaw.textContent);
    } catch (e) {
      points = [];
    }
  }
  closeTerminalFinalState();
  var fieldSelection = loadTerminalFieldSelection();
  var overlay = document.createElement('div');
  overlay.id = 'sscTerminalFinalStateOverlay';
  // テキスト選択カーソル(Iビーム)が出ないよう、モーダル全体でテキスト選択を無効にする
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:flex;flex-direction:column;user-select:none;';
  // 上段: 端末番号(左)と閉じるボタン(右)。専用の行として確保し、画像と重ならないようにする
  var topRow = document.createElement('div');
  topRow.style.cssText = 'flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:0.4em 0.8em;';
  var title = document.createElement('div');
  title.textContent = terminalNum;
  title.style.cssText = 'padding:0.4em 1em;background:#F07070;color:#262626;font-weight:bold;border-radius:4px;';
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '閉じる';
  closeBtn.style.cssText = 'padding:0.4em 1em;background:#F07070;color:#262626;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
  closeBtn.addEventListener('click', closeTerminalFinalState);
  topRow.appendChild(title);
  topRow.appendChild(closeBtn);
  // 中央: 画像とキャビティdiv。上段・下段を除いた残りの高さいっぱいに収める
  var middleArea = document.createElement('div');
  middleArea.style.cssText = 'flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;';
  // 下段: 上段/下段テキストの表示項目を選ぶ3択バーを2段重ねてまとめる
  var bottomBars = document.createElement('div');
  bottomBars.style.cssText = 'flex:0 0 auto;display:flex;flex-direction:column;';
  var topBar = buildTerminalFieldSelectorBar(fieldSelection.top, function (key) {
    fieldSelection.top = key;
    saveTerminalFieldSelection(fieldSelection);
    showTerminalFinalState(terminalNum);
  });
  var bottomBar = buildTerminalFieldSelectorBar(fieldSelection.bottom, function (key) {
    fieldSelection.bottom = key;
    saveTerminalFieldSelection(fieldSelection);
    showTerminalFinalState(terminalNum);
  });
  bottomBars.appendChild(topBar);
  bottomBars.appendChild(bottomBar);
  overlay.appendChild(topRow);
  overlay.appendChild(middleArea);
  overlay.appendChild(bottomBars);
  document.body.appendChild(overlay);
  // ここまでDOMに追加した時点でのmiddleAreaの実寸から、画像の最大サイズを決める
  var maxWidth = middleArea.clientWidth * 0.95;
  var maxHeight = middleArea.clientHeight * 0.95;
  var width = maxWidth;
  var height = width / aspectRatio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  var wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;background-size:contain;background-repeat:no-repeat;background-position:center;';
  wrap.style.width = width + 'px';
  wrap.style.height = height + 'px';
  wrap.style.backgroundImage = "url('" + src + "')";
  // 実機ページ側でdata-rotate=180が指定されている場合、完成形モーダルも同じ向きで表示する。
  // wrap自体を回転させれば、中の画像・box(holeWrap以下)は全て子孫として一緒に回転するため
  // 座標の再計算は不要。文字だけ逆回転で正立に戻す(下でtopText/bottomTextに適用)
  if (rotate180) {
    wrap.style.transform = 'rotate(180deg)';
    wrap.style.transformOrigin = 'center center';
  }
  // 同じhole(cav)内に複数wireがある場合、wire単位でそれぞれ自分の中心を軸に
  // 拡大すると、隣り合うwire同士が重なって一方が隠れてしまう。
  // そのためhole単位でまとめた枠(holeWrap)を先に作り、拡大はその枠ごと行う
  var holeGroups = {};
  var holeOrder = [];
  var ptDivs = [];
  points.forEach(function (pt, idx) {
    var isActiveHolePt = pt.color && String(pt.color).trim() !== '' && String(pt.color).trim() !== '#';
    var plugColorPt = pt.plugColor ? String(pt.plugColor).trim() : '';
    var isPluggedPt = !isActiveHolePt && plugColorPt !== '' && plugColorPt !== '#' && (!pt.composition || String(pt.composition).trim() === '');
    if (!isActiveHolePt && !isPluggedPt) return;
    var key = pt.cav || ('__' + idx);
    if (!holeGroups[key]) {
      holeGroups[key] = [];
      holeOrder.push(key);
    }
    holeGroups[key].push(pt);
  });
  holeOrder.forEach(function (key) {
    var pts = holeGroups[key];
    var minX = Math.min.apply(null, pts.map(function (p) { return p.x; }));
    var minY = Math.min.apply(null, pts.map(function (p) { return p.y; }));
    var maxX = Math.max.apply(null, pts.map(function (p) { return p.x + p.w; }));
    var maxY = Math.max.apply(null, pts.map(function (p) { return p.y + p.h; }));
    var holeWrap = document.createElement('div');
    holeWrap.classList.add('sscHoleWrap');
    holeWrap.style.position = 'absolute';
    holeWrap.style.left = minX + '%';
    holeWrap.style.top = minY + '%';
    holeWrap.style.width = (maxX - minX) + '%';
    holeWrap.style.height = (maxY - minY) + '%';
    pts.forEach(function (pt) {
      var color = pt.color;
      var isActiveHole = color && String(color).trim() !== '' && String(color).trim() !== '#';
      var plugColorVal = pt.plugColor ? String(pt.plugColor).trim() : '';
      var plugFontColorVal = pt.plugFontColor ? String(pt.plugFontColor).trim() : '';
      var isPlugged = !isActiveHole && plugColorVal !== '' && plugColorVal !== '#' && (!pt.composition || String(pt.composition).trim() === '');
      var bgColor = (pt.bgColor && String(pt.bgColor).trim() !== '') ? String(pt.bgColor).trim() : color;
      var fontColor = SSC_STRIPE_FONT_MAP[(bgColor || '').trim().toUpperCase()] || ((pt.fontColor && String(pt.fontColor).trim() !== '' && String(pt.fontColor).trim() !== '#') ? String(pt.fontColor).trim() : '');
      var div = document.createElement('div');
      div.style.position = 'absolute';
      // holeWrapを基準にした相対位置に変換する
      div.style.left = ((pt.x - minX) / (maxX - minX) * 100) + '%';
      div.style.top = ((pt.y - minY) / (maxY - minY) * 100) + '%';
      div.style.width = (pt.w / (maxX - minX) * 100) + '%';
      div.style.height = (pt.h / (maxY - minY) * 100) + '%';
      div.style.borderRadius = (pt.radius || 0) + '%';
      div.style.animation = 'none';
      div.style.flexDirection = 'column';
      div.style.gap = '4%';
      var divWidthPx = (pt.w / 100) * width;
      var divHeightPx = (pt.h / 100) * height;
      if (isPlugged) {
        div.classList.add('blinkPlug');
        div.style.backgroundColor = plugColorVal;
        div.appendChild(buildPlugAsterisk(plugColorVal, plugFontColorVal || '#000', divWidthPx, divHeightPx));
        holeWrap.appendChild(div);
        ptDivs[points.indexOf(pt)] = div;
        return;
      }
      div.classList.add('blinkStripeBox');
      // wrap全体が回転している場合、box内の文字が逆さまになるのを防ぐため
      // box自体を逆回転させる(縞模様は点対称なので見た目は変わらない)
      if (rotate180) div.style.transform = 'rotate(180deg)';
      div.style.backgroundColor = color;
      div.style.setProperty('--stripe-color', bgColor);
      if (color.trim().toUpperCase() === SSC_BLACK_COLOR_VAL.toUpperCase()) {
        div.style.border = 'none';
      }
      var fontShadow = fontColor ? buildOutlineShadow(bgColor, 0.12) : '';
      var showTextShadow = color.trim().toUpperCase() !== bgColor.trim().toUpperCase();
      var topText = document.createElement('div');
      // cssTextはstyle属性を丸ごと上書きしてしまうため、fontStyle等を個別に設定する
      // renderTerminalFieldTextより先に、必ずcssTextを設定しておく。
      // flex:1 1 0でboxの上半分/下半分を常に確保することで、もう片方が空文字の
      // 場合でも中央に寄らず、選択した項目通りの位置(上テキストなら上、下テキスト
      // なら下)に表示されるようにする
      topText.style.cssText = 'font-size:min(45cqw,42cqh);line-height:1;white-space:nowrap;overflow:hidden;flex:1 1 0;min-height:0;display:flex;align-items:center;justify-content:center;';
      renderTerminalFieldText(topText, fieldSelection.top, pt);
      if (fontColor) {
        topText.style.color = fontColor;
        topText.style.textShadow = showTextShadow ? fontShadow : 'none';
      }
      var bottomText = document.createElement('div');
      bottomText.style.cssText = 'font-size:min(45cqw,42cqh);line-height:1;white-space:nowrap;overflow:hidden;flex:1 1 0;min-height:0;display:flex;align-items:center;justify-content:center;';
      renderTerminalFieldText(bottomText, fieldSelection.bottom, pt);
      if (fontColor) {
        bottomText.style.color = fontColor;
        bottomText.style.textShadow = showTextShadow ? fontShadow : 'none';
      }
      div.appendChild(topText);
      div.appendChild(bottomText);
      // 電線色が重複する場合の識別用に端子に付けるマジックの色。
      // divの右下にティアドロップ(しずく)形状で表示する。
      // サイズ・位置はVBAのBoxMagicPen(オートシェイプ版)を参考に、
      // 短辺の約27%のサイズ・右端は隙間無く揃え・下端はholeから少しはみ出す形にする
      var feltColorVal = pt.feltColor ? String(pt.feltColor).trim() : '';
      if (feltColorVal && feltColorVal !== '#') {
        var feltSize = Math.min(divWidthPx, divHeightPx) * 0.38 * 0.7;
        var feltDrop = document.createElement('div');
        feltDrop.style.position = 'absolute';
        feltDrop.style.right = '0';
        feltDrop.style.bottom = (-divHeightPx * 0.02) + 'px';
        feltDrop.style.width = feltSize + 'px';
        feltDrop.style.height = feltSize + 'px';
        feltDrop.style.boxSizing = 'border-box';
        feltDrop.style.background = feltColorVal;
        feltDrop.style.border = '1px solid ' + (pt.feltColorBorder ? String(pt.feltColorBorder).trim() : '#000');
        feltDrop.style.borderRadius = '50% 50% 50% 0';
        feltDrop.style.transformOrigin = 'center';
        feltDrop.style.animation = 'sscFeltWiggle 1s ease-in-out infinite';
        feltDrop.style.pointerEvents = 'none';
        feltDrop.style.zIndex = 22;
        div.appendChild(feltDrop);
      }
      holeWrap.appendChild(div);
      ptDivs[points.indexOf(pt)] = div;
    });
    // 拡大率は固定ではなく、文字サイズが16px未満なら16pxになる倍率まで拡大し、
    // 既に16px以上ある場合は拡大しない(hole内の一番小さい文字に合わせる)
    holeWrap.addEventListener('mouseenter', function () {
      var texts = holeWrap.querySelectorAll('.blinkStripeBox > div');
      var minFontSize = Infinity;
      texts.forEach(function (t) {
        var fontSize = parseFloat(getComputedStyle(t).fontSize);
        if (fontSize > 0 && fontSize < minFontSize) minFontSize = fontSize;
      });
      var scale = (isFinite(minFontSize) && minFontSize < 16) ? (16 / minFontSize) : 1;
      holeWrap.style.transform = 'scale(' + scale + ')';
      holeWrap.style.zIndex = '100';
    });
    holeWrap.addEventListener('mouseleave', function () {
      holeWrap.style.transform = '';
      holeWrap.style.zIndex = '';
    });
    wrap.appendChild(holeWrap);
  });
  // 1stと同じルールで、同じ作業番号のdiv同士を連結バーで繋ぐ(このモーダルは点滅無し表示のため、
  // 連結バーもblinkRate:0にして点滅させない)
  var finalWorkNumGroups = {};
  points.forEach(function (pt, idx) {
    if (!pt.color || pt.color === '#') return;
    if (!pt.workNum || String(pt.workNum) === '0') return;
    var color = pt.color;
    var borderColor = (pt.borderColor && String(pt.borderColor).trim() !== '') ? String(pt.borderColor).trim() : '#fff';
    var pw = (pt.w / 100) * width;
    var ph = (pt.h / 100) * height;
    var member = {
      cx: (pt.x / 100) * width + pw / 2,
      cy: (pt.y / 100) * height + ph / 2,
      width: pw,
      height: ph,
      blinkRate: 0,
      el: ptDivs[idx],
      borderColor: (color.trim().toUpperCase() === SSC_BLACK_COLOR_VAL.toUpperCase()) ? '#fff' : borderColor
    };
    var grp = finalWorkNumGroups[pt.workNum];
    if (!grp) {
      finalWorkNumGroups[pt.workNum] = { members: [member], color: color };
    } else {
      grp.members.push(member);
    }
  });
  for (var fwnKey in finalWorkNumGroups) {
    var fwnMembers = finalWorkNumGroups[fwnKey].members;
    if (fwnMembers.length < 2) continue;
    var fwnColor = finalWorkNumGroups[fwnKey].color;
    var fMstEdges = buildGroupMstEdges(fwnMembers);
    for (var fei = 0; fei < fMstEdges.length; fei++) {
      drawGroupConnector(wrap, fwnMembers[fMstEdges[fei][0]], fwnMembers[fMstEdges[fei][1]], fwnColor);
    }
  }
  middleArea.appendChild(wrap);
  // cqw/cqhによる見積もりは実際の文字数によって必要な幅・高さが変わるため、
  // DOM追加後に実測して、はみ出しているテキストだけフォントサイズを縮小して確実に収める。
  // ・text-shadow(縁取り)は文字自体の実寸(getBoundingClientRect)には含まれず
  //   上下左右に0.12emずつはみ出すため、その分の余白も見込む
  // ・電線長のmmラベルのように、実際の子要素(span等)が文字本体の外側にはみ出す
  //   ケースもあるため、子要素も含めた実際の見た目の右端・下端で判定する
  var SSC_TERMINAL_SHADOW_EM = 0.12;
  wrap.querySelectorAll('.blinkStripeBox > div').forEach(function (t) {
    var box = t.parentElement;
    var boxRect = box.getBoundingClientRect();
    var tRect = t.getBoundingClientRect();
    var neededRight = tRect.right;
    var neededBottom = tRect.bottom;
    [].slice.call(t.querySelectorAll('span')).forEach(function (span) {
      var spanRect = span.getBoundingClientRect();
      if (spanRect.right > neededRight) neededRight = spanRect.right;
      if (spanRect.bottom > neededBottom) neededBottom = spanRect.bottom;
    });
    var currentFontSize = parseFloat(getComputedStyle(t).fontSize);
    var shadowMargin = currentFontSize * SSC_TERMINAL_SHADOW_EM;
    var neededWidth = (neededRight + shadowMargin) - tRect.left;
    var neededHeight = (neededBottom + shadowMargin) - tRect.top;
    var availableWidth = boxRect.right - tRect.left;
    var availableHeight = boxRect.bottom - tRect.top;
    var ratio = Math.min(availableWidth / neededWidth, availableHeight / neededHeight, 1);
    if (ratio < 1) {
      t.style.fontSize = (currentFontSize * ratio * 0.95) + 'px';
    }
  });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target === topRow || e.target === middleArea || e.target === bottomBars) closeTerminalFinalState();
  });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') {
      closeTerminalFinalState();
      document.removeEventListener('keydown', onEsc);
    }
  });
}
// workOrderRow: 現在位置が属するサブ区間の番号をバッジで表示する
// 各区間の開始位置はworkOrderDividerのstyle.left(%)とdata-sub属性で表される
// (先頭区間もleft:0%のworkOrderDividerとして出力される想定、trackには付与しない)
function renderWorkOrderSubBadge() {
  var track = document.querySelector('.workOrderTrack');
  var fill = track ? track.querySelector('.workOrderFill') : null;
  if (!track || !fill) return;
  var row = track.parentElement;
  try {
    var savedCal = JSON.parse(sscCalGet()) || { BLINK_COLOR_OVERRIDE: '#39FF14' };
    if (savedCal && typeof savedCal.BLINK_COLOR_OVERRIDE === 'string' && savedCal.BLINK_COLOR_OVERRIDE && savedCal.BLINK_COLOR_OVERRIDE !== 'rainbow') {
      row.style.setProperty('--work-order-color', savedCal.BLINK_COLOR_OVERRIDE);
    } else {
      row.style.setProperty('--work-order-color', '#FE4951');
    }
  } catch (e) {}
  var dividers = track.querySelectorAll('.workOrderDivider');
  // 区切り線の色も、バッジと同じロジックで背景色に応じた見やすい色(#fffか#000)に揃える
  var dividerColor = getReadableTextColor(getComputedStyle(fill).backgroundColor);
  for (var d = 0; d < dividers.length; d++) {
    dividers[d].style.backgroundColor = dividerColor;
  }
  var segments = [];
  for (var i = 0; i < dividers.length; i++) {
    segments.push({
      start: parseFloat(dividers[i].style.left),
      sub: dividers[i].getAttribute('data-sub')
    });
  }
  segments.sort(function (a, b) { return a.start - b.start; });
  var currentPos = parseFloat(fill.style.width) || 0;
  var current = null;
  for (var j = 0; j < segments.length; j++) {
    if (segments[j].start <= currentPos + 0.001) {
      current = segments[j];
    }
  }
  if (!current || !current.sub) return;
  var badge = document.createElement('div');
  badge.className = 'workOrderSubBadge';
  badge.textContent = current.sub;
  badge.style.left = currentPos + '%';
  // workOrderTrackはoverflow:hiddenのため、はみ出して表示するバッジは
  // クリップされない親のworkOrderRow側に追加する
  track.parentElement.appendChild(badge);
  // background-color(ユーザー設定色)に応じて見やすい方の文字色(#fffか#000)を選ぶ
  badge.style.color = getReadableTextColor(getComputedStyle(badge).backgroundColor);
}
// 背景色の明るさから、見やすい文字色(#fffまたは#000)を返す
function getReadableTextColor(bgColor) {
  var rgb = bgColor.match(/\d+/g);
  if (!rgb) return '#fff';
  var r = parseInt(rgb[0], 10), g = parseInt(rgb[1], 10), b = parseInt(rgb[2], 10);
  var brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000' : '#fff';
}
// データ属性から位置を設定
setPositionFromDataAttributes();
renderWorkOrderSubBadge();
// PCキーボード運用ではテキスト入力でEnterキーを押せばフォームが送信される(HTML標準の
// 暗黙的送信で、submitボタンが無くても動作する)ため、画面上の「Enter」ボタンは不要。削除する
var submitButtonEl = document.getElementById('submitButton');
if (submitButtonEl && submitButtonEl.parentNode) submitButtonEl.parentNode.removeChild(submitButtonEl);
// リサイズ時にリロードする(レイアウト崩れ対策)
if (window.addEventListener) {
	window.addEventListener('resize', function() {
		setTimeout(function() {
			location.reload();
		}, 500); // 0.5秒後にリロード
	});
} else if (window.attachEvent) { // IE8用のフォールバック
	window.attachEvent('onresize', function() {
		setTimeout(function() {
			location.reload();
		}, 500); // 0.5秒後にリロード
	});
}
function adjustBox1Height() {
 var tableHeight = document.querySelector("table").offsetHeight;
 var boxTerminal = document.querySelector(".boxTerminal");
	if (boxTerminal){
		boxTerminal.style.height = "calc(100vh - " + tableHeight + "px)";
	}
}
window.onload = function() {
 adjustBox1Height();
};
window.onresize = adjustBox1Height;
// ヘッダーの縦位置調整。品番/設変/端末-Cavは同じflexコンテナ内でalign-items:flex-startにして
// ブラウザに上端を揃えさせているのでJSでの調整は不要。
// 「作業番号」と「アイコン列」は別のtd(セル)に分かれていて一緒に揃えられないため、
// ヘッダーの上下中央に来るよう実際の描画結果を測って合わせる
function alignHeaderVertical() {
	var wrap = document.querySelector('.headerWrap');
	if (!wrap) return;
	function centerIn(el, wrapCenter, extraOffset) {
		if (!el) return;
		el.style.top = '0px';
		var rect = el.getBoundingClientRect();
		var center = (rect.top + rect.bottom) / 2;
		el.style.top = (wrapCenter - center + (extraOffset || 0)) + 'px';
	}
	var workFlowTd = document.querySelectorAll('tr.top td')[1];
	var iconsRow = document.querySelector('.headerIconsRow');
	var wrapRect = wrap.getBoundingClientRect();
	var wrapCenter = (wrapRect.top + wrapRect.bottom) / 2;
	centerIn(workFlowTd, wrapCenter, -2);
	centerIn(iconsRow, wrapCenter);
}
function positionHeaderSub() { alignHeaderVertical(); }
positionHeaderSub();
window.addEventListener('load', positionHeaderSub);
window.addEventListener('resize', positionHeaderSub);
// 端末.html
window.onload = function() {
	var boxTerminals = document.getElementsByClassName('boxTerminal');
	var table = document.querySelector('table'); // table要素を取得
	var tableHeight = table ? table.offsetHeight : 0; // tableの高さを取得
	for (var m = 0; m < boxTerminals.length; m++) {
		if (!boxTerminals[m]) continue;
		var boxTerminal = boxTerminals[m];
		var src = boxTerminal.getAttribute('data-src');
		var aspectRatio = parseFloat(boxTerminal.getAttribute('data-aspect-ratio'));
		var blinkCoords = boxTerminal.getAttribute('data-coords');
		boxTerminal.style.backgroundImage = 'url(' + src + ')';
		// 最大幅と最大高さを設定
		var maxWidth = window.innerWidth; 
		var maxHeight = window.innerHeight - tableHeight; // tableの高さを考慮
		// 縦横比に基づいて高さと幅を計算
		var width = maxWidth;
		var height = width / aspectRatio;
		if (height > maxHeight) {
			height = maxHeight;
			width = height * aspectRatio;
		}
		boxTerminal.style.width = width + 'px';
		boxTerminal.style.height = height + 'px';
		// 画像を上下左右の中心に配置
		boxTerminal.style.position = 'absolute';
		boxTerminal.style.top = `calc(50% + ${tableHeight / 2}px)`; // tableの高さを考慮
		boxTerminal.style.left = '50%';
		boxTerminal.style.transform = 'translate(-50%, -50%)';
		if (!blinkCoords) continue;
		blinkCoords = blinkCoords.split(';');
		// CSS適用後に位置を取得
		setTimeout(function(boxTerminal) {
			var boxRect = boxTerminal.getBoundingClientRect();
			var top = boxRect.top;
			for (var i = 0; i < blinkCoords.length; i++) {
				var coord = blinkCoords[i];
				var parts = coord.split(',');
				var blinkX = parseFloat(parts[0]);
				var blinkY = parseFloat(parts[1]);
				var blinkWidth = parseFloat(parts[2]);
				var blinkHeight = parseFloat(parts[3]);
				var composition = parts[4];
				var color = parts[5];var radius = parts[6];
				var blinkXPos = (blinkX / 100) * boxTerminal.clientWidth;
				var blinkYPos = (blinkY / 100) * boxTerminal.clientHeight;
				var blinkWidthPx = (blinkWidth / 100) * boxTerminal.clientWidth;
				var blinkHeightPx = (blinkHeight / 100) * boxTerminal.clientHeight;
				if (top + blinkYPos + blinkHeightPx > window.innerHeight) {
					blinkHeightPx = window.innerHeight - top - blinkYPos;
				}
				var maxHeight = window.innerHeight;
				if (blinkYPos + blinkHeightPx > maxHeight) {
					blinkHeightPx = maxHeight - blinkYPos;
				}
				var maxWidth = window.innerWidth;
				if (blinkXPos + blinkWidthPx > maxWidth) {
					blinkWidthPx = maxWidth - blinkXPos;
				}
				var blinkDiv = document.createElement('div');
				blinkDiv.classList.add('blinkHole');
				blinkDiv.style.position = 'absolute';
				blinkDiv.style.left = (boxRect.left + blinkXPos) + 'px';
				blinkDiv.style.top = (top + blinkYPos) + 'px';
				blinkDiv.style.width = blinkWidthPx + 'px';
				blinkDiv.style.height = blinkHeightPx + 'px';
				blinkDiv.style.borderRadius = radius + 'px'; 
				blinkDiv.style.backgroundColor = color;   
				blinkDiv.style.opacity = 0.5;
				if (composition) {
					blinkDiv.style.cursor = 'pointer';
							(function(comp) {
							blinkDiv.addEventListener('click', function() {
							navigateOrNotFound("../../56_配索図_誘導/" + getCurrentProductFolder() + "/" + comp + ".html");
							});
							})(composition);
				}
				document.body.appendChild(blinkDiv);
			}
		}, 0, boxTerminal);
	}
};
// myform内のテーブル(品番/構成No/入力欄/サブ・調整ボタンの行)のどこかをクリックしたら、
// トップの品番選択ページ(入力欄+全品番一覧)を表示する。入力欄やボタンなど操作用要素のクリックは除外する。
var topBarTable = document.myform ? document.myform.querySelector('table') : null;
if (topBarTable) {
	topBarTable.addEventListener('click', function (e) {
		if (e.target.closest('input, button')) return;
		localStorage.removeItem('ssc_last_page');
		window.location.href = '../index.html';
	});
}
// 2ndディスプレイの校正モーダル(test_2ndボタンから起動)。
// main_2nd.jsと同じlocalStorageキー(ssc_calibration)へ値変更のたびに保存し、
// サブウィンドウ(2nd側)をリロードしてリアルタイムに反映する。
(function () {
	var SSC_CALIBRATION_KEY = 'ssc_calibration';
	// main_2nd.js(実機の点滅表示)と全く同じclip-pathを使うことで、調整モーダルの
	// プレビューの見た目を実機と一致させる(squareはclip-pathなし=四角のまま)
	var SSC_BLINK_SHAPE_CLIP_PATHS = {
		x: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
		star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
	};
	// ネイティブの数値入力(spinner)は小さく邪魔なため非表示にする(::-webkit-*はインラインstyleでは
	// 指定できない疑似要素のため、1度だけ<style>タグを挿入する)
	var calibSpinnerStyle = document.createElement('style');
	calibSpinnerStyle.textContent = '.ssc-calib-num-input::-webkit-outer-spin-button,.ssc-calib-num-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}';
	document.head.appendChild(calibSpinnerStyle);
  var FIELDS = [
    { key: 'PX_PER_MM', label: 'PX_PER_MM (px/mm)', step: 0.01, def: 4.1 }, // プレゼンの埋め込み用(元は 1920 / 290)
    { key: 'OFFSET_X_PX', label: 'OFFSET_X_PX (px)', step: 1, def: 0 },
    { key: 'OFFSET_Y_PX', label: 'OFFSET_Y_PX (px)', step: 1, def: 42 },
    { key: 'BLINK_COLOR_OVERRIDE', label: '点滅の色', type: 'color', def: '#39FF14' },
    { key: 'BLINK_SHAPE', label: '点滅の形状', type: 'select', def: 'square', options: [
      { value: 'square', label: '□ 四角' },
      { value: 'x', label: '× バツ' },
      { value: 'star', label: '☆ 星' }
    ] },
    { key: 'RADIUS_SCALE', label: '角の丸み', step: 0.5, def: 6 },
    { key: 'BLINK_SHRINK_RATIO', label: '点滅のサイズ', step: 0.05, def: 0.6 },
    { key: 'BLINK_SPEED', label: '点滅の速さ', step: 0.1, def: 0 },
    { key: 'RADAR_EFFECT', label: 'パルスのサイズ', step: 5, def: 1 },
    { key: 'RADAR_SPEED', label: 'パルスの速さ', step: 0.1, def: 1 },
    { key: 'RADAR_DIRECTION', label: 'パルスの向き', type: 'select', def: 'in', options: [
      { value: 'in', label: '収束' },
      { value: 'out', label: '拡大' }
    ] },
    { key: 'IMAGE_BRIGHTNESS', label: '画像の明るさ', step: 0.05, def: 1 }
  ];
	var subWindow = null;
	var modalEl = null;
	var reloadTimer = null;
	var currentUrl = null;
	function loadCurrent() {
		var saved = {};
		try {
			saved = JSON.parse(sscCalGet()) || {};
		} catch (e) {
			saved = {};
		}
		var current = {};
		FIELDS.forEach(function (f) {
		if (f.type === 'color' || f.type === 'select') {
			current[f.key] = typeof saved[f.key] === 'string' ? saved[f.key] : f.def;
		} else {
			current[f.key] = typeof saved[f.key] === 'number' ? saved[f.key] : f.def;
		}
		});
		return current;
	}
	function saveCurrent(current) {
		sscCalSet(JSON.stringify(current));
	}
function reloadSubWindow() {
	if (reloadTimer) clearTimeout(reloadTimer);
	reloadTimer = setTimeout(function () {
		if (!currentUrl) return;
		if (typeof updateDisplay2IfOpen === 'function' && updateDisplay2IfOpen(currentUrl)) {
			return;
		}
		if (typeof openOnDisplay2 === 'function') {
			openOnDisplay2(currentUrl).then(function (w) {
				subWindow = w;
			});
		}
	}, 200);
}
	function closeModal() {
		if (modalEl && modalEl.parentNode) {
			modalEl.parentNode.removeChild(modalEl);
		}
		modalEl = null;
		// モーダルを閉じたら、2ndを全ホール点滅(校正用)から現在ページの通常表示に戻す
		if (typeof updateDisplay2IfOpen === 'function') {
			var normalUrl = window.location.pathname.split('/').pop().replace(/\.html$/, '_2nd.html');
			try { updateDisplay2IfOpen(normalUrl); } catch (e) {}
		}
	}
	// PX_PER_MM/OFFSET_X_PX/OFFSET_Y_PXは「画像の位置合わせ」という同じ目的のパラメータなので、
	// 個別の横並び行ではなく、枠(=画像)を中心に効果の向きが直感的にわかる1つのウィジェットにまとめる。
	function buildScaleOffsetWidget(current, inputs) {
		function fieldOf(key) {
			for (var i = 0; i < FIELDS.length; i++) {
				if (FIELDS[i].key === key) return FIELDS[i];
			}
			return null;
		}
		function makeInput(f, widthEm) {
			var input = document.createElement('input');
			input.type = 'number';
			input.step = f.step;
			input.value = current[f.key];
			input.title = f.key;
			input.className = 'ssc-calib-num-input';
			input.style.cssText = 'box-sizing:border-box;width:' + widthEm + 'em;font-size:1em;padding:0.2em 0.3em;background:#333;color:#fff;border:1px solid #555;border-radius:4px;text-align:center;-moz-appearance:textfield;';
			input.addEventListener('input', function () {
				var v = parseFloat(input.value);
				if (isNaN(v)) return;
				var latest = loadCurrent();
				latest[f.key] = v;
				saveCurrent(latest);
				reloadSubWindow();
			});
			inputs[f.key] = input;
			return input;
		}
		// 数値入力のネイティブの上下スピナーは小さく押しづらい上、OFFSET_Y_PXでは
		// 「上ボタンを押すと値が増えて実際には下にずれる」という直感と逆の動きになるため、
		// 実際の移動方向に対応した大きめのボタンを用意する
		function makeStepButton(input, delta, glyph, sizeEm) {
			sizeEm = sizeEm || 1.8;
			var btn = document.createElement('button');
			btn.type = 'button';
			btn.textContent = glyph;
			btn.style.cssText = 'box-sizing:border-box;width:' + sizeEm + 'em;height:' + sizeEm + 'em;padding:0;font-size:1.1em;font-weight:bold;color:#F07070;background:#333;border:1px solid #555;border-radius:4px;cursor:pointer;line-height:1;-webkit-text-stroke:2px #F07070;';
			btn.addEventListener('click', function () {
				var step = parseFloat(input.step) || 1;
				var next = (parseFloat(input.value) || 0) + delta * step;
				// 浮動小数点誤差(例: 6.72+0.01が6.730000000000001になる)を避けるため、
				// stepの小数桁数に合わせて丸める
				var decimals = (String(step).split('.')[1] || '').length;
				next = Math.round(next * Math.pow(10, decimals)) / Math.pow(10, decimals);
				input.value = next;
				input.dispatchEvent(new Event('input', { bubbles: true }));
			});
			return btn;
		}
		var wrap = document.createElement('div');
		wrap.style.cssText = 'display:flex;align-items:flex-start;gap:0.6em;margin:0.3em 0 0.5em;';
		var leftCol = document.createElement('div');
		leftCol.style.cssText = 'flex:1 1 auto;display:flex;flex-direction:column;gap:0.4em;';
		// 拡大率: 枠(=画像)の中に、縮小(左上)⇔拡大(右下)を斜め矢印で示す
		var scaleBox = document.createElement('div');
		scaleBox.style.cssText = 'position:relative;width:100%;border:1px solid #F07070;border-radius:4px;box-sizing:border-box;padding:0 0.2em 0 0.4em;display:flex;align-items:center;justify-content:center;';
		// 枠の実際の左上と右下を正確に結ぶ対角線をSVGで描く(CSSのtransform:rotateだと
		// 枠が正方形でない限り実際の対角線の角度と合わないため、box自体の縦横比に
		// 自動追従するSVG(viewBox+preserveAspectRatio="none")を使う)
		var scaleDiagonalSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		scaleDiagonalSvg.setAttribute('viewBox', '0 0 100 100');
		scaleDiagonalSvg.setAttribute('preserveAspectRatio', 'none');
		scaleDiagonalSvg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
		var scaleDiagonalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		scaleDiagonalLine.setAttribute('x1', '0');
		scaleDiagonalLine.setAttribute('y1', '0');
		scaleDiagonalLine.setAttribute('x2', '100');
		scaleDiagonalLine.setAttribute('y2', '100');
		scaleDiagonalLine.setAttribute('stroke', '#F07070');
		scaleDiagonalLine.setAttribute('stroke-width', '1');
		scaleDiagonalLine.setAttribute('vector-effect', 'non-scaling-stroke');
		scaleDiagonalSvg.appendChild(scaleDiagonalLine);
		scaleBox.appendChild(scaleDiagonalSvg);
		var scaleLabelRow = document.createElement('div');
		scaleLabelRow.style.cssText = 'position:relative;display:flex;align-items:center;justify-content:center;gap:0.3em;background:#222;padding:0.2em 0.5em;border-radius:4px;';
		var scaleLabel = document.createElement('span');
		scaleLabel.textContent = '拡大率';
		scaleLabel.style.cssText = 'color:#ccc;font-size:0.85em;white-space:nowrap;';
		scaleLabelRow.appendChild(scaleLabel);
		var scaleInputEl = makeInput(fieldOf('PX_PER_MM'), 4.5);
		scaleLabelRow.appendChild(scaleInputEl);
		// 拡大率にも、ネイティブスピナーの代わりとなる上下ボタンを付ける(↑で拡大/↓で縮小)
		var scaleStepCol = document.createElement('div');
		scaleStepCol.style.cssText = 'display:flex;flex-direction:column;gap:0.2em;';
		scaleStepCol.appendChild(makeStepButton(scaleInputEl, 1, '↑', 1.3));
		scaleStepCol.appendChild(makeStepButton(scaleInputEl, -1, '↓', 1.3));
		scaleLabelRow.appendChild(scaleStepCol);
		scaleBox.appendChild(scaleLabelRow);
		leftCol.appendChild(scaleBox);
		// 左右/上下とも、入力欄は4桁を想定した固定幅にする
		var OFFSET_INPUT_WIDTH_EM = 3.5;
		// 左右: 入力欄の左右に、実際の移動方向と対応するボタンを配置する
		// (ボタンの高さはalign-items:stretchで入力欄の実際の高さに自動的に合わせる)
		var xRow = document.createElement('div');
		xRow.style.cssText = 'display:flex;align-items:stretch;gap:0.3em;';
		var xInputEl = makeInput(fieldOf('OFFSET_X_PX'), OFFSET_INPUT_WIDTH_EM);
		xRow.appendChild(makeStepButton(xInputEl, -1, '←'));
		xRow.appendChild(xInputEl);
		xRow.appendChild(makeStepButton(xInputEl, 1, '→'));
		leftCol.appendChild(xRow);
		wrap.appendChild(leftCol);
		// 上下: 入力欄の上下に、実際の移動方向と対応するボタンを配置する
		// (↑ボタン=値が減って上に、↓ボタン=値が増えて下に、と直感通りの向きにする。
		// ボタンの横幅は入力欄と同じ固定幅にする)
		var yCol = document.createElement('div');
		yCol.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0.3em;margin-left:auto;';
		var yInputEl = makeInput(fieldOf('OFFSET_Y_PX'), OFFSET_INPUT_WIDTH_EM);
		var yUpBtn = makeStepButton(yInputEl, -1, '↑');
		var yDownBtn = makeStepButton(yInputEl, 1, '↓');
		yCol.appendChild(yUpBtn);
		yCol.appendChild(yInputEl);
		yCol.appendChild(yDownBtn);
		wrap.appendChild(yCol);
		// 拡大率の枠の高さ・↑↓ボタンの横幅は、DOM追加後でないと実測できないため
		// 呼び出し側で使えるよう参照を持たせておく(emでの幅指定はinputとbuttonで
		// font-sizeが異なり正確に一致しないため、実測したpx値を使う)
		wrap._scaleBox = scaleBox;
		wrap._yCol = yCol;
		wrap._yInputEl = yInputEl;
		wrap._yUpBtn = yUpBtn;
		wrap._yDownBtn = yDownBtn;
		return wrap;
	}
	function buildModal() {
		var overlay = document.createElement('div');
		overlay.id = 'sscCalibrationModalOverlay';
		overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
		var panel = document.createElement('div');
		panel.style.cssText = 'background:#222;color:#fff;padding:0.5em 1em;border-radius:8px;width:min(30em,92vw);box-shadow:0 4px 20px rgba(0,0,0,0.5);';
  // タイトルと閉じるボタンを同じ行・同じ高さに並べることで、モーダルの縦の長さを抑える
  var titleRow = document.createElement('div');
  titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1em;margin:0 0 0.5em;border-bottom:2px solid #F07070;padding-bottom:0.3em;';
  var title = document.createElement('h2');
  title.textContent = '2ndディスプレイ 校正';
  title.style.cssText = 'margin:0;font-size:1.2em;';
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '閉じる';
  closeBtn.style.cssText = 'flex:0 0 auto;padding:0.4em 1em;background:#F07070;color:#262626;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
  closeBtn.addEventListener('click', closeModal);
  titleRow.appendChild(title);
  titleRow.appendChild(closeBtn);
  panel.appendChild(titleRow);
  // 外部ディスプレイへの自動表示に必要な権限を、設置時に明示的に取得するための設定。
  // 日常操作(調整)とは別の一度きりの操作なので、モーダルの一番上にまとめて置いている
  var displaySetupSection = document.createElement('div');
  displaySetupSection.style.cssText = 'margin-bottom:0.4em;';
  var displaySetupRow = document.createElement('div');
  displaySetupRow.style.cssText = 'display:flex;align-items:center;gap:0.6em;';
  var displaySetupBtn = document.createElement('button');
  displaySetupBtn.type = 'button';
  displaySetupBtn.textContent = '外部ディスプレイの初期設定';
  displaySetupBtn.style.cssText = 'padding:0.4em 0.8em;background:#333;color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;';
  var displaySetupStatus = document.createElement('span');
  displaySetupStatus.style.cssText = 'font-size:0.85em;color:#aaa;';
  // 過去に許可済みかどうかは、ダイアログを出さずにPermissions APIで確認できる
  function refreshDisplaySetupStatus() {
    if (!('permissions' in navigator)) {
      displaySetupStatus.textContent = '(状態確認はこのブラウザでは未対応)';
      return;
    }
    navigator.permissions.query({ name: 'window-management' }).then(function (status) {
      var labels = { granted: '設定済み', prompt: '未設定', denied: '拒否されています' };
      displaySetupStatus.textContent = '現在の状態: ' + (labels[status.state] || status.state);
      status.onchange = refreshDisplaySetupStatus;
    }).catch(function () {
      displaySetupStatus.textContent = '(状態確認はこのブラウザでは未対応)';
    });
  }
  refreshDisplaySetupStatus();
  displaySetupBtn.addEventListener('click', function () {
    setupExternalDisplay().then(refreshDisplaySetupStatus);
  });
  displaySetupRow.appendChild(displaySetupBtn);
  displaySetupRow.appendChild(displaySetupStatus);
  displaySetupSection.appendChild(displaySetupRow);
  panel.appendChild(displaySetupSection);
  var f11NoticeDesc = document.createElement('div');
  f11NoticeDesc.textContent = 'この画面を表示した時に2ndディスプレイに赤文字が表示されてたらF11を何度か押して消してください';
  f11NoticeDesc.style.cssText = 'font-size:0.85em;color:#aaa;padding-bottom:0.5em;margin-bottom:0em;';
  panel.appendChild(f11NoticeDesc);
		var current = loadCurrent();
		var inputs = {};
		var scaleOffsetWidget = buildScaleOffsetWidget(current, inputs);
		panel.appendChild(scaleOffsetWidget);
		// 「点滅の調整」グループ(サイズ/丸み/色/形状)の現在値をすべて反映するプレビュー。
		// グループ左側にまとめて配置し、右側の各項目行(blinkGroupRowsCol)と2カラムにすることで
		// 「これらの項目がこのサンプルを調整している」と直感的に分かるようにする
  var shapePreview = null;
  var shapePreviewRing = null;
  var shapePreviewRingCircle = null;
  var shapePreviewWrap = null;
		var blinkGroupRowsCol = null;
		var blinkGroupWrap = null;
		var sampleCol = null;
		// 「点滅の調整」グループに属する項目のキー。この並び順が画面上の表示順にもなる
  var BLINK_GROUP_KEYS = ['BLINK_COLOR_OVERRIDE', 'BLINK_SHAPE', 'RADIUS_SCALE', 'BLINK_SHRINK_RATIO', 'BLINK_SPEED', 'RADAR_EFFECT', 'RADAR_SPEED', 'RADAR_DIRECTION'];
  function updatePreviewSize(ratio) {
    // font-sizeを変えると行の高さ自体が伸びてモーダルの高さが変わってしまうため、
    // 箱のサイズ(=与えられた高さ)は固定したまま、中身をtransform:scaleで拡大縮小する。
    // 本体・輪ともまとめて縮小されるよう、ラップ要素側にかける
    if (shapePreviewWrap) shapePreviewWrap.style.transform = 'scale(' + Math.max(ratio, 0.05) + ')';
  }
  function updatePreviewShape(shapeKey) {
    if (shapePreview) shapePreview.style.clipPath = SSC_BLINK_SHAPE_CLIP_PATHS[shapeKey] || '';
  }
  function updatePreviewRadius(radiusPercent) {
    if (shapePreview) shapePreview.style.borderRadius = radiusPercent + '%';
    // パルスの輪は角の丸みの影響を受けず常に正円(border-radius:50%固定)
  }
  function updatePreviewColor(color) {
    if (!shapePreview) return;
    var isRainbow = color === 'rainbow';
    var c = (color && !isRainbow) ? color : '#F07070';
    shapePreview.style.background = c;
    shapePreview.classList.toggle('blinkRainbow', isRainbow);
    if (shapePreviewRing) {
      shapePreviewRing.style.color = c; // レーダーエフェクトの輪(currentColor)用
      shapePreviewRing.classList.toggle('blinkRainbow', isRainbow);
    }
  }
  // レーダーエフェクトのプレビュー。実機は「輪が実際の画像サイズに達するまで」広がるが、
  // このプレビューには参照できる画像が無いため、目安として適当な最大倍率で見た目だけ確認できるようにする。
  // 輪は本体(shapePreview)のclip-path(バツ・星)に巻き込まれて切り取られないよう、
  // 別要素(shapePreviewRing)として全く同じ位置・サイズに重ねてある
  function updatePreviewRadar(percent) {
    if (!shapePreviewRingCircle) return;
    if (!percent || percent <= 0) {
      // blinkRadarクラスを外すだけだとアニメーションが止まるだけで、輪(circle要素自体)は
      // strokeが常に描画されたままなので、点滅しない輪が残って見えてしまう。
      // パルスのサイズが0の時はそもそも輪自体を非表示にする
      shapePreviewRingCircle.classList.remove('blinkRadar');
      shapePreviewRingCircle.style.visibility = 'hidden';
      return;
    }
    shapePreviewRingCircle.style.visibility = 'visible';
    shapePreviewRingCircle.style.setProperty('--radar-max-scale', 1 + 7 * (percent / 100));
    shapePreviewRingCircle.classList.add('blinkRadar');
  }
  // パルスの速さをサンプルの輪にも反映する(0なら輪のアニメーションを止める)
  function updatePreviewRadarSpeed(speed) {
    if (!shapePreviewRingCircle) return;
    if (!speed || speed <= 0) {
      shapePreviewRingCircle.style.animation = 'none';
      return;
    }
    shapePreviewRingCircle.style.animation = '';
    shapePreviewRingCircle.style.setProperty('--radar-duration', (1 / speed) + 's');
  }
  // パルスの向き(収束/拡大)をサンプルの輪にも反映する。CSS animation-directionを
  // reverseにするだけで、同じキーフレームを逆再生できる(拡大用に別途キーフレームを
  // 用意する必要がない)
  function updatePreviewRadarDirection(direction) {
    if (!shapePreviewRingCircle) return;
    shapePreviewRingCircle.style.animationDirection = (direction === 'out') ? 'reverse' : 'normal';
  }
  // 点滅の速さをサンプルにも反映する(0なら点滅させず常時点灯)
  function updatePreviewSpeed(speed) {
    if (!shapePreview) return;
    var effectiveSpeed = (loadCurrent().BLINK_COLOR_OVERRIDE === 'rainbow') ? 10 : speed;
    if (!effectiveSpeed || effectiveSpeed <= 0) {
      shapePreview.style.animation = 'none';
      return;
    }
    shapePreview.style.animation = '';
    shapePreview.style.setProperty('--blink-duration', (1 / effectiveSpeed) + 's');
  }
  // 角の丸みはBLINK_SHAPEが四角/バツの時だけ見た目に影響するため、それ以外の形状では行ごと隠す
  var radiusRow = null;
  function updateRadiusRowVisibility(shapeKey) {
    if (radiusRow) radiusRow.style.display = (shapeKey === 'square' || shapeKey === 'x') ? 'flex' : 'none';
  }
		// ネイティブのカラーピッカーを操作している間(押したままドラッグして選び、離す等)は、
		// 離した位置がたまたま背景(overlay)上になっても「外側クリックで閉じる」を発動させないためのガード。
		// input/change/blurの後も少し待ってから解除することで、ピッカーが閉じた直後に発生しうる
		// 余分なクリックまで吸収する。
		var colorPickerGuardActive = false;
		function armColorPickerGuard() {
			colorPickerGuardActive = true;
		}
		function disarmColorPickerGuardSoon() {
			setTimeout(function () { colorPickerGuardActive = false; }, 400);
		}
		FIELDS.forEach(function (f) {
			if (f.key === 'PX_PER_MM' || f.key === 'OFFSET_X_PX' || f.key === 'OFFSET_Y_PX') return;
			var row = document.createElement('div');
			row.style.cssText = 'margin-bottom:0.4em;display:flex;align-items:center;gap:0.5em;';
			var isBlinkGroupField = BLINK_GROUP_KEYS.indexOf(f.key) !== -1;
			if (isBlinkGroupField && !blinkGroupRowsCol) {
				// 「点滅の調整」グループ(形状/丸み/色/サイズ)は、左に全項目の現在値を反映する
				// サンプルをまとめて配置し、右側に各項目の行を積む2カラムレイアウトにする。
				// こうすることで、右側の各項目が左のサンプルを調整しているものだと直感的に分かる
				blinkGroupWrap = document.createElement('div');
				blinkGroupWrap.style.cssText = 'display:flex;align-items:stretch;border-top:1px solid #F07070;padding-top:0.4em;margin-top:0.4em;';
    // サンプル(プレビュー)とリセットボタンを縦に並べる列。align-items:stretchにより
    // 右側の設定項目リストと同じ高さまで伸びるので、margin-top:autoでリセットボタンを
    // 一番下(=右側最後の項目「パルスの向き」と同じ高さ)に押し下げられる
    sampleCol = document.createElement('div');
    sampleCol.style.cssText = 'display:flex;flex-direction:column;flex:0 0 auto;';
    shapePreviewWrap = document.createElement('div');
    shapePreviewWrap.style.cssText = 'position:relative;width:3.4em;height:3.4em;flex:0 0 auto;';
    shapePreview = document.createElement('div');
    shapePreview.className = 'blinkHole';
    shapePreview.style.cssText = 'position:absolute;inset:0;background:#F07070;';
    shapePreviewWrap.appendChild(shapePreview);
    // レーダーエフェクトの輪。本体(shapePreview)とは別要素にすることで、
    // 本体のclip-path(バツ・星)に巻き込まれて一緒に切り取られるのを防ぐ
    shapePreviewRing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    shapePreviewRing.setAttribute('viewBox', '0 0 100 100');
    shapePreviewRing.setAttribute('preserveAspectRatio', 'none');
    shapePreviewRing.style.cssText = 'position:absolute;inset:0;overflow:visible;';
    shapePreviewRingCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    shapePreviewRingCircle.setAttribute('cx', '50');
    shapePreviewRingCircle.setAttribute('cy', '50');
    shapePreviewRingCircle.setAttribute('r', '50');
    shapePreviewRingCircle.setAttribute('fill', 'none');
    shapePreviewRingCircle.setAttribute('stroke', 'currentColor');
    shapePreviewRingCircle.setAttribute('stroke-width', '3');
    shapePreviewRingCircle.setAttribute('vector-effect', 'non-scaling-stroke');
    shapePreviewRing.appendChild(shapePreviewRingCircle);
    shapePreviewWrap.appendChild(shapePreviewRing);
    sampleCol.appendChild(shapePreviewWrap);
    blinkGroupWrap.appendChild(sampleCol);
    blinkGroupRowsCol = document.createElement('div');
    // プレビューと各項目の間を縦線で区切る
    blinkGroupRowsCol.style.cssText = 'flex:1 1 auto;min-width:0;border-left:1px solid #F07070;margin-left:0.8em;padding-left:0.8em;';
    blinkGroupWrap.appendChild(blinkGroupRowsCol);
    panel.appendChild(blinkGroupWrap);
    // サンプルの初期状態を、グループの現在値すべてで一度に描画しておく
    updatePreviewShape(current.BLINK_SHAPE);
    updatePreviewSize(current.BLINK_SHRINK_RATIO);
    updatePreviewRadius(Math.round(current.RADIUS_SCALE / 6 * 100));
    updatePreviewColor(current.BLINK_COLOR_OVERRIDE);
    updatePreviewRadar(current.RADAR_EFFECT * 100);
    updatePreviewSpeed(current.BLINK_SPEED);
    updatePreviewRadarSpeed(current.RADAR_SPEED);
    updatePreviewRadarDirection(current.RADAR_DIRECTION);
  }
  if (f.key === 'BLINK_SHAPE') {
    // 点滅の色とは違うカテゴリ(形状・丸み・サイズ・速さ)なので区切り線で分ける
    row.style.cssText += 'border-top:1px solid #F07070;padding-top:0.4em;margin-top:0.4em;';
  }
  if (f.key === 'IMAGE_BRIGHTNESS') {
    row.style.cssText += 'border-top:1px solid #F07070;padding-top:0.4em;margin-top:0.4em;';
  }
  if (f.key === 'RADAR_EFFECT') {
    // 点滅そのもの(形状/丸み/色/サイズ)とは違うカテゴリ(演出エフェクト)なので、
    // 同じグループ内だが区切り線で視覚的に分ける
    row.style.cssText += 'border-top:1px solid #F07070;padding-top:0.4em;margin-top:0.4em;';
  }
  var label = document.createElement('label');
			label.textContent = f.label;
			label.style.cssText = 'flex:1;color:#ccc;font-size:0.95em;';
			row.appendChild(label);
		if (f.key === 'IMAGE_BRIGHTNESS') {
			var brightnessInput = document.createElement('input');
			brightnessInput.type = 'range';
			brightnessInput.min = 0;
			brightnessInput.max = 100;
			brightnessInput.step = 5;
			// range入力はstepに合わない値を代入すると表示位置が黙って丸められるため、
			// ラベルとズレないよう先にstep単位で丸めておく
			brightnessInput.value = Math.round(current[f.key] * 100 / 5) * 5;
			brightnessInput.style.cssText = 'width:8em;accent-color:#F07070;';
			var brightnessValueLabel = document.createElement('span');
			brightnessValueLabel.textContent = brightnessInput.value + '%';
			brightnessValueLabel.style.cssText = 'width:2.8em;text-align:right;color:#fff;font-size:0.95em;';
			brightnessInput.addEventListener('input', function () {
				var pct = parseFloat(brightnessInput.value);
				if (isNaN(pct)) return;
				brightnessValueLabel.textContent = pct + '%';
				var latest = loadCurrent();
				latest[f.key] = pct / 100;
				saveCurrent(latest);
				reloadSubWindow();
			});
			inputs[f.key] = brightnessInput;
			row.appendChild(brightnessInput);
			row.appendChild(brightnessValueLabel);
			panel.appendChild(row);
			return;
		}
		if (f.key === 'BLINK_SHRINK_RATIO') {
			var sizeInput = document.createElement('input');
			sizeInput.type = 'range';
			sizeInput.min = 0;
			sizeInput.max = 100;
			sizeInput.step = 5;
			// range入力はstepに合わない値を代入すると表示位置が黙って丸められるため、
			// ラベルとズレないよう先にstep単位で丸めておく
			sizeInput.value = Math.round(current[f.key] * 100 / 5) * 5;
			sizeInput.style.cssText = 'width:8em;accent-color:#F07070;';
			var sizeValueLabel = document.createElement('span');
			sizeValueLabel.textContent = sizeInput.value + '%';
			sizeValueLabel.style.cssText = 'width:2.8em;text-align:right;color:#fff;font-size:0.95em;';
			sizeInput.addEventListener('input', function () {
				var pct = parseFloat(sizeInput.value);
				if (isNaN(pct)) return;
				sizeValueLabel.textContent = pct + '%';
				var ratio = pct / 100;
				updatePreviewSize(ratio);
				var latest = loadCurrent();
				latest[f.key] = ratio;
				saveCurrent(latest);
				reloadSubWindow();
			});
			inputs[f.key] = sizeInput;
			row.appendChild(sizeInput);
			row.appendChild(sizeValueLabel);
			blinkGroupRowsCol.appendChild(row);
			return;
		}
  if (f.key === 'BLINK_SPEED') {
    // 0?3回/秒(0は点滅せず常時点灯)
    var speedInput = document.createElement('input');
    speedInput.type = 'range';
    speedInput.min = 0;
    speedInput.max = 3;
    speedInput.step = 0.1;
    speedInput.value = current[f.key];
    speedInput.style.cssText = 'width:8em;accent-color:#F07070;';
    var speedValueLabel = document.createElement('span');
    // 他のスライダーと幅を揃えるため、単位は付けずに数値だけ表示する
    speedValueLabel.textContent = Number(current[f.key]).toFixed(1);
    speedValueLabel.style.cssText = 'width:2.8em;text-align:right;color:#fff;font-size:0.95em;';
    speedInput.addEventListener('input', function () {
      var v = parseFloat(speedInput.value);
      if (isNaN(v)) return;
      speedValueLabel.textContent = v.toFixed(1);
      updatePreviewSpeed(v);
      var latest = loadCurrent();
      latest[f.key] = v;
      saveCurrent(latest);
      reloadSubWindow();
    });
    inputs[f.key] = speedInput;
    row.appendChild(speedInput);
    row.appendChild(speedValueLabel);
    blinkGroupRowsCol.appendChild(row);
    return;
  }
  if (f.key === 'RADAR_EFFECT') {
    var radarInput = document.createElement('input');
    radarInput.type = 'range';
    radarInput.min = 0;
    radarInput.max = 100;
    radarInput.step = 5;
    radarInput.value = Math.round(current[f.key] * 100 / 5) * 5;
    radarInput.style.cssText = 'width:8em;accent-color:#F07070;';
    var radarValueLabel = document.createElement('span');
    radarValueLabel.textContent = radarInput.value + '%';
    radarValueLabel.style.cssText = 'width:2.8em;text-align:right;color:#fff;font-size:0.95em;';
    radarInput.addEventListener('input', function () {
      var pct = parseFloat(radarInput.value);
      if (isNaN(pct)) return;
      radarValueLabel.textContent = pct + '%';
      updatePreviewRadar(pct);
      var latest = loadCurrent();
      latest[f.key] = pct / 100;
      saveCurrent(latest);
      reloadSubWindow();
    });
    inputs[f.key] = radarInput;
    row.appendChild(radarInput);
    row.appendChild(radarValueLabel);
    blinkGroupRowsCol.appendChild(row);
    return;
  }
  if (f.key === 'RADAR_SPEED') {
    // 0?2回/秒(0は輪のアニメーションを止める)
    var radarSpeedInput = document.createElement('input');
    radarSpeedInput.type = 'range';
    radarSpeedInput.min = 0;
    radarSpeedInput.max = 2;
    radarSpeedInput.step = 0.1;
    radarSpeedInput.value = current[f.key];
    radarSpeedInput.style.cssText = 'width:8em;accent-color:#F07070;';
    var radarSpeedValueLabel = document.createElement('span');
    radarSpeedValueLabel.textContent = Number(current[f.key]).toFixed(1);
    radarSpeedValueLabel.style.cssText = 'width:2.8em;text-align:right;color:#fff;font-size:0.95em;';
    radarSpeedInput.addEventListener('input', function () {
      var v = parseFloat(radarSpeedInput.value);
      if (isNaN(v)) return;
      radarSpeedValueLabel.textContent = v.toFixed(1);
      updatePreviewRadarSpeed(v);
      var latest = loadCurrent();
      latest[f.key] = v;
      saveCurrent(latest);
      reloadSubWindow();
    });
    inputs[f.key] = radarSpeedInput;
    row.appendChild(radarSpeedInput);
    row.appendChild(radarSpeedValueLabel);
    blinkGroupRowsCol.appendChild(row);
    return;
  }
		if (f.key === 'RADIUS_SCALE') {
			radiusRow = row;
			// RADIUS_SCALEは内部的には0?6倍(6倍で完全に丸くなり切って頭打ち)の値だが、
			// UI上は0%(四角)?100%(丸)として表示し、保存時に6倍換算する
			var radiusInput = document.createElement('input');
			radiusInput.type = 'range';
			radiusInput.min = 0;
			radiusInput.max = 50;
			radiusInput.step = 10;
			// range入力はstepに合わない値を代入すると表示位置が黙って丸められるため、
			// ラベルとズレないよう先にstep単位で丸めておく(既定値1/6*100=16.67%もこれに該当する)
			radiusInput.value = Math.round(current[f.key] / 6 * 100 / 10) * 10;
			radiusInput.style.cssText = 'width:8em;accent-color:#F07070;';
			var radiusValueLabel = document.createElement('span');
			radiusValueLabel.textContent = radiusInput.value + '%';
			radiusValueLabel.style.cssText = 'width:2.8em;text-align:right;color:#fff;font-size:0.95em;';
			radiusInput.addEventListener('input', function () {
				var pct = parseFloat(radiusInput.value);
				if (isNaN(pct)) return;
				radiusValueLabel.textContent = pct + '%';
				var latest = loadCurrent();
				latest[f.key] = pct / 100 * 6;
				saveCurrent(latest);
				updatePreviewRadius(pct);
				reloadSubWindow();
			});
			inputs[f.key] = radiusInput;
			row.appendChild(radiusInput);
			row.appendChild(radiusValueLabel);
			updateRadiusRowVisibility(current.BLINK_SHAPE);
			blinkGroupRowsCol.appendChild(row);
			return;
		}
		if (f.type === 'color') {
			var colorInput = document.createElement('input');
			colorInput.type = 'color';
			colorInput.value = current[f.key] || '#F07070';
			colorInput.style.cssText = 'width:3.5em;height:2em;padding:0;border:1px solid #555;border-radius:4px;background:#333;cursor:pointer;';
			colorInput.addEventListener('mousedown', armColorPickerGuard);
			colorInput.addEventListener('focus', armColorPickerGuard);
			colorInput.addEventListener('blur', disarmColorPickerGuardSoon);
			colorInput.addEventListener('input', function () {
				var latest = loadCurrent();
				latest[f.key] = colorInput.value;
				saveCurrent(latest);
				updatePreviewColor(colorInput.value);
				updatePreviewSpeed(latest.BLINK_SPEED);
				updateColorModeHighlight(colorInput.value);
				reloadSubWindow();
				disarmColorPickerGuardSoon();
			});
			inputs[f.key] = colorInput;
			row.appendChild(colorInput);
			var clearBtn = document.createElement('button');
			clearBtn.type = 'button';
			clearBtn.textContent = '電線色';
			clearBtn.style.cssText = 'padding:0.2em 0.2em;font-size:0.8em;background:#333;color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;';
			clearBtn.addEventListener('click', function () {
				var latest = loadCurrent();
				latest[f.key] = '';
				saveCurrent(latest);
				colorInput.value = '#F07070';
				updatePreviewColor('');
				updatePreviewSpeed(latest.BLINK_SPEED);
				updateColorModeHighlight('');
				reloadSubWindow();
			});
			row.appendChild(clearBtn);
			var rainbowBtn = document.createElement('button');
			rainbowBtn.type = 'button';
			rainbowBtn.textContent = '虹';
			rainbowBtn.style.cssText = 'padding:0.2em 0.2em;font-size:0.8em;background:#333;color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;';
			rainbowBtn.addEventListener('click', function () {
				var latest = loadCurrent();
				latest[f.key] = 'rainbow';
				saveCurrent(latest);
				updatePreviewColor('rainbow');
				updatePreviewSpeed(latest.BLINK_SPEED);
				updateColorModeHighlight('rainbow');
				reloadSubWindow();
			});
			row.appendChild(rainbowBtn);
			function updateColorModeHighlight(val) {
				var isRainbow = val === 'rainbow';
				var isWire = !val;
				colorInput.style.border = (!isRainbow && !isWire) ? '2px solid #F07070' : '1px solid #555';
				clearBtn.style.border = isWire ? '2px solid #F07070' : '1px solid #555';
				rainbowBtn.style.border = isRainbow ? '2px solid #F07070' : '1px solid #555';
			}
			updateColorModeHighlight(current[f.key]);
		} else if (f.type === 'select') {
			var select = document.createElement('select');
			select.style.cssText = 'font-size:0.8em;padding:0.25em 0.5em;background:#333;color:#fff;border:1px solid #555;border-radius:4px;';
			f.options.forEach(function (opt) {
				var optionEl = document.createElement('option');
				optionEl.value = opt.value;
				optionEl.textContent = opt.label;
				if (opt.value === current[f.key]) optionEl.selected = true;
				select.appendChild(optionEl);
			});
			select.addEventListener('change', function () {
				var latest = loadCurrent();
				latest[f.key] = select.value;
				saveCurrent(latest);
              if (f.key === 'BLINK_SHAPE') { updatePreviewShape(select.value); updateRadiusRowVisibility(select.value); }
              if (f.key === 'RADAR_DIRECTION') { updatePreviewRadarDirection(select.value); }
				reloadSubWindow();
			});
			inputs[f.key] = select;
			row.appendChild(select);
		} else if (f.type === 'range') {
			var range = document.createElement('input');
			range.type = 'range';
			range.min = f.min;
			range.max = f.max;
			range.step = f.step;
			range.value = current[f.key];
			range.style.cssText = 'width:8em;accent-color:#F07070;';
			var valueLabel = document.createElement('span');
			valueLabel.textContent = current[f.key];
			valueLabel.style.cssText = 'width:2.5em;text-align:right;color:#fff;font-size:0.95em;';
			range.addEventListener('input', function () {
			var v = parseFloat(range.value);
			valueLabel.textContent = range.value;
			var latest = loadCurrent();
			latest[f.key] = v;
			saveCurrent(latest);
			reloadSubWindow();
			});
			inputs[f.key] = range;
			row.appendChild(range);
			row.appendChild(valueLabel);
		} else {
			var input = document.createElement('input');
			input.type = 'number';
			input.step = f.step;
			input.value = current[f.key];
			input.style.cssText = 'width:7em;font-size:1.05em;padding:0.2em 0.4em;background:#333;color:#fff;border:1px solid #555;border-radius:4px;';
			input.addEventListener('input', function () {
				var v = parseFloat(input.value);
				if (isNaN(v)) return;
				var latest = loadCurrent();
				latest[f.key] = v;
				saveCurrent(latest);
				reloadSubWindow();
			});
			inputs[f.key] = input;
			row.appendChild(input);
		}
			// 点滅の調整グループに属する項目はblinkGroupRowsColへ、それ以外(画像の明るさ)はpanelへ
			if (isBlinkGroupField) {
				blinkGroupRowsCol.appendChild(row);
			} else {
				panel.appendChild(row);
			}
  });
  // サンプル(プレビュー)がある左側の列の最下段(=右側最後の項目「パルスの向き」と
  // 同じ高さ)に、このグループの項目(点滅の色?パルスの向き)を開発時点の既定値
  // (FIELDSのdef)に戻すボタンを置く。sampleColはalign-items:stretchで右側と同じ
  // 高さまで伸びているので、margin-top:autoで一番下に押し下げる
  var resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.textContent = 'おすすめ1';
  resetBtn.style.cssText = 'margin-top:auto;padding:0.3em 0.3em;background:#333;color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;font-size:0.8em;';
  resetBtn.addEventListener('click', function () {
    var latest = loadCurrent();
    BLINK_GROUP_KEYS.forEach(function (key) {
      for (var fi = 0; fi < FIELDS.length; fi++) {
        if (FIELDS[fi].key === key) { latest[key] = FIELDS[fi].def; break; }
      }
    });
    saveCurrent(latest);
    reloadSubWindow();
    window.openCalibrationModal(currentUrl);
  });
  sampleCol.appendChild(resetBtn);
  overlay.appendChild(panel);
		overlay.addEventListener('click', function (e) {
			if (colorPickerGuardActive) return;
			if (e.target === overlay) closeModal();
		});
		document.addEventListener('keydown', function onEsc(e) {
			if (e.key === 'Escape') {
				closeModal();
				document.removeEventListener('keydown', onEsc);
			}
		});
		overlay._scaleOffsetWidget = scaleOffsetWidget;
		return overlay;
	}
	// 校正モーダルと同じ見た目の枠(タイトル行+閉じるボタン)だけを使い、本文に説明文を表示する。
	// 「誘導端末」未設定でCalibration_2nd.html自体がVBA側で生成されていない品番向け。
	// (2ndディスプレイは開かず、1stディスプレイ側にこのモーダルだけを表示する)
	function buildCalibrationUnavailableModal(message) {
		var overlay = document.createElement('div');
		overlay.id = 'sscCalibrationModalOverlay';
		overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
		var panel = document.createElement('div');
		panel.style.cssText = 'background:#222;color:#fff;padding:0.5em 1em 1em;border-radius:8px;width:min(28em,92vw);box-shadow:0 4px 20px rgba(0,0,0,0.5);';
		var titleRow = document.createElement('div');
		titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1em;margin:0 0 0.5em;border-bottom:2px solid #F07070;padding-bottom:0.3em;';
		var title = document.createElement('h2');
		title.textContent = '2ndディスプレイ 校正';
		title.style.cssText = 'margin:0;font-size:1.2em;';
		var closeBtn = document.createElement('button');
		closeBtn.type = 'button';
		closeBtn.textContent = '閉じる';
		closeBtn.style.cssText = 'flex:0 0 auto;padding:0.4em 1em;background:#F07070;color:#262626;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
		function closeUnavailableModal() {
			if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
		}
		closeBtn.addEventListener('click', closeUnavailableModal);
		titleRow.appendChild(title);
		titleRow.appendChild(closeBtn);
		panel.appendChild(titleRow);
		var body = document.createElement('div');
		body.style.cssText = 'font-size:0.95em;line-height:1.6;color:#ccc;white-space:pre-wrap;';
		body.textContent = message;
		panel.appendChild(body);
		overlay.appendChild(panel);
		overlay.addEventListener('click', function (e) {
			if (e.target === overlay) closeUnavailableModal();
		});
		document.addEventListener('keydown', function onEsc(e) {
			if (e.key === 'Escape') {
				closeUnavailableModal();
				document.removeEventListener('keydown', onEsc);
			}
		});
		return overlay;
	}
	window.openCalibrationModal = async function (calibrationPageUrl) {
		if (typeof openOnDisplay2 !== 'function') {
			console.warn('openOnDisplay2 が見つかりません。display2.js が読み込まれているか確認してください。');
			return;
		}
		// デフォルト起動(調整ボタン)の場合のみ、Calibration_2nd.htmlの実在チェックを行う。
		// 「誘導端末」が未設定の品番はVBA側でこのファイル自体が生成されないため404になる。
		if (!calibrationPageUrl) {
			var calibAvailable = true;
			try {
				var checkRes = await fetch('Calibration_2nd.html', { method: 'HEAD', cache: 'no-store' });
				calibAvailable = checkRes.ok;
			} catch (e) {
				calibAvailable = false;
			}
			if (!calibAvailable) {
				if (modalEl) closeModal();
				modalEl = buildCalibrationUnavailableModal(
					'この製品品番には「誘導端末」が設定されていないため、2ndディスプレイの校正ページを表示できません。\n\n' +
					'SSC作業番号シートの「誘導端末」欄に端末番号を設定してから、変換(VBA)を再実行してください。'
				);
				document.body.appendChild(modalEl);
				return;
			}
		}
		currentUrl = calibrationPageUrl || 'Calibration_2nd.html';
		subWindow = await openOnDisplay2(currentUrl);
		if (modalEl) closeModal();
		modalEl = buildModal();
		document.body.appendChild(modalEl);
		// 拡大率の枠の高さを、実際に描画された「上下」列の高さに合わせる(DOM追加後でないと実測できない)
		var w = modalEl._scaleOffsetWidget;
		if (w) {
			w._scaleBox.style.height = w._yCol.getBoundingClientRect().height + 'px';
			// ↑↓ボタンの横幅を、実際に描画された上下入力欄の横幅に合わせる
			var yInputWidthPx = w._yInputEl.getBoundingClientRect().width + 'px';
			w._yUpBtn.style.width = yInputWidthPx;
			w._yDownBtn.style.width = yInputWidthPx;
		}
	};
	// テキストボタンを、SVGアイコン(画像ファイル不使用)のボタンに置き換える共通処理。
	// fill/stroke="currentColor"にすることで、.myBのcolor(ページごとに変わる--table-text-color)を
	// そのまま引き継ぐ。
	// ページ背景の配線図SVG向けに"svg{position:absolute;width:100%;height:100%;...}"という
	// グローバルルールがあり、このアイコンにも効いてしまう(CSSの型セレクタはSVGの
	// width/height属性より優先される)ため、style属性で明示的に上書きする
	function applyIconButton(btn, svgInnerHtml, label) {
		btn.innerHTML = svgInnerHtml;
		btn.title = label;
		btn.setAttribute('aria-label', label);
		btn.style.display = 'inline-flex';
		btn.style.alignItems = 'center';
		btn.style.justifyContent = 'center';
		// buttonのブラウザ標準paddingが.myBでリセットされておらず、アイコンの周囲に
		// 意図しない余白ができてしまうため明示的に0にする
		btn.style.padding = '0 0.26em';;
	}
	// このscriptタグはbody末尾に置かれており、この時点でボタンは既にDOMに存在するため、
	// DOMContentLoadedを待たずに即実行する(待つと、アイコンに差し替わるまでの一瞬だけ
	// 元のテキスト(「調整」「？」)がそのまま表示されてしまうため)
	(function () {
		var testBtn = document.getElementById('openTestDisplay2Btn');
		if (testBtn) {
			// 「調整」→ よくある歯車アイコン
			applyIconButton(testBtn, '<svg viewBox="0 0 24 24" fill="currentColor" style="position:static;width:2em;height:2em;display:block;pointer-events:none;"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>', '調整');
    testBtn.addEventListener('click', function () {
      window.openCalibrationModal();
    });
  }
  var helpBtn = document.getElementById('openHelpBtn');
  if (helpBtn) {
    // 「？」→ よくあるヘルプ(？)アイコン
    applyIconButton(helpBtn, '<svg viewBox="0 0 24 24" fill="currentColor" style="position:static;width:2em;height:2em;display:block;pointer-events:none;"><path d="M11,18h2v-2h-2V18z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M12,6c-2.21,0-4,1.79-4,4h2c0-1.1,0.9-2,2-2s2,0.9,2,2c0,2-3,1.75-3,5h2c0-2.25,3-2.5,3-5C16,7.79,14.21,6,12,6z"/></svg>', 'このページについて');
    helpBtn.addEventListener('click', function () {
      window.openHelpModal();
    });
  }
})();
// このページについての説明モーダル。中身は後で差し替える前提の枠だけ用意しておく
window.openHelpModal = function () {
  var overlay = document.createElement('div');
  overlay.id = 'sscHelpModalOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
  var panel = document.createElement('div');
  panel.style.cssText = 'background:#222;color:#fff;padding:1.5em 2em;border-radius:8px;width:min(30em,92vw);max-height:80vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
  panel.classList.add('sscModalPanel');
  var titleRow = document.createElement('div');
  titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1em;margin:0 0 0.5em;';
  var title = document.createElement('h2');
  title.textContent = '44_先ハメ誘導SSCについて';
  title.style.cssText = 'margin:0;font-size:1.2em;';
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '閉じる';
  closeBtn.style.cssText = 'flex:0 0 auto;padding:0.4em 1em;background:#F07070;color:#262626;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
  function closeHelpModal() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
  closeBtn.addEventListener('click', closeHelpModal);
  titleRow.appendChild(title);
  titleRow.appendChild(closeBtn);
  panel.appendChild(titleRow);
  var body = document.createElement('div');
  body.id = 'sscHelpModalBody';
  body.style.cssText = 'font-size:0.95em;line-height:1.6;';
  body.innerHTML =
    '<style>' +
      '#sscHelpModalBody .hRow{display:flex;align-items:center;gap:0.5em;margin:0.3em 0;}' +
      '#sscHelpModalBody .hPage{flex:0 0 auto;min-width:1.6em;height:1.6em;padding:0 0.4em;box-sizing:border-box;border-radius:1em;background:#444;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.85em;white-space:nowrap;}' +
      '#sscHelpModalBody .hBarWrap{flex:1 1 auto;background:#333;border-radius:4px;overflow:hidden;height:1.6em;position:relative;}' +
      '#sscHelpModalBody .hBar{height:100%;display:flex;align-items:center;padding-left:0.5em;color:#fff;font-size:0.85em;font-weight:bold;white-space:nowrap;box-sizing:border-box;}' +
      '#sscHelpModalBody .hBar.ok{background:#4CAF50;}' +
      '#sscHelpModalBody .hBar.anomaly{background:#8a5a2a;color:#ffd9a0;}' +
      '#sscHelpModalBody .hBar.subst{background:#4CAF50;}' +
      '#sscHelpModalBody .hBadge{flex:0 0 auto;font-size:0.75em;padding:0.15em 0.5em;border-radius:3px;white-space:nowrap;}' +
      '#sscHelpModalBody .hBadge.ok{background:#2e5c30;color:#9ee6a0;}' +
      '#sscHelpModalBody .hBadge.subst{background:#5c4a2e;color:#e6c89e;}' +
      '#sscHelpModalBody .hArrow{text-align:center;color:#aaa;font-size:0.85em;margin:0.3em 0;}' +
      '#sscHelpModalBody .hSum{background:#2a2a2a;border:1px solid #F07070;border-radius:6px;padding:0.5em 0.8em;margin-top:0.5em;color:#F07070;font-weight:bold;text-align:center;}' +
    '</style>' +
    '<h3 style="color:#F07070;font-size:1em;margin:0 0 0.3em;">起動方法</h3>' +
    '<hr style="border:none;border-top:2px solid #F07070;margin:0 0 0.6em;">' +
    '<ol style="color:#ddd;margin:0 0 1em;padding-left:1.4em;">' +
      '<li>デスクトップの<b>start_server.bat</b> を実行する</li>' +
      '<li>2ndディスプレイを使う場合は<b>歯車マーク</b>をクリック</li>' +
      '<li>キーボードの <b>←/→</b> で <b>戻る/すすむ</b></li>' +
    '</ol>' +
    '<h3 style="color:#F07070;font-size:1em;margin:0 0 0.3em;">生産本数のカウントの仕組み</h3>' +
    '<hr style="border:none;border-top:2px solid #F07070;margin:0 0 0.6em;">' +
    '<p style="color:#ddd;margin:0 0 0.6em;">製品品番毎に<b>中間あたり</b>の作業番号を通過した上で最終ページから最初のページに移動した時だけ1本として数えます。</p>' +
    '<div class="hRow"><div class="hPage">最初</div><div class="hBarWrap"><div class="hBar ok" style="width:1%;">作業開始</div></div></div>' +
    '<div class="hArrow">↓ 作業を進めていく</div>' +
    '<div class="hRow"><div class="hPage">中間</div><div class="hBarWrap"><div class="hBar ok" style="width:50%;">真ん中あたりのページを通過</div></div></div>' +
    '<div class="hArrow">↓ さらに作業を進めていく</div>' +
    '<div class="hRow"><div class="hPage">最後</div><div class="hBarWrap"><div class="hBar ok" style="width:100%;">最終ページで「次へ」</div></div></div>' +
    '<p style="color:#ddd;font-size:0.85em;margin:0.8em 0 0;">※この仕様により最終から最初に行き来しただけではカウントされません。</p>' +
    '<h3 style="color:#F07070;font-size:1em;margin:1em 0 0.3em;">製品品番の切替方</h3>' +
    '<hr style="border:none;border-top:2px solid #F07070;margin:0 0 0.6em;">' +
    '<p style="color:#ccc;margin:0 0 0.6em;">1.画面上部をクリックして製品品番を選択</p>' +
    '<p style="color:#ccc;margin:0 0 0.6em;">2.下記のQRを印刷してQRリーダーで読み込み</p>';
  panel.appendChild(body);
  var qrRow = document.createElement('div');
  qrRow.style.cssText = 'margin:0 0 1em;';
  var qrBtn = document.createElement('button');
  qrBtn.type = 'button';
  qrBtn.textContent = '切替用QRコードを開く';
  qrBtn.style.cssText = 'width:100%;padding:0.5em;font-size:0.85em;background:#F07070;color:#fff;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
  qrBtn.addEventListener('click', function () {
    window.open('../qr.html', '_blank');
  });
  qrRow.appendChild(qrBtn);
  panel.appendChild(qrRow);
  var body2 = document.createElement('div');
  body2.style.cssText = 'font-size:0.95em;line-height:1.6;';
  body2.innerHTML =
    '<h3 style="color:#F07070;font-size:1em;margin:0 0 0.4em;">テスト用</h3>' +
    '<hr style="border:none;border-top:2px solid #F07070;margin:0 0 0.6em;">' +
    '<p style="color:#ccc;margin:0 0 0.6em;">・本数カウント時のポップアップ</p>';
  panel.appendChild(body2);
  // 1本完了時のポップアップ(音・デザイン)を、実際に生産せずその場で確認できるテスト用ボタン。
  // 平均より速い例(緑)と遅い例(赤)の両方を試せるようにする
  var testRow = document.createElement('div');
  testRow.style.cssText = 'display:flex;gap:0.5em;margin-top:0.2em;';
  var testFastBtn = document.createElement('button');
  testFastBtn.type = 'button';
  testFastBtn.textContent = '完了音を試す(速い例)';
  testFastBtn.style.cssText = 'flex:1;padding:0.5em;font-size:0.85em;background:#7CFC9A;color:#1a2e1f;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
  testFastBtn.addEventListener('click', function () {
    showSpeedPopup(45000, 72000);
  });
  var testSlowBtn = document.createElement('button');
  testSlowBtn.type = 'button';
  testSlowBtn.textContent = '完了音を試す(遅い例)';
  testSlowBtn.style.cssText = 'flex:1;padding:0.5em;font-size:0.85em;background:#FF8A8A;color:#3a1414;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
  testSlowBtn.addEventListener('click', function () {
    showSpeedPopup(99000, 72000);
  });
  testRow.appendChild(testFastBtn);
  testRow.appendChild(testSlowBtn);
  panel.appendChild(testRow);
  overlay.appendChild(panel);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeHelpModal();
  });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') {
      closeHelpModal();
      document.removeEventListener('keydown', onEsc);
    }
  });
  document.body.appendChild(overlay);
};
window.openTimingRuleModal = function () {
  var overlay = document.createElement('div');
  overlay.id = 'sscTimingRuleModalOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
  var panel = document.createElement('div');
  panel.style.cssText = 'background:#222;color:#fff;padding:1.5em 2em;border-radius:8px;width:min(30em,92vw);max-height:80vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
  panel.classList.add('sscModalPanel');
  var titleRow = document.createElement('div');
  titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1em;margin:0 0 0.5em;border-bottom:2px solid #F07070;padding-bottom:0.3em;';
  var title = document.createElement('h2');
  title.textContent = 'タイム測定のルール';
  title.style.cssText = 'margin:0;font-size:1.2em;';
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '閉じる';
  closeBtn.style.cssText = 'flex:0 0 auto;padding:0.4em 1em;background:#F07070;color:#262626;font-weight:bold;border:none;border-radius:4px;cursor:pointer;';
  function closeTimingRuleModal() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
  closeBtn.addEventListener('click', closeTimingRuleModal);
  titleRow.appendChild(title);
  titleRow.appendChild(closeBtn);
  panel.appendChild(titleRow);
  var body = document.createElement('div');
  body.id = 'sscTimingRuleModalBody';
  body.style.cssText = 'font-size:0.95em;line-height:1.6;';
  body.innerHTML =
    '<style>' +
      '#sscTimingRuleModalBody .hRow{display:flex;align-items:center;gap:0.5em;margin:0.3em 0;}' +
      '#sscTimingRuleModalBody .hPage{flex:0 0 auto;width:1.6em;height:1.6em;border-radius:50%;background:#444;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.85em;}' +
      '#sscTimingRuleModalBody .hBarWrap{flex:1 1 auto;background:#333;border-radius:4px;overflow:hidden;height:1.6em;position:relative;}' +
      '#sscTimingRuleModalBody .hBar{height:100%;display:flex;align-items:center;padding-left:0.5em;color:#fff;font-size:0.85em;font-weight:bold;white-space:nowrap;box-sizing:border-box;}' +
      '#sscTimingRuleModalBody .hBar.ok{background:#4CAF50;}' +
      '#sscTimingRuleModalBody .hBar.anomaly{background:#8a5a2a;color:#ffd9a0;}' +
      '#sscTimingRuleModalBody .hBar.subst{background:#4CAF50;}' +
      '#sscTimingRuleModalBody .hBadge{flex:0 0 auto;font-size:0.75em;padding:0.15em 0.5em;border-radius:3px;white-space:nowrap;}' +
      '#sscTimingRuleModalBody .hBadge.ok{background:#2e5c30;color:#9ee6a0;}' +
      '#sscTimingRuleModalBody .hBadge.subst{background:#5c4a2e;color:#e6c89e;}' +
      '#sscTimingRuleModalBody .hArrow{text-align:center;color:#aaa;font-size:0.85em;margin:0.3em 0;}' +
      '#sscTimingRuleModalBody .hSum{background:#2a2a2a;border:1px solid #F07070;border-radius:6px;padding:0.5em 0.8em;margin-top:0.5em;color:#F07070;font-weight:bold;text-align:center;}' +
    '</style>' +
    '<p style="color:#ccc;margin:0 0 0.6em;">各ページ(作業番号)に居た時間を測り、1本(先頭ページ→最終ページ)ぶんを合計しています。</p>' +
    '<div class="hRow"><div class="hPage">1</div><div class="hBarWrap"><div class="hBar ok" style="width:32%;">12秒</div></div><div class="hBadge ok">採用</div></div>' +
    '<div class="hRow"><div class="hPage">2</div><div class="hBarWrap"><div class="hBar ok" style="width:40%;">15秒</div></div><div class="hBadge ok">採用</div></div>' +
    '<div class="hRow"><div class="hPage">3</div><div class="hBarWrap"><div class="hBar ok" style="width:27%;">10秒</div></div><div class="hBadge ok">採用</div></div>' +
    '<div class="hSum">1本の所要時間 = 12 + 15 + 10 = 37秒</div>' +
    '<h3 style="color:#F07070;font-size:1em;margin:1em 0 0.4em;">途中で休憩を挟んだ場合(通常の4倍以上かかった時)</h3>' +
    '<div class="hRow"><div class="hPage">2</div><div class="hBarWrap"><div class="hBar anomaly" style="width:100%;">? 実測 3分</div></div></div>' +
    '<div class="hArrow">↓ この実測値は使わず、そのページの過去の中央値に置き換える</div>' +
    '<div class="hRow"><div class="hPage">2</div><div class="hBarWrap"><div class="hBar subst" style="width:40%;">15秒(中央値)</div></div><div class="hBadge subst">代用</div></div>' +
    '<p style="color:#888;font-size:0.85em;margin:0.6em 0 0;">※休憩や中断で極端に長くなったページも、他のページと同じ基準で無理なく1本の時間に含められるようにするための仕組みです。</p>' +
    '<h3 style="color:#F07070;font-size:1em;margin:1em 0 0.4em;">あまりにもはやすぎる場合(中央値の半分以下)</h3>' +
    '<div class="hRow"><div class="hPage">2</div><div class="hBarWrap"><div class="hBar anomaly" style="width:20%;">実測 3秒</div></div></div>' +
    '<div class="hArrow">↓ 誤操作(「次へ」の連打等)の可能性が高いため、この実測値は使わず、そのページの過去の中央値に置き換える</div>' +
    '<div class="hRow"><div class="hPage">2</div><div class="hBarWrap"><div class="hBar subst" style="width:40%;">15秒(中央値)</div></div><div class="hBadge subst">代用</div></div>' +
    '<p style="color:#888;font-size:0.85em;margin:0.6em 0 0;">※この「はやすぎ」のケースは、実測値(3秒)を中央値の計算対象にも含めません。誤操作由来の短い値で中央値そのものが引っ張られないようにするためです(「遅すぎ」のケースは今まで通り、置き換えた中央値を計算対象に含めます)。</p>' +
    '<h3 style="color:#F07070;font-size:1em;margin:1em 0 0.4em;">保存期間のルール</h3>' +
    '<ul style="margin:0;padding-left:1.4em;color:#ccc;">' +
      '<li>「本日の実績」は日付が変わると自動的にリセットされます(その日のうちに完成させた分だけが対象です)。</li>' +
      '<li>「前回作業日」との比較は、直前1日ぶんの平均だけを保持します(それより前の日の記録は残りません)。</li>' +
      '<li>各ページの所要時間の履歴(中央値の算出に使用)は、ページごとに直近200件まで保持します。</li>' +
    '</ul>';
  panel.appendChild(body);
  overlay.appendChild(panel);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeTimingRuleModal();
  });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') {
      closeTimingRuleModal();
      document.removeEventListener('keydown', onEsc);
    }
  });
  document.body.appendChild(overlay);
};
// 外部ディスプレイへの自動表示に必要な権限を、設置時に明示的に取得するための設定。
// getSecondScreen()(display2.js)も内部で同じAPIを呼ぶが、そちらは失敗しても
// コンソール警告のみで作業者には何も表示されないため、ここでは結果を必ずalertで伝える
async function setupExternalDisplay() {
  if (!('getScreenDetails' in window)) {
    alert('このブラウザは外部ディスプレイの自動検出に対応していません。\n手動で2ndディスプレイのウィンドウを外部ディスプレイへドラッグし、F11キーでフルスクリーンにしてください。');
    return;
  }
  try {
    var details = await window.getScreenDetails();
    if (details.screens.length > 1) {
      alert('設定が完了しました。\n次回から自動的に外部ディスプレイに表示されます。');
    } else {
      alert('許可を確認しました。\n現在は外部ディスプレイが検出されていません(未接続の間はメインディスプレイに表示されます)。外部ディスプレイを接続すれば、自動的にそちらへ表示されるようになります。');
    }
  } catch (e) {
    alert('許可されませんでした。\nもう一度ボタンを押して、ブラウザに表示される確認ダイアログで「許可」を選んでください。');
  }
}
})();
// ページ番号(ファイル名)に対応する音声(voice/番号.拡張子)があれば再生する。主な拡張子を順に試し、無ければ何もしない
(function () {
	var m = window.location.pathname.match(/(\d+)\.html$/);
	if (!m) return;
	var num = m[1];
	var exts = ['wav', 'mp3', 'ogg', 'm4a'];
	var i = 0;
	var shown = false;
	// 自動再生がブロックされていても、ファイルさえ存在すればアイコンから手動で再生できるようにする
	function showVoiceReplayButton(src) {
		if (shown) return;
		shown = true;
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.id = 'sscVoiceReplayBtn';
		btn.title = 'この作業の音声を再生';
		var themeColor = '#FE4951';
		// 上下位置・サイズを下部の端末番号バッジ(.tableBox)に合わせる
		var refBox = document.querySelector('.tableBox');
		var refRect = refBox ? refBox.getBoundingClientRect() : null;
		var sizePx = refRect ? refRect.height : 20;
		var topPx = refRect ? refRect.top : (window.innerHeight - 20 - sizePx);
		btn.style.cssText = 'position:fixed;right:0.6em;top:' + topPx + 'px;z-index:9998;width:' + sizePx + 'px;height:' + sizePx + 'px;' +
			'background:none;border:none;color:' + themeColor + ';display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;';
		btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="70%" height="70%" style="pointer-events:none;">' +
			'<path d="M3,9v6h4l5,5V4L7,9H3z M16.5,12c0-1.77-1.02-3.29-2.5-4.03v8.05C15.48,15.29,16.5,13.77,16.5,12z ' +
			'M14,3.23v2.06c2.89,0.86,5,3.54,5,6.71s-2.11,5.85-5,6.71v2.06c4.01-0.91,7-4.49,7-8.77S18.01,4.14,14,3.23z"/></svg>';
		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			new Audio(src).play().catch(function () {});
		});
		document.body.appendChild(btn);
	}
	function tryNext() {
		if (i >= exts.length) return;
		var src = 'voice/' + num + '.' + exts[i];
		var audio = new Audio(src);
		i++;
		audio.addEventListener('canplaythrough', function () { showVoiceReplayButton(src); }, { once: true });
		audio.addEventListener('error', tryNext, { once: true });
		audio.play().catch(function () {});
	}
	tryNext();
})();
// 品番文字列から製品フォルダを探す(完全一致優先、無ければ末尾3桁の設計変更番号が最新のものを選ぶ)。
// ローカルサーバー(http)経由でのみ動作。見つからなければnullを返し、通常のcomposition番号処理にフォールバックする
function findProductFolder(raw) {
    if (!raw) return null;
    raw = raw.replace(/=/g, '_'); // QRリーダーがキー配列の違いで"_"を"="として送出することがあるため補正
    var folders;
    try {
        var listXhr = new XMLHttpRequest();
        listXhr.open('GET', '../__listdir', false);
        listXhr.send();
        if (listXhr.status !== 200) return null;
        folders = JSON.parse(listXhr.responseText);
    } catch (e) {
        return null;
    }
    for (var k = 0; k < folders.length; k++) {
        if (folders[k] === raw) return raw;
    }
    var prefix = raw + '_';
    var best = null;
    var bestSuffix = null;
    for (var i = 0; i < folders.length; i++) {
        var name = folders[i];
        if (name.indexOf(prefix) !== 0) continue;
        var suffix = name.substr(prefix.length).toUpperCase();
        if (suffix.length !== 3) continue;
        if (bestSuffix === null || suffix > bestSuffix) {
            bestSuffix = suffix;
            best = name;
        }
    }
    return best;
}
// prefix配下で1.html,2.html...と順に存在確認し、最初に見つかったページを返す(_2nd.htmlなどの派生ページは対象外、見つからなければnull)
function findFirstCompositionPage(prefix) {
    var maxTry = 30;
    for (var i = 1; i <= maxTry; i++) {
        var candidate = prefix + i + ".html";
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', candidate, false);
        xhr.send();
        if (xhr.status == 200) return candidate;
    }
    return null;
}
// checkTextでの遷移(品番切替・端末番号ジャンプ)は、直後にすぐ自分自身も別ページへ遷移するため、
// updateDisplay2IfOpen(BroadcastChannelの非同期通知)だと2nd側にメッセージが届く前に
// 送信元ページがアンロードされ、通知が失われることがある(特にフォルダをまたぐ品番切替で顕著)。
// window.open()による直接同期は確実だが2ndにフォーカスが一瞬移るため、直後に1st側へ戻す
// 2ndディスプレイのwindow.open()が非同期に読み込まれるタイミングによっては、
// 1st側がページ遷移してtxtbにフォーカスした後から2nd側に奪われることがある。
// windowがフォーカスを取り戻すたびに必ずtxtbへフォーカスし直すことで、
// タイミングに関わらず次の入力ができない状態を防ぐ
function syncDisplay2Reliably(url) {
if (localStorage.getItem('ssc_display2_open') !== '1') return;
  try {
      window.open(url, 'display2Window');
      window.focus();
  } catch (e) {}
}
// プレゼンの埋め込み用: ウインドウに戻った時に入力欄へフォーカスを移す処理は消した
// フォームのテキストボックスの値をチェック
function checkText() {
    var str1 = document.myform.txtb.value;
    var seihin, kosei;
    var myLen = str1.length;
    var filePath;
    if (window.location.protocol !== 'file:') {
        var switchedFolder = findProductFolder(str1.trim());
        if (switchedFolder) {
            var switchedPage = findFirstCompositionPage('../' + switchedFolder + '/');
            var nextUrl = switchedPage ? switchedPage : "notfound.html";
        if (switchedPage) {
            updateDisplay2IfOpen(switchedPage.replace(/\.html$/, '_2nd.html'));
            window.location.href = nextUrl;
        } else {
                window.location.href = nextUrl;
            }
            return false;
        }
    }
    if (myLen <= 10) {
        kosei = str1;
        filePath = kosei + ".html";
    } else {
        seihin = str1.substr(25, 10);
        kosei = str1.substr(11, 4);
        filePath = "1.html";
    }
    if (window.location.protocol === 'file:') {
        // file://プロトコルの場合
        syncDisplay2Reliably(filePath.replace(/\.html$/, '_2nd.html'));
        window.location.href = filePath;
    } else if (myLen > 10) {
        // http://プロトコルの場合(品番一致時): 1.htmlが無ければ2.html...と探す
        var firstPage = findFirstCompositionPage('');
        var firstUrl = firstPage ? firstPage : "notfound.html";
        if (firstPage) {
            updateDisplay2IfOpen(firstPage.replace(/\.html$/, '_2nd.html'));
            window.location.href = firstUrl;
        } else {
            window.location.href = firstUrl;
        }
    } else {
        // http://プロトコルの場合(composition番号直接指定時)
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', filePath, false);
        xhr.send();
        if (xhr.status == 200) {
            updateDisplay2IfOpen(filePath.replace(/\.html$/, '_2nd.html'));
            window.location.href = filePath;
        } else {
            window.location.href = "notfound.html";
        }
    }
    return false; // フォームの標準送信は行わずJSで遷移(クエリ文字列を付けないため)
}
// このページ(品番フォルダ+ページ番号)をlocalStorageに記憶しておく(http経由時のみ意味を持つ)。入口ページ(index.html)が次回このページへ直接戻る
(function () {
	var rel = window.location.pathname.replace(/^\//, '');
	if (/\.html$/.test(rel)) {
		localStorage.setItem('ssc_last_page', rel);
	}
})();
// ページ(作業番号)ごとの所要時間計測。前のページに何時何分に入ったかをここで清算し、
// このページに入った時刻を新たに記録する。ArrowLeft/ArrowRight送りだけでなく、入力欄から
// 直接ジャンプした場合や75→1のラップアラウンド(incrementProductionCount側で個別に清算済み)
// でも、単に「最後に記録したページと今のページが違う」ことだけを見て動くので同じ仕組みで動く
(function () {
	var pageNum = getCurrentPageNum();
	if (!pageNum) return;
	closeOutCurrentPageDuration();
	saveLastPageEntry({ folder: getCurrentFolder(), page: pageNum, enteredAt: Date.now() });
	showPendingSpeedPopupIfAny();
})();
