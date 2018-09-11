import { PickupItemDetail } from "../models/PickupItemDetail";
import { PickupOrderDetailItem } from "../models/PickupOrderDetailItem";
import { CombineOrderDetailItem } from "../models/CombineOrderDetailItem";
export class DelivertOrderDetail{
    DeliveryOrderDetail: PickupOrderDetailItem[]=[]
    DeliveryItemsPurchased:PickupItemDetail[]=[]
    PickupItemsPurchased:PickupItemDetail[]=[]
    PickupOrderDetail:PickupOrderDetailItem[]=[]
    CombinedFromOrders:CombineOrderDetailItem[]=[]
    ResultCode:string=""
    ResultDesc:string=""
    ServiceName:string=""
}