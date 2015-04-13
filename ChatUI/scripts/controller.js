var app = app || {};

app.controller = (function () {
    var baseUrl = '/ChatUI/#/';

    function Controller(data, views) {
        this._data = data;
        this._views = views;
    }

    Controller.prototype.loadRouter = function () {
        var _this = this;

        _this._views.showHomePage();

        this._router = Sammy(function () {
            this.get('#/', function () {
                if(sessionStorage['st']){
                    _this._views.showUserPage(sessionStorage);
                    loadFriendsOrGroups.call(_this, 'friends');
                } else {
                    _this._views.showHomePage();
                }
              });

            this.get('#/user', function () {
                if(sessionStorage['st']){
                    _this._views.showUserPage(sessionStorage);
                    loadFriendsOrGroups.call(_this, 'friends');
                } else {
                    this.setLocation(baseUrl);
                }
            });

            this.get('#/login', function () {
                _this._views.showLoginForm();
            });

            this.get('#/registration', function () {
                _this._views.showRegisterForm();
            });
        });

        this._router.run('#/');
    };

    Controller.prototype.attachEvents = function () {
        var _this = this;

        $('#main').on('click', '#register-button', function (ev) {
            registerUser.call(_this, ev);
        });

        $('#main').on('click', '#login-button', function (ev) {
            login.call(_this, ev);
        });

        $('#main').on('click', '#logout-button', function (e) {
            logout.call(_this);
        });

        $('#main').on('click', '#friends', function (e) {
            loadFriendsOrGroups.call(_this, 'friends');
        });

        $('#main').on('click', '#groups', function (e) {
            loadFriendsOrGroups.call(_this, 'groups');
        });
    };

    function getUserDataOfRegisterForm(e) {
        var $form = $(e.target).parent().parent().parents();
        var email = $form.find('#inputEmail').val();
        var username = $form.find('#inputUsername').val();
        var password = $form.find('#inputPassword').val();
        var confirmPassword = $form.find('#inputConfirmPassword').val();
        if (password === confirmPassword) {
            var user = {
                email: email,
                username: username,
                password: password,
                confirmPassword: confirmPassword
            };

            return user;
        } else {
            return null;
        }
    }

    function getUserDataOfLoginForm(e) {
        var $form = $(e.target).parent().parent().parent();
        var user = {
            username: $form.find('#inputUsername').val(),
            password: $form.find('#inputPassword').val(),
            grant_type: "password"
        };

        return user;
    }

    function getMessageError(error){
        var message = error.responseJSON.Message || error.responseJSON.error + "<br>";
        modelState = error.responseJSON.ModelState;
        for(key in modelState){
            message += modelState[key].join("<br>") + "<br>";
        }

        return message;
    }

    function login(e) {
        var _this = this;
        var user = getUserDataOfLoginForm(e);
        _this._data.users.login(user)
            .then(function (userInfo) {
                _this._data.users.getUserInfo(userInfo.access_token)
                    .then(function (user) {
                        user['access_token'] = userInfo.access_token;
                        _this._data.users.makeSession(user);
                       _this._router.setLocation(baseUrl + "user");
                    }, function (error) {
                        var message = getMessageError(data);
                        boxMessage.error('Error: ' + message);
                    })
            }, function (data) {
                var message = getMessageError(data);
                boxMessage.error('Error: ' + message);
            })
            .done();
    }

    function registerUser(e) {
        var _this = this;
        var user = getUserDataOfRegisterForm(e);
        if (user) {
            _this._data.users.registration(user)
                .then(function (userInfo) {
                    _this._router.setLocation(baseUrl);
                    boxMessage.info('User registered successfully.');
                }, function (data) {
                    var message = getMessageError(data);
                    boxMessage.error('Error: ' + message);
                })
                .done();
        } else {
            boxMessage.error('Confirm password different from the password');
        }
    }

    function logout() {
        delete sessionStorage['un'];
        delete  sessionStorage['st'];
        delete sessionStorage['id'];
        this._views.showHomePage();
    }

    function loadFriendsOrGroups(itemType) {


        if(itemType == 'friends'){
            $('#friends').addClass('active');
            $('#groups').removeClass('active');
            var items = [
                {name: "Gosho", groupId: 5, countOfUnrecivedMessages: 0},
                {name: "Pesho", groupId: 6, countOfUnrecivedMessages: 6},
                {name: "Mimi", groupId: 7, countOfUnrecivedMessages: 5},
            ];
        } else {
            $('#groups').addClass('active');
            $('#friends').removeClass('active');
            var items = [
                {name: "Team", groupId: 5, countOfUnrecivedMessages: 0},
                {name: "Pesho, Mimi and Gosho", groupId: 6, countOfUnrecivedMessages: 0},
                {name: "Mimi's team", groupId: 7, countOfUnrecivedMessages: 2},
            ];
        }


        var data = {
            items: items,
            hasMessages: function () {
                return function (text, render) {
                    var count = Number(render(text));
                    if(count > 0){
                        return count.toString();
                    }

                    return "";
                }
            }
        };

        this._views.showFriends(data);
    }

    return {
        get: function (data, views) {
            return new Controller(data, views);
        }
    }
})
();