import { CardInfoModel } from "../models/CardInfo";
import { PrepaidWalletItemInfo } from "../models/PrepaidWalletItemInfo";
import { PointWalletItemInfo } from "../models/PointWalletItemInfo";

export class GetAllPaymentOptionsWithPromotionModle{
    CardListInfo:CardInfoModel[]=[];
    AddCardAdviceMessage:string="";
    NoMessageDataForCardList:string="";
    NoMessageDataForAccountList:string="";
    NoMessageDataForPointWalletList:string="";
    NoMessageDataForPrepaidWalletList:string="";
    AccountListInfo:any=[];
    PrepaidWalletListInfo:PrepaidWalletItemInfo[]=[]
    PointWalletListInfo:PointWalletItemInfo[]=[]
    ResultCode:string="";
    ResultDesc:string="";
    ServiceName:String=""
    CVVMessage:string=""
    NetsPayEnabled:string=""
    
}