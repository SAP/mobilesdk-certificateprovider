/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/fl/LrepConnector","sap/ui/fl/Utils"],function(L,F){var T=function(){};T.prototype.getTransports=function(p){var u,c,l,P;u='/sap/bc/lrep/actions/gettransports/';if(p['package']){u+='&package='+p['package']}if(p.name){u+='&name='+p.name}if(p.namespace){u+='&namespace='+p.namespace}if(p.type){u+='&type='+p.type}c=F.getClient();if(c){u+='&sap-client='+c}u=u.replace('&','?');l=new L();P=l.send(u);return P.then(function(r){if(r.response){if(!r.response.localonly){r.response.localonly=false}if(!r.response.errorCode){r.response.errorCode=""}return Promise.resolve(r.response)}else{return Promise.reject('response is empty')}})};return T},true);
