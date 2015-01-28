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

if ($_POST['day'] == '3') {
  $imgBase1 = $_POST['image1'];
  $imgBase2 = $_POST['image2'];
  $imgBase3 = $_POST['image3'];

  saveImage($imgBase1, 'img1', $serverdir, $filename);
  saveImage($imgBase2, 'img2', $serverdir, $filename);
  saveImage($imgBase3, 'img3', $serverdir, $filename);

  $uploadedImg1 = $serverdir.$filename[0];
  $uploadedImg2 = $serverdir.$filename[1];
  $uploadedImg3 = $serverdir.$filename[2];
} else if ($_POST['day'] == '4') {
  $imgBase1 = $_POST['image1'];
  $imgBase2 = $_POST['image2'];
  $imgBase3 = $_POST['image3'];
  $imgBase4 = $_POST['image4'];

  saveImage($imgBase1, 'img1', $serverdir, $filename);
  saveImage($imgBase2, 'img2', $serverdir, $filename);
  saveImage($imgBase3, 'img3', $serverdir, $filename);
  saveImage($imgBase4, 'img4', $serverdir, $filename);

  $uploadedImg1 = $serverdir.$filename[0];
  $uploadedImg2 = $serverdir.$filename[1];
  $uploadedImg3 = $serverdir.$filename[2];
  $uploadedImg4 = $serverdir.$filename[3];
} else if ($_POST['day'] == '5') {
  $imgBase1 = $_POST['image1'];
  $imgBase2 = $_POST['image2'];
  $imgBase3 = $_POST['image3'];
  $imgBase4 = $_POST['image4'];
  $imgBase5 = $_POST['image5'];

  saveImage($imgBase1, 'img1', $serverdir, $filename);
  saveImage($imgBase2, 'img2', $serverdir, $filename);
  saveImage($imgBase3, 'img3', $serverdir, $filename);
  saveImage($imgBase4, 'img4', $serverdir, $filename);
  saveImage($imgBase5, 'img5', $serverdir, $filename);

  $uploadedImg1 = $serverdir.$filename[0];
  $uploadedImg2 = $serverdir.$filename[1];
  $uploadedImg3 = $serverdir.$filename[2];
  $uploadedImg4 = $serverdir.$filename[3];
  $uploadedImg5 = $serverdir.$filename[4];
} else {
  $imgBase1 = $_POST['image1'];
  $imgBase2 = $_POST['image2'];

  saveImage($imgBase1, 'img1', $serverdir, $filename);
  saveImage($imgBase2, 'img2', $serverdir, $filename);

  $uploadedImg1 = $serverdir.$filename[0];
  $uploadedImg2 = $serverdir.$filename[1];
}

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
$imgDay2 = 'day2.png';
$imgDay3 = 'day3.png';
$imgDay4 = 'day4.png';
$imgDay5 = 'day5.png';
$imgBrand = 'brand.png';

/*$img1 = $serverdir.$img1_fname;
$img2 = $serverdir.$img2_fname;*/
$appDay1 = $absolutedir.$appImgDir.$imgDay1;
$appDay2 = $absolutedir.$appImgDir.$imgDay2;
$appDay3 = $absolutedir.$appImgDir.$imgDay3;
$appDay4 = $absolutedir.$appImgDir.$imgDay4;
$appDay5 = $absolutedir.$appImgDir.$imgDay5;
$appBrandImg = $absolutedir.$appImgDir.$imgBrand;

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

if ($_POST['day'] == '3') {
  $srcUploaded1 = imageCreateFromAny($uploadedImg1);
  $srcUploaded2 = imageCreateFromAny($uploadedImg2);
  $srcUploaded3 = imageCreateFromAny($uploadedImg3);
} else if ($_POST['day'] == '4') {
  $srcUploaded1 = imageCreateFromAny($uploadedImg1);
  $srcUploaded2 = imageCreateFromAny($uploadedImg2);
  $srcUploaded3 = imageCreateFromAny($uploadedImg3);
  $srcUploaded4 = imageCreateFromAny($uploadedImg4);
} else if ($_POST['day'] == '5') {
  $srcUploaded1 = imageCreateFromAny($uploadedImg1);
  $srcUploaded2 = imageCreateFromAny($uploadedImg2);
  $srcUploaded3 = imageCreateFromAny($uploadedImg3);
  $srcUploaded4 = imageCreateFromAny($uploadedImg4);
  $srcUploaded5 = imageCreateFromAny($uploadedImg5);
} else {
  $srcUploaded1 = imageCreateFromAny($uploadedImg1);
  $srcUploaded2 = imageCreateFromAny($uploadedImg2);
}

