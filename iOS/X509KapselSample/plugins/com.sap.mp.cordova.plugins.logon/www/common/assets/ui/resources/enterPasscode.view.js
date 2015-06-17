sap.ui.jsview("enterPasscode", {

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
            var data = window.iab.context;
            if (data.unlockPasscode == null) {
                data.unlockPasscode = "";
            }

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

            var vbox = new sap.m.VBox('EnterPasscodeScreen');

            var inputPassword = new sap.m.Input( 'Password_item', {
                type:sap.m.InputType.Password,
                value:"{/unlockPasscode}",
                placeholder:getLocalizedString("SCR_ENTER_PASSCODE_INSTRUCTIONS"),
                liveChange:function() {
                    inputPassword.setValueState(sap.ui.core.ValueState.None);
                }
            });
            if (data.valueStateText != null) {
                inputPassword.setValueStateText(data.valueStateText);
                inputPassword.setValueState(sap.ui.core.ValueState.Error);
            }

            var dialogMaxRetries = new sap.m.Dialog('max_retries',{
                title:getLocalizedString("SCR_ENTER_PASSCODE_RETRY_LIMIT_REACHED")
            });
            var okButton = new sap.m.Button('okButton', {
                text:getLocalizedString("BUTTON_OK"),
                press:function(){console.log("Max Retries: " + JSON.stringify(data));window.iab.triggerEventForJsView("MAXRETRIES", data);}
            });
            dialogMaxRetries.addButton(okButton);
            var confirmMaxRetriesText = new sap.m.Text('max_retries_text',{
                text:getLocalizedString("SCR_ENTER_PASSCODE_MAX_RETRY_CONFIRM")
            });
            dialogMaxRetries.addContent(confirmMaxRetriesText);

            var buttonOKPress = function(){
                data.unlockPasscode = inputPassword.getValue();
                window.iab.triggerEventForJsView("SUBMIT", data);
            }
            var buttonOK = new sap.m.Button( 'button_ok', {
                type:sap.m.ButtonType.Emphasized,
                text:getLocalizedString("BUTTON_OK"),
                width:"100%",
                press : buttonOKPress
            });

            var dialogConfirmForgotPasscode = new sap.m.Dialog('confirm_forgot_passcode',{
                title:getLocalizedString("SCR_ENTER_PASSCODE_FORGOT_PASSCODE")
            });
            var lButton = new sap.m.Button('lButton', {
                text:getLocalizedString("BUTTON_OK"),
                press:function(){console.log("Forgot passcode: " + JSON.stringify(data));window.iab.triggerEventForJsView("FORGOT", data);}
            });
            var rButton = new sap.m.Button('rButton', {
                text:getLocalizedString("BUTTON_CANCEL"),
                press:function(){dialogConfirmForgotPasscode.close();}
            });
            dialogConfirmForgotPasscode.addButton(lButton);
            dialogConfirmForgotPasscode.addButton(rButton);
            var confirmForgotPasscodeText = new sap.m.Text('confirm_forgot_passcode_text',{
                text:getLocalizedString("SCR_ENTER_PASSCODE_FORGOT_PASSCODE_CONFIRM")
            });
            dialogConfirmForgotPasscode.addContent(confirmForgotPasscodeText);

            var buttonForgotPasscode = new sap.m.Button( 'button_forgotPasscode', {
                text:getLocalizedString("SCR_ENTER_PASSCODE_FORGOT_PASSCODE"),
                width:"100%",
                press : function(){
                    dialogConfirmForgotPasscode.open();
                }
            });

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height:"75px"
            });

            var vboxPlaceholder2 = new sap.m.HBox( 'vbox_placeholder2', {
                height:"25px"
            });

            vbox.addItem(vboxPlaceholder1);
            vbox.addItem(inputPassword);
            vbox.addItem(vboxPlaceholder2);
            vbox.addItem(buttonOK);
            vbox.addItem(buttonForgotPasscode);

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

            var footerHBox = new sap.m.HBox('panel_hbox', {
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
                inputPassword.focus();
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

            window.iab.setErrorText = function() {
                setTimeout(function(){
                    inputPassword.setValueStateText(getLocalizedString("SCR_ENTER_PASSCODE_INCORRECT_PASSCODE"));
                    inputPassword.setValueState(sap.ui.core.ValueState.Error);
                    inputPassword.focus();
                },400);
            }
			
			window.onkeyup = function(e) {
			    var key = e.keyCode ? e.keyCode : e.which;

			     if (key == 13) {
					 // GO button pressed on Android keyboard
			         buttonOKPress();
			     }
			}

            return vboxOuter;
    }
});
