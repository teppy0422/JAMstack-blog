function renderBoxTerminals() {
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
		boxTerminal.style.top = 'calc(50% + ' + (tableHeight / 2) + 'px)'; // tableの高さを考慮
		boxTerminal.style.left = '50%';
		boxTerminal.style.transform = 'translate(-50%, -50%)';
		if (!blinkCoords) continue;
		blinkCoords = blinkCoords.split(';');
		// CSS適用後に位置を取得
		(function(boxTerminal, blinkCoords) {
			setTimeout(function() {
				var boxRect = boxTerminal.getBoundingClientRect();
				var top = boxRect.top;
				for (var i = 0; i < blinkCoords.length; i++) {
					var coord = blinkCoords[i];
					var parts = coord.split(',');
					var blinkX = parseFloat(parts[0]);
					var blinkY = parseFloat(parts[1]);
					var blinkWidth = parseFloat(parts[2]);
					var blinkHeight = parseFloat(parts[3]);
					var radius = parseFloat(parts[4]);
					var composition = parts[5];
					var color = parts[6];
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
					blinkDiv.className += ' blinkHole';
					blinkDiv.style.position = 'absolute';
					blinkDiv.style.left = (boxRect.left + blinkXPos) + 'px';
					blinkDiv.style.top = (top + blinkYPos) + 'px';
					blinkDiv.style.width = blinkWidthPx + 'px';
					blinkDiv.style.height = blinkHeightPx + 'px';
					blinkDiv.style.borderRadius = radius + '%'; 
					blinkDiv.style.backgroundColor = color;   
					blinkDiv.style.opacity = 0.5;
					document.body.appendChild(blinkDiv);
				}
			}, 0);
		})(boxTerminal, blinkCoords);
	}
};
window.onload = function() {
	renderBoxTerminals();
	myBlink2();
};
window.onresize = function() {
	// 既存のblinkDivを削除
	var blinkDivs = document.getElementsByClassName('blinkHole');
	while (blinkDivs[0]) {
		blinkDivs[0].parentNode.removeChild(blinkDivs[0]);
	}
	renderBoxTerminals();
};
var mSec2 = 700;
var flag = false;
function myBlink2(){
	var box3 = document.getElementById("box3");
	if (box3){
		if (flag) {
			box3.style.backgroundColor = "transparent";
			flag = false;
		} else {
			box3.style.backgroundColor = "#FF5050";
			flag = true;
		}
		setTimeout(myBlink2, mSec2);
	}
}