/*$srcUploaded1 = imageCreateFromAny($uploadedImg1);
$srcUploaded2 = imageCreateFromAny($uploadedImg2);
$srcUploaded3 = imageCreateFromAny($uploadedImg3);
$srcUploaded4 = imageCreateFromAny($uploadedImg4);*/
$srcDay1 = imagecreatefrompng($appDay1);
$srcDay2 = imagecreatefrompng($appDay2);
$srcDay3 = imagecreatefrompng($appDay3);
$srcDay4 = imagecreatefrompng($appDay4);
$srcDay5 = imagecreatefrompng($appDay5);
$srcBrand = imagecreatefrompng($appBrandImg);

if ($_POST['day'] == '3') {
  $dest = imagecreatetruecolor(600, 300);

  imagecopyresampled($dest, $srcUploaded1, 0, 0, 0, 0, 200, 300, 200, 300);
  imagecopyresampled($dest, $srcDay1, 0, 0, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded2, 200, 0, 0, 0, 200, 300, 200, 300);
  imagecopyresampled($dest, $srcDay2, 300, 0, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded3, 400, 0, 0, 0, 200, 300, 200, 300);
  imagecopyresampled($dest, $srcBrand, 0, 100, 0, 0, 600, 200, 600, 200);
} else if ($_POST['day'] == '4') {
  $dest = imagecreatetruecolor(600, 800);

  imagecopyresampled($dest, $srcUploaded1, 0, 0, 0, 0, 600, 800, 600, 800);
  imagecopyresampled($dest, $srcDay1, 0, 0, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded2, 300, 0, 0, 0, 600, 800, 600, 800);
  imagecopyresampled($dest, $srcDay2, 300, 0, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded3, 0, 400, 0, 0, 600, 800, 600, 800);
  imagecopyresampled($dest, $srcDay3, 0, 400, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded4, 300, 400, 0, 0, 600, 800, 600, 800);
  imagecopyresampled($dest, $srcDay4, 300, 400, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcBrand, 0, 600, 0, 0, 600, 200, 600, 200);
} else if ($_POST['day'] == '5') {
  $dest = imagecreatetruecolor(600, 400);

  imagecopyresampled($dest, $srcUploaded1, 0, 0, 0, 0, 300, 200, 300, 200);
  imagecopyresampled($dest, $srcDay1, 0, 0, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded2, 150, 0, 0, 0, 300, 200, 300, 200);
  imagecopyresampled($dest, $srcDay2, 150, 0, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded3, 0, 200, 0, 0, 300, 200, 300, 200);
  imagecopyresampled($dest, $srcDay3, 0, 200, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded4, 150, 200, 0, 0, 300, 200, 300, 200);
  imagecopyresampled($dest, $srcDay4, 150, 200, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded5, 300, 0, 0, 0, 600, 400, 300, 200);
  imagecopyresampled($dest, $srcDay5, 300, 0, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcBrand, 0, 200, 0, 0, 600, 200, 600, 200);
} else {
  $dest = imagecreatetruecolor(600, 400);

  imagecopyresampled($dest, $srcUploaded1, 0, 0, 0, 0, 600, 400, 600, 400);
  imagecopyresampled($dest, $srcDay1, 0, 0, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcUploaded2, 300, 0, 0, 0, 600, 400, 600, 400);
  imagecopyresampled($dest, $srcDay2, 300, 0, 0, 0, 200, 50, 200, 50);
  imagecopyresampled($dest, $srcBrand, 0, 200, 0, 0, 600, 200, 600, 200);
}

/*imagecopyresampled($dest, $srcUploaded1, 0, 0, 0, 0, 600, 400, 600, 400);
imagecopyresampled($dest, $src3, 20, 10, 0, 0, 200, 50, 200, 50);
imagecopyresampled($dest, $srcUploaded2, 300, 0, 0, 0, 600, 400, 600, 400);
imagecopyresampled($dest, $src4, 320, 10, 0, 0, 200, 50, 200, 50);
imagecopyresampled($dest, $src5, 5, 200, 0, 0, 600, 200, 600, 200);*/

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
    <link rel="stylesheet" href="css/app.css">
  </head>
  <body>

  <script>
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '875940412462173',
        xfbml      : true,
        version    : 'v2.2'
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  </script>

    <header class="banner @@class" role="banner">
      <div>
        <div class="banner--title">
          <a href="http://goldstandardnutrition.co.uk"><h1>Gold Standard Nutrition</h1><img src="img/logo-gsn.png" alt="Gold Standard Nutrition"></a>
        </div>
      </div>
    </header>

    <main id="content" class="group" role="main">
      <div class="main" style="max-width: 100%;">

        <div class="text-center">
          <div class="result-image">
            <img src="uploads/<?php echo $uploadFilename; ?>" />
          </div>
          <div class="result-share">
            <a class="button facebook-share" href="#" data-url="http://gsntransformationcentre.co.uk" data-img="uploads/<?php echo $uploadFilename; ?>">Share your result photo</a>
          </div>
        </div>

      </div>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.1.min.js"><\/script>')</script>
    <script src="js/app.js"></script>

  </body>
</html>
