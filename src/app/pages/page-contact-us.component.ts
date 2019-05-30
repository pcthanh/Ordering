import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
import { SendGetInTouchModel } from "../models/SendGetInTouchModel";
import { SendGetInTouchRequest } from "../models-request/send_get_in_touch_request";
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { NgBlockUI,BlockUI } from "ng-block-ui";
declare var $: any;
@Component({
    selector: 'contact-us',
    templateUrl: 'page-contact-us.component.html'
})

export class ContactUsComponent implements OnInit {
    sendToucht:SendGetInTouchModel;
    message: string = "";
     @BlockUI() blockUI: NgBlockUI;
    constructor(private _instanceService:EventSubscribeService,private _pickupService:PickupService) { 
        this.sendToucht= new SendGetInTouchModel();
    }

    ngOnInit() { 
        window.scrollTo(0,0);
        this._instanceService.sendCustomEvent("ContactUS")
    }
    sendTouchRequest(){
        if(this.sendToucht.FullName !="" && this.sendToucht.Email!="" && this.sendToucht.Phone!="" && this.sendToucht.Content!=""){
            this.blockUI.start();
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "SendGetInTouchRequest";
            let common_data_json = JSON.stringify(common_data);

            let data_request = new SendGetInTouchRequest();
            data_request.Content = this.sendToucht.Content;
            data_request.Email= this.sendToucht.Email
            data_request.FullName= this.sendToucht.FullName;
            data_request.Phone= this.sendToucht.Phone;
            let data_request_json = JSON.stringify(data_request);
            this._pickupService.SendGetInTouchRequest(common_data_json,data_request_json).then(data=>{
                if(data.ResultCode==="000"){
                    this.message="Thank You! We’ll be in touch soon."
                    this.sendToucht = new SendGetInTouchModel();
                     this.showSuccess();
                    this.blockUI.stop()
                }
                else{
                    this.message= data.ResultDesc;
                    this.showSuccess();
                    this.blockUI.stop()
                }
            })
        }
        else{
            this.message="Please input fill data."
            this.showSuccess()
        }
    }
    showSuccess() {
        var el = $('#success-popup-contact');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
}