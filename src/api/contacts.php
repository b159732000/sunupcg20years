<?php

header('Content-Type:text/json;charset=utf-8');

// 宣告變數
$host = "120.78.151.121";
$user = "year";
$password = "AHJxa2MGp35PhjRw";
$dbname = "year";
$data = [];
$searchOpenId = $_GET['openID'];
class User
{
    public $name;                       //真實姓名
    public $lotteryNumber;              //抽獎號碼
    public $workDays;                   //在驕陽工作天數
    public $planetRadius;               //星球半徑
    public $planetTone;                 //星球色調
    public $planetMountainHeight;       //山高
    public $planetMountainDensity;      //山密度
}

// 連接資料庫
$connection = mysqli_connect($host, $user, $password, $dbname);

// 定義查詢方法並執行
$sql = "SELECT CONVERT(CAST(real_name as BINARY) USING utf8)as real_name, seq_id, join_day, planet_radius, planet_tone, planet_mountain_height, planet_mountain_width FROM users where openid='$searchOpenId'";
$result = $connection->query($sql);

// 取得查出的資料，放在已宣告的class中，最後用json格式輸出
if ($result) {
    // 提示查詢成功
    // echo "查詢成功";

    // 將取得的數據放入新定義的user中
    while ($row = mysqli_fetch_array($result, MYSQL_ASSOC)) {
        $user = new User();
        $user->name = $row['real_name'];
        $user->lotteryNumber = $row['seq_id'];
        $user->workDays = $row['join_day'];;
        $user->planetRadius = $row['planet_radius'];
        $user->planetTone = $row['planet_tone'];
        $user->planetMountainHeight = $row['planet_mountain_height'];
        $user->planetMountainDensity = $row['planet_mountain_width'];

        $data[] = $user;
    }

    // 把取得的數據轉為JSON (參數是避免中文字變成亂碼)
    $json = json_encode($data, JSON_UNESCAPED_UNICODE);

    echo "{" . '"user"' . ":" . $json . "}";
    } else { echo "查询失败"; }
    // echo "{" . $searchOpenId . "}";
    // } else { echo $searchOpenId; }
?>