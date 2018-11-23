import { PickupItemDetail } from "../models/PickupItemDetail";
export class OutletPurChased{
    MerchantOutletName:string="";
    TotalItems:string="";
    OutletAddress:string=""
    DeliveryItemsPurchased :PickupItemDetail[]=[]
}