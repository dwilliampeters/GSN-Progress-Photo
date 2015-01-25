/*
 * HTML 5 Image upload script
 * by STBeets
 * bought on CodeCanyon: http://codecanyon.net/item/html-5-upload-image-ratio-with-drag-and-drop/8712634
 * 
 * Version: 1.4
 * 
 */

(function (window, $, undefined) {
	"use strict";
	
	$.html5imageupload = function html5imageupload(options, element) {

		this.element		= element; 
		this.options		= $.extend(true, {}, $.html5imageupload.defaults, options, $(this.element).data());
		this.input			= $(this.element).find('input[type=file]');
		
		var $window 		= $(window);
		var _self	 		= this;
		this.interval		= null;
		this.drag			= false;
		this.widthPercentage	= 100;
		
		//buttons
		this.button				= {}
		this.button.edit		= '<div class="btn btn-info btn-edit"><i class="glyphicon glyphicon-pencil"></i></div>'
		this.button.saving		= '<div class="btn btn-warning saving">' + (this.options.saveLabel || 'Saving...') + ' <i class="glyphicon glyphicon-time"></i></div>';
		this.button.zoomin		= '<div class="btn btn-default btn-zoom-in"><i class="glyphicon glyphicon-resize-full"></i></div>';
		this.button.zoomout		= '<div class="btn btn-default btn-zoom-out"><i class="glyphicon glyphicon-resize-small"></i></div>';
		this.button.zoomreset	= '<div class="btn btn-default btn-zoom-reset"><i class="glyphicon glyphicon-fullscreen"></i></div>';
		this.button.cancel		= '<div class="btn btn-danger btn-cancel"><i class="glyphicon glyphicon-remove"></i></div>';
		this.button.done		= '<div class="btn btn-success btn-ok"><i class="glyphicon glyphicon-ok"></i></div>';
		this.button.del			= '<div class="btn btn-danger btn-del"><i class="glyphicon glyphicon-trash"></i></div>';
		
		//this.imageExtensions	= {png: 'png', bmp: 'bmp', gif: 'gif', jpg: ['jpg','jpeg'], tiff: 'tiff'};
		this.imageMimes 		= { png: 'image/png', bmp: 'image/bmp', gif: 'image/gif', jpg: 'image/jpeg', jpeg: 'image/jpeg', tiff: 'image/tiff' };  
		
		_self._init();
	}
	
	$.html5imageupload.defaults = {
		width:				null,
		height: 			null,
		image:				null,  
		ghost:				true,
		originalsize:		true,
		url:				false,
		removeurl:			null,
		data:				{},
		canvas:				true,
		ajax:				true,
		resize: 			false,
		dimensionsonly:		false,
		editstart:			false,
		saveOriginal:		false,
		
		onAfterZoomImage:	null,
		onAfterInitImage:	null,
		onAfterMoveImage:	null,
		onAfterProcessImage: null,
		onAfterResetImage:	null,
		onAfterCancel:		null,
		onAfterRemoveImage:	null,
		onAfterSelectImage:	null,
		
	}
		
	$.html5imageupload.prototype = {
		_init: function() {
			
			var _self			= this;
			var options			= _self.options;
			var element			= _self.element
			var input			= _self.input;
			
			if (empty($(element))) {
				return false;
			} else {
				$(element).children().css({position: 'absolute'})
			}
			
			//the engine of this script
			if (! (window.FormData && ("upload" in ($.ajaxSettings.xhr())))) {
				$(element).empty().attr('class','').addClass('alert alert-danger').html('HTML5 Upload Image: Sadly.. this browser does not support the plugin, update your browser today!');
				return false;
			}
			
			if (!empty(options.width) && empty(options.height) && $(element).innerHeight() <= 0) {
				$(element).empty().attr('class','').addClass('alert alert-danger').html('HTML5 Upload Image: Image height is not set and can not be calculated...');
				return false;
			}
			if (!empty(options.height) && empty(options.width) && $(element).innerWidth() <= 0) {
				$(element).empty().attr('class','').addClass('alert alert-danger').html('HTML5 Upload Image: Image width is not set and can not be calculated...');
				return false;
			} 
			if (!empty(options.height) && !empty(options.width) && !empty($(element).innerHeight() && !empty($(element).innerWidth()))) {
				//all sizes are filled in
				if ((options.width / options.height) != ($(element).outerWidth() / $(element).outerHeight())) {
					$(element).empty().attr('class','').addClass('alert alert-danger').html('HTML5 Upload Image: The ratio of all sizes (CSS and image) are not the same...');
					return false;
				}
			}
			
			
			//////////////
			//check sizes
			var width, height, imageWidth, imageHeight;
			
			options.width		= 
			imageWidth			= options.width || $(element).outerWidth();
			options.height		=
			imageHeight			= options.height || $(element).outerHeight();
			
			if ($(element).innerWidth() > 0) {
				width			= $(element).outerWidth();
			} else if ($(element).innerHeight() > 0) {
				width			= null
			} else if (!empty(options.width)) {
				width			= options.width;
			}
			
			if ($(element).innerHeight() > 0) {
				height			= $(element).outerHeight();
			} else if ($(element).innerWidth() > 0) {
				height			= null
			} else if (!empty(options.height)) {
				height			= options.height;
			}
			
			height			= height || width / (imageWidth / imageHeight);
			width			= width || height / (imageHeight / imageWidth);
			
			//console.log($(element).css('width') + ' WIDTH');
			
			/* is small window, add class small */
			if (width < 240) {
				$(element).addClass('smalltools smalltext');
			}
			
			$(element).css({height:height, width: width});
			_self.widthPercentage		= ($(element).outerWidth() / $(element).offsetParent().width()) * 100;
			
			if (options.resize == true) {
				$(window).resize(function() {
					_self.resize();
				})
				/*$(window).orientationchange(function() {
					_self.resize();
				})*/
			}
			_self._bind();
			
			if (options.required || $(input).prop('required')) {
				_self.options.required			= true;
				$(input).prop('required',true)
			}
			
			if (!options.ajax) {
				_self._formValidation();
			}
			
			if (!empty(options.image) && options.editstart == false) {
				
				$(element).data('name',options.image).append($('<img />').addClass('preview').attr('src',options.image));
				
				var tools			= $('<div class="preview tools"></div>');
				var del				= $('' + this.button.del + '');
				$(del).click(function(e) {
					e.preventDefault();
					_self.reset();
				})
				
				if (options.buttonDel != false) {
					$(tools).append(del)
				}
				
				$(element).append(tools);
			} else if (!empty(options.image)) {
				_self.readImage(options.image, options.image, options.image,_self.imageMimes[options.image.split('.').pop()]); //$(img).attr('src'),)
			}
			
			if (_self.options.onAfterInitImage) _self.options.onAfterInitImage.call(_self);
		},
		_bind: function() {
			var _self			= this;
			var element			= _self.element;
			var input			= _self.input;
			
			//bind the events
			$(element).unbind('dragover').unbind('drop').unbind('mouseout').on({
				dragover: function(event){
					_self.handleDrag(event)
				},
				drop: function(event){
					_self.handleFile(event, $(this))
				},
				mouseout: function() {
					_self.imageUnhandle();//
				}
			});
			
			$(input).unbind('change').change(function(event){
				_self.drag		= false;
				_self.handleFile(event, $(element))
			});
			
			
		},
		
		handleFile: function(event, element) {
			event.stopPropagation();
			event.preventDefault();
			
			var _self		= this;
			var options		= this.options; 
		    var files 		= (_self.drag == false) ? event.originalEvent.target.files : event.originalEvent.dataTransfer.files; // FileList object.
		    _self.drag		= false;
		    
		   // _self.reset();
		    if (options.removeurl != null && !empty($(element).data('name'))) {
				$.ajax({
					type: 'POST',
					url: options.removeurl,
					data: {image: $(element).data('name') },
					success: function(response) {
						if (_self.options.onAfterRemoveImage) _self.options.onAfterRemoveImage.call(_self, response);
					}
				})
			}
		    
		    $(element).removeClass('notAnImage').addClass('loading');//.unbind('dragover').unbind('drop');
		    
		    for (var i = 0, f; f = files[i]; i++) {
		    	if (!f.type.match('image.*')) {
		    		$(element).addClass('notAnImage');
		    		continue;
		        }

		        var reader = new FileReader();
		        
		        reader.onload = (function(theFile) {
		        	//console.log(theFile);
		        	return function(e) {
		        		$(element).find('img').remove(); 
		        		_self.readImage(reader.result, e.target.result, theFile.name, theFile.type);
		        	};
		        })(f);
		        reader.readAsDataURL(f);
		    }
		    if (_self.options.onAfterSelectImage) _self.options.onAfterSelectImage.call(_self, response);
		},
		
		readImage: function(image, src, name, mimeType) {
			
			var _self		= this;
			var options		= this.options; 
			var element		= this.element;
		    _self.drag		= false;
			
			var img 		= new Image;
    		img.onload 		= function(tmp) {
    			//console.log(tmp);
    			var imgElement		= $('<img src="' + src + '" name="' + name + '" />');
    			var width, height, useWidth, useHeight, ratio, elementRatio;
    			
    			width				= 
    			useWidth			= img.width;
    			height				= 
    			useHeight			= img.height;
    			ratio				= width / height;
    			elementRatio		= $(element).outerWidth() / $(element).outerHeight();
    			
    			//resize image
    			if (options.originalsize == false) {
    				useWidth		= $(element).outerWidth() + 40;
    				useHeight		= useWidth / ratio;
    				
    				if (useHeight < $(element).outerHeight()) {
    					useHeight	= $(element).outerHeight() + 40;
    					useWidth	= useHeight * ratio;
    				}
    				
    			} else if (useWidth < $(element).outerWidth() || useHeight < $(element).outerHeight()) {
    				if (ratio < elementRatio) {
    					useWidth	= $(element).outerWidth();
    					useHeight	= useWidth / ratio;
    				} else {
    					useHeight	= $(element).outerHeight();
    					useWidth	= useHeight * ratio;
    				}
    			}
    			
    			var left			= parseFloat(($(element).outerWidth() - useWidth) / 2)// * -1;
    			var top				= parseFloat(($(element).outerHeight() - useHeight) / 2)// * -1;
    			
    			imgElement.css({left: left, top: top, width: useWidth, height: useHeight })
    			
    			_self.image			= $(imgElement).clone().data({ mime: mimeType, width: width, height: height, ratio: ratio, left: left, top: top, useWidth: useWidth, useHeight: useHeight}).addClass('main').bind('mousedown touchstart',function(event) { _self.imageHandle(event)});
    			_self.imageGhost	= (options.ghost) ? $(imgElement).addClass('ghost') : null;

    			//place the images
    			$(element).append($('<div class="cropWrapper"></div>').append($(_self.image)));
    			if (!empty(_self.imageGhost)) {
    				$(element).append(_self.imageGhost);
    			}
    			
    			//$(element).unbind('dragover').unbind('drop');
    			_self._tools();
    			
    			//clean up
    			$(element).removeClass('loading');
    		}
    		img.src					= image;
		},
		
		handleDrag: function(event) {
			var _self			= this;
			_self.drag			= true;
			event.stopPropagation();
			event.preventDefault();
			event.originalEvent.dataTransfer.dropEffect = 'copy';
		},
		imageHandle: function(e) {
			e.preventDefault(); // disable selection
			var event		= (e.originalEvent.touches || e.originalEvent.changedTouches) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;

			var _self			= this;
			var element			= this.element;
			var image			= this.image;
			
			var height			= image.outerHeight(),
			width				= image.outerWidth(),
			
			cursor_y			= image.offset().top + height - event.pageY,
			cursor_x			= image.offset().left + width - event.pageX;
			
			image.on({
				
				'mousemove touchmove': function(e) {
					e.stopImmediatePropagation()
					e.preventDefault();
					
					var event		= (e.originalEvent.touches || e.originalEvent.changedTouches) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;

					var imgTop 		= event.pageY + cursor_y - height,
					imgLeft 		= event.pageX + cursor_x - width;
					var hasBorder	=  ($(element).outerWidth() != $(element).innerWidth());
					
					if(parseInt(imgTop - $(element).offset().top) > 0) { 
						imgTop		= $(element).offset().top + ((hasBorder) ? 1 : 0);
					} else if (imgTop + height < $(element).offset().top + $(element).outerHeight()) {
				    	imgTop		= $(element).offset().top + $(element).outerHeight() - height + ((hasBorder) ? 1 : 0);
				    }
					     
				    if (parseInt(imgLeft - $(element).offset().left) > 0) {
				    	imgLeft		= $(element).offset().left + ((hasBorder) ? 1 : 0);;
				    } else if (imgLeft + width < $(element).offset().left + $(element).outerWidth()) {
				    	imgLeft = $(element).offset().left + $(element).outerWidth() - width + ((hasBorder) ? 1 : 0);;
				    }
				    
				    image.offset({
						top:	imgTop,
						left:	imgLeft
					})
					_self._ghost();
				},
				'mouseup touchend': function() {
					_self.imageUnhandle();
				}
			})
			
		},
		imageUnhandle: function() {
			var _self			= this;
			var image			= _self.image;
			
			$(image).unbind('mousemove touchmove');
			if (_self.options.onAfterMoveImage) _self.options.onAfterMoveImage.call(_self);
		},
		imageZoom :function(x){
			var _self 				= this;
			var element				= _self.element;
			var image				= _self.image;
			
			if (empty(image)) {
				_self._clearTimers();
				return false;
			}
			
			var ratio 				= image.data('ratio');
			var newWidth 			= image.outerWidth() + x;
			var newHeight 			= newWidth / ratio;
			
			//smaller then element?
			if (newWidth < $(element).outerWidth()) {
				newWidth			= $(element).outerWidth();
				newHeight			= newWidth / ratio;
				x					= $(image).outerWidth() - newWidth;
			}
			if (newHeight < $(element).outerHeight()) {
				newHeight			= $(element).outerHeight();
				newWidth			= newHeight * ratio;
				x					= $(image).outerWidth() - newWidth;
			}
			
			var newTop 				= Math.round(parseFloat(image.css('top')) - parseFloat(newHeight - image.outerHeight()) / 2);
			var newLeft 			= parseInt(image.css('left')) - x / 2;
			
			if ($(element).offset().left - newLeft < $(element).offset().left) {
				newLeft				= 0;
			} else if ($(element).outerWidth() > newLeft + $(image).outerWidth() && x <= 0) {
				newLeft				= $(element).outerWidth() - newWidth;
			}
			
			if ($(element).offset().top - newTop < $(element).offset().top) {
				newTop				= 0;
			} else if ($(element).outerHeight() > newTop + $(image).outerHeight() && x <= 0) {
				newTop				= $(element).outerHeight() - newHeight;
			}
			
			image.css({width: newWidth, height: newHeight, top: newTop, left: newLeft })
			_self._ghost();
			

		},
		imageCrop: function() {
			var _self				= this;
			var element				= _self.element;
			var image				= _self.image;
			var input				= _self.input;
			var options				= _self.options;
			
			var factor				= (options.width != $(element).outerWidth()) ? options.width / $(element).outerWidth() : 1;
			
			var finalWidth, finalHeight, finalTop, finalLeft, imageWidth, imageHeight, imageOriginalWidth, imageOriginalHeight;
			
			finalWidth				= options.width;
			finalHeight				= options.height;
			finalTop				= parseInt(Math.round(parseInt($(image).css('top')) * factor)) * -1
			finalLeft				= parseInt(Math.round(parseInt($(image).css('left')) * factor)) * -1
			imageWidth				= parseInt(Math.round($(image).width() * factor));
			imageHeight				= parseInt(Math.round($(image).height() * factor));
			imageOriginalWidth		= $(image).data('width');
			imageOriginalHeight		= $(image).data('height');
			
			finalTop				= finalTop || 0;
			finalLeft				= finalLeft || 0;
			
			var obj					= {name: $(image).attr('name'), imageOriginalWidth: imageOriginalWidth, imageOriginalHeight: imageOriginalHeight, imageWidth: imageWidth, imageHeight: imageHeight, width: finalWidth, height: finalHeight, left: finalLeft, top: finalTop}
			$(element).find('.tools').children().toggle();
			$(element).find('.tools').append($(_self.button.saving));
			
			
			if (options.canvas == true) {
				
	            var canvas          = $('<canvas class="final" id="canvas_' + $(input).attr('name') + '" width="' + finalWidth + '" height="' + finalHeight + '" style="position:absolute; top: 0; bottom: 0; left: 0; right: 0; z-index:100; width: 100%; height: 100%;"></canvas>');
	            $(element).append(canvas);
	            
	            var canvasContext   = $(canvas)[0].getContext('2d');
	            var imageObj        = new Image();

	            imageObj.onload = function() {
	            	
	            	
	                var canvasTmp			= $('<canvas width="' + imageWidth + '" height="' + imageHeight + '"></canvas>');
	                var canvasTmpContext    = $(canvasTmp)[0].getContext('2d');
	                var tmpImage			= $('<img src="" />');

	                canvasTmpContext.drawImage(imageObj, 0, 0, imageWidth, imageHeight);
	                var tmpObj				= new Image();
	                tmpObj.onload = function() {
	                	canvasContext.drawImage(tmpObj, finalLeft, finalTop, finalWidth, finalHeight, 0,0,finalWidth, finalHeight);
	                	
	                	if (options.ajax == true) {
	                		
	                		_self._ajax($.extend({data: $(canvas)[0].toDataURL(image.data('mime'))}, obj));
	                		
	                	} else {
	                		
	                		var json		= JSON.stringify($.extend({data: $(canvas)[0].toDataURL(image.data('mime'))},obj));
	        				$(input).after($('<input type="text" name="' + $(input).attr('name') + '_values" class="final" />').val(json));
	        				
	        				$(input).data('required',$(input).prop('required'));
	        				$(input).prop('required',false);
	        				$(input).wrap('<form>').parent('form').trigger('reset');
	        				$(input).unwrap();
	        				
	        				$(element).find('.tools .saving').remove();
							$(element).find('.tools').children().toggle();
	        				
	        				_self.imageFinal();
	                	}
	                	
	                }
	                tmpObj.src			= $(canvasTmp)[0].toDataURL(image.data('mime'));
	                

	            };
	            imageObj.src = $(image).attr('src');
	            
	            if (options.saveOriginal === true) {
	            	//console.log($(image).attr('src'));
	            	obj			= $.extend({original: $(image).attr('src')}, obj);
	            }
	            
			} else {
				if (options.ajax == true) {
					
					_self._ajax($.extend({data: $(image).attr('src'),saveOriginal: options.saveOriginal}, obj));
					
				} else {
					var finalImage		= $(element).find('.cropWrapper').clone();
					$(finalImage).addClass('final').show().unbind().children().unbind()
					$(element).append($(finalImage));

					_self.imageFinal();
					
					var json		= JSON.stringify(obj);
					$(input).after($('<input type="text" name="' + $(input).attr('name') + '_values" class="final" />').val(json));
				}
			}
		},
		_ajax: function(obj) {
			var _self				= this;
			var element				= _self.element;
			var image				= _self.image;
			var options				= _self.options;
			
			if (options.dimensionsonly == true) {
				delete obj.data;
			}
			
			$.ajax({
				type: 'POST',
				url: options.url,
				data: $.extend(obj, options.data),
				success: function(response) {
					
					if (response.status == "success") {
						var file		= response.url.split('?');
						$(element).find('.tools .saving').remove();
						$(element).find('.tools').children().toggle();
						$(element).data('name',file[0])
						if (options.canvas != true) {
							$(element).append($('<img src="' + file[0] + '" class="final" style="width: 100%" />'));
						}
						
						_self.imageFinal();
					} else {
						$(element).find('.tools .saving').remove();
						$(element).find('.tools').children().toggle();
						$(element).append($('<div class="alert alert-danger">' + response.error + '</div>').css({bottom: '10px',left: '10px',right: '10px',position: 'absolute', zIndex: 99}));
						setTimeout(function() { _self.responseReset();},2000);
					}
				},
				error: function(response, status) {
					$(element).find('.tools .saving').remove();
					$(element).find('.tools').children().toggle();
					$(element).append($('<div class="alert alert-danger"><strong>' + response.status + '</strong> ' + response.statusText + '</div>').css({bottom: '10px',left: '10px',right: '10px',position: 'absolute', zIndex: 99}));
					setTimeout(function() { _self.responseReset();},2000);
				}
			})
		},
		imageReset: function() {
			var _self			= this;
			var image			= _self.image;
			var element			= _self.element;
			
			$(image).css({width: image.data('useWidth'), height: image.data('useHeight'), top: image.data('top'), left: image.data('left')})
			_self._ghost();
			
			if (_self.options.onAfterResetImage) _self.options.onAfterResetImage.call(_self);
		},
		imageFinal: function() {
			var _self			= this;
			var element			= _self.element;
			var input			= _self.input;
			var options			= _self.options;
			
			//remove all children except final
			$(element).addClass('done');
			$(element).children().not('.final').hide();
			
			//create tools element
			var tools		= $('<div class="tools final">');
			
			//edit option after crop
			if (options.buttonEdit != false) {
				$(tools).append($(_self.button.edit).click(function() {
					$(element).children().show();
					$(element).find('.final').remove();
					$(input).data('valid',false);
				}));
			}
			
			//delete option after crop
			if (options.buttonDel != false) {
				$(tools).append($(_self.button.del).click(function(e){
					_self.reset();
				}))
			}
			
			//append tools to element
			$(element).append(tools);
			$(element).unbind();
			//set input to valid for form upload
			$(input).unbind().data('valid',true);
			
			//custom function after process image;
			if (_self.options.onAfterProcessImage) _self.options.onAfterProcessImage.call(_self);
		},
		responseReset: function() {
			var _self			= this;
			var element			= _self.element;
			
			//remove responds from ajax event
			$(element).find('.alert').remove(); 
			
		},
		reset: function() {
			var _self			= this;
			var element			= _self.element;
			var input			= _self.input;
			var options			= _self.options;
			_self.image			= null;
			
			
			$(element).find('.preview').remove();
			$(element).removeClass('loading done').children().show().not('input[type=file]').remove();
			$(input).wrap('<form>').parent('form').trigger('reset');
			$(input).unwrap();
			$(input).prop('required',$(input).data('required') || options.required || false).data('valid',false);
			_self._bind();
			
			if (options.removeurl != null && !empty($(element).data('name'))) {
				$.ajax({
					type: 'POST',
					url: options.removeurl,
					data: {image: $(element).data('name') },
					success: function(response) {
						if (_self.options.onAfterRemoveImage) _self.options.onAfterRemoveImage.call(_self, response);
					}
				})
			}
			$(element).data('name',null);
			
			if (_self.imageGhost) {
				$(_self.imageGhost).remove();
				_self.imageGhost	= null;
			}
			
			if (_self.options.onAfterCancel) _self.options.onAfterCancel.call(_self);
		},
		resize: function() {
			var _self			= this;
			var options			= _self.options;
			var element			= _self.element;
			var image			= _self.image;
			
			if (options.resize !== true) return false;
			
			var oldWidth		= $(element).outerWidth();
			var width			= $(element).offsetParent().width() * (_self.widthPercentage / 100);
			var factor			= width / oldWidth
			var height			= $(element).outerHeight() * factor;
			
			
			
			$(element).css({height:height, width: width});
			
			if (width < 240) {
				if (!$(element).hasClass('smalltools smalltext')) {
					$(element).addClass('smalltools smalltext smalladded');
				}
			} else {
				if ($(element).hasClass('smalladded')) {
					$(element).removeClass('smalltools smalltext smalladded');
				}
			}
			
			if (!empty(image)) {
				//console.log(image.offset());
				$(image).css({left: $(image).css('left').replace(/[^-\d\.]/g, '') * factor + 'px', top: $(image).css('top').replace(/[^-\d\.]/g, '')  * factor + 'px'})
				$(image).width($(image).width() * factor);
				$(image).height($(image).height()  * factor);
				
				_self._ghost();
			}
			//console.log('resize plugin');
		},
		_ghost: function() {
			var _self			= this;
			var options			= _self.options;
			var image			= _self.image;
			var ghost			= _self.imageGhost;
			
			//if set to true, mirror all drag events 
			//function in one place, much needed
			if (options.ghost == true && !empty(ghost)) {
				$(ghost).css({width: image.css('width'), height: image.css('height'), top: image.css('top'), left: image.css('left')})
			}
		},
		_tools: function() {
			var _self			= this;
			var element			= _self.element;
			var tools			= $('<div class="tools"></div>');
			var options			= _self.options;
			
			//zoomin button
			if (options.buttonZoomin != false) {
				$(tools).append($(_self.button.zoomin).on({
					'touchstart mousedown': function(e) { 
						e.preventDefault();
						_self.interval 		= window.setInterval(function(){ 
							_self.imageZoom(2); 
						},1);
					},
					'touchend mouseup mouseleave': function(e) {
						e.preventDefault();
						window.clearInterval(_self.interval);
						if (_self.options.onAfterZoomImage) _self.options.onAfterZoomImage.call(_self);
					}
				}));
			}
			
			//zoomreset button (set the image to the "original" size, same size as when selecting the image
			if (options.buttonZoomreset != false) {
				$(tools).append($(_self.button.zoomreset).on({
					'touchstart click': function(e) {
						e.preventDefault();
						_self.imageReset();
					}
				}));
			}
			
			//zoomout button
			if (options.buttonZoomout != false) {
				$(tools).append($(_self.button.zoomout).on({
					'touchstart mousedown': function(e) { 
						e.preventDefault();
						_self.interval 		= window.setInterval(function(){ 
							_self.imageZoom(-2); 
						},1);
					},
					'touchend mouseup mouseleave': function(e) {
						e.preventDefault();
						window.clearInterval(_self.interval);
						if (_self.options.onAfterZoomImage) _self.options.onAfterZoomImage.call(_self);
					}
				}));
			}
			//cancel button (removes the image and resets it to the original init event
			if (options.buttonCancel != false) {
				$(tools).append($(_self.button.cancel).on({
					'touchstart touchend click': function(e) { 
						e.preventDefault();
						_self.reset() 
					}
				}));
			}
			//done button (crop the image!) 
			if (options.buttonDone != false) {
				$(tools).append($(_self.button.done).on({
					'touchstart click': function(e) { 
						e.preventDefault();
						_self.imageCrop() 
					}
				}));
			}
			
			$(element).append($(tools));
			
		},
		_clearTimers: function() {
			//function to clear all timers, just to be sure!
			var interval_id = window.setInterval("", 9999);
			for (var i = 1; i < interval_id; i++)
				window.clearInterval(i);
		},
		_formValidation: function() {
			var _self				= this;
			var element				= _self.element;
			var input				= _self.input;
			
			$(element).closest('form').submit(function(e) {
				
				//e.stopPropagation();
				$(this).find('input[type=file]').each(function(i, el) {
					if ($(el).prop('required')) {
						if ($(el).data('valid') !== true) {
							e.preventDefault();
							return false;
						}
					}
				}) 
				
				return true;
			})
			
		}
		
	}
	
	$.fn.html5imageupload = function (options) {
		if ($.data(this, "html5imageupload")) return;
		return $(this).each(function() {
			new $.html5imageupload(options, this);
			$.data(this, "html5imageupload");
		})
	}
	
})(window, jQuery);


