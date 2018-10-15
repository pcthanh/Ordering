import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Params,Router } from "@angular/router";
import { EventSubscribeService } from "../services/instance.service";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { Gof3rUtil } from "../util/gof3r-util";
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { RequestLogOutModel } from "../models-request/request-log-out-customer";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var $ :any
@Component({
    selector: 'myaccount-menu',
    templateUrl: 'page-myaccount-menu.component.html'
})

export class MyAccountMenuComponent implements OnInit {
    isMyProfile:boolean=false;
    isPaymentOption:boolean=false;
    isDeliveryAddress:boolean=false;
    isOrderHistory:boolean=false;
    isReferFriend:boolean=false;
    isSetting:boolean=false;
    isHelp:boolean=false;
    isOrderHistoryPickup:boolean=false;
    customerInfoMain: CustomerInfoMainModel;
     @BlockUI() blockUI: NgBlockUI;
    constructor(private route:Router,private instaneService:EventSubscribeService,private _pickupService:PickupService,private _gof3rUtil: Gof3rUtil) { 
        this.customerInfoMain= new CustomerInfoMainModel();
        this.instaneService.$getEventSubject.subscribe(data=>{
            
            if(data==="MyProfile"){
                this.isMyProfile=true;
            }
            if(data==="OrderHistory"){
                this.isOrderHistory=true;
            }
            if(data==="Invite"){
                this.isReferFriend=true
            }
            if(data==="Help"){
                this.isHelp=true;
            }
            if(data==="PaymentOption"){
                this.isPaymentOption=true;
            }
            if(data==="DeliveryAddress"){
                this.isDeliveryAddress=true
            }
            if(data==="OrderHistoryPickup"){
                this.isOrderHistoryPickup=true
            }
            
        })
    }

    ngOnInit() { 
        this.initJQuery()
        this.checkLoginUser();
    }
     initJQuery(){
        $('body').css({
                    overflow: '',
                    height: ''
                });;
    }
    checkLoginUser() {
        if (localStorage.getItem("cus") != null) {
            this.customerInfoMain= JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("cus")));
            // this.isHaveDate=true;
            
        }
        else {
           
            
        }
    }
    accountClick(){
        this.isMyProfile=true;
        this.isPaymentOption=false;
        this.isDeliveryAddress=false;
        this.isOrderHistory=false;
        this.isReferFriend=false;
        this.isSetting=false;
        this.isHelp=false;
        this.isOrderHistoryPickup=false;
        this.instaneService.sendCustomEvent('');
        this.route.navigateByUrl("/account")
    }
    orderHistoryClick(){
        this.isMyProfile=false;
        this.isPaymentOption=false;
        this.isDeliveryAddress=false;
        this.isOrderHistory=true;
        this.isReferFriend=false;
        this.isSetting=false;
        this.isHelp=false;
        this.isOrderHistoryPickup=false;
        this.instaneService.sendCustomEvent('');
        this.route.navigateByUrl("/order-history")
    }
    inviteFriendClick(){
        this.isMyProfile=false;
        this.isPaymentOption=false;
        this.isDeliveryAddress=false;
        this.isOrderHistory=false;
        this.isReferFriend=true;
        this.isSetting=false;
        this.isHelp=false;
        this.isOrderHistoryPickup=false;
        this.instaneService.sendCustomEvent('');
        this.route.navigateByUrl("/invite")
    }
    helpClick(){
        this.isMyProfile=false;
        this.isPaymentOption=false;
        this.isDeliveryAddress=false;
        this.isOrderHistory=false;
        this.isReferFriend=false;
        this.isSetting=false;
        this.isHelp=true;
        this.isOrderHistoryPickup=false;
        this.instaneService.sendCustomEvent('');
        this.route.navigateByUrl("/help")
    }
    paymentOptionClick(){
        this.isMyProfile=false;
        this.isPaymentOption=true;
        this.isDeliveryAddress=false;
        this.isOrderHistory=false;
        this.isReferFriend=false;
        this.isSetting=false;
        this.isHelp=false;
        this.isOrderHistoryPickup=false;
        this.instaneService.sendCustomEvent('');
        this.route.navigateByUrl("/payment-option")
    }
    deliveryAddressClick(){
        this.isMyProfile=false;
        this.isPaymentOption=false;
        this.isDeliveryAddress=true;
        this.isOrderHistory=false;
        this.isReferFriend=false;
        this.isSetting=false;
        this.isHelp=false;
        this.isOrderHistoryPickup=false;
        this.instaneService.sendCustomEvent('');
        this.route.navigateByUrl("/delivery-address")
    }
    orderHistoryPickup(){
        this.isMyProfile=false;
        this.isPaymentOption=false;
        this.isDeliveryAddress=false;
        this.isOrderHistory=false;
        this.isReferFriend=false;
        this.isSetting=false;
        this.isHelp=false;
        this.isOrderHistoryPickup=true;
        this.instaneService.sendCustomEvent('');
        this.route.navigateByUrl("/order-history-pickup")
    }
    logOut(userName:string){
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
                // $('.login-dropdown-had').hide();
                // $('.login-overlay').removeClass('show');
                // $('.login-wrap .login').removeClass('hide-form');
                // $('body').css({
                //     overflow: '',
                //     height: ''
                // });;
                
                localStorage.clear();
                // this.isLogin = "LOG IN"
                this.blockUI.stop()
                this.route.navigateByUrl('/home')
            }
        })
    }
}