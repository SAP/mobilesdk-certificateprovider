//
//  X509FileCertViewController.h
//  X509FileCertificateProvider
//
//  Created by Li, Jonathan on 1/27/15.
//  Copyright (c) 2015 SAP. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface X509FileCertViewController : UIViewController
@property (weak, nonatomic) IBOutlet UITextField *fileName;
@property (weak, nonatomic) IBOutlet UITextField *password;
@property (nonatomic, strong) void (^onDismiss)(X509FileCertViewController *sender);

@property BOOL bIsCancelled;
- (IBAction)onSubmit:(id)sender;
- (IBAction)onCancel:(id)sender;

@end
