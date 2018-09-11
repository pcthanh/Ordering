import { Component, OnInit } from '@angular/core';
import { CommonDataRequest } from "../models-request/request-comon-data";
import { GetProductListRequest } from "../models-request/get-request-product-list";
import { PickupService } from "../services/pickup.service";
import { EventSubscribeService } from "../services/instance.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GetOutletInfoRequest } from "../models-request/get-outlet-info";
import { MerchantOutletListInfoModel } from "../models/MerchantOutletListInfo";
import { OutletInfoModel } from "../models/OutletInfo";
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
import { OrderModel } from "../models/Order";
import { VerifyOrderMainModel } from "../models/VerifyOrderMain";
import { VerifyOrderRequest } from "../models-request/verify-order-request";
import { UpdateCardTransactionRequest } from "../models-request/update-card-transaction";
import { ErrorModel } from "../models/Error";
import { PlaceOrder } from "../models/PlaceOrder";
import { MakePaymentRequestModel } from "../models-request/make-paymeny";
import { PlaceOrderDeliveryModel } from "../models-request/place-order-delivery";
import { MakePaymentModel } from "../models/MakePayment";
import { AddTransactionRequestModel } from "../models-request/add-transaction";
import { GetAllPaymentOptionRequest } from "../models-request/get-all-payment-options";
import { GetAllPaymentOptionsWithPromotionModle } from "../models/GetAllPaymentOptionsWithPromotion";
import { GetAllOutletListV2Request } from "../models-request/get-all-outlet-list-v2"
import { GetAllOutletListV2Model } from "../models/GetAllOutletListV2";
import { GetInitialParams } from "../models/GetInitialParams";
import { MCCInfoModel } from "../models/MCCInfo";
import { ListDeliveryAddress } from "../models/ListDeliveryAddress";
import { SelectMethodPayment } from "../models/SelectMethodPayment";
import { PromoCodeList } from "../models/PromoCodeList";
import { SelectPromoCode } from "../models/SelectPromoCode";
import { ApplyPromocodeRequest } from "../models-request/apply-promocode";
import { PromoCodeMainModel } from "../models/PromoCodeMain";
import { AddCardModel } from "../models/AddCard";
import { VerifyCard } from "../models/VerifyCard";
import { AddNewCardModel } from "../models-request/add-new-card";

import * as moment_ from 'moment';
const ORDER_DELIVERY: string = "DELIVERY"
const ORDER_PICKUP: string = "PICKUP"
declare var $: any;
@Component({
    selector: 'page-checkout',
    templateUrl: 'page-checkout.component.html'
})

export class PageCheckOutComponent implements OnInit {
    OrderType: string;
    OutletId: string;
    outletInfo: OutletInfoModel;
    productList: ProductListModel;
    productDetail: ProductDetailMainModel;
    productDetailParse: ProductDetailParseModel;
    isCheck = true;
    total: number = 220;
    str: string;
    cart: CartOrder;
    getInitParam: GetInitialParams;
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
    verifyOrderMain: VerifyOrderMainModel;
    IndexItemCartUpdate: number;
    showUpdateProduct: boolean = false;
    indexOld: number = -1
    makePaymentMain: MakePaymentModel;
    addCradModel: AddTransactionRequestModel;
    placeOrderMain: PlaceOrder
    errorAddCard: boolean = false;
    error: ErrorModel
    errorAddCardDisplay: string = ""
    PO: string = ""
    isError: boolean = false
    maskingCardNumber: string = ""
    creditDisplay: string = ""
    creditAmount: number = 0;
    allPayment: GetAllPaymentOptionsWithPromotionModle;
    checked = false;
    getInitialParams: GetInitialParams;
    mccInfor: MCCInfoModel;
    mccGobal: string = ""
    getAllOutletListV2: GetAllOutletListV2Model;
    listAddressDelivery: ListDeliveryAddress;
    allPaymentget: boolean = false;
    medthodPayment: string = ""
    selectMethod: SelectMethodPayment;
    selectedCard: boolean = false;
    loadPromoCodeComplete: boolean = false;
    selectPromoCodeModel: SelectPromoCode;
    promoCodeMain: PromoCodeMainModel;
    noData: boolean = false;
    selectedPromoCode: boolean = false;
    addCardData: AddCardModel;
    riderTip = [{ label: '$2.00', value: 2, ck: false }, { label: '$3.00', value: 3, ck: false }, { label: '$4.00', value: 4, ck: false }]
    cadrMonth = [{ label: "01", value: '01' }, { label: "02", value: '02' }, { label: "03", value: '03' }, { label: "04", value: '04' }, { label: "05", value: '05' }, { label: "06", value: '06' }, { label: "07", value: '07' }, { label: "08", value: '08' }, { label: "09", value: '09' }, { label: "10", value: '10' }, { label: "11", value: '11' }, { label: "12", value: '12' }]
    cardYear: any[] = []
    verifycard: VerifyCard;
    selectMonthStr: string = ""
    @BlockUI() blockUI: NgBlockUI;
    fromDate: string = ""
    toDate: string = ""
    promoCodeList: PromoCodeList;
    customerOrderId: string = ""
    lat: number = 0;
    lng: number = 0;
    geoHome: string = ""
    orderNote: string = ""
    countrys: any[] = []
    styles = [{
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [{
            color: "#E8E4DB"

        }]
    },
    {
        featureType: "landscape",
        elementType: "geometry.stroke",
        stylers: [{
            visibility: "off",

        }]
    },
    {
        featureType: "landscape.natural",
        elementType: "geometry.fill",
        stylers: [{
            hue: "#F0ECE4",


        }]
    },
    {
        featureType: "poi",
        elementType: "geometry.fill",
        stylers: [{
            color: "#F0ECE4",


        }]
    },

    {
        featureType: "poi",
        elementType: "geometry.stroke",
        stylers: [{
            visibility: "off",


        }]
    },
    {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [{

            visibility: "off"
        }]
    },
    {
        featureType: "poi",
        elementType: "labels.icon",
        stylers: [{

            visibility: "off"
        }]
    },
    {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [{
            color: "#E8E4DB",


        }]
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{
            color: "#635E5A",


        }]
    },
    {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [{
            color: "#FFFFFF",


        }]
    },

