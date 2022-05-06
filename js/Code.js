var isPluginEnabled = false;
var fileContent; // РџРµСЂРµРјРµРЅРЅР°СЏ РґР»СЏ С…СЂР°РЅРµРЅРёСЏ РёРЅС„РѕСЂРјР°С†РёРё РёР· С„Р°Р№Р»Р°, Р·РЅР°С‡РµРЅРёРµ РїСЂРёСЃРІР°РёРІР°РµС‚СЃСЏ РІ cades_bes_file.html
var global_selectbox_container = new Array();
var global_isFromCont = new Array();
var global_selectbox_counter = 0;
function getXmlHttp(){
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}
function CertStatusEmoji(isValid, hasPrivateKey) {
    if (isValid) {
        _emoji = "\u2705";
    } else {
        _emoji = "\u274C";
    }
    //if (hasPrivateKey) {
    //    _emoji += "\uD83D\uDD11";
    //} else {
    //    _emoji += String.fromCodePoint(0x1F6AB);
    //}
    return _emoji;
}
var async_code_included = 0;
var async_Promise;
var async_resolve;
function include_async_code()
{
    if(async_code_included)
    {
        return async_Promise;
    }
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", "js/async_code.js");
    document.getElementsByTagName("head")[0].appendChild(fileref);
    async_Promise = new Promise(function(resolve, reject){
        async_resolve = resolve;
    });
    async_code_included = 1;
    return async_Promise;
}

function Common_RetrieveCertificate()
{
    var canAsync = !!cadesplugin.CreateObjectAsync;
    if(canAsync)
    {
        include_async_code().then(function(){
            return RetrieveCertificate_Async();
        });
    }else
    {
        return RetrieveCertificate_NPAPI();
    }
}

function Common_CreateSimpleSign(id)
{
    var canAsync = !!cadesplugin.CreateObjectAsync;
    if(canAsync)
    {
        include_async_code().then(function(){
            return CreateSimpleSign_Async(id);
        });
    }else
    {
        return CreateSimpleSign_NPAPI(id);
    }
}

function Common_SignCadesBES(id, text, setDisplayData)
{
    var canAsync = !!cadesplugin.CreateObjectAsync;
    if(canAsync)
    {
        include_async_code().then(function(){
            return SignCadesBES_Async(id, text, setDisplayData);
        });
    }else
    {
        return SignCadesBES_NPAPI(id, text, setDisplayData);
    }
}

function Common_SignCadesBES_File(id) {
    var canAsync = !!cadesplugin.CreateObjectAsync;
    if (canAsync) {
        include_async_code().then(function () {
            return SignCadesBES_Async_File(id);
        });
    } else {
        return SignCadesBES_NPAPI_File(id);
    }
}

function Common_SignCadesEnhanced(id, sign_type)
{
    var canAsync = !!cadesplugin.CreateObjectAsync;
    if(canAsync)
    {
        include_async_code().then(function(){
            return SignCadesEnhanced_Async(id, sign_type);
        });
    }else
    {
        return SignCadesEnhanced_NPAPI(id, sign_type);
    }
}

function Common_SignCadesXML(id, signatureType)
{
    var canAsync = !!cadesplugin.CreateObjectAsync;
    if(canAsync)
    {
        include_async_code().then(function(){
            return SignCadesXML_Async(id, signatureType);
        });
    }else
    {
        return SignCadesXML_NPAPI(id, signatureType);
    }
}

function Common_CheckForPlugIn() {
    cadesplugin.set_log_level(cadesplugin.LOG_LEVEL_DEBUG);
    var canAsync = !!cadesplugin.CreateObjectAsync;
    if(canAsync)
    {
        include_async_code().then(function(){
            return CheckForPlugIn_Async();
        });
    }else
    {
        return CheckForPlugIn_NPAPI();
    }
}

function Common_Encrypt() {
    var canAsync = !!cadesplugin.CreateObjectAsync;
    if(canAsync)
    {
        include_async_code().then(function(){
            return Encrypt_Async();
        });
    }else
    {
        return Encrypt_NPAPI();
    }
}

function Common_Decrypt(id) {
    var canAsync = !!cadesplugin.CreateObjectAsync;
    if(canAsync)
    {
        include_async_code().then(function(){
            return Decrypt_Async(id);
        });
    }else
    {
        return Decrypt_NPAPI(id);
    }
}

function GetCertificate_NPAPI(certListBoxId) {
    var e = document.getElementById(certListBoxId);
    var selectedCertID = e.selectedIndex;
    if (selectedCertID == -1) {
        alert("Select certificate");
        return;
    }
    return global_selectbox_container[selectedCertID];
}

