$(function() {
  
  
  // Steps
  var calculate_step = 0;

  $('.step-button').on('click', function(e) {
    e.preventDefault();
      
    calculate_step = parseFloat($(this).attr('data-step'));

    calculate_step = (calculate_step + 1);
    console.log(calculate_step);

    $('.step').removeClass('step-active');
    $('.step.step-' + calculate_step).addClass('step-active');

  });
  
  /*var images = [];*/
  
  $('.image-editor-1').cropit({
    /*imageState: {
      src: 'http://lorempixel.com/500/400/'
    }*/
  });

  $('.image-editor-1 .export').click(function(e) {
    e.preventDefault();
    var imageData1 = $('.image-editor-1').cropit('export', {
      type: 'image/jpeg'
    });
    $('.image-editor-1 .preview-image').html('<img src="' + imageData1 + '">');
    console.log(imageData1);
    $('#image1').val(imageData1);
    
    /*images.push(imageData1);
    console.log(images);*/
    
    // Prevent the form from actually submitting
    //return false;
  });

  $('.image-editor-2').cropit({
    /*imageState: {
      src: 'http://lorempixel.com/500/400/'
    }*/
  });

  $('.image-editor-2 .export').click(function(e) {
    e.preventDefault();
    var imageData2 = $('.image-editor-2').cropit('export', {
      type: 'image/jpeg'
    });
    $('.image-editor-2 .preview-image').html('<img src="' + imageData2 + '">');
    console.log(imageData2);
    $('#image2').val(imageData2);
    
    /*images.push(imageData2);
    console.log(images);*/
    
    // Prevent the form from actually submitting
    //return false;
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
