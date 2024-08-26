 //mSec = 300; //  “_–Å‘¬“x (1sec=1000)
 function myBlink(){
     flag = document.getElementById("box2").style.visibility;
     if (flag == "visible"){
         document.getElementById("box2").style.visibility = "hidden";
         mSec = 600;
     }else {
         document.getElementById("box2").style.visibility = "visible";
         mSec = 300;
     }
     flag = document.getElementById("box3").style.visibility;
     if (flag == "hidden"){
         document.getElementById("box3").style.visibility = "visible";
         mSec = 600;
     }else {
         document.getElementById("box3").style.visibility = "hidden";
         mSec = 300;
     }
     setTimeout("myBlink()",mSec);
 }
