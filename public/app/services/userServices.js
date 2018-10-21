angular.module('userServices', [])
.factory('User', function($http) {
    var userFactory = {}; 
    userFactory.create = function(regData) {
        return $http.post('/api/users', regData);
    };
    userFactory.checkUsername = function(regData) {
        return $http.post('/api/checkusername', regData);
    };
    userFactory.checkEmail = function(regData) {
        return $http.post('/api/checkemail', regData);
    };
    userFactory.getPermission = function() {
        return $http.get('/api/permission/');
    };
    userFactory.getUsers = function() {
        return $http.get('/api/management/');
    };
    userFactory.getUser = function(id) {
        return $http.get('/api/editUser/' + id);
    };
    userFactory.deleteUser = function(username) {
        return $http.delete('/api/management/' + username);
    };
    userFactory.editUser = function(id) {
        return $http.put('/api/editUser', id);
    };
    return userFactory; 
});
