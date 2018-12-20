import * as CryptoJS from 'crypto-js';


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
        //return "https://test.sandbox-technology.com:82/CarrotServices/Service/";
        //return "https://demo.sandbox-technology.com:81/CarrotServices/Service/";
        return "https://gof3r.sandbox-technology.com/CarrotServices/Service/";
    }
    urlUploadFile(){
        // return "https://demo.sandbox-technology.com:81/GOF3R/UploadCV.jsp" server demo
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

}