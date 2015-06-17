/** 
 * This module performs the rendering of the screens and notification dialogs associated with the logon process.
 * If you want to replace the default implementation you can replace the two methods bellow ({@linkcode module:iab~showScreen} and {@linkcode module:iab~showNotification}) in this module (iab.js). 
 * @module iab
 * @example <caption>Replacing the current implementation with custom UI.</caption>
 * 
 * showScreen = function(uiDescriptor, context) {
 *  	// Insert here the custom UI implementation for showScreen
 * }
 * 
 * showNotification = function(notificationKey) {
 *  	// Insert here the custom UI implementation for showNotification
 * }
 * 
 */

var logonForm;

/**
 * Show a screen. This method is called by the Logon when Logon requires input data.
 * The data fields which Logon requires are described in the uiDescriptor parameter. 
 * This method is responsible for rendering a notification dialog based on the uiDescriptor.
 * Default values for the fields can be specified in the context parameter.<br/><br/>
 * When the user presses a button/link on the screen a corresponding event is triggered.
 * Triggering the event is performed by setting the window.location.href to the following string:<br/> 
 * <code>#[actionId]+[valueString]</code> - if actionId is 'SUBMIT'<br/>
 * <code>#[actionId]</code> - otherwise<br>
 * where [actionId] can be <br/>
 * <ul>
 * <li>'SUBMIT' for submit navigation button,
 * <li>'CANCEL' for cancel navigation button, 
 * <li>the corresponding (action or button) field's actionId property (see below the actionId description of the fields property)
 * </ul>
 * <br/>
 * and [valueString] is the serialized (JSON.stringify) form of the following json object:<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fieldName1":"fieldValue1"<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fieldName2":"fieldValue2"<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"...":"..."<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fieldNameN":"fieldValueN"<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>
 * &nbsp;&nbsp;&nbsp;where the "fieldNameX" is one of the field names (see below in field description),<br/>
 * &nbsp;&nbsp;&nbsp;and the "fieldValueX" is the value of the field that the user entered.<br/><br/>
 * 
 * (There is a helper method (triggerEvent) defined in iab.html that can be used for concatenating the parameters (see {@link iab.html}).)<br/><br/>
 * The window.location.href change is caught by Logon and the event argument is parsed and executed.<br/><br/>
 * Before event triggering the UI starts a busy indicator. (The busy indicator is stopped if either a new screen or a notification is displayed ({@linkcode showNotification})).<br/><br/>
 * 
 * This method can be replaced with a custom UI implementation. The implementation is responsible for rendering the screen based on the uiDescriptor, using the default values (optional),
 * and triggering events when the user presses a navigation button or a field button/link. 
 * @method
 * @param {Object} uiDescriptor this is a json object that describes the UI fields. 
 * The uiDescriptor object contains the following properties:<br/>
 * &nbsp;&nbsp;&nbsp;{<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id":screenId,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"nav": navigation button description object,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fields": fields description object<br/>
 * &nbsp;&nbsp;&nbsp;}<br/><br/>
 * &nbsp;&nbsp;&nbsp;where<br/>
 * &nbsp;&nbsp;&nbsp;"id": the id of the screen. It can be <br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_SSOPIN_SET - screen for setting SSO pin code,<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_SSOPIN_CHANGE - screen for changing SSO pin code,<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_ENTER_AFARIA_CREDENTIAL - screen for entering credentials for Afaria (seed data and/or certificate),<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_ENTER_CREDENTIALS - screen for enter credentials (if ClientHub gives all connectivity settings except credentials),<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_UNLOCK - screen for unlock data vault,<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_REGISTRATION - screen for entering registration data (credentials and all connectivity settings),<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_SHOW_REGISTRATION - screen for showing registration data in read only mode,<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_SET_PASSCODE_OPT_OFF - screen for setting data vault passcode (the passcode can be enabled),<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_SET_PASSCODE_OPT_ON - screen for setting data vault passcode (the passcode can be disabled),<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_SET_PASSCODE_MANDATORY - screen for setting data vault passcode (the passcode is mandatory),<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_CHANGE_PASSCODE - screen for changing the passcode,<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_DISABLE_PASSCODE - screen for disabling the passcode,<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_MANAGE_PASSCODE_OPT_ON - screen for managing the passcode if new passcode can be added,<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_MANAGE_PASSCODE_OPT_OFF - screen for managing the passcode if new passcode can not be added,<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_MANAGE_PASSCODE_MANDATORY - screen for managing the passcode if new passcode must be added,<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCR_CHANGE_PASSWORD - screen for changing backend password (only in client side),<br/> 
 * <br/>
 * "nav": the navigation actions that are specified on the screen (typically these are buttons on the screen header bar).<br/>
 * It can contain "submit" ("submit":{}) and "cancel" ("cancel":{}) navigation actions.<br/>
 * If "submit" navigation button is pressed a 'SUBMIT' event is triggered. If "cancel" navigation button is pressed a 'CANCEL' event is triggered.<br/>
 * <br/>
 * "fields": the UI fields that can be rendered on the screen. It contains the following structure:<br/>
 * &nbsp;&nbsp;&nbsp;"fieldName": - name of the field which contains. It can be<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ssoPasscode - for entering SSO passcode<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;forgot - (action/button) field for forgetting passcode<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;skip - (action/button) field for skipping passcode<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;afariaUser - for entering afaria user name<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;afariaPassword - for entering afaria password<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user - for entering user name<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;password - for entering password<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;serverHost - for entering server host<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;serverPort - for entering server port<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;communicatorId  - for entering communicator id<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https - for switching secure channel<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;securityConfig - for entering security config<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unlockPasscode - for entering passcode on unlock screen<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resourcePath - for entering path of relay/reverse proxy server<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;farmId - for entering farm id<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;passcode - for entering passcode on passcode creation screen<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;enable - for enable passcode<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disable - for disable passcode<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;oldPasscode - for entering old passcode on passcode change screen<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;change - (action/button) field for changing the passcode<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;newPassword - for entering new passcode on passcode change screen<br/><br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fieldName" can have the the following properties<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uiKey" is an identifier of the UI field (it can be used e.g. for localization). It can have the following values:<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_FORGOT_PASSCODE - for the forgot the Application Passcode field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_FORGOT_SSOPIN - for the forgot the SSO Passcode field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_SSOPIN - for SSO Passcode field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_OLDPASSCODE - for entering Old Passcode<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_NEWPASSCODE - for entering New Passcode<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_SECCONF - for entering Security Config<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_ENABLE_PASSCODE - for enable the Passcode action field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_DISABLE_PASSCODE - for disable Passcode action field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_NEWPASSWORD - for entering New Backend Password<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_USER - for entering Username<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_PASS - for entering Password<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_AFARIA_USER - for entering afaria Username<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_AFARIA_PASSWORD - for entering afaria Password<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_HOST - for entering Host<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_PORT - for entering Port<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_COMMUNICATORID - for entering Communicator ID<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_IS_HTTPS - for specifying the secure connection channel<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_RESOURCE_PATH - for entering URL Suffix<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_FARMID - for entering Company ID<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_PASSCODE - for entering the Passcode<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FLD_SKIP_SSOPIN - for Skip SSO passcode<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"editable": (optional) true/false <br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": (optional) can be <br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"action" - this is a link field. If pressed the "actionId" event is fired,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"password" - this is a password field (e.g. passcode),<br/> 
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"number" - this is a numeric field (e.g. port),<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"switch" - this is a switch button (e.g. isHttps),<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"button" - this is a button field. If pressed the "actionId" event must be fired<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"actionId": (optional) is the action id which is fired when the action button is pressed. 
 * It is used only if "type" is "action" or "button". It can have the following values:<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SUBMIT - submitting the operation on the existing screen<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CANCEL - canceling the operation on the existing screen<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FORGOT - pressing forgot passcode or SSO passcode (action/button) field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SKIP - pressing skip SSO passcode (action/button) field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ENABLE - pressing enable passcode (action/button) field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DISABLE - pressing disable passcode (action/button) field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CHANGE - pressing change passcode (action/button) field<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;When the field is pressed, an event with the actionId is triggered.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"confirmKey": (optional) the key for the confirmation message. This is used only if the field type is "action" or "button". Before the action is triggered a confirmation dialog must be shown for the user. Then the user can continue or cancel the action.<br/>  
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"default": (optional) the default value of the field, <br/
 * <br/>
 * <br/>
 *  
 * You can find a description which screen contains which fields, navigation buttons, etc. in {@linkcode StaticScreens.js}. <br/>
 * @param {Object} context this is a json object that defines the default values for the UI fields. This contains the following attributes:<br/>
 * &nbsp;&nbsp;&nbsp;{<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"https": "true/false" - specifies whether Logon uses http or https channel.
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"resourcePath":"", - specifies the resource path in case of reverse proxy or relay server<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"communicatorId":"" specifies which communicator should be used. It can be empty, "REST", "GATEWAY". Empty means Logon tries to find the communicator automatically.,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"farmId":"" specifies the farm id in case of relay server,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"serverPort":"" the port of the server,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"domain":"" specifies the domain in case of overriding the default domain in SUP server,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"securityConfig":"" security configuration is used for SUP 2.2 server and for ClientHub credential sharing,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"password":"" user password,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"serverHost":"" server host,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"user":"" user name,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"passcode":"" data vault passcode when creating or changing passcodes,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"unlockPasscode":"" data vault passcode in unlock<br/>
 * &nbsp;&nbsp;&nbsp;}<br/>
 * 
 * 
 * @example <caption>Calling showScreen method.</caption>
 *
 * var uiDescriptor = {
 * 		"id":"SCR_REGISTRATION",
 * 		"nav":{
 * 			"submit":{},
 * 			"cancel":{}
 * 		},
 * 		"fields":{
 * 			"serverHost":{
 * 				"uiKey":"FLD_HOST",
 * 				"editable":true
 * 			},
 * 			"user":{
 * 				"uiKey":"FLD_USER"
 * 			},
 * 			"password":{
 * 				"uiKey":"FLD_PASS",
 * 				"type":"password"
 * 			},
 * 			"resourcePath":{
 * 				"uiKey":"FLD_RESOURCE_PATH"
 * 			},
 * 			"https":{
 * 				"uiKey":"FLD_IS_HTTPS",
 * 				"type":"switch",
 * 				"default":false,
 * 				"visible":true
 * 		},
 * 		"serverPort":{
 * 			"uiKey":"FLD_PORT",
 * 			"type":"number",
 * 			"editable":true,
 * 			"visible":true
 * 		},
 * 		"farmId":{
 * 			"uiKey":"FLD_FARMID"
 * 		},
 * 		"communicatorId":{
 * 			"uiKey":"FLD_COMMUNICATORID",
 * 			"default":"REST",
 * 			"visible":false
 * 		},
 * 		"securityConfig":{
 * 			"uiKey":"FLD_SECCONF",
 * 			"visible":true
 * 		}
 * 	}
 * }
 * 
 * var context = {
 *	"https":false,
 * 	"resourcePath":"",
 * 	"communicatorId":"REST",
 * 	"farmId":"",
 * 	"serverPort":"",
 * 	"activationCode":null,
 * 	"domain":null,
 * 	"securityConfig":"",
 * 	"mobileUser":null,
 * 	"password":"",
 * 	"serverHost":"",
 * 	"user":"",
 * 	"passcode":"",
 * 	"unlockPasscode":""
 * }
 * 
 * showScreen(uiDescriptor, context);
 * 
 * 
 * @example <caption>Triggering UI event</caption>
 * 
 * var actionId = "SUBMIT";
 * var values = {"serverHost":"","user":"","password":"","resourcePath":"","https":false,"serverPort":"","farmId":"","communicatorId":"REST","securityConfig":""};
 * 
 * window.location.href = '#' + actionId + '+' JSON.stringify(values);
 * 
 * @example <caption>Replacing the current implementation with custom UI.</caption>
 * 
 * showScreen = function(uiDescriptor, context) {
 *	// Insert here the custom UI implementation for showScreen
 *	// The implementation is responsible for rendering the screen based on the uiDescriptor, using the default values (optional),
 *	// and triggering events when the user presses a navigation button or a field button/link. 
 *  
 *	// You can use the current implementation as an example (check the current iab.js and LogonForm.js)
 * }
 * 
 */    
