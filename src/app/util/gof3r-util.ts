import * as CryptoJS from 'crypto-js';
import * as CryptoJS256 from 'crypto-js/sha256';
import { strictEqual } from 'assert';

export class Gof3rUtil {
    encrypt(data: string) {
        var key = '120000001200000012000000';
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        //var keyHex=CryptoJS.enc.Hex.parse(key);
        var ivHex = "00000000";
        var iv = CryptoJS.enc.Hex.parse(ivHex);
        

        var encrypted = CryptoJS.TripleDES.encrypt(data, keyHex, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: iv

        });
        var en = encrypted.toString();
        
        var tohex = this.toHex(en).toUpperCase();
        return tohex;
    }

    encryptParams(data: string) {
        var key = '120000001200000012123456';
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        //var keyHex=CryptoJS.enc.Hex.parse(key);
        var ivHex = "00000000";
        var iv = CryptoJS.enc.Hex.parse(ivHex);
        

        var encrypted = CryptoJS.TripleDES.encrypt(data, keyHex, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: iv

        });
        var en = encrypted.toString();
        
        var tohex = this.toHex(en).toUpperCase();
        return tohex;
    }
    decryptByDESParams(ciphertext) {
        ciphertext = this.hexToString(ciphertext);
        var key = '120000001200000012123456';
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var ivHex = "00000000";
        var iv = CryptoJS.enc.Hex.parse(ivHex);
        var decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: iv
            });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    encryptKEK(data: string) {
        var key = this.decryptByDES((localStorage.getItem("KEK")));
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        //var keyHex=CryptoJS.enc.Hex.parse(key);
        var ivHex = "00000000";
        var iv = CryptoJS.enc.Hex.parse(ivHex);
        

        var encrypted = CryptoJS.TripleDES.encrypt(data, keyHex, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: iv

        });
        var en = encrypted.toString();
        
        var tohex = this.toHex(en).toUpperCase();
        return tohex;
    }
    encryptAPIWorking(data: string) {
        var keyKEK = this.decryptByDES((localStorage.getItem("KEK")));
        var key = this.decryptByDESWK(localStorage.getItem('WK'), keyKEK);
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        //var keyHex=CryptoJS.enc.Hex.parse(key);
        var ivHex = "00000000";
        var iv = CryptoJS.enc.Hex.parse(ivHex);
       

        var encrypted = CryptoJS.TripleDES.encrypt(data, keyHex, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: iv

        });
        var en = encrypted.toString();
        
        var tohex = this.toHex(en).toUpperCase();
        return tohex;
    }
    urlAPI() {
        return "https://test.sandbox-technology.com:82/CarrotServices/Service/";
        //return "https://demo.sandbox-technology.com:81/CarrotServices/Service/";
        //return "https://gof3r.sandbox-technology.com/CarrotServices/Service/";
    }
    urlUploadFile(){
        // return "https://demo.sandbox-technology.com:81/GOF3R/UploadCV.jsp" server demo
        // return "https://gof3r.sandbox-technology.com/GOF3R/UploadCV.jsp" server live
        return "https://demo.sandbox-technology.com:82/GOF3R/UploadCV.jsp"
    }
    hexToString(hex) {
        var string = '';
        for (var i = 0; i < hex.length; i += 2) {
            string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return string;
    }
    toHex(str) {
        var hex = '';
        for (var i = 0; i < str.length; i++) {
            hex += '' + str.charCodeAt(i).toString(16);
        }
        return hex;
    }
    decryptByDES(ciphertext) {
        ciphertext = this.hexToString(ciphertext);
        var key = '120000001200000012000000';
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var ivHex = "00000000";
        var iv = CryptoJS.enc.Hex.parse(ivHex);
        var decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: iv
            });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    decryptByDESWK(ciphertext, keyKEK: string) {
        ciphertext = this.hexToString(ciphertext);
        var key = keyKEK;
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var ivHex = "00000000";
        var iv = CryptoJS.enc.Hex.parse(ivHex);
        var decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: iv
            });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    decryptByDESAPIWorking(ciphertext: string) {
        ciphertext = this.hexToString(ciphertext);
        var keyKEK = this.decryptByDES((localStorage.getItem('KEK')));
        var key = this.decryptByDESWK(localStorage.getItem('WK'), keyKEK);
        
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var ivHex = "00000000";
        var iv = CryptoJS.enc.Hex.parse(ivHex);
        var decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: iv
            });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    formatCurrency(n, currency) {
        //n = n / 1000;
        return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }
    checkLogInUser() {
        if (localStorage.getItem("cus") != null) {// 

        }
    }
    s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    guid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }
    testuid() {
        
    }
    hashSHA256ToBytes(data:string){
        var shasum = CryptoJS.createHash("sha256"); 
        shasum.update(data, "utf-8"); 
        return shasum.digest("base64");
    }
    encodeBase64(data:string){
        return btoa(data)
    }
    generateSignature(txnReq:string,secretKey:string){
        let payloadByte= CryptoJS.enc.Utf8.parse(txnReq);
        let signatureBytes= CryptoJS.HmacSHA256(payloadByte, secretKey);
        return CryptoJS.enc.Base64.stringify(signatureBytes);
    }
    generateSignature1(txnReq:string,secretKey:string){
        return CryptoJS.HmacSHA1(txnReq, secretKey)
        
    }
    toUTF8Array(str) {
        var utf8 = [];
        for (var i=0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 
                          0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 
                          0x80 | ((charcode>>6) & 0x3f), 
                          0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                          | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >>18), 
                          0x80 | ((charcode>>12) & 0x3f), 
                          0x80 | ((charcode>>6) & 0x3f), 
                          0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }
    hashBase64StringAndReturnBase64String(str)
    {
        // Take the base64 string and parse it into a javascript variable
        var words  = CryptoJS.enc.Base64.parse(str);
        // Create the hash using the CryptoJS implementation of the SHA256 algorithm
        var hash = CryptoJS.SHA256(words);
        var outString =  hash.toString(CryptoJS.enc.Base64)
        // Display what you just got and return it
        
        return outString;
    }
    hashBase64(str:string){
        var utf8arr = CryptoJS.enc.Utf8.parse(str);
        var hash = CryptoJS.SHA256(utf8arr);
        var base64 = CryptoJS.enc.Base64.stringify(hash);
        
        return base64
    }

}