import { Component, OnInit } from '@angular/core';
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
import {CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent} from "ng-auto-complete";
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
    showListSelectAddress:boolean=false;
    @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
    
    public list1 = 
        
            [
                {name: 'Option 1', id: '1'},
                {name: 'Option 2', id: '2'},
                {name: 'Option 3', id: '3'},
                {name: 'Option 4', id: '4'},
                {name: 'Option 5', id: '5'},
            ];
           
    list:any[]=[];
    
    constructor(private _instanceService:EventSubscribeService,private _gof3rModule: Gof3rModule, private router: Router, private active_router: ActivatedRoute, private _pickupService: PickupService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private _homeservice: HomeService, private _gof3rUtil: Gof3rUtil, private gof3rModule: Gof3rModule,public autoCompleteService: AutoCompleteService) {
        this.signUp = new SingUpModel();
        this.listDeliveryAddress = new ListDeliveryAddress();
        this.listDeliveryAddressShow = new ListDeliveryAddress();
        this.blockUI.stop()
    }
    ngOnInit() {
        this.loadAddress()
        this.checkLoginUser();
        this.initJQuery()
        this.registerDeviceRequest()
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
        //             console.log('lat:' + this.lat + " - lng:" + this.lng)
        //         });
        //     });
        // });
    }
    makeIconURL() {

        return require('../../assets/images/house-black.png')
    }
    loadAddress() {
        if (localStorage.getItem("cus") != null) {// get address when user login
            if (localStorage.getItem("addressDelivery") != null && localStorage.getItem("addressDelivery")!="undefined") {
                let address = JSON.parse(localStorage.getItem("addressDelivery"))
                console.log("xxthanh:"+ address)
                this.inputAddress = address.Address;
                let strCut = address.GeoLocation.split(",");
                this.lat = strCut[0];
                this.lng = strCut[1];
                localStorage.setItem('lat', this.lat + '');
                localStorage.setItem('long', this.lng + '');
                localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
            }
            else {//when user login but have not addressDelivery
                console.log("thanhxxx")
                this.checkUserLoginChangeAddress()
            }
        }
        else { // get address when user not login

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
            $('.map-wrap').slideDown()
            this._homeservice.getLocationAddress(this.lat, this.lng).then(data => {
                var address = data["results"][0]["formatted_address"];
                console.log("current:" + address)

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
    pikcupClick() {
        if (this.inputAddress) {
            this.addressList = new AddressListModel();
            this.actionClickPickup = 1;
            this.actionClickDlivery = 0;
            this.orderType = "PICKUP"
            this.haveData = 1
            localStorage.setItem("orderType", this.orderType)
            $('.map-wrap').slideDown()
            this._homeservice.getLocationAddress(this.lat, this.lng).then(data => {
                var address = data["results"][0]["formatted_address"];
                console.log("current:" + address)
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
        console.log('s3')
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
        console.log('Device:' + jsonRequest)
        this._homeservice.registerDevice(jsonRequest).then(data => {
            console.log('hehe:' + JSON.stringify(data))
            console.log('hbjhbj')
            this.registerDevice = (data);
            localStorage.setItem('KEK', (this.registerDevice.KEKWorkingKey));
            localStorage.setItem('WK', (this.registerDevice.APIWorkingKey));
            console.log('s4')
            this.getInitParam();

        });
    }
    getInitParam() {
        console.log('s5')
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
            console.log('init:' + comomrequest.Location)
        }
        else {
            comomrequest.Location = ""
        }
        //comomrequest.DeviceNumber='9999'

        var requestData = new RequestNull();
        var jsonCommon = JSON.stringify(comomrequest);
        console.log(jsonCommon);
        var jsonRequest = JSON.stringify(requestData);
        console.log(jsonRequest)
        this._homeservice.getServiceHome(jsonCommon, jsonRequest).then(data => {
            console.log('s6')
            console.log('init:' + JSON.stringify(data))
            this.getInitialParams = data;
            //this.haveDataInit=true
            localStorage.setItem("IN", this._gof3rUtil.encryptParams(JSON.stringify(this.getInitialParams)));
            console.log(data);
            //this.blockUI.stop()
        });
    }
    GetAllOutletListV2() {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetAllOutletListV2";
        let common_data_json = JSON.stringify(common_data);
        console.log('getoutlet:' + common_data_json)
        let request_data = new GetAllOutletListV2Request();
        request_data.OrderType = this.orderType;
        if (this.orderType === ORDER_PICKUP || !this.orderType) {
            request_data.OrderFor = "";
        } else if (this.orderType === ORDER_DELIVERY) {
            request_data.OrderFor = "ASAP";
        }
        request_data.OrderFor = ""
        request_data.CustomerId = "";
        request_data.FromRow = 0;
        request_data.MCC = "17";
        request_data.KeyWords = "";
        request_data.MerchantOutletId = "";
        request_data.SubCategoryId = "";
        let request_data_json = JSON.stringify(request_data);

        console.log('data:' + request_data_json)
        this._pickupService.GetAllOutletListV2(common_data_json, request_data_json).then(data => {
            //this._gof3rModule.checkInvalidSessionUser(data.ResultCode);
            console.log('test:' + JSON.stringify(data));
            this.getAllOutletListV2 = data;
            if (this.getAllOutletListV2.MerchantOutletListInfo.length == 0) {
                // this.noData=true;
                // this.haveData=false;
            }
            else {
                //     this.noData=false;
                //  this.haveData = true;
            }

        })
    }
    findRestaurants() {
        //this.GetAllOutletListV2();
        this.router.navigateByUrl('search-result')
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
                    console.log('thanh false')
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

        $('.signup-form form button').on('click', function (event) {
            event.preventDefault();

            $('.signup-dropdown-otp').fadeIn();
            $('.signup-dropdown').hide();
        });

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
            let mapContent = $('#mapContent_' + idPath);
            $('.map-list').hide();
            mapContent.fadeIn();
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
                this.blockUI.stop()
                console.log(data)
            })
        }

    }
    deleteAddress() {
        this.inputAddress = ""
        this.list=[]
        this.showListSelectAddress=false;
    }
    getCurrentLocation() {
        if (window.navigator && window.navigator.geolocation) {
            this.blockUI.start();
            window.navigator.geolocation.getCurrentPosition(
                position => {

                    this.geolocationPosition = position,
                        console.log(position)
                    this._homeservice.getLocationAddress(position.coords.latitude, position.coords.longitude).then(data => {
                        var address = data["results"][0]["formatted_address"];
                        console.log("current:" + address)
                        this.inputAddress = address
                        // var arraySplited = address.split(",");

                        this.lat = position.coords.latitude;
                        this.lng = position.coords.longitude;
                        localStorage.setItem('lat', this.lat + '');
                        localStorage.setItem('long', this.lng + '');
                        localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
                        this.list=[];
                        this.showListSelectAddress=false;
                        this.blockUI.stop();
                        //this.locationrequest =this.lang+","+this.long+"#_#_";
                        // console.log('xxx:'+ this.locationrequest)
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
                            console.log('Permission Denied');
                            break;
                        case 2:
                            console.log('Position Unavailable');
                            break;
                        case 3:
                            console.log('Timeout');
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
                this.inputAddress=""
                this.registerDeviceRequest();
                this.blockUI.stop()
            }
        })
    }

    RegisterOPT() {


        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "RequestRegistrationOTP";
        var common_data_json = JSON.stringify(common_data);

        let requestData = new RequestRegisterOTP();
        requestData.Email = this.signUp.Email;
        requestData.Mobile = this.signUp.PhoneNumber;
        let request_data_json = JSON.stringify(requestData);
        this._pickupService.RequestRegistrationOTP(common_data_json, request_data_json).then(data => {
            this.responseData = data;
            console.log('dada' + JSON.stringify(data))
            if (this.responseData.ResultCode == "000") {
                let requestRegister = new RequestRegisterCustomerModel();
                requestRegister.CustomerName = this.signUp.FullName;
                requestRegister.Email = this.signUp.Email
                requestRegister.Mobile = this.signUp.PhoneNumber;
                requestRegister.Password = this.signUp.Password
                // this._instanceService.sendCustomEvent(requestRegister);
                // this._router.navigateByUrl('/login-otp')

            } else {
                // this.isError=true

            }
        })

    }
    inputOTP(even) {
        let lenght = (even.target.value.length)
        if (lenght == 6) {
            this.registerCustomer(even.target.value)
        }

    }
    registerCustomer(otp: string) {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "RegisterCustomer";
        var common_data_json = JSON.stringify(common_data);
        console.log('json:' + JSON.stringify(common_data_json))
        let requestRegister = new RequestRegisterCustomerModel();
        requestRegister.CustomerName = this.signUp.FullName
        requestRegister.Email = this.signUp.Email
        requestRegister.Mobile = this.signUp.PhoneNumber
        requestRegister.OTP = otp
        requestRegister.Password = this.signUp.Password
        let request_data_json = JSON.stringify(requestRegister);
        console.log(request_data_json)
        this._pickupService.RegisterCustomer(common_data_json, request_data_json).then(data => {
            this.customerInfoMain = data;
            console.log(JSON.stringify(this.customerInfoMain));
            if (this.customerInfoMain.ResultCode == "000") {
                // this._instanceService.sendCustomEvent(this.customerLoginMain.CustomerInfo[0].UserName);
                // this._router.navigateByUrl('/login')
                $('.signup-dropdown-otp').hide();
                $('.loginform-dropdown').fadeIn();
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
        console.log('Thanh' + common_data_json)
        let data_request = { CustomerId: this.customerInfoMain.CustomerInfo[0].CustomerId };
        let data_request_json = JSON.stringify(data_request);
        console.log('Thanh1' + data_request_json)
        this._pickupService.GetDeliveryAddresses(common_data_json, data_request_json).then(data => {
            console.log('listAdd:' + JSON.stringify(data))
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
            // this.showListDelivery=true;
            // this.showListAddresNotLogin=false
                this.listDeliveryAddress = data;
                if(this.listDeliveryAddress.DeliveryAddressList.length>0){
                    localStorage.setItem("addressDelivery", JSON.stringify(this.listDeliveryAddress.DeliveryAddressList[0]))
                setTimeout(()=>{
                    let address = JSON.parse(localStorage.getItem("addressDelivery"))
                this.inputAddress = address.Address;
                let strCut = address.GeoLocation.split(",");
                this.lat = strCut[0];
                this.lng = strCut[1];
                localStorage.setItem('lat', this.lat + '');
                localStorage.setItem('long', this.lng + '');
                localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
                },50)
                
            }
            else{
                 if (localStorage.getItem("address") != null) {
                    this.addressList = JSON.parse(localStorage.getItem("address"));
                    if(this.addressList.AddressListInfo.length>0){
                        this.inputAddress= this.addressList.AddressListInfo[0].StreetAddress;
                        this.lat =Number.parseFloat(this.addressList.AddressListInfo[0].lat);
                        this.lng =Number.parseFloat(this.addressList.AddressListInfo[0].long);
                        localStorage.setItem('lat', this.lat + '');
                        localStorage.setItem('long', this.lng + '');
                        localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
                    }

                }

            }
                
            

            //this.listDeliveryAddress = data;
        })

    }
    accountClick(){
        this._instanceService.sendCustomEvent("MyProfile");
        //window.location.href=("/account")
        ///this.router.navigate(["/account"])
    }
    orderHistoryClick(){
        this._instanceService.sendCustomEvent("OrderHistory");
        this.router.navigateByUrl("/order-history")
    }
    inviteFriend(){
        this._instanceService.sendCustomEvent("Invite");
        this.router.navigateByUrl("/invite");
    }
    help(){
        this._instanceService.sendCustomEvent("Help");
        this.router.navigateByUrl("/help");
    }
    checkInputPostalCode(event){
        var postal_code:string = event.target.value;
        console.log("postalCode:"+ postal_code)
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "SearchSingaporeAddress";
        let common_data_json = JSON.stringify(common_data);

        let data_request = {SearchValue:postal_code};
        let request_data_json = JSON.stringify(data_request);
        this._pickupService.SearchSingaporeAddress(common_data_json,request_data_json).then(data=>{
            console.log("addPostal:"+ JSON.stringify(data))
            this.list=data;
            this.showListSelectAddress=true;
            // for(let i = 0; i< data.AddressList.length; i++){
            //     this.list.push({name:data.AddressList[i].Address,postalCode:data.AddressList[i].PostalCode,lat:data.AddressList[i].Latitude,lng:data.AddressList[i].Longitude})
                
            // }
            
        })
    }
    Selected(item: SelectedAutocompleteItem) {
        console.log(item);
    }
    setList(list){
          this.autoCompleteService.setDynamicList(list);
          // this will log in console if your list is empty.
      }
    selectAddress(addres:string, lat:string, lng:string){
        this.list=[];
        this.showListSelectAddress=false;
        this.inputAddress=addres;
    }

}