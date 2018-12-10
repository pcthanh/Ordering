import { Component, OnInit } from '@angular/core';
import { AddressListModel } from "../models/AddressList";
import { SelectItem } from 'primeng/primeng';
import { AddressIteModel } from "../models/AddressItem";
import { EventSubscribeService } from "../services/instance.service";
import { AgmMap, MapsAPILoader } from '@agm/core';
import { ViewChild, ElementRef, NgZone } from '@angular/core'
import { FormControl, NgModel } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HomeService } from "../services/home.service";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { Gof3rUtil } from "../util/gof3r-util";
import { SingUpModel } from "../models/SignUp";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { PickupService } from "../services/pickup.service";
import { RequestLogOutModel } from "../models-request/request-log-out-customer";
import { CheckLogonRequest } from "../models-request/check-logon";
import { GetCurrentSystemTimeRequest } from "../models-request/get-current-system-time";
import { GetCurrentSystemTimeModel } from "../models/GetCurrentSystemTime";
import { ApplyPromocodeRequest } from "../models-request/apply-promocode";
import * as moment_ from 'moment';
import { DeliveryDateModle } from "../models/DeliveryDate";
import { DeliveryItemModel } from "../models/DeliveryDateItem";
import { DeliveryMainModel } from "../models/DeliveryDateMain";
import { ListDeliveryAddress } from "../models/ListDeliveryAddress";
import { Gof3rModule } from "../util/gof3r-module";
import { ActivatedRoute, Params,Router } from "@angular/router";
import { AddeliveryAddressModel } from "../models-request/add-delivery-address";
import { InputOTPModel } from "../models/InputOTP";
import { RequestRegisterCustomerModel } from "../models-request/request-register-customer";
import { RequestRegisterOTP } from "../models-request/request-register-otp";
import { ResponseModel } from "../models/Response";
import { ErrorModel } from "../models/Error";
import { GetInitialParams } from "../models/GetInitialParams";
import { GetInitParamRequest } from "../models-request/get-init-param-request";
import { RequestNull } from "../models-request/request-null";
declare var $: any
const ORDER_DELIVERY = "DELIVERY"
const ORDER_PICKUP = "PICKUP";
const ADD_MINUTE_TIME_FROM_SERVER: number = 30;
const ADD_MINUTE_TIME_AFTER_FROM_SERVER: number = 15;
const START_TIME_LIMINT: String = "07:30:00"
const END_TIME_LIMIT: string = "23:00:00"
@Component({
    selector: 'header-gof3r',
    templateUrl: 'header.component.html'
})

export class HeaderGof3rComponent implements OnInit {
    addressList: AddressListModel;
    times: SelectItem[] = [];
    timesDelivery: SelectItem[] = [];
    timesPickup: SelectItem[] = [];
    addressShowDiplay: AddressListModel;
    selectOrderTypeDeivery: boolean = false // true: delivery, false: pickup
    selectOrderTypePickup: boolean = false // true: delivery, false: pickup
    isShowAdd: boolean = false
    orderType: string = ""
    inputChangeAddress: string = "";
    responseData: ResponseModel;
    isUserLogin: boolean = false;
    isLogin: string = "LOG IN";
    signUp: SingUpModel;
    lat: number;
    lng: number;
    inutUserName: string = ""
    @BlockUI() blockUI: NgBlockUI;
    geolocationPosition: any
    customerInfoMain: CustomerInfoMainModel;
    public searchControl: FormControl;
    @ViewChild("search")
    public searchElementRef: ElementRef;
    userNamestr: string = "";
    getCurrentTime: GetCurrentSystemTimeModel;
    passWord: string = "";
     listDeliveryAddress: ListDeliveryAddress;
    userNameLogOut: string = ""
    whenStr: string = ""
    checkOut:boolean=true;
    arrayDateDelivery1: DeliveryDateModle
    arrayDateDelivery2: DeliveryDateModle
    DateDeliveryList: DeliveryMainModel;
    currentDate:string=""
    haveDateList:boolean=false;
    showListDelivery:boolean=false
    showListAddresNotLogin:boolean=false;
    listDeliveryAddressShow:ListDeliveryAddress
    showWhen:boolean=false;
    inputOTPStr: string = "";
    isDelivery:boolean=false;
    isPickup:boolean=false;
    error:ErrorModel;
    getInitialParams: GetInitialParams;
    selectCountryCode:string=""
    showDetail:boolean=true;
    routerThisPage:boolean=true;
    constructor(private _route:Router,private _gof3rModule:Gof3rModule,private _pickupService: PickupService, private _gof3rUtil: Gof3rUtil, private _instanceService: EventSubscribeService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private _homeservice: HomeService) {
        this.addressList = new AddressListModel();
        this.signUp = new SingUpModel();
        this.listDeliveryAddress = new ListDeliveryAddress();
        this.listDeliveryAddressShow = new ListDeliveryAddress();
        this.error = new ErrorModel();
        this.getInitialParams= new GetInitialParams();
        this._instanceService.$getEventSubject.subscribe(data=>{
            console.log(data)
            if(data==="CheckOut"){
                
                //this.checkOut=false;
            }
            if(data==="About" ||data==="FAQ"|| data==="PRIVACY"||data==="TERMS"||data==="ContactUS"||data==="Grows"){
                this.showDetail=false;
                this.routerThisPage=false;
            }
            
        })
        if (localStorage.getItem("orderType") != null) {

            this.orderType = localStorage.getItem("orderType");
            if (this.orderType === ORDER_DELIVERY) {
                this.selectOrderTypeDeivery = true
            }
            else if (this.orderType === ORDER_PICKUP) {
                this.selectOrderTypePickup = true;
            }
        }
        if (localStorage.getItem("IN") != null) {
            this.getInitialParams = new GetInitialParams();
           
            this.getInitialParams = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("IN")));


