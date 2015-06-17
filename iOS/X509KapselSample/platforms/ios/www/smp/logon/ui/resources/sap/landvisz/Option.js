/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.Option");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.Option",{metadata:{library:"sap.landvisz",properties:{"type":{type:"string",group:"Identification",defaultValue:null},"currentEntity":{type:"string",group:"Data",defaultValue:null}},aggregations:{"optionEntities":{type:"sap.landvisz.OptionEntity",multiple:true,singularName:"optionEntity"}}}});
sap.landvisz.Option.prototype.init=function(){this.viewType};
