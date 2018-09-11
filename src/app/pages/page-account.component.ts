import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Params,Router } from "@angular/router";
import { EventSubscribeService } from "../services/instance.service";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { Gof3rUtil } from "../util/gof3r-util";
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { UpdateProfileRequest } from "../models-request/update-profile";
declare var $:any;
@Component({
    selector: 'page-account',
    templateUrl: 'page-account.component.html'
})

export class AccountComponent implements OnInit {
    customerInfoMain: CustomerInfoMainModel;
    isHaveDate:boolean=false;
    constructor(private _pickupService:PickupService,private route:Router,private _instaneService:EventSubscribeService,private _gof3rUtil: Gof3rUtil) { 
        this.customerInfoMain= new CustomerInfoMainModel();
    }

    ngOnInit() {
        
        this._instaneService.sendCustomEvent("MyProfile")
        this.checkLoginUser()
    }
   
    checkLoginUser() {
        if (localStorage.getItem("cus") != null) {
            this.customerInfoMain = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("cus")));
            this.isHaveDate=true;
            console.log("hjj:"+ JSON.stringify(this.customerInfoMain))
        }
        else {
            console.log('null')
            
        }
    }
    updateProfile(){
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "UpdateCustomer";
        let common_data_json = JSON.stringify(common_data);

        let request_data = new UpdateProfileRequest();
        request_data.Address=this.customerInfoMain.CustomerInfo[0].Address;
        request_data.CityCode=this.customerInfoMain.CustomerInfo[0].CityCode;
        request_data.CountryCode=this.customerInfoMain.CustomerInfo[0].CountryCode;
        request_data.CustomerId=this.customerInfoMain.CustomerInfo[0].CustomerId+''
        request_data.CustomerName=this.customerInfoMain.CustomerInfo[0].CustomerName
        request_data.DisabledMerchantCategoryList=""
        request_data.Dob=this.customerInfoMain.CustomerInfo[0].Dob;
        request_data.Email=this.customerInfoMain.CustomerInfo[0].Email
        request_data.EnabledMerchantCategoryList=""
        request_data.Gender=this.customerInfoMain.CustomerInfo[0].Gender;
        request_data.IdNumber=this.customerInfoMain.CustomerInfo[0].IdNumber;
        request_data.MaritalStatus=this.customerInfoMain.CustomerInfo[0].MaritalStatus
        request_data.Mobile=this.customerInfoMain.CustomerInfo[0].Mobile
        let request_data_json= JSON.stringify(request_data);
        console.log("request_data:"+ request_data_json);
        this._pickupService.UpdateCustomer(common_data_json,request_data_json).then(data=>{
            console.log(JSON.stringify(data))
        })
    }
}