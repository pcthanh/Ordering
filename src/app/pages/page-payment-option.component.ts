import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
import { GetAllPaymentOptionRequest } from "../models-request/get-all-payment-options";
import { GetAllPaymentOptionsWithPromotionModle } from "../models/GetAllPaymentOptionsWithPromotion";
import { Gof3rUtil } from "../util/gof3r-util";
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { Gof3rModule } from "../util/gof3r-module";
import { AddCardModel } from "../models/AddCard";
import { VerifyCard } from "../models/VerifyCard";
import { AddNewCardModel } from "../models-request/add-new-card";
import { GetInitialParams } from "../models/GetInitialParams";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModel } from "../models/Error";

declare var $: any;
declare var My2c2p:any;
@Component({
    selector: 'payment-option',
    templateUrl: 'page-payment-option.component.html'
})

export class PaymentOptionComponent implements OnInit {
    customerInfoMain: CustomerInfoMainModel;
    allPaymentOption: GetAllPaymentOptionsWithPromotionModle;
    isHaveData: boolean = false;
    addCardData: AddCardModel;
    cadrMonth = [{ label: "01", value: '01' }, { label: "02", value: '02' }, { label: "03", value: '03' }, { label: "04", value: '04' }, { label: "05", value: '05' }, { label: "06", value: '06' }, { label: "07", value: '07' }, { label: "08", value: '08' }, { label: "09", value: '09' }, { label: "10", value: '10' }, { label: "11", value: '11' }, { label: "12", value: '12' }]
    cardYear: any[] = []
    verifycard: VerifyCard;
    countrys: any[] = []
    getInitParam: GetInitialParams;
    @BlockUI() blockUI: NgBlockUI;
    errorAddCard: boolean = false;
    error: ErrorModel
    errorAddCardDisplay: string = ""
    test:string=""
     cardNmuberTemp:string=""
    constructor(private _module: Gof3rModule, private _gof3rUtil: Gof3rUtil, private _instaneService: EventSubscribeService, private _pickupService: PickupService) {
        this.customerInfoMain = new CustomerInfoMainModel();
        this.addCardData = new AddCardModel();
        this.verifycard = new VerifyCard()
        this.getInitParam = new GetInitialParams();
        this.error = new ErrorModel();
        if (localStorage.getItem("cus") != null) {
            this.customerInfoMain = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("cus")));
            
        }
    }

    ngOnInit() {
        this._instaneService.sendCustomEvent("PaymentOption")
        this.GetAllPaymentOptions()
        setTimeout(() => {
            this.loadCardYear()
            this.initCountry();
            
        }, 50)
    }
    initCountry() {
        if (localStorage.getItem('IN') != null) {
            this.getInitParam = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("IN")));
            for (let i = 0; i <= this.getInitParam.CountryInfo.length; i++) {
                let countryItem = { label: this.getInitParam.CountryInfo[i].CountryName, value: this.getInitParam.CountryInfo[i].CountryCode }
                this.countrys.push(countryItem);
            }
        }
    }
    GetAllPaymentOptions() {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetAllPaymentOptions";
        let common_data_json = JSON.stringify(common_data);

        let data_request = { CustomerId: this.customerInfoMain.CustomerInfo[0].CustomerId }
        let data_request_json = JSON.stringify(data_request)
        this._pickupService.GetAllPaymentOptions(common_data_json, data_request_json).then(data => {
            this.allPaymentOption = data
            
            //this._gof3rModule.checkInvalidSessionUser(this.allPaymentOption.ResultCode)

            this._module.checkInvalidSessionUser(this.allPaymentOption.ResultCode)
            this.isHaveData = true

            
        })
    }
    showAddNewCard() {
        this.showPopup();
    }
    showPopup() {

        var el = $('#payment-popup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    selectMonth(month: string) {
        this.addCardData.CardMonth = month;
        
    }
    selectYear(year: string) {
        this.addCardData.CardYear = year

    }
    selectContry(country: string) {
        if (country !== "0") {
            this.addCardData.CardCountry = country;
        }
    }
    onChangeTxtCardNumber(event) {
        var cardNumber = event.target.value;

        // Do not allow users to write invalid characters
        var formattedCardNumber = cardNumber.replace(/[^\d]/g, "");
        formattedCardNumber = formattedCardNumber.substring(0, 30);

        // Split the card number is groups of 4
        var cardNumberSections = formattedCardNumber.match(/\d{1,4}/g);
        if (cardNumberSections !== null) {
            formattedCardNumber = cardNumberSections.join(' ');
        }


        // If the formmattedCardNumber is different to what is shown, change the value
        if (cardNumber !== formattedCardNumber) {
            this.addCardData.CardNumber = formattedCardNumber;
        }
        this.cardNmuberTemp =event.target.value .replace(/\s+/g, '');
    }
    addCard(encryptedCardInfo:string) {
        if (this.addCardData.CardCountry && this.addCardData.CardCVV && this.addCardData.CardMonth && this.addCardData.CardYear && this.addCardData.CardNumber && this.addCardData.NameCard) {
            this.blockUI.start("Processing")
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "VerifyCard";
            let common_data_json = JSON.stringify(common_data);
            let iin = this.addCardData.CardNumber.replace(/\s/g, '')
            iin = iin.substring(0, 6);
            let data_request = { IIN: iin }
            let data_request_json = JSON.stringify(data_request)
            
            this._pickupService.VerifyCard(common_data_json, data_request_json).then(data => {
                this.verifycard = data;
                
                if (this.verifycard.ResultCode === "000") {
                    common_data.ServiceName = "AddNewCardWeb"
                    let common_data_json = JSON.stringify(common_data);
                    let data_request = new AddNewCardModel();
                    data_request.ApprovalCode = ""
                    data_request.Bin = this.verifycard.Bin
                    data_request.CardAlias = this.addCardData.NameCard
                    data_request.CardHolderName = this.addCardData.NameCard
                    data_request.CardProductId = this.verifycard.CardProductId
                    data_request.CustomerId = this.customerInfoMain.CustomerInfo[0].CustomerId + ''
                    data_request.Cvv2 = this.addCardData.CardCVV
                    data_request.InvoiceNo = ""
                    data_request.IssuingCountryCode = this.addCardData.CardCountry
                    data_request.PaymentGatewayToken = "09071513062949492475"
                    data_request.CardTypeId = this.verifycard.CardTypeId
                    data_request.RefNo = ""
                    data_request.ExpiryDate = this.addCardData.CardMonth + "/" + this.addCardData.CardYear
                    data_request.MaskedCardNumber = this.masKingNumberCard(this.addCardData.CardNumber.replace(/\s/g, ''));
                    data_request.EncryptedCardInfo=encryptedCardInfo;
                    let data_request_json = JSON.stringify(data_request)
                    
                    this._pickupService.AddNewCard(common_data_json, data_request_json).then(data => {
                        
                        if (data.ResultCode === "000") {
                            this.allPaymentOption.CardListInfo = []
                            this.allPaymentOption.CardListInfo = data.CardListInfo;
                            this.errorAddCard = true;
                            this.error.ResultDesc = data.ResultDesc
                            this.showPopupPaymentSuccess()
                            //$.magnificPopup.close()
                        }
                        else {
                            this.errorAddCard = true;
                            this.error.ResultDesc = data.ResultDesc
                            this.showPopupPaymentSuccess()
                        }

                        this.blockUI.stop()
                    })
                    

                }

            })
        }

        //let data_request = {IIN:}
    }
    showPopupPaymentSuccess() {
        var el = $('#success-popup-add-card');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    loadCardYear() {


        let currentYear = parseInt((new Date().getFullYear()) + '');
        let data = { label: currentYear, value: currentYear };
        
        this.cardYear.push(data);
        for (let i = 1; i <= 8; i++) {
            let nextYear = currentYear + i;
            let value = currentYear + i;
            this.cardYear.push({ label: nextYear, value: value });
        }
        
    }

    confirmCard() {
        //this.addCard()
        let encryptedCardInfo="";
       My2c2p.getEncrypted("2c2p-payment-form",function(encryptedData,errCode,errDesc) {
			if(errCode!=0){ alert(errDesc+" ("+errCode+")"); }
			else {
                
				encryptedCardInfo= encryptedData.encryptedCardInfo;
                

                
			}
		});
        if(encryptedCardInfo!=""){
            this.addCard(encryptedCardInfo)
        }
    }
    //  Checkout() {
	// 	My2c2p.getEncrypted("2c2p-payment-form",function(encryptedData,errCode,errDesc) {
	// 		if(errCode!=0){ alert(errDesc+" ("+errCode+")"); }
	// 		else {
	// 			var form = document.getElementById("2c2p-payment-form");
	// 			form.encryptedCardInfo.value = encryptedData.encryptedCardInfo;
	// 			form.maskedCardInfo.value = encryptedData.maskedCardInfo;
	// 			form.expMonthCardInfo.value = encryptedData.expMonthCardInfo;
	// 			form.expYearCardInfo.value = encryptedData.expYearCardInfo;
	// 			form.submit();
	// 		}
	// 	});
	// }

    masKingNumberCard(cardNumber: string): string {
        cardNumber = cardNumber.substring(0, 6) + cardNumber.substring(0, 6).replace(/\d/g, '*')
            + cardNumber.substring(12);
        return cardNumber;
    }
}