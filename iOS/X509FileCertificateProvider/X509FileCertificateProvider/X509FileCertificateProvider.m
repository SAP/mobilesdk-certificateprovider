//
//  CertificateProvider.m
//  CertificateProvider
//
//  Created by Li, Jonathan on 12/13/13.
//  Copyright (c) 2013 SAP. All rights reserved.
//

#import "X509FileCertificateProvider.h"

@interface X509FileCertificateProvider()
-(void) getClientCertificateFromFile;
-(NSError*) getErrorObject:(int)errorCode message:(NSString*)errorMessage;
@end

static NSString* const kSMPCertProviderTag = @"CERTIFICATE_PROVIDER";
static NSString* const kFileCertificateLabel = @"x509FileCertificateIdentity";

@implementation X509FileCertificateProvider {
   SecIdentityRef currentIdentity;
}


#pragma mark - CertificateProvider Interface

- (void) getCertificate:(id<CertificateProviderDelegate>) delegate {
   providerDelegate = delegate;
   //move to mediator
   NSError* error;
   if (_settings){
      if (![providerDelegate showUI:_settings failedWithError:&error]){
         //report error
         [providerDelegate onGetCertificateFailure:[self getErrorObject:ERR_ShowUI_Delegate_Html message:@"ShowUI delegate method with html path parameter returns error"]];
      }
   }
    else{
      [providerDelegate onGetCertificateFailure:[self getErrorObject:ERR_ShowUI_Delegate_No_UI_Settings message:@"ShowUI delegate method called without UI settings"]];
   }
}

//method to synchronously get a certificate from saved local copy.
//if saved certicate exists, return true and also set the identityref parameter to the certificate
//If no saved certificate exists, return true and also setting identityRef parameter to nil.
//if error happens during getting the saved certificate, return false with related error, also setting identityRef parameter to nil
- (BOOL) getStoredCertificate:(SecIdentityRef *)pidentityRef error:(NSError**)anError{
  // retrieves a SecIdentityRef from the cached object in memory. If no cached object exists, then get it from keychain for matched
  // kSecAttrLabel's value, the first matched one will be returned
  // Return Val :  the matched identity object
   *pidentityRef = nil;
   NSError* error = nil;
   
   //check current identity object if available
   if (currentIdentity != nil){
      *pidentityRef = currentIdentity;
   }
   else{
      // Common name is stored in label attribute,
      NSDictionary* queryIdentity = [NSDictionary dictionaryWithObjectsAndKeys:
                                     kFileCertificateLabel,                   kSecAttrLabel,
                                     (__bridge id)kSecClassIdentity,  kSecClass,
                                     kCFBooleanTrue,         kSecReturnRef,
                                     kCFBooleanTrue,         kSecReturnAttributes,
                                     kSecMatchLimitAll,      kSecMatchLimit,
                                     nil];
      
      // Get a new identity from the keychain
      // This works because the private key will automatically be associated with the certificate in the keychain
      CFArrayRef result = nil;
      
      OSStatus err = SecItemCopyMatching((__bridge CFDictionaryRef)queryIdentity, (CFTypeRef*)&result);
      
      if (err == errSecItemNotFound)
      {
         *pidentityRef = nil;
      }
      else if (err == noErr && result != nil )
      {
         CFIndex resultCount = CFArrayGetCount(result);
         NSLog(@"Matched identity count: %i", (int)resultCount);
         // somehow two identities are returned with the same certificate, one with public key, one with private key,
         // the one with public key is invalid identity, need to return the one with the private key
         for (int resultIndex = 0; resultIndex < resultCount; resultIndex++)
         {
            NSDictionary* thisResult = (NSDictionary*) CFArrayGetValueAtIndex(result, resultIndex);
            
            CFTypeRef keyClass = (__bridge CFTypeRef) [thisResult objectForKey:(__bridge id)kSecAttrKeyClass];
            if (keyClass != nil )
            {
               if ([[(__bridge id)keyClass description] isEqual:(__bridge id)kSecAttrKeyClassPrivate])
               {
                  *pidentityRef = (__bridge SecIdentityRef)[thisResult objectForKey:(__bridge NSString*)kSecValueRef];
                  if (currentIdentity){
                      CFRelease(currentIdentity);                 //release previous identity object
                      currentIdentity = nil;
                  }
                  //get hold of the new identity object
                  currentIdentity = *pidentityRef;
                  CFRetain(currentIdentity);
               
               }
            }
         }
      }
      else
      {
         error = [self getErrorObject:ERR_Read_KeyChain_Item_Failed message:@"Fail to read certificate from keychain"];
      }
      
      if (result != nil){
         CFRelease(result);
      }
   }
   if (anError != nil){
      *anError = error;
   }
   
   return error == nil;
}

//method to delete the saved local copy
//if not saved certificate exists, do nothing and return true,
//if saved certificate is deleted, return true
//if saved certificate exists and fails to delete, reture false with error
- (BOOL) deleteStoredCertificateWithError:(NSError**)anError{
  	NSError* error = nil;
   OSStatus sanityCheck = noErr;
   NSDictionary *queryIdentity;

   queryIdentity = [NSDictionary dictionaryWithObjectsAndKeys:
                          kFileCertificateLabel, kSecAttrLabel,
                          (__bridge id)kSecClassIdentity, kSecClass,
                          nil];

	// Delete the private key.
	sanityCheck = SecItemDelete((__bridge CFDictionaryRef)queryIdentity);
   if (sanityCheck != noErr && sanityCheck != errSecItemNotFound ){
      error = [self getErrorObject:ERR_Delete_Saved_Certificate_Failed message:@"Fail to delete the saved certificate"];
   }
   
   if (anError != nil){
      *anError = error;
   }
   
   if (currentIdentity != nil){
      CFRelease(currentIdentity);
      currentIdentity = nil;
   }
   return error == nil;
}


