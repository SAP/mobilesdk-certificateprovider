sap.ui.jsview("chooseDemoMode", {

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

            var vbox = new sap.m.VBox('ChooseDemoMode');

            var toolbarLabel = new sap.m.Label( 'passcode_policy_toolbar_label', {
                text: getLocalizedString("SCH_CHOOSE_DEMO_MODE_TITLE")
            });
            toolbarLabel.onAfterRendering = function() {
                titleDomRef = toolbarLabel.getDomRef();
                titleDomRef.style.fontSize="24px";
                titleDomRef.style.color="black";
            }

            var helpText = "\n" + getLocalizedString("SCR_CHOOSE_DEMO_MODE_EXPLAIN_FIORI_CLIENT") + "\n\n" + getLocalizedString("SCR_CHOOSE_DEMO_MODE_EXPLAIN_DEMO_MODE");
            var helpTextControl = new sap.m.Text( 'demo_mode_text', {
                text:helpText
            });
            var panelVBox = new sap.m.VBox('panel_vbox', {
                items: [toolbarLabel, helpTextControl]
            });
            var panel = new sap.m.Panel( 'demo_mode_description_panel', {
                content: [panelVBox]
            });

            if (!window.iab.busy){
                window.iab.busy = new sap.m.BusyDialog('busy_indicator', {});
            }

            var buttonLogInPress = function() {
                data.demoMode = false;
                window.iab.triggerEventForJsView("SUBMIT", data);
            }

            var buttonLogIn = new sap.m.Button( 'button_log_in', {
                type:sap.m.ButtonType.Emphasized,
                text:getLocalizedString("SCR_CHOOSE_DEMO_MODE_LOG_IN"),
                width:"100%",
                press : buttonLogInPress
            });

            var buttonUseDemoModePress = function() {
                data.demoMode = true;
                window.iab.triggerEventForJsView("SUBMIT", data);
            }

            var buttonUseDemoMode = new sap.m.Button( 'button_use_demo_mode', {
                text:getLocalizedString("SCR_CHOOSE_DEMO_MODE_USE_DEMO_MODE"),
                width:"100%",
                press : buttonUseDemoModePress
            });

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height:"40px"
            });

            var vboxPlaceholder2 = new sap.m.HBox( 'vbox_placeholder2', {
                height:"15px"
            });

            var vboxPlaceholder3 = new sap.m.HBox( 'vbox_placeholder3', {
                height:"15px"
            });

            vbox.addItem(vboxPlaceholder1);
            vbox.addItem(panel);
            vbox.addItem(vboxPlaceholder2);
            vbox.addItem(buttonLogIn);
            vbox.addItem(vboxPlaceholder3);
            vbox.addItem(buttonUseDemoMode);

            var titleDomRef = toolbarLabel.getDomRef();

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
                alignItems:sap.m.FlexAlignItems.Start,
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

            window.iab.page.setShowHeader(false);
            window.iab.heightWithoutKeyboard = null;
            this.onAfterRendering = function() {
                var domRef = this.getDomRef();
                if( $(window).height() && $(window).height() > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    this.setHeight($(window).height() + "px");
                    window.iab.heightWithoutKeyboard = $(window).height();
                }
            }
            
            return vboxOuter;
    }
});
