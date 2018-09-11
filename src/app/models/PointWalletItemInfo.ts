import { CustomerTranxFeeModel } from "../models/CustomerTranxFee";
export class PointWalletItemInfo{
    RowNum:string=""
    WalletNo:string=""
    WalletName:string=""
    IsFavorite:string=""
    MemberTypeName:string=""
    MerchantId:string=""
    MerchantIdValue:string=""
    MerchantIdImg:string=""
    CanTradePoint:string=""
    CanExchangePoint:string=""
    CanClaimPoint:string=""
    CanTopupPoint:string=""
    CanTransferPoint:string=""
    CanRedeemPoint:string=""
    WalletStatus:string=""
    WalletStatusValue:string=""
    PointBalance:string=""
    PointBalanceDisplay:string=""
    CashEquivalence:string=""
    CashEquivalenceDisplay:string=""
    CurrencyCode:string=""
    CurrencyCodeValue:string=""
    CustomerTranxFee:CustomerTranxFeeModel[]=[]
    HavingPromotion:string=""

}