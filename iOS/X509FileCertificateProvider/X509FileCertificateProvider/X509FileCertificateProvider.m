//
//  CertificateProvider.m
//  CertificateProvider
//
//  Created by Li, Jonathan on 12/13/13.
//  Copyright (c) 2013 SAP. All rights reserved.
//

#import "X509FileCertificateProvider.h"
#import "X509FileCertViewController.h"

@interface X509FileCertificateProvider()
-(void) getClientCertificateFromFile:(NSString*)filePath password:(NSString*)password withCompletion:(void(^)(SecIdentityRef, NSError*))block;
-(NSError*) getErrorObject:(int)errorCode message:(NSString*)errorMessage;
@end

static NSString* const kSMPCertProviderTag = @"CERTIFICATE_PROVIDER";
static NSString* const kFileCertificateLabel = @"x509FileCertificateIdentity";

@implementation X509FileCertificateProvider

#pragma mark - CertificateProvider Interface



- (UIViewController *)topViewController{
  return [self topViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
}
 
- (UIViewController *)topViewController:(UIViewController *)rootViewController
{
  if (rootViewController.presentedViewController == nil) {
    return rootViewController;
  }
  
  if ([rootViewController.presentedViewController isMemberOfClass:[UINavigationController class]]) {
    UINavigationController *navigationController = (UINavigationController *)rootViewController.presentedViewController;
    UIViewController *lastViewController = [[navigationController viewControllers] lastObject];
    return [self topViewController:lastViewController];
  }
  
  UIViewController *presentedViewController = (UIViewController *)rootViewController.presentedViewController;
  return [self topViewController:presentedViewController];
}


- (void) initialize:(NSDictionary *)option withCompletion:(void(^)(SecIdentityRef, NSError*))block{
   
      //if certificate is already provisioned, load and return it
       NSError* err = nil;
       SecIdentityRef identity = nil;
       [self getStoredCertificate:&identity error:&err];
       if (identity != nil){
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                block(identity, nil);
                CFRelease(identity);
            });
       }
       else if (err != nil){
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                block(nil, err);
            });
       }
       else{
          //certificate is not yet provisioned, get it from server, this will involve show the UI to get the parameter from user
          //The UI may be 1. native viewcontroller, 2. UIWebView with UI5 html 3. cordova webview
          
          //display a ViewController to get file path and password
          //add new params into parameter arrays, and check whether all required parameters are available, if so,
          //retrieve the certificate. Otherwise, call showUI method to get the missing parameters
          __block NSString* filePath, * password;
          if (option){
              [option enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
                  if ([key isEqualToString:@"filepath"]){
                     filePath = (NSString*)obj;
                  }
                  else if ([key isEqualToString:@"password"]){
                     password = (NSString*)obj;
                  }
              }];
             
           }

           UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"X509FileCertScreen" bundle:nil];
           X509FileCertViewController *vc = [storyboard instantiateViewControllerWithIdentifier:@"X509FileCertScreen"];
           vc.onDismiss = ^(X509FileCertViewController* sender){
               if (sender.bIsCancelled){
                    NSError* err = [NSError errorWithDomain:@"X509FileCertificateProvider" code:-1 userInfo:nil];
                    block(nil, err);
                }
                else{
                    //load certificate from file system
                    filePath = sender.fileName.text;
                    password = sender.password.text;
                    if (filePath && password){
                        //get certificate from file
                        [self getClientCertificateFromFile:filePath password:password withCompletion:block];
                    }
                }

           };
           UIViewController* topVC = [self topViewController];
           
           [topVC presentViewController:vc animated:YES completion:nil];
        }
}

-(NSString*) getProviderID{
    return NSStringFromClass (self.class);
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
                 //get hold of the new identity object
                  CFRetain(*pidentityRef);
               
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
   
   return error == nil;
}


#pragma mark - Landscape-specific Interface

//get client certificate from file for authentiation, and also save to a local copy to keychain for later use
-(void) getClientCertificateFromFile:(NSString*)filePath password:(NSString*)password withCompletion:(void(^)(SecIdentityRef, NSError*))block{

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
       block(identity, nil);
       CFRelease(identity);
   }
   else {
       block(nil, error);
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
