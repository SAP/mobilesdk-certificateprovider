//
//  X509FileCertificateProvider
//  CertificateProvider test demo
//
//  Created by Li, Jonathan on 12/13/13.
//  Copyright (c) 2013 SAP. All rights reserved.
//

#import "CertificateProvider.h"
#import <UIKit/UIKit.h>

//define error code and error domain for error message localization
#define Certificate_Provider_Error_Domain @"ERR_Certificate_Provider"
#define ERR_ShowUI_Delegate_Html                     -1
#define ERR_ShowUI_Delegate_ViewController           -2
#define ERR_ShowUI_Delegate_No_UI_Settings           -3
#define ERR_Set_Parameters_Failed                    -4
#define ERR_Certificate_File_Not_Exist               -5
#define ERR_Load_Certificate_From_File_Failed        -6
#define ERR_Save_Certificate_To_KeyChain_Failed      -7
#define ERR_Read_KeyChain_Item_Failed                -8
#define ERR_Delete_Saved_Certificate_Failed          -9




@interface X509FileCertificateProvider : NSObject <CertificateProvider>{
}



@end
