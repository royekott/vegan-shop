angular.module('mainController', ['authServices', 'userServices', 'ngDialog'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window, $interval, User, AuthToken, $scope, $http, $route, ngDialog) {
    var app = this;
    app.loadme = false; 
    if ($window.location.pathname === '/') app.home = true; 

    if (Auth.isLoggedIn()) {
        Auth.getUser().then(function(data) {
            if (data.data.username === undefined) {
                Auth.logout(); 
                app.isLoggedIn = false;
                $location.path('/'); 
                app.loadme = true; 
            }
        });
    }

    function countProducts () {
        $http.get('/api/').then(function(data) {
            if (data.data.success) {
                app.productCount = data.data.countProducts;
            } else {
                app.productCount = data.data.message;            
            }
        });
    }

    countProducts();

    app.checkSession = function() {
        if (Auth.isLoggedIn()) {
            app.checkingSession = true; 
            var interval = $interval(function() {
                var token = $window.sessionStorage.getItem('token'); 
                if (token === null) {
                    $interval.cancel(interval); 
                } else {
                    self.parseJwt = function(token) {
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-', '+').replace('_', '/');
                        return JSON.parse($window.atob(base64));
                    };
                    var expireTime = self.parseJwt(token);
                    var timeStamp = Math.floor(Date.now() / 1000); 
                    var timeCheck = expireTime.exp - timeStamp;
                    if (timeCheck <= 1800) {
                        showModal(1); 
                        $interval.cancel(interval);
                    }
                }
            }, 30000);
        }
    };

    app.checkSession(); 
 
    var showModal = function(option) {
    
        if (option === 2) {
            ngDialog.open({
                template: 'myModal',
                className: 'ngdialog-theme-default',
                showClose: false,
                header: false,
                scope: $scope
            });
            $timeout(function() {
                ngDialog.close();   
                Auth.logout(); 
                $location.path('/logout'); 
            }, 4000);
        }
    };

    $rootScope.$on('$routeChangeSuccess', function() {
        if ($window.location.pathname === '/') {
            app.home = true; 
        } else {
            app.home = false; 
        }
    });

    $rootScope.$on('$routeChangeStart', function() {
        if (!app.checkingSession) app.checkSession();

        if (Auth.isLoggedIn()) {
            Auth.getUser().then(function(data) {
                if (data.data.username === undefined) {
                    app.isLoggedIn = false; 
                    Auth.logout();
                    app.isLoggedIn = false;
                    $location.path('/');

                } else {
                    app.isLoggedIn = true; 
                    app.username = data.data.username; 
                    checkLoginStatus = data.data.username;
                    app.useremail = data.data.email; 
                    User.getPermission().then(function(data) {
                        if (data.data.permission === 'admin') {
                            app.authorized = true; 
                            app.loadme = true; 
                        } else {
                            app.authorized = false;
                            app.loadme = true; 
                        }
                    });
                }
            });
        } else {
            app.isLoggedIn = false; 
            app.username = ''; 
            app.loadme = true; 
        }
        app.disabled = false; 
        app.errorMsg = false; 

    });

    this.doLogin = function(loginData) {
        app.loading = true; 
        app.errorMsg = false; 
        app.expired = false;  
        app.disabled = true; 
        $scope.alert = 'default';

        Auth.login(app.loginData).then(function(data) {
            if (data.data.success) {
                app.loading = false; 
                $scope.alert = 'alert alert-success';
                app.successMsg = data.data.message + '...Redirecting';
                    ngDialog.open({
                        template: 'myModal',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        header: false,
                        scope: $scope
                    });
                $timeout(function() {
                    ngDialog.close();
                    $location.path('/store'); 
                    app.loginData = ''; 
                    app.successMsg = false; 
                    app.disabled = false; 
                    app.checkSession(); 
                }, 3000);
            } else {
                app.loading = false; 
                app.disabled = false; 
                $scope.alert = 'alert alert-danger'; 
                app.errorMsg = data.data.message; 
            }
        });
    };

    app.contactUs = function (contactMail, valid) {

        if (valid) {
            app.contactMail = contactMail;
            ngDialog.open({
                template: 'contactTemplate',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
            $timeout(function() {
                ngDialog.close(); 
            }, 4000);
        }
    };


    app.logout = function() {
        showModal(2); 
    };
});
