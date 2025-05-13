<?php
    $counter_file = 'count.txt';
    $counter_lenght = 8;
    $fp = fopen($counter_file, 'r+');
    if ($fp) {
        if (flock($fp, LOCK_EX)) {
            $counter = fgets($fp, $counter_lenght);
            rewind($fp);
            if (fwrite($fp,  $counter) === FALSE) {echo ('<p>'.'#'.'</p>');}
            flock ($fp, LOCK_UN);
        }
    }
    fclose ($fp);
    $new_counter = sprintf("%06d", $counter);
    echo ("再生回数:".$new_counter);
?>