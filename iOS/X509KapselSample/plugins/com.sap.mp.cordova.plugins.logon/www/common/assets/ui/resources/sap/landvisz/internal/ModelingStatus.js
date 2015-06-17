/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.ModelingStatus");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.ModelingStatus",{metadata:{library:"sap.landvisz",properties:{"status":{type:"string",group:"Data",defaultValue:null},"statusTooltip":{type:"string",group:"Data",defaultValue:null},"stateIconSrc":{type:"string",group:"Data",defaultValue:null},"stateIconTooltip":{type:"any",group:"Data",defaultValue:null}}}});
sap.landvisz.internal.ModelingStatus.prototype.init=function(){this.initializationDone=false;this._imgResourcePath=sap.ui.resource('sap.landvisz','themes/base/img/status/');this._imgFolderPath;this.renderSize;if(!this.statusImage)this.statusImage=new sap.ui.commons.Image(this.getId()+"-CLVEntityStatusImage")};
sap.landvisz.internal.ModelingStatus.prototype.exit=function(){this.statusImage&&this.statusImage.destroy()};
sap.landvisz.internal.ModelingStatus.prototype.initControls=function(){var n=this.getId();if(!this.statusImage)this.statusImage=new sap.ui.commons.Image(n+"-CLVEntityStatusImage");if(!this.stateImage)this.stateImage=new sap.ui.commons.Image(n+"-EntityStateImage");this.entityMaximized};