function FillCertInfo_NPAPI(certificate, certBoxId, isFromContainer)
{
    var BoxId;
    var field_prefix;
    if(typeof(certBoxId) == 'undefined' || certBoxId == "CertListBox")
    {
        BoxId = 'cert_info';
        field_prefix = '';
    }else if (certBoxId == "CertListBox1") {
        BoxId = 'cert_info1';
        field_prefix = 'cert_info1';
    } else if (certBoxId == "CertListBox2") {
        BoxId = 'cert_info2';
        field_prefix = 'cert_info2';
    } else {
        BoxId = certBoxId;
        field_prefix = certBoxId;
    }

    var ValidToDate = new Date(certificate.ValidToDate);
    var ValidFromDate = new Date(certificate.ValidFromDate);
    var IsValid = false;
    //РµСЃР»Рё РїРѕРїР°РґРµС‚СЃСЏ СЃРµСЂС‚РёС„РёРєР°С‚ СЃ РЅРµРёР·РІРµСЃС‚РЅС‹Рј Р°Р»РіРѕСЂРёС‚РјРѕРј
    //С‚СѓС‚ Р±СѓРґРµС‚ РёСЃРєР»СЋС‡РµРЅРёРµ. Р’ С‚Р°РєРѕРј СЃРµСЂС‚РёС„РёРєР°С‚Рµ РїСЂРѕСЃС‚Рѕ РїСЂРѕРїСѓСЃРєР°РµРј С‚Р°РєРѕРµ РїРѕР»Рµ
    try {
        IsValid = certificate.IsValid().Result;    
    } catch (e) {
        
    }
    var hasPrivateKey = certificate.HasPrivateKey();
    var Now = new Date();

    var certObj = new CertificateObj(certificate);
    document.getElementById(BoxId).style.display = '';
    document.getElementById(field_prefix + "subject").innerHTML = "Р’Р»Р°РґРµР»РµС†: <b>" + certObj.GetCertName() + "<b>";
    document.getElementById(field_prefix + "issuer").innerHTML = "РР·РґР°С‚РµР»СЊ: <b>" + certObj.GetIssuer() + "<b>";
    document.getElementById(field_prefix + "from").innerHTML = "Р’С‹РґР°РЅ: <b>" + certObj.GetCertFromDate() + " UTC<b>";
    document.getElementById(field_prefix + "till").innerHTML = "Р”РµР№СЃС‚РІРёС‚РµР»РµРЅ РґРѕ: <b>" + certObj.GetCertTillDate() + " UTC<b>";
    if (hasPrivateKey) {
        document.getElementById(field_prefix + "provname").innerHTML = "РљСЂРёРїС‚РѕРїСЂРѕРІР°Р№РґРµСЂ: <b>" + certObj.GetPrivateKeyProviderName() + "<b>";
        try {
            var privateKeyLink = certObj.GetPrivateKeyLink();
            document.getElementById(field_prefix + "privateKeyLink").innerHTML = "РЎСЃС‹Р»РєР° РЅР° Р·Р°РєСЂС‹С‚С‹Р№ РєР»СЋС‡: <b>" + privateKeyLink + "<b>";
        } catch (e) {
            document.getElementById(field_prefix + "privateKeyLink").innerHTML = "РЎСЃС‹Р»РєР° РЅР° Р·Р°РєСЂС‹С‚С‹Р№ РєР»СЋС‡: <b> РќР°Р±РѕСЂ РєР»СЋС‡РµР№ РЅРµ СЃСѓС‰РµСЃС‚РІСѓРµС‚<b>";    
        }
    } else {
        document.getElementById(field_prefix + "provname").innerHTML = "РљСЂРёРїС‚РѕРїСЂРѕРІР°Р№РґРµСЂ:<b>";
        document.getElementById(field_prefix + "privateKeyLink").innerHTML = "РЎСЃС‹Р»РєР° РЅР° Р·Р°РєСЂС‹С‚С‹Р№ РєР»СЋС‡:<b>";
    }

    document.getElementById(field_prefix + "algorithm").innerHTML = "РђР»РіРѕСЂРёС‚Рј РєР»СЋС‡Р°: <b>" + certObj.GetPubKeyAlgorithm() + "<b>";
    if(Now < ValidFromDate) {
        document.getElementById(field_prefix + "status").innerHTML = "РЎС‚Р°С‚СѓСЃ: <span style=\"color:red; font-weight:bold; font-size:16px\"><b>РЎСЂРѕРє РґРµР№СЃС‚РІРёСЏ РЅРµ РЅР°СЃС‚СѓРїРёР»</b></span>";
    } else if( Now > ValidToDate){
        document.getElementById(field_prefix + "status").innerHTML = "РЎС‚Р°С‚СѓСЃ: <span style=\"color:red; font-weight:bold; font-size:16px\"><b>РЎСЂРѕРє РґРµР№СЃС‚РІРёСЏ РёСЃС‚РµРє</b></span>";
    } else if( !hasPrivateKey ){
        document.getElementById(field_prefix + "status").innerHTML = "РЎС‚Р°С‚СѓСЃ: <span style=\"color:red; font-weight:bold; font-size:16px\"><b>РќРµС‚ РїСЂРёРІСЏР·РєРё Рє Р·Р°РєСЂС‹С‚РѕРјСѓ РєР»СЋС‡Сѓ</b></span>";
    } else if( !IsValid ){
        document.getElementById(field_prefix + "status").innerHTML = "РЎС‚Р°С‚СѓСЃ: <span style=\"color:red; font-weight:bold; font-size:16px\"><b>РћС€РёР±РєР° РїСЂРё РїСЂРѕРІРµСЂРєРµ С†РµРїРѕС‡РєРё СЃРµСЂС‚РёС„РёРєР°С‚РѕРІ. Р’РѕР·РјРѕР¶РЅРѕ РЅР° РєРѕРјРїСЊСЋС‚РµСЂРµ РЅРµ СѓСЃС‚Р°РЅРѕРІР»РµРЅС‹ СЃРµСЂС‚РёС„РёРєР°С‚С‹ РЈР¦, РІС‹РґР°РІС€РµРіРѕ РІР°С€ СЃРµСЂС‚РёС„РёРєР°С‚</b></span>";
    } else {
        document.getElementById(field_prefix + "status").innerHTML = "РЎС‚Р°С‚СѓСЃ: <b> Р”РµР№СЃС‚РІРёС‚РµР»РµРЅ<b>";
    }
    if(isFromContainer)
    {
        document.getElementById(field_prefix + "location").innerHTML = "РЈСЃС‚Р°РЅРѕРІР»РµРЅ РІ С…СЂР°РЅРёР»РёС‰Рµ: <b>РќРµС‚</b>";
    } else {
        document.getElementById(field_prefix + "location").innerHTML = "РЈСЃС‚Р°РЅРѕРІР»РµРЅ РІ С…СЂР°РЅРёР»РёС‰Рµ: <b>Р”Р°</b>";
    }
}

function MakeCadesBesSign_NPAPI(dataToSign, certObject, setDisplayData, isBase64) {
    var errormes = "";

    try {
        var oSigner = cadesplugin.CreateObject("CAdESCOM.CPSigner");
    } catch (err) {
        errormes = "Failed to create CAdESCOM.CPSigner: " + err.number;
        alert(errormes);
        throw errormes;
    }

    if (oSigner) {
        oSigner.Certificate = certObject;
    }
    else {
        errormes = "Failed to create CAdESCOM.CPSigner";
        alert(errormes);
        throw errormes;
    }

    try {
        var oSignedData = cadesplugin.CreateObject("CAdESCOM.CadesSignedData");
    } catch (err) {
        alert('Failed to create CAdESCOM.CadesSignedData: ' + err.number);
        return;
    }

    var CADES_BES = 1;
    var Signature;

    if (dataToSign) {
        oSignedData.ContentEncoding = 1; //CADESCOM_BASE64_TO_BINARY
        // Р”Р°РЅРЅС‹Рµ РЅР° РїРѕРґРїРёСЃСЊ РІРІРµР»Рё
        if (typeof (isBase64) == 'undefined') {
            oSignedData.Content = Base64.encode(dataToSign);
        } else {
            oSignedData.Content = dataToSign;
        }
    }

    if (typeof (setDisplayData) != 'undefined') {
        //Set display data flag flag for devices like Rutoken PinPad
        oSignedData.DisplayData = 1;
    }
    oSigner.Options = 1; //CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN
    try {
        Signature = oSignedData.SignCades(oSigner, CADES_BES);
    }
    catch (err) {
        errormes = "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ РїРѕРґРїРёСЃСЊ РёР·-Р·Р° РѕС€РёР±РєРё: " + cadesplugin.getLastError(err);
        alert(cadesplugin.getLastError(err));
        throw errormes;
    }
    return Signature;
}

