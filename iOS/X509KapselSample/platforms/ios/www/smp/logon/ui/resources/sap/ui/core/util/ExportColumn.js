/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','./ExportCell'],function(q,M,E){'use strict';var a=M.extend("sap.ui.core.util.ExportColumn",{metadata:{properties:{name:"string"},aggregations:{template:{type:"sap.ui.core.util.ExportCell",multiple:false}}}});return a},true);
