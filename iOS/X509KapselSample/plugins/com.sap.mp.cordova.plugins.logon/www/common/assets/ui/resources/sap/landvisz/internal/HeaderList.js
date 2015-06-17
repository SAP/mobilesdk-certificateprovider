/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.HeaderList");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.HeaderList",{metadata:{library:"sap.landvisz",properties:{"headerTooltip":{type:"string",group:"Data",defaultValue:null},"entitySize":{type:"string",group:"Dimension",defaultValue:null},"selected":{type:"boolean",group:"Identification",defaultValue:false},"type":{type:"sap.landvisz.LandscapeObject",group:"Identification",defaultValue:null}},events:{"press":{}}}});sap.landvisz.internal.HeaderList.M_EVENTS={'press':'press'};
sap.landvisz.internal.HeaderList.prototype.init=function(){this.initializationDone=false;this.lastBtn=true;this.onFocus=true;this.inDisplay=false};
sap.landvisz.internal.HeaderList.prototype.exit=function(){this.customAction&&this.customAction.destroy();this.oToolBarBtn&&this.oToolBarBtn.destroy();this.oActToolBar&&this.oActToolBar.destroy()};
sap.landvisz.internal.HeaderList.prototype.initControls=function(){this.oToolBarBtn;this.oActToolBar;this.oHLayoutBtn;this.parentContainer;this.headerWidth;this.btnEventController};
sap.landvisz.internal.HeaderList.prototype.press=function(e){this.firePress()};
sap.landvisz.internal.HeaderList.prototype.onclick=function(e){this.firePress()};
sap.landvisz.internal.HeaderList.prototype.onsapenter=function(e){this.firePress()};
