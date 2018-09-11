import { ProductDetailParseModel } from "../models/ProductDetailParse";
export class CartOrder{
    OrderType:string="";
    OuteletID:string=""
    Cart:ProductDetailParseModel []=[];
}