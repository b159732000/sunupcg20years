<?php

// 宣告變數
$host = "120.78.151.121"; 
$user = "year"; 
$password = "AHJxa2MGp35PhjRw"; 
$dbname = "year"; 
class user {
    public $name;       //真實姓名
    public $wordDays;   //在驕陽工作天數
    public 
}

// 連接資料庫
$connection = mysqli_connect($host, $user, $password, $dbname);

// 定義查詢方法並執行
$sql = "SELECT * FROM userinfo";
$result = $connection->query($sql);

// 取得查出的資料，放在已宣告的class中，最後用json格式輸出
if($result) {
    echo "查詢成功";
    while ($row = mysqli_fetch_array($result, MYSQL_ASSOC))
    {

    }
}

?>