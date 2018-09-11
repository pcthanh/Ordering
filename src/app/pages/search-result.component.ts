import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { GetAllOutletListV2Request } from "../models-request/get-all-outlet-list-v2"
import { GetAllOutletListV2Model } from "../models/GetAllOutletListV2";
import { HomeService } from "../services/home.service";
import { Gof3rUtil } from "../util/gof3r-util";
import { RequestNull } from "../models-request/request-null";
import { GetInitialParams } from "../models/GetInitialParams";
import { MCCInfoModel } from "../models/MCCInfo";
import { GetTopOfferRequetData } from "../models-request/get-top-offers-request";
import { OfferLists } from "../models/OfferLists";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AddressListModel } from "../models/AddressList";
import { AddressIteModel } from "../models/AddressItem";
import { EventSubscribeService } from "../services/instance.service";
import { GetCurrentSystemTimeRequest } from "../models-request/get-current-system-time";
import { GetCurrentSystemTimeModel } from "../models/GetCurrentSystemTime";
import { Gof3rModule } from "../util/gof3r-module";
import * as moment_ from 'moment';

declare var $: any
const ORDER_DELIVERY = "DELIVERY"
const ORDER_PICKUP = "PICKUP";
@Component({
    selector: 'search-result',
    templateUrl: 'search-result.component.html'
})