- (BOOL) setParameters:(NSDictionary*) params failedWithError:(NSError **)error{
   //add new params into parameter arrays, and check whether all required parameters are available, if so,
   //retrieve the certificate. Otherwise, call showUI method to get the missing parameters
   if (params){
      [params enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
          if ([key isEqualToString:@"filepath"]){
             filePath = (NSString*)obj;
          }
          else if ([key isEqualToString:@"password"]){
             password = (NSString*)obj;
          }
      }];
     
   }
   
   if (filePath && password){
      //get certificate from file
      [self getClientCertificateFromFile];
   }
   else{
      if (error != nil){
         *error = [self getErrorObject:ERR_Set_Parameters_Failed message:@"Fail to set parameters"];
      }
      return FALSE;
   }
   return TRUE;
}

#pragma mark - Landscape-specific Interface
//initialize the settings for getting parameter UI
- (id) init{
    currentIdentity = nil;
    NSDictionary* certificateFileSettings = [NSDictionary dictionaryWithObjectsAndKeys:@"client.p12", @"filepath", nil];
    _settings = [NSDictionary dictionaryWithObjectsAndKeys:@"x509ProviderUI", @"viewID", certificateFileSettings, @"settings", nil];
    return self;
}

//get client certificate from file for authentiation, and also save to a local copy to keychain for later use
-(void) getClientCertificateFromFile{
   
   //check identity exists using the common name as application tag and application label
   NSError* error = nil;
   
   SecIdentityRef identity = nil;
   CFArrayRef items = NULL;
 
   //first try to get the saved certificate from keychain
   BOOL bResult = [self getStoredCertificate:&identity error:&error];
   if (bResult){
      if (identity == nil ){
   
         NSString *documentsDirectory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
               
         NSString * fullPath = [documentsDirectory stringByAppendingPathComponent:filePath];
         
         //check file exist
         BOOL isDirectory = YES;
               
         BOOL fileExists = [[NSFileManager defaultManager] fileExistsAtPath:fullPath isDirectory:&isDirectory];
               
         if (fileExists == NO || isDirectory ){
                  NSLog(@"%@: File certificate not found in document directory.  Trying resource folder.", kSMPCertProviderTag);
                  //if the file does not exist in document directory, then check the main bundle resource folder
                  NSString * resourceFolderPath = [[NSBundle mainBundle] resourcePath];
                  fullPath = [resourceFolderPath stringByAppendingPathComponent:filePath];
                  
                  fileExists = [[NSFileManager defaultManager] fileExistsAtPath:fullPath isDirectory:&isDirectory];
                  if (fileExists == NO || isDirectory ){
                     NSLog(@"%@: File certificate not found.", kSMPCertProviderTag);
                  }
          }
         
         if ( fileExists == YES && !isDirectory ){
                  NSData *p12data = [NSData dataWithContentsOfFile:fullPath];
                  CFDataRef inP12data = (__bridge CFDataRef)p12data;
            
                  NSDictionary* options = [NSDictionary dictionaryWithObjectsAndKeys:
                        password, kSecImportExportPassphrase, nil];
                     
            
                  OSStatus status = SecPKCS12Import(inP12data, (__bridge CFDictionaryRef)options, &items);
                  
                  if (status == noErr) {
                     CFDictionaryRef identityAndTrust = CFArrayGetValueAtIndex(items, 0);
                     const void *tempIdentity = NULL;
                     tempIdentity = CFDictionaryGetValue(identityAndTrust, kSecImportItemIdentity);
                     
                     NSDictionary *queryCertificate = [NSDictionary dictionaryWithObjectsAndKeys:
                                                       kFileCertificateLabel, kSecAttrLabel,
                                                       (__bridge id)tempIdentity, kSecValueRef,
                                                       nil];
                     
                     status = SecItemAdd((__bridge CFDictionaryRef) queryCertificate, NULL);
                     
                     if (status != noErr ){
                           NSLog(@"%@: Fail to save certificate to keychain.", kSMPCertProviderTag);
                           error = [self getErrorObject:ERR_Save_Certificate_To_KeyChain_Failed message:@"Save certificate to keychain failed."];
                     }
                  }
                  else{
                     NSLog(@"%@: File certificate invalid.", kSMPCertProviderTag);
                     error = [self getErrorObject:ERR_Load_Certificate_From_File_Failed message:@"File certificate invalid."];
                  }
         }
         else {
                  NSString* errorMessage = [NSString stringWithFormat:@"Certificate file does not exist: %@", filePath];
                  error =[self getErrorObject:ERR_Certificate_File_Not_Exist message:errorMessage];
         }
      }
   }
   else{
         error = [self getErrorObject:ERR_Read_KeyChain_Item_Failed message:@"Fail to read certificate from keychain"];
   }
   
   if (items != nil){
      CFRelease(items);
   }
 
   //otherwise report the success
   if (error == nil ){
       [self getStoredCertificate:&identity error:&error];
   }
   
   if  (identity != nil){
      [providerDelegate onGetCertificateSuccess:identity];
   }
   else {
      [providerDelegate onGetCertificateFailure:error];
   }
}

-(NSError*)getErrorObject:(int)errorCode message:(NSString*)errorMessage{
   NSDictionary *userInfo = @{ NSLocalizedDescriptionKey : errorMessage };
   
   NSError *error = [NSError errorWithDomain:Certificate_Provider_Error_Domain
                                    code:errorCode
                                    userInfo:userInfo];
   return error;
}


@end
