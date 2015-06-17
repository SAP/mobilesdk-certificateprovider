/*global jQuery: false, sap: false, cus: false*/
(function () {
	'use strict';
	jQuery.sap.require("sap.uxap.ModelMapping");
	jQuery.sap.require("sap.uxap.BlockBase");
	jQuery.sap.require("sap.ui.layout.GridData");
	jQuery.sap.require("sap.ui.model.BindingMode");

	sap.ui.controller("sap.uxap.component.ObjectPageLayoutUXDrivenFactory", {

		/**
		 * injects the header based on configuration
		 * @param {object} oModel
		 */
		connectToComponent: function (oModel) {

			var bHasPendingRequest = jQuery.isEmptyObject(oModel.getData());

			//ensure a 1 way binding otherwise it cause any block property change to update the entire subSections
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

			var fnHeaderFactory = jQuery.proxy(function () {

				if (bHasPendingRequest) {
					oModel.detachRequestCompleted(fnHeaderFactory);
				}

				var oHeaderTitleContext = new sap.ui.model.Context(oModel, "/headerTitle"),
					oObjectPageLayout = this.getView().byId("ObjectPageLayout");

				//create the header title if provided in the config
				if (oHeaderTitleContext.getProperty("")) {
					try {
						//retrieve the header class
						this._oHeader = this.controlFactory(oObjectPageLayout.getId(), oHeaderTitleContext);
						oObjectPageLayout.setHeaderTitle(this._oHeader);
					}
					catch (sError) {
						jQuery.sap.log.error("ObjectPageLayoutFactory :: error in header creation from config: " + sError);
					}
				}

			}, this);

			//if data are not there yet, we wait for them
			if (bHasPendingRequest) {
				oModel.attachRequestCompleted(fnHeaderFactory);
			}
			//otherwise we apply the header factory immediately
			else {
				fnHeaderFactory();
			}
		},

		/**
		 * generates a control to be used in actions, blocks or moreBlocks aggregations
		 * known issue: bindings are not applied, the control is built with data only
		 * @param {string} sParentId
		 * @param {object} oBindingContext
		 * @returns {*}
		 */
		controlFactory: function (sParentId, oBindingContext) {
			var oControlInfo = oBindingContext.getProperty(""), oControl, oControlClass, oControlMetadata;

			try {
				//retrieve the block class
				jQuery.sap.require(oControlInfo.Type);
				oControlClass = jQuery.sap.getObject(oControlInfo.Type);
				oControlMetadata = oControlClass.getMetadata();

				//pre-processing: substitute event handler as strings by their function instance
				jQuery.each(oControlMetadata._mAllEvents, jQuery.proxy(function (sEventName, oEventProperties) {
					if (typeof oControlInfo[sEventName] == "string") {
						oControlInfo[sEventName] = this.convertEventHandler(oControlInfo[sEventName]);
					}
				}, this));

				//creates the control with control info = create with provided properties
				oControl = sap.ui.base.ManagedObject.create(oControlInfo);

				//post-processing: bind properties on the objectPageLayoutMetadata model
				jQuery.each(oControlMetadata._mAllProperties, jQuery.proxy(function (sPropertyName, oProperty) {
					if (oControlInfo[sPropertyName]) {
						oControl.bindProperty(sPropertyName, "objectPageLayoutMetadata>" + oBindingContext.getPath() + "/" + sPropertyName);
					}
				}, this));
			}
			catch (sError) {
				jQuery.sap.log.error("ObjectPageLayoutFactory :: error in control creation from config: " + sError);
			}

			return oControl;
		},

		/**
		 * determine the static function to use from its name
		 * @param {string} sStaticHandlerName
		 * @returns {*|window|window}
		 */
		convertEventHandler: function (sStaticHandlerName) {

			var fnNameSpace = window, aNameSpaceParts = sStaticHandlerName.split('.');

			try {
				jQuery.each(aNameSpaceParts, function (iIndex, sNameSpacePart) {
					fnNameSpace = fnNameSpace[sNameSpacePart];
				});
			}
			catch (sError) {
				jQuery.sap.log.error("ObjectPageLayoutFactory :: undefined event handler: " + sStaticHandlerName + ". Did you forget to require its static class?");
				fnNameSpace = undefined;
			}

			return fnNameSpace;
		}
	});
})();


