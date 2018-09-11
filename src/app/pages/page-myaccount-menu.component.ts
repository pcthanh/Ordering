import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Params,Router } from "@angular/router";
import { EventSubscribeService } from "../services/instance.service";
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
    constructor(private route:Router,private instaneService:EventSubscribeService) { 
        this.instaneService.$getEventSubject.subscribe(data=>{
            console.log("Dataxxx:"+ data)
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
    }
     initJQuery(){
        $('body').css({
                    overflow: '',
                    height: ''
                });;
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
}