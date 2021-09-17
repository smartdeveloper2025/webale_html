(function($) {

	var win = $(window);
	var doc = $(document);

	function minTwoDigits(n) {
		return (n < 10 ? '0' : '') + n;
	}

	function offset(el) {
	    var rect = el.getBoundingClientRect(),
	    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}

	var controller = null;

	controller = new ScrollMagic.Controller();

	var draw_lines = new TimelineMax({paused: true})
		.set("header", {className:"+=draw-line"}, 0.1)
		.set(".main-navigation", {className:"+=draw-line"}, 0.2)
		.set(".header-center", {className:"+=draw-line"}, 0.2)
		.set(".main-navigation #menu-main > li:nth-child(2)", {className:"+=draw-line"}, 0.35)
		.set(".main-navigation #menu-main > li:nth-child(3)", {className:"+=draw-line"}, 0.4)
		.set(".main-navigation #menu-main > li:nth-child(4)", {className:"+=draw-line"}, 0.45)
		.set(".main-navigation #menu-main > li:nth-child(5)", {className:"+=draw-line"}, 0.5)
		.set(".header-center > .container", {className:"+=draw-line"}, 0.55)
		;

	new ScrollMagic.Scene({
			triggerElement: 'header',
			triggerHook: .5,
			reverse: true,
			loglevel: 0
	}).setTween(
		draw_lines
	)
	// .addIndicators()
	.addTo(controller);

	if (!$('body').hasClass('home')) {
		draw_lines.play();
	}

	if ($('.page-hero').length) {
		hero_lines();
	}

	MorphSVGPlugin.convertToPath("polyline, polygon, rect");

	var menu_about = $(document).find('.menu-about > a');
	var menu_about_link = menu_about.attr('href');

	var arrow_position = $(window).width() - 40;

	TweenMax.to($(document).find('.post-nav span'), .5, { autoAlpha: 1, top: '50%', delay: 1});

	var po = $('.programme-overlay').html();
	$('.programme-overlay').remove();
	$('.menu-programmes a').after('<div class="programme-overlay">'+po+'</div>');


	// Search overlay
	$('.search-icon, .search-close-button').on('click', function(e){
		e.preventDefault();

		TweenLite.to($(this).find('#search-open'), .3, {morphSVG:"#search-close"});

		if ($(this).hasClass('active')) {

			TweenMax.to($('.search-overlay'), .4, {autoAlpha: 0});

			$('.search-icon, .search-close-button').removeClass('active');
			$('body').removeClass('search-open');

			TweenLite.to($(this).find('#search-open'), .3, {morphSVG:"#search-open"});

		} else {            

			TweenMax.to($('.search-overlay'), .4, {autoAlpha: 1});

			$('.search-icon, .search-close-button').addClass('active');
			$('body').addClass('search-open');

			if ($('body').hasClass('menu-open')) {
				$('.burger').click();
			}

			setTimeout(function(){
				$(document).find('#keyword').focus();
			}, 500);

			TweenLite.to($(this).find('#search-open'), .3, {morphSVG:"#search-close"});

		}

    });
    

    $('.search-overlay').keyup(function (e) {
        if (e.key === "Escape" && $('.search-icon').hasClass('active')) {
            $('.search-icon:first').trigger('click');
        }
    });




	$(document).on('click', '.burger-search-open, .seach-view-all', function(e){
		e.preventDefault();

		TweenMax.to($('.search-overlay'), .4, {autoAlpha: 0});
		$('.search-icon').removeClass('active');
		$('body').removeClass('search-open');
		$('.burger').removeClass('burger-search-open');
		TweenLite.to($('.search-icon #search-open'), .3, {morphSVG:"#search-open"});

	});

	$(document).on('click', '.search-open .search-overlay-item a', function(e){

		TweenMax.to($('.search-overlay'), .4, {autoAlpha: 0});
		$('.search-icon').removeClass('active');
		$('body').removeClass('search-open');
		$('.burger').removeClass('burger-search-open');
		TweenLite.to($('.search-icon #search-open'), .3, {morphSVG:"#search-open"});

	});

	$(document).on('click', '#social-button:not(.active)', function(e){
		e.preventDefault();
		TweenMax.staggerTo('header .social li', .3, {autoAlpha: 1}, -.05);
		$(this).addClass('active');
	});

	$(document).on('click', '#social-button.active', function(e){
		e.preventDefault();
		TweenMax.staggerTo('header .social li', .3, {autoAlpha: 0}, .05);
		$(this).removeClass('active');
	});

	main_nav_pos();
	function main_nav_pos(){
		$('.navigation-row').css('top', $('header').outerHeight() + 1);
	}
	win.on('resize', _.debounce(main_nav_pos, 150));


	$('.burger').on('click', function(e){
		e.preventDefault();

		if ($(this).hasClass('active')) {

			TweenMax.to('.navigation-row', .4, {autoAlpha: 0});
			$(this).removeClass('active');
			$('body').removeClass('menu-open');
			$('.burger').removeClass('burger-menu-open');
			sub_menu_timeline.reverse();
			programme_menu_timeline.reverse();
			$('.mob-menu-open').removeClass('mob-menu-open');
			$('.prog-menu-open').removeClass('prog-menu-open');

		} else {

			TweenMax.to('.navigation-row', .4, {autoAlpha: 1});
			$(this).addClass('active');
			$('body').addClass('menu-open');
			$('.burger').addClass('burger-menu-open');

			if ($('body').hasClass('search-open')) {
				
				TweenMax.to($('.search-overlay'), .4, {autoAlpha: 0});
				$('.search-icon').removeClass('active');
				$('body').removeClass('search-open');
				$('.burger').removeClass('burger-search-open');
				TweenLite.to($('.search-icon').find('#search-open'), .3, {morphSVG:"#search-open"});

			}

		}

	});

	$(document).on('click', '.menu-open main', function(){
		TweenMax.to('.navigation-row', .4, {autoAlpha: 0});
		$(this).removeClass('active');
		$('body').removeClass('menu-open');
		$('.burger').removeClass('burger-menu-open active');

		sub_menu_timeline.reverse();
		programme_menu_timeline.reverse();
		$('.mob-menu-open').removeClass('mob-menu-open');
		$('.prog-menu-open').removeClass('prog-menu-open');
	});

	var sub_menu_timeline = new TimelineMax({
			paused: true
		})
		.to('#menu-main > .menu-item > a', .4, {autoAlpha: 0})
		.to($('.sub-menu'), .4, {left: 0})
		.to($('svg'), .4, {right: arrow_position}, '-=.4')
		.to($('#menu-forward'), .4, {morphSVG:"#menu-back"}, '-=.4')
		;

	function sub_menu() {

		var win_width = win.width();

		$(document).find('.menu-about, .menu-about-open > .sub-menu').unbind();

		var arrow_position = $(window).width() - 40;

		var sub_menu_timeline = new TimelineMax({
			paused: true
		})
		.to('#menu-main > .menu-item > a', .4, {autoAlpha: 0})
		.to($(document).find('.sub-menu'), .4, {left: 0})
		.to($(document).find('svg'), .4, {right: arrow_position}, '-=.4')
		.to($(document).find('#menu-forward'), .4, {morphSVG:"#menu-back"}, '-=.4')
		;


		if (win_width < 992 + 17) {

			// Remove link so page doesnt load and submenu appears
			menu_about.attr('href', '');

		
			$(document).find('.menu-item-has-children:not(.mob-menu-open)').on('click', function(e){
				e.preventDefault();

				TweenMax.to($('.menu-about > .sub-menu'), .3, { autoAlpha: 1 });

				if ($('.prog-menu-open').length) {

					programme_menu_timeline.reverse();
					$('.prog-menu-open').removeClass('prog-menu-open');

				} else {

					if ($(this).hasClass('mob-menu-open')) {
						sub_menu_timeline.reverse();
					} else {
						sub_menu_timeline.play();
					}

					$(this).toggleClass('mob-menu-open');

				}

			});

		} else {

			// Read link so page loads on click
			menu_about.attr('href', menu_about_link);

		    var sub = $('.menu-about > .sub-menu');

			$(document).find('.menu-about, .menu-about-open > .sub-menu').hover(
		        function(e) {

		        	sub.css('width', win.width()).css('height', 'auto');

    				var div = document.querySelector('.menu-about');
					var divOffset = offset(div);
					parseInt(divOffset.left);
					$('.menu-about > .sub-menu').css('left', parseInt(divOffset.left) * -1);
					$('.menu-about > .sub-menu a').css('left', parseInt(divOffset.left));
		     
		            TweenMax.to(sub, .3, { autoAlpha: 1 });
		            $('body').addClass('menu-open');
		            $('.menu-about').addClass('about-menu-open');

		            setTimeout(function(){
		            	TweenMax.staggerTo('.menu-about .sub-menu > li a', .5, { autoAlpha: 1 }, .1);
		            });

		            e.stopPropagation();
			        
		        },
		        function(e) {

		            TweenMax.to(sub, .1, { autoAlpha: 0 });
		            $('.menu-about').removeClass('about-menu-open');
		            $('body').removeClass('menu-open');
		            $('.menu-about > .sub-menu').css('left', $(window).width());
		            TweenMax.to('.menu-about .sub-menu > li a', .2, { autoAlpha: 0 });

		        }
			);

		}

	}

	$(document).on('click', '.menu-about', function(){
		$('.sub-menu').css('width', $(window).width());
	})

	var programme_menu_timeline = new TimelineMax({
		paused: true
	})
	.to('#menu-main > .menu-item > a', .4, {autoAlpha: 0})
	.to($('.programme-overlay'), .4, {left: 0, autoAlpha: 1})
	.to($('svg'), .4, {right: $(window).width() - 40}, '-=.4')
	.to($('#menu-forward'), .4, {morphSVG:"#menu-back"}, '-=.4')
	;

	function programme_menu() {	

		var win_width = win.width();

		$(document).find('.menu-programmes, .programme-overlay').unbind();

		if (win_width < 992 + 17) {

			// $(document).find('.menu-programmes').on('click', function(e){
			// 	e.preventDefault();

			// 	if ($(this).hasClass('prog-menu-open')) {
			// 		programme_menu_timeline.reverse();
			// 	} else {
			// 		programme_menu_timeline.play();
			// 	}

			// 	$(this).toggleClass('prog-menu-open');

			// });

		} else {

			$(document).find('.menu-programmes').hover(
		        function(e) {
		        	
		        	var div = document.querySelector('.header-center');
					var divOffset = offset(div);
					parseInt(divOffset.left);

		            TweenMax.set($('.programme-overlay'), { left:  parseInt(divOffset.left) * -1 });
		            TweenMax.to($('.programme-overlay'), .5, { autoAlpha: 1 });
		            $('.programme-overlay').css('width', $(window).width());
		            $('body').addClass('menu-open');
		            $('.menu-programmes').addClass('programmes-menu-open');

		            TweenMax.staggerTo('.programme-overlay li', .5, { autoAlpha: 1, delay: .4 }, .05);

		            e.stopPropagation();
			        
		        },
		        function(e) {

		            $('body').removeClass('menu-open');
		            $('.menu-programmes').removeClass('programmes-menu-open');
		            new TimelineMax()
		            		.to($('.programme-overlay'), .2, { autoAlpha: 0 })
		            		.set($('.programme-overlay'), { left: '100%' });

		            TweenMax.to('.programme-overlay li', .2, { autoAlpha: 0 });

		            e.stopPropagation();
		        }
			);



		}

	}


// HOME







function home(){

	if ($('body').hasClass('home')) {


		controller = new ScrollMagic.Controller();
		hero_parallax();

		var home_load = new TimelineMax({paused: true})
			.staggerTo($(document).find('.home-hero .stagger-text-word'), .5, { y: 0, autoAlpha: 1 }, .05, .5)
			.to('.home-hero .cta__circle ellipse', 1, {strokeWidth: '150px'}, .5)
			.to('.home-hero .cta__bg', 1, {scale: 1}, .5)
			.staggerTo($(document).find('.home-hero .fade-in'), .5, { autoAlpha: 1, }, .2, 1)
			// .to($(document).find('div.cc-banner.cc-bottom'), 1, {y: 0}, 5)
			;
		
		home_load.play();
		// TweenMax.staggerTo($(document).find('.home-hero .stagger-text-word'), .5, { y: 0, autoAlpha: 1, delay: .5 }, .05)
		draw_lines.play();


		$(document).on('click', '.home-hero .button--link', function(e){
			e.preventDefault();
			$('html, body').animate({
	            scrollTop: $('.home-content-wrapper').position().top
	        }, 500);
		});

		// PROGRAMME SLIDER

		if (!$('#programme-slider').hasClass('slick-initialized')) {

			$(document).find('#programme-slider').on('init', function(slick){
				programme_slider_img_height();
			});

			$(document).find('#programme-slider').slick({
				infinite: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				prevArrow: '<button type="button" class="slick-arrow slick-prev" tabindex="1"><svg viewBox="0 0 14.01 27.02"><title>Previous</title><polyline points="13.51 0.5 0.5 13.51 13.51 26.52" /></svg></button>',
                nextArrow: '<button type="button" class="slick-arrow slick-next" tabindex="2"><svg viewBox="0 0 14.01 27.02"><title>Next</title><polyline points="0.5 26.52 13.51 13.51 0.5 0.5" /></svg></button>',
				responsive: [
				    {
				      breakpoint: 992,
				      settings: {
				        slidesToShow: 2,
				        arrows: false
				      }
				    },
				    {
				      breakpoint: 768,
				      settings: {
				        slidesToShow: 1,
				        arrows: false
				      }
				    }
				]
			});

			

			$('#programme-slider.slick-slider').on('click', '.slick-slide', function (e) {
		        e.stopPropagation();
		        var index = $(this).data("slick-index");
		        if ($('#programme-slider.slick-slider').slick('slickCurrentSlide') !== index) {
		            $('#programme-slider.slick-slider').slick('slickGoTo', index);
		        }
		    });

		}

		// WINNER SLIDER

		if (!$('#winner-slider').hasClass('slick-initialized')) {

			$(document).find('#winner-slider').on('init', function(slick){
				programme_slider_img_height();
			});

			$(document).find('#winner-slider').slick({
				infinite: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				prevArrow: '<button type="button" class="slick-arrow slick-prev" tabindex="1"><svg viewBox="0 0 14.01 27.02"><title>Previous</title><polyline points="13.51 0.5 0.5 13.51 13.51 26.52" /></svg></button>',
                nextArrow: '<button type="button" class="slick-arrow slick-next" tabindex="2"><svg viewBox="0 0 14.01 27.02"><title>Next</title><polyline points="0.5 26.52 13.51 13.51 0.5 0.5" /></svg></button>',
				responsive: [
				    {
				      breakpoint: 992,
				      settings: {
				        slidesToShow: 2,
				        arrows: false
				      }
				    },
				    {
				      breakpoint: 768,
				      settings: {
				        slidesToShow: 1,
				        arrows: false
				      }
				    }
				]
			});

			

			$('#winner-slider.slick-slider').on('click', '.slick-slide', function (e) {
		        e.stopPropagation();
		        var index = $(this).data("slick-index");
		        if ($('#winner-slider.slick-slider').slick('slickCurrentSlide') !== index) {
		            $('#winner-slider.slick-slider').slick('slickGoTo', index);
		        }
		    });

		}


		// INSTAGRAM SLIDER

		if (!$('#instagram').hasClass('slick-initialized') && $('body').hasClass('home')) {

			var request = new XMLHttpRequest();
			request.open('GET', 'https://api.instagram.com/v1/users/self/media/recent/?access_token=307306882.1677ed0.3bddd38676c442258c21c00610635270&count=9', true);

			request.onload = function(container) {
				if (request.status >= 200 && request.status < 400) {
					// Success!
					var data = JSON.parse(request.responseText);
					for (var i=0; i < data.data.length; i++) {

						var instaContainer = document.getElementById('instagram');
						var imgURL = data.data[i].images.standard_resolution.url;
                        var imgCaption = data.data[i].caption.text;
                        
                        var length = 45;
                        var myString = imgCaption;
                        var imgCaption = myString.substring(0, length) + '...';

						var imgLink = data.data[i].link;

						var instaDiv = document.createElement('div');
					    instaDiv.setAttribute('class', 'instagram__post');
					    instaContainer.appendChild(instaDiv);

					    var a = document.createElement('a');
                        a.setAttribute('href', imgLink)
                        a.setAttribute('target', '_blank')
                        a.setAttribute('class', 'instagram__link');
					    instaDiv.appendChild(a);

					    var img_wrap = document.createElement('span');
					    img_wrap.setAttribute('class', 'img-wrap');
					    a.appendChild(img_wrap);

					    var img = document.createElement('img');
                        img.setAttribute('src', imgURL)
                        img.setAttribute('alt', 'Instagram: '+imgCaption)
                        img.setAttribute('class', 'instagram__image');
					    img_wrap.appendChild(img);

					    var cap = document.createElement('div');
					    cap.setAttribute('class', 'instagram__caption');
					    cap.innerHTML = imgCaption;
					    instaDiv.appendChild(cap);

					    var icon = document.createElement('i');
					    icon.setAttribute('class', 'instagram__icon fab fa-instagram');
					    img_wrap.appendChild(icon);
					}

					// Instgram Slider --------------------------

					$(document).find('#instagram').slick({
						infinite: false,
						slidesToShow: 4,
						slidesToScroll: 1,
						prevArrow: '<button type="button" class="slick-arrow slick-prev"><svg viewBox="0 0 14.01 27.02"><title>Previous</title><polyline points="13.51 0.5 0.5 13.51 13.51 26.52" /></svg></button>',
						nextArrow: '<button type="button" class="slick-arrow slick-next"><svg viewBox="0 0 14.01 27.02"><title>Next</title><polyline points="0.5 26.52 13.51 13.51 0.5 0.5" /></svg></button>',
						responsive: [
						    {
						    	breakpoint: 992,
						    	settings: {
						    	  slidesToShow: 2,
						    	  slidesToScroll: 1,
						    	  dots: false,
						    	  arrows: false
						    	}
						    },
						    {
						    	breakpoint: 600,
						    	settings: {
						    	  slidesToShow: 1,
						    	  slidesToScroll: 1,
						    	  dots: false,
						    	  arrows: false
						    	}
						    }
						]
					});

					$(document).find('#instagram').on('afterChange', function(slick, currentSlide){
						$('.slide-no').html(minTwoDigits($(document).find('#instagram .slick-active').data('slick-index') + 1));
					});

					// Add html for no of slides
					$(document).find('#instagram').prepend('<div class="no-of-slides"><span class="slide-no"></span> / <span class="slide-no-out-of"></span></div>');
					// Count how many slides
					$(document).find('.slide-no-out-of').html(minTwoDigits($(document).find('#instagram').find('.slick-slide').length));
					// No of current slide
					$(document).find('.slide-no').html(minTwoDigits($(document).find('.slick-active').data('slick-index') + 1));

					img_reveal();

					
				  
				} else {

				}
			};
			request.onerror = function() {
			  // There was a connection error of some sort
			};
			request.send();

		}


		// PARTNERS SLIDER

		var partners_slider = $('.partners-slider');
		if (win.width() >= 576) {

			if (!partners_slider.hasClass('slick-initialized')) {

				$(document).find('.partners-slider')
				.on('init', function(event, slick, direction) {
					MorphSVGPlugin.convertToPath("polyline, polygon, rect");
				})
				.slick({
					infinite: true,
					slidesToShow: 3,
					slidesToScroll: 3,
					prevArrow: '<button type="button" class="slick-arrow slick-prev"><svg viewBox="0 0 14.01 27.02"><title>Previous</title><polyline points="13.51 0.5 0.5 13.51 13.51 26.52" /></svg></button>',
					nextArrow: '<button type="button" class="slick-arrow slick-next"><svg viewBox="0 0 14.01 27.02"><title>Next</title><polyline points="0.5 26.52 13.51 13.51 0.5 0.5" /></svg></button>',
				});

			}

		} else {

			if (partners_slider.hasClass('slick-initialized')) {
				partners_slider.slick('unslick');
			}

		}


		// LATEST POST SLIDER
		
		if (win.width() < 992) {

			if (!$('.latest-slider').length) {

				$('.latest-post').wrapAll('<div class="latest-slider col-12"></div>');

				$(document).find('.latest-slider').slick({
					infinite: false,
					arrows: false,
					slidesToShow: 1,
					slidesToScroll: 1,
				});

			}

		} else {

			if ($('.latest-slider').hasClass('slick-initialized')) {

				$('.latest-slider').slick('unslick');
				$('.latest-post').unwrap();

			}
		}

	}

}

function programme_slider_img_height() {
	var ti_w = $('.programme-slider__image img').width();
	$('.programme-slider__image img').css('height', ti_w + 50);
}

// Common SLIDER

		if (!$('.common-slider').hasClass('slick-initialized')) {
		

			$(document).find('.common-slider').slick({
				infinite: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				prevArrow: '<button type="button" class="slick-arrow slick-prev" tabindex="1"><svg viewBox="0 0 14.01 27.02"><title>Previous</title><polyline points="13.51 0.5 0.5 13.51 13.51 26.52" /></svg></button>',
                nextArrow: '<button type="button" class="slick-arrow slick-next" tabindex="2"><svg viewBox="0 0 14.01 27.02"><title>Next</title><polyline points="0.5 26.52 13.51 13.51 0.5 0.5" /></svg></button>',
				responsive: [
				    {
				      breakpoint: 992,
				      settings: {
				        slidesToShow: 2,
				        arrows: false
				      }
				    },
				    {
				      breakpoint: 768,
				      settings: {
				        slidesToShow: 1,
				        arrows: false
				      }
				    }
				]
			});

			

			$('.common-slider.slick-slider').on('click', '.slick-slide', function (e) {
		        e.stopPropagation();
		        var index = $(this).data("slick-index");
		        if ($('.common-slider.slick-slider').slick('slickCurrentSlide') !== index) {
		            $('.common-slider.slick-slider').slick('slickGoTo', index);
		        }
		    });

		}

// ABOUT

function about() {

	if ($('body').hasClass('page-template-template-about')) {


		$(document).on('click', '.about_header__text .button--link', function(e){
			e.preventDefault();
			$('html, body').animate({
	            scrollTop: $('#about-testimonial .testimonial').position().top
	        }, 500);
		});

		controller = new ScrollMagic.Controller();

		// PINNED IMAGES

		if ($(window).width() > 992) {

			$('.content_block__image').each(function(){

				var myScene = new ScrollMagic.Scene({
			        triggerElement: this,
			        duration: $(this).closest('.row').height() - $(this).height(),
			        triggerHook: 0,
			        loglevel: 0
			    })
			    .setPin(this)
			    // .addIndicators()
		        .addTo(controller);

			});

		} else {
			// Remove controller

		}

		// TIMELINE SLIDER

		$(document).find('#timeline').not('.slick-initialized')
		.on('init', function(slick){
			timeline_img_height();
			var $yr = $('.timeline__post').first().attr('data-year');
			$(this).prepend('<span class="timeline__number d-none d-lg-block">'+$yr+'</span>');
			MorphSVGPlugin.convertToPath("polyline, polygon, rect");
		})
		.slick({
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			draggable: true,
			prevArrow: '<button type="button" class="slick-arrow slick-prev"><svg viewBox="0 0 14.01 27.02"><polyline points="13.51 0.5 0.5 13.51 13.51 26.52" /></svg></button>',
			nextArrow: '<button type="button" class="slick-arrow slick-next"><svg viewBox="0 0 14.01 27.02"><polyline points="0.5 26.52 13.51 13.51 0.5 0.5" /></svg></button>',
			responsive: [
			    {
			      breakpoint: 992,
			      settings: {
			        slidesToShow: 2,
			        draggable: true,
			        arrows: false
			      }
			    }
			    ,{
			      breakpoint: 768,
			      settings: {
			        slidesToShow: 1,
			        draggable: true,
			        arrows: false
			      }
			    }
			]
		})
		.on('beforeChange', function(slick, currentSlide, nextSlide){
			// $(document).find('.timeline__post.active .timeline__viewmore').trigger('click');
			// e.stopImmediatePropagation();
			// return false;
		})
		.on('afterChange', function(slick, currentSlide){
			var $yr = $('.slick-current').find('.timeline__post').attr('data-year');
			$('.timeline__number').html($yr);
		});

		$('#timeline.slick-slider').on('click', '.timeline__image', function (e) {
	        e.stopPropagation();
	        var index = $(this).closest('.slick-slide').data("slick-index");
	        if ($('#timeline.slick-slider').slick('slickCurrentSlide') !== index) {
	            $('#timeline.slick-slider').slick('slickGoTo', index);
	        }
	    });

		$(document).on('click', '.timeline__viewmore', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();

			

			var goto = $(this).closest('.slick-slide').attr('data-slick-index');

			$('#timeline').slick('slickGoTo', goto);


			if ($(this).closest('.timeline__post').hasClass('active')) {

				$(this).closest('.timeline__post').removeClass('active');

				$(this).html('View more <svg viewBox="0 0 10.4 5.56"><polyline class="a" points="0.18 0.18 5.2 5.2 10.23 0.18" /></svg>');
				MorphSVGPlugin.convertToPath("polyline, polygon, rect");

				$(document).find('#timeline').css('padding-bottom', '0');
				$(this).siblings('.timeline__main').fadeToggle(400, function(){
					$(this).css('position', 'static');
				});
				$(document).find('.slick-slide').css('opacity', '').css('pointer-events', 'initial');

				$('#timeline').slick('slickSetOption', 'draggable', true, true);

			} else {

				$(document).find('.timeline__post').removeClass('active');
				$(this).closest('.timeline__post').addClass('active');

				$(document).find('.timeline__viewmore').html('View more <svg viewBox="0 0 10.4 5.56"><polyline class="a" points="0.18 0.18 5.2 5.2 10.23 0.18" /></svg>');
				$(this).html('View less <svg viewBox="0 0 10.4 5.56"><polyline class="a" points="10.23 5.38 5.2 0.35 0.18 5.38" /></svg>');
				MorphSVGPlugin.convertToPath("polyline, polygon, rect");

				var tm_h = $(this).siblings('.timeline__main').height();

				$(this).siblings('.timeline__main').css('position', 'absolute').fadeToggle();
				$(document).find('#timeline').css('padding-bottom', tm_h);

				$(this).closest('.slick-slide').css('opacity', '1').siblings().css('opacity', '.3').css('pointer-events', 'none');

				$('#timeline').slick('slickSetOption', 'draggable', false, true);

			}

		});

		$(document).on('click', '#timeline .slick-arrow', function(){
			$(document).find('.timeline__post.active .timeline__viewmore').trigger('click');
		});

		$(window).on('resize', _.debounce(timeline_img_height, 150));

		function timeline_img_height() {
			var ti_w = $('.timeline__image img').width();
			$('.timeline__image img').css('height', ti_w + 50);
		}

	}

}

// TEAM

function team() {

	$(document).on('click', '.team-links a', function(e){
		e.preventDefault();
		var href = $(this).attr('data-link');
		$('html, body').animate({
			scrollTop: $(document).find('div[id="'+href+'"]').position().top + $('header').height()
		});
	});

}

// SUPPORTED BUSINESS

function supported_business() {

	if (!$('.sb-gallery').hasClass('slick-initialized')) {

		$(document).find('.sb-gallery').slick({
			centerMode: true,
			centerPadding: '40px',
			slidesToShow: 1,
			slidesToScroll: 1,
			mobileFirst: true,
			prevArrow: '<button type="button" class="slick-arrow slick-prev"><svg viewBox="0 0 14.01 27.02"><polyline points="13.51 0.5 0.5 13.51 13.51 26.52" /></svg></button>',
			nextArrow: '<button type="button" class="slick-arrow slick-next"><svg viewBox="0 0 14.01 27.02"><polyline points="0.5 26.52 13.51 13.51 0.5 0.5" /></svg></button>',
			responsive: [
		    {
		      breakpoint: 480,
		      settings: {
		        centerPadding: '40px',
		      }
		    },
		    {
		      breakpoint: 992,
		      settings: {
		        centerPadding: '100px',
		      }
		    },
		    {
		      breakpoint: 1300,
		      settings: {
		        centerPadding: '150px',
		      }
		    },
		    {
		      breakpoint: 1600,
		      settings: {
		        centerPadding: '200px',
		      }
		    },
		    {
		      breakpoint: 1900,
		      settings: {
		        centerPadding: '300px',
		      }
		    }
		  ]
		});

		$(document).find('.sb-gallery').on('afterChange', function(slick, currentSlide){
			$(document).find('.sb-gallery__counter--current').html(minTwoDigits($(document).find('.slick-active').data('slick-index') + 1));
		});

		// Add html for no of slides
		$(document).find('.sb-gallery').after('<div class="sb-gallery__counter my-8"><span class="sb-gallery__counter--current"></span> / <span class="sb-gallery__counter--total"></span></div>');
		// Count how many slides
		$(document).find('.sb-gallery__counter--total').html(minTwoDigits($(document).find('.sb-gallery').find('.slick-slide:not(.slick-cloned)').length));
		// No of current slide
		$(document).find('.sb-gallery__counter--current').html(minTwoDigits($(document).find('.slick-active').data('slick-index') + 1));

	}

}

function programme() {

	if (!$('.success-stories').hasClass('slick-initialized')) {


		$(document).find('.success-stories')
		.on('init', function(event, slick, direction) {
			MorphSVGPlugin.convertToPath("polyline, polygon, rect");
		})
		.slick({
			fade: true,
			prevArrow: '<button type="button" class="slick-arrow slick-prev"><svg viewBox="0 0 14.01 27.02"><polyline points="13.51 0.5 0.5 13.51 13.51 26.52" /></svg></button>',
			nextArrow: '<button type="button" class="slick-arrow slick-next"><svg viewBox="0 0 14.01 27.02"><polyline points="0.5 26.52 13.51 13.51 0.5 0.5" /></svg></button>'
		});

	}

}

function faq() {

	// ACCORDIONS

	$(document).on('click', 'details summary', function(){
		TweenLite.to($(this).find('#down-arrow'), .3, {morphSVG:"#up-arrow"});
	});

	$(document).on('click', 'details[open] summary', function(){
		TweenLite.to($(this).find('#down-arrow'), .3, {morphSVG:"#down-arrow"});
	});

}


function cta(){

	if ($('.cta').length) {


		if (win.width() >= 992) {
			$('.cta').css('height', win.height());
		} else {
			$('.cta').css('height', win.width());
		}


		var cta_animation = new TimelineMax()
		.to('.cta__line--horizontal', 1, {width: '100%'}, 0)
		.to('.cta__line--vertical', 1, {height: '100%'}, .5)
		.staggerTo($(document).find('.cta .stagger-text-word'), .5, { y: 0, autoAlpha: 1, }, .05, .5)
		.staggerFromTo('.cta .button--link', .75, {y: 70, autoAlpha: 0}, {y: 0, autoAlpha: 1}, 0.1, 1)
		.fromTo('.cta__circle ellipse', 1, {strokeWidth: 0}, {strokeWidth: '150px'}, .5)
		.to('.cta__bg', 1.5, {scale: 1}, 0)
		;

		var cta_scene = new ScrollMagic.Scene({
			triggerElement: '.cta',
			triggerHook: 0.2,
			reverse: false,
			loglevel: 0
		})
		.setTween(cta_animation)
		// .addIndicators()
		.addTo(controller);

	}

}


			

$(document).on('click', 'a[href*="/programmes"]:not(.post-nav), a[href*="/supported-businesses"]:not(.post-nav)', function(){

	$('.programme-hero-wrap').remove();

	var link = $(this).attr('href');
	var $currid = $('body').attr('data-post-id');
    var data = {
         "action": "gethero",
         "id": $currid
    };

	$.post(link, data, function(data){

		$(data).find('.page-hero').each(function(){

        	$('.head-wrap').after('<div class="page-hero-wrap" style="margin-top: '+ $('header').height() * -1 +'px"><div class="container-fluid programme-hero page-hero text-center invert px-0" style="opacity: 0.1;">'+$(this).html()+'</div></div>');

   			TweenMax.fromTo('.page-hero .post-nav i', 5, { autoAlpha: 0 }, { autoAlpha: 1 });

    		hero_load();

        	TweenMax.to($(document).find('.post-nav span'), .5, { autoAlpha: 1, top: '50%', delay: 1});

        	setTimeout(function(){
				hero_lines();
        	}, 1000);

        });


	});

});

win.on('resize', _.debounce(page_hero, 150));

function page_hero() {

    var page_hero = $(document).find('.page-hero, .page-hero-wrap');
    var page_hero_grid = $(document).find('.page-hero__grid');
    var slider_navigation = $(document).find('.slider-navigation');

    if (page_hero.length) {

        win.on('resize', page_hero_height);
        page_hero_height();

        function page_hero_height() {

            if ($(window).outerWidth() >= 992) {

                page_hero.css('height', win.height());
                page_hero_grid.css('height', win.height() - $('header').innerHeight()).css('margin-top', $('header').innerHeight());
                slider_navigation.css('height', win.height() - $('header').innerHeight()).css('margin-top', $('header').innerHeight());

				if ($('body').hasClass('single-programme') || $('body').hasClass('single-supported-business') || $('body').hasClass('invisible-header')) {
	            	$(document).find('.page-hero-wrap').css('margin-top', $('header').outerHeight() * -1);
		        	$(document).find('main').css('margin-top', 0);
	            }

	            if ($('body').hasClass('invisible-header') && $('body').hasClass('home') == false) {
	            	hero_lines();
	            }

            } else {
                page_hero.css('height', page_hero.width());
                page_hero_grid.css('height', page_hero.width()).css('margin-top', '');

                // slider_navigation.css('height', win.height() - $('header').innerHeight());

                if ($('body').hasClass('single-programme') || $('body').hasClass('single-supported-business') || $('body').hasClass('invisible-header')) {
	            	$(document).find('.page-hero, .page-hero-wrap').css('margin-top', 0);
		        	$(document).find('main').css('margin-top', '');
	            }

	            if ($('body').hasClass('invisible-header') && $('body').hasClass('home') == false) {
	            	hero_lines();
	            }

            }

            TweenMax.to('.page-hero', .4, {opacity: 1});

        }


        $(document).on('click', '.page-hero__button', function(e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: win.height()
            }, 500);
        });

        hero_load();

    }

}

