function setPositionFromDataAttributes() {
	var boxes = document.getElementsByClassName('box');
	var positions = []; var tableHeight = (document.querySelector('table') || {}).offsetHeight || 0; var allRouteSvgs = document.getElementsByTagName('svg'); for (var rs = 0; rs < allRouteSvgs.length; rs++) { if (allRouteSvgs[rs].getElementsByClassName('line').length > 0) { allRouteSvgs[rs].style.top = tableHeight + 'px'; allRouteSvgs[rs].style.height = ((window.innerHeight - tableHeight) * routeScaleY(tableHeight)) + 'px'; } }
	for (var i = 0; i < boxes.length; i++) {
		(function(box) {
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
					var pin = box.getAttribute('data-pin'); index = (pin !== null && values.indexOf(pin) !== -1) ? values.indexOf(pin) : (index + 1) % values.length; progressContainer.style.display = pin !== null ? 'none' : '';
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
								navigateOrNotFound(values[index] + ".html");
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
					navigateOrNotFound(values[0] + ".html");
					});
				}else{box.style.userSelect = 'none';
					box.style.backgroundColor = "#CCC";
				}
				box.appendChild(slideText);
			}
			var maxWidth = window.innerWidth;
			var maxHeight = (window.innerHeight - tableHeight) * routeScaleY(tableHeight);
			// 指数から計算した位置に配置
			var left = (xRatio / 100) * maxWidth - (box.offsetWidth / 2);
			var top = tableHeight + (yRatio / 100) * maxHeight - (box.offsetHeight / 2); var isTag2 = box.id && box.id.endsWith('tag2'); var collided = true, guard = 0;
			while (collided) { collided = false; guard++;
			for (var j = 0; j < positions.length; j++) {
				var pos = positions[j];
				if (top < pos.bottom && top + box.offsetHeight > pos.top && left < pos.right && left + box.offsetWidth > pos.left) {
					if (isTag2 && pos.isTag2 && guard < 30) { var rightShift = pos.right - left + 2; var leftShift = (left + box.offsetWidth) - pos.left + 2; if (rightShift <= leftShift) { left += rightShift; } else { left -= leftShift; } } else { top = pos.bottom + 2; } collided = true; break;
				}
			} }
			box.style.left = left + 'px';
			box.style.top = top + 'px';
			// 現在の要素の位置を保存
			positions.push({
				top: top,
				bottom: top + box.offsetHeight,
				left: left,
				right: left + box.offsetWidth,
				isTag2: isTag2 });
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
					line.setAttribute("stroke-width", "1"); line.style.animationDelay = "-" + blinkDelayForNumber(box.getAttribute("data-values")) + "s";
					svg.appendChild(line);
				}
			}
		})(boxes[i]);
	}
	var circles = document.getElementsByClassName('circle');
	for (var k = 0; k < circles.length; k++) {
		var circle = circles[k];
		var xRatio = parseFloat(circle.getAttribute('data-x'));
		var yRatio = parseFloat(circle.getAttribute('data-y'));
		var backGroundColor = circle.getAttribute('data-backgroundcolor');
		var maxWidth = window.innerWidth;
		var maxHeight = (window.innerHeight - tableHeight) * routeScaleY(tableHeight);
		// 指数から計算した位置に配置
		var left = (xRatio / 100) * maxWidth - (circle.offsetWidth / 2);
		var top = tableHeight + (yRatio / 100) * maxHeight - (circle.offsetHeight / 2);
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
									navigateOrNotFound(composition + ".html");
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
			var tagId = imageBox.getAttribute('data-tag'); var pointsList = []; var pointsListRaw = imageBox.nextElementSibling; if (pointsListRaw && pointsListRaw.tagName === 'SCRIPT' && pointsListRaw.classList.contains('blink-coords-data')) { try { pointsList = JSON.parse(pointsListRaw.textContent); } catch (e) { pointsList = []; } } var overlayDotsRef = { arr: [] }; var imageBoxCurrentComposition = imageBox.getAttribute('data-current-composition') || ''; var rotateAttr = imageBox.getAttribute('data-rotate'); var rotates = rotateAttr ? rotateAttr.split(',') : []; var applyImageBoxRotate = function (idx) { if ((rotates[idx] || rotates[0]) === '180') { imageBox.style.transformOrigin = 'center center'; imageBox.style.transform = 'rotate(180deg)'; } else { imageBox.style.transform = 'none'; } };
			var tagNumForBlink = tagId ? tagId.replace(/tag2?$/, '') : String(l); var blinkDelay = blinkDelayForNumber(tagNumForBlink); imageBox.style.animationDelay = '-' + blinkDelay + 's'; var top, left;
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
				setInterval(function() {
					index = (index + 1) % srcs.length;
					imageBox.style.backgroundImage = 'url(' + srcs[index] + ')';
					var aspectRatio = aspectRatios[index] || aspectRatios[0];
					var width = imageBox.clientWidth;
					var height = width / aspectRatio;
					imageBox.style.left = left + 'px'; applyImageBoxRotate(index); renderImageBoxDots(imageBox, pointsList, overlayDotsRef, index, imageBoxCurrentComposition);
				}, 1000);
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
			if (!(parseFloat(aspectRatios[0]) > 0)) aspectRatios[0] = '1'; if (aspectRatios[0] > 1) {
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
			imageBox.style.backgroundImage = 'url(' + srcs[0] + ')'; applyImageBoxRotate(0); setTimeout(function(bi, pl, odr, cc){ renderImageBoxDots(bi, pl, odr, 0, cc); }, 0, imageBox, pointsList, overlayDotsRef, imageBoxCurrentComposition);
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
				path.classList.add('blink'); path.style.animationDelay = '-' + blinkDelay + 's';
				newSvg.appendChild(path); // 新しいSVGにパスを追加
				document.body.appendChild(newSvg); // 新しいSVGをドキュメントに追加
			}
		})(imageBoxes[l]);
	}
	var bottomImages = document.getElementsByClassName('bottomImage'); var biWidthOverride = {}; (function () { if (/\/\d+-\.html$/.test(window.location.pathname)) return; var HOLE_MIN_PX = 50; var candidates = []; for (var ci = 0; ci < bottomImages.length; ci++) { var el = bottomImages[ci]; var ar = parseFloat(el.getAttribute('data-aspect-ratio')); var raw = el.nextElementSibling; var pts = []; if (raw && raw.tagName === 'SCRIPT' && raw.classList.contains('blink-coords-data')) { try { pts = JSON.parse(raw.textContent); } catch (e) { pts = []; } } if (!pts.length) continue; var maxWidth0 = window.innerWidth * (pts[0].showText === false ? 0.25 : 0.5); var maxHeight = window.innerHeight * 0.3; var w0, h0, heightConstrained, ptsForMeasure = pts; if (pts[0].showText === false) { var wireDiameters = pts.map(function (p) { var area = parseFloat(p.wireSize) || 0; return 2 * Math.sqrt(area / Math.PI); });var totalDiameter = wireDiameters.reduce(function (a, b) { return a + b; }, 0); var cumY = pts[0].y; var holeHTotal = pts.reduce(function (sum, p) { return sum + p.h; }, 0); ptsForMeasure = pts.map(function (p, wi) { var newH = totalDiameter > 0 ? (wireDiameters[wi] / totalDiameter) * holeHTotal : p.h; var copy = { x: p.x, y: cumY, w: p.w, h: newH }; cumY += newH; return copy; }); var maxXPercent = 100, maxYPercent = 100; ptsForMeasure.forEach(function (p) { var pxEnd = (p.x || 0) + (p.w || 0); var pyEnd = (p.y || 0) + (p.h || 0); if (pxEnd > maxXPercent) maxXPercent = pxEnd; if (pyEnd > maxYPercent) maxYPercent = pyEnd; }); var hByWidth = (maxWidth0 * 100) / (ar * maxXPercent); var hByHeight = (maxHeight * 100) / maxYPercent; h0 = Math.min(hByWidth, hByHeight); w0 = h0 * ar; heightConstrained = hByHeight < hByWidth; } else { w0 = maxWidth0; h0 = w0 / ar; heightConstrained = false;if (h0 > maxHeight) { h0 = maxHeight; w0 = h0 * ar; heightConstrained = true; } } var minHolePx; if (pts[0].showText === false) { var wbMinX = Infinity, wbMinY = Infinity, wbMaxX = -Infinity, wbMaxY = -Infinity; ptsForMeasure.forEach(function (p) { if (p.x < wbMinX) wbMinX = p.x; if (p.y < wbMinY) wbMinY = p.y; if (p.x + p.w > wbMaxX) wbMaxX = p.x + p.w; if (p.y + p.h > wbMaxY) wbMaxY = p.y + p.h; }); minHolePx = Math.min(((wbMaxX - wbMinX) / 100) * w0, ((wbMaxY - wbMinY) / 100) * h0); } else { minHolePx = Infinity; ptsForMeasure.forEach(function (p) { var m2 = Math.min((p.w / 100) * w0, (p.h / 100) * h0); if (m2 < minHolePx) minHolePx = m2; }); } candidates.push({ index: ci, heightConstrained: heightConstrained, minHolePx: minHolePx, maxWidth0: maxWidth0, actualWidth: w0 }); } if (candidates.length !== 2) return;if (jointColumnWidth()) { jointAllocateWidths(candidates, biWidthOverride, HOLE_MIN_PX); return; }[[candidates[0], candidates[1]], [candidates[1], candidates[0]]].forEach(function (pair) { var donor = pair[0], recipient = pair[1]; if (recipient.heightConstrained) return; if (biWidthOverride[donor.index] !== undefined || biWidthOverride[recipient.index] !== undefined) return; var freed = 0, donorNewWidth = donor.maxWidth0; if (donor.heightConstrained) { freed = donor.maxWidth0 - donor.actualWidth; } else if (donor.minHolePx > HOLE_MIN_PX) { var shrinkRatio = HOLE_MIN_PX / donor.minHolePx; donorNewWidth = donor.maxWidth0 * shrinkRatio; freed = donor.maxWidth0 - donorNewWidth; } if (freed <= 0) return; biWidthOverride[donor.index] = donorNewWidth; biWidthOverride[recipient.index] = recipient.maxWidth0 + freed; }); })();
	for (var m = 0; m < bottomImages.length; m++) {
		var bottomImage = bottomImages[m];
		var src = bottomImage.getAttribute('data-src');
		var aspectRatio = parseFloat(bottomImage.getAttribute('data-aspect-ratio'));
		var position = bottomImage.getAttribute('data-position');
		var blinkCoords = bottomImage.getAttribute('data-blink-coords');
		var terminalTag = bottomImage.getAttribute('data-terminal-tag');
		var bottomImageJsonRaw = bottomImage.nextElementSibling; var bottomImagePoints = []; if (bottomImageJsonRaw && bottomImageJsonRaw.tagName === 'SCRIPT' && bottomImageJsonRaw.classList.contains('blink-coords-data')) { try { bottomImagePoints = JSON.parse(bottomImageJsonRaw.textContent); } catch (e) { bottomImagePoints = []; } }
		var isRoutePage = /\/\d+-\.html$/.test(window.location.pathname); var isBiWireInfo = bottomImagePoints.length > 0 && bottomImagePoints[0].showText === false; var showWireList = isBiWireInfo && isRoutePage; var showWireListBelow = isBiWireInfo && !isRoutePage; var biHeaderRowRatio = 0.6, biListRowHeight = 0, biMaxXPercent = 100, biMaxYPercent = 100;
		if (isBiWireInfo) { var biWireDiameters = bottomImagePoints.map(function (p) { var area = parseFloat(p.wireSize) || 0; return 2 * Math.sqrt(area / Math.PI); }); var biTotalDiameter = biWireDiameters.reduce(function (a, b) { return a + b; }, 0); var biHoleYStart = bottomImagePoints[0].y; var biHoleHTotal = bottomImagePoints.reduce(function (sum, p) { return sum + p.h; }, 0); var biCumY = biHoleYStart;
		bottomImagePoints.forEach(function (p, wi) { var newH = biTotalDiameter > 0 ? (biWireDiameters[wi] / biTotalDiameter) * biHoleHTotal : p.h; p.y = biCumY; p.h = newH; biCumY += newH; }); for (var biI = 0; biI < bottomImagePoints.length; biI++) { var biPxEnd = (bottomImagePoints[biI].x || 0) + (bottomImagePoints[biI].w || 0); var biPyEnd = (bottomImagePoints[biI].y || 0) + (bottomImagePoints[biI].h || 0); if (biPxEnd > biMaxXPercent) biMaxXPercent = biPxEnd; if (biPyEnd > biMaxYPercent) biMaxYPercent = biPyEnd; } }
		var maxWidth = biWidthOverride[m] !== undefined ? biWidthOverride[m] : window.innerWidth * (showWireList ? 0.3 : (showWireListBelow ? 0.25 : (isRoutePage || bottomImages.length === 1 ? 1 : 0.5))); var maxHeight = window.innerHeight * 0.3; var width, height; var biPlatingH = (!isBiWireInfo && hasPlating(bottomImagePoints)) ? platingLabelHeight() : 0; var jointColW = (!isBiWireInfo && !showWireList && !showWireListBelow) ? jointColumnWidth() : 0; if (jointColW && biWidthOverride[m] === undefined) { maxWidth = (window.innerWidth - jointColW) / 2; }
		var rotated = false; if (showWireListBelow) { if (aspectRatio < 1) { rotated = true; height = (window.innerWidth * 0.15 * 100) / biMaxYPercent; width = height * aspectRatio; if ((width * biMaxXPercent / 100) > maxHeight) { width = (maxHeight * 100) / biMaxXPercent; height = width / aspectRatio; } } else { width = (window.innerWidth * 0.15 * 100) / biMaxXPercent; height = width / aspectRatio; if ((height * biMaxYPercent / 100) > maxHeight) { height = (maxHeight * 100) / biMaxYPercent; width = height * aspectRatio; } } } else if (isBiWireInfo) { height = Math.min((maxWidth * 100) / (aspectRatio * biMaxXPercent), (maxHeight * 100) / biMaxYPercent); width = height * aspectRatio; } else { width = maxWidth; height = width / aspectRatio; if (height > maxHeight - biPlatingH) { height = maxHeight - biPlatingH; width = height * aspectRatio; } } var biVisualW = isBiWireInfo ? (rotated ? (height * biMaxYPercent / 100) : (width * biMaxXPercent / 100)) : width; var biVisualH = isBiWireInfo ? (rotated ? (width * biMaxXPercent / 100) : (height * biMaxYPercent / 100)) : height;
		if (isBiWireInfo) { var biRowsPerColumn = 5; var biRowHeightByHeight = maxHeight / (biRowsPerColumn + biHeaderRowRatio); var biNumColumns = Math.ceil(bottomImagePoints.length / biRowsPerColumn); var biAvailableWidth = window.innerWidth - (width * biMaxXPercent / 100); var biRowHeightByWidth = ((biAvailableWidth / biNumColumns) - 56) / (0.42 * 13.88); biListRowHeight = Math.min(biRowHeightByHeight, biRowHeightByWidth);
		bottomImage.style.width = biVisualW + 'px'; bottomImage.style.height = biVisualH + 'px'; var photoLayer = document.createElement('div'); photoLayer.className = 'bottomImagePhoto'; photoLayer.style.position = 'absolute'; photoLayer.style.left = '0'; photoLayer.style.top = '0'; photoLayer.style.width = width + 'px'; photoLayer.style.height = height + 'px'; photoLayer.style.zIndex = '1'; var biContentParent = bottomImage; if (rotated) { var rotWrap = document.createElement('div'); rotWrap.className = 'bottomImageRotWrap'; rotWrap.style.position = 'absolute'; rotWrap.style.width = (width * biMaxXPercent / 100) + 'px'; rotWrap.style.height = (height * biMaxYPercent / 100) + 'px'; rotWrap.style.left = '50%'; rotWrap.style.top = '50%'; rotWrap.style.transformOrigin = 'center center'; rotWrap.style.transform = 'translate(-50%, -50%) rotate(-90deg)'; bottomImage.appendChild(rotWrap); biContentParent = rotWrap; }
		photoLayer.style.backgroundImage = 'url(' + src + ')'; photoLayer.style.backgroundSize = 'contain'; photoLayer.style.backgroundPosition = 'center'; photoLayer.style.backgroundRepeat = 'no-repeat'; biContentParent.appendChild(photoLayer); } else { bottomImage.style.backgroundImage = 'url(' + src + ')'; bottomImage.style.width = width + 'px'; bottomImage.style.height = height + 'px'; } if (bottomImage.getAttribute('data-rotate') === '180') { bottomImage.style.transformOrigin = 'center center'; bottomImage.style.transform = 'rotate(180deg)'; }
		var radius = width / height * 4; if (showWireListBelow) { var biOwnWidth3 = biVisualW; var wibColW = window.innerWidth * 0.25; var colLeft = position === 'right' ? (window.innerWidth - wibColW) : 0; left = colLeft + (wibColW - biOwnWidth3) / 2; bottomImage.style.left = left + 'px'; bottomImage.style.right = 'auto'; } else if (showWireList) { var biOwnWidth = width * biMaxXPercent / 100; left = (maxWidth - biOwnWidth) / 2; bottomImage.style.left = left + 'px'; bottomImage.style.right = 'auto';
		} else if (position === 'left') { bottomImage.style.left = '0'; bottomImage.style.right = 'auto'; left = 0; } else if (position === 'right') { bottomImage.style.right = '0'; bottomImage.style.left = 'auto'; left = window.innerWidth - bottomImage.clientWidth; } else{
		var leftPercentage = parseFloat(position); var left = (leftPercentage / 100) * window.innerWidth; var bottomImageWidth = bottomImage.offsetWidth; left = left - (bottomImageWidth /2);
		if (left + bottomImageWidth > window.innerWidth) { left = window.innerWidth - bottomImageWidth; }else if (left < 0){ left = 0; } bottomImage.style.left = left + 'px'; bottomImage.style.right = 'auto'; } var biOwnHeight = isBiWireInfo ? biVisualH : height; bottomImage.style.bottom = 'auto'; bottomImage.style.top = showWireListBelow ? (window.innerHeight - maxHeight) + 'px' : ((window.innerHeight - maxHeight) + (maxHeight - biPlatingH - biOwnHeight) / 2) + 'px'; if (biPlatingH) { placePlatingLabel('b' + m, bottomImage.getBoundingClientRect()); }
		if (bottomImagePoints.length > 0) { var bottomImageUpperField = bottomImage.getAttribute('data-upper-field') || 'oppositeTerminal'; var bottomImageCurrentComposition = bottomImage.getAttribute('data-current-composition') || '';
		setTimeout(function(bi, pts, uf, cc, rh, pw, ph, pos, aw) { renderBottomImageDots(bi, pts, uf, cc, pw, ph); if (bi.getAttribute('data-rotate') === '180') { bi.querySelectorAll('.imageBoxDotText').forEach(function (el) { el.style.transform = 'rotate(180deg)'; }); } if (pts.length > 0 && pts[0].showText === false && /\/\d+-\.html$/.test(window.location.pathname)) { renderBottomImageWireInfoList(bi, pts, rh); } else if (pts.length > 0 && pts[0].showText === false) { renderBottomImageWireInfoBelow(bi, pts, pos, aw, cc); } else if (/\/\d+-\.html$/.test(window.location.pathname)) { var biRect = bi.getBoundingClientRect(); var biArea = { top: biRect.top - 45, bottom: biRect.bottom, left: 0, right: window.innerWidth }; document.querySelectorAll('.wireBox').forEach(function (wb) { var wbRect = wb.getBoundingClientRect(); if (wbRect.bottom > biArea.top && wbRect.top < biArea.bottom && wbRect.right > biArea.left && wbRect.left < biArea.right) { wb.style.display = 'none'; } }); } }, 0, bottomImage, bottomImagePoints, bottomImageUpperField, bottomImageCurrentComposition, biListRowHeight, width, height, position, window.innerWidth * 0.25); }
		if (blinkCoords) {
		blinkCoords = blinkCoords.split(';');
		// 座標を計算
		var top = window.innerHeight - bottomImage.clientHeight;
		// 各点滅座標に対して点滅するdivを追加
		for (var i = 0; i < blinkCoords.length; i++) {
			var coord = blinkCoords[i];
			var parts = coord.split(',');
			var blinkX = parseFloat(parts[0]);
			var blinkY = parseFloat(parts[1]);
			var width = parseFloat(parts[2]);
			var height = parseFloat(parts[3]);
			var composition = parts[4];
			var color = parts[5];var radius = parts[6];
			var blinkXPos = (blinkX / 100) * bottomImage.clientWidth;
			var blinkYPos = (blinkY / 100) * bottomImage.clientHeight;
			var blinkWidth = (width / 100) * bottomImage.clientWidth;
			var blinkHeight = (height / 100) * bottomImage.clientHeight;
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
					blinkDiv.style.borderRadius = radius + '%'; 
			blinkDiv.style.backgroundColor = color;
			if (composition) {
				blinkDiv.style.cursor = 'pointer';
				(function(comp) {
					blinkDiv.addEventListener('click', function() {
						navigateOrNotFound(comp + ".html");
					});
				})(composition);
			}
			document.body.appendChild(blinkDiv);
		}	}
		// terminaltagまでの線を引く
		var terminalTagId = bottomImage.getAttribute('data-terminal-tag');
		if (terminalTagId) {
			var terminalTag = findTerminalTag(terminalTagId.replace(/tag$/, ''), false);
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
	document.addEventListener("DOMContentLoaded", function() {
		var terms = document.querySelectorAll(".term");
		for (var i = 0; i < terms.length; i++) {
			var term = terms[i];
			var terminal = term.getAttribute("data-terminal");
			var color = term.getAttribute("data-color");
			var targetElement = findTerminalTag(terminal, true);
			if (targetElement) {
				targetElement.setAttribute("data-wire-color", color); ['glowHaloA', 'glowHaloB'].forEach(function (cls) { var halo = document.createElement('div'); halo.className = 'currentTerminalGlow ' + cls; halo.style.left = targetElement.style.left; halo.style.top = targetElement.style.top; halo.style.width = targetElement.offsetWidth + 'px'; halo.style.height = targetElement.offsetHeight + 'px'; halo.style.color = '#FE4951'; targetElement.parentElement.insertBefore(halo, targetElement); });
			}
		}
	});
	// 0.5秒毎にclassがmyTの要素をフォーカス
	setInterval(function() {
		if (document.getElementById('ssc56SettingsModalOverlay')) return; var myTElements = document.getElementsByClassName('myT');
		if (myTElements.length > 0) {
			myTElements[0].focus();
		}
	}, 500);
}
// タブレット(Android等)では入力欄にフォーカスが移るたびに画面キーボードが出るため、
// inputmode='none' でキーボードを出さない(バーコードリーダーの入力はそのまま使える)。
// 入力欄を指でタップした時だけキーボードを出し、フォーカスが外れたら元に戻す。
(function () { var els = document.getElementsByClassName('myT'); for (var i = 0; i < els.length; i++) { els[i].setAttribute('inputmode', 'none'); els[i].addEventListener('pointerdown', function () { this.removeAttribute('inputmode'); }); els[i].addEventListener('blur', function () { this.setAttribute('inputmode', 'none'); }); } })();
// データ属性から位置を設定
setPositionFromDataAttributes(); (function () { var svgs = document.querySelectorAll('svg'), greenSvg = null; svgs.forEach(function (s) { if (greenSvg) return; var lines = s.getElementsByTagName('line'); for (var i = 0; i < lines.length; i++) { if (lines[i].getAttribute('stroke') === '#00FF66') { greenSvg = s; break; } } }); if (!greenSvg) return; svgs.forEach(function (s) { if (s !== greenSvg && s.querySelector('.blinkWire') && s.parentNode === greenSvg.parentNode) greenSvg.parentNode.insertBefore(s, greenSvg); }); })();
(function () { var m = window.location.pathname.match(/(\d+)-\.html$/); if (!m) return; var target = findTerminalTag(m[1], true); if (!target) return; ['glowHaloA', 'glowHaloB'].forEach(function (cls) { var halo = document.createElement('div'); halo.className = 'currentTerminalGlow ' + cls; halo.style.left = target.style.left; halo.style.top = target.style.top; halo.style.width = target.offsetWidth + 'px'; halo.style.height = target.offsetHeight + 'px'; halo.style.color = '#FE4951'; target.parentElement.insertBefore(halo, target); }); })();
function checkText() {
    var str1 = document.myform.txtb.value; if (sscProgressCommand(str1)) return false; var cmd = str1.trim().toLowerCase(); if (cmd === 'top') { localStorage.removeItem('ssc_last_page'); window.location.href = '../index.html'; return false; } if (cmd === 'index') { window.location.href = './index.html' + subIndexQuery(); return false; }
    var seihin, kosei;
    var myLen = str1.length;
    if (myLen <= 10) {
        kosei = str1;
    } else {
        seihin = str1.substr(25, 10);
        kosei = str1.substr(11, 4);
    }
    var filePath = kosei + ".html";
    
    if (window.location.protocol === 'file:') {
        // file://プロトコルの場合
        document.myform.action = filePath;
    } else {
        // http://プロトコルの場合
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', filePath, false);
        xhr.send();
        if (xhr.status == 200) {
            document.myform.action = filePath;
        } else {
            document.myform.action = "notfound.html";
        }
    }
    return true; // フォームを送信
}
// Enterボタンサイズを調整
function adjustButtonValue() {
	var submitButton = document.getElementById('submitButton'); if (!submitButton) return;
	if (window.innerWidth <= 600) {
		submitButton.value = 'E';
	} else {
		submitButton.value = 'Enter';
	}
}
// ページロード時とリサイズ時に関数を呼び出す
if (window.addEventListener) {
	window.addEventListener('load', function() {
		adjustButtonValue();
	});
	window.addEventListener('resize', function() {
		adjustButtonValue();
		setTimeout(function() {
			location.reload();
		}, 500); // 0.5秒後にリロード
	});
} else if (window.attachEvent) { // IE8用のフォールバック
	window.attachEvent('onload', function() {
		adjustButtonValue();
	});
	window.attachEvent('onresize', function() {
		adjustButtonValue();
		setTimeout(function() {
			location.reload();
		}, 500); // 0.5秒後にリロード
	});
}
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
		var points = []; var pointsRaw = boxTerminal.nextElementSibling; if (pointsRaw && pointsRaw.tagName === 'SCRIPT' && pointsRaw.classList.contains('blink-coords-data')) { try { points = JSON.parse(pointsRaw.textContent); } catch (e) { points = []; } }
		boxTerminal.style.backgroundImage = 'url(' + src + ')'; if (points.length > 0 && points[0].x !== undefined && points[0].showText === false) { var wireDiameters = points.map(function (p) { var area = parseFloat(p.wireSize) || 0; return 2 * Math.sqrt(area / Math.PI); }); var totalDiameter = wireDiameters.reduce(function (a, b) { return a + b; }, 0); var holeYStart = points[0].y; var holeHTotal = points.reduce(function (sum, p) { return sum + p.h; }, 0); var cumY = holeYStart; points.forEach(function (p, wi) { var newH = totalDiameter > 0 ? (wireDiameters[wi] / totalDiameter) * holeHTotal : p.h; p.y = cumY; p.h = newH; cumY += newH; }); }
		// Bon/Ter形状は電線マークが写真の外にはみ出す仕様(ColorMark3_sheetと同じ座標系)なので、はみ出す分だけ写真を縮小して余白を確保する。画像下部の電線情報一覧の高さも空けておく
		var maxXPercent = 100, maxYPercent = 100;
		for (var pi = 0; pi < points.length; pi++) { var pxEnd = (points[pi].x || 0) + (points[pi].w || 0); var pyEnd = (points[pi].y || 0) + (points[pi].h || 0); if (pxEnd > maxXPercent) maxXPercent = pxEnd; if (pyEnd > maxYPercent) maxYPercent = pyEnd; }
		var isWireInfoTerminal = points.length > 0 && points[0].x !== undefined && points[0].showText === false;
		var headerRowRatio = 0.6; var totalAvailableHeight = window.innerHeight - tableHeight; var minPhotoHeight = totalAvailableHeight * 0.28; var listRowHeightCap = Math.min(totalAvailableHeight * 0.12, 90);
		var listRowHeight = isWireInfoTerminal ? Math.min(listRowHeightCap, (totalAvailableHeight - minPhotoHeight) / (points.length + headerRowRatio)) : 0; var listHeight = isWireInfoTerminal ? (points.length + headerRowRatio) * listRowHeight : 0;
		var maxWidth = window.innerWidth;
		var termPlatingH = hasPlating(points) ? platingLabelHeight() : 0; var termPlugList = readEmptyPlugList(); var termPlugH = emptyPlugListHeight(termPlugList); var maxHeight = totalAvailableHeight - listHeight - termPlatingH - termPlugH;
		var height = Math.min((maxWidth * 100) / (aspectRatio * maxXPercent), (maxHeight * 100) / maxYPercent);
		var width = height * aspectRatio;
		boxTerminal.style.width = width + 'px';
		boxTerminal.style.height = height + 'px';
		boxTerminal.style.position = 'absolute';
		var combinedWidth = width * (maxXPercent / 100);
		var combinedHeight = height * (maxYPercent / 100);
		boxTerminal.style.left = ((maxWidth - combinedWidth) / 2) + 'px';
		boxTerminal.style.top = (tableHeight + (maxHeight - combinedHeight) / 2) + 'px';
		boxTerminal.style.transform = 'none'; if (termPlatingH) { placePlatingLabel('t' + m, boxTerminal.getBoundingClientRect()); } if (termPlugH) { var termRect = boxTerminal.getBoundingClientRect(); placeEmptyPlugList(termPlugList, termRect.left, termRect.bottom + termPlatingH + 2); }
		if (!points || points.length === 0) continue;
		// (旧data-coords形式の分割処理はJSON化により不要)
		// CSS適用後に位置を取得
		setTimeout(function(boxTerminal) {
			var boxRect = boxTerminal.getBoundingClientRect();
			var top = boxRect.top; var rotatedBlinkDivs = [];
			for (var i = 0; i < points.length; i++) {
				var pt = points[i];
				// pt.cav, pt.workNum, pt.feltColor, pt.plugColor, pt.isFirstInsert 等も利用可能
				var blinkX = pt.x;
				var blinkY = pt.y;
				var blinkWidth = pt.w;
				var blinkHeight = pt.h;
				var composition = pt.composition;
				var color = pt.color; var radius = pt.radius; var upperText = pt.composition || ''; var lowerText = wireSizeLabel(pt); var fontColor = pt.fontColor || '#000000'; var bgColor = pt.bgColor || color; var showText = pt.showText !== false; var plating = pt.plating || '';
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
				blinkDiv.style.borderRadius = radius + '%'; 
				blinkDiv.style.backgroundColor = color;
				var plugColorVal = pt.plugColor ? String(pt.plugColor).trim() : ''; var isPlugged = (!color || color === '#') && plugColorVal !== '' && plugColorVal !== '#' && (!composition || String(composition).trim() === ''); if (isPlugged) { blinkDiv.style.opacity = 1; blinkDiv.classList.add('blinkPlug'); blinkDiv.style.backgroundColor = plugColorVal; blinkDiv.appendChild(buildPlugAsterisk(plugColorVal, (pt.plugFontColor && pt.plugFontColor !== '#') ? pt.plugFontColor : '#000', blinkWidthPx, blinkHeightPx)); } else if (showText && (upperText || lowerText)) { blinkDiv.style.opacity = 1; blinkDiv.classList.add('blinkStripeBox'); blinkDiv.style.setProperty('--stripe-color', bgColor); var mappedFontColor = SSC_STRIPE_FONT_MAP[bgColor.toUpperCase()] || fontColor; blinkDiv.style.color = mappedFontColor; blinkDiv.style.borderColor = mappedFontColor; blinkDiv.style.fontSize = (Math.min(blinkWidthPx, blinkHeightPx) * (plating ? 0.3 : 0.35)) + 'px'; blinkDiv.style.lineHeight = plating ? '1' : '1.1'; var showTextShadow = color.toUpperCase() !== bgColor.toUpperCase(); blinkDiv.style.textShadow = showTextShadow ? buildOutlineShadow(bgColor, 0.12) : 'none'; blinkDiv.innerHTML = "<span class='rotatableText'>" + holeTextHtml(upperText, lowerText, plating) + "</span>"; fitHoleTextLater(blinkDiv); var isFirstInsert = pt.isFirstInsert === true; if (isFirstInsert) { var insetSize = Math.min(blinkWidthPx, blinkHeightPx) * 0.05; blinkDiv.style.boxShadow = 'inset 0 0 0 ' + insetSize + 'px #FE5151'; } } else if (color.length > 1) { blinkDiv.style.opacity = 1; blinkDiv.classList.add('blinkStripeBox', 'wireColorBand'); blinkDiv.style.setProperty('--stripe-color', bgColor); blinkDiv.style.zIndex = '-1'; } else { blinkDiv.style.opacity = 0.5; }
				var feltColorVal = pt.feltColor ? String(pt.feltColor).trim() : ''; if (color && color !== '#' && feltColorVal && feltColorVal !== '#') { var feltSize = Math.min(blinkWidthPx, blinkHeightPx) * 0.38 * 0.7; var feltDrop = document.createElement('div'); feltDrop.style.position = 'absolute'; var feltIsRotated = boxTerminal.getAttribute('data-rotate') === '180'; if (feltIsRotated) { feltDrop.style.left = '0'; feltDrop.style.top = (-blinkHeightPx * 0.02) + 'px'; feltDrop.style.setProperty('--feltBaseRotate', '0deg'); } else { feltDrop.style.right = '0'; feltDrop.style.bottom = (-blinkHeightPx * 0.02) + 'px'; feltDrop.style.setProperty('--feltBaseRotate', '180deg'); } feltDrop.style.width = feltSize + 'px'; feltDrop.style.height = feltSize + 'px'; feltDrop.style.boxSizing = 'border-box'; feltDrop.style.background = feltColorVal; feltDrop.style.border = '1px solid ' + ((pt.feltColorBorder && pt.feltColorBorder !== '#') ? pt.feltColorBorder : '#000'); feltDrop.style.borderRadius = '50% 50% 50% 0'; feltDrop.style.transformOrigin = 'center'; feltDrop.style.animation = 'sscFeltWiggle 1s ease-in-out infinite'; feltDrop.style.pointerEvents = 'none'; feltDrop.style.zIndex = 22; blinkDiv.appendChild(feltDrop); }if (composition) {
					blinkDiv.style.cursor = 'pointer';
					(function(comp) {
						blinkDiv.addEventListener('click', function() {
							navigateOrNotFound(comp + ".html");
						});
					})(composition);
				}
				document.body.appendChild(blinkDiv); rotatedBlinkDivs.push(blinkDiv);
			} if (boxTerminal.getAttribute('data-rotate') === '180') { rotatedBlinkDivs.forEach(function (el) { var elLeft = parseFloat(el.style.left), elTop = parseFloat(el.style.top); el.style.left = (elLeft - boxRect.left) + 'px'; el.style.top = (elTop - top) + 'px'; boxTerminal.appendChild(el); }); boxTerminal.style.transformOrigin = 'center center'; boxTerminal.style.transform = 'rotate(180deg)'; boxTerminal.querySelectorAll('.rotatableText').forEach(function (el) { el.style.transform = 'rotate(180deg)'; el.style.display = 'inline-block'; }); } if (isWireInfoTerminal) { var listContainer = document.createElement('div'); listContainer.className = 'wireInfoList'; listContainer.style.setProperty('--wireInfoUnit', (listRowHeight * 0.42) + 'px'); listContainer.style.top = boxRect.bottom + 'px'; listContainer.style.height = ((points.length + headerRowRatio) * listRowHeight) + 'px'; var headerRow = document.createElement('div'); headerRow.className = 'wireInfoHeaderRow'; headerRow.style.height = (listRowHeight * headerRowRatio) + 'px'; headerRow.style.fontSize = (listRowHeight * 0.26) + 'px'; headerRow.innerHTML = '<span>構成No</span><span>線長</span><span>サイズ</span><span>相手端末</span>'; listContainer.appendChild(headerRow); points.forEach(function (p, idx) { var row = document.createElement('div'); row.className = 'wireInfoRow'; var n = idx + 1; if (n % 5 === 0 && n !== points.length) { row.className += ' wireInfoDivider'; } row.style.height = listRowHeight + 'px'; row.style.fontSize = (listRowHeight * 0.42) + 'px'; var baseColor = p.color || '#000'; var stripeColor = p.bgColor || p.color; var mappedFontColor = SSC_STRIPE_FONT_MAP[(stripeColor || '').toUpperCase()] || p.fontColor || '#000000'; var badgeShadow = baseColor.toUpperCase() !== stripeColor.toUpperCase() ? buildOutlineShadow(stripeColor, 0.1) : 'none'; var badgeStyle = 'background-color:' + baseColor + ';--stripe-color:' + stripeColor + ';color:' + mappedFontColor + ';border-color:' + mappedFontColor + ';text-shadow:' + badgeShadow + ';'; row.innerHTML = '<span class=\'blinkStripeBox wireInfoBadge\' style=\'' + badgeStyle + '\'>' + (p.composition || '') + '</span><span class=\'wireInfoLen\'>' + (p.cutLength || '') + '<span class=\'wireInfoLenUnit\'>mm</span></span><span class=\'wireInfoSize\'>' + wireSizeLabel(p) + '</span><span class=\'wireInfoOpp\'>' + (p.oppositeTerminal || '') + '</span>'; if (p.composition) { row.style.cursor = 'pointer'; (function (comp) { row.addEventListener('click', function () { navigateOrNotFound(comp + '.html'); }); })(p.composition); } listContainer.appendChild(row); }); document.body.appendChild(listContainer); listContainer.style.left = ((window.innerWidth - listContainer.offsetWidth) / 2) + 'px'; }
		}, 0, boxTerminal);
	}
};
var clickableElements = document.getElementsByClassName('clickable');
	if (clickableElements.length > 0) {
	for (var i = 0; i < clickableElements.length; i++) {
		clickableElements[i].addEventListener('click', function() {
			window.location.href = 'index.html' + subIndexQuery();
		});
	}
}
function buildPlugAsterisk(fillColor, strokeColor, boxW, boxH) { var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 ' + boxW + ' ' + boxH); svg.setAttribute('preserveAspectRatio', 'none'); svg.style.position = 'absolute'; svg.style.left = '0'; svg.style.top = '0'; svg.style.width = '100%'; svg.style.height = '100%'; svg.style.pointerEvents = 'none'; var maxDim = Math.max(boxW, boxH); var cx = boxW / 2, cy = boxH / 2; var halfLenInner = maxDim * 0.4; var halfWidthInner = maxDim * 0.05; var borderThickness = Math.max(1, maxDim * 0.04); function addBars(halfWidth, halfLen, color) { for (var a = 0; a < 180; a += 60) { var bar = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'); var pts = [(cx - halfWidth) + ',' + (cy - halfLen), (cx + halfWidth) + ',' + (cy - halfLen), (cx + halfWidth) + ',' + (cy + halfLen), (cx - halfWidth) + ',' + (cy + halfLen)].join(' '); bar.setAttribute('points', pts); bar.setAttribute('transform', 'rotate(' + a + ' ' + cx + ' ' + cy + ')'); bar.setAttribute('fill', color); svg.appendChild(bar); } } addBars(halfWidthInner + borderThickness, halfLenInner + borderThickness, strokeColor); addBars(halfWidthInner, halfLenInner, fillColor); return svg; }
function buildOutlineShadow(color, em) {
	var offsets = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
	return offsets.map(function (o) {
		return (o[0] * em) + 'em ' + (o[1] * em) + 'em 0 ' + color;
	}).join(', ');
}
var SSC_STRIPE_FONT_MAP = {"#FF0000":"#FF0000","#050505":"#FFFFFF","#FCFCFC":"#000000","#F00000":"#FFFFFF","#00BA54":"#FFFFFF","#FFFF00":"#000000","#A25900":"#FFFFFF","#006EFF":"#FFFFFF","#FFA0B1":"#000000","#BABABA":"#000000","#99FFCC":"#000000","#65E2FF":"#000000","#BA44FF":"#FFFFFF","#FF8211":"#000000","#CD9800":"#FFFFFF","#FFB366":"#000000","#646464":"#FFFFFF","#5D5D5D":"#FFFFFF","#ADADAD":"#000000","#CBCBCB":"#000000","#063406":"#FFFFFF","#FFEF8F":"#000000","#EAEA59":"#000000","#06064A":"#FFFFFF","#3F0600":"#FFFFFF","#D6B641":"#000000","#644A8D":"#FFFFFF","#DCB9FF":"#000000","#FF5A00":"#FFFFFF","#BABABA":"#000000","#FCFCFC":"#000000","#E65A00":"#FFFFFF","#81D8D0":"#FFFFFF","#BABABA":"#000000","#000000":"#FFFFFF","#000000":"#FFFFFF"};
function navigateOrNotFound(target) {
	if (location.protocol === 'file:') { window.location.href = target; return; } // file://ではHEAD確認が機能しないため素通しする
	var xhr = new XMLHttpRequest();
	try {
		xhr.open('HEAD', target, false);
		xhr.send();
	} catch (e) {}
	window.location.href = (xhr.status === 200) ? target : "notfound.html?reason=wiring";
}
function centerClickBorder() {
	var cell = document.querySelector('.headerProductCell');
	var border = document.querySelector('.clickBorder');
	if (!cell || !border) return;
	var rect = cell.getBoundingClientRect();
	border.style.top = (rect.top + rect.height / 2) + 'px';
}
window.addEventListener('load', centerClickBorder);
window.addEventListener('resize', centerClickBorder);
function findCurrentConnectionGroups(points, currentComposition) {
	var groups = [];
	if (!currentComposition) return groups;
	points.forEach(function(p) {
		if (p.composition === currentComposition && p.connectionGroup) { groups.push(p.connectionGroup); }
	});
	return groups;
}
function isCurrentCompositionMatch(pt, currentComposition, currentGroups) {
	if (!currentComposition) return false;
	if (pt.composition === currentComposition) return true;
	return !!(pt.connectionGroup && currentGroups.indexOf(pt.connectionGroup) !== -1);
}
function renderImageBoxDots(imageBox, pointsList, overlayDotsRef, idx, currentComposition) {
	var biPhotoSrc = imageBox.style.backgroundImage; if (biPhotoSrc && biPhotoSrc !== 'none') { var biPhoto = imageBox.querySelector('.imageBoxPhoto'); if (!biPhoto) { biPhoto = document.createElement('div'); biPhoto.className = 'imageBoxPhoto'; biPhoto.style.position = 'absolute'; biPhoto.style.left = '0'; biPhoto.style.top = '0'; biPhoto.style.width = '100%'; biPhoto.style.height = '100%'; biPhoto.style.backgroundSize = 'contain'; biPhoto.style.backgroundPosition = 'center'; biPhoto.style.backgroundRepeat = 'no-repeat'; biPhoto.style.pointerEvents = 'none'; biPhoto.style.zIndex = '1'; imageBox.insertBefore(biPhoto, imageBox.firstChild); } biPhoto.style.backgroundImage = biPhotoSrc; imageBox.style.backgroundImage = 'none'; } imageBoxNoImage(imageBox, idx); overlayDotsRef.arr.forEach(function(d) { d.remove(); });
	overlayDotsRef.arr = [];
	var points = pointsList[idx] || [];
	var currentGroups = findCurrentConnectionGroups(points, currentComposition);
	points.forEach(function(pt) {
		if (pt.showText === false) { var band = document.createElement('div'); band.className = 'blinkStripeBox wireColorBand'; band.style.position = 'absolute'; band.style.left = pt.x + '%'; band.style.top = pt.y + '%'; band.style.width = pt.w + '%'; band.style.height = pt.h + '%'; band.style.borderRadius = pt.radius + '%'; band.style.backgroundColor = pt.color; band.style.setProperty('--stripe-color', pt.bgColor || pt.color); imageBox.appendChild(band); overlayDotsRef.arr.push(band); return; } if (pt.isFirstInsert !== true) return;
		var color = pt.color;
		var bgColor = pt.bgColor || color;
		var fontColor = pt.fontColor || '#000000';
		var mappedFontColor = SSC_STRIPE_FONT_MAP[bgColor.toUpperCase()] || fontColor;
		var dot = document.createElement('div');
		dot.className = 'imageBoxDot blinkStripeBox';
		dot.style.position = 'absolute';
		dot.style.left = pt.x + '%';
		dot.style.top = pt.y + '%';
		dot.style.width = pt.w + '%';
		dot.style.height = pt.h + '%';
		dot.style.borderRadius = pt.radius + '%';
		dot.style.backgroundColor = color;
		dot.style.setProperty('--stripe-color', bgColor);
		dot.style.borderColor = mappedFontColor;
		if (pt.composition === currentComposition) {
			dot.classList.add('blinkHole');
		}
		imageBox.appendChild(dot);
		overlayDotsRef.arr.push(dot);
	});
}
function renderBottomImageDots(bottomImage, points, upperField, currentComposition, photoWidth, photoHeight) {
	var currentGroups = findCurrentConnectionGroups(points, currentComposition); var wireColorBandWrap = null; if (points.length > 0 && points[0].showText === false) { var wbMinX = Infinity, wbMinY = Infinity, wbMaxX = -Infinity, wbMaxY = -Infinity; points.forEach(function (p) { if (p.x < wbMinX) wbMinX = p.x; if (p.y < wbMinY) wbMinY = p.y; if (p.x + p.w > wbMaxX) wbMaxX = p.x + p.w; if (p.y + p.h > wbMaxY) wbMaxY = p.y + p.h; }); wireColorBandWrap = document.createElement('div'); wireColorBandWrap.className = 'wireColorBandWrap'; wireColorBandWrap.style.position = 'absolute'; wireColorBandWrap.style.left = ((wbMinX / 100) * photoWidth) + 'px'; wireColorBandWrap.style.top = ((wbMinY / 100) * photoHeight) + 'px'; wireColorBandWrap.style.width = (((wbMaxX - wbMinX) / 100) * photoWidth) + 'px'; wireColorBandWrap.style.height = (((wbMaxY - wbMinY) / 100) * photoHeight) + 'px'; wireColorBandWrap.dataset.wbMinX = wbMinX; wireColorBandWrap.dataset.wbMinY = wbMinY; var biRotWrap = bottomImage.querySelector('.bottomImageRotWrap'); (biRotWrap || bottomImage).appendChild(wireColorBandWrap); }
	points.forEach(function(pt) {
		var color = pt.color;
		var bgColor = pt.bgColor || color;
		if (pt.showText === false) {
			var wbMinX2 = parseFloat(wireColorBandWrap.dataset.wbMinX), wbMinY2 = parseFloat(wireColorBandWrap.dataset.wbMinY); var band = document.createElement('div'); band.className = 'blinkStripeBox wireColorBand'; band.style.position = 'absolute'; band.style.left = (((pt.x - wbMinX2) / 100) * photoWidth) + 'px'; band.style.top = (((pt.y - wbMinY2) / 100) * photoHeight) + 'px'; band.style.width = ((pt.w / 100) * photoWidth) + 'px'; band.style.height = ((pt.h / 100) * photoHeight) + 'px';
			band.style.borderRadius = pt.radius + '%'; band.style.backgroundColor = color; band.style.setProperty('--stripe-color', bgColor); if (pt.composition) { band.style.cursor = 'pointer'; (function(comp) { band.addEventListener('click', function() { navigateOrNotFound(comp + ".html"); }); })(pt.composition); } wireColorBandWrap.appendChild(band); return;
		}
		var dot = document.createElement('div'); dot.className = 'imageBoxDot'; dot.style.position = 'absolute'; dot.style.left = pt.x + '%'; dot.style.top = pt.y + '%'; dot.style.width = pt.w + '%'; dot.style.height = pt.h + '%'; dot.style.borderRadius = pt.radius + '%'; dot.style.backgroundColor = color; if (pt.composition) { dot.setAttribute('data-composition', pt.composition); }
		var boxWidthPx = (pt.w / 100) * bottomImage.clientWidth; var boxHeightPx = (pt.h / 100) * bottomImage.clientHeight; var plugColorVal = pt.plugColor ? String(pt.plugColor).trim() : ''; var isPlugged = (!color || color === '#') && plugColorVal !== '' && plugColorVal !== '#' && (!pt.composition || String(pt.composition).trim() === ''); if (isPlugged) { dot.classList.add('blinkPlug'); dot.style.backgroundColor = plugColorVal; dot.appendChild(buildPlugAsterisk(plugColorVal, (pt.plugFontColor && pt.plugFontColor !== '#') ? pt.plugFontColor : '#000', boxWidthPx, boxHeightPx)); bottomImage.appendChild(dot); return; }
		var fontColor = pt.fontColor || '#000000'; var mappedFontColor = SSC_STRIPE_FONT_MAP[bgColor.toUpperCase()] || fontColor; var upperText = pt[upperField] || ''; var lowerText = wireSizeLabel(pt); var plating = pt.plating || '';
		var bg = document.createElement('div'); bg.className = 'blinkStripeBox'; bg.style.position = 'absolute'; bg.style.inset = '0'; bg.style.borderRadius = 'inherit'; bg.style.backgroundColor = color; bg.style.setProperty('--stripe-color', bgColor); bg.style.borderColor = mappedFontColor; var flashOverlay = null;
		if (isCurrentCompositionMatch(pt, currentComposition, currentGroups)) {
			bg.classList.add('blinkHole'); flashOverlay = document.createElement('div'); flashOverlay.className = 'imageBoxDotFlash'; flashOverlay.style.backgroundColor = color;
		} var isGroupMatch = isCurrentCompositionMatch(pt, currentComposition, currentGroups); if (isGroupMatch) { dot.classList.add('haloEligible'); dot.style.zIndex = 20; } if (isGroupMatch && Math.min(boxWidthPx, boxHeightPx) < sscSettings.PULSE_THRESHOLD_PX) { dot.style.zIndex = 20; var haloBase = Math.min(boxWidthPx, boxHeightPx); var haloMinScale = 1 + (14 / haloBase); var haloMaxScale = 1 + (16 / haloBase); ['glowHaloA', 'glowHaloB'].forEach(function (cls) { var halo = document.createElement('div'); halo.className = 'holeGlow currentTerminalGlow ' + cls; halo.style.left = '0'; halo.style.top = '0'; halo.style.width = boxWidthPx + 'px'; halo.style.height = boxHeightPx + 'px'; halo.style.borderRadius = pt.radius + '%'; halo.style.zIndex = '-1'; halo.style.color = '#FE5151'; halo.style.setProperty('--haloMinScale', haloMinScale); halo.style.setProperty('--haloMaxScale', haloMaxScale); dot.appendChild(halo); }); }
		dot.appendChild(bg); var textLayer = document.createElement('div'); textLayer.className = 'imageBoxDotText'; textLayer.style.position = 'absolute'; textLayer.style.inset = '0'; textLayer.style.display = 'flex'; textLayer.style.alignItems = 'center'; textLayer.style.justifyContent = 'center'; textLayer.style.textAlign = 'center';
		textLayer.style.fontFamily = "'MPLUS1p', sans-serif"; textLayer.style.fontWeight = 'bold'; textLayer.style.color = mappedFontColor; textLayer.style.fontSize = (Math.min(boxWidthPx, boxHeightPx) * (plating ? 0.3 : 0.35)) + 'px'; textLayer.style.lineHeight = plating ? '1' : '1.1';
		var showTextShadow = color.toUpperCase() !== bgColor.toUpperCase(); textLayer.style.textShadow = showTextShadow ? buildOutlineShadow(bgColor, 0.12) : 'none'; textLayer.innerHTML = holeTextHtml(upperText, lowerText, plating); dot.appendChild(textLayer); fitHoleTextLater(textLayer); if (flashOverlay) { dot.appendChild(flashOverlay); } if (pt.composition === currentComposition && currentGroups.length > 0 && bottomImage.getAttribute('data-joint-slot') !== '1') { var selfRing = document.createElement('div'); selfRing.className = 'selfHoleRing'; dot.appendChild(selfRing); }
		if (pt.isFirstInsert === true) { var insetSize = Math.min(boxWidthPx, boxHeightPx) * 0.05; bg.style.boxShadow = 'inset 0 0 0 ' + insetSize + 'px #FE5151'; } var feltColorVal = pt.feltColor ? String(pt.feltColor).trim() : ''; if (feltColorVal && feltColorVal !== '#') { var feltSize = Math.min(boxWidthPx, boxHeightPx) * 0.38 * 0.7; var feltDrop = document.createElement('div'); feltDrop.style.position = 'absolute'; var feltIsRotated = bottomImage.getAttribute('data-rotate') === '180'; if (feltIsRotated) { feltDrop.style.left = '0'; feltDrop.style.top = (-boxHeightPx * 0.02) + 'px'; feltDrop.style.setProperty('--feltBaseRotate', '0deg'); } else { feltDrop.style.right = '0'; feltDrop.style.bottom = (-boxHeightPx * 0.02) + 'px'; feltDrop.style.setProperty('--feltBaseRotate', '180deg'); } feltDrop.style.width = feltSize + 'px'; feltDrop.style.height = feltSize + 'px'; feltDrop.style.boxSizing = 'border-box'; feltDrop.style.background = feltColorVal; feltDrop.style.border = '1px solid ' + ((pt.feltColorBorder && pt.feltColorBorder !== '#') ? pt.feltColorBorder : '#000'); feltDrop.style.borderRadius = '50% 50% 50% 0'; feltDrop.style.transformOrigin = 'center'; feltDrop.style.animation = 'sscFeltWiggle 1s ease-in-out infinite'; feltDrop.style.pointerEvents = 'none'; feltDrop.style.zIndex = 22; dot.appendChild(feltDrop); }
		if (pt.composition) {
			dot.style.cursor = 'pointer';
			(function(comp) {
				dot.addEventListener('click', function() {
					navigateOrNotFound(comp + ".html");
				});
			})(pt.composition);
		}
		if (pt.composition === currentComposition) dot.style.zIndex = 21; bottomImage.appendChild(dot);
	});
}
var SSC56_SETTINGS_KEY = 'ssc56_settings';
var DEFAULT_PULSE_THRESHOLD_PX = 20;
function loadSscSettings() {
	var saved = {};
	try {
		saved = JSON.parse(localStorage.getItem(SSC56_SETTINGS_KEY)) || {};
	} catch (e) {
		saved = {};
	}
	return {
		PULSE_THRESHOLD_PX: typeof saved.PULSE_THRESHOLD_PX === 'number' ? saved.PULSE_THRESHOLD_PX : DEFAULT_PULSE_THRESHOLD_PX
	};
}
var sscSettings = loadSscSettings();
window.setSscSetting = function (partial) {
	var current = loadSscSettings();
	for (var key in partial) {
		if (Object.prototype.hasOwnProperty.call(current, key)) {
			current[key] = partial[key];
		}
	}
	localStorage.setItem(SSC56_SETTINGS_KEY, JSON.stringify(current));
	sscSettings = current;
	applyPulseThreshold();
};
function applyPulseThreshold() {
	var dots = document.querySelectorAll('.bottomImage .imageBoxDot');
	dots.forEach(function (dot) {
		if (!dot.classList.contains('haloEligible')) return;
		var rect = dot.getBoundingClientRect();
		var shouldPulse = Math.min(rect.width, rect.height) < sscSettings.PULSE_THRESHOLD_PX;
		var existingPulse = dot.querySelector('.holeGlow');
		if (shouldPulse && !existingPulse) { dot.style.zIndex = 20; var haloBase = Math.min(rect.width, rect.height); var haloMinScale = 1 + (14 / haloBase); var haloMaxScale = 1 + (16 / haloBase);
			['glowHaloA', 'glowHaloB'].forEach(function (cls) {
				var halo = document.createElement('div'); halo.className = 'holeGlow currentTerminalGlow ' + cls; halo.style.left = '0'; halo.style.top = '0';
				halo.style.width = rect.width + 'px'; halo.style.height = rect.height + 'px'; halo.style.borderRadius = dot.style.borderRadius; halo.style.zIndex = '-1'; halo.style.color = '#FE5151'; halo.style.setProperty('--haloMinScale', haloMinScale); halo.style.setProperty('--haloMaxScale', haloMaxScale);
				dot.appendChild(halo);
			});
		} else if (!shouldPulse && existingPulse) {
			dot.querySelectorAll('.holeGlow').forEach(function (h) { h.remove(); }); dot.style.zIndex = '';
		}
	});
}
function openSscSettingsModal() {
	if (document.getElementById('ssc56SettingsModalOverlay')) return;
	var current = loadSscSettings();
	var overlay = document.createElement('div');
	overlay.id = 'ssc56SettingsModalOverlay';
	overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
	var panel = document.createElement('div');
	panel.style.cssText = 'background:#222;color:#fff;padding:1em 1.2em;border-radius:8px;width:min(24em,90vw);box-shadow:0 4px 20px rgba(0,0,0,0.5);';
	var title = document.createElement('div');
	title.textContent = '設定';
	title.style.cssText = 'font-size:1.2em;font-weight:bold;margin-bottom:0.8em;';
	panel.appendChild(title);
	var row = document.createElement('div');
	row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:0.6em;margin-bottom:1em;';
	var label = document.createElement('span');
	label.textContent = 'パルスが出るCAVサイズの上限(px)';
	label.style.cssText = 'font-size:0.9em;color:#ccc;';
	var input = document.createElement('input');
	input.type = 'number';
	input.min = '0';
	input.step = '1';
	input.value = current.PULSE_THRESHOLD_PX;
	input.style.cssText = 'width:5em;font-size:1em;padding:0.2em 0.3em;background:#333;color:#fff;border:1px solid #555;border-radius:4px;text-align:center;';
	input.addEventListener('input', function () {
		var v = parseFloat(input.value);
		if (isNaN(v)) return;
		window.setSscSetting({ PULSE_THRESHOLD_PX: v });
	});
	row.appendChild(label);
	row.appendChild(input);
	panel.appendChild(row); var qrBtn = document.createElement('button'); qrBtn.type = 'button'; qrBtn.textContent = 'QRコードの印刷'; qrBtn.style.cssText = 'width:100%;padding:0.5em;margin-bottom:0.5em;background:#555;color:#fff;border:none;border-radius:4px;font-size:1em;cursor:pointer;'; qrBtn.addEventListener('click', function () { window.location.href = '../qr_print.html'; }); panel.appendChild(qrBtn);
	var closeBtn = document.createElement('button');
	closeBtn.type = 'button';
	closeBtn.textContent = '閉じる';
	closeBtn.style.cssText = 'width:100%;padding:0.5em;background:#F07070;color:#fff;border:none;border-radius:4px;font-size:1em;cursor:pointer;';
	closeBtn.addEventListener('click', function () {
		overlay.parentNode.removeChild(overlay);
	});
	panel.appendChild(closeBtn);
	overlay.appendChild(panel);
	overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.parentNode.removeChild(overlay); });
	document.body.appendChild(overlay);
}
document.addEventListener('DOMContentLoaded', function () {
	var gearBtn = document.getElementById('openSettingsBtn');
	if (gearBtn) {
		gearBtn.addEventListener('click', openSscSettingsModal);
	} var indexBtn = document.getElementById('openIndexBtn'); if (indexBtn) { indexBtn.addEventListener('click', function () { localStorage.removeItem('ssc_last_page'); window.location.href = '../index.html'; }); }
});
// 構成.html/端末番号.html(例: 0202.html/46.html)は左右キーで前後の番号に移動できるようにする
// 各ページのwindow.SSC_NAV_LISTに番号一覧(製品全体・ソート済み)があればその中を移動し、無ければ単純な+1/-1にフォールバック。検索欄入力中は矢印キーの対象外にする
if (/\/\d+-?\.html$/.test(window.location.pathname)) {
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
		var active = document.activeElement;
		var tag = active ? active.tagName : '';
		if ((tag === 'INPUT' || tag === 'TEXTAREA') && active.value) return; e.preventDefault();
		var m = window.location.pathname.match(/(\d+)(-?)\.html$/);
		if (!m) return;
		var current = m[1]; var suffix = m[2];
		var list = window.SSC_NAV_LIST;
		if (list && list.length) {
			// 実在する番号の一覧内を移動するので、存在しないページに
			// 飛んで止まることがない。両端では反対側の端に折り返す
			var idx = list.indexOf(current);
			if (idx === -1) return;
			var nextIdx = idx + (e.key === 'ArrowRight' ? 1 : -1);
			if (nextIdx < 0) nextIdx = list.length - 1; if (nextIdx >= list.length) nextIdx = 0;
			navigateOrNotFound(list[nextIdx] + suffix + '.html');
		} else {
			// 一覧が埋め込まれていないページ向けのフォールバック(単純な+1/-1)
			var digits = current.length;
			var next = parseInt(current, 10) + (e.key === 'ArrowRight' ? 1 : -1);
			if (next < 0) return;
			var nextStr = String(next);
			while (nextStr.length < digits) { nextStr = '0' + nextStr; }
			navigateOrNotFound(nextStr + suffix + '.html');
		}
	});
}
function renderBottomImageWireInfoList(bottomImage, points, listRowHeight) {
	var headerRowRatio = 0.6; var rowsPerColumn = 5; var headerHeight = listRowHeight * headerRowRatio;
	var blockHeight = (rowsPerColumn + headerRowRatio) * listRowHeight; var maxHeight = window.innerHeight * 0.3; var blockTop = (window.innerHeight - maxHeight) + (maxHeight - blockHeight) / 2;
	var listAreaLeft = window.innerWidth * 0.3 + window.scrollX; var numColumns = Math.ceil(points.length / rowsPerColumn); var cumulativeLeft = listAreaLeft;
	function buildRow(p) {
		var row = document.createElement('div'); row.className = 'wireInfoRow'; row.style.height = listRowHeight + 'px'; row.style.fontSize = (listRowHeight * 0.42) + 'px';
		var baseColor = p.color || '#000'; var stripeColor = p.bgColor || p.color; var mappedFontColor = SSC_STRIPE_FONT_MAP[(stripeColor || '').toUpperCase()] || p.fontColor || '#000000';
		var badgeShadow = baseColor.toUpperCase() !== stripeColor.toUpperCase() ? buildOutlineShadow(stripeColor, 0.1) : 'none';
		var badgeStyle = 'background-color:' + baseColor + ';--stripe-color:' + stripeColor + ';color:' + mappedFontColor + ';border-color:' + mappedFontColor + ';text-shadow:' + badgeShadow + ';';
		row.innerHTML = '<span class="blinkStripeBox wireInfoBadge" style="' + badgeStyle + '">' + (p.composition || '') + '</span><span class="wireInfoLen">' + (p.cutLength || '') + '<span class="wireInfoLenUnit">mm</span></span><span class="wireInfoSize">' + wireSizeLabel(p) + '</span><span class="wireInfoOpp">' + (p.oppositeTerminal || '') + '</span>';
		if (p.composition) { row.style.cursor = 'pointer'; (function (comp) { row.addEventListener('click', function () { navigateOrNotFound(comp + '.html'); }); })(p.composition); }
		return row;
	}
	for (var col = 0; col < numColumns; col++) {
		var colPoints = points.slice(col * rowsPerColumn, col * rowsPerColumn + rowsPerColumn); var colContainer = document.createElement('div'); colContainer.className = 'wireInfoList';
		colContainer.style.setProperty('--wireInfoUnit', (listRowHeight * 0.42) + 'px'); colContainer.style.top = blockTop + 'px'; colContainer.style.left = cumulativeLeft + 'px'; colContainer.style.height = blockHeight + 'px';
		if (col === 0) {
			var headerRow = document.createElement('div'); headerRow.className = 'wireInfoHeaderRow'; headerRow.style.height = headerHeight + 'px'; headerRow.style.fontSize = (listRowHeight * 0.26) + 'px';
			headerRow.innerHTML = '<span>構成No</span><span>線長</span><span>サイズ</span><span>相手端末</span>'; colContainer.appendChild(headerRow);
		} else {
			var headerSpacer = document.createElement('div'); headerSpacer.style.height = headerHeight + 'px'; colContainer.appendChild(headerSpacer);
		}
		colPoints.forEach(function (p) { colContainer.appendChild(buildRow(p)); }); document.body.appendChild(colContainer); cumulativeLeft += colContainer.offsetWidth;
	}
	var listArea = { top: blockTop - 60, bottom: blockTop + blockHeight, left: listAreaLeft, right: cumulativeLeft };
	document.querySelectorAll('.wireBox').forEach(function (wb) {
		var wbRect = wb.getBoundingClientRect();
		if (wbRect.bottom > listArea.top && wbRect.top < listArea.bottom && wbRect.right > listArea.left && wbRect.left < listArea.right) {
			wb.style.display = 'none';
		}
	});
}
function renderBottomImageWireInfoBelow(bottomImage, points, position, areaWidth, currentComposition) {
	// ボンダーの電線の一覧。行はジョイントの一覧と同じ jointWireRowHtml(行き先が下のハメ図の端末と同じ行は札が点滅して行き先は空欄、違う行は暗く行き先を端末番号の札に)。表題は接続G_ の名前(W003 等)
	var rect = bottomImage.getBoundingClientRect(); var available = window.innerHeight - rect.bottom;
	var title = ''; points.forEach(function (p) { if (!title && p.connectionGroup) title = p.connectionGroup; }); var titleRows = 0;
	var rowHeightCap = Math.min(window.innerHeight * 0.05, 40); var rowHeight = Math.max(10, Math.min(rowHeightCap, available / (points.length + titleRows)));
	// 文字の大きさ: 行の高さの 0.42 倍。横幅に余裕がある時は大きくする(上限は行の高さの 0.55 倍)
	var unit = Math.max(rowHeight * 0.42, Math.min(rowHeight * 0.55, (areaWidth - 14) / 15.4));
	var container = document.createElement('div'); container.className = 'wireInfoList jointStyleList'; container.style.setProperty('--wireInfoUnit', unit + 'px'); container.style.setProperty('--jointRowH', rowHeight + 'px'); container.style.fontSize = unit + 'px';
	container.style.top = rect.bottom + 'px'; container.style.height = ((points.length + titleRows) * rowHeight) + 'px'; container.style.width = areaWidth + 'px';
	var shown = jointShownTerminals(); if (title) { var tEl = document.createElement('div'); tEl.className = 'bonderTitle'; tEl.textContent = title; tEl.style.fontSize = (unit * 1.5) + 'px'; document.body.appendChild(tEl); } container.innerHTML = points.map(function (p, idx) { return jointWireRowHtml(p, currentComposition, shown, (idx + 1) % 5 === 0 && idx + 1 !== points.length); }).join('');
	container.querySelectorAll('.wireInfoRow[data-composition]').forEach(function (row) { row.addEventListener('click', function () { navigateOrNotFound(row.getAttribute('data-composition') + '.html'); }); });
	document.body.appendChild(container);
	if (position === 'right') { container.style.right = '0'; container.style.left = 'auto'; } else { container.style.left = '0'; container.style.right = 'auto'; }
	if (title) { var colRect = container.getBoundingClientRect(); tEl.style.left = Math.min(colRect.left, rect.left) + 'px'; tEl.style.top = rect.top + 'px'; }
}
function blinkDelayForNumber(numStr) {
	var n = parseInt(numStr, 10); if (isNaN(n)) n = 0;
	return ((n * 37) % 100) / 100;
}
// 成型方向(端子から電線が出る向き)。下の画像(bottomImage)・端末番号.html の画像(boxTerminal)の data-molding-direction(0=上、時計回り)の辺の内側に、細い帯と両端の矢印2つを描く
var MOLDING_COLOR = '#FE4951';
function moldingArrowPath(len, w) { var hw = w / 2, head = len * 0.42, hhw = w * 1.25; return 'M ' + (-hw) + ' 0 V ' + (-(len - head)) + ' H ' + (-hhw) + ' L 0 ' + (-len) + ' L ' + hhw + ' ' + (-(len - head)) + ' H ' + hw + ' V 0 Z'; }
function drawMoldingArrows() { var bis = document.querySelectorAll('.bottomImage, .boxTerminal'); for (var i = 0; i < bis.length; i++) { var bi = bis[i], a = parseInt(bi.getAttribute('data-molding-direction'), 10), old = bi.querySelector('.moldingArrow'); if (old) old.parentNode.removeChild(old); if (isNaN(a) || bi.querySelector('.bottomImagePhoto')) continue; a = ((Math.round(a / 90) * 90) % 360 + 360) % 360; var W = bi.clientWidth, H = bi.clientHeight; if (!W || !H) continue;
	var m = Math.min(W, H), len = Math.max(14, m * 0.08), w = len * 0.34, band = Math.max(4, m * 0.015), run = len * 0.175, along = (a === 0 || a === 180) ? W : H, end = along / 2 - w * 1.4, ex = a === 90 ? W : (a === 270 ? 0 : W / 2), ey = a === 0 ? 0 : (a === 180 ? H : H / 2), d = moldingArrowPath(len, w);
	var arrow = '<path d="' + d + '" fill="' + MOLDING_COLOR + '" opacity=".7" style="filter: blur(' + Math.max(2, w * 0.35) + 'px)"/><path d="' + d + '" fill="' + MOLDING_COLOR + '" stroke="#000" stroke-width="' + Math.max(1, w * 0.12) + '" stroke-linejoin="round"/>';
	var s = '<rect x="' + (-along / 2) + '" y="0" width="' + along + '" height="' + band + '" fill="' + MOLDING_COLOR + '" opacity=".9"/>'; [-end, end].forEach(function (k) { s += '<g transform="translate(' + k + ' ' + (band + len + 3 + run) + ')"><g class="moldingPush" style="--run:' + (-run) + 'px">' + arrow + '</g></g>'; });
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'moldingArrow'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:9;'; svg.innerHTML = '<g transform="translate(' + ex + ' ' + ey + ') rotate(' + a + ')">' + s + '</g>'; bi.appendChild(svg); } }
(function () { var st = document.createElement('style'); st.textContent = '@keyframes moldingPush { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(var(--run)); } } .moldingPush { animation: moldingPush 1.5s ease-in-out infinite; }'; document.head.appendChild(st); })();
window.addEventListener('load', function () { setTimeout(drawMoldingArrows, 0); }); window.addEventListener('resize', function () { setTimeout(drawMoldingArrows, 300); });
// 電線サイズの表示: 作業記号(workSymbol。ツイストなら Tw、生区_ が E なら S)があればそれ、無ければ電線サイズ
function wireSizeLabel(p) { return (p && p.workSymbol) ? p.workSymbol : ((p && p.wireSize) || ''); }
// ハメ図の穴の中の文字: 構成番号と電線サイズの2行。めっき(plating。金めっきなら Au)がある時は3行にして1行目に出す
// (全体を span で包む: 下のハメ図の文字の div は flex なので、包まないと Au が横に並ぶ。めっきの行は 0.8 倍の文字。3行の時は呼ぶ側で、文字を 0.35 → 0.3、行の高さを 1.1 → 1 にして穴に収める)
// 穴の文字が枠からはみ出さない様に、描いた後に実際の文字の幅・高さを測って縮める。Chrome109/Edge109 は 10px より小さい文字を 10px で表示するので、その時は scale で縮める
var HOLE_TEXT_FIT = 0.9; var holeTextFitQueue = [];
function fitHoleTextLater(el) { holeTextFitQueue.push(el); if (holeTextFitQueue.length > 1) return; var run = function () { fitHoleTextNow(); fitHoleTextNow(); holeTextFitQueue = []; }; if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { setTimeout(run, 0); }); } else { setTimeout(run, 0); } }
function fitHoleTextNow() { var q = holeTextFitQueue; var m = q.map(function (el) { var r = document.createRange(); r.selectNodeContents(el); var rc = r.getBoundingClientRect(); return [rc.width, rc.height, el.offsetWidth, el.offsetHeight]; }); q.forEach(function (el, i) { var z = m[i]; if (!z[0] || !z[1] || !z[2] || !z[3]) return; var s = Math.min(1, (z[2] * HOLE_TEXT_FIT) / z[0], (z[3] * HOLE_TEXT_FIT) / z[1]); if (s >= 1) return; var t = el.querySelector('.rotatableText') || el; var want = parseFloat(getComputedStyle(el).fontSize) * (parseFloat(t.style.scale) || 1) * s; el.style.fontSize = want + 'px'; var real = parseFloat(getComputedStyle(el).fontSize); if (real > want * 1.01) { if (t !== el) { t.style.display = 'inline-block'; } t.style.scale = String(want / real); } else { t.style.scale = ''; } }); }
function holeTextHtml(upperText, lowerText, plating) { var body = (upperText ? upperText : '') + (lowerText ? '<br>' + lowerText : ''); return plating ? "<span><span class='platingText' style='font-size:0.8em;'>" + plating + '</span><br>' + body + '</span>' : body; }
// 金メッキありの札(ver2 のハメ図の下の表示と同じ)。端末の電線に1本でも金めっき(plating)があれば、ハメ図の真下に出す。大きさは画面の高さに合わせる
function hasPlating(points) { return (points || []).some(function (p) { return !!p.plating; }); } function platingLabelFontPx() { return Math.max(12, window.innerHeight * 0.018); } function platingLabelHeight() { return platingLabelFontPx() * 1.6 + 4; }
function placePlatingLabel(key, rect) { var id = 'platingLabel_' + key; var el = document.getElementById(id); if (!el) { el = document.createElement('div'); el.id = id; el.className = 'platingLabel'; el.textContent = '金メッキあり'; document.body.appendChild(el); } el.style.fontSize = platingLabelFontPx() + 'px'; el.style.left = (rect.left + rect.width / 2) + 'px'; el.style.top = (rect.bottom + 2) + 'px'; }
// 空栓の一覧(ver2 のハメ図の下の「＊ 品番 ×数」と同じ)。端末番号.html だけ。データは VBA の makeEmptyPlugListJson56(<script class=emptyPlugList>)。アイコンはハメ図の栓の穴と同じ(栓の色の地 + buildPlugAsterisk の ＊、角の丸みも同じ)。文字の大きさは画面の高さの 2.6%(最小 14px)
function readEmptyPlugList() { var s = document.querySelector('script.emptyPlugList'); if (!s) return []; try { return JSON.parse(s.textContent) || []; } catch (e) { return []; } } function emptyPlugFontPx() { return Math.max(14, window.innerHeight * 0.026); } function emptyPlugListHeight(list) { return list.length ? list.length * emptyPlugFontPx() * 1.6 + 6 : 0; }
function placeEmptyPlugList(list, left, top) { var el = document.getElementById('emptyPlugList'); if (!el) { el = document.createElement('div'); el.id = 'emptyPlugList'; el.className = 'emptyPlugList'; document.body.appendChild(el); } var fontPx = emptyPlugFontPx(), iconPx = fontPx * 1.3; el.style.fontSize = fontPx + 'px'; el.style.left = left + 'px'; el.style.top = top + 'px'; el.innerHTML = ''; list.forEach(function (p) { var fill = (p.color && p.color !== '#') ? p.color : '#ffffff'; var stroke = (p.fontColor && p.fontColor !== '#') ? p.fontColor : '#000'; var row = document.createElement('div'); var icon = document.createElement('span'); icon.className = 'emptyPlugIcon'; icon.style.width = iconPx + 'px'; icon.style.height = iconPx + 'px'; icon.style.backgroundColor = fill; icon.style.borderRadius = (p.radius || '10') + '%'; icon.appendChild(buildPlugAsterisk(fill, stroke, iconPx, iconPx)); row.appendChild(icon);  row.appendChild(document.createTextNode(p.partNumber + ' ×' + p.count)); el.appendChild(row); }); }
// ジョイント電線(相手の端末が空)と、その親の電線(同じ接続G_ で両端に端末がある電線)の構成のページ。下の帯に、親の端末のハメ図(data-joint-slot。親の穴は普通の点滅)と自分の端末のハメ図を左右に、その真ん中に子の電線の一覧(表題は接続G_ の名前 J001 等。幅固定。左右に余白)(ボンダーと同じ形。短い順。引っ張った時に先に指に触れる方が短い。5本ごとに区切り線)。行き先が下のハメ図の端末のどれかと同じ子は、札が点滅して行き先は空欄。違う子は構成番号・線長・サイズを暗くし、行き先を白い丸枠で囲む。今の構成番号の札には枠。データは VBA の makeJointInfoHtml56(<script class=jointInfoData>)
function showJointInfo() { var j = readJointInfo(); if (!j) return; var members = (j.members || []).slice().sort(function (a, b) { return (parseFloat(a.cutLength) || 0) - (parseFloat(b.cutLength) || 0); }); var rowH = jointRowHeight(members.length); var el = document.createElement('div'); el.className = 'jointInfo'; el.style.fontSize = (rowH * 0.42) + 'px'; el.style.setProperty('--wireInfoUnit', (rowH * 0.42) + 'px'); el.style.setProperty('--jointRowH', rowH + 'px'); el.style.width = jointListWidth() + 'px'; el.innerHTML = "<div class='jointInfoTitle'>" + j.group + '</div>' + members.map(function (p, idx) { return jointWireRowHtml(p, j.self, jointShownTerminals(), (idx + 1) % 5 === 0 && idx + 1 !== members.length); }).join(''); el.querySelectorAll('.wireInfoRow[data-composition]').forEach(function (row) { row.addEventListener('click', function () { navigateOrNotFound(row.getAttribute('data-composition') + '.html'); }); }); document.body.appendChild(el); placeJointInfo(el); }
function placeJointInfo(el) { var w = jointListWidth(); var j = readJointInfo(); var n = j && j.members ? j.members.length : 0; if (w && jointColumnWidth()) { var band = window.innerHeight * 0.3; var leftImg = document.querySelector('.bottomImage[data-position=left]'), rightImg = document.querySelector('.bottomImage[data-position=right]'); var gapL = leftImg ? leftImg.getBoundingClientRect().right : 0, gapR = rightImg ? rightImg.getBoundingClientRect().left : window.innerWidth; el.style.left = Math.max(gapL + 14, (gapL + gapR - w) / 2) + 'px'; el.style.top = (window.innerHeight * 0.7 + Math.max(0, (band - (n + 0.8) * jointRowHeight(n)) / 2)) + 'px'; return; } var bi = document.querySelector('.bottomImage'); var r = bi ? bi.getBoundingClientRect() : null; el.style.bottom = '16px'; if (!r || r.left + r.width / 2 > window.innerWidth / 2) { el.style.left = '16px'; } else { el.style.right = '16px'; } } window.addEventListener('load', function () { setTimeout(showJointInfo, 0); });
function jointWireRowHtml(p, currentComposition, shownTerminals, isDivider) { var baseColor = p.color || '#000'; var stripeColor = p.bgColor || p.color; var mappedFontColor = SSC_STRIPE_FONT_MAP[(stripeColor || '').toUpperCase()] || p.fontColor || '#000000'; var badgeShadow = baseColor.toUpperCase() !== stripeColor.toUpperCase() ? buildOutlineShadow(stripeColor, 0.1) : 'none'; var isSelf = p.composition === currentComposition; var isSame = (shownTerminals || []).indexOf(p.oppositeTerminal) !== -1; var badgeStyle = 'background-color:' + baseColor + ';--stripe-color:' + stripeColor + ';color:' + mappedFontColor + ';border-color:' + mappedFontColor + ';text-shadow:' + badgeShadow + ';position:relative;'; return "<div class='wireInfoRow " + (isSame ? 'jointInfoSameRow' : 'jointInfoOtherRow') + (isDivider ? ' wireInfoDivider' : '') + "' data-composition='" + p.composition + "'><span class='blinkStripeBox wireInfoBadge" + (isSame ? ' blinkHole' : '') + "' style='" + badgeStyle + "'>" + p.composition + (isSame ? "<span class='imageBoxDotFlash' style='background-color:" + baseColor + ";'></span>" : '') + (isSelf ? "<span class='selfHoleRing'></span>" : '') + '</span>' + "<span class='wireInfoLen'>" + (p.cutLength || '') + "<span class='wireInfoLenUnit'>mm</span></span><span class='wireInfoSize'>" + wireSizeLabel(p) + "</span><span class='wireInfoOpp'>" + (isSame ? '' : "<span class='jointOppFrame'>" + (p.oppositeTerminal || '') + '</span>') + '</span></div>'; }
function readJointInfo() { var s = document.querySelector('script.jointInfoData'); if (!s) return null; try { return JSON.parse(s.textContent); } catch (e) { return null; } } function jointRowHeight(n) { return Math.max(14, Math.min(window.innerHeight * 0.045, (window.innerHeight * 0.3 - 8) / (Math.max(1, n) + 0.8))); } function jointListWidth() { var j = readJointInfo(); if (!j) return 0; var u = jointRowHeight((j.members || []).length) * 0.42; return Math.ceil(u * 13.8 + 4); } function jointColumnWidth() { if (document.getElementsByClassName('bottomImage').length !== 2) return 0; var w = jointListWidth(); return w ? w + 2 * 14 : 0; } function jointShownTerminals() { return [].map.call(document.getElementsByClassName('bottomImage'), function (b) { return (b.getAttribute('data-src') || '').replace(/^.*\/img\//, '').replace(/_[^_]*$/, ''); }); }
// ジョイントのページの左右のハメ図の幅: 穴の小さい方が先に、帯の高さいっぱいになる幅まで取る。穴の大きい方は、一番小さい穴が 50px(HOLE_MIN_PX)になる幅まで譲る
function jointAllocateWidths(c, out, holeMin) { var A = window.innerWidth - jointColumnWidth(); var band = window.innerHeight * 0.3; var els = document.getElementsByClassName('bottomImage'); c.forEach(function (x) { var ar = parseFloat(els[x.index].getAttribute('data-aspect-ratio')); x.need = band * ar; x.minW = (isFinite(x.minHolePx) && x.minHolePx > 0) ? holeMin * x.actualWidth / x.minHolePx : x.need; }); var s = c[0].minHolePx <= c[1].minHolePx ? c[0] : c[1], b = s === c[0] ? c[1] : c[0]; var ws = Math.min(s.need, Math.max(A / 2, A - Math.min(b.need, b.minW))); out[s.index] = ws; out[b.index] = A - ws; }
// ボンダーのページ(ボンダーの電線の一覧 .jointStyleList があるページ): 下のハメ図の点滅している穴と、一覧の同じ構成番号の札を線で繋ぐ。2 本以上の時だけ(1 本なら点滅で分かるので要らない)。1 本ずつ色を変え(赤・朱色・橙は使わない)、札 → 穴の向きに流れる点線。両端に ●。線は最前面(成型方向の帯の上)。穴を避けて、穴の手前で止まるので、穴の文字には掛からない
// 道: 6px のマス目の上で探す。出発は、一覧が穴より右なら札の左から左へ、一覧が穴より左なら行の右端(相手端末の列の外。一覧の文字を横切らない)から右へ。他の穴を通ると高い、成型方向の帯に沿って進むと高い(横切るのは良い)、曲がると高い(進む先の 1 ～ 2 マス先に穴がある時だけ安い = 穴にぶつかる少し手前で曲がる)として一番安い道を探す。着く所は穴の左右の辺の上下の真ん中(横から入る)が基本。その外側(穴の幅か高さの小さい方の半分、最低 12px)に他の穴がある辺は使わない(穴と穴の隙間に潜り込まない)。穴の上か下の辺の左右の真ん中(縦から入る)は BOND_VERT_PEN を足して比べる。着く所のマスは、穴のマスのすぐ外にとる
var BOND_LINK_COLORS = ['#00C8FF', '#FFD400', '#7CFC00', '#DA70D6', '#FFFFFF', '#4D7CFE', '#00E5B0'], BOND_CELL = 6, BOND_VERT_PEN = 20;
function bondLinkPairs() { var list = document.querySelector('.jointStyleList'); if (!list) return []; var res = []; document.querySelectorAll('.bottomImage .imageBoxDot[data-composition]').forEach(function (d) { if (!d.querySelector('.blinkHole')) return; var row = list.querySelector(".wireInfoRow[data-composition='" + d.getAttribute('data-composition') + "']"); if (!row) return; var b = row.querySelector('.wireInfoBadge').getBoundingClientRect(), rr = row.getBoundingClientRect(), dr = d.getBoundingClientRect(); if (b.left > dr.right) { res.push({ dot: d, x: b.left - 3, y: b.top + b.height / 2, dir: 2 }); } else if (rr.right < dr.left) { res.push({ dot: d, x: rr.right + 3, y: b.top + b.height / 2, dir: 0 }); } }); res.sort(function (p, q) { return p.y - q.y; }); return res.length >= 2 ? res : []; }
function bondLinkGrid(ps) { var C = BOND_CELL; var all = [].map.call(document.querySelectorAll('.bottomImage'), function (b) { return b.getBoundingClientRect(); }); var imgs = [].filter.call(document.querySelectorAll('.bottomImage'), function (b) { return b.querySelector('.imageBoxDot'); }).map(function (b) { return b.getBoundingClientRect(); }); var x0 = Math.min.apply(null, all.map(function (r) { return r.left - 12; }).concat(ps.map(function (p) { return p.x - C; }))), x1 = Math.max.apply(null, imgs.map(function (r) { return r.right + 12; }).concat(ps.map(function (p) { return p.x + C; }))); var y0 = Math.max(0, Math.min.apply(null, all.map(function (r) { return r.top; }).concat(ps.map(function (p) { return p.y; }))) - 12), y1 = window.innerHeight - 1; var W = Math.ceil((x1 - x0) / C), H = Math.ceil((y1 - y0) / C); var hole = new Int32Array(W * H).fill(-1), dots = document.querySelectorAll('.bottomImage .imageBoxDot'), rects = []; for (var k = 0; k < dots.length; k++) { var r = dots[k].getBoundingClientRect(); rects.push(r); var cx0 = Math.max(0, Math.floor((r.left - 2 - x0) / C)), cx1 = Math.min(W - 1, Math.floor((r.right + 2 - x0) / C)), cy0 = Math.max(0, Math.floor((r.top - 2 - y0) / C)), cy1 = Math.min(H - 1, Math.floor((r.bottom + 2 - y0) / C)); for (var y = cy0; y <= cy1; y++) { for (var x = cx0; x <= cx1; x++) { hole[y * W + x] = k; } } } var band = new Uint8Array(W * H), bands = [].map.call(document.querySelectorAll('.bottomImage .moldingArrow rect'), function (e) { var r = e.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, horiz: r.width >= r.height }; }); bands.forEach(function (r) { var cx0 = Math.max(0, Math.floor((r.left - 3 - x0) / C)), cx1 = Math.min(W - 1, Math.floor((r.right + 3 - x0) / C)), cy0 = Math.max(0, Math.floor((r.top - 3 - y0) / C)), cy1 = Math.min(H - 1, Math.floor((r.bottom + 3 - y0) / C)); for (var y = cy0; y <= cy1; y++) { for (var x = cx0; x <= cx1; x++) { band[y * W + x] = r.horiz ? 1 : 2; } } }); return { x0: x0, y0: y0, W: W, H: H, hole: hole, dots: dots, rects: rects, band: band, bands: bands, used: new Uint8Array(W * H) }; }
function bondHeapPush(h, c, s) { h.push([c, s]); var i = h.length - 1; while (i > 0) { var pa = (i - 1) >> 1; if (h[pa][0] <= h[i][0]) break; var t = h[pa]; h[pa] = h[i]; h[i] = t; i = pa; } } function bondHeapPop(h) { var top = h[0], last = h.pop(); if (h.length) { h[0] = last; var i = 0; for (;;) { var l = 2 * i + 1, r = l + 1, m = i; if (l < h.length && h[l][0] < h[m][0]) m = l; if (r < h.length && h[r][0] < h[m][0]) m = r; if (m === i) break; var t = h[m]; h[m] = h[i]; h[i] = t; i = m; } } return top; }
function bondLinkRoute(g, p) { var W = g.W, H = g.H, C = BOND_CELL, DX = [1, 0, -1, 0], DY = [0, 1, 0, -1], N = W * H * 4; var cx = function (x) { return Math.min(W - 1, Math.max(0, Math.floor((x - g.x0) / C))); }; var cy = function (y) { return Math.min(H - 1, Math.max(0, Math.floor((y - g.y0) / C))); }; var r = p.dot.getBoundingClientRect(), holeX = r.left + r.width / 2, holeY = r.top + r.height / 2; var goals = [{ x: r.right + 4, y: holeY, dir: 2, pen: 0 }, { x: r.left - 4, y: holeY, dir: 0, pen: 0 }, { x: holeX, y: r.top - 4, dir: 1, pen: BOND_VERT_PEN, vert: true }, { x: holeX, y: r.bottom + 4, dir: 3, pen: BOND_VERT_PEN, vert: true }]; var room = Math.max(12, Math.min(r.width, r.height) / 2); goals = goals.filter(function (o) { if (o.vert) return true; var out = o.dir === 2 ? o.x + room : o.x - room; return !bondSegHits([o.x, o.y], [out, o.y], p.dot, g); }); goals.forEach(function (o) { var gx = o.dir === 2 ? Math.min(W - 1, cx(r.right + 2) + 1) : (o.dir === 0 ? Math.max(0, cx(r.left - 2) - 1) : cx(o.x)), gy = o.dir === 1 ? Math.max(0, cy(r.top - 2) - 1) : (o.dir === 3 ? Math.min(H - 1, cy(r.bottom + 2) + 1) : cy(o.y)); o.state = (gy * W + gx) * 4 + o.dir; }); var dist = new Float64Array(N).fill(Infinity), prev = new Int32Array(N).fill(-1), heap = []; var st0 = (cy(p.y) * W + cx(p.x)) * 4 + p.dir; dist[st0] = 0; bondHeapPush(heap, 0, st0); var goal = null, goalState = -1, best = Infinity; while (heap.length) { var it = bondHeapPop(heap), c = it[0], st = it[1]; if (c >= best) break; if (c > dist[st]) continue; for (var gi = 0; gi < goals.length; gi++) { if (goals[gi].state === st && c + goals[gi].pen < best) { best = c + goals[gi].pen; goal = goals[gi]; goalState = st; } } var cell = st >> 2, dir = st & 3, x = cell % W, y = (cell / W) | 0, near = false; for (var k = 1; k <= 2; k++) { var ax = x + DX[dir] * k, ay = y + DY[dir] * k; if (ax >= 0 && ay >= 0 && ax < W && ay < H && g.hole[ay * W + ax] !== -1) { near = true; } } for (var nd = 0; nd < 4; nd++) { if (nd === ((dir + 2) & 3)) continue; var nx = x + DX[nd], ny = y + DY[nd]; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; var nc = ny * W + nx; var bd = g.band[nc], along = (bd === 1 && (nd === 0 || nd === 2)) || (bd === 2 && (nd === 1 || nd === 3)); var cost = 1 + (g.hole[nc] !== -1 ? 40 : 0) + (along ? 40 : 0) + (nd !== dir ? (near ? 1 : 14) : 0) + (g.used[nc] ? 6 : 0); var ns = nc * 4 + nd; if (c + cost < dist[ns]) { dist[ns] = c + cost; prev[ns] = st; bondHeapPush(heap, c + cost, ns); } } } if (!goal) return null; var cells = []; for (var s2 = goalState; s2 !== -1; s2 = prev[s2]) { cells.push(s2 >> 2); } cells.reverse(); cells.forEach(function (c2) { g.used[c2] = 1; }); var pts = [[p.x, p.y]]; for (var i = 1; i < cells.length - 1; i++) { if (cells[i] - cells[i - 1] !== cells[i + 1] - cells[i]) { pts.push([g.x0 + (cells[i] % W + 0.5) * C, g.y0 + (((cells[i] / W) | 0) + 0.5) * C]); } } pts.push([goal.x, goal.y]); if (pts.length > 2) { pts[1][1] = p.y; if (goal.vert) { pts[pts.length - 2][0] = goal.x; } else { pts[pts.length - 2][1] = goal.y; } } else if (goal.vert) { pts.splice(1, 0, [goal.x, p.y]); } else if (p.y !== goal.y) { var mx = (p.x + goal.x) / 2; pts.splice(1, 0, [mx, p.y], [mx, goal.y]); } pts = bondLinkSimplify(pts, p.dot, g, goal.vert); for (var j = pts.length - 2; j > 0; j--) { var u = pts[j - 1], v = pts[j], w2 = pts[j + 1]; if ((u[0] === v[0] && v[0] === w2[0]) || (u[1] === v[1] && v[1] === w2[1])) { pts.splice(j, 1); } } return { pts: pts, end: [goal.x, goal.y] }; }
function bondSegHits(a, b, dest, g) { var xa = Math.min(a[0], b[0]), xb = Math.max(a[0], b[0]), ya = Math.min(a[1], b[1]), yb = Math.max(a[1], b[1]), horiz = a[1] === b[1]; for (var k = 0; k < g.dots.length; k++) { var r = g.rects[k]; if (xb >= r.left - 1 && xa <= r.right + 1 && yb >= r.top - 1 && ya <= r.bottom + 1) return true; } for (var n = 0; n < g.bands.length; n++) { var q = g.bands[n]; if (q.horiz === horiz && xb >= q.left - 3 && xa <= q.right + 3 && yb >= q.top - 3 && ya <= q.bottom + 3) return true; } return false; }
// 曲がり角を減らす: 遠くの点から順に、穴(行き先の穴も)にも成型方向の帯に沿う所にも当たらずに、直線か L 字で繋げるなら、間の曲がり角を無くす。札から出る線(最初)は水平、穴に入る線(最後)は着く向き(横 / 縦)のまま。最後に、同じ直線上の余分な点(行ってすぐ戻る所)を消す
function bondLinkSimplify(pts, dest, g, vert) { var out = [pts[0]], i = 0; while (i < pts.length - 1) { var done = false; for (var k = pts.length - 1; k > i + 1 && !done; k--) { var a = pts[i], b = pts[k], last = k === pts.length - 1; if (a[0] === b[0] || a[1] === b[1]) { var horiz = a[1] === b[1]; if ((i !== 0 || horiz) && (!last || horiz !== !!vert) && !bondSegHits(a, b, dest, g)) { out.push(b); i = k; done = true; } continue; } var c1 = [b[0], a[1]], c2 = [a[0], b[1]]; if ((!last || vert) && !bondSegHits(a, c1, dest, g) && !bondSegHits(c1, b, dest, g)) { out.push(c1, b); i = k; done = true; } else if (i !== 0 && (!last || !vert) && !bondSegHits(a, c2, dest, g) && !bondSegHits(c2, b, dest, g)) { out.push(c2, b); i = k; done = true; } } if (!done) { out.push(pts[i + 1]); i++; } } return out; }
function drawBondLinks() { var ps = bondLinkPairs(); if (!ps.length) return; var g = bondLinkGrid(ps), s = ''; ps.forEach(function (p, i) { var col = BOND_LINK_COLORS[i % BOND_LINK_COLORS.length], rt = bondLinkRoute(g, p); if (!rt) return; var d = 'M' + rt.pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' L'); s += "<path d='" + d + "' fill='none' stroke='#000' stroke-width='3' stroke-linejoin='round' stroke-linecap='round' opacity='.65'/><path class='flow' d='" + d + "' fill='none' stroke='" + col + "' stroke-width='1.25' stroke-linejoin='round' stroke-linecap='round'/>"; [[p.x, p.y], rt.end].forEach(function (e) { s += "<circle cx='" + e[0] + "' cy='" + e[1] + "' r='2.5' fill='" + col + "' stroke='#000' stroke-width='1'/>"; }); }); var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'bondLinks'); svg.innerHTML = s; document.body.appendChild(svg); } window.addEventListener('load', function () { setTimeout(drawBondLinks, 300); });
// 端末番号から配索経路の札(.box)を探す。同じ座標に重なった端末(例 18・129・128)は 1 つの札にまとめられ、id は先頭の番号(18tag)なので、id で見つからない時は data-values の中から探す。pin が true で、札の文字が切り替わる札なら、その端末番号で止める(html(40) の切り替えが data-pin を見る)
function findTerminalTag(n, pin) { n = String(n); var el = document.getElementById(n + 'tag'); if (!el) { var boxes = document.getElementsByClassName('box'); for (var i = 0; i < boxes.length && !el; i++) { if ((boxes[i].getAttribute('data-values') || '').split(',').indexOf(n) !== -1) el = boxes[i]; } } if (el && pin && (el.getAttribute('data-values') || '').indexOf(',') !== -1 && !el.hasAttribute('data-pin')) { el.setAttribute('data-pin', n); var sp = el.querySelector('span'); if (sp) sp.textContent = n; } return el; }
// 写真(.png)も略図(.emf)も無い端末(画像が作れず data-aspect-ratio が 0)は、本来ハメ図が出る場所(端末番号.html の boxTerminal、構成番号.html・端末番号-.html の bottomImage)に、画像が無い事を書いた枠を出す
function showNoImageNotice() { var th = (document.querySelector('table') || {}).offsetHeight || 0; var els = document.querySelectorAll('.boxTerminal, .bottomImage'); for (var i = 0; i < els.length; i++) { var el = els[i]; if (parseFloat(el.getAttribute('data-aspect-ratio')) > 0) continue; var isTerm = el.classList.contains('boxTerminal'); var m = (el.getAttribute('data-src') || '').match(/([^\/]+)_1\.png$/); var r = el.getBoundingClientRect(), pos = el.getAttribute('data-position'), cx, cy;
        if (isTerm) { cx = window.innerWidth / 2; cy = th + (window.innerHeight - th) / 2; } else { cy = r.height > 0 ? r.top + r.height / 2 : window.innerHeight * 0.85; cx = r.width > 0 ? r.left + r.width / 2 : (pos === 'left' ? window.innerWidth * 0.25 : (pos === 'right' ? window.innerWidth * 0.75 : r.left)); }
        var n = document.createElement('div'); n.className = 'noImageNotice'; n.style.cssText = 'position:absolute;z-index:30;transform:translate(-50%,-50%);padding:.6em 1.2em;border:2px solid #FE4951;border-radius:6px;background:rgba(0,0,0,.75);color:#fff;font-weight:bold;text-align:center;white-space:nowrap;pointer-events:none;font-size:' + (isTerm ? '2vw' : '1.1vw') + ';';
        n.innerHTML = '端末 ' + (m ? m[1] : '') + ' の画像がありません<br><span style="font-size:.7em;font-weight:normal;">(写真・略図とも見つかりません)</span>'; document.body.appendChild(n); var hw = n.offsetWidth / 2; n.style.left = (Math.min(Math.max(cx, hw + 4), window.innerWidth - hw - 4) + window.scrollX) + 'px'; n.style.top = (cy + window.scrollY) + 'px'; } } window.addEventListener('load', function () { setTimeout(showNoImageNotice, 300); });
// 構成番号・端末番号のページからサブ一覧(index.html)へ移る時に付ける ?from=サブ番号(ヘッダーの headerSubBench)。サブ一覧はそのサブのタイルの枠の色を変える
function subIndexQuery() { var b = document.querySelector('.headerSubBench'); var s = b ? b.textContent.trim() : ''; return s ? '?from=' + encodeURIComponent(s) : ''; }
// ===== 生産の進捗(作業者向け。この製品の、この端末の中だけ。localStorage の ssc_progress_製品フォルダ名) =====
// 製品品番一覧でネームの QR を読む → その製品のサブ一覧へ移って 1 本(シリアル)を始める(ほかのページでネームを読んだ時は始めない)。構成番号のページを開く(エフを読む)→ そのサブが作業中、前のサブは完了。end を読む → 1 本終わり(記録を消してサブ一覧へ)
// ヘッダーのすぐ下(1px あけて)に高さ 4px の帯を、全部のサブの数(SSC_SUB_COUNT)で区切って出し、手を付けたサブの数だけ左から白で埋める
var SSC_SUB_COUNT = 34;
function sscProgressFolder() { var p = location.pathname.split('/'); return decodeURIComponent(p[p.length - 2] || ''); }
function sscProgressLoad() { try { return JSON.parse(localStorage.getItem('ssc_progress_' + sscProgressFolder())); } catch (e) { return null; } }
function sscProgressSave(st) { try { if (st) localStorage.setItem('ssc_progress_' + sscProgressFolder(), JSON.stringify(st)); else localStorage.removeItem('ssc_progress_' + sscProgressFolder()); } catch (e) {} }
// 入力欄で end を読んだ時は 1 本終わり。ネームを読んだ時は始めずに知らせる(ネームは製品品番一覧で読む)。end・ネームの時は true を返す(checkText はフォームを送らない)
function sscProgressCommand(s) { var v = String(s).trim(); if (v.toLowerCase() === 'end') { sscProgressSave(null); window.location.href = './index.html'; return true; }
    if (!sscProgressParseName(v)) return false; document.myform.txtb.value = ''; alert('ネームの QR は製品品番一覧で読んでください'); return true; }
// ネームを分ける: 製品品番(10) 空白 設変(3) 生産拠点(2) 年月日(5。年は下 1 桁。例 60915) 連番(5)。ネームの形でなければ null
function sscProgressParseName(v) { var m = String(v).trim().match(/^([A-Z0-9]{10})\s+(\d{3})([A-Z0-9]{2})(\d)(\d{2})(\d{2})(\d{5})$/i); if (!m) return null;
    var y = new Date().getFullYear(), year = y - (y % 10) + parseInt(m[4], 10); if (year > y) year -= 10;
    return { product: m[1].toUpperCase(), design: m[2], site: m[3].toUpperCase(), date: year + '/' + m[5] + '/' + m[6], serial: m[7] }; }
// 製品品番一覧でネームを読んで移って来た時(ssc_pending_name)だけ、そのネームで 1 本を始める。製品品番・設変がこのフォルダと違う時は知らせて始めない
function sscProgressStart(v) { var n = sscProgressParseName(v); if (!n) return;
    if (sscProgressFolder().toUpperCase().indexOf(n.product + '_' + n.design) !== 0) { alert('ネームの製品品番 ' + n.product + ' ' + n.design + ' は、この製品(' + sscProgressFolder() + ')ではありません'); return; }
    var st = sscProgressLoad(); if (!st || st.serial !== n.serial) sscProgressSave({ serial: n.serial, date: n.date, site: n.site, start: Date.now(), cur: '', done: [] }); }
// 構成番号のページ(data-current-composition がある)を開いた時: このサブを作業中にして、前のサブを完了にする(ネームを読む前は数えない)
function sscProgressPage() { var st = sscProgressLoad(), b = document.querySelector('.headerSubBench'); if (!st || !b || !document.querySelector('[data-current-composition]')) return; var sub = b.textContent.trim(); if (!sub || st.cur === sub) return;
    if (st.cur && st.done.indexOf(st.cur) === -1) st.done.push(st.cur); st.cur = sub; sscProgressSave(st); }
function sscProgressDraw() { var t = document.querySelector('table') || document.querySelector('header'); if (!t || SSC_SUB_COUNT <= 0) return; var old = document.getElementById('sscProgressBar'); if (old) old.parentNode.removeChild(old);
    var st = sscProgressLoad(), n = st ? st.done.length : 0, bar = document.createElement('div'); bar.id = 'sscProgressBar';
    bar.style.cssText = 'position:fixed;left:0;right:0;top:' + (t.getBoundingClientRect().bottom + 1) + 'px;height:4px;z-index:1500;display:flex;gap:2px;padding:0 2px;pointer-events:none;background:#0b0b0d';
    for (var i = 0; i < SSC_SUB_COUNT; i++) { var g = document.createElement('div'); g.style.cssText = 'flex:1;border-radius:2px;background:' + (i < n ? '#FFF' : 'rgba(255, 255, 255, .28)'); bar.appendChild(g); } document.body.appendChild(bar); }
function sscProgressPending() { var q = null; try { q = localStorage.getItem('ssc_pending_name'); localStorage.removeItem('ssc_pending_name'); } catch (e) {} if (q) sscProgressStart(q); }
// サブ一覧(ヘッダーが <header> のページ)のヘッダーの項目の先頭に、シリアルと日付を出す。始まっていない時は「ネーム未読み」
function sscProgressSerial() { var info = document.querySelector('header .info'); if (!info) return; var st = sscProgressLoad(), el = document.getElementById('sscSerial'); if (!el) { el = document.createElement('span'); el.id = 'sscSerial'; el.style.display = 'contents'; info.insertBefore(el, info.firstChild); }
    el.innerHTML = st ? '<span class="i"><span class="k">シリアル</span><b style="font-size:1.25em;letter-spacing:.06em;">' + st.serial + '</b></span> <span class="i"><span class="k">日付</span>' + (st.date || '') + '</span>' : '<span class="i" style="opacity:.6;"><span class="k">シリアル</span>ネーム未読み</span>'; }
// サブ一覧(タイルに data-sub がある)で、完了したサブのタイルの文字を薄くする(サブの順番には関係なく、完了したサブ番号の一覧で照らし合わせる)
function sscProgressTiles() { var st = sscProgressLoad(), tiles = document.querySelectorAll('.sub[data-sub]'); if (!tiles.length) return;
    if (!document.getElementById('sscDoneStyle')) { var css = document.createElement('style'); css.id = 'sscDoneStyle'; css.textContent = '.sub.sscDone { color: rgba(255, 255, 255, .35); }'; document.head.appendChild(css); }
    for (var i = 0; i < tiles.length; i++) { var done = !!st && st.done.indexOf(tiles[i].getAttribute('data-sub')) !== -1; tiles[i].classList.toggle('sscDone', done); } }
window.addEventListener('load', function () { sscProgressPending(); sscProgressPage(); sscProgressSerial(); sscProgressTiles(); setTimeout(sscProgressDraw, 400); });
// 経路の上の写真の箱(imageBox)で、今の番の画像が無い時(data-src が空か、縦横比が 0。U フォーク・写真も略図も無い端末)は、写真の代わりに「画像なし」の枠を出す(端末番号.html・下の画像の showNoImageNotice と同じ考え方)
function imageBoxNoImage(imageBox, idx) { var srcs = (imageBox.getAttribute('data-src') || '').split(','), ars = (imageBox.getAttribute('data-aspect-ratio') || '').split(','), i = idx || 0; var none = !srcs[i] || !(parseFloat(ars[i]) > 0);
    var tag = document.getElementById(imageBox.getAttribute('data-tag') || ''), names = tag ? (tag.getAttribute('data-values') || '').split(',') : [], n = imageBox.querySelector('.imageBoxNoImage'), photo = imageBox.querySelector('.imageBoxPhoto'); if (photo) photo.style.visibility = none ? 'hidden' : '';
    if (!none) { if (n) n.style.display = 'none'; return; } if (!n) { n = document.createElement('div'); n.className = 'imageBoxNoImage'; n.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;box-sizing:border-box;border:1px solid #fff;border-radius:4px;background:#FE4951;color:#fff;font-weight:bold;font-size:.6vw;line-height:1.2;z-index:2;pointer-events:none;'; imageBox.appendChild(n); } n.innerHTML = (names[i] || '') + '<br>画像なし'; n.style.display = 'flex'; }
// 構成番号のページ: 配索経路と下の左右のハメ図の間に、左右のハメ図の端末番号の札を出す(端末番号-.html の tag2 と同じ札。押すとその端末番号.html へ)
// 札の上端は下のハメ図の帯(画面の下 30%)の上端。x は配索経路のその端末の札と同じ(左右の札が重なる時だけ 2 つ目をずらす)
// 札の高さに、点滅している電線(.blinkWire)の一番左から一番右まで、同じ色で太さ 2/3(縞の線はその 1.4 倍)の横線を引く(点滅しない)
// 札と配索経路の札は縦の線で繋ぐ。色は電線の地の色(点滅している電線は太い順に 縁・地・縞 の線を重ねていて、黒い電線の縁は白なので 2 番目に太い線の色)
// 端末番号はハメ図の画像(./img/端末番号_1.png)から取る。画像が無い時は .term の順(1 つ目 = 左、2 つ目 = 右)
function placeCompositionTerminalTags() { if (!document.querySelector('.bottomImage[data-current-composition]')) return; var terms = document.querySelectorAll('span.term'), list = [];
    document.querySelectorAll('.bottomImage').forEach(function (bi) { var pos = bi.getAttribute('data-position'); if (pos !== 'left' && pos !== 'right') return; var m = (bi.getAttribute('data-src') || '').match(/(?:^|\/)([^\/_]+)_\d+\.[a-z]+$/i), n = m ? m[1] : '';
        if (!n) { var t = terms[pos === 'left' ? 0 : 1]; n = t ? t.getAttribute('data-terminal') : ''; } if (n) list.push(n); }); if (list.length === 0) return;
    var probe = document.createElement('div'); probe.className = 'box'; probe.innerHTML = '<span>0</span>'; probe.style.visibility = 'hidden'; document.body.appendChild(probe); var tagH = probe.getBoundingClientRect().height; probe.parentNode.removeChild(probe); var rowY = (compTermRowHeight() > 0 ? window.innerHeight * 0.7 - compTermRowHeight() / 2 : window.innerHeight * 0.7 + tagH / 2) + window.scrollY;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'compTermTagSvg'); svg.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:' + document.documentElement.scrollHeight + 'px;pointer-events:none;z-index:5;overflow:visible;';
    var minX = Infinity, maxX = -Infinity, layers = [], seen = {}; document.querySelectorAll('line.blinkWire').forEach(function (ln) { var r = ln.getBoundingClientRect(); if (r.width === 0 && r.height === 0) return; if (r.left < minX) minX = r.left; if (r.right > maxX) maxX = r.right;
        var key = ln.getAttribute('stroke') + '|' + ln.getAttribute('stroke-width'); if (!seen[key]) { seen[key] = true; layers.push({ stroke: ln.getAttribute('stroke'), width: parseFloat(ln.getAttribute('stroke-width')), dash: ln.getAttribute('stroke-dasharray') }); } });
    var tags = []; list.forEach(function (n) { var routeTag = findTerminalTag(n, false), rr = routeTag ? routeTag.getBoundingClientRect() : null, tag = document.createElement('div'); tag.className = 'box compTermTag'; tag.innerHTML = '<span></span>'; tag.firstChild.textContent = n;
        tag.style.backgroundColor = routeTag ? getComputedStyle(routeTag).backgroundColor : '#FFF'; tag.style.cursor = 'pointer'; tag.addEventListener('click', function () { navigateOrNotFound(n + '.html'); }); document.body.appendChild(tag);
        var w = tag.offsetWidth, cx = rr ? rr.left + rr.width / 2 + window.scrollX : window.innerWidth * (tags.length === 0 ? 1 : 2) / 3, left = cx - w / 2;
        tags.forEach(function (o) { if (left < o.right && left + w > o.left) left = (cx >= (o.left + o.right) / 2) ? o.right + 2 : o.left - w - 2; }); tag.style.left = left + 'px'; tag.style.top = (rowY - tagH / 2) + 'px';
        tags.push({ left: left, right: left + w, cx: left + w / 2, rr: rr }); if (left + w / 2 < minX) minX = left + w / 2; if (left + w / 2 > maxX) maxX = left + w / 2; });
    var byWidth = layers.slice().sort(function (a, b) { return b.width - a.width; }), stripeW = layers.length < 2 ? -1 : byWidth[byWidth.length - 1].width, baseColor = byWidth.length > 0 ? (byWidth[1] || byWidth[0]).stroke : '#FE5151';
    if (minX < maxX) layers.forEach(function (ly) { var line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.setAttribute('class', 'line'); line.setAttribute('x1', minX); line.setAttribute('y1', rowY); line.setAttribute('x2', maxX); line.setAttribute('y2', rowY);
        line.setAttribute('stroke', ly.stroke); line.setAttribute('stroke-width', ly.width * 2 / 3 * (ly.width === stripeW ? 1.4 : 1)); if (ly.dash) line.setAttribute('stroke-dasharray', ly.dash); svg.appendChild(line); });
    // 縦の線は一番後ろ(配索経路の線より後ろ)に描く。電線の地の色が黒い時は、白い縁(太さ 3 の白い線の上に地の色の線)を付ける
    var back = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); back.setAttribute('class', 'compTermTagSvg'); back.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:' + document.documentElement.scrollHeight + 'px;pointer-events:none;overflow:visible;';
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(baseColor.length === 4 ? baseColor.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3') : baseColor), isDark = m ? (parseInt(m[1], 16) * 0.299 + parseInt(m[2], 16) * 0.587 + parseInt(m[3], 16) * 0.114) < 40 : false;
    tags.forEach(function (t) { if (!t.rr) return; (isDark ? [['#FFF', 3], [baseColor, 1]] : [[baseColor, 1]]).forEach(function (ly) { var line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.setAttribute('x1', t.cx); line.setAttribute('y1', rowY); line.setAttribute('x2', t.rr.left + t.rr.width / 2 + window.scrollX); line.setAttribute('y2', t.rr.top + t.rr.height / 2 + window.scrollY);
        line.setAttribute('stroke', ly[0]); line.setAttribute('stroke-width', ly[1]); back.appendChild(line); }); }); document.body.insertBefore(back, document.body.firstChild); document.body.appendChild(svg); }
window.addEventListener('load', function () { setTimeout(placeCompositionTerminalTags, 50); });
// 構成番号のページ: 配索経路と下のハメ図の間の、端末番号の札の行の高さ(px)。札の高さ + 上下 1px。構成番号のページ以外は 0
function compTermRowHeight() { if (compTermRowHeight.h !== undefined) return compTermRowHeight.h; var h = 0; if (document.querySelector('.bottomImage[data-current-composition]')) { var p = document.createElement('div'); p.className = 'box'; p.innerHTML = '<span>0</span>'; p.style.visibility = 'hidden'; document.body.appendChild(p); h = p.getBoundingClientRect().height + 2; p.parentNode.removeChild(p); } compTermRowHeight.h = h; return h; }
// 配索経路の縦の倍率。配索経路(data-y は 0?69%)の下端を、下のハメ図の帯(画面の下 30%)の上端から札の行の高さだけ上にする。札の行が無いページは 1(今まで通り)
function routeScaleY(tableHeight) { var band = compTermRowHeight(); if (!band) return 1; var h = window.innerHeight - tableHeight; return Math.max(0.5, (window.innerHeight * 0.7 - band - tableHeight) / (h * 0.69)); }
