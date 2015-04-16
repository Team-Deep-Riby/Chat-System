var app = app || {};

app.data = (function () {
    //Object.prototype.ext = function (parent) {
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

    var headers = {
        //  "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8",
        'Accept': 'application/json'
    };

    var serviceData = {
        headers: headers,
        //url: 'http://localhost:39959/api/'
        url :'http://team-deep-ruby.azurewebsites.net/api/'
    };

    var serviceUser = {
        headers: headers,
        //url: 'http://localhost:39959/'
        url: 'http://team-deep-ruby.azurewebsites.net/'
    };

    function Data() {
        this.messages = new Message(serviceData);
        this.friends = new Friend(serviceData);
        this.groups = new Group(serviceData);
        this.users = new User(serviceUser);
    }

    var User = (function () {
        function User(service) {
            this._service = service;
        }

        User.prototype.makeSession = function (userInfo) {
            sessionStorage.setItem('un', userInfo.Username);
            sessionStorage.setItem('st', userInfo.access_token);
            sessionStorage.setItem('id', userInfo.Id);
        };

        User.prototype.getLoginUserData = function () {
            var user;
            if (sessionStorage['un'] &&
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
        };

        User.prototype.login = function (user) {
            var data = "username=" + user.username +
                "&password=" + user.password +
                "&grant_type=password";
            return requester.post(this._service.url + 'token', 'application/raw;charset=utf-8',
                this._service.headers, data);
        };

        return User;
    })();

    var Table = (function () {
        function Table(service, tableName) {
            this._service = service;
            this._dataUrl = service.url + tableName
        }

        Table.prototype.addHeader = function (key, value) {
            this._service.headers[key] = value;
        };

        Table.prototype.get = function (accessToken, groupId) {
            var id = '';
            if (groupId != undefined) {
                id = '/' + groupId;
            }

            this.addHeader("Authorization", "bearer " + accessToken);
            return requester.get(this._dataUrl + id, this._service.headers)
        };

        return Table;
    })();

    var Friend = (function () {
        function Friend(service) {
            Table.call(this, service, 'Friends');
        }

        Friend.prototype = Object.create(Table.prototype);
        Friend.prototype.constructor = Friend;

        Friend.prototype.addUser = function (username, accessToken) {
            this.addHeader("Authorization", "bearer " + accessToken);
            return requester.post(this._dataUrl + '/add/' + username, 'application/json', this._service.headers, null);
        };

        return Friend;
    })();


    var Group = (function () {
        function Group(service) {
            Table.call(this, service, 'Groups');
        }

        Group.prototype = Object.create(Table.prototype);
        Group.prototype.constructor = Group;

        Group.prototype.createNewGroup = function (groupName, accessToken) {
            this.addHeader("Authorization", "bearer " + accessToken);
            var group = {groupName: groupName};
            return requester.post(this._dataUrl + '/create', 'application/json', this._service.headers, group);
        };

        Group.prototype.addUsers = function (groupId, friendsId, accessToken) {
            var data = {
                groupId: groupId, //todo  look service
                userId : friendsId //todo look service
            };

            this.addHeader("Authorization", "bearer " + accessToken);
            return requester.post(this._dataUrl + '/friends/add', 'application/json', this._service.headers, data);
        };

        Group.prototype.getUsers = function (groupId, accessToken) {
            this.addHeader("Authorization", "bearer " + accessToken);
            return requester.get(this._dataUrl + '/friends/' + groupId, this._service.headers);
        };

        return Group;
    })();

    var Message = (function () {
        function Message(service) {
            Table.call(this, service, 'Messages');
        }

        Message.prototype = Object.create(Table.prototype);
        Message.prototype.constructor = Message;

        Message.prototype.send = function(accessToken, groupId, content){
            this.addHeader("Authorization", "bearer " + accessToken);
            var message = {
                groupId: groupId,
                content: content
            };

            return requester.post(this._dataUrl + '/send', 'application/json', this._service.headers, message);
        };

        return Message;
    })();

    return {
        get: new Data()
    }
})();