function hero_load() {

	if ($('.page-hero').length) {

		$('main').css('margin-top', 0);

		if (!$('body').hasClass('home')) {

			 if ($(window).outerWidth() >= 992) {

				var ph_animation = new TimelineMax()
				.to('.page-hero', 1, {autoAlpha: 1}, 0)
				.to('.page-hero__content', .5, {autoAlpha: 1}, .5)
				.set('.slider-navigation', {height: $(window).height() - $('header').height(), marginTop: $('header').height()})
				.to('.page-hero .current-post-nav i', .5, { autoAlpha: 1 }, .5)
				.to('.page-hero .cta__circle ellipse', 1, {strokeWidth: '150px'}, .5)
				.to('.page-hero .cta__bg', 1, {scale: 1}, .5)
				.to('.page-hero .post-nav i', .5, { autoAlpha: 1 }, 2)
				;

			} else {

				var ph_animation = new TimelineMax()
				.to('.page-hero', 1, {autoAlpha: 1}, 0)
				.to('.page-hero__content', .5, {autoAlpha: 1}, .5)
				// .set('.slider-navigation', {height: $(window).height() - $('header').height(), marginTop: $('header').height()})
				.to('.page-hero .current-post-nav i', .5, { autoAlpha: 1 }, .5)
				.to('.page-hero .cta__circle ellipse', 1, {strokeWidth: '150px'}, .5)
				.to('.page-hero .cta__bg', 1, {scale: 1}, .5)
				.to('.page-hero .post-nav i', .5, { autoAlpha: 1 }, 2)
				;

			}

		}

	}

}
		


