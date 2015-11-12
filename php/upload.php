<?php

header('Access-Control-Allow-Origin: *');

define('UPLOAD_DIR', 'uploads/');



$base64img = $_POST["base64data"];
$extension = $_POST["file_extension"];



$data = str_replace('data:image/' . $extension . ';base64,', '', $base64img);
$data = str_replace(' ', '+', $data);
$data = base64_decode($data);

$file = UPLOAD_DIR . uniqid() . '.' . $extension;

file_put_contents($file, $data);


echo $base64img;