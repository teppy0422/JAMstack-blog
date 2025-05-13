<?php
// POST データを受け取る
$postData = json_decode(file_get_contents("php://input"), true);

// 新しいデータAを取得
$newDataA = $postData['newDataA'];

// テキストファイルに保存
$filePath = 'productStatus.txt';
file_put_contents($filePath, $newDataA);

// クライアントに正常な保存を通知
echo "データが正常に保存されました。";
?>
