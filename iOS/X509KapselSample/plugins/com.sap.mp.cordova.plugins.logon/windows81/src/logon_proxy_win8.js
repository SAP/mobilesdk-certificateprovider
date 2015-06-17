var appId, context;
var noSMPRegistration = false;
var NULL_STRING = "%[NULL]%";
var samlUrl = NULL_STRING;

var transformNull = function (param) {
    if (param == null) {
        return NULL_STRING;
    }
    return param;
};

module.exports = {


    /*
     return exec(
                       function(certificateSet){
                       successCallback(certificateSet);
                       },
                       function(error){
                       errorCallback(error);
                       },
                       "MAFLogonCoreCDVPluginJS",c:\workspaces\smpkapsel\dev\poc\logonpoc\platforms\dependencies\drop3_univlibs_patch1\smp_sdk_onboarding\dev\logoncorejs\logoncore.cs
                       initMethod,
                       [applicationId, credentialProviderID]);
   */
    initWithSecureStoreId: function (success, fail, args) {
        // pass the certificateSet
        // Called to initialize the DataVault without SMP registration.
        appId = args[0];
        noSMPRegistration = true;
        SAP.Logon.LogonCore.initSecureStore(
            function (s) {
                // does not return a json value.
                success(s);
            }, function (error) {
                fail(error);
            },
        appId);
    },
    initWithApplicationId: function (success, fail, args) {
        // Called to initialize Logon plugin using SMP reg.
        appId = args[0];
        SAP.Logon.LogonCore.initWithApplicationId(function (msg) {
            var result = false;
            if (msg == "true") {
                result = true;
            }
            // does not return a json value.
            success(true);
        }, function (msg) {
            fail(JSON.parse(msg));
        },
        appId);
    },

    registerWithContext: function (success, fail, args) {
        context = args[0];
        var jsonContext = JSON.parse(context);
        samlUrl = jsonContext.samlEndpointUrl;

        if (samlUrl == null || samlUrl === "undefined") {
            samlUrl = NULL_STRING;
        }

        SAP.Logon.LogonCore.registerUserWithContext(
            function (s) {
                var result = JSON.parse(s);
                success(result);
            },
            function (s) {
                fail(JSON.parse(s));
            },
            context,
            samlUrl
        );
    },
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
    getState: function (success, fail, args) {
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.getStateNoSMP(
                function (result) {
                    success(JSON.parse(result));
                },
                function (error) {
                    fail(JSON.parse(error));
                });

        }
        else {

            SAP.Logon.LogonCore.getState(
                function (result) {
                    success(JSON.parse(result));
                },
                function (s) {
                    fail(JSON.parse(s));
                }
            );
        }

    },
    getContext: function (success, fail, args) {
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.getStateAndContextNoSMP(
                function (result) {
                    success(JSON.parse(result));
                },
                function (error) {
                    fail(JSON.parse(error));
                });

        }
        else {
            SAP.Logon.LogonCore.getContext(
               function (result) {
                   success(JSON.parse(result));
               },
               function (s) {
                   fail(JSON.parse(s));
               }
           );
        }
    },
    /*
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
                       */
    persistRegistration: function (success, fail, args) {
        // args[0] is a json string that includes the passcode. 
        // so we dont need to do the conversion.
        var passcode = args[0];
        // call datavault to store the data.
        SAP.Logon.LogonCore.persistRegistration(
            function (stateAndContext) {
                var result = JSON.parse(stateAndContext);
                success(result);
            },
            function (s) {
                fail(JSON.parse(s));
            },
        passcode);

    },
    deleteRegistration: function (success, fail, args) {
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.deleteSecureStore(
                function (stateAndContext) {
                    noSMPRegistration = false; // reset to original state.
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }
           );
        }
        else {
            SAP.Logon.LogonCore.deleteRegistration(
                function (stateAndContext) {
                    noSMPRegistration = false; // reset to original state.
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (s) {
                    fail(JSON.parse(s));
                },
				samlUrl 
            );
        }
    },
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
    createSecureStore: function (success, fail, args) {
        SAP.Logon.LogonCore.createSecureStore(
            function (stateAndContextStr) {
                var state = JSON.parse(stateAndContextStr);
                success(state);
            },
            function (error) {
                fail(JSON.parse(error));
            },
        appId, args[0]);
    },

    lockSecureStore: function (success, fail, args) {
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.lockSecureStoreNoSMP(
               function (resultStr) {
                   var result = JSON.parse(resultStr);
                   success(result);
               },
               function (error) {
                   fail(JSON.parse(error));
               }
          );
        }
        else {
            SAP.Logon.LogonCore.lockSecureStore(
                function (resultStr) {
                    var result = JSON.parse(resultStr);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }
           );
        }
    },

    unlockSecureStore: function (success, fail, args) {
        var code = transformNull(args[0]);
        var passcode =
            {
                "unlockPasscode": code
            }


        if (noSMPRegistration) {
            SAP.Logon.LogonCore.unlockSecureStoreNoSMP(
               function (resultStr) {
                   var result = JSON.parse(resultStr);
                   success(result);
               },
               function (error) {
                   fail(JSON.parse(error));
               },
              JSON.stringify(passcode)
          );
        }
        else {
            SAP.Logon.LogonCore.unlockSecureStore(
                function (resultStr) {
                    var result = JSON.parse(resultStr);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }, JSON.stringify(passcode)
           );
        }
    },

    setSecureStoreObject: function (success, fail, args) {
        var key = args[0];
        var value = args[1];

        if (noSMPRegistration) {
            SAP.Logon.LogonCore.setSecureStoreObjectNoSMP(
                function (result) {
                    //does not return a json value.
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                key, value);
        }
        else {
            SAP.Logon.LogonCore.setSecureStoreObject(
                function (result) {
                    // does not return a json value.
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                key, value);
        }

    },

    getSecureStoreObject: function (success, fail, args) {
        var key = args[0];
        var value = args[1];

        if (noSMPRegistration) {
            SAP.Logon.LogonCore.getSecureStoreObjectNoSMP(
                function (value) {
                    // null value cannot be passed from a WinRT component. 
                    // so disguise the null value as a known string and convert to null.
                    if (value === NULL_STRING) {
                        value = null;
                    }
                    // does not return a json value.
                    success(value);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                key);
        }
        else {
            SAP.Logon.LogonCore.getSecureStoreObject(
               function (value) {
                   // null value cannot be passed from a WinRT component. 
                   // so disguise the null value as a known string and convert to null.
                   if (value === NULL_STRING) {
                       value = null;
                   }

                   // does not return json.
                   success(value);
               },
               function (error) {
                   fail(JSON.parse(error));
               },
               key);
        }
    },

    skipClientHub: function (success, fail) {
        // TODO: Implement when logoncore support this method.
        // MAFLogonCoreCDVPlugin.logonCore.skipSSOPasscode();

        success(true);
    },

    /*
    Checks if the application is already registered.
    */
    isRegistered: function (successCallback, errorCallback, args) {
        var appId = args[0];
        SAP.Logon.LogonCore.isRegisteredWithAppId(
            function (result) {
                if (typeof result === 'boolean') {
                    successCallback(result);
                }
                else {
                    successCallback(false);
                }
            },
            function (errorObject) {
                errorCallback(JSON.parse(errorObject));
            }, 
            appId
        );
    },
    /*
 
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
    */

    changePasscode: function (success, fail, args) {
        var oldPasscode = transformNull(args[0]);
        var newPasscode = transformNull(args[1]);



        if (noSMPRegistration) {
            SAP.Logon.LogonCore.changePasscodeNoSMP(
                function (stateAndContext) {
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                oldPasscode, newPasscode);
        }
        else {
            SAP.Logon.LogonCore.changePasscode(
                function (stateAndContext) {
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                oldPasscode, newPasscode);
        }
    },
    /*
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
    */
    changePassword: function (success, fail, newPassword) {

        SAP.Logon.LogonCore.changePassword(
            function (stateAndContext) {
                var result = JSON.parse(stateAndContext);
                success(result);
            },
            function (error) {
                fail(JSON.parse(error));
            },
            newPassword);
    },
    reset: function (success, fail) {
        if (samlUrl && samlUrl != NULL_STRING) {
            var resourceAddress = new Windows.Foundation.Uri(samlUrl);
            var filter = new Windows.Web.Http.Filters.HttpBaseProtocolFilter();
            var cookieCollection = filter.cookieManager.getCookies(resourceAddress);

            cookieCollection.forEach(function (value, index, traversedObject) {
                filter.cookieManager.deleteCookie(value);
            });
        }

    	// Reset application settings (the key is used by the apppreferences plugins)
        if (Windows.Storage.ApplicationData.current.localSettings.containers.hasKey('com.sap.mp.settings')) {
        	Windows.Storage.ApplicationData.current.localSettings.deleteContainer('com.sap.mp.settings');
        }

        success && success();
    },
    onEvent: function (success, fail, args) {
        var eventId = args[0];
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.onEventNoSMP(
                function (stateAndContext) {
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }, eventId
             );
        }
        else {
            // smp registration
            SAP.Logon.LogonCore.onEvent(
                function (stateAndContext) {
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }, eventId
             );
        }
        
    }
};

// This should be the service name used in cordova exec that this class is proxying. 
require("cordova/windows8/commandProxy").add("MAFLogonCoreCDVPluginJS", module.exports);