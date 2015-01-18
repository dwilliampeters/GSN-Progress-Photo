<?php

//header('Content-Type: application/json');
ini_set('memory_limit','256M');

$error            = false;

$absolutedir      = dirname(__FILE__);
$dir              = '/tmp/';
$serverdir        = $absolutedir.$dir;
$filename         = array();

function saveImage($base64img, $imgNum, $serverdir, &$filename){
  define('UPLOAD_DIR', $serverdir);
  $base64img = str_replace('data:image/jpeg;base64,', '', $base64img);
  $data = base64_decode($base64img);
  $fname = substr(sha1(time()),0,6).'.'.$imgNum.'.jpg';
  $file = UPLOAD_DIR.$fname;
  file_put_contents($file,$data);
  $filename[] = $fname;
  
  return $filename;
}


$imgBase1 = $_POST['image1'];
$imgBase2 = $_POST['image2'];

saveImage($imgBase1, 'img1', $serverdir, $filename);
saveImage($imgBase2, 'img2', $serverdir, $filename);

// Image 1
/*$img1_base64img = str_replace('data:image/jpeg;base64,', '', $_POST['image1']);
$img1_data = base64_decode($img1_base64img);
$img1_fname = substr(sha1(time()),0,6).'.image1.jpg';
$img1_file = $serverdir.$img1_fname;
file_put_contents($img1_file,$img1_data);

// Image 2
$img2_base64img = str_replace('data:image/jpeg;base64,', '', $_POST['image2']);
$img2_data = base64_decode($img2_base64img);
$img2_fname = substr(sha1(time()),0,6).'.image2.jpg';
$img2_file = $serverdir.$img2_fname;
file_put_contents($img2_file,$img2_data);*/


// Create the final image
$appImgDir = '/img/';

$imgDay1 = 'day1.png';
$imgDay7 = 'day7.png';
$imgShare = 'share.png';

$img1 = $serverdir.$filename[0];
$img2 = $serverdir.$filename[1];
/*$img1 = $serverdir.$img1_fname;
$img2 = $serverdir.$img2_fname;*/
$img3 = $absolutedir.$appImgDir.$imgDay1;
$img4 = $absolutedir.$appImgDir.$imgDay7;
$img5 = $absolutedir.$appImgDir.$imgShare;

function imageCreateFromAny($filepath) { 
  $type = exif_imagetype($filepath); // [] if you don't have exif you could use getImageSize() 
  $allowedTypes = array( 
    1,  // [] gif 
    2,  // [] jpg 
    3,  // [] png 
    6   // [] bmp 
  ); 
  if (!in_array($type, $allowedTypes)) { 
    return false; 
  } 
  switch ($type) { 
    case 1 : 
      $im = imageCreateFromGif($filepath); 
    break; 
    case 2 : 
      $im = imageCreateFromJpeg($filepath); 
    break; 
    case 3 : 
      $im = imageCreateFromPng($filepath); 
    break; 
    case 6 : 
      $im = imageCreateFromBmp($filepath); 
    break; 
  }    
  return $im;  
}
$src1 = imageCreateFromAny($img1);
$src2 = imageCreateFromAny($img2);
$src3 = imagecreatefrompng($img3);
$src4 = imagecreatefrompng($img4);
$src5 = imagecreatefrompng($img5);
$dest = imagecreatetruecolor(600, 400);

imagecopyresampled($dest, $src1, 0, 0, 0, 0, 600, 400, 600, 400);
imagecopyresampled($dest, $src3, 20, 10, 0, 0, 200, 50, 200, 50);
imagecopyresampled($dest, $src2, 300, 0, 0, 0, 600, 400, 600, 400);
imagecopyresampled($dest, $src4, 320, 10, 0, 0, 200, 50, 200, 50);
imagecopyresampled($dest, $src5, 5, 200, 0, 0, 600, 200, 600, 200);

$uploadDir = 'uploads/';
$uploadFilename = 'img_'.date('Y-m-d-H-s').'.jpg';
imagejpeg($dest, $uploadDir.$uploadFilename, 100);

imagedestroy($dest);
imagedestroy($src);

// Details

if(isset($_POST['name']) && isset($_POST['email'])) {
  $data = $_POST['name'] . '-' . $_POST['email'] . '-' . $uploadFilename . "\n";
  $ret = file_put_contents('data.txt', $data, FILE_APPEND | LOCK_EX);
  if($ret === false) {
    die('There was an error writing this file');
  } else {
    //echo "$ret bytes written to file";
  }
} else {
 die('no post data to process');
}

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GSN 30 Day Abs Challenge</title>
  </head>
  <body>

    <div class="container">
      <div class="text-center">
        <img src="uploads/<?php echo $uploadFilename; ?>" />
      </div>

    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.1.min.js"><\/script>')</script>

  </body>
</html>
