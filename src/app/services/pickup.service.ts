import { Injectable, Inject, Injector } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map'
import { Gof3rUtil } from "../util/gof3r-util";
import { OfferLists } from "../models/OfferLists";
import { GetAllOutletListV2Model } from "../models/GetAllOutletListV2";
import { ProductListModel } from "../models/ProductList";
import { MerchantOutletListInfoModel } from "../models/MerchantOutletListInfo";
import { ProductDetailInfoModel } from "../models/ProductDetailInfo";
import { ProductDetailMainModel } from "../models/ProductDetailMain";
import { VerifyOrderMainModel } from "../models/VerifyOrderMain";
import { SearchUserByEmailOrPhone } from "../models/SearchUserByEmailOrPhone";
import { GetCurrentSystemTimeModel } from "../models/GetCurrentSystemTime";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { PromoCodeMainModel } from "../models/PromoCodeMain";
import { ResponseModel } from "../models/Response";
import { CustomerInfoModel } from "../models/CustomerInfo";
import { GetAllPaymentOptionsWithPromotionModle } from "../models/GetAllPaymentOptionsWithPromotion";
import { ListDeliveryAddress } from "../models/ListDeliveryAddress";
import { VerifyCard } from "../models/VerifyCard";
import { AddNewCardModel } from "../models/AddNewCard";
import { MakePaymentModel } from "../models/MakePayment";
import { PlaceOrder } from "../models/PlaceOrder";
import { CustomerOrderList } from "../models/CustomerOrderList";
import { CustomerOrderListMain } from "../models/CustomerOrderListMain";
import { PickupOrderDetail } from "../models/PickupOrderDetail";
import { DeliveryCustomerOrderListMain } from "../models/DeliveryCustomerOrderListMain";
import { TransferOrderListMain } from "../models/TransferOrderListMain";
import { CustomerSearchByPhoneTransfer } from "../models/CustomerSearchByPhoneTransfer";
import { CombineOrderListMain } from "../models/CombineOrderListMain";
import { CombineOrderList } from "../models/CombineOrderList";
import { CombineOrderListGetByOutlet } from "../models/CombineOrderListGetByOutlet";
import { DelivertOrderDetail } from "../models/DeliveryOrderDetail";
import { PointWalletInfo } from "../models/PointWalletPoint";
import { AllOffers } from "../models/AllOffers";
import { SubCategoryListOutlet } from "../models/SubCategoryListOutlet";


@Injectable()
export class PickupService {
      constructor(public util: Gof3rUtil, private http: Http) { }
      GetTopOffers(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      getAddresFromPostalCode(postal_code: string) {
            let urlGoogleAPI = "https://maps.googleapis.com/maps/api/geocode/json?address=" + postal_code + "&key=AIzaSyAcuXzA_6raMbgdAqRtq_4a0maw6EionEE"
            return this.http.get(urlGoogleAPI).toPromise().then(data => {
                  
                  return Promise.resolve(JSON.parse(data.text()));
            });
      }
      getAddresFromLng(lat: string, long: string) {
            let urlGoogleAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyAcuXzA_6raMbgdAqRtq_4a0maw6EionEE";
            return this.http.get(urlGoogleAPI).toPromise().then(data => {
                  
                  return Promise.resolve(JSON.parse(data.text()));
            });
      }
      GetAllOutletListV2(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as GetAllOutletListV2Model);
            })
      }
      GetProductList(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as ProductListModel);
            })
      }
      GetOutletInfo(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      GetProductDetail(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as ProductDetailMainModel);
            })
      }
      VerifyOrder(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as VerifyOrderMainModel);
            })
      }
      SearchUserByEmailOrPhone(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as SearchUserByEmailOrPhone);
            })
      }
      CheckLogon(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as CustomerInfoMainModel);
            })
      }
      GetCurrentSystemTime(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as GetCurrentSystemTimeModel);
            })
      }
      ApplyPromoCode(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as PromoCodeMainModel);
            })
      }

      GetAllPaymentOptionsWithPromotion(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as GetAllPaymentOptionsWithPromotionModle);
            })
      }
      RequestRegistrationOTP(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as ResponseModel);
            })
      }

      RegisterCustomer(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as CustomerInfoMainModel);
            })
      }
      LogOutCustomer(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      AddDeliveryAddress(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      GetDeliveryAddresses(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as ListDeliveryAddress);
            })
      }

      VerifyCard(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as VerifyCard);
            })
      }
      AddNewCard(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            console.log("api:"+ urlAPI)
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as AddNewCardModel);
            })
      }
      AddCardTransaction(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      MakePayment(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as MakePaymentModel);
            })
      }

      PlaceOrder(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as PlaceOrder);
            })
      }
      LogOut(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      UpdateCardTransaction(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      GetPickupOrderDetail(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as PickupOrderDetail);
            })
      }
      GetPickupOrderList(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as CustomerOrderListMain);
            })
      }
      GetDeliveryOrderList(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as DeliveryCustomerOrderListMain);
            })
      }
      GetTransferOrderList(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as TransferOrderListMain);
            })
      }
      SearchUserByPhone(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as CustomerSearchByPhoneTransfer);
            })
      }

      DoTransferOrder(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      GetCombineOrderList(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text()))as CombineOrderListMain);
            })
      }

 GetCombineOrdersByOutlet(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text()))as CombineOrderList);
            })
      }
      DoCombineOrder(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text()))as CombineOrderList);
            })
      }
      GetDeliveryOrderDetail(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      GetAllPaymentOptions(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
       GetPrepaidWalletDetail(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
       DoPrepaidWalletTopup(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }

GetPointWalletDetail(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text()))as PointWalletInfo);
            })
      }
      DoPointWalletTopup(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      UpdateDeliveryAddress(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
       DeleteDeliveryAddress(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      GetAllOffers(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text()))as AllOffers);
            })
      }
       GetAllOutletBySubCategory(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text()))as SubCategoryListOutlet);
            })
      }

      DeleteCard(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      GetResetUserPasswordCode(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      ResetUserPassword(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
       GetPromoCodeList(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
       UpdateCustomer(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      SearchSingaporeAddress(commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
      GetOutletListByLocation (commonData: string, requestData: string) {
            let urlAPI = this.util.urlAPI() + this.util.encryptKEK(commonData) + "/" + this.util.encryptAPIWorking(requestData);
            console.log("urlAPI:"+ urlAPI)
            return this.http.get(urlAPI).toPromise().then(data => {
                  return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())));
            })
      }
     


}