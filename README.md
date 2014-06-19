#SAP Mobile SDK \<CertificateProvider\>

Sample implementation of the SAP Mobile SDK `<CertificateProvider>` protocol API, which can be added to an iOS or Android project to allow the SAP Logon Manager component to get x509 certificate identities from 3rd party APIs or the device file system.  The `<CertificateProvider>` protocol can be used with SAP's **Native OData framework**, and the **Kapsel SDK**.

##Introduction
Before SAP Mobile SDK 3.0 SP03, the SDK **Logon Manager** was hard-coded to call SAP Afaria API's when attempting to optain an X509Certificate for use with mutual auth against the SAP Mobile Platform server.  There was no extension point for integrating non-Afaria certificate provider options, such as SAP Partners, other MDM providers, or file-system installation.

With the standardization on Logon Manager ('Logon') as the primary reusable component for handling registration, integration with the SAP Mobile SDK's **Data Vault**, **Client Hub**, **Onboarding**, etc., it became necessary to provide this extension point for non-Afaria solutions.

The solution is a protocol interface, which can be implemented for a particular network/identity landscape, with a simple, reusable pattern.

##Release Info
The interfaces for CertificateProvider and CertificateProviderDelegate (and Android equivalents) are released in **SDK 3.0 SP03**.  The Developer edition of the SDK can be downloaded on [store.sap.com](store.sap.com).  

