<?php

//header('Content-Type: application/json');
ini_set('memory_limit','256M');

$error            = false;

$absolutedir      = dirname(__FILE__);
$dir              = '/tmp/';
$serverdir        = $absolutedir.$dir;
$filename         = array();

foreach($_FILES as $name => $value) {
  $json           = json_decode($_POST[$name.'_values']);
  $tmp            = explode(',',$json->data);
  $imgdata        = base64_decode($tmp[1]);

  $extension      = strtolower(end(explode('.',$json->name)));
  $fname          = substr($json->name,0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.'.$extension;


  $handle         = fopen($serverdir.$fname,'w');
  fwrite($handle, $imgdata);
  fclose($handle);

  $filename[]     = $fname;
}

// Create the final image
$appImgDir = '/img/';

$imgDay1 = 'day1.png';
$imgDay7 = 'day7.png';
$imgShare = 'share.png';

$img1 = $serverdir.$filename[0];
$img2 = $serverdir.$filename[1];
$img3 = $absolutedir.$appImgDir.$imgDay1;
$img4 = $absolutedir.$appImgDir.$imgDay7;
$img5 = $absolutedir.$appImgDir.$imgShare;

/*$src1 = imagecreatefromjpeg($img1);
$src2 = imagecreatefromjpeg($img2);*/
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
$dest = imagecreatetruecolor(817, 510);

/*imagecopy($dest, $src1, 0, 0, 0, 0, 802, 500);
imagecopy($dest, $src2, 401, 0, 0, 0, 802, 500);
imagecopymerge($dest, $src3, 20, 20, 0, 0, 200, 50, 100);
imagecopymerge($dest, $src4, 421, 20, 0, 0, 200, 50, 100);*/

imagecopyresampled($dest, $src1, 5, 5, 0, 0, 802, 500, 802, 500);
imagecopyresampled($dest, $src3, 20, 10, 0, 0, 200, 50, 200, 50);
imagecopyresampled($dest, $src2, 411, 5, 0, 0, 802, 500, 802, 500);
imagecopyresampled($dest, $src4, 421, 10, 0, 0, 200, 50, 200, 50);
imagecopyresampled($dest, $src5, 5, 300, 0, 0, 802, 200, 802, 200);

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
  }
  else {
    //echo "$ret bytes written to file";
  }
}
else {
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

    <meta name="description" content="A HTML5 image upload plugin build with jQuery. Can drag and drop an image, crop it and change ratio." />

    <!-- Bootstrap -->
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/css/html5imageupload.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>

  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h1>GSN 30 day challenge</h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12">

        <div class="text-center">
          <img src="uploads/<?php echo $uploadFilename; ?>" class="img-thumbnail img-responsive" />
        </div>

        <p>&nbsp;</p>

        <div class="row">
          <div class="col-xs-12">
            <p class="text-center"><a href="/30DayChallenge/transformation-pictures/" class="btn btn-success"><i class="glyphicon glyphicon-chevron-left"></i> Start over</a></p>
          </div>
        </div>

      </div>

    </div>

  </div>


    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>


  </body>
</html>
