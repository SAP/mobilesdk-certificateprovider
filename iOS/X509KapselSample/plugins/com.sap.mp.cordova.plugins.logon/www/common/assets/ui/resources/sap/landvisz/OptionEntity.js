/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.OptionEntity");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.landvisz.OptionSource");sap.landvisz.OptionSource.extend("sap.landvisz.OptionEntity",{metadata:{library:"sap.landvisz",properties:{"label":{type:"string",group:"Data",defaultValue:null},"selected":{type:"boolean",group:"Accessibility",defaultValue:false},"enable":{type:"boolean",group:"Identification",defaultValue:true},"optionTextTooltip":{type:"string",group:"Data",defaultValue:null}},aggregations:{"optionSources":{type:"sap.landvisz.OptionSource",multiple:true,singularName:"optionSource"}},events:{"selectOption":{}}}});sap.landvisz.OptionEntity.M_EVENTS={'selectOption':'selectOption'};
sap.landvisz.OptionEntity.prototype.init=function(){this.optionText="1";this.optionSrcEntityId;this.optionRepEntityId;this.optionOn;this.isSelected;this.initializationDone=false;this.left=0;this.top=0};
sap.landvisz.OptionEntity.prototype.initControls=function(){var o=this.getId();if(!this.optionTextView)this.optionTextView=new sap.ui.commons.TextView(o+"-optionText");var t=this;if(!this.optionBtn){this.optionBtn=new sap.ui.commons.RadioButton(o+"-optionBtn",{groupName:o+"-optionBtn"});this.optionBtn.attachSelect(function(e){t.fireEvent("optionSelected");t.fireSelectOption()})}};
sap.landvisz.OptionEntity.prototype.onclick=function(e){if(e.srcControl instanceof sap.ui.commons.RadioButton)return;if(this.getEnable()==true){this.fireEvent("optionSelected");this.fireSelectOption()}};
sap.landvisz.OptionEntity.prototype.onAfterRendering=function(){if(this.getSelected()==true){this.optionBtn.setSelected(true)}};