    {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{
            color: "#FFFFFF",


        }]
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{
            color: "#DCD6CD",


        }]
    },
    {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [{
            color: "#DCD6CD",


        }]
    },
    {
        featureType: "road.local",
        elementType: "geometry.stroke",
        stylers: [{
            visibility: "off",


        }]
    },
    {
        featureType: "water",
        stylers: [{
            visibility: "on",


        }]
    },
    {
        featureType: "water",
        elementType: "labels.text",
        stylers: [{


            visibility: "off"
        }]
    },
    {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{
            color: "#C8D1DF",


        }]
    },
    {
        elementType: "labels.icon",
        stylers: [{
            visibility: "off"
        }]
    }
    ];
    arrayLocation: any[] = []
    constructor(private route: Router, private _gof3rUtil: Gof3rUtil, private _gof3rModule: Gof3rModule, private _util: Gof3rUtil, private _pickupService: PickupService, private _instanceService: EventSubscribeService, private active_router: ActivatedRoute) {
        this.blockUI.start('loading ...'); // Start blocking
        this.cartOrderMain = new CartOrder();
        this.orderMain = new OrderModel();
        this.makePaymentMain = new MakePaymentModel();
        this.error = new ErrorModel();
        this.placeOrderMain = new PlaceOrder()
        this.addCradModel = new AddTransactionRequestModel()
        this.cart = new CartOrder();
        this.getAllOutletListV2 = new GetAllOutletListV2Model();
        this.listAddressDelivery = new ListDeliveryAddress();
        this.selectMethod = new SelectMethodPayment();
        this.promoCodeList = new PromoCodeList();
        this.selectPromoCodeModel = new SelectPromoCode();
        this.promoCodeMain = new PromoCodeMainModel();
        this.orderMain.Credit = 0;
        this.orderMain.Discount = 0;
        this.addCardData = new AddCardModel();
        this.verifycard = new VerifyCard()
        this.getInitParam = new GetInitialParams();
        if (localStorage.getItem("ot") != null) {
            this.outletInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("ot")));
            let strCut = this.outletInfo.OutletInfo[0].GeoLocation.split(",");
            this.lat = parseFloat(strCut[0]);
            this.lng = parseFloat(strCut[1]);
            this.arrayLocation.push({ lat: this.lat, lng: this.lng, icon: "assets/images/pin_food.png" })
            this.orderMain.MerchantId = this.outletInfo.OutletInfo[0].MerchantId;
            this.orderMain.MerchantOutletId = this.outletInfo.OutletInfo[0].MerchantOutletId



        }
        if (localStorage.getItem("addressDelivery") != null) {
            let address = JSON.parse(localStorage.getItem("addressDelivery"))
            this.geoHome = address.GeoLocation;
            let strCut = address.GeoLocation.split(",");
            let lat = parseFloat(strCut[0]);
            let lng = parseFloat(strCut[1]);
            this.arrayLocation.push({ lat: lat, lng: lng, icon: "assets/images/pin_home.png" })
            console.log("geoHome:" + this.arrayLocation[1].icon)
            this.orderMain.DeliveryId = address.AddressId;
            this.orderMain.DeliveryTo = address.Address
        }
        if (localStorage.getItem("orderType") != null) {
            this.OrderType = localStorage.getItem("orderType");
            this.orderMain.OrderType = this.OrderType
        }
        if (localStorage.getItem("cus") != null) {
            this.customerInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("cus")))
            this.orderMain.CustomerId = this.customerInfo.CustomerInfo[0].CustomerId;
            this.creditDisplay = this.customerInfo.CustomerInfo[0].SandboxCreditBalanceDisplay;
            this.creditAmount = parseInt(this.customerInfo.CustomerInfo[0].SandboxCreditBalance) / 100;
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

        if (localStorage.getItem("datePickup") != null) {
            let date = JSON.parse(localStorage.getItem("datePickup"));
            this.fromDate = date.fromDateDisplay
            this.toDate = date.toDateDisplay
            this.orderMain.PickupDateFrom = date.fromDate;
            this.orderMain.PickupDateTo = date.toDate;
        }


    }

    ngOnInit() {
        this.loadCardYear();
        this.loadCart();
        this.VerifyOrder();
        this.inItPage()
        this.selectPromoCodeModel.PromoCodeText = "Browse rewards or use promo code"
        setTimeout(() => {
            this.initCountry()
        }, 1000)

    }

    loadCardYear() {


        let currentYear = parseInt((new Date().getFullYear()) + '');
        let data = { label: currentYear, value: currentYear };
        console.log("yesr:" + new Date().getFullYear())
        this.cardYear.push(data);
        for (let i = 1; i <= 8; i++) {
            let nextYear = currentYear + i;
            let value = currentYear + i;
            this.cardYear.push({ label: nextYear, value: value });
        }
        console.log("cardyear:" + this.cardYear[0])
    }
    inItPage() {
        $('.methods .voucher').magnificPopup({
            type: 'inline'
        });
        $('.methods .reward').magnificPopup({
            type: 'inline'
        });
        $('.methods .payment').magnificPopup({
            type: 'inline'
        });
    }
    getAllOutletV2() {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetAllOutletListV2";
        let common_data_json = JSON.stringify(common_data);
        console.log('getoutlet:' + common_data_json)
        let request_data = new GetAllOutletListV2Request();
        request_data.OrderType = this.cart.OrderType;
        if (this.cart.OrderType === ORDER_PICKUP || !this.cart.OrderType) {
            request_data.OrderFor = "";
        } else if (this.cart.OrderType === ORDER_DELIVERY) {

            request_data.OrderFor = localStorage.getItem("whenDelivery")


        }

        request_data.CustomerId = this.customerInfo.CustomerInfo[0].CustomerId + '';
        request_data.FromRow = 0;
        request_data.MCC = this.mccGobal;
        request_data.KeyWords = "";
        request_data.MerchantOutletId = this.orderMain.MerchantOutletId;
        request_data.SubCategoryId = "";
        let request_data_json = JSON.stringify(request_data);

        console.log('GetOutletV2json:' + request_data_json)
        this._pickupService.GetAllOutletListV2(common_data_json, request_data_json).then(data => {
            this.getAllOutletListV2 = data;
            console.log('alloutlet:' + JSON.stringify(data))
            this.getAllPaymentOptionsWithPromotion()
            this.orderMain.DeliveryOn = this.getAllOutletListV2.MerchantOutletListInfo[0].EstimatedDeliveryDateTimeDisplay
            this.orderMain.DeliveryOnRequest = this.getAllOutletListV2.MerchantOutletListInfo[0].EstimatedDeliveryDateTimeValue
            this.orderMain.EstimatedPickupTime = this.getAllOutletListV2.MerchantOutletListInfo[0].EstimatedPickupTime
        })

    }
    subTotalOrder() {

        let subtotal = 0;
        let total1: number = 0;
        let total2: number = 0;
        let _total: number = 0;
        for (let i = 0; i < this.orderMain.ArrayItem.length; i++) {
            subtotal = subtotal + this.orderMain.ArrayItem[i].Total;
        }
        this.orderMain.SubTotal = subtotal;
        this.orderMain.SubTotalStr = this._util.formatCurrency(this.orderMain.SubTotal, "S$")
        total1 = this.orderMain.SubTotal + this.orderMain.ServiceFeeValue + this.orderMain.Surcharge + this.orderMain.DeliveryFee + this.orderMain.RiderTip;
        total2 = parseFloat(this.orderMain.PromoCodeValue + '') + parseFloat(this.orderMain.Credit + '')
        _total = total1 - total2;
        console.log('total_2:' + _total)
        console.log("coe:" + (this.orderMain.Credit + this.orderMain.Discount))
        this.orderMain.Total = _total;
        this.orderMain.TotalDisplay = this._util.formatCurrency(this.orderMain.Total, "S$");
    }
    loadCart() {

        if (this.OrderType === ORDER_PICKUP) {
            if (localStorage.getItem("crt") != null) {//check when had cart
                this.haveCart = true;
                this.cart = JSON.parse(localStorage.getItem("crt"));


                // this.orderMain.PickupAt = this.outletInfo.OutletInfo[0].Address
                // this.orderMain.MerchantId = this.outletInfo.OutletInfo[0].MerchantId;
                if (this.cart.Cart.length > 0) {
                    this.orderMain.ArrayItem = this.cart.Cart;
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
                    //console.log('card empty')
                }

            }
            else {//init frist time
                // this.showCartEmpty = true
                // this.showCart = false
                this.haveCart = false;
                //console.log('card empty')
            }
        } else if (this.OrderType === ORDER_DELIVERY) {//cart for delivery
            if (localStorage.getItem("crtd") != null) {//check when had cart
                this.haveCart = true;
                this.cart = JSON.parse(localStorage.getItem("crtd"));
                //this.orderMain.DeliveryTo = this.currentAddress
                if (this.cart.Cart.length > 0) {
                    this.orderMain.ArrayItem = this.cart.Cart;
                    if (this.cart.OrderType === ORDER_PICKUP) {
                        // this.isPickup = true;
                        // this.isDelivery = false;
                        // console.log('ORDER: PICKUP')
                        // console.log('Cart:' + JSON.stringify(this.cart))
                    }
                    else {
                        //console.log('ORDER DELIVERY')
                        // this.isDelivery = true;
                        // this.isPickup = false;
                    }
                    this.subTotalOrder();

                    // this.setDeliveryDateAndTimes(true)
                }
                else {

                    this.haveCart = false;
                    //console.log('card empty')
                }

            }
            else {//init frist time
                this.haveCart = false;
                this.subTotalOrder()
                // this.showCart = false
                // console.log('card empty')
            }
        }
        //get option item of item
        this.upadteShowOpntionItem()



        //this.blockUI.stop();

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
            requestData.MerchantId = this.outletInfo.OutletInfo[0].MerchantId;
            requestData.MerchantOutletId = this.outletInfo.OutletInfo[0].MerchantOutletId;
            requestData.CurrencyCode = this.outletInfo.OutletInfo[0].CurrencyCode
            let totalRequest = this._gof3rModule.ParseTo12(this.orderMain.SubTotal)
            requestData.Subtotal = totalRequest;
            let requestDataJson = JSON.stringify(requestData);
            // console.log("verifyComond:"+ common_data_json)
            console.log('VerifyData:' + requestDataJson)
            this._pickupService.VerifyOrder(common_data_json, requestDataJson).then(data => {
                this.verifyOrderMain = data;
                console.log('verify:' + JSON.stringify(this.verifyOrderMain))
                this.orderMain.ServiceFee = this.verifyOrderMain.OrderFeeAndDiscountInfo.ServiceFeeDisplay
                this.orderMain.ServiceFeeValue = parseInt(this.verifyOrderMain.OrderFeeAndDiscountInfo.ServiceFee) / 100;
                this.orderMain.DiscountDisplay = this.verifyOrderMain.OrderFeeAndDiscountInfo.DiscountAmountDisplay
                this.orderMain.Discount = parseInt(this.verifyOrderMain.OrderFeeAndDiscountInfo.DiscountAmount) / 100
                this.orderMain.Surcharge = parseInt(this.verifyOrderMain.OrderFeeAndDiscountInfo.Surcharge) / 100;
                this.orderMain.SurchargeDisplay = this.verifyOrderMain.OrderFeeAndDiscountInfo.SurchargeDisplay
                this.orderMain.DeliveryFee = parseInt(this.verifyOrderMain.OrderFeeAndDiscountInfo.DeliveryFee) / 100
                this.orderMain.DeliveryFeeDisplay = this.verifyOrderMain.OrderFeeAndDiscountInfo.DeliveryFeeDisplay;
                this.orderMain.OrderingTerminalId = this.verifyOrderMain.OrderFeeAndDiscountInfo.OrderingTerminalId
                this.orderMain.DiscountProgramAmount = parseInt(this.verifyOrderMain.OrderFeeAndDiscountInfo.DiscountAmount) / 100
                this.orderMain.MerchantOutletId = this.verifyOrderMain.OrderFeeAndDiscountInfo.OrderingMerchantOutletId
                this.subTotalOrder();
                this.getAllOutletV2()
            })
        }

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
    riderTipClick(tipVlaue: number, index: number, ck: boolean) {


        console.log(ck)
        console.log(index)
        for (let i = 0; i < this.riderTip.length; i++) {
            if (i === index) {
                if (ck === true) {
                    this.riderTip[i].ck = false
                    this.orderMain.RiderTip = 0;
                }
                else {
                    this.riderTip[i].ck = true;
                    this.orderMain.RiderTip = tipVlaue;
                }

            }
            else {
                this.riderTip[i].ck = false;
                //this.orderMain.RiderTip = 0;
            }

        }
        // if (this.riderTip[index].ck === true) {
        //     console.log('check')
        //     this.riderTip[index].ck = false;


        // }
        // else {
        //     console.log('no check')
        //     this.riderTip[index].ck = true

        // }
        this.orderMain.RiderTipDisplay = this._util.formatCurrency(tipVlaue, 'S$')
        this.subTotalOrder();


    }
    uncheck(event, i: number) {

        // console.log(event.target.checked)
        this.riderTip[i].ck = !this.riderTip[i].ck


    }
    getAllPaymentOptionsWithPromotion() {
        this.allPayment = new GetAllPaymentOptionsWithPromotionModle();
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetAllPaymentOptionsWithPromotion";
        let common_data_json = JSON.stringify(common_data);

        let requestData = new GetAllPaymentOptionRequest();
        requestData.MerchantId = this.orderMain.MerchantId;
        requestData.CustomerId = this.orderMain.CustomerId + '';
        requestData.MerchantOutletId = this.orderMain.MerchantOutletId;
        console.log("paymentamount:" + this.orderMain.Total)
        requestData.PaymentAmount = this._gof3rModule.ParseTo12(this.orderMain.Total)
        console.log("paymentamount1:" + this.orderMain.Discount)
        requestData.DiscountAmount = this._gof3rModule.ParseTo12(this.orderMain.Discount)
        requestData.AwardType = "MAT_PORDER";
        let requestDataJson = JSON.stringify(requestData);
        console.log('pay:' + requestDataJson);
        this._pickupService.GetAllPaymentOptionsWithPromotion(common_data_json, requestDataJson).then(data => {
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
            this.getPromodeList()
            console.log('payment:' + JSON.stringify(this.allPayment));

            this.allPayment = data
            this.allPaymentget = true
            // this.maskingCardNumber = this.allPayment.CardListInfo[0].MaskedCardNumber;
            // this.orderMain.MaskingCardNumber = this.allPayment.CardListInfo[0].MaskedCardNumber
            // this.orderMain.CardToken = this.allPayment.CardListInfo[0].CardToken
            // this.orderMain.CardHoldName = this.allPayment.CardListInfo[0].CardHolderName
            // this.orderMain.CardTypeValue = this.allPayment.CardListInfo[0].CardTypeIdValue + " " + (this.allPayment.CardListInfo[0].MaskedCardNumber.substring(0, 4))
            console.log('payment:' + JSON.stringify(this.allPayment));
            this.blockUI.stop()

        })
    }
    placeOrder() {

        //this.listProduct()
        if (this.PO) {
            this.blockUI.start('processing ...'); // Start blocking



            //console.log('orderMain:' + JSON.stringify(this.orderMain.ArrayItem[0].OptionList[0].OptionItemList.length))
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "AddCardTransaction";
            let common_data_json = JSON.stringify(common_data);

            let data_request = new AddTransactionRequestModel();
            data_request.CurrencyCode = this.orderMain.CurrencyCode
            data_request.Amount = this._gof3rModule.ParseTo12(this.orderMain.Total)
            data_request.MaskedPan = this.orderMain.MaskingCardNumber
            data_request.InvoiceNumber = this._gof3rModule.getRandom(12);
            let date = new Date()
            data_request.TransactionDate = moment_(date).format("DD/MM/YYYY HH:mm:ss")
            let data_request_json = JSON.stringify(data_request)
            console.log('AddCardTransaction:' + data_request_json)
            if (this.PO === "PO_CARD") {
                this._pickupService.AddCardTransaction(common_data_json, data_request_json).then(data => {
                    console.log('ReaponseAddCardTransaction:' + JSON.stringify(data))
                    if (data.ResultCode === "000") {
                        localStorage.setItem('addcard', JSON.stringify(data_request))

                        this.makePayment()
                    }
                    else {

                        this.checkError(data.ResultCode, data.ResultDesc, data.ServiceName);
                    }

                })
            }
            if (this.PO === "PO_POINT" || this.PO === "PO_WALLET") {
                this.placeOrderRequest("", "", "")
            }

            //console.log(this.paresProductList())
        }

    }
    makePayment() {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "MakePayment";
        let common_data_json = JSON.stringify(common_data);

        let data_request = new MakePaymentRequestModel();
        data_request.UsedCouponVoucherList = ""
        data_request.BIN = ""
        data_request.MerchantId = this.orderMain.MerchantId
        data_request.CustomerId = this.orderMain.CustomerId + ''
        if (this.PO === "PO_CARD")
            data_request.PaymentOptions = "PO_CARD"
        data_request.PaymentAmount = this._gof3rModule.ParseTo12(parseFloat(this.orderMain.SubTotal.toFixed(2)))
        data_request.DiscountAmount = this._gof3rModule.ParseTo12(this.orderMain.Discount + this.orderMain.Credit + this.orderMain.PromoCodeValue)
        data_request.PaymentFee = this._gof3rModule.ParseTo12(this.orderMain.ServiceFeeValue + this.orderMain.Surcharge + this.orderMain.RiderTip)
        data_request.TranxCurrency = "702"//this.orderMain.CurrencyCode
        data_request.UsedPromotionCodeList = this.orderMain.PrmoCodeID
        data_request.TerminalId = this.orderMain.OrderingTerminalId
        data_request.MaskedPAN = this.orderMain.MaskingCardNumber
        data_request.PAN = this.orderMain.CardToken
        data_request.TranxAmount = this._gof3rModule.ParseTo12(parseFloat(this.orderMain.Total.toFixed(2)))
        data_request.MerchantOutletId = this.orderMain.MerchantOutletId
        data_request.App = "CUSTOMER"
        data_request.Description = "PAYMENT A MERCHANT"
        data_request.PaymentQRCode = ""
        data_request.RebateProgramId = ""
        data_request.TotalRebatePercentage = ""
        data_request.TotalRebateFixedAmount = ""
        data_request.RefNo = ""
        data_request.InvoiceNo = ""
        data_request.ApprovalCode = ""
        data_request.CardHolderName = this.orderMain.CardHoldName
        let data_request_json = JSON.stringify(data_request)
        console.log('makePayment:' + data_request_json)

        this._pickupService.MakePayment(common_data_json, data_request_json).then(data => {
            console.log('ResponseMakepayment:' + JSON.stringify(data))
            this.makePaymentMain = data;
            if (this.makePaymentMain.ResultCode === "000") {
                this.placeOrderRequest(this.makePaymentMain.TranxDetailInfo[0].RefNo, this.makePaymentMain.TranxDetailInfo[0].InvoiceNo, this.makePaymentMain.TranxDetailInfo[0].ApprovalCode)
            }
            else {
                this.checkError(data.ResultCode, data.ResultDesc, data.ServiceName);
            }
        })


    }
    placeOrderRequest(RefNo: string, InvoiceNo: string, ApprovalCode: string) {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "PlaceOrder";
        let common_data_json = JSON.stringify(common_data);

        let data_request = new PlaceOrderDeliveryModel()
        data_request.App = "CUSTOMER"
        data_request.PaperVoucherAmount = this._gof3rModule.ParseTo12(0)
        if (this.orderMain.OrderType === ORDER_DELIVERY)
            data_request.Description = "PAYMENT FOR DELIVERY ORDER"
        else
            data_request.Description = "PAYMENT FOR PICKUP ORDER"
        data_request.DeliverOn = this.orderMain.DeliveryOnRequest //this.orderMain.DeliveryOnRequest.trim()
        data_request.DeliveryOnRequest = ""
        data_request.ExpectedDeliveryTime = this.orderMain.DeliveryOnRequest
        if (this.orderMain.OrderType === ORDER_DELIVERY) {
            data_request.PickupDateTo = ""
            data_request.PickupDateFrom = ""
        }
        else {
            data_request.PickupDateFrom = this.orderMain.PickupDateFrom//"14/08/2018 10:00:00" //this.orderMain.PickupDate + " " + this.orderMain.PickupTimeFrom + " 00"
            data_request.PickupDateTo = this.orderMain.PickupDateTo //"14/08/2018 10:45 :00"//this.orderMain.PickupDate + " " + this.orderMain.PickupTimeTo + " 00"

        }

        data_request.CreditAmount = this._gof3rModule.ParseTo12(this.orderMain.Credit)
        data_request.MerchantId = this.orderMain.MerchantId
        data_request.PaymentAmount = this._gof3rModule.ParseTo12(this.orderMain.SubTotal)
        data_request.OrderType = this.orderMain.OrderType
        data_request.Surcharge = this._gof3rModule.ParseTo12(this.orderMain.Surcharge)
        data_request.UsedPromotionCodeList = ""
        data_request.DiscountProgramId = ""
        data_request.TerminalId = this.orderMain.OrderingTerminalId
        data_request.MaskedPAN = this.orderMain.MaskingCardNumber
        data_request.PaymentQRCode = ""
        data_request.PromoCodeId = this.orderMain.PrmoCodeID
        data_request.MerchantOutletId = this.orderMain.MerchantOutletId
        data_request.RiderTipAmount = this._gof3rModule.ParseTo12(this.orderMain.RiderTip)
        data_request.DiscountProgramAmount = this._gof3rModule.ParseTo12(this.orderMain.DiscountProgramAmount)
        data_request.VoucherList = ""
        data_request.UsedCouponVoucherList = ""
        data_request.BIN = ""
        data_request.RefNo = RefNo
        data_request.PaidBy = this.orderMain.CardTypeValue
        data_request.InvoiceNo = InvoiceNo
        data_request.CustomerId = this.orderMain.CustomerId + ''
        data_request.uniqueTransactionCode = InvoiceNo
        data_request.IsGroupOrder = this.orderMain.IsGroupOrder
        data_request.Note = this.orderNote;
        if (this.PO === "PO_CARD")
            data_request.PaymentOptions = "PO_CARD"
        if (this.PO === "PO_POINT")
            data_request.PaymentOptions = "PO_POINT"
        if (this.PO === "PO_WALLET")
            data_request.PaymentOptions = "PO_WALLET"
        data_request.DiscountAmount = this._gof3rModule.ParseTo12(parseFloat(this.orderMain.PromoCodeValue + '') + parseFloat(this.orderMain.Credit + '') + parseFloat(this.orderMain.DiscountProgramAmount + ''))
        data_request.ApprovalCode = ApprovalCode
        //"81,000000000050,1,^^^23,27,000000000050,1###35,000000000050,1,^^^21,21,000000000050,1===21,23,000000000050,1"
        data_request.ProductList = this.listProduct()

        data_request.ServiceFee = this._gof3rModule.ParseTo12(this.orderMain.ServiceFeeValue)
        data_request.PaymentFee = this._gof3rModule.ParseTo12(this.orderMain.ServiceFeeValue + this.orderMain.DeliveryFee + this.orderMain.RiderTip)
        data_request.TranxCurrency = "702"//this.orderMain.CurrencyCode
        if (this.orderMain.OrderType === ORDER_DELIVERY)
            data_request.DeliveryAddressId = this.orderMain.DeliveryId //this.orderMain.DeliveryId
        else
            data_request.DeliveryAddressId = ""
        data_request.PromoCodeAmount = this._gof3rModule.ParseTo12(this.orderMain.PromoCodeValue)
        data_request.DeliveryFee = this._gof3rModule.ParseTo12(this.orderMain.DeliveryFee)
        data_request.PAN = this.orderMain.CardToken
        data_request.TranxAmount = this._gof3rModule.ParseTo12(parseFloat(this.orderMain.Total.toFixed(2)))

        let data_request_json = JSON.stringify(data_request);
        console.log('placeOrderRequest:' + data_request_json)
        this._pickupService.PlaceOrder(common_data_json, data_request_json).then(data => {

            console.log("PlaceOrder:" + JSON.stringify(data))
            this.placeOrderMain = data;
            localStorage.setItem('placeOrder', JSON.stringify(this.placeOrderMain));// save order payment success
            if (data.ResultCode === "000") {
                this.customerOrderId = this.placeOrderMain.CustomerOrderId;
                if (this.PO === "PO_CARD") {
                    this.addCradModel = JSON.parse(localStorage.getItem("addcard")) as AddTransactionRequestModel
                    console.log('addCrad:' + ((this.addCradModel)))
                    let common_data = new CommonDataRequest();
                    var _location = localStorage.getItem("la");
                    common_data.Location = _location
                    common_data.ServiceName = "UpdateCardTransaction";
                    let common_data_json = JSON.stringify(common_data);

                    let data_request = new UpdateCardTransactionRequest();
                    console.log('InvoiceNumber:' + this.addCradModel.InvoiceNumber)
                    data_request.InvoiceNumber = this.addCradModel.InvoiceNumber
                    data_request.MaskedPan = this.addCradModel.MaskedPan
                    data_request.ResponseCode = "000"
                    data_request.ResponseDesc = "Approved"
                    let date = new Date()
                    data_request.TransactionDate = moment_(date).format("DD/MM/YYYY HH:mm:ss")
                    let data_request_json = JSON.stringify(data_request)
                    console.log('requestUpadte:' + data_request_json)
                    this._pickupService.UpdateCardTransaction(common_data_json, data_request_json).then(data => {
                        console.log('updateTrabsaction:' + JSON.stringify(data))
                        if (data.ResultCode === "000") {
                            this.blockUI.stop(); //end block ui
                            if (this.orderMain.OrderType === ORDER_DELIVERY) {
                                this.cart = new CartOrder()
                                localStorage.setItem('crtd', JSON.stringify(this.cart))
                            }
                            if (this.orderMain.OrderType === ORDER_PICKUP) {
                                this.cart = new CartOrder()
                                localStorage.setItem('crt', JSON.stringify(this.cart))
                            }
                            this.showPopupPaymentSuccess()
                            //this._router.navigateByUrl("/payment-success")
                        }
                        else {
                            this.checkError(data.ResultCode, data.ResultDesc, data.ServiceName);
                        }
                    })
                }
                if (this.orderMain.PaymentOptions === "PO_POINT" || this.orderMain.PaymentOptions === "PO_WALLET") {
                    if (this.orderMain.OrderType === ORDER_DELIVERY) {
                        this.cart = new CartOrder()
                        localStorage.setItem('crtd', JSON.stringify(this.cart))

                    }
                    if (this.orderMain.OrderType === ORDER_PICKUP) {
                        this.cart = new CartOrder()
                        localStorage.setItem('crt', JSON.stringify(this.cart))
                    }
                    this.blockUI.stop();
                    this.showPopupPaymentSuccess()
                    //this._router.navigateByUrl("/payment-success")
                }


            }
            else {
                this.checkError(data.ResultCode, data.ResultDesc, data.ServiceName);
            }
        })

    }
    paresProductList(): string {
        let array = new Array();
        let isNoOption: boolean = true;
        for (let i = 0; i < this.orderMain.ArrayItem.length; i++) {
            let data = ""
            let _data = ""
            let _option = ""
            if (this.orderMain.ArrayItem[i].Qty > 0) {
                if (this.orderMain.ArrayItem[i].SpecialRequest) {

                    data = data + this.orderMain.ArrayItem[i].Id + "," + (this.orderMain.ArrayItem[i].Price) + "," + this.orderMain.ArrayItem[i].Qty + "," + this.orderMain.ArrayItem[i].SpecialRequest;
                }
                else {
                    data = data + this.orderMain.ArrayItem[i].Id + "," + (this.orderMain.ArrayItem[i].Price) + "," + this.orderMain.ArrayItem[i].Qty
                }
                for (let j = 0; j < this.orderMain.ArrayItem[i].OptionList.length; j++) {
                    for (let k = 0; k < this.orderMain.ArrayItem[i].OptionList[j].OptionItemList.length; k++) {
                        if (this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].Qty > 0) {
                            _option = _option + this.orderMain.ArrayItem[i].OptionList[j].OptionId + "," + this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].OptionItemId + "," + this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].Price + "," + this.orderMain.ArrayItem[i].OptionList[j].OptionItemList[k].Qty + "==="
                        }
                    }
                    _option = _option.substring(0, _option.length - 3)
                }
            }
            if (_option) {
                array.push(data + "^^^" + _option)
                console.log('d:' + data + "^^^" + _option)
            }
            else {
                array.push(data + _option)
                console.log('d:' + data + _option)
            }


        }
        let data_request = ""
        for (let h = 0; h < array.length; h++) {
            data_request = data_request + array[h] + "###";
        }
        console.log('p:' + data_request.substring(0, data_request.length - 3))
        return data_request
    }
    listProduct(): string {
        //"81,000000000050,1,^^^23,27,000000000050,1###35,000000000050,1,^^^21,21,000000000050,1===21,23,000000000050,1"
        let dataString = "";
        let count: number = 0;
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


        console.log("list:" + dataString);
        return dataString;
    }
    checkError(errorCode: string, ErrorDesc: string, serviceName: string) {
        this.blockUI.stop()
        this.isError = true;
        this.error.ResultCode = errorCode
        this.error.ResultDesc = ErrorDesc
        this.error.ServiceName = serviceName
    }
    selectCardPayment(MaskedCardNumber: string, CardToken: string, CardHolderName: string, CardTypeIdValue: string, CardTypeIdImg: string) {
        console.log('hehe')
        this.selectMethod.Method = "CARD"
        this.selectMethod.MaskingCardNumber = MaskedCardNumber;
        this.selectMethod.CardToken = CardToken;
        this.selectMethod.CardHoldName = CardHolderName;
        this.selectMethod.CardTypeIdImg = CardTypeIdImg
        this.PO = "PO_CARD"
        this.selectMethod.CardTypeValue = CardTypeIdValue + " " + (MaskedCardNumber.substring(0, 4))
    }
    confirmSelectPayment() {
        if (this.selectMethod.Method === "CARD") {
            console.log('card')
            this.orderMain.MaskingCardNumber = this.allPayment.CardListInfo[0].MaskedCardNumber
            this.orderMain.CardToken = this.selectMethod.CardToken
            this.orderMain.CardHoldName = this.selectMethod.CardHoldName
            this.orderMain.CardTypeValue = this.selectMethod.CardTypeValue
            this.selectedCard = true;
        }
        if (this.selectMethod.Method === "PO_WALLET") {
            this.orderMain.CardToken = this.selectMethod.CardToken
            this.orderMain.PaymentOptions = "PO_WALLET"
            this.orderMain.CardTypeValue = this.selectMethod.CardTypeValue
            this.selectedCard = true;
        }
        $.magnificPopup.close()

    }
    showPopup() {
        this.selectedCard = false
        var el = $('#payment-otpion-popup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
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
    applyCredit() {
        if (this.creditAmount > 0) {
            this.orderMain.Credit = this.creditAmount;
            this.orderMain.CreditDisplay = this.creditDisplay;
            //let creditDiscount = new ListDiscountItem();

            // creditDiscount.TypeDiscount="1";
            // creditDiscount.CreditValue=this.creditDisplay
            // this.listDiscoutMain.ListDiscount.push(creditDiscount);
            // this.addCredit=false
            this.creditDisplay = "S$0.00"
            this.subTotalOrder();
        }
        //this.cart.Cart[0].OptionList[0].OptionItemList[0].isCheck
    }
    selectWallet(walletNo: string, paymentOption: string, walletName: string, MerchantIdImg: string) {

        this.selectMethod.Method = "PO_WALLET"
        this.selectMethod.CardToken = walletNo;
        this.selectMethod.CardTypeValue = walletName
        this.selectMethod.MaskingCardNumber = walletName

        this.selectMethod.CardTypeIdImg = MerchantIdImg
        // this.orderMain.CardToken = walletNo
        this.PO = paymentOption;

        // this.orderMain.PaymentOptions = "PO_WALLET"
        // this.orderMain.CardTypeValue = walletName
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
    getPromodeList() {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetPromoCodeList";
        let common_data_json = JSON.stringify(common_data);

        let data_request = { CustomerId: this.orderMain.CustomerId };
        let data_request_json = JSON.stringify(data_request);
        console.log("data_request_json:" + data_request_json)
        console.log("common_data_json:" + common_data_json)
        this._pickupService.GetPromoCodeList(common_data_json, data_request_json).then(data => {
            console.log("promocode:" + JSON.stringify(data))
            this.promoCodeList = data;
            this.loadPromoCodeComplete = true;
        })
    }
    selectPromoCode(PromoCodeId: number, PromoCodeText: string, PromoCodeValue: number) {
        this.selectPromoCodeModel.PromoCodeId = PromoCodeId;
        this.selectPromoCodeModel.PromoCodeTextRequest = PromoCodeText;
        this.selectPromoCodeModel.PromoCodeValue = PromoCodeValue;
    }
    applyPromoCode() {
        if (this.selectPromoCodeModel.PromoCodeTextRequest != '') {
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "ApplyPromoCode";
            let common_data_json = JSON.stringify(common_data);

            let requestData = new ApplyPromocodeRequest();
            requestData.CustomerId = this.customerInfo.CustomerInfo[0].CustomerId + ''
            requestData.MCC = this.mccGobal;

            requestData.Subtotal = this._gof3rModule.ParseTo12(this.orderMain.Total);
            requestData.PromoCode = this.selectPromoCodeModel.PromoCodeTextRequest;
            let requestDataJson = JSON.stringify(requestData);
            console.log("requestDataJson:" + requestDataJson)
            console.log("common_data_json:" + common_data_json)
            this._pickupService.ApplyPromoCode(common_data_json, requestDataJson).then(data => {
                console.log("applyPromocode:" + JSON.stringify(data))
                this.promoCodeMain = data;
                if (this.promoCodeMain.ResultCode === "000") {
                    this.selectPromoCodeModel.PromoCodeText = this.promoCodeMain.PromoCodeInfo[0].PromoCodeText
                    this.orderMain.PromoCodeDisPlay = this.promoCodeMain.PromoCodeInfo[0].PromoCodeValueDisplay;
                    this.orderMain.PromoCodeValue = this.promoCodeMain.PromoCodeInfo[0].PromoCodeValue
                    this.orderMain.PrmoCodeID = this.promoCodeMain.PromoCodeInfo[0].PromoCodeId
                    console.log("value:" + this.orderMain.PromoCodeValue)
                    this.orderMain.PrmoCodeID = this.promoCodeMain.PromoCodeInfo[0].PromoCodeId
                    this.subTotalOrder()
                    this.selectedPromoCode = true
                    $.magnificPopup.close()
                } else {
                    this.noData = true
                }

            })
        }
        else {// not select promocode

        }

    }
    showPopupPromoCode() {
        this.selectedPromoCode = false
        var el = $('.reward-popup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    deletePromoCode() {
        this.selectPromoCodeModel = new SelectPromoCode()
        this.selectedPromoCode = false
        this.orderMain.PromoCodeDisPlay = '';
        this.orderMain.PromoCodeValue = 0
        this.orderMain.PrmoCodeID = ''
        this.selectPromoCodeModel.PromoCodeText = "Browse rewards or use promo code"
        this.subTotalOrder()
    }
    showPopupAddCard() {
        $.magnificPopup.close()
        setTimeout(() => {
            $.magnificPopup.open({
                items: {
                    src: '#payment-popup'
                },
                type: 'inline'
            });
        }, 50)


    }
    selectMonth(month: string) {
        this.addCardData.CardMonth = month;
        console.log('month:' + this.addCardData.CardMonth)
    }
    selectYear(year: string) {
        this.addCardData.CardYear = year

    }

    addCard() {
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

            console.log("verify:" + (data_request_json))
            this._pickupService.VerifyCard(common_data_json, data_request_json).then(data => {
                this.verifycard = data;
                console.log('verifyCard:' + JSON.stringify(data))
                if (this.verifycard.ResultCode === "000") {
                    common_data.ServiceName = "AddNewCardWeb"
                    let common_data_json = JSON.stringify(common_data);
                    console.log('comon:' + common_data_json)
                    let data_request = new AddNewCardModel();
                    data_request.ApprovalCode = ""
                    data_request.Bin = this.verifycard.Bin
                    data_request.CardAlias = this.addCardData.NameCard
                    data_request.CardHolderName = this.addCardData.NameCard
                    data_request.CardProductId = this.verifycard.CardProductId
                    data_request.CustomerId = this.customerInfo.CustomerInfo[0].CustomerId + ''
                    data_request.Cvv2 = this.addCardData.CardCVV
                    data_request.InvoiceNo = ""
                    data_request.IssuingCountryCode = this.addCardData.CardCountry
                    data_request.PaymentGatewayToken = "09071513062949492475"
                    data_request.CardTypeId = this.verifycard.CardTypeId
                    data_request.RefNo = ""
                    data_request.ExpiryDate = this.addCardData.CardMonth + "/" + this.addCardData.CardYear
                    data_request.MaskedCardNumber = this.masKingNumberCard(this.addCardData.CardNumber.replace(/\s/g, ''));
                    let data_request_json = JSON.stringify(data_request)
                    this._pickupService.AddNewCard(common_data_json, data_request_json).then(data => {
                        console.log(JSON.stringify(data))
                        if (data.ResultCode === "000") {
                            this.allPayment.CardListInfo = []
                            this.allPayment.CardListInfo = data.CardListInfo;
                            $.magnificPopup.close()
                        }
                        else {
                            this.errorAddCard = true;
                            this.errorAddCardDisplay = data.ResultDesc
                        }

                        this.blockUI.stop()
                    })
                    console.log('request:' + data_request_json)

                }

            })
        }

        //let data_request = {IIN:}
    }

    confirmCard() {
        this.addCard()
    }
    masKingNumberCard(cardNumber: string): string {
        cardNumber = cardNumber.substring(0, 6) + cardNumber.substring(0, 6).replace(/\d/g, '*')
            + cardNumber.substring(12);
        return cardNumber;
    }
    trackerOrder() {
        $.magnificPopup.close()

        this.route.navigateByUrl("/tracker-order/"+this.OrderType.toLowerCase()+"/" + this.customerOrderId)


    }
    makeIconURL() {
        return "assets/images/pin_food.png"
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
    }
    initCountry() {
        if (localStorage.getItem('IN') != null) {
            this.getInitParam = JSON.parse(this._util.decryptByDESParams(localStorage.getItem("IN")));
            for (let i = 0; i <= this.getInitParam.CountryInfo.length; i++) {
                let countryItem = { label: this.getInitParam.CountryInfo[i].CountryName, value: this.getInitParam.CountryInfo[i].CountryCode }
                this.countrys.push(countryItem);
            }
        }
    }
    selectContry(country: string) {
        if (country !== "0") {
            this.addCardData.CardCountry = country;
        }
    }


}