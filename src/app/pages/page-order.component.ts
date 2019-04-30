import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonDataRequest } from "../models-request/request-comon-data";
import { GetProductListRequest } from "../models-request/get-request-product-list";
import { PickupService } from "../services/pickup.service";
import { EventSubscribeService } from "../services/instance.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GetOutletInfoRequest } from "../models-request/get-outlet-info";
import { MerchantOutletListInfoModel } from "../models/MerchantOutletListInfo";
import { ProductListModel } from "../models/ProductList";
import { GetProductDetailRequest } from "../models-request/get-product-detail";
import { ProductDetailMainModel } from "../models/ProductDetailMain";
import { ProductDetailParseModel } from "../models/ProductDetailParse";
import { OptionsDetailOfProductModel } from "../models/OptionsDetailOfProduct";
import { OptionItemListModel } from "../models/OptionItemList";
import { Gof3rUtil } from "../util/gof3r-util";
import { Gof3rModule } from "../util/gof3r-module";
import { CartOrder } from "../models/CartOrder";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { OutletInfoModel } from "../models/OutletInfo";
import { OrderModel } from "../models/Order";
import { ListDeliveryAddress } from "../models/ListDeliveryAddress";
import { VerifyOrderMainModel } from "../models/VerifyOrderMain";
import { VerifyOrderRequest } from "../models-request/verify-order-request";
import { CartOrderNew } from "../models/CartOrderNew";
import { ErrorModel } from "../models/Error";
import { GetCurrentSystemTimeRequest } from "../models-request/get-current-system-time";
import * as moment_ from 'moment';
import { GetAllOutletListV2Request } from "../models-request/get-all-outlet-list-v2"
import { GetAllOutletListV2Model } from "../models/GetAllOutletListV2";
import { GetInitialParams } from "../models/GetInitialParams";
import { MCCInfoModel } from "../models/MCCInfo";
import { AddressListModel } from "../models/AddressList";
import { AddeliveryAddressModel } from "../models-request/add-delivery-address";
import { AddressIteModel } from "../models/AddressItem";

const ORDER_DELIVERY: string = "DELIVERY"
const ORDER_PICKUP: string = "PICKUP"
declare var $: any;
@Component({
    selector: 'page-order',
    templateUrl: 'page-order.component.html'
})

