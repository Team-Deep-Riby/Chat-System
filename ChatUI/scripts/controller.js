var app = app || {};

app.controller = (function () {
    var baseUrl = '#/';

    function Controller(data, views) {
        this._data = data;
        this._views = views;
    }

    Controller.prototype.loadRouter = function () {
        var _this = this;

        _this._views.showHomePage();

        this._router = Sammy(function () {
            this.get('#/', function () {
                if (sessionStorage['st']) {
                    _this._views.showUserPage(sessionStorage);
                    loadFriends.call(_this);
                } else {
                    _this._views.showHomePage();
                }
            });

            this.get('#/user', function () {
                if (sessionStorage['st']) {
                    _this._views.showUserPage(sessionStorage);
                    loadFriends.call(_this);
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
            loadFriends.call(_this, 'friends');
        });

        $('#main').on('click', '#groups', function (e) {
            loadGroups.call(_this);
        });

        $('#main').on('click', '#add-friend', function (e) {
            _this._views.showAddFriendForm();
        });

        $('#main').on('click', '#create-group', function (e) {
            _this._views.showCreateGroupForm();
        });

        $('#main').on('click', '#add-friend-button', function (e) {
            addFriend.call(_this);
        });

        $('#main').on('click', '#create-group-button', function (e) {
            createGroup.call(_this);
        });

        $('#main').on('click', '#friends-and-groups', function (ev) {
            changeReciver.call(_this, ev);
        });

        $('#main').on('click', '#sent-button', function (ev) {
            sentMessage.call(_this, ev);
        });

        $('#main').on('click', '#add-friend-in-group', function (ev) {
            loadFriendsCheckBoxList.call(_this);
        });

        $('#main').on('click', '#add-friends-in-group-button', function (ev) {
            AddFriendsInGroup.call(_this);
        });
    };

    Controller.prototype.refreshInfo = function(){
        refreshMessagesWindow.call(this)
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

    function getMessageError(error) {
        var message = error.responseJSON.Message || error.responseJSON.error + "<br>";
        modelState = error.responseJSON.ModelState;
        for (key in modelState) {
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

    function addFriend(username) {
        var _this = this;
        var username = $('#modal-content #inputUsername').val();
        var user = _this._data.users.getLoginUserData();
        _this._data.friends.addUser(username, user.sessionToken)
            .then(function () {
                loadFriends.call(_this);
            }, function (data) {
                boxMessage.error('Error: ' + data.responseText);
            });
    }

    function createGroup() {
        var _this = this;
        var groupName = $('#modal-content #inputGroupName').val();
        var user = _this._data.users.getLoginUserData();
        _this._data.groups.createNewGroup(groupName, user.sessionToken)
            .then(function () {
                loadGroups.call(_this);
            }, function (data) {

                boxMessage.error('Error: ' + data.responseText);
            });
    }

    function changeReciver(ev) {
        var _this = this;
        var user = this._data.users.getLoginUserData();
        var $target = $(ev.target);
        var reciverName = $target.text();
        var reciverId = $target.parent().attr('id');
        if($('#groups')[0].classList.contains('active')){
            _this._data.groups.getUsers(reciverId, user.sessionToken)
                .then(function (users) {
                    var names = [];
                    var i;
                    for(i = 0; i < users.length; i++){
                        names.push(users[i].UserName)
                    }

                    $('#reciver-name #users').text(names.join(', '));
                    $('#reciver-name #name').text(reciverName + ': ');
                });
        }

        var $reciver = $('#reciver-name #name').text(reciverName);
        $('#reciver-name #users').text('');
        $reciver.attr('data-group-id', reciverId);
        $('#chat-window').removeClass('hide');

        refreshMessagesWindow.call(this, user.sessionToken, reciverId);
    }

    function sentMessage(ev) {
        var _this = this;
        var content = $('#inputMessage').val();
        var user = _this._data.users.getLoginUserData();
        var groupId = $('#reciver-name #name').attr('data-group-id');
        _this._data.messages.send(user.sessionToken, groupId, content)
            .then(function (data) {
                $('#inputMessage').val('');
                refreshMessagesWindow.call(_this);
            }, function (data) {
                var message = getMessageError(data);
                boxMessage.error('Error: ' + message);
            });
    }

    function loadFriendsCheckBoxList() {
        var _this = this;
        var user = _this._data.users.getLoginUserData();
        _this._data.friends.get(user.sessionToken)
            .then(function (friends) {
                var data = {friends: friends};
                _this._views.showFriendsCheckBoxList(data);
            }, function (data) {
                var message = getMessageError(data);
                console.error('Error: ' + message);
            });
    }


    function AddFriendsInGroup() {
        var _this = this;
        var user = _this._data.users.getLoginUserData();
        var friends = getFriendsOfCheckBoxList();
        var groupId = $('#reciver-name #name').attr('data-group-id');
        var i;
        var names = [];
        for(i = 0; i <  friends.ids.length; i++){
            _this._data.groups.addUsers(groupId, friends.ids[i], user.sessionToken)
                .then(function (name){
                    names.push(name);
                    _this._views.showFriendsInGroup(names);
                }, function (data) {
                    var message = getMessageError(data);
                    console.error('Error: ' + message);
                });
        }

     }

    function getFriendsOfCheckBoxList() {
        var friends = {
            ids: [],
            names: []
        };

        var $checkBoxes = $('#modal-content input[type=checkbox]:checked');
        $checkBoxes.each(function () {
            var $user = $(this);
            var userId = $user.attr('id');
            var username = $user.attr('data-name');
            friends.ids.push(userId);
            friends.names.push(username);
        });

        return friends;
    }

    //Function for load on elements of page
    function refreshMessagesWindow() {
        var _this = this;
        var user = _this._data.users.getLoginUserData();
        var groupId = $('#reciver-name #name').attr('data-group-id');
        var _this = this;
        _this._data.messages.get(user.sessionToken, groupId)
            .then(function (messages) {
                var data = {messages: messages.reverse()};
                _this._views.showMessages(data);
            }, function (data) {
                var message = getMessageError(data);
                console.error('Error: ' + message);
            });
    }

    function loadGroups() {
        var _this = this;
        var user = _this._data.users.getLoginUserData();
        _this._data.groups.get(user.sessionToken)
            .then(function (items) {
                $('#groups').addClass('active');
                $('#friends').removeClass('active');
                $('#add-friend-in-group').show();

                var data = {
                    items: items,
                    hasMessages: function () {
                        return function (text, render) {
                            var count = Number(render(text));
                            if (count > 0) {
                                return count.toString();
                            }

                            return "";
                        }
                    }
                };

                _this._views.showFriendsOrGroups(data);
            }, function (error) {
                var message = getMessageError(data);
                boxMessage.error('Error: ' + message);
            });
    }


    function loadFriends() {
        var _this = this;
        var user = _this._data.users.getLoginUserData();
        _this._data.friends.get(user.sessionToken)
            .then(function (items) {
                $('#friends').addClass('active');
                $('#groups').removeClass('active');
                $('#add-friend-in-group').hide();

                var data = {
                    items: items,
                    hasMessages: function () {
                        return function (text, render) {
                            var count = Number(render(text));
                            if (count > 0) {
                                return count.toString();
                            }

                            return "";
                        }
                    }
                };

                _this._views.showFriendsOrGroups(data);
            });
    }


    return {
        get: function (data, views) {
            return new Controller(data, views);
        }
    }
})
();