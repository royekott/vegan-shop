angular.module('storeController', ['storeServices', 'ngDialog'])

.controller('storeCtrl', function (Product, $scope, $http, Auth,  $timeout, $location, ngDialog) {
    var app = this;
    app.limit = 0;

    var condition = true;
    function getProducts() {
        app.count = 0;
        Product.getProducts().then(function (data) {
           app.products = data.data.products;
           app.current_category = app.products;
           app.bestSellers = [];
           for (var i = 0; i < app.products.length; i++) {
               if (app.products[i].category == "best_sellers") {
                   app.bestSellers.push(app.products[i]);
               }
           }
        });
    }

    getProducts();
    app.category = function () {
        $scope.get_category = $(event.target).attr("data-category");
        app.categoryName = $scope.get_category;
        var categoryArr = [];
        for (var i = 0; i < app.products.length; i++) {
            get_product_category = app.products[i].category;
            if ($scope.get_category == app.products[i].category) {
                categoryArr.push(app.products[i]);
                app.current_category = categoryArr;
            }
            if (app.products[i] == "best_sellers") {
                categoryArr.push(app.products[i]);
                app.current_category = categoryArr;
            }
        }
    };

    app.bestSellers = function () {
        var counting = 0;
        for (var i = 0; i < app.products.length; i++) {
            counting++;
        }
    }

    function showCart () {
        
        $http.get('/api/add-to-cart', $scope.get_products).then(function (data) {
            app.cartProducts = data.data.products;
            app.totalPrice = data.data.totalPrice;
            app.totalQty = data.data.totalQty;
            if (app.totalQty == undefined || app.totalQty == 0) {
                app.emptyMsg = true;
            } else {
                app.emptyMsg = false;
            }
        });
    };

    app.addToCart = function () {
        $scope.get_productsId = $(event.target).attr("data-id");
        $scope.get_products = $(event.target).attr("data-product");
        if ($scope.get_productsId == undefined) {
            console.log('Url is undefined');
        } else {
            $http.get('/api/add-to-cart/' + $scope.get_productsId).then(function (data) {
                if (data.data.success) {
                    showCart();
                } else {
                    console.log('Somthing bad happend here!');
                }
            });
        }        
    };

    app.search = function(searchKeyword, number) {
        app.display = false;
        if (searchKeyword) {
            if (searchKeyword.length > 0) {
                app.limit = 0;
                $scope.searchFilter = searchKeyword;
                app.limit = number;
                app.display = true;
            } else {
                $scope.searchFilter = undefined;
                app.limit = 0;
            }
        } else {
            $scope.searchFilter = undefined;
            app.limit = 0;
        }
    };
    
    app.reduceByOne = function () {
        $scope.get_productsId = $(event.target).attr("data-id");
        $http.get('/api/reduce/' + $scope.get_productsId).then(function (data) {
            if (data.data.success) {
                showCart();
            } else {
                console.log('Somthing went wrong in reducing by one. Error: ' + err);
            }
        });
    };

    app.removeAll = function () {
        $scope.get_productsId = $(event.target).attr("data-id");
        $http.get('/api/remove/' + $scope.get_productsId).then(function (data) {
            if (data.data.success) {
                showCart();
            } else {
                console.log('Somthing went wrong in removing all. Error: ' + err);
            }
        });
    };

    if (condition) {
        showCart();
        condition = false;
    }

    app.openConfirmButton = function (rel) {
        ngDialog.openConfirm({
            template: 'saveAndLogout',
            className: 'ngdialog-theme-default dialogwidth800',
            scope: $scope
        }).then(function (value) {
            saveCart();
        });
    };

    function saveCart () {
        var cartTobeSaved = {
            cartProducts: app.cartProducts,
            totalPrice: app.totalPrice,
            totalQty: app.totalQty
        }
        $http.post('/api/save-cart', cartTobeSaved).then(function(data) {
            if (data.data.success) {
                $timeout(function() {
                    Auth.logout(); 
                    $location.path('/logout'); 
                }, 2000);
            } else {
                console.log('Cart did not saved to database');
            }
        });
    }

    function userDetails () {
        $http.get('/api/userDetails').then(function (data) {
            if (data.data.success) {
                app.placeholder_user_name = data.data.user.name;
                app.placeholder_user_username = data.data.user.username;
                app.placeholder_user_email = data.data.user.email;
                app.placeholder_user_city = data.data.user.city;
                app.placeholder_user_street = data.data.user.street;
            } else {
                console.log('Somthing went wrong where userDetails function.');
            }
        });
    }

    userDetails();

    app.checkout = function (orderData, valid) {
        app.disabled = true;
        app.loading = true; 
        app.errorMsg = false;

        if (valid) {
            orderData.street = $scope.orderData.street;
            orderData.city = $scope.orderData.city;
            orderData.shipping_date = $scope.orderData.shipping_date;
            orderData.credit_card = $scope.orderData.credit_card;
            orderData.cc_date = $scope.orderData.cc_date;
            orderData.cc_cvv = $scope.orderData.cc_cvv;
            
            $http.post('/api/checkout', orderData).then(function(data) {
                if (data.data.success) {
                    app.order = data.data.order;
                    ngDialog.openConfirm({
                        template: 'checkoutRecipe',
                        className: 'ngdialog-theme-default dialogwidth800',
                        scope: $scope
                    }).then(function (value) {
                        app.loading = false;
                        $scope.alert = 'alert alert-success';
                        app.successMsg = data.data.message + '...Redirecting';
                        $timeout(function() {
                            $location.path('/store');
                        }, 2000);
                    });
                } else {
                    app.loading = false; 
                    app.disabled = false;
                    $scope.alert = 'alert alert-danger'; 
                    app.errorMsg = data.data.message;
                    $timeout(function() {
                        $location.path('/checkout');
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
    };

    app.download = function(filename, text) {
        var tmp1 = JSON.stringify(app.order.shipping_date);
        var tmp2 = JSON.stringify(app.cartProducts);
        var tmp3 = JSON.stringify(app.totalPrice);
        text = "Recipe: \nArrival: " + tmp1 + ".\nProducts: " + tmp2 + ".\nTotal Price: " + tmp3 + "."  ;
        filename = "recipe";
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();      
        document.body.removeChild(element);
    };
});

