sap.ui.jsview("x509ProviderUI", {
        
	getControllerName: function() {
		return null;
	},

	/**
	 * 
	 * @param oController may be null
	 * @returns {sap.ui.cre.Control}
	 */
	createContent: function(oController) {
            var screenId = window.iab.context.viewID;

            var data ={
                filepath:window.iab.context.settings.filepath,
                password:""
            };
        
            // create JSON model instance
            var oModel = new sap.ui.model.json.JSONModel();
            // set the data for the model
            oModel.setData(data);
            // set the model to the core
            sap.ui.getCore().setModel(oModel);

            var vbox = new sap.m.VBox('smpLogon');
            vbox.setFitContainer(true);
            vbox.setJustifyContent(sap.m.FlexJustifyContent.Center);
            vbox.onAfterRendering = function() {
                var inputs = this.$().find(':input');
                inputs.attr('autocapitalize', 'off');
                inputs.attr('autocorrect', 'off');
                inputs.attr('autocomplete', 'off');
                sap.m.FlexBox.prototype.onAfterRendering.apply(this, arguments);
              
            }
            var bar = window.iab.page.getCustomHeader();
            if(!bar) {
                bar = new sap.m.Bar(screenId + '_buttons');
                window.iab.page.setCustomHeader(bar);
            }
            bar.destroyContentLeft();
            bar.destroyContentRight();
            bar.destroyContentMiddle();
            var button = new sap.m.Button("BTN_CANCEL",
                                          {
                                          text : window.iab.getLocalizedString("BTN_CANCEL"),
                                          press : function(){ window.iab.triggerEvent("CANCEL")}
                                          });
             bar.addContentLeft(button);
             var button = new sap.m.Button("BTN_SUBMIT",
                                           {
                                           text : window.iab.getLocalizedString("BTN_SUBMIT"),
                                           press : function(){window.iab.triggerEvent("SUBMIT", JSON.stringify(data));}
                                           });
            bar.addContentRight(button);
            var title = new sap.m.Label();
            title.setText(window.iab.getLocalizedString("CertificateProvider_TITLE"));
            title.setDesign(sap.m.LabelDesign.Bold);
            bar.addContentMiddle(title);
            
            inputList = new sap.m.List('smpList');
            inputList.setInset(true);
       
            var inputListItem = new sap.m.InputListItem( 'Path_item');
            inputField = new sap.m.Input('Path_item_text',{
                                         value: "{/filepath}"
                                         });
                        
            
            inputField.setType(sap.m.InputType.Text);
            //inputField.setValue("my path");
            inputListItem.setLabel(window.iab.getLocalizedString("CertificatePath_TEXT"));
            inputListItem.addContent(inputField);
            inputList.addItem(inputListItem);
            
            var inputListItem = new sap.m.InputListItem( 'Password_item');
            inputField = new sap.m.Input('Password_item_text',{
                                         value:"{/password}"
                                         });
            
            inputField.setType(sap.m.InputType.Text);
            inputListItem.setLabel(window.iab.getLocalizedString("CertificatePassword_TEXT"));
            inputListItem.addContent(inputField);
            inputList.addItem(inputListItem);
            vbox.addItem(inputList);
            return vbox;
         
    }
});