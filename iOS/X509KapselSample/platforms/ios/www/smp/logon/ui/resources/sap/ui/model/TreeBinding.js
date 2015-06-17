/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Binding'],function(q,B){"use strict";var T=B.extend("sap.ui.model.TreeBinding",{constructor:function(m,p,c,f,P){B.call(this,m,p,c,P);this.aFilters=f;this.bDisplayRootNode=P&&P.displayRootNode===true},metadata:{"abstract":true,publicMethods:["getRootContexts","getNodeContexts","hasChildren","filter"]}});T.prototype.getChildCount=function(c){if(!c){return this.getRootContexts().length}return this.getNodeContexts(c).length};T.prototype.attachFilter=function(f,l){this.attachEvent("_filter",f,l)};T.prototype.detachFilter=function(f,l){this.detachEvent("_filter",f,l)};T.prototype._fireFilter=function(a){this.fireEvent("_filter",a)};return T},true);
