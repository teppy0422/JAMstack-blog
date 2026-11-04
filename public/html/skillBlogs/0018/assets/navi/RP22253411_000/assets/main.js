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
				var index = 0, pin0 = box.getAttribute('data-pin'); if (pin0 !== null && values.indexOf(pin0) !== -1) index = values.indexOf(pin0);
				var slideText = document.createElement('span');
				slideText.textContent = values[index];
				box.style.backgroundColor = colors[index];
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
				box.appendChild(progressContainer); if (pin0 !== null && values.indexOf(pin0) !== -1) progressContainer.style.display = 'none';
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
	var bottomImages = document.getElementsByClassName('bottomImage'); var biWidthOverride = {}; (function () { if (/\/\d+-\.html$/.test(window.location.pathname)) return; var HOLE_MIN_PX = 50; var candidates = []; for (var ci = 0; ci < bottomImages.length; ci++) { var el = bottomImages[ci]; var ar = parseFloat(el.getAttribute('data-aspect-ratio')); var raw = el.nextElementSibling; var pts = []; if (raw && raw.tagName === 'SCRIPT' && raw.classList.contains('blink-coords-data')) { try { pts = JSON.parse(raw.textContent); } catch (e) { pts = []; } } if (!pts.length) continue; var maxWidth0 = window.innerWidth * (pts[0].showText === false ? 0.25 : (bottomImages.length >= 3 ? 1 / 3 : 0.5)); var maxHeight = window.innerHeight * bottomBandRatio(); if (pts[0].showText !== false) { var plan0 = planBottomCrop(pts, ar, maxWidth0, maxHeight); ar = plan0.ar; pts = plan0.pts; } var w0, h0, heightConstrained, ptsForMeasure = pts; if (pts[0].showText === false) { ptsForMeasure = bonRestack(pts); var maxXPercent = 100, maxYPercent = 100; ptsForMeasure.forEach(function (p) { var pxEnd = (p.x || 0) + (p.w || 0); var pyEnd = (p.y || 0) + (p.h || 0); if (pxEnd > maxXPercent) maxXPercent = pxEnd; if (pyEnd > maxYPercent) maxYPercent = pyEnd; }); var hByWidth = (maxWidth0 * 100) / (ar * maxXPercent); var hByHeight = (maxHeight * 100) / maxYPercent; h0 = Math.min(hByWidth, hByHeight); w0 = h0 * ar; heightConstrained = hByHeight < hByWidth; } else { w0 = maxWidth0; h0 = w0 / ar; heightConstrained = false;if (h0 > maxHeight) { h0 = maxHeight; w0 = h0 * ar; heightConstrained = true; } } var minHolePx; if (pts[0].showText === false) { var wbMinX = Infinity, wbMinY = Infinity, wbMaxX = -Infinity, wbMaxY = -Infinity; ptsForMeasure.forEach(function (p) { if (p.x < wbMinX) wbMinX = p.x; if (p.y < wbMinY) wbMinY = p.y; if (p.x + p.w > wbMaxX) wbMaxX = p.x + p.w; if (p.y + p.h > wbMaxY) wbMaxY = p.y + p.h; }); minHolePx = Math.min(((wbMaxX - wbMinX) / 100) * w0, ((wbMaxY - wbMinY) / 100) * h0); } else { minHolePx = Infinity; ptsForMeasure.forEach(function (p) { var m2 = Math.min((p.w / 100) * w0, (p.h / 100) * h0); if (m2 < minHolePx) minHolePx = m2; }); } candidates.push({ index: ci, heightConstrained: heightConstrained, minHolePx: minHolePx, maxWidth0: maxWidth0, actualWidth: w0, ar: ar }); } if (candidates.length === 3 && document.querySelector('.bottomImage[data-bottom-mid]')) { var b3Gap = window.innerWidth * 0.01, b3Fixed = 0, b3Flex = []; candidates.forEach(function (c) { if (c.heightConstrained) b3Fixed += c.actualWidth; else b3Flex.push(c); }); if (!b3Flex.length) return; var b3Each = (window.innerWidth - b3Fixed - 2 * b3Gap) / b3Flex.length; if (b3Each > b3Flex[0].maxWidth0) b3Flex.forEach(function (c) { biWidthOverride[c.index] = b3Each; }); return; } if (candidates.length !== 2) return;if (jointColumnWidth()) { jointAllocateWidths(candidates, biWidthOverride, HOLE_MIN_PX); return; }[[candidates[0], candidates[1]], [candidates[1], candidates[0]]].forEach(function (pair) { var donor = pair[0], recipient = pair[1]; if (recipient.heightConstrained) return; if (biWidthOverride[donor.index] !== undefined || biWidthOverride[recipient.index] !== undefined) return; var freed = 0, donorNewWidth = donor.maxWidth0; if (donor.heightConstrained) { freed = donor.maxWidth0 - donor.actualWidth; } else if (donor.minHolePx > HOLE_MIN_PX) { var shrinkRatio = HOLE_MIN_PX / donor.minHolePx; donorNewWidth = donor.maxWidth0 * shrinkRatio; freed = donor.maxWidth0 - donorNewWidth; } if (freed <= 0) return; biWidthOverride[donor.index] = donorNewWidth; biWidthOverride[recipient.index] = recipient.maxWidth0 + freed; }); })();
	for (var m = 0; m < bottomImages.length; m++) {
		var bottomImage = bottomImages[m];
		var src = bottomImage.getAttribute('data-src');
		var aspectRatio = parseFloat(bottomImage.getAttribute('data-aspect-ratio'));
		var position = bottomImage.getAttribute('data-position');
		var blinkCoords = bottomImage.getAttribute('data-blink-coords');
		var terminalTag = bottomImage.getAttribute('data-terminal-tag');
		var bottomImageJsonRaw = bottomImage.nextElementSibling; var bottomImagePoints = []; if (bottomImageJsonRaw && bottomImageJsonRaw.tagName === 'SCRIPT' && bottomImageJsonRaw.classList.contains('blink-coords-data')) { try { bottomImagePoints = JSON.parse(bottomImageJsonRaw.textContent); } catch (e) { bottomImagePoints = []; } }
		var isRoutePage = /\/\d+-\.html$/.test(window.location.pathname); var isBiWireInfo = bottomImagePoints.length > 0 && bottomImagePoints[0].showText === false; var showWireList = isBiWireInfo && isRoutePage; var showWireListBelow = isBiWireInfo && !isRoutePage; var biHeaderRowRatio = 0.6, biListRowHeight = 0, biMaxXPercent = 100, biMaxYPercent = 100;
		if (isBiWireInfo) {
		bonRestack(bottomImagePoints).forEach(function (q, wi) { var p = bottomImagePoints[wi]; p.x = q.x; p.y = q.y; p.w = q.w; p.h = q.h; }); for (var biI = 0; biI < bottomImagePoints.length; biI++) { var biPxEnd = (bottomImagePoints[biI].x || 0) + (bottomImagePoints[biI].w || 0); var biPyEnd = (bottomImagePoints[biI].y || 0) + (bottomImagePoints[biI].h || 0); if (biPxEnd > biMaxXPercent) biMaxXPercent = biPxEnd; if (biPyEnd > biMaxYPercent) biMaxYPercent = biPyEnd; } }
		var maxWidth = biWidthOverride[m] !== undefined ? biWidthOverride[m] : window.innerWidth * (showWireList ? 0.3 : (showWireListBelow ? 0.25 : (isRoutePage || bottomImages.length === 1 ? 1 : (bottomImages.length >= 3 ? 1 / 3 : 0.5)))); var maxHeight = window.innerHeight * bottomBandRatio(); var width, height; var biPlatingH = (!isBiWireInfo && hasPlating(bottomImagePoints)) ? platingLabelHeight() : 0; var jointColW = (!isBiWireInfo && !showWireList && !showWireListBelow) ? jointColumnWidth() : 0; if (jointColW && biWidthOverride[m] === undefined) { maxWidth = (window.innerWidth - jointColW) / 2; } var jointSoloW = (!isBiWireInfo && !showWireList && !showWireListBelow && bottomImages.length === 1 && jointListWidth()) ? jointListWidth() + 2 * 14 : 0; if (jointSoloW && biWidthOverride[m] === undefined) { maxWidth = window.innerWidth - jointSoloW; }
		if (!isBiWireInfo) { var cropRes = cropBottomImageForText(bottomImage, bottomImageJsonRaw, bottomImagePoints, aspectRatio, maxWidth, maxHeight - biPlatingH); aspectRatio = cropRes.ar; bottomImagePoints = cropRes.pts; } var rotated = false; if (showWireListBelow) { if (aspectRatio < 1) { rotated = true; height = (window.innerWidth * 0.15 * 100) / biMaxYPercent; width = height * aspectRatio; if ((width * biMaxXPercent / 100) > maxHeight) { width = (maxHeight * 100) / biMaxXPercent; height = width / aspectRatio; } } else { width = (window.innerWidth * 0.15 * 100) / biMaxXPercent; height = width / aspectRatio; if ((height * biMaxYPercent / 100) > maxHeight) { height = (maxHeight * 100) / biMaxYPercent; width = height * aspectRatio; } } var bonCap = bonListBelowCap(maxHeight, bottomImagePoints.length), bonVis = rotated ? width * biMaxXPercent / 100 : height * biMaxYPercent / 100; if (bonVis > bonCap) { width *= bonCap / bonVis; height *= bonCap / bonVis; } } else if (isBiWireInfo) { height = Math.min((maxWidth * 100) / (aspectRatio * biMaxXPercent), (maxHeight * 100) / biMaxYPercent); width = height * aspectRatio; } else { width = maxWidth; height = width / aspectRatio; if (height > maxHeight - biPlatingH) { height = maxHeight - biPlatingH; width = height * aspectRatio; } } var biVisualW = isBiWireInfo ? (rotated ? (height * biMaxYPercent / 100) : (width * biMaxXPercent / 100)) : width; var biVisualH = isBiWireInfo ? (rotated ? (width * biMaxXPercent / 100) : (height * biMaxYPercent / 100)) : height;
		if (isBiWireInfo) { var biRowsPerColumn = 5; var biRowHeightByHeight = maxHeight / (biRowsPerColumn + biHeaderRowRatio); var biNumColumns = Math.ceil(bottomImagePoints.length / biRowsPerColumn); var biAvailableWidth = window.innerWidth - (width * biMaxXPercent / 100); var biRowHeightByWidth = ((biAvailableWidth / biNumColumns) - 56) / (0.42 * 13.88); biListRowHeight = Math.min(biRowHeightByHeight, biRowHeightByWidth);
		bottomImage.style.width = biVisualW + 'px'; bottomImage.style.height = biVisualH + 'px'; var photoLayer = document.createElement('div'); photoLayer.className = 'bottomImagePhoto'; photoLayer.style.position = 'absolute'; photoLayer.style.left = '0'; photoLayer.style.top = '0'; photoLayer.style.width = width + 'px'; photoLayer.style.height = height + 'px'; photoLayer.style.zIndex = '1'; var biContentParent = bottomImage; if (rotated) { var rotWrap = document.createElement('div'); rotWrap.className = 'bottomImageRotWrap'; rotWrap.style.position = 'absolute'; rotWrap.style.width = (width * biMaxXPercent / 100) + 'px'; rotWrap.style.height = (height * biMaxYPercent / 100) + 'px'; rotWrap.style.left = '50%'; rotWrap.style.top = '50%'; rotWrap.style.transformOrigin = 'center center'; rotWrap.style.transform = 'translate(-50%, -50%) rotate(-90deg)'; bottomImage.appendChild(rotWrap); biContentParent = rotWrap; }
		photoLayer.style.backgroundImage = 'url(' + src + ')'; photoLayer.style.backgroundSize = 'contain'; photoLayer.style.backgroundPosition = 'center'; photoLayer.style.backgroundRepeat = 'no-repeat'; biContentParent.appendChild(photoLayer); darkPhotoOutline(photoLayer, src); } else { bottomImage.style.backgroundImage = 'url(' + src + ')'; darkPhotoOutline(bottomImage, src); bottomImage.style.width = width + 'px'; bottomImage.style.height = height + 'px'; } if (bottomImage.getAttribute('data-rotate') === '180') { bottomImage.style.transformOrigin = 'center center'; bottomImage.style.transform = 'rotate(180deg)'; }
		var radius = width / height * 4; if (showWireListBelow) { var biOwnWidth3 = biVisualW; var wibColW = window.innerWidth * 0.25; var colLeft = position === 'right' ? (window.innerWidth - wibColW) : (position === 'left' ? 0 : window.innerWidth * parseFloat(position) / 100 - wibColW / 2); left = colLeft + (wibColW - biOwnWidth3) / 2; bottomImage.style.left = left + 'px'; bottomImage.style.right = 'auto'; } else if (showWireList) { var biOwnWidth = width * biMaxXPercent / 100; left = (maxWidth - biOwnWidth) / 2; bottomImage.style.left = left + 'px'; bottomImage.style.right = 'auto';
		} else if (position === 'left') { bottomImage.style.left = '0'; bottomImage.style.right = 'auto'; left = 0; } else if (position === 'right') { bottomImage.style.right = '0'; bottomImage.style.left = 'auto'; left = window.innerWidth - bottomImage.clientWidth; } else{
		var leftPercentage = parseFloat(position); var left = (leftPercentage / 100) * window.innerWidth; var bottomImageWidth = bottomImage.offsetWidth; left = left - (bottomImageWidth /2);
		if (left + bottomImageWidth > window.innerWidth) { left = window.innerWidth - bottomImageWidth; }else if (left < 0){ left = 0; } if (bottomImage.getAttribute('data-bottom-mid')) { var midL = 0, midR = window.innerWidth; [].forEach.call(bottomImages, function (o) { if (o === bottomImage) return; var or = o.getBoundingClientRect(), op = o.getAttribute('data-position'); if (op === 'left') midL = Math.max(midL, or.right); else if (op === 'right') midR = Math.min(midR, or.left); }); if (midR - midL >= bottomImageWidth) left = (midL + midR - bottomImageWidth) / 2; } if (jointSoloW) { left = left + bottomImageWidth / 2 > window.innerWidth / 2 ? Math.max(left, jointSoloW) : Math.min(left, window.innerWidth - jointSoloW - bottomImageWidth); } bottomImage.style.left = left + 'px'; bottomImage.style.right = 'auto'; } var biOwnHeight = isBiWireInfo ? biVisualH : height; bottomImage.style.bottom = 'auto'; bottomImage.style.top = showWireListBelow ? (window.innerHeight - maxHeight) + 'px' : ((window.innerHeight - maxHeight) + (maxHeight - biPlatingH - biOwnHeight) / 2) + 'px'; if (biPlatingH) { placePlatingLabel('b' + m, bottomImage.getBoundingClientRect()); }
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
			// 下のハメ図の帯(bottomBandRatio。初めは 30vh)を超える場合は切り取る
			var maxHeight = window.innerHeight * bottomBandRatio();
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
			// 資料などの枠の中で開いた時: 枠を操作していない時は入力先を取らない・取っても外の画面をスクロールさせない
			var inFrame = window !== window.top; if (inFrame && !document.hasFocus()) return;
			myTElements[0].focus(inFrame ? { preventScroll: true } : undefined);
		}
	}, 500);
}
// タブレット(Android等)では入力欄にフォーカスが移るたびに画面キーボードが出るため、
// inputmode='none' でキーボードを出さない(バーコードリーダーの入力はそのまま使える)。
// 入力欄を指でタップした時だけキーボードを出し、フォーカスが外れたら元に戻す。
(function () { var els = document.getElementsByClassName('myT'); for (var i = 0; i < els.length; i++) { els[i].setAttribute('inputmode', 'none'); els[i].addEventListener('pointerdown', function () { this.removeAttribute('inputmode'); }); els[i].addEventListener('blur', function () { this.setAttribute('inputmode', 'none'); }); } })();
// データ属性から位置を設定
sameHoleInsertBottom(); setPositionFromDataAttributes(); (function () { var svgs = document.querySelectorAll('svg'), greenSvg = null; svgs.forEach(function (s) { if (greenSvg) return; var lines = s.getElementsByTagName('line'); for (var i = 0; i < lines.length; i++) { if (lines[i].getAttribute('stroke') === '#00FF66') { greenSvg = s; break; } } }); if (!greenSvg) return; svgs.forEach(function (s) { if (s !== greenSvg && s.querySelector('.blinkWire') && s.parentNode === greenSvg.parentNode) greenSvg.parentNode.insertBefore(s, greenSvg); }); })();
(function () { var m = window.location.pathname.match(/(\d+)-\.html$/); if (!m) return; var target = findTerminalTag(m[1], true); if (!target) return; ['glowHaloA', 'glowHaloB'].forEach(function (cls) { var halo = document.createElement('div'); halo.className = 'currentTerminalGlow ' + cls; halo.style.left = target.style.left; halo.style.top = target.style.top; halo.style.width = target.offsetWidth + 'px'; halo.style.height = target.offsetHeight + 'px'; halo.style.color = '#FE4951'; target.parentElement.insertBefore(halo, target); }); })();
function checkText() {
    var str1 = document.myform.txtb.value; if (sscWorkerCommand(str1)) return false; if (sscProgressCommand(str1)) return false; if (sscSettingCommand(str1.trim().toLowerCase())) return false; var cmd = str1.trim().toLowerCase(); if (cmd === 'top') { localStorage.removeItem('ssc_last_page'); window.location.href = '../index.html'; return false; } if (cmd === 'index') { window.location.href = './index.html' + subIndexQuery(); return false; }
    var seihin, kosei;
    var myLen = str1.length;
    if (myLen <= 10) {
        kosei = str1;
    } else {
        seihin = str1.substr(25, 10);
        kosei = str1.substr(11, 4);
    }
    var filePath = kosei + ".html"; if (sscSameTerminalAgain(kosei)) filePath = String(kosei).trim() + "-.html";
    
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
		var termPlatingH = hasPlating(points) ? platingLabelHeight() : 0; var termPlugList = readEmptyPlugList(); var termPlugH = emptyPlugListHeight(termPlugList); var termAddonList = readAddonList(); var termAddonH = addonListHeight(termAddonList); var maxHeight = totalAvailableHeight - listHeight - termPlatingH - termPlugH - termAddonH;
		var height = Math.min((maxWidth * 100) / (aspectRatio * maxXPercent), (maxHeight * 100) / maxYPercent);
		var width = height * aspectRatio;
		boxTerminal.style.width = width + 'px';
		boxTerminal.style.height = height + 'px';
		boxTerminal.style.position = 'absolute';
		var combinedWidth = width * (maxXPercent / 100);
		var combinedHeight = height * (maxYPercent / 100);
		boxTerminal.style.left = ((maxWidth - combinedWidth) / 2) + 'px';
		boxTerminal.style.top = (tableHeight + (maxHeight - combinedHeight) / 2) + 'px';
		boxTerminal.style.transform = 'none'; if (termPlatingH) { placePlatingLabel('t' + m, boxTerminal.getBoundingClientRect()); } if (termPlugH) { var termRect = boxTerminal.getBoundingClientRect(); placeEmptyPlugList(termPlugList, termRect.left, termRect.bottom + termPlatingH + 2); } if (termAddonH) { var termRectA = boxTerminal.getBoundingClientRect(); placeAddonList(termAddonList, termRectA.left, termRectA.bottom + termPlatingH + termPlugH + 2); }
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
				var plugColorVal = pt.plugColor ? String(pt.plugColor).trim() : ''; var isPlugged = (!color || color === '#') && plugColorVal !== '' && plugColorVal !== '#' && (!composition || String(composition).trim() === ''); if (isPlugged) { blinkDiv.style.opacity = 1; blinkDiv.classList.add('blinkPlug'); blinkDiv.style.backgroundColor = plugColorVal; blinkDiv.appendChild(buildPlugAsterisk(plugColorVal, (pt.plugFontColor && pt.plugFontColor !== '#') ? pt.plugFontColor : '#000', blinkWidthPx, blinkHeightPx)); } else if (showText && (upperText || lowerText)) { blinkDiv.style.opacity = 1; blinkDiv.classList.add('blinkStripeBox'); blinkDiv.style.setProperty('--stripe-color', bgColor); var mappedFontColor = SSC_STRIPE_FONT_MAP[bgColor.toUpperCase()] || fontColor; blinkDiv.style.color = mappedFontColor; blinkDiv.style.borderColor = mappedFontColor; blinkDiv.style.fontSize = (Math.min(blinkWidthPx, blinkHeightPx) * (plating ? 0.3 : 0.35)) + 'px'; blinkDiv.style.lineHeight = plating ? '1' : '1.1'; var showTextShadow = color.toUpperCase() !== bgColor.toUpperCase(); blinkDiv.style.textShadow = showTextShadow ? buildOutlineShadow(bgColor, 0.12) : 'none'; blinkDiv.innerHTML = "<span class='rotatableText'>" + holeTextHtml(upperText, lowerText, plating) + "</span>"; fitHoleTextLater(blinkDiv); var isFirstInsert = pt.isFirstInsert === true; if (isFirstInsert) { blinkDiv.classList.add('firstInsertHole'); blinkDiv.setAttribute('data-fi-m', Math.min(blinkWidthPx, blinkHeightPx)); if (boxTerminal.getAttribute('data-rotate') === '180') blinkDiv.setAttribute('data-fi-rot', '1'); firstInsertMark(blinkDiv, Math.min(blinkWidthPx, blinkHeightPx), sscSettings.FIRST_INSERT_STYLE || DEFAULT_FIRST_INSERT_STYLE); } } else if (color.length > 1) { blinkDiv.style.opacity = 1; blinkDiv.classList.add('blinkStripeBox', 'wireColorBand'); blinkDiv.style.setProperty('--stripe-color', bgColor); blinkDiv.style.zIndex = '-1'; } else { blinkDiv.style.opacity = 0.5; }
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
var SSC_STRIPE_FONT_MAP = {"#FF0000":"#FF0000","#050505":"#FFFFFF","#FCFCFC":"#000000","#F00000":"#FFFFFF","#00BA54":"#FFFFFF","#FFFF00":"#000000","#A25900":"#FFFFFF","#006EFF":"#FFFFFF","#FFA0B1":"#000000","#BABABA":"#000000","#99FFCC":"#000000","#65E2FF":"#000000","#BA44FF":"#FFFFFF","#FF8211":"#000000","#CD9800":"#FFFFFF","#FFB366":"#000000","#646464":"#FFFFFF","#5D5D5D":"#FFFFFF","#ADADAD":"#000000","#CBCBCB":"#000000","#063406":"#FFFFFF","#FFEF8F":"#000000","#EAEA59":"#000000","#06064A":"#FFFFFF","#3F0600":"#FFFFFF","#D6B641":"#000000","#644A8D":"#FFFFFF","#DCB9FF":"#000000","#FF5A00":"#FFFFFF","#BABABA":"#000000","#FCFCFC":"#000000","#E65A00":"#FFFFFF","#81D8D0":"#FFFFFF","#BABABA":"#000000","#000000":"#FFFFFF","#000000":"#FFFFFF","#000000":"#FFFFFF"};
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
	var biPhotoSrc = imageBox.style.backgroundImage; if (biPhotoSrc && biPhotoSrc !== 'none') { var biPhoto = imageBox.querySelector('.imageBoxPhoto'); if (!biPhoto) { biPhoto = document.createElement('div'); biPhoto.className = 'imageBoxPhoto'; biPhoto.style.position = 'absolute'; biPhoto.style.left = '0'; biPhoto.style.top = '0'; biPhoto.style.width = '100%'; biPhoto.style.height = '100%'; biPhoto.style.backgroundSize = 'contain'; biPhoto.style.backgroundPosition = 'center'; biPhoto.style.backgroundRepeat = 'no-repeat'; biPhoto.style.pointerEvents = 'none'; biPhoto.style.zIndex = '1'; imageBox.insertBefore(biPhoto, imageBox.firstChild); } biPhoto.style.backgroundImage = biPhotoSrc; imageBox.style.backgroundImage = 'none'; var biPhotoUrl = /url\(["']?(.*?)["']?\)/.exec(biPhotoSrc); if (biPhotoUrl) darkPhotoOutline(biPhoto, biPhotoUrl[1]); } imageBoxNoImage(imageBox, idx); overlayDotsRef.arr.forEach(function(d) { d.remove(); });
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
			band.style.borderRadius = pt.radius + '%'; band.style.backgroundColor = color; bonBandEdge(band, color, wireColorBandWrap); band.style.setProperty('--stripe-color', bgColor); if (pt.composition) { band.style.cursor = 'pointer'; (function(comp) { band.addEventListener('click', function() { navigateOrNotFound(comp + ".html"); }); })(pt.composition); } wireColorBandWrap.appendChild(band); return;
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
		var showTextShadow = color.toUpperCase() !== bgColor.toUpperCase(); textLayer.style.textShadow = showTextShadow ? buildOutlineShadow(bgColor, 0.12) : 'none'; textLayer.innerHTML = holeTextHtml(upperText, lowerText, plating); dot.appendChild(textLayer); fitHoleTextLater(textLayer); if (flashOverlay) { dot.appendChild(flashOverlay); } if (pt.composition === currentComposition && currentGroups.length > 0 && bottomImage.getAttribute('data-joint-slot') !== '1' && !bottomImage.getAttribute('data-same-hole')) { var selfRing = document.createElement('div'); selfRing.className = 'selfHoleRing'; dot.appendChild(selfRing); }
		if (pt.isFirstInsert === true) { dot.classList.add('firstInsertHole'); dot.setAttribute('data-fi-m', Math.min(boxWidthPx, boxHeightPx)); } var feltColorVal = pt.feltColor ? String(pt.feltColor).trim() : ''; if (feltColorVal && feltColorVal !== '#') { var feltSize = Math.min(boxWidthPx, boxHeightPx) * 0.38 * 0.7; var feltDrop = document.createElement('div'); feltDrop.style.position = 'absolute'; var feltIsRotated = bottomImage.getAttribute('data-rotate') === '180'; if (feltIsRotated) { feltDrop.style.left = '0'; feltDrop.style.top = (-boxHeightPx * 0.02) + 'px'; feltDrop.style.setProperty('--feltBaseRotate', '0deg'); } else { feltDrop.style.right = '0'; feltDrop.style.bottom = (-boxHeightPx * 0.02) + 'px'; feltDrop.style.setProperty('--feltBaseRotate', '180deg'); } feltDrop.style.width = feltSize + 'px'; feltDrop.style.height = feltSize + 'px'; feltDrop.style.boxSizing = 'border-box'; feltDrop.style.background = feltColorVal; feltDrop.style.border = '1px solid ' + ((pt.feltColorBorder && pt.feltColorBorder !== '#') ? pt.feltColorBorder : '#000'); feltDrop.style.borderRadius = '50% 50% 50% 0'; feltDrop.style.transformOrigin = 'center'; feltDrop.style.animation = 'sscFeltWiggle 1s ease-in-out infinite'; feltDrop.style.pointerEvents = 'none'; feltDrop.style.zIndex = 22; dot.appendChild(feltDrop); }
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
var SSC56_SETTINGS_KEY = sscSettingsKey();
var DEFAULT_PULSE_THRESHOLD_PX = 20; var DEFAULT_STRIPE_LEVEL = 3; var DEFAULT_FIRST_INSERT_STYLE = 2; var DEFAULT_SMALL_BLINK_STYLE = 2;
function loadSscSettings() {
	var saved = {};
	try {
		saved = JSON.parse(localStorage.getItem(SSC56_SETTINGS_KEY)) || {};
	} catch (e) {
		saved = {};
	}
	return {
		PULSE_THRESHOLD_PX: typeof saved.PULSE_THRESHOLD_PX === 'number' ? saved.PULSE_THRESHOLD_PX : DEFAULT_PULSE_THRESHOLD_PX, STRIPE_LEVEL: (saved.STRIPE_LEVEL >= 1 && saved.STRIPE_LEVEL <= 5 && saved.STRIPE_LEVEL % 1 === 0) ? saved.STRIPE_LEVEL : DEFAULT_STRIPE_LEVEL, BOTTOM_CROP: saved.BOTTOM_CROP !== false, BOTTOM_BAND_LEVEL: (saved.BOTTOM_BAND_LEVEL >= 1 && saved.BOTTOM_BAND_LEVEL <= 5 && saved.BOTTOM_BAND_LEVEL % 1 === 0) ? saved.BOTTOM_BAND_LEVEL : 3, ROUTE_STYLE: (saved.ROUTE_STYLE >= 1 && saved.ROUTE_STYLE <= 5 && saved.ROUTE_STYLE % 1 === 0) ? saved.ROUTE_STYLE : 1, FIRST_INSERT_STYLE: (saved.FIRST_INSERT_STYLE >= 2 && saved.FIRST_INSERT_STYLE <= 6 && saved.FIRST_INSERT_STYLE % 1 === 0) ? saved.FIRST_INSERT_STYLE : DEFAULT_FIRST_INSERT_STYLE, SMALL_BLINK_STYLE: (saved.SMALL_BLINK_STYLE >= 1 && saved.SMALL_BLINK_STYLE <= 3 && saved.SMALL_BLINK_STYLE % 1 === 0) ? saved.SMALL_BLINK_STYLE : DEFAULT_SMALL_BLINK_STYLE, SMALL_BLINK_SYNC: saved.SMALL_BLINK_SYNC === true
	};
}
var sscSettings = loadSscSettings(); applyStripeWidth();
window.setSscSetting = function (partial) {
	var current = loadSscSettings();
	for (var key in partial) {
		if (Object.prototype.hasOwnProperty.call(current, key)) {
			current[key] = partial[key];
		}
	}
	localStorage.setItem(SSC56_SETTINGS_KEY, JSON.stringify(current)); sscSettingsPush(current);
	sscSettings = current;
	applyPulseThreshold(); applyStripeWidth(); applyRouteStyle(); applyFirstInsertStyle(); applySmallBlink();
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
	overlay.style.cssText = 'position:fixed;inset:0;background:transparent;z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
	var panel = document.createElement('div');
	panel.style.cssText = 'background:#1e1e1e;color:#fff;padding:1em 1.1em;border-radius:8px;width:min(27em,92vw);max-height:92vh;overflow-y:auto;box-sizing:border-box;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
	var title = document.createElement('div');
	title.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:1.2em;font-weight:bold;margin-bottom:0.7em;'; var titleText = document.createElement('span'); titleText.textContent = '設定'; title.appendChild(titleText);
	var qrBtn = document.createElement('button'); qrBtn.type = 'button'; qrBtn.title = 'QRコードの印刷'; qrBtn.setAttribute('aria-label', 'QRコードの印刷'); qrBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:2em;height:2em;padding:0;background:#444;border:none;border-radius:4px;cursor:pointer;'; qrBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="#fff" style="position:static;display:block;width:22px;height:22px;pointer-events:none;"><path d="M3 3h8v8H3zM5 5v4h4V5zM13 3h8v8h-8zM15 5v4h4V5zM3 13h8v8H3zM5 15v4h4v-4z" fill-rule="evenodd"/><path d="M13 13h3v3h-3zM18 13h3v3h-3zM13 18h3v3h-3zM16 16h2v2h-2zM18 18h3v3h-3z"/></svg>'; qrBtn.addEventListener('click', function () { window.location.href = '../qr_print.html'; }); var titleBtns = document.createElement('div'); titleBtns.style.cssText = 'display:flex;gap:0.4em;'; titleBtns.appendChild(qrBtn); title.appendChild(titleBtns);
	panel.appendChild(title);
	var secComp = sscSettingSection(panel, '構成番号のページ', ['comp']); appendRouteStyleSetting(secComp, current); appendSmallBlinkSetting(secComp, current); appendPulseSetting(secComp, current);
	var secBottom = sscSettingSection(panel, '下にハメ図があるページ', ['comp', 'route']); appendBottomBandSetting(secBottom, current); appendBottomCropSetting(secBottom, current);
	var secAll = sscSettingSection(panel, '全部のページ', ['comp', 'term', 'route']); appendStripeSetting(secAll, current); appendFirstInsertSetting(secAll, current);
	var closeBtn = document.createElement('button');
	closeBtn.type = 'button';
	closeBtn.innerHTML = '<span style="font-size:1.5em;line-height:1;">×</span>'; closeBtn.title = '閉じる'; closeBtn.setAttribute('aria-label', '閉じる');
	closeBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:2em;height:2em;padding:0;background:#F07070;color:#fff;border:none;border-radius:4px;font-size:13.333px;font-weight:bold;cursor:pointer;';
	closeBtn.addEventListener('click', function () {
		overlay.parentNode.removeChild(overlay);
	});
	titleBtns.appendChild(closeBtn);
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
	var blockHeight = (rowsPerColumn + headerRowRatio) * listRowHeight; var maxHeight = window.innerHeight * bottomBandRatio(); var blockTop = (window.innerHeight - maxHeight) + (maxHeight - blockHeight) / 2;
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
	if (position === 'right') { container.style.right = '0'; container.style.left = 'auto'; } else if (position === 'left' || !isFinite(parseFloat(position))) { container.style.left = '0'; container.style.right = 'auto'; } else { container.style.left = (window.innerWidth * parseFloat(position) / 100 - areaWidth / 2) + 'px'; container.style.right = 'auto'; }
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
// 電線サイズの表示: 作業記号(workSymbol。ツイストなら Tw、生区_ が E なら S)があればそれ、無ければ電線サイズ(末尾の F は外す。0.75F → 0.75)
function wireSizeLabel(p) { return (p && p.workSymbol) ? p.workSymbol : String((p && p.wireSize) || '').replace(/F$/i, ''); }
// ハメ図の穴の中の文字: 構成番号と電線サイズの2行。めっき(plating。金めっきなら Au)がある時は3行にして1行目に出す
// (全体を span で包む: 下のハメ図の文字の div は flex なので、包まないと Au が横に並ぶ。めっきの行は 0.8 倍の文字。3行の時は呼ぶ側で、文字を 0.35 → 0.3、行の高さを 1.1 → 1 にして穴に収める)
// 穴の文字が枠からはみ出さない様に、描いた後に実際の文字の幅・高さを測って縮める。Chrome109/Edge109 は 10px より小さい文字を 10px で表示するので、その時は scale で縮める
var HOLE_TEXT_FIT = 0.9; var holeTextFitQueue = [];
function fitHoleTextLater(el) { holeTextFitQueue.push(el); if (holeTextFitQueue.length > 1) return; var run = function () { fitHoleTextNow(); fitHoleTextNow(); holeTextFitQueue = []; }; if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { setTimeout(run, 0); }); } else { setTimeout(run, 0); } }
function fitHoleTextNow() { var q = holeTextFitQueue; var m = q.map(function (el) { var mk = [].map.call(el.querySelectorAll('.firstInsertMark'), function (e) { var d = e.style.display; e.style.display = 'none'; return [e, d]; }); var r = document.createRange(); r.selectNodeContents(el); var rc = r.getBoundingClientRect(); mk.forEach(function (x) { x[0].style.display = x[1]; }); return [rc.width, rc.height, el.offsetWidth, el.offsetHeight]; }); q.forEach(function (el, i) { var z = m[i]; if (!z[0] || !z[1] || !z[2] || !z[3]) return; var s = Math.min(1, (z[2] * HOLE_TEXT_FIT) / z[0], (z[3] * HOLE_TEXT_FIT) / z[1]); if (s >= 1) return; var t = el.querySelector('.rotatableText') || el; var want = parseFloat(getComputedStyle(el).fontSize) * (parseFloat(t.style.scale) || 1) * s; el.style.fontSize = want + 'px'; var real = parseFloat(getComputedStyle(el).fontSize); if (real > want * 1.01) { if (t !== el) { t.style.display = 'inline-block'; } t.style.scale = String(want / real); } else { t.style.scale = ''; } }); }
function holeTextHtml(upperText, lowerText, plating) { var body = (upperText ? upperText : '') + (lowerText ? '<br>' + lowerText : ''); return plating ? "<span><span class='platingText' style='font-size:0.8em;'>" + plating + '</span><br>' + body + '</span>' : body; }
// 金メッキありの札(ver2 のハメ図の下の表示と同じ)。端末の電線に1本でも金めっき(plating)があれば、ハメ図の真下に出す。大きさは画面の高さに合わせる
function hasPlating(points) { return (points || []).some(function (p) { return !!p.plating; }); } function platingLabelFontPx() { return Math.max(12, window.innerHeight * 0.018); } function platingLabelHeight() { return platingLabelFontPx() * 1.6 + 4; }
function placePlatingLabel(key, rect) { var id = 'platingLabel_' + key; var el = document.getElementById(id); if (!el) { el = document.createElement('div'); el.id = id; el.className = 'platingLabel'; el.textContent = '金メッキあり'; document.body.appendChild(el); } el.style.fontSize = platingLabelFontPx() + 'px'; el.style.left = (rect.left + rect.width / 2) + 'px'; el.style.top = (rect.bottom + 2) + 'px'; }
// 空栓の一覧(ver2 のハメ図の下の「＊ 品番 ×数」と同じ)。端末番号.html だけ。データは VBA の makeEmptyPlugListJson56(<script class=emptyPlugList>)。アイコンはハメ図の栓の穴と同じ(栓の色の地 + buildPlugAsterisk の ＊、角の丸みも同じ)。文字の大きさは画面の高さの 2.6%(最小 14px)
function readEmptyPlugList() { var s = document.querySelector('script.emptyPlugList'); if (!s) return []; try { return JSON.parse(s.textContent) || []; } catch (e) { return []; } } function emptyPlugFontPx() { return Math.max(14, window.innerHeight * 0.026); } function emptyPlugListHeight(list) { return list.length ? list.length * emptyPlugFontPx() * 1.6 + 6 : 0; }
function placeEmptyPlugList(list, left, top) { var el = document.getElementById('emptyPlugList'); if (!el) { el = document.createElement('div'); el.id = 'emptyPlugList'; el.className = 'emptyPlugList'; document.body.appendChild(el); } var fontPx = emptyPlugFontPx(), iconPx = fontPx * 1.3; el.style.fontSize = fontPx + 'px'; el.style.left = left + 'px'; el.style.top = top + 'px'; el.innerHTML = ''; list.forEach(function (p) { var fill = (p.color && p.color !== '#') ? p.color : '#ffffff'; var stroke = (p.fontColor && p.fontColor !== '#') ? p.fontColor : '#000'; var row = document.createElement('div'); var icon = document.createElement('span'); icon.className = 'emptyPlugIcon'; icon.style.width = iconPx + 'px'; icon.style.height = iconPx + 'px'; icon.style.backgroundColor = fill; icon.style.borderRadius = (p.radius || '10') + '%'; icon.appendChild(buildPlugAsterisk(fill, stroke, iconPx, iconPx)); row.appendChild(icon);  row.appendChild(document.createTextNode(p.partNumber + ' ×' + p.count)); el.appendChild(row); }); }
// ジョイント電線(相手の端末が空)と、その親の電線(同じ接続G_ で両端に端末がある電線)の構成のページ。下の帯に、親の端末のハメ図(data-joint-slot。親の穴は普通の点滅)と自分の端末のハメ図を左右に、その真ん中に子の電線の一覧(表題は接続G_ の名前 J001 等。幅固定。左右に余白)(ボンダーと同じ形。短い順。引っ張った時に先に指に触れる方が短い。5本ごとに区切り線)。行き先が下のハメ図の端末のどれかと同じ子は、札が点滅して行き先は空欄。違う子は構成番号・線長・サイズを暗くし、行き先を白い丸枠で囲む。今の構成番号の札には枠。データは VBA の makeJointInfoHtml56(<script class=jointInfoData>)
function showJointInfo() { var j = readJointInfo(); if (!j) return; var members = (j.members || []).slice().sort(function (a, b) { return (parseFloat(a.cutLength) || 0) - (parseFloat(b.cutLength) || 0); }); var rowH = jointRowHeight(members.length); var el = document.createElement('div'); el.className = 'jointInfo'; el.style.fontSize = (rowH * 0.42) + 'px'; el.style.setProperty('--wireInfoUnit', (rowH * 0.42) + 'px'); el.style.setProperty('--jointRowH', rowH + 'px'); el.style.width = jointListWidth() + 'px'; el.innerHTML = "<div class='jointInfoTitle'>" + j.group + '</div>' + members.map(function (p, idx) { return jointWireRowHtml(p, j.self, jointShownTerminals(), (idx + 1) % 5 === 0 && idx + 1 !== members.length); }).join(''); el.querySelectorAll('.wireInfoRow[data-composition]').forEach(function (row) { row.addEventListener('click', function () { navigateOrNotFound(row.getAttribute('data-composition') + '.html'); }); }); document.body.appendChild(el); placeJointInfo(el); }
function placeJointInfo(el) { var w = jointListWidth(); var j = readJointInfo(); var n = j && j.members ? j.members.length : 0; if (w && jointColumnWidth()) { var band = window.innerHeight * bottomBandRatio(); var leftImg = document.querySelector('.bottomImage[data-position=left]'), rightImg = document.querySelector('.bottomImage[data-position=right]'); var gapL = leftImg ? leftImg.getBoundingClientRect().right : 0, gapR = rightImg ? rightImg.getBoundingClientRect().left : window.innerWidth; el.style.left = Math.max(gapL + 14, (gapL + gapR - w) / 2) + 'px'; el.style.top = (window.innerHeight * (1 - bottomBandRatio()) + Math.max(0, (band - (n + 0.8) * jointRowHeight(n)) / 2)) + 'px'; return; } var bi = document.querySelector('.bottomImage'); var r = bi ? bi.getBoundingClientRect() : null; el.style.bottom = '16px'; if (!r || r.left + r.width / 2 > window.innerWidth / 2) { el.style.left = '16px'; } else { el.style.right = '16px'; } } window.addEventListener('load', function () { setTimeout(showJointInfo, 0); });
function jointWireRowHtml(p, currentComposition, shownTerminals, isDivider) { var baseColor = p.color || '#000'; var stripeColor = p.bgColor || p.color; var mappedFontColor = SSC_STRIPE_FONT_MAP[(stripeColor || '').toUpperCase()] || p.fontColor || '#000000'; var badgeShadow = baseColor.toUpperCase() !== stripeColor.toUpperCase() ? buildOutlineShadow(stripeColor, 0.1) : 'none'; var isSelf = p.composition === currentComposition; var isSame = (shownTerminals || []).indexOf(p.oppositeTerminal) !== -1; var badgeStyle = 'background-color:' + baseColor + ';--stripe-color:' + stripeColor + ';color:' + mappedFontColor + ';border-color:' + mappedFontColor + ';text-shadow:' + badgeShadow + ';position:relative;'; return "<div class='wireInfoRow " + (isSame ? 'jointInfoSameRow' : 'jointInfoOtherRow') + (isDivider ? ' wireInfoDivider' : '') + "' data-composition='" + p.composition + "'><span class='blinkStripeBox wireInfoBadge" + (isSame ? ' blinkHole' : '') + "' style='" + badgeStyle + "'>" + p.composition + (isSame ? "<span class='imageBoxDotFlash' style='background-color:" + baseColor + ";'></span>" : '') + (isSelf ? "<span class='selfHoleRing'></span>" : '') + '</span>' + "<span class='wireInfoLen'>" + (p.cutLength || '') + "<span class='wireInfoLenUnit'>mm</span></span><span class='wireInfoSize'>" + wireSizeLabel(p) + "</span><span class='wireInfoOpp'>" + (isSame ? '' : "<span class='jointOppFrame'>" + (p.oppositeTerminal || '') + '</span>') + '</span></div>'; }
function readJointInfo() { var s = document.querySelector('script.jointInfoData'); if (!s) return null; try { return JSON.parse(s.textContent); } catch (e) { return null; } } function jointRowHeight(n) { return Math.max(14, Math.min(window.innerHeight * 0.045, (window.innerHeight * bottomBandRatio() - 8) / (Math.max(1, n) + 0.8))); } function jointListWidth() { var j = readJointInfo(); if (!j) return 0; var u = jointRowHeight((j.members || []).length) * 0.42; return Math.ceil(u * 13.8 + 4); } function jointColumnWidth() { if (document.getElementsByClassName('bottomImage').length !== 2) return 0; var w = jointListWidth(); return w ? w + 2 * 14 : 0; } function jointShownTerminals() { return [].map.call(document.getElementsByClassName('bottomImage'), function (b) { return (b.getAttribute('data-src') || '').replace(/^.*\/img\//, '').replace(/_[^_]*$/, ''); }); }
// ジョイントのページの左右のハメ図の幅: 穴の小さい方が先に、帯の高さいっぱいになる幅まで取る。穴の大きい方は、一番小さい穴が 50px(HOLE_MIN_PX)になる幅まで譲る
function jointAllocateWidths(c, out, holeMin) { var A = window.innerWidth - jointColumnWidth(); var band = window.innerHeight * bottomBandRatio(); var els = document.getElementsByClassName('bottomImage'); c.forEach(function (x) { var ar = x.ar || parseFloat(els[x.index].getAttribute('data-aspect-ratio')); x.need = band * ar; x.minW = (isFinite(x.minHolePx) && x.minHolePx > 0) ? holeMin * x.actualWidth / x.minHolePx : x.need; }); var s = c[0].minHolePx <= c[1].minHolePx ? c[0] : c[1], b = s === c[0] ? c[1] : c[0]; var ws = Math.min(s.need, Math.max(A / 2, A - Math.min(b.need, b.minW))); out[s.index] = ws; out[b.index] = A - ws; }
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
        if (isTerm) { cx = window.innerWidth / 2; cy = th + (window.innerHeight - th) / 2; } else { cy = r.height > 0 ? r.top + r.height / 2 : window.innerHeight * (1 - bottomBandRatio() / 2); cx = r.width > 0 ? r.left + r.width / 2 : (pos === 'left' ? window.innerWidth * 0.25 : (pos === 'right' ? window.innerWidth * 0.75 : r.left)); }
        var n = document.createElement('div'); n.className = 'noImageNotice'; n.style.cssText = 'position:absolute;z-index:30;transform:translate(-50%,-50%);padding:.6em 1.2em;border:2px solid #FE4951;border-radius:6px;background:rgba(0,0,0,.75);color:#fff;font-weight:bold;text-align:center;white-space:nowrap;pointer-events:none;font-size:' + (isTerm ? '2vw' : '1.1vw') + ';';
        n.innerHTML = '端末 ' + (m ? m[1] : '') + ' の画像がありません<br><span style="font-size:.7em;font-weight:normal;">(写真・略図とも見つかりません)</span>'; document.body.appendChild(n); var hw = n.offsetWidth / 2; n.style.left = (Math.min(Math.max(cx, hw + 4), window.innerWidth - hw - 4) + window.scrollX) + 'px'; n.style.top = (cy + window.scrollY) + 'px'; } } window.addEventListener('load', function () { setTimeout(showNoImageNotice, 300); });
// 構成番号・端末番号のページからサブ一覧(index.html)へ移る時に付ける ?from=サブ番号(ヘッダーの headerSubBench)。サブ一覧はそのサブのタイルの枠の色を変える
function subIndexQuery() { var b = document.querySelector('.headerSubBench'); var s = b ? b.textContent.trim() : ''; return s ? '?from=' + encodeURIComponent(s) : ''; }
// ===== 生産の進捗(作業者向け。この製品の、この端末の中だけ。localStorage の ssc_progress_製品フォルダ名) =====
// 製品品番一覧でネームの QR を読む → その製品のサブ一覧へ移って 1 本(シリアル)を始める(ほかのページでネームを読んだ時は始めない)。構成番号のページを開く(エフを読む)→ そのサブが作業中、前のサブは完了。end を読む → 1 本終わり(記録を消してサブ一覧へ)
// ヘッダーのすぐ下(1px あけて)に高さ 4px の帯を、全部のサブの数(SSC_SUB_COUNT)で区切って出し、手を付けたサブの数だけ左から白で埋める
var SSC_SUB_COUNT = 13;
function sscProgressFolder() { var p = location.pathname.split('/'); return decodeURIComponent(p[p.length - 2] || ''); }
function sscProgressLoad() { try { return JSON.parse(localStorage.getItem('ssc_progress_' + sscProgressFolder())); } catch (e) { return null; } }
function sscProgressSave(st) { try { if (st) localStorage.setItem('ssc_progress_' + sscProgressFolder(), JSON.stringify(st)); else localStorage.removeItem('ssc_progress_' + sscProgressFolder()); } catch (e) {} }
// 入力欄で end を読んだ時は 1 本終わり。ネームを読んだ時は始めずに知らせる(ネームは製品品番一覧で読む)。end・ネームの時は true を返す(checkText はフォームを送らない)
function sscProgressCommand(s) { var v = String(s).trim(); if (sscRecordCommand(v)) return true; if (sscNavCommand(v)) return true; if (sscCheckCommand(v)) return true;
    if (!sscProgressParseName(v)) return false; document.myform.txtb.value = ''; alert('ネームの QR は製品品番一覧で読んでください'); return true; }
// ネームを分ける: 製品品番(10) 空白 設変(3) 生産拠点(2) 年月日(5。年は下 1 桁。例 60915) 連番(5)。ネームの形でなければ null
function sscProgressParseName(v) { var m = String(v).trim().match(/^([A-Z0-9]{10})\s+(\d{3})([A-Z0-9]{2})(\d)(\d{2})(\d{2})(\d{5})$/i); if (!m) return null;
    var y = new Date().getFullYear(), year = y - (y % 10) + parseInt(m[4], 10); if (year > y) year -= 10;
    return { product: m[1].toUpperCase(), design: m[2], site: m[3].toUpperCase(), date: year + '/' + m[5] + '/' + m[6], serial: m[7] }; }
// 製品品番一覧でネームを読んで移って来た時(ssc_pending_name)だけ、そのネームで 1 本を始める。製品品番・設変がこのフォルダと違う時は知らせて始めない
function sscProgressStart(v) { var n = sscProgressParseName(v); if (!n) return;
    if (sscProgressFolder().toUpperCase().indexOf(n.product + '_' + n.design) !== 0) { alert('ネームの製品品番 ' + n.product + ' ' + n.design + ' は、この製品(' + sscProgressFolder() + ')ではありません'); return; }
    var st = sscProgressLoad(); if (!st || st.serial !== n.serial) sscProgressSave({ serial: n.serial, date: n.date, site: n.site, start: Date.now(), cur: '', done: [] }); sscNavStart(n.serial); }
// 構成番号のページ(data-current-composition がある)を開いた時: このサブを作業中にして、前のサブを完了にする(ネームを読む前は数えない)
function sscProgressPage() { var st = sscProgressLoad(), b = document.querySelector('.headerSubBench'); if (!st || !b || !document.querySelector('[data-current-composition]')) return; var sub = b.textContent.trim(); if (!sub || st.cur === sub || st.wrapStart) return;
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
// 札の高さに、点滅している電線(.blinkWire)の一番左から一番右まで、同じ色の横線を引く(点滅しない)。地は 7/8、縞は 1.2 倍、縁(黒い電線の白)は地 + 1(片側 0.5)
// 札と配索経路の札は縦の線で繋ぐ。色は電線の地の色(点滅している電線は太い順に 縁・地・縞 の線を重ねていて、黒い電線の縁は白なので 2 番目に太い線の色)
// 端末番号はハメ図の画像(./img/端末番号_1.png)から取る。画像が無い時は .term の順(1 つ目 = 左、2 つ目 = 右)
function placeCompositionTerminalTags() { drawJointChildRoute(); if (!document.querySelector('.bottomImage[data-current-composition]')) return; var terms = document.querySelectorAll('span.term'), list = [], shTerm = {};
    document.querySelectorAll('.bottomImage').forEach(function (bi) { var pos = bi.getAttribute('data-position'); if (pos !== 'left' && pos !== 'right' && !bi.getAttribute('data-bottom-mid')) return; var shc = bi.getAttribute('data-same-hole'); var m = (bi.getAttribute('data-src') || '').match(/(?:^|\/)([^\/_]+)_\d+\.[a-z]+$/i), n = m ? m[1] : '';
        if (!n) { var t = terms[pos === 'left' ? 0 : 1]; n = t ? t.getAttribute('data-terminal') : ''; } if (n) list.push(n); if (n && shc) shTerm[n] = shc; }); if (list.length === 0) return;
    var probe = document.createElement('div'); probe.className = 'box'; probe.innerHTML = '<span>0</span>'; probe.style.visibility = 'hidden'; document.body.appendChild(probe); var tagH = probe.getBoundingClientRect().height; probe.parentNode.removeChild(probe); var rowY = (compTermRowHeight() > 0 ? window.innerHeight * (1 - bottomBandRatio()) - compTermRowHeight() / 2 : window.innerHeight * (1 - bottomBandRatio()) + tagH / 2) + window.scrollY;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'compTermTagSvg'); svg.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:' + document.documentElement.scrollHeight + 'px;pointer-events:none;z-index:5;overflow:visible;';
    var minX = Infinity, maxX = -Infinity, layers = [], seen = {}; document.querySelectorAll('line.blinkWire').forEach(function (ln) { var r = ln.getBoundingClientRect(); if (r.width === 0 && r.height === 0) return; if (r.left < minX) minX = r.left; if (r.right > maxX) maxX = r.right;
        var key = ln.getAttribute('stroke') + '|' + ln.getAttribute('stroke-width'); if (!seen[key]) { seen[key] = true; layers.push({ stroke: ln.getAttribute('stroke'), width: parseFloat(ln.getAttribute('stroke-width')), dash: ln.getAttribute('stroke-dasharray') }); } });
    var tags = [], jr = jointChildRoute(); if (jr && jr.side === '#J') list.unshift('#J'); list.forEach(function (n) { var jt = jr && n === jr.side ? jr : null, routeTag = jt ? null : findTerminalTag(n, false), rr = jt ? jointChildRowRect(jt) : (routeTag ? routeTag.getBoundingClientRect() : null), tag = document.createElement('div'); tag.className = 'box compTermTag'; tag.innerHTML = '<span></span>'; tag.firstChild.textContent = jt ? jt.self : n;
        if (jt) { tag.style.backgroundColor = '#FE5151'; tag.style.color = '#FFFFFF'; tag.style.zIndex = '50'; } else { tag.style.backgroundColor = routeTag ? getComputedStyle(routeTag).backgroundColor : '#FFF'; tag.style.cursor = 'pointer'; tag.addEventListener('click', function () { navigateOrNotFound(n + '.html'); }); } document.body.appendChild(tag);
        var w = tag.offsetWidth, cx = rr ? rr.left + rr.width / 2 + window.scrollX : window.innerWidth * (tags.length === 0 ? 1 : 2) / 3, left = cx - w / 2;
        tags.forEach(function (o) { if (left < o.right && left + w > o.left) left = (cx >= (o.left + o.right) / 2) ? o.right + 2 : o.left - w - 2; }); tag.style.left = left + 'px'; tag.style.top = (rowY - tagH / 2) + 'px';
        tags.push({ left: left, right: left + w, cx: left + w / 2, rr: rr, sh: shTerm[n] }); if (shTerm[n]) return; if (left + w / 2 < minX) minX = left + w / 2; if (left + w / 2 > maxX) maxX = left + w / 2; });
    var byWidth = layers.slice().sort(function (a, b) { return b.width - a.width; }), stripeW = layers.length < 2 ? -1 : byWidth[byWidth.length - 1].width, baseColor = byWidth.length > 0 ? (byWidth[1] || byWidth[0]).stroke : '#FE5151';
    if (minX < maxX) layers.forEach(function (ly) { var line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.setAttribute('class', 'line'); line.setAttribute('x1', minX); line.setAttribute('y1', rowY); line.setAttribute('x2', maxX); line.setAttribute('y2', rowY);
        line.setAttribute('stroke', ly.stroke); line.setAttribute('stroke-width', ly === byWidth[0] && byWidth.length > 2 ? byWidth[1].width * 7 / 8 + 1 : ly.width * (ly.width === stripeW ? 1.2 : 7 / 8)); if (ly.dash) line.setAttribute('stroke-dasharray', ly.dash); svg.appendChild(line); });
    // 縦の線は一番後ろ(配索経路の線より後ろ)に描く。電線の地の色が黒い時は、黒い背景で見えないので白い線(太さは同じ 1)にする
    var back = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); back.setAttribute('class', 'compTermTagSvg'); back.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:' + document.documentElement.scrollHeight + 'px;pointer-events:none;overflow:visible;';
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(baseColor.length === 4 ? baseColor.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3') : baseColor), isDark = m ? (parseInt(m[1], 16) * 0.299 + parseInt(m[2], 16) * 0.587 + parseInt(m[3], 16) * 0.114) < 40 : false;
    tags.forEach(function (t) { if (!t.rr) return; [[t.sh ? sameHoleLineColor(t.sh) : isDark ? '#FFF' : baseColor, 1]].forEach(function (ly) { var line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.setAttribute('x1', t.cx); line.setAttribute('y1', rowY); line.setAttribute('x2', t.rr.left + t.rr.width / 2 + window.scrollX); line.setAttribute('y2', t.rr.top + t.rr.height / 2 + window.scrollY);
        line.setAttribute('stroke', ly[0]); line.setAttribute('stroke-width', ly[1]); back.appendChild(line); }); }); document.body.insertBefore(back, document.body.firstChild); document.body.appendChild(svg); }
window.addEventListener('load', function () { setTimeout(placeCompositionTerminalTags, 50); });
// 構成番号のページと端末番号-.html(bottomBandPage): 配索経路と下のハメ図の間の、端末番号の札の行の高さ(px)。札の高さ + 上下 1px。他のページは 0
function compTermRowHeight() { if (compTermRowHeight.h !== undefined) return compTermRowHeight.h; var h = 0; if (bottomBandPage()) { var p = document.createElement('div'); p.className = 'box'; p.innerHTML = '<span>0</span>'; p.style.visibility = 'hidden'; document.body.appendChild(p); h = p.getBoundingClientRect().height + 2; p.parentNode.removeChild(p); } compTermRowHeight.h = h; return h; }
// 配索経路の縦の倍率。配索経路(data-y は 0-69%)の下端を、下のハメ図の帯(画面の下 30%)の上端から札の行の高さだけ上にする。札の行が無いページは 1(今まで通り)
function routeScaleY(tableHeight) { var band = compTermRowHeight(); if (!band) return 1; var h = window.innerHeight - tableHeight; return Math.max(0.5, (window.innerHeight * (1 - bottomBandRatio()) - band - tableHeight) / (h * 0.69)); }
// ストライプの太さ(5段階): 1=27% 2=24% 3=21% 4=18% 5=15%。真ん中(50%)を中心にした開始・終了位置を返す。設定(STRIPE_LEVEL)の太さは :root の --stripe-a / --stripe-b に入れて、terminal.css / composition.css の .blinkStripeBox が使う
function stripeRange(level) { var half = 15 * (1 - level / 10); return { a: (50 - half) + '%', b: (50 + half) + '%' }; }
function applyStripeWidth() { var r = stripeRange(sscSettings.STRIPE_LEVEL); document.documentElement.style.setProperty('--stripe-a', r.a); document.documentElement.style.setProperty('--stripe-b', r.b); }
// 設定モーダルのストライプの選択肢。本物の穴と同じ描き方(電線色 GY/B = 灰色の地・黒のストライプ、上 1234 / 下 1.25)の見本を 5 個並べて、太さだけ変える。選んだ見本は緑の枠
function appendStripeSetting(panel, current) { var stripeRow = document.createElement('div'); stripeRow.style.cssText = 'display:flex;flex-direction:column;gap:0.4em;margin-bottom:0.9em;'; var stripeLabel = document.createElement('span'); stripeLabel.textContent = 'ストライプの太さ'; stripeLabel.style.cssText = 'font-size:0.9em;color:#ccc;white-space:nowrap;'; stripeRow.appendChild(stripeLabel);
    var stripeChoices = document.createElement('div'); stripeChoices.style.cssText = 'display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none;'; var stripeItems = [];
    function markStripe(level) { stripeItems.forEach(function (it, k) { it.style.outline = (k + 1 === level) ? '0.2em solid #00C853' : '1px solid #555'; it.style.outlineOffset = (k + 1 === level) ? '0.15em' : '0'; }); }
    [1, 2, 3, 4, 5].forEach(function (lv) { var r = stripeRange(lv), size = 48, sampleStripe = '#050505', sampleFont = SSC_STRIPE_FONT_MAP[sampleStripe] || '#000000'; var item = document.createElement('div'); item.style.cssText = 'width:' + size + 'px;height:' + size + 'px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;font-family:MPLUS1p, sans-serif;font-weight:bold;border:1px solid;border-radius:10%;cursor:pointer;background-color:#BABABA;';
        item.style.backgroundImage = 'linear-gradient(135deg, transparent ' + r.a + ', ' + sampleStripe + ' ' + r.a + ', ' + sampleStripe + ' ' + r.b + ', transparent ' + r.b + ')'; item.style.color = sampleFont; item.style.borderColor = sampleFont; item.style.fontSize = (size * 0.35) + 'px'; item.style.lineHeight = '1.1'; item.style.textShadow = buildOutlineShadow(sampleStripe, 0.12);
        item.innerHTML = '<span class=rotatableText>' + holeTextHtml('1234', '1.25', '') + '</span>'; fitHoleTextLater(item); item.addEventListener('click', function () { window.setSscSetting({ STRIPE_LEVEL: lv }); markStripe(lv); }); stripeChoices.appendChild(item); stripeItems.push(item); });
    markStripe(current.STRIPE_LEVEL); stripeRow.appendChild(stripeChoices); panel.appendChild(stripeRow); }
// 付属部品の一覧(ver2 のハメ図の下の部品リストと同じ内容)。端末番号.html だけ。データは <script class=addonList>(terminal_.Addons)。画像は使わず HTML で描く
// kind=tube: 印(shape 9=丸 / 5=角丸)の中に呼称(VO など)、地の色 = 部品の色。kind=part: 部材詳細で色と文字が決まる四角(COVER など)。スルークリップは中にクリップの形(部品の色)
// 右に 1 行目 部品品番(大きく)、2 行目以降 寸法や部材詳細・工程40(小さく)。文字の大きさは空栓の一覧と同じ(画面の高さの 2.6%、最小 14px)
var ADDON_PART_STYLE = [['スルークリップ', '#B7DEE8', ''], ['端子係止部品', '#D09FEB', 'HOLDER'], ['コネクターカバー', '#E46648', 'COVER'], ['グロメット', '#F274C2', 'GROM']];
function readAddonList() { var s = document.querySelector('script.addonList'); if (!s) return []; try { return JSON.parse(s.textContent) || []; } catch (e) { return []; } }
function addonFontPx() { return Math.max(14, window.innerHeight * 0.026); }
function addonRowHeight(a) { var f = addonFontPx(), n = Math.max(1, (a.lines || []).length); return Math.max(f * 2.2, f * 1.25 + (n - 1) * f * 0.85 * 1.25) + f * 0.35; }
function addonListHeight(list) { var h = 0; list.forEach(function (a) { h += addonRowHeight(a); }); return list.length ? h + 6 : 0; }
function addonPartStyle(detail) { for (var i = 0; i < ADDON_PART_STYLE.length; i++) { if (String(detail || '').indexOf(ADDON_PART_STYLE[i][0]) !== -1) return ADDON_PART_STYLE[i]; } return ['', '#FA4646', 'OTHER']; }
function buildAddonIcon(a, px) { var icon = document.createElement('span'); icon.className = 'addonIcon'; icon.style.width = px + 'px'; icon.style.height = px + 'px'; var text = '', ratio = 0;
    if (a.kind === 'tube') { icon.style.backgroundColor = a.color || '#ffffff'; icon.style.color = a.fontColor || '#000000'; icon.style.borderRadius = String(a.shape) === '5' ? '18%' : '50%'; text = a.mark || ''; ratio = Math.min(0.6, 1.2 / Math.max(1, text.length)); }
    else { var st = addonPartStyle(a.detail); icon.style.backgroundColor = st[1]; icon.style.color = '#000000'; icon.style.borderRadius = '18%'; text = st[2]; ratio = 1.8 / Math.max(1, text.length) * 0.97;
        if (st[0] === 'スルークリップ') { icon.innerHTML = "<svg viewBox='0 0 310 310' width='100%' height='100%'><polygon points='24,34 284,34 284,101 193,101 193,180 287,180 160,280 24,180 117,180 117,101 24,101' fill='" + (a.color || '#FCFCFC') + "' stroke='#000' stroke-width='10' stroke-linejoin='round'/></svg>"; } }
    if (text) { var t = document.createElement('span'); t.className = 'addonIconText'; t.style.fontSize = (px * ratio) + 'px'; t.textContent = text; icon.appendChild(t); } return icon; }
function placeAddonList(list, left, top) { var el = document.getElementById('addonList'); if (!el) { el = document.createElement('div'); el.id = 'addonList'; el.className = 'addonList'; document.body.appendChild(el); } var f = addonFontPx(); el.style.fontSize = f + 'px'; el.style.left = left + 'px'; el.style.top = top + 'px'; el.innerHTML = '';
    list.forEach(function (a) { var row = document.createElement('div'); row.className = 'addonRow'; row.style.height = addonRowHeight(a) + 'px'; row.appendChild(buildAddonIcon(a, f * 2.2)); var box = document.createElement('div'); box.className = 'addonText'; (a.lines || []).forEach(function (ln, i) { var d = document.createElement('div'); d.className = i === 0 ? 'addonMain' : 'addonSub'; d.textContent = ln; box.appendChild(d); }); row.appendChild(box); el.appendChild(row); fitAddonIconText(row.firstChild); }); }
// 印の中の文字(COVER など)が印からはみ出す時は、印の幅の 86% に収まるまで小さくする
function fitAddonIconText(icon) { var t = icon.querySelector('.addonIconText'); if (!t) return; var room = icon.clientWidth * 0.86, w = t.offsetWidth; if (w > room) t.style.fontSize = (parseFloat(t.style.fontSize) * room / w) + 'px'; }
// 構成番号のページの下のハメ図(.bottomImage)で、穴(hole の div)の文字が小さくて読みにくい時だけ、画像の周りを切り落として穴を大きくする(設定の「下のハメ図: 文字が小さい時は穴の周りだけ表示」が入の時。初めは入)。画像はコネクタの向きを見る為のものなので、文字が読める大きさなら切り出さない
// 文字の大きさの見積もり: main.js と同じ min(穴の幅, 穴の高さ) × 0.35。文字が穴の幅の 90% を超える時は fitHoleTextNow が縮めるので、1 文字 0.58em として 幅 × 0.9 ÷ (文字数 × 0.58) も上限にする(文字数は構成番号と電線サイズの長い方)。枠は maxW × maxH の中に縦横比を保って入れる
// 一番小さい文字が 12px 以上なら切り出さない。足りない時は、切り出す範囲を画像全体から「穴が全部入る範囲 + 余白 3%(画像の %)」へ少しずつ狭め、12px に届く所で止める(届かなければ穴の範囲 + 余白まで切り出す)
// planBottomCrop: 計算だけ(ページは変えない)。2 つの下のハメ図で幅を分け合う計算(biWidthOverride)で、切り出した後の形で判断させる為に使う。戻り値 { t: 0?1(0 は切り出さない), r: [左, 上, 右, 下](画像の %), ar: 切り出した後の縦横比, pts: 切り出した範囲に対する % に直した座標(コピー) }
// 定数は関数の中に置く(下のハメ図の配置は main.js の読み込み中に決まるので、この行より後ろの var はまだ入っていない)
function planBottomCrop(pts, ar, maxW, maxH) { var MIN_PX = 12, MARGIN = 3, none = { t: 0, r: [0, 0, 100, 100], ar: ar, pts: pts };
    if (!bottomCropEnabled() || !pts || !pts.length || pts[0].showText === false || !(ar > 0) || !(maxW > 0) || !(maxH > 0)) return none;
    var holes = pts.filter(function (p) { return p.w > 0 && p.h > 0; }), texts = holes.filter(function (p) { return p.composition; }); if (!texts.length) return none;
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; holes.forEach(function (p) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x + p.w); y1 = Math.max(y1, p.y + p.h); });
    var full = [0, 0, 100, 100], tight = [Math.max(0, x0 - MARGIN), Math.max(0, y0 - MARGIN), Math.min(100, x1 + MARGIN), Math.min(100, y1 + MARGIN)];
    var minFont = function (r) { var bw = r[2] - r[0], bh = r[3] - r[1], rar = ar * bw / bh, W = Math.min(maxW, maxH * rar), H = W / rar, f = Infinity; texts.forEach(function (p) { var wpx = p.w / bw * W, hpx = p.h / bh * H, chars = Math.max(String(p.composition).length, String(p.wireSize || '').length, 3); f = Math.min(f, Math.min(wpx, hpx) * 0.35, wpx * 0.9 / (chars * 0.58)); }); return f; };
    var mix = function (t) { return full.map(function (v, k) { return v + (tight[k] - v) * t; }); }, t = 0;
    if (minFont(full) < MIN_PX) { if (minFont(tight) <= MIN_PX) { t = 1; } else { var lo = 0, hi = 1; for (var k = 0; k < 20; k++) { var mid = (lo + hi) / 2; if (minFont(mix(mid)) >= MIN_PX) hi = mid; else lo = mid; } t = hi; } }
    if (t === 0) return none; var r = mix(t), bw = r[2] - r[0], bh = r[3] - r[1];
    var out = pts.map(function (p) { var q = {}; for (var key in p) q[key] = p[key]; if (typeof q.x === 'number') { q.x = (q.x - r[0]) / bw * 100; q.y = (q.y - r[1]) / bh * 100; q.w = q.w / bw * 100; q.h = q.h / bh * 100; } return q; });
    return { t: t, r: r, ar: ar * bw / bh, pts: out }; }
// 枠の大きさを決める直前に、本当の最大の幅・高さで計算して切り出す。穴の座標を切り出した範囲に対する % に直して JSON(blink-coords-data。穴を描く所はこれを読む)を書き直し、背景の画像を background-size / background-position で拡大・移動する。戻り値の ar(縦横比)で枠の大きさを決める
function cropBottomImageForText(el, raw, pts, ar, maxW, maxH) { var plan = planBottomCrop(pts, ar, maxW, maxH); if (plan.t === 0 || !raw) return { ar: ar, pts: pts }; var bw = plan.r[2] - plan.r[0], bh = plan.r[3] - plan.r[1]; raw.textContent = JSON.stringify(plan.pts); el.style.backgroundSize = (10000 / bw) + '% ' + (10000 / bh) + '%'; el.style.backgroundPosition = (bw < 100 ? plan.r[0] / (100 - bw) * 100 : 0) + '% ' + (bh < 100 ? plan.r[1] / (100 - bh) * 100 : 0) + '%'; return { ar: plan.ar, pts: plan.pts }; }
// 設定の BOTTOM_CROP(初めは入。保存が無い時・読めない時も入)。下のハメ図の配置は sscSettings を作るより前に決まるので、localStorage を直接読む(名前は SSC56_SETTINGS_KEY と同じ。この時点では SSC56_SETTINGS_KEY がまだ入っていない)
function bottomCropEnabled() { try { var s = JSON.parse(localStorage.getItem(sscSettingsKey())) || {}; return s.BOTTOM_CROP !== false; } catch (e) { return true; } }
// 設定モーダルに 1 行足す(ストライプの選択肢の下)。左右に動く切替スイッチ(入 = 右・緑 / 切 = 左・灰色)。切り替えたら、下のハメ図があるページは配置し直す為に読み直し、読み直した後に設定モーダルを開き直す(sessionStorage の ssc_reopen_settings)
function appendBottomCropSetting(panel, current) { var row = document.createElement('div'); row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:0.6em;margin-bottom:0.8em;'; var label = document.createElement('span'); label.textContent = '文字が小さい時は穴の周りだけ表示'; label.style.cssText = 'font-size:0.9em;color:#ccc;';
    var sw = document.createElement('button'); sw.type = 'button'; sw.setAttribute('role', 'switch'); sw.style.cssText = 'position:relative;flex:none;width:2.8em;height:1.5em;padding:0;border:none;border-radius:0.75em;cursor:pointer;transition:background-color 0.2s;';
    var knob = document.createElement('span'); knob.style.cssText = 'position:absolute;top:0.15em;left:0.15em;width:1.2em;height:1.2em;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.5);transition:transform 0.2s;'; sw.appendChild(knob);
    var on = current.BOTTOM_CROP !== false; var draw = function () { sw.setAttribute('aria-checked', on ? 'true' : 'false'); sw.style.backgroundColor = on ? '#00C853' : '#555'; knob.style.transform = on ? 'translateX(1.3em)' : 'none'; }; draw();
    sw.addEventListener('click', function () { on = !on; draw(); window.setSscSetting({ BOTTOM_CROP: on }); if (document.querySelector('.bottomImage')) { try { sessionStorage.setItem('ssc_reopen_settings', '1'); } catch (e) {} setTimeout(function () { location.reload(); }, 250); } });
    row.appendChild(label); row.appendChild(sw); panel.appendChild(row); }
// 切替スイッチで読み直した時は、設定モーダルを開き直す
window.addEventListener('load', function () { var again = false; try { again = sessionStorage.getItem('ssc_reopen_settings') === '1'; sessionStorage.removeItem('ssc_reopen_settings'); } catch (e) {} if (again) setTimeout(openSscSettingsModal, 0); });
// ジョイント(J)の構成番号のページで、ボンダー(drawBondLinks)と同じように、同じ構成番号を点線で繋ぐ
// 子線: ジョイントの一覧(.jointInfo)の行の札 と 下のハメ図の点滅している同じ構成番号の穴。見た目はボンダーの線と同じ(色は BOND_LINK_COLORS。赤・朱・橙は使わない)
// 基線(jointInfoData の parent。両端に端末がある線): 下のハメ図にある基線の穴(1 つでも 2 つでも)から、ジョイントの一覧の上の「基線」の札まで、白の太い点線 + 薄い白の帯で繋ぐ(相手の穴がこのページに無くても)
// 道順は bondLinkGrid / bondLinkRoute(穴を避ける・曲がりを少なく・成型方向の帯に沿わない)。子線を先に決め、その道に後の線が沿わないようにする(jointLinkAvoidAlong)。
// 基線はジョイントの一覧の上と、下のハメ図の帯より上(配索経路の側)は通らない。線は 1 本だけでも描く(ボンダーは 2 本以上の時だけ。ジョイントは分かり辛いので、0092 の様に相手と同じ構成番号が 1 か所だけでも繋ぐ)
function jointLinkMemberPairs() { var list = document.querySelector('.jointInfo'); if (!list) return []; var res = [];
    document.querySelectorAll('.bottomImage .imageBoxDot[data-composition]').forEach(function (d) { if (!d.querySelector('.blinkHole')) return; var row = list.querySelector(".wireInfoRow[data-composition='" + d.getAttribute('data-composition') + "']"); if (!row) return;
        var b = row.querySelector('.wireInfoBadge').getBoundingClientRect(), rr = row.getBoundingClientRect(), dr = d.getBoundingClientRect();
        if (b.left > dr.right) res.push({ dot: d, x: b.left - 3, y: b.top + b.height / 2, dir: 2 }); else if (rr.right < dr.left) res.push({ dot: d, x: rr.right + 3, y: b.top + b.height / 2, dir: 0 }); });
    return res; }
// 基線の札: ジョイントの一覧(.jointInfo)の左右の真ん中、上端は下のハメ図の帯の上端。基線の穴(1 つでも 2 つでも)をこの札まで繋ぐ(相手の穴がこのページに無くても)
function jointLinkParentDots() { var s = document.querySelector('script.jointInfoData'); if (!s) return []; var j; try { j = JSON.parse(s.textContent); } catch (e) { return []; } if (!j || !j.parent || !j.parent.composition) return [];
    return [].filter.call(document.querySelectorAll(".bottomImage .imageBoxDot[data-composition='" + j.parent.composition + "']"), function (d) { return d.querySelector('.blinkHole'); }); }
function jointLinkTagRect() { var list = document.querySelector('.jointInfo'); if (!list) return null; var lr = list.getBoundingClientRect(), top = Math.min.apply(null, [].map.call(document.querySelectorAll('.bottomImage'), function (b) { return b.getBoundingClientRect().top; })); if (!isFinite(top)) return null;
    var cx = lr.left + lr.width / 2; return { left: cx - 22, right: cx + 22, top: top, bottom: top + 20, cx: cx, cy: top + 10 }; }
// 基線の線の出口: 穴が札より左なら札の左、右なら札の右から出す。同じ側が 2 つ目の時は札の下から出す。線は札の真ん中から引き始め、札の後ろに隠す(札は最後に描く)
function jointLinkTagStarts(tag, dots) { var used = {}; return dots.map(function (d) { var r = d.getBoundingClientRect(), side = r.left + r.width / 2 < tag.cx ? 'L' : 'R';
        if (used[side]) return { dot: d, x: tag.cx, y: tag.bottom + 6, dir: 1 }; used[side] = 1; return side === 'L' ? { dot: d, x: tag.left - 6, y: tag.cy, dir: 2 } : { dot: d, x: tag.right + 6, y: tag.cy, dir: 0 }; }); }
// 描いた線の道(前後 3px)を成型方向の帯と同じ扱いにする(後から道を決める線が、沿って進むと高くつく・横切るのは良い)。広くすると穴の間の狭い所を通って遠回りする
function jointLinkAvoidAlong(g, pts) { for (var k = 0; k < pts.length - 1; k++) { var p1 = pts[k], p2 = pts[k + 1], hz = Math.abs(p1[1] - p2[1]) < 0.5, m = 3;
        var q = { left: Math.min(p1[0], p2[0]) - m, right: Math.max(p1[0], p2[0]) + m, top: Math.min(p1[1], p2[1]) - m, bottom: Math.max(p1[1], p2[1]) + m, horiz: hz }; g.bands.push(q);
        var x0 = Math.max(0, Math.floor((q.left - g.x0) / BOND_CELL)), x1 = Math.min(g.W - 1, Math.floor((q.right - g.x0) / BOND_CELL)), y0 = Math.max(0, Math.floor((q.top - g.y0) / BOND_CELL)), y1 = Math.min(g.H - 1, Math.floor((q.bottom - g.y0) / BOND_CELL));
        for (var y = y0; y <= y1; y++) { for (var x = x0; x <= x1; x++) { g.band[y * g.W + x] = hz ? 1 : 2; } } } }
// 範囲 r を、基線の道を決める間だけ穴と同じ扱いにする(el は bondSegHits が数える為の要素)
function jointLinkBlock(g, r, el) { var C = BOND_CELL, idx = g.rects.length, cx0 = Math.max(0, Math.floor((r.left - 2 - g.x0) / C)), cx1 = Math.min(g.W - 1, Math.floor((r.right + 2 - g.x0) / C)), cy0 = Math.max(0, Math.floor((r.top - 2 - g.y0) / C)), cy1 = Math.min(g.H - 1, Math.floor((r.bottom + 2 - g.y0) / C));
    for (var y = cy0; y <= cy1; y++) { for (var x = cx0; x <= cx1; x++) { g.hole[y * g.W + x] = idx; } } g.dots = [].slice.call(g.dots).concat([el]); g.rects.push(r); }
function drawJointLinks() { var ps = jointLinkMemberPairs(), pds = jointLinkParentDots(), tag = pds.length ? jointLinkTagRect() : null, pps = tag ? jointLinkTagStarts(tag, pds) : [], all = ps.concat(pps); if (!all.length) return;
    var g = bondLinkGrid(all), s = '', ps2 = '', marks = []; if (tag) jointLinkBlock(g, tag, document.body);
    ps.sort(function (p, q) { return p.y - q.y; }).forEach(function (p, i) { var col = BOND_LINK_COLORS[(i + 1) % BOND_LINK_COLORS.length], rt = bondLinkRoute(g, p); if (!rt) return; rt.pts = jointLinkOrtho(rt.pts); var d = 'M' + rt.pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' L'); jointLinkAvoidAlong(g, rt.pts);
        s += "<path d='" + d + "' fill='none' stroke='#000' stroke-width='3' stroke-linejoin='round' stroke-linecap='round' opacity='.65'/><path class='flow' d='" + d + "' fill='none' stroke='" + col + "' stroke-width='1.25' stroke-linejoin='round' stroke-linecap='round'/>";
        [[p.x, p.y], rt.end].forEach(function (e) { s += "<circle cx='" + e[0] + "' cy='" + e[1] + "' r='2.5' fill='" + col + "' stroke='#000' stroke-width='1'/>"; }); marks.push({ dot: p.dot, col: col }); });
    if (tag) { var saveHole = g.hole.slice(), saveDots = g.dots, saveRects = g.rects.slice(), listEl = document.querySelector('.jointInfo'); jointLinkBlock(g, listEl.getBoundingClientRect(), listEl);
        jointLinkBlock(g, { left: g.x0, right: g.x0 + g.W * BOND_CELL, top: g.y0 - 50, bottom: tag.top - 2 }, document.body);
        pps.forEach(function (pp) { var rt = bondLinkRoute(g, pp); if (!rt) return; rt.pts = jointLinkOrtho(rt.pts); rt.pts.unshift([tag.cx, tag.cy]); jointLinkAvoidAlong(g, rt.pts); var d = 'M' + rt.pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' L');
            ps2 += "<path d='" + d + "' fill='none' stroke='#FFFFFF' stroke-width='8' stroke-linejoin='round' stroke-linecap='round' opacity='.28'/><path d='" + d + "' fill='none' stroke='#000' stroke-width='4' stroke-linejoin='round' stroke-linecap='round' opacity='.7'/><path class='flow flowBig' d='" + d + "' fill='none' stroke='#FFFFFF' stroke-width='2.5' stroke-linejoin='round' stroke-linecap='round'/>";
            ps2 += "<circle cx='" + rt.end[0] + "' cy='" + rt.end[1] + "' r='4.5' fill='#FFFFFF' stroke='#000' stroke-width='1.5'/>"; });
        g.hole.set(saveHole); g.dots = saveDots; g.rects = saveRects;
        ps2 += "<g transform='translate(" + tag.cx + ' ' + tag.cy + ")'><rect x='-22' y='-10' width='44' height='20' rx='4' fill='#FFFFFF' stroke='#000' stroke-width='1.5'/><text x='0' y='5' text-anchor='middle' font-family='MPLUS1p, sans-serif' font-weight='bold' font-size='14' fill='#000'>基線</text></g>"; }
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'bondLinks jointLinks'); svg.innerHTML = s + ps2; document.body.appendChild(svg); jointLinkMarks(marks); }
window.addEventListener('load', function () { setTimeout(drawJointLinks, 350); });
// 道順に斜めの所があれば、角の点を足して縦・横にする(bondLinkRoute は札から横に出る前提で、出発してすぐ曲がると最初の角が消えて斜めになる)
function jointLinkOrtho(pts) { var out = [pts[0]]; for (var i = 1; i < pts.length; i++) { var a = out[out.length - 1], b = pts[i]; if (Math.abs(a[0] - b[0]) > 0.5 && Math.abs(a[1] - b[1]) > 0.5) { var pv = out.length > 1 ? out[out.length - 2] : null, prevHoriz = pv ? Math.abs(pv[1] - a[1]) < 0.5 : true; out.push(prevHoriz ? [a[0], b[1]] : [b[0], a[1]]); } out.push(b); } return out; }
// ジョイントの子の位置(jointInfoData の jointPos。VBA の computeJointPos56 が hsf の位置(08_MD2 の jigJointPos.csv)を冶具の配索経路に写した物。x・y は配索経路の %)を、配索経路の上に赤い ◆ と構成番号の札で出す。hsf の位置なので、だいたいの位置
// 今の構成番号(jointInfoData の self)は大きく光って脈打つ赤い ◆、同じジョイントの他の子は小さい赤い ◆。札は今の構成番号が赤、他の子は白。同じ位置の子は 1 つの印にまとめる(札は 0008・0063)。◆ が 1 つだけの時は札を出さない(どの子もそこで圧着するので分ける要が無く、子は下のジョイントの一覧に出ている)。画面の位置は、分岐点(.circle)の data-x / data-y と画面の位置から当てはめる
function jointPosFit(axis) { var n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0; document.querySelectorAll('.circle[data-x]').forEach(function (c) { var r = c.getBoundingClientRect(); if (!r.width) return; var v = parseFloat(c.getAttribute(axis === 'x' ? 'data-x' : 'data-y')), p = axis === 'x' ? r.left + r.width / 2 : r.top + r.height / 2; n++; sx += v; sy += p; sxx += v * v; sxy += v * p; });
    if (n < 2 || n * sxx - sx * sx === 0) return null; var a = (n * sxy - sx * sy) / (n * sxx - sx * sx); return { a: a, b: (sy - a * sx) / n }; }
