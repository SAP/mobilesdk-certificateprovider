jQuery.sap.declare("sap.landvisz.libs.lvsvg");
sap.landvisz.libs.lvsvg=function(){};
sap.landvisz.libs.lvsvg.getSVG=function(w,h,i){jQuery.sap.require("sap.ui.thirdparty.d3");var v=d3.select('#'+i).append("svg").attr("width",w).attr("height",h);return v};
sap.landvisz.libs.lvsvg.convertHtmltoCanvas=function(c,n){html2canvas(c,{allowTaint:true,useCORS:true,onrendered:function(a){n.show("slide",{direction:"down"},1000);n.css({'background-image':"url("+a.toDataURL("image/png")+")",'background-size':"100% 100%"})}})}
