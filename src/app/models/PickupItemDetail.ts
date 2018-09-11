import { OrderOptionItem } from "../models/OrderOptionItem";
export class PickupItemDetail{
    OrderDetailId:string=""
    OrderDetailPrice:string=""
    OrderDtlDisplayPrice:string=""
    OrderDetailQty:string=""
    SpecialRequest:string=""
    ProductName:string=""
    TotalItem:string=""
    OptionItem:string=""
    OrderOptions:OrderOptionItem []=[]

}