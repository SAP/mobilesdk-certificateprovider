/*!
 * SAP.${maven.build.timestamp} UI development toolkit for HTML5 (SAPUI5) (c) Copyright
 * 		2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uxap.ObjectPageSection");jQuery.sap.require("sap.uxap.library");jQuery.sap.require("sap.uxap.ObjectPageSectionBase");sap.uxap.ObjectPageSectionBase.extend("sap.uxap.ObjectPageSection",{metadata:{library:"sap.uxap",properties:{"showTitle":{type:"boolean",group:"Appearance",defaultValue:true}},defaultAggregation:"subSections",aggregations:{"subSections":{type:"sap.uxap.ObjectPageSubSection",multiple:true,singularName:"subSection"}}}});
sap.uxap.ObjectPageSection.prototype.connectToModels=function(){var s=this.getSubSections();if(s!=null){jQuery.each(s,function(S,o){o.connectToModels()})}};
