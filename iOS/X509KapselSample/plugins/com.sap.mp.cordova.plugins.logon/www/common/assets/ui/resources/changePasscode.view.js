sap.ui.jsview("changePasscode", {

    getControllerName: function() {
        return null;
    },

    /**
     * 
     * @param oController may be null
     * @returns {sap.ui.cre.Control}
     */
    createContent: function(oController) {
            var jsView = this;
            var passcodeValid = false;
            var valueStateErrorControl = null;

            var isObjectEmpty = function(object) {
                var key;
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            }

            var checkBoolean = function(anObject, key) {
                if (anObject && anObject.hasOwnProperty(key) && anObject[key]) {
                    if (typeof anObject[key] == "string") {
                        // It is a string.  If the string is "false" then return false.
                        return anObject[key].toLowerCase() != "false";
                    } else {
                        return true;
                    }
                }
                return false;
            }

            var isDefaultPolicy = function(passcodePolicy) {
                if (    passcodePolicy.minLength != 8 || 
                        checkBoolean(passcodePolicy,"hasUpperCaseLetters") ||
                        checkBoolean(passcodePolicy,"hasLowerCaseLetters") ||
                        checkBoolean(passcodePolicy,"hasSpecialLetters") ||
                        checkBoolean(passcodePolicy,"hasDigits") ||
                        (passcodePolicy.hasOwnProperty("minUniqueChars") && passcodePolicy.minUniqueChars > 0) ||
                        !checkBoolean(passcodePolicy,"defaultAllowed") ) {
                    return false;
                }
                return true;
            }

            var updatePasscodePolicyTextAndChecks = function(passcodePolicy, currentPasscode, rulesTextControl, checksTextControl){
                console.log("passcode policy: " + JSON.stringify(passcodePolicy));
                // set passcodeValid to true.  If any of the conditions are not met it will be set to false.
                passcodeValid = true;
                if (passcodePolicy == null || isObjectEmpty(passcodePolicy) || isDefaultPolicy(passcodePolicy)) {
                    checksTextControl.setText("");
                    rulesTextControl.setText(getLocalizedString("SCR_SET_PASSCODE_DEFAULT_RULE"));
                    rulesTextControl.setTextAlign(sap.ui.core.TextAlign.Left);
                    return;
                }
                var text = getLocalizedString("SCR_SET_PASSCODE_RULE_STRING");
                var checks = "\n";
                var checkMark = "\u2713";
                if (passcodePolicy.hasOwnProperty("minLength")) {
                    var minLength = passcodePolicy["minLength"];
                    text += getLocalizedString("SCR_SET_PASSCODE_RULE_MINIMUM") + " " + minLength + " " + getLocalizedString("SCR_SET_PASSCODE_RULE_CHARACTERS") + " ";
                    if (currentPasscode.length >= minLength) {
                        checks += checkMark;
                    } else {
                        passcodeValid = false;
                    }
                    checks += "\n";
                    text += "\n";
                }
                if (checkBoolean(passcodePolicy,"hasUpperCaseLetters")) {
                    text += getLocalizedString("SCR_SET_PASSCODE_RULE_UPPER_CASE") + " ";
                    if (currentPasscode.match(/[A-Z]/) != null) {
                        checks += checkMark;
                    } else {
                        passcodeValid = false;
                    }
                    checks += "\n";
                    text += "\n";
                }
                if (checkBoolean(passcodePolicy,"hasLowerCaseLetters")) {
                    text += getLocalizedString("SCR_SET_PASSCODE_RULE_LOWER_CASE") + " ";
                    if (currentPasscode.match(/[a-z]/) != null) {
                        checks += checkMark;
                    } else {
                        passcodeValid = false;
                    }
                    checks += "\n";
                    text += "\n";
                }
                if (checkBoolean(passcodePolicy,"hasSpecialLetters")) {
                    text += getLocalizedString("SCR_SET_PASSCODE_RULE_SPECIAL_CHARACTER") + " ";
                    if (currentPasscode.match(/[^a-zA-Z0-9]/) != null) {
                        checks += checkMark;
                    } else {
                        passcodeValid = false;
                    }
                    checks += "\n";
                    text += "\n";
                }
                if (checkBoolean(passcodePolicy,"hasDigits")) {
                    text += getLocalizedString("SCR_SET_PASSCODE_RULE_DIGITS") + " ";
                    if (currentPasscode.match(/[0-9]/) != null) {
                        checks += checkMark;
                    } else {
                        passcodeValid = false;
                    }
                    checks += "\n";
                    text += "\n";
                }
                if (passcodePolicy.hasOwnProperty("minUniqueChars")) {
                    var minUniqueChars = passcodePolicy["minUniqueChars"];
                    if (minUniqueChars > 0) {
                        text += getLocalizedString("SCR_SET_PASSCODE_RULE_MINIMUM") + " " + minUniqueChars + " " + getLocalizedString("SCR_SET_PASSCODE_RULE_UNIQUE_CHARACTERS") + " ";
                        var charsAsKeys = {};
                        var actualUniqueChars = 0;
                        for (var i = 0; i < currentPasscode.length; i++ ){
                            var currentChar = currentPasscode.substring(i, i+1);
                            if (!charsAsKeys[currentChar]) {
                                charsAsKeys[currentChar] = true;
                                actualUniqueChars++;
                                if (actualUniqueChars >= minUniqueChars) {
                                    break;
                                }
                            }
                        }
                        if (actualUniqueChars >= minUniqueChars) {
                            checks += checkMark;
                        } else {
                            passcodeValid = false;
                        }
                        checks += "\n";
                        text += "\n";
                    }
                }
                rulesTextControl.setText(text);
                checksTextControl.setText(checks);
            }

            var data = window.iab.context;
            if (data.passcode == null) {
                data.passcode = "";
            }
            if (data.passcode_CONFIRM == null) {
                data.passcode_CONFIRM = "";
            }
            if (data.oldPasscode == null) {
                data.oldPasscode = "";
            }
            if (data.passcodeEnabled == null) {
                data.passcodeEnabled = true;
            }
            var oldPasscodeEnabled = data.passcodeEnabled;

            // create JSON model instance
            var oModel = new sap.ui.model.json.JSONModel();
            // set the data for the model
            oModel.setData(data);
            // set the model to the core
            sap.ui.getCore().setModel(oModel);

            // This function calculates how wide the vbox containing all the controls should be.
            var calculateDisplayWidth = function(totalWidth) {
                var displayWidth = 0;
                if (totalWidth <= 360) {
                    displayWidth = totalWidth*0.9;
                } else {
                    // On a wide screen, use a little more space
                    displayWidth = 324 + ((totalWidth - 360)*0.1);
                }
                return Math.round(displayWidth);
            }

            var vbox = new sap.m.VBox('changePasscodeScreen');

            var passcodePolicy = window.iab.context.policyContext;

            var inputPassword = new sap.m.Input( 'Password_item', {
                type:sap.m.InputType.Password,
                value:"{/passcode}",
                placeholder:getLocalizedString("SCR_CHANGE_PASSCODE_PLACEHOLDER_PASSCODE"),
                visible:data.passcodeEnabled,
                liveChange:function(){
                    inputPasswordConfirm.setValueState(sap.ui.core.ValueState.None);
                    inputPassword.setValueState(sap.ui.core.ValueState.None);
                    valueStateErrorControl = null;
                    updatePasscodePolicyTextAndChecks(passcodePolicy, this.getValue(), policyText, policyChecks);
                }
            });

            var inputPasswordConfirm = new sap.m.Input( 'Password_confirm_item', {
                type:sap.m.InputType.Password,
                value:"{/passcode_CONFIRM}",
                placeholder:getLocalizedString("SCR_CHANGE_PASSCODE_PLACEHOLDER_CONFIRM_PASSCODE"),
                visible:data.passcodeEnabled,
                liveChange:function(){
                    inputPasswordConfirm.setValueState(sap.ui.core.ValueState.None);
                    inputPassword.setValueState(sap.ui.core.ValueState.None);
                    valueStateErrorControl = null;
                }
            });

            var buttonOK = new sap.m.Button( 'button_ok', {
                type:sap.m.ButtonType.Emphasized,
                text:getLocalizedString("BUTTON_OK"),
                width:"100%",
                press : function(){
                    data.passcode = inputPassword.getValue();
                    data.passcode_CONFIRM = inputPasswordConfirm.getValue();
                    data.oldPasscode = oldPasscode.getValue();
                    if (buttonEnable.getVisible()) {
                        // The passcode is disabled so don't validate it, just submit.
                        window.iab.triggerEventForJsView("SUBMIT", data);
                    } else if (!passcodeValid) {
                        // passcode doesn't meet all the requirements
                        // Do the work in a setTimeout because otherwise the button steals the
                        // focus back (and if the focus is not on the input control then the
                        // value state text is not visible).
                        setTimeout(function(){
                            inputPassword.setValueStateText('Passcode does not meet requirements');
                            inputPassword.setValueState(sap.ui.core.ValueState.Error);
                            valueStateErrorControl = inputPassword;
                            valueStateErrorControl.focus();
                        },300);
                    } else if (inputPasswordConfirm.getValue() !== inputPassword.getValue()) {
                        // passcodes do not match
                        // Do the work in a setTimeout because otherwise the button steals the
                        // focus back (and if the focus is not on the input control then the
                        // value state text is not visible).
                        setTimeout(function(){
                            inputPasswordConfirm.setValueStateText('Passcodes must match');
                            inputPasswordConfirm.setValueState(sap.ui.core.ValueState.Error);
                            valueStateErrorControl = inputPasswordConfirm;
                            valueStateErrorControl.focus();
                        },300);
                    } else {
                        // The passcode is enabled, meets requirements, and matches.  Submit it.
                        window.iab.triggerEventForJsView("SUBMIT", data);
                    }
                }
            });

            var policyText = new sap.m.Text( 'passcode_policy_text', {
                textAlign:sap.ui.core.TextAlign.Right
            });
            var policyChecks = new sap.m.Text( 'passcode_policy_checks', {});
            updatePasscodePolicyTextAndChecks(passcodePolicy, inputPassword.getValue(), policyText, policyChecks);
            var toolbarLabel = new sap.m.Label( 'passcode_policy_toolbar_label', {
                text: getLocalizedString("SCR_CHANGE_PASSCODE_TITLE"),
                design: sap.m.LabelDesign.Bold
            });
            var panelToolbar = new sap.m.Toolbar( 'passcode_policy_toolbar', {
                design: sap.m.ToolbarDesign.Solid,
                content: [toolbarLabel]
            });
            var panelHBox = new sap.m.HBox('panel_hbox', {
                items: [policyText, policyChecks]
            });
            var panel = new sap.m.Panel( 'passcode_policy_panel', {
                headerToolbar:panelToolbar,
                content: [panelHBox],
                visible: data.passcodeEnabled
            });

            var buttonEnable = new sap.m.Button( 'button_enable', {
                text:getLocalizedString("SCR_CHANGE_PASSCODE_ENABLE"),
                width:"100%",
                visible:!data.passcodeEnabled,
                press:function(){
                    data.passcodeEnabled = true;
                    this.setVisible(false);
                    panel.setVisible(true);
                    inputPassword.setVisible(true);
                    inputPasswordConfirm.setVisible(true);
                    buttonDisable.setVisible(true);
                    window.iab.triggerEventForJsView("ENABLE", data);
                }
            });

            var buttonDisable = new sap.m.Button( 'button_disable', {
                text:getLocalizedString("SCR_SET_PASSCODE_DISABLE_PASSCODE"),
                width:"100%",
                visible:!data.passcodePolicy || (data.passcodePolicy.defaultAllowed && data.passcodePolicy.defaultAllowed.toLowerCase()=="true"),
                press:function(){
                    data.passcodeEnabled = false;
                    this.setVisible(false);
                    panel.setVisible(false);
                    inputPassword.setVisible(false);
                    inputPasswordConfirm.setVisible(false);
                    buttonEnable.setVisible(true);
                    window.iab.triggerEventForJsView("DISABLE", data);
                }
            });
            
            var oldPasscode = new sap.m.Input( 'input_old_passcode', {
                type:sap.m.InputType.Password,
                value:"{/oldPasscode}",
                placeholder:getLocalizedString("SCR_CHANGE_PASSCODE_ENTER_CURRENT_PASSCODE"),
                visible: oldPasscodeEnabled,
                liveChange:function(){
                    oldPasscode.setValueState(sap.ui.core.ValueState.None);
                }
            });
            if (data.valueStateText != null) {
                oldPasscode.setValueStateText(data.valueStateText);
                oldPasscode.setValueState(sap.ui.core.ValueState.Error);
            }

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height:"25px"
            });

            var vboxPlaceholder2 = new sap.m.HBox( 'vbox_placeholder2', {
                height:"10px"
            });

            var vboxPlaceholder3 = new sap.m.HBox( 'vbox_placeholder3', {
                height:"25px"
            });

            vbox.addItem(vboxPlaceholder1);
            vbox.addItem(panel);
            vbox.addItem(vboxPlaceholder2);
            vbox.addItem(inputPassword);
            vbox.addItem(inputPasswordConfirm);
            vbox.addItem(vboxPlaceholder3);
            vbox.addItem(buttonOK);
            vbox.addItem(buttonDisable);
            vbox.addItem(buttonEnable);

            vboxPageContent = new sap.m.VBox('vbox_content', {
                alignItems:sap.m.FlexAlignItems.Center,
                justifyContent:sap.m.FlexJustifyContent.Start,
                items:[vbox]
            });

            var sapLogo = new sap.m.Image( 'sap_logo', {
                src:"img/sapLogo.png",
                height:"40px"
            });

            var copyright = new sap.m.Text( 'copyright', {
                text:getLocalizedString("COPYRIGHT")
            });

            var footerHBox = new sap.m.HBox('panel_footer_hbox', {
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                width: "90%",
                items: [sapLogo, copyright]
            });

            vboxOuter = new sap.m.FlexBox('vbox_outer', {
                direction:sap.m.FlexDirection.Column,
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                alignItems:sap.m.FlexAlignItems.Center,
                items:[vboxPageContent, footerHBox],
                fitContainer: true
            });

            // If the screen width is available, pre-calculate how wide the vbox should be
            // so that the user can't see it draw as the wrong size then quickly redraw as
            // the correct size.
            if ($(window).width()) {
                vbox.setWidth(calculateDisplayWidth($(window).width()) + "px");
                copyright.setWidth(Math.round($(window).width()/2) + "px");
            }

            sap.ui.core.ResizeHandler.register(vboxOuter, function(e){
                vbox.setWidth(calculateDisplayWidth(e.size.width) + "px");
                copyright.setWidth(Math.round(e.size.width/2) + "px");
                var domRef = jsView.getDomRef();
                if( $(window).height() && $(window).height() > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    jsView.setHeight($(window).height() + "px");
                }
            });

            vboxOuter.onAfterRendering = function() {
                var inputs = this.$().find(':input');
                inputs.attr('autocapitalize', 'off');
                inputs.attr('autocorrect', 'off');
                inputs.attr('autocomplete', 'off');
                if (valueStateErrorControl != null) {
                    valueStateErrorControl.focus();
                } else {
                    inputPassword.focus();
                }
                sap.m.FlexBox.prototype.onAfterRendering.apply(this, arguments);
            }
            window.iab.page.setShowHeader(false);
            this.onAfterRendering = function() {
                var domRef = this.getDomRef();
                var newHeight = $(window).height();
                if (window.iab.heightWithoutKeyboard != null) {
                    // If we know the height of the screen without the keyboard, use that
                    // (since the keyboard will affect $(window).height()).
                    newHeight = window.iab.heightWithoutKeyboard;
                }
                if( newHeight && newHeight > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    this.setHeight(newHeight + "px");
                }
            }
            return vboxOuter;

    }
});