function hero_parallax() {

	if ($(document).find(".page-hero-wrap").length) {

		if ($(window).width() > 992) {

			new ScrollMagic.Scene({
				triggerElement: ".page-hero-wrap",
				triggerHook: "onEnter",
				duration: "200%",
				loglevel: 0
			})
			.setTween(".page-hero", {y: "80%", ease: Linear.easeNone})
			// .addIndicators()
			.addTo(controller);

		}

	}

}






function hero_lines() {

	if ($(document).find(".page-hero__grid").length) {

		var h_lines = new TimelineMax()
		.set($(document).find(".page-hero__grid"), {className:"+=draw-line"}, 0.1)
		.set($(document).find(".page-hero__grid > .container .col-6:nth-child(1)"), {className:"+=draw-line"}, 0.1)
		.set($(document).find(".page-hero__grid > .container .col-6:nth-child(2)"), {className:"+=draw-line"}, 0.1)
		.set($(document).find(".page-hero__grid > .container .col-6:nth-child(3)"), {className:"+=draw-line"}, 0.1)
		.set($(document).find(".page-hero__grid > .container .col-6:nth-child(4)"), {className:"+=draw-line"}, 0.1);

		new ScrollMagic.Scene({
				triggerElement: 'body',
				triggerHook: .75,
				reverse: false,
				loglevel: 0
		}).setTween(h_lines)
		// .addIndicators()
		.addTo(controller);

	}

}












