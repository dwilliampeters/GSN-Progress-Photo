$(function() {
  $('.image-editor-1').cropit({
    imageState: {
      src: 'http://lorempixel.com/500/400/'
    }
  });

  $('.image-editor-1 .export').click(function() {
    var imageData = $('.image-editor-1').cropit('export');
    $('.image-editor-1 .preview-image').html('<img src="' + imageData + '">');
    //window.open(imageData);
  });

  $('.image-editor-2').cropit({
    imageState: {
      src: 'http://lorempixel.com/500/400/'
    }
  });

  $('.image-editor-2 .export').click(function() {
    var imageData = $('.image-editor-2').cropit('export');
    $('.image-editor-2 .preview-image').html('<img src="' + imageData + '">');
    //window.open(imageData);
  });
});
