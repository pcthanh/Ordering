import { Component, OnInit } from '@angular/core';
import { ChangeUserPassword } from "../models/ChangeUserPassword";
import { ChangeUserPasswordRequest } from "../models-request/change-user-password";
import { PickupService } from "../services/pickup.service";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { Gof3rUtil } from "../util/gof3r-util";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var $;
@Component({
    selector: 'change-password',
    templateUrl: 'page-change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    customerInfo: CustomerInfoMainModel = new CustomerInfoMainModel();
    currentPassword: string = ""
    newPassword: string = ""
    confirmPassword: string = ""
    changeUserPasswordModel = new  ChangeUserPassword();
    flagOk:boolean=false;
    error:string=""
    @BlockUI() blockUI: NgBlockUI;
    constructor(private _pickupService: PickupService, private _gof3rUtil: Gof3rUtil,private _router: Router) {
       
        if (localStorage.getItem('cus') != null) {
            this.customerInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem('cus')));

        }
    }


    ngOnInit() { }
    changePassword() {
        this.blockUI.start()
        if (this.currentPassword && this.newPassword && this.confirmPassword) {
            if (this.newPassword === this.confirmPassword) {
                let common_data = new CommonDataRequest();
                var _location = localStorage.getItem("la");
                common_data.Location = _location
                common_data.ServiceName = "ChangeUserPassword";
                let common_data_json = JSON.stringify(common_data);

                let data_request = new ChangeUserPasswordRequest();
                data_request.CustomerId= this.customerInfo.CustomerInfo[0].CustomerId +'';
                data_request.NewPassword=this.newPassword;
                data_request.OldPassword= this.currentPassword;
                let data_request_json = JSON.stringify(data_request);
                this._pickupService.ChangeUserPassWord(common_data_json,data_request_json).then(data=>{
                    this.changeUserPasswordModel = data;
                    if(this.changeUserPasswordModel.ResultCode==="000"){
                        this.flagOk=true;
                    }
                    this.blockUI.stop()
                    this.error= this.changeUserPasswordModel.ResultDesc;
                    this.showPopupddApplyPromoceError()
                    
                })
            }
            else{
                this.blockUI.stop();
                this.error= "Password and confirm password does not match."
                this.showPopupddApplyPromoceError()
            }
        }
    }
    showPopupddApplyPromoceError() {
        var el = $('#change-password-error');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el,
                    showCloseBtn: false
                },
                type: 'inline',
                modal: true
            });
        }
    }
    okay(){
        if(this.flagOk){
            $.magnificPopup.close()
            this._router.navigateByUrl("/account")
        }
        else{
            $.magnificPopup.close()
        }
    }
}