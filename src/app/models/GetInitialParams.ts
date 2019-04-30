import { CurrencyInfoModel } from "../models/CurrencyInfo";
import { MCCInfoModel } from "../models/MCCInfo";
import { GenderInfoModel } from "../models/GenderInfo";
import { GiftTemplateCategoryModel } from "../models/GiftTemplateCategory";
import { CountryInfoModel } from "../models/CountryInfo";
import { DateTimeFormatInfoModel } from "../models/DateTimeFormatInfo";
import { MenuURLModel } from "../models/MenuURL";
import { GetInTouchNumberModel } from "../models/GetInTouchNumber";
import { PaymentGatewayInfoModel } from "../models/PaymentGatewayInfo";
import { FeeCollectionInfoModel } from "../models/FeeCollectionInfo";
import { OtherParamsModel } from "../models/OtherParams";
import { OtherParam } from "../models/OtherParam";
export class GetInitialParams{
    CustomerInfo:any=[];
    UserAppMenu:any=[];
    DefaultAppsUsedToShare:any=[];
    TutorialImages:any=[];
    CurrencyInfo:CurrencyInfoModel[];
    MCCInfo:MCCInfoModel[];
    GenderInfo:GenderInfoModel[];
    GiftTemplateCategory:GiftTemplateCategoryModel[];
    CountryInfo:CountryInfoModel[];
    DateTimeFormatInfo:DateTimeFormatInfoModel[];
    MenuURL:MenuURLModel[];
    GetInTouchNumber:GetInTouchNumberModel[];
    PaymentGatewayInfo:PaymentGatewayInfoModel[];
    FeeCollectionInfo:FeeCollectionInfoModel[];
    OtherParams:OtherParamsModel[];
    ResultCode:string;
    ResultDesc:string;
    ServiceName:string
    ActionsForSoldOutItem:any[]=[];
}