function footer() {

	if (controller == null || controller == undefined) {
		controller = new ScrollMagic.Controller();
	}

	new ScrollMagic.Scene({
			triggerElement: 'footer',
			triggerHook: .75,
			reverse: false,
			loglevel: 0
	}).setTween(
		new TimelineMax()
			.set("footer", {className:"+=draw-line"}, 0.1)
			.set(".footer-bottom", {className:"+=draw-line"}, 0.2)
			.set(".footer .col-12:nth-child(2)", {className:"+=draw-line"}, 0.2)
			.set(".footer .col-12:nth-child(3)", {className:"+=draw-line"}, 0.3)
			.set(".footer .col-12:nth-child(4)", {className:"+=draw-line"}, 0.4)
	)
	// .addIndicators()
	.addTo(controller);

}


function img_reveal() {

	if (controller == null || controller == undefined) {
		controller = new ScrollMagic.Controller();
	}

	var time = .01;
	$(document).find('.barba-container .img-wrap').each(function() {

	    new ScrollMagic.Scene({
				triggerElement: this,
				triggerHook: .8,
				reverse: false,
				loglevel: 0
		})
		.setTween(
			new TimelineMax()
				.set(this, {className:"+=reveal-img"}, time)
		)
		// .addIndicators()
		.addTo(controller);

		time += .1;
		if (time > .41) {
			time = .01;
		}
	});

}



