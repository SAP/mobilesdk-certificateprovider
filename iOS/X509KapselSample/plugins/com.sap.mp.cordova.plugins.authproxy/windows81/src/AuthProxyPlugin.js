
///////////////////////////////  AuthProxy ///////////////////////////////////
module.exports = {

    sendRequest: function (success, fail, args) {

        var method = args[0];
        var url = args[1];
        var header = args[2];
        var requestBody = args[3];
        var user = args[4];
        var password = args[5];
        var timeout = args[6];
        var certSource = args[7];
        //var ap = new AuthProxyPlugin.AuthProxy();
        var ap = new SAP.AuthProxy.AuthProxy();

        var headerStr = (header == "undefined") ? header : JSON.stringify(header);
        var certSourceStr = (certSource == "undefined") ? certSource : JSON.stringify(certSource);

        ap.sendRequest(method, url, headerStr, requestBody, user, password, timeout, certSourceStr)
             .then(
                 // success handler
                 function (jsonResult) {
                     var result = JSON.parse(jsonResult);
                     if (result.errorCode == undefined && result.exceptionCode == undefined)
                         success(result);
                     else
                         fail(result);
                 },
                 // error handler
                 function (err) {
                     _handleError(fail, err.message);
                 }
             );
    },

    sendRequest2: function (success, fail, args) {

    	var method = args[0];
    	var url = args[1];
    	var header = args[2];
    	var requestBody = args[3];
    	var timeout = args[4];
    	var authConfig = args[5];

    	var ap = new SAP.AuthProxy.AuthProxy();

    	var headerStr = (header == "undefined") ? header : JSON.stringify(header);
    	var authConfigStr = (authConfig == "undefined") ? authConfig : JSON.stringify(authConfig);

    	ap.sendRequest2(method, url, headerStr, requestBody, timeout, authConfigStr)
			.then(
				// success handler
				function (jsonResult) {
					var result = JSON.parse(jsonResult);
					if (result.errorCode == undefined && result.exceptionCode == undefined) {
						var authConfiguration = ap.authConfig != null ? ap.authConfig.samlAuthConfiguration : null;
						var authChallengeHeader = authConfiguration != null ? authConfiguration.samlauthChallengeHeader : null;
						if (authChallengeHeader != null && result.headers != null && result.headers[authChallengeHeader] == "login-request") {
							console.log("SAML authentication challenge!");

							sap.AuthProxy.doSAMLAuthenticationInWebview(authConfiguration.endpoint, authConfiguration.redirectParam);

							var samlAuthenticationCompleteHandler = function () {
								WinJS.Application.removeEventListener("samlAuthenticationComplete", samlAuthenticationCompleteHandler, false);
								module.exports.sendRequest2(success, fail, args);
							};
							WinJS.Application.addEventListener("samlAuthenticationComplete", samlAuthenticationCompleteHandler, false);
						} else {
							success(result);
						}
					} else {
						fail(result);
					}
				},
				// error handler
				function (err) {
					_handleError(fail, err.message);
				}
			);
    },

    samlAuthenticationComplete: function (success, fail, args) {
    	if (args[1]) {
    		WinJS.Application.queueEvent({ type: "samlAuthenticationComplete" });
    	}
    },

    get: function (success, fail, args) {

        var url = args[0];
        var header = args[1];
        var user = args[2];
        var password = args[3];
        var timeout = args[4];
        var certSource = args[5];
        var ap = new SAP.AuthProxy.AuthProxy();

        var headerStr = (header == "undefined") ? header : JSON.stringify(header);
        var certSourceStr = (certSource == "undefined") ? certSource : JSON.stringify(certSource);

        ap.get(url, header, requestBody, user, password, timeout, certSourceStr)
             .then(
                 // success handler
                 function (jsonResult) {
                     var result = JSON.parse(jsonResult);
                     if (result.errorCode == undefined && result.exceptionCode == undefined)
                         success(result);
                     else
                         fail(result);
                 },
                 // error handler
                 function (err) {
                     _handleError(fail, err.message);
                 }
             );
    },

    deleteCertificateFromStore: function (success, fail, arg) {
        var CertificateKey = args[0];
        var ap = new SAP.AuthProxy.AuthProxy();

        ap.deleteCertificateFromStore(CertificateKey)
             .then(
                 // success handler
                 function (jsonResult) {
                     var result = JSON.parse(jsonResult);
                     if (result.errorCode == undefined && result.exceptionCode == undefined)
                         success(result);
                     else
                         fail(result);
                 },
                 // error handler
                 function (err) {
                     _handleError(fail, err.message);
                 }
             );
    }

};


function _handleError(errorCallback, errorMessage) {
    if (errorCallback != null) {
        var errorCode = 0;
        if (errorMessage != null && errorMessage !== undefined) {
            var ERROR_CODE_STR = "error code:";
            var chunks = errorMessage.split(ERROR_CODE_STR);
            if (chunks.length > 1) {
                errorCode = parseInt(chunks[1]);
            }
        }
        errorCallback(errorCode > 1 ? errorCode : errorMessage);
    }
}

require("cordova/windows8/commandProxy").add("AuthProxy", module.exports);


/////////////////////////////////////////////////////////////////////////