showScreen = function (uiDescriptor, context) {
    console.log('iab.html showScreen() called');
    var style = "classic"; // default kapsel mode
    if (uiDescriptor && uiDescriptor.style) {
        style = uiDescriptor.style;
    }
    if (!logonForm) {
        logonForm = new sap.LogonForm();
        logonForm.init('placeholder', style);
    }

    logonForm.showScreen(uiDescriptor, triggerEvent, context);
}

var notification;
/**
 * Show a notification dialog. This method is called when Logon sends a notification, 
 * which the user has to acknowledge.
 * This method is responsible for rendering a notification dialog based on the notificationKey.
 * When the notification dialog is acknowledged the UI closes the notification dialog and sends an 'ERRORACK' event to Logon. 
 * Triggering the event is performed by setting the window.location.href to the following string:<br/> 
 * <code>#['ERRORACK']</code><br/><br/>
 *  
 * showNotification method can be replaced with a custom UI implementation. The implementation is responsible for showing the notification dialog. 
 * It's also responsible for closing the dialog and triggering an 'ERRORACK' event when the user acknowledges the notification.<br/>
 *
 * @method
 * @param {String} notificationKey this is an identifier of the notification message. This can be the identifier of the localized message, the localized window title, etc.<br/>
 * The following values are valid: <br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_UNLOCK_FAILED - invalid passcode is entered for unlock the datavault,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_SETPASSCODE_FAILED - invalid passcode is entered for creating a new passcode,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_REG_FAILED_WRONG_SERVER - invalid server is entered for registration,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_REG_FAILED -Unknown error during registration,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_REG_FAILED_UNATHORIZED - invalid credentials entered for registration,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_REGISTRATION_CANCEL - de-registration failed,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_SSO_PASSCODE_SET_ERROR - invalid SSO passcode entered for ClientHub usage,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_SET_AFARIA_CREDENTIAL_FAILED - invalid afaria credential is entered for getting seed data and/or certificate from afaria,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_PASSCODE_TOO_SHORT - the new passcode is too short,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_PASSCODE_REQUIRES_DIGIT - the new passcode must contain at least one digit,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_PASSCODE_REQUIRES_UPPER - the new passcode must contain at least one upper character,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_PASSCODE_REQUIRES_LOWER - the new passcode must contain at least one lower character,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_PASSCODE_REQUIRES_SPECIAL - the new passcode must contain at least one special character,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_PASSCODE_UNDER_MIN_UNIQUE_CHARS - the new passcode does not contain enough unique character,<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERR_FORGOT_SSO_PIN - a confirmation message that the SSO passcode reset can be done only in the Client Hub currently.<br/>
 * <br/>
 * 
 * @param {String} [notificationMessage] if specified, will be used for message instead of looking up value with notificationKey
 * @param {String} [notificationTitle] if specified, will be used for title instead of looking up value with notificationKey
 * @example <caption>Calling showNotification method</caption>
 * 
 * showNotification('ERR_UNLOCK_FAILED');
 * 
 * @example <caption>Triggering UI event</caption>
 *
 * window.location.href = '#ERRORACK';
 *
 * @example <caption>Replacing the current implementation with custom UI.</caption>
 * 
 * showNotification = function(notificationKey) {
 *	// Insert here the custom UI implementation for showNotification
 *	// The implementation is responsible for showing the notification dialog. 
 *	// It's also responsible for closing the dialog and triggering an 'ERRORACK' event when the user acknowledges the notification.
 *  
 *	// You can use the current implementation as an example (check the current iab.js and Notification.js)
 * }
 * 
 */ 