function change_next_post_href () {

	$next_link = $(document).find('.post-navigation a:last-child');
	var href = $next_link.attr('href');
	$next_link.attr('href', '#');
	$next_link.attr('data-href', href);

}

$(document).on('click', '.post-navigation a', function(e){
	e.preventDefault();

	$(this).html('Loading').addClass('loading-link');

	var link = $(this).attr('data-href');
	var $currid = $('body').attr('data-post-id');
    var data = {
         "action": "get_necxt_posts",
         "id": $currid
    };
	
	$.post(link, data, function(data){

        $(data).find('.news-posts-container').each(function(){
        	$('.news-posts-container').append($(this).html());
        	TweenMax.to('.news-posts-container', .4, {opacity: 1});
        });

        $(document).find('.loading-link').closest('.post-navigation').remove();

    	img_reveal();

    	change_next_post_href();

    });


});












// Filters --------------------------

$(document).on('click', '.filter:not(.open) .filter__open', function(e){
    e.preventDefault();
	TweenLite.to($(this).find('#down-arrow'), .3, {morphSVG:"#up-arrow"});
	$('.filter').addClass('open');
	$(document).find('.filter__content').show();
	TweenMax.staggerTo('.filter__button', .5, {autoAlpha: 1}, .05);
});

$(document).on('click', '.open .filter__open', function(e){
    e.preventDefault();
	TweenLite.to($(this).find('#down-arrow'), .3, {morphSVG:"#down-arrow"});
	$('.filter').removeClass('open');
	$(document).find('.filter__content').hide();
	TweenMax.staggerTo('.filter__button', .3, {autoAlpha: 0}, .05);
});

