import { Component, OnInit, enableProdMode } from '@angular/core';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { ViewChild, ElementRef, NgZone } from '@angular/core'
import { FormControl, NgModel } from '@angular/forms';
import { HomeService } from "../services/home.service";
import { Gof3rUtil } from "../util/gof3r-util";
import { RegisterCustomerDevice } from "../models/RegisterCustomerDevice";
import { RegisterDeviceRequest } from "../models-request/register-device-request";
import { GetInitParamRequest } from "../models-request/get-init-param-request";
import { RequestNull } from "../models-request/request-null";
import { GetInitialParams } from "../models/GetInitialParams";
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { GetAllOutletListV2Request } from "../models-request/get-all-outlet-list-v2"
import { GetAllOutletListV2Model } from "../models/GetAllOutletListV2";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { SearchUserByEmailOrPhoneModel } from "../models-request/search-user-by-email-phone";
import { SearchUserByEmailOrPhone } from "../models/SearchUserByEmailOrPhone";
import { CheckLogonRequest } from "../models-request/check-logon";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { RequestLogOutModel } from "../models-request/request-log-out-customer";
import { InputOTPModel } from "../models/InputOTP";
import { RequestRegisterCustomerModel } from "../models-request/request-register-customer";
import { SingUpModel } from "../models/SignUp";
import { RequestRegisterOTP } from "../models-request/request-register-otp";
import { ResponseModel } from "../models/Response";
import { AddressListModel } from "../models/AddressList";
import { AddressIteModel } from "../models/AddressItem";
import { AddeliveryAddressModel } from "../models-request/add-delivery-address";
import { ListDeliveryAddress } from "../models/ListDeliveryAddress";
import { Gof3rModule } from "../util/gof3r-module";
import { EventSubscribeService } from "../services/instance.service";
import { AutoCompleteService } from 'ng4-auto-complete';
import { CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent } from "ng-auto-complete";
import { ErrorModel } from "../models/Error";
import { MapLocation } from "../models/MapLocation";
import { Area } from "../models/Area";
import { ParseOutletListArea1 } from "../models/ParseOutletListArea1";
import { OutletListArea } from "../models/OutletListArea";
import { DeviceDetectorService } from 'ngx-device-detector';
import {
    AuthService,
    FacebookLoginProvider,
    GoogleLoginProvider
} from 'angular5-social-login';
import { SocialUser } from "angular4-social-login";
import { GetCurrentSystemTimeRequest } from "../models-request/get-current-system-time";
import * as moment_ from 'moment';
import { Window } from 'selenium-webdriver';

declare var $: any;
const ORDER_DELIVERY = "DELIVERY"
const ORDER_PICKUP = "PICKUP";
@Component({
    selector: 'gof3r-home',
    templateUrl: 'gof3r-home.component.html'
})

export class Gof3rHomeComponent implements OnInit {
    @ViewChild('agmMap') agmMap: AgmMap
    public searchControl: FormControl;
    @ViewChild("search")
    public searchElementRef: ElementRef;
    responseData: ResponseModel;
    lat: number = 0;
    lng: number = 0;
    latMap: number;
    lngMap: number;
    actionClickDlivery: number = 0;
    actionClickPickup: number = 0;
    registerDevice: RegisterCustomerDevice;
    getInitialParams: GetInitialParams;
    getAllOutletListV2: GetAllOutletListV2Model;
    orderType: string = ""
    inputAddress: string = ""
    haveData: number = 1;
    userName: string = "";
    passWord: string = "";
    customerInfoMain: CustomerInfoMainModel;
    isLogin: string = "LOG IN";
    @BlockUI() blockUI: NgBlockUI;
    geolocationPosition: any
    latCurrent: number;
    lngCurrent: number;
    isUserLogin: boolean = false;
    userNameLogOut: string = ""
    test = [{ user: 'thanh', pass: '18' }, { user: 'vv', pass: '12' }]
    inputOTPModel: InputOTPModel
    requestCustomer: RequestRegisterCustomerModel;
    signUp: SingUpModel;
    inputOTPStr: string = "";
    addressList: AddressListModel;
    listDeliveryAddressShow: ListDeliveryAddress
    listDeliveryAddress: ListDeliveryAddress;
    showListSelectAddress: boolean = false;
    listMap: any[] = [];
    error: ErrorModel;
    selectCountryCode: string = ""
    isHaveCountry: boolean = false;
    public svgContainer: ElementRef
    @ViewChild('svgContainer') sgv: ElementRef
    @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
    mapLocation: Area;
    outletLocation: Area;
    names: any[] = [];
    areaName: string = ""
    parseOutlet: ParseOutletListArea1;
    shortArrays = []
    mccGobal: string = ''
    errormsg: string = ''
    isSelectNewAddress: boolean;
    public list1 =