function drawJointPositions() { var j = readJointInfo(); if (!j || !j.jointPos || !j.jointPos.length) return; var fx = jointPosFit('x'), fy = jointPosFit('y'); if (!fx || !fy) return; var spots = [], onParent = !!(j.parent && j.parent.composition === j.self);
    j.jointPos.forEach(function (p) { var k = p.x + '_' + p.y, f = spots.filter(function (q) { return q.k === k; })[0]; if (f) f.comps.push(p.composition); else spots.push({ k: k, x: parseFloat(p.x), y: parseFloat(p.y), comps: [p.composition] }); });
    spots.sort(function (a, b) { return (a.comps.indexOf(j.self) !== -1) - (b.comps.indexOf(j.self) !== -1); });
    spots.forEach(function (p) { var cur = p.comps.indexOf(j.self) !== -1, x = fx.a * p.x + fx.b + window.scrollX, y = fy.a * p.y + fy.b + window.scrollY, s = cur ? 9 : 6, m = document.createElement('div'), lb = document.createElement('div');
        m.className = 'jointPosMark'; m.style.cssText = 'position:absolute;z-index:30;pointer-events:none;box-sizing:border-box;transform:rotate(45deg);left:' + (x - s) + 'px;top:' + (y - s) + 'px;width:' + (s * 2) + 'px;height:' + (s * 2) + 'px;background:#FE5151;border:2px solid #FFFFFF;box-shadow:' + (cur ? '0 0 8px 2px rgba(254,81,81,0.9)' : 'none');
        if (cur && m.animate) m.animate([{ transform: 'rotate(45deg) scale(1)' }, { transform: 'rotate(45deg) scale(1.35)' }, { transform: 'rotate(45deg) scale(1)' }], { duration: 800, iterations: Infinity });
        lb.className = 'jointPosLabel'; lb.textContent = p.comps.join('・'); lb.style.cssText = "position:absolute;z-index:31;pointer-events:none;transform:translate(-100%,-50%);font:bold 12px/1 'MPLUS1p',sans-serif;padding:2px 4px;border-radius:3px;white-space:nowrap;left:" + (x - s - 8) + 'px;top:' + y + 'px;background:' + (cur || onParent ? '#FE5151' : '#FFFFFF') + ';color:' + (cur || onParent ? '#FFFFFF' : '#000000');
        document.body.appendChild(m); if (spots.length > 1) document.body.appendChild(lb); }); }