export class SearchResultComponent implements OnInit {
    getInitialParams: GetInitialParams;
    getAllOutletListV2: GetAllOutletListV2Model;
    orderType: string = ""
    inputAddress: string = ""
    mccInfor: MCCInfoModel;
    mccGobal: string = ""
    OfferList: OfferLists;
    haveOffer: boolean = false;
    haveData: boolean = false;
    noData: boolean = false;
    addressList: AddressListModel;
    addressShowDiplay: AddressListModel;
    @BlockUI() blockUI: NgBlockUI;
    isShowAdd: boolean = false
    script:string="";
    getCurrentTime: GetCurrentSystemTimeModel;
    customerInfo: CustomerInfoMainModel = new CustomerInfoMainModel();
    constructor(private _gof3rModule:Gof3rModule,private _renderer2: Renderer2, @Inject(DOCUMENT) private _document,private router: Router, private active_router: ActivatedRoute, private _pickupService: PickupService, private _gof3rUtil: Gof3rUtil, private _instanceService: EventSubscribeService) {
        
        
        this._instanceService.$getEventSubject.subscribe(data => {
            let dataParse = data;
            console.log('a:' + dataParse)
            if (dataParse.function === 'changeAddressV2') {
                
                console.log('changeAddressV2:' + dataParse.la)
                let lacation = dataParse.la;
                this.GetAllOutletListV2(lacation, "","")
                this.getTopOffers()
                this.initJQuery()
            }
            if (dataParse.function === 'Delivery') {
                this.initJQuery()
                this.GetAllOutletListV2("", dataParse.type,"");
                //this.getTopOffers();
                
            }
            if (dataParse.function === 'Pickup') {
                this.initJQuery()
                this.GetAllOutletListV2("", dataParse.type,"");
                //this.getTopOffers();
                
            }
            if(dataParse.function==='changeTime'){
                this.GetAllOutletListV2("","",dataParse.date);
            }
        })
        if (localStorage.getItem('cus') != null) {
            this.customerInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem('cus')));

        }
        if (localStorage.getItem("orderType") != null) {
            this.orderType = localStorage.getItem("orderType");
        }
        if (localStorage.getItem("IN") != null) {
            this.getInitialParams = new GetInitialParams();
            this.mccInfor = new MCCInfoModel();
            this.getInitialParams = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("IN")));


            if (this.getInitialParams.MCCInfo.length > 0) {
                for (let i = 0; i < this.getInitialParams.MCCInfo.length; i++) {
                    console.log("mccvalus:" + this.getInitialParams.MCCInfo[i].Value)
                    if (this.getInitialParams.MCCInfo[i].Value == "Food") {
                        console.log("mccvalus:" + this.getInitialParams.MCCInfo[i].Value)
                        this.mccGobal = this.getInitialParams.MCCInfo[i].Id + '';
                    }
                }
            }


        }
    }


    ngOnInit() {
      
        this.initJQuery()
        console.log(this.script)
        
        this.GetCurrentSystemTime();
      
        //this.GetAllOutletListV2("", "");
         //this.initSlider()
    }
    
    

    initJQuery() {
        $(".special-offers .owl-carousel").owlCarousel({
            items: 4,
            margin: 30,
            stagePadding: 120,
            nav: true,
            dots: false,
            rewind: true,
            autoplay: true,
            responsive: {
                0: {
                    items: 2,
                    nav: false,
                    stagePadding: 0
                },
                768: {
                    items: 2,
                    nav: false,
                    stagePadding: 0
                },
                992: {
                    items: 3,
                    nav: false
                },
                1200: {
                    items: 4
                }
            }
        });
        // setTimeout(() => {
        //      $(".popular-near .owl-carousel").owlCarousel({
        //                         items: 4,
        //                         margin: 30,
        //                         stagePadding: 120,
        //                         nav: true,
        //                         dots: false,
        //                         rewind: true,
        //                         autoplay: true,
        //                         responsive : {
        //                             0 : {
        //                                 items: 2,
        //                                 nav: false,
        //                                 stagePadding: 0
        //                             },
        //                             768 : {
        //                                 items: 2,
        //                                 nav: false,
        //                                 stagePadding: 0
        //                             },
        //                             992 : {
        //                                 items: 3,
        //                                 nav: false
        //                             },
        //                             1200 : {
        //                                 items: 4
        //                             }
        //                         }
        //                     });
        //     this.blockUI.stop()
        // }, 3500)

    }
    GetAllOutletListV2(location: string, orderMethod: string,orderFor:string) {
this.blockUI.start()
        let common_data = new CommonDataRequest();
        if (location === '') {
            var _location = localStorage.getItem("la");
            common_data.Location = _location
        }
        else {
            var _location = location
            common_data.Location = _location
        }

        common_data.ServiceName = "GetAllOutletListV2";
        let common_data_json = JSON.stringify(common_data);
        console.log('getoutlet:' + common_data_json)
        let request_data = new GetAllOutletListV2Request();
        if (orderMethod === '') {
            if (localStorage.getItem("orderType") != null) {
                this.orderType = localStorage.getItem("orderType");
            }
            request_data.OrderType = this.orderType;
        }
        else {
            request_data.OrderType = orderMethod
        }

        if (request_data.OrderType === ORDER_PICKUP) {
            request_data.OrderFor = "";
        } else if (request_data.OrderType === ORDER_DELIVERY) {
            request_data.OrderFor =orderFor
        }
        //request_data.OrderFor = ""
       
        if (localStorage.getItem('cus') != null){
            this.customerInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem('cus')));
            request_data.CustomerId = this.customerInfo.CustomerInfo[0].CustomerId + '';
        }
        else
            request_data.CustomerId = ""
        //request_data.CustomerId = "";
        request_data.FromRow = 0;
        request_data.MCC = this.mccGobal;
        request_data.KeyWords = "";
        request_data.MerchantOutletId = "";
        request_data.SubCategoryId = "";
        let request_data_json = JSON.stringify(request_data);

        console.log('data:' + request_data_json)
        this._pickupService.GetAllOutletListV2(common_data_json, request_data_json).then(data => {
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode);

            console.log('test:' + JSON.stringify(data));
            this.getAllOutletListV2 = data;
           
            if (this.getAllOutletListV2.MerchantOutletListInfo.length>0) {
                // this.noData=true;
                 this.haveData=true;
                 this.noData=false
            }
            else {
                this.noData = true;
                this.haveData = false;
            }
            this.getTopOffers()

        })
    }
    GetCurrentSystemTime() {
        
        
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetCurrentSystemTime";
        let common_data_json = JSON.stringify(common_data);
        let strDatime:string=""
        let dataRequest = new GetCurrentSystemTimeRequest();
        let dataRequestJson = JSON.stringify(dataRequest);
        this._pickupService.GetCurrentSystemTime(common_data_json, dataRequestJson).then(data => {

            let d = new Date(+data.CurrentTimeMillis);
            let date = moment_(d).format("DD/MM/YYYY")
            let time = d.toLocaleTimeString();
            // this.getCurrentTime.CurrentData = date;
            // this.getCurrentTime.CurrentTime = moment_(d.getTime()).format("HH:mm:ss")
            strDatime = date +" "+ moment_(d.getTime()).format("HH:mm:ss")
            this.GetAllOutletListV2("","",strDatime)
            //this.orderMain.PickupTime = this.getCurrentTime.CurrentTime + " - " + this.getCurrentTime.CurrentTimeTo;
            // this.orderMain.PickupDate = "select pick up time";
            // let nowDate = this.getCurrentTime.CurrentTime;
            // this.createTimes(nowDate, END_TIME_LIMIT)

        })
       
    }
    getTopOffers() {

        var _location = localStorage.getItem("la");
        var commondata = new CommonDataRequest();
        commondata.Location = _location;
        commondata.ServiceName = "GetTopOffers";
        var requestData = new GetTopOfferRequetData();
        requestData.OrderType = this.orderType;
        requestData.MCC = this.mccGobal;
        if (localStorage.getItem('cus') != null)
            requestData.CustomerId = this.customerInfo.CustomerInfo[0].CustomerId + '';
        else
            requestData.CustomerId = ""
        let comomDataJson = JSON.stringify(commondata);
        let requestDataJson = JSON.stringify(requestData);
        console.log(comomDataJson);
        console.log(requestDataJson)
        this._pickupService.GetTopOffers(comomDataJson, requestDataJson).then(data => {
            this.OfferList = data;
            if(this.OfferList.OffersList.length>0){
                this.haveOffer=true
            }
            else{
                this.haveOffer=false
            }

            console.log("topoffer:" + JSON.stringify(this.OfferList))
            this.blockUI.stop()
        })
    }
    enterOrder(outletId: string) {
        localStorage.setItem("out", outletId);
        console.log('outletid:' + outletId)
        this.router.navigateByUrl("/order")
    }

}