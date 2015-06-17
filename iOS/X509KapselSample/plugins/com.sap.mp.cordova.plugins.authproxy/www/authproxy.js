// 3.8.1
var exec = require('cordova/exec');

/**
 * The AuthProxy plugin provides the ability to make HTTPS requests with mutual authentication.<br/>
 * <br/>
 * The regular XMLHttpRequest does not
 * support mutual authentication.  The AuthProxy plugin allows you to specify a certificate to include in an HTTPS request
 * to identify the client to the server.  This allows the server to verify the identity of the client.  An example of where you
 * might need mutual authenticaion is the onboarding process to register with an application, or, to access an
 * OData producer. This occurs mostly in Business to Business (B2B) applications. This is different from most business to
 * consumer (B2C) web sites where it is only the server that authenticates itself to the client with a certificate.<br/>
 * <br/>
 * <b>Adding and Removing the AuthProxy Plugin</b><br/>
 * The AuthProxy plugin is added and removed using the
 * <a href="http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-line%20Interface">Cordova CLI</a>.<br/>
 * <br/>
 * To add the AuthProxy plugin to your project, use the following command:<br/>
 * cordova plugin add <path to directory containing Kapsel plugins>\authproxy<br/>
 * <br/>
 * To remove the AuthProxy plugin from your project, use the following command:<br/>
 * cordova plugin rm com.sap.mp.cordova.plugins.authproxy
 * @namespace
 * @alias AuthProxy
 * @memberof sap
 */
var AuthProxy = function () {};


/**
 * Constant definitions for registration methods
 */

/**
 * Constant indicating the operation failed with unknown error. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_UNKNOWN = -1;

/**
 * Constant indicating the operation failed due to an invalid parameter (for example, a string was passed where a number was
 * required). Used as a possible value for the errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant 
 * @type number 
 */
AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE = -2;

/**
 * Constant indicating the operation failed because of a missing parameter. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_MISSING_PARAMETER = -3;

/**
 * Constant indicating there is no such Cordova action for the current service.  When a Cordova plugin calls into native
 * code it specifies an action to perform.  If the action provided by the JavaScript is unknown to the native code this
 * error occurs.  This error should not occur as long as authproxy.js is unmodified. Used as a possible
 * value for the errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_NO_SUCH_ACTION = -100;

/**
 * Constant indicating the certificate from file is not supported on the current platform. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_FILE_CERTIFICATE_SOURCE_UNSUPPORTED = -101;

/**
 * Constant indicating the certificate from the system keystore is not supported on the current platform. Used as a possible value
 * for the errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_SYSTEM_CERTIFICATE_SOURCE_UNSUPPORTED = -102;

/**
 * Constant indicating the certificate with the given alias could not be found. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_CERTIFICATE_ALIAS_NOT_FOUND = -104;

/**
 * Constant indicating the certificate file could not be found. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_CERTIFICATE_FILE_NOT_EXIST = -105;

/**
 * Constant indicating incorrect certificate file format.  Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_CERTIFICATE_INVALID_FILE_FORMAT = -106;

/**
 * Constant indicating failure in getting the certificate. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_GET_CERTIFICATE_FAILED = -107;

/**
 * Constant indicating the provided certificate failed validation on the server side. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_CLIENT_CERTIFICATE_VALIDATION = -108;

/**
 * Constant indicating the server certificate failed validation on the client side.  This is likely because the server certificate
 * is self-signed, or not signed by a well-known certificate authority.  This constant is used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_SERVER_CERTIFICATE_VALIDATION = -109;

/**
 * Constant indicating the server request failed. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_SERVER_REQUEST_FAILED = -110;

/**
 * Constant indicating the logon manager core library is not available.  Getting this error code means you tried
 * to use Logon plugin features (for example, a certificate from Logon) without adding the Logon plugin to the app.
 * A possible value for the errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number
 */
AuthProxy.prototype.ERR_LOGON_MANAGER_CORE_NOT_AVAILABLE = -111;

/**
 * Constant indicating the logon manager certifciate method is not available. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number
 */
AuthProxy.prototype.ERR_LOGON_MANAGER_CERTIFICATE_METHOD_NOT_AVAILABLE = -112;

/**
 * Constant indicating timeout error while connecting to the server. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_HTTP_TIMEOUT = -120;

/**
 * Constant indicating cordova domain whitelist rejection error while sending request to server. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_DOMAIN_WHITELIST_REJECTION = -121;

/**
 * Constant indicating a missing required parameter message.  Used as a possible value for the description
 * in (@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type string 
 * @private
 */
AuthProxy.prototype.MSG_MISSING_PARAMETER = "Missing a required parameter: ";

/**
 * Constant indicating invalid parameter value message.  Used as a possible value for the description
 * in (@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type string 
 * @private
 */
AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE = "Invalid Parameter Value for parameter: ";