function MakeCadesEnhanced_NPAPI(dataToSign, tspService, certObject, sign_type) {
    var errormes = "";

    try {
        var oSigner = cadesplugin.CreateObject("CAdESCOM.CPSigner");
    } catch (err) {
        errormes = "Failed to create CAdESCOM.CPSigner: " + err.number;
        alert(errormes);
        throw errormes;
    }

    if (oSigner) {
        oSigner.Certificate = certObject;
    }
    else {
        errormes = "Failed to create CAdESCOM.CPSigner";
        alert(errormes);
        throw errormes;
    }

    try {
        var oSignedData = cadesplugin.CreateObject("CAdESCOM.CadesSignedData");
    } catch (err) {
        alert('Failed to create CAdESCOM.CadesSignedData: ' + cadesplugin.getLastError(err));
        return;
    }

    var Signature;

    if (dataToSign) {
        // Р”Р°РЅРЅС‹Рµ РЅР° РїРѕРґРїРёСЃСЊ РІРІРµР»Рё
        oSignedData.Content = dataToSign;
    }
    oSigner.Options = 1; //CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN
    oSigner.TSAAddress = tspService;
    try {
        Signature = oSignedData.SignCades(oSigner, sign_type);
    }
    catch (err) {
        errormes = "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ РїРѕРґРїРёСЃСЊ РёР·-Р·Р° РѕС€РёР±РєРё: " + cadesplugin.getLastError(err);
        alert(errormes);
        throw errormes;
    }
    return Signature;
}

function MakeXMLSign_NPAPI(dataToSign, certObject, signatureType) {
    try {
        var oSigner = cadesplugin.CreateObject("CAdESCOM.CPSigner");
    } catch (err) {
        errormes = "Failed to create CAdESCOM.CPSigner: " + err.number;
        alert(errormes);
        throw errormes;
    }

    if (oSigner) {
        oSigner.Certificate = certObject;
    }
    else {
        errormes = "Failed to create CAdESCOM.CPSigner";
        alert(errormes);
        throw errormes;
    }

    var signMethod = "";
    var digestMethod = "";

    var pubKey = certObject.PublicKey();
    var algo = pubKey.Algorithm;
    var algoOid = algo.Value;
    if (algoOid == "1.2.643.7.1.1.1.1") {   // Р°Р»РіРѕСЂРёС‚Рј РїРѕРґРїРёСЃРё Р“РћРЎРў Р  34.10-2012 СЃ РєР»СЋС‡РѕРј 256 Р±РёС‚
        signMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-256";
        digestMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-256";
    }
    else if (algoOid == "1.2.643.7.1.1.1.2") {   // Р°Р»РіРѕСЂРёС‚Рј РїРѕРґРїРёСЃРё Р“РћРЎРў Р  34.10-2012 СЃ РєР»СЋС‡РѕРј 512 Р±РёС‚
        signMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-512";
        digestMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-512";
    }
    else if (algoOid == "1.2.643.2.2.19") {  // Р°Р»РіРѕСЂРёС‚Рј Р“РћРЎРў Р  34.10-2001
        signMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102001-gostr3411";
        digestMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr3411";
    }
    else {
        errormes = "Р”Р°РЅРЅР°СЏ РґРµРјРѕ СЃС‚СЂР°РЅРёС†Р° РїРѕРґРґРµСЂР¶РёРІР°РµС‚ XML РїРѕРґРїРёСЃСЊ СЃРµСЂС‚РёС„РёРєР°С‚Р°РјРё СЃ Р°Р»РіРѕСЂРёС‚РјРѕРј Р“РћРЎРў Р  34.10-2012, Р“РћРЎРў Р  34.10-2001";
        throw errormes;
    }
    
    var CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED = 0|signatureType;
    if (signatureType > cadesplugin.CADESCOM_XADES_BES) {
        var tspService = document.getElementById("TSPServiceTxtBox").value;
        oSigner.TSAAddress = tspService;
    }
    
    try {
        var oSignedXML = cadesplugin.CreateObject("CAdESCOM.SignedXML");
    } catch (err) {
        alert('Failed to create CAdESCOM.SignedXML: ' + cadesplugin.getLastError(err));
        return;
    }

    oSignedXML.Content = dataToSign;
    oSignedXML.SignatureType = CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED;
    oSignedXML.SignatureMethod = signMethod;
    oSignedXML.DigestMethod = digestMethod;


    var sSignedMessage = "";
    try {
        sSignedMessage = oSignedXML.Sign(oSigner);
    }
    catch (err) {
        errormes = "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ РїРѕРґРїРёСЃСЊ РёР·-Р·Р° РѕС€РёР±РєРё: " + cadesplugin.getLastError(err);
        alert(errormes);
        throw errormes;
    }

    return sSignedMessage;
}

function GetSignatureTitleElement()
{
    var elementSignatureTitle = null;
    var x = document.getElementsByName("SignatureTitle");

    if(x.length == 0)
    {
        elementSignatureTitle = document.getElementById("SignatureTxtBox").parentNode.previousSibling;

        if(elementSignatureTitle.nodeName == "P")
        {
            return elementSignatureTitle;
        }
    }
    else
    {
        elementSignatureTitle = x[0];
    }

    return elementSignatureTitle;
}

function SignCadesBES_NPAPI(certListBoxId, data, setDisplayData) {
    var certificate = GetCertificate_NPAPI(certListBoxId);
    var dataToSign = document.getElementById("DataToSignTxtBox").value;
    if(typeof(data) != 'undefined')
    {
        dataToSign = data;
    }
    var x = GetSignatureTitleElement();
    try
    {
        var signature = MakeCadesBesSign_NPAPI(dataToSign, certificate, setDisplayData);
        document.getElementById("SignatureTxtBox").innerHTML = signature;
        if(x!=null)
        {
            x.innerHTML = "РџРѕРґРїРёСЃСЊ СЃС„РѕСЂРјРёСЂРѕРІР°РЅР° СѓСЃРїРµС€РЅРѕ:";
        }
    }
    catch(err)
    {
        if(x!=null)
        {
            x.innerHTML = "Р’РѕР·РЅРёРєР»Р° РѕС€РёР±РєР°:";
        }
        document.getElementById("SignatureTxtBox").innerHTML = err;
    }
}

function SignCadesBES_NPAPI_File(certListBoxId) {
    var certificate = GetCertificate_NPAPI(certListBoxId);
    var dataToSign = fileContent;
    var x = GetSignatureTitleElement();
    try {
        var StartTime = Date.now();
        var setDisplayData;
        var signature = MakeCadesBesSign_NPAPI(dataToSign, certificate, setDisplayData, 1);
        var EndTime = Date.now();
        document.getElementsByName('TimeTitle')[0].innerHTML = "Р’СЂРµРјСЏ РІС‹РїРѕР»РЅРµРЅРёСЏ: " + (EndTime - StartTime) + " РјСЃ";
        document.getElementById("SignatureTxtBox").innerHTML = signature;
        if (x != null) {
            x.innerHTML = "РџРѕРґРїРёСЃСЊ СЃС„РѕСЂРјРёСЂРѕРІР°РЅР° СѓСЃРїРµС€РЅРѕ:";
        }
    }
    catch (err) {
        if (x != null) {
            x.innerHTML = "Р’РѕР·РЅРёРєР»Р° РѕС€РёР±РєР°:";
        }
        document.getElementById("SignatureTxtBox").innerHTML = err;
    }
}

