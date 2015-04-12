var app = app || {};

//TODO new data and fake data
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
        // this.products = new Table(parseComData, 'Product');
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

        User.prototype.getUserInfo = function (acessToken) {
            headers = this._service.headers;
            headers["Authorization"] = "bearer " + acessToken;
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

        Table.prototype.readAllRows = function () {
            return requester.get(this._dataUrl, this._service.headers);
        };

        Table.prototype.readAllRowsWhere = function (column, value) {
            if(value instanceof Object){
                value = JSON.stringify(value);
            } else {
                value = '"' + value + '"';
            }

            return requester.get(this._dataUrl  + '?where={"' + column + '": ' + value + '}',
                this._service.headers);
        };

        Table.prototype.addRow = function (row) {
            return requester.post( this._dataUrl, this._service.headers, row);
        };

        Table.prototype.editRow = function (objectId, row) {
           return  requester.put( this._dataUrl + '/' + objectId, this._service.headers, row)
        };

        Table.prototype.deleteRow = function (objectId) {
            return requester.delete( this._dataUrl + '/' + objectId, this._service.headers);
        };

        return Table;
    })();

    return {
        get: new Data()
    }
})();