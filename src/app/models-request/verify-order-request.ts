export class VerifyOrderRequest{
    CurrencyCode:string="";
    OrderType:string;
    Subtotal:string;
    MerchantId:string;
    CustomerId:string="";
    MerchantOutletId:string;
    IsCombinedOrder:string=""
    ProductList:string=""
    CombinedOrderInfo:string=""
}