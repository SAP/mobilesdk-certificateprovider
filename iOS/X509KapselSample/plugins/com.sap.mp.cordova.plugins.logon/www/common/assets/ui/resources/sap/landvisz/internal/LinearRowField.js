/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.LinearRowField");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.LinearRowField",{metadata:{library:"sap.landvisz",properties:{"label":{type:"string",group:"Data",defaultValue:null},"value":{type:"string",group:"Data",defaultValue:null},"renderingSize":{type:"sap.landvisz.EntityCSSSize",group:"Dimension",defaultValue:sap.landvisz.EntityCSSSize.Regular},"iconType":{type:"string",group:"Data",defaultValue:null},"iconTitle":{type:"string",group:"Data",defaultValue:null},"rightIconSrc":{type:"string",group:"Data",defaultValue:null},"linkSource":{type:"string",group:"Data",defaultValue:null},"rightIconTooltip":{type:"string",group:"Data",defaultValue:null},"invalidName":{type:"boolean",group:"Identification",defaultValue:null}}}});
sap.landvisz.internal.LinearRowField.prototype.init=function(){this.initializationDone=false;this.iconType&&this.iconType.destroy();this.totalWidth=0};
sap.landvisz.internal.LinearRowField.prototype.exit=function(){this.oLinearRowFieldLabel&&this.oLinearRowFieldLabel.destroy();this.oLinearRowFieldValue&&this.oLinearRowFieldValue.destroy();this.seperatorLbl&&this.seperatorLbl.destroy()};
sap.landvisz.internal.LinearRowField.prototype.initControls=function(){var n=this.getId();if(!this.oLinearRowFieldLabel)this.oLinearRowFieldLabel=new sap.ui.commons.Label(n+"-CLVConLabel");if(!this.oLinearRowFieldValue)this.oLinearRowFieldValue=new sap.ui.commons.TextView(n+"-CLVConValue");if(!this.seperatorLbl)this.seperatorLbl=new sap.ui.commons.TextView(n+"-CLVConSeperator");this.iconType&&this.iconType.destroy();this.iconType=new sap.ui.commons.Image(n+"-CLVDataTypeImg");if(!this.rightIcon)this.rightIcon=new sap.ui.commons.Image(n+"-rightImg");this.entityMaximized};
sap.landvisz.internal.LinearRowField.prototype.onmouseenter=function(e){e.stopImmediatePropagation()};
sap.landvisz.internal.LinearRowField.prototype.onmouseleave=function(e){e.stopImmediatePropagation()};
