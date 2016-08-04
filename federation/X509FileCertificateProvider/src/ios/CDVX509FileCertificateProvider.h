//
//  FileCertificateProvider.h
//  FederationProvider
//
//  Created by Palfi, Andras on 12/02/16.
//  Copyright © 2016 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "CertificateProvider.h"

#define FileCertificateProviderFileNameParameter @"com.sap.fileprovider.filename"
#define FileCertificateProviderPasswordParameter @"com.sap.fileprovider.password"


@interface CDVX509FileCertificateProvider : CDVPlugin <CertificateProvider>


@end