function SignCadesEnhanced_NPAPI(certListBoxId, sign_type) {
    var certificate = GetCertificate_NPAPI(certListBoxId);
    var dataToSign = document.getElementById("DataToSignTxtBox").value;
    var tspService = document.getElementById("TSPServiceTxtBox").value ;
    var x = GetSignatureTitleElement();
    try
    {
        var signature = MakeCadesEnhanced_NPAPI(dataToSign, tspService, certificate, sign_type);
        document.getElementById("SignatureTxtBox").innerHTML = signature;
        if(x!=null)
        {
            x.innerHTML = "РџРѕРґРїРёСЃСЊ СЃС„РѕСЂРјРёСЂРѕРІР°РЅР° СѓСЃРїРµС€РЅРѕ:";
        }
    }
    catch(err)
    {
        if(x!=null)
        {
            x.innerHTML = "Р’РѕР·РЅРёРєР»Р° РѕС€РёР±РєР°:";
        }
        document.getElementById("SignatureTxtBox").innerHTML = err;
    }
}

function SignCadesXML_NPAPI(certListBoxId, signatureType) {
    var certificate = GetCertificate_NPAPI(certListBoxId);
    var dataToSign = document.getElementById("DataToSignTxtBox").value;
    var x = GetSignatureTitleElement();
    try
    {
        var signature = MakeXMLSign_NPAPI(dataToSign, certificate, signatureType);
        document.getElementById("SignatureTxtBox").innerHTML = signature;

        if(x!=null)
        {
            x.innerHTML = "РџРѕРґРїРёСЃСЊ СЃС„РѕСЂРјРёСЂРѕРІР°РЅР° СѓСЃРїРµС€РЅРѕ:";
        }
    }
    catch(err)
    {
        if(x!=null)
        {
            x.innerHTML = "Р’РѕР·РЅРёРєР»Р° РѕС€РёР±РєР°:";
        }
        document.getElementById("SignatureTxtBox").innerHTML = err;
    }
}

function MakeVersionString(oVer)
{
    var strVer;
    if(typeof(oVer)=="string")
        return oVer;
    else
        return oVer.MajorVersion + "." + oVer.MinorVersion + "." + oVer.BuildVersion;
}

function CheckForPlugIn_NPAPI() {
    function VersionCompare_NPAPI(StringVersion, ObjectVersion)
    {
        if(typeof(ObjectVersion) == "string")
            return -1;
        var arr = StringVersion.split('.');

        if(ObjectVersion.MajorVersion == parseInt(arr[0]))
        {
            if(ObjectVersion.MinorVersion == parseInt(arr[1]))
            {
                if(ObjectVersion.BuildVersion == parseInt(arr[2]))
                {
                    return 0;
                }
                else if(ObjectVersion.BuildVersion < parseInt(arr[2]))
                {
                    return -1;
                }
            }else if(ObjectVersion.MinorVersion < parseInt(arr[1]))
            {
                return -1;
            }
        }else if(ObjectVersion.MajorVersion < parseInt(arr[0]))
        {
            return -1;
        }

        return 1;
    }

    function GetCSPVersion_NPAPI() {
        try {
           var oAbout = cadesplugin.CreateObject("CAdESCOM.About");
        } catch (err) {
            alert('Failed to create CAdESCOM.About: ' + cadesplugin.getLastError(err));
            return;
        }
        var ver = oAbout.CSPVersion("", 80);
        window.onload = function (e) {
            document.getElementById('CspEnabledImg').setAttribute("src", "Img/green_dot.svg");
            document.getElementById('CspEnabledTxt').innerHTML = "РљСЂРёРїС‚РѕРїСЂРѕРІР°Р№РґРµСЂ Р·Р°РіСЂСѓР¶РµРЅ";
        }
        document.getElementById('CspEnabledImg').setAttribute("src", "Img/green_dot.svg");
        document.getElementById('CspEnabledTxt').innerHTML = "РљСЂРёРїС‚РѕРїСЂРѕРІР°Р№РґРµСЂ Р·Р°РіСЂСѓР¶РµРЅ";
        return ver.MajorVersion + "." + ver.MinorVersion + "." + ver.BuildVersion;
    }

    function GetCSPName_NPAPI() {
        var sCSPName = "";
        try {
            var oAbout = cadesplugin.CreateObject("CAdESCOM.About");
            sCSPName = oAbout.CSPName(80);

        } catch (err) {
        }
        return sCSPName;
    }

    function ShowCSPVersion_NPAPI(CurrentPluginVersion)
    {
        if(typeof(CurrentPluginVersion) != "string")
        {
            document.getElementById('CSPVersionTxt').innerHTML = "Р’РµСЂСЃРёСЏ РєСЂРёРїС‚РѕРїСЂРѕРІР°Р№РґРµСЂР°: " + GetCSPVersion_NPAPI();
        }
        var sCSPName = GetCSPName_NPAPI();
        if(sCSPName!="")
        {
            document.getElementById('CSPNameTxt').innerHTML = "РљСЂРёРїС‚РѕРїСЂРѕРІР°Р№РґРµСЂ: " + sCSPName;
        }
    }
    function GetLatestVersion_NPAPI(CurrentPluginVersion) {
        var xmlhttp = getXmlHttp();
        xmlhttp.open("GET", "https://cryptopro.ru/sites/default/files/products/cades/latest_2_0.txt", true);
        xmlhttp.onreadystatechange = function() {
            var PluginBaseVersion;
            if (xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) {
                    PluginBaseVersion = xmlhttp.responseText;
                    if (isPluginWorked) { // РїР»Р°РіРёРЅ СЂР°Р±РѕС‚Р°РµС‚, РѕР±СЉРµРєС‚С‹ СЃРѕР·РґР°СЋС‚СЃСЏ
                        if (VersionCompare_NPAPI(PluginBaseVersion, CurrentPluginVersion)<0) {
                            document.getElementById('PluginEnabledImg').setAttribute("src", "Img/yellow_dot.svg");
                            document.getElementById('PlugInEnabledTxt').innerHTML = "РџР»Р°РіРёРЅ Р·Р°РіСЂСѓР¶РµРЅ, РЅРѕ РµСЃС‚СЊ Р±РѕР»РµРµ СЃРІРµР¶Р°СЏ РІРµСЂСЃРёСЏ";
                        }
                    }
                    else { // РїР»Р°РіРёРЅ РЅРµ СЂР°Р±РѕС‚Р°РµС‚, РѕР±СЉРµРєС‚С‹ РЅРµ СЃРѕР·РґР°СЋС‚СЃСЏ
                        if (isPluginLoaded) { // РїР»Р°РіРёРЅ Р·Р°РіСЂСѓР¶РµРЅ
                            if (!isPluginEnabled) { // РїР»Р°РіРёРЅ Р·Р°РіСЂСѓР¶РµРЅ, РЅРѕ РѕС‚РєР»СЋС‡РµРЅ
                                document.getElementById('PluginEnabledImg').setAttribute("src", "Img/red_dot.svg");
                                document.getElementById('PlugInEnabledTxt').innerHTML = "РџР»Р°РіРёРЅ Р·Р°РіСЂСѓР¶РµРЅ, РЅРѕ РѕС‚РєР»СЋС‡РµРЅ РІ РЅР°СЃС‚СЂРѕР№РєР°С… Р±СЂР°СѓР·РµСЂР°";
                            }
                            else { // РїР»Р°РіРёРЅ Р·Р°РіСЂСѓР¶РµРЅ Рё РІРєР»СЋС‡РµРЅ, РЅРѕ РѕР±СЉРµРєС‚С‹ РЅРµ СЃРѕР·РґР°СЋС‚СЃСЏ
                                document.getElementById('PluginEnabledImg').setAttribute("src", "Img/red_dot.svg");
                                document.getElementById('PlugInEnabledTxt').innerHTML = "РџР»Р°РіРёРЅ Р·Р°РіСЂСѓР¶РµРЅ, РЅРѕ РЅРµ СѓРґР°РµС‚СЃСЏ СЃРѕР·РґР°С‚СЊ РѕР±СЉРµРєС‚С‹. РџСЂРѕРІРµСЂСЊС‚Рµ РЅР°СЃС‚СЂРѕР№РєРё Р±СЂР°СѓР·РµСЂР°";
                            }
                        }
                        else { // РїР»Р°РіРёРЅ РЅРµ Р·Р°РіСЂСѓР¶РµРЅ
                            document.getElementById('PluginEnabledImg').setAttribute("src", "Img/red_dot.svg");
                            document.getElementById('PlugInEnabledTxt').innerHTML = "РџР»Р°РіРёРЅ РЅРµ Р·Р°РіСЂСѓР¶РµРЅ";
                        }
                    }
                }
            }
        }
        xmlhttp.send(null);
    }

    var isPluginLoaded = false;
    var isPluginWorked = false;
    var isActualVersion = false;
    try {
        var oAbout = cadesplugin.CreateObject("CAdESCOM.About");
        isPluginLoaded = true;
        isPluginEnabled = true;
        isPluginWorked = true;

        // Р­С‚Рѕ Р·РЅР°С‡РµРЅРёРµ Р±СѓРґРµС‚ РїСЂРѕРІРµСЂСЏС‚СЊСЃСЏ СЃРµСЂРІРµСЂРѕРј РїСЂРё Р·Р°РіСЂСѓР·РєРµ РґРµРјРѕ-СЃС‚СЂР°РЅРёС†С‹
        var CurrentPluginVersion = oAbout.PluginVersion;
        if( typeof(CurrentPluginVersion) == "undefined")
            CurrentPluginVersion = oAbout.Version;

        window.onload = function (e) {
            document.getElementById('PluginEnabledImg').setAttribute("src", "Img/green_dot.svg");
            document.getElementById('PlugInEnabledTxt').innerHTML = "РџР»Р°РіРёРЅ Р·Р°РіСЂСѓР¶РµРЅ";
            document.getElementById('CspEnabledImg').setAttribute("src", "Img/yellow_dot.svg");
            document.getElementById('CspEnabledTxt').innerHTML = "РљСЂРёРїС‚РѕРџСЂРѕ CSP РЅРµ Р·Р°РіСЂСѓР¶РµРЅ";
        }
        document.getElementById('PluginEnabledImg').setAttribute("src", "Img/green_dot.svg");
        document.getElementById('PlugInEnabledTxt').innerHTML = "РџР»Р°РіРёРЅ Р·Р°РіСЂСѓР¶РµРЅ";
        document.getElementById('CspEnabledImg').setAttribute("src", "Img/yellow_dot.svg");
        document.getElementById('CspEnabledTxt').innerHTML = "РљСЂРёРїС‚РѕРџСЂРѕ CSP РЅРµ Р·Р°РіСЂСѓР¶РµРЅ";
        document.getElementById('PlugInVersionTxt').innerHTML = "Р’РµСЂСЃРёСЏ РїР»Р°РіРёРЅР°: " + MakeVersionString(CurrentPluginVersion);
        ShowCSPVersion_NPAPI(CurrentPluginVersion);
    }
    catch (err) {
        // РћР±СЉРµРєС‚ СЃРѕР·РґР°С‚СЊ РЅРµ СѓРґР°Р»РѕСЃСЊ, РїСЂРѕРІРµСЂРёРј, СѓСЃС‚Р°РЅРѕРІР»РµРЅ Р»Рё
        // РІРѕРѕР±С‰Рµ РїР»Р°РіРёРЅ. РўР°РєР°СЏ РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊ РµСЃС‚СЊ РЅРµ РІРѕ РІСЃРµС… Р±СЂР°СѓР·РµСЂР°С…
        var mimetype = navigator.mimeTypes["application/x-cades"];
        if (mimetype) {
            isPluginLoaded = true;
            var plugin = mimetype.enabledPlugin;
            if (plugin) {
                isPluginEnabled = true;
            }
        }
    }
    GetLatestVersion_NPAPI(CurrentPluginVersion);
    if(location.pathname.indexOf("symalgo_sample.html")>=0){
        FillCertList_NPAPI('CertListBox1');
        FillCertList_NPAPI('CertListBox2');
    } else{
        FillCertList_NPAPI('CertListBox');
    }
}

