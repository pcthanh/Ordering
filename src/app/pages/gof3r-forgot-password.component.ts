import { Component, OnInit } from '@angular/core';
import { SearchUserByEmailOrPhone } from "../models/SearchUserByEmailOrPhone";
import { SearchUserByEmailOrPhoneModel } from "../models-request/search-user-by-email-phone";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { PickupService } from "../services/pickup.service";
import { Gof3rUtil } from "../util/gof3r-util";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ResponseModel } from "../models/Response";
import { ActivatedRoute, Params, Router } from "@angular/router";

@Component({
    selector: 'forgot-password',
    templateUrl: 'gof3r-forgot-password.component.html'
})

export class FotgotPasswordComponent implements OnInit {
    showStep1: boolean = true;
    showStep2: boolean = false;
    showStep3: boolean = false;
    inputEmailStr: string = ""
    checkMethod: boolean;
    newPassword: string = "";
    confirmPassword: string = "";
    resetCode: string = ""
    customerIdTemp: string = ""
    errorClass: number = 0;
    errorNewPassword: number = 0;
    errorConfirmPassword: number = 0;
    errorOtp: number = 0;
    showErrorStep1:boolean=false;
    showErrorStep2:boolean=false;
    showErrorStep3:boolean=false;
    response:ResponseModel;
    @BlockUI() blockUI: NgBlockUI;
    searchByEmailOrPhone: SearchUserByEmailOrPhone
    constructor(private _pickupService: PickupService, private _goferUtil: Gof3rUtil,private _route:Router) {
        this.searchByEmailOrPhone = new SearchUserByEmailOrPhone();

    }

    ngOnInit() {

    }
    checkUserName() {
        this.blockUI.start();
        if (this.inputEmailStr !== '') {
            this.searchByEmailOrPhone = new SearchUserByEmailOrPhone();
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "SearchUserByEmailOrPhone";
            let common_data_json = JSON.stringify(common_data);

            let dataRequest = new SearchUserByEmailOrPhoneModel();
            dataRequest.EmailOrMobile = this.inputEmailStr;
            let requestDataJson = JSON.stringify(dataRequest);
            this._pickupService.SearchUserByEmailOrPhone(common_data_json, requestDataJson).then(data => {
                this.searchByEmailOrPhone = data;
               
                if (this.searchByEmailOrPhone.ResultCode == '000') {
                    this.customerIdTemp = this.searchByEmailOrPhone.CustomerId + '';
                    this.showStep1 = false;
                    this.showStep2 = true
                    this.blockUI.stop();
                }
                else {
                    this.showErrorStep1=true;
                    this.response= new ResponseModel();
                    this.response=data;
                    this.blockUI.stop();
                }
            })
        }
        else {
            this.errorClass = 1;
            this.blockUI.stop();
        }

    }
    selectMethodSendCode(customerID: string) {
        
        this.response= new ResponseModel();
        if (this.checkMethod !== undefined) {
            
            this.blockUI.start();
            this.searchByEmailOrPhone = new SearchUserByEmailOrPhone();
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "GetResetUserPasswordCode";
            let common_data_json = JSON.stringify(common_data);

            let methodName: string = "";
            if (this.checkMethod === true) {
                methodName = "EMAIL"
            }
            else {
                methodName = "PHONE";
            }
            
            let data_request = { ReceiveResetUserPasswordCodeBy: methodName, CustomerId: customerID }
            let data_request_json = JSON.stringify(data_request);
            
            this._pickupService.GetResetUserPasswordCode(common_data_json, data_request_json).then(data => {
                
                if (data.ResultCode === "000") {
                    this.showStep2 = false;
                    this.showStep3 = true;
                    this.blockUI.stop();
                }
                else{
                    this.showErrorStep2=true;
                    this.response.ResultDesc=data.ResultDesc
                }
            })
        }
        else{
            this.showErrorStep2=true;
            
            this.response.ResultDesc="please select a method";
        }

    }
    resetPassword(customerID: string) {
        this.response= new ResponseModel();
        this.blockUI.start();
        if (this.newPassword !== '' && this.confirmPassword !== '' && this.resetCode !== '') {
            if (this.newPassword === this.confirmPassword) {
                let common_data = new CommonDataRequest();
                var _location = localStorage.getItem("la");
                common_data.Location = _location
                common_data.ServiceName = "ResetUserPassword";
                let common_data_json = JSON.stringify(common_data);

                let data_request = { NewPassword: this.newPassword, OTP: this.resetCode, CustomerId: customerID };
                let data_requet_json = JSON.stringify(data_request);
                 
                this._pickupService.ResetUserPassword(common_data_json, data_requet_json).then(data => {
                     console.log("reste:"+ JSON.stringify(Date))
                    if(data.ResultCode==="000"){
                        this.blockUI.stop();
                        this._route.navigateByUrl('/home');
                           
                    }
                    else{
                        this.showErrorStep3=true;
                        this.response.ResultDesc=data.ResultDesc
                        this.blockUI.stop();
                    }
                })
            }
            else{
                this.showErrorStep3=true;
                this.response.ResultDesc="The password is not match"
                this.blockUI.stop();
                // password not match.
            }
        }else{
            if(this.newPassword===''){
                this.errorNewPassword=1;
                this.errorConfirmPassword=0;
                this.errorOtp=0
                this.blockUI.stop();
            }else {
                if(this.confirmPassword===''){
                    this.errorConfirmPassword=1;
                    this.errorNewPassword=0;
                    this.errorOtp=0;
                    this.blockUI.stop();
                }
                else{
                    this.errorOtp=1;
                    this.errorConfirmPassword=0;
                    this.errorNewPassword=0;
                    this.blockUI.stop();
                }
            }
        }

    }

}