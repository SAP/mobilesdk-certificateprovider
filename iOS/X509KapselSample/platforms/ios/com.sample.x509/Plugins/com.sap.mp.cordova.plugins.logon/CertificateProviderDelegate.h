//
//  CertificateProviderDelegate.h
//  CommonCertificateProvider
//
//  Copyright (c) 2015 SAP SE. All rights reserved.
//

//obsolete delegate for old interface
__attribute__ ((deprecated))
@protocol CertificateProviderDelegate <NSObject>
//onsuccess callback delegete, the certificate should be saved locally to be returned by getCachedCertificate method later
-(void) onGetCertificateSuccess:(SecIdentityRef) aCertObject __attribute__((deprecated));

//onerror delegate
-(void) onGetCertificateFailure:(NSError *)error __attribute__((deprecated));

//ui helper method to get user input
//for aUIDefintion parameter, if its type is uiviewcontroller, then it is for native app. If it is NSUrl, it represents url to get the screen
//definition, if it is a string type, it is a html page path for kapsel app

//Don't Use this please! Obsolete!
-(BOOL) showUI:(id)aUIDefinition failedWithError:(NSError **)error __attribute__ ((deprecated));
@end