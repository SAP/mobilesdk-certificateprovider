        var exec = require('cordova/exec');
		var initialized = false;
	    
		/*
		* Handle the background event
		*/
		document.addEventListener("pause", 
			function(){
				onEvent(
					function() {
						console.log("MAFLogonCoreCDVPlugin: Pause event successfully set.");
					},
					function() {
						console.log("MAFLogonCoreCDVPlugin: Pause event could not be set.");
					},
					"PAUSE"
				);
			}, 
			false);
	
               
               /**
                * Method for initializing the logonCore component.
                * @param successCallback: this method will be called back if initialization succeeds with parameter logoncontext;
                * @param errorCallback: this method will be called back if initialization fails with parameter error
                *   Error structure:
                *       "errorCode":
                *       "errorMessage":
                *       "errorDomain":
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *        -  1 (init failed)
                * @param applicationId: the application to be registered
                */
               var initLogon = function(successCallback, errorCallback, applicationId, credentialProviderID, bIsODataRegistration, passcodePolicy, passcode) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in initLogon:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               var initMethod;
               if (bIsODataRegistration){
                  initMethod = "initWithSecureStoreId";
               }
               else{
                  initMethod = "initWithApplicationId";
               }
               
			   //set to null if the provider is empty string or undefined, so native side needs not to validate all cases.
               if (!credentialProviderID){
                    credentialProviderID = null;
               }
               
               return exec(
                           function(certificateSet){
                           initialized = true;
                           successCallback(certificateSet);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           initMethod,
                           [applicationId, credentialProviderID, passcodePolicy, passcode]);
               };
               
               /**
                * Method for reading the state of logonCore.
                * @param successCallback: this method will be called back if read succeeds with parameter state
                *      state consists of the following fields:
                *          "applicationId":
                *          "status": new / registered / fullRegistered
                *          "secureStoreOpen":
                *          "defaultPasscodeUsed":
                *          "stateClientHub": notAvailable / skipped / availableNoSSOPin / availableInvalidSSOPin / availableValidSSOPin / error
                *          "stateAfaria": initializationNotStarted / initializationInProgress / initializationFailed / initializationSuccessful / credentialNeeded
				*	   	   "isAfariaCredentialsProvided":
                * @param errorCallback: this method will be called back if initialization fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                */
               var getState = function(successCallback, errorCallback) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in getState:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                           successCallback(success);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "getState",
                           []);
               };
               
               /**
                * Method for reading the context of logonCore.
                * @param successCallback: this method will be called back if read succeeds with parameter context and state
                * @param errorCallback: this method will be called back if initialization fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       -2 (plugin not initialized)
                *
                * Context structure contains the following fields:
                * "registrationContext": {
                *       "serverHost": Host of the server.
                *       "domain": Domain for server. Can be used in case of SMP communication.
                *       "resourcePath": Resource path on the server. The path is used mainly for path based reverse proxy but can contains custom relay server path as well.
                *       "https": Marks whether the server should be accessed in a secure way.
                *       "serverPort": Port of the server.
                *       "user": Username in the backend.
                *       "password": Password for the backend user.
                *       "farmId": FarmId of the server. Can be nil. Used in case of Relay server or SitMinder.
                *       "communicatorId": Id of the communicator manager which will be used for performing the logon. Possible values: IMO / GATEWAY / REST
                *       "securityConfig": Security configuration. If nil the default configuration will be used.
                *       "mobileUser": Mobile User. Used in case of IMO manual user creation.
                *       "activationCode": Activation Code. Used in case of IMO manual user creation.
                *       "gatewayClient": The key string which identifies the client on the gateway. Used in Gateway only registration mode. The value will be used as adding the parameter: sap-client=<gateway client>
                *       "gatewayPingPath": The custom path of the ping url on the gateway. Used in case of Gateway only registration mode.
                * }
                * "applicationEndpointURL": Contains the application endpoint url after a successful registration.
                * "applicationConnectionId": Id get after a successful SUP REST registration. Needed to be set in the download request header with key X-SUP-APPCID
                * "afariaRegistration": manual / automatic / certificate
                * "policyContext": Contains the password policy for the secure store {
                *      "alwaysOn":
                *      "alwaysOff":
                *      "defaultOn":
                *      "hasDigits":
                *      "hasLowerCaseLetters":
                *      "hasSpecialLetters":
                *      "hasUpperCaseLetters":
                *      "defaultAllowed":
                *      "expirationDays":
                *      "lockTimeout":
                *      "minLength":
                *      "minUniqueChars":
                *      "retryLimit":
                * }
                * "registrationReadOnly": specifies whether context values are coming from clientHub / afaria
                * "policyReadOnly": specifies whether passcode policy is coming from afaria
                * "credentialsByClientHub": specifies whether credentials are coming from clientHub
                *
                *
                */
               var getContext = function(successCallback, errorCallback) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in getContext:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                           successCallback(success.context, success.state);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "getContext",
                           []);
               };

               /**
                * Method for setting the UserCreationPolicy on the Logon Core.
                * This method is intended to be used to force registration
                * with a client certificate.  This method must be called before
                * initLogon to have any effect.
                */
               var setUserCreationPolicy = function(successCallback, errorCallback, userCreationPolicy, appId, registrationContext, certificateProviderID) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in setUserCreationPolicy:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                               if (success){
                           			successCallback(success.context, success.state);
							   }
							   else{
								   successCallback();
							   }
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "setUserCreationPolicy",
                           [userCreationPolicy, appId, registrationContext, certificateProviderID]);
               };

               /**
                * Method determining whether the app is registered before
                * calling initLogon.  This method is necessary because
                * setUserCreationPolicy must be called before initLogon,
                * so we need some information available before initLogon
                * is called.
                */
               var isRegistered = function(successCallback, errorCallback, appId) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in isRegistered:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                           successCallback(success);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "isRegistered",
                           [appId]);
               };
               
               
                /**
                * Method determining whether the app is registered before
                * calling initLogon.  This method is necessary because
                * setUserCreationPolicy must be called before initLogon,
                * so we need some information available before initLogon
                * is called.
                */
               var hasSecureStore = function(successCallback, errorCallback, appId) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
                   throw ('Invalid parameters in isRegistered:' +
                          '\nsuccessCallback: ' + typeof successCallback +
                          '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                           successCallback(success);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "hasSecureStore",
                           [appId]);
               };

               /**
                * Method for registering user.
                * @param successCallback(context,state): this method will be called back if registration succeeds with parameters context and state;
                * @param errorCallback: this method will be called back if registration fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param context: the context which includes registration parameters as described in getContext method.
                */
               var startRegistration = function(successCallback, errorCallback, context) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof context !== 'object') {
               throw ('Invalid parameters in startRegistration:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback +
                      '\ncontext: ' + typeof context);
               }
               
               var input = JSON.stringify(context);
               
               return exec(
                           function(success){
                           successCallback(success.context, success.state);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "registerWithContext",
                           [input]);
               };
               
               /**
                * Method for cancelling the registration.
                * @param successCallback(context,state): this method will be called back if cancelling succeeds with parameters context and state;
                * @param errorCallback: this method will be called back if cancelling fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                */
               var cancelRegistration = function(successCallback, errorCallback) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in cancelRegistration:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                           successCallback(success.context, success.state);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "cancelRegistration",
                           []);
               };
               
               
                  /**
                * Method for creating the secure store.
                * @param successCallback(context,state): this method will be called back if persisting succeeds with parameters context and state;
                * @param errorCallback: this method will be called back if persisting fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param param: an object which must contain the field "passcode" for the store to be created. 
                * Optional field "policyContext" containing the passcode policy parameters described in method getContext.
                */
               var createSecureStore = function(successCallback, errorCallback, param) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
               throw ('Invalid parameters in createSecureStore:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback +
                      '\nparam: ' + typeof param);
               }
               
               var JSONLogonContext = JSON.stringify(param);
               
               return exec(
                           function(success){
                           successCallback(success.context, success.state);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "createSecureStore",
                           [JSONLogonContext]);
               };

               
               /**
                * Method for persisting the registration. Persisting will create the secure store and store the context.
                * @param successCallback(context,state): this method will be called back if persisting succeeds with parameters context and state;
                * @param errorCallback: this method will be called back if persisting fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param param: an object which must contain the field "passcode" for the store to be created. 
                * Optional field "policyContext" containing the passcode policy parameters described in method getContext.
                */
               var persistRegistration = function(successCallback, errorCallback, param) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
               throw ('Invalid parameters in persistRegistration:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback +
                      '\nparam: ' + typeof param);
               }
               
               var JSONLogonContext = JSON.stringify(param);
               
               return exec(
                           function(success){
                           successCallback(success.context, success.state);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "persistRegistration",
                           [JSONLogonContext]);
               };
               
               /**
                * Method for deleting the registration. It will reset the client and remove the user from the SUP server.
                * @param successCallback(context,state): this method will be called back if deletion succeeds with parameters context and state;
                * @param errorCallback: this method will be called back if persisting fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                */
               var deleteRegistration = function(successCallback, errorCallback) {
               
                    var doTheDelete = function() {
                        if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
                        throw ('Invalid parameters in deleteRegistration:' +
                                '\nsuccessCallback: ' + typeof successCallback +
                                '\nerrorCallback: ' + typeof errorCallback);
                       }

                        return exec(
                                function(success){
                                    initialized = false;
                                    successCallback(success.context, success.state);
                                },
                                function(error){
                                    errorCallback(error);
                                },
                                "MAFLogonCoreCDVPluginJS",
                                "deleteRegistration",
                                []);
                    }
                    if (device.platform.toLowerCase().indexOf("android") >= 0) {
                        sap.AuthProxy.stopIntercepting(doTheDelete,doTheDelete);
                    } else {
                        doTheDelete();
                    }
               };
               
               /**
                * Method for changing the application passcode.
                * @param successCallback(context,state): this method will be called back if change passcode succeeds with parameters context and state;
                * @param errorCallback: this method will be called back if persisting fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param param: an object which must contain 2 key-value pairs:
                * - oldPasscode :
                * - passcode :
                */
               var changePasscode = function(successCallback, errorCallback, param) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
               throw ('Invalid parameters in changePasscode:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback +
                      '\nparam: ' + typeof param);
               }
               
               return exec(
                           function(success){
                           successCallback(success.context, success.state);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "changePasscode",
                           [param.oldPasscode, param.passcode]);
               };
               
               /**
                * Method for changing the backend password.
                * @param successCallback(context,state): this method will be called back if change password succeeds with parameters context and state;
                * @param errorCallback: this method will be called back if change password fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param param: object containing the password for key "newPassword"
                */
               var changePassword = function(successCallback, errorCallback, param) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
               throw ('Invalid parameters in changePassword:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback +
                      '\nparam: ' + typeof param);
               }
               
               return exec(
                           function(success){
                           successCallback(success.context, success.state);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "changePassword",
                           [param.newPassword]);
               };
               
               /**
                * Method for locking the secure store.
                * @param successCallback(bool): this method will be called back if locking succeeds;
                * @param errorCallback: this method will be called back if change password fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                */
               var lockSecureStore = function(successCallback, errorCallback) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in lockSecureStore:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                           successCallback(success);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "lockSecureStore",
                           []);
               };
               
               /**
                * Method for unlocking the secure store.
                * @param successCallback(context,state): this method will be called back if unlocking succeeds;
                * @param errorCallback: this method will be called back if unlocking fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                *
                * @param param: object containing the passcode for key "unlockPasscode"
                */
               var unlockSecureStore = function(successCallback, errorCallback, param) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
               throw ('Invalid parameters in unlockSecureStore:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback +
                      '\nparam: ' + typeof param);
               }
               
               return exec(
                           function(success){
                           successCallback(success.context, success.state);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "unlockSecureStore",
                           [param.unlockPasscode]);
               };
               
               /**
                * Method for getting object from the store.
                * @param successCallback(object): this method will be called back if get succeeds;
                * @param errorCallback: this method will be called back if get fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param key: the key for the object
                */
               var getSecureStoreObject = function(successCallback, errorCallback, key) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in getSecureStoreObject:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                           successCallback(JSON.parse(success));
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "getSecureStoreObject",
                           [key]);
               
               };
               
               /**
                * Method for setting object to the store.
                * @param successCallback(bool): this method will be called back if set succeeds;
                * @param errorCallback: this method will be called back if set fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param key: the key for the object to be stored
                * @param object: the object to be stored
                */
               var setSecureStoreObject = function(successCallback, errorCallback, key, object) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in setSecureStoreObject:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               var JSONObject = JSON.stringify(object);
               
               return exec(
                           function(success){
                           successCallback(success);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "setSecureStoreObject",
                           [key, JSONObject]);
               };
               
               /**
                * Method for setting clientHub sso passcode.
                * @param successCallback(context,state): this method will be called back if setting succeeds;
                * @param errorCallback: this method will be called back if update fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                * @param param: object containing the ssopasscode for key "ssoPasscode"
                */
               var setSSOPasscode = function(successCallback, errorCallback, param) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
               throw ('Invalid parameters in updateContextWithMCIM:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback +
                      '\nparam: ' + typeof param);
               }
               
               return exec(
                           function(success){
                           if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                           successCallback(success.context, success.state);
                           }
                           else{
                           successCallback(success, null);
                           }
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "setSSOPasscode",
                           [param.ssoPasscode]);
               };
               
               /**
                * Method for skipping registration through client hub.
                */
               var skipClientHub = function(successCallback, errorCallback) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in updateContextWithMCIM:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                           
                           if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                           successCallback(success.context, success.state);
                           }
                           else{
                           successCallback(success, null);
                           }
                           
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "skipClientHub",
                           []);
               };
               
               /*
                * Method for sending events.
                * @param eventId: the id of event which was fired; possible values: PAUSE, RESUME
                */
               var onEvent = function(successCallback, errorCallback, eventId) {
            	  
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in updateContextWithMCIM:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
            		   function(success){
                           
                           if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                           successCallback(success.context, success.state);
                           }
                           else{
                           successCallback(success, null);
                           }
                           
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "onEvent",
                           [eventId]);               
               };
               
               
               /*
                * Method for setting timeoutvalue
                * @param timeout: timeout in minutes; after how many seconds the dataVault should be locked if the app is in the background;
                * makes only difference in case the passcode policy is not readonly; readonly flag is part of the logonContext: policyReadOnly
                */
               var setTimeout = function(successCallback, errorCallback, timeout) {
            	   
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in updateContextWithMCIM:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
            		   function(success){
                           
                           if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                           successCallback(success.context, success.state);
                           }
                           else{
                           successCallback(success, null);
                           }
                           
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "setTimeout",
                           [timeout]); 
               };
               
               /*
                * Method for getting timeoutvalue
                * Return the timeout value in seconds 
                */
               var getTimeout = function(successCallback, errorCallback) {
            	   
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in updateContextWithMCIM:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
            		   function(success){
                           successCallback(success);
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "getTimeout",
                           []);
               };
               
               /**
                * Method for setting afaria credentials for retrieving seed data/afaria certificate
                * @param successCallback(context,state): this method will be called back with parameters context and state if afaria credential is valid;
                * @param errorCallback: this method will be called back if registration fails with parameter error
                * Possible error codes for error domains:
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param context: the context which must contain properties with following parameters:
                *       - afariaUser
                *       - afariaPassword
                */
               var setAfariaCredential = function(successCallback, errorCallback, context) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in updateContextWithMCIM:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               var input = JSON.stringify(context);
               
               return exec(
                           function(success){
                           if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                           successCallback(success.context, success.state);
                           }
                           else{
                           successCallback(success, null);
                           }                           
                           },
                           function(error){
                           errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "setAfariaCredential",
                           [input]);
               
               };
               
  
                /**
                * Method for getting certificate from third party provider
                * @param successCallback(context,state): this method will be called back with parameters context and state if getting certificate succeeds
                * @param errorCallback: this method will be called back if getting certificate fails with parameter error
                * Possible error codes for error domains: (TODO: update comment)
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param closeScreenOnReturn: the flag to indicate whether to close the UI screen after getting the result,
                *                             the default value is false.
                */
               var getCertificateFromProvider = function(successCallback, errorCallback, bForceRenew) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in updateContextWithMCIM:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                           if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                              successCallback(success.context, success.state);
                           }
                           else{
                              successCallback(success, null);
                           }
                           },
                           function(error){
                              errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "getCertificateFromProvider",
                           [bForceRenew]);
               
               };

               /**
                * Method for setting parameter for certificate provider
                * @param successCallback(context,state): this method will be called back if parameters are set properly;
                * @param errorCallback: this method will be called back if setting parameters fails
                * Possible error codes for error domains: (TODO update comment)
                *   Error domain: MAFLogonCoreCDVPlugin
                *       - 2 (plugin not initialized)
                *       - 3 (no input provided)
                * @param context: the context which must contain properties with following parameters:
                *       - afariaUser
                *       - afariaPassword
                */
               var setParametersForProvider = function(successCallback, errorCallback, parameters) {
               
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
               throw ('Invalid parameters in setParametersForProvider:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               //settings is js object
               var jsonParams = JSON.stringify(parameters);
               
               
               return exec(
                           function(success){
                              successCallback(success);
                           },
                           function(error){
                              errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "setParametersForProvider",
                           [jsonParams]);
               
               };
               
            /**
            * Method for disable or enable afaria
            * @param successCallback(context,state): this method will be called back if succeeded;
            * @param errorCallback: this method will be called back if failed
            */
           var useAfaria = function(successCallback, errorCallback, parameter) {
           
               if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
                    throw ('Invalid parameters in useAfaria:' +
                      '\nsuccessCallback: ' + typeof successCallback +
                      '\nerrorCallback: ' + typeof errorCallback);
               }
               
               return exec(
                           function(success){
                              successCallback(success);
                           },
                           function(error){
                              errorCallback(error);
                           },
                           "MAFLogonCoreCDVPluginJS",
                           "useAfaria",
                           [parameter]);
               
            };

               /**
                * Method for determining whether Logon has been initialized.
                * This method will return true if initLogon has been called,
                * and deleteRegistration has not been called since.  This
                * method will return false otherwise.
                */
               var isInitialized = function() {
                   return initialized;
               };
			   
               /**
                * Reset the application. The callback method may not be called if
                * the reset results in loading the cordova start page
                *
                * @param {Function} [successCallback]
                * @param {Function} [errorCallback]
                * @param preferenceToKeep : the preference list to keep after reset
                * @example
                * reset(
                *         function(successMsg) {alert("Succeess: " + successMsg);},
                *         function(errMsg) {alert("Error: " + errMsg);} );
                */
               var reset = function(successCallback,errorCallback, preferenceToKeep) {
                    if (preferenceToKeep){
                        var pref = JSON.stringify(preferenceToKeep);
                        exec(successCallback, errorCallback, "MAFLogonCoreCDVPluginJS","reset",[pref]);
                    }
                    else{
                        exec(successCallback, errorCallback, "MAFLogonCoreCDVPluginJS","reset",[]);
                    }
               };
               
                /**
                * Get MDM configuration. Currently only supported by ios
                *
                * @param {Function} [successCallback]
                * @param {Function} [errorCallback]
                * @example
                * getMDMConfiguration(
                *         function(config) {alert("config: " + config);},
                *         function(errMsg) {alert("Error: " + errMsg);} );
                */
               var getMDMConfiguration = function(successCallback,errorCallback) {
                    exec(successCallback, errorCallback, "MAFLogonCoreCDVPluginJS","getMDMConfiguration",[]);
               };
               
                /**
                * provision certificate, the method just provision the certificate to device, it does not set the certificate provide to logon plugin
                *
                * @param {Function} [successCallback]
                * @param {Function} [errorCallback]
                * @param providerID: the provider id for the certificate provider
                * @param bRefresh: if true, check and delete the existing certificate first
                * @param options: dictionary contains the configuration for the certificate provider

                * @example
                * provisionCertificate(
                *         function() {alert("success");},
                *         function(errMsg) {alert("Error: " + errMsg);},
                          "afaria", false, null);
                *
                */
                var provisionCertificate = function (successCallback, errorCallback, providerID, bRefresh, options) {
                    return exec( successCallback, errorCallback,
                           "MAFLogonCoreCDVPluginJS",
                           "provisionCertificate",
                           [providerID, bRefresh, options]);
                }

                /**
                * delete the stored certificate
                *
                * @param {Function} [successCallback]
                * @param {Function} [errorCallback]
                * @param providerID: the provider id for the certificate provider
         
                * @example
                * deleteStoredCertificate(
                *         function(config) {alert("config: " + config);},
                *         function(errMsg) {alert("Error: " + errMsg);},
                          "afaria");
                */
                var deleteStoredCertificate = function (successCallback, errorCallback, providerID) {
                    return exec( successCallback, errorCallback,
                           "MAFLogonCoreCDVPluginJS",
                           "deleteStoredCertificate",
                           [providerID]);

    }
               module.exports = {
               initLogon: initLogon,
               getState: getState,
               getContext: getContext,
               startRegistration: startRegistration,
               cancelRegistration: cancelRegistration,
               persistRegistration: persistRegistration,
               createSecureStore: createSecureStore,
               deleteRegistration: deleteRegistration,
               changePasscode: changePasscode,
               changePassword: changePassword,
               lockSecureStore: lockSecureStore,
               unlockSecureStore: unlockSecureStore,
               getSecureStoreObject: getSecureStoreObject,
               setSecureStoreObject: setSecureStoreObject,
               setSSOPasscode: setSSOPasscode,
               skipClientHub: skipClientHub,
               onEvent: onEvent,
               setTimeout: setTimeout,
               getTimeout: getTimeout,
               setAfariaCredential: setAfariaCredential,
               isInitialized: isInitialized,
               reset:reset,
               //credential provider method
               getCertificateFromProvider: getCertificateFromProvider,  //obsolete
               setParametersForProvider: setParametersForProvider,
               setUserCreationPolicy: setUserCreationPolicy,
               isRegistered: isRegistered,
               //new certificate provider methods for SP08
               provisionCertificate: provisionCertificate,
               deleteStoredCertificate: deleteStoredCertificate,
               hasSecureStore: hasSecureStore,
               //methods for loading configuration
               getMDMConfiguration: getMDMConfiguration,
               useAfaria: useAfaria
               };

