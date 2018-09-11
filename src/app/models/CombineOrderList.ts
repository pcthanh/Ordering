import { OrderListItem } from "../models/OrderListItem";
export class CombineOrderList{
    Status:string=""
    OrderList:OrderListItem[]=[]
    CombineOrderList:OrderListItem[]=[]
    ResultCode:string="";
    ResultDesc:string="";
    ServiceName:string="";
}