window.addEventListener('load', function () { setTimeout(drawJointPositions, 400); });
// 設定モーダル。設定を、効くページごとの枠にまとめる(構成番号のページだけ / 構成番号・端末番号- のページ / 全部のページ)。枠の見出しの下に、効くページの札(構成番号・端末番号・端末番号-)を出す。今のページに効く枠は白い縁。右上の QR の絵で QR コードの印刷ページを開く
var SSC_PAGE_KINDS = [['comp', '構成番号'], ['term', '端末番号'], ['route', '端末番号-']];
function sscPageKind() { if (/\/\d+-\.html$/.test(window.location.pathname)) return 'route'; if (document.querySelector('.bottomImage[data-current-composition]')) return 'comp'; if (document.querySelector('.boxTerminal')) return 'term'; return ''; }
function sscSettingSection(panel, title, kinds) { var here = kinds.indexOf(sscPageKind()) !== -1, sec = document.createElement('div'); sec.style.cssText = 'background:#2b2b2b;border:1px solid ' + (here ? '#ffffff' : '#3a3a3a') + ';border-radius:6px;padding:0.6em 0.8em 0.2em;margin-bottom:0.8em;';
    var head = document.createElement('div'); head.style.cssText = 'display:flex;align-items:center;gap:0.5em;'; var t = document.createElement('span'); t.textContent = title; t.style.cssText = 'font-weight:bold;font-size:1em;'; head.appendChild(t);
    var pages = document.createElement('div'); pages.style.cssText = 'display:flex;align-items:center;flex-wrap:wrap;gap:0.3em;margin:0.3em 0 0.7em;font-size:0.72em;color:#999;';
    SSC_PAGE_KINDS.forEach(function (k) { if (kinds.indexOf(k[0]) === -1) return; var chip = document.createElement('span'); chip.textContent = k[1]; chip.style.cssText = 'padding:0.05em 0.45em;border-radius:3px;background:#444;color:#eee;'; pages.appendChild(chip); });
    sec.appendChild(head); sec.appendChild(pages); panel.appendChild(sec); return sec; }
// 設定モーダルの 1 行: パルスが出るCAVサイズの上限(px)。数字を打つと、すぐ保存して反映する
function appendPulseSetting(panel, current) { var row = document.createElement('div'); row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:0.6em;margin-bottom:0.8em;'; var label = document.createElement('span'); label.textContent = 'パルスが出るCAVサイズの上限(px)'; label.style.cssText = 'font-size:0.9em;color:#ccc;';
    var input = document.createElement('input'); input.type = 'number'; input.min = '0'; input.step = '1'; input.value = current.PULSE_THRESHOLD_PX; input.style.cssText = 'width:5em;font-size:1em;padding:0.2em 0.3em;background:#333;color:#fff;border:1px solid #555;border-radius:4px;text-align:center;';
    input.addEventListener('input', function () { var v = parseFloat(input.value); if (isNaN(v)) return; window.setSscSetting({ PULSE_THRESHOLD_PX: v }); }); row.appendChild(label); row.appendChild(input); panel.appendChild(row); }
// 下のハメ図の帯の高さ(画面の高さに対する割合)。設定の BOTTOM_BAND_LEVEL(5段階 1=20% 2=25% 3=30%(初め・今まで) 4=35% 5=40%)。帯の上が配索経路(と端末番号の札の行)
// 構成番号のページ(.bottomImage に data-current-composition がある)と端末番号-.html(bottomBandPage)。他のページは 30% のまま。配置は sscSettings を作るより前に決まるので localStorage を直接読む。1 回読んだら覚えておく(.r)
var BOTTOM_BAND_RATIOS = [0.2, 0.25, 0.3, 0.35, 0.4];
function bottomBandRatio() { if (bottomBandRatio.r !== undefined) return bottomBandRatio.r; var lv = 3; try { var st = JSON.parse(localStorage.getItem(sscSettingsKey())) || {}; if (st.BOTTOM_BAND_LEVEL >= 1 && st.BOTTOM_BAND_LEVEL <= 5 && st.BOTTOM_BAND_LEVEL % 1 === 0) lv = st.BOTTOM_BAND_LEVEL; } catch (e) {}
    var r = bottomBandPage() ? [0.2, 0.25, 0.3, 0.35, 0.4][lv - 1] : 0.3; bottomBandRatio.r = r; document.documentElement.style.setProperty('--bottom-band', (r * 100) + 'vh'); return r; }
// 設定モーダルに 1 行足す(切り出しの切替の上)。5 つの小さい画面の見本(白い枠が画面、下の白く塗った所が下のハメ図の帯。下に %)。選んだ見本は緑の枠。選んだら、構成番号のページと端末番号-.html は配置し直す為に読み直し、読み直した後に設定モーダルを開き直す
function appendBottomBandSetting(panel, current) { var row = document.createElement('div'); row.style.cssText = 'display:flex;flex-direction:column;gap:0.4em;margin-bottom:0.9em;'; var label = document.createElement('span'); label.textContent = '下のハメ図の高さ'; label.style.cssText = 'font-size:0.9em;color:#ccc;white-space:nowrap;'; row.appendChild(label);
    var choices = document.createElement('div'); choices.style.cssText = 'display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none;'; var items = [];
    function mark(level) { items.forEach(function (it, k) { it.style.outline = (k + 1 === level) ? '0.15em solid #00C853' : 'none'; }); }
    BOTTOM_BAND_RATIOS.forEach(function (r, k) { var lv = k + 1, item = document.createElement('div'); item.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px 5px;border-radius:5px;cursor:pointer;';
        item.innerHTML = '<div style="position:relative;width:44px;height:30px;box-sizing:border-box;border:2px solid #ddd;border-radius:3px;overflow:hidden;"><div style="position:absolute;left:0;right:0;bottom:0;height:' + (r * 100) + '%;background:#ddd;"></div></div><span style="font-size:0.75em;color:#ccc;line-height:1;">' + Math.round(r * 100) + '%</span>';
        item.addEventListener('click', function () { window.setSscSetting({ BOTTOM_BAND_LEVEL: lv }); mark(lv); if (bottomBandPage() && bottomBandRatio() !== r) { try { sessionStorage.setItem('ssc_reopen_settings', '1'); } catch (e) {} setTimeout(function () { location.reload(); }, 250); } }); choices.appendChild(item); items.push(item); });
    mark(current.BOTTOM_BAND_LEVEL || 3); row.appendChild(choices); panel.appendChild(row); }
