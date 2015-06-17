/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.DataContainer");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.DataContainer",{metadata:{library:"sap.landvisz",properties:{"header":{type:"string",group:"Data",defaultValue:null},"selected":{type:"boolean",group:"Identification",defaultValue:true},"renderingSize":{type:"sap.landvisz.EntityCSSSize",group:"Dimension",defaultValue:sap.landvisz.EntityCSSSize.Regular},"type":{type:"sap.landvisz.LandscapeObject",group:"Identification",defaultValue:null}},aggregations:{"properties":{type:"sap.ui.core.Control",multiple:true,singularName:"property"}},events:{"select":{}}}});sap.landvisz.internal.DataContainer.M_EVENTS={'select':'select'};
sap.landvisz.internal.DataContainer.prototype.init=function(){this.initializationDone=false;this.firstItem=false;this.lastItem=true;this.width;this.hasChangeEvent=false;this.visible=true;this.inDisplay=true};
sap.landvisz.internal.DataContainer.prototype.exit=function(){this.navItem&&this.navItem.destroy();this.oNavBar&&this.navItem.destroy()};
sap.landvisz.internal.DataContainer.prototype.initControls=function(){var n=this.getId();if(!this.oVLayoutContainer)this.oVLayoutContainer=new sap.ui.commons.layout.VerticalLayout(n+"-CLVEntityVLayoutContainer");this.navItem&&this.navItem.destroy();this.navItem=new sap.ui.ux3.NavigationItem(n+"-CLVItemHeader")};
sap.landvisz.internal.DataContainer.prototype.select=function(e){alert('selected')};
sap.landvisz.internal.DataContainer.prototype.onclick=function(e){this.fireEvent("itemsChanged")};
sap.landvisz.internal.DataContainer.prototype.onsapenter=function(e){this.fireEvent("itemsChanged")};
