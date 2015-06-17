/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.DeploymentType");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.DeploymentType",{metadata:{library:"sap.landvisz",properties:{"type":{type:"string",group:"Data",defaultValue:null}}}});
sap.landvisz.internal.DeploymentType.prototype.init=function(){this.left=0;this.top=0;this.initializationDone=false;this.entityId="";this.count=0;this.type="";this.standardWidth=0;this.srcEntityId=""};
sap.landvisz.internal.DeploymentType.prototype.initControls=function(){var c=this.getId();this.iconType&&this.iconType.destroy();this.iconType=new sap.ui.commons.Image(c+"-solutionCategoryImg");this.iconLeft&&this.iconLeft.destroy();this.iconLeft=new sap.ui.commons.Image(c+"-solutionCategoryLeftImg");this.iconRight&&this.iconRight.destroy();this.iconRight=new sap.ui.commons.Image(c+"-solutionCategoryRightImg")};
