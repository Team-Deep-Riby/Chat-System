var requester = (function(){
    function makeRequest(method, url, contentType, headers, userData) {
        var defer = Q.defer();

        $.ajax({
            method: method,
            headers: headers,
            url: url,
            contentType: contentType,
            data: contentType == 'application/json' ? JSON.stringify(userData): userData,
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });

        return defer.promise;
    };

    function makeGetRequest( url, headers){
       return makeRequest('GET', url,  'application/json', headers,  undefined)
    }

    function makePostRequest( url ,contentType, headers, userData){
       return makeRequest('POST', url, contentType, headers,  userData)
    }

    function makeDeleteRequest( url, headers){
        return makeRequest('DELETE', url,'application/json', headers,  undefined)
    }

    function makePutRequest( url, headers, userData){
        return makeRequest('PUT', url, 'application/json', headers,  userData)
    }

    return {
        get: makeGetRequest,
        post: makePostRequest,
        put: makePutRequest,
        delete: makeDeleteRequest
    }
})();