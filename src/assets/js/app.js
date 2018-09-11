jQuery(document).ready(function($) {
    // Login dropdown
    // $('.header-top').append('<div class="login-overlay"></div>');
    // $('.login-wrap .login').on('click', function(event) {
    //     event.preventDefault();
    //     $('.login-dropdown').hide();
    //     $('.login-overlay').removeClass('show');
    //     $('.login-wrap .login').not(this).removeClass('hide-form');

    //     if ($(this).hasClass('hide-form')) {
    //         $(this).parents('.login-wrap').find('.login-dropdown').hide();
    //         $(this).removeClass('hide-form');
    //         $('body').css({
    //             overflow: '',
    //             height: ''
    //         });;
    //     } else {
    //         $(this).parents('.login-wrap').find('.login-dropdown').slideDown();
    //         $('.login-overlay').addClass('show');
    //         $(this).addClass('hide-form');
    //         $('body').css({
    //             overflow: 'hidden',
    //             height: '100%'
    //         });;
    //     }
    // });
    // $('.login-overlay').on('click', function(event) {
    //     event.preventDefault();
    //     $('.login-dropdown').hide();
    //     $('.login-overlay').removeClass('show');
    //     $('.login-wrap .login').removeClass('hide-form');
    //     $('body').css({
    //         overflow: '',
    //         height: ''
    //     });;
    // });

    // $('.loginform-dropdown .sign-up a').on('click', function(event) {
    //     event.preventDefault();
    //     $('.signup-dropdown').fadeIn();
    //     $('.loginform-dropdown').hide();
    // });
    // $('.back-login').on('click', function(event) {
    //     event.preventDefault();
    //     $('.signup-dropdown').hide();
    //     $('.loginform-dropdown').fadeIn();
    // });


    // // dropdown mobile
    // $('.deli-list .deli').on('click', function(event) {
    //     event.preventDefault();
    //     $('.how-top .login-dropdown').show();
    //     if (!$('.how-top .close-how').length) {
    //         $('.how-top .login-dropdown').append('<div class="close-how"><span></span></div>');
    //     }
    //     $('.how-top .login-dropdown').addClass('show-mobile');

    //     $('.close-how').on('click', function(event) {
    //         event.preventDefault();
    //         $('.how-top .login-dropdown').hide();
    //     });
    // });

    // $('.deli-list .asap').on('click', function(event) {
    //     event.preventDefault();
    //     $('.when-top .login-dropdown').show();
    //     if (!$('.when-top .close-how').length) {
    //         $('.when-top .login-dropdown').append('<div class="close-how"><span></span></div>');
    //     }
    //     $('.when-top .login-dropdown').addClass('show-mobile');

    //     $('.close-how').on('click', function(event) {
    //         event.preventDefault();
    //         $('.when-top .login-dropdown').hide();
    //     });
    // });

    // $('.deli-list .yourlocal').on('click', function(event) {
    //     event.preventDefault();
    //     $('.acc-top .show-location').show();
    //     if (!$('.acc-top .close-how').length) {
    //         $('.acc-top .select-location').append('<div class="close-how"><span></span></div>');
    //     }
    //     $('.acc-top .select-location').addClass('show-mobile');

    //     $('.close-how').on('click', function(event) {
    //         event.preventDefault();
    //         $('.acc-top .select-location').hide();
    //     });
    // });

    // // $('.btn-close-address').on('click', function(event) {
    // //     event.preventDefault();
    // //     $('.acc-top .login').removeClass('hide-form');
    // //     $('.acc-top .login-dropdown').hide();
    // //     $('.login-overlay').removeClass('show');
    // // });

    // // $('.btn-change-address').on('click', function(event) {
    // //     event.preventDefault();
    // //     $('.show-change-address').show();
    // //     $('.show-location').hide();
    // // });
    // // $('.show-change-address .title .enter').on('click', function(event) {
    // //     event.preventDefault();
    // //     $('.show-change-address').hide();
    // //     $('.show-location').show();
    // // });

    // // map-svg
    // $('.map-svg svg g').on('click', function(event) {
    //     event.preventDefault();
    //     var idPath = this.id;
    //     $('.map-svg svg g').removeClass('active');
    //     $(this).addClass('active');
    //     mapContent = $('#mapContent_'+idPath);
    //     $('.map-list').hide();
    //     mapContent.fadeIn();
    // });
    
    // // sidebar mobile
    // $('.page-active').on('click', function(event) {
    //     event.preventDefault();
    //     if ($(this).hasClass('hide-sidebar')) {
    //         $('.sidebar-mobile').slideUp();
    //         $(this).removeClass('hide-sidebar');
    //     } else {
    //         $('.sidebar-mobile').slideDown();
    //         $(this).addClass('hide-sidebar');
    //     }
    // });

    // // scroller
    // if ($(".nano").length) {
    //     $(".nano").nanoScroller();
    //     $('.tracker-tab-wrap .nav-tabs .nav-link').on('click', function(event) {
    //         setTimeout(function () {
    //             $("body .nano").nanoScroller();
    //         }, 1000);
    //     });
    // }

    // // form order search
    // $('.btn-search-order').on('click', function(event) {
    //     event.preventDefault();
    //     $('.form-search-order').addClass('active');
    //     $('.form-search-order input').focus();
    // });
    // $('.close-search-order').on('click', function(event) {
    //     event.preventDefault();
    //     $('.form-search-order').removeClass('active');
    // });
});