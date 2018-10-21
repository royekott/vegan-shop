angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 
'mainController', 'authServices', 'managementController', 'storeController'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
