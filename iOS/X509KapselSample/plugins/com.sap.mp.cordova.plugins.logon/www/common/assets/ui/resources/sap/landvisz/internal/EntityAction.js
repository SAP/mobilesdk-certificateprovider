/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.EntityAction");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.EntityAction",{metadata:{library:"sap.landvisz",properties:{"actionTooltip":{type:"string",group:"Data",defaultValue:null},"iconSrc":{type:"sap.ui.core.URI",group:"Data",defaultValue:null},"renderingSize":{type:"string",group:"Dimension",defaultValue:null}},events:{"press":{}}}});sap.landvisz.internal.EntityAction.M_EVENTS={'press':'press'};
sap.landvisz.internal.EntityAction.prototype.init=function(){this.initializationDone=false};
sap.landvisz.internal.EntityAction.prototype.exit=function(){this.entityActionIcon&&this.entityActionIcon.destroy();this.style="";this.entityMaximized};
sap.landvisz.internal.EntityAction.prototype.initControls=function(){var n=this.getId();this.entityActionIcon&&this.entityActionIcon.destroy();this.entityActionIcon=new sap.ui.commons.Image(n+"-CLVEntityActionImg")};
sap.landvisz.internal.EntityAction.prototype.press=function(e){this.fireSelect()};
sap.landvisz.internal.EntityAction.prototype.onclick=function(e){this.firePress()};
