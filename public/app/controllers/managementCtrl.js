angular.module('managementController', ['storeServices', 'ngDialog'])

.controller('managementCtrl', function(User, $scope, Product, ngDialog, $http, $timeout, $location, $route) {
    var app = this;

    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false; 
    app.editAccess = false;
    app.deleteAccess = false;
    app.limit = 5;
    app.searchLimit = 0;

    function getUsers() {
        User.getUsers().then(function(data) {
            if (data.data.success) {
                if (data.data.permission === 'admin') {
                    app.users = data.data.users; 
                    app.loading = false; 
                    app.accessDenied = false;
                    if (data.data.permission === 'admin') {
                        app.editAccess = true;
                        app.deleteAccess = true;
                    }
                } else {
                    app.errorMsg = 'Insufficient Permissions'; 
                    app.loading = false; 
                }
            } else {
                app.errorMsg = data.data.message;
                app.loading = false; 
            }
        });
    }
    getUsers(); 
    
    app.showAll = function() {
        app.limit = undefined; 
        app.showMoreError = false;
    };
    
    app.deleteUser = function(username) {
        User.deleteUser(username).then(function(data) {
            if (data.data.success) {
                getUsers(); 
            } else {
                app.showMoreError = data.data.message; 
            }
        });
    };

    app.search = function(searchKeyword, number) {
        if (searchKeyword) {
            if (searchKeyword.length > 0) {
                app.limit = 0;
                $scope.searchFilter = searchKeyword; 
                app.limit = number;
            } else {
                $scope.searchFilter = undefined;
                app.limit = 0;
            }
        } else {
            $scope.searchFilter = undefined;
            app.limit = 0;
        }
    };
    
    app.clear = function() {
        $scope.number = 'Clear'; 
        app.limit = 0;
        $scope.searchKeyword = undefined;
        $scope.searchFilter = undefined;
        app.showMoreError = false; 
    };
    
    app.sortOrder = function(order) {
        app.sort = order; 
    };

    function getProducts() {
        Product.getProducts().then(function (data) {
           app.products = data.data.products;
        });
    }
    getProducts();

    app.addProductTepmlate = function () {
        ngDialog.open({
            template: 'newProduct',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    app.editUserTemplate = function () {
        ngDialog.open({
            template: 'edit_user_template',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        $scope.get_userId = $(event.target).attr("data-id");
        $http.get('/api/getUser/' + $scope.get_userId).then(function (data) {
            if (data.data.success) {
                app.placeholder_user = data.data.user;
                app.placeholder_user_name = data.data.user.name;
                app.placeholder_user_username = data.data.user.username;
                app.placeholder_user_email = data.data.user.email;
                app.placeholder_user_permission = data.data.user.permission;
                app.placeholder_user_city = data.data.user.city;
                app.placeholder_user_street = data.data.user.street;
                app.placeholder_user_id = data.data.user._id;
            } else {
                errorMsg = data.data.message;
                console.log('Error where edit user dialog');
            } 
        }); 
    };

    app.editUser = function (newUser) {
        
        if (newUser == undefined) {
            newUser = app.placeholder_user;
        }
        if (newUser.edit_name == undefined) {
            newUser.edit_name = app.placeholder_user_name;
        }
        if (newUser.edit_username == undefined) {
            newUser.edit_username = app.placeholder_user_username;
        }
        if (newUser.edit_email == undefined) {
            newUser.edit_email = app.placeholder_user_email;
        }
        if (newUser.edit_permission == undefined) {
            newUser.edit_permission = app.placeholder_user_permission;
        }
        if(newUser.edit_city == undefined) {
            newUser.edit_city = app.placeholder_user_city;
        }
        if(newUser.edit_street == undefined) {
            newUser.edit_street = app.placeholder_user_street;
        }
        var edit_user = {
            name: newUser.edit_name,
            username: newUser.edit_username,
            email: newUser.edit_email,
            permission: newUser.edit_permission,
            id: app.placeholder_user_id,
            city: newUser.edit_city,
            street: newUser.edit_street
        };

        $http.put('/api/editUser', edit_user).then(function (data) {
            app.disabled = true;
            app.loading = true;
            app.errorMsg = false;

            if (data.data.success) {
                app.successMsg = data.data.message;
                $timeout(function() {
                    ngDialog.close();
                    $route.reload();
                    app.successMsg = false;
                }, 2000);
            } else {
                app.errorMsg = data.data.message;
                $timeout(function() {
                    ngDialog.close();
                }, 2000);
            }
        });
    };

    app.editProductTemplate = function () {
        ngDialog.open({
            template: 'editProduct',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        $scope.get_productId = $(event.target).attr("data-id");
        $http.get('/api/getProduct/' + $scope.get_productId).then(function (data) {
            if (data.data.success) {
                app.placeholder_product = data.data.product;
                app.placeholder_title = data.data.product.title;
                app.placeholder_category = data.data.product.category;
                app.placeholder_price = data.data.product.price;
                app.placeholder_imagePath = data.data.product.imagePath;
                app.placeholder_id = data.data.product._id;
            } else {
                successMsg = data.data.message;
                console.log('Error where edit product dialog');
            }
        });
    };

    app.editProduct = function (newProduct) {
        if ( newProduct == undefined) {
            newProduct = app.placeholder_product;
        }
        if (newProduct.edit_title == undefined) {
            newProduct.edit_title = app.placeholder_title;
        } 
        if (newProduct.edit_category == undefined) {
            newProduct.edit_category = app.placeholder_category;
        }
        if (newProduct.edit_price == undefined) {
            newProduct.edit_price = app.placeholder_price;
        }
        if (newProduct.edit_imagePath == undefined) {
            newProduct.edit_imagePath = app.placeholder_imagePath;
        }
        var edit_product = {
            title: newProduct.edit_title,
            category: newProduct.edit_category,
            price: newProduct.edit_price,
            imagePath: newProduct.edit_imagePath,
            id: app.placeholder_id
        }
        $http.put('/api/editProduct', edit_product).then(function (data) {
            app.disabled = true;
            app.loading = true;
            app.errorMsg = false;

            if (data.data.success) {
                app.successMsg = data.data.message;
                $timeout(function() {
                    ngDialog.close();
                    $route.reload();
                    app.successMsg = false;
                }, 2000);
            } else {
                app.errorMsg = data.data.message;
                $timeout(function() {
                    ngDialog.close();
                }, 2000);
            }
            
        });
    }

    app.addNewProduct = function (newProduct, valid) {
        app.disabled = true;
        app.loading = true; 
        app.errorMsg = false;

        if (valid) {
            var new_product = {
                title: newProduct.new_title,
                category: newProduct.new_category,
                price: newProduct.new_price,
                imagePath: newProduct.new_imagePath            
            };

            $http.post('/api/new-product', new_product).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        ngDialog.close();
                        $route.reload();
                        app.successMsg = false;
                    }, 2000);
                } else {
                    app.loading = false; 
                    app.disabled = false;
                    $scope.alert = 'alert alert-danger'; 
                    app.errorMsg = data.data.message;
                    $timeout(function() {
                        ngDialog.close();
                        app.errorMsg = false;
                    }, 2000);
                }
            });
        } else {
            app.disabled = false; 
            app.loading = false; 
            $scope.alert = 'alert alert-danger';
            app.errorMsg = 'Please ensure form is filled out properly';
            $timeout(function() {
                $scope.alert = false;
                app.errorMsg = '';
            }, 3000);
        }
    }
});