            for(let i = 0; i< this.getInitialParams.CountryInfo.length; i++){
               
                if(this.getInitialParams.CountryInfo[i].CountryCode==="65"){
                    this.signUp.PhoneCode="+"+this.getInitialParams.CountryInfo[i].CountryCode;
                }
            }


        }
       
    }

    ngOnInit() {
        this.searchControl = new FormControl();
        this.checkLoginUser();
        this.GetCurrentSystemTime()
        this.loadTimesDelivery(true,this.currentDate);
        this.loadTimesDeliveryPickup(true,this.currentDate)
        //this.checkUserLoginChangeAddress()
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ["geocode"]
            });
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    //set latitude, longitude and zoom
                    this.lat = place.geometry.location.lat();
                    this.lng = place.geometry.location.lng();
                    localStorage.setItem('lat', this.lat + '');
                    localStorage.setItem('long', this.lng + '');
                    localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
                    this._homeservice.getLocationAddress(this.lat, this.lng).then(data => {
                        var address = data["results"][0]["formatted_address"];
                        this.inputChangeAddress = address;
                    })
                    
                });
            });
        });
        //this.getAddress();
        this.checkUserLoginChangeAddress()
        this.initJQuery()
    }
    checkLoginUser() {

        if (localStorage.getItem("cus") != null && localStorage.getItem("cus")!="undefined") {

            this.customerInfoMain = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("cus")));
            console.log("cus:"+ JSON.stringify(this.customerInfoMain))
            this.isLogin = this.customerInfoMain.CustomerInfo[0].CustomerName
            this.userNameLogOut = this.customerInfoMain.CustomerInfo[0].UserName;
            this.isUserLogin = true;

        }
        else {
            
            this.isUserLogin = false;
        }
    }
    checkUserLoginChangeAddress() {
        if (localStorage.getItem('cus') == null) {
            
            this.getAddress()
            this.showListAddresNotLogin=true;
            this.showListDelivery=false;
            //this._router.navigateByUrl('/login')
        } else {
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
               
                this.showListAddresNotLogin=false
                this.listDeliveryAddress=data;
                if(this.listDeliveryAddress.DeliveryAddressList.length>0){
                     this.showListDelivery=true;
                }
                if(localStorage.getItem("addressDelivery")!=null && localStorage.getItem("addressDelivery")!="undefined"){
                    console.log("thanhxx")
                    let count=0;
                    let address =JSON.parse(localStorage.getItem("addressDelivery"));
                    for(let i = 0; i< this.listDeliveryAddress.DeliveryAddressList.length; i++){
                        if(this.listDeliveryAddress.DeliveryAddressList[i].AddressId===address.AddressId){
                            count= count+1;
                            this.listDeliveryAddress.DeliveryAddressList[i].isCheck=true;
                            this.listDeliveryAddressShow.DeliveryAddressList[0]=this.listDeliveryAddress.DeliveryAddressList[i]
                        }
                    }
                    if(count==0){
                        if(this.listDeliveryAddress.DeliveryAddressList.length>0){
                            this.listDeliveryAddress.DeliveryAddressList[0].isCheck=true;
                        this.listDeliveryAddressShow.DeliveryAddressList[0]=this.listDeliveryAddress.DeliveryAddressList[0]
                        localStorage.setItem("addressDelivery",JSON.stringify(this.listDeliveryAddressShow.DeliveryAddressList[0]))
                        }
                    }
                }else{
                    console.log("thanhhere")
                    if(this.listDeliveryAddress.DeliveryAddressList.length>0){
                        
                        this.listDeliveryAddress.DeliveryAddressList[0].isCheck=true;
                        this.listDeliveryAddressShow.DeliveryAddressList[0]=this.listDeliveryAddress.DeliveryAddressList[0]
                        localStorage.setItem("addressDelivery",JSON.stringify(this.listDeliveryAddressShow.DeliveryAddressList[0]))
                    }
                    else{
                        this.showListAddresNotLogin=true;
                        this.showListDelivery=false;
                        this.getAddress()
                    }
                    
                }
                
                //this.listDeliveryAddress = data;
            })
        }
    }
    getAddress() {
        this.addressShowDiplay = new AddressListModel();

        if (localStorage.getItem('address') != null) {

            this.addressList = JSON.parse(localStorage.getItem('address'));
            
            for (let i = 0; i < this.addressList.AddressListInfo.length; i++) {
                if (this.addressList.AddressListInfo[i].isCheck == true) {
                    let item = new AddressIteModel();
                    item.lat = this.addressList.AddressListInfo[i].lat;
                    item.long = this.addressList.AddressListInfo[i].long;
                    item.StreetAddress = item.lat = this.addressList.AddressListInfo[i].StreetAddress
                    item.Name = this.addressList.AddressListInfo[i].Name
                    this.addressShowDiplay.AddressListInfo.push(item)

                    this.isShowAdd = true
                    
                }
            }
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
                
                if(event.target.id==='user'){
                   
                    if (valueCheckUser === 'true') {

                        $(this).parents('.login-wrap').find('.login-dropdown-had').slideDown();

                    }
                    else if (valueCheckUser === 'false') {
                        
                        $(this).parents('.login-wrap').find('.login-dropdown').slideDown();
                    }
                }
                else if (event.target.id==='user1'){
                  
                    if (valueCheckUser === 'true') {

                        $(this).parents('.login-wrap').find('.login-dropdown-had').slideDown();

                    }
                    else if (valueCheckUser === 'false') {
                        
                        $(this).parents('.login-wrap').find('.login-dropdown').slideDown();
                    }
                }
                else{
                   
                        $(this).parents('.login-wrap').find('.login-dropdown').slideDown();
                    
                     
                }
                    
                $('.back-login').on('click', function (event) {
            event.preventDefault();
            $('.signup-dropdown').hide();
            $('.loginform-dropdown').fadeIn();
        });
                

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
            $('.login-dropdown-had').hide();
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
        //  $('.signup-form form button').on('click', function (event) {
        //     event.preventDefault();

        //     $('.signup-dropdown-otp').fadeIn();
        //     $('.signup-dropdown').hide();
        // });
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
    changeAddressOutletV2(lat: string, lng: string, index: number) {

        let location = lat + ',' + lng + "#_#_"
        let dataSendChangeAddreesV2 = { function: 'changeAddressV2', la: location };
        this.changeCheckAddress(index)

        localStorage.setItem('la', location);
        $('.login-dropdown').hide();
        $('.login-overlay').removeClass('show');
        $('.login-wrap .login').removeClass('hide-form');
        $('body').css({
            overflow: '',
            height: ''
        });;
        this._instanceService.sendCustomEvent(dataSendChangeAddreesV2);

    }
    changeAddressOutletV2Login(geo:string,index:number,itemAddress:any){
        
        let strCut = geo.split(",");
        let location = strCut[0] + ',' + strCut[1] + "#_#_"
        let dataSendChangeAddreesV2 = { function: 'changeAddressV2', la: location };
        this.changeCheckAddress(index)
        localStorage.setItem("addressDelivery",JSON.stringify(itemAddress))
        localStorage.setItem('la', location);
        $('.login-dropdown').hide();
        $('.login-overlay').removeClass('show');
        $('.login-wrap .login').removeClass('hide-form');
        $('body').css({
            overflow: '',
            height: ''
        });;
        this._instanceService.sendCustomEvent(dataSendChangeAddreesV2);
    }
    changeCheckAddress(index) {

        if(localStorage.getItem("cus")==null){
            for (let i = 0; i < this.addressList.AddressListInfo.length; i++) {

            this.addressList.AddressListInfo[i].isCheck = false

        }
        this.addressList.AddressListInfo[index].isCheck = true
        this.addressShowDiplay.AddressListInfo[0] = this.addressList.AddressListInfo[index]
        localStorage.setItem('address', JSON.stringify(this.addressList))
        
    }
    else{
        console.log("thanh")
        for(let i = 0; i< this.listDeliveryAddress.DeliveryAddressList.length; i++){
            this.listDeliveryAddress.DeliveryAddressList[i].isCheck=false;
        }
        this.listDeliveryAddress.DeliveryAddressList[index].isCheck=true;
        this.listDeliveryAddressShow.DeliveryAddressList[0]=this.listDeliveryAddress.DeliveryAddressList[index]
        localStorage.setItem("addressDelivery",JSON.stringify(this.listDeliveryAddress))
    }
        

    }
    deliveryClick() {
        let dataSend = { function: 'Delivery', type: 'DELIVERY' };
        this.orderType = ORDER_DELIVERY;
        this.selectOrderTypeDeivery = true;
        this.selectOrderTypePickup = false
        localStorage.setItem("orderType", this.orderType)
        $('.login-dropdown').hide();
        $('.login-overlay').removeClass('show');
        $('.login-wrap .login').removeClass('hide-form');
        $('body').css({
            overflow: '',
            height: ''
        });;
        this._instanceService.sendCustomEvent(dataSend);
        this._route.navigateByUrl("/search-result")
    }
    pickupClick() {
        let dataSend = { function: 'Pickup', type: ORDER_PICKUP };
        this.orderType = ORDER_PICKUP;
        this.selectOrderTypeDeivery = false;
        this.selectOrderTypePickup = true
        localStorage.setItem("orderType", this.orderType)
        $('.login-dropdown').hide();
        $('.login-overlay').removeClass('show');
        $('.login-wrap .login').removeClass('hide-form');
        $('body').css({
            overflow: '',
            height: ''
        });;
        this._instanceService.sendCustomEvent(dataSend);
        this._route.navigateByUrl("/search-result")
    }
    getCurrentLocation() {
        if (window.navigator && window.navigator.geolocation) {
            this.blockUI.start();
            window.navigator.geolocation.getCurrentPosition(
                position => {

                    this.geolocationPosition = position,
                        
                    this._homeservice.getLocationAddress(position.coords.latitude, position.coords.longitude).then(data => {
                        var address = data["results"][0]["formatted_address"];
                        
                        this.inputChangeAddress = address
                        // var arraySplited = address.split(",");

                        this.lat = position.coords.latitude;
                        this.lng = position.coords.longitude;
                        localStorage.setItem('lat', this.lat + '');
                        localStorage.setItem('long', this.lng + '');
                        localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")
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
    saveChangeAddress() {
        
        if(localStorage.getItem("cus")!=null){
            this.addDeliveryAddress(this.inputChangeAddress)
            let location = this.lat + ',' + this.lng + "#_#_"
            let dataSendChangeAddreesV2 = { function: 'changeAddressV2', la: location };
            this.checkUserLoginChangeAddress();
            this._instanceService.sendCustomEvent(dataSendChangeAddreesV2);
        }
        else{
            if (localStorage.getItem("address") != null) {
            this.addressList = JSON.parse(localStorage.getItem("address"));
            for (let j = 0; j < this.addressList.AddressListInfo.length; j++) {
                this.addressList.AddressListInfo[j].isCheck = false;
            }

        }
        let item = new AddressIteModel();

        item.StreetAddress = this.inputChangeAddress;
        item.lat = this.lat + ''
        item.long = this.lng + ''
        item.isCheck = true;
        let arrayName = item.StreetAddress.split(',');
        item.Name = arrayName[0];
        this.addressList.AddressListInfo.push(item);
        this.addressShowDiplay.AddressListInfo.pop()
        
        this.addressShowDiplay.AddressListInfo.push(item)
        
        localStorage.setItem('address', JSON.stringify(this.addressList));
        $('.login-dropdown-step3').hide();
        $('.login-overlay').removeClass('show');
        $('.login-wrap .login').removeClass('hide-form');
        $('body').css({
            overflow: '',
            height: ''
        });;
        let location = this.lat + ',' + this.lng + "#_#_"
        let dataSendChangeAddreesV2 = { function: 'changeAddressV2', la: location };
        this._instanceService.sendCustomEvent(dataSendChangeAddreesV2);
        }
        

    }
     addDeliveryAddress(address:string) {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "AddDeliveryAddress";
        let common_data_json = JSON.stringify(common_data);

        let data_request = new AddeliveryAddressModel();
        data_request.Address = address
        data_request.ApartmentNoBuildingName =""
        data_request.InstructionForRider = ""
        data_request.Nickname = "";
        data_request.PhoneNumber = ""
        data_request.PostalCode = ""
        data_request.CustomerId = this.customerInfoMain.CustomerInfo[0].CustomerId + ''
        data_request.GeoLocation = this.lat + ',' + this.lng;
        let data_request_json = JSON.stringify(data_request);
         
        
        this._pickupService.AddDeliveryAddress(common_data_json, data_request_json).then(data => {
            
            if (data.ResultCode === '000') {
                let addressDelivery={AddressId:data.AddressId, GeoLocation:this.lat + ',' + this.lng,Address:this.inputChangeAddress}
                localStorage.setItem("addressDelivery",JSON.stringify(addressDelivery))
                $('.login-dropdown-step3').hide();
                $('.login-overlay').removeClass('show');
                $('.login-wrap .login').removeClass('hide-form');
                $('body').css({
                    overflow: '',
                    height: ''
                });;
               
            }
        })

    }
    checkShowPopup() {
        
        this.checkLoginUser();

        // if(this.isUserLogin===true){
        //     $('.login-dropdown-had').slideDown();
        //     //this.isUserLogin=!this.isUserLogin
        // }

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
                this.blockUI.stop()
                this._route.navigateByUrl('/home')
            }
        })
    }
    userLogin() {
        if (this.inutUserName !== '' || this.passWord !== '') {
            this.blockUI.start()
            this.customerInfoMain = new CustomerInfoMainModel();
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.AppId = "3.6"
            common_data.Location = _location
            common_data.ServiceName = "CheckLogon";
            let common_data_json = JSON.stringify(common_data);


            let requestData = new CheckLogonRequest();
            requestData.UserName = this.inutUserName
            requestData.Password = this.passWord;
            requestData.OTP = ""
            let requestDataJson = JSON.stringify(requestData)
            this._pickupService.CheckLogon(common_data_json, requestDataJson).then(data => {

                this.customerInfoMain = data;
                if(this.customerInfoMain.ResultCode==="000"){
                    localStorage.setItem("cus", this._gof3rUtil.encryptParams(JSON.stringify(this.customerInfoMain)))
                this.isLogin = this.customerInfoMain.CustomerInfo[0].CustomerName;
                $('.login-dropdown').hide();
                $('.login-overlay').removeClass('show');
                $('.login-wrap .login').removeClass('hide-form');
                $('body').css({
                    overflow: '',
                    height: ''
                });;
                this.blockUI.stop()
            }
            else{
                this.error.ResultDesc=this.customerInfoMain.ResultDesc;
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
    GetCurrentSystemTime() {
        this.getCurrentTime = new GetCurrentSystemTimeModel();

        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetCurrentSystemTime";
        let common_data_json = JSON.stringify(common_data);

        let dataRequest = new GetCurrentSystemTimeRequest();
        let dataRequestJson = JSON.stringify(dataRequest);
        this._pickupService.GetCurrentSystemTime(common_data_json, dataRequestJson).then(data => {

            let d = new Date(+data.CurrentTimeMillis);
            let date = moment_(d).format("DD/MM/YYYY")
            this.currentDate=date;
            let time = d.toLocaleTimeString();
            
            this.getCurrentTime.CurrentData = date;
            this.getCurrentTime.CurrentTime = moment_(d.getTime()).format("HH:mm:ss")
            this.getCurrentTime.CurrentTimeMillis = data.CurrentTimeMillis;
            this.getCurrentTime.ResultCode = data.ResultCode;
            this.getCurrentTime.ResultDesc = data.ResultDesc;
            this.getCurrentTime.ServiceName = data.ServiceName;
            this.getCurrentTime.CurrentTimeTo = moment_(d.getTime()).add(30, "minutes").format("HH:mm");
            let hours = parseInt(moment_(d.getTime()).format("HH"));
            let minutes = parseInt(moment_(d.getTime()).format("mm"));
            let round = this.roundTime(hours, minutes, 5);
            let dateAdd = moment_(this.getCurrentTime.CurrentTime, "HH:mm").add(ADD_MINUTE_TIME_FROM_SERVER, "minutes");
            let roundTime = this.roundTime(dateAdd.hours(), dateAdd.minutes(), 15);
            
            this.whenStr = this.tConvert(moment_(roundTime).format('HH:mm'));
            localStorage.setItem("whenDelivery",moment_(roundTime).format("DD/MM/YYYY :HH:mm:ss"))
            this.loadDateDelivery(d);

        })
    }
    tConvert(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }
    roundTime(hours, minutes, minutesToRound) {

        // Convert hours and minutes to minutes
        let time = (hours * 60) + minutes;
        let rounded = Math.round(time / minutesToRound) * minutesToRound;

        let roundedHours = Math.floor(rounded / 60)
        let roundedMinutes = rounded % 60
        if (roundedMinutes > 15 && roundedMinutes < 30) {
            roundedMinutes = 30;
        } else {
            if (roundedMinutes > 30 && roundedMinutes < 45) {
                roundedMinutes = 45
            }
            else {
                if (roundedMinutes > 45) {
                    roundedMinutes = 0
                }
            }
        }
        let roundDate = new Date();
        roundDate.setHours(roundedHours)
        roundDate.setMinutes(roundedMinutes)

        return roundDate
    }
    addDays(date: Date, days: number): Date {
        date.setDate(date.getDate() + days);
        return date;
    }
    loadDateDelivery(currentDate:Date) {
        this.arrayDateDelivery1 = new DeliveryDateModle();
        this.arrayDateDelivery2 = new DeliveryDateModle();
        this.DateDeliveryList = new DeliveryMainModel();
        let arrayDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let _date = new Date();
        
        for (let i = 0; i <= 6; i++) {
            let itemDate = new DeliveryItemModel();
            if (i == 0) {
                _date = this.addDays(_date, 0);
            }
            else
                _date = this.addDays(_date, 1);
           
                itemDate.DateTtr = moment_(_date).format("DD/MM/YYYY");
                itemDate.DayStrs = arrayDays[moment_(_date).days()];
                itemDate.DayStr1 = moment_(_date).date() + '';
                if (moment_(_date).date() == moment_(currentDate).date()) {
                    itemDate.isToday = true;
                }
                this.arrayDateDelivery1.arraydate.push(itemDate);
                this.arrayDateDelivery1.Month = moment_(_date).format("MMM")

           

        }
        this.DateDeliveryList.DateList.push(this.arrayDateDelivery1)
        this.DateDeliveryList.DateList.push(this.arrayDateDelivery2)
        this.haveDateList=true
        

    }
    createTimesDelivery(startTimes: any, endTimes: any, isToday: boolean,date:string) {
        //let nowDate = this.getCurrentTime.CurrentTime;
        let nowDateTemp = moment_(startTimes, "HH:mm:ss");
        let endDateTemp = moment_(END_TIME_LIMIT, "HH:mm:ss")
        while (nowDateTemp.isBefore(endDateTemp)) {
            if (moment_(nowDateTemp, "HH:mm").add(ADD_MINUTE_TIME_FROM_SERVER, "minutes").isBefore(endDateTemp)) {
                let dateAdd = moment_(nowDateTemp, "HH:mm").add(ADD_MINUTE_TIME_FROM_SERVER, "minutes");
                
                let roundTime = this.roundTime(dateAdd.hours(), dateAdd.minutes(), 15);
                let jsonDate = { label: moment_(roundTime).format('HH:mm'), value:date+" "+ moment_(roundTime).format('HH:mm:ss') }
                this.timesDelivery.push(jsonDate);
                nowDateTemp = moment_(nowDateTemp, "HH:mm").add(ADD_MINUTE_TIME_AFTER_FROM_SERVER, "minutes")
            }
            else {
                break
            }

        }
        this.showWhen=true
        
        //this.whenStr = this.timesDelivery[0].label;
        
        
    }
    createTimesPickup(startTimes: any, endTimes: any, isToday: boolean,date:string) {
        //let nowDate = this.getCurrentTime.CurrentTime;
        let nowDateTemp = moment_(startTimes, "HH:mm:ss");
        let endDateTemp = moment_(END_TIME_LIMIT, "HH:mm:ss")
        
        while (nowDateTemp.isBefore(endDateTemp)) {
            
                let dateAdd = moment_(nowDateTemp, "HH:mm");
                
                let roundTime = this.roundTime(dateAdd.hours(), dateAdd.minutes(), 5);
                let timeNext = moment_(roundTime,"HH:mm").add(30,"minutes");
                let jsonDate = { label:this.tConvert(moment_(roundTime).format('HH:mm')) +" - "+this.tConvert(moment_(timeNext).format('HH:mm')), value:date+" "+ moment_(roundTime).format('HH:mm:ss'),fromDate: date+" "+ moment_(roundTime).format('HH:mm:ss'),toDate:date+" "+ moment_(timeNext).format('HH:mm:ss'),fromDateDisplay:date+" "+this.tConvert(moment_(roundTime).format('HH:mm')),toDateDisplay:date+" "+this.tConvert(moment_(timeNext).format('HH:mm'))}
                this.timesPickup.push(jsonDate);
                nowDateTemp = moment_(timeNext, "HH:mm").add(ADD_MINUTE_TIME_AFTER_FROM_SERVER, "minutes")
            

        }
        this.showWhen=true
        
        //this.whenStr = this.timesDelivery[0].label;
        
        
    }
    loadTimesDelivery(isToday: boolean,date:string) {
        this.timesDelivery= [];
        this.getCurrentTime = new GetCurrentSystemTimeModel();
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetCurrentSystemTime";
        let common_data_json = JSON.stringify(common_data);

        let dataRequest = new GetCurrentSystemTimeRequest();
        let dataRequestJson = JSON.stringify(dataRequest);
        this._pickupService.GetCurrentSystemTime(common_data_json, dataRequestJson).then(data => {
            let d = new Date(+data.CurrentTimeMillis);
            
            let startTime = moment_(d).format("HH:mm:ss")
            let date = moment_(d).format("DD/MM/YYYY")
            
            if (isToday){
                let [h,m,s]=startTime.split(":");
                if(parseInt(h)<8){
                    startTime="08:00:00";
                }
                this.createTimesDelivery(startTime, END_TIME_LIMIT, isToday,date)
            }
            else {
                let [h, m, s] = START_TIME_LIMINT.split(":");
                let _date = new Date();
                _date.setHours(parseInt(h));
                _date.setMinutes(parseInt(m));
                _date.setSeconds(parseInt(s));
                let startTime = moment_(_date).format("HH:mm:ss")
                this.createTimesDelivery(startTime, END_TIME_LIMIT, isToday,date)
            }
        })

    }
    loadTimesDeliveryPickup(isToday: boolean,dateInput:string) {
        this.timesPickup= [];
        
        this.getCurrentTime = new GetCurrentSystemTimeModel();
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetCurrentSystemTime";
        let common_data_json = JSON.stringify(common_data);

        let dataRequest = new GetCurrentSystemTimeRequest();
        let dataRequestJson = JSON.stringify(dataRequest);
        this._pickupService.GetCurrentSystemTime(common_data_json, dataRequestJson).then(data => {
            let d = new Date(+data.CurrentTimeMillis);
            let startTime = "08:00:00"
             let date = moment_(d).format("DD/MM/YYYY")
            
            if (isToday){
                this.createTimesPickup(startTime, END_TIME_LIMIT, isToday,date)
            }
            else {
                let [h, m, s] = START_TIME_LIMINT.split(":");
                let _date = new Date();
                _date.setHours(parseInt(h));
                _date.setMinutes(parseInt(m));
                _date.setSeconds(parseInt(s));
                let startTime = moment_(_date).format("HH:mm:ss")
                this.createTimesPickup(startTime, END_TIME_LIMIT, isToday,dateInput)
            }
        })

    }
    selectTime(value:string,label:string){
        let dataSend = { function: 'changeTime', date: value };
        this.whenStr=this.tConvert(label);
        localStorage.setItem("whenDelivery",value)
        $('.login-dropdown').hide();
        $('.login-overlay').removeClass('show');
        $('.login-wrap .login').removeClass('hide-form');
        $('body').css({
            overflow: '',
            height: ''
        });;
        this._instanceService.sendCustomEvent(dataSend);
    }
    selectTimePickup(fromDate:string,toDate:string,fromDateDisplay:string,toDateDisplay:string){
        
        let dataSend = { function: 'updateTimePickup', fromDate: fromDate,toDate:toDate,fromDateDisplay:fromDateDisplay,toDateDisplay:toDateDisplay };
        $('.login-dropdown').hide();
        $('.login-overlay').removeClass('show');
        $('.login-wrap .login').removeClass('hide-form');
        $('body').css({
            overflow: '',
            height: ''
        });;
        this._instanceService.sendCustomEvent(dataSend);
    }
     RegisterOPT() {


        if(this.signUp.Password===this.signUp.ConfrimPassword){
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
            console.log("RegisterOPT"+ JSON.stringify(this.responseData))
            if (this.responseData.ResultCode == "000") {
                let requestRegister = new RequestRegisterCustomerModel();
                requestRegister.CustomerName = this.signUp.FullName;
                requestRegister.Email = this.signUp.Email
                requestRegister.Mobile =this.signUp.PhoneCode+ this.signUp.PhoneNumber;
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
    else{
        this.error.ResultDesc="The password is not match"
        this.showPopupPaymentSuccess();
    }

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
        requestRegister.Mobile =this.signUp.PhoneCode+ this.signUp.PhoneNumber
        requestRegister.OTP = otp
        requestRegister.Password = this.signUp.Password
        let request_data_json = JSON.stringify(requestRegister);

        this._pickupService.RegisterCustomer(common_data_json, request_data_json).then(data => {
            this.customerInfoMain = data;

            if (this.customerInfoMain.ResultCode == "000") {
                // this._instanceService.sendCustomEvent(this.customerLoginMain.CustomerInfo[0].UserName);
                // this._router.navigateByUrl('/login')
                $('.signup-dropdown-otp').hide();
                $('.loginform-dropdown').fadeIn();
                this.getInitParam();
                this.blockUI.stop();
            }
            else{
                this.error.ResultDesc=this.customerInfoMain.ResultDesc;
                this.showPopupPaymentSuccess();
                this.blockUI.stop()
            }
        })
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
            
            for(let i = 0; i< this.getInitialParams.CountryInfo.length; i++){
               
                if(this.getInitialParams.CountryInfo[i].CountryCode==="65"){
                    this.signUp.PhoneCode="+"+this.getInitialParams.CountryInfo[i].CountryCode;
                }
            }
            //this.haveDataInit=true
            localStorage.setItem("IN", this._gof3rUtil.encryptParams(JSON.stringify(this.getInitialParams)));

            //this.blockUI.stop()
        });
    }
    accountClick(){
        this._instanceService.sendCustomEvent("")
        this._instanceService.sendCustomEvent("MyProfile");
        this._route.navigateByUrl("/account")
        ///this.router.navigate(["/account"])
    }
    orderHistoryClick(){
        this._instanceService.sendCustomEvent("")
        this._instanceService.sendCustomEvent("OrderHistory");
        this._route.navigateByUrl("/order-history")
    }
    inviteFriend(){
        this._instanceService.sendCustomEvent("")
        this._instanceService.sendCustomEvent("Invite");
        this._route.navigateByUrl("/invite");
    }
    help(){
        this._instanceService.sendCustomEvent("")
        this._instanceService.sendCustomEvent("Help");
        this._route.navigateByUrl("/help");
    }
    closeInfor(){
         $('.login-dropdown').hide();
        $('.login-overlay').removeClass('show');
        $('.login-wrap .login').removeClass('hide-form');
        $('body').css({
            overflow: '',
            height: ''
        });;
    }
    showSelectCountry(){
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
    selectCountry(countryCode:string){
        this.selectCountryCode="+"+countryCode;;
       
    }
    closeCountry(){
         this.signUp.PhoneCode=this.selectCountryCode;
        $.magnificPopup.close()
    }
}