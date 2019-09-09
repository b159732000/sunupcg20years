<?php
// 如果輸入的ID在資料庫中，則回傳是，反之回傳否

$input_openID = $_GET['openID'];

// 宣告變數
$host = "120.78.151.121";
$user = "year";
$password = "AHJxa2MGp35PhjRw";
$dbname = "year";

// 連接資料庫
$connection = mysqli_connect($host, $user, $password, $dbname);
$sql = "SELECT * FROM users WHERE openid='$input_openID'";
$result = $connection->query($sql);
$nums = mysqli_num_rows($result);

if ($nums > 0) {
    while ($row = mysqli_fetch_array($result, MYSQL_ASSOC)) {
        $db_opedin = $row['name'];
    }
    if ($input_opeinID == $db_opedin) {
        // 名稱已被使用
        echo "true";
    }
} else {
    // 名稱可以使用
    echo "false";
}
?>