import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { NgBlockUI, BlockUI } from "ng-block-ui";
import { MerchantContact } from "../models/MerchantContact";
import { MerchantContactRequest } from "../models-request/merchantcontact_request";
declare var $: any;
@Component({
    selector: 'restaurant-owner',
    templateUrl: 'page-restaurant-owners.component.html'
})

export class RetaurantOwnerComponent implements OnInit {
    merchantContact: MerchantContact;
    merchantContactRequest: MerchantContactRequest;
    message: string = "";
    @BlockUI() blockUI: NgBlockUI;
    constructor(private _instanceService: EventSubscribeService, private _pickupService: PickupService) {
        this.merchantContact = new MerchantContact();
        this._instanceService.$getEventSubject.subscribe(data => {
            window.scrollTo(0, 0);
        })
        window.scrollTo(0, 0);
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.initButton()
        $('html,body').animate({
            scrollTop: $(".header-wrap").offset().top
        });

    }
    initButton() {
        $("#btnStart").click(function () {

            $('html,body').animate({
                scrollTop: $(".form-apply").offset().top
            },
                'slow');
        });
    }
    sendToServer() {
        if (this.merchantContact.ContactEmail != "" && this.merchantContact.ContactName != "" && this.merchantContact.ContactPhone != "" && this.merchantContact.Notes != "" && this.merchantContact.RestaurantAddress != "" && this.merchantContact.RestaurantName != "") {
            this.blockUI.start();
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "AddMerchantContact";
            let common_data_json = JSON.stringify(common_data);
            let data_request = new MerchantContactRequest()
            data_request.RestaurantAddress = this.merchantContact.RestaurantAddress;
            data_request.ContactPhone = this.merchantContact.ContactPhone;
            data_request.ContactEmail = this.merchantContact.ContactEmail;
            data_request.RestaurantName = this.merchantContact.RestaurantName;
            data_request.ContactName = this.merchantContact.ContactName;
            data_request.Notes = this.merchantContact.Notes;
            let data_request_json = JSON.stringify(data_request);
            this._pickupService.AddMerchantContact(common_data_json, data_request_json).then(data => {
                console.log("merchants:"+ JSON.stringify(data))
                if (data.ResultCode === "000") {
                    this.message = "Thank You! We’ll be in touch soon."
                    this.merchantContact = new MerchantContact();
                    this.showSuccess();
                    this.blockUI.stop();
                }
                else {
                    this.message = data.ResultDesc;
                    this.blockUI.stop()
                    this.showSuccess()
                }
            })
        }
        else {
            this.message = "Please input fill data."
            this.showSuccess()
        }
    }
    showSuccess() {
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
}