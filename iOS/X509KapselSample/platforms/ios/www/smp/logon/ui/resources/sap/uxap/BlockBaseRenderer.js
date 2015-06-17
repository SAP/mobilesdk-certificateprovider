/*!
 * SAP.${maven.build.timestamp} UI development toolkit for HTML5 (SAPUI5) (c) Copyright
 * 		2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uxap.BlockBaseRenderer");jQuery.sap.require("sap.ui.core.Renderer");sap.uxap.BlockBaseRenderer={};
sap.uxap.BlockBaseRenderer.render=function(r,c){if(!c.getVisible()){return}r.write("<div");r.writeControlData(c);if(c._getSelectedViewContent()){r.addClass('sapUxAPBlockBase');r.addClass("sapUxAPBlockBase"+c.getMode())}else{var C=c.getMetadata().getName().split(".").pop();r.addClass('sapUxAPBlockBaseDefaultSize');r.addClass('sapUxAPBlockBaseDefaultSize'+C+c.getMode())}r.writeClasses();r.write(">");if(c._getSelectedViewContent()){r.renderControl(c._getSelectedViewContent())}r.write("</div>")};
