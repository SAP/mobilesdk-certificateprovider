/*!
 * SAP.${maven.build.timestamp} UI development toolkit for HTML5 (SAPUI5) (c) Copyright
 * 		2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uxap.ObjectPageSectionBase");jQuery.sap.require("sap.uxap.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.uxap.ObjectPageSectionBase",{metadata:{"abstract":true,publicMethods:["connectToModels"],library:"sap.uxap",properties:{"title":{type:"string",group:"Appearance",defaultValue:null},"visible":{type:"boolean",group:"Appearance",defaultValue:true}},aggregations:{"customAnchorBarButton":{type:"sap.m.Button",multiple:false}}}});
sap.uxap.ObjectPageSectionBase.prototype.init=function(){this._bInternalVisible=true;this._bInternalTitleVisible=true;this._sInternalTitle="";this._bRendered=false;this._oParentObjectPageLayout=undefined};
sap.uxap.ObjectPageSectionBase.prototype.onBeforeRendering=function(){if(!this._getObjectPageLayout()){this._findObjectPageLayout()}};
sap.uxap.ObjectPageSectionBase.prototype.onAfterRendering=function(){if(this._getObjectPageLayout()){this._getObjectPageLayout()._adjustLayout()}this._bRendered=true};
sap.uxap.ObjectPageSectionBase.prototype._setInternalVisible=function(v,i){if(v!=this._bInternalVisible){this._bInternalVisible=v;if(i){this.invalidate()}}};
sap.uxap.ObjectPageSectionBase.prototype._getInternalVisible=function(){return this._bInternalVisible};
sap.uxap.ObjectPageSectionBase.prototype._setInternalTitleVisible=function(v,i){if(v!=this._bInternalTitleVisible){this._bInternalTitleVisible=v;if(i){this.invalidate()}}};
sap.uxap.ObjectPageSectionBase.prototype._getInternalTitleVisible=function(){return this._bInternalTitleVisible};
sap.uxap.ObjectPageSectionBase.prototype._setInternalTitle=function(v,i){if(v!=this._sInternalTitle){this._sInternalTitle=v;if(i){this.invalidate()}}};
sap.uxap.ObjectPageSectionBase.prototype._getInternalTitle=function(){return this._sInternalTitle};
sap.uxap.ObjectPageSectionBase.prototype._findObjectPageLayout=function(){this._oParentObjectPageLayout=this.getParent();while(this._oParentObjectPageLayout&&!(this._oParentObjectPageLayout instanceof sap.uxap.ObjectPageLayout)){this._oParentObjectPageLayout=this._oParentObjectPageLayout.getParent()}};
sap.uxap.ObjectPageSectionBase.prototype._getObjectPageLayout=function(){return this._oParentObjectPageLayout};
sap.uxap.ObjectPageSectionBase.prototype._notifyObjectPageLayout=function(){if(this._bRendered&&this._getObjectPageLayout()){this._getObjectPageLayout()._adjustLayoutAndUxRules()}};
sap.uxap.ObjectPageSectionBase.prototype.addAggregation=function(a,o){var r=sap.ui.core.Control.prototype.addAggregation.call(this,a,o);this._notifyObjectPageLayout();return r};
sap.uxap.ObjectPageSectionBase.prototype.insertAggregation=function(a,o,i){var r=sap.ui.core.Control.prototype.insertAggregation.call(this,a,o,i);this._notifyObjectPageLayout();return r};
sap.uxap.ObjectPageSectionBase.prototype.removeAllAggregation=function(a){var r=sap.ui.core.Control.prototype.removeAllAggregation.call(this,a);this._notifyObjectPageLayout();return r};
sap.uxap.ObjectPageSectionBase.prototype.removeAggregation=function(a,o){var r=sap.ui.core.Control.prototype.removeAggregation.call(this,a,o);this._notifyObjectPageLayout();return r};
sap.uxap.ObjectPageSectionBase.prototype.destroyAggregation=function(a){var r=sap.ui.core.Control.prototype.destroyAggregation.call(this,a);this._notifyObjectPageLayout();return r};
sap.uxap.ObjectPageSectionBase.prototype.setVisible=function(v,s){if(this._getObjectPageLayout()){this.setProperty("visible",v,true);this._getObjectPageLayout()._adjustLayoutAndUxRules();this.invalidate()}else{this.setProperty("visible",v,s)}return this};
sap.uxap.ObjectPageSectionBase.prototype.setTitle=function(v,s){this.setProperty("title",v,s);this._notifyObjectPageLayout();return this};
