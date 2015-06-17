cordova.define("com.sap.mp.cordova.plugins.logon.LogonStaticScreens", function(require, exports, module) { var screens = {
    
		'SCR_MOCKSCREEN': {
			id: 'SCR_MOCKSCREEN',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
			fields: { 
				mockparameter: {uiKey:'FLD_MOCKLABEL'}
			}
		},
		
	        
        'SCR_SSOPIN_SET': {
            id: 'SCR_SSOPIN_SET',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                ssoPasscode: {uiKey:'FLD_SSOPIN', type: 'password'},
                forgot: {
                	uiKey:'FLD_FORGOT_SSOPIN', 
                	type: 'button', 
                	actionId: 'FORGOT',
                	//confirmKey: 'CNF_FORGOT_SSOPIN',
                	styleClass: 'smpLogonLink'
                }, 
                skip: {
                	uiKey:'FLD_SKIP_SSOPIN', 
                	type: 'button', 
                	actionId: 'SKIP',
                	confirmKey: 'CNF_SKIP_SSOPIN',
                	styleClass: 'smpLogonLink'
                }
            }
        },
        'SCR_SSOPIN_CHANGE': {
            id: 'SCR_SSOPIN_CHANGE',
            nav: {
                submit: {
                }, 
                cancel: {
                	uiKey:'BTN_SKIP_SSOPIN', 
                	confirmKey: 'CNF_SKIP_SSOPIN',
                	actionId: 'SKIP'
                } 
            },
            fields: {
                ssoPasscode: {uiKey:'FLD_SSOPIN', type: 'password'},
                forgot: {
                	uiKey:'FLD_FORGOT_SSOPIN', 
                	type: 'button',
                	actionId: 'FORGOT',
                	//confirmKey: 'CNF_FORGOT_SSOPIN',
                	styleClass: 'smpLogonLink'
                }                
            }
        },
        'SCR_ENTER_AFARIA_CREDENTIAL': {
            id: 'SCR_ENTER_AFARIA_CREDENTIAL',
            nav: {
                submit: {
                }
            },
            fields: {
               afariaUser: {
                   uiKey: 'FLD_AFARIA_USER'
               },
               afariaPassword: {
                   uiKey: 'FLD_AFARIA_PASSWORD',
                   type: 'password'
               }
            }
        },
        'SCR_ENTER_CREDENTIALS': {
            id: 'SCR_ENTER_CREDENTIALS',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                        user : {
                            uiKey:'FLD_USER'
                        },
                        password : {
                            uiKey:'FLD_PASS',
                            type: 'password'
                        },
                        serverHost : {
                            uiKey:'FLD_HOST',
                            visible:false
                        },
                        serverPort : {
                            uiKey:'FLD_PORT',
                            type: 'number',
                            visible:false
                        },
                        communicatorId : {
                            uiKey: 'FLD_COMMUNICATORID',
                            'default':'REST',
                            visible:false
                        },
                        https: {
                            uiKey:'FLD_IS_HTTPS',
                            type: 'switch',
                            'default':false,
                            visible:false
                        },
                        securityConfig: {
                            uiKey:'FLD_SECCONF',
                            visible:false
                        }

            }
        },
        
        'SCR_UNLOCK': {
            id: 'SCR_UNLOCK',
            nav: {
                submit: {
                } 
            },
            fields: {
                unlockPasscode: {uiKey:'FLD_PASSCODE', type: 'password'},
                forgot: {
                	uiKey:'FLD_FORGOT_PASSCODE', 
                	type: 'button',
                	actionId: 'FORGOT',
                	confirmKey: 'CNF_FORGOT_PASSCODE',
                	styleClass: 'smpLogonLink'
                	}
            }
        },
        
        'SCR_REGISTRATION': {
            id: 'SCR_REGISTRATION',
            nav: {
                submit: {
                }, 
        		cancel: {
        		} 
            },
            fields: {
            			serverHost : {
            				uiKey:'FLD_HOST',
            				editable:true
            			},
                        user : {
                            uiKey:'FLD_USER'
                        },
                        password : {
                            uiKey:'FLD_PASS',
                            type: 'password'
                        },
                        resourcePath : {
                            uiKey:'FLD_RESOURCE_PATH'
                        },
                        https: {
                            uiKey:'FLD_IS_HTTPS',
                            type: 'switch',
                            'default':false,
                            visible:true
                        },
                        serverPort : {
                            uiKey:'FLD_PORT',
                            type: 'number',
                            editable:true,
                            visible:true
                        },
                        farmId : {
                            uiKey:'FLD_FARMID'
                        },
                        communicatorId : {
                            uiKey: 'FLD_COMMUNICATORID',
                            'default':'REST',
                            visible:false
                        },
                        securityConfig: {
                            uiKey:'FLD_SECCONF',
                            visible:true
                        },

            }
        },
        
       'SCR_SHOW_REGISTRATION' : { 
        			id: 'SCR_SHOW_REGISTRATION',
        			nav: {
                        cancel: {
                        } 
                    },
        			fields: {
                        user : {
                            uiKey:'FLD_USER',
                            editable:false,
                            enabled:false
                        },
                        serverHost : {
                            uiKey:'FLD_HOST',
                            editable:false,
                            enabled:false
                        },
                        serverPort : {
                            uiKey:'FLD_PORT',
                            type: 'number',
                            editable:false,
                            enabled:false
                        },
                        communicatorId : {
                            uiKey: 'FLD_COMMUNICATORID',
                            editable:false,
                            enabled:false
                        },
                        https: {
                            uiKey:'FLD_IS_HTTPS',
                            type: 'switch',
                            enabled:false
                        }
        			}
        	   	},
        
        'SCR_AFARIA_USERPASS_REGISTRATION': {
            id: 'SCR_AFARIA_CERTIFICATE_REGISTRATION',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                        user : {
                            uiKey:'FLD_USER'
                        },
                        password : {
                            uiKey:'FLD_PASS',
                            type: 'password'
                        },
                        communicatorId : {
                            uiKey: 'FLD_COMMUNICATORID',
                            'default':'REST',
                            visible:false
                        }
            }
        },
        
        'SCR_AFARIA_USERPASS_REGISTRATION': {
            id: 'SCR_AFARIA_USERPASS_REGISTRATION',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                        user : {
                            uiKey:'FLD_USER'
                        },
                        password : {
                            uiKey:'FLD_PASS',
                            type: 'password'
                        },
                        communicatorId : {
                            uiKey: 'FLD_COMMUNICATORID',
                            'default':'REST',
                            visible:false
                        }
            }
        },
        
        'SCR_AFARIA_MANUAL_REGISTRATION': {
            id: 'SCR_AFARIA_MANUAL_REGISTRATION',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                        user : {
                            uiKey:'FLD_USER'
                        },
                        password : {
                            uiKey:'FLD_PASS',
                            type: 'password'
                        },
                        mobileUser : { //TODO paramname
                            uiKey:'FLD_MOBILE_USER'
                        },
                        activationCode : { //TODO paramname
                            uiKey:'FLD_ACTIVATION_CODE',
                            type: 'password'
                        },
                        communicatorId : {
                            uiKey: 'FLD_COMMUNICATORID',
                            'default':'REST',
                            visible:false
                        }
            }
        },
        
        
        'SCR_SET_PASSCODE_OPT_OFF': {
            id: 'SCR_SET_PASSCODE_OPT_OFF',
            nav: {
                submit: {
                } 
            },
            fields: {
                passcode: {
                    uiKey:'FLD_PASSCODE',
                    type: 'password',
                    'default': null,
                    visible:false
                },
                enable:{
                    uiKey:'FLD_ENABLE_PASSCODE',
                    type: 'button',
                    actionId: 'ENABLE',
                },
            }
        },
        
        'SCR_SET_PASSCODE_OPT_ON': {
                    id: 'SCR_SET_PASSCODE_OPT_ON',
                    nav: {
                        submit: {
                        } 
                    },
                    fields: {
                        passcode: {uiKey:'FLD_PASSCODE', type: 'password', confirm: ['SUBMIT']},
                        //confirmPasscode: {uiKey:'FLD_CONFIRM_PASSCODE', type: 'password'}
                        disable:{
                            uiKey:'FLD_DISABLE_PASSCODE',
                            type: 'button',
                            actionId: 'DISABLE',
                        },
                    }
        },
        
        'SCR_SET_PASSCODE_MANDATORY': {
                    id: 'SCR_SET_PASSCODE_MANDATORY',
                    nav: {
                        submit: {
                        } 
                    },
                    fields: {
                        passcode: {uiKey:'FLD_PASSCODE', type: 'password', confirm: ['SUBMIT']},
                        //confirmPasscode: {uiKey:'FLD_CONFIRM_PASSCODE', type: 'password'}
                    }
        },
        
        'SCR_CHANGE_PASSCODE_OPT_OFF': {
            id: 'SCR_CHANGE_PASSCODE_OPT_OFF',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                oldPasscode: {
                    uiKey:'FLD_PASSCODE',
                    type: 'password',
                    visible:true
				},
                passcode: {
                    uiKey:'FLD_NEWPASSCODE',
                    type: 'password',
                    'default': null,
                    visible:false
                },
                enable:{
                    uiKey:'FLD_ENABLE_PASSCODE',
                    type: 'button',
                    actionId: 'ENABLE',
                },
            }
        },
        
        'SCR_CHANGE_PASSCODE_OPT_ON': {
            id: 'SCR_CHANGE_PASSCODE_OPT_ON',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                oldPasscode: {
                    uiKey:'FLD_OLDPASSCODE',
                    type: 'password'
                },
                passcode: {uiKey:'FLD_NEWPASSCODE', type: 'password', confirm: ['SUBMIT']},
                //confirmPasscode: {uiKey:'FLD_CONFIRM_PASSCODE', type: 'password'}
                disable:{
                    uiKey:'FLD_DISABLE_PASSCODE',
                    type: 'button',
                    actionId: 'DISABLE',
                },
            }
        },
        
        'SCR_CHANGE_PASSCODE_MANDATORY': {
            id: 'SCR_CHANGE_PASSCODE_MANDATORY',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                oldPasscode: {
                    uiKey:'FLD_OLDPASSCODE',
                    type: 'password'
                },
                passcode: {uiKey:'FLD_NEWPASSCODE', type: 'password', confirm: ['SUBMIT']},
                //confirmPasscode: {uiKey:'FLD_CONFIRM_PASSCODE', type: 'password'}
            }
        },


        
        'SCR_MANAGE_PASSCODE_OPT_ON': {
            id: 'SCR_MANAGE_PASSCODE_OPT_ON',
            nav: {
                cancel: {
                } 
            },
            fields: {
                disable:{
                	uiKey:'ACT_DISABLE_PASSCODE',
                	type: 'button',
                	actionId: 'DISABLE',
                },
                change:{
                	uiKey:'ACT_CHANGE_PASSCODE',
                	type: 'button',
                	actionId: 'CHANGE',
                },
            }
        },
        'SCR_MANAGE_PASSCODE_OPT_OFF': {
            id: 'SCR_MANAGE_PASSCODE_OPT_OFF',
            nav: {
                cancel: {
                } 
            },
            fields: {
                enable:{
                	uiKey:'ACT_ENABLE_PASSCODE',
                	type: 'button', 
                	actionId: 'ENABLE',
                },
            }
        },
        'SCR_MANAGE_PASSCODE_MANDATORY': {
            id: 'SCR_MANAGE_PASSCODE_MANDATORY',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                change:{
                	uiKey:'ACT_CHANGE_PASSCODE',
                	type: 'button',
                	actionId: 'CHANGE',
                },
            }
        },

        
        'SCR_CHANGE_PASSWORD': {
            id: 'SCR_CHANGE_PASSWORD',
            nav: {
                submit: {
                }, 
                cancel: {
                } 
            },
            fields: {
                newPassword: {uiKey: 'FLD_NEWPASSWORD', type: 'password'}
            }
        },


        'SCR_ENTER_EMAIL': {
            id: 'SCR_ENTER_EMAIL',
            nav: {
                submit: {
                },
                cancel: {
                }
            },
            fields: {
                email: {uiKey: 'FLD_EMAIL'}
            }
        },
        
 
        
    }
    
    var getScreen = function (screenId) {
        return screens[screenId];
    }
    
    module.exports = {
        getScreen: getScreen
    }



});
