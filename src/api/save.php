<?php
header('Content-Type:text/json;charset=utf-8');

// 宣告變數
$host = "120.78.151.121";
$user = "year";
$password = "AHJxa2MGp35PhjRw";
$dbname = "year";

// 取得這次要修改的openID
$openID= $_GET['openID'];

// 取得要更新到資料庫的資料
$usrPlanetRadius = $_GET['usrPlanetRadius'];
$usrPlanetTone = $_GET['usrPlanetTone'];
$usrPlanetMountainHeight = $_GET['usrPlanetMountainHeight'];
$usrPlanetMountainDensity = $_GET['usrPlanetMountainDensity'];

// 連接資料庫
$connection = mysqli_connect($host, $user, $password, $dbname);

// 检测连接
if (mysqli_connect_errno())
{
    echo "连接失败: " . mysqli_connect_error();
}

// 更新到資料庫上
mysqli_query($connection, "UPDATE users SET
planet_radius='$usrPlanetRadius',
planet_tone='$usrPlanetTone',
planet_mountain_height='$usrPlanetMountainHeight',
planet_mountain_width='$usrPlanetMountainDensity'
WHERE openid='$openID'
");

echo '成功'
// 關閉資料庫連接
// mysqli_close($connection);
?>