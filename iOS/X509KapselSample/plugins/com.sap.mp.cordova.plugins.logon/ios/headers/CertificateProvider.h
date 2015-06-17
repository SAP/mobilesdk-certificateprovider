//
//  CredentialProvider.h
//  CertificateProvider
//  Copyright (c) 2013 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "CertificateProviderDelegate.h"

#define kCertificateProviderParameterKeyURL @"url"

@protocol CertificateProvider <NSObject>

@optional

/** 
 * Asynchronous method to provision a certificate, the completion block can be called to return the result.
 * The method first checks if the certificate is already provisioned, if it is not yet provisioned, then it requests the certificate from remote server
 * @param option key/value map of the parameters the provider needs
 * @param completion a completion block which should be called on end of the asynchronous operation even on success or fail
 */
- (void) initialize:(NSDictionary*)option withCompletion:(void(^)(SecIdentityRef identityRef, NSError* error))completion;


/**
 * Returns the unique certificate provider ID for the current provider. It is suggested to use reverse domain format for example com.sap.CertProvider
 * @return the unique ID of the provider
 */
- (NSString*) getProviderID;

/**
 * Method to synchronously get a certificate from saved local copy
 * If saved certicate exists, return true and also set the identityref parameter to the certificate
 * If no saved certificate exists, return true and also setting identityRef parameter to nil.
 * If error happens during getting the saved certificate, return false with related error, also setting identityRef parameter to nil
 * @param identityRef \b out parameter: on success return should contains the SecIdentityRef
 * @param error the error in case the operation fail
 * @return YES if the method was success NO otherwise
 */
- (BOOL) getStoredCertificate:(SecIdentityRef *)identityRef error:(NSError**)anError;

/**
 * Method to delete the saved local copy
 * If not saved certificate exists, do nothing and return true,
 * If saved certificate is deleted, return true
 * If saved certificate exists and fails to delete, reture false with error
 * @param anError \b out parameter, pointer to an NSError* variable. In case of fail the cause of error will be put to this variable
 * @return YES if the method was success NO otherwise
 */
- (BOOL) deleteStoredCertificateWithError:(NSError**)anError;

//asynchronous method to get a certificate, the delegate can be called to retrieve user input and return the result.
//The method first check and return the local saved certificate if available, before requesting the certificate from remote server
//report error to caller by calling onGetCertificateFailure delegate method
//return the certificate by calling onGetCertificateSuccess method, the certificate should be saved locally before calling
//onGetCertificateSuccess method
//@deprecated since v3.8.0. This selector is deprecated and obsolite. Please use initialize:option:withCompletion selector instead
- (void) getCertificate:(id<CertificateProviderDelegate>) delegate __attribute__ ((deprecated));


/**
 * Method to set required parameters input by user or other sources. For example in case of application:openUrl the url will be passed through this method with a key kCertificateProviderParameterKeyURL
 * Report error immediately by output reference,
 * This error will not cancel the getcertificate operation
 * @param params key/value map of the paramters which should be used by the provider to get the certificate properly.
 * @param error anError \b out parameter, pointer to an NSError* variable. In case of fail the cause of error will be put to this variable
 * @return YES if the method was success NO otherwise
 */
- (BOOL) setParameters:(NSDictionary*)params failedWithError:(NSError **)error;

@end