/**
 * Create certificate source description object for a certificate from a keystore file.  The keystore file must be of type PKCS12
 * (usually a .p12 extention) since that is the only certificate file type that can contain a private key (a private key is needed
 * to authenticate the client to the server).  You might want to use this method if you know the desired certificate resides in a
 * file on the filesystem.
 * @class
 * @param {string} Path The Path of the keystore file.<br/>For iOS clients, it first tries to load the 
 *                 relative file path from the application's Documents folder. If it fails, it then tries
 *                 to load the file path from application's main bundle. In addition, before trying 
 *                 to load the certificate from the file system, the iOS client first checks whether the 
 *                 specified certificate key already exists in the key store. If it does, it loads 
 *                 the existing certificate from key store, instead of loading the certificate from 
 *                 file system.<br/>
 *                 For Android clients, the filepath is first treated as an absolute path. If the certificate
 *                 is not found, then the filepath is treated as relative to the root of the sdcard.
 * @param {string} Password The password of the keystore.
 * @param {string} CertificateKey A unique key (aka: alias) that is used to locate the certificate. 
 * @example
 * // Create the certificate source description object.
 * var fileCert = new sap.AuthProxy.CertificateFromFile("directory/certificateName.p12", "certificatePassword", "certificateKey");
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 * // Make the request with the certificate source description object.
 * sap.AuthProxy.sendRequest("POST", "https://hostname", headers, "THIS IS THE BODY", successCB, errorCB, null, null, 0, fileCert);
 * 
 */
AuthProxy.prototype.CertificateFromFile = function (Path, Password, CertificateKey) {
    this.Source = "FILE";
    this.Path = Path;
    this.Password = Password;
    this.CertificateKey = CertificateKey;
};

/**
 * Create a certificate source description object for certificates from the system keystore.  You might want to use a certificate
 * from the system keystore if you know the user's device will have the desired certificate installed on it.<br/>
 * On Android, sending a request with a certificate from the system store results in UI being shown for the user to pick
 * the certificate to use (the certificate with the alias matching the given CertificateKey is pre-selected).
 * @class
 * @param {string} CertificateKey A unique key (aka: alias) that is used to locate the certificate.
 * @example
 * // Create the certificate source description object.
 * var systemCert = new sap.AuthProxy.CertificateFromStore("certificatekey");
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 * // Make the request with the certificate source description object.
 * sap.AuthProxy.sendRequest("POST", "https://hostname", headers, "THIS IS THE BODY", successCB, errorCB, null, null, 0, systemCert);
 */
AuthProxy.prototype.CertificateFromStore = function (CertificateKey) {
    this.Source = "SYSTEM";
    this.CertificateKey = CertificateKey;
};


/**
 * Create a certificate source description object for certificates from logon manager.  Using the resulting certificate source description
 * object on subsequent calls to AuthProxy.sendRequest or AuthProxy.get will cause AuthProxy to retrieve a certificate from Logon Manager
 * to use for client authentication. The appID parameter is used to indicate which application's certificate to use.<br/>
 * Note that to use a certificate from Logon Manager, the application must have already registered with the server using a certificate from Afaria.
 * @class
 * @param {string} appID application identifier
 * @example
 * // Create the certificate source description object.
 * var logonCert = new sap.AuthProxy.CertificateFromLogonManager("applicationID");
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 * // Make the request with the certificate source description object.
 * sap.AuthProxy.sendRequest("POST", "https://hostname", headers, "THIS IS THE BODY", successCB, errorCB, null, null, 0, logonCert);
 */
AuthProxy.prototype.CertificateFromLogonManager = function (appID) {
    this.Source = "LOGON";
    this.AppID = appID;
};


/**
 * Verifies that a certificate source description object (created with {@link sap.AuthProxy#CertificateFromFile},
 * {@link sap.AuthProxy#CertificateFromStore}, or {@link sap.AuthProxy#CertificateFromLogonManager}) has all the required fields and that the values
 * for those fields are the correct type.  This function verifies only the certificate description object, not the certificate itself.  So, for example,
 * if the certificate source description object was created with {@link sap.AuthProxy#CertificateFromFile} and has a String for the filepath and a
 * String for the key/alias, <b>this function considers it valid even if no certificate actually exists on the filesystem</b>.  If the certificate
 * source description object is valid but the certificate itself is not, then an error occurs during the call to {@link sap.AuthProxy#get} or
 * {@link sap.AuthProxy#sendRequest}.
 * @param {object} certSource The certificate source object.
 * @param {sap.AuthProxy~errorCallback} errorCB The error callback invoked if the certificate source is not valid.  Will have an object with 'errorCode'
 * and 'description' properties.
 * @example
 * var notValidCert = {};
 * var errorCallback = function(error){
 *     alert("certificate not valid!\nError code: " + error.errorCode + "\ndescription: " + error.description);
 * }
 * var isCertValid = sap.AuthProxy.validateCertSource(notValidCert, errorCallback);
 * if( isCertValid ){
 *     // do stuff with the valid certificate source description object
 * } else {
 *     // at this point we know the cert is not valid, and the error callback is invoked with extra information.
 * }
 *
 *
 * Developers are not expected to call this function.
 * @private
 */