See [Copyright and license](https://github.com/SAP/mobilesdk-certificateprovider#copyright-and-license) for license info for this sample implementation.

##Additional Documentation
Product Documentation can be found for these interfaces on [help.sap.com](help.sap.com) > Mobile > SAP Mobile Platform > SAP Mobile Platform SDK.

See links here for

   - [Native Android](http://help.sap.com/saphelp_smp303sdk/helpdata/en/3c/227ce642834b60a210baacc39cc7d7/content.htm)
   - [Native iOS](http://help.sap.com/saphelp_smp303sdk/helpdata/en/37/0c58b9400248a4b71ee8b407b79b07/content.htm)
   - [Kapsel iOS & Android](http://help.sap.com/saphelp_smp303sdk/helpdata/en/7c/035fab70061014a483940fd6c29742/content.htm)

It is recommended to review the Kapsel documentation as well as the 'Native' doc for iOS or Android, as there is signficant overlap at the native code level.

##Installation
1.  Clone to your dev machine
2.  Select one of the `CertificateProvider` implementations which is similar to your scenario, and modify to match your scenario's API's/sequence
3.  Drag the modified `CertificateProvider` implementation into your project, **with the Mobile SDK 3.0 SP03+ libraries linked**
4.  Register the `CertificateProvider` to the `LogonManager` component, using one of the following methods

    #####iOS (Native)
    Initialize the `CustomCertificateProvider<CertificateProvider>`, then call the Logon API `setCertificateProvider:` to register the CertificateProvider to the Logon.
    ```objectivec
    CustomCertificateProvider *myCertificateProvider = [[CustomCertificateProvider alloc] init];
    [myLogonInstance setCertificateProvider:myCertificateProvider];
    ```
    #####Android (Native)

    #####Kapsel (JavaScript)
    Register the `CustomCertificateProvider<CertificateProvider>` during the **Logon** plugin `init()` function, by passing the name of the name of the class as a string parameter.
    ```javascript
    sap.Logon.init(logonSuccessCallback, errorCallback, appId, context, 
                        sap.logon.IabUi, "<Certificate Provider Class Name>");
    ```

##Runtime Pre-Requisites
Make sure that Client Hub has been installed and activated by the end user.

Set  `UserCreationPolicy=certificate`.
The Logon component must find the key value `UserCreationPolicy=certificate`, in order to call the CertificateProvider for a certificate. A CertificateProvider could be registered to the Logon during the `Logon.init()` , but would be ignored without this value. This behavior is consistent for both Native and Kapsel SDK.

The user creation policy defines the authentication method for the user: automatic, manual or certificate. The manual and automatic methods are for the password based authentication. The certificate method is for X.509 based authentication. If no value is set, the default is certificate.

Set the `UserCreationPolicy` in the `clienthub.properties` (Android) or `clienthub.plist` (iOS).

	<!--Mandatory Settings-->
	<!--Hostname of the server, example: xyz.sap.corp-->
	Host : <string>                     //  Hostname of the server, example: xyz.sap.corp 
	Port : <string>                     //  Port of the server, example: 8080
	SecurityConfiguration : <string>    //  Security configuration of the application, examples: "SSO", 
        	                                "MySec001", "Cert02"
	UserCreationPolicy : <string>       //  automatic/manual/certificate

##Interface
###iOS
####\<CertificateProvider\>
The CertificateProvider protocol interface contains the methods your `id<CertificateProvider>` should implement.  These will be called by the Logon Manager component, if x509Certificate is specified.

    @protocol CertificateProvider <NSObject>
    - (void) getCertificate:(id<CertificateProviderDelegate>) delegate;
    - (BOOL) getStoredCertificate:(SecIdentityRef*)secIdentityRef error:(NSError**)anError;
    - (BOOL) deleteStoredCertificateWithError:(NSError**)anError;
    
    @optional  
    - (BOOL) setParameters:(NSDictionary*)aDictionary error:(NSError **)error;
    @end

#####`getCertificate:` 
This method is the standard asynchronous API call made by the Logon Manager, if Logon Manager has not registered with the Mobile Platform server, or if the identity is being deleted/updated.  The implementation should call the `onSuccess:` and `onFailure:` delegate methods on complete.

This asynchronous method should especially be used, if an end user-facing UI is required as part of the flow for getting the certificate into the application sandbox (e.g., for getting username/password to send to a Mobile Device Management server).  If showing a UI, use the application's regular navigation stack.

#####`getStoredCertificate:` 
This synchronous call is tried by the Logon Manager (or in Kapsel SDK, the **AuthProxy**), once the application has registered with the Mobile Platform server.  If an identity is already in-memory or can be quickly retrieved via synchronous API's, it should be returned here.  

Because this method is blocking, UI should *not* be displayed in this implementation.  If an identity isn't readily available, return `nil`, and the caller will follow with the asynchronous version of the method.

#####`deleteStoredCertificateWithError:` 
This synchronous call is made by Logon Manager if the current identity should be cleared.  The typical case will be if the application receives an authentication failure, and the developer calls an API on the Logon Manager to `updateCertificate:`.  The Logon Manager echos the 'update' message to the `id<CertificateProvider>` by calling this delete method, then the asynchronous `getCertificate:`.

This method will also be invoked if the application is 'unregistered', or if the DataVault is locked and deleted due to maxAttempts.

####\<CertificateProviderDelegate\>
The **Logon Manager** implements the `<CertificateProviderDelegate>` protocol, and will be the reciever of the `onSuccess` and `onFailure` calls by the `id<CertificateProvider>`.

    @protocol CertificateProviderDelegate <NSObject>
    -(void)onGetCertificateSuccess:(SecIdentityRef) aCertObject; 
    -(void)onGetCertificateFailure:(NSError *)error;
    @end


To display a UI from the CertificateProvider implementation in a native application, reference the navigation stack directly on iOS, or use the `CertificateProviderListener.getCurrentActivity()` method on Android.   

    
###Android
####CertificateProvider.java

    import java.util.Map;
    import android.app.Activity;

    public interface CertificateProvider {
        void getCertificate(CertificateProviderListener callbackObject); 
        X509KeyManager getStoredCertificate() throws CertificateProviderException;
        void deleteStoredCertificate() throws CertificateProviderException;
        void setParameters(Map params);
    }

####CertificateProviderListener.java

    import javax.net.ssl.X509KeyManager;
    
    public interface CertificateProviderListener {
	    void onGetCertificateSuccess(X509KeyManager aCertObject); 
	    void onGetCertificateFailure(int errorCode, String errorMessage);
	    Activity getCurrentActivity(); 
        
        //optional
        void showUI(Object aUIDefinition) throws CertificateProviderException;
    }

####CertificateProviderException.java

    public class CertificateProviderException extends Exception {
        private int _errorCode;
        private String _message;
        
        CertificateProviderException( int errorCode, String message ){
            _errorCode = errorCode;
            _message = message;
        }
        
        public int getErrorCode(){
            return _errorCode;
        }
        
        public String getMessage() {
            return _message;
        }
    }

###Kapsel (JavaScript)

##Copyright and license

Copyright 2014 SAP AG

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

See also the file LICENSE.
