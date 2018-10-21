angular.module('storeServices', [])

.factory('Product', function ($http) {
    var storeFactory = {};

    storeFactory.getProducts = function () {
        return $http.get('/api/store');
    };

    storeFactory.getProduct = function (id) {
        return $http.get('/api/editProduct/' + id)
    }

    storeFactory.editProduct = function (id) {
        return $http.put('/api/editProduct', id);
    };
    return storeFactory;
});