AuthProxy.prototype.validateCertSource = function (certSource, errorCB) {
    if (!certSource) {
        // The certificate is not present, so just ignore it.
        return true;
    }

    // errorCB required.
    // First check this one. We may need it to return errors
    if (errorCB && (typeof errorCB !== "function")) {
        console.log("AuthProxy Error: errorCB is not a function");
        return false;
    }

    try {
        // First check whether it is an object
        if (typeof certSource !== "object") {
            errorCB({
                errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "certSource"
            });
            return false;
        }

        if (certSource.Source === "FILE") {
            if (!certSource.Path) {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "keystore path"
                });
                return false;
            }

            if (typeof certSource.Path !== "string") {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "keystore path"
                });
                return false;
            }

            if (!certSource.CertificateKey) {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "certificate key"
                });
                return false;
            }

            if (typeof certSource.CertificateKey !== "string") {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "certificate key"
                });
                return false;
            }
        } else if (certSource.Source === "SYSTEM") {
            if (!certSource.CertificateKey) {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "certificate key"
                });
                return false;
            }

            if (typeof certSource.CertificateKey !== "string") {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "certificate key"
                });
                return false;
            }
        } else if (certSource.Source === "LOGON") {
            if (!certSource.AppID) {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "AppID"
                });
                return false;
            }

            if (typeof certSource.AppID !== "string") {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "AppID"
                });
                return false;
            }
        } else {
            errorCB({
                errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "certSource"
            });
            return false;
        }

        return true;
    } catch (ex) {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "certSource"
        });
    }
};

/**
 * Send an HTTP(S) request to a remote server.  This function is the centerpiece of the AuthProxy plugin.  It will handle
 * mutual authentication if a certificate source is provided.
 * The success callback is invoked upon any response from the server.  Even responses not generally considered to be
 * successful (such as 404 or 500 status codes) will result in the success callback being invoked.  The error callback
 * is reserved for problems that prevent the AuthProxy from creating the request or contacting the server.  It is therefore
 * important to always check the status property on the object given to the success callback.
 * @param {string} method Standard HTTP request method name.
 * @param {string} url The HTTP URL with format http(s)://hostname[:port]/path.
 * @param {Object} header HTTP header to send to the server. This is an Object. Can be null.
 * @param {string} requestBody Data to send to the server with the request. Can be null.
 * @param {sap.AuthProxy~successCallback} successCB Callback method invoked upon a response from the server.
 * @param {sap.AuthProxy~errorCallback} errorCB Callback method invoked in case of failure.
 * @param {number} [timeout] Timeout setting in seconds.  Default timeout is 60 seconds.  A value of 0 means there is no timeout.
 * @param {Object} [authConfig] authentication configuration object.
 * @param {Object} [forCheckReachability] To check server reachability, set the parameter to an object, otherwise setting it to null
 * @return {function} A JavaScript function object to abort the operation.  Calling the abort function results in neither the success or error
 * callback being invoked for the original request (excepting the case where the success or error callback was invoked before calling the
 * abort function).  Note that the request itself cannot be unsent, and the server will still receive the request - the JavaScript will just
 * not know the results of that request.
 * @example
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 *
 * // To send a post request to the server, call the method
 * var abortFunction = sap.AuthProxy.sendRequest("POST", "http://www.google.com", null, "THIS IS THE BODY", successCB, errorCB);
 * // An example of aborting the request
 * abortFunction();
 *
 * // To send a post request to the server with headers, call the method
 * sap.AuthProxy.sendRequest("POST", url, {HeaderName : "Header value"}, "THIS IS THE BODY", successCB, errorCB);
 *
 * // To send a post request to the server with preset basic authentication configuration, call the method
 * var authConfig = {basic:[{type:"preset", data:{user:"myname", password:"mypassword"}}, {type:"user"}]};
 * sap.AuthProxy.sendRequest("POST", url, headers, "THIS IS THE BODY", successCB, errorCB, null, authConfig);
 *
 * // To send a post request to the server with mutual authentication selected by user, call the method
 * var authConfig = {clientcert:[{type:"user"}]};
 * sap.AuthProxy.sendRequest("POST", "https://hostname", null, "THIS IS THE BODY", successCB, errorCB, null, authConfig);
 */
