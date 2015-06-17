
    var utils = sap.logon.Utils;
    
    var screens = {
        
    }
    
    var getScreen = function (screenId, context) {
        var screen;
        if (typeof screens[screenId] === 'function') {
            screen = screens[screenId](context);
        }
        return screen;
    }
    
    module.exports = {
        getScreen: getScreen
    }


