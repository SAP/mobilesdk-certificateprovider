/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 *         (c) Copyright 2009-2014 SAP SE. All rights reserved
 *     
 */
jQuery.sap.declare("sap.me.CalendarLegendRenderer");sap.me.CalendarLegendRenderer={};
sap.me.CalendarLegendRenderer.render=function(r,c){var l=c.getAggregation("labels");if(c.getVisible()&&l&&l.length>0){var m="";var W=c.getWidth();if(W){m+="width:"+W+";"}r.write("<div");r.writeControlData(c);r.addClass("sapUIMeLegendOuterContainer");r.writeAttribute("style",m);r.writeClasses();r.write(">");r.write("<div");r.addClass("sapMeCalendarLegend");r.addClass("sapMeCalendarLegend"+c.getDesign());r.writeClasses();r.write(">");r.write("<div  id='"+c.getId()+"-arrow'");r.addClass("sapUIMeLegend");r.writeClasses();r.write(">");if(c.getExpandable()){r.renderControl(c.getAggregation("icon"))}r.write("<div id='"+c.getId()+"-LegendMenuContainer'");r.addClass("sapUIMeLegendMenuContainer");r.writeClasses();r.write(">");r.write("<div id='"+c.getId()+"-LegendMenu'");r.addClass("sapUIMeLegendMenu");if(!c.getExpanded()){r.write("style = 'display:none'")}r.writeClasses();r.write(">");var w=c.getLegendWidth();for(var i=0;i<l.length;i++){r.write("<div ");r.addClass("sapUIMeLegendLine");r.writeClasses();r.write(">");r.write("<div ");r.addClass("sapUIMeLegendColor");r.addClass(c._getColorBoxStyle(l[i].getId()));r.writeClasses();r.write("></div>");r.renderControl(l[i]);r.write("</div>")}r.write("</div>");r.write("</div>");r.write("</div>");r.write("</div>");r.write("</div>")}};
