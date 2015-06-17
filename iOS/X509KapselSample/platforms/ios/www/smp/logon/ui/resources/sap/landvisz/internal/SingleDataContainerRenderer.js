/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.SingleDataContainerRenderer");sap.landvisz.internal.SingleDataContainerRenderer={};
sap.landvisz.internal.SingleDataContainerRenderer.render=function(r,c){if(!this.initializationDone){c.initControls();c.initializationDone=true;r.write("<div");r.writeControlData(c);r.addClass("sapLandviszSMVContainerAllSizes");r.addClass("svmContainer");r.writeClasses();r.write(">");r.write("<div");r.writeControlData(c);r.addClass("sapLandviszSvmHeader");r.writeClasses();r.write(">");c.headerLabel.setText(c.getHeader());c.headerLabel.setTooltip(c.getHeader());c.headerLabel.addStyleClass("sapLandviszSvmHeaderLabel");r.renderControl(c.headerLabel);r.write("<div");r.writeAttributeEscaped("id","closeVM");r.addClass("sapLandviszSvmSectorCloseBtn");r.writeClasses();var b=sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");var a=b.getText("CLOSE");r.writeAttributeEscaped("title",a);r.write("></div>");r.write("</div>");r.write("<div");r.addClass("sapLandviszSvmDataContainer");r.writeClasses();r.write(">");var p=c.getProperties();var d;for(var i=0;i<p.length;i++){d=p[i];if(d.getRenderingSize())d.setRenderingSize(c.getRenderingSize());r.renderControl(d)}r.write("</div>");r.write("</div>");c.isModelOpen=true}};
