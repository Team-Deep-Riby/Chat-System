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
                _this._views.showHomePage();
            });

            this.get('#/user', function () {
                if(sessionStorage['st']){
                    _this._views.showUserPage(sessionStorage);
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

        $('header').on('click', '#logout-button', function (e) {
            logout.call(_this);
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


    function addProduct(e) {
        var _this = this;

        var user = _this._data.users.getLoginUserData();
        var $form = $(e.target).parent().parent();
        var acl = {};

        acl[user.id] = {
            "read": true,
            "write": true
        };
        acl["*"] = {
            "read": true
        };

        var product = {
            name: $form.find('#name').val(),
            category: $form.find('#category').val(),
            price: Number($form.find('#price').val()),
            ACL: acl
        };

        _this._data.products.addRow(product)
            .then(function (data) {
                _this._router.setLocation('#/products');
                boxMessage.info('Product successfully added.');
            }, function (error) {
                boxMessage.error('Error: ' + data.responseJSON.error);
            })
            .done();
    }

    function loadProducts() {
        var _this = this;
        var user = _this._data.users.getLoginUserData();
        if (!user) {
            _this._router.setLocation('#/');
        }

        _this._data.products.readAllRows()
            .then(function (data) {
                data.results.forEach(function (result) {
                    //var keys = Object.keys(result.ACL)
                    if (result.ACL && result.ACL[user.id]) {
                        var $footer = $('<footer class="product-footer" id="{{objectId}}">' +
                        '<a href="#/products/edit/{{objectId}}">' +
                        ' <button class="edit-button">Edit</button>\n\r' +
                        '</a>' +
                        '<a href="#/products">' +
                        '<button class="delete-button">Delete</button>' +
                        '</a>' +
                        '</footer>');
                        result['footer'] = $footer.html();
                    }
                });
                _this._views.showProductList(data);
            }, function (error) {
                boxMessage.error('Error... try again!!!');
            })
            .done();
    }

    function deleteProduct(e) {
        var _this = this;
        var id = $(e.target).parent().parent().attr('id');
        var user = _this._data.users.getLoginUserData();
        _this._data.products.addHeader('X-Parse-Session-Token', user.sessionToken);
        _this._data.products.deleteRow(id)
            .then(function (data) {
                loadProducts.call(_this);
                boxMessage.info('Product successfully deleted.');
            }, function (error) {
                boxMessage.error('Error: ' + data.responseJSON.error);
            })
            .done();
    }

    function editProduct(e) {
        var $form = $(e.target).parent().parent();
        var product = {
            name: $form.find('#item-name').val(),
            category: $form.find('#category').val(),
            price: Number($form.find('#price').val())
        };

        var id = $(e.target).attr('data-id');

        var _this = this;
        var user = _this._data.users.getLoginUserData();
        _this._data.products.addHeader('X-Parse-Session-Token', user.sessionToken);
        _this._data.products.editRow(id, product)
            .then(function (data) {
                _this._router.setLocation('#/products');
                boxMessage.info('Product successfully edited.');
            }, function (error) {
                boxMessage.error('Error: ' + data.responseJSON.error);
            })
            .done();
    }


    return {
        get: function (data, views) {
            return new Controller(data, views);
        }
    }
})
();