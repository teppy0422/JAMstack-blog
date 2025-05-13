<?php
    session_start();
    if(isset($_SESSION['name'])){
        echo 'ようこそ<br><i class="fas fa-user-alt fa-fw"></i>'.$_SESSION['name'].'さん';
        echo '<li style="list-style:none;margin-top:0.5em;"><a style="text-decoration: none;" href="../login/Login.php?state=../08" target="_blank"><i class="fas fa-fw fa-sign-in-alt"></i>ログアウト</a></li>';
    }else{
        echo '<li style="list-style:none;margin-top:0.5em;"><a href="../login/Login.php?state=../08" target="_blank"><i class="fas fa-fw fa-sign-in-alt"></i>ログイン</a></li>';
    }
?>