        [
            { name: 'Option 1', id: '1' },
            { name: 'Option 2', id: '2' },
            { name: 'Option 3', id: '3' },
            { name: 'Option 4', id: '4' },
            { name: 'Option 5', id: '5' },
        ];

    list: any[] = [];
    private userFb: SocialUser;
    private userGG: SocialUser;
    private loggedIn: boolean;
    fbClick: boolean = false;
    constructor(private _instanceService: EventSubscribeService, private _gof3rModule: Gof3rModule, private router: Router, private active_router: ActivatedRoute, private _pickupService: PickupService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private _homeservice: HomeService, private _gof3rUtil: Gof3rUtil, private gof3rModule: Gof3rModule, public autoCompleteService: AutoCompleteService, private socialAuthService: AuthService, private deviceService: DeviceDetectorService) {
        this.signUp = new SingUpModel();
        this.listDeliveryAddress = new ListDeliveryAddress();
        this.listDeliveryAddressShow = new ListDeliveryAddress();
        this.error = new ErrorModel();
        this.mapLocation = new Area();
        this.outletLocation = new Area();
        this.parseOutlet = new ParseOutletListArea1();
        if (localStorage.getItem("orderType") != null) {
            this.orderType = localStorage.getItem("orderType");
        }
        localStorage.setItem("selectTimeClick", 'false')
        this.blockUI.stop()
    }
    ngOnInit() {

        this.loadAddress()
        this.checkLoginUser();
        this.initJQuery()
        this.registerDeviceRequest()
        this.isSelectNewAddress = false;
        localStorage.setItem("haveNewAddress", JSON.stringify(this.isSelectNewAddress));


        var elements = document.getElementsByClassName("gof3r-map");
        for (var i = 0; i < elements.length; i++) {
            this.names.push(elements[i].id);
        }



        //     this.authService.authState.subscribe((user) => {
        //     if(this.fbClick){
        //         console.log("fbclick")
        //         this.userFb = user;
        //         this.loggedIn = (user != null);
        //     }
        //     else{
        //         console.log("gg click")
        //         this.userGG = user
        //         this.loggedIn = (user != null);
        //     }

        //      //this.signUp.Email =user.email
        //     console.log("xxx:"+ JSON.stringify(user))

        //     // this.signUp.Email=this.user.email;
        //     // console.log("thanh")
        //   //this.loggedIn = (user != null);
        // });


        // this.searchControl = new FormControl(); comment danh cho google map
        // this.mapsAPILoader.load().then(() => {
        //     let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        //         types: ["geocode"]
        //     });
        //     autocomplete.addListener("place_changed", () => {
        //         this.ngZone.run(() => {
        //             //get the place result
        //             let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //             //verify result
        //             if (place.geometry === undefined || place.geometry === null) {
        //                 return;
        //             }

        //             //set latitude, longitude and zoom
        //             this.lat = place.geometry.location.lat();
        //             this.lng = place.geometry.location.lng();
        //             localStorage.setItem('lat', this.lat + '');
        //             localStorage.setItem('long', this.lng + '');
        //             localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
        //             
        //         });
        //     });
        // });
    }
    makeIconURL() {

        return require('../../assets/images/house-black.png')
    }