function CertificateObj(certObj)
{
    this.cert = certObj;
    this.certFromDate = new Date(this.cert.ValidFromDate);
    this.certTillDate = new Date(this.cert.ValidToDate);
}

CertificateObj.prototype.check = function(digit)
{
    return (digit<10) ? "0"+digit : digit;
}

CertificateObj.prototype.checkQuotes = function(str)
{
    var result = 0, i = 0;
    for(i;i<str.length;i++)if(str[i]==='"')
        result++;
    return !(result%2);
}

CertificateObj.prototype.extract = function(from, what)
{
    certName = "";

    var begin = from.indexOf(what);

    if(begin>=0)
    {
        var end = from.indexOf(', ', begin);
        while(end > 0) {
            if (this.checkQuotes(from.substr(begin, end-begin)))
                break;
            end = from.indexOf(', ', end + 1);
        }
        certName = (end < 0) ? from.substr(begin) : from.substr(begin, end - begin);
    }

    return certName;
}

CertificateObj.prototype.DateTimePutTogether = function(certDate)
{
    return this.check(certDate.getUTCDate())+"."+this.check(certDate.getUTCMonth()+1)+"."+certDate.getFullYear() + " " +
                 this.check(certDate.getUTCHours()) + ":" + this.check(certDate.getUTCMinutes()) + ":" + this.check(certDate.getUTCSeconds());
}

CertificateObj.prototype.GetCertString = function()
{
    return this.extract(this.cert.SubjectName,'CN=') + "; Р’С‹РґР°РЅ: " + this.GetCertFromDate();
}

CertificateObj.prototype.GetCertFromDate = function()
{
    return this.DateTimePutTogether(this.certFromDate);
}

CertificateObj.prototype.GetCertTillDate = function()
{
    return this.DateTimePutTogether(this.certTillDate);
}

CertificateObj.prototype.GetPubKeyAlgorithm = function()
{
    return this.cert.PublicKey().Algorithm.FriendlyName;
}

CertificateObj.prototype.GetCertName = function()
{
    return this.extract(this.cert.SubjectName, 'CN=');
}

CertificateObj.prototype.GetIssuer = function()
{
    return this.extract(this.cert.IssuerName, 'CN=');
}

