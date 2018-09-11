import { PickupItemDetail } from "../models/PickupItemDetail";
import { PickupOrderDetailItem } from "../models/PickupOrderDetailItem";
import { CombineOrderDetailItem } from "../models/CombineOrderDetailItem";
export class PickupOrderDetail{
    PickupOrderDetail: PickupOrderDetailItem[]=[]
    PickupItemsPurchased:PickupItemDetail[]=[]
    CombinedFromOrders:CombineOrderDetailItem[]=[]
    ResultCode:string=""
    ResultDesc:string=""
    ServiceName:string=""
}