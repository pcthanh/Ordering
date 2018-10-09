import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { CommonDataRequest } from "../models-request/request-comon-data";
import { GetProductListRequest } from "../models-request/get-request-product-list";
import { PickupService } from "../services/pickup.service";
import { EventSubscribeService } from "../services/instance.service";
import { ActivatedRoute, Params,Router } from "@angular/router";
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
    outletInfo:OutletInfoModel;
    productList: ProductListModel;
    productDetail: ProductDetailMainModel;
    productDetailParse: ProductDetailParseModel;
    isCheck = true;
    total: number = 220;
    str: string;
    cart: CartOrder;
    specialRequest: string = "";
    haveData: boolean;
    haveDataOutlet: boolean;
    addClass: number;
    haveDepartment: string = ""
    cartOrderMain: CartOrder;
    customerInfo: CustomerInfoMainModel = new CustomerInfoMainModel();
    haveCart:boolean=true;
    orderMain: OrderModel;
    showCartEmpty:boolean=false;
    IndexItemCartUpdate:number;
    showUpdateProduct:boolean=false;
    errorCart:string=""
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('closeModal') closePopup:ElementRef;
    listDeliveryAddress: ListDeliveryAddress;
    verifyOrderMain: VerifyOrderMainModel;
    constructor(private _router:Router,private _gof3rUtil: Gof3rUtil, private _gof3rModule: Gof3rModule, private _util: Gof3rUtil, private _pickupService: PickupService, private _instanceService: EventSubscribeService, private active_router: ActivatedRoute) {
        this.blockUI.start('loading ...'); // Start blocking
        this.productDetail = new ProductDetailMainModel();
        this.productDetailParse = new ProductDetailParseModel();
        this.cartOrderMain = new CartOrder();
        this.cart = new CartOrder();
        this.customerInfo= new CustomerInfoMainModel();
        this.orderMain= new OrderModel();
        this.outletInfo= new OutletInfoModel();
        this.listDeliveryAddress = new ListDeliveryAddress();
        this.verifyOrderMain= new VerifyOrderMainModel();
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
        
        if(localStorage.getItem("crt")!=null || localStorage.getItem("crtd")!=null){
            this.haveCart=true;
        }
        else{
            this.haveCart=false;
        }
        this._instanceService.$getEventSubject.subscribe(data=>{
            if(data.function==="updateTimePickup"){
                this.orderMain.PickupDateFrom=data.fromDate;
                this.orderMain.PickupDateTo= data.toDate;
                let datePikcup={fromDate:this.orderMain.PickupDateFrom,toDate:this.orderMain.PickupDateTo,fromDateDisplay:data.fromDateDisplay,toDateDisplay:data.toDateDisplay}
                localStorage.setItem("datePickup",JSON.stringify(datePikcup))
                console.log('afterupdatetime:'+JSON.stringify(this.orderMain));
            }
        })
        
    }
    ngOnInit() {
        //this.initJquery()
        //this.loadCart()
        //this._instanceService.sendCustomEvent("notCheckOut")
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
            alert('thanh')
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
         var header = document.getElementById("myHeader");
         var promo=document.getElementById("promo-mess")
var order_catalog =document.getElementById("order-catalog");
var sticky = header.offsetTop;
var promo_sticky = promo.offsetTop;
var order_sticky = sticky+ 300;
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
     promo.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
    promo.classList.remove("sticky");
    
  }
  
  if (window.pageYOffset+100 > promo_sticky) {
    
     promo.classList.add("promo-mess-sticky");
  } else {
    
    promo.classList.remove("promo-mess-sticky");
    
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
        console.log('requestInfor:' + requestJson)
        this._pickupService.GetOutletInfo(commonDataJson, requestJson).then(data => {
            console.log('info:' + JSON.stringify(data));
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode);
            localStorage.setItem('ot', this._util.encryptParams(JSON.stringify(data)));//set outlet info
            this.outletInfo = data;
            this.outletInfo.OutletInfo[0].Rating=this.getStars((parseInt(this.outletInfo.OutletInfo[0].MerchantOutletRating)/100));
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

        console.log(commonDataJson);
        console.log(requestJson)
        this._pickupService.GetProductList(commonDataJson, requestJson).then(data => {
            console.log( "xxx:"+JSON.stringify(data));
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
            this.productList = data;
            console.log('have:' + this.productList.IsHavingDepartment)
            console.log('t:' + JSON.stringify(data))
            this.haveData = true
            this.haveDepartment = this.productList.IsHavingDepartment
            console.log('p:' + JSON.stringify(this.productList))
            for(let i = 0; i<this.productList.ProductList.length; i++){
                for(let j = 0; j< this.productList.ProductList[i].Produtcs.length; j++){
                    if(this.productList.ProductList[i].Produtcs[j].Image.indexOf("no_image")>-1 ||this.productList.ProductList[i].Produtcs[j].Image==""){
                        console.log("xxthanh:"+ this.productList.ProductList[i].Produtcs[j].Name)
                    this.productList.ProductList[i].Produtcs[j].HaveImage = false;
                }
                else{
                    this.productList.ProductList[i].Produtcs[j].HaveImage = true;
                }
                }
            }
            if (data.ResultCode === "000") {

                this.blockUI.stop()
            }
        })
    }
    loadItemOfCategory(id, haveDepartment, index: number) {
        this.blockUI.start('processing ...'); // Start blocking
        this.addClass = index;
        console.log('inde:' + this.addClass)
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


        console.log('loadItemOfCategory:' + id + " " + haveDepartment)
    }
    subTotalItem(isQtyItem: boolean, productMain: ProductDetailParseModel) {
        let totalOfOptionItem = 0;
        for (let i = 0; i < productMain.OptionList.length; i++) {
            for (let j = 0; j < productMain.OptionList[i].OptionItemList.length; j++) {
                totalOfOptionItem = totalOfOptionItem + productMain.OptionList[i].OptionItemList[j].Total
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
    showProductDetail(productId: number) {
        this.blockUI.start("loading...")
        console.log(productId)
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
        console.log('ProductDetail:' + requestDataJson)
        this._pickupService.GetProductDetail(commonDataJson, requestDataJson).then(data => {
            console.log(data)
            this.productDetail = data
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
            if (data.ProductDetailInfo.length > 0) {
                console.log('gvhgvh')
                console.log('hjgj:' + this.productDetail.ProductDetailInfo[0].Id)
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
                console.log('XX:' + JSON.stringify(this.productDetailParse));

            }

        })
    }
    openPopup() {
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
    upadteProduct(indexUpdate:number){
        console.log('vjvj')
        this.showUpdateProduct=true;
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
         
        
        
    }
    checkOptionItem(optionItemId: string, optionId: number, index: number) {
        console.log('idItem:' + optionItemId)
        console.log('idOption:' + optionId)
        let countItemChecked = 0;
        let maxselectItem = this.getMaxSelectItem(optionId);
        let minselectItem = this.getMinSelectItem(optionId);
        console.log('index:' + index)
        console.log('Max:' + maxselectItem);
        countItemChecked = this.checkBox(optionItemId, optionId);

        if (countItemChecked > maxselectItem && maxselectItem != 0) {
            for (let i = 0; i < this.productDetailParse.OptionList.length; i++) {
                for (let j = 0; j < this.productDetailParse.OptionList[i].OptionItemList.length; j++) {
                    if (this.productDetailParse.OptionList[i].OptionItemList[j].isCheck == true && this.productDetailParse.OptionList[i].OptionId == optionId && j != index) {
                        this.productDetailParse.OptionList[i].OptionItemList[j].isCheck = false;
                        this.productDetailParse.OptionList[i].OptionItemList[j].isLock = false;
                        this.productDetailParse.OptionList[i].OptionItemList[j].Qty = 0;
                        console.log('geg:' + this.productDetailParse.OptionList[i].OptionItemList[j].isCheck);
                        break;
                    }
                }
            }
        }
        let countAfter = this.countCheckBox(optionItemId, optionId);
        console.log('after: ' + countAfter)
        if (countAfter == minselectItem) {
            console.log('con 1')
            this.lockCheckBox(optionItemId, optionId);
        }
        this.subTotalOfOptionItem(optionItemId, optionId, this.productDetailParse)
        this.subTotalItem(false, this.productDetailParse);
        console.log('count:' + countItemChecked)

        console.log('X2:' + JSON.stringify(this.productDetailParse));
    }

    checkOptionItemUpdate(optionItemId: string, optionId: number, index: number) {
        console.log('idItem:' + optionItemId)
        console.log('idOption:' + optionId)
        let countItemChecked = 0;
        let maxselectItem = this.getMaxSelectItemUdate(optionId,index);
        let minselectItem = this.getMinSelectItemUPdate(optionId,index);
        console.log('index:' + index)
        console.log('Max:' + maxselectItem);
        countItemChecked = this.checkBoxUpdate(optionItemId, optionId);

        if (countItemChecked > maxselectItem && maxselectItem != 0) {
            for (let i = 0; i < this.cart.Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
                for (let j = 0; j < this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                    if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true && this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId && j != index) {
                        this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck = false;
                        this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isLock = false;
                        this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].Qty = 0;
                        console.log('geg:' + this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck);
                        break;
                    }
                }
            }
        }
        let countAfter = this.countCheckBoxUpdate(optionItemId, optionId);
        console.log('after: ' + countAfter)
        if (countAfter == minselectItem) {
            console.log('con 1')
            this.lockCheckBoxUpdate(optionItemId, optionId);
        }
        this.subTotalOfOptionItemUpdate(optionItemId, optionId, this.cart.Cart[this.IndexItemCartUpdate],index)
        this.subTotalItem(false, this.cart.Cart[this.IndexItemCartUpdate]);
        console.log('count:' + this.cart.Cart[this.IndexItemCartUpdate].TotalStr)

        console.log('X2:' + JSON.stringify(this.cart.Cart[this.IndexItemCartUpdate]));
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
        console.log('indexcart:' + index);
        console.log('hhh:'+ JSON.stringify(this.cart.Cart))
        for (let i = 0; i < this.cart.Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
                return this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].MaxOptionItemSelectionRequired;
            }
        }
    }
    getMinSelectItemUPdate(optionId: number, index) {
        for (let i = 0; i < this.cart.Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
                return this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].MinOptionItemSelectionRequired;
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
        for (let i = 0; i < this.cart.Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            for (let j = 0; j < this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {

                if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].OptionItemId === optionItemId) {

                    this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck = !this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck

                    if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true) {
                        this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].Qty++;
                    }
                    else {
                        this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].Qty = 0;
                    }

                }
                if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true && this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
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
        for (let i = 0; i < this.cart.Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            for (let j = 0; j < this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true && this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
                    this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isLock = true;
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
        for (let i = 0; i < this.cart.Cart[this.IndexItemCartUpdate].OptionList.length; i++) {
            for (let j = 0; j < this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
                if (this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList[j].isCheck == true && this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionId == optionId) {
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
            for (let j = 0; j < this.cart.Cart[this.IndexItemCartUpdate].OptionList[i].OptionItemList.length; j++) {
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
        console.log(JSON.stringify(this.productDetailParse))
    }
    AdditionQtyItemUpdate() {
        this.cart.Cart[this.IndexItemCartUpdate].Qty++;
        let isQtyItem = true;
        this.subTotalItem(isQtyItem, this.cart.Cart[this.IndexItemCartUpdate]);
        this.orderMain.ArrayItem=this.cart.Cart;
        this.subTotalOrder()
        if(this.OrderType===ORDER_DELIVERY){
            localStorage.setItem("crtd",JSON.stringify(this.cart))
        }
        else{
            localStorage.setItem("crt",JSON.stringify(this.cart))
        }
        console.log(JSON.stringify(this.productDetailParse))
    }
    SubtractionItem() {
        if (this.productDetailParse.Qty > 1) {
            let isQtyItem = true;
            this.productDetailParse.Qty--;
            console.log(JSON.stringify(this.productDetailParse))
            this.subTotalItem(isQtyItem, this.productDetailParse)
        }
    }
    SubtractionItemUpdate() {
        if (this.cart.Cart[this.IndexItemCartUpdate].Qty > 1) {
            let isQtyItem = true;
            this.cart.Cart[this.IndexItemCartUpdate].Qty--;
            this.subTotalItem(isQtyItem, this.cart.Cart[this.IndexItemCartUpdate])
            this.orderMain.ArrayItem=this.cart.Cart;
        this.subTotalOrder()
        if(this.OrderType===ORDER_DELIVERY){
            localStorage.setItem("crtd",JSON.stringify(this.cart))
        }
        else{
            localStorage.setItem("crt",JSON.stringify(this.cart))
        }
        }
    }
    addQuatyOptionItem(optionItem: string, optionId: number, index) {
        for (let i = 0; i < this.cart.Cart[index].OptionList.length; i++) {
            for (let j = 0; j < this.cart.Cart[index].OptionList[i].OptionItemList.length; j++) {
                if (this.cart.Cart[index].OptionList[i].OptionId == optionId && this.cart.Cart[index].OptionList[i].OptionItemList[j].OptionItemId == optionItem) {
                    this.cart.Cart[index].OptionList[i].OptionItemList[j].Qty++;
                }
            }
        }
    }
   
    addToCart() {
        console.log('arry:' + JSON.stringify(this.checkGroupOptionOfItem(this.productDetailParse)));
        this.haveCart=true;
        this.productDetailParse.SpecialRequest = this.specialRequest;
        if (this.OrderType == ORDER_PICKUP) {//cart for pickup
            if (localStorage.getItem("crt") != null) {//check cart exits
                this.cart = (JSON.parse(localStorage.getItem("crt")));
            }
            console.log('Stsrt Cart:' + JSON.stringify(this.cart));
            if (this.cart.Cart.length > 0) {//check cart not yet item
               if(this.outletInfo.OutletInfo[0].MerchantOutletId===this.cart.OuteletID){
                    let isExits: boolean;
                let isCompare: boolean;
                let countCompare: number = 0;
                let arrayOptionInCart: any;
                let arrayOptionItem = this.checkGroupOptionOfItem(this.productDetailParse);
                for (let i = 0; i < this.cart.Cart.length; i++) {
                    if (this.cart.Cart[i].Id == this.productDetailParse.Id) {
                        isExits = true;
                        console.log('isexits:' + this.isCheck)
                        if (isExits) {
                            arrayOptionInCart = this.checkGroupOptionOfItem(this.cart.Cart[i]);
                            console.log('arrayFirst:' + JSON.stringify(arrayOptionItem));
                            console.log('second:' + JSON.stringify(arrayOptionInCart));
                            isCompare = this.checkArrays(JSON.stringify(arrayOptionItem), JSON.stringify(arrayOptionInCart));
                            console.log('isCompare:' + isCompare)
                            if (isCompare) {
                                this.cart.Cart[i].Qty = this.cart.Cart[i].Qty + this.productDetailParse.Qty;
                                for (let j = 0; j < this.productDetailParse.OptionList.length; j++) {
                                    for (let h = 0; h < this.productDetailParse.OptionList[i].OptionItemList.length; h++) {
                                        this.cart.Cart[i].OptionList[j].OptionItemList[h].Qty = this.cart.Cart[i].OptionList[j].OptionItemList[h].Qty + this.productDetailParse.OptionList[j].OptionItemList[h].Qty
                                        this.subTotalOfOptionItem(this.cart.Cart[i].OptionList[j].OptionItemList[h].OptionItemId, this.cart.Cart[i].OptionList[j].OptionId, this.cart.Cart[i]);
                                        this.subTotalItem(true, this.cart.Cart[i])
                                    }
                                }
                            }
                        }

                    }
                }

                if (!isCompare) {
                    this.cart.Cart.push(this.productDetailParse);

                }
                localStorage.setItem('crt', JSON.stringify(this.cart));
               }
               else{//
                   console.log("delete cart")
                    setTimeout(()=>{
                        $.magnificPopup.open({
                        items: {
                            src: '#cart-popup'
                        },
                        type: 'inline'
                        }); 
                    },50)
                    
                    this.errorCart="please delete old your cart";
               }

            }
            else {
                this.cart.OrderType = this.OrderType
                this.cart.OuteletID=this.outletInfo.OutletInfo[0].MerchantOutletId
                this.cart.Cart.push(this.productDetailParse);
                localStorage.setItem('crt', JSON.stringify(this.cart));
            }
            this._instanceService.sendCustomEvent("UpdateCart")
            console.log('End Cart:' + JSON.stringify(this.cart));
        } else if (this.OrderType === ORDER_DELIVERY) {//cart for delivery
            if (localStorage.getItem("crtd") != null) {//check cart exits
                this.cart = (JSON.parse(localStorage.getItem("crtd")));
            }
            console.log('Stsrt Cart:' + JSON.stringify(this.cart));
            if (this.cart.Cart.length > 0) {//check cart not yet item
                let isExits: boolean;
                let isCompare: boolean;
                let countCompare: number = 0;
                let arrayOptionInCart: any;
                let arrayOptionItem = this.checkGroupOptionOfItem(this.productDetailParse);
                for (let i = 0; i < this.cart.Cart.length; i++) {
                    if (this.cart.Cart[i].Id == this.productDetailParse.Id) {
                        isExits = true;
                        console.log('isexits:' + this.isCheck)
                        if (isExits) {
                            arrayOptionInCart = this.checkGroupOptionOfItem(this.cart.Cart[i]);
                            console.log('arrayFirst:' + JSON.stringify(arrayOptionItem));
                            console.log('second:' + JSON.stringify(arrayOptionInCart));
                            isCompare = this.checkArrays(JSON.stringify(arrayOptionItem), JSON.stringify(arrayOptionInCart));
                            console.log('isCompare:' + isCompare)
                            if (isCompare) {
                                this.cart.Cart[i].Qty = this.cart.Cart[i].Qty + this.productDetailParse.Qty;
                                for (let j = 0; j < this.productDetailParse.OptionList.length; j++) {
                                    for (let h = 0; h < this.productDetailParse.OptionList[i].OptionItemList.length; h++) {
                                        this.cart.Cart[i].OptionList[j].OptionItemList[h].Qty = this.cart.Cart[i].OptionList[j].OptionItemList[h].Qty + this.productDetailParse.OptionList[j].OptionItemList[h].Qty
                                        this.subTotalOfOptionItem(this.cart.Cart[i].OptionList[j].OptionItemList[h].OptionItemId, this.cart.Cart[i].OptionList[j].OptionId, this.cart.Cart[i]);
                                        this.subTotalItem(true, this.cart.Cart[i])
                                    }
                                }
                            }
                        }

                    }
                }

                if (!isCompare) {
                    this.cart.Cart.push(this.productDetailParse);

                }
                localStorage.setItem('crtd', JSON.stringify(this.cart));

            }
            else {
                this.cart.OrderType = this.OrderType
                this.cart.OuteletID=this.outletInfo.OutletInfo[0].MerchantOutletId
                this.cart.Cart.push(this.productDetailParse);
                localStorage.setItem('crtd', JSON.stringify(this.cart));
            }
            this._instanceService.sendCustomEvent("UpdateCart")
            console.log('End Cart:' + JSON.stringify(this.cart));
        }
        this.orderMain.ArrayItem=this.cart.Cart;
        this.VerifyOrder();
        this.subTotalOrder()
        $.magnificPopup.close()

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
        for (let i = 0; i < item.OptionList.length; i++) {
            for (let j = 0; j < item.OptionList[i].OptionItemList.length; j++) {
                if (item.OptionList[i].OptionItemList[j].Qty > 0 && item.OptionList[i].OptionItemList[j].isCheck == true) {
                    arryOptionItemId.push({ 'idOptionItem': item.OptionList[i].OptionItemList[j].OptionItemId, 'Qty': item.OptionList[i].OptionItemList[j].Qty })
                }
            }
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
                this.haveCart=true;
                this.cart = JSON.parse(localStorage.getItem("crt"));

                console.log(JSON.stringify(this.outletInfo))
                // this.orderMain.PickupAt = this.outletInfo.OutletInfo[0].Address
                // this.orderMain.MerchantId = this.outletInfo.OutletInfo[0].MerchantId;
                if (this.cart.Cart.length > 0) {
                    this.orderMain.ArrayItem = this.cart.Cart;
                    if (this.cart.OrderType === ORDER_PICKUP) {
                        // this.isPickup = true;
                        // this.isDelivery = false;
                        console.log('ORDER: PICKUP')
                        console.log('Cart:' + JSON.stringify(this.cart))
                    }
                    else {
                        console.log('ORDER DELIVERY')
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
                    this.haveCart=false;
                    console.log('card empty')
                }

            }
            else {//init frist time
                // this.showCartEmpty = true
                // this.showCart = false
                this.haveCart=false;
                console.log('card empty')
            }
        } else if (this.OrderType === ORDER_DELIVERY) {//cart for delivery
            if (localStorage.getItem("crtd") != null) {//check when had cart
                this.haveCart=true;
                this.cart = JSON.parse(localStorage.getItem("crtd"));
                //this.orderMain.DeliveryTo = this.currentAddress
                if (this.cart.Cart.length > 0) {
                    this.orderMain.ArrayItem = this.cart.Cart;
                    if (this.cart.OrderType === ORDER_PICKUP) {
                        // this.isPickup = true;
                        // this.isDelivery = false;
                        console.log('ORDER: PICKUP')
                        console.log('Cart:' + JSON.stringify(this.cart))
                    }
                    else {
                        console.log('ORDER DELIVERY')
                        // this.isDelivery = true;
                        // this.isPickup = false;
                    }
                     this.subTotalOrder();
                   
                    // this.setDeliveryDateAndTimes(true)
                }
                else {
                    
                   this.haveCart=false;
                    console.log('card empty')
                }

            }
            else {//init frist time
                  this.haveCart=false;
                // this.showCart = false
                console.log('card empty')
            }
        }
        //get option item of item
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
        console.log('subtotakUpdate')
        let subtotal = 0;
        for (let i = 0; i < this.orderMain.ArrayItem.length; i++) {
            subtotal = subtotal + this.orderMain.ArrayItem[i].Total;
        }
        this.orderMain.SubTotal = subtotal;
        this.orderMain.SubTotalStr = this._util.formatCurrency(this.orderMain.SubTotal, "S$")

        let _total = (this.orderMain.SubTotal + this.orderMain.ServiceFeeValue + this.orderMain.Surcharge + this.orderMain.DeliveryFee + this.orderMain.RiderTip) - (this.orderMain.PromoCodeValue + this.orderMain.Credit + this.orderMain.Discount);
        console.log('totalne:' + this.orderMain.SubTotalStr)
        this.orderMain.Total = _total;
        this.orderMain.TotalDisplay = this._util.formatCurrency(this.orderMain.Total, "S$");
    }
    removeQty(i) {
        console.log('RemoveQty:' + i);
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
    removeCart(index: number) {
        console.log('remove:' + index)
        this.cart.Cart.splice(index, 1);
        if (this.OrderType === ORDER_PICKUP) {
            localStorage.setItem("crt", JSON.stringify(this.cart))
        }
        else if (this.OrderType === ORDER_DELIVERY) {
            localStorage.setItem("crtd", JSON.stringify(this.cart))
        }

        this.orderMain.ArrayItem = this.cart.Cart;
        //this.VerifyOrder();
        if (this.cart.Cart.length <= 0) {
            this.haveCart = false
            //this.showCart = false
        }
        console.log('end:' + JSON.stringify(this.cart))
    }
    showAddSpecial(){
        $('.text-special').slideDown();
    }
     UpadteCartAndClose() {
         this.orderMain.ArrayItem=this.cart.Cart;
        this.subTotalOrder()
        if(this.OrderType===ORDER_DELIVERY){
            localStorage.setItem("crtd",JSON.stringify(this.cart));
        }else{
            localStorage.setItem("crt",JSON.stringify(this.cart));
        }
       
        $.magnificPopup.close()
    }
    checkOut(){
        if(localStorage.getItem("cus")!=null){
            if(this.OrderType===ORDER_PICKUP){
                if(!this.orderMain.PickupDateFrom||!this.orderMain.PickupDateTo){
                this.errorCart="please select time to pickup"
                 $.magnificPopup.open({
                        items: {
                            src: '#pickup-date'
                        },
                        type: 'inline'
                    });
                }
                else{
                    this._router.navigateByUrl('/check-out')
                }
            }
            else{
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
            
        }else{
            $('.showloginform').slideDown();
            $('.login-overlay').addClass('show');
                $(this).addClass('hide-form');
                $('body').css({
                    overflow: 'hidden',
                    height: '100%'
                });;
        }
        
    }
    deleteCartOld(){
        if(this.OrderType===ORDER_PICKUP){
            localStorage.removeItem("crt");
            this.loadCart()
            $.magnificPopup.close()
        }
        else{
            localStorage.removeItem("crtd");
            this.loadCart()
            $.magnificPopup.close()
        }
    }
    closePopupSelectTimes(){
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
        console.log('Thanh' + common_data_json)
        let data_request = { CustomerId: this.customerInfo.CustomerInfo[0].CustomerId };
        let data_request_json = JSON.stringify(data_request);
        console.log('Thanh1' + data_request_json)
        this._pickupService.GetDeliveryAddresses(common_data_json, data_request_json).then(data => {
            this.listDeliveryAddress = data;
            this._gof3rModule.checkInvalidSessionUser(this.listDeliveryAddress.ResultCode);
            if(this.listDeliveryAddress.DeliveryAddressList.length>0){
                // if(this.orderMain.DeliveryId===""){
                //      this.errorCart="please select address delivery"
                //      $.magnificPopup.open({
                //         items: {
                //             src: '#pickup-date'
                //         },
                //         type: 'inline'
                //     });
                // }
                // else{
                    this._router.navigateByUrl('/check-out')
                // }
                
            }
            else{
                this.errorCart="please add address delivery"
                     $.magnificPopup.open({
                        items: {
                            src: '#pickup-date'
                        },
                        type: 'inline'
                    });
            }
            console.log("list:" + JSON.stringify(this.listDeliveryAddress))
        })
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
            })
         }
     }

}