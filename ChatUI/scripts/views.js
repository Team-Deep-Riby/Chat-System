var app = app || {};

app.views = (function () {
    function showHomePage() {
        loadTemplate('home-page')
            .then(function (tamplate) {
                mustacheRender(tamplate, null, '#main');
            })
            .done();
    }

    function showUserPage(sessionData) {
        loadTemplate('user-page')
            .then(function (template) {
                mustacheRender(template, sessionData, '#main');
            })
            .done();
    }

    function showFriends(sessionData) {
        loadTemplate('friends-and-groups')
            .then(function (template) {
                mustacheRender(template, sessionData, '#friends-and-groups');
            })
            .done();
    }

    function showLoginForm() {
        loadTemplate('login-form')
            .then(function(template){
                mustacheRender(template, null, '#main')
            })
            .done();
    }

    function showRegisterForm() {
        loadTemplate('register-form')
            .then(function (tamplate) {
                mustacheRender(tamplate, null, '#main');
            })
            .done();
    }

    function loadTemplate(name) {
        var defer = Q.defer();
        $.get('./templates/' + name + '.html', function (template) {
            defer.resolve(template);
        });

        return defer.promise;
    }

    function mustacheRender(template, data, domElementId) {
        var output = Mustache.render(template, data);
        $(domElementId).html('');
        $(domElementId).html(output);
    }

    return {
        showHomePage: showHomePage,
        showLoginForm: showLoginForm,
        showRegisterForm: showRegisterForm,
        showUserPage: showUserPage,
        showFriends: showFriends
    };
})();
