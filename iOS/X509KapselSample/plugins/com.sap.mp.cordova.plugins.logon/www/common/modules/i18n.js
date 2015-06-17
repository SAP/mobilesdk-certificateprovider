


    var getLocalizedString;

    if (typeof jQuery === 'undefined' || typeof jQuery.sap === 'undefined') {
        getLocalizedString = function(key){
            return key;
        }
    }
    else {
        jQuery.sap.require("jquery.sap.resources");
        var locale = sap.ui.getCore().getConfiguration().getLanguage();
        var i18n = jQuery.sap.resources({'url' : "../i18n/i18n.properties", 'locale': locale});

        getLocalizedString = function(key){
            return i18n.getText(key);
        }
    }

	



module.exports = {
    getLocalizedString: getLocalizedString
};


