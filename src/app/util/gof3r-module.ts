import { Injectable, Inject, Injector } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { CommonDataRequest } from "../models-request/request-comon-data";
import { RequestLogOutModel } from "../models-request/request-log-out-customer";
import { PickupService } from "../services/pickup.service";
import { Router } from "@angular/router";
import { ResponseModel } from "../models/Response";
const ORDER_PICKUP:string="PICKUP"
const ORDER_DELIVERY:string="DELIVERY"
@Injectable()
export class Gof3rModule {
    response:ResponseModel;
    constructor(private _pickupService: PickupService, private _router: Router) {

    }

    logOutCustomer(userName):string {
        this.response= new ResponseModel();
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "Logout";
        var common_data_json = JSON.stringify(common_data);

        let result:string="";
        let dataRequest = new RequestLogOutModel();
        dataRequest.UserName = userName;
        let requestDataJson = JSON.stringify(dataRequest);
        this._pickupService.LogOutCustomer(common_data_json, requestDataJson).then(data => {
            console.log('outethanh:'+ data.ResultCode)
            this.response= data
            console.log('thanh:'+this.response.ResultCode)
             localStorage.clear()
             result= "000";
             return result;
            //this._router.navigateByUrl('/logout-success')
        })
        return result;
    }
    checkInvalidSessionUser(responseCode) {
        if (responseCode == "013") {
           localStorage.clear()
        
            this._router.navigateByUrl('/home')
            
        }

    }
    ParseTo12(n1: number): string {
        let total = (n1) * 100 + '';
        let lengthTotal = 12 - total.length;
        let totalStr = "";
        for (let i = 0; i < lengthTotal; i++) {
            totalStr = totalStr + "0";
        }
        let totalRequest = totalStr + total;
        return totalRequest
    }
    getRandom(length): string {

        return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();

    }
    checServiceLinkTo(orderType:string){
        console.log('checServiceLinkTo:'+ orderType)
        if(orderType===ORDER_PICKUP){
            this._router.navigateByUrl('/pickup-my-order')
        }
        else{
            this._router.navigateByUrl('/delivery-my-order')
        }
    }
     checkImageExists(imageUrl, callBack) {
        var imageData = new Image();
        imageData.onload = function () {
            callBack(true);
        };
        imageData.onerror = function () {
            callBack(false);
        };
        imageData.src = imageUrl;
    }
}