CertificateObj.prototype.GetPrivateKeyProviderName = function()
{
    return this.cert.PrivateKey.ProviderName;
}

CertificateObj.prototype.GetPrivateKeyLink = function () {
    return this.cert.PrivateKey.UniqueContainerName;
}

function GetFirstCert_NPAPI() {
    try {
        var oStore = cadesplugin.CreateObject("CAdESCOM.Store");
        oStore.Open();
    }
    catch (e) {
        alert("Certificate not found");
        return;
    }

    var dateObj = new Date();
    var certCnt;

    try {
        certCnt = oStore.Certificates.Count;
        if(certCnt==0)
            throw "Certificate not found";
    }
    catch (ex) {
        oStore.Close();
        document.getElementById("boxdiv").style.display = '';
        return;
    }

    if(certCnt) {
        try {
            for (var i = 1; i <= certCnt; i++) {
                var cert = oStore.Certificates.Item(i);
                if(dateObj<cert.ValidToDate && cert.HasPrivateKey() && cert.IsValid().Result){
                    return cert;
                }
            }
        }
        catch (ex) {
            alert("РћС€РёР±РєР° РїСЂРё РїРµСЂРµС‡РёСЃР»РµРЅРёРё СЃРµСЂС‚РёС„РёРєР°С‚РѕРІ: " + cadesplugin.getLastError(ex));
            return;
        }
    }
}

function CreateSimpleSign_NPAPI()
{
    oCert = GetFirstCert_NPAPI();
    var x = GetSignatureTitleElement();
    try
    {
        if (typeof oCert != "undefined") {
            FillCertInfo_NPAPI(oCert);
            var sSignedData = MakeCadesBesSign_NPAPI(txtDataToSign, oCert);
            document.getElementById("SignatureTxtBox").innerHTML = sSignedData;
            if(x!=null)
            {
                x.innerHTML = "РџРѕРґРїРёСЃСЊ СЃС„РѕСЂРјРёСЂРѕРІР°РЅР° СѓСЃРїРµС€РЅРѕ:";
            }
        }
    }
    catch(err)
    {
        if(x!=null)
        {
            x.innerHTML = "Р’РѕР·РЅРёРєР»Р° РѕС€РёР±РєР°:";
        }
        document.getElementById("SignatureTxtBox").innerHTML = err;
    }
}

function onCertificateSelected(event) {
    var selectedCertID = event.target.selectedIndex;
    var certificate = global_selectbox_container[selectedCertID];
    FillCertInfo_NPAPI(certificate, event.target.boxId, global_isFromCont[selectedCertID]);
}


function FillCertList_NPAPI(lstId) {
    try {
        var lst = document.getElementById(lstId);
        if(!lst)
            return;
    }
    catch (ex) {
        return;
    }

    lst.onchange = onCertificateSelected;
    lst.boxId = lstId;
    var MyStoreExists = true;

    try {
        var oStore = cadesplugin.CreateObject("CAdESCOM.Store");
        oStore.Open();
    }
    catch (ex) {
        MyStoreExists = false;
    }


    var certCnt;
    if(MyStoreExists) {
        certCnt = oStore.Certificates.Count;
        for (var i = 1; i <= certCnt; i++) {
            var cert;
            try {
                cert = oStore.Certificates.Item(i);
            }
            catch (ex) {
                alert("РћС€РёР±РєР° РїСЂРё РїРµСЂРµС‡РёСЃР»РµРЅРёРё СЃРµСЂС‚РёС„РёРєР°С‚РѕРІ: " + cadesplugin.getLastError(ex));
                return;
            }

            var oOpt = document.createElement("OPTION");
            try {
                var certObj = new CertificateObj(cert, true);
                oOpt.text = CertStatusEmoji(cert.ValidToDate > Date.now()) + certObj.GetCertString();
            }
            catch (ex) {
                alert("РћС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё СЃРІРѕР№СЃС‚РІР° SubjectName: " + cadesplugin.getLastError(ex));
            }
            try {
                oOpt.value = global_selectbox_counter
                global_selectbox_container.push(cert);
                global_isFromCont.push(false);
                global_selectbox_counter++;
            }
            catch (ex) {
                alert("РћС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё СЃРІРѕР№СЃС‚РІР° Thumbprint: " + cadesplugin.getLastError(ex));
            }

            lst.options.add(oOpt);
        }

        oStore.Close();
    }

    //Р’ РІРµСЂСЃРёРё РїР»Р°РіРёРЅР° 2.0.13292+ РµСЃС‚СЊ РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊ РїРѕР»СѓС‡РёС‚СЊ СЃРµСЂС‚РёС„РёРєР°С‚С‹ РёР· 
    //Р·Р°РєСЂС‹С‚С‹С… РєР»СЋС‡РµР№ Рё РЅРµ СѓСЃС‚Р°РЅРѕРІР»РµРЅРЅС‹С… РІ С…СЂР°РЅРёР»РёС‰Рµ
    try {
        oStore.Open(cadesplugin.CADESCOM_CONTAINER_STORE);
        certCnt = oStore.Certificates.Count;
        for (var i = 1; i <= certCnt; i++) {
            var cert = oStore.Certificates.Item(i);
            //РџСЂРѕРІРµСЂСЏРµРј РЅРµ РґРѕР±Р°РІР»СЏР»Рё Р»Рё РјС‹ С‚Р°РєРѕР№ СЃРµСЂС‚РёС„РёРєР°С‚ СѓР¶Рµ?
            var found = false;
            for (var j = 0; j < global_selectbox_container.length; j++)
            {
                if (global_selectbox_container[j].Thumbprint === cert.Thumbprint)
                {
                    found = true;
                    break;
                }
            }
            if(found)
                continue;
            var certObj = new CertificateObj(cert);
            var oOpt = document.createElement("OPTION");
            oOpt.text = CertStatusEmoji(cert.ValidToDate > Date.now()) + certObj.GetCertString();
            oOpt.value = global_selectbox_counter
            global_selectbox_container.push(cert);
            global_isFromCont.push(true);
            global_selectbox_counter++;
            lst.options.add(oOpt);
        }
        oStore.Close();
    }
    catch (ex) {
    }
    if(global_selectbox_container.length == 0) {
        document.getElementById("boxdiv").style.display = '';
    }
}

