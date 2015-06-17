/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
sap.ui.define([],function(){var C=function(){};C._isOn=true;C._entries={};C.isActive=function(){return C._isOn};C.setActive=function(a){C._isOn=a};C.getChangesFillingCache=function(l,c){if(!this.isActive()){return l.loadChanges(c)}var o=C._entries[c];if(!o){o=C._entries[c]={}}if(o.promise){return o.promise}var a=l.loadChanges(c).then(function(m){if(o.file){jQuery.sap.log.error('sap.ui.fl.Cache: Cached changes for component '+c+' overwritten.')}o.file=m;return o.file},function(e){delete o.promise;throw e});o.promise=a;return a};C._getChangeArray=function(c){var e=C._entries[c];if(e){if(e.file){return e.file.changes.changes}}};C.addChange=function(c,o){var a=C._getChangeArray(c);if(!a){return}a.push(o)};C.updateChange=function(c,o){var a=C._getChangeArray(c);if(!a){return}for(var i=0;i<a.length;i++){if(a[i].fileName===o.fileName){a.splice(i,1,o);break}}};C.deleteChange=function(c,o){var a=C._getChangeArray(c);if(!a){return}for(var i=0;i<a.length;i++){if(a[i].fileName===o.fileName){a.splice(i,1);break}}};return C},true);
