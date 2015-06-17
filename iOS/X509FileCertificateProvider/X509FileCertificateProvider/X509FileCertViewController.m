//
//  X509FileCertViewController.m
//  X509FileCertificateProvider
//
//  Created by Li, Jonathan on 1/27/15.
//  Copyright (c) 2015 SAP. All rights reserved.
//

#import "X509FileCertViewController.h"

@interface X509FileCertViewController ()

@end

@implementation X509FileCertViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (IBAction)onSubmit:(id)sender {
    self.bIsCancelled = NO;
    [self dismissViewControllerAnimated:true completion:^{
        self.onDismiss(self);
    }];
}

- (IBAction)onCancel:(id)sender {
    self.bIsCancelled = YES;
    [self dismissViewControllerAnimated:true completion:^{
        self.onDismiss(self);
    }];
}
@end
