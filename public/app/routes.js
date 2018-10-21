var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider         
        .when('/', {
        templateUrl: 'app/views/pages/home.html',
        authenticated: false
    })
    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
    })
    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })
    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })
    .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
    })
    .when('/management', {
        templateUrl: 'app/views/pages/management/management.html',
        controller: 'managementCtrl',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin']
    })
    .when('/store', {
        templateUrl: 'app/views/pages/store/store.html',
        controller: 'storeCtrl',
        controllerAs: 'store',
        authenticated: true
    })
    .when('/add-to-cart/', {
        templateUrl: 'app/views/pages/store/store.html',
        controller: 'storeCtrl',
        controllerAs: 'store',
        authenticated: true
    })
    .when('/reduce/', {
        templateUrl: 'app/views/pages/store/store.html',
        controller: 'storeCtrl',
        controllerAs: 'store',
        authenticated: true
    })
    .when('/remove/', {
        templateUrl: 'app/views/pages/store/store.html',
        controller: 'storeCtrl',
        controllerAs: 'store',
        authenticated: true
    })
    .when('/checkout', {
        templateUrl: 'app/views/pages/store/checkout.html',
        controller: 'storeCtrl',
        controllerAs: 'store',
        authenticated: true
    })
    .otherwise({ redirectTo: '/' }); 
    $locationProvider.html5Mode({ enabled: true, requireBase: false });
});

app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {
   
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.$$route !== undefined) {
            if (next.$$route.authenticated === true) {
                if (!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $route.reload();
                    $location.path('/'); 
                } else if (next.$$route.permission) {
                    User.getPermission().then(function(data) {
                        if (next.$$route.permission[0] !== data.data.permission) {
                            if (next.$$route.permission[1] !== data.data.permission) {
                                event.preventDefault();
                                $location.path('/'); 
                            }
                        }
                    });
                }
            } else if (next.$$route.authenticated === false) {
                if (Auth.isLoggedIn()) {
                    event.preventDefault(); 
                    $location.path('/about'); 
                }
            }
        } else {
            event.preventDefault(); 
            $location.path('/'); 
        }
    });
}]);
