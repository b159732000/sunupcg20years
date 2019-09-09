<?php
$APPID='wx0db0332b2e95ff0e';
$SECRET='4a8c5af070138241aafce47236c252a4';
$state='TEST';
$code='';
$code = $_GET['code'];
$uinfo=file_get_contents("https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$APPID."&secret=".$SECRET."&code={$code}&grant_type=authorization_code");
$uinfo=(array)json_decode($uinfo);
$openid=$uinfo['openid'];

echo "[" . "{" . '"openID"' . ':"' . $openid . '"}' . "]";
?>