AuthProxy.prototype.sendRequest2 = function (method, url, header, requestBody, successCB, errorCB, timeout, authConfig, forCheckReachability) {

    // errorCB required.
    // First check this one. We may need it to return errors
    if (!errorCB || (typeof errorCB !== "function")) {
        console.log("AuthProxy Error: errorCB is not a function");
        // if error callback is invalid, throw an exception to notify the caller
        throw new Error("AuthProxy Error: errorCB is not a function");
    }

    // method required
    if (!method) {
        console.log("AuthProxy Error: method is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "method"
        });
        return;
    }


    // We only support GET, POST, HEAD, PUT, DELETE, PATCH method
    if (method !== "GET" && method !== "POST" && method !== "HEAD" && method !== "PUT" && method !== "DELETE" && method !== "PATCH") {
        console.log("Invalid Parameter Value for parameter: " + method);
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "method"
        });
        return;
    }


    // url required
    if (!url) {
        console.log("AuthProxy Error: url is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "url"
        });
        return;
    }


    // successCB required
    if (!successCB) {
        console.log("AuthProxy Error: successCB is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "successCB"
        });
        return;
    }


    if (typeof successCB !== "function") {
        console.log("AuthProxy Error: successCB is not a function");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "successCB"
        });
        return;
    }

    if (timeout && typeof timeout !== "number") {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "timeout"
        });
        return;
    }

    //TODO: validate authConfig data

    try {
        var client = new Client2(method, url, header, requestBody, successCB, errorCB, timeout, authConfig, forCheckReachability);
        return client.send();
    } catch (ex) {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_UNKNOWN,
            description: ex.message
        });
    }

};


/**
 * Send an HTTP(S) request to a remote server.  This function is the centerpiece of the AuthProxy plugin.  It will handle
 * mutual authentication if a certificate source is provided.
 * The success callback is invoked upon any response from the server.  Even responses not generally considered to be
 * successful (such as 404 or 500 status codes) will result in the success callback being invoked.  The error callback
 * is reserved for problems that prevent the AuthProxy from creating the request or contacting the server.  It is therefore
 * important to always check the status property on the object given to the success callback.
 * @param {string} method Standard HTTP request method name.
 * @param {string} url The HTTP URL with format http(s)://[user:password]@hostname[:port]/path.
 * @param {Object} header HTTP header to send to the server. This is an Object. Can be null.
 * @param {string} requestBody Data to send to the server with the request. Can be null.
 * @param {sap.AuthProxy~successCallback} successCB Callback method invoked upon a response from the server.
 * @param {sap.AuthProxy~errorCallback} errorCB Callback method invoked in case of failure.
 * @param {string} [user] User ID for basic authentication.
 * @param {string} [password] User password for basic authentication.
 * @param {number} [timeout] Timeout setting in seconds.  Default timeout is 60 seconds.  A value of 0 means there is no timeout.
 * @param {Object} [certSource] Certificate description object. It can be one of {@link sap.AuthProxy#CertificateFromFile},
 * {@link sap.AuthProxy#CertificateFromStore}, or {@link sap.AuthProxy#CertificateFromLogonManager}.
 * @return {function} A JavaScript function object to abort the operation.  Calling the abort function results in neither the success or error
 * callback being invoked for the original request (excepting the case where the success or error callback was invoked before calling the
 * abort function).  Note that the request itself cannot be unsent, and the server will still receive the request - the JavaScript will just
 * not know the results of that request.
 * @example
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 *
 * // To send a post request to the server, call the method
 * var abortFunction = sap.AuthProxy.sendRequest("POST", "http://www.google.com", null, "THIS IS THE BODY", successCB, errorCB);
 * // An example of aborting the request
 * abortFunction();
 *
 * // To send a post request to the server with headers, call the method
 * sap.AuthProxy.sendRequest("POST", url, {HeaderName : "Header value"}, "THIS IS THE BODY", successCB, errorCB);
 *
 * // To send a post request to the server with basic authentication, call the method
 * sap.AuthProxy.sendRequest("POST", url, headers, "THIS IS THE BODY", successCB, errorCB, "username", "password");
 *
 * // To send a post request to the server with mutual authentication, call the method
 * sap.AuthProxy.sendRequest("POST", "https://hostname", headers, "THIS IS THE BODY", successCB, errorCB, null, 
 *     null, 0, new sap.AuthProxy.CertificateFromLogonManager("theAppId"));
 */
AuthProxy.prototype.sendRequest = function (method, url, header, requestBody, successCB, errorCB, user, password, timeout, certSource) {

    // errorCB required.
    // First check this one. We may need it to return errors
    if (!errorCB || (typeof errorCB !== "function")) {
        console.log("AuthProxy Error: errorCB is not a function");
        // if error callback is invalid, throw an exception to notify the caller
        throw new Error("AuthProxy Error: errorCB is not a function");
    }

    // method required
    if (!method) {
        console.log("AuthProxy Error: method is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "method"
        });
        return;
    }


    // We only support GET, POST, HEAD, PUT, DELETE, PATCH method
    if (method !== "GET" && method !== "POST" && method !== "HEAD" && method !== "PUT" && method !== "DELETE" && method !== "PATCH") {
        console.log("Invalid Parameter Value for parameter: " + method);
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "method"
        });
        return;
    }


    // url required
    if (!url) {
        console.log("AuthProxy Error: url is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "url"
        });
        return;
    }


    // successCB required
    if (!successCB) {
        console.log("AuthProxy Error: successCB is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "successCB"
        });
        return;
    }


    if (typeof successCB !== "function") {
        console.log("AuthProxy Error: successCB is not a function");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "successCB"
        });
        return;
    }


    if (user && typeof user !== "string") {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "user"
        });
        return;
    }


    if (password && typeof password !== "string") {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "password"
        });
        return;
    }


    if (timeout && typeof timeout !== "number") {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "timeout"
        });
        return;
    }

    if (!this.validateCertSource(certSource, errorCB)) {
        return;
    }


    try {
        var client = new Client(method, url, header, requestBody, successCB, errorCB, user, password, timeout, certSource);
        return client.send();
    } catch (ex) {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_UNKNOWN,
            description: ex.message
        });
    }

};

