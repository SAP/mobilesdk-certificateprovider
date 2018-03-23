X509 Sample File provider that can be used with Federation Provider
===================================================================
This is a simple file provider that you can use in Kapsel and Custom Fiori Client.

Supported Platforms
-------------------
iOS (>=8), Android (>=4.4)

Supported Kapsel SDK
--------------------
SMP3 SDK SP12 SNAPSHOT

Prerequisites
-------------
Check that you have the minimum required Node, NPM and Cordova versions installed
```
BUDM60290054A:X509FileCertificateProvider i045924$ node -v
v5.1.0
BUDM60290054A:X509FileCertificateProvider i045924$ npm -v
3.3.12
BUDM60290054A:X509FileCertificateProvider i045924$ cordova -v
6.0.0
```

How to use in Kapsel App
------------------------
In order to use this sample file provider you need to create a cordova application.
You will also need kapsel-dist zip containing the Kapsel plugins. 
Federation Provider is supported since SMP3 SDK SP12. See the snapshot build here:
http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.snapshots.ios/com/sap/kapsel/plugins/dist/smp-plugins-dist/3.12.0-SNAPSHOT/

Create Kapsel App and Add plugins
---------------------------------
```
$ cordova create fedsample com.sap.fedsample fedsample
$ cd fedsample
$ cordova platform add ios
$ cordova platform add android
$ cordova plugin add kapsel-plugin-federationprovider --searchpath <path_to_plugins_folder>
```

For our internal testing we will use the X509 File Provider shared on internal github:
```
$ cordova plugin add https://github.wdf.sap.corp/SMPClientSDKDevelopment/X509FileCertificateProvider
```
Or you can clone this repository to a local folder and add it from that folder:
```
$ cordova plugin add sample-plugin-x509filecertificateprovider --searchpath <path_to_cloned_git_folder>
```

If you experience any error regarding certificate verification during the plugin installation, follow the steps below:

1. Using your certificate manager tool, make sure that the certificates [SAP Global Root CA](http://aia.pki.co.sap.com/aia/SAP%20Global%20Root%20CA.crt) and 
[SAPNetCA_G2](http://aia.pki.co.sap.com/aia/SAPNetCA_G2.crt) are in the list of *Trusted Root Certification Authorities*.
2. Copy the contents of *SAP Global Root CA*, and save it at the following path:
	```
	%Git_installation_folder%/mingw64/bin/curl-ca-bundle.crt
	```
	
At the same time, it is possible to disable SSL verification from the Git configuration using the following command:   
*NOT ALWAYS RECOMMENDED*
```
git config --global http.sslVerify false
```

How to update the x509filecertificateprovider when changed
----------------------------------------------------------
Cordova does not provide a way to update a plugin. So you need to first remove the plubin: 
```
cordova plugin remove sample-plugin-x509filecertificateprovider
```
and then add it again:
```
$ cordova plugin add https://<#github host location#>/SMPClientSDKDevelopment/X509FileCertificateProvider
```

Known Gradle Problem & Workarounds
----------------------------------
h3. First build the Cordova App from terminal
In order to generate the necessary gradle contents run cordova from terminal/cmd for the first time:
```
cordvoa build
```

h3. Adding plugin gradle extension
This workaround must be applied in order to make some of the dependent plugins (authproxy, logon, federation etc.) load. 
Open the root build.gradle file and add the following lines between the // PLUGIN GRADLE EXTENSIONS START and // PLUGIN GRADLE EXTENSIONS END comments. 
```
apply from: "kapsel-plugin-authproxy/fedsample-smp_authProxy.gradle"
apply from: "kapsel-plugin-logon/fedsample-smp_logon.gradle"
apply from: "kapsel-plugin-federationprovider/fedsample-federationprovider.gradle"
```

Adding the certificate to the app
------------------------------
* Android: 
** The  X509 certificate file (.p12) has to be copied into the assets folder of the generated android application project.
** The File Provider in it's current implementation will ask the Consumer to type the name of the .p12 file and the apssword used.
* iOS: 
** Add the .p12 file to the root of the xcode project.

Configuring the Provider
------------------------
Both ios and android implementation of the provider provides a way to set the filename and password from the context:

```
var context = {
	operation : {
		logonView : sap.logon.IabUi
	},
	appConfig : {
		appID : "com.sap.maf.test.ios.logonapp_X509M",
		isForSMP : true,
		certificate : "X509FileCertificateProvider",
		"com.sap.fileprovider.filename": "my.p12",
		"com.sap.fileprovider.password": "qwerty"
	},
	smpConfig : {
		"serverHost": "<#My Server#>",
		"https": "true",
		"serverPort": "8082",
		"communicatorId": "REST",
		"passcode": "password",
		"unlockPasscode": "password",
		"passcode_CONFIRM":"password"
	}
};

```
Be aware that the iOS version of the provider provides only this possibility to set the filename and password while the android version will pop up a modal view to type the filename if it was not specified.

Complete HTML example
---------------------
Override the default generated Cordova www/index.html file content with this content.
