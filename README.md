#SAP Mobile SDK \<CertificateProvider\>

Sample implementation of the SAP Mobile SDK `<CertificateProvider>` protocol API, which can be added to an iOS or Android project to allow the SAP Logon Manager component to get x509 certificate identities from 3rd party APIs or the device file system.  The `<CertificateProvider>` protocol can be used with SAP's **Native OData framework**, and the **Kapsel SDK**.


##Introduction
Before SAP Mobile SDK 3.0 SP03, the SDK **Logon Manager** was hard-coded to call SAP Afaria API's when attempting to optain an X509Certificate for use with mutual auth against the SAP Mobile Platform server.  There was no extension point for integrating non-Afaria certificate provider options, such as SAP Partners, other MDM providers, or file-system installation.

With the standardization on Logon Manager ('Logon') as the primary reusable component for handling registration, integration with the SAP Mobile SDK's **Data Vault**, **Client Hub**, **Onboarding**, etc., it became necessary to provide this extension point for non-Afaria solutions.

The solution is a protocol interface, which can be implemented for a particular network/identity landscape, with a simple, reusable pattern.

##Release Info
The interfaces described for CertificateProvider (and Android equivalents) are released in **SDK 3.0 SP08**.  The Developer edition of the SDK can be downloaded on [store.sap.com](store.sap.com).  

See [Copyright and license](https://github.com/SAP/mobilesdk-certificateprovider#copyright-and-license) for license info for this sample implementation.

##Additional Documentation
Product Documentation can be found for these interfaces on [help.sap.com](help.sap.com) > Mobile > SAP Mobile Platform > SAP Mobile Platform SDK.

See links here for

   - [Native Android](http://help.sap.com/saphelp_smp308sdk/helpdata/en/3c/227ce642834b60a210baacc39cc7d7/content.htm)
   - [Native iOS](http://help.sap.com/saphelp_smp308sdk/helpdata/en/37/0c58b9400248a4b71ee8b407b79b07/content.htm)
   - [Kapsel iOS & Android](http://help.sap.com/saphelp_smp308sdk/helpdata/en/7c/035fab70061014a483940fd6c29742/content.htm)
   - [API reference](http://help.sap.com/saphelp_smp308sdk/helpdata/en/7c/03685c70061014bfc0ec6c6e15b454/content.htm)
   
It is recommended to review the Kapsel documentation as well as the 'Native' doc for iOS or Android, as there is signficant overlap at the native code level.

##Installation
1.  Clone to your dev machine
2.  Select one of the `CertificateProvider` implementations which is similar to your scenario, and modify to match your scenario's API's/sequence
3.  Drag the modified `CertificateProvider` implementation into your project, **with the Mobile SDK 3.0 SP08+ libraries linked**
4.  Register the `CertificateProvider` to the `LogonManager` component, using one of the following methods

    #####iOS (Native)
    Initialize the `CustomCertificateProvider`, then call the Logon API `setCertificateProvider:` to register the CertificateProvider to the Logon.
    ```objectivec
    CustomCertificateProvider *myCertificateProvider = [[CustomCertificateProvider alloc] init];
    [myLogonInstance setCertificateProvider:myCertificateProvider];
    ```
    #####Android (Native)

    #####Kapsel (JavaScript)
    Set `CustomCertificateProvider` in LogonContext's appConfig.certificate property, and call the logon `startLogonInit`.
    ```javascript
    
              function register() {
                
                var context = {
                    operation:{
                        logonView : sap.logon.IabUi
                    },
                    appConfig:{
                        appID : "com.sap.maf.test.ios.logonapp_X509M", // app id on SMP server
                        isForSMP : true,  //SMP registration
                        certificate : "CustomCertificateProvider" //the value must match the key defined in the plist file
                    },
                    // for certificate registration, the serverhost and serverPort, https configuration are required
                    smpConfig : {
                        "serverHost": "torn00461340a.amer.global.corp.sap", //Place your SMP 3.0 server name here
                        "https": "true",
                        "serverPort": "8082",
                        "communicatorId": "REST",
                        "passcode": "password",  //note hardcoding passwords and unlock passcodes are strictly for ease of use during development
                        //once set can be changed by calling sap.Logon.managePasscode()
                        "unlockPasscode": "password",
                        "passcode_CONFIRM":"password"
                    }
                };
      

          
                //registration callback methods
                var appDelegate = {};
                appDelegate.onRegistrationSuccess = function(result) {
                    alert("Successfully Registered");
                    applicationContext = result;
                }
                
                appDelegate.onRegistrationError = function(error) {   //this method is called if the user cancels the registration.
                    console.log("An error occurred:  " + JSON.stringify(error));
                    if (device.platform == "Android") {  //Not supported on iOS to exit app
                        navigator.app.exitApp();
                    }
                }
                
            
                sap.Logon.startLogonInit(context, appDelegate);
              }

##Samples Build Procedures
####X509KapselSample

The **X509KapselSample** project requires the following plugins:

 - com.sap.mp.cordova.plugins.authproxy
 - com.sap.mp.cordova.plugins.corelibs
 - com.sap.mp.cordova.plugins.logon
 - cordova-plugin-whitelist
 - org.apache.cordova.device
 - org.apache.cordova.inappbrowser
 
Add these plugins to your project with the regular CLI, before building and running.

    cordova plugin add com.sap.mp.cordova.plugins.authproxy
    // etc. ...


##Copyright and license

Copyright 2015 SAP AG

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

See also the file LICENSE.
