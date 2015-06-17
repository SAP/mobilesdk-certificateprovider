/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control'],function(q,l,C){"use strict";var P=C.extend("sap.m.P13nPanel",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Appearance",defaultValue:null},type:{type:"sap.m.P13nPanelType",group:"Misc",defaultValue:null},verticalScrolling:{type:"boolean",group:"Misc",defaultValue:true}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.P13nItem",multiple:true,singularName:"item",bindable:"bindable"}}}});P.prototype.onBeforeNavigation=function(){return true};P.prototype.onAfterNavigation=function(){return};return P},true);
