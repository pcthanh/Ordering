import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Params,Router } from "@angular/router";
import { EventSubscribeService } from "../services/instance.service";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { Gof3rUtil } from "../util/gof3r-util";
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { UpdateProfileRequest } from "../models-request/update-profile";
import * as moment_ from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var $:any;
@Component({
    selector: 'page-account',
    templateUrl: 'page-account.component.html'
})

export class AccountComponent implements OnInit {
    customerInfoMain: CustomerInfoMainModel;
    isHaveDate:boolean=false;
     value: Date;
    gender:string;
    @BlockUI() blockUI: NgBlockUI;
    isChangeBod:boolean=false;
    mess:string=""
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
           
        }
        else {
           
        }
    }
    selectGender(g:string){
        this.gender=g;
       
    }
    updateProfile(){
        this.blockUI.start();
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
        
        if(this.customerInfoMain.CustomerInfo[0].Dob.toString().indexOf("/")>-1){
            request_data.Dob=this.customerInfoMain.CustomerInfo[0].Dob.toString();
        }
        else{
            let d:Date =this.customerInfoMain.CustomerInfo[0].Dob;
            
            request_data.Dob= moment_(d).format("DD/MM/YYYY");
        }
        
        request_data.Email=this.customerInfoMain.CustomerInfo[0].Email
        request_data.EnabledMerchantCategoryList=""
        if(this.gender!=""){
            request_data.Gender=this.gender;
        }
        else{
            request_data.Gender=this.customerInfoMain.CustomerInfo[0].Gender;
        }
        
        request_data.IdNumber=this.customerInfoMain.CustomerInfo[0].IdNumber;
        request_data.MaritalStatus=this.customerInfoMain.CustomerInfo[0].MaritalStatus
        request_data.Mobile=this.customerInfoMain.CustomerInfo[0].Mobile
        let request_data_json= JSON.stringify(request_data);
        
        this._pickupService.UpdateCustomer(common_data_json,request_data_json).then(data=>{
           
            if(data.ResultCode==="000"){
                this.customerInfoMain=data;
                localStorage.setItem("cus",this._gof3rUtil.encryptParams(JSON.stringify(this.customerInfoMain)));
                this.mess="Update Profile Success."
                this.blockUI.stop();
                this.showPopupPaymentSuccess();
                this._instaneService.sendCustomEvent("UpdateProfile");
            }
            else{
                this.mess="Update Profile Fail."
                this.blockUI.stop();
                this.showPopupPaymentSuccess();
            }
        })
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
    changeBOD(){
        this.isChangeBod=true;
       
    }
}