/**
 * Send an HTTP(S) GET request to a remote server.  This is a convenience function that simply calls {@link sap.AuthProxy#sendRequest}
 * with "GET" as the method and null for the request body.  All given parameters are passed as-is to sap.AuthProxy.sendRequest.
 * The success callback is invoked upon any response from the server.  Even responses not generally considered to be
 * successful (such as 404 or 500 status codes) will result in the success callback being invoked. The error callback
 * is reserved for problems that prevent the AuthProxy from creating the request or contacting the server.  It is, therefore,
 * important to always check the status property on the object given to the success callback.
 * @param {string} url The URL against which to make the request.
 * @param {Object} header HTTP header to send to the server. This is an Object. Can be null.
 * @param {sap.AuthProxy~successCallback} successCB Callback method invoked upon a response from the server.
 * @param {sap.AuthProxy~errorCallback} errorCB Callback method invoked in case of failure.
 * @param {string} [user] User ID for basic authentication.
 * @param {string} [password] User password for basic authentication.
 * @param {number} [timeout] Timeout setting in seconds.  Default timeout is 60 seconds.  A value of 0 means there is no timeout.
 * @param {Object} [certSource] Certificate description object. It can be one of {@link sap.AuthProxy#CertificateFromFile},
 * {@link sap.AuthProxy#CertificateFromStore}, or {@link sap.AuthProxy#CertificateFromLogonManager}.
 * @return {function} A JavaScript function object to abort the operation.  Calling the abort function results in neither the success or error
 * callback being invoked for the original request (excepting the case where the success or error callback was invoked before calling the
 * abort functino).  Note that the request itself cannot be unsent, and the server will still receive the request - the JavaScript will just
 * not know the results of that request.
 * @example
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     if (serverResponse.responseText){
 *         alert("Response: " + JSON.stringify(serverResponse.responseText));
 *     }
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 *
 * // To send a GET request to server, call the method
 * var abortFunction = sap.AuthProxy.get("http://www.example.com", null, successCB, errorCB);
 *
 * // An example of aborting the request
 * abortFunction();
 *
 * // To send a GET request to the server with headers, call the method
 * sap.AuthProxy.get("http://www.example.com", {HeaderName : "Header value"}, successCB, errorCB);
 *
 * // To send a GET request to the server with basic authentication, call the method
 * sap.AuthProxy.get("https://www.example.com", headers, successCB, errorCB, "username", "password");
 *
 * // To send a GET request to the server with mutual authentication, call the method
 * sap.AuthProxy.get("https://www.example.com", headers, successCB, errorCB, null, null, 0, 
 *     new sap.AuthProxy.CertificateFromLogonManager("theAppId"));
 */
AuthProxy.prototype.get = function (url, header, successCB, errorCB, user, password, timeout, certSource) {
    return this.sendRequest("GET", url, header, null, successCB, errorCB, user, password, timeout, certSource);
};

/**
 * Delete a cached certificate from the keychain. iOS clients always checks the cached certificate first to see if it is available before 
 * loading the certificate from the file system. If the cached certificate is no longer valid, use this method to delete it from the keychain.
 * <br/><b>Only supported on iOS platform, NOT Android.</b> 
 * @param {sap.AuthProxy~deleteCertificateSuccessCallback} successCB Callback method upon success.
 * @param {sap.AuthProxy~errorCallback} [errorCB] Callback method upon failure.
 * @param {string} certificateKey The key of the certificate to be deleted.
 * @example
 * var successCB = function(){
 *     alert("certificate successfully deleted.");
 * }
 * var errorCB = function(error){
 *     alert("error deleting certificate: " + JSON.stringify(error));
 * }
 * sap.AuthProxy.deleteCertificateFromStore(successCB, errorCB, "certificateKeyToDelete");
 */
AuthProxy.prototype.deleteCertificateFromStore = function (successCB, errorCB, certificateKey) {
    cordova.exec(successCB, errorCB, "AuthProxy", "deleteCertificateFromStore", [certificateKey]);
};

/**
 * @private
 */
 