var filter_list = [];

$(document).on('click', '.filter-programme .filter__button', function(e){
	e.preventDefault();

	var cat_id = $(this).attr('data-subcat');

	if ($(this).hasClass('active')) {
		
		filter_list = filter_list.filter(function(elem){
		   return elem != cat_id; 
		});

		untick(this);
		
	} else {

		$(this).siblings('a').each(function() {

			var index = filter_list.indexOf($(this).attr('data-subcat'));
			if (index > -1) {
				filter_list.splice(index, 1);
			}

		});

		filter_list.push(cat_id);
		tick(this);
		untick($(this).siblings('a'));
		$(this).siblings('a').removeClass('active');

		
	}

	$('.programme').show();
	$.each(filter_list, function(index, value){
		$('.programme:not([data-tcat*="'+value+'"])').hide();
	});

	$(this).toggleClass('active');

});

	function tick(element) {
		TweenMax.to($(element).find('path'), .5, {drawSVG:"0 100%", ease: Power3.easeIn});
	}

	function untick(element){
		new TimelineLite()
				.to($(element).find('path'), .5, {autoAlpha: 0})
				.set($(element).find('path'), {drawSVG:"100% 100%"})
				.set($(element).find('path'), {autoAlpha: 1});
	}

// News filter

$(document).on('click', '.filter-news .filter__button', function(e){
	e.preventDefault();

	// Change filter button colours and ticks

	if ($(this).hasClass('active')) {
		untick(this);
	} else {
		tick(this);
		untick($(this).siblings());
		$(this).siblings().removeClass('active');
	}

	$(this).toggleClass('active');


	// Hide posts, load new ones and then show

	TweenMax.to('.news-posts-container', .4, {opacity: 0});

	var link = $(this).attr('data-href');
	var $currid = $('body').attr('data-post-id');
    var data = {
         "action": "get_post_cat",
         "id": $currid
    };
	
	$.post(link, data, function(data){

        $(data).find('.news-posts-container').each(function(){
        	$('.news-posts-container').empty().append($(this).html());
        	TweenMax.to('.news-posts-container', .4, {opacity: 1});
        });
    	img_reveal();
    	change_next_post_href();

    });
	
});


