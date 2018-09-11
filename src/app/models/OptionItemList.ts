export class OptionItemListModel{
    OptionItemId:string;
    OptionItemName:string;
    CurrencyCode:string;
    Price:string;
    PriceDisplay:string;
    PickupPrice:string;
    PickupPriceDisplay:string;
    DeliveryPrice:string;
    DeliveryPriceDisplay:string;
    MinQuantityRequired:number;
    MaxQuantityRequired:number;
    IsSoldOut:string;
    isCheck:boolean;
    isShowQty:boolean=true;
    Qty:number=0;
    isLock:boolean=false;
    Total:number;
    TotalStr:string
}