var Client2 = function (method, url, header, requestBody, successCB, errorCB, timeout, authConfig, forCheckReachability) {

    //ios plugin parameter does not support object type, convert Header and CertSource to JSON string
    if (device.platform === "iOS" || (device.platform && device.platform.indexOf("iP") === 0)) {
        if (header) {
            header = JSON.stringify(header);
        }
        if (authConfig) {
            authConfig = JSON.stringify(authConfig);
        }
    }

    this.Method = method;
    this.Url = url;
    this.Header = header;
    this.RequestBody = requestBody;
    this.SuccessCB = successCB;
    this.ErrorCB = errorCB;
    this.Timeout = timeout;
    this.authConfig = authConfig;
    this.IsAbort = false;
    this.forCheckReachability = forCheckReachability;

    this.abort = function () {
        this.IsAbort = true;
    };


    this.send = function () {

        var args = [this.Method, this.Url, this.Header, this.RequestBody, this.Timeout, this.authConfig, this.forCheckReachability];

        var me = this;

        var successCallBack = function (data) {
            if (me.IsAbort === true) {
                return;
            }

            successCB(data);
        };

        var errorCallBack = function (data) {
            if (me.IsAbort === true) {
                return;
            }

            errorCB(data);
        };

        exec(successCallBack, errorCallBack, "AuthProxy", "sendRequest2", args);

        return this.abort;
    };
};


var Client = function (method, url, header, requestBody, successCB, errorCB, user, password, timeout, certSource) {

    //ios plugin parameter does not support object type, convert Header and CertSource to JSON string
    if (device.platform === "iOS" || (device.platform && device.platform.indexOf("iP") === 0)) {
        if (header) {
            header = JSON.stringify(header);
        }
        if (certSource) {
            certSource = JSON.stringify(certSource);
        }
    }

    this.Method = method;
    this.Url = url;
    this.Header = header;
    this.RequestBody = requestBody;
    this.SuccessCB = successCB;
    this.ErrorCB = errorCB;
    this.User = user;
    this.Password = password;
    this.Timeout = timeout;
    this.CertSource = certSource;
    this.IsAbort = false;

    this.abort = function () {
        this.IsAbort = true;
    };


    this.send = function () {

        var args = [this.Method, this.Url, this.Header, this.RequestBody, this.User, this.Password, this.Timeout, this.CertSource];

        var me = this;

        var successCallBack = function (data) {
            if (me.IsAbort === true) {
                return;
            }

            successCB(data);
        };

        var errorCallBack = function (data) {
            if (me.IsAbort === true) {
                return;
            }

            errorCB(data);
        };

        exec(successCallBack, errorCallBack, "AuthProxy", "sendRequest", args);

        return this.abort;
    };
};

/**
 * Generates an OData client that uses the AuthProxy plugin to make requests.  This is useful if you are using Datajs, but want
 * to make use of the certificate features of AuthProxy.  Datajs is a javascript library useful for accessing OData services.
 * Datajs has a concept of an HttpClient, which does the work of making the request.  This function generates an HttpClient that
 * you can specify to Datajs so you can provide client certificates for requests.  If you want to use the generated HTTP client
 * for all future Datajs requests, you can do that by setting the OData.defaultHttpClient property to the return value of this
 * function.  Once that is done, then doing OData stuff with Datajs is almost exactly the same, but you can add a
 * certificateSource to a request.
 * @example
 * OData.defaultHttpClient = sap.AuthProxy.generateODataHttpClient();
 *
 * // Using a certificate from file, for example.
 * fileCert = new sap.AuthProxy.CertificateFromFile("mnt/sdcard/cert.p12", "password", "certKey");
 *
 * // This is the same request object you would have created if you were just using Datajs, but now
 * // you can add the extra 'certificateSource' property.
 * var createRequest = {
 *     requestUri: "http://www.example.com/stuff/etc/example.svc",
 *     certificateSource : fileCert,
 *     user : "username",
 *     password : "password",
 *     method : "POST",
 *     data:
 *     {
 *          Description: "Created Record",
 *          CategoryName: "Created Category"
 *     }
 * }
 *
 * // Use Datajs to send the request.
 * OData.request( createRequest, successCallback, failureCallback );
 * 
 */
AuthProxy.prototype.generateODataHttpClient = function () {
   var httpClient = {
        request: function (request, success, error) {
            var url, requestHeaders, requestBody, statusCode, statusText, responseHeaders;
            var responseBody, requestTimeout, requestUserName, requestPassword, requestCertificate;
            var client, result;

            url = request.requestUri;
            requestHeaders = request.headers;
            requestBody = request.body;

            var successCB = function (data) {
                var response = {
                    requestUri: url,
                    statusCode: data.status,
                    statusText: data.status,
                    headers: data.headers,
                    body: (data.responseText ? data.responseText : data.responseBase64)
                };

                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    if (success) {
                        success(response);
                    }
                } else {
                    if (error) {
                        error({
                            message: "HTTP request failed",
                            request: request,
                            response: response
                        });
                    }
                }
            };

            var errorCB = function (data) {
                if (error) {
                    error({
                        message: data
                    });
                }
            };

            if (request.timeoutMS) {
                requestTimeout = request.timeoutMS / 1000;
            }

            if (request.certificateSource) {
                requestCertificate = request.certificateSource;
            }

            if (request.user) {
                requestUserName = request.user;
            }

            if (request.password) {
                requestPassword = request.password;
            }

            client = AuthProxy.prototype.sendRequest(request.method || "GET", url, requestHeaders, requestBody, successCB, errorCB, requestUserName, requestPassword, requestTimeout, requestCertificate);

            result = {};
            result.abort = function () {
                client.abort();

                if (error) {
                    error({
                        message: "Request aborted"
                    });
                }
            };
            return result;
        }
    };
    return httpClient;
};

