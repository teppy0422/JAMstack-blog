function setPositionFromDataAttributes() {
	var boxes = document.getElementsByClassName('box');
	var positions = [];
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
					window.location.href = values[0] + ".html";
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
									window.location.href = composition + ".html";
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
				setInterval(function() {
					index = (index + 1) % srcs.length;
					imageBox.style.backgroundImage = 'url(' + srcs[index] + ')';
					var aspectRatio = aspectRatios[index] || aspectRatios[0];
					var width = imageBox.clientWidth;
					var height = width / aspectRatio;
					imageBox.style.left = left + 'px';
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
		bottomImage.style.backgroundImage = 'url(' + src + ')';
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
	// 0.5秒毎にclassがmyTの要素をフォーカス
	setInterval(function() {
		var myTElements = document.getElementsByClassName('myT');
		if (myTElements.length > 0) {
			myTElements[0].focus();
		}
	}, 500);
}
// データ属性から位置を設定
setPositionFromDataAttributes();
// フォームのテキストボックスの値をチェック
function checkText() {
    var str1 = document.myform.txtb.value;
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
	var submitButton = document.getElementById('submitButton');
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
							window.location.href = comp + ".html";
						});
					})(composition);
				}
				document.body.appendChild(blinkDiv);
			}
		}, 0, boxTerminal);
	}
};
var clickableElements = document.getElementsByClassName('clickable');
	if (clickableElements.length > 0) {
	for (var i = 0; i < clickableElements.length; i++) {
		clickableElements[i].addEventListener('click', function() {
			window.location.href = 'index.html';
		});
	}
}