// Supported Business filter

$(document).on('click', '.filter-supported .filter__button', function(e){
	e.preventDefault();

	$cat_id = $(this).attr('data-subcat');
	var link;

	if ($(this).hasClass('active')) {

		link = site_url+'/supported-businesses';

		untick(this);

	} else {

		link = $(this).attr('data-href');

		tick(this);

		untick($(this).siblings());
		untick($(this).closest('.filter__category').siblings().find('a'));

		$(this).siblings().removeClass('active');
		$(this).closest('.filter__category').siblings().find('a').removeClass('active');
	}

	$(this).toggleClass('active');

	// Hide posts, load new ones and then show

	TweenMax.to('.sb-wrap', .4, {opacity: 0});

	var $currid = $('body').attr('data-post-id');
    var data = {
         "action": "get_sb_cat",
         "id": $currid
    };

	$.post(link, data, function(data){
        $(data).find('.sb-wrap').each(function(){
        	$('.sb-wrap').empty().append($(this).html());
        	TweenMax.to('.sb-wrap', .4, {opacity: 1});
        });
    	img_reveal();
    });


});


function stagger_words() {

    // $('.stagger-text').each(function(){

    // 	var element = $(this).prop('nodeName').toLowerCase();
    //     var string = $(this).html();
    //     var split = string.split(" ");
    //     var stagger = [];

    //     for (var i = 0; i < split.length; i++) {
    //         split[i] = '<span class="d-inline-block"><span class="stagger-text-word">' + split[i] + '&nbsp;</span></span>';
    //         stagger.push(split[i]);
    //     }

    //     stagger = stagger.toString();
    //     stagger = stagger.replace(/,/g , "");

    //     $(this).replaceWith('<'+element+' class="stagger-text stagger-text-wrap">' + stagger + '</'+element+'>');



    // });
    
    var mySplitText = new SplitText($('.stagger-text'), {type:"words", wordsClass: 'stagger-text-word'});
    $('.stagger-text').addClass('stagger-text-wrap');
    // TweenMax.staggerTo($('.stagger-text > div'), 1, {y: 20}, .2);
}


var width = $(window).width();
win.on('resize', _.debounce(function(){

if($(this).width() != width){
	var window_width = $(window).width();
	arrow_position = $(window).width() - 40;
	MorphSVGPlugin.convertToPath("polyline, polygon, rect");

	programme_menu();


    // Remove controller
    if (controller !== null && controller !== undefined) {
        controller = controller.destroy(true);
        controller = null;
    }

	home();
	about();
	programme_slider_img_height();

	if (window_width < 992) {
		$('.sub-menu').css('left', $(window).width());
	}

	sub_menu();



	cta();
	footer();
	img_reveal();

	if ($('.search-icon').hasClass('active')) {

		TweenMax.to($('.search-overlay'), .4, {autoAlpha: 0});

		$('.search-icon').removeClass('active');
		$('body').removeClass('search-open');

		TweenLite.to($('.search-icon path:first-child'), .3, {morphSVG:"#search-open"});
	}

    w = $(window).width();

	if ($('body').hasClass('menu-open')) {
		$('.burger').trigger('click');
	}

	width = $(this).width();
}
  
}, 150));


Barba.Pjax.init();
Barba.Prefetch.init();

init();

function init() {

	controller = new ScrollMagic.Controller();
	MorphSVGPlugin.convertToPath("polyline, polygon, rect");
	TweenMax.set('.filter__button path', {drawSVG:"100% 100%"});
	var arrow_position = $(window).width() - 40;


    stagger_words();
    sub_menu();
	programme_menu();

	home();
	
	about();
	team();
	faq();
	programme();
	supported_business();

	cta();
	page_hero();

	footer();
	img_reveal();

	change_next_post_href();

	var expiryDate = new Date();
	expiryDate.setMonth(expiryDate.getMonth() + 1);
	document.cookie = "cfe_first=true; expires="+expiryDate;

}