function CreateCertRequest_NPAPI()
{
    try {
        var PrivateKey = cadesplugin.CreateObject("X509Enrollment.CX509PrivateKey");
    }
    catch (e) {
        alert('Failed to create X509Enrollment.CX509PrivateKey: ' + cadesplugin.getLastError(e));
        return;
    }

    PrivateKey.ProviderName = "Crypto-Pro GOST R 34.10-2012 Cryptographic Service Provider";
    PrivateKey.ProviderType = 80;
    PrivateKey.KeySpec = 1; //XCN_AT_KEYEXCHANGE

    try {
        var CertificateRequestPkcs10 = cadesplugin.CreateObject("X509Enrollment.CX509CertificateRequestPkcs10");
    }
    catch (e) {
        alert('Failed to create X509Enrollment.CX509CertificateRequestPkcs10: ' + cadesplugin.getLastError(e));
        return;
    }

    CertificateRequestPkcs10.InitializeFromPrivateKey(0x1, PrivateKey, "");

    try {
        var DistinguishedName = cadesplugin.CreateObject("X509Enrollment.CX500DistinguishedName");
    }
    catch (e) {
        alert('Failed to create X509Enrollment.CX500DistinguishedName: ' + cadesplugin.getLastError(e));
        return;
    }

    var CommonName = "Test Certificate";
    DistinguishedName.Encode("CN=\""+CommonName.replace(/"/g, "\"\"")+"\"");

    CertificateRequestPkcs10.Subject = DistinguishedName;

    var KeyUsageExtension = cadesplugin.CreateObject("X509Enrollment.CX509ExtensionKeyUsage");
    var CERT_DATA_ENCIPHERMENT_KEY_USAGE = 0x10;
    var CERT_KEY_ENCIPHERMENT_KEY_USAGE = 0x20;
    var CERT_DIGITAL_SIGNATURE_KEY_USAGE = 0x80;
    var CERT_NON_REPUDIATION_KEY_USAGE = 0x40;

    KeyUsageExtension.InitializeEncode(
                CERT_KEY_ENCIPHERMENT_KEY_USAGE |
                CERT_DATA_ENCIPHERMENT_KEY_USAGE |
                CERT_DIGITAL_SIGNATURE_KEY_USAGE |
                CERT_NON_REPUDIATION_KEY_USAGE);

    CertificateRequestPkcs10.X509Extensions.Add(KeyUsageExtension);

    try {
        var Enroll = cadesplugin.CreateObject("X509Enrollment.CX509Enrollment");
    }
    catch (e) {
        alert('Failed to create X509Enrollment.CX509Enrollment: ' + cadesplugin.getLastError(e));
        return;
    }
    var cert_req;
    try {
        Enroll.InitializeFromRequest(CertificateRequestPkcs10);
        cert_req = Enroll.CreateRequest(0x1);
    } catch (e) {
        alert('Failed to generate KeyPair or reguest: ' + cadesplugin.getLastError(e));
        return;    
    }
    
    return cert_req;
}

function RetrieveCertificate_NPAPI()
{
    var cert_req = CreateCertRequest_NPAPI();
    var params = 'CertRequest=' + encodeURIComponent(cert_req) +
                 '&Mode=' + encodeURIComponent('newreq') +
                 '&TargetStoreFlags=' + encodeURIComponent('0') +
                 '&SaveCert=' + encodeURIComponent('no');

    var xmlhttp = getXmlHttp();
    xmlhttp.open("POST", "https://testca.cryptopro.ru/certsrv/certfnsh.asp", true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var response;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                response = xmlhttp.responseText;
                var cert_data = "";

                if(!isIE())
                {
                    var start = response.indexOf("var sPKCS7");
                    var end = response.indexOf("sPKCS7 += \"\"") + 13;
                    cert_data = response.substring(start, end);
                }
                else
                {
                    var start = response.indexOf("sPKCS7 & \"") + 9;
                    var end = response.indexOf("& vbNewLine\r\n\r\n</Script>");
                    cert_data = response.substring(start, end);
                    cert_data = cert_data.replace(new RegExp(" & vbNewLine",'g'),";");
                    cert_data = cert_data.replace(new RegExp("&",'g'),"+");
                    cert_data = "var sPKCS7=" + cert_data + ";";
                }

                eval(cert_data);

                try {
                    var Enroll = cadesplugin.CreateObject("X509Enrollment.CX509Enrollment");
                }
                catch (e) {
                    alert('Failed to create X509Enrollment.CX509Enrollment: ' + cadesplugin.getLastError(e));
                    return;
                }

                Enroll.Initialize(0x1);
                Enroll.InstallResponse(0, sPKCS7, 0x7, "");
                document.getElementById("boxdiv").style.display = 'none';
                if(location.pathname.indexOf("simple")>=0) {
                    location.reload();
                }
                else if(location.pathname.indexOf("symalgo_sample.html")>=0){
                    FillCertList_NPAPI('CertListBox1');
                    FillCertList_NPAPI('CertListBox2');
                }
                else{
                    FillCertList_NPAPI('CertListBox');
                }
            }
        }
    }
    xmlhttp.send(params);
}

function Encrypt_NPAPI() {

    document.getElementById("DataEncryptedIV1").innerHTML = "";
    document.getElementById("DataEncryptedIV2").innerHTML = "";
    document.getElementById("DataEncryptedDiversData1").innerHTML = "";
    document.getElementById("DataEncryptedDiversData2").innerHTML = "";
    document.getElementById("DataEncryptedBox1").innerHTML = "";
    document.getElementById("DataEncryptedBox2").innerHTML = "";
    document.getElementById("DataEncryptedKey1").innerHTML = "";
    document.getElementById("DataEncryptedKey2").innerHTML = "";
    document.getElementById("DataDecryptedBox1").innerHTML = "";
    document.getElementById("DataDecryptedBox2").innerHTML = "";

    var certificate1 = GetCertificate_NPAPI('CertListBox1');
    if(typeof(certificate1) == 'undefined')
    {
        return;
    }
    var certificate2 = GetCertificate_NPAPI('CertListBox2');
    if(typeof(certificate2) == 'undefined')
    {
        return;
    }

    var dataToEncr1 = Base64.encode(document.getElementById("DataToEncrTxtBox1").value);
    var dataToEncr2 = Base64.encode(document.getElementById("DataToEncrTxtBox2").value);

    if(dataToEncr1 === "" || dataToEncr2 === "") {
        errormes = "Empty data to encrypt";
        alert(errormes);
        throw errormes;
    }

    try
    {
        //FillCertInfo_NPAPI(certificate1, 'cert_info1');
        //FillCertInfo_NPAPI(certificate2, 'cert_info2');
        var errormes = "";

        try {
            var oSymAlgo = cadesplugin.CreateObject("cadescom.symmetricalgorithm");
        } catch (err) {
            errormes = "Failed to create cadescom.symmetricalgorithm: " + err;
            alert(errormes);
            throw errormes;
        }

        oSymAlgo.GenerateKey();

        var oSesKey1 = oSymAlgo.DiversifyKey();
        var oSesKey1DiversData = oSesKey1.DiversData;
        document.getElementById("DataEncryptedDiversData1").value = oSesKey1DiversData;
        var oSesKey1IV = oSesKey1.IV;
        document.getElementById("DataEncryptedIV1").value = oSesKey1IV;
        var EncryptedData1 = oSesKey1.Encrypt(dataToEncr1, 1);
        document.getElementById("DataEncryptedBox1").value = EncryptedData1;

        var oSesKey2 = oSymAlgo.DiversifyKey();
        var oSesKey2DiversData = oSesKey2.DiversData;
        document.getElementById("DataEncryptedDiversData2").value = oSesKey2DiversData;
        var oSesKey2IV = oSesKey2.IV;
        document.getElementById("DataEncryptedIV2").value = oSesKey2IV;
        var EncryptedData2 = oSesKey2.Encrypt(dataToEncr2, 1);
        document.getElementById("DataEncryptedBox2").value = EncryptedData2;

        var ExportedKey1 = oSymAlgo.ExportKey(certificate1);
        document.getElementById("DataEncryptedKey1").value = ExportedKey1;

        var ExportedKey2 = oSymAlgo.ExportKey(certificate2);
        document.getElementById("DataEncryptedKey2").value = ExportedKey2;

        alert("Р”Р°РЅРЅС‹Рµ Р·Р°С€РёС„СЂРѕРІР°РЅС‹ СѓСЃРїРµС€РЅРѕ:");
    }
    catch(err)
    {
        alert("РћС€РёР±РєР° РїСЂРё С€РёС„СЂРѕРІР°РЅРёРё РґР°РЅРЅС‹С…:" + err);
    }
}

