import { Component, OnInit } from '@angular/core';
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { Gof3rUtil } from "../util/gof3r-util";
import { EventSubscribeService } from "../services/instance.service";
import { ActivatedRoute, Params,Router } from "@angular/router";
declare var $: any
@Component({
    selector: 'header-checkout',
    templateUrl: 'header-checkout.component.html'
})

export class HeaderCheckOutComponent implements OnInit {
    constructor(private _gof3rUtil: Gof3rUtil,private _route:Router,private _instanceService: EventSubscribeService) { }
    isUserLogin: boolean = false;
    isLogin: string = "LOG IN";
    userNameLogOut: string = ""
    customerInfoMain: CustomerInfoMainModel;

    ngOnInit() {
        this.checkLoginUser()
        this.initJQuery()
     }
     initJQuery() {
        $('.header-top').append('<div class="login-overlay"></div>');
        $('.login-wrap .login').on('click', function (event) {
            
            event.preventDefault();
            $('.login-dropdown').hide();
            $('.login-dropdown-step2').hide();
            $('.login-dropdown-step3').hide();
            $('.login-dropdown-had').hide();
            $('.login-overlay').removeClass('show');
            $('.login-wrap .login').not(this).removeClass('hide-form');

            if ($(this).hasClass('hide-form')) {
                $(this).parents('.login-wrap').find('.login-dropdown').hide();
                $(this).removeClass('hide-form');
                $('body').css({
                    overflow: '',
                    height: ''
                });;
            } else {
              

                        $(this).parents('.login-wrap').find('.login-dropdown-had').slideDown();

                 

                $('.login-overlay').addClass('show');
                $(this).addClass('hide-form');
                $('body').css({
                    overflow: 'hidden',
                    height: '100%'
                });;


            }
        });
        $('.btn-change-address').on('click', function (event) {
            $(this).parents('.login-wrap').find('.login-dropdown').hide();
            $(this).parents('.login-wrap').find('.login-dropdown-step3').slideDown();
        });
        $('.login-overlay').on('click', function (event) {
            event.preventDefault();
            $('.login-dropdown').hide();
            $('.login-dropdown-step2').hide();
            $('.login-dropdown-step3').hide();
            $('.login-overlay').removeClass('show');
            $('.login-wrap .login').removeClass('hide-form');
            $('body').css({
                overflow: '',
                height: ''
            });;
        });
        $('.deli-list .deli').on('click', function (event) {
            event.preventDefault();
            $('.how-top .login-dropdown').show();
            if (!$('.how-top .close-how').length) {
                $('.how-top .login-dropdown').append('<div class="close-how"><span></span></div>');
            }
            $('.how-top .login-dropdown').addClass('show-mobile');

            $('.close-how').on('click', function (event) {
                event.preventDefault();
                $('.how-top .login-dropdown').hide();
            });
        });

        $('.deli-list .asap').on('click', function (event) {
            event.preventDefault();
            $('.when-top .login-dropdown').show();
            if (!$('.when-top .close-how').length) {
                $('.when-top .login-dropdown').append('<div class="close-how"><span></span></div>');
            }
            $('.when-top .login-dropdown').addClass('show-mobile');

            $('.close-how').on('click', function (event) {
                event.preventDefault();
                $('.when-top .login-dropdown').hide();
            });
        });

        $('.deli-list .yourlocal').on('click', function (event) {
            event.preventDefault();
            $('.acc-top .select-location').show();
            if (!$('.acc-top .close-how').length) {
                $('.acc-top .select-location').append('<div class="close-how"><span></span></div>');
            }
            $('.acc-top .select-location').addClass('show-mobile');

            $('.close-how').on('click', function (event) {
                event.preventDefault();
                $('.acc-top .select-location').hide();
            });
        });


        $('.page-active').on('click', function (event) {
            event.preventDefault();
            if ($(this).hasClass('hide-sidebar')) {
                $('.sidebar-mobile').slideUp();
                $(this).removeClass('hide-sidebar');
            } else {
                $('.sidebar-mobile').slideDown();
                $(this).addClass('hide-sidebar');
            }
        });

        if ($(".nano").length) {
            $(".nano").nanoScroller();
            $('.tracker-tab-wrap .nav-tabs .nav-link').on('click', function (event) {
                setTimeout(function () {
                    $("body .nano").nanoScroller();
                }, 1000);
            });
        }
        // $("#enter-new-address").on("keydown", function (event) {
        //     if (event.which == 13) {
        //         $(this).parents('.login-wrap').find('.login-dropdown-step3').slideDown();
        //         $(this).parents('.login-wrap').find('.login-dropdown-step2').hidden();
        //     }

        // });
    }
    checkLoginUser() {
        if (localStorage.getItem("cus") != null) {
            this.customerInfoMain = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("cus")));
            this.isLogin = this.customerInfoMain.CustomerInfo[0].CustomerName
            this.userNameLogOut = this.customerInfoMain.CustomerInfo[0].UserName;
            this.isUserLogin = true;

        }
        else {
            console.log('null')
            this.isUserLogin = false;
        }
    }
   accountClick(){
       
        this._instanceService.sendCustomEvent("MyProfile");
        this._route.navigateByUrl("/account")
        ///this.router.navigate(["/account"])
    }
    orderHistoryClick(){
        this._instanceService.sendCustomEvent("OrderHistory");
        this._route.navigateByUrl("/order-history")
    }
    inviteFriend(){
        this._instanceService.sendCustomEvent("Invite");
        this._route.navigateByUrl("/invite");
    }
    help(){
        this._instanceService.sendCustomEvent("Help");
        this._route.navigateByUrl("/help");
    }
}