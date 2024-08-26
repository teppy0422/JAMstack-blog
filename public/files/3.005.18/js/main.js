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
	document.myform.action = kosei + ".html";
}
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
	window.addEventListener('load', adjustButtonValue);
	window.addEventListener('resize', adjustButtonValue);
} else if (window.attachEvent) { // IE8用のフォールバック
	window.attachEvent('onload', adjustButtonValue);
	window.attachEvent('onresize', adjustButtonValue);
}
