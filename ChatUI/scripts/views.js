var app = app || {};

app.views = (function () {
    function showHomePage() {
        loadTemplate('home-page')
            .then(mustacheRender)
            .done();
    }

    function showUserPage(sessionData) {
        loadTemplate('user-page')
            .then(function (tamplate) {
                mustacheRender(tamplate, sessionData);
            })
            .done();
    }

    function showLoginForm() {
        loadTemplate('login-form')
            .then(mustacheRender)
            .done();
    }

    function showRegisterForm() {
        loadTemplate('register-form')
            .then(mustacheRender)
            .done();
    }

    function loadTemplate(name) {
        var defer = Q.defer();
        $.get('./templates/' + name + '.html', function (template) {
            defer.resolve(template);
        });

        return defer.promise;
    }

    function mustacheRender(template, data) {
        var output = Mustache.render(template, data);
        $('#main').html('');
        $('#main').html(output);
    }

    return {
        showHomePage: showHomePage,
        showLoginForm: showLoginForm,
        showRegisterForm: showRegisterForm,
        showUserPage: showUserPage,
    };
})();