    loadAddress() {
        if (localStorage.getItem("cus") != null) {// get address when user login
            if (localStorage.getItem("addressDelivery") != null && localStorage.getItem("addressDelivery") != "undefined") {
                let address = JSON.parse(localStorage.getItem("addressDelivery"))

                this.inputAddress = address.Address;
                let strCut = address.GeoLocation.split(",");
                this.lat = strCut[0];
                this.lng = strCut[1];
                localStorage.setItem('lat', this.lat + '');
                localStorage.setItem('long', this.lng + '');
                localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
            }
            else {//when user login but have not addressDelivery

                this.checkUserLoginChangeAddress()
            }
        }
        else { // get address when user not login
            if (localStorage.getItem("address") != null) {
                this.addressList = JSON.parse(localStorage.getItem("address"));
                if (this.addressList.AddressListInfo.length > 0) {
                    this.inputAddress = this.addressList.AddressListInfo[0].StreetAddress;
                    this.lat = Number.parseFloat(this.addressList.AddressListInfo[0].lat);
                    this.lng = Number.parseFloat(this.addressList.AddressListInfo[0].long);
                    localStorage.setItem('lat', this.lat + '');
                    localStorage.setItem('long', this.lng + '');
                    localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
                }

            }
        }
    }
    deliveryClick() {

        if (this.inputAddress) {
            this.addressList = new AddressListModel();
            this.actionClickDlivery = 1;
            this.actionClickPickup = 0;
            this.orderType = "DELIVERY";
            this.haveData = 1
            localStorage.setItem("orderType", this.orderType)
            // this.isSelectNewAddress = false;
            // localStorage.setItem("haveNewAddress",JSON.stringify(this.isSelectNewAddress));
            $('.map-wrap').slideDown()
            // this._homeservice.getLocationAddress(this.lat, this.lng).then(data => {
            //     var address = data["results"][0]["formatted_address"];
            //     

            //     this.inputAddress = address
            //     // var arraySplited = address.split(",");
            //     if (localStorage.getItem("address") != null) {
            //         this.addressList = JSON.parse(localStorage.getItem("address"));
            //         for (let j = 0; j < this.addressList.AddressListInfo.length; j++) {
            //             this.addressList.AddressListInfo[j].isCheck = false;
            //         }

            //     }
            //     let item = new AddressIteModel();

            //     item.StreetAddress = address;
            //     item.lat = this.lat + ''
            //     item.long = this.lng + ''
            //     item.isCheck = true;
            //     let arrayName = item.StreetAddress.split(',');
            //     item.Name = arrayName[0];
            //     this.addressList.AddressListInfo.push(item);
            //     localStorage.setItem('address', JSON.stringify(this.addressList));

            // })
            if (localStorage.getItem("address") != null) {
                this.addressList = JSON.parse(localStorage.getItem("address"));
                for (let j = 0; j < this.addressList.AddressListInfo.length; j++) {
                    this.addressList.AddressListInfo[j].isCheck = false;
                }

            }
        }
        else {
            this.haveData = 0
        }




    }
    pikcupClick() {
        if (this.inputAddress) {
            this.addressList = new AddressListModel();
            this.actionClickPickup = 1;
            this.actionClickDlivery = 0;
            this.orderType = "PICKUP"
            this.haveData = 1
            // this.isSelectNewAddress = false;
            // localStorage.setItem("haveNewAddress",JSON.stringify(this.isSelectNewAddress));
            localStorage.setItem("orderType", this.orderType)
            $('.map-wrap').slideDown()
            this._homeservice.getLocationAddress(this.lat, this.lng).then(data => {
                var address = data["results"][0]["formatted_address"];

                this.inputAddress = address
                // var arraySplited = address.split(",");
                if (localStorage.getItem("address") != null) {
                    this.addressList = JSON.parse(localStorage.getItem("address"));
                    for (let j = 0; j < this.addressList.AddressListInfo.length; j++) {
                        this.addressList.AddressListInfo[j].isCheck = false;
                    }

                }
                let item = new AddressIteModel();

                item.StreetAddress = address;
                item.lat = this.lat + ''
                item.long = this.lng + ''
                item.isCheck = true;
                let arrayName = item.StreetAddress.split(',');
                item.Name = arrayName[0];
                this.addressList.AddressListInfo.push(item);
                localStorage.setItem('address', JSON.stringify(this.addressList));

            })
        }
        else {
            this.haveData = 0
        }

    }
    registerDeviceRequest() {

        var request = new RegisterDeviceRequest();
        if (localStorage.getItem('device') != null) {
            request.DeviceNumber = localStorage.getItem('device');
        }
        else {
            let device_number = this._gof3rUtil.guid();
            localStorage.setItem('device', device_number)
            request.DeviceNumber = device_number;
        }

        // request.DeviceNumber='9999'
        var jsonRequest = JSON.stringify(request);

        this._homeservice.registerDevice(jsonRequest).then(data => {

            this.registerDevice = (data);

            localStorage.setItem('KEK', (this.registerDevice.KEKWorkingKey));
            localStorage.setItem('WK', (this.registerDevice.APIWorkingKey));

            this.getInitParam();

        });
    }
    getInitParam() {

        var comomrequest = new GetInitParamRequest();
        if (localStorage.getItem('device') != null) {
            comomrequest.DeviceNumber = localStorage.getItem('device');
        }
        else {
            let device_number = this._gof3rUtil.guid();

            comomrequest.DeviceNumber = device_number
        }
        if (localStorage.getItem('la') != null) {

            comomrequest.Location = localStorage.getItem('la');

        }
        else {
            comomrequest.Location = ""
        }
        //comomrequest.DeviceNumber='9999'

        var requestData = new RequestNull();
        var jsonCommon = JSON.stringify(comomrequest);


        var jsonRequest = JSON.stringify(requestData);


        this._homeservice.getServiceHome(jsonCommon, jsonRequest).then(data => {

            this.getInitialParams = data;
            for (let i = 0; i < this.getInitialParams.CountryInfo.length; i++) {

                if (this.getInitialParams.CountryInfo[i].CountryCode === "65") {
                    this.signUp.PhoneCode = "+" + this.getInitialParams.CountryInfo[i].CountryCode;
                }
            }
            this.isHaveCountry = true;
            //this.haveDataInit=true
            localStorage.setItem("IN", this._gof3rUtil.encryptParams(JSON.stringify(this.getInitialParams)));
            this.GetOutletListByLocation()
            //this.blockUI.stop()
        });
    }
    GetAllOutletListV2(orderFor: string, outletID: string) {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetAllOutletListV2";
        let common_data_json = JSON.stringify(common_data);

        let request_data = new GetAllOutletListV2Request();
        request_data.OrderType = ORDER_DELIVERY
        request_data.OrderFor = orderFor
        request_data.CustomerId = "";
        request_data.FromRow = 0;
        if (this.getInitialParams.MCCInfo.length > 0) {
            for (let i = 0; i < this.getInitialParams.MCCInfo.length; i++) {

                if (this.getInitialParams.MCCInfo[i].Value == "Food") {

                    this.mccGobal = this.getInitialParams.MCCInfo[i].Id + '';
                }
            }
        }
        request_data.MCC = this.mccGobal;
        request_data.KeyWords = "";
        request_data.MerchantOutletId = outletID;
        request_data.SubCategoryId = "";
        let request_data_json = JSON.stringify(request_data);


        this._pickupService.GetAllOutletListV2(common_data_json, request_data_json).then(data => {
            //this._gof3rModule.checkInvalidSessionUser(data.ResultCode);

            this.getAllOutletListV2 = data;


            if (this.getAllOutletListV2.MerchantOutletListInfo.length > 0) {
                // this.noData=true;
                // this.haveData=false;
                let data = { function: "outletMap", haveOutlet: 1 }
                this._instanceService.sendCustomEvent(data)
            }

            else {
                let data = { function: "outletMap", haveOutlet: 0, msg: this.getAllOutletListV2.NoMessageDataForOutletList }
                this._instanceService.sendCustomEvent(data)
            }
            localStorage.setItem("out", outletID);
            //localStorage.setItem("orderType",ORDER_DELIVERY)
            localStorage.setItem("orderType", this.orderType)
            this.router.navigateByUrl("/order")

        })
    }
    findRestaurants() {
        //this.GetAllOutletListV2();
        if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
            this.showPopupIsMobile();
        }
        else {
            this.router.navigateByUrl('search-result')
        }

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
                var valueCheckUser = $('#check-user').text();

