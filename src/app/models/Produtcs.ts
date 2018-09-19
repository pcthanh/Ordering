import { TagListModel } from "../models/TagList";
import { OptionsModel } from "../models/Options";
export class ProductModel{
    RowNum:number;
    DepartmentName:string;
    CategoryName:string;
    Id:number;
    Name:string;
    Description:string;
    Image:string;
    IsSoldOut:string;
    IsForPickup:string;
    IsForDelivery:string;
    CurrencyCode:string;
    Price:string;
    PriceDisplay:string;
    PickupPrice:string;
    PickupPriceDisplay:string;
    DeliveryPrice:string;
    DeliveryPriceDisplay:string;
    TagList:TagListModel[];
    Quantity:number;
    SpecialRequest:string;
    Options:OptionsModel[];
    HaveImage:boolean=true;
}