function Decrypt_NPAPI(certListBoxId) {

    document.getElementById("DataDecryptedBox1").value = "";
    document.getElementById("DataDecryptedBox2").value = "";

    var certificate = GetCertificate_NPAPI(certListBoxId);
    if(typeof(certificate) == 'undefined')
    {
        return;
    }
    var dataToDecr1 = document.getElementById("DataEncryptedBox1").value;
    var dataToDecr2 = document.getElementById("DataEncryptedBox2").value;
    var field;
    if(certListBoxId == 'CertListBox1')
        field ="DataEncryptedKey1";
    else
        field ="DataEncryptedKey2";

    var EncryptedKey = document.getElementById(field).value;
    try
    {
        FillCertInfo_NPAPI(certificate, 'cert_info_decr');
        var errormes = "";

        try {
            var oSymAlgo = cadesplugin.CreateObject("cadescom.symmetricalgorithm");
        } catch (err) {
            errormes = "Failed to create cadescom.symmetricalgorithm: " + err;
            alert(errormes);
            throw errormes;
        }
        oSymAlgo.ImportKey(EncryptedKey, certificate);
        var oSesKey1DiversData = document.getElementById("DataEncryptedDiversData1").value;
        var oSesKey1IV = document.getElementById("DataEncryptedIV1").value;
        oSymAlgo.DiversData = oSesKey1DiversData;
        var oSesKey1 = oSymAlgo.DiversifyKey();
        oSesKey1.IV = oSesKey1IV;
        var EncryptedData1 = oSesKey1.Decrypt(dataToDecr1, 1);
        document.getElementById("DataDecryptedBox1").value = Base64.decode(EncryptedData1);
        var oSesKey2DiversData = document.getElementById("DataEncryptedDiversData2").value;
        var oSesKey2IV = document.getElementById("DataEncryptedIV2").value;
        oSymAlgo.DiversData = oSesKey2DiversData;
        var oSesKey2 = oSymAlgo.DiversifyKey();
        oSesKey2.IV = oSesKey2IV;
        var EncryptedData2 = oSesKey2.Decrypt(dataToDecr2, 1);
        document.getElementById("DataDecryptedBox2").value = Base64.decode(EncryptedData2);

        alert("Р”Р°РЅРЅС‹Рµ СЂР°СЃС€РёС„СЂРѕРІР°РЅС‹ СѓСЃРїРµС€РЅРѕ:");
    }
    catch(err)
    {
        alert("РћС€РёР±РєР° РїСЂРё С€РёС„СЂРѕРІР°РЅРёРё РґР°РЅРЅС‹С…:" + err);
    }
}

function isIE() {
    var retVal = (("Microsoft Internet Explorer" == navigator.appName) || // IE < 11
        navigator.userAgent.match(/Trident\/./i)); // IE 11
    return retVal;
}

function isEdge() {
    var retVal = navigator.userAgent.match(/Edge\/./i);
    return retVal;
}

function ShowEdgeNotSupported() {
    document.getElementById('PluginEnabledImg').setAttribute("src", "Img/red_dot.svg");
    document.getElementById('PlugInEnabledTxt').innerHTML = "Рљ СЃРѕР¶Р°Р»РµРЅРёСЋ, Р±СЂР°СѓР·РµСЂ Edge РЅРµ РїРѕРґРґРµСЂР¶РёРІР°РµС‚СЃСЏ!";
}

//-----------------------------------
var Base64 = {


    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",


    encode: function(input) {
            var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                    enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },


    decode: function(input) {
            var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                    utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function(utftext) {
            var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                    string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                    c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}
var MakePayment = function(sum,date,to){
    return '<!PINPADFILE UTF8><N>РџР»Р°С‚РµР¶РЅРѕРµ РїРѕСЂСѓС‡РµРЅРёРµ<V>500'
        + '<N>РЎСѓРјРјР°<V>' + sum
        + '<N>Р”Р°С‚Р°<V>' + date
        + '<N>РџРѕР»СѓС‡Р°С‚РµР»СЊ<V>' + to
        + '<N>РРЅРЅ<V>102125125212'
        + '<N>РљРџРџ<V>1254521521'
        + '<N>РќР°Р·РЅР°С‡РµРЅРёРµ РїР»Р°С‚РµР¶Р°<V>Р—Р° С‚РµР»РµРјР°С‚РёС‡РµСЃРєРёРµ СѓСЃР»СѓРіРё'
        + '<N>Р‘Р°РЅРє РїРѕР»СѓС‡Р°С‚РµР»СЏ<V>РЎР±РµСЂР±Р°РЅРє'
        + '<N>Р‘РРљ<V>5005825'
        + '<N>РќРѕРјРµСЂ СЃС‡РµС‚Р° РїРѕР»СѓС‡Р°С‚РµР»СЏ<V>1032221122214422'
        + '<N>РџР»Р°С‚РµР»СЊС‰РёРє<V>Р—РђРћ "РђРєС‚РёРІ-СЃРѕС„С‚"'
        + '<N>Р‘Р°РЅРє РїР»Р°С‚РµР»СЊС‰РёРєР°<V>Р‘Р°РЅРє Р’РўР‘ (РѕС‚РєСЂС‹С‚РѕРµ Р°РєС†РёРѕРЅРµСЂРЅРѕРµ РѕР±С‰РµСЃС‚РІРѕ)'
        + '<N>Р‘РРљ<V>044525187'
        + '<N>РќРѕРјРµСЂ СЃС‡РµС‚Р° РїР»Р°С‚РµР»СЊС‰РёРєР°<V>30101810700000000187';
};



function ShowPinPadelogin(){
    var loginvalue = document.getElementById('Login').value;
    var text = '<!PINPADFILE UTF8><N>РђРІС‚РѕСЂРёР·Р°С†РёСЏ<V><N>РџРѕРґС‚РІРµСЂРґРёС‚Рµ Р°РІС‚РѕСЂРёР·Р°С†РёСЋ РЅР° СЃР°Р№С‚Рµ<V>'
                + 'cryptopro.ru'
                + '<N>Р’С…РѕРґ Р±СѓРґРµС‚ РїСЂРѕРёР·РІРµРґРµРЅ СЃ Р»РѕРіРёРЅРѕРј<V>' + loginvalue;
    Common_SignCadesBES('CertListBox',text, 1);
}
