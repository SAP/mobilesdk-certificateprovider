


if (!window.sap) window.sap = {};

//TODO temporary workaround for missing console log in child window
if (!window.iab) {
    window.iab = {};
    window.iab.triggerEventForJsView = triggerEventForJsView;
}

if (!iab.log) {
    iab.log = function(message){
        //interferes with parent/child communication
        //triggerEvent('LOG', JSON.stringify({msg:message}));
    };
}


sap.LogonForm = function () {

    jQuery.sap.require("sap.m.MessageBox");
    jQuery.sap.require("sap.m.BusyDialog");
	
    var root;

	var inputByKey;
	var buttonsByActionId;
	
	var vbox;
	
	var busy;
	
	var inputList;
	var page;
	
	// array for the storing the actions for fields to be confirmed; key is the
	// action, value is the array of fields
	var fieldConfirmationMap = {};
	
	var confirmationLabelMap = {};
	
	var app = new sap.m.App();
	var page = new sap.m.Page();
	page.setShowHeader(true);


	app.addPage(page);
	app.setInitialPage(page);

    
   var init = function (targetDiv, style) {
        root = targetDiv;
        app.placeAt(root);
        window.iab.app = app;
        if (style === "fiori") {
            app.setBackgroundImage('img/background.jpg'); // display the fiori backrgound only if legacy mode is not enabled. 
        }
	}
    
    var getLocalizedString;

    if (typeof jQuery === 'undefined' || typeof jQuery.sap === 'undefined') {
        getLocalizedString = function(key){
            return key;
        }
    }
    else {
        jQuery.sap.require("jquery.sap.resources");
        var locale = sap.ui.getCore().getConfiguration().getLanguage();
        var i18n = jQuery.sap.resources({'url' : "../i18n/i18n.properties", 'locale': locale});
        var i18nProvider = jQuery.sap.resources({'url' : "../i18n/i18n.provider.properties", 'locale': locale});
        getLocalizedString = function(key){
            var localizedValue = i18n.getText(key);
            if (localizedValue == key){
               //try to get the localized string from provider's resource to get value
               localizedValue = i18nProvider.getText(key);
            }
            return localizedValue;
        }
    }

	
	var getValues = function () {
		var result = {};
		
		for (inputKey in inputByKey) {
			var inputField = inputByKey[inputKey];
			result[inputKey] = inputField.getValue();
		}
        
        iab.log(JSON.stringify(result))
		return result;
	}

    var DEFAULT_CONTEXT = {};
               
    var setDefaultValues = function(){
        for (inputKey in inputByKey) {
            if (DEFAULT_CONTEXT[inputKey]) {
                iab.log('setting default for ' + inputKey);
                var inputField = inputByKey[inputKey];
                inputField.setValue(DEFAULT_CONTEXT[inputKey]);
            }
		}
    }
    
    var confirmAction = function(confirmKey, onconfirm) {
		iab.log('LogonForm.confirmAction');
    	sap.m.MessageBox.show(
    			getLocalizedString(confirmKey + '_MSG'),
    		    sap.m.MessageBox.Icon.NONE,
    		    getLocalizedString(confirmKey + '_TITLE'),
    		    [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
    		    function(oResponse) { 
    				if (oResponse === sap.m.MessageBox.Action.OK) {
    					onconfirm();
    				}
    			}
    		);
    }

    
    var close = function(){
        iab.log('TODO implement close(), if needed');
    }
    
    
    //TODO break into smaller functions
    var showScreen = function (uiDescriptor, onActionCallback, context) {
        iab.log('showScreen enter');
		iab.log(JSON.stringify(uiDescriptor));
	 
        if (uiDescriptor.viewID){
            //destroy old view
            if (typeof vbox === 'object' && vbox !== null) {
                vbox.destroy();
            }
            window.iab.page= page;
	        window.iab.triggerEvent = onActionCallback;
            window.iab.context = context;
            window.iab.getLocalizedString = getLocalizedString;
            vbox = sap.ui.view({id:uiDescriptor.viewID,viewName:uiDescriptor.viewID, type:sap.ui.core.mvc.ViewType.JS});
           
            if(busy) {
                busy.close();
                busy.destroy();
                busy = null;
            }
            if (window.iab.busy) {
                window.iab.busy.close();
            }
        
            page.addContent(vbox);
     
            return;
        }
        
        
        if( context ){
        	DEFAULT_CONTEXT = context;
        }
    
	     
        var onAction = function() {


            var actionKey = arguments[0];

            iab.log('LogonForm onAction: ' + actionKey);

			if (arguments.length > 1) {
				var params = arguments[1];
	            iab.log('LogonForm onAction params: ' + params);
				// var context = JSON.parse(params);
				var fieldsToConfirm = fieldConfirmationMap[actionKey];
				if (fieldsToConfirm) {
					for ( var i = 0; i < fieldsToConfirm.length; i++) {

						var fieldKeyToConfirm = fieldsToConfirm[i];

						var fieldValue = inputByKey[fieldKeyToConfirm]
								.getValue();
						var fieldConfValue = inputByKey[fieldKeyToConfirm
								+ '_CONFIRM'].getValue();

						if (fieldValue != fieldConfValue) {
							validationPassed = false;
							jQuery.sap.require("sap.m.MessageBox");
							
							var messagetext = getLocalizedString('FIELD_VALIDATION_FAILED');
							messagetext = messagetext.replace('{0}', confirmationLabelMap[fieldKeyToConfirm]);
							messagetext = messagetext.replace('{1}', confirmationLabelMap[fieldKeyToConfirm + '_CONFIRM']);
							
							sap.m.MessageBox.show(messagetext,
									sap.m.MessageBox.Icon.NONE, getLocalizedString('VALIDATION_FAILURE'), [ sap.m.MessageBox.Action.OK], null);
							return;
						}
					}
				}
                if(busy) {
                    busy.open();
                }

			}

			onActionCallback.apply(this, arguments);
		}
        
		var screenId = uiDescriptor.id;
		var fields = uiDescriptor.fields;
		var actions = uiDescriptor.actions;

		inputByKey = {};
		buttonsByActionId = {};
        fieldConfirmationMap = {};

		iab.log('typeof vbox: ' + typeof vbox);
		
		
//		if (typeof page === 'object' && page !== null) {
//			page.destroy();
//		}
		if (typeof vbox === 'object' && vbox !== null) {
			vbox.destroy();
		}
		//$('#'+targetDiv).empty();
		
		//TODO record DOM id of logon root tag in docs
		vbox = new sap.m.VBox('smpLogon');
        vbox.onAfterRendering = function() {
            var inputs = this.$().find(':input');
            iab.log('inputs count: ' + inputs.length);
            inputs.attr('autocapitalize', 'off');
            inputs.attr('autocorrect', 'off');
            inputs.attr('autocomplete', 'off');
            sap.m.FlexBox.prototype.onAfterRendering.apply(this, arguments);
            //TODO remove debug code
//            var serializedString = '';
//            var elements = this.$().find('li').each(function() {
//            	serializedString = serializedString + this.outerHTML;
//            }); 
//            triggerEvent('LOG', JSON.stringify({'msg' : serializedString}));
            // end of debug code
        }
		
		vbox.addStyleClass(screenId);
		vbox.setFitContainer(true);
		vbox.setJustifyContent(sap.m.FlexJustifyContent.Center);
		
		iab.log('uiDescriptor.actions');
		iab.log(JSON.stringify(uiDescriptor.actions));

		var bar = page.getCustomHeader();
		if(!bar) {
			bar = new sap.m.Bar(screenId + '_buttons');
			page.setCustomHeader(bar);
		}
		bar.destroyContentLeft();
		bar.destroyContentRight();
		bar.destroyContentMiddle();

		if(uiDescriptor.nav) {
			addNavigationButton(onAction, screenId, uiDescriptor.nav.cancel, 'CANCEL', bar);
			addNavigationButton(onAction, screenId, uiDescriptor.nav.submit, 'SUBMIT', bar);
		}
		var screenTitleKey = screenId + '_SCREEN_TITLE';
		var screenTitleText = getLocalizedString(screenTitleKey);
		if(screenTitleKey != screenTitleText) {
			var title = new sap.m.Label();
			title.setText(screenTitleText);
			//title.setDesign(sap.m.LabelDesign.Bold);
			bar.addContentMiddle(title);
    	}

		//vbox.addItem(bar);
		iab.log('button bar added to vbox');
		
		
		var headerListItem = new sap.m.CustomListItem();
		headerListItem.addStyleClass("smpHeaderListItem");
		
		var headerBox = new sap.m.VBox(screenId + '_HEADER_BOX');
		headerListItem.addContent(headerBox);
		
		headerBox.addStyleClass("smpHeaderBox");
		headerBox.setAlignItems(sap.m.FlexAlignItems.Start);
		
		var headerTitleString = getLocalizedString(screenId + '_HEADER_TITLE');
		if (headerTitleString != (screenId + '_HEADER_TITLE')) {
			var headerTitle = new sap.m.Label();
			headerTitle.setText(headerTitleString);
			headerTitle.setDesign(sap.m.LabelDesign.Bold);
			headerTitle.setTextAlign(sap.ui.core.TextAlign.Left);
			headerTitle.setWidth('100%');
			headerBox.addItem(headerTitle);
		}
		
		var headerTextString = getLocalizedString(screenId + '_HEADER_TEXT');
		if(headerTextString != (screenId + '_HEADER_TEXT')) {
			var headerText = new sap.m.Text();
			headerText.setText(headerTextString);
			headerText.setTextAlign(sap.ui.core.TextAlign.Left);
			headerText.setWidth('100%');
			headerBox.addItem(headerText);
		}
		
		inputList = new sap.m.List('smpList');
        inputList.setInset(true);
        inputList.addItem(headerListItem);

		//inputList.setWidth('65%');
		fieldList = Object.keys(uiDescriptor.fields);
		var first; // reference to the 1st textfield or text area. Required to gain focus on windows.
		for (fieldIdx in fieldList) {

			//var fieldKey = function(v){return v;}(inputList[inputIdx]);
			var fieldKey = fieldList[fieldIdx];
			iab.log('add InputListItem ' + fieldKey);
            
            var fieldDescriptor = uiDescriptor.fields[fieldKey];
            var uiKey = fieldDescriptor.uiKey;
            
			var fieldLabel;
            
            if (fieldDescriptor.label) {
                fieldLabel = fieldDescriptor.label
            }
            else if (fieldDescriptor.uiKey) {
                if (false) {}
                else {
                    fieldLabel = getLocalizedString(fieldDescriptor.uiKey + '_LABEL')
                }
            }
            else {
                iab.log('Missing uiKey.');
                fieldLabel = '';
            }
			
             if(fieldDescriptor.type === 'textarea') {
                var listItemLabel = new sap.m.CustomListItem(uiKey + '_label');
                var label = new sap.m.Label();
                label.setText(fieldDescriptor.label);
                listItemLabel.addContent(label);
               
				var listItemValue = new sap.m.CustomListItem(uiKey + '_value');
                var area = new sap.m.TextArea();
                area.setValue(fieldDescriptor.value);
                //area.setWidth('100%');
                if (fieldDescriptor.disabled) {area.setEnabled(false);}
                listItemValue.addContent(area);
                
               
                                
                inputList.addItem(listItemLabel);
                inputList.addItem(listItemValue);
                iab.log(uiKey + ' textarea added to list');
                // get a reference to the 1st text field. 
                if (!first) {
                    first = area;
                }

			}
             else if(fieldDescriptor.type === 'action' && fieldDescriptor.actionId) {
                 var actionListItem = new sap.m.ActionListItem(uiKey + '_action');
                 actionListItem.setText(fieldLabel);
                 
                 if (fieldDescriptor.styleClass) {
                 	actionListItem.addStyleClass(fieldDescriptor.styleClass);
                 }
                 
                 var actionMethod = getConfirmedOnAction(onAction, fieldDescriptor.confirmKey, fieldDescriptor.actionId);
                
                 //actionListItem.attachTap(actionMethod);
                 actionListItem.attachPress(actionMethod);
                 //actionListItem.attachDetailTap(actionMethod);
                 //actionListItem.attachDetailPress(actionMethod);
                
                 inputList.addItem(actionListItem);
                 iab.log(uiKey + ' action added to list');
             }
             else if(fieldDescriptor.type === 'button' && fieldDescriptor.actionId) {
            	 var buttonListItem = new sap.m.CustomListItem(uiKey + '_button');
                 var button = new sap.m.Button();
                 button.setText(getLocalizedString(fieldDescriptor.uiKey + "_LABEL"));
                 button.setType(sap.m.ButtonType.Default);
                 button.setWidth('100%');
                 if (fieldDescriptor.disabled) {button.setEnabled(false);}
                 buttonListItem.addContent(button);
                 
                 if (fieldDescriptor.styleClass) {
                	 buttonListItem.addStyleClass(fieldDescriptor.styleClass);
                 }
                 
                 var actionMethod = getConfirmedOnAction(onAction, fieldDescriptor.confirmKey, fieldDescriptor.actionId);
                
                 button.attachPress(actionMethod);
                 
                 inputList.addItem(buttonListItem);
                 iab.log(uiKey + ' button added to list');
             }
             else {
                var inputListItem = new sap.m.InputListItem(uiKey + '_item');
                //var inputField = new sap.m.Input(utils.forceEval(uiKey));
                var inputField;

            
                if(fieldDescriptor.type === 'switch') {
                    inputField = new sap.m.Switch(uiKey);
                    inputField.getValue = function(){
					//return this.getSelected();
                    return this.getState();
                    };
                    inputField.setValue = function(value){
                        //return this.setSelected();
                        if (typeof value === 'boolean') {
                            this.setState(value);
                        }
                        else if (typeof value === 'string') {
                            this.setState(value == 'true');
                        }
                    };
                    inputListItem.setLabel(fieldLabel);
                }
                else {
                    inputField = new sap.m.Input(uiKey);
                                    // get a reference to the 1st text field. 
                    if (!first) {
                        first = inputField;
                    }

                    if (fieldDescriptor.type === 'number') {
                        inputField.setType(sap.m.InputType.Number);
                    } else if (fieldDescriptor.type === 'password') {
                        inputField.setType(sap.m.InputType.Password);
                        //inputListItem.setLabel(uiDescriptor.fields[uiKey]);
                    } else {
                        inputField.setType(sap.m.InputType.Text);
                    }
				
                    inputListItem.setLabel(fieldLabel);
               
               
                    var placeholderText;
               
                    var phKey1 = screenId + '_' + fieldDescriptor.uiKey + '_PLACEHOLDER';
                    var phKey2 = fieldDescriptor.uiKey + '_PLACEHOLDER';
                    var phKeyDefault = 'DEFAULT_PLACEHOLDER';
               
                    placeholderText = getLocalizedString(phKey1);
                    if (placeholderText === phKey1) { //phKey1 not found
                        placeholderText = getLocalizedString(phKey2);
                    }
                    if (placeholderText === phKey2) { //phKey2 not found
                        placeholderText = getLocalizedString(phKeyDefault);
                    }
                    if (placeholderText === phKeyDefault) { //phKeyDefault not found
                        placeholderText = ''
                    }
                    else {
                        placeholderText = placeholderText.replace('{0}', fieldLabel);
                    }
               
                    iab.log(placeholderText);
                    inputField.setPlaceholder(placeholderText);
                }
               
                if (typeof fieldDescriptor['default'] !== 'undefined'){
                    inputField.setValue(fieldDescriptor['default']);
                }
               
                if (typeof fieldDescriptor.enabled === 'boolean'){
                    inputField.setEnabled(fieldDescriptor.enabled);
                }
               
                if (typeof fieldDescriptor.editable === 'boolean'){
                    inputField.setEditable(fieldDescriptor.editable);
                    if (fieldDescriptor.editable == false) {
                    	inputListItem.setType(sap.m.ListType.Active);
                    	inputListItem.attachTap(
                    		function(argument1, argument2, argument3) {
                    			var text = this.getContent()[0].getValue();
                    			
                    			sap.m.MessageBox.show(                    					
                    					text == null ? "" : text,
                    					sap.m.MessageBox.Icon.NONE,
                    					getLocalizedString(this.getLabel()),
                    					[sap.m.MessageBox.Action.OK],
                    					null
                    			);
                    		}
                    	);
                    }
                }
               
                if (typeof fieldDescriptor.visible === 'boolean'){
                    inputListItem.setVisible(fieldDescriptor.visible);
                }
			
                inputByKey[fieldKey] = inputField;
			
			
                inputListItem.addContent(inputField);
                iab.log(uiKey + ' inputfield added to inputListItem');
			
                inputList.addItem(inputListItem);
                
                // add a confirm field items if the field has to be confirmed
				var fieldConfirmationActions = fieldDescriptor.confirm;
				if (fieldConfirmationActions) {
					for ( var i in fieldConfirmationActions) {

						var fieldConfirmationAction = fieldConfirmationActions[i];
						var confirmFieldKey = fieldKey + '_CONFIRM';

						var fieldConfirmationKeys = Object.keys(fieldConfirmationMap);
                        
						if (fieldConfirmationKeys.indexOf(fieldConfirmationAction) < 0) {
							fieldConfirmationMap[fieldConfirmationAction] = [ fieldKey ];
						} else {
							var fieldArray = fieldConfirmationMap[fieldConfirmationAction];
							fieldArray.push(uiKey);
						}

						var confirmFieldItem = new sap.m.InputListItem(uiKey
								+ '_CONFIRM_ITEM');

						var confirmField = new sap.m.Input(uiKey + '_CONFIRM');

						if (fieldDescriptor.type === 'number') {
							confirmField.setType(sap.m.InputType.Number);
						} else if (fieldDescriptor.type === 'password') {
							confirmField.setType(sap.m.InputType.Password);
							// inputListItem.setLabel(uiDescriptor.fields[uiKey]);
						} else {
							confirmField.setType(sap.m.InputType.Text);
						}

						var confirmLabel = getLocalizedString(fieldDescriptor.uiKey
								+ '_CONFIRM_LABEL');
						
						confirmationLabelMap[confirmFieldKey] = confirmLabel;
						confirmationLabelMap[fieldKey] = fieldLabel;
						
						confirmFieldItem.addContent(confirmField);
						confirmFieldItem.setLabel(confirmLabel);

						inputList.addItem(confirmFieldItem);
						
						inputByKey[confirmFieldKey] = confirmField;
					}
				}
                
                iab.log(inputListItem.getId() + ' inputListItem added to list');
            }

		}

		vbox.addItem(inputList);
		iab.log('list added to vbox');

        setDefaultValues();
		
        if(busy) {
            busy.close();
            busy.destroy();
            busy = null;
        }
        busy = new sap.m.BusyDialog();
        
		page.addContent(vbox);
		//page.placeAt(root);

        // Required to get Focus to the 1st element in Windows Store apps. 
        if (first) {
            setTimeout(function () { first.focus(); }, 10);
        }
        
        if (context.busy){
            busy.open();
        }
		iab.log('vbox added to LogonForm root');

	}
    
    /**
	 * This is add a navigation button to the given title bar.
	 * @param actionId can be 'CANCEL' or 'SUBMIT'
	 */
    var addNavigationButton = function(onAction, screenId, buttonDescriptor, actionId, bar) {
		
    	var buttonText;	
        
		if(!buttonDescriptor)
			return;
		
		var buttonKey1 = screenId + '_BTN_' + actionId;
		if (buttonDescriptor.uiKey) {
			buttonText = getLocalizedString(buttonDescriptor.uiKey);
        }
		else {
			buttonText = getLocalizedString(buttonKey1);
		}	
		
        var buttonKey2 = 'BTN_' + actionId;
        if (buttonText === buttonKey1) { //buttonKey1 not found
        	buttonText = getLocalizedString(buttonKey2);
        }
        if (buttonText === buttonKey1) { //buttonKey1 not found
        	buttonText = getLocalizedString(buttonKey2);
        }
        if (buttonText === buttonKey2) { //buttonKey2 not found
        	buttonText = actionId;
        }
        
        var getActionParams = null;
		if(actionId != 'CANCEL') {
			getActionParams = function() {
				return JSON.stringify(getValues());
			}
		}
		var method = getConfirmedOnAction(onAction, buttonDescriptor.confirmKey, actionId, getActionParams);
        
        var button = new sap.m.Button(buttonKey2,
        {
			text : buttonText,
			tap : method
		});
		buttonsByActionId[actionId] = button;
		
		if(actionId === 'CANCEL')
			bar.addContentLeft(button);
		else
			bar.addContentRight(button);
    }
    
    var getConfirmedOnAction = function(onAction, confirmKey, actionId, getActionParams) {
        iab.log('LogonForm.getConfirmedOnAction()');

        return function(){
        	
            iab.log('LogonForm tap event');
        	
            var params = [];
            params[0] = actionId;
            if(getActionParams)
            	params[1] = getActionParams();
            
        	if (confirmKey) {
        		confirmAction(confirmKey, function(){
        			onAction.apply(this, params);
        		});
        	}
        	else {
    			onAction.apply(this, params);
        	}                        
        }
    }


	var hideBusyIndicator = function () {
		iab.log('LogonForm hideBusyIndicator()');
		if (busy) {
			busy.close();
		} else if (window.iab.busy) {
			window.iab.busy.close();
		}
	}
    
    var reset = function () {
		iab.log('LogonForm reset()');
		hideBusyIndicator();
		// TODO reset field values if needed
    }
    

    this.init = init;
	this.showScreen = showScreen;
	this.close = close;
	this.reset = reset;

}

