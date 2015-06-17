/*!
 * SAP.${maven.build.timestamp} UI development toolkit for HTML5 (SAPUI5) (c) Copyright
 * 		2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uxap.ObjectPageHeaderActionButton");jQuery.sap.require("sap.uxap.library");jQuery.sap.require("sap.m.Button");sap.m.Button.extend("sap.uxap.ObjectPageHeaderActionButton",{metadata:{library:"sap.uxap",properties:{"hideText":{type:"boolean",group:"",defaultValue:true},"hideIcon":{type:"boolean",group:"",defaultValue:false}}}});jQuery.sap.require("sap.m.Button");
sap.uxap.ObjectPageHeaderActionButton.prototype.applySettings=function(s,S){if(sap.m.Button.prototype.applySettings){sap.m.Button.prototype.applySettings.call(this,s,S)}this.toggleStyleClass("sapUxAPObjectPageHeaderActionButtonHideText",this.getHideText());this.toggleStyleClass("sapUxAPObjectPageHeaderActionButtonHideIcon",this.getHideIcon())};
sap.uxap.ObjectPageHeaderActionButton.prototype.setHideText=function(v,i){this.toggleStyleClass("sapUxAPObjectPageHeaderActionButtonHideText",v);return this.setProperty("hideText",v,i)};
sap.uxap.ObjectPageHeaderActionButton.prototype.setHideIcon=function(v,i){this.toggleStyleClass("sapUxAPObjectPageHeaderActionButtonHideIcon",v);return this.setProperty("hideIcon",v,i)};
