//
//  FileCertificateProvider.m
//  FederationProvider
//
//  Copyright © 2016 SAP. All rights reserved.
//

#import "CDVX509FileCertificateProvider.h"

#define ProviderId @"X509FileCertificateProvider"

@implementation CDVX509FileCertificateProvider {
    SecIdentityRef _identity;
    NSString* _fileName;
    NSString* _password;
}

- (void) initialize:(NSDictionary*)option withCompletion:(void(^)(SecIdentityRef identityRef, NSError* error))completion {
    NSError* localError = nil;
    
    [self setParameters:option failedWithError:&localError];
    
    if (_identity==NULL) {
        [self loadIdentityWithError:&localError];
    }
    
    completion(_identity, localError);
    
}

- (NSString*) getProviderID {
    return @"X509FileCertificateProvider";
}

- (BOOL) getStoredCertificate:(SecIdentityRef *)identityRef error:(NSError**)anError {
    NSError* localError = nil;
    if (_identity == nil) {
        [self loadIdentityWithError:&localError];
    }
    *identityRef = _identity;
    if (anError != nil) {
        *anError = localError;
    }
    
    return localError == nil;
}

- (BOOL) deleteStoredCertificateWithError:(NSError**)anError {
    _identity = nil;
    return YES;
}

- (BOOL) setParameters:(NSDictionary*)params failedWithError:(NSError **)error {
    NSString* fileName = params[FileCertificateProviderFileNameParameter];
    if (fileName != nil) {
        _fileName = fileName;
    }
    if (params[FileCertificateProviderPasswordParameter] != nil) {
        _password = params[FileCertificateProviderPasswordParameter];
    }
    
    return YES;
}

#pragma mark - Private methods

- (void) loadIdentityWithError:(NSError**)anError {
    if (_fileName.length > 0) {
        _identity = [self loadIdentityFromP12:_fileName withPassword:_password];
        if (_identity == nil) {
            *anError = [NSError errorWithDomain:NSStringFromClass([self class]) code:3 userInfo:nil];
        }
    }
    else {
        *anError = [NSError errorWithDomain:NSStringFromClass([self class]) code:2 userInfo:nil];
    }
}

- (SecIdentityRef) loadIdentityFromP12:(NSString*)fileName withPassword:(NSString*)aPassword {
    SecIdentityRef identityApp = nil;
    NSString* fname = [[NSBundle mainBundle] pathForResource:fileName ofType:nil];
    NSData *PKCS12Data = [NSData dataWithContentsOfFile:fname];
    
    CFDataRef inPKCS12Data = (__bridge CFDataRef)PKCS12Data;
    CFStringRef password = (__bridge CFStringRef)aPassword;
    const void *keys[] = { kSecImportExportPassphrase };
    const void *values[] = { password };
    CFDictionaryRef options = CFDictionaryCreate(NULL, keys, values, 1, NULL, NULL);
    CFArrayRef items = CFArrayCreate(NULL, 0, 0, NULL);
    OSStatus securityError = SecPKCS12Import(inPKCS12Data, options, &items);
    CFRelease(options);
    if (securityError == errSecSuccess) {
        NSLog(@"Success opening p12 certificate. Items: %ld", CFArrayGetCount(items));
        CFDictionaryRef identityDict = CFArrayGetValueAtIndex(items, 0);
        identityApp = (SecIdentityRef)CFDictionaryGetValue(identityDict, kSecImportItemIdentity);
    } else {
        NSLog(@"Error opening Certificate.");
    }
    
    return identityApp;
}


@end
