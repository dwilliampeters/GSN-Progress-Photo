$(function() {


  // Days
  var daySet = 2;

  $('#daySet').on('change', function(e) {
    daySet = parseInt($(this).val(), 10);
    console.log(daySet);
    $('#day').val(daySet);
    $('.step').addClass('day-' + daySet);
  });

  // Steps
  var calculate_step = 0;

  /*$('.step').addClass('step-active');*/

  $('.step-button').on('click', function(e) {
    e.preventDefault();

    calculate_step = parseInt($(this).attr('data-step'), 10);

    calculate_step = (calculate_step + 1);

    $('.step').removeClass('step-active');
    $('.step-' + calculate_step).addClass('step-active');

    // Day
    console.log(calculate_step);
    console.log(daySet);
    if (calculate_step === daySet) {
      $('.step-end').addClass('step-active');
      $('.step-' + calculate_step + ' .step-button').hide();
    }

  });

  // Image 1
  $('.image-editor-1').cropit({
  });

  $('.image-editor-1 .export').click(function(e) {
    e.preventDefault();
    var imageData1 = $('.image-editor-1').cropit('export', {
      type: 'image/jpeg'
    });
    $('.image-editor-1 .preview-image').html('<img src="' + imageData1 + '">');
    console.log(imageData1);
    $('#image1').val(imageData1);
  });

  // Image 2
  $('.image-editor-2').cropit({
  });

  $('.image-editor-2 .export').click(function(e) {
    e.preventDefault();
    var imageData2 = $('.image-editor-2').cropit('export', {
      type: 'image/jpeg'
    });
    $('.image-editor-2 .preview-image').html('<img src="' + imageData2 + '">');
    console.log(imageData2);
    $('#image2').val(imageData2);
  });

  // Image 2
  $('.image-editor-3').cropit({
  });

  $('.image-editor-3 .export').click(function(e) {
    e.preventDefault();
    var imageData3 = $('.image-editor-3').cropit('export', {
      type: 'image/jpeg'
    });
    $('.image-editor-3 .preview-image').html('<img src="' + imageData3 + '">');
    console.log(imageData3);
    $('#image3').val(imageData3);
  });

  // Image 4
  $('.image-editor-4').cropit({
  });

  $('.image-editor-4 .export').click(function(e) {
    e.preventDefault();
    var imageData4 = $('.image-editor-4').cropit('export', {
      type: 'image/jpeg'
    });
    $('.image-editor-4 .preview-image').html('<img src="' + imageData4 + '">');
    console.log(imageData4);
    $('#image4').val(imageData4);
  });

  // Image 5
  $('.image-editor-5').cropit({
  });

  $('.image-editor-5 .export').click(function(e) {
    e.preventDefault();
    var imageData5 = $('.image-editor-5').cropit('export', {
      type: 'image/jpeg'
    });
    $('.image-editor-5 .preview-image').html('<img src="' + imageData5 + '">');
    console.log(imageData5);
    $('#image5').val(imageData5);
  });

});

$(function() {

  // Share
  $('.facebook-share').on('click', function(e) {
    e.preventDefault();

    var shareLink = $(this).data('url'),
        shareImg = 'http://gsntransformationcentre.co.uk/progress/' + $(this).data('img');

    console.log(shareImg);

    FB.ui({
      method: 'feed',
      link: shareLink,
      name: 'Gold Standard Nutrition',
      caption: 'I just updated my progress picture!',
      description: 'Day 7 of my #GSN30DayChallenge a personalised meal plan eating healthy food to reach my goals. Only 23 days to go',
      picture: shareImg
    }, function(response){});

  });
});
