/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.Connector");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.Connector",{metadata:{library:"sap.landvisz",properties:{"source":{type:"string",group:"Data",defaultValue:null},"target":{type:"string",group:"Data",defaultValue:null}}}});
sap.landvisz.Connector.prototype.init=function(){this.viewType};