function empty(mixed_var) {
	//discuss at: http://phpjs.org/functions/empty/
	// original by: Philippe Baumann
	//    input by: Onno Marsman
	//    input by: LH
	//    input by: Stoyan Kyosev (http://www.svest.org/)
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Onno Marsman
	// improved by: Francesco
	// improved by: Marc Jansen
	// improved by: Rafal Kukawski
	
	var undef, key, i, len;
	var emptyValues = [undef, null, false, 0, '', '0'];

	for (i = 0, len = emptyValues.length; i < len; i++) {
		if (mixed_var === emptyValues[i]) {
			return true;
		}
	}

	if (typeof mixed_var === 'object') {
		for (key in mixed_var) {
			return false;
	    }
	    return true;
	}
	return false;
}








/*
 *  cropit - v0.2.0
 *  Customizable crop and zoom.
 *  https://github.com/scottcheng/cropit
 *
 *  Made by Scott Cheng
 *  Based on https://github.com/yufeiliu/simple_image_uploader
 *  Under MIT License
 */
(function($) {
    var Zoomer;
    Zoomer = function() {
        function Zoomer() {}
        Zoomer.prototype.setup = function(imageSize, previewSize, exportZoom, options) {
            var heightRatio, widthRatio;
            if (exportZoom == null) {
                exportZoom = 1;
            }
            widthRatio = previewSize.w / imageSize.w;
            heightRatio = previewSize.h / imageSize.h;
            if ((options != null ? options.fitWidth : void 0) && !(options != null ? options.fitHeight : void 0)) {
                this.minZoom = widthRatio;
            } else if ((options != null ? options.fitHeight : void 0) && !(options != null ? options.fitWidth : void 0)) {
                this.minZoom = heightRatio;
            } else if ((options != null ? options.fitWidth : void 0) && (options != null ? options.fitHeight : void 0)) {
                this.minZoom = widthRatio < heightRatio ? widthRatio : heightRatio;
            } else {
                this.minZoom = widthRatio < heightRatio ? heightRatio : widthRatio;
            }
            return this.maxZoom = this.minZoom < 1 / exportZoom ? 1 / exportZoom : this.minZoom;
        };
        Zoomer.prototype.getZoom = function(sliderPos) {
            if (!(this.minZoom && this.maxZoom)) {
                return null;
            }
            return sliderPos * (this.maxZoom - this.minZoom) + this.minZoom;
        };
        Zoomer.prototype.getSliderPos = function(zoom) {
            if (!(this.minZoom && this.maxZoom)) {
                return null;
            }
            if (this.minZoom === this.maxZoom) {
                return 0;
            } else {
                return (zoom - this.minZoom) / (this.maxZoom - this.minZoom);
            }
        };
        Zoomer.prototype.isZoomable = function() {
            if (!(this.minZoom && this.maxZoom)) {
                return null;
            }
            return this.minZoom !== this.maxZoom;
        };
        Zoomer.prototype.fixZoom = function(zoom) {
            if (zoom < this.minZoom) {
                return this.minZoom;
            }
            if (zoom > this.maxZoom) {
                return this.maxZoom;
            }
            return zoom;
        };
        return Zoomer;
    }();
    var Cropit;
    Cropit = function() {
        Cropit._DEFAULTS = {
            exportZoom: 1,
            imageBackground: false,
            imageBackgroundBorderWidth: 0,
            imageState: null,
            allowCrossOrigin: false,
            allowDragNDrop: true,
            fitWidth: false,
            fitHeight: false,
            freeMove: false
        };
        Cropit.PREVIEW_EVENTS = function() {
            return [ "mousedown", "mouseup", "mouseleave", "touchstart", "touchend", "touchcancel", "touchleave" ].map(function(type) {
                return "" + type + ".cropit";
            }).join(" ");
        }();
        Cropit.PREVIEW_MOVE_EVENTS = "mousemove.cropit touchmove.cropit";
        Cropit.ZOOM_INPUT_EVENTS = function() {
            return [ "mousemove", "touchmove", "change" ].map(function(type) {
                return "" + type + ".cropit";
            }).join(" ");
        }();
        function Cropit(element, options) {
            var dynamicDefaults;
            this.element = element;
            this.$el = $(this.element);
            dynamicDefaults = {
                $fileInput: this.$("input.cropit-image-input"),
                $preview: this.$(".cropit-image-preview"),
                $zoomSlider: this.$("input.cropit-image-zoom-input"),
                $previewContainer: this.$(".cropit-image-preview-container")
            };
            this.options = $.extend({}, Cropit._DEFAULTS, dynamicDefaults, options);
            this.init();
        }
        Cropit.prototype.init = function() {
            var $previewContainer, _ref, _ref1, _ref2;
            this.image = new Image();
            if (this.options.allowCrossOrigin) {
                this.image.crossOrigin = "Anonymous";
            }
            this.$fileInput = this.options.$fileInput.attr({
                accept: "image/*"
            });
            this.$preview = this.options.$preview.css({
                backgroundRepeat: "no-repeat"
            });
            this.$zoomSlider = this.options.$zoomSlider.attr({
                min: 0,
                max: 1,
                step: .01
            });
            this.previewSize = {
                w: this.options.width || this.$preview.width(),
                h: this.options.height || this.$preview.height()
            };
            if (this.options.width) {
                this.$preview.width(this.previewSize.w);
            }
            if (this.options.height) {
                this.$preview.height(this.previewSize.h);
            }
            if (this.options.imageBackground) {
                if ($.isArray(this.options.imageBackgroundBorderWidth)) {
                    this.imageBgBorderWidthArray = this.options.imageBackgroundBorderWidth;
                } else {
                    this.imageBgBorderWidthArray = [];
                    [ 0, 1, 2, 3 ].forEach(function(_this) {
                        return function(i) {
                            return _this.imageBgBorderWidthArray[i] = _this.options.imageBackgroundBorderWidth;
                        };
                    }(this));
                }
                $previewContainer = this.options.$previewContainer;
                this.$imageBg = $("<img />").addClass("cropit-image-background").attr("alt", "").css("position", "absolute");
                this.$imageBgContainer = $("<div />").addClass("cropit-image-background-container").css({
                    position: "absolute",
                    zIndex: 0,
                    left: -this.imageBgBorderWidthArray[3] + window.parseInt(this.$preview.css("border-left-width")),
                    top: -this.imageBgBorderWidthArray[0] + window.parseInt(this.$preview.css("border-top-width")),
                    width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
                    height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2]
                }).append(this.$imageBg);
                if (this.imageBgBorderWidthArray[0] > 0) {
                    this.$imageBgContainer.css({
                        overflow: "hidden"
                    });
                }
                $previewContainer.css("position", "relative").prepend(this.$imageBgContainer);
                this.$preview.css("position", "relative");
                this.$preview.hover(function(_this) {
                    return function() {
                        return _this.$imageBg.addClass("cropit-preview-hovered");
                    };
                }(this), function(_this) {
                    return function() {
                        return _this.$imageBg.removeClass("cropit-preview-hovered");
                    };
                }(this));
            }
            this.initialOffset = {
                x: 0,
                y: 0
            };
            this.initialZoom = 0;
            this.initialZoomSliderPos = 0;
            this.imageLoaded = false;
            this.moveContinue = false;
            this.zoomer = new Zoomer();
            if (this.options.allowDragNDrop) {
                jQuery.event.props.push("dataTransfer");
            }
            this.bindListeners();
            this.$zoomSlider.val(this.initialZoomSliderPos);
            this.setOffset(((_ref = this.options.imageState) != null ? _ref.offset : void 0) || this.initialOffset);
            this.zoom = ((_ref1 = this.options.imageState) != null ? _ref1.zoom : void 0) || this.initialZoom;
            return this.loadImage(((_ref2 = this.options.imageState) != null ? _ref2.src : void 0) || null);
        };
        Cropit.prototype.bindListeners = function() {
            this.$fileInput.on("change.cropit", this.onFileChange.bind(this));
            this.$preview.on(Cropit.PREVIEW_EVENTS, this.onPreviewEvent.bind(this));
            this.$zoomSlider.on(Cropit.ZOOM_INPUT_EVENTS, this.onZoomSliderChange.bind(this));
            if (this.options.allowDragNDrop) {
                this.$preview.on("dragover.cropit dragleave.cropit", this.onDragOver.bind(this));
                return this.$preview.on("drop.cropit", this.onDrop.bind(this));
            }
        };
        Cropit.prototype.unbindListeners = function() {
            this.$fileInput.off("change.cropit");
            this.$preview.off(Cropit.PREVIEW_EVENTS);
            this.$preview.off("dragover.cropit dragleave.cropit drop.cropit");
            return this.$zoomSlider.off(Cropit.ZOOM_INPUT_EVENTS);
        };
        Cropit.prototype.reset = function() {
            this.zoom = this.initialZoom;
            return this.offset = this.initialOffset;
        };
        Cropit.prototype.onFileChange = function() {
            var _base;
            if (typeof (_base = this.options).onFileChange === "function") {
                _base.onFileChange();
            }
            return this.loadFileReader(this.$fileInput.get(0).files[0]);
        };
        Cropit.prototype.loadFileReader = function(file) {
            var fileReader;
            fileReader = new FileReader();
            if (file != null ? file.type.match("image") : void 0) {
                this.setImageLoadingClass();
                fileReader.readAsDataURL(file);
                fileReader.onload = this.onFileReaderLoaded.bind(this);
                return fileReader.onerror = this.onFileReaderError.bind(this);
            }
        };
        Cropit.prototype.onFileReaderLoaded = function(e) {
            this.reset();
            return this.loadImage(e.target.result);
        };
        Cropit.prototype.onFileReaderError = function() {
            var _base;
            return typeof (_base = this.options).onFileReaderError === "function" ? _base.onFileReaderError() : void 0;
        };
        Cropit.prototype.onDragOver = function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            return this.$preview.toggleClass("cropit-drag-hovered", e.type === "dragover");
        };
        Cropit.prototype.onDrop = function(e) {
            var files;
            e.preventDefault();
            e.stopPropagation();
            files = Array.prototype.slice.call(e.dataTransfer.files, 0);
            files.some(function(_this) {
                return function(file) {
                    if (file.type.match("image")) {
                        _this.loadFileReader(file);
                        return true;
                    }
                };
            }(this));
            return this.$preview.removeClass("cropit-drag-hovered");
        };
        Cropit.prototype.loadImage = function(imageSrc) {
            var _base;
            this.imageSrc = imageSrc;
            if (!this.imageSrc) {
                return;
            }
            if (typeof (_base = this.options).onImageLoading === "function") {
                _base.onImageLoading();
            }
            this.setImageLoadingClass();
            this.image.onload = this.onImageLoaded.bind(this);
            this.image.onerror = this.onImageError.bind(this);
            return this.image.src = this.imageSrc;
        };
        Cropit.prototype.onImageLoaded = function() {
            var _base;
            this.setImageLoadedClass();
            this.setOffset(this.offset);
            this.$preview.css("background-image", "url(" + this.imageSrc + ")");
            if (this.options.imageBackground) {
                this.$imageBg.attr("src", this.imageSrc);
            }
            this.imageSize = {
                w: this.image.width,
                h: this.image.height
            };
            this.setupZoomer();
            this.imageLoaded = true;
            return typeof (_base = this.options).onImageLoaded === "function" ? _base.onImageLoaded() : void 0;
        };
        Cropit.prototype.onImageError = function() {
            var _base;
            return typeof (_base = this.options).onImageError === "function" ? _base.onImageError() : void 0;
        };
        Cropit.prototype.setImageLoadingClass = function() {
            return this.$preview.removeClass("cropit-image-loaded").addClass("cropit-image-loading");
        };
        Cropit.prototype.setImageLoadedClass = function() {
            return this.$preview.removeClass("cropit-image-loading").addClass("cropit-image-loaded");
        };
        Cropit.prototype.getEventPosition = function(e) {
            var _ref, _ref1, _ref2, _ref3;
            if ((_ref = e.originalEvent) != null ? (_ref1 = _ref.touches) != null ? _ref1[0] : void 0 : void 0) {
                e = (_ref2 = e.originalEvent) != null ? (_ref3 = _ref2.touches) != null ? _ref3[0] : void 0 : void 0;
            }
            if (e.clientX && e.clientY) {
                return {
                    x: e.clientX,
                    y: e.clientY
                };
            }
        };
        Cropit.prototype.onPreviewEvent = function(e) {
            if (!this.imageLoaded) {
                return;
            }
            this.moveContinue = false;
            this.$preview.off(Cropit.PREVIEW_MOVE_EVENTS);
            if (e.type === "mousedown" || e.type === "touchstart") {
                this.origin = this.getEventPosition(e);
                this.moveContinue = true;
                this.$preview.on(Cropit.PREVIEW_MOVE_EVENTS, this.onMove.bind(this));
            } else {
                $(document.body).focus();
            }
            e.stopPropagation();
            return false;
        };
        Cropit.prototype.onMove = function(e) {
            var eventPosition;
            eventPosition = this.getEventPosition(e);
            if (this.moveContinue && eventPosition) {
                this.setOffset({
                    x: this.offset.x + eventPosition.x - this.origin.x,
                    y: this.offset.y + eventPosition.y - this.origin.y
                });
            }
            this.origin = eventPosition;
            e.stopPropagation();
            return false;
        };
        Cropit.prototype.setOffset = function(position) {
            this.offset = this.fixOffset(position);
            this.$preview.css("background-position", "" + this.offset.x + "px " + this.offset.y + "px");
            if (this.options.imageBackground) {
                return this.$imageBg.css({
                    left: this.offset.x + this.imageBgBorderWidthArray[3],
                    top: this.offset.y + this.imageBgBorderWidthArray[0]
                });
            }
        };
        Cropit.prototype.fixOffset = function(offset) {
            var ret;
            if (!this.imageLoaded) {
                return offset;
            }
            ret = {
                x: offset.x,
                y: offset.y
            };
            if (!this.options.freeMove) {
                if (this.imageSize.w * this.zoom <= this.previewSize.w) {
                    ret.x = 0;
                } else if (ret.x > 0) {
                    ret.x = 0;
                } else if (ret.x + this.imageSize.w * this.zoom < this.previewSize.w) {
                    ret.x = this.previewSize.w - this.imageSize.w * this.zoom;
                }
                if (this.imageSize.h * this.zoom <= this.previewSize.h) {
                    ret.y = 0;
                } else if (ret.y > 0) {
                    ret.y = 0;
                } else if (ret.y + this.imageSize.h * this.zoom < this.previewSize.h) {
                    ret.y = this.previewSize.h - this.imageSize.h * this.zoom;
                }
            }
            ret.x = this.round(ret.x);
            ret.y = this.round(ret.y);
            return ret;
        };
        Cropit.prototype.onZoomSliderChange = function() {
            var newZoom;
            if (!this.imageLoaded) {
                return;
            }
            this.zoomSliderPos = Number(this.$zoomSlider.val());
            newZoom = this.zoomer.getZoom(this.zoomSliderPos);
            return this.setZoom(newZoom);
        };
        Cropit.prototype.enableZoomSlider = function() {
            var _base;
            this.$zoomSlider.removeAttr("disabled");
            return typeof (_base = this.options).onZoomEnabled === "function" ? _base.onZoomEnabled() : void 0;
        };
        Cropit.prototype.disableZoomSlider = function() {
            var _base;
            this.$zoomSlider.attr("disabled", true);
            return typeof (_base = this.options).onZoomDisabled === "function" ? _base.onZoomDisabled() : void 0;
        };
        Cropit.prototype.setupZoomer = function() {
            this.zoomer.setup(this.imageSize, this.previewSize, this.options.exportZoom, this.options);
            this.zoom = this.fixZoom(this.zoom);
            this.setZoom(this.zoom);
            if (this.isZoomable()) {
                return this.enableZoomSlider();
            } else {
                return this.disableZoomSlider();
            }
        };
        Cropit.prototype.setZoom = function(newZoom) {
            var newX, newY, oldZoom, updatedHeight, updatedWidth;
            newZoom = this.fixZoom(newZoom);
            updatedWidth = this.round(this.imageSize.w * newZoom);
            updatedHeight = this.round(this.imageSize.h * newZoom);
            oldZoom = this.zoom;
            newX = this.previewSize.w / 2 - (this.previewSize.w / 2 - this.offset.x) * newZoom / oldZoom;
            newY = this.previewSize.h / 2 - (this.previewSize.h / 2 - this.offset.y) * newZoom / oldZoom;
            this.zoom = newZoom;
            this.setOffset({
                x: newX,
                y: newY
            });
            this.zoomSliderPos = this.zoomer.getSliderPos(this.zoom);
            this.$zoomSlider.val(this.zoomSliderPos);
            this.$preview.css("background-size", "" + updatedWidth + "px " + updatedHeight + "px");
            if (this.options.imageBackground) {
                return this.$imageBg.css({
                    width: updatedWidth,
                    height: updatedHeight
                });
            }
        };
        Cropit.prototype.fixZoom = function(zoom) {
            return this.zoomer.fixZoom(zoom);
        };
        Cropit.prototype.isZoomable = function() {
            return this.zoomer.isZoomable();
        };
        Cropit.prototype.getCroppedImageData = function(exportOptions) {
            var canvas, canvasContext, croppedSize, exportDefaults, exportZoom;
            if (!this.imageSrc) {
                return null;
            }
            exportDefaults = {
                type: "image/png",
                quality: .75,
                originalSize: false,
                fillBg: "#fff"
            };
            exportOptions = $.extend({}, exportDefaults, exportOptions);
            croppedSize = {
                w: this.previewSize.w,
                h: this.previewSize.h
            };
            if (this.options.fitHeight && !this.options.fitWidth && this.imageSize.w * this.zoom < this.previewSize.w) {
                croppedSize.w = this.imageSize.w * this.zoom;
            } else if (this.options.fitWidth && !this.options.fitHeight && this.imageSize.h * this.zoom < this.previewSize.h) {
                croppedSize.h = this.imageSize.h * this.zoom;
            }
            exportZoom = exportOptions.originalSize ? 1 / this.zoom : this.options.exportZoom;
            canvas = $("<canvas />").attr({
                width: croppedSize.w * exportZoom,
                height: croppedSize.h * exportZoom
            }).get(0);
            canvasContext = canvas.getContext("2d");
            if (exportOptions.type === "image/jpeg") {
                canvasContext.fillStyle = exportOptions.fillBg;
                canvasContext.fillRect(0, 0, canvas.width, canvas.height);
            }
            canvasContext.drawImage(this.image, this.offset.x * exportZoom, this.offset.y * exportZoom, this.zoom * exportZoom * this.imageSize.w, this.zoom * exportZoom * this.imageSize.h);
            return canvas.toDataURL(exportOptions.type, exportOptions.quality);
        };
        Cropit.prototype.getImageState = function() {
            return {
                src: this.imageSrc,
                offset: this.offset,
                zoom: this.zoom
            };
        };
        Cropit.prototype.getImageSrc = function() {
            return this.imageSrc;
        };
        Cropit.prototype.getOffset = function() {
            return this.offset;
        };
        Cropit.prototype.getZoom = function() {
            return this.zoom;
        };
        Cropit.prototype.getImageSize = function() {
            if (!this.imageSize) {
                return null;
            }
            return {
                width: this.imageSize.w,
                height: this.imageSize.h
            };
        };
        Cropit.prototype.getPreviewSize = function() {
            return {
                width: this.previewSize.w,
                height: this.previewSize.h
            };
        };
        Cropit.prototype.setPreviewSize = function(size) {
            if (!((size != null ? size.width : void 0) > 0 && (size != null ? size.height : void 0) > 0)) {
                return;
            }
            this.previewSize = {
                w: size.width,
                h: size.height
            };
            this.$preview.css({
                width: this.previewSize.w,
                height: this.previewSize.h
            });
            if (this.options.imageBackground) {
                this.$imageBgContainer.css({
                    width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
                    height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2]
                });
            }
            if (this.imageLoaded) {
                return this.setupZoomer();
            }
        };
        Cropit.prototype.disable = function() {
            this.unbindListeners();
            this.disableZoomSlider();
            return this.$el.addClass("cropit-disabled");
        };
        Cropit.prototype.reenable = function() {
            this.bindListeners();
            this.enableZoomSlider();
            return this.$el.removeClass("cropit-disabled");
        };
        Cropit.prototype.round = function(x) {
            return Math.round(x * 1e5) / 1e5;
        };
        Cropit.prototype.$ = function(selector) {
            if (!this.$el) {
                return null;
            }
            return this.$el.find(selector);
        };
        return Cropit;
    }();
    var dataKey, methods;
    dataKey = "cropit";
    methods = {
        init: function(options) {
            return this.each(function() {
                var cropit;
                if (!$.data(this, dataKey)) {
                    cropit = new Cropit(this, options);
                    return $.data(this, dataKey, cropit);
                }
            });
        },
        destroy: function() {
            return this.each(function() {
                return $.removeData(this, dataKey);
            });
        },
        isZoomable: function() {
            var cropit;
            cropit = this.first().data(dataKey);
            return cropit != null ? cropit.isZoomable() : void 0;
        },
        "export": function(options) {
            var cropit;
            cropit = this.first().data(dataKey);
            return cropit != null ? cropit.getCroppedImageData(options) : void 0;
        },
        imageState: function() {
            var cropit;
            cropit = this.first().data(dataKey);
            return cropit != null ? cropit.getImageState() : void 0;
        },
        imageSrc: function(newImageSrc) {
            var cropit;
            if (newImageSrc != null) {
                return this.each(function() {
                    var cropit;
                    cropit = $.data(this, dataKey);
                    if (cropit != null) {
                        cropit.reset();
                    }
                    return cropit != null ? cropit.loadImage(newImageSrc) : void 0;
                });
            } else {
                cropit = this.first().data(dataKey);
                return cropit != null ? cropit.getImageSrc() : void 0;
            }
        },
        offset: function(newOffset) {
            var cropit;
            if (newOffset != null && newOffset.x != null && newOffset.y != null) {
                return this.each(function() {
                    var cropit;
                    cropit = $.data(this, dataKey);
                    return cropit != null ? cropit.setOffset(newOffset) : void 0;
                });
            } else {
                cropit = this.first().data(dataKey);
                return cropit != null ? cropit.getOffset() : void 0;
            }
        },
        zoom: function(newZoom) {
            var cropit;
            if (newZoom != null) {
                return this.each(function() {
                    var cropit;
                    cropit = $.data(this, dataKey);
                    return cropit != null ? cropit.setZoom(newZoom) : void 0;
                });
            } else {
                cropit = this.first().data(dataKey);
                return cropit != null ? cropit.getZoom() : void 0;
            }
        },
        imageSize: function() {
            var cropit;
            cropit = this.first().data(dataKey);
            return cropit != null ? cropit.getImageSize() : void 0;
        },
        previewSize: function(newSize) {
            var cropit;
            if (newSize != null) {
                return this.each(function() {
                    var cropit;
                    cropit = $.data(this, dataKey);
                    return cropit != null ? cropit.setPreviewSize(newSize) : void 0;
                });
            } else {
                cropit = this.first().data(dataKey);
                return cropit != null ? cropit.getPreviewSize() : void 0;
            }
        },
        disable: function() {
            return this.each(function() {
                var cropit;
                cropit = $.data(this, dataKey);
                return cropit.disable();
            });
        },
        reenable: function() {
            return this.each(function() {
                var cropit;
                cropit = $.data(this, dataKey);
                return cropit.reenable();
            });
        }
    };
    $.fn.cropit = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, [].slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    };
})(window.jQuery);
$(function() {
  
  
  // Days
  var daySet = 2;
  
  $('#daySet').on('change', function(e) {
    daySet = parseInt($(this).val(), 10);
    console.log(daySet);
    $('#day').val(daySet);
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
    var imageData2 = $('.image-editor-3').cropit('export', {
      type: 'image/jpeg'
    });
    $('.image-editor-3 .preview-image').html('<img src="' + imageData2 + '">');
    console.log(imageData2);
    $('#image3').val(imageData2);
  });
  
  // Image 4
  $('.image-editor-4').cropit({
  });

  $('.image-editor-4 .export').click(function(e) {
    e.preventDefault();
    var imageData2 = $('.image-editor-4').cropit('export', {
      type: 'image/jpeg'
    });
    $('.image-editor-4 .preview-image').html('<img src="' + imageData2 + '">');
    console.log(imageData2);
    $('#image4').val(imageData2);
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
