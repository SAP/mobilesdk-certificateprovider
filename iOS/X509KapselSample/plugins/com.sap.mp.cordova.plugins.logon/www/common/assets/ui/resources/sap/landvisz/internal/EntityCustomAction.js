/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.EntityCustomAction");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.EntityCustomAction",{metadata:{library:"sap.landvisz",properties:{"customAction":{type:"string",group:"Data",defaultValue:null},"renderingSize":{type:"sap.landvisz.EntityCSSSize",group:"Dimension",defaultValue:sap.landvisz.EntityCSSSize.Regular}},events:{"select":{}}}});sap.landvisz.internal.EntityCustomAction.M_EVENTS={'select':'select'};
sap.landvisz.internal.EntityCustomAction.prototype.init=function(){this.initializationDone=false;this.lastButton=false};
sap.landvisz.internal.EntityCustomAction.prototype.exit=function(){this.customAction&&this.customAction.destroy()};
sap.landvisz.internal.EntityCustomAction.prototype.initControls=function(){var c=this.getId()};
sap.landvisz.internal.EntityCustomAction.prototype.select=function(e){this.fireSelect()};
sap.landvisz.internal.EntityCustomAction.prototype.onclick=function(e){this.fireSelect()};
