<?php

header('Access-Control-Allow-Origin: *');

$filenameArray = [];

$handle = opendir(dirname(realpath(__FILE__)).'/uploads/');
while($file = readdir($handle)){
    if($file !== '.' && $file !== '..'){
        array_push($filenameArray, "http://hasselt.dev/php/uploads/$file");
    }
}

echo json_encode($filenameArray);
