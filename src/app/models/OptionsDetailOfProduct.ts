import { OptionItemListModel } from "../models/OptionItemList";
export class OptionsDetailOfProductModel{
    OptionId:number;
    OptionName:string;
    MinOptionItemSelectionRequired:number;
    MaxOptionItemSelectionRequired:number;
    OptionItemList:OptionItemListModel[]=[];
    isCheck:boolean;
}