$(document).on('click', '.prev-post-nav', function(){

$('.wrapper').addClass('changing-posts');

	new TimelineMax()
		.to($(document).find('.post-nav span'), .4, { autoAlpha: 0 })
		.set($(document).find('.post-nav span'), { top: '80%' })
		;

	var link = $(this).attr('href');
	var $currid = $('body').attr('data-post-id');
    var data = {
         "action": "getprev",
         "id": $currid
    };

    var this_element = this;

	$('.next-post-nav').remove();
	$('.current-post-nav').removeClass('current-post-nav').addClass('next-post-nav');
	$(this_element).removeClass('prev-post-nav').addClass('current-post-nav');
	$('.current-post-nav').after('<a href="" class="prev-post-nav post-nav h1 off-screen"></a>');

	var page_slider_prev = new TimelineMax()
		.set($('.post-nav span'), { autoAlpha: 0 })
		.to('.current-bg', 2, { autoAlpha: 0 }, 0)
		.to('.prev-bg', 2, { autoAlpha: 1 }, 0)
		.to('.page-hero .cta__circle ellipse', 1, {strokeWidth: '0px'}, 0)
		.to('.slider-bg-fade', 1, { opacity: .8 }, 0)

		.to('.page-hero .cta__circle ellipse', 1, {strokeWidth: '150px'}, 1)
		.to('.slider-bg-fade', 1, { opacity: .2 }, 1)
		.add( function(){

			$('.current-bg').attr('style', $('.prev-bg').attr('style'));

			$.post(link, data, function(data){

		        $(data).find('.prev-post-nav').each(function(){
		        	$('.prev-post-nav').attr('href', $(this).attr('href')).append($(this).html()).removeClass('off-screen');
		        });
		        $(data).find('.prev-bg').each(function(){
		        	$('.prev-bg').attr('style', $(this).attr('style'));
		        });
		        $(data).find('.next-bg').each(function(){
		        	$('.next-bg').attr('style', $(this).attr('style'));
		        });

				$('.wrapper').removeClass('changing-posts');

		    });



		})
		.to('.current-bg', .2, { autoAlpha: 1 }, 3)
		.to('.prev-bg', .2, { autoAlpha: 0 }, 4)
		.to($(document).find('.post-nav span'), .5, { autoAlpha: 1, top: '50%' }, 2.5)
		;


});

$(document).on('click', '.next-post-nav', function(){

	$('.wrapper').addClass('changing-posts');

	new TimelineMax()
		.to($(document).find('.post-nav span'), .4, { autoAlpha: 0 })
		.set($(document).find('.post-nav span'), { top: '80%' })
		;

	var link = $(this).attr('href');
	var currid = $('body').attr('data-post-id');
    var data = {
        "action": "getnext",
        "id": currid
    };

    var this_element = this;

	$('.prev-post-nav').remove();
	$('.current-post-nav').removeClass('current-post-nav').addClass('prev-post-nav');
	$(this_element).removeClass('next-post-nav').addClass('current-post-nav');
	$('.current-post-nav').after('<a href="" class="next-post-nav post-nav h1 off-screen"></a>');

	var page_slider_bg_next = new TimelineMax()
		.set($('.post-nav span'), { autoAlpha: 0 })
		.to('.current-bg', 2, { autoAlpha: 0 }, 0)
		.to('.next-bg', 2, { autoAlpha: 1 }, 0)
		.to('.page-hero .cta__circle ellipse', 1, {strokeWidth: '0px'}, 0)
		.to('.page-hero .cta__circle ellipse', 1, {strokeWidth: '150px'}, 1)
		.to('.slider-bg-fade', 1, { opacity: .8 }, 0)
		.to('.slider-bg-fade', 1, { opacity: .2 }, 1)
		.add( function(){

			$('.current-bg').attr('style', $('.next-bg').attr('style'));

			$.post(link, data, function(data){

		        $(data).find('.next-post-nav').each(function(){
		        	$('.next-post-nav').attr('href', $(this).attr('href')).append($(this).html()).removeClass('off-screen');
		        });
		        $(data).find('.next-bg').each(function(){
		        	$('.next-bg').attr('style', $(this).attr('style'));
		        });
		        $(data).find('.prev-bg').each(function(){
		        	$('.prev-bg').attr('style', $(this).attr('style'));
		        });

		        $('.wrapper').removeClass('changing-posts');

		    });

		} )
		.to('.current-bg', .2, { autoAlpha: 1 }, 3)
		.to('.next-bg', .2, { autoAlpha: 0 }, 4)
		.to($(document).find('.post-nav span'), .5, { autoAlpha: 1, top: '50%' }, 2.5)
		;

});


$(document).on('click', '.current-post-nav', function(e){
	e.preventDefault();
	var win_height = $(window).height();
	$('body, html').animate({
		scrollTop: win_height
	});
});


var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
        Promise
            .all([this.newContainerLoading, this.fadeOut()])
            .then(this.fadeIn.bind(this));
    },
    fadeOut: function() {

        if ($(document).find('.slick-initialized:not(.hero-slider__text, .hero-slider__images)').length) {
            $(document).find('.slick-initialized:not(.hero-slider__text, .hero-slider__images)').fadeOut(400, function() {
                $(document).find('.slick-initialized:not(.hero-slider__text, .hero-slider__images)').slick('unslick');
            });
        }

        $('body').addClass('page-loading');

		TweenMax.to($('.menu-about > .sub-menu'), .3, { autoAlpha: 0 });
        TweenMax.to($('.programme-overlay'), .3, { autoAlpha: 0 });
        $('.menu-about').removeClass('about-menu-open');
        $('.menu-programmes').removeClass('programmes-menu-open');
        if ($('body').hasClass('menu-open')) {
			$(document).find('.burger').trigger('click');
    		$('body').removeClass('menu-open');
		}


        return $(this.oldContainer).animate({
        	opacity: 0
        }).promise();

    },

    fadeIn: function() {

        var _this = this;
        var $el = $(this.newContainer);
        $(this.oldContainer).hide();

        // Remove controller
        if (controller !== null && controller !== undefined) {
            controller = controller.destroy(true);
            controller = null;
        }

        $('html, body').animate({
            scrollTop: 0
        }, 0, function(){

	    	$el.css({
	            visibility: 'visible',
	            opacity: 0
	        });

	       // TweenMax.to($('.menu-about > .sub-menu'), .3, { autoAlpha: 1});

	        if ($('body').hasClass('invisible-header')) {
	        	if ($('body').hasClass('single-programme') || $('body').hasClass('single-supported-business')) {
	        		$(document).find('.page-hero-wrap').css('margin-top', $('header').outerHeight() * -1);
	        		$('main').css('margin-top', '');
	        	} else {
	        		$('main').css('margin-top', $('header').outerHeight() * -1);
	        	}
	        } else {
	        	$('main').css('margin-top', '');
	        	$(document).find('.page-hero').css('margin-top', '');
	        }
        	
        });

        $el.animate({ opacity: 1 }, 400, function() {
            _this.done();

            MorphSVGPlugin.convertToPath("polyline, polygon, rect");

            init();

        });

    }
});

// Decide which transition to use
Barba.Pjax.getTransition = function() {

    // Get slugs
    var newPage = Barba.HistoryManager.currentStatus().url.split('/').pop();
    var prevPage = Barba.HistoryManager.prevStatus().url.split('/').pop();

    var transition = FadeTransition;

    return transition;
};

// Get body for new page
Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
    var response = newPageRawHTML.replace(/(<\/?)body( .+?)?>/gi, '$1notbody$2>', newPageRawHTML)
    var bodyClasses = $(response).filter('notbody').attr('class')
    $('body').attr('class', bodyClasses);

});

Barba.Pjax.start();


}(jQuery));