showNotification = function(notificationKey,notificationMessage,notificationTitle) {
	console.log('iab.html showNotification() called, notificationKey: ' + notificationKey);
	if (notificationKey === "ERR_UNLOCK_FAILED"){
		if (typeof window.iab.setErrorText === "function") {
			window.iab.setErrorText("ERR_UNLOCK_FAILED");
			return;
		}
	}
	if (!notification) {
		notification = new sap.logon.Notification(triggerEvent);
	}
	resetScreen();
	notification.show(notificationKey,notificationMessage,notificationTitle);
}

resetScreen = function() {
	console.log('iab.html resetScreen() called');
	if(!logonForm)
		return;
	logonForm.reset();
}

if (typeof jQuery === 'undefined' || typeof jQuery.sap === 'undefined') {
	window.getLocalizedString = function(key){
		return key;
	}
}
else {
	jQuery.sap.require("jquery.sap.resources");
	var locale = sap.ui.getCore().getConfiguration().getLanguage();
	var i18n = jQuery.sap.resources({'url' : "../i18n/i18n.properties", 'locale': locale});
	var i18nProvider = jQuery.sap.resources({'url' : "../i18n/i18n.provider.properties", 'locale': locale});

	window.getLocalizedString = function(key){
		var localizedValue = i18n.getText(key);
		if (localizedValue == key){
		   //try to get the localized string from provider's resource to get value
		   localizedValue = i18nProvider.getText(key);
		}
		return localizedValue;
	}
}