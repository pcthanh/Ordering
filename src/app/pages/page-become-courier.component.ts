import { Component, OnInit } from '@angular/core';
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { Area } from "../models/Area";
import { ListArea } from "../models/ListArea";
import { SelectItem } from 'primeng/primeng';
import { NgBlockUI,BlockUI } from "ng-block-ui";
declare var $: any;
@Component({
    selector: 'become-courier',
    templateUrl: 'page-become-courier.component.html'
})

export class BecomeCourierComponent implements OnInit {
    lstArea: ListArea[] = [];
    area1: SelectItem[] = [];
    selectedArea: string = "";
    responseArea: Area;
    cities;
    fullName: string = "";
    phoneNumber: string = "";
    email: string = ""
    message: string = "";
    @BlockUI() blockUI: NgBlockUI;
    constructor(private _pickupService: PickupService) {
        this.responseArea = new Area();
        this.GetOutletListByLocation();
        //  this.area1 = [
        //     {label: 'Audi', value: 'Audi'},
        //     {label: 'BMW', value: 'BMW'},
        //     {label: 'Fiat', value: 'Fiat'},
        //     {label: 'Ford', value: 'Ford'},
        //     {label: 'Honda', value: 'Honda'},
        //     {label: 'Jaguar', value: 'Jaguar'},
        //     {label: 'Mercedes', value: 'Mercedes'},
        //     {label: 'Renault', value: 'Renault'},
        //     {label: 'VW', value: 'VW'},
        //     {label: 'Volvo', value: 'Volvo'}
        // ];
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        $('html,body').animate({
            scrollTop: $(".header-wrap").offset().top
        });
        this.scroll()

    }
    scroll() {
        $("#btnStart").click(function () {
            $('html, body').animate({
                scrollTop: $(".restourant-apply-wrap").offset().top
            }, 1000);
        });
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

            this.responseArea = data;
            
            for (let i = 0; i < this.responseArea.MerchantOutletList.length; i++) {
                let item = new ListArea;
                item.name = this.responseArea.MerchantOutletList[i].LocationName;
                item.code = this.responseArea.MerchantOutletList[i].LocationCode;
                this.area1.push({ label: item.name, value: item.name });
            }

        })
    }
    sendToServer() {
        
        if (this.email != "" && this.phoneNumber != "" && this.fullName != "" && this.email != "" && this.selectedArea!="") {
            this.blockUI.start();
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "AddRiderContact";
            let common_data_json = JSON.stringify(common_data);

            let request_data = { Lang: "en", Email: this.email, DesiredWorkingCluster: this.selectedArea, Phone: this.phoneNumber, Name: this.fullName };
            let request_data_json = JSON.stringify(request_data);
            this._pickupService.AddRiderContact(common_data_json, request_data_json).then(data => {
                
                if (data.ResultCode === "000") {
                    this.message = "Thank You! We’ll be in touch soon."
                    this.email = "";
                    this.selectedArea = "";
                    this.phoneNumber = "";
                    this.fullName = ""
                    this.showSuccess();
                    this.blockUI.stop();
                }
                else {
                    this.message = data.ResultDesc;
                    this.showSuccess();
                }

            })
        }
        else {
            this.message="Please input fill data."
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