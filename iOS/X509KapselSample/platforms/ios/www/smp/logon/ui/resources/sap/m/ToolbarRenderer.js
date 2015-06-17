/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer'],function(q,R){"use strict";var T={};T.render=sap.m.BarInPageEnabler.prototype.render;T.decorateRootElement=function(r,t){r.addClass("sapMTB");if(!sap.m.Toolbar.hasFlexBoxSupport){r.addClass("sapMTBNoFlex")}else if(!sap.m.Toolbar.hasNewFlexBoxSupport){r.addClass("sapMTBOldFlex")}else{r.addClass("sapMTBNewFlex")}if(t.getActive()){r.addClass("sapMTBActive");r.writeAttribute("tabindex","0")}else{r.addClass("sapMTBInactive")}r.addClass("sapMTB-"+t.getActiveDesign()+"-CTX");var w=t.getWidth();var h=t.getHeight();w&&r.addStyle("width",w);h&&r.addStyle("height",h)};T.renderBarContent=function(r,t){t.getContent().forEach(function(c){sap.m.BarInPageEnabler.addChildClassTo(c,t);r.renderControl(c)})};T.shouldAddIBarContext=function(c){return false};return T},true);
