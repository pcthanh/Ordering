import { PickupItemDetail } from "../models/PickupItemDetail";
import { PickupOrderDetailItem } from "../models/PickupOrderDetailItem";
import { CombineOrderDetailItem } from "../models/CombineOrderDetailItem";
import { OutletPurChased } from "../models/OutletPurCharse";
export class DelivertOrderDetail{
    DeliveryOrderDetail: PickupOrderDetailItem[]=[]
    DeliveryItemsPurchased:PickupItemDetail[]=[]
    PickupItemsPurchased:PickupItemDetail[]=[]
    PickupOrderDetail:PickupOrderDetailItem[]=[]
    CombinedFromOrders:CombineOrderDetailItem[]=[]
    OutletsPurchased:OutletPurChased[]=[]
    ResultCode:string=""
    ResultDesc:string=""
    ServiceName:string=""
}