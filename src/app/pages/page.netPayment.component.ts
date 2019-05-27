import { Component, OnInit } from '@angular/core';
import { NetPaysRequest } from "../models-request/netpays-request";
import { Gof3rUtil } from "../util/gof3r-util";
import { GetInitialParams } from "../models/GetInitialParams";
declare function sendPayLoad(txnReq:string,hmac:string,keyId:string):any;
@Component({
    selector: 'netPayment',
    templateUrl: 'page.netPayment.component.html'
})

export class NetPaymentComponent implements OnInit {
    getInitParam: GetInitialParams;
    constructor(private _gof3rUtil: Gof3rUtil) {
        this.getInitParam = new GetInitialParams();
        if (localStorage.getItem('IN') != null) {
            this.getInitParam = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("IN")));
            
        }
        
     }

    ngOnInit() { 
        this.netPaysRequest()
    }
    netPaysRequest(){
        let net_request = new NetPaysRequest();
        if(localStorage.getItem("request_net")!=null){
            let data_request = JSON.parse(localStorage.getItem("request_net"))
            net_request.txnAmount= data_request.TxnAmount//"10"
        let date = new Date()
        net_request.merchantTxnRef=data_request.InvoiceNo //moment_(date).format("YYYYMMDD HH:mm:ss")
        //net_request.b2sTxnEndURL="#/check-out"
        //net_request.s2sTxnEndURL="http://171.248.158.185:8080/Carrot/CarrotService/s2sTxnEnd"
        net_request.b2sTxnEndURL=""
        net_request.s2sTxnEndURL="https://test.sandbox-technology.com:82/GOF3R/Gof3rService/s2sTxnEnd"
        net_request.netsMid= this.getInitParam.OtherParams[0].NetsMerchantId//"UMID_877772003"
        net_request.merchantTxnDtm= data_request.TransactionDate//moment_(date).format("YYYYMMDD HH:mm:ss.SSS")
        net_request.submissionMode="B"
        net_request.paymentType="SALE"
        net_request.paymentMode=""
        net_request.clientType="W"
        net_request.currencyCode=this.getInitParam.CurrencyInfo[0].CurrencyName
        net_request.merchantTimeZone=data_request.TimeZone
        net_request.netsMidIndicator="U"
        net_request.ipAddress="127.0.0.1"
        net_request.tid=""
        net_request.b2sTxnEndURLParam=""
        net_request.supMsg=""
        net_request.s2sTxnEndURLParam=""
        let json ={"ss":"1","msg": net_request};
        let json_request = JSON.stringify(json) ;
        let hmac =this._gof3rUtil.hashBase64(json_request +this.getInitParam.OtherParams[0].NetsSecretKey)//"38a4b473-0295-439d-92e1-ad26a8c60279");
        
        let keyId=this.getInitParam.OtherParams[0].NetsApiKey//"154eb31c-0f72-45bb-9249-84a1036fd1ca";
        sendPayLoad(json_request,hmac,keyId);
        }
        
        
    }
}