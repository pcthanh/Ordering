import { Component, OnInit, Renderer2, Inject } from '@angular/core';
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
    script: string = "";
    getCurrentTime: GetCurrentSystemTimeModel;
    customerInfo: CustomerInfoMainModel = new CustomerInfoMainModel();
    txtSearch: string = ""
    constructor(private _gof3rModule: Gof3rModule, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document, private router: Router, private active_router: ActivatedRoute, private _pickupService: PickupService, private _gof3rUtil: Gof3rUtil, private _instanceService: EventSubscribeService) {


        this._instanceService.$getEventSubject.subscribe(data => {
            let dataParse = data;
            
            if (dataParse.function === 'changeAddressV2') {

                
                let lacation = dataParse.la;
                this.GetAllOutletListV2(lacation, "", "", "")
                this.getTopOffers()
                this.initJQuery()
            }
            if (dataParse.function === 'Delivery') {
                this.initJQuery()
                this.GetAllOutletListV2("", dataParse.type, "", "");
                //this.getTopOffers();

            }
            if (dataParse.function === 'Pickup') {
                this.initJQuery()
                this.GetAllOutletListV2("", dataParse.type, "", "");
                //this.getTopOffers();

            }
            if (dataParse.function === 'changeTime') {
                this.GetAllOutletListV2("", "", dataParse.date, "");
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
                    
                    if (this.getInitialParams.MCCInfo[i].Value == "Food") {
                        
                        this.mccGobal = this.getInitialParams.MCCInfo[i].Id + '';
                    }
                }
            }


        }
    }


    ngOnInit() {

        this.initJQuery()
        

        this.GetCurrentSystemTime("");

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
    GetAllOutletListV2(location: string, orderMethod: string, orderFor: string, keyWord: string) {
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
            request_data.OrderFor = orderFor
        }
        //request_data.OrderFor = ""

        if (localStorage.getItem('cus') != null) {
            this.customerInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem('cus')));
            request_data.CustomerId = this.customerInfo.CustomerInfo[0].CustomerId + '';
        }
        else
            request_data.CustomerId = ""
        //request_data.CustomerId = "";
        request_data.FromRow = 0;
        request_data.MCC = this.mccGobal;
        request_data.KeyWords = keyWord;
        request_data.MerchantOutletId = "";
        request_data.SubCategoryId = "";
        let request_data_json = JSON.stringify(request_data);

        
        this._pickupService.GetAllOutletListV2(common_data_json, request_data_json).then(data => {
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode);

            
            this.getAllOutletListV2 = data;
            if(this.getAllOutletListV2.ResultCode==="000"){
                localStorage.setItem("promomes",this.getAllOutletListV2.ProductWebsitePromotionalMessage)
            }
            for (let i = 0; i < this.getAllOutletListV2.MerchantOutletListInfo.length; i++) {
                let rating:string="";
                let strTemp: string = ""
                for (let j = 0; j < this.getAllOutletListV2.MerchantOutletListInfo[i].SubCategoryList.length; j++) {
                    strTemp = strTemp + this.getAllOutletListV2.MerchantOutletListInfo[i].SubCategoryList[j].SubCategoryName + " • "
                }
                rating = this.getStars((parseInt(this.getAllOutletListV2.MerchantOutletListInfo[i].MerchantOutletRating) / 100));
                
                this.getAllOutletListV2.MerchantOutletListInfo[i].Rating = rating;
                this.getAllOutletListV2.MerchantOutletListInfo[i].subCatgoryTemp = strTemp.substring(0, strTemp.length - 2)
            }

            if (this.getAllOutletListV2.MerchantOutletListInfo.length > 0) {
                // this.noData=true;
                this.haveData = true;
                this.noData = false
            }
            else {
                this.noData = true;
                this.haveData = false;
            }
            this.getTopOffers()

        })
    }
    GetCurrentSystemTime(keyWord: string) {


        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetCurrentSystemTime";
        let common_data_json = JSON.stringify(common_data);
        let strDatime: string = ""
        let dataRequest = new GetCurrentSystemTimeRequest();
        let dataRequestJson = JSON.stringify(dataRequest);
        this._pickupService.GetCurrentSystemTime(common_data_json, dataRequestJson).then(data => {

            let d = new Date(+data.CurrentTimeMillis);
            let date = moment_(d).format("DD/MM/YYYY")
            let time = d.toLocaleTimeString();
            // this.getCurrentTime.CurrentData = date;
            // this.getCurrentTime.CurrentTime = moment_(d.getTime()).format("HH:mm:ss")
            strDatime = date + " " + moment_(d.getTime()).format("HH:mm:ss")
            this.GetAllOutletListV2("", "", strDatime, keyWord)
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
        
        this._pickupService.GetTopOffers(comomDataJson, requestDataJson).then(data => {
            this.OfferList = data;
            if (this.OfferList.OffersList.length > 0) {
                this.haveOffer = true
            }
            else {
                this.haveOffer = false
            }

            
            this.blockUI.stop()
        })
    }
    enterOrder(outletId: string) {
        localStorage.setItem("out", outletId);
        
        this.router.navigateByUrl("/order")
    }
    getStars(rating) {

        // Round to nearest half
        rating = Math.round(rating * 2) / 2;
        let output = [];

        // Append all the filled whole stars
        for (var i = rating; i >= 1; i--)
            output.push('<i style="color: #8e49fe;" class="fa fa-star" ></i>&nbsp;');

        // If there is a half a star, append it
        if (i == .5) output.push('<i class="fa fa-star-half-o"  style="color: #8e49fe;"></i>&nbsp;');

        // Fill the empty stars
        for (let i = (5 - rating); i >= 1; i--)
            output.push('<i class="fa fa-star-o" style="color: #8e49fe;"></i>&nbsp;');

        return output.join('');

    }
    searchAction(events) {
        if (events.keyCode == 13) {
            // action
            
            if(this.txtSearch!=""){
                this.GetCurrentSystemTime(this.txtSearch);
            }
            else{
                this.GetCurrentSystemTime("")
            }
            
        }
    }

}