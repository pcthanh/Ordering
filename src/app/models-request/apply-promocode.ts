export class ApplyPromocodeRequest{
    PromoCode:string;
    Subtotal:string;
    CustomerId:string;
    MCC:string
    IsCombinedOrder:string="";
    MerchantId:string="";
    MerchantOutletId:string="";
    ProductList:string="";
    CombinedOrderInfo:string=""
    OrderType:string=""
}