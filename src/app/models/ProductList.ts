import { ProductModel } from "../models/Produtcs";
export class ProductListModel{
    Group:string;
    Produtcs:ProductModel[];
    ResultCode:string="";
    ResultDesc:string="";
    ServiceName:string="";
    IsHavingDepartment:string="";
    AreAllSoldOut:string="";
}