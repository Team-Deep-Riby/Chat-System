var app = app || {};


//Object.prototype.extends = function (parent) {
//    if (!Object.create) {
//        Object.prototype.create = function (proto) {
//            function F() {
//            };
//            F.prototype = proto;
//            return new F;
//        };
//    }
//
//    this.prototype = Object.create(parent.prototype);
//    this.prototype.constructor = this;
//};

app.data = (function(){
    var headers = {
      //  "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8",
        'Accept': 'application/json'
     };

    var serviceData = {
        headers : headers,
        url: 'http://localhost:39959/api/'
    };

    var serviceUser = {
        headers : headers,
        url: 'http://localhost:39959/'
    };

    function Data(){
        this.friends = new Table(serviceData, 'Friends');
        this.groups = new Table(serviceData, 'Friends');
        this.users = new User(serviceUser);
    }

    var User = (function(){
        function User(service){
            this._service = service;
        }

        User.prototype.makeSession = function (userInfo){
            sessionStorage.setItem('un', userInfo.Username);
            sessionStorage.setItem('st', userInfo.access_token);
            sessionStorage.setItem('id',userInfo.Id );
        };

        User.prototype.getLoginUserData = function () {
            var user;
            if(sessionStorage['un'] &&
                sessionStorage['st'] &&
                sessionStorage['st']) {
                user = {
                    username: sessionStorage['un'],
                    sessionToken: sessionStorage['st'],
                    id: sessionStorage['id']
                };

                return user;
            } else {
                return null
            }
        };

        User.prototype.registration = function (user) {
            return requester.post(this._service.url + 'api/Account/Register', 'application/json', this._service.headers, user);
        };

        User.prototype.getUserInfo = function (accessToken) {
            headers = this._service.headers;
            headers["Authorization"] = "bearer " + accessToken;
            return requester.get(this._service.url + 'api/Account/UserInfo', headers);
        }

        User.prototype.login = function (user) {
            var data = "username=" + user.username +
                "&password=" + user.password +
                "&grant_type=password";
             return requester.post(this._service.url + 'token', 'application/raw;charset=utf-8',
                 this._service.headers, data);
        };

        return User;
    })();

    var Table = (function(){
        function Table(service, tableName){
            this._service = service;
            this._dataUrl = service.url + tableName
        }

        Table.prototype.addHeader = function (key, value) {
            this._service.headers[key] = value;
        };

        Table.prototype.get = function(accessToken, groupId){
            var id = '';
            if(groupId != undefined){
                id = '/' + groupId;
            }

            this.addHeader("Authorization","bearer " + accessToken);
            return requester.get(this._dataUrl + id, this._service.headers)
        };

        return Table;
    })();

    //var Friends = (function () {
    //    function Friends(service) {
    //        Table.call(this, service, 'Friends');
    //    }
    //
    //    Friends.extends(Table);
    //
    //    Friends.prototype.addUser = function(userId, accessToken) {
    //        this.addHeader("Authorization","bearer " + accessToken);
    //        return requester.post(this._dataUrl + '/add/' + userId, 'application/json', this._service.headers, null);
    //    };
    //
    //    return Friends;
    //})();

    return {
        get: new Data()
    }
})();