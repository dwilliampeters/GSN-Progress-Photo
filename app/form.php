<?php

//header('Content-Type: application/json');
//ini_set('memory_limit','16M');

$error					= false;

$absolutedir			= dirname(__FILE__);
$dir					= '/tmp/';
$serverdir				= $absolutedir.$dir;
$filename				= array();

foreach($_FILES as $name => $value) {
	$json					= json_decode($_POST[$name.'_values']);
	$tmp					= explode(',',$json->data);
	$imgdata 				= base64_decode($tmp[1]);
	
	$extension				= strtolower(end(explode('.',$json->name)));
	$fname					= substr($json->name,0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.'.$extension;
	
	
	$handle					= fopen($serverdir.$fname,'w');
	fwrite($handle, $imgdata);
	fclose($handle);
	
	$filename[]				= $fname;
}

echo $dir.$filename[0];
echo $dir.$filename[1];

$img1 = imagecreatefromjpeg($dir.$filename[0]);
$img2 = imagecreatefromjpeg($dir.$filename[1]);
$dest = imagecreatetruecolor(802, 1000);

imagecopy($dest, $img1, 0, 0, 0, 0, 802, 1000);

header('Content-Type: image/jpeg');
imagejpeg($dest);
echo $dest;

imagedestroy($dest);
imagedestroy($src);

/*// Create a blank image and add some text
$im = imagecreatetruecolor(120, 20);
$text_color = imagecolorallocate($im, 233, 14, 91);
imagestring($im, 1, 5, 5,  'A Simple Text String', $text_color);

// Set the content type header - in this case image/jpeg
header('Content-Type: image/jpeg');

// Output the image
imagejpeg($im);

// Free up memory
imagedestroy($im);*/

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HTML5 Image upload width drag and drop, crop and ratio</title>
    
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
	      <h1>Your GSN 30 day challenge result</h1>
	    </div>
	  </div>
	  
	  <div class="row">
	    <div class="col-xs-6">
	      <h2>Result image</h2>
	      
	      <!--<img src="tmp/<?php echo $filename[0]?>" class="img-thumbnail img-responsive" />-->
          <img src="tmp/<?php echo imagejpeg($dest)?>" class="img-thumbnail img-responsive" />
	      
	      <p>&nbsp;</p>
	      
	      <div class="row">
		    <div class="col-xs-12">
		      <p class="text-center"><a href="/gsnchallenge/index.html" class="btn btn-success"><i class="glyphicon glyphicon-chevron-left"></i> Start over</a></p>
		    </div>
		  </div>
	      
	    </div>
	    
	    <div class="col-xs-6">
	      <h2></h2>
	      <p>The <code>$_POST</code> variable</p>
	      <pre><?php echo var_dump($_POST); ?></pre>
	      <p>The JSON object</p>
	      <pre><?php echo var_dump($json); ?></pre>
	    </div>
	    
	  </div>
	  
	</div>
	
	
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    
	
	</body>
</html>