                if (valueCheckUser === 'true') {

                    $(this).parents('.login-wrap').find('.login-dropdown-had').slideDown();
                } else if (valueCheckUser === 'false') {

                    $(this).parents('.login-wrap').find('.login-dropdown').slideDown();
                }

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
            $(this).parents('.login-wrap').find('.login-dropdown-step2').slideDown();
        });
        $('.login-overlay').on('click', function (event) {
            event.preventDefault();
            $('.login-dropdown').hide();
            $('.login-dropdown-step2').hide();
            $('.login-dropdown-step3').hide();
            $('.login-dropdown-had').hide();
            $('.login-overlay').removeClass('show');
            $('.login-wrap .login').removeClass('hide-form');
            $('body').css({
                overflow: '',
                height: ''
            });;
        });
        $('.loginform-dropdown .sign-up a').on('click', function (event) {
            event.preventDefault();

            $('.signup-dropdown').fadeIn();
            $('.loginform-dropdown').hide();
        });

        // $('.signup-form form button').on('click', function (event) {
        //     event.preventDefault();

        //     $('.signup-dropdown-otp').fadeIn();
        //     $('.signup-dropdown').hide();
        // });

        $('.back-login').on('click', function (event) {
            event.preventDefault();
            $('.signup-dropdown').hide();
            $('.loginform-dropdown').fadeIn();
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
        $('.map-svg svg g').on('click', function (event) {
            event.preventDefault();
            var idPath = this.id;
            $('.map-svg svg g').removeClass('active');
            $(this).addClass('active');
            // let mapContent = $('#mapContent_' + idPath);
            // $('.map-list').hide();
            // mapContent.fadeIn();
        });

        // sidebar mobile
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
        $("#enter-new-address").on("keydown", function (event) {
            if (event.which == 13) {
                $(this).parents('.login-wrap').find('.login-dropdown-step3').slideDown();
                $(this).parents('.login-wrap').find('.login-dropdown-step2').hidden();
            }

        });
        // form order search
        // $('.btn-search-order').on('click', function (event) {
        //     event.preventDefault();
        //     $('.form-search-order').addClass('active');
        //     $('.form-search-order input').focus();
        // });
        // $('.close-search-order').on('click', function (event) {
        //     event.preventDefault();
        //     $('.form-search-order').removeClass('active');
        // });
    }
    checkLoginUser() {
        if (localStorage.getItem("cus") != null && localStorage.getItem("cus") != 'undefined') {
            this.customerInfoMain = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("cus")));
            this.isLogin = this.customerInfoMain.CustomerInfo[0].CustomerName
            this.userNameLogOut = this.customerInfoMain.CustomerInfo[0].UserName;
            this.isUserLogin = true;
        }
        else {

            this.isUserLogin = false;
        }
    }
    userLogin() {
        if (this.userName !== '' || this.passWord !== '') {
            this.blockUI.start()
            this.customerInfoMain = new CustomerInfoMainModel();
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.AppId = "3.6"
            common_data.Location = _location
            common_data.ServiceName = "CheckLogon";
            let common_data_json = JSON.stringify(common_data);


            let requestData = new CheckLogonRequest();
            requestData.UserName = this.userName
            requestData.Password = this.passWord;
            requestData.OTP = ""
            let requestDataJson = JSON.stringify(requestData)
            this._pickupService.CheckLogon(common_data_json, requestDataJson).then(data => {

                this.customerInfoMain = data;
                if (this.customerInfoMain.ResultCode === "000") {

                    localStorage.setItem("cus", this._gof3rUtil.encryptParams(JSON.stringify(this.customerInfoMain)))

                    this.isLogin = this.customerInfoMain.CustomerInfo[0].CustomerName;
                    $('.login-dropdown').hide();
                    $('.login-overlay').removeClass('show');
                    $('.login-wrap .login').removeClass('hide-form');
                    $('body').css({
                        overflow: '',
                        height: ''
                    });;
                    this.checkUserLoginChangeAddress()
                    this.getInitParam()
                    this.blockUI.stop()
                }
                else {
                    this.error.ResultDesc = this.customerInfoMain.ResultDesc;
                    this.showPopupPaymentSuccess()
                    this.blockUI.stop()
                }


            })
        }

    }
    showPopupPaymentSuccess() {
        var el = $('#success-popup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    deleteAddress() {
        this.inputAddress = ""
        this.list = []
        this.showListSelectAddress = false;
    }
    getCurrentLocation() {
        if (window.navigator && window.navigator.geolocation) {
            this.blockUI.start();
            window.navigator.geolocation.getCurrentPosition(
                position => {

                    this.geolocationPosition = position,

                        this._homeservice.getLocationAddress(position.coords.latitude, position.coords.longitude).then(data => {
                            var address = data["results"][0]["formatted_address"];
                            this.addressList = new AddressListModel();
                            this.inputAddress = address
                            // var arraySplited = address.split(",");

                            this.lat = position.coords.latitude;
                            this.lng = position.coords.longitude;
                            localStorage.setItem('lat', this.lat + '');
                            localStorage.setItem('long', this.lng + '');
                            localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
                            this.list = [];
                            this.showListSelectAddress = false;
                            this.isSelectNewAddress = true;
                            localStorage.setItem("haveNewAddress", JSON.stringify(this.isSelectNewAddress));
                            let item = new AddressIteModel();
                            item.lat = this.lat + ''
                            item.long = this.lng + ''
                            item.isCheck = true;
                            let arrayName = item.StreetAddress.split(',');
                            item.Name = address
                            item.StreetAddress = address;
                            this.addressList.AddressListInfo.push(item);
                            this.isSelectNewAddress = true;
                            localStorage.setItem("haveNewAddress", JSON.stringify(this.isSelectNewAddress));
                            localStorage.setItem('address', JSON.stringify(this.addressList));
                            this.blockUI.stop();
                            //this.locationrequest =this.lang+","+this.long+"#_#_";

                            // localStorage.setItem('la',this.locationrequest);
                            // localStorage.setItem('lat',position.coords.latitude+'');
                            // localStorage.setItem('long',position.coords.longitude+'');
                            // localStorage.setItem('latcur',position.coords.latitude+'');
                            // localStorage.setItem('longcur',position.coords.longitude+'')
                            // this.registerDeviceRequest()

                        })
                },
                error => {
                    switch (error.code) {
                        case 1:

                            break;
                        case 2:

                            break;
                        case 3:

                            break;
                    }
                }
            );
        };
    }
    checkShowPopup() {

        this.checkLoginUser();
    }
    logOutUser(userName: string) {
        this.blockUI.start();

        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "Logout";
        var common_data_json = JSON.stringify(common_data);

        let result: string = "";
        let dataRequest = new RequestLogOutModel();
        dataRequest.UserName = userName;
        let requestDataJson = JSON.stringify(dataRequest);
        this._pickupService.LogOutCustomer(common_data_json, requestDataJson).then(data => {
            if (data.ResultCode === "000") {
                $('.login-dropdown-had').hide();
                $('.login-overlay').removeClass('show');
                $('.login-wrap .login').removeClass('hide-form');
                $('body').css({
                    overflow: '',
                    height: ''
                });;
                localStorage.clear();
                this.isLogin = "LOG IN"
                this.inputAddress = ""
                this.registerDeviceRequest();
                this.blockUI.stop()
            }
        })
    }

    RegisterOPT() {

        if (this.signUp.Password === this.signUp.ConfrimPassword && this.signUp.Email != "" && this.signUp.FullName != "" && this.signUp.PhoneCode != "" && this.signUp.PhoneNumber != "" && this.signUp.Password != "" && this.signUp.ConfrimPassword != "") {
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "RequestRegistrationOTP";
            var common_data_json = JSON.stringify(common_data);

            let requestData = new RequestRegisterOTP();
            requestData.Email = this.signUp.Email;
            requestData.Mobile = this.signUp.PhoneCode + this.signUp.PhoneNumber;
            let request_data_json = JSON.stringify(requestData);
            this._pickupService.RequestRegistrationOTP(common_data_json, request_data_json).then(data => {
                this.responseData = data;

                if (this.responseData.ResultCode == "000") {
                    let requestRegister = new RequestRegisterCustomerModel();
                    requestRegister.CustomerName = this.signUp.FullName;
                    requestRegister.Email = this.signUp.Email
                    requestRegister.Mobile = this.signUp.PhoneCode + this.signUp.PhoneNumber;
                    requestRegister.Password = this.signUp.Password
                    $('.signup-dropdown-otp').fadeIn();
                    $('.signup-dropdown').hide();
                    this.move()
                    // this._instanceService.sendCustomEvent(requestRegister);
                    // this._router.navigateByUrl('/login-otp')

                } else {
                    // this.isError=true
                    this.error.ResultDesc = this.responseData.ResultDesc;
                    this.showPopupPaymentSuccess()
                    //   $('.signup-dropdown-otp').fadeIn();
                    // $('.signup-dropdown').hide();
                    //this.move()

                }
            })
        }
        else {
            this.error.ResultDesc = "The passwords you entered do not match."
            this.showPopupPaymentSuccess();
        }


    }
    inputOTP(even) {
        let lenght = (even.target.value.length)
        if (lenght == 6) {
            this.registerCustomer(even.target.value)
        }

    }
    registerCustomer(otp: string) {
        this.blockUI.start("Sign up.........!")
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "RegisterCustomer";
        var common_data_json = JSON.stringify(common_data);

        let requestRegister = new RequestRegisterCustomerModel();
        requestRegister.CustomerName = this.signUp.FullName
        requestRegister.Email = this.signUp.Email
        requestRegister.Mobile = this.signUp.PhoneCode + this.signUp.PhoneNumber
        requestRegister.OTP = otp
        requestRegister.Password = this.signUp.Password
        let request_data_json = JSON.stringify(requestRegister);

        this._pickupService.RegisterCustomer(common_data_json, request_data_json).then(data => {
            this.customerInfoMain = data;

            if (this.customerInfoMain.ResultCode == "000") {
                // this._instanceService.sendCustomEvent(this.customerLoginMain.CustomerInfo[0].UserName);
                // this._router.navigateByUrl('/login')
                this.error.ResultDesc = "Sign up successful."
                this.showPopupPaymentSuccess()
                $('.signup-dropdown-otp').hide();
                $('.loginform-dropdown').fadeIn();
                this.getInitParam();
                this.blockUI.stop();
            }
            else {
                this.error.ResultDesc = this.customerInfoMain.ResultDesc;
                this.showPopupPaymentSuccess();
                this.blockUI.stop()
            }
        })
    }
    checkUserLoginChangeAddress() {

        this.customerInfoMain = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("cus")));
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetDeliveryAddresses";
        let common_data_json = JSON.stringify(common_data);

        let data_request = { CustomerId: this.customerInfoMain.CustomerInfo[0].CustomerId };
        let data_request_json = JSON.stringify(data_request);

        this._pickupService.GetDeliveryAddresses(common_data_json, data_request_json).then(data => {

            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
            // this.showListDelivery=true;
            // this.showListAddresNotLogin=false
            this.listDeliveryAddress = data;
            if (this.listDeliveryAddress.DeliveryAddressList.length > 0) {
                localStorage.setItem("addressDelivery", JSON.stringify(this.listDeliveryAddress.DeliveryAddressList[0]))
                setTimeout(() => {
                    let address = JSON.parse(localStorage.getItem("addressDelivery"))
                    this.inputAddress = address.Address;
                    let strCut = address.GeoLocation.split(",");
                    this.lat = strCut[0];
                    this.lng = strCut[1];
                    localStorage.setItem('lat', this.lat + '');
                    localStorage.setItem('long', this.lng + '');
                    localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
                }, 50)

            }
            else {
                if (localStorage.getItem("address") != null) {
                    this.addressList = JSON.parse(localStorage.getItem("address"));
                    if (this.addressList.AddressListInfo.length > 0) {
                        this.inputAddress = this.addressList.AddressListInfo[0].StreetAddress;
                        this.lat = Number.parseFloat(this.addressList.AddressListInfo[0].lat);
                        this.lng = Number.parseFloat(this.addressList.AddressListInfo[0].long);
                        localStorage.setItem('lat', this.lat + '');
                        localStorage.setItem('long', this.lng + '');
                        localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
                    }

                }

            }



            //this.listDeliveryAddress = data;
        })

    }
    accountClick() {
        this._instanceService.sendCustomEvent("MyProfile");
        //window.location.href=("/account")
        ///this.router.navigate(["/account"])
    }
    orderHistoryClick() {
        this._instanceService.sendCustomEvent("OrderHistory");
        this.router.navigateByUrl("/order-history")
    }
    inviteFriend() {
        this._instanceService.sendCustomEvent("Invite");
        this.router.navigateByUrl("/invite");
    }
    help() {
        this._instanceService.sendCustomEvent("Help");
        this.router.navigateByUrl("/help");
    }
    checkInputPostalCode(event) {
        var postal_code: string = event.target.value;

        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "SearchSingaporeAddress";
        let common_data_json = JSON.stringify(common_data);

        let data_request = { SearchValue: postal_code };
        let request_data_json = JSON.stringify(data_request);
        this._pickupService.SearchSingaporeAddress(common_data_json, request_data_json).then(data => {

            this.list = data;
            this.showListSelectAddress = true;
            // for(let i = 0; i< data.AddressList.length; i++){
            //     this.list.push({name:data.AddressList[i].Address,postalCode:data.AddressList[i].PostalCode,lat:data.AddressList[i].Latitude,lng:data.AddressList[i].Longitude})

            // }

        })
    }
    Selected(item: SelectedAutocompleteItem) {

    }
    setList(list) {
        this.autoCompleteService.setDynamicList(list);
        // this will log in console if your list is empty.
    }
    selectAddress(addres: string, lat: string, lng: string, postalCode: string) {
        this.addressList = new AddressListModel();
        this.list = [];
        this.showListSelectAddress = false;
        this.inputAddress = addres;

        this.lat = Number.parseFloat(lat);
        this.lng = Number.parseFloat(lng);
        localStorage.setItem('lat', this.lat + '');
        localStorage.setItem('long', this.lng + '');
        localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
        let item = new AddressIteModel();

        item.StreetAddress = addres;
        item.lat = this.lat + ''
        item.long = this.lng + ''
        item.isCheck = true;
        item.AddressId = "";
        item.PostalCode = postalCode
        let arrayName = item.StreetAddress.split(',');
        item.Name = arrayName[0];
        this.addressList.AddressListInfo.push(item);
        this.isSelectNewAddress = true;
        localStorage.setItem("haveNewAddress", JSON.stringify(this.isSelectNewAddress));
        localStorage.setItem('address', JSON.stringify(this.addressList));
    }
    GetOutletListByLocation() {

        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetOutletListByLocation";
        let common_data_json = JSON.stringify(common_data);
        let data_request = { Lang: "en" };
        let data_request_json = JSON.stringify(data_request);

        this._pickupService.GetOutletListByLocation(common_data_json, data_request_json).then(data => {

            this.mapLocation = data;

            //this.mapLocation.MerchantOutletList[0].Enabled="N"
            let isMatch: boolean = true;
            for (let i = 0; i < this.names.length; i++) {
                let flagExits = 0;
                for (let j = 0; j < this.mapLocation.MerchantOutletList.length; j++) {
                    if (this.mapLocation.MerchantOutletList[j].LocationName.toLocaleLowerCase().indexOf(this.names[i].toLocaleLowerCase()) > -1) {
                        if (this.mapLocation.MerchantOutletList[j].Enabled === "N") {
                            var addClass = document.getElementById(this.names[i]);
                            addClass.classList.add("deactivate")

                        }
                        flagExits = 1;
                    }
                }
                if (flagExits === 0) {
                    var addClass = document.getElementById(this.names[i]);
                    addClass.classList.add("deactivate")
                }
            }
            this.getOutlet("ANG MO KIO");
            //console.log("outlet:"+ JSON.stringify(data))


        })
    }
    getOutlet(name: string) {
        this.areaName = name

        this.shortArrays = []

        for (let i = 0; i < this.mapLocation.MerchantOutletList.length; i++) {
            if (this.mapLocation.MerchantOutletList[i].LocationName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) > -1) {

                this.outletLocation.MerchantOutletList[0] = this.mapLocation.MerchantOutletList[i];
                this.shortArrays = this.chunkArray(this.mapLocation.MerchantOutletList[i].OutletList, 5);
                break;
            }
            else {
                this.shortArrays = []
            }
        }

    }
    chunkArray(arr, size) {

        var arr2 = arr.slice(0),
            arrays = [];

        while (arr2.length > 0) {
            arrays.push(arr2.splice(0, size));
        }

        return arrays;
    }
    showSelectCountry() {
        var el = $('#country-popup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    selectCountry(countryCode: string) {
        this.selectCountryCode = "+" + countryCode;;

    }
    closeCountry() {
        this.signUp.PhoneCode = this.selectCountryCode;
        $.magnificPopup.close()
    }
    move() {
        var elem = document.getElementById("per");
        var width = 1;
        var id = setInterval(frame, 100);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
            } else {
                width++;
                elem.style.width = width + '%';
            }
        }
    }

    logInWithSocial(socialPlatform: string) {
        let socialPlatformProvider;
        if (socialPlatform == "facebook") {
            socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        } else if (socialPlatform == "google") {
            socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;

        }

        this.socialAuthService.signIn(socialPlatformProvider).then(
            (userData) => {

                //this.signUp.Email = userData.email
                //console.log(socialPlatform + " sign in data : ", userData);
                // Now sign-in with userData
                this.userName = userData.email
                this.blockUI.start()
                this.customerInfoMain = new CustomerInfoMainModel();
                let common_data = new CommonDataRequest();
                var _location = localStorage.getItem("la");
                common_data.AppId = "3.6"
                common_data.Location = _location
                common_data.ServiceName = "CheckLogon";
                let common_data_json = JSON.stringify(common_data);

                let requestData = new CheckLogonRequest();
                requestData.UserName = this.userName
                requestData.Password = "";
                requestData.OTP = ""
                let requestDataJson = JSON.stringify(requestData)

                this._pickupService.CheckLogon(common_data_json, requestDataJson).then(data => {

                    this.customerInfoMain = data;

                    if (this.customerInfoMain.ResultCode === "000") {

                        localStorage.setItem("cus", this._gof3rUtil.encryptParams(JSON.stringify(this.customerInfoMain)))

                        this.isLogin = this.customerInfoMain.CustomerInfo[0].CustomerName;
                        $('.login-dropdown').hide();
                        $('.login-overlay').removeClass('show');
                        $('.login-wrap .login').removeClass('hide-form');
                        $('body').css({
                            overflow: '',
                            height: ''
                        });;
                        this.checkUserLoginChangeAddress()
                        this.getInitParam()
                        this.blockUI.stop()
                    }
                    else {
                        this.error.ResultDesc = this.customerInfoMain.ResultDesc;
                        this.showPopupPaymentSuccess()
                        this.blockUI.stop()
                    }
                })
            }
        );
    }
    socialSignIn(socialPlatform: string) {
        let socialPlatformProvider;
        if (socialPlatform == "facebook") {
            socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        } else if (socialPlatform == "google") {
            socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        }

        this.socialAuthService.signIn(socialPlatformProvider).then(
            (userData) => {
                this.signUp.Email = userData.email
                // Now sign-in with userData
            }
        );
    }
    GetCurrentSystemTime(merchantOutletID: string) {


        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetCurrentSystemTime";
        let common_data_json = JSON.stringify(common_data);
        let strDatime: string = ""
        let dataRequest = new GetCurrentSystemTimeRequest();
        let dataRequestJson = JSON.stringify(dataRequest);
        this._pickupService.GetCurrentSystemTime(common_data_json, dataRequestJson).then(data => {

            let d = new Date(+data.CurrentTimeMillis);
            let date = moment_(d).format("DD/MM/YYYY")
            let time = d.toLocaleTimeString();
            // this.getCurrentTime.CurrentData = date;
            // this.getCurrentTime.CurrentTime = moment_(d.getTime()).format("HH:mm:ss")
            strDatime = date + " " + moment_(d.getTime()).format("HH:mm:ss")

            this.GetAllOutletListV2(strDatime, merchantOutletID)


        })

    }
    goToOrder(merchantOutletID: string) {
        if (this.inputAddress) {
            this.blockUI.start()
            this.GetCurrentSystemTime(merchantOutletID)
        }
        else {
            this.scroll()
        }
    }
    scroll() {
        $('html, body').animate({
            scrollTop: $(".header-content").offset().top
        }, 1000);

    }
    showPopupddCardError() {
        var el = $('#add-card');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    showPopupIsMobile() {
        var el = $('#popup-ismobile');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el,
                    showCloseBtn: false,
                },
                type: 'inline',
                modal: true,
            });
        }
    }
    okay() {
        //window.location.replace("fb://myfacepage/");
        if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
            // window.location.href = "market://details?id=com.sb.carrot";
            
            window.location.href=("gof3r://gof3r.com/user");
            setTimeout(function () { window.location.href = "market://details?id=com.sb.carrot"; }, 25);

        } else {
            if (navigator.userAgent.toLowerCase().indexOf("iphone") > -1 || navigator.userAgent.toLowerCase().indexOf("ipad") > -1) {
                
                
                window.location.href=("GOF3R://");
                setTimeout(function () { window.location.href = "itms-apps://itunes.apple.com/app/id1196135801"; }, 25);

            }

        }
        $.magnificPopup.close()
    }
}