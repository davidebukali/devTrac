function authenticate(userName, password, successCallback, failedCallback){
    var timeout = 30000;

    var connectCallback = function(data){
        if (userLoggedIn(data)) {
            successCallback(data);
        }
        else {
            var postData = {
                username: userName,
                password: password
            };
            devtrac.common.callServiceWithTimeoutAndUrl(DT_D7.USER_LOGIN, postData, timeout, successCallback, failedCallback, failedCallback);
        }
    };
    devtrac.common.callServiceWithTimeoutAndUrl(DT_D7.SYSTEM_CONNECT, '', timeout, connectCallback, failedCallback, failedCallback);
}

function logout(successCallback, failedCallback){
    devtrac.common.callServiceWithTimeoutAndUrl(DT_D7.USER_LOGOUT, {}, 10000, successCallback, failedCallback, failedCallback);
}

function userLoggedIn(response){
    return response[DT.DATA_REF] && response[DT.DATA_REF][DT.USER_REF] &&
    response[DT.DATA_REF][DT.USER_REF][DT.NAME_REF] &&
    response[DT.DATA_REF][DT.USER_REF][DT.PASSWORD_REF];
}

