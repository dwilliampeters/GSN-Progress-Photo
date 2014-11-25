<?php

header('Content-Type: application/json');
//ini_set('memory_limit','16M');

$error					= false;

$absolutedir			= dirname(__FILE__);
$dir					= '/tmp/';
$serverdir				= $absolutedir.$dir;

$tmp					= explode(',',$_POST['data']);
$imgdata 				= base64_decode($tmp[1]);

$extension				= strtolower(end(explode('.',$_POST['name'])));
$filename				= substr($_POST['name'],0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.'.$extension;

$handle					= fopen($serverdir.$filename,'w');
fwrite($handle, $imgdata);
fclose($handle);

$response = array(
		"status" 		=> "success",
		"url" 			=> $dir.$filename.'?'.time(), //added the time to force update when editting multiple times
		"filename" 		=> $filename
);


if (!empty($_POST['original'])) {
	$tmp				= explode(',',$_POST['original']);
	$originaldata		= base64_decode($tmp[1]);
	$original			= substr($_POST['name'],0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.original.'.$extension;

	$handle				= fopen($serverdir.$original,'w');
	fwrite($handle, $originaldata);
	fclose($handle);
	
	$response['original']	= $original;
}

print json_encode($response);