AuthProxy.prototype.addLogonCookiesToWebview = function(successCallback, errorCallback, url) {
	// The native function should only be invoked on Android
	if (device.platform.toLowerCase().indexOf("android") >= 0) {
		exec(successCallback, errorCallback, "AuthProxy", "putLogonCookiesIntoWebview", [url]);
	} else {
		// The cookies are handled properly on iOS without calling this function, so call the success callback anyway.
		successCallback();
	}
}

AuthProxy.prototype.getSAMLCookiesFromWebview = function(successCallback, errorCallback, url) {
	// The native function should only be invoked on Android
	if (device.platform.toLowerCase().indexOf("android") >= 0) {
		exec(successCallback, errorCallback, "AuthProxy", "getSAMLCookiesFromWebview", [url]);
	} else {
		// This function is only needed on Android.  If it is called on another
		// platform that means something went wrong.
		errorCallback();
	}
}

AuthProxy.prototype.doSAMLAuthenticationInWebview = function(endpoint, endpointParam) {
	var ref = window.open(endpoint, '_blank', 'location=no,toolbar=no');
	var returnedResultToNative = false;
	var checkForSuccess = function(event){
		if(event.url.indexOf(endpointParam)>=0){
			ref.close();
			returnedResultToNative = true;
			// No need for callback functions for this.
			exec(function(){}, function(){}, "AuthProxy", "samlAuthenticationComplete", [endpointParam, true]);
		}
	};
	var exitListener = function(event){
		// If the IAB is closing and authentication hasn't succeeded already, then it has failed.
		if(!returnedResultToNative){
			exec(function(){}, function(){}, "AuthProxy", "samlAuthenticationComplete", [endpointParam, false]);
		}
	};
	ref.addEventListener('loadstop', checkForSuccess);
	ref.addEventListener('loadstart', checkForSuccess);
	ref.addEventListener('exit', exitListener);
}

/**
 * This function adds host name of the given url to a list of hostnames for which the AuthProxy
 * will convert all requests to HTTPS (if AuthProxy is intercepting all requests).  This is
 * necessary only on Android when the SAPKapselHandleHttpRequests feature is enabled.  If HTTPS
 * requests are made when that feature is enabled without calling this function first, the
 * request will fail.
 * @param {sap.AuthProxy~successCallback} successCB Callback method upon success.
 * @param {sap.AuthProxy~errorCallback} errorCB Callback method upon failure.
 * @param {string} url A valid URL that contains the host name for which all requests should
 * be converted to HTTPS.
 * @example
 * var successCB = function(){
 *     alert("HTTPS conversion host successfully added.");
 * }
 * var errorCB = function(error){
 *     alert("error adding HTTPS conversion host: " + JSON.stringify(error));
 * }
 * sap.AuthProxy.addHTTPSConversionHost(successCB, errorCB, "https://someHost.com");
 */
AuthProxy.prototype.addHTTPSConversionHost = function(successCallback, errorCallback, url) {
    var internalSuccessCallback = function(){
        AuthProxy.prototype.conversionHostList.push(extractHostFromUrl(url));
        successCallback.apply(this, arguments);
    }
    // The native function should only be invoked on Android
    if (device.platform.toLowerCase().indexOf("android") >= 0) {
        exec(internalSuccessCallback, errorCallback, "AuthProxy", "addHttpsConversionHostUrl", [url]);
    } else {
        // This function is only needed on Android.  If it is called on another
        // platform that means something went wrong.
        errorCallback();
    }
}

// maintain a list of HTTPS conversion hosts in javascript so they can be
// accessed without needing the asynchronous cordova bridge.
AuthProxy.prototype.conversionHostList = [];

AuthProxy.prototype.isHttpsConversionHost = function(url) {
    // The HTTPS conversion host list is only needed on Android.
    if (device.platform.toLowerCase().indexOf("android") >= 0) {
        return AuthProxy.prototype.conversionHostList.indexOf(extractHostFromUrl(url)) >= 0;
    } else {
        return false;
    }
}

// Get any HTTPS conversion hosts from Android native side.
document.addEventListener("deviceready", function() {
    if (device.platform.toLowerCase().indexOf("android") >= 0) {
        var internalSuccessCallback = function(conversionHosts){
            for( var i = 0; i<conversionHosts.length; i++) {
                sap.AuthProxy.conversionHostList.push(conversionHosts[i]);
            }
        }
        exec(internalSuccessCallback, function(){}, "AuthProxy", "getHttpsConversionHosts", []);

        // If AuthProxy is intercepting requests, override XMLHttpRequest so that we can
        // change https requests to http requests.  The requests will be converted back
        // to https by AuthProxy before they are sent because the host is on the https
        // conversion list.
        sap.AuthProxy.isInterceptingRequests( function(isIntercepting) {
            if (isIntercepting) {
                var originalOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(){
                    if (arguments.length >= 2){
                        var url = arguments[1];
                        if (url.toLowerCase().indexOf("https") == 0) {
                            if (sap.AuthProxy.isHttpsConversionHost(url)) {
                                url = "http" + url.substring("https".length);
                                arguments[1] = url;
                            }
                        }
                    }
                    originalOpen.apply(this,arguments);
                };
            }
        }, function(){});
    }
});