// 設定の QR(QR コードの印刷ページの「設定」)。読み取り欄で読むと設定を変えて保存する(歯車で変えた時と同じ setSscSetting)。英小文字と数字だけ(バーコードリーダーが記号を打ち間違えない様に)
// cfgband1-5(下のハメ図の高さ) / cfgstripe1-5(ストライプ) / cfgroute1-5(経路の見せ方) / cfgfirst2-6(先ハメの表現) / cfgsmall1-3(配索経路上の小さいハメ図の点滅) / cfgsmallsync1-2(その点滅のタイミング) / cfgcropon・cfgcropoff(文字が小さい時は穴の周りだけ表示) / cfgpulse10・20・30・40(パルスが出るCAVサイズの上限) / cfgreset(全部を標準) / cfgmenu(設定を開く)
// 配置が変わる物(下のハメ図の高さ・切り出し・標準に戻す)は、下のハメ図があるページでは読み直す(読み直した後に知らせる)。cfg で始まって当てはまらない時は知らせるだけ
function sscSettingCommand(cmd) { var m = /^cfg([a-z]+)(\d*)$/.exec(cmd); if (!m) return false; var k = m[1], v = m[2] === '' ? null : parseInt(m[2], 10), p = null, msg = '', relayout = false; document.myform.txtb.value = '';
    if (k === 'band' && v >= 1 && v <= 5) { p = { BOTTOM_BAND_LEVEL: v }; msg = '下のハメ図の高さ ' + v + '(' + Math.round(BOTTOM_BAND_RATIOS[v - 1] * 100) + '%)'; relayout = bottomBandPage(); }
    else if (k === 'stripe' && v >= 1 && v <= 5) { p = { STRIPE_LEVEL: v }; msg = 'ストライプ ' + v; } else if (k === 'route' && v >= 1 && v <= 5) { p = { ROUTE_STYLE: v }; msg = '経路の見せ方 ' + v + '(' + ROUTE_STYLES[v - 1] + ')'; } else if (k === 'first' && v >= 1 && v <= 6) { if (v === 1) v = 2; p = { FIRST_INSERT_STYLE: v }; msg = '先ハメの表現 ' + v + '(' + FIRST_INSERT_STYLES[v - 1] + ')'; } else if (k === 'small' && v >= 1 && v <= 3) { p = { SMALL_BLINK_STYLE: v }; msg = '小さいハメ図の点滅 ' + v + '(' + SMALL_BLINK_STYLES[v - 1] + ')'; } else if (k === 'smallsync' && (v === 1 || v === 2)) { p = { SMALL_BLINK_SYNC: v === 2 }; msg = '小さいハメ図の点滅のタイミング: ' + SMALL_BLINK_SYNCS[v - 1]; }
    else if ((k === 'cropon' || k === 'cropoff') && v === null) { p = { BOTTOM_CROP: k === 'cropon' }; msg = '文字が小さい時は穴の周りだけ表示: ' + (k === 'cropon' ? '入' : '切'); relayout = !!document.querySelector('.bottomImage'); }
    else if (k === 'pulse' && [10, 20, 30, 40].indexOf(v) !== -1) { p = { PULSE_THRESHOLD_PX: v }; msg = 'パルスが出るCAVサイズの上限 ' + v + 'px'; }
    else if (k === 'reset' && v === null) { p = { PULSE_THRESHOLD_PX: DEFAULT_PULSE_THRESHOLD_PX, STRIPE_LEVEL: DEFAULT_STRIPE_LEVEL, BOTTOM_CROP: true, BOTTOM_BAND_LEVEL: 3, ROUTE_STYLE: 1, FIRST_INSERT_STYLE: DEFAULT_FIRST_INSERT_STYLE, SMALL_BLINK_STYLE: DEFAULT_SMALL_BLINK_STYLE, SMALL_BLINK_SYNC: false }; msg = '全部を標準に戻しました'; relayout = !!document.querySelector('.bottomImage'); }
    else if (k === 'menu' && v === null) { openSscSettingsModal(); return true; }
    else { sscToast('この設定の QR は使えません: ' + cmd); return true; }
    window.setSscSetting(p); if (relayout) { try { sessionStorage.setItem('ssc_setting_toast', '設定: ' + msg); } catch (e) {} location.reload(); return true; } sscToast('設定: ' + msg); return true; }
// 画面の上の真ん中に 2.5 秒だけ知らせを出す
function sscToast(msg) { var t = document.createElement('div'); t.textContent = msg; t.style.cssText = 'position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:5000;background:rgba(0,0,0,0.85);color:#fff;border:2px solid #00C853;border-radius:8px;padding:0.6em 1.4em;font:bold 20px/1.4 MPLUS1p, sans-serif;pointer-events:none;transition:opacity 0.4s;';
    document.body.appendChild(t); setTimeout(function () { t.style.opacity = '0'; }, 2100); setTimeout(function () { t.remove(); }, 2600); }
window.addEventListener('load', function () { var m = null; try { m = sessionStorage.getItem('ssc_setting_toast'); sessionStorage.removeItem('ssc_setting_toast'); } catch (e) {} if (m) sscToast(m); });
// 下のハメ図の高さ(BOTTOM_BAND_LEVEL)が効くページ: 構成番号のページ(.bottomImage に data-current-composition がある)と端末番号-.html
function bottomBandPage() { return !!(document.querySelector('.bottomImage[data-current-composition]') || /\/\d+-\.html$/.test(window.location.pathname)); }
// ジョイントの子のページ(jointInfoData の self が子の 1 本): 配索経路の線(#route)を繋いで、基線(両端の端末の間)・今の電線(◆ から行先の端末まで)・他の子の道を求める。基線のページ(self が parent)は子の道だけ求める(parentPage)。基線が無いジョイント(子が全部 片側だけ皮むきで圧着。parent が null)は、基線を描かない(side は '#J')
// ◆ の位置(jointPos。配索経路の %)は一番近い配索経路の線の上に置いて、その線を 2 つに分けてから道を探す(一番短い道)。道は配索経路の % の点の並び。1 度だけ求める
function jointChildRoute() { if (jointChildRoute.r !== undefined) return jointChildRoute.r; jointChildRoute.r = null; var j = readJointInfo(); if (!j || !j.members || !j.jointPos || !j.jointPos.length) return null; var onParent = !!(j.parent && j.parent.composition === j.self);
    var ends = j.parent ? (j.parent.oppositeTerminal || '').split('-') : [], t1 = jointRouteTerm(ends[0]), t2 = jointRouteTerm(ends[1]); if (j.parent && (ends.length !== 2 || !t1 || !t2)) return null;
    var edges = []; document.querySelectorAll('line[id^="route"]').forEach(function (l) { edges.push({ a: { x: parseFloat(l.getAttribute('x1')), y: parseFloat(l.getAttribute('y1')) }, b: { x: parseFloat(l.getAttribute('x2')), y: parseFloat(l.getAttribute('y2')) } }); });
    var spots = {}; j.jointPos.forEach(function (p) { var k = 'p' + p.x + '_' + p.y; if (!spots[k]) spots[k] = jointRouteSplit(edges, { x: parseFloat(p.x), y: parseFloat(p.y) }); spots['c' + p.composition] = spots[k]; });
    var me = null, others = []; j.members.forEach(function (m) { var sp = spots['c' + m.composition], tt = jointRouteTerm(m.oppositeTerminal); if (!sp || !tt) return; var path = jointRoutePath(edges, sp, tt); if (!path) return; if (m.composition === j.self) me = { w: m, spot: sp, path: path }; else others.push({ w: m, path: path }); });
    if (onParent) { if (!others.length) return null; jointChildRoute.r = { j: j, parentPage: true, side: null, others: others }; return jointChildRoute.r; }
    if (!j.parent) { if (!me) return null; jointChildRoute.r = { j: j, self: j.self, side: '#J', base: null, me: me, others: others }; return jointChildRoute.r; }
    var base = jointRoutePath(edges, t1, t2); if (!me || !base) return null;
    jointChildRoute.r = { j: j, self: j.self, side: ends[0] === j.selfTerminal ? ends[1] : ends[0], base: base, me: me, others: others }; return jointChildRoute.r; }
// 端末の札(配索経路の %)。基線の端末・行先の端末の位置
function jointRouteTerm(n) { var b = n ? findTerminalTag(n, false) : null; if (!b || !b.getAttribute('data-x')) return null; return { x: parseFloat(b.getAttribute('data-x')), y: parseFloat(b.getAttribute('data-y')) }; }
function jointRouteKey(p) { return Math.round(p.x * 100) + '_' + Math.round(p.y * 100); }
// 点 p を一番近い線の上に置いて、その線を 2 つに分ける(分けた所が道の角になる)
function jointRouteSplit(edges, p) { var best = null, bd = Infinity; edges.forEach(function (e, i) { var dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((p.x - e.a.x) * dx + (p.y - e.a.y) * dy) / L)) : 0, q = { x: e.a.x + dx * t, y: e.a.y + dy * t }, d = (q.x - p.x) * (q.x - p.x) + (q.y - p.y) * (q.y - p.y); if (d < bd) { bd = d; best = { i: i, q: q, t: t }; } });
    if (!best) return p; var e = edges[best.i]; if (best.t > 0.001 && best.t < 0.999) edges.splice(best.i, 1, { a: e.a, b: best.q }, { a: best.q, b: e.b }); return best.t <= 0.001 ? e.a : (best.t >= 0.999 ? e.b : best.q); }
// from から to までの一番短い道(配索経路の線だけを通る)。無ければ null
function jointRoutePath(edges, from, to) { var adj = {}; edges.forEach(function (e) { var ka = jointRouteKey(e.a), kb = jointRouteKey(e.b), w = Math.sqrt((e.a.x - e.b.x) * (e.a.x - e.b.x) + (e.a.y - e.b.y) * (e.a.y - e.b.y)); (adj[ka] = adj[ka] || []).push({ k: kb, p: e.b, w: w }); (adj[kb] = adj[kb] || []).push({ k: ka, p: e.a, w: w }); });
    var s = jointRouteKey(from), t = jointRouteKey(to), dist = {}, prev = {}, pt = {}, done = {}; dist[s] = 0; pt[s] = from;
    while (true) { var u = null; for (var k in dist) if (!done[k] && (u === null || dist[k] < dist[u])) u = k; if (u === null || u === t) break; done[u] = true; (adj[u] || []).forEach(function (n) { var nd = dist[u] + n.w; if (dist[n.k] === undefined || nd < dist[n.k]) { dist[n.k] = nd; prev[n.k] = u; pt[n.k] = n.p; } }); }
    if (dist[t] === undefined) return null; var pts = [], c = t; while (c !== s) { pts.unshift(pt[c]); c = prev[c]; } pts.unshift(from); return pts; }
// ジョイントの子のページ: VBA が書いた今の点滅(基線の端末から行先までの線)を消して、◆ から行先までの線に描き直す(線の色と太さは今の点滅と同じ。点滅が無い時は 電線の色 6.5(黒い電線は白)・4・縞 1)
// 基線は細い芯(電線の色 3・縞 1)と、縁(薄い白 9・黒 6)の上に ◆ から両端の端末へ流れる白い点線(下のハメ図の基線の点線と同じ jointFlowBig)。基線と今の電線は配索経路の線より前
// 他の子の行先までの線は、電線の色の実線(太さ 6。サブの経路の点線(太さ 3)の両側に色がはみ出して見える様に)に縞の色の芯(太さ 2)を重ねて、配索経路の線より奥に描く。黒い電線など暗い色は、黒い背景で見えないので白で描く。基線のページは、この子の線だけを描く(基線の点滅は今まで通り)。基線のページの子の線は、基線の点滅の線から離れる所から描く(重なる所に描くと、基線が消えた時も子の線が見えて、そこだけ点滅していない様に見える)
// placeCompositionTerminalTags の最初に呼ぶ(下の札の横線は点滅している線の幅で引くので、その前に描き直す)
function drawJointChildRoute() { if (drawJointChildRoute.done) return; drawJointChildRoute.done = true; var r = jointChildRoute(), old = document.querySelectorAll('line.blinkWire'), route = document.getElementById('route1'); if (!r || !route || (r.parentPage && !old.length)) return; route = route.ownerSVGElement; var layers = [], seen = {};
    if (!r.parentPage) old.forEach(function (ln) { var k = ln.getAttribute('stroke') + '|' + ln.getAttribute('stroke-width'); if (!seen[k]) { seen[k] = true; layers.push({ stroke: ln.getAttribute('stroke'), width: ln.getAttribute('stroke-width'), dash: ln.getAttribute('stroke-dasharray') }); } ln.parentNode.removeChild(ln); });
    if (!r.parentPage && !layers.length) { var mc = r.me.w.color || '#FE5151', mm = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(mc), dark = mm ? parseInt(mm[1], 16) * 0.299 + parseInt(mm[2], 16) * 0.587 + parseInt(mm[3], 16) * 0.114 < 40 : false; layers = [{ stroke: dark ? '#FFFFFF' : mc, width: 6.5 }, { stroke: mc, width: 4 }, { stroke: r.me.w.bgColor || mc, width: 1 }]; }
    function seg(pts, attrs, before) { for (var i = 1; i < pts.length; i++) { var l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l.setAttribute('x1', pts[i - 1].x + '%'); l.setAttribute('y1', pts[i - 1].y + '%'); l.setAttribute('x2', pts[i].x + '%'); l.setAttribute('y2', pts[i].y + '%'); l.setAttribute('stroke-linecap', 'round'); for (var k in attrs) if (attrs[k]) l.setAttribute(k, attrs[k]); if (before) route.insertBefore(l, before); else route.appendChild(l); } }
    var first = route.firstChild, bseg = r.parentPage ? [].map.call(old, function (ln) { return ['x1', 'y1', 'x2', 'y2'].map(function (n) { return parseFloat(ln.getAttribute(n)); }); }) : []; function onBase(q) { var x = +q.x, y = +q.y; return bseg.some(function (s) { var dx = s[2] - s[0], dy = s[3] - s[1], L = dx * dx + dy * dy, u = L ? ((x - s[0]) * dx + (y - s[1]) * dy) / L : 0, ex, ey; if (u < -0.01 || u > 1.01) return false; ex = s[0] + u * dx - x; ey = s[1] + u * dy - y; return ex * ex + ey * ey < 0.04; }); } r.others.forEach(function (o) { var oc = o.w.color || '#FFFFFF', om = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(oc), od = om ? parseInt(om[1], 16) * 0.299 + parseInt(om[2], 16) * 0.587 + parseInt(om[3], 16) * 0.114 < 40 : false, op = o.path, k = 0; if (bseg.length) { while (k < op.length - 1 && onBase(op[k]) && onBase(op[k + 1])) k++; op = op.slice(k); } seg(op, { stroke: od ? '#FFFFFF' : oc, 'stroke-width': 6 }, first); if (o.w.bgColor && o.w.bgColor.toUpperCase() !== oc.toUpperCase()) seg(op, { stroke: o.w.bgColor, 'stroke-width': 2 }, first); }); if (r.parentPage) return;
    if (!r.base) { layers.forEach(function (ly) { seg(r.me.path, { 'class': 'line blinkWire', stroke: ly.stroke, 'stroke-width': ly.width, 'stroke-dasharray': ly.dash }); }); return; }
    var P = r.j.parent, b = r.base, sk = jointRouteKey(r.me.spot), k = -1; b.forEach(function (p, i) { if (k < 0 && jointRouteKey(p) === sk) k = i; }); var halves = k < 0 ? [b] : [b.slice(0, k + 1).reverse(), b.slice(k)];
    seg(b, { stroke: '#FFFFFF', 'stroke-width': 9, opacity: 0.28 }); seg(b, { stroke: '#000000', 'stroke-width': 6, opacity: 0.7 }); halves.forEach(function (h) { seg(h, { stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'butt', style: 'stroke-dasharray:9 6;animation:jointFlowBig 1.6s linear infinite;' }); });
    seg(b, { stroke: P.color, 'stroke-width': 3 }); seg(b, { stroke: P.bgColor || P.color, 'stroke-width': 1 }); layers.forEach(function (ly) { seg(r.me.path, { 'class': 'line blinkWire', stroke: ly.stroke, 'stroke-width': ly.width, 'stroke-dasharray': ly.dash }); }); }
