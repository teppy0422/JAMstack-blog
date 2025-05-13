mSec = 310;
mSec2 = 700;
function myBlink(){
	box2 = document.getElementById("box2").style.visibility;
if (box2 == "visible") document.getElementById("box2").style.visibility = "hidden";
	else document.getElementById("box2").style.visibility = "visible";
	setTimeout("myBlink()",mSec);
}
function myBlink2(){
	var box3 = document.getElementById("box3");
	if (box3){
		if (box3.style.backgroundColor === "rgb(255, 80, 80)") { // #FF5050 は RGB で表すと rgb(255, 80, 80)
			box3.style.backgroundColor = "transparent";
		} else {
			box3.style.backgroundColor = "#FF5050";
		}
		setTimeout(myBlink2, mSec2);
	}
}
function adjustBox1Height() {
    var tableHeight = document.querySelector('table').offsetHeight;
    var box1 = document.querySelector('.box1');
    var box2 = document.querySelector('#box2');
    box1.style.height = `calc(100vh - ${tableHeight}px)`;
    box2.style.height = `calc(100vh - ${tableHeight}px)`;
}
window.onload = function() {
    adjustBox1Height();
    myBlink();
    myBlink2();
};

window.onresize = adjustBox1Height;