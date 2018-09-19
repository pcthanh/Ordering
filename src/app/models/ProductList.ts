import { ProductModel } from "../models/Produtcs";
import { ProductListArray } from "../models/ProductListArray";
export class ProductListModel{
    ProductList:ProductListArray[];
    // Group:string;
    // Produtcs:ProductModel[];
    ResultCode:string="";
    ResultDesc:string="";
    ServiceName:string="";
    IsHavingDepartment:string="";
    AreAllSoldOut:string="";
}