// 下の札の列の、基線の側の札(ジョイントの子のページだけ)の位置: ◆ の画面の位置(配索経路の svg の大きさで % から換算)
function jointChildRowRect(r) { var s = document.getElementById('route1').ownerSVGElement.getBoundingClientRect(); return { left: s.left + r.me.spot.x / 100 * s.width, top: s.top + r.me.spot.y / 100 * s.height, width: 0, height: 0 }; }
// 構成番号の経路(line.blinkWire)の見せ方。設定の ROUTE_STYLE(1=標準(点滅。初め) 2=大粒が流れる 3=矢印が流れる 4=鼓動 5=電気が走る)
// 2-5 は経路を点いたままにして、経路に沿って飾りを描く(始まり → 終わり = 最後の .term の端末の方へ)。親・子のジョイントの経路(blinkWire でない線)は触らない
// サブ経路の緑の点線(#00FF66)は経路より前(下)に描いてあり、点いたままの経路に隠れるので、2-5 では写して経路のすぐ上に置く
// 重なり(下から): 鼓動・電気の飾り → 緑の点線(元) → 経路 → 緑の点線(写し) → 大粒 … 大粒は緑の写しの下、矢印は一番上
// ジョイントの子のページの基線(drawJointChildRoute が経路のすぐ前に描く、class の無い線の束。白い点線 jointFlowBig を含む)は、2-5 では経路が点いたままで隠れるので、
// 基線には触らず、経路(と緑の写し)を基線の束のすぐ前(下)へ移す。基線の見た目と動きは標準の時と同じ。大粒・矢印は基線の上。1 標準に戻したら経路を元の所へ戻す
var ROUTE_STYLES = ['標準', '大粒', '矢印', '鼓動', '電気'];
var ROUTE_NS = 'http://www.w3.org/2000/svg';
(function () { var st = document.createElement('style'); st.textContent = [
    'html[data-route-style]:not([data-route-style="1"]) line.blinkWire:not(.routePrev) { animation: none; opacity: 1; }',
    'html[data-route-style]:not([data-route-style="1"]) line.blinkWire[stroke-width="1"]:not(.routePrev) { opacity: .5; }',
    '.routeFx { pointer-events: none; }',
    '@keyframes routeBig { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -24; } }',
    '.routeBig { animation: routeBig .6s linear infinite; }',
    '@keyframes routeBigS { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -12; } }',
    '.routeBig.routeS { animation-name: routeBigS; }',
    '@keyframes routeBeat { 0%, 40%, 100% { stroke-width: 6.5px; opacity: 0; } 8% { stroke-width: 15px; opacity: .9; } 16% { stroke-width: 8px; opacity: .5; } 24% { stroke-width: 12px; opacity: .8; } }',
    '.routeBeat { animation: routeBeat .65s ease-out infinite; }',
    '@keyframes routeBeatS { 0%, 40%, 100% { stroke-width: 4px; opacity: 0; } 8% { stroke-width: 10px; opacity: .9; } 16% { stroke-width: 5px; opacity: .5; } 24% { stroke-width: 8px; opacity: .8; } }',
    '.routeBeat.routeS { animation-name: routeBeatS; }'
].join('\n'); document.head.appendChild(st); })();
function routeEl(tag, attrs) { var e = document.createElementNS(ROUTE_NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
// 経路の区間(重ねて描いた線は同じ座標なので 1 つにまとめる。座標は % なので baseVal.value で px)を端と端でつなぎ、道筋(点の列)にする。つながらない所は別の道筋
function routeChains(lines, endHint) {
    var segs = [], seen = {};
    lines.forEach(function (ln) { var a = [ln.x1.baseVal.value, ln.y1.baseVal.value], b = [ln.x2.baseVal.value, ln.y2.baseVal.value], k = [a, b].map(function (p) { return Math.round(p[0]) + ',' + Math.round(p[1]); }).sort().join('|'); if (!seen[k]) { seen[k] = 1; segs.push([a, b]); } });
    function near(p, q) { return Math.abs(p[0] - q[0]) < 1.5 && Math.abs(p[1] - q[1]) < 1.5; }
    function degree(p) { var n = 0; segs.forEach(function (s) { if (near(s[0], p)) n++; if (near(s[1], p)) n++; }); return n; }
    var chains = [];
    while (segs.length) {
        var ends = []; segs.forEach(function (s) { s.forEach(function (p) { if (degree(p) === 1) ends.push(p); }); });
        if (!ends.length) ends = [segs[0][0]];
        if (endHint) ends.sort(function (p, q) { return Math.hypot(q[0] - endHint.x, q[1] - endHint.y) - Math.hypot(p[0] - endHint.x, p[1] - endHint.y); });
        var cur = ends[0], pts = [cur], moved = true;
        while (moved) { moved = false; for (var j = 0; j < segs.length; j++) { var s = segs[j], nx = near(s[0], cur) ? s[1] : (near(s[1], cur) ? s[0] : null); if (nx) { segs.splice(j, 1); pts.push(nx); cur = nx; moved = true; break; } } }
        if (pts.length > 1) chains.push(pts); else segs.shift();
    }
    return chains;
}
function routePathD(pts) { return 'M ' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' L '); }
function routeLength(svg, d) { var t = routeEl('path', { d: d }); svg.appendChild(t); var l = t.getTotalLength(); svg.removeChild(t); return l; }
// 道筋 pts を step px ごとに区切り、左右に最大 amp px ずらしたギザギザ(電気)
function routeZigzag(pts, step, amp) { var out = [];
    for (var s = 0; s + 1 < pts.length; s++) { var a = pts[s], b = pts[s + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L, n = Math.max(1, Math.round(L / step));
        for (var i = 0; i < n; i++) { var f = i / n, o = (Math.random() * 2 - 1) * amp; out.push((a[0] + (b[0] - a[0]) * f + nx * o).toFixed(1) + ',' + (a[1] + (b[1] - a[1]) * f + ny * o).toFixed(1)); } }
    var e = pts[pts.length - 1]; out.push(e[0].toFixed(1) + ',' + e[1].toFixed(1)); return out.join(' '); }
// 電気は 0.08 秒ごとに作り直す(本物の経路も設定の見本も 1 つのタイマーで。画面から外れた物は外す)
var routeSparks = [], routeSparkTimer = null;
function routeSparkTick() { routeSparks = routeSparks.filter(function (s) { return document.body.contains(s.el); }); routeSparks.forEach(function (s) { s.el.setAttribute('points', routeZigzag(s.pts, s.step, s.amp)); }); if (!routeSparks.length) { clearInterval(routeSparkTimer); routeSparkTimer = null; } }
// 道筋 1 本に飾りを描く。k は大きさ(本物 1、設定の見本は小さく)。green は写した緑の点線(大粒はその下に入れる)、under は鼓動・電気を入れる所(緑の点線(元)の前)
function drawRouteFx(svg, pts, color, style, k, green, under) {
    var d = routePathD(pts), len = routeLength(svg, d), fx = [];
    function add(e, before) { e.classList.add('routeFx'); if (before) svg.insertBefore(e, before); else svg.appendChild(e); fx.push(e); return e; }
    if (style === 2) {
        // 粒の間は 24px(見本は 12px。どちらも 0.6 秒で 1 つ分進む)
        var gap = k === 1 ? 24 : 12, cls = 'routeBig' + (k !== 1 ? ' routeS' : '');
        add(routeEl('path', { d: d, fill: 'none', stroke: '#000', 'stroke-width': 11 * k, 'stroke-linecap': 'round', 'stroke-dasharray': '0 ' + gap, 'class': cls }), green);
        add(routeEl('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 7.5 * k, 'stroke-linecap': 'round', 'stroke-dasharray': '0 ' + gap, 'class': cls }), green);
    } else if (style === 3) {
        var n = Math.max(2, Math.round(len / (34 * k))), dur = len / (60 * k);
        for (var i = 0; i < n; i++) {
            var g = routeEl('g', {}), c = 'M ' + (-4 * k) + ',' + (-6 * k) + ' L ' + (3 * k) + ',0 L ' + (-4 * k) + ',' + (6 * k);
            g.appendChild(routeEl('path', { d: c, fill: 'none', stroke: '#000', 'stroke-width': 5 * k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
            g.appendChild(routeEl('path', { d: c, fill: 'none', stroke: '#fff', 'stroke-width': 2.5 * k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
            g.appendChild(routeEl('animateMotion', { path: d, dur: dur.toFixed(2) + 's', begin: (-dur * i / n).toFixed(2) + 's', repeatCount: 'indefinite', rotate: 'auto', calcMode: 'paced' }));
            add(g);
        }
    } else if (style === 4) {
        add(routeEl('path', { d: d, fill: 'none', stroke: color, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'class': 'routeBeat' + (k !== 1 ? ' routeS' : '') }), under);
    } else if (style === 5) {
        [['#FFF59D', 2 * k, 1], ['#fff', 1 * k, .8]].forEach(function (z) { var e = add(routeEl('polyline', { fill: 'none', stroke: z[0], 'stroke-width': z[1], 'stroke-linejoin': 'round', opacity: z[2] }), under); var s = { el: e, pts: pts, step: 9 * k, amp: 10 * k }; e.setAttribute('points', routeZigzag(pts, s.step, s.amp)); routeSparks.push(s); });
        if (!routeSparkTimer) routeSparkTimer = setInterval(routeSparkTick, 80);
    }
    return fx;
}
// 設定どおりに、このページの経路を描き直す(前の飾りと緑の点線の写しは消す)
function applyRouteStyle() {
    var style = (typeof sscSettings !== 'undefined' && sscSettings.ROUTE_STYLE) || 1;
    document.documentElement.setAttribute('data-route-style', style);
    [].forEach.call(document.querySelectorAll('.routeFx:not(.routePrevFx)'), function (e) { e.parentNode.removeChild(e); });
    [].forEach.call(document.querySelectorAll('svg'), function (s) { var b = s.routeBaseLast; if (!b) return; s.routeBaseLast = null; var nx = b.nextSibling; [].forEach.call(s.querySelectorAll('line.blinkWire:not(.routePrev)'), function (ln) { s.insertBefore(ln, nx); }); });
    if (style === 1) return;
    var bySvg = []; [].forEach.call(document.querySelectorAll('line.blinkWire:not(.routePrev)'), function (ln) { var s = ln.ownerSVGElement; if (!s) return; var o = bySvg.filter(function (x) { return x.svg === s; })[0]; if (!o) { o = { svg: s, lines: [] }; bySvg.push(o); } o.lines.push(ln); });
    var terms = document.querySelectorAll('.term'), lastTag = terms.length ? findTerminalTag(terms[terms.length - 1].getAttribute('data-terminal'), true) : null;
    bySvg.forEach(function (o) {
        var svg = o.svg, hint = null;
        if (lastTag && svg.getScreenCTM()) { var r = lastTag.getBoundingClientRect(), p = svg.createSVGPoint(); p.x = r.left + r.width / 2; p.y = r.top + r.height / 2; hint = p.matrixTransform(svg.getScreenCTM().inverse()); }
        var base = [], e = o.lines[0].previousSibling; while (e && e.nodeType !== 1) e = e.previousSibling; while (e && e.tagName.toLowerCase() === 'line' && !e.getAttribute('class')) { base.unshift(e); e = e.previousSibling; while (e && e.nodeType !== 1) e = e.previousSibling; }
        if (!base.some(function (b) { return /jointFlowBig/.test(b.getAttribute('style') || ''); })) base = [];
        if (base.length) { svg.routeBaseLast = base[base.length - 1]; o.lines.forEach(function (ln) { svg.insertBefore(ln, base[0]); }); }
        var greens = svg.querySelectorAll('line[stroke="#00FF66"], line[stroke="#00ff66"]'), under = greens[0] || o.lines[0], last = o.lines[o.lines.length - 1], after = last.nextSibling, firstCopy = null;
        [].forEach.call(greens, function (g) { var c = g.cloneNode(false); c.removeAttribute('id'); c.classList.add('routeFx'); svg.insertBefore(c, after); if (!firstCopy) firstCopy = c; });
        routeChains(o.lines, hint).forEach(function (pts) { drawRouteFx(svg, pts, o.lines[0].getAttribute('stroke') || '#F00000', style, 1, base.length ? null : (firstCopy || after), under); });
    });
}
window.addEventListener('load', function () { setTimeout(applyRouteStyle, 300); });
// 設定モーダルの「経路の見せ方」。5 つの小さい見本(赤い経路の上を緑の点線のサブ経路が通る)を並べて、選んだ物は緑の枠。選んだらこのページの経路もすぐ変わる
function appendRouteStyleSetting(panel, current) { var row = document.createElement('div'); row.style.cssText = 'display:flex;flex-direction:column;gap:0.4em;margin-bottom:0.9em;'; var label = document.createElement('span'); label.textContent = '経路の見せ方'; label.style.cssText = 'font-size:0.9em;color:#ccc;white-space:nowrap;'; row.appendChild(label);
    var choices = document.createElement('div'); choices.style.cssText = 'display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none;'; var items = [];
    function mark(st) { items.forEach(function (it, k) { it.firstChild.style.outline = (k + 1 === st) ? '0.15em solid #00C853' : '1px solid #555'; }); }
    ROUTE_STYLES.forEach(function (name, i) { var st = i + 1, item = document.createElement('div'); item.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0.25em;cursor:pointer;';
        var svg = routeEl('svg', { width: 64, height: 40, viewBox: '0 0 64 40' }); svg.style.cssText = 'position:static;display:block;background:#000;border-radius:4px;overflow:hidden;';
        var pts = [[6, 8], [30, 8], [44, 32], [60, 32]];
        svg.appendChild(routeEl('line', { x1: 30, y1: 8, x2: 30, y2: 38, stroke: '#00FF66', 'stroke-width': 2, 'stroke-dasharray': 2 }));
        for (var s = 0; s + 1 < pts.length; s++) { var ln = routeEl('line', { x1: pts[s][0], y1: pts[s][1], x2: pts[s + 1][0], y2: pts[s + 1][1], stroke: '#F00000', 'stroke-width': 4, 'class': 'routePrev' + (st === 1 ? ' blinkWire' : '') }); svg.appendChild(ln); }
        var copy = null; if (st !== 1) { copy = routeEl('line', { x1: 30, y1: 8, x2: 30, y2: 38, stroke: '#00FF66', 'stroke-width': 2, 'stroke-dasharray': 2 }); svg.appendChild(copy); }
        item.appendChild(svg); var cap = document.createElement('span'); cap.textContent = name; cap.style.cssText = 'font-size:0.75em;color:#ccc;line-height:1;'; item.appendChild(cap);
        item.addEventListener('click', function () { window.setSscSetting({ ROUTE_STYLE: st }); mark(st); });
        choices.appendChild(item); items.push(item);
        // 見本の飾りは svg が画面に入ってから描く(長さを測るため)
        setTimeout(function () { drawRouteFx(svg, pts, '#F00000', st, 0.6, copy, svg.firstChild).forEach(function (e) { e.classList.add('routePrevFx'); }); }, 0);
    });
    mark(current.ROUTE_STYLE || 1); row.appendChild(choices); panel.appendChild(row); }
// 先ハメ(電線のサブ番号と端末のサブ番号が同じ)の穴の表現。設定の FIRST_INSERT_STYLE(2=枠 10%(初め) 3=枠 13% 6=回る点線 4=「先」の印 5=三角。並べる順は FIRST_INSERT_ORDER)。色は #FE5151
// 2・3: 穴の内側に枠(太さは穴の幅と高さの短い方 × 10% / 13%)。6: 穴の内側に白い枠と、その上を回る赤い点線(太さは短い方 × 4.5%、最低 1.25px)。4: 穴の左上に丸の「先」(白い字・白い縁 1px)。5: 穴の右上に三角。1(枠 7%)は無くした(番号は前に保存した設定と印刷した設定の QR に合わせて変えず、1 は 2 にする)
// 下のハメ図の穴(.imageBoxDot.firstInsertHole)は main.js の読み込み中に作られるので、load の後と設定を変えた時に付け直す。data-fi-m = 穴の短い辺の px
// 端末番号のページの穴(.blinkHole.firstInsertHole)は穴そのものに色があるので、枠も穴に付ける。穴は overflow: hidden なので、4・5 の時だけ visible にする
// 180 度回るハメ図の穴(data-fi-rot)は、回った後に左上・右上に見える様に、反対の角に置いて印も 180 度回す
var FIRST_INSERT_STYLES = ['枠 7%', '枠 10%', '枠 13%', '先', '三角', '回る点線'], FIRST_INSERT_ORDER = [2, 3, 6, 4, 5], FIRST_INSERT_COLOR = '#FE5151';
function firstInsertMark(dot, m, st) { var bg = dot.querySelector('.blinkStripeBox') || dot, rot = dot.getAttribute('data-fi-rot') === '1'; bg.style.boxShadow = ''; if (bg === dot) dot.style.overflow = st === 4 || st === 5 ? 'visible' : ''; [].forEach.call(dot.querySelectorAll('.firstInsertMark'), function (e) { e.parentNode.removeChild(e); });
    if (st <= 3) { bg.style.boxShadow = 'inset 0 0 0 ' + (m * [0.07, 0.1, 0.13][st - 1]) + 'px ' + FIRST_INSERT_COLOR; return; } var e = document.createElement('div'); e.className = 'firstInsertMark';
    if (st === 6) { var br = dot.style.borderRadius || bg.style.borderRadius, r = /%$/.test(br) ? parseFloat(br) : 0, w = Math.max(1.25, m * 0.045) * 2, rc = '<rect x="0" y="0" width="100" height="100" rx="' + r + '" ry="' + r + '" fill="none" stroke-width="' + w + '" vector-effect="non-scaling-stroke" pathLength="100" '; e.style.cssText = 'position:absolute;inset:0;z-index:5;pointer-events:none;'; e.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;left:0;top:0;width:100%;height:100%;display:block;overflow:hidden;">' + rc + 'stroke="#FFFFFF"/>' + rc + 'class="firstInsertDash" stroke="' + FIRST_INSERT_COLOR + '" stroke-dasharray="5.5 2.8333"/></svg>'; } else if (st === 4) { var s = Math.max(14, m * 0.38); e.textContent = '先'; e.style.cssText = 'position:absolute;z-index:5;pointer-events:none;box-sizing:border-box;display:flex;align-items:center;justify-content:center;border-radius:50%;background:' + FIRST_INSERT_COLOR + ';color:#FFF;text-shadow:none;border:1px solid #FFF;font-family:MPLUS1p,sans-serif;font-weight:bold;line-height:1;' + (rot ? 'right' : 'left') + ':' + (-s * 0.3) + 'px;' + (rot ? 'bottom' : 'top') + ':' + (-s * 0.3) + 'px;' + (rot ? 'transform:rotate(180deg);' : '') + 'width:' + s + 'px;height:' + s + 'px;font-size:' + Math.max(10, s * 0.68) + 'px;'; }
    else { var t = Math.max(10, m * 0.35); e.style.cssText = 'position:absolute;z-index:5;pointer-events:none;' + (rot ? 'left:0;bottom:0;transform:rotate(180deg);' : 'right:0;top:0;') + 'width:0;height:0;border-style:solid;border-width:0 ' + t + 'px ' + t + 'px 0;border-color:transparent ' + FIRST_INSERT_COLOR + ' transparent transparent;'; }
    dot.appendChild(e); }
function applyFirstInsertStyle() { var st = (typeof sscSettings !== 'undefined' && sscSettings.FIRST_INSERT_STYLE) || DEFAULT_FIRST_INSERT_STYLE; [].forEach.call(document.querySelectorAll('.firstInsertHole'), function (d) { firstInsertMark(d, parseFloat(d.getAttribute('data-fi-m')) || 0, st); }); }
window.addEventListener('load', function () { setTimeout(applyFirstInsertStyle, 0); });
// 設定モーダルの「先ハメの表現」。GY の穴(灰色の地)(上 1234 / 下 1.25)の見本を 5 個並べて、選んだ物は緑の枠。選んだらこのページの穴もすぐ変わる
function appendFirstInsertSetting(panel, current) { var row = document.createElement('div'); row.style.cssText = 'display:flex;flex-direction:column;gap:0.4em;margin-bottom:0.9em;'; var label = document.createElement('span'); label.textContent = '先ハメの表現'; label.style.cssText = 'font-size:0.9em;color:#ccc;white-space:nowrap;'; row.appendChild(label);
    var choices = document.createElement('div'); choices.style.cssText = 'display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none;'; var items = [];
    function mark(st) { items.forEach(function (it, k) { it.firstChild.style.outline = (FIRST_INSERT_ORDER[k] === st) ? '0.2em solid #00C853' : '1px solid #555'; it.firstChild.style.outlineOffset = (FIRST_INSERT_ORDER[k] === st) ? '0.15em' : '0'; }); }
    FIRST_INSERT_ORDER.forEach(function (st, i) { var name = FIRST_INSERT_STYLES[st - 1], size = 48, item = document.createElement('div'); item.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0.35em;cursor:pointer;';
        var hole = document.createElement('div'); hole.style.cssText = 'position:relative;width:' + size + 'px;height:' + size + 'px;box-sizing:border-box;border-radius:10%;'; var bg = document.createElement('div'); bg.className = 'blinkStripeBox'; bg.style.cssText = 'position:absolute;inset:0;border-radius:inherit;background-color:#BABABA;border:1px solid #000000;'; hole.appendChild(bg);
        var tx = document.createElement('div'); tx.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;font-family:MPLUS1p,sans-serif;font-weight:bold;color:#000;line-height:1.1;font-size:' + (size * 0.3) + 'px;'; tx.innerHTML = holeTextHtml('1234', '1.25', ''); hole.appendChild(tx); firstInsertMark(hole, size, st);
        item.appendChild(hole); var cap = document.createElement('span'); cap.textContent = name; cap.style.cssText = 'font-size:0.75em;color:#ccc;line-height:1;'; item.appendChild(cap);
        item.addEventListener('click', function () { window.setSscSetting({ FIRST_INSERT_STYLE: st }); mark(st); }); choices.appendChild(item); items.push(item); });
    mark(current.FIRST_INSERT_STYLE || DEFAULT_FIRST_INSERT_STYLE); row.appendChild(choices); panel.appendChild(row); }
// ===== 作業者のログイン(作業者コード 例 Y01295578D00。英字 1 + 数字 8 + 英字 1 + 数字 2)。この端末の localStorage の ssc_worker に覚える =====
// 読み取り欄で作業者コードを読むとログイン。ログイン中に別のコードを読むと切り替え。名前とはまだつなげない
// 設定は作業者コード毎に分けて保存する(56ver32_setting_作業者コード。ログインしていない時は今まで通り 56ver32_setting)
// 初めてログインした作業者の設定は、その時の端末の設定(ログインしていない時の設定)を写して始める
// sscWorkerCode・sscSettingsKey は main.js の前の方(設定を読む所)から、この行より先に呼ばれるので、変数ではなく文字で書く
function sscWorkerCode() { try { return localStorage.getItem('ssc_worker') || ''; } catch (e) { return ''; } }
function sscSettingsKey() { var w = sscWorkerCode(); return w ? '56ver32_setting_' + w : '56ver32_setting'; }
function sscWorkerParse(v) { var s = String(v).trim().toUpperCase(); return /^[A-Z]\d{8}[A-Z]\d{2}$/.test(s) ? s : ''; }
// 読み取り欄の文字が作業者コードならログインして true(設定・下のハメ図の高さなどを、その作業者の設定で描き直すため読み直す)
function sscWorkerCommand(v) { var code = sscWorkerParse(v); if (!code) return false; document.myform.txtb.value = '';
    try { if (localStorage.getItem('56ver32_setting_' + code) === null) { var base = localStorage.getItem('56ver32_setting'); if (base !== null) localStorage.setItem('56ver32_setting_' + code, base); } localStorage.setItem('ssc_worker', code); } catch (e) {}
    sscSettingsPull(code, function () { location.reload(); }); return true; }
// 設定はサーバー(製品品番フォルダの 1 つ上の record/api.php。data/settings/作業者コード.json)にも保存する。ログインしている時だけ(ログインしていない時の設定は今まで通りこの端末だけ)
// 読むのはログインした時だけ(ページを開く度には読まないので、表示は待たせない)。書くのは設定を変えた時(返事は待たない)。file:// で開いた時やサーバーにつながらない時は、今まで通りこの端末(localStorage)だけで動く
function sscSettingsServer() { return /^https?:$/.test(location.protocol); }
function sscSettingsPush(st, done) { var w = sscWorkerCode(), x; if (!w || !sscSettingsServer()) { if (done) done(); return; }
    try { x = new XMLHttpRequest(); x.open('POST', '../record/api.php', true); x.setRequestHeader('Content-Type', 'application/json'); x.timeout = 1500; if (done) x.onloadend = done; x.send(JSON.stringify({ act: 'settings', worker: w, settings: st })); } catch (e) { if (done) done(); } }
// ログインした時: サーバーにその作業者の設定があれば、この端末に写してから読み直す。無ければこの端末の設定(初めての作業者は、上で写した端末の設定)をサーバーに送ってから読み直す。返事が無い時も 1.6 秒で読み直す
function sscSettingsPull(code, done) { var fin = false, x; function end() { if (!fin) { fin = true; done(); } } if (!sscSettingsServer()) { end(); return; } setTimeout(end, 1600);
    try { x = new XMLHttpRequest(); x.open('GET', '../record/api.php?act=settings&worker=' + encodeURIComponent(code) + '&_=' + Date.now(), true); x.timeout = 1500;
        x.onload = function () { var j = null, mine = null; try { j = JSON.parse(x.responseText); } catch (e) {} if (!j || !j.ok) { end(); return; }
            if (j.settings) { try { localStorage.setItem('56ver32_setting_' + code, JSON.stringify(j.settings)); } catch (e) {} end(); return; }
            try { mine = JSON.parse(localStorage.getItem('56ver32_setting_' + code)); } catch (e) {} if (mine) sscSettingsPush(mine, end); else end(); };
        x.onerror = x.ontimeout = end; x.send(); } catch (e) { end(); } }
// 配索経路の右上(ヘッダーのすぐ下の右端)に、ログイン中の作業者コードを小さく出す。ログインしていない時は「ログインしてください」。配索経路のあるページだけ
(function () { var st = document.createElement('style'); st.textContent = '#sscWorkerTag { position: fixed; right: 0; z-index: 50; font: bold 12px/1.5 Meiryo, sans-serif; padding: 0 0 0 6px; border-radius: 3px 0 0 3px; pointer-events: none; letter-spacing: .03em; }\n#sscWorkerTag.in { color: #D1D5DB; background: rgba(0, 0, 0, .6); }\n#sscWorkerTag.out { color: #000; background: #FFD400; }'; document.head.appendChild(st); })();
function sscWorkerDraw() { if (!document.getElementById('route1')) return; var el = document.getElementById('sscWorkerTag'); if (!el) { el = document.createElement('div'); el.id = 'sscWorkerTag'; document.body.appendChild(el); }
    var code = sscWorkerCode(), t = document.querySelector('table'), top = t ? t.getBoundingClientRect().bottom : 0; el.textContent = code || 'ログインしてください'; el.className = code ? 'in' : 'out'; el.style.top = (top + 4) + 'px'; }
window.addEventListener('load', sscWorkerDraw); window.addEventListener('resize', sscWorkerDraw);
// ===== 生産実績(end を読んだら 1 本の実績をサーバーに送る。製品品番フォルダの 1 つ上の record/api.php) =====
// 送る物: 作業者コード・製品品番・設変・シリアル・ネームの日付・配索の時間・結わきの時間(秒)・サブの完了数/サブの数。ログインしていない時は送らずに、ログインを促す(ログインして end をもう一度読めば送る)
// 配索の時間 = 作業していた時間の合計。タブレットで何かした時(ページを開く・画面に触る・キーや読み取り)の間の時間を足していく。
//   間が 5 分(SSC_ACTIVE_CAP_MIN)より長い時は 5 分として足す。決まった休憩時間に重なった所は足さない
// 電源: ページが動いている間は 10 秒毎に localStorage の ssc_alive に時刻を書く。開いた時にそれが SSC_ALIVE_GAP_SEC より古ければ、
//   その間は PC の電源が切れていたと見なして、配索にも結わきにも数えない(残業は人で違うので、勤務時間は決めない)
// 結わき: 配索が終わって結わき(テープ巻き)を始める時に wrap を読む。そこから end までが結わきの時間(QR を読まないので 5 分で止めない。休憩時間と電源が切れていた間は足さない)
//   結わきの時間は 10 秒毎に st.wrapAcc(ミリ秒)に足していく(st.wrapLast = 前に足した時刻)
//   wrap を読んだ時、完了したサブが サブの数 - 1 より少なければ知らせる(もう一度 wrap を読めば結わきに移る)
//   結わき中は、この品番の前の結わきの時間の平均(サーバーの直近の物)から、終わるまでの時間を予想して出す。結わき中に end を読んだら確かめる(もう一度 end で完了)
//   wrap の前に end を読んだ時も確かめる(読み間違いで完了にしない。もう一度 end で結わきの時間 0 のまま完了)
//   確かめる知らせは SSC_CONFIRM_SEC 秒たつか、ほかの物を読むと取り消し
//   休憩時間は見るページ(record/monitor.html)で変えられる。ページを開く度にサーバーから読んで localStorage の ssc_breaks に覚える(読めない時は覚えた物、それも無ければ SSC_BREAKS)
// 送れなかった実績は localStorage の ssc_record_queue に残して、次にページを開いた時に送り直す(同じ実績は記録 ID でサーバーが 1 つにする)
// サブの進み具合(完了数/サブの数・作業中のサブ・結わき)も、ページを開く度と結わき中は 1 分毎に送る(別の PC の見るページ record/monitor.html で見る)
var SSC_RECORD_URL = '../record/api.php';
var SSC_ACTIVE_CAP_MIN = 5, SSC_ALIVE_GAP_SEC = 60;
var SSC_CONFIRM_SEC = 30;
var SSC_BREAKS = [['11:45', '12:35'], ['15:00', '15:10']];
function sscBreaks() { try { var b = JSON.parse(localStorage.getItem('ssc_breaks')); if (b && b.length !== undefined) return b; } catch (e) {} return SSC_BREAKS; }
// この品番の結わきの時間の平均 {sec, n}(サーバーから読んで localStorage の ssc_wrap_avg_製品フォルダ名 に覚えた物)。無ければ null
function sscWrapAvg() { try { var a = JSON.parse(localStorage.getItem('ssc_wrap_avg_' + sscProgressFolder())); if (a && a.sec > 0) return a; } catch (e) {} return null; }
function sscBreaksFetch() { var f = sscProgressFolder().split('_'), x = new XMLHttpRequest(); x.open('GET', SSC_RECORD_URL + '?act=config&pk=' + encodeURIComponent((f[0] || '') + ' ' + (f[1] || '')) + '&_=' + Date.now(), true);
    x.onreadystatechange = function () { if (x.readyState !== 4 || x.status !== 200) return; try { var d = JSON.parse(x.responseText); if (!d.ok) return; if (d.breaks) localStorage.setItem('ssc_breaks', JSON.stringify(d.breaks));
        if (d.wrap && d.wrap.sec > 0) localStorage.setItem('ssc_wrap_avg_' + sscProgressFolder(), JSON.stringify(d.wrap)); else localStorage.removeItem('ssc_wrap_avg_' + sscProgressFolder()); sscWrapDraw(); } catch (e) {} }; x.send(); }
// このタブレットの印(初めて開いた時に作って覚える。見るページで 1 台を 1 行にするため)
function sscTabletId() { var t = ''; try { t = localStorage.getItem('ssc_tablet') || ''; if (!t) { t = 'T' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); localStorage.setItem('ssc_tablet', t); } } catch (e) {} return t; }
// a から b(ミリ秒)の間のうち、休憩時間に重なる長さ(ミリ秒)
function sscBreakOverlap(a, b) { var sum = 0, d = new Date(a); d.setHours(0, 0, 0, 0);
    var brs = sscBreaks(); for (; d.getTime() < b; d.setDate(d.getDate() + 1)) { brs.forEach(function (br) { var s = br[0].split(':'), e = br[1].split(':'), bs = new Date(d.getTime()), be = new Date(d.getTime()); bs.setHours(+s[0], +s[1], 0, 0); be.setHours(+e[0], +e[1], 0, 0); var x = Math.max(a, bs.getTime()), y = Math.min(b, be.getTime()); if (y > x) sum += y - x; }); }
    return sum; }
function sscInBreak(t) { return sscBreakOverlap(t, t + 1000) > 0; }
// t(ミリ秒)から、休憩時間を飛ばして作業の時間 ms だけ進めた時刻(結わきが終わる予想の時刻)
function sscAddWork(t, ms) { for (var k = 0; k < 50 && ms > 0; k++) { var nb = null, d = new Date(t); d.setHours(0, 0, 0, 0);
        for (var day = 0; day < 2 && !nb; day++) { sscBreaks().forEach(function (br) { var s = br[0].split(':'), e = br[1].split(':'), bs = new Date(d.getTime()), be = new Date(d.getTime()); bs.setHours(+s[0], +s[1], 0, 0); be.setHours(+e[0], +e[1], 0, 0); if (be.getTime() > t && (!nb || bs.getTime() < nb[0])) nb = [bs.getTime(), be.getTime()]; }); d.setDate(d.getDate() + 1); }
        if (!nb || t + ms <= nb[0]) return t + ms; if (nb[0] > t) ms -= nb[0] - t; t = nb[1]; }
    return t + ms; }
function sscMmss(sec) { sec = Math.max(0, Math.round(sec || 0)); var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
function sscHm(t) { var d = new Date(t); return d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); }
// 結わきを始めてからの時間(秒。休憩時間に重なった所は引く)
function sscWrapSec(st, now) { if (!st || !st.wrapStart) return 0; now = now || Date.now(); return Math.round(((st.wrapAcc || 0) + sscWrapGap(st, now)) / 1000); }
// 前に足した時から今までの結わきの時間(ミリ秒。休憩時間と電源が切れていた間は引く)
function sscWrapGap(st, now) { var last = st.wrapLast || st.wrapStart, end = sscAliveEnd(now); return end > last ? Math.max(0, end - last - sscBreakOverlap(last, end)) : 0; }
// 数えてよい終わりの時刻: 前に動いていた時刻が古ければ(電源が切れていた)その時刻、そうでなければ今
function sscAliveEnd(now) { var a = 0; try { a = +localStorage.getItem('ssc_alive') || 0; } catch (e) {} return a && now - a > SSC_ALIVE_GAP_SEC * 1000 ? a : now; }
function sscAliveMark() { try { localStorage.setItem('ssc_alive', String(Date.now())); } catch (e) {} }
// 10 秒毎とページを開いた時: 結わき中なら結わきの時間を足して、動いている印を書く
function sscWrapBeat() { var st = sscProgressLoad(), now = Date.now(); if (st && st.wrapStart) { st.wrapAcc = (st.wrapAcc || 0) + sscWrapGap(st, now); st.wrapLast = now; sscProgressSave(st); } sscAliveMark(); }
// タブレットで何かした時: 前に何かした時からの間を、配索の時間に足す(1 本を始めていない時と結わき中は何もしない)
function sscActivity() { var st = sscProgressLoad(); if (!st || st.wrapStart) return; var now = Date.now(), last = st.last || st.start || now, end = sscAliveEnd(now), gap = end - last;
    if (gap > 0) { gap -= sscBreakOverlap(last, end); gap = Math.max(0, Math.min(gap, SSC_ACTIVE_CAP_MIN * 60000)); st.active = (st.active || 0) + gap; } st.last = now; sscProgressSave(st); }
function sscRecordPost(body, done) { var x = new XMLHttpRequest(); x.open('POST', SSC_RECORD_URL, true); x.setRequestHeader('Content-Type', 'application/json');
    x.onreadystatechange = function () { if (x.readyState !== 4) return; var ok = false; try { ok = x.status === 200 && JSON.parse(x.responseText).ok === true; } catch (e) {} if (done) done(ok); };
    x.send(JSON.stringify(body)); }
function sscRecordQueue() { try { return JSON.parse(localStorage.getItem('ssc_record_queue')) || []; } catch (e) { return []; } }
function sscRecordQueueSave(q) { try { if (q.length) localStorage.setItem('ssc_record_queue', JSON.stringify(q)); else localStorage.removeItem('ssc_record_queue'); } catch (e) {} }
// 残っている実績を 1 つずつ送る。送れたら消す。送れなかったら残して止める(次に開いた時に又送る)
function sscRecordFlush(done) { var q = sscRecordQueue(); if (!q.length) { if (done) done(); return; }
    sscRecordPost({ act: 'end', rec: q[0] }, function (ok) { if (!ok) { if (done) done(); return; } var q2 = sscRecordQueue().filter(function (r) { return r.id !== q[0].id; }); sscRecordQueueSave(q2); sscRecordFlush(done); }); }
function sscRecordBase(st) { var f = sscProgressFolder(), p = f.split('_'), route = st ? Math.round((st.active || 0) / 1000) : 0, wrap = sscWrapSec(st);
    return { tablet: sscTabletId(), worker: sscWorkerCode(), folder: f, product: p[0] || '', design: p[1] || '', serial: st ? st.serial : '', date: st ? st.date || '' : '', done: st ? st.done.length : 0, total: SSC_SUB_COUNT, cur: st ? st.cur || '' : '', phase: st && st.wrapStart ? 'wrap' : 'route', routeSec: route, wrapSec: wrap, sec: route + wrap, wires: sscWireCount(), start: st && st.start ? String(st.start) : '' }; }
// 回路数: 端末のページは productMetaTag の data-wire-count、サブ一覧はヘッダーの 回路数。読めたら品番毎に覚えて、読めないページ(サブのページ)では覚えた物
function sscWireCount() { var k = 'ssc_wires_' + sscProgressFolder(), n = '', m = document.querySelector('.productMetaTag');
    if (m) n = m.getAttribute('data-wire-count') || '';
    if (!n) { var ks = document.querySelectorAll('header .k'); for (var i = 0; i < ks.length; i++) if (ks[i].textContent === '回路数') n = (ks[i].parentNode.textContent || '').replace('回路数', '').trim(); }
    try { if (/^\d+$/.test(n)) localStorage.setItem(k, n); else n = localStorage.getItem(k) || ''; } catch (e) {}
    return /^\d+$/.test(n) ? +n : 0; }
// 画面の真ん中に大きく知らせる(読み取りの邪魔をしない様に alert は使わない。入力欄はそのまま読める)
var sscConfirmKey = '', sscNoticeTimer = 0;
function sscNotice(html, color, sec) { var el = document.getElementById('sscNotice'); if (!el) { el = document.createElement('div'); el.id = 'sscNotice'; document.body.appendChild(el); }
    el.style.cssText = 'position:fixed;left:50%;top:45%;transform:translate(-50%,-50%);z-index:5000;min-width:36vw;max-width:80vw;padding:1em 2em;border:4px solid ' + (color || '#FFD400') + ';border-radius:12px;background:rgba(12,12,14,.95);color:#fff;font:bold 2.2vw/1.5 Meiryo,sans-serif;text-align:center;pointer-events:none;box-shadow:0 0 0 100vmax rgba(0,0,0,.45)';
    el.innerHTML = html; clearTimeout(sscNoticeTimer); if (sec) sscNoticeTimer = setTimeout(sscConfirmClear, sec * 1000); }
function sscConfirmAsk(key, html) { sscConfirmKey = key; sscNotice(html + '<div style="font-size:.55em;color:#9CA3AF;margin-top:.8em;font-weight:normal;">' + SSC_CONFIRM_SEC + ' 秒たつか、ほかの物を読むと取り消し</div>', '#FFD400', SSC_CONFIRM_SEC); }
function sscConfirmClear() { sscConfirmKey = ''; clearTimeout(sscNoticeTimer); var el = document.getElementById('sscNotice'); if (el) el.parentNode.removeChild(el); }
// 確かめている物をもう一度読んだ時 true(確かめている物は消す)
function sscConfirmed(key) { var ok = sscConfirmKey === key; sscConfirmClear(); return ok; }
// 入力欄で wrap・end を読んだ時(sscProgressCommand から)。ほかの物を読んだ時は確かめている物を取り消して false
function sscRecordCommand(v) { var key = String(v).trim().toLowerCase(); if (key !== 'wrap' && key !== 'end') { if (sscConfirmKey) sscConfirmClear(); return false; }
    document.myform.txtb.value = ''; if (key === 'wrap') sscWrapRead(); else sscEndRead(); return true; }
function sscWrapRead() { var st = sscProgressLoad();
    if (!st) { sscConfirmClear(); sscNotice('ネームを読んでいません<div style="font-size:.6em;font-weight:normal;">製品品番一覧でネームを読んで、1 本を始めてください</div>', '#FFD400', 6); return; }
    if (st.wrapStart) { sscConfirmClear(); sscNotice('もう結わき中です<div style="font-size:.6em;font-weight:normal;">終わったら end を読んでください</div>', '#00C853', 4); return; }
    var n = st.done.length; if (n < SSC_SUB_COUNT - 1 && !sscConfirmed('wrap')) { sscConfirmAsk('wrap', '配索が終わっていません<div style="font-size:2.2em;line-height:1.2;margin:.1em 0;color:#FFD400;">' + n + ' / ' + SSC_SUB_COUNT + '</div>このまま結わきに移る時は、<br>もう一度 wrap を読んでください'); return; }
    sscConfirmClear(); sscWrapStart(); }
// 結わきを始める: ここまでを配索の時間にして、作業中のサブを完了にする。サブ一覧へ移って、結わきの時間と予想を大きく出す
function sscWrapStart() { sscActivity(); var st = sscProgressLoad(); if (st.cur && st.done.indexOf(st.cur) === -1) st.done.push(st.cur); st.cur = ''; st.wrapStart = st.wrapLast = Date.now(); st.wrapAcc = 0; sscProgressSave(st);
    var moved = false, go = function () { if (moved) return; moved = true; window.location.href = './index.html'; }; setTimeout(go, 1500); sscRecordPost({ act: 'progress', rec: sscRecordBase(st) }, go); }
function sscEndRead() {
    if (!sscWorkerCode()) { sscConfirmClear(); sscNotice('ログインしてください<div style="font-size:.6em;font-weight:normal;">作業者コードを読んでから、もう一度 end を読んでください</div>', '#FFD400', 8); return; }
    var st = sscProgressLoad(); if (!st) { sscConfirmClear(); window.location.href = './index.html'; return; }
    if (st.wrapStart && !sscConfirmed('end')) { sscConfirmAsk('end', '結わきを終わりますか？<div style="font-size:.6em;font-weight:normal;">終わる時は、もう一度 end を読んでください</div>'); return; }
    if (!st.wrapStart && !sscConfirmed('end')) { sscConfirmAsk('end', 'まだ結わきに移っていません<div style="font-size:.6em;font-weight:normal;">先に wrap を読んでください<br>結わきをしないで完了にする時は、もう一度 end を読んでください</div>'); return; }
    sscConfirmClear(); sscRecordEnd(); }
// 1 本終わり: 実績を送って(送れなければ残して)サブ一覧へ
function sscRecordEnd() { var st = sscProgressLoad(); if (!st) return; sscActivity(); st = sscProgressLoad(); if (st.cur && st.done.indexOf(st.cur) === -1) st.done.push(st.cur); st.cur = '';
    var rec = sscRecordBase(st); rec.id = rec.tablet + '-' + Date.now().toString(36); rec.start = st.start || 0;
    var q = sscRecordQueue(); q.push(rec); sscRecordQueueSave(q); sscProgressSave(null); sscWrapDraw(); var navN = sscNavFix();
    sscNotice('完了<div style="font-size:.6em;font-weight:normal;">シリアル ' + rec.serial + '　配索 ' + sscMmss(rec.routeSec) + (rec.wrapSec ? '　結わき ' + sscMmss(rec.wrapSec) : '') + '</div>' + (navN ? '<div style="font-size:.6em;font-weight:normal;color:#FFD400;">作業順を覚えました(' + navN + ' 本)</div>' : ''), '#00C853');
    var moved = false, go = function () { if (moved) return; moved = true; window.location.href = './index.html'; }; setTimeout(go, 3000); sscRecordFlush(function () { setTimeout(go, 1200); }); }
// 結わき中の表示: サブ一覧(<header> のページ)は真ん中に大きく、ほかのページは右上(作業者コードの下)に小さく。1 秒毎に書き直す
(function () { var st = document.createElement('style'); st.textContent = '#sscWrapPanel { position: fixed; z-index: 1600; pointer-events: none; color: #fff; font-family: Meiryo, sans-serif; }\n'
    + '#sscWrapPanel.big { left: 50%; top: 55%; transform: translate(-50%, -50%); width: 46vw; min-width: 420px; padding: 1.2em 1.6em; border: 3px solid #00C853; border-radius: 14px; background: rgba(12, 14, 16, .96); box-shadow: 0 0 0 100vmax rgba(0, 0, 0, .55); text-align: center; font-size: 1.5vw; }\n'
    + '#sscWrapPanel.big .ttl { font-size: 1.3em; font-weight: bold; color: #00C853; letter-spacing: .1em; }\n#sscWrapPanel.big .ser { font-size: .8em; color: #9CA3AF; margin-left: .8em; letter-spacing: 0; font-weight: normal; }\n'
    + '#sscWrapPanel.big .el { font-size: 4.2em; font-weight: bold; line-height: 1.1; font-variant-numeric: tabular-nums; margin: .1em 0; }\n#sscWrapPanel .bar { height: 12px; border-radius: 6px; background: #2A313B; overflow: hidden; margin: .3em 0 .6em; }\n#sscWrapPanel .bar i { display: block; height: 100%; background: #00C853; }\n#sscWrapPanel.over .bar i { background: #FE4951; }\n'
    + '#sscWrapPanel .pred { font-size: 1.15em; font-weight: bold; }\n#sscWrapPanel.over .pred { color: #FE6B71; }\n#sscWrapPanel .base { font-size: .75em; color: #9CA3AF; margin-top: .3em; }\n#sscWrapPanel .brk { display: inline-block; margin-top: .4em; padding: .1em .8em; border-radius: 4px; background: #FFD400; color: #000; font-weight: bold; }\n#sscWrapPanel .foot { margin-top: .8em; font-size: .85em; color: #D1D5DB; }\n#sscWrapPanel .foot b { color: #FFD400; font-size: 1.2em; }\n'
    + '#sscWrapPanel.small { right: 8px; font: bold 12px/1.5 Meiryo, sans-serif; padding: 0 6px; border-radius: 3px; background: #00C853; color: #000; }\n#sscWrapPanel.small.over { background: #FE4951; color: #fff; }\n#sscWrapPanel.small.inbrk { background: #FFD400; color: #000; }'; document.head.appendChild(st); })();
function sscWrapDraw() { var st = sscProgressLoad(), el = document.getElementById('sscWrapPanel'); if (!st || !st.wrapStart) { if (el) el.parentNode.removeChild(el); return; }
    if (!el) { el = document.createElement('div'); el.id = 'sscWrapPanel'; document.body.appendChild(el); }
    // 結わきの時間は数えて送るだけで、タブレットには出さない(見るページで見る)
    if (!document.querySelector('header .info')) { var t = document.querySelector('table'), w = document.getElementById('sscWorkerTag'); el.className = 'small';
        el.style.top = ((w ? w.getBoundingClientRect().bottom : t ? t.getBoundingClientRect().bottom : 0) + 4) + 'px'; el.textContent = '結わき中'; return; }
    el.className = 'big';
    el.innerHTML = '<div class="ttl">結わき中<span class="ser">シリアル ' + st.serial + '</span></div><div class="foot">終わったら <b>end</b> を読んでください</div>'; }
// ページを開いた時: 作業していた時間を足して、進み具合を送る(送れなくても止めない)。残っている実績も送る。結わき中は表示を 1 秒毎・進み具合を 1 分毎に
// 動いている印は 10 秒毎(電源が切れていた間を数えないため。sscActivity の後で書く)
window.addEventListener('load', function () { sscBreaksFetch(); sscActivity(); sscWrapBeat(); setInterval(sscWrapBeat, 10000); var st = sscProgressLoad(); if (st) sscRecordPost({ act: 'progress', rec: sscRecordBase(st) }); sscRecordFlush();
    setTimeout(sscWrapDraw, 450); setInterval(sscWrapDraw, 1000); setInterval(function () { var s = sscProgressLoad(); if (s && s.wrapStart) sscRecordPost({ act: 'progress', rec: sscRecordBase(s) }); }, 60000); });
// 画面に触った・キーを押した時も作業していた事にする(localStorage に書くのは 15 秒に 1 回まで)
(function () { var lastT = 0, f = function () { var now = Date.now(); if (now - lastT < 15000) return; lastT = now; sscActivity(); }; ['touchstart', 'mousedown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, f, true); }); })();
// ===== 作業順(1 本目に開いた構成番号の順番を覚えて、2 本目からは next・prev・nextsub・prevsub の QR で順に出す)。この端末の localStorage の ssc_nav_order =====
// 覚える: 作業順を覚えていない製品のネームを読んだら、その 1 本で構成番号のページを開いた順に覚える(同じ構成番号は初めの 1 回だけ。結わき中は覚えない)。end で 1 本終わった時に作業順に決める
//   end まで行かずに同じ製品の別のネームを読んだ時は、覚えた所までを残して続きから覚える。読み忘れた電線は足さない
// 出す: 作業順が決まった製品の別のネームを読んだら、最初から。next・prev・nextsub・prevsub だけで進む(途中で紙の QR を読んでページを開いても、作業順の中の位置は変わらない)
//   next・prev は作業順のまま(サブをまたぐ)。nextsub・prevsub はサブの番号順で次・前のサブの、作業順で一番先の構成番号へ
// 作業順は 1 つの製品の分だけ持つ。別の製品のネームを読んだら消して、その製品で覚え直す
function sscNavLoad() { try { var o = JSON.parse(localStorage.getItem('ssc_nav_order')); if (o && o.list) return o; } catch (e) {} return null; }
function sscNavSave(o) { try { localStorage.setItem('ssc_nav_order', JSON.stringify(o)); } catch (e) {} }
// ネームを読んで 1 本を始めた時(sscProgressStart から)
function sscNavStart(serial) { var f = sscProgressFolder(), o = sscNavLoad();
    if (!o || o.folder !== f) o = { folder: f, list: [], fixed: false, pos: -1, serial: '' };
    if (o.serial !== serial) { if (o.fixed) o.pos = -1; o.serial = serial; } sscNavSave(o); }
// end で 1 本終わった時(sscRecordEnd から)。覚えている途中なら作業順に決めて、その本数を返す(決めなかった時は 0)
function sscNavFix() { var o = sscNavLoad(); if (!o || o.folder !== sscProgressFolder() || o.fixed || !o.list.length) return 0; o.fixed = true; o.pos = -1; sscNavSave(o); return o.list.length; }
// 構成番号のページを開いた時: 覚えている途中なら足して、その場所に移る。作業順が決まった後は動かさない(途中で紙の QR を読んで開いても、next・prev は作業順の続きから)
function sscNavPage() { if (sscPageKind() !== 'comp') return; var o = sscNavLoad(); if (!o || o.folder !== sscProgressFolder()) return;
    var m = /\/([^\/]+)\.html$/.exec(window.location.pathname), c = m ? decodeURIComponent(m[1]) : '', b = document.querySelector('.headerSubBench'), s = b ? b.textContent.trim() : '', i, k = -1; if (!c) return;
    for (i = 0; i < o.list.length; i++) if (o.list[i].c === c) { k = i; break; }
    if (!o.fixed) { var st = sscProgressLoad(); if (!st || st.wrapStart) return; if (k < 0) { o.list.push({ c: c, s: s }); k = o.list.length - 1; } }
    if (k >= 0 && !o.fixed) { o.pos = k; sscNavSave(o); } }
// サブ番号の順(数なら数の順)
function sscNavSubCmp(a, b) { var x = parseFloat(a), y = parseFloat(b); if (!isNaN(x) && !isNaN(y) && x !== y) return x - y; return a < b ? -1 : a > b ? 1 : 0; }
// 入力欄で next・prev・nextsub・prevsub を読んだ時(sscProgressCommand から)。それ以外は false
function sscNavCommand(v) { var key = String(v).trim().toLowerCase(); if (key !== 'next' && key !== 'prev' && key !== 'nextsub' && key !== 'prevsub') return false; document.myform.txtb.value = '';
    var o = sscNavLoad(), small = '<div style="font-size:.6em;font-weight:normal;">';
    if (!o || o.folder !== sscProgressFolder() || !o.fixed || !o.list.length) { sscNotice('作業順をまだ覚えていません' + small + (o && o.folder === sscProgressFolder() && o.list.length ? '今 ' + o.list.length + ' 本覚えています。' : '') + '1 本目は紙の QR で構成番号のページを開いて、<br>end まで進めると作業順を覚えます</div>', '#FFD400', 6); return true; }
    var n = o.list.length, t = -1, i, msg = '';
    if (key === 'next') { t = o.pos + 1; if (t >= n) msg = '最後の電線です'; }
    else if (key === 'prev') { t = o.pos - 1; if (t < 0) msg = '最初の電線です'; }
    else { var subs = [], cur = o.pos >= 0 ? o.list[o.pos].s : null, to = null;
        for (i = 0; i < n; i++) if (subs.indexOf(o.list[i].s) === -1) subs.push(o.list[i].s); subs.sort(sscNavSubCmp);
        if (key === 'nextsub') { for (i = 0; i < subs.length; i++) if (cur === null || sscNavSubCmp(subs[i], cur) > 0) { to = subs[i]; break; } if (to === null) msg = '最後のサブです'; }
        else { for (i = subs.length - 1; i >= 0; i--) if (cur !== null && sscNavSubCmp(subs[i], cur) < 0) { to = subs[i]; break; } if (to === null) msg = '最初のサブです'; }
        if (to !== null) for (i = 0; i < n; i++) if (o.list[i].s === to) { t = i; break; } }
    if (msg) { sscNotice(msg + small + '作業順 ' + (o.pos + 1) + ' / ' + n + '</div>', '#FFD400', 3); return true; }
    o.pos = t; sscNavSave(o); navigateOrNotFound(o.list[t].c + '.html'); return true; }
window.addEventListener('load', sscNavPage);
// ログイン番号(#sscWorkerTag)のすぐ下に、この製品の作業順を小さく出す。決まっている時は黄色(印 + 今の場所/本数)、1 本目で覚えている途中はグレー(赤い点 + 覚え中 本数)
// ほかの製品の作業順・覚えていない時は出さない。ログイン番号を出すページ(配索経路のあるページ)だけ。composition.css の svg { position: absolute } を印の svg では打ち消す
var SSC_NAV_ICON = '<svg viewBox="0 0 12 12" fill="currentColor"><circle cx="1.8" cy="2.2" r="1.4"/><circle cx="1.8" cy="6" r="1.4"/><circle cx="1.8" cy="9.8" r="1.4"/><rect x="4.4" y="1.4" width="7.6" height="1.6" rx=".8"/><rect x="4.4" y="5.2" width="7.6" height="1.6" rx=".8"/><rect x="4.4" y="9" width="7.6" height="1.6" rx=".8"/></svg>';
(function () { var st = document.createElement('style'); st.textContent = '#sscNavTag { position: fixed; right: 0; z-index: 50; font: bold 12px/1.5 Meiryo, sans-serif; padding: 0 4px 0 6px; border-radius: 3px 0 0 3px; pointer-events: none; white-space: nowrap; }\n#sscNavTag svg { position: static; display: inline-block; width: 11px; height: 11px; vertical-align: -1px; margin-right: 3px; }\n#sscNavTag.fixed { color: #000; background: #FFD400; }\n#sscNavTag.rec { color: #fff; background: rgba(0, 0, 0, .6); }\n#sscNavTag .recDot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #FF3B30; margin-right: 4px; animation: sscNavRec 1.2s ease-in-out infinite; }\n@keyframes sscNavRec { 50% { opacity: .3; } }'; document.head.appendChild(st); })();
function sscNavTagDraw() { var w = document.getElementById('sscWorkerTag'), el = document.getElementById('sscNavTag'), o = sscNavLoad(), st = sscProgressLoad(), h = '', cls = '';
    if (w && o && o.folder === sscProgressFolder()) { if (o.fixed && o.list.length) { cls = 'fixed'; h = SSC_NAV_ICON + (o.pos >= 0 ? (o.pos + 1) + '/' + o.list.length : o.list.length + ' 本'); } else if (!o.fixed && st && !st.wrapStart) { cls = 'rec'; h = '<span class="recDot"></span>覚え中 ' + o.list.length; } }
    if (!h) { if (el) el.style.display = 'none'; return; } if (!el) { el = document.createElement('div'); el.id = 'sscNavTag'; document.body.appendChild(el); }
    el.innerHTML = h; el.className = cls; el.style.display = ''; el.style.top = (w.getBoundingClientRect().bottom + 2) + 'px'; }
window.addEventListener('load', sscNavTagDraw); window.addEventListener('resize', sscNavTagDraw);
// ===== この端末のチェック(読み取り欄で check を読む)。配索誘導がうまく動かない時の原因を、このタブレットの中とサーバー(record/api.php の diag)を調べて出す =====
// 見る物: 開き方(URL)・この端末の記憶の始まり(閉じると消えていないか)・ログイン・ページと main.js の版(キャッシュ)・進み具合・作業順・送れていない生産実績・サーバー・時計・ブラウザ・画面
// main.js を作った時の版(?v= と同じ)。ページの <script src="…main.js?v=…"> と違えば、古い main.js がキャッシュから使われている
var SSC_ASSET_VER = '20261030174705';
// この端末の記憶(localStorage)を使い始めた時刻。InPrivate・データの削除で記憶が消えると、新しい時刻になる
(function () { try { if (!localStorage.getItem('ssc_since')) localStorage.setItem('ssc_since', String(Date.now())); } catch (e) {} })();
(function () { var st = document.createElement('style'); st.textContent = [
    '#sscCheck { position: fixed; inset: 0; z-index: 3000; background: rgba(0, 0, 0, .6); display: flex; align-items: flex-start; justify-content: center; padding-top: 3vh; font: 15px/1.5 Meiryo, sans-serif; color: #E5E7EB; }',
    '#sscCheck .ckBox { width: min(900px, 94vw); max-height: 92vh; display: flex; flex-direction: column; background: #161b22; border: 1px solid #30363d; border-radius: 8px; box-shadow: 0 8px 30px rgba(0, 0, 0, .6); }',
    '#sscCheck .ckHead { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid #30363d; }',
    '#sscCheck h2 { margin: 0; font-size: 18px; flex: 1; }',
    '#sscCheck button { font: bold 14px Meiryo, sans-serif; padding: 5px 14px; color: #E5E7EB; background: #21262d; border: 1px solid #484f58; border-radius: 5px; cursor: pointer; }',
    '#sscCheck .ckBody { overflow-y: auto; padding: 10px 14px; }',
    '#sscCheck .dverdict { font-size: 20px; font-weight: bold; padding: 10px 12px; border-radius: 6px; margin-bottom: 8px; }',
    '#sscCheck .dverdict.ok { background: #14532d; } #sscCheck .dverdict.warn { background: #4a3d00; color: #FFD400; } #sscCheck .dverdict.ng { background: #5b1a1d; color: #fecaca; }',
    '#sscCheck .ditem { display: flex; gap: 10px; padding: 7px 0; border-bottom: 1px solid #30363d; } #sscCheck .ditem:last-child { border-bottom: 0; }',
    '#sscCheck .dlv { flex: none; width: 48px; text-align: center; font-size: 13px; font-weight: bold; border-radius: 3px; padding: 2px 0; align-self: flex-start; }',
    '#sscCheck .dlv.ok { background: #14532d; color: #bbf7d0; } #sscCheck .dlv.warn { background: #FFD400; color: #000; } #sscCheck .dlv.ng { background: #dc2626; color: #fff; } #sscCheck .dlv.info { background: #39424e; }',
    '#sscCheck .dbody { flex: 1; min-width: 0; } #sscCheck .dtitle { font-weight: bold; } #sscCheck .ddetail { font-size: 13px; color: #9CA3AF; overflow-wrap: anywhere; }',
    '#sscCheck .dfix { font-size: 13px; margin-top: 5px; padding: 5px 10px; background: #1d232b; border-left: 3px solid #FFD400; border-radius: 0 4px 4px 0; }',
    '#sscCheck code { font-family: Consolas, monospace; background: #0d1117; padding: 0 4px; border-radius: 3px; overflow-wrap: anywhere; }',
    '#sscCheck .ckFoot { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-top: 1px solid #30363d; font-size: 13px; color: #9CA3AF; } #sscCheck .ckFoot span { flex: 1; }'
    ].join('\n'); document.head.appendChild(st); })();
// 入力欄で check を読んだ時(sscProgressCommand から)。それ以外は false
function sscCheckCommand(v) { if (String(v).trim().toLowerCase() !== 'check') return false; document.myform.txtb.value = ''; sscCheckOpen(); return true; }
function sscCheckClose() { var m = document.getElementById('sscCheck'); if (m) m.parentNode.removeChild(m); }
function sscCheckEsc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function sscCheckTime(ms) { var d = new Date(+ms), p = function (n) { return (n < 10 ? '0' : '') + n; }; return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()); }
function sscCheckAgo(ms) { var m = Math.round((Date.now() - ms) / 60000); return m < 1 ? '1 分以内' : m < 60 ? m + ' 分前' : m < 1440 ? Math.floor(m / 60) + ' 時間前' : Math.floor(m / 1440) + ' 日前'; }
// ブラウザと Windows の版(UA から)
function sscCheckBrowser() { var ua = navigator.userAgent, m = /Edg\/([\d.]+)/.exec(ua) || null, name = 'Edge'; if (!m) { m = /Chrome\/([\d.]+)/.exec(ua); name = 'Chrome'; } var w = /Windows NT ([\d.]+)/.exec(ua), os = w ? ({ '6.1': 'Windows 7', '6.2': 'Windows 8', '6.3': 'Windows 8.1', '10.0': 'Windows 10/11' }[w[1]] || 'Windows NT ' + w[1]) : (/Android/.test(ua) ? 'Android' : '');
    return { name: m ? name : 'ブラウザ', ver: m ? m[1] : '', major: m ? +m[1].split('.')[0] : 0, os: os, ua: ua }; }
function sscCheckOpen() { sscCheckClose(); var m = document.createElement('div'); m.id = 'sscCheck';
    m.innerHTML = '<div class="ckBox"><div class="ckHead"><h2>この端末のチェック</h2><button type="button" id="sscCheckRun">もう一度調べる</button><button type="button" id="sscCheckX">閉じる</button></div><div class="ckBody" id="sscCheckOut">調べています…</div><div class="ckFoot"><span id="sscCheckMsg">check の QR をもう一度読むと調べ直します</span><button type="button" id="sscCheckCopy">結果を文字でコピー</button></div></div>';
    document.body.appendChild(m); m.onclick = function (e) { if (e.target === m) sscCheckClose(); };
    document.getElementById('sscCheckX').onclick = sscCheckClose; document.getElementById('sscCheckRun').onclick = sscCheckOpen; document.getElementById('sscCheckCopy').onclick = sscCheckCopy;
    var res = { local: sscCheckLocal() }, fin = function () { if (document.getElementById('sscCheckOut')) sscCheckDraw(sscCheckJudge(res)); };
    var t0 = Date.now(), x = new XMLHttpRequest(); try { x.open('POST', SSC_RECORD_URL, true); x.setRequestHeader('Content-Type', 'application/json'); x.timeout = 8000;
        x.onreadystatechange = function () { if (x.readyState !== 4) return; res.srv = { status: x.status, text: x.responseText || '', t0: t0, t1: Date.now() }; fin(); }; x.send(JSON.stringify({ act: 'diag' })); } catch (e) { res.srv = { status: 0, text: String(e), t0: t0, t1: Date.now() }; fin(); } }
// この端末の中(localStorage・ページ)を読む
function sscCheckLocal() { var L = {}, k, i; try { for (i = 0; i < localStorage.length; i++) { k = localStorage.key(i); L[k] = localStorage.getItem(k); } } catch (e) { L = null; }
    var s = [].filter.call(document.scripts, function (x) { return /main\.js/.test(x.src); })[0], vm = s ? /[?&]v=(\w+)/.exec(s.src) : null, vt = document.querySelector('.versionTag');
    return { ls: L, pageV: vm ? vm[1] : '', hasScript: !!s, version: vt ? vt.textContent.trim() : '' }; }
function sscCheckJudge(res) { var it = [], L = res.local.ls, f = sscProgressFolder(), d = null;
    function add(lv, title, detail, fix) { it.push({ lv: lv, title: title, detail: detail || '', fix: fix || '' }); }
    var KIOSK_FIX = 'ショートカットの <code>--kiosk</code> をやめて、配索誘導専用のプロファイルの全画面で開く:<br><code>msedge.exe --user-data-dir="%LOCALAPPDATA%\\56ver32_edge" --no-first-run --start-fullscreen ' + sscCheckEsc(location.href.replace(/[^\/]+\/[^\/]*$/, '')) + '</code>';
    // 開き方
    if (location.protocol === 'file:') add('ng', 'ファイルとして開いています(file://)', '<code>' + sscCheckEsc(location.href) + '</code>', 'サーバーの http:// のアドレスで開いてください。file:// では生産実績・作業者の設定がサーバーに届きません。');
    else add('ok', '開き方', '<code>' + sscCheckEsc(location.href.replace(/[?#].*$/, '')) + '</code>(アドレスが変わると、ログイン・進み具合は別に覚えます)');
    // 記憶が消えないか。InPrivate(Edge の kiosk)はページからは見分けられない(使える容量は空いているディスクでも変わる)ので、記憶の始まりの時刻と、サーバーの同じ IP の台数で見る
    if (!L) add('ng', 'この端末に記憶できません(localStorage が使えません)', '', 'ブラウザーの設定でサイトのデータが止められていないか確かめてください。');
    else { var since = +L.ssc_since || 0; add('info', 'この端末の記憶は ' + (since ? sscCheckTime(since) + ' から(' + sscCheckAgo(since) + ')' : '分かりません'), 'ブラウザーを開き直す度にこの時刻が新しくなるなら、閉じた時に記憶(ログイン・進み具合・作業順)が消えています(Edge の kiosk は InPrivate なので消えます)。タブレットの番号 ' + (L.ssc_tablet ? '<code>' + sscCheckEsc(L.ssc_tablet) + '</code>' : 'まだありません(ネームを読んで作業を始めると作ります)')); }
    // ログイン
    var code = sscWorkerCode(); if (code) add('ok', 'ログイン ' + code, ''); else add('warn', 'ログインしていません', '生産実績が送られず、設定もこの端末だけに残ります。', '作業者コードの QR を読んでください。');
    // 版(キャッシュ)
    var pv = res.local.pageV; if (!res.local.hasScript) add('info', 'このページは main.js を読んでいません', '');
    else if (!pv) add('warn', 'ページが古い作り方です(main.js に ?v= が付いていません)', '版 ' + sscCheckEsc(res.local.version), 'Sjp で配索誘導を作り直してください(ai_239 から後)。');
    else if (pv !== SSC_ASSET_VER) add('ng', '古い main.js が使われています(キャッシュ)', 'ページ ' + sscCheckEsc(pv) + ' / 読み込んだ main.js ' + sscCheckEsc(SSC_ASSET_VER), 'キーボードの Ctrl + F5 で読み直してください。');
    else add('ok', 'ページと main.js の版が同じ', '版 ' + sscCheckEsc(res.local.version) + '(' + sscCheckEsc(pv) + ')');
    if (L) { // 進み具合・作業順・送れていない生産実績
        var st = null, others = [], k; try { st = JSON.parse(L['ssc_progress_' + f] || 'null'); } catch (e) {}
        for (k in L) if (k.indexOf('ssc_progress_') === 0 && k !== 'ssc_progress_' + f) others.push(k.substr(13));
        add('info', st ? '1 本作業中 シリアル ' + st.serial : 'この製品は作業中ではありません', st ? (st.start ? sscCheckTime(st.start) + ' に始めた。' : '') + 'サブ ' + (st.done ? st.done.length : 0) + ' / ' + SSC_SUB_COUNT + ' 完了' + (st.wrapStart ? '・結わき中' : '') : 'ネームを読むと始まります。' + (others.length ? 'ほかの製品で途中の物: ' + others.map(sscCheckEsc).join('、') : ''));
        var o = null; try { o = JSON.parse(L.ssc_nav_order || 'null'); } catch (e) {}
        add('info', o && o.list ? '作業順: ' + (o.folder === f ? 'この製品' : sscCheckEsc(o.folder)) + ' ' + o.list.length + ' 本' + (o.fixed ? '' : '(覚え中)') : '作業順は覚えていません', '');
        var q = []; try { q = JSON.parse(L.ssc_record_queue || '[]') || []; } catch (e) {}
        if (q.length) add('warn', '送れていない生産実績が ' + q.length + ' 本あります', 'サーバーに届くまで、この端末に残しています(次の end の時に送り直します)。', '下の「サーバー」が NG なら、そちらを先に直してください。'); else add('ok', '送れていない生産実績はありません', ''); }
    // サーバー
    var r = res.srv; try { d = JSON.parse(r.text); } catch (e) {}
    if (r.status === 0) add('ng', 'サーバーから返事がありません', '<code>' + sscCheckEsc(SSC_RECORD_URL) + '</code>', 'タブレットのネットワークとサーバー(Synology)の電源を確かめてください。');
    else if (r.status === 404) add('ng', 'サーバーに record/api.php がありません(HTTP 404)', '', 'Sjp で配索誘導を作り直してください。');
    else if (!d || !d.ok) add('ng', 'サーバーの返事が読めません(HTTP ' + r.status + ')', '<code>' + sscCheckEsc(d && d.error ? d.error : r.text.substr(0, 200)) + '</code>', '生産実績の見るページ(record/monitor.html)の「チェック」で、サーバー側を調べてください。');
    else { var canWrite = d.dataExists && d.writeTest && d.lockOk;
        add(canWrite ? 'ok' : 'ng', canWrite ? 'サーバーにつながり、記録を書けます' : 'サーバーが記録を書けません', 'PHP ' + sscCheckEsc(d.php), canWrite ? '' : '生産実績の見るページ(record/monitor.html)の「チェック」で、直し方を見てください。');
        var off = d.nowMs - (r.t0 + r.t1) / 2;
        add(Math.abs(off) > 120000 ? 'warn' : 'ok', Math.abs(off) > 120000 ? 'サーバーとこの端末の時計が ' + Math.round(Math.abs(off) / 60000) + ' 分ずれています' : '時計', 'サーバー ' + sscCheckEsc(d.now) + '(この端末とのずれ ' + Math.round(Math.abs(off) / 1000) + ' 秒)', Math.abs(off) > 120000 ? 'Windows の時刻を合わせてください(配索の時間・休憩の差し引きがずれます)。' : '');
        if (d.you) { var mine = (d.tablets || []).filter(function (t) { return t.ip === d.you; });
            if (mine.length > 1) add('ng', 'この端末の記憶が消えた事があります(サーバーに、この IP ' + sscCheckEsc(d.you) + ' のタブレットが ' + mine.length + ' 台分)', '記憶が消えると、新しいタブレットの番号で送り直すので、台数が増えます。Edge の kiosk(InPrivate)・閉じた時のデータの削除・開くアドレスの違いで起きます。', KIOSK_FIX + '<br>アドレスは毎回同じ物で開いてください。');
            else add('info', 'この端末の IP ' + sscCheckEsc(d.you), mine.length ? '今日の作業がサーバーに届いています。' : '今日はまだこの端末から作業が届いていません(ネームを読んで構成番号を開くと届きます)。'); } }
    // ブラウザ・画面
    var b = sscCheckBrowser(); add('info', b.name + ' ' + b.ver + (b.os ? '・' + b.os : ''), '<code>' + sscCheckEsc(b.ua) + '</code>');
    var full = Math.abs(window.innerHeight - screen.height) < 2 && Math.abs(window.innerWidth - screen.width) < 2;
    add('info', '画面 ' + screen.width + ' × ' + screen.height + (full ? '(全画面)' : '(全画面ではありません)'), 'ページの大きさ ' + window.innerWidth + ' × ' + window.innerHeight + '・倍率 ' + (window.devicePixelRatio || 1));
    return it; }
var SSC_CHECK_LV = { ok: 'OK', warn: '注意', ng: 'NG', info: '情報' }, sscCheckText = '';
function sscCheckDraw(it) { var ng = it.filter(function (x) { return x.lv === 'ng'; }), warn = it.filter(function (x) { return x.lv === 'warn'; });
    var v = ng.length ? ['ng', '問題があります: ' + ng[0].title] : warn.length ? ['warn', '注意: ' + warn[0].title] : ['ok', '問題は見つかりませんでした'];
    document.getElementById('sscCheckOut').innerHTML = '<div class="dverdict ' + v[0] + '">' + sscCheckEsc(v[1]) + '</div>' + it.map(function (x) {
        return '<div class="ditem"><span class="dlv ' + x.lv + '">' + SSC_CHECK_LV[x.lv] + '</span><div class="dbody"><div class="dtitle">' + sscCheckEsc(x.title) + '</div>' + (x.detail ? '<div class="ddetail">' + x.detail + '</div>' : '') + (x.fix ? '<div class="dfix">' + x.fix + '</div>' : '') + '</div></div>'; }).join('');
    var tmp = document.createElement('div'), txt = function (h) { tmp.innerHTML = String(h).replace(/<br>/g, '\n'); return tmp.textContent.replace(/\n/g, '\n    '); };
    sscCheckText = 'この端末のチェック ' + new Date().toLocaleString() + '\n' + v[1] + '\n' + it.map(function (x) { return '[' + SSC_CHECK_LV[x.lv] + '] ' + x.title + (x.detail ? '\n    ' + txt(x.detail) : '') + (x.fix ? '\n    対応: ' + txt(x.fix) : ''); }).join('\n'); }
function sscCheckCopy() { var ta = document.createElement('textarea'), ok = false; ta.value = sscCheckText; ta.style.cssText = 'position:fixed;left:-9999px;top:0;'; document.body.appendChild(ta); ta.select(); try { ok = document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta);
    document.getElementById('sscCheckMsg').textContent = ok ? 'コピーしました' : 'コピーできませんでした'; }
document.addEventListener('keydown', function (e) { if (e.keyCode === 27) sscCheckClose(); });
// 暗い写真(黒いコネクター等)は黒い背景で形が見えないので、下のハメ図と配索経路上のハメ図の写真の切り抜きの境(外側と内側の穴)に白い線(0.5px、濃さ 50%)を付ける。写真の色は変えない
// 暗いかは、写真を 64×64 に縮めて、ほぼ不透明な点(アルファ 200 より上)の明るさ(0.299R + 0.587G + 0.114B)の真ん中が 5 未満の時
// (略図は白い線・地は透明に変えてあるので、明るさは 255 になり線は付かない)
// 画面の描画を遅らせない様に、頼まれた写真は順番に並べて、ページの load の後、ブラウザーが空いた時(requestIdleCallback)に 1 枚ずつ計算する。同じ写真は 1 度だけ計算する
// 同じ要素に何度頼んでも(写真の切り替え)、前の線を消して、最後に頼んだ写真で決める。写真は img/ と ./img/ の両方の書き方で来るので、URL に直して同じ写真と分かる様にする
// file:// で開いた時は写真の点を読めない(SecurityError)ので、線を付けない
// 線は写真の上に重ねる div(背景は写真の要素から inherit。切り詰めの backgroundSize・Position もそのまま)に SVG の filter で描く。filter は線の所だけを残す
// 写真は main.js の読み込み中(この行より前)から頼まれるので、順番待ちの列と計算した値は最初に頼まれた時に作る
var DARK_PHOTO_LUM = 5, DARK_PHOTO_LINE = '#FFFFFF', DARK_PHOTO_LINE_OPACITY = 0.5, darkPhotoLum, darkPhotoQueue, darkPhotoBusy;
function darkPhotoOutline(el, src) { if (!darkPhotoQueue) { darkPhotoQueue = []; darkPhotoLum = {}; } src = new URL(src, document.baseURI).href; darkPhotoRing(el, false); el.setAttribute('data-dpo-src', src); darkPhotoQueue.push([el, src]); darkPhotoSchedule(); }
function darkPhotoSchedule() { if (darkPhotoBusy || !darkPhotoQueue.length) return; darkPhotoBusy = true; var go = function () { window.requestIdleCallback(darkPhotoNext, { timeout: 2000 }); }; if (document.readyState === 'complete') go(); else window.addEventListener('load', go); }
function darkPhotoNext() { var q = darkPhotoQueue.shift(); if (!q) { darkPhotoBusy = false; return; } darkPhotoLumOf(q[1], function (v) { if (q[0].getAttribute('data-dpo-src') === q[1] && v !== null && v < DARK_PHOTO_LUM) darkPhotoRing(q[0], true); darkPhotoBusy = false; darkPhotoSchedule(); }); }
// 明るさの真ん中を返す。読めない時は null
function darkPhotoLumOf(src, cb) { if (darkPhotoLum[src] !== undefined) { cb(darkPhotoLum[src]); return; } var im = new Image(); im.onerror = function () { darkPhotoLum[src] = null; cb(null); };
    im.onload = function () { var c = document.createElement('canvas'), n = 64, d, v = null; c.width = n; c.height = n; var x = c.getContext('2d'); x.drawImage(im, 0, 0, n, n); try { d = x.getImageData(0, 0, n, n).data; } catch (e) { d = null; }
        if (d) { var l = []; for (var i = 0; i < d.length; i += 4) if (d[i + 3] > 200) l.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]); if (l.length) { l.sort(function (a, b) { return a - b; }); v = l[l.length >> 1]; } }
        darkPhotoLum[src] = v; cb(v); }; im.src = src; }
// 線を消す(on が true の時は、消してから付ける)
function darkPhotoRing(el, on) { [].forEach.call(el.querySelectorAll(':scope > .darkPhotoOutline'), function (e) { el.removeChild(e); }); if (!on) return;
    if (!document.getElementById('darkPhotoOutlineFilter')) { var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
        // アルファを 0 か 1 にして、0.5px 太らせた所から写真の所を抜き、白(濃さ 50%)で塗る(Chrome は太さを画面の点の単位に丸めるので、拡大率 100% では 1px)
        svg.innerHTML = '<filter id="darkPhotoOutlineFilter" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="a"><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer>' +
            '<feMorphology in="a" operator="dilate" radius="0.5" result="d"/><feComposite in="d" in2="a" operator="out" result="r"/><feFlood flood-color="' + DARK_PHOTO_LINE + '" flood-opacity="' + DARK_PHOTO_LINE_OPACITY + '"/><feComposite in2="r" operator="in"/></filter>'; document.body.appendChild(svg); }
    var r = document.createElement('div'); r.className = 'darkPhotoOutline'; r.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;background:inherit;filter:url(#darkPhotoOutlineFilter);'; el.insertBefore(r, el.firstChild); }
// 配索経路上の小さいハメ図(.imageBox.blink)と、ハメ図を元の場所から動かした時に繋ぐ線(svg の path.blink)の点滅。どちらも同じ見せ方・同じタイミングにする
// 設定の SMALL_BLINK_STYLE: 1=薄く残る(消えずに濃さ 30% まで。切り替えはふわっと) 2=消える(今まで。初め) 3=点滅しない(濃さ 50% で出したまま)
// 設定の SMALL_BLINK_SYNC: false=端末の番号でずらす(今まで。初め。blinkDelayForNumber) true=全部同時
// アニメーションは作られた時刻から数えるので、ハメ図と線で作られた時刻が違うと、同じずらしでもずれる。load の後と設定を変えた時に、始まりの時刻(startTime)を全部 0 にそろえる
var SMALL_BLINK_STYLES = ['薄く残る', '消える', '点滅しない'], SMALL_BLINK_SYNCS = ['順番', '同時'];
(function () { var st = document.createElement('style'); st.textContent = '@keyframes smallBlinkFade { 0%, 45% { opacity: 1; } 60%, 85% { opacity: 0.3; } 100% { opacity: 1; } }' +
    ' body.smallBlinkFade .imageBox.blink, body.smallBlinkFade path.blink { animation-name: smallBlinkFade !important; animation-timing-function: ease-in-out !important; visibility: visible !important; }' +
    ' body.smallBlinkStill .imageBox.blink, body.smallBlinkStill path.blink { animation: none !important; visibility: visible !important; opacity: 0.5 !important; }' +
    ' body.smallBlinkSync .imageBox.blink, body.smallBlinkSync path.blink { animation-delay: 0s !important; }'; document.head.appendChild(st); })();
function applySmallBlink() { var b = document.body, s = (typeof sscSettings !== 'undefined' && sscSettings.SMALL_BLINK_STYLE) || DEFAULT_SMALL_BLINK_STYLE; if (!b) return;
    b.classList.toggle('smallBlinkFade', s === 1); b.classList.toggle('smallBlinkStill', s === 3); b.classList.toggle('smallBlinkSync', typeof sscSettings !== 'undefined' && sscSettings.SMALL_BLINK_SYNC === true); requestAnimationFrame(smallBlinkAlign); }
function smallBlinkAlign() { if (!document.getAnimations) return; document.getAnimations().forEach(function (a) { var e = a.effect && a.effect.target; if (a.id !== 'fx' && e && e.matches && e.matches('.imageBox.blink, path.blink') && a.startTime !== 0) a.startTime = 0; }); }
// 線は load の後に作られる物もあるので、少し後にもそろえる
window.addEventListener('load', function () { applySmallBlink(); setTimeout(smallBlinkAlign, 500); setTimeout(smallBlinkAlign, 1500); });
// 設定モーダルの「小さいハメ図の点滅」と「点滅のタイミング」。文字のボタンを並べて、選んだ物は緑の枠。点滅の仕方は下のハメ図の高さと同じ様に、下に濃さ(%)を出す。選んだらこのページもすぐ変わる
function appendSmallBlinkSetting(panel, current) { [['小さいハメ図の点滅', SMALL_BLINK_STYLES, current.SMALL_BLINK_STYLE || DEFAULT_SMALL_BLINK_STYLE, function (i) { return { SMALL_BLINK_STYLE: i + 1 }; }, ['30%', '0%', '50%']],
        ['小さいハメ図の点滅のタイミング', SMALL_BLINK_SYNCS, current.SMALL_BLINK_SYNC === true ? 2 : 1, function (i) { return { SMALL_BLINK_SYNC: i === 1 }; }]].forEach(function (g) {
        var row = document.createElement('div'); row.style.cssText = 'display:flex;flex-direction:column;gap:0.4em;margin-bottom:0.9em;'; var label = document.createElement('span'); label.textContent = g[0]; label.style.cssText = 'font-size:0.9em;color:#ccc;white-space:nowrap;'; row.appendChild(label);
        var choices = document.createElement('div'); choices.style.cssText = 'display:flex;gap:0.5em;-webkit-user-select:none;user-select:none;'; var items = [];
        function mark(n) { items.forEach(function (it, k) { it.style.outline = (k + 1 === n) ? '0.2em solid #00C853' : '1px solid #555'; it.style.outlineOffset = (k + 1 === n) ? '0.1em' : '0'; }); }
        g[1].forEach(function (name, i) { var it = document.createElement('div'); it.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:0.35em 0.3em;background:#333;border-radius:4px;text-align:center;font-size:0.8em;cursor:pointer;';
            var nm = document.createElement('span'); nm.textContent = name; it.appendChild(nm); if (g[4]) { var pc = document.createElement('span'); pc.textContent = g[4][i]; pc.style.cssText = 'font-size:0.94em;color:#ccc;line-height:1;'; it.appendChild(pc); }
            it.addEventListener('click', function () { window.setSscSetting(g[3](i)); mark(i + 1); }); choices.appendChild(it); items.push(it); });
        mark(g[2]); row.appendChild(choices); panel.appendChild(row); }); }
// 設定モーダルのスクロールバー: 細く(8px。今までの半分)、色はモーダルに合わせる(溝はモーダルの地、つまみは枠の灰色で角を丸く)。モーダルの文字は選べない様にする(数字を打つ欄は除く)
(function () { var st = document.createElement('style'); st.textContent = '#ssc56SettingsModalOverlay > div::-webkit-scrollbar { width: 8px; } #ssc56SettingsModalOverlay > div::-webkit-scrollbar-track { background: transparent; margin: 6px 0; }' +
    ' #ssc56SettingsModalOverlay > div::-webkit-scrollbar-thumb { background: #4a4a4a; border-radius: 4px; } #ssc56SettingsModalOverlay > div::-webkit-scrollbar-thumb:hover { background: #666; }' +
    ' #ssc56SettingsModalOverlay > div { -webkit-user-select: none; user-select: none; } #ssc56SettingsModalOverlay input { -webkit-user-select: text; user-select: text; }'; document.head.appendChild(st); })();
// 設定モーダルの上の所(1 つ目の枠の上の縁より上。QR と × のボタンは除く)をドラッグすると、モーダルを動かす。カーソルは変えない。ヘッダーが画面の外に出ない様にする
// モーダルの中で押して外で離した時(ドラッグなど)は、外のクリック(モーダルを閉じる)にしない。外で押して外で離した時だけ閉じる
var sscModalDownOut = false; window.addEventListener('click', function (e) { var ov = document.getElementById('ssc56SettingsModalOverlay'); if (ov && e.target === ov && !sscModalDownOut) e.stopPropagation(); }, true);
document.addEventListener('pointerdown', function (e) { var ov = document.getElementById('ssc56SettingsModalOverlay'), panel = ov && ov.firstElementChild, head = panel && panel.firstElementChild; sscModalDownOut = !!ov && e.target === ov;
    var sec = head && head.nextElementSibling; if (!sec || e.button !== 0 || !panel.contains(e.target) || e.clientY >= sec.getBoundingClientRect().top || (e.target.closest && e.target.closest('button'))) return;
    var x0 = e.clientX, y0 = e.clientY, l0 = parseFloat(panel.style.left) || 0, t0 = parseFloat(panel.style.top) || 0, r = panel.getBoundingClientRect(), hr = head.getBoundingClientRect(); e.preventDefault(); panel.style.position = 'relative';
    function move(ev) { var dx = ev.clientX - x0, dy = ev.clientY - y0;
        dx = Math.max(-r.left - r.width + 60, Math.min(window.innerWidth - r.left - 60, dx)); dy = Math.max(-hr.top, Math.min(window.innerHeight - hr.bottom, dy)); panel.style.left = (l0 + dx) + 'px'; panel.style.top = (t0 + dy) + 'px'; }
    function up() { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); }
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up); });
// 画面が出た時の演出(数字のデコードと経路を描く)。load の後に 0.5 秒ほど動かす(読み取り・クリックはそのまま効く)
// 経路と札は terminal.css で演出が始まるまで隠している(html に fxStarted が付くと出る)。演出が動かなかった時も 5 秒で出す
// 数字のデコード: 端末番号・ヘッダー・ハメ図の穴などの文字(英大文字・数字・. - / だけの 12 文字まで)を、同じ種類のランダムな文字で回して、左から順に正しい値に止める(0.2 - 0.5 秒)
// 経路を描く: 今の構成番号の端末(.currentTerminalGlow。無いページは画面の真ん中)から見えない円が広がり、円の中だけ経路(svg)が見える。端末の札・小さいハメ図などは円が着いた時にふわっと出る(0.5 秒)
// 札は大きさを変えずに濃さと明るさだけ変える(大きさを変えると、その間に場所を測る処理が狂う)。アニメーションの id は fx(smallBlinkAlign はそろえない)
var FX_DIG = '0123456789', FX_ABC = 'ABCDEFGHJKLMNPRSTUVWXYZ';
function fxScramble(s, keep) { var o = ''; for (var i = 0; i < s.length; i++) { var c = s.charAt(i); o += i < keep ? c : /[0-9]/.test(c) ? FX_DIG.charAt(Math.random() * 10 | 0) : /[A-Z]/.test(c) ? FX_ABC.charAt(Math.random() * FX_ABC.length | 0) : c; } return o; }
function fxDecode() { var list = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), t0 = performance.now(), last = -1e9;
    while (w.nextNode()) { var n = w.currentNode, t = n.nodeValue, p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName) || p.closest('.out, #ssc56SettingsModalOverlay')) continue;
        if (!/^\s*[0-9A-Z][0-9A-Z.\-\/]{0,11}\s*$/.test(t)) continue; var r = p.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight) continue;
        list.push({ n: n, t: t, end: 180 + 320 * Math.max(0, Math.min(1, r.left / innerWidth)), lead: t.length - t.replace(/^\s+/, '').length, len: t.trim().length }); }
    (function step(now) { var tt = now - t0, live = false;
        list.forEach(function (o) { if (o.done) return; if (tt >= o.end) { o.n.nodeValue = o.t; o.done = true; return; } live = true;
            if (tt - last >= 45) o.n.nodeValue = fxScramble(o.t, o.lead + Math.floor(o.len * Math.max(0, (tt - o.end + 160) / 160))); });
        if (tt - last >= 45) last = tt; if (live) requestAnimationFrame(step); })(t0); }
function fxRouteDraw() { var g = document.querySelectorAll('.currentTerminalGlow'), ox = 0, oy = 0, n = 0, D = 520, t0 = performance.now();
    [].forEach.call(g, function (e) { var r = e.getBoundingClientRect(); if (r.width) { ox += r.left + r.width / 2; oy += r.top + r.height / 2; n++; } }); if (n) { ox /= n; oy /= n; } else { ox = innerWidth / 2; oy = innerHeight * 0.35; }
    var maxR = Math.max(Math.hypot(ox, oy), Math.hypot(innerWidth - ox, oy), Math.hypot(ox, innerHeight - oy), Math.hypot(innerWidth - ox, innerHeight - oy));
    var svgs = [].filter.call(document.querySelectorAll('svg'), function (s) { return s.querySelector('line, path') && !s.closest('button, .bottomImage, #ssc56SettingsModalOverlay'); }).map(function (s) { return { s: s, r: s.getBoundingClientRect() }; });
    [].forEach.call(document.querySelectorAll('.box, .circle, .imageBox, .jointPosMark, .jointPosLabel, .compTermTag'), function (e) { if (!e.animate) return; var r = e.getBoundingClientRect(), d = Math.hypot(r.left + r.width / 2 - ox, r.top + r.height / 2 - oy);
        var a = e.animate([{ opacity: 0, filter: 'brightness(2.5)' }, { opacity: 1, filter: 'brightness(2.5)', offset: 0.5 }, { opacity: 1, filter: 'brightness(1)' }], { duration: 220, delay: D * d / maxR, fill: 'backwards', easing: 'ease-out' }); a.id = 'fx'; });
    (function step(now) { var k = Math.max(0, Math.min(1, (now - t0) / D)), r = maxR * (1 - Math.pow(1 - k, 2));
        svgs.forEach(function (v) { v.s.style.clipPath = k < 1 ? 'circle(' + r + 'px at ' + (ox - v.r.left) + 'px ' + (oy - v.r.top) + 'px)' : ''; }); if (k < 1) requestAnimationFrame(step); })(t0);
    document.documentElement.classList.add('fxStarted'); }
window.addEventListener('load', function () { setTimeout(function () { fxDecode(); fxRouteDraw(); }, 0); });
setTimeout(function () { document.documentElement.classList.add('fxStarted'); }, 5000);
// ジョイントのページの下: 穴と一覧の行を繋ぐ点線(drawJointLinks)の組に、同じ番号の丸い札(1 から)を付ける。穴の左上の角と、一覧の行の番号の札の左。点線は今のまま
// 札と行の地(薄く)の色は、その組の点線の色。点線を目で追わなくても、番号で組が分かる。画面の大きさが変わった時はページを読み直すので、札は描いた時の場所に置く(position: fixed)
(function () { var st = document.createElement('style'); st.textContent = '.jointLinkMark { position: fixed; z-index: 40; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%; border: 2px solid #000; box-sizing: border-box; color: #000; font: bold 14px/18px MPLUS1p, sans-serif; text-align: center; pointer-events: none; box-shadow: 0 0 0 1.5px #fff; }' +
    ' .jointLinkRowTint { position: fixed; z-index: 1; pointer-events: none; border-radius: 3px; opacity: .16; }'; document.head.appendChild(st); })();
function jointLinkMarks(marks) { var list = document.querySelector('.jointInfo'); if (!list) return;
    marks.forEach(function (m, i) { var row = list.querySelector(".wireInfoRow[data-composition='" + m.dot.getAttribute('data-composition') + "']"); if (!row) return; var badge = row.querySelector('.wireInfoBadge') || row, dr = m.dot.getBoundingClientRect(), br = badge.getBoundingClientRect(), rr = row.getBoundingClientRect();
        [[dr.left - 4, dr.top - 4], [br.left - 14, br.top + br.height / 2]].forEach(function (q) { var e = document.createElement('div'); e.className = 'jointLinkMark'; e.textContent = String(i + 1); e.style.left = q[0] + 'px'; e.style.top = q[1] + 'px'; e.style.background = m.col; document.body.appendChild(e); });
        var t = document.createElement('div'); t.className = 'jointLinkRowTint'; t.style.cssText = 'left:' + (rr.left - 3) + 'px;top:' + rr.top + 'px;width:' + (rr.width + 6) + 'px;height:' + rr.height + 'px;background:' + m.col + ';'; document.body.appendChild(t); }); }
// 下のハメ図の形が Bon/Ter(電線の帯を描く形)の時、電線を太さ(断面積から出した直径)の割合で並べ直す。並べる向きの全体の長さと始まりは元のまま
// 座標が縦に並んでいる時(y がずれている)は縦に積む(今まで通り)。横に並んでいる時(x がずれていて y が同じ。例 縦長の写真で電線が下に出る丸端子)は横に並べる
// (今までは向きに関係なく縦に積んでいたので、横に並んだ電線が階段状に崩れ、その高さに合わせて写真もとても小さく描かれていた)
function bonRestack(pts) { var d = pts.map(function (p) { var a = parseFloat(p.wireSize) || 0; return 2 * Math.sqrt(a / Math.PI); }), tot = d.reduce(function (a, b) { return a + b; }, 0);
    var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; }), horiz = Math.max.apply(null, xs) - Math.min.apply(null, xs) > Math.max.apply(null, ys) - Math.min.apply(null, ys);
    var len = pts.reduce(function (s, p) { return s + (horiz ? p.w : p.h); }, 0), cum = horiz ? pts[0].x : pts[0].y;
    return pts.map(function (p, i) { var n = tot > 0 ? d[i] / tot * len : (horiz ? p.w : p.h), q = horiz ? { x: cum, y: p.y, w: n, h: p.h } : { x: p.x, y: cum, w: p.w, h: n }; cum += n; return q; }); }
// ボンダーの写真の下に電線の一覧を出す時(構成番号のページ)の、写真の高さの上限。一覧の 1 行が 20px より小さくならない様に、下の帯の高さから 電線の本数 x 20px を引く(最低 40px)
function bonListBelowCap(maxH, n) { return Math.max(40, maxH - n * 20); }
// Bon/Ter の電線の帯を、黒い背景・黒い写真の上でも分かる様にする。帯の色はそのまま(縁で塗りつぶさない)
// 束の外側: 束全体(wireColorBandWrap)の外に細い枠。帯の境目: 2 本目からの帯の、前の帯との境の 1 辺だけに半透明の線(並ぶ向きは前の帯との場所の違いで決める)。2px より細い帯には境目の線を付けない
var BON_OUTLINE = '#9E9E9E', BON_SEP = 'rgba(150,150,150,.6)';
function bonBandEdge(band, color, wrap) { var prev = wrap.lastElementChild; if (!prev) { wrap.style.boxShadow = '0 0 0 1px var(--bon-outline, ' + BON_OUTLINE + ')'; return; }
    var horiz = Math.abs(parseFloat(band.style.left) - parseFloat(prev.style.left)) > 0.01, size = parseFloat(horiz ? band.style.width : band.style.height); if (size < 2) return;
    band.style.boxShadow = 'inset ' + (horiz ? '1px 0' : '0 1px') + ' 0 var(--bon-sep, ' + BON_SEP + ')'; }
// 端末番号のページ(例 28.html。.boxTerminal がある)で、そのページと同じ端末番号(28)をもう一度読んだら、端末番号-.html(28-.html。配索経路と下のハメ図のページ)に移る
// 構成番号のページ(例 0144.html)や 端末番号-.html では、今まで通り(番号.html を開く)
function sscSameTerminalAgain(v) { var m = /\/([^\/]+)\.html$/.exec(window.location.pathname), cur = m ? decodeURIComponent(m[1]) : ''; return !!cur && String(v).trim() === cur && sscPageKind() === 'term'; }
// 先ハメの表現 6(回る点線)の点線を回す。点線は firstInsertMark が穴に重ねる SVG の枠(周りの長さを 100 として 5.5 + 2.8333 を 12 回)。1 周期(8.3333)ずらして繰り返すので、繋ぎ目なく回り続ける
(function () { var st = document.createElement('style'); st.textContent = '.firstInsertDash { animation: firstInsertDash 0.6s linear infinite; } @keyframes firstInsertDash { to { stroke-dashoffset: -8.3333; } }'; document.head.appendChild(st); })();
// 構成番号のページ: 今の電線と同じ穴(下のハメ図の同じ cav)に入る他の電線があれば、その電線のもう片方の端末のハメ図を下の帯に足す(ジョイントと同じ考え)
// 足すハメ図は、相手の構成番号のページ(同じフォルダの NNNN.html)の下のハメ図をそのまま写す。data-current-composition は相手の構成番号(相手の穴が普通の点滅)、data-same-hole も相手の構成番号
// 下のハメ図の並べ方を決める前(setPositionFromDataAttributes の前)に要るので、相手のページは同期で読む。読めない時(file:// で開いた時など)は足さない
// 並びは端末番号の札の行と同じ(配索経路の札の x の順)に 左・真ん中(50)・右。真ん中には data-bottom-mid。ジョイントのページ(真ん中に一覧がある)と、下のハメ図が 2 つでないページは足さない
function sameHoleInsertBottom() { if (document.querySelector('script.jointInfoData') || document.querySelector('.bottomImage[data-same-hole]')) return; var bis = [].slice.call(document.querySelectorAll('.bottomImage[data-current-composition]')); if (bis.length !== 2) return;
    var cur = bis[0].getAttribute('data-current-composition'), terms = bis.map(sameHoleBiTerm), add = null;
    bis.forEach(function (bi) { if (add) return; var me = sameHoleBiData(bi).filter(function (x) { return x.composition === cur && x.cav; })[0]; if (!me) return;
        sameHoleBiData(bi).forEach(function (x) { if (add || !x.composition || x.composition === cur || x.cav !== me.cav) return; var html = '';
            try { var q = new XMLHttpRequest(); q.open('GET', x.composition + '.html', false); q.send(); if (q.status === 200) html = q.responseText; } catch (e) { html = ''; } if (!html) return;
            var doc = new DOMParser().parseFromString(html, 'text/html'); [].forEach.call(doc.querySelectorAll('.bottomImage'), function (b) { if (add || b.getAttribute('data-same-hole') || b.getAttribute('data-joint-slot') === '1') return; var t = sameHoleBiTerm(b), s = b.nextElementSibling;
                if (!t || terms.indexOf(t) !== -1 || !s || !s.classList.contains('blink-coords-data')) return; add = { div: b, data: s, comp: x.composition }; }); }); });
    if (!add) return; var div = document.importNode(add.div, true), data = document.importNode(add.data, true), last = bis[1].nextElementSibling && bis[1].nextElementSibling.classList.contains('blink-coords-data') ? bis[1].nextElementSibling : bis[1];
    div.setAttribute('data-same-hole', add.comp); div.setAttribute('data-current-composition', add.comp); last.parentNode.insertBefore(data, last.nextSibling); last.parentNode.insertBefore(div, data);
    var tx = function (b) { var e = document.getElementById(sameHoleBiTerm(b) + 'tag'); return e ? parseFloat(e.getAttribute('data-x')) || 50 : 50; };
    bis.concat([div]).sort(function (a, b) { return tx(a) - tx(b); }).forEach(function (b, i) { b.setAttribute('data-position', ['left', '50', 'right'][i]); if (i === 1) b.setAttribute('data-bottom-mid', '1'); else b.removeAttribute('data-bottom-mid'); }); var mid = document.querySelector('.bottomImage[data-bottom-mid]'), all = document.querySelectorAll('.bottomImage'), tail = all[all.length - 1]; if (mid && mid !== tail) { var md = mid.nextElementSibling, td = tail.nextElementSibling && tail.nextElementSibling.classList.contains('blink-coords-data') ? tail.nextElementSibling : tail; td.parentNode.insertBefore(mid, td.nextSibling); if (md && md.classList.contains('blink-coords-data')) mid.parentNode.insertBefore(md, mid.nextSibling); } }
// 下のハメ図の端末番号(写真の名前 ./img/端末番号_1.png から)と、そのハメ図のデータ(次の script.blink-coords-data。入れ子の配列は平らにする)
function sameHoleBiTerm(b) { return (b.getAttribute('data-src') || '').replace(/^.*\/img\//, '').replace(/_[^_]*$/, ''); }
function sameHoleBiData(b) { var s = b.nextElementSibling, l, flat = []; if (!s || !s.classList.contains('blink-coords-data')) return flat; try { l = JSON.parse(s.textContent); } catch (e) { return flat; } (function f(a) { if (Array.isArray(a)) a.forEach(function (x) { if (Array.isArray(x)) f(x); else flat.push(x); }); })(l); return flat; }
// 同じ穴に入る電線(下のハメ図の同じ cav に 2 本以上): 今の電線と同じ穴の他の電線が、どの端末へ行くかをジョイントの子の線と同じ見せ方で出す
// 他の電線の行先は、ハメ図のデータの oppositeTerminal(無い時は、その電線が入っている他の端末 = .wireBox の data-composition と data-tag)。道は配索経路の線だけを通る一番短い道(jointRoutePath)
// 線は電線の色の実線(太さ 6)に縞の色の芯(太さ 2)を重ねて、配索経路の線より奥に描く。今の電線の点滅の線と重なる所は描かない(点滅が消えた時に、そこだけ点いて見えない様に)
// 札(白・構成番号 → 行先の端末)は、今の電線の線から離れる所に出す
function sameHolePartners() { var bi = document.querySelector('.bottomImage[data-current-composition]'), cur = bi ? bi.getAttribute('data-current-composition') : '', out = []; if (!cur) return out;
    document.querySelectorAll('.bottomImage').forEach(function (b) { var s = b.nextElementSibling, term = (b.getAttribute('data-src') || '').replace(/^.*\/img\//, '').replace(/_[^_]*$/, ''), list; if (b.getAttribute('data-same-hole') || !s || !s.classList.contains('blink-coords-data')) return; try { list = JSON.parse(s.textContent); } catch (e) { return; } if (!Array.isArray(list)) return;
        var flat = []; (function f(a) { a.forEach(function (x) { if (Array.isArray(x)) f(x); else flat.push(x); }); })(list); var me = flat.filter(function (x) { return x.composition === cur && x.cav; })[0]; if (!me) return;
        flat.forEach(function (x) { if (x.composition === cur || x.cav !== me.cav || out.some(function (o) { return o.composition === x.composition; })) return; var to = x.oppositeTerminal || sameHoleOpposite(x.composition, term); if (to) out.push({ composition: x.composition, from: term, to: to, color: x.color, bgColor: x.bgColor }); }); });
    return out; }
function sameHoleOpposite(comp, term) { var r = ''; document.querySelectorAll('.wireBox[data-composition]').forEach(function (w) { var t = (w.getAttribute('data-tag') || '').replace(/tag$/, ''); if (!r && t !== term && w.getAttribute('data-composition').split(/[:,]/).indexOf(comp) !== -1) r = t; }); return r; }
function sameHoleTerm(n) { var b = document.getElementById(n + 'tag'); if (!b || !b.getAttribute('data-x')) return null; return { x: parseFloat(b.getAttribute('data-x')), y: parseFloat(b.getAttribute('data-y')) }; }
function drawSameHoleRoutes() { if (drawSameHoleRoutes.done) return; drawSameHoleRoutes.done = true; var ps = sameHolePartners(), route = document.getElementById('route1'); if (!ps.length || !route) return; route = route.ownerSVGElement;
    var edges = []; document.querySelectorAll('line[id^="route"]').forEach(function (l) { edges.push({ a: { x: parseFloat(l.getAttribute('x1')), y: parseFloat(l.getAttribute('y1')) }, b: { x: parseFloat(l.getAttribute('x2')), y: parseFloat(l.getAttribute('y2')) } }); });
    var bseg = [].map.call(document.querySelectorAll('line.blinkWire'), function (ln) { return ['x1', 'y1', 'x2', 'y2'].map(function (n) { return parseFloat(ln.getAttribute(n)); }); });
    function onBase(q) { var x = +q.x, y = +q.y; return bseg.some(function (s) { var dx = s[2] - s[0], dy = s[3] - s[1], L = dx * dx + dy * dy, u = L ? ((x - s[0]) * dx + (y - s[1]) * dy) / L : 0, ex, ey; if (u < -0.01 || u > 1.01) return false; ex = s[0] + u * dx - x; ey = s[1] + u * dy - y; return ex * ex + ey * ey < 0.04; }); }
    function seg(pts, attrs, before) { for (var i = 1; i < pts.length; i++) { var l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l.setAttribute('x1', pts[i - 1].x + '%'); l.setAttribute('y1', pts[i - 1].y + '%'); l.setAttribute('x2', pts[i].x + '%'); l.setAttribute('y2', pts[i].y + '%'); l.setAttribute('stroke-linecap', 'round'); for (var k in attrs) if (attrs[k]) l.setAttribute(k, attrs[k]); route.insertBefore(l, before); } }
    var first = route.firstChild, sr = route.getBoundingClientRect();
    ps.forEach(function (p) { var a = sameHoleTerm(p.from), b = sameHoleTerm(p.to); if (!a || !b) return; var path = jointRoutePath(edges, a, b); if (!path) return; var k = 0; while (k < path.length - 1 && onBase(path[k]) && onBase(path[k + 1])) k++; path = path.slice(k); if (path.length < 2) return;
        var oc = p.color || '#FFFFFF', om = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(oc), od = om ? parseInt(om[1], 16) * 0.299 + parseInt(om[2], 16) * 0.587 + parseInt(om[3], 16) * 0.114 < 40 : false;
        seg(path, { stroke: od ? '#FFFFFF' : oc, 'stroke-width': 6 }, first); if (p.bgColor && p.bgColor.toUpperCase() !== oc.toUpperCase()) seg(path, { stroke: p.bgColor, 'stroke-width': 2 }, first);
        var x = sr.left + window.scrollX + path[0].x / 100 * sr.width, y = sr.top + window.scrollY + path[0].y / 100 * sr.height, lb = document.createElement('div');
        lb.className = 'jointPosLabel sameHoleLabel'; lb.textContent = p.composition + ' → ' + p.to; lb.title = '同じ穴(端末 ' + p.from + ')に入る電線';
        lb.style.cssText = "position:absolute;z-index:31;pointer-events:none;transform:translate(-100%,-50%);font:bold 12px/1 'MPLUS1p',sans-serif;padding:2px 4px;border-radius:3px;white-space:nowrap;background:#FFFFFF;color:#000000;left:" + (x - 10) + 'px;top:' + y + 'px;';
        document.body.appendChild(lb); }); }
window.addEventListener('load', function () { setTimeout(drawSameHoleRoutes, 380); });
// 同じ穴に入る電線: 相手の電線のもう片方の端末のハメ図(data-same-hole。sameHoleInsertBottom が下の帯の真ん中に足す。相手の穴が普通の点滅)を、ジョイントと同じ考えで下に出す
// 今の端末のハメ図の相手の穴から、真ん中のハメ図の相手の穴(ボンダーの時は一覧の相手の行)までを、流れる点線で繋ぐ。道順は bondLinkRoute(他の穴を避ける)。線の色は相手の電線の色(暗い色は白)
// 真ん中のハメ図の端末番号は、下の帯の上の端末番号の札の行に並べる(placeCompositionTerminalTags)。真ん中のハメ図が無い時は、相手の穴の横に「構成番号 → 行先の端末」の札を出して繋ぐ
// 同じ穴に入る相手の電線(構成番号 c)の色。暗い色(黒い背景で見えない)は白
function sameHoleLineColor(c) { var p = sameHolePartners().filter(function (q) { return q.composition === c; })[0], col = p && p.color || '', m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col); return !m || parseInt(m[1], 16) * 0.299 + parseInt(m[2], 16) * 0.587 + parseInt(m[3], 16) * 0.114 < 40 ? '#FFFFFF' : col; }
function sameHoleTarget(p) { var bi = document.querySelector(".bottomImage[data-same-hole='" + p.composition + "']"); if (!bi) return null; var t = bi.querySelector(".imageBoxDot[data-composition='" + p.composition + "']");
    if (!t) { var br = bi.getBoundingClientRect(), cx = br.left + br.width / 2, best = null, bd = Infinity; document.querySelectorAll(".wireInfoList .wireInfoRow[data-composition='" + p.composition + "']").forEach(function (r) { var rr = r.getBoundingClientRect(), dd = Math.abs(rr.left + rr.width / 2 - cx); if (dd < bd) { bd = dd; best = r; } }); t = best; }
    return t ? { bi: bi, el: t } : null; }
function drawSameHoleBottom() { var ps = sameHolePartners(), pairs = [], tags = [], W = window.innerWidth; if (!ps.length) return;
    ps.forEach(function (p) { var dot = null; document.querySelectorAll('.bottomImage').forEach(function (b) { var term = (b.getAttribute('data-src') || '').replace(/^.*\/img\//, '').replace(/_[^_]*$/, ''); if (!dot && term === p.from && !b.getAttribute('data-same-hole')) dot = b.querySelector(".imageBoxDot[data-composition='" + p.composition + "']"); }); if (!dot) return;
        var dr = dot.getBoundingClientRect(), tg = sameHoleTarget(p);
        if (tg) { var tr = tg.el.getBoundingClientRect(), right = tr.left + tr.width / 2 > dr.left + dr.width / 2; pairs.push({ dot: dot, x: right ? tr.left - 4 : tr.right + 4, y: tr.top + tr.height / 2, dir: right ? 2 : 0, col: p.color, end: tg.el }); return; }
        var bi = dot.closest('.bottomImage').getBoundingClientRect(), right2 = bi.left + bi.width / 2 < W / 2, y = dr.top + dr.height / 2;
        tags.forEach(function (t) { if (t.right === right2 && Math.abs(t.y - y) < 30) y = t.y + 30; });
        var el = document.createElement('div'); el.className = 'sameHoleTag'; el.title = '同じ穴(端末 ' + p.from + ')に入る電線と、その行先の端末';
        el.innerHTML = '<span class="shComp">' + p.composition + '</span><span class="shArrow">→</span><span class="shTerm">' + p.to + '</span>';
        el.style.cssText = "position:fixed;z-index:26;pointer-events:none;display:flex;align-items:center;gap:6px;font:bold 22px/1 'MPLUS1p',sans-serif;color:#FFFFFF;white-space:nowrap;transform:translateY(-50%);top:" + y + 'px;' + (right2 ? 'left:' + (bi.right + 28) + 'px;' : 'right:' + (W - bi.left + 28) + 'px;');
        document.body.appendChild(el); el.querySelector('.shTerm').style.cssText = 'background:#FFFFFF;color:#000000;border-radius:4px;padding:3px 6px;';
        var er = el.getBoundingClientRect(); tags.push({ right: right2, y: y });
        pairs.push({ dot: dot, x: right2 ? er.left - 4 : er.right + 4, y: y, dir: right2 ? 2 : 0, col: p.color }); });
    if (!pairs.length) return; var g = bondLinkGrid(pairs), s = '';
    pairs.forEach(function (p) { var rt = bondLinkRoute(g, p); if (!rt) return; rt.pts = jointLinkOrtho(rt.pts); var d = 'M' + rt.pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' L');
        var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(p.col || ''), col = !m || parseInt(m[1], 16) * 0.299 + parseInt(m[2], 16) * 0.587 + parseInt(m[3], 16) * 0.114 < 40 ? '#FFFFFF' : p.col;
        s += "<path d='" + d + "' fill='none' stroke='#000' stroke-width='5' stroke-linejoin='round' stroke-linecap='round' opacity='.7'/><path class='flow flowBig' d='" + d + "' fill='none' stroke='" + col + "' stroke-width='2.5' stroke-linejoin='round' stroke-linecap='round'/>";
        [[p.x, p.y], rt.end].forEach(function (e) { s += "<circle cx='" + e[0] + "' cy='" + e[1] + "' r='3.5' fill='" + col + "' stroke='#000' stroke-width='1.2'/>"; }); });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'bondLinks jointLinks sameHoleLinks'); svg.innerHTML = s; document.body.appendChild(svg); }
window.addEventListener('load', function () { setTimeout(drawSameHoleBottom, 400); });
// 端末番号のページの Ter・Bon(電線の一覧がある端末): 上の写真と電線の色の帯を、構成番号のページの下のハメ図と同じ描き方にする(bonRestack で帯を写真に重ねる。縦長の写真は横に倒す)
// 置き場所は、上の表の下から電線の一覧の上まで(一覧は画面の下(版の表記の上)に寄せて、写真の場所を広くする)。前の描き方の帯(body の直下の .wireColorBand)は消す
function terPhotoLikeBottom() { var bt = document.querySelector('.boxTerminal'), raw = bt ? bt.nextElementSibling : null, pts; if (!raw || !raw.classList.contains('blink-coords-data')) return; try { pts = JSON.parse(raw.textContent); } catch (e) { return; }
    if (!pts.length || pts[0].showText !== false || bt.getAttribute('data-rotate') === '180') return; var list = document.querySelector('.wireInfoList'); if (!list) return;
    document.querySelectorAll('body > .wireColorBand').forEach(function (el) { el.parentNode.removeChild(el); });
    bonRestack(pts).forEach(function (q, i) { var p = pts[i]; p.x = q.x; p.y = q.y; p.w = q.w; p.h = q.h; }); var mx = 100, my = 100; pts.forEach(function (p) { mx = Math.max(mx, p.x + p.w); my = Math.max(my, p.y + p.h); });
    var table = document.querySelector('table'), top = table ? table.getBoundingClientRect().bottom : 0, bottom = Math.max(list.getBoundingClientRect().top, window.innerHeight - 36 - list.getBoundingClientRect().height), gap = 10, aH = bottom - top - gap * 2, aW = Math.min(window.innerWidth * 0.6, list.getBoundingClientRect().width + 20), ar = parseFloat(bt.getAttribute('data-aspect-ratio')) || 1, rot = ar < 1, h, w, vw, vh;
    h = rot ? Math.min(aW * 100 / my, aH * 100 / (ar * mx)) : Math.min(aW * 100 / (ar * mx), aH * 100 / my); w = h * ar; vw = rot ? h * my / 100 : w * mx / 100; vh = rot ? w * mx / 100 : h * my / 100;
    list.style.top = bottom + 'px'; bt.innerHTML = ''; bt.style.backgroundImage = 'none'; bt.style.width = vw + 'px'; bt.style.height = vh + 'px'; bt.style.left = (window.innerWidth - vw) / 2 + 'px'; bt.style.top = (top + gap + (aH - vh) / 2) + 'px';
    var parent = bt; if (rot) { parent = document.createElement('div'); parent.className = 'bottomImageRotWrap'; parent.style.cssText = 'position:absolute;left:50%;top:50%;transform-origin:center center;transform:translate(-50%,-50%) rotate(-90deg);width:' + (w * mx / 100) + 'px;height:' + (h * my / 100) + 'px;'; bt.appendChild(parent); }
    var ph = document.createElement('div'); ph.className = 'bottomImagePhoto'; ph.style.cssText = 'position:absolute;left:0;top:0;z-index:1;background-size:contain;background-position:center;background-repeat:no-repeat;width:' + w + 'px;height:' + h + 'px;'; ph.style.backgroundImage = 'url(' + bt.getAttribute('data-src') + ')'; parent.appendChild(ph); darkPhotoOutline(ph, bt.getAttribute('data-src'));
    renderBottomImageDots(bt, pts, 'composition', '', w, h); }
window.addEventListener('load', function () { setTimeout(terPhotoLikeBottom, 30); });
// 端末番号のページの電線の一覧(Ter・Bon): 行の右に、その電線が もう片方の端末で他の電線と同じ穴(ダブリ。相手の構成番号 → 行先の端末)か、ジョイントか(接続G_ の名前。基線は「基線」)を出す
// 行の構成番号は、ハメ図のデータの順(一覧の行と同じ順)から取る(札の文字は、開いた時に数字が回る演出の途中の事がある)。見本では、その構成番号のページ(NNNN.html)を読んで調べる(本番は VBA がハメ図のデータに入れる)
function terListMarks() { var rows = document.querySelectorAll('.wireInfoList .wireInfoRow'), me = (location.pathname.match(/\/(\d+)\.html$/) || [])[1], bt = document.querySelector('.boxTerminal'), raw = bt ? bt.nextElementSibling : null, pts = []; if (!rows.length || !me || !raw) return; try { pts = JSON.parse(raw.textContent); } catch (e) { return; }
    rows.forEach(function (row, i) { var comp = pts[i] && pts[i].composition ? String(pts[i].composition) : ''; if (!/^\d{4}$/.test(comp) || row.getAttribute('data-marks')) return; row.setAttribute('data-marks', '1');
        fetch(comp + '.html').then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) { if (!html) return; var doc = new DOMParser().parseFromString(html, 'text/html'), marks = [];
            var js = doc.querySelector('script.jointInfoData'), j = null; try { j = js ? JSON.parse(js.textContent) : null; } catch (e) { j = null; }
            if (j && j.group) marks.push({ cls: 'joint', text: 'ジョイント ' + j.group + (j.parent && j.parent.composition === comp ? '(基線)' : '') });
            doc.querySelectorAll('.bottomImage').forEach(function (bi) { if (bi.getAttribute('data-same-hole')) return; var t = (bi.getAttribute('data-src') || '').replace(/^.*\/img\//, '').replace(/_[^_]*$/, ''), s = bi.nextElementSibling, list, flat = []; if (t === me || !s || !s.classList.contains('blink-coords-data')) return; try { list = JSON.parse(s.textContent); } catch (e) { return; }
                (function f(a) { a.forEach(function (x) { if (Array.isArray(x)) f(x); else flat.push(x); }); })(list); var self = flat.filter(function (x) { return x.composition === comp && x.cav; })[0]; if (!self) return;
                flat.forEach(function (x) { if (x.composition && x.composition !== comp && x.cav === self.cav && terSideFallback) marks.push({ cls: 'dbl', text: 'ダブリ(' + t + ') ' + x.composition + ' → ' + (x.oppositeTerminal || '?') }); }); });
            if (!marks.length || !row.isConnected) { row.removeAttribute('data-marks'); return; } row.parentNode.style.overflow = 'visible'; row.style.position = 'relative'; var box = document.createElement('div'); box.className = 'terListMarks'; box.style.cssText = 'position:absolute;left:calc(100% + 12px);top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:3px;white-space:nowrap;pointer-events:none;';
            marks.forEach(function (m) { var e = document.createElement('span'); e.textContent = m.text; e.style.cssText = "font:bold 0.62em/1.15 'MPLUS1p',sans-serif;padding:2px 8px;border-radius:4px;" + (m.cls === 'dbl' ? 'background:#FFD400;color:#000;' : 'background:#2B7BFF;color:#FFF;'); box.appendChild(e); }); row.appendChild(box); }).catch(function () { }); }); }
// 一覧は後から作り直される事があるので、何回か調べる(付けた行は data-marks で飛ばす)
window.addEventListener('load', function () { [60, 600, 1500, 3000].forEach(function (t) { setTimeout(terListMarks, t); }); });
// 端末番号のページの電線の一覧(Ter・Bon): 一覧の全部の電線の相手の端末のハメ図を、一覧の左右の余白に出し、一覧の構成番号の札からハメ図のその穴まで点線で繋ぐ
// 相手の端末も Ter・Bon(穴の番号が無い)の時は、写真に電線の色の帯を重ねて出し(構成番号のページの下のハメ図と同じ。縦長は横に倒す)、その電線の帯に繋ぐ
// ハメ図の穴は、その電線と同じ穴の相手が点滅する。ハメ図の上に端末番号の札(押すとその端末のページ)、下に同じ穴の相手の行先(0963 → 56)。同じ端末は 1 つのハメ図にまとめる(2 本目からの穴は白い縁)。ジョイントの子(相手の端末が無い)は出さない
// 置き方: 一覧の上から順に、前の半分は左、後の半分は右。片側は縦に積む(12 より多い時は出さずに、一覧の右の目印で出す)
// 線: 線ごとに色を変える(TER_SIDE_COLORS)。道は 行 → 横 → 縦の通り道 → 横 → 穴。縦の通り道は線ごとに分けて、線同士が重ならない・なるべく交わらない様に並べる(上へ行く線は下の行ほどハメ図の側、下へ行く線は上の行ほどハメ図の側)
// ハメ図は、その構成番号のページ(同じフォルダの NNNN.html)の下のハメ図を読んで出す(load の後に読む。読めない時は出さない)
var terSideFallback = false, TER_SIDE_COLORS = ['#00C8FF', '#FFD400', '#7CFC00', '#FF8C00', '#DA70D6', '#FFFFFF', '#4D7CFE', '#00E5B0', '#FF69B4', '#B0E0E6', '#ADFF2F', '#FFA07A'];
function terSideHames() { var rows = document.querySelectorAll('.wireInfoList .wireInfoRow'), me = (location.pathname.match(/\/(\d+)\.html$/) || [])[1], bt = document.querySelector('.boxTerminal'), raw = bt ? bt.nextElementSibling : null, pts = [], list = document.querySelector('.wireInfoList'); if (!rows.length || !me || !raw || !list) return; try { pts = JSON.parse(raw.textContent); } catch (e) { return; } if (!pts.length || pts[0].showText !== false) return;
    var jobs = [].map.call(rows, function (row, i) { var comp = pts[i] && pts[i].composition ? String(pts[i].composition) : ''; if (!comp) return Promise.resolve(null);
        return fetch(comp + '.html').then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) { if (!html) return null; var doc = new DOMParser().parseFromString(html, 'text/html'), hit = null;
            doc.querySelectorAll('.bottomImage').forEach(function (bi) { if (hit || bi.getAttribute('data-same-hole') || bi.getAttribute('data-joint-slot') === '1') return; var t = (bi.getAttribute('data-src') || '').replace(/^.*\/img\//, '').replace(/_[^_]*$/, ''), s = bi.nextElementSibling, l, flat = []; if (t === me || !s || !s.classList.contains('blink-coords-data')) return; try { l = JSON.parse(s.textContent); } catch (e) { return; }
                (function f(a) { a.forEach(function (x) { if (Array.isArray(x)) f(x); else flat.push(x); }); })(l); var ter = flat.length > 0 && flat[0].showText === false, self = flat.filter(function (x) { return x.composition === comp && (ter || x.cav); })[0]; if (!self) return;
                var pr = ter ? [] : flat.filter(function (x) { return x.composition && x.composition !== comp && x.cav === self.cav; }); hit = { row: row, comp: comp, term: t, src: bi.getAttribute('data-src'), ar: parseFloat(bi.getAttribute('data-aspect-ratio')) || 1, pts: flat, partners: pr, color: self.color, ter: ter }; });
            return hit; }).catch(function () { return null; }); });
    Promise.all(jobs).then(function (hs0) { var hs = [], byT = {}; hs0.forEach(function (h) { if (!h) return; if (byT[h.term]) { byT[h.term].rows.push(h); return; } h.rows = [h]; byT[h.term] = h; hs.push(h); }); if (!hs.length) return;
        if (hs.length > 12) { terSideFallback = true; rows.forEach(function (r) { r.removeAttribute('data-marks'); [].forEach.call(r.querySelectorAll('.terListMarks'), function (e) { e.parentNode.removeChild(e); }); }); terListMarks(); return; }
        var lr = list.getBoundingClientRect(), table = document.querySelector('table'), top = (table ? table.getBoundingClientRect().bottom : 0) + 16, bottom = window.innerHeight - 40, side = { L: [], R: [] }, CH = 150;
        hs.forEach(function (h, i) { side[i < Math.ceil(hs.length / 2) ? 'L' : 'R'].push(h); });
        ['L', 'R'].forEach(function (k) { var arr = side[k], n = arr.length; if (!n) return; var x0 = k === 'L' ? 24 : lr.right + CH, x1 = k === 'L' ? lr.left - CH : window.innerWidth - 24, aw = x1 - x0, slotH = (bottom - top) / n;
            // 縦の位置: ハメ図の真ん中を、繋ぐ行の高さに出来るだけ合わせる(上から順に、前のハメ図と重ならない所まで下げる。下にはみ出す分は下から順に上げる)
            var cs = arr.map(function (h) { var rr = h.row.getBoundingClientRect(); return rr.top + rr.height / 2; }), ys = [], lo = top + slotH / 2, hi = bottom - slotH / 2; cs.forEach(function (c, j) { ys[j] = Math.max(c, lo, j ? ys[j - 1] + slotH : -Infinity); }); for (var j2 = n - 1; j2 >= 0; j2--) ys[j2] = Math.min(ys[j2], j2 < n - 1 ? ys[j2 + 1] - slotH : hi);
            arr.forEach(function (h, j) { var parts = [].concat.apply([], h.rows.map(function (r) { return r.partners; })), tagH = 48, capH = 36, ah = slotH - tagH - capH, mx = 100, my = 100, ww, hh, vw, vh, rot = false;
                if (h.ter) { bonRestack(h.pts).forEach(function (q, i) { var p = h.pts[i]; p.x = q.x; p.y = q.y; p.w = q.w; p.h = q.h; }); h.pts.forEach(function (p) { mx = Math.max(mx, p.x + p.w); my = Math.max(my, p.y + p.h); }); rot = h.ar < 1;
                    hh = rot ? Math.min(aw * 100 / my, ah * 100 / (h.ar * mx)) : Math.min(aw * 100 / (h.ar * mx), ah * 100 / my); ww = hh * h.ar; vw = rot ? hh * my / 100 : ww * mx / 100; vh = rot ? ww * mx / 100 : hh * my / 100; }
                // 穴のあるハメ図は、構成番号のページの下のハメ図と同じく、文字が小さい時は穴の周りだけにする(設定の「文字が小さい時は穴の周りだけ表示」が入の時。planBottomCrop)
                else { h.crop = planBottomCrop(h.pts, h.ar, aw, Math.min(ah, 420)); hh = Math.min(ah, aw / h.crop.ar, 420); ww = hh * h.crop.ar; vw = ww; vh = hh; }
                var y = ys[j] + (tagH - capH) / 2 - vh / 2, x = k === 'L' ? x1 - vw : x0;
                var bi = document.createElement('div'); bi.className = 'bottomImage terSideHame'; bi.setAttribute('data-src', h.src); bi.setAttribute('data-aspect-ratio', h.ar); bi.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:' + vw + 'px;height:' + vh + 'px;right:auto;bottom:auto;z-index:5;'; document.body.appendChild(bi);
                if (h.ter) { var parent = bi; if (rot) { parent = document.createElement('div'); parent.className = 'bottomImageRotWrap'; parent.style.cssText = 'position:absolute;left:50%;top:50%;transform-origin:center center;transform:translate(-50%,-50%) rotate(-90deg);width:' + (ww * mx / 100) + 'px;height:' + (hh * my / 100) + 'px;'; bi.appendChild(parent); }
                    var ph = document.createElement('div'); ph.className = 'bottomImagePhoto'; ph.style.cssText = 'position:absolute;left:0;top:0;z-index:1;background-size:contain;background-position:center;background-repeat:no-repeat;width:' + ww + 'px;height:' + hh + 'px;'; ph.style.backgroundImage = 'url(' + h.src + ')'; parent.appendChild(ph); darkPhotoOutline(ph, h.src);
                    renderBottomImageDots(bi, h.pts, 'composition', h.comp, ww, hh); [].forEach.call(bi.querySelectorAll('.wireColorBand'), function (b, i) { if (h.pts[i] && h.pts[i].composition) b.setAttribute('data-composition', h.pts[i].composition); });
                    h.rows.forEach(function (r) { var b = bi.querySelector(".wireColorBand[data-composition='" + r.comp + "']"); if (b) b.style.boxShadow = '0 0 0 2px #FFFFFF'; }); }
                else { var cr = h.crop, cbw = cr.r[2] - cr.r[0], cbh = cr.r[3] - cr.r[1]; bi.style.backgroundImage = 'url(' + h.src + ')'; bi.style.backgroundRepeat = 'no-repeat'; bi.style.backgroundSize = cr.t ? (10000 / cbw) + '% ' + (10000 / cbh) + '%' : 'contain'; bi.style.backgroundPosition = cr.t ? (cbw < 100 ? cr.r[0] / (100 - cbw) * 100 : 0) + '% ' + (cbh < 100 ? cr.r[1] / (100 - cbh) * 100 : 0) + '%' : 'center'; darkPhotoOutline(bi, h.src);
                    renderBottomImageDots(bi, cr.pts.map(function (q) { return Object.assign({}, q); }), 'composition', h.comp, ww, hh); h.rows.slice(1).forEach(function (r) { var d = bi.querySelector(".imageBoxDot[data-composition='" + r.comp + "']"); if (d) d.style.boxShadow = '0 0 0 3px #FFFFFF'; }); }
                var tag = document.createElement('div'); tag.className = 'box terSideTag'; tag.innerHTML = '<span></span>'; tag.firstChild.textContent = h.term; tag.style.cssText = "position:fixed;z-index:6;cursor:pointer;background:#FFF;color:#000;font:bold 26px/1 'MPLUS1p',sans-serif;padding:4px 10px;border-radius:5px;"; tag.addEventListener('click', function () { navigateOrNotFound(h.term + '.html'); }); document.body.appendChild(tag); tag.style.left = (x + vw / 2 - tag.offsetWidth / 2) + 'px'; tag.style.top = (y - tag.offsetHeight - 8) + 'px';
                if (parts.length) { var cap = document.createElement('div'); cap.className = 'terSideCap'; cap.textContent = parts.map(function (p) { return p.composition + ' → ' + (p.oppositeTerminal || '?'); }).join('  '); cap.style.cssText = "position:fixed;z-index:6;pointer-events:none;font:bold 20px/1 'MPLUS1p',sans-serif;color:#FFF;white-space:nowrap;"; document.body.appendChild(cap); cap.style.left = (x + vw / 2 - cap.offsetWidth / 2) + 'px'; cap.style.top = (y + vh + 8) + 'px'; }
                h.side = k; h.el = bi; }); });
        setTimeout(function () { terSideLines(hs, lr, CH); }, 400); }); }
// 線を引く。行の札の横から出て、縦の通り道(一覧とハメ図の間を線の数で等分)を通って、ハメ図の縁まで(ここはハメ図の後ろ)。そこから穴までは ハメ図の上に引く(横 → 縦で穴の縁まで)。札と繋ぐ穴の縁を線の色にする
// ハメ図の中は、他の穴(電線の div)を避けて穴まで引く(terSideRoute)
function terSideLines(hs, lr, CH) { var lines = [], s = '', s2 = '', idx = 0;
    // ハメ図の外側 8px も道に使う(穴の周りだけを切り出した時など、穴の間にすき間が無い時は、外側を回って穴の上・下から入る)
    hs.forEach(function (h0) { var r0 = h0.el.getBoundingClientRect(), M = 8, hr = { left: r0.left - M, top: r0.top - M, right: r0.right + M, bottom: r0.bottom + M, width: r0.width + M * 2, height: r0.height + M * 2 }, L = h0.side === 'L', mine = [];
        h0.rows.forEach(function (r) { var el = h0.el.querySelector(".imageBoxDot[data-composition='" + r.comp + "'], .wireColorBand[data-composition='" + r.comp + "']"), b = r.row.querySelector('.wireInfoBadge'); if (!el || !b) return;
            var br = b.getBoundingClientRect(), rr = r.row.getBoundingClientRect(), dr = el.getBoundingClientRect();
            mine.push({ dr: dr, L: L, sx: L ? br.left - 6 : rr.right + 6, sy: br.top + br.height / 2, ex: L ? hr.right : hr.left, px: dr.left + dr.width / 2, py: dr.top + dr.height / 2, pw: dr.width / 2, ph: dr.height / 2, badge: b, hole: el, col: TER_SIDE_COLORS[idx++ % TER_SIDE_COLORS.length] }); });
        terSideRoute(h0.el, hr, mine, L); lines = lines.concat(mine); });
    ['L', 'R'].forEach(function (k) { var ls = lines.filter(function (l) { return l.L === (k === 'L'); }); if (!ls.length) return;
        // 通り道の順(ハメ図の側から): 上へ行く線は下の行から、その後に下へ行く線は上の行から
        var up = ls.filter(function (l) { return l.ey <= l.sy; }).sort(function (a, b) { return b.sy - a.sy; }), dn = ls.filter(function (l) { return l.ey > l.sy; }).sort(function (a, b) { return a.sy - b.sy; }), order = up.concat(dn), n = order.length;
        var near = k === 'L' ? Math.max.apply(null, order.map(function (l) { return l.ex; })) + 14 : Math.min.apply(null, order.map(function (l) { return l.ex; })) - 14, far = k === 'L' ? lr.left - 26 : lr.right + 26;
        order.forEach(function (l, i) { l.cx = n === 1 ? (near + far) / 2 : near + (far - near) * i / (n - 1); }); });
    var path = function (d, col) { return "<path d='" + d + "' fill='none' stroke='#000' stroke-width='6' stroke-linejoin='round' stroke-linecap='round' opacity='.75'/><path class='flow flowBig' d='" + d + "' fill='none' stroke='" + col + "' stroke-width='3' stroke-linejoin='round' stroke-linecap='round'/>"; };
    var dot = function (x, y, col) { return "<circle cx='" + x + "' cy='" + y + "' r='4.5' fill='" + col + "' stroke='#000' stroke-width='1.5'/>"; };
    lines.forEach(function (l) { var d = Math.abs(l.sy - l.ey) < 2 ? 'M' + l.sx + ' ' + l.sy + ' L' + l.ex + ' ' + l.sy : 'M' + l.sx + ' ' + l.sy + ' L' + l.cx + ' ' + l.sy + ' L' + l.cx + ' ' + l.ey + ' L' + l.ex + ' ' + l.ey;
        s += path(d, l.col) + dot(l.sx, l.sy, l.col);
        // ハメ図の縁から穴の縁まで(terSideRoute で探した道)
        var tp = l.inPts[l.inPts.length - 1], tx = tp[0], ty = tp[1], d2 = 'M' + l.inPts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L');
        s2 += path(d2, l.col) + dot(tx, ty, l.col); l.badge.style.boxShadow = '0 0 0 3px ' + l.col; l.hole.style.boxShadow = '0 0 0 4px ' + l.col; l.hole.style.zIndex = '21'; });
    [[s, '4'], [s2, '6']].forEach(function (a) { var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'bondLinks jointLinks terSideLinks'); svg.style.zIndex = a[1]; svg.innerHTML = a[0]; document.body.appendChild(svg); }); }
// ハメ図の中の道: ハメ図を 4px(小さいハメ図は 2px)の升に分けて、縁(一覧の側)から繋ぐ穴まで、他の穴(電線の div)を避けて通る一番安い道を探す(曲がる所は少なく、穴の高さから入るのを少し優先。先に引いた線の道もなるべく避ける)
// 穴の間が狭くて避けきれない時だけ、穴の上を通る。縁に近い穴の線から順に引く。l.ey にハメ図に入る高さ、l.inPts に道の角の点を入れる
function terSideRoute(bi, hr, mine, L) { var C = Math.min(hr.width, hr.height) < 160 ? 2 : 4, PAD = C, W = Math.max(2, Math.ceil(hr.width / C)), H = Math.max(2, Math.ceil(hr.height / C)), N = W * H, base = new Float32Array(N), DX = [1, 0, -1, 0], DY = [0, 1, 0, -1];
    var mark = function (r, cost, pad) { var x0 = Math.max(0, Math.floor((r.left - pad - hr.left) / C)), x1 = Math.min(W - 1, Math.floor((r.right + pad - hr.left) / C)), y0 = Math.max(0, Math.floor((r.top - pad - hr.top) / C)), y1 = Math.min(H - 1, Math.floor((r.bottom + pad - hr.top) / C)), x, y; for (y = y0; y <= y1; y++) for (x = x0; x <= x1; x++) base[y * W + x] = Math.max(base[y * W + x], cost); };
    [].forEach.call(bi.querySelectorAll('.imageBoxDot, .wireColorBand'), function (e) { var r = e.getBoundingClientRect(); if (r.width && r.height) mark(r, 400, PAD); });
    mine.slice().sort(function (a, b) { return L ? b.px - a.px : a.px - b.px; }).forEach(function (l) { var dr = l.dr, dist = new Float64Array(N * 4), prev = new Int32Array(N * 4), heap = [], goal = -1, sx = L ? W - 1 : 0, y, st;
        var isGoal = function (c) { var cx = hr.left + (c % W) * C + C / 2, cy = hr.top + Math.floor(c / W) * C + C / 2; return (cx >= dr.left && cx <= dr.right && cy >= dr.top - PAD && cy <= dr.bottom + PAD) || (cy >= dr.top && cy <= dr.bottom && cx >= dr.left - PAD && cx <= dr.right + PAD); };
        var push = function (d, s) { heap.push([d, s]); var i = heap.length - 1; while (i > 0) { var p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; var t = heap[p]; heap[p] = heap[i]; heap[i] = t; i = p; } };
        var pop = function () { var top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; var i = 0; for (;;) { var a = 2 * i + 1, b = a + 1, m = i; if (a < heap.length && heap[a][0] < heap[m][0]) m = a; if (b < heap.length && heap[b][0] < heap[m][0]) m = b; if (m === i) break; var t = heap[m]; heap[m] = heap[i]; heap[i] = t; i = m; } } return top; };
        dist.fill(Infinity); prev.fill(-1);
        for (y = 0; y < H; y++) { var c0 = y * W + sx, d0 = base[c0] + Math.abs(hr.top + y * C + C / 2 - l.py) * 0.3; st = c0 * 4 + (L ? 2 : 0); if (d0 < dist[st]) { dist[st] = d0; push(d0, st); } }
        while (heap.length) { var it = pop(), d = it[0], s0 = it[1]; if (d > dist[s0]) continue; var c = s0 >> 2, dir = s0 & 3; if (isGoal(c)) { goal = s0; break; }
            for (var nd = 0; nd < 4; nd++) { if (nd === ((dir + 2) & 3)) continue; var nx = c % W + DX[nd], ny = Math.floor(c / W) + DY[nd]; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; var n = ny * W + nx, ns = n * 4 + nd, dd = d + 1 + (isGoal(n) ? 0 : base[n]) + (nd === dir ? 0 : 6); if (dd < dist[ns]) { dist[ns] = dd; prev[ns] = s0; push(dd, ns); } } }
        var cells = []; for (st = goal; st >= 0; st = prev[st]) cells.unshift(st >> 2); if (!cells.length) { l.ey = l.py; l.inPts = [[l.ex, l.py], [L ? l.px + l.pw : l.px - l.pw, l.py]]; return; }
        var pts = cells.map(function (c) { return [hr.left + (c % W) * C + C / 2, hr.top + Math.floor(c / W) * C + C / 2]; }); pts[0][0] = l.ex;
        l.inPts = pts.filter(function (p, i) { if (i === 0 || i === pts.length - 1) return true; var a = pts[i - 1], b = pts[i + 1]; return !((a[0] === p[0] && p[0] === b[0]) || (a[1] === p[1] && p[1] === b[1])); });
        // 終わりは穴の縁に付ける(着いた升は穴の真上・真下・横の余白。そこから縁まで真っ直ぐ伸ばす。道の向きと違う時は角を 1 つ足す)
        var q = l.inPts, qa = q[q.length - 2], qb = q[q.length - 1], ins = qb[0] >= dr.left && qb[0] <= dr.right, e = ins && qb[1] >= dr.top && qb[1] <= dr.bottom ? qb : ins ? [qb[0], qb[1] < dr.top ? dr.top : dr.bottom] : [qb[0] < dr.left ? dr.left : dr.right, qb[1]];
        if (qa && (ins ? qa[0] === qb[0] : qa[1] === qb[1])) q[q.length - 1] = e; else q.push(e); l.ey = q[0][1];
        // 引いた道は、次の線がなるべく通らない様にする(重ならない様に 1 升の幅を取る)
        cells.forEach(function (c) { var x = c % W, y2 = Math.floor(c / W); for (var yy = Math.max(0, y2 - 1); yy <= Math.min(H - 1, y2 + 1); yy++) for (var xx = Math.max(0, x - 1); xx <= Math.min(W - 1, x + 1); xx++) base[yy * W + xx] = Math.max(base[yy * W + xx], 60); }); }); }
window.addEventListener('load', function () { setTimeout(terSideHames, 200); });
// 端末番号のページの電線の一覧(Ter・Bon): 相手端末の番号を、他の端末番号の札と同じ白い枠(jointOppFrame。ジョイント・ボンダーの一覧の行き先と同じ)で囲む
// 番号の文字(テキストのノード)は作り直さずに枠の中へ移す(開いた時の数字のデコードの演出 fxDecode が、そのノードを最後に正しい番号に戻すので)
function terListOppFrames() { document.querySelectorAll('.wireInfoList .wireInfoRow .wireInfoOpp').forEach(function (el) { if (!el.textContent.trim() || el.querySelector('.jointOppFrame')) return; var f = document.createElement('span'); f.className = 'jointOppFrame'; while (el.firstChild) f.appendChild(el.firstChild); el.appendChild(f); }); }
window.addEventListener('load', function () { setTimeout(terListOppFrames, 20); });
// バージョン表記(.versionTag): ヘッダー(と進み具合のバー)の真下・画面の真ん中に出す。画面の半分より広い物(バー等)はよける物に数えない。そこに div(端末番号の札・写真・ハメ図 等)が有る時は、左右に少しずつずらして空いている所へ
(function () {
    function verTagPlace() { var vt = document.querySelector('.versionTag'), hd = document.querySelector('tr.top'); if (!vt || !hd) return; var hdTable = hd.closest('table');
        var pb = document.getElementById('sscProgressBar'), top = Math.max(hd.getBoundingClientRect().bottom, pb && pb.getBoundingClientRect().height > 0 ? pb.getBoundingClientRect().bottom : 0) + 2, W = window.innerWidth; vt.style.top = top + 'px'; vt.style.bottom = 'auto'; var w = vt.offsetWidth, h = vt.offsetHeight;
        var boxes = [].filter.call(document.querySelectorAll('div, img'), function (e) { if (e === vt || (hdTable && hdTable.contains(e))) return false; var r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || r.width > W * 0.5 || r.width * r.height > W * window.innerHeight * 0.25) return false; var cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; }).map(function (e) { return e.getBoundingClientRect(); });
        function busy(cx) { var x0 = cx - w / 2 - 4, x1 = cx + w / 2 + 4, y0 = top, y1 = top + h; return boxes.some(function (r) { return r.left < x1 && r.right > x0 && r.top < y1 && r.bottom > y0; }); }
        var best = W / 2, step = Math.max(10, w / 4);
        for (var k = 0; k < 200; k++) { var cx = W / 2 + Math.ceil(k / 2) * step * (k % 2 ? 1 : -1); if (cx - w / 2 < 0 || cx + w / 2 > W) continue; if (!busy(cx)) { best = cx; break; } }
        vt.style.left = best + 'px'; }
    window.verTagPlace = verTagPlace;
    window.addEventListener('load', function () { setTimeout(verTagPlace, 300); setTimeout(verTagPlace, 1500); });
    window.addEventListener('resize', function () { setTimeout(verTagPlace, 300); });
})();
