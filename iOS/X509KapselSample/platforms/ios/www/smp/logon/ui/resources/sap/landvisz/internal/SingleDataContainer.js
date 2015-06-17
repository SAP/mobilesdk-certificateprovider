/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.SingleDataContainer");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.SingleDataContainer",{metadata:{publicMethods:["isOpen"],library:"sap.landvisz",properties:{"header":{type:"string",group:"Data",defaultValue:null},"renderingSize":{type:"string",group:"Dimension",defaultValue:null}},aggregations:{"properties":{type:"sap.ui.core.Control",multiple:true,singularName:"property"}},events:{"closed":{}}}});sap.landvisz.internal.SingleDataContainer.M_EVENTS={'closed':'closed'};
sap.landvisz.internal.SingleDataContainer.prototype.init=function(){this.initializationDone=false;this.isModelOpen=false};
sap.landvisz.internal.SingleDataContainer.prototype.exit=function(){};
sap.landvisz.internal.SingleDataContainer.prototype.initControls=function(){var n=this.getId();if(!this.headerLabel)this.headerLabel=new sap.ui.commons.Label(n+"-CLVHeaderLabel");if(!this.closeIcon)this.closeIcon=new sap.ui.commons.Image(n+"-CLVSMVClose")};
sap.landvisz.internal.SingleDataContainer.prototype.isOpen=function(){return this.isModelOpen};
sap.landvisz.internal.SingleDataContainer.prototype.onclick=function(e){if(e.target.id=="closeVM"){jQuery.sap.byId(e.currentTarget.id).hide("slow");this.isModelOpen=false;this.fireClosed()}else{e.stopImmediatePropagation()}};