// Helper function that uses DOM to extract the Host from a url.
var extractHostFromUrl = function(urlString) {
    var aElement = document.createElement("a");
    aElement.href = urlString;
    return aElement.hostname;
}

// This function returns 1 if AuthProxy is intercepting requests, and 0 otherwise.
// If notify is true, then if authProxy is intercepting requests the
// ProxyChangeListener will be notified. This is necessary if AuthProxy started
// intercepting before the inAppBrowser is launched.
// Only implemented on Android.
AuthProxy.prototype.isInterceptingRequests = function(successCallback, errorCallback, notify) {
    // The native function should only be invoked on Android
    if (device.platform.toLowerCase().indexOf("android") >= 0) {
        // normalize the boolean.
        var notifyProxy = notify ? true : false;
        exec(successCallback, errorCallback, "AuthProxy", "isInterceptingRequests", [notifyProxy]);
    } else {
        // This function is only implemented on Android.  If it is called on another
        // platform that means something went wrong.
        errorCallback();
    }
}

// Sometimes it is necessary to know whether AuthProxy is intercepting synchronously.
// The _isRedirectingRequestsAndroid variable is updated from the Android native code
// when it starts or stops intercepting.
AuthProxy.prototype._isRedirectingRequestsAndroid = false;
AuthProxy.prototype.isRedirectingRequestsSync = function() {
    return sap.AuthProxy._isRedirectingRequestsAndroid;
}

// Only implemented on Android.
AuthProxy.prototype.stopIntercepting = function(successCallback, errorCallback) {
    // The native function should only be invoked on Android
    if (device.platform.toLowerCase().indexOf("android") >= 0) {
        exec(successCallback, errorCallback, "AuthProxy", "stopIntercepting", []);
    } else {
        // This function is only implemented on Android.  If it is called on another
        // platform that means something went wrong.
        errorCallback();
    }
}

// Only implemented on Android.
AuthProxy.prototype.startIntercepting = function(successCallback, errorCallback) {
    // The native function should only be invoked on Android
    if (device.platform.toLowerCase().indexOf("android") >= 0) {
        exec(successCallback, errorCallback, "AuthProxy", "startInterceptingIfNeeded", []);
    } else {
        // This function is only implemented on Android.  If it is called on another
        // platform that means something went wrong.
        errorCallback();
    }
}

var AuthProxyPlugin = new AuthProxy();

module.exports = AuthProxyPlugin;


/**
 * Callback function that is invoked in case of an error.
 *
 * @callback sap.AuthProxy~errorCallback
 *
 * @param {Object} errorObject An object containing two properties: 'errorCode' and 'description.'
 * The 'errorCode' property corresponds to one of the {@link sap.AuthProxy} constants.  The 'description'
 * property is a string with more detailed information of what went wrong.
 *
 * @example
 * function errorCallback(errCode) {
 *    //Set the default error message. Used if an invalid code is passed to the
 *    //function (just in case) but also to cover the
 *    //sap.AuthProxy.ERR_UNKNOWN case as well.
 *    var msg = "Unkown Error";
 *    switch (errCode) {
 *       case sap.AuthProxy.ERR_INVALID_PARAMETER_VALUE:
 *          msg = "Invalid parameter passed to method";
 *          break;
 *       case sap.AuthProxy.ERR_MISSING_PARAMETER:
 *          msg = "A required parameter was missing";
 *          break;
 *       case sap.AuthProxy.ERR_HTTP_TIMEOUT:
 *          msg = "The request timed out";
 *          break;
 *    };
 *    //Write the error to the log
 *    console.error(msg);
 *    //Let the user know what happened
 *    navigator.notification.alert(msg, null, "AuthProxy Error", "OK");
 * };
 */

/**
 * Callback function that is invoked upon a response from the server.
 *
 * @callback sap.AuthProxy~successCallback
 *
 * @param {Object} serverResponse An object containing the response from the server.  Contains a 'headers' property,
 * a 'status' property, and a 'responseText' property.<br/>
 * 'headers' is an object containing all the headers in the response.<br/>
 * 'status' is an integer corresponding to the HTTP status code of the response.  It is important to check the status of
 * the response, since <b>this success callback is invoked upon any response from the server</b> - including responses that are
 * not normally thought of as successes (for example, the status code could be 404 or 500).<br/>
 * 'responseText' is a string containing the body of the response.
 */

/**
 * Callback function that is invoked upon successfully deleting a certificate from the store.
 *
 * @callback sap.AuthProxy~deleteCertificateSuccessCallback
 */
