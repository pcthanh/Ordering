export class NetPaysRequest{
    txnAmount:string;
    merchantTxnRef:string
    b2sTxnEndURL:string;
    s2sTxnEndURL:string
    netsMid:string
    merchantTxnDtm:string
    submissionMode:string
    paymentType:string;
    paymentMode:string
    clientType:string
    currencyCode:string
    merchantTimeZone:string
    netsMidIndicator:string
    ipAddress:string
    tid:string
    language:string="en"
    b2sTxnEndURLParam:string
    supMsg:string
    s2sTxnEndURLParam:string
}