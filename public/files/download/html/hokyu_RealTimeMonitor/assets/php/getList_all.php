<?php
    $dirlist = glob("" . '../../*');
    foreach ($dirlist as $dir) {
        if (is_dir($dir)) {
            $dirSP = explode("/",$dir);
            echo "<tr>\n";
            echo "<td><a href='".$dirSP[2]."'>".$dirSP[2]."</a></td>\n";
            echo "</tr>\n";
        }
    }
?>