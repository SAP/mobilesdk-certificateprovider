/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.LongTextField");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.LongTextField",{metadata:{library:"sap.landvisz",properties:{"text":{type:"string",group:"Data",defaultValue:null},"renderingSize":{type:"sap.landvisz.EntityCSSSize",group:"Dimension",defaultValue:null}}}});
sap.landvisz.LongTextField.prototype.init=function(){};
sap.landvisz.LongTextField.prototype.exit=function(){this.oLinearRowFieldLabel&&this.oLinearRowFieldLabel.destroy()};
sap.landvisz.LongTextField.prototype.initControls=function(){var n=this.getId();if(!this.oLongText)this.oLongText=new sap.ui.commons.TextView(n+"-CLVConValue")};
