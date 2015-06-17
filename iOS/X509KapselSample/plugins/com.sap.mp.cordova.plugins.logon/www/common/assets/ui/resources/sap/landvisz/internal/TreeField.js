/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.TreeField");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.TreeField",{metadata:{library:"sap.landvisz",properties:{"treeModel":{type:"object",group:"Data",defaultValue:null},"bindingName":{type:"string",group:"Data",defaultValue:null},"renderingSize":{type:"sap.landvisz.EntityCSSSize",group:"Dimension",defaultValue:null}},aggregations:{"treeNode":{type:"sap.ui.commons.TreeNode",multiple:true,singularName:"treeNode"}}}});
sap.landvisz.internal.TreeField.prototype.init=function(){this.initializationDone=false};
sap.landvisz.internal.TreeField.prototype.exit=function(){this.tree&&this.tree.destroy();this.oTreeNodeTemplate&&this.oTreeNodeTemplate.destroy();this.jsonModel&&this.jsonModel.destroy()};
sap.landvisz.internal.TreeField.prototype.initControls=function(){var n=this.getId();if(!this.tree)this.tree=new sap.ui.commons.Tree(n+"CLVTree");if(!this.jsonModel)this.jsonModel=new sap.ui.model.json.JSONModel();if(!this.oTreeNodeTemplate)this.oTreeNodeTemplate=new sap.ui.commons.TreeNode(n+"CLVTreeNode")};