export class PageOrderComponent implements OnInit {
    OrderType: string;
    OutletId: string;
    outletInfo: OutletInfoModel;
    productList: ProductListModel;
    productDetail: ProductDetailMainModel;
    productDetailParse: ProductDetailParseModel;
    isCheck = true;
    total: number = 220;
    str: string;
    error: ErrorModel
    cart: CartOrder;
    specialRequest: string = "";
    haveData: boolean;
    haveDataOutlet: boolean;
    addClass: number;
    haveDepartment: string = ""
    cartOrderMain: CartOrder;
    customerInfo: CustomerInfoMainModel = new CustomerInfoMainModel();
    haveCart: boolean = true;
    orderMain: OrderModel;
    showCartEmpty: boolean = false;
    IndexItemCartUpdate: number;
    indexCart: number;
    showUpdateProduct: boolean = false;
    errorCart: string = ""
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('closeModal') closePopup: ElementRef;
    listDeliveryAddress: ListDeliveryAddress;
    verifyOrderMain: VerifyOrderMainModel;
    productWebsiteBannerMessage: string = "";
    hadVeryfiOrder: boolean = false;
    removeCartFlag: boolean = false
    cartNew: CartOrderNew;
    haveOuteFromMap: number = 1;
    dataFromOutletMap: string;
    getInitialParams: GetInitialParams;
    getAllOutletListV2: GetAllOutletListV2Model;
    mccGobal: string;
    mccInfor: MCCInfoModel;
    addressDeli: AddressListModel;
    lat:string="";
    lng:string="";
    nameAddress:string=""
    addressList: AddressListModel;
    constructor(private _router: Router, private _gof3rUtil: Gof3rUtil, private _gof3rModule: Gof3rModule, private _util: Gof3rUtil, private _pickupService: PickupService, private _instanceService: EventSubscribeService, private active_router: ActivatedRoute) {
        this.blockUI.start('loading ...'); // Start blocking
        this.productDetail = new ProductDetailMainModel();
        this.productDetailParse = new ProductDetailParseModel();
        this.cartOrderMain = new CartOrder();
        this.cart = new CartOrder();
        this.customerInfo = new CustomerInfoMainModel();
        this.orderMain = new OrderModel();
        this.outletInfo = new OutletInfoModel();
        this.listDeliveryAddress = new ListDeliveryAddress();
        this.verifyOrderMain = new VerifyOrderMainModel();
        this.cartNew = new CartOrderNew();
        this.error = new ErrorModel()
        //this.blockUI.start();
        if (localStorage.getItem("out") != null) {
            this.OutletId = localStorage.getItem("out");
        }
        if (localStorage.getItem("orderType") != null) {
            this.OrderType = localStorage.getItem("orderType");
        }
        if (localStorage.getItem('cus') != null) {
            this.customerInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem('cus')));

        }

        if (localStorage.getItem("crt") != null || localStorage.getItem("crtd") != null) {
            this.haveCart = true;
        }
        else {
            this.haveCart = false;
        }
        if (localStorage.getItem("promomes") != null) {
            this.productWebsiteBannerMessage = localStorage.getItem("promomes")
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
        this._instanceService.$getEventSubject.subscribe(data => {
            if (data.function === "updateTimePickup") {
                this.orderMain.PickupDateFrom = data.fromDate;
                this.orderMain.PickupDateTo = data.toDate;
                let datePikcup = { fromDate: this.orderMain.PickupDateFrom, toDate: this.orderMain.PickupDateTo, fromDateDisplay: data.fromDateDisplay, toDateDisplay: data.toDateDisplay }
                localStorage.setItem("datePickup", JSON.stringify(datePikcup))

            }
            // if(data.function==="outletMap"){
            //     this.haveOuteFromMap=data.haveOutlet;
            //     this.dataFromOutletMap = data.msg
            // }
        })
    }
    ngOnInit() {
        //this.initJquery()
        //this.loadCart()
        //this._instanceService.sendCustomEvent("notCheckOut")
        window.scrollTo(0, 0);
        this.GetOutletInfo()
        window.addEventListener('scroll', this.scroll, true);

        //   setTimeout(() => {
        //     this.GetProductList("", "")
        //     this.initJquery();
        // }, 60)
        // setTimeout(() => {
        //     //this.initJquery()

        // }, 1500)
    }
    initJquery() {
        $('.chicken-beef').magnificPopup({
            type: 'inline'
        });
        // $('#handleCounter').handleCounter();
        $('.btn-add-special').on('click', function (event) {
            event.preventDefault();
            $(this).parent('.btn-add-special-inner').find('.text-special').slideDown();
        });
        $('#numberof').magnificPopup({
            type: 'inline'
        });
        // $('#numberCounter').handleCounter();
        $('.btn-add-special').on('click', function (event) {
            event.preventDefault();

            $(this).parent('.btn-add-special-inner').find('.text-special').slideDown();
        });





    }
    scroll = (): void => {
        //handle your scroll here
        //notice the 'odd' function assignment to a class field
        //this is used to be able to remove the event listener
        this.myFunction()
    };
    myFunction() {
        var header = document.getElementById("order-catalog");

        // alert(sticky)
        // alert(window.pageYOffset)
        if (window.pageYOffset >= 250) {
            header.classList.add("sticky")

        } else {
            header.classList.remove("sticky");
        }
    }
    GetOutletInfo() {
        let commonData = new CommonDataRequest();
        let _location = localStorage.getItem('la');
        commonData.Location = _location;
        commonData.ServiceName = "GetOutletInfo";
        let commonDataJson = JSON.stringify(commonData);

        let requestData = new GetOutletInfoRequest();
        requestData.CustomerId = "";
        requestData.OrderFor = "";
        requestData.OrderType = this.OrderType;
        requestData.MerchantOutletId = this.OutletId;
        let requestJson = JSON.stringify(requestData);

        this._pickupService.GetOutletInfo(commonDataJson, requestJson).then(data => {

            this._gof3rModule.checkInvalidSessionUser(data.ResultCode);
            localStorage.setItem('ot', this._util.encryptParams(JSON.stringify(data)));//set outlet info
            this.outletInfo = data;
            this.outletInfo.OutletInfo[0].Rating = this.getStars((parseInt(this.outletInfo.OutletInfo[0].MerchantOutletRating) / 100));
            this.haveDataOutlet = true
            this.loadCart();
            this.GetProductList("", "");
            

        })

    }
    GetProductList(CategoryId, DepartmentId) {

        let commonData = new CommonDataRequest();
        let _location = localStorage.getItem('la');
        commonData.Location = _location;
        commonData.ServiceName = "GetProductList";
        let commonDataJson = JSON.stringify(commonData);

        let requestData = new GetProductListRequest();
        if (CategoryId === "" && DepartmentId === "") {
            requestData.CategoryId = "";
            requestData.DepartmentId = "";
            this.addClass = -1

        }
        if (CategoryId && DepartmentId === "") {
            requestData.CategoryId = CategoryId;
            requestData.DepartmentId = "";
        }
        if (DepartmentId && CategoryId === "") {
            requestData.CategoryId = "";
            requestData.DepartmentId = DepartmentId;
        }

        requestData.OrderType = this.OrderType;
        requestData.MerchantOutletId = this.OutletId;
        requestData.OrderBy = "PRICE_HIGH_TO_LOW";
        let requestJson = JSON.stringify(requestData);


        this._pickupService.GetProductList(commonDataJson, requestJson).then(data => {

            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
            this.productList = data;
           
            this.haveData = true
            this.haveDepartment = this.productList.IsHavingDepartment

            for (let i = 0; i < this.productList.ProductList.length; i++) {
                for (let j = 0; j < this.productList.ProductList[i].Produtcs.length; j++) {
                    if (this.productList.ProductList[i].Produtcs[j].OriginalImage.indexOf("no_image") > -1 || this.productList.ProductList[i].Produtcs[j].OriginalImage == "") {

                        this.productList.ProductList[i].Produtcs[j].HaveImage = false;
                    }
                    else {
                        this.productList.ProductList[i].Produtcs[j].HaveImage = true;
                    }
                }
            }
            if (data.ResultCode === "000") {

                this.blockUI.stop()
                this.goToOrder(this.OutletId)
                this._instanceService.sendCustomEvent("LoadTimePickup")
            }

        })
    }
    loadItemOfCategory(id, haveDepartment, index: number) {
        this.blockUI.start('processing ...'); // Start blocking
        this.addClass = index;

        if (haveDepartment === "Y") {
            this.GetProductList("", id);
        }
        if (haveDepartment === "N") {
            this.GetProductList(id, "")
        }
        if (id === "ALL") {
            this.GetProductList("", "")
        }
        setTimeout(() => {

            this.blockUI.stop();
        }, 700)



    }
    subTotalItem(isQtyItem: boolean, productMain: ProductDetailParseModel) {
        let totalOfOptionItem = 0;
        for (let i = 0; i < productMain.OptionList.length; i++) {
            for (let j = 0; j < productMain.OptionList[i].OptionItemList.length; j++) {
                if (productMain.OptionList[i].OptionItemList[j].isCheck == true) {
                    totalOfOptionItem = totalOfOptionItem + productMain.OptionList[i].OptionItemList[j].Total
                }

            }
        }
        
        if (isQtyItem) {
            if (productMain.Qty >= 1) {

                productMain.Total = productMain.Qty * (parseInt(productMain.Price) / 100) + (productMain.Qty * totalOfOptionItem);


                productMain.TotalStr = this._util.formatCurrency(productMain.Total, "S$");
            }

        }

        else {

            productMain.Total = (totalOfOptionItem * productMain.Qty) + productMain.Qty * (parseInt(productMain.Price) / 100);
            productMain.TotalStr = this._util.formatCurrency(productMain.Total, "S$");
        }
    }
    showProductDetail(productId: number,soldOut:string) {
        if(soldOut!=="Y"){
            if (this.haveOuteFromMap == 1) {
                this.blockUI.start("loading...")
    
                this.productDetailParse = new ProductDetailParseModel();
                let commonData = new CommonDataRequest();
                let _location = localStorage.getItem('la');
                commonData.Location = _location;
                commonData.ServiceName = "GetProductDetail";
                let commonDataJson = JSON.stringify(commonData);
    
                let dataRequest = new GetProductDetailRequest();
                dataRequest.ProductId = productId;
                dataRequest.OrderType = this.OrderType
                let requestDataJson = JSON.stringify(dataRequest);
    
                this._pickupService.GetProductDetail(commonDataJson, requestDataJson).then(data => {
    
                    this.productDetail = data
                   
                    this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
                    if (data.ProductDetailInfo.length > 0) {
    
                        this.productDetailParse.Id = this.productDetail.ProductDetailInfo[0].Id;
                        this.productDetailParse.Name = this.productDetail.ProductDetailInfo[0].Name;
                        this.productDetailParse.Description = this.productDetail.ProductDetailInfo[0].Description;
                        this.productDetailParse.Image = data.ProductDetailInfo[0].Image;
                        this.productDetailParse.Image1 = data.ProductDetailInfo[0].Image1;
                        this.productDetailParse.Image2 = data.ProductDetailInfo[0].Image2;
                        this.productDetailParse.IsSoldOut = data.ProductDetailInfo[0].IsSoldOut;
                        this.productDetailParse.CurrencyCode = data.ProductDetailInfo[0].CurrencyCode;
                        this.productDetailParse.Price = data.ProductDetailInfo[0].Price;
                        this.productDetailParse.PriceDisplay = data.ProductDetailInfo[0].PriceDisplay;
                        this.productDetailParse.PickupPrice = data.ProductDetailInfo[0].PickupPrice;
                        this.productDetailParse.PickupPriceDisplay = data.ProductDetailInfo[0].PickupPriceDisplay;
                        this.productDetailParse.DeliveryPrice = data.ProductDetailInfo[0].DeliveryPrice;
                        this.productDetailParse.DeliveryPriceDisplay = data.ProductDetailInfo[0].DeliveryPriceDisplay;
                        for (let i = 0; i < data.ProductDetailInfo[0].OptionList.length; i++) {
                            let optionsLst = new OptionsDetailOfProductModel();
                            optionsLst.MinOptionItemSelectionRequired = data.ProductDetailInfo[0].OptionList[i].MinOptionItemSelectionRequired
                            optionsLst.MaxOptionItemSelectionRequired = data.ProductDetailInfo[0].OptionList[i].MaxOptionItemSelectionRequired
                            optionsLst.OptionId = data.ProductDetailInfo[0].OptionList[i].OptionId;
                            optionsLst.OptionName = data.ProductDetailInfo[0].OptionList[i].OptionName;
                            for (let j = 0; j < data.ProductDetailInfo[0].OptionList[i].OptionItemList.length; j++) {
                                let optionItem = new OptionItemListModel();
                                optionItem.CurrencyCode = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].CurrencyCode
                                optionItem.DeliveryPrice = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].DeliveryPrice;
                                optionItem.DeliveryPriceDisplay = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].DeliveryPriceDisplay;
                                optionItem.isCheck = false;
                                optionItem.IsSoldOut = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].IsSoldOut;
                                optionItem.MaxQuantityRequired = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].MaxQuantityRequired;
                                optionItem.MinQuantityRequired = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].MinQuantityRequired;
                                optionItem.OptionItemId = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].OptionItemId;
                                optionItem.OptionItemName = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].OptionItemName;
                                optionItem.PickupPrice = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].PickupPrice;
                                optionItem.PickupPriceDisplay = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].PickupPriceDisplay;
                                optionItem.Price = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].Price;
                                optionItem.PriceDisplay = data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].PriceDisplay;
                                optionItem.Total = 0;
                                if (data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].MinQuantityRequired == 1 && data.ProductDetailInfo[0].OptionList[i].OptionItemList[j].MaxQuantityRequired == 1) {
                                    optionItem.isShowQty = false
                                }
    
    
                                optionsLst.OptionItemList.push(optionItem);
                            }
                            if (data.ProductDetailInfo[0].OptionList[i].MinOptionItemSelectionRequired == 1) {
                                if (optionsLst.OptionItemList.length > 0) {//check OptionItemList have data
                                    optionsLst.OptionItemList[0].isCheck = true;
                                    optionsLst.OptionItemList[0].Qty = 1;
    
                                    optionsLst.OptionItemList[0].Total = (optionsLst.OptionItemList[0].Qty * (parseInt(optionsLst.OptionItemList[0].Price) / 100));
    
    
                                    optionsLst.OptionItemList[0].TotalStr = this._util.formatCurrency(optionsLst.OptionItemList[0].Total, "S$");
                                }
    
    
                            }
                            if (data.ProductDetailInfo[0].OptionList[i].MinOptionItemSelectionRequired != 0 && data.ProductDetailInfo[0].OptionList[i].MinOptionItemSelectionRequired > 1) {
                                if (data.ProductDetailInfo[0].OptionList[i].OptionItemList.length > 0) {//check OptionItemList have data
                                    for (let min = 0; min < data.ProductDetailInfo[0].OptionList[i].MinOptionItemSelectionRequired; min++) {
                                        optionsLst.OptionItemList[min].isCheck = true;
                                        optionsLst.OptionItemList[min].Qty = 1;
    
                                        optionsLst.OptionItemList[0].Total = (optionsLst.OptionItemList[0].Qty * (parseInt(optionsLst.OptionItemList[0].Price) / 100));
    
    
                                        optionsLst.OptionItemList[0].TotalStr = this._util.formatCurrency(optionsLst.OptionItemList[0].Total, "S$");
                                        optionsLst.OptionItemList[min].isLock = true
                                    }
                                }
    
                            }
                            this.productDetailParse.TagList = data.ProductDetailInfo[0].TagList;
                            this.productDetailParse.OptionList.push(optionsLst)
    
                        }
                        this.subTotalItem(false, this.productDetailParse);
                        //this.initJquery();
                        this.openPopup()
                        this.blockUI.stop()
    
    
                    }
    
                })
            }
        }
        else{
            return;
        }
        

    }
    openPopup() {
        this.specialRequest = ""
        var el = $('.chicken-popup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    openPopupOutletInfor() {
        var el = $('#infor-popup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    upadteProduct(indexCart: number, indexUpdate: number) {

        this.showUpdateProduct = true;
        this.removeCartFlag = false;
        var el = $('.chicken-popup-update');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
        this.IndexItemCartUpdate = indexUpdate;
        this.indexCart = indexCart;
        this.productDetailParse = this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate];


    }
    checkOptionItem(optionItemId: string, optionId: number, index: number) {

        let countItemChecked = 0;
        let maxselectItem = this.getMaxSelectItem(optionId);
        let minselectItem = this.getMinSelectItem(optionId);

        countItemChecked = this.checkBox(optionItemId, optionId);

        if (countItemChecked > maxselectItem && maxselectItem != 0) {
            for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
                for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                    if (this.productDetailParse.OptionList[i].OptionItemList[j].isCheck == true && this.productDetailParse.OptionList[i].OptionId == optionId && j != index) {
                        this.productDetailParse.OptionList[i].OptionItemList[j].isCheck = false;
                        this.productDetailParse.OptionList[i].OptionItemList[j].isLock = false;
                        this.productDetailParse.OptionList[i].OptionItemList[j].Qty = 0;

                        break;
                    }
                }
            }
        }
        let countAfter = this.countCheckBox(optionItemId, optionId);

        if (countAfter == minselectItem) {

            this.lockCheckBox(optionItemId, optionId);
        }
        this.subTotalOfOptionItem(optionItemId, optionId, this.productDetailParse)
        this.subTotalItem(false, this.productDetailParse);

    }

    checkOptionItemUpdate(optionItemId: string, optionId: number, index: number) {
        
        let countItemChecked = 0;
        let maxselectItem = this.getMaxSelectItemUdate(optionId, index);
        let minselectItem = this.getMinSelectItemUPdate(optionId, index);

        countItemChecked = this.checkBoxUpdate(optionItemId, optionId);

        if (countItemChecked > maxselectItem && maxselectItem != 0) {
            for (let i = 0; i < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
                for (let j = 0; j < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                    if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true && this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId && j != index) {
                        this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck = false;
                        this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isLock = false;
                        this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].Qty = 0;

                        break;
                    }
                }
            }
        }
        let countAfter = this.countCheckBoxUpdate(optionItemId, optionId);

        if (countAfter == minselectItem) {

            this.lockCheckBoxUpdate(optionItemId, optionId);
        }
        this.subTotalOfOptionItemUpdate(optionItemId, optionId, this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate], index)
        this.subTotalItem(false, this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate]);

    }
    getMaxSelectItem(optionId: number) {
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            if (this.productDetailParse.OptionList[i].OptionId == optionId) {
                return this.productDetailParse.OptionList[i].MaxOptionItemSelectionRequired;
            }
        }
    }
    getMinSelectItem(optionId: number) {
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            if (this.productDetailParse.OptionList[i].OptionId == optionId) {
                return this.productDetailParse.OptionList[i].MinOptionItemSelectionRequired;
            }
        }
    }
    getMaxSelectItemUdate(optionId: number, index) {

        for (let i = 0; i < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
                return this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].MaxOptionItemSelectionRequired;
            }
        }
    }
    getMinSelectItemUPdate(optionId: number, index) {
        for (let i = 0; i < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
                return this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].MinOptionItemSelectionRequired;
            }
        }
    }
    checkBox(optionItemId: string, optionId: number) {
        let countItemChecked = 0;
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {

                if (this.productDetailParse.OptionList[i].OptionItemList[j].OptionItemId === optionItemId) {

                    this.productDetailParse.OptionList[i].OptionItemList[j].isCheck = !this.productDetailParse.OptionList[i].OptionItemList[j].isCheck

                    if (this.productDetailParse.OptionList[i].OptionItemList[j].isCheck == true) {
                        this.productDetailParse.OptionList[i].OptionItemList[j].Qty++;
                    }
                    else {
                        this.productDetailParse.OptionList[i].OptionItemList[j].Qty = 0;
                    }

                }
                if (this.productDetailParse.OptionList[i].OptionItemList[j].isCheck == true && this.productDetailParse.OptionList[i].OptionId == optionId) {
                    countItemChecked++;
                }
            }
        }
        return countItemChecked;
    }
    checkBoxUpdate(optionItemId: string, optionId: number) {
        let countItemChecked = 0;
        for (let i = 0; i < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            for (let j = 0; j < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {

                if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].OptionItemId === optionItemId) {

                    this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck = !this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck

                    if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true) {
                        this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].Qty++;
                    }
                    else {
                        this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].Qty = 0;
                    }

                }
                if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true && this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
                    countItemChecked++;
                }
            }
        }
        return countItemChecked;
    }

    lockCheckBox(optionItemId: string, optionId: number) {
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                if (this.productDetailParse.OptionList[i].OptionItemList[j].isCheck == true && this.productDetailParse.OptionList[i].OptionId == optionId) {
                    this.productDetailParse.OptionList[i].OptionItemList[j].isLock = true;
                }
            }
        }
    }
    lockCheckBoxUpdate(optionItemId: string, optionId: number) {
        for (let i = 0; i < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            for (let j = 0; j < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true && this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
                    this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isLock = true;
                }
            }
        }
    }
    countCheckBox(optionItemId: string, optionId: number) {
        let countChb = 0;
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                if (this.productDetailParse.OptionList[i].OptionItemList[j].isCheck == true && this.productDetailParse.OptionList[i].OptionId == optionId) {
                    countChb++;
                }
            }
        }
        return countChb;
    }
    countCheckBoxUpdate(optionItemId: string, optionId: number) {
        let countChb = 0;
        for (let i = 0; i < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            for (let j = 0; j < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true && this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
                    countChb++;
                }
            }
        }
        return countChb;
    }
    subTotalOfOptionItem(optionItem: string, optionId: number, productMain: ProductDetailParseModel) {
        for (let i = 0; i < productMain.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                if (productMain.OptionList[i].OptionId == optionId && productMain.OptionList[i].OptionItemList[j].OptionItemId == optionItem) {

                    productMain.OptionList[i].OptionItemList[j].Total = productMain.OptionList[i].OptionItemList[j].Qty * (parseInt(productMain.OptionList[i].OptionItemList[j].Price) / 100);
                   

                    productMain.OptionList[i].OptionItemList[j].TotalStr = this._util.formatCurrency(productMain.OptionList[i].OptionItemList[j].Total, "S$");
                }
            }
        }
    }
    subTotalOfOptionItemUpdate(optionItem: string, optionId: number, productMain: ProductDetailParseModel, index) {
        for (let i = 0; i < productMain.OptionList.length; i++) {
            for (let j = 0; j < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                if (productMain.OptionList[i].OptionId == optionId && productMain.OptionList[i].OptionItemList[j].OptionItemId == optionItem) {
                    productMain.OptionList[i].OptionItemList[j].Total = productMain.OptionList[i].OptionItemList[j].Qty * (parseInt(productMain.OptionList[i].OptionItemList[j].Price) / 100);
                    productMain.OptionList[i].OptionItemList[j].TotalStr = this._util.formatCurrency(productMain.OptionList[i].OptionItemList[j].Total, "S$");
                }
            }
        }
    }
    AdditionQtyItem() {
        this.productDetailParse.Qty++;
        let isQtyItem = true;
        this.subTotalItem(isQtyItem, this.productDetailParse);

    }
    AdditionQtyItemUpdate() {
        this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].Qty++;
        let isQtyItem = true;
        this.subTotalItem(isQtyItem, this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate]);
        this.orderMain.ArrayItem = this.cartNew.cartNew[this.indexCart].Cart;
        this.subTotalOrder()
        if (this.OrderType === ORDER_DELIVERY) {
            localStorage.setItem("crtd", JSON.stringify(this.cart))
        }
        else {
            localStorage.setItem("crt", JSON.stringify(this.cart))
        }

    }
    SubtractionItem() {
        if (this.productDetailParse.Qty > 1) {
            let isQtyItem = true;
            this.productDetailParse.Qty--;

            this.subTotalItem(isQtyItem, this.productDetailParse)
        }
    }
    SubtractionItemUpdate() {
        if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].Qty > 1) {
            let isQtyItem = true;
            this.cart.Cart[this.IndexItemCartUpdate].Qty--;
            this.subTotalItem(isQtyItem, this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate])
            this.orderMain.ArrayItem = this.cartNew.cartNew[this.indexCart].Cart;
            this.subTotalOrder()
            if (this.OrderType === ORDER_DELIVERY) {
                localStorage.setItem("crtd", JSON.stringify(this.cart))
            }
            else {
                localStorage.setItem("crt", JSON.stringify(this.cart))
            }
        }
    }
    addQuatyOptionItem(optionItem: string, optionId: number, index) {
        for (let i = 0; i < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            for (let j = 0; j < this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                if (this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId && this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].OptionItemId == optionItem) {
                    this.cartNew.cartNew[this.indexCart].Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].Qty++;
                }
            }
        }
    }

    addToCart() {

        this.haveCart = true;
        this.productDetailParse.SpecialRequest = this.specialRequest;
        if (this.OrderType == ORDER_PICKUP) {//cart for pickup
            if (localStorage.getItem("crt") != null) {//check cart exits
                this.cartNew = (JSON.parse(localStorage.getItem("crt")));
            }
            let haveOutetInCart: boolean = false;
            if (this.cartNew.cartNew.length > 0) {//check cart not yet item
                for (let l = 0; l < this.cartNew.cartNew.length; l++) {
                    if (this.outletInfo.OutletInfo[0].MerchantOutletId === this.cartNew.cartNew[l].OuteletID) {
                        haveOutetInCart = true;
                        let isExits: boolean;
                        let isCompare: boolean;
                        let countCompare: number = 0;
                        let arrayOptionInCart: any;
                        let arrayOptionItem = this.checkGroupOptionOfItem(this.productDetailParse);
                        for (let i = 0; i < this.cartNew.cartNew[l].Cart.length; i++) {
                            if (this.cartNew.cartNew[l].Cart[i].Id == this.productDetailParse.Id) {
                                isExits = true;

                                if (isExits) {
                                    arrayOptionInCart = this.checkGroupOptionOfItem(this.cartNew.cartNew[l].Cart[i]);

                                    isCompare = this.checkArrays(JSON.stringify(arrayOptionItem), JSON.stringify(arrayOptionInCart));
                                    
                                    if (isCompare) {
                                        this.cartNew.cartNew[l].Cart[i].Qty = this.cartNew.cartNew[l].Cart[i].Qty + this.productDetailParse.Qty;
                                        this.cartNew.cartNew[l].Cart[i].Total = this.cartNew.cartNew[l].Cart[i].Qty * (this.productDetailParse.Total) ;
                                        this.cartNew.cartNew[l].Cart[i].TotalStr= this._gof3rUtil.formatCurrency(this.cartNew.cartNew[l].Cart[i].Total, "S$")
                                       
                                        for (let j = 0; j < this.productDetailParse.OptionList.length; j++) {
                                            for (let h = 0; h < this.productDetailParse.OptionList[j].OptionItemList.length; h++) {
                                                
                                                this.cartNew.cartNew[l].Cart[i].OptionList[j].OptionItemList[h].Qty = this.cartNew.cartNew[l].Cart[i].OptionList[j].OptionItemList[h].Qty + this.productDetailParse.OptionList[j].OptionItemList[h].Qty
                                                this.subTotalOfOptionItem(this.cartNew.cartNew[l].Cart[i].OptionList[j].OptionItemList[h].OptionItemId, this.cartNew.cartNew[l].Cart[i].OptionList[j].OptionId, this.cartNew.cartNew[l].Cart[i]);
                                                this.subTotalItem(true, this.cartNew.cartNew[l].Cart[i])
                                            }
                                        }
                                    }
                                }

                            }
                        }
                        if (!isCompare) {
                            //this.cart.Cart.push(this.productDetailParse);
                            this.cartNew.cartNew[l].Cart.push(this.productDetailParse)

                        }
                    }
                }
                if (!haveOutetInCart) {
                    let item = new CartOrder();
                    item.OrderType = this.OrderType;
                    item.OuteletID = this.outletInfo.OutletInfo[0].MerchantOutletId
                    item.OutletName = this.outletInfo.OutletInfo[0].MerchantOutletName
                    item.OutletRating = this.getStars((parseInt(this.outletInfo.OutletInfo[0].MerchantOutletRating) / 100))
                    item.FoodCenterID = this.outletInfo.OutletInfo[0].FoodCentreId
                    item.MerchantID = this.outletInfo.OutletInfo[0].MerchantId;
                    item.MaxOutletInCart = this.outletInfo.OutletInfo[0].MaxOutletsInCart;
                    item.FoodCenterName = this.outletInfo.OutletInfo[0].FoodCentreName
                    item.IsBuyAndPayOutlet=this.outletInfo.OutletInfo[0].IsBuyAndPayOutlet
                    item.Cart.push(this.productDetailParse);
                    this.cartNew.cartNew.push(item);

                }
                localStorage.setItem('crt', JSON.stringify(this.cartNew));
            }
            else {
                let item = new CartOrder();
                item.OrderType = this.OrderType;
                item.OuteletID = this.outletInfo.OutletInfo[0].MerchantOutletId
                item.OutletName = this.outletInfo.OutletInfo[0].MerchantOutletName
                item.OutletRating = this.getStars((parseInt(this.outletInfo.OutletInfo[0].MerchantOutletRating) / 100))
                item.FoodCenterID = this.outletInfo.OutletInfo[0].FoodCentreId
                item.MerchantID = this.outletInfo.OutletInfo[0].MerchantId;
                item.MaxOutletInCart = this.outletInfo.OutletInfo[0].MaxOutletsInCart;
                item.FoodCenterName = this.outletInfo.OutletInfo[0].FoodCentreName
                item.IsBuyAndPayOutlet=this.outletInfo.OutletInfo[0].IsBuyAndPayOutlet
                item.Cart.push(this.productDetailParse);
                this.cartNew.cartNew.push(item);
                localStorage.setItem('crt', JSON.stringify(this.cartNew));
            }
            this._instanceService.sendCustomEvent("UpdateCart")

        } else if (this.OrderType === ORDER_DELIVERY) {//cart for delivery
            if (localStorage.getItem("crtd") != null) {//check cart exits
                this.cartNew = (JSON.parse(localStorage.getItem("crtd")));
            }
            let haveOutetInCart: boolean = false;
            if (this.cartNew.cartNew.length > 0) {//check cart not yet item
                let flagFoodCenter: boolean = this.checkFoodCenter(this.outletInfo.OutletInfo[0].FoodCentreId)
                if (!flagFoodCenter) {
                    $.magnificPopup.close()
                    // setTimeout(() => {
                    //     $.magnificPopup.open({
                    //         items: {
                    //             src: '#cart-popup'
                    //         },
                    //         type: 'inline'
                    //     });
                    // }, 50)

                    // this.errorCart = "please delete old your cart";
                    this.errorCart = "Adding items from "+ this.outletInfo.OutletInfo[0].MerchantOutletName + " will clear your existing cart.";
                    setTimeout(() => {
                        this.showPopupClearCart()
                    },100)
                    return;
                    
                }
                
                for (let l = 0; l < this.cartNew.cartNew.length; l++) {



                    if (this.outletInfo.OutletInfo[0].MerchantOutletId === this.cartNew.cartNew[l].OuteletID) {
                        haveOutetInCart = true;
                        let isExits: boolean;
                        let isCompare: boolean;
                        let countCompare: number = 0;
                        let arrayOptionInCart: any;
                        let arrayOptionItem = this.checkGroupOptionOfItem(this.productDetailParse);
                        for (let i = 0; i < this.cartNew.cartNew[l].Cart.length; i++) {
                            if (this.cartNew.cartNew[l].Cart[i].Id == this.productDetailParse.Id) {
                                isExits = true;

                                if (isExits) {
                                    arrayOptionInCart = this.checkGroupOptionOfItem(this.cartNew.cartNew[l].Cart[i]);

                                    isCompare = this.checkArrays(JSON.stringify(arrayOptionItem), JSON.stringify(arrayOptionInCart));
                                    
                                    if (isCompare) {
                                        this.cartNew.cartNew[l].Cart[i].Qty = this.cartNew.cartNew[l].Cart[i].Qty + this.productDetailParse.Qty;
                                        this.cartNew.cartNew[l].Cart[i].Total = this.cartNew.cartNew[l].Cart[i].Qty * (this.productDetailParse.Total) ;
                                        this.cartNew.cartNew[l].Cart[i].TotalStr= this._gof3rUtil.formatCurrency(this.cartNew.cartNew[l].Cart[i].Total, "S$")
                                        for (let j = 0; j < this.productDetailParse.OptionList.length; j++) {
                                            for (let h = 0; h < this.productDetailParse.OptionList[j].OptionItemList.length; h++) {
                                                
                                                this.cartNew.cartNew[l].Cart[i].OptionList[j].OptionItemList[h].Qty = this.cartNew.cartNew[l].Cart[i].OptionList[j].OptionItemList[h].Qty + this.productDetailParse.OptionList[j].OptionItemList[h].Qty
                                                this.subTotalOfOptionItem(this.cartNew.cartNew[l].Cart[i].OptionList[j].OptionItemList[h].OptionItemId, this.cartNew.cartNew[l].Cart[i].OptionList[j].OptionId, this.cartNew.cartNew[l].Cart[i]);
                                                this.subTotalItem(true, this.cartNew.cartNew[l].Cart[i])
                                            }
                                        }
                                    }
                                }

                            }
                        }
                        if (!isCompare) {
                            //this.cart.Cart.push(this.productDetailParse);
                            this.cartNew.cartNew[l].Cart.push(this.productDetailParse)

                        }
                    }
                }
                if (!haveOutetInCart) {
                    let item = new CartOrder();
                    item.OrderType = this.OrderType;
                    item.OuteletID = this.outletInfo.OutletInfo[0].MerchantOutletId
                    item.OutletName = this.outletInfo.OutletInfo[0].MerchantOutletName
                    item.OutletRating = this.getStars((parseInt(this.outletInfo.OutletInfo[0].MerchantOutletRating) / 100))
                    item.FoodCenterID = this.outletInfo.OutletInfo[0].FoodCentreId
                    item.MerchantID = this.outletInfo.OutletInfo[0].MerchantId;
                    item.MaxOutletInCart = this.outletInfo.OutletInfo[0].MaxOutletsInCart;
                    item.FoodCenterName = this.outletInfo.OutletInfo[0].FoodCentreName
                    item.IsBuyAndPayOutlet=this.outletInfo.OutletInfo[0].IsBuyAndPayOutlet
                    item.Cart.push(this.productDetailParse);
                    this.cartNew.cartNew.push(item);

                }
                localStorage.setItem('crtd', JSON.stringify(this.cartNew));
            }
            else {
                let item = new CartOrder();
                item.OrderType = this.OrderType;
                item.OuteletID = this.outletInfo.OutletInfo[0].MerchantOutletId
                item.OutletName = this.outletInfo.OutletInfo[0].MerchantOutletName
                item.OutletRating = this.getStars((parseInt(this.outletInfo.OutletInfo[0].MerchantOutletRating) / 100))
                item.Cart.push(this.productDetailParse);
                item.FoodCenterID = this.outletInfo.OutletInfo[0].FoodCentreId
                item.MerchantID = this.outletInfo.OutletInfo[0].MerchantId;
                item.MaxOutletInCart = this.outletInfo.OutletInfo[0].MaxOutletsInCart;
                item.FoodCenterName = this.outletInfo.OutletInfo[0].FoodCentreName
                item.IsBuyAndPayOutlet=this.outletInfo.OutletInfo[0].IsBuyAndPayOutlet
                this.cartNew.cartNew.push(item);
                localStorage.setItem('crtd', JSON.stringify(this.cartNew));
            }

            this._instanceService.sendCustomEvent("UpdateCart")

        }
        //this.orderMain.ArrayItem = this.cartNew.cartNew;

        this.subTotalOrder()
        this.subTotalEachCart()
        this.VerifyOrder();
        $.magnificPopup.close()



    }
    checkFoodCenter(foodCenterId: string) {
        let flagFoodCenter: boolean = false;
        if (foodCenterId) {
            for (let i = 0; i < this.cartNew.cartNew.length; i++) {
                if (this.cartNew.cartNew[i].FoodCenterID === foodCenterId) {
                    flagFoodCenter = true;
                }
            }
        }
        else {
            if(this.cartNew.cartNew[0].OuteletID==this.outletInfo.OutletInfo[0].MerchantOutletId){
                flagFoodCenter = true;
            }
            else{
                flagFoodCenter = false;
            }
            
        }
        return flagFoodCenter;
    }
    subTotalEachCart() {

        for (let i = 0; i < this.cartNew.cartNew.length; i++) {
            let total: number = 0
            for (let j = 0; j < this.cartNew.cartNew[i].Cart.length; j++) {
                total = total + this.cartNew.cartNew[i].Cart[j].Total;
            }
            this.cartNew.cartNew[i].Total = total;
            this.cartNew.cartNew[i].TotalDisplay = this._gof3rUtil.formatCurrency(this.cartNew.cartNew[i].Total, "S$")
        }
        if (this.OrderType === ORDER_DELIVERY) {
            localStorage.setItem('crtd', JSON.stringify(this.cartNew));
        }
        else {
            localStorage.setItem('crt', JSON.stringify(this.cartNew));
        }
    }
    addToCart1() {
        if (this.OrderType === ORDER_DELIVERY) {
            let haveOutletInCart: boolean = false;
            if (localStorage.getItem("crtd") != null) {//check cart exits
                this.cartNew = (JSON.parse(localStorage.getItem("crtd")));
            }
            if (this.cartNew.cartNew.length > 0) {// cart da co 1 phan tu tro len
                for (let i = 0; i < this.cartNew.cartNew.length; i++) {
                    if (this.cartNew.cartNew[i].OuteletID === this.outletInfo.OutletInfo[0].MerchantOutletId) {
                        haveOutletInCart = true;

                    }
                }
            } else {// cart chua co phan tu nao het

            }
        }
    }
    checkGroupOrderToCart(itemId: number, speciaRequest: string) {
        let isCompare: boolean;
        for (let i = 0; i < this.cart.Cart.length; i++) {
            if (this.cart.Cart[i].Id == itemId && this.cart.Cart[i].SpecialRequest == speciaRequest) {
                isCompare = true;
            }
        }
    }
    checkGroupOptionOfItem(item: ProductDetailParseModel) {
        let arryOptionItemId = [];
        
        if (item.OptionList.length > 0) {
            for (let i = 0; i < item.OptionList.length; i++) {
                for (let j = 0; j < item.OptionList[i].OptionItemList.length; j++) {
                    if (item.OptionList[i].OptionItemList[j].Qty > 0 && item.OptionList[i].OptionItemList[j].isCheck == true) {
                        arryOptionItemId.push({ 'idOptionItem': item.OptionList[i].OptionItemList[j].OptionItemId, 'Qty': item.OptionList[i].OptionItemList[j].Qty, 'note': item.SpecialRequest })
                    }
                }
            }
        }
        else {
            arryOptionItemId.push({ 'idOptionItem': item.Id, 'Qty': item.Qty, 'note': item.SpecialRequest })
        }

        
        return arryOptionItemId;
    }
    checkArrays(arrA, arrB) {

        //check if lengths are different
       
        if (arrA.length !== arrB.length) return false;


        for (var i = 0; i < arrA.length; i++) {
            if (arrA[i] !== arrB[i]) return false;
        }

        return true;

    }
    loadCart() {
        this.orderMain = new OrderModel();
        if (this.OrderType === ORDER_PICKUP) {
            if (localStorage.getItem("crt") != null) {//check when had cart
                this.haveCart = true;
                this.cartNew = JSON.parse(localStorage.getItem("crt"));


                // this.orderMain.PickupAt = this.outletInfo.OutletInfo[0].Address
                // this.orderMain.MerchantId = this.outletInfo.OutletInfo[0].MerchantId;
                if (this.cartNew.cartNew.length > 0) {
                    //this.orderMain.ArrayItem = this.cart.Cart;
                    if (this.cart.OrderType === ORDER_PICKUP) {
                        // this.isPickup = true;
                        // this.isDelivery = false;

                    }
                    else {

                        // this.isDelivery = true;
                        // this.isPickup = false;
                    }
                    this.subTotalOrder();
                    // this.showCartEmpty = false
                    // this.showCart = true
                }
                else {
                    // this.showCartEmpty = true
                    // this.showCart = false
                    this.haveCart = false;

                }

            }
            else {//init frist time
                // this.showCartEmpty = true
                // this.showCart = false
                this.haveCart = false;

            }
        } else if (this.OrderType === ORDER_DELIVERY) {//cart for delivery
            if (localStorage.getItem("crtd") != null) {//check when had cart
                this.haveCart = true;
                this.cartNew = JSON.parse(localStorage.getItem("crtd"));
                //this.orderMain.DeliveryTo = this.currentAddress
                if (this.cartNew.cartNew.length > 0) {
                    //this.orderMain.ArrayItem = this.cart.Cart

                    this.subTotalOrder();

                    // this.setDeliveryDateAndTimes(true)
                }
                else {

                    this.haveCart = false;

                }

            }
            else {//init frist time
                this.haveCart = false;
                // this.showCart = false

            }
        }
        //get option item of item
        this.VerifyOrder();
        this.subTotalEachCart()
        this.upadteShowOpntionItem()

    }
    upadteShowOpntionItem() {
        for (let i = 0; i < this.cart.Cart.length; i++) {
            let opitem = "";
            for (let j = 0; j < this.cart.Cart[i].OptionList.length; j++) {
                for (let k = 0; k < this.cart.Cart[i].OptionList[j].OptionItemList.length; k++) {
                    if (this.cart.Cart[i].OptionList[j].OptionItemList[k].isCheck === true) {
                        opitem = opitem + this.cart.Cart[i].OptionList[j].OptionItemList[k].OptionItemName + this.cart.Cart[i].OptionList[j].OptionItemList[k].PriceDisplay + " ; "
                    }
                }

            }
            this.cart.Cart[i].OptionItemsStr = opitem.substring(0, opitem.length - 2);
        }
    }
    subTotalOrder() {

        let subtotal = 0;
        // for (let i = 0; i < this.orderMain.ArrayItem.length; i++) {
        //     subtotal = subtotal + this.orderMain.ArrayItem[i].Total;
        // }
        for (let i = 0; i < this.cartNew.cartNew.length; i++) {
            for (let j = 0; j < this.cartNew.cartNew[i].Cart.length; j++) {
                subtotal = subtotal + this.cartNew.cartNew[i].Cart[j].Total
            }
        }
        this.orderMain.SubTotal = subtotal;
        this.orderMain.SubTotalStr = this._util.formatCurrency(this.orderMain.SubTotal, "S$")

        let _total = (this.orderMain.SubTotal + this.orderMain.ServiceFeeValue + this.orderMain.Surcharge + this.orderMain.DeliveryFee + this.orderMain.RiderTip) - (this.orderMain.PromoCodeValue + this.orderMain.Credit + this.orderMain.Discount);

        this.orderMain.Total = _total;
        this.orderMain.TotalDisplay = this._util.formatCurrency(this.orderMain.Total, "S$");
    }
    removeQty(i) {

        if (this.cart.Cart[i].Qty > 1) {
            let totalAnyItem = this.cart.Cart[i].Total / this.cart.Cart[i].Qty;
            this.cart.Cart[i].Qty--;
            this.cart.Cart[i].Total = this.cart.Cart[i].Total - totalAnyItem;
            this.cart.Cart[i].TotalStr = this._util.formatCurrency(this.cart.Cart[i].Total, "S$")
            localStorage.setItem("crt", JSON.stringify(this.cart))
            this.orderMain.ArrayItem = this.cart.Cart;
            //this.VerifyOrder()
        }

    }
    removeCart(indexCart: number, index: number) {

        this.blockUI.start()
        this.removeCartFlag = true;
        this.cartNew.cartNew[indexCart].Cart.splice(index, 1);
        if (this.OrderType === ORDER_PICKUP) {
            localStorage.setItem("crt", JSON.stringify(this.cartNew))
        }
        else if (this.OrderType === ORDER_DELIVERY) {
            localStorage.setItem("crtd", JSON.stringify(this.cartNew))
        }

        this.orderMain.ArrayItem = this.cartNew.cartNew[indexCart].Cart;


        if (this.cartNew.cartNew[indexCart].Cart.length <= 0) {


            this.cartNew.cartNew.splice(indexCart, 1);
            if (this.OrderType === ORDER_PICKUP) {
                localStorage.setItem("crt", JSON.stringify(this.cartNew))
            }
            else if (this.OrderType === ORDER_DELIVERY) {
                localStorage.setItem("crtd", JSON.stringify(this.cartNew))
            }
        }

        if (this.cartNew.cartNew.length <= 0) {

            this.haveCart = false
            //this.showCart = false
        }
        this.VerifyOrder();
        this.subTotalOrder()
        this.subTotalEachCart()


    }
    showAddSpecial() {
        $('.text-special').slideDown();
    }
    UpadteCartAndClose() {
        this.orderMain.ArrayItem = this.cartNew.cartNew[this.indexCart].Cart
        this.subTotalOrder()
        if (this.OrderType === ORDER_DELIVERY) {
            localStorage.setItem("crtd", JSON.stringify(this.cartNew));
        } else {
            localStorage.setItem("crt", JSON.stringify(this.cartNew));
        }
        this.showUpdateProduct = false
        $.magnificPopup.close()
    }
    checkOut() {
        // if (this.cart.OuteletID === this.outletInfo.OutletInfo[0].MerchantOutletId) {
        if (localStorage.getItem("cus") != null) {
            if (this.OrderType === ORDER_PICKUP) {
                if (!this.orderMain.PickupDateFrom || !this.orderMain.PickupDateTo) {
                    this.errorCart = "please select time to pickup"
                    $.magnificPopup.open({
                        items: {
                            src: '#pickup-date'
                        },
                        type: 'inline'
                    });
                }
                else {
                    this._router.navigateByUrl('/check-out')
                }
            }
            else {
               
                this.DeliveryAddress()
                // if(this.orderMain.DeliveryId===""){
                //      this.errorCart="please select address delivery"
                //      $.magnificPopup.open({
                //         items: {
                //             src: '#pickup-date'
                //         },
                //         type: 'inline'
                //     });
                // }else{
                //     this._router.navigateByUrl('/check-out')
                // }  
            }

        } else {
            $('.showloginform').slideDown();
            $('.login-overlay').addClass('show');
            $(this).addClass('hide-form');
            $('body').css({
                overflow: 'hidden',
                height: '100%'
            });;
        }
        //}
        // else {
        //     setTimeout(() => {
        //         $.magnificPopup.open({
        //             items: {
        //                 src: '#cart-popup'
        //             },
        //             type: 'inline'
        //         });
        //     }, 50)

        //     this.errorCart = "please delete old your cart";
        // }


    }
    deleteCartOld() {
        if (this.OrderType === ORDER_PICKUP) {
            localStorage.removeItem("crt");
            this.cartNew = new CartOrderNew();
            this.loadCart()
            $.magnificPopup.close()
        }
        else {
            localStorage.removeItem("crtd");
            this.cartNew = new CartOrderNew();
            this.loadCart()
            $.magnificPopup.close()
        }
    }
    closePopupSelectTimes() {
        $.magnificPopup.close()
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
    DeliveryAddress() {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetDeliveryAddresses";
        let common_data_json = JSON.stringify(common_data);
        if (localStorage.getItem('cus') != null) {
            this.customerInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem('cus')));


            let data_request = { CustomerId: this.customerInfo.CustomerInfo[0].CustomerId };
            let data_request_json = JSON.stringify(data_request);

            this._pickupService.GetDeliveryAddresses(common_data_json, data_request_json).then(data => {
                this.listDeliveryAddress = data;
                this._gof3rModule.checkInvalidSessionUser(this.listDeliveryAddress.ResultCode);
                if (this.listDeliveryAddress.DeliveryAddressList.length > 0) {
                    // if(localStorage.getItem("addressDelivery")==null){
                    //     localStorage.setItem("addressDelivery", JSON.stringify(this.listDeliveryAddress.DeliveryAddressList[0]))
                    // }
                    // if (localStorage.getItem("address") != null) {
                    //     this.addressDeli = JSON.parse(localStorage.getItem("address"));
                    //     if (this.addressDeli.AddressListInfo[0].AddressId != "") {
                    //         this._router.navigateByUrl('/check-out')
                    //     }
                    //     else {
                    //         this.errorCart = "Your delivery address do not add, please select other delivery address."
                    //         this.showPopupDepivery()
                    //     }
                    // }
                    // else {
                    if (localStorage.getItem("haveNewAddress") != null) {
                        let haveNew: boolean = JSON.parse(localStorage.getItem("haveNewAddress"));
                        if (haveNew) {
                            if (localStorage.getItem("address") != null) {
                                this.addressDeli = JSON.parse(localStorage.getItem("address"));
                                if (this.addressDeli.AddressListInfo[0].AddressId != "") {
                                    this._router.navigateByUrl('/check-out')
                                }
                                else {
                                    // this.errorCart = "Your delivery address do not add, please select other delivery address."
                                    // this.showPopupDepivery()
                                    this.lat = this.addressDeli.AddressListInfo[0].lat;
                                    this.lng = this.addressDeli.AddressListInfo[0].long;
                                    this.nameAddress=this.addressDeli.AddressListInfo[0].Name
                                    this.showPopupAddAddreess()
                                }
                            }
                        }
                        else{
                            if (localStorage.getItem("addressDelivery") != null) {
                                let addressDelivery = JSON.parse(localStorage.getItem("addressDelivery"));
                                if (addressDelivery.AddressId != "") {
                                    this._router.navigateByUrl('/check-out')
                                }
                                else {
                                    // this.errorCart = "Your delivery address do not add, please select other delivery address."
                                    // this.showPopupDepivery()
                                    this.showPopupAddAddreess()
                                }
                            }
                            
                        }
                    }
                    else{
                        if (localStorage.getItem("addressDelivery") != null) {
                            let addressDelivery = JSON.parse(localStorage.getItem("addressDelivery"));
                            if (addressDelivery.AddressId != "") {
                                this._router.navigateByUrl('/check-out')
                            }
                            else {
                                this.errorCart = "Your delivery address do not add, please select other delivery address."
                                this.showPopupDepivery()
                            }
                        }
                    }
                    

                    //}

                }
                else {
                    this.errorCart = "please add address delivery"
                    $.magnificPopup.open({
                        items: {
                            src: '#pickup-date'
                        },
                        type: 'inline'
                    });
                }

            })
        }

    }
    showPopupDepivery() {
        var el = $('#pickup-date');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el,

                    showCloseBtn: false,
                },
                type: 'inline',
                modal: true,
            });
        }
    }
    VerifyOrder() {
        if (localStorage.getItem("ot") != null) {
            this.verifyOrderMain = new VerifyOrderMainModel();
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "VerifyOrder";
            let common_data_json = JSON.stringify(common_data);

            let requestData = new VerifyOrderRequest();
            requestData.OrderType = this.OrderType;
            if (this.cartNew.cartNew.length > 1) {
                requestData.IsCombinedOrder = "Y"
                requestData.MerchantId = ""
                requestData.MerchantOutletId = ""
                requestData.CombinedOrderInfo = this.combinedOrderInfo();
            }
            else {
                requestData.IsCombinedOrder = "N"
                requestData.MerchantId = this.outletInfo.OutletInfo[0].MerchantId;
                requestData.MerchantOutletId = this.outletInfo.OutletInfo[0].MerchantOutletId;

            }
            //requestData.CombinedOrderInfo=this.combinedOrderInfo();

            if (this.customerInfo.CustomerInfo != null) {
                requestData.CustomerId = this.customerInfo.CustomerInfo[0].CustomerId + ''
            }
            else {
                requestData.CustomerId = ''
            }

            requestData.ProductList = this.listProduct()
            requestData.CurrencyCode = this.outletInfo.OutletInfo[0].CurrencyCode
            let totalRequest = this._gof3rModule.ParseTo12(this.orderMain.SubTotal)
            requestData.Subtotal = totalRequest;
            let requestDataJson = JSON.stringify(requestData);
            
            this._pickupService.VerifyOrder(common_data_json, requestDataJson).then(data => {
                this.verifyOrderMain = data
                if (this.verifyOrderMain.ResultCode === "000") {
                    this.verifyOrderMain = data;
                    this.hadVeryfiOrder = true
                    if (this.removeCartFlag == true) {
                        this.blockUI.stop()
                    }
                }
                else {
                    this.checkError(this.verifyOrderMain.ResultCode, this.verifyOrderMain.ResultDesc, this.verifyOrderMain.ServiceName)
                }
                


            })
        }
    }
    showpopupInfor() {
        this.openPopupOutletInfor()
    }
    SubtractionQtyOptionItem(optionItemId: string, optionId: number, index: number) {
        
        let hadCheck: boolean;
        hadCheck = this.checkItemHadCheck(optionItemId, optionId);
        if (hadCheck) {// option item checked
            
            let minQuanty = this.getMinQuantyOptionItem(optionItemId, optionId);
            let qtyOptionItem = this.getQuantyOfOptionItem(optionItemId, optionId);
            if (qtyOptionItem > minQuanty && minQuanty != 0) {
                // this.SubQuatyOptionItem1(optionItemId, optionId);

                this.SubQuatyOptionItem1(optionItemId, optionId);

            }
            if (minQuanty == 0) {
                if (this.getQuantyOfOptionItem(optionItemId, optionId) > 1) {

                    this.SubQuatyOptionItem1(optionItemId, optionId);

                }
            }
        } else {//option item no checked
            
        }
        this.subTotalOfOptionItem(optionItemId, optionId, this.productDetailParse)
        this.subTotalItem(false, this.productDetailParse);
    }
    SubQuatyOptionItem(optionItem: string, optionId: number, index) {
        for (let i = 0; i < this.cart.Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            for (let j = 0; j < this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId && this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].OptionItemId == optionItem) {
                    this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].Qty--;
                }
            }
        }
    }
    checkItemHadCheck(optionItemId: string, optionId: number) {
        let hadCheck: boolean;

        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                if (this.productDetailParse.OptionList[i].OptionId === optionId && this.productDetailParse.OptionList[i].OptionItemList[j].OptionItemId === optionItemId) {
                    if (this.productDetailParse.OptionList[i].OptionItemList[j].isCheck == true) {
                        hadCheck = true;
                    }
                }
            }
        }
        return hadCheck;
    }
    checkItemHadCheck1(optionItemId: string, optionId: number) {
        let hadCheck: boolean;
        
        for (let i = 0; i < this.cart.Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            for (let j = 0; j < this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionId === optionId && this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].OptionItemId === optionItemId) {
                    if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true) {
                        hadCheck = true;
                    }
                }
            }
        }
        return hadCheck;
    }
    getMaxQuantyOptionItem(optionItem: string, optionId: number) {
        let maxQuaty = 0;
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                if (this.productDetailParse.OptionList[i].OptionId == optionId && this.productDetailParse.OptionList[i].OptionItemList[j].OptionItemId == optionItem) {
                    maxQuaty = this.productDetailParse.OptionList[i].OptionItemList[j].MaxQuantityRequired;
                }
            }
        }
        return maxQuaty;
    }

    getMinQuantyOptionItem(optionItem: string, optionId: number) {
        let minQuaty: number = 0;
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                if (this.productDetailParse.OptionList[i].OptionId == optionId && this.productDetailParse.OptionList[i].OptionItemList[j].OptionItemId == optionItem) {
                    minQuaty = this.productDetailParse.OptionList[i].OptionItemList[j].MinQuantityRequired;
                }
            }
        }
        return minQuaty;
    }
    getQuantyOfOptionItem(optionItem: string, optionId: number) {
        let quaty = 0;
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                if (this.productDetailParse.OptionList[i].OptionId == optionId && this.productDetailParse.OptionList[i].OptionItemList[j].OptionItemId == optionItem) {
                    quaty = this.productDetailParse.OptionList[i].OptionItemList[j].Qty;
                }
            }
        }
        return quaty;
    }
    SubQuatyOptionItem1(optionItem: string, optionId: number) {
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                if (this.productDetailParse.OptionList[i].OptionId == optionId && this.productDetailParse.OptionList[i].OptionItemList[j].OptionItemId == optionItem) {
                    this.productDetailParse.OptionList[i].OptionItemList[j].Qty--;
                }
            }
        }
    }
    additionQtyOptionItem(optionItemId: string, optionId: number, index: number) {
        
        let hadCheck: boolean;
        hadCheck = this.checkItemHadCheck(optionItemId, optionId)
        if (hadCheck) {// option item checked

            let maxQuanty = this.getMaxQuantyOptionItem(optionItemId, optionId);
            let qtyOptionItem = this.getQuantyOfOptionItem(optionItemId, optionId);
            if (qtyOptionItem < maxQuanty && maxQuanty != 0) {
                this.addQuatyOptionItem1(optionItemId, optionId)

            }
            if (maxQuanty == 0) {

                this.addQuatyOptionItem1(optionItemId, optionId);

            }
        } else {//option item no checked
            this.checkOptionItem(optionItemId, optionId, index)
        }
        this.subTotalOfOptionItem(optionItemId, optionId, this.productDetailParse)
        this.subTotalItem(false, this.productDetailParse);
        
    }
    addQuatyOptionItem1(optionItem: string, optionId: number) {
        for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
            for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                if (this.productDetailParse.OptionList[i].OptionId == optionId && this.productDetailParse.OptionList[i].OptionItemList[j].OptionItemId == optionItem) {
                    this.productDetailParse.OptionList[i].OptionItemList[j].Qty++;
                }
            }
        }
    }
    listProduct(): string {
        //"81,000000000050,1,^^^23,27,000000000050,1###35,000000000050,1,^^^21,21,000000000050,1===21,23,000000000050,1"
        let dataString = "";
        let count: number = 0;
        this.orderMain.ArrayItem = [];
        
        for (let t = 0; t < this.cartNew.cartNew.length; t++) {
            for (let u = 0; u < this.cartNew.cartNew[t].Cart.length; u++) {
                this.orderMain.ArrayItem.push(this.cartNew.cartNew[t].Cart[u]);
            }

        }

        for (let i = 0; i < this.orderMain.ArrayItem.length; i++) {
            count = 0;

            if (this.orderMain.ArrayItem[i].SpecialRequest) {

                dataString = dataString + this.orderMain.ArrayItem[i].Id + "," + (this.orderMain.ArrayItem[i].Price) + "," + this.orderMain.ArrayItem[i].Qty + "," + this.orderMain.ArrayItem[i].SpecialRequest;
            }
            else {
                dataString = dataString + this.orderMain.ArrayItem[i].Id + "," + (this.orderMain.ArrayItem[i].Price) + "," + this.orderMain.ArrayItem[i].Qty;
            }

            for (let j = 0; j < this.orderMain.ArrayItem[i].OptionList.length; j++) {
                for (let k = 0; k < this.orderMain.ArrayItem[i].OptionList[j].OptionItemList.length; k++) {
                    if (this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].Qty > 0) {
                        count++

                        if (count > 1) {
                            dataString = dataString + "===" + this.orderMain.ArrayItem[i].OptionList[j].OptionId + "," + this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].OptionItemId + "," + this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].Price + "," + this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].Qty;
                        }
                        else {
                            dataString = dataString + ",^^^" + this.orderMain.ArrayItem[i].OptionList[j].OptionId + "," + this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].OptionItemId + "," + this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].Price + "," + this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].Qty;
                        }

                    }
                }


            }

            let str = dataString.slice(dataString.length - 3)
            if (str === "===" || str === "###") {
                dataString = dataString.slice(0, dataString.length - 3)
            }
            if (this.orderMain.ArrayItem.length > 1) {
                if (i !== this.orderMain.ArrayItem.length - 1) {
                    dataString = dataString + "###";
                }

            }

        }

        return dataString;
    }
    combinedOrderInfo() {
        //let productList=this.listProduct();
        let combineInfor: string = ""
        for (let u = 0; u < this.cartNew.cartNew.length; u++) {
            let dataString = "";
            let count: number = 0;
            for (let t = 0; t < this.cartNew.cartNew[u].Cart.length; t++) {
                count = 0;
                if (this.cartNew.cartNew[u].Cart[t].SpecialRequest) {

                    dataString = dataString + this.cartNew.cartNew[u].Cart[t].Id + "," + (this.cartNew.cartNew[u].Cart[t].Price) + "," + this.cartNew.cartNew[u].Cart[t].Qty + "," + this.cartNew.cartNew[u].Cart[t].SpecialRequest;
                }
                else {
                    dataString = dataString + this.cartNew.cartNew[u].Cart[t].Id + "," + (this.cartNew.cartNew[u].Cart[t].Price) + "," + this.cartNew.cartNew[u].Cart[t].Qty;
                }

                for (let j = 0; j < this.cartNew.cartNew[u].Cart[t].OptionList.length; j++) {
                    for (let k = 0; k < this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionItemList.length; k++) {
                        if (this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionItemList[k].Qty > 0) {
                            count++

                            if (count > 1) {
                                dataString = dataString + "===" + this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionId + "," + this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionItemList[k].OptionItemId + "," + this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionItemList[k].Price + "," + this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionItemList[k].Qty;
                            }
                            else {
                                dataString = dataString + ",^^^" + this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionId + "," + this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionItemList[k].OptionItemId + "," + this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionItemList[k].Price + "," + this.cartNew.cartNew[u].Cart[t].OptionList[j].OptionItemList[k].Qty;
                            }

                        }
                    }


                }
                let str = dataString.slice(dataString.length - 3)
                if (str === "===" || str === "###") {
                    dataString = dataString.slice(0, dataString.length - 3)
                }
                if (this.cartNew.cartNew[u].Cart.length > 1) {
                    if (t !== this.cartNew.cartNew[u].Cart.length - 1) {
                        dataString = dataString + "###";
                    }

                }
            }
            combineInfor = combineInfor + this.cartNew.cartNew[u].MerchantID + ";" + this.cartNew.cartNew[u].OuteletID + ";" + this._gof3rModule.ParseTo12(this.cartNew.cartNew[u].Total) + ";" + dataString + "***"

        }
        combineInfor = combineInfor.slice(0, combineInfor.length - 3)
        return combineInfor;
    }
    showPopupddCardError() {
        var el = $('#add-card');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    showPopupddMapOutlet() {
        var el = $('#map-outlet');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    showPopupddMapOutletPickup() {
        var el = $('#map-outlet-pickup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    checkError(errorCode: string, ErrorDesc: string, serviceName: string) {
        this.blockUI.stop()
        this.error.ResultCode = errorCode
        this.error.ResultDesc = ErrorDesc
        this.error.ServiceName = serviceName
        
        this.showPopupddCardError()
    }
    goToOrder(merchantOutletID: string) {
        
        this.GetCurrentSystemTime(merchantOutletID)

    }
    GetCurrentSystemTime(merchantOutletID: string) {


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

            this.GetAllOutletListV2(strDatime, merchantOutletID)


        })

    }
    GetAllOutletListV2(orderFor: string, outletID: string) {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetAllOutletListV2";
        let common_data_json = JSON.stringify(common_data);

        let request_data = new GetAllOutletListV2Request();
        request_data.OrderType = this.OrderType
        request_data.OrderFor = orderFor
        request_data.CustomerId = "";
        request_data.FromRow = 0;
        if (this.getInitialParams.MCCInfo.length > 0) {
            for (let i = 0; i < this.getInitialParams.MCCInfo.length; i++) {

                if (this.getInitialParams.MCCInfo[i].Value == "Food") {

                    this.mccGobal = this.getInitialParams.MCCInfo[i].Id + '';
                }
            }
        }
        request_data.MCC = this.mccGobal;
        request_data.KeyWords = "";
        request_data.MerchantOutletId = outletID;
        request_data.SubCategoryId = "";
        let request_data_json = JSON.stringify(request_data);

        
        this._pickupService.GetAllOutletListV2(common_data_json, request_data_json).then(data => {
            //this._gof3rModule.checkInvalidSessionUser(data.ResultCode);

            this.getAllOutletListV2 = data;
            
            if (this.getAllOutletListV2.MerchantOutletListInfo.length === 0) {
                // this.noData=true;
                // this.haveData=false;
                //     let data ={function:"outletMap",haveOutlet:1}
                //    this._instanceService.sendCustomEvent(data)
                this.haveOuteFromMap = 0;
                
                // let msg ="This restaurant doesn't deliver to your area. <br />Click here to browse retaurants in your area."
                //this.checkError("",msg,"")
                
               if(this.OrderType==ORDER_DELIVERY)
               {
                this.showPopupddMapOutlet()
               }
               else{
                   this.showPopupddMapOutletPickup()
               }
                   
            }

            // else {
            //     let data ={function:"outletMap",haveOutlet:0,msg:this.getAllOutletListV2.NoMessageDataForOutletList}
            //    this._instanceService.sendCustomEvent(data)
            // }
            // localStorage.setItem("out",outletID);
            // localStorage.setItem("orderType",ORDER_DELIVERY)
            // this.router.navigateByUrl("/order")

        })
    }
    goToListOutlet() {
        $.magnificPopup.close()
        this._router.navigateByUrl("/search-result")
    }
    showPopupClearCart() {
        var el = $('#clear-cart');
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
    
    showPopupAddAddreess() {
        var el = $('#address-popup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el,
                    
                },
                type: 'inline',
                
            });
        }
    }
    goBack(){
        $.magnificPopup.close()
    }
    clearCart(){
        if (this.OrderType === ORDER_PICKUP) {
            localStorage.removeItem("crt");
            this.cartNew = new CartOrderNew();
            this.loadCart()
            $.magnificPopup.close()
        }
        else {
            localStorage.removeItem("crtd");
            this.cartNew = new CartOrderNew();
            this.loadCart()
            $.magnificPopup.close()
        }
        this.addToCart()
    }
    addDeliveryAddress() {
        if (parseFloat(this.lat) > 0 && parseFloat(this.lng) > 0) {
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "AddDeliveryAddress";
            let common_data_json = JSON.stringify(common_data);

            let data_request = new AddeliveryAddressModel();




            
            data_request.Address = this.nameAddress
            data_request.ApartmentNoBuildingName = ""
            data_request.InstructionForRider = ""
            data_request.Nickname = "";
            data_request.PhoneNumber = ""
            data_request.PostalCode = ""
            data_request.CustomerId = this.customerInfo.CustomerInfo[0].CustomerId + ''
            data_request.GeoLocation = this.lat + ',' + this.lng;
            let data_request_json = JSON.stringify(data_request);

            this._pickupService.AddDeliveryAddress(common_data_json, data_request_json).then(data => {

                if (data.ResultCode === '000') {
                    
                    this.addressList = new AddressListModel();
                    localStorage.setItem("haveNewAddress",JSON.stringify(false));
                    let item = new AddressIteModel();
                    item.lat = this.lat + ''
                    item.long = this.lng + ''
                    item.isCheck = true;
                    item.Name = this.nameAddress
                    item.StreetAddress= this.nameAddress;
                    this.addressList.AddressListInfo.push(item);
                    localStorage.setItem('address', JSON.stringify(this.addressList));
                    let addressDelivery={AddressId:data.AddressId, GeoLocation:this.lat + ',' + this.lng,Address:this.nameAddress}
                    localStorage.setItem("addressDelivery",JSON.stringify(addressDelivery))
                    this.orderMain.DeliveryId=data.AddressId
                    this.lat = "0";
                    this.lng = "0";
                    $("#input-address-1").val("");
                    this.nameAddress=""
                    $.magnificPopup.close()
                }
            })

        }
    }

}