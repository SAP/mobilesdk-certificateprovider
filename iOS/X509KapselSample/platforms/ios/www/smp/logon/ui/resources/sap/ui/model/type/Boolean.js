/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/format/NumberFormat','sap/ui/model/SimpleType'],function(q,N,S){"use strict";var B=S.extend("sap.ui.model.type.Boolean",{constructor:function(){S.apply(this,arguments);this.sName="Boolean"}});B.prototype.formatValue=function(v,i){if(v==undefined||v==null){return null}switch(i){case"boolean":return v;case"string":return v.toString();case"int":case"float":default:throw new sap.ui.model.FormatException("Don't know how to format Boolean to "+i)}};B.prototype.parseValue=function(v,i){switch(i){case"boolean":return v;case"string":if(v.toLowerCase()=="true"||v=="X"){return true}if(v.toLowerCase()=="false"||v==""){return false}throw new sap.ui.model.ParseException("Don't know how to parse Boolean from "+i);case"int":case"float":default:throw new sap.ui.model.ParseException("Don't know how to parse Boolean from "+i)}};B.prototype.validateValue=function(v){};return B},true);
