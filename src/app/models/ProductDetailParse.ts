import { TagListModel } from "../models/TagList";
import { OptionsDetailOfProductModel } from "../models/OptionsDetailOfProduct";
export class ProductDetailParseModel{
    Id:number;
    Name:string;
    Description:string;
    Image:string;
    Image1:string;
    Image2:string;
    IsSoldOut:string;
    CurrencyCode:string;
    Price:string;
    PriceDisplay:string;
    PickupPrice:string;
    PickupPriceDisplay:string;
    DeliveryPrice:string;
    DeliveryPriceDisplay:string;
    TagList:TagListModel[];
    OptionList:OptionsDetailOfProductModel[]=[];
    Qty:number=1;
    Total:number=0;
    TotalStr:string;
    SpecialRequest:string="";
    OptionItemsStr:string=""
}