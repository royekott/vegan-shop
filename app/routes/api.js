var User = require('../models/user'); 
var Product = require('../models/product');
var Cart = require('../models/cart');
var Save_cart = require('../models/save-cart');
var Order = require('../models/order');
var jwt = require('jsonwebtoken'); 
var secret = 'harrypotter'; 
module.exports = function(router) {
    
    router.get('/', function (req, res) {
        var countProducts = 0;
        Product.find(function (err, products) {
            if (err) {
                res.json({ success: false, message:  'Somthing went wrong counting products. Error: ' + err});
                console.log('Somthing went wrong counting products. Error: ' + err);
            } else {
                countProducts = products.length;
                res.json({ success: true, countProducts: countProducts });
            }
        });
    });

    router.post('/users', function(req, res) {
        var user = new User(); 
        user.username = req.body.username; 
        user.password = req.body.password; 
        user.email = req.body.email; 
        user.name = req.body.name; 
        user.token = jwt.sign({ username: user.username, email: user.email }, secret); 
        user.city = req.body.city;
        user.street = req.body.street;

        if (req.body.username === null || req.body.username === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === '' || req.body.name === null || req.body.name === '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            user.save(function(err) {
                if (err) {
                    if (err.errors !== null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); 
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); 
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); 
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); 
                        } else {
                            res.json({ success: false, message: err }); 
                        }
                    } else if (err) {
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); 
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); 
                            }
                        } else {
                            res.json({ success: false, message: err }); 
                        }
                    }
                } else {
                    res.json({ success: true, message: 'User Added Successfully!' });
                }
            });
        }
    });

    router.post('/checkusername', function(req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. ' + err });
            } else {
                if (user) {
                    res.json({ success: false, message: 'That username is already taken' }); 
                } else {
                    res.json({ success: true, message: 'Valid username' }); 
                }
            }
        });
    });
  
    router.post('/checkemail', function(req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. ' + err });
            } else {
                if (user) {
                    res.json({ success: false, message: 'That e-mail is already taken' }); 
                } else {
                    res.json({ success: true, message: 'Valid e-mail' }); 
                }
            }
        });
    });

    router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password name').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. ' + err });
            } else {        
                if (!user) {
                    res.json({ success: false, message: 'Username not found' }); 
                } else if (user) {
                    if (!req.body.password) {
                        res.json({ success: false, message: 'No password provided' });
                    } else {
                        var validPassword = user.comparePassword(req.body.password); 
                        if (!validPassword) {
                            res.json({ success: false, message: 'Could not authenticate password' }); 
                        } else {
                            req.session.jwt = user._id;
                            var token = jwt.sign({ username: user.username, email: user.email, name: user.name, userID: user._id }, secret); 
                            res.json({ success: true, message: 'User authenticated!', token: token });
                        }
                    }
                }
            }
        });
    });
 
    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];  
        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                req.decoded = decoded; 
                next(); 
            });
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    });

    router.post('/me', function(req, res) {
        res.send(req.decoded); 
    });

    router.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. ' + err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'No user was found' });
                } else {
                    res.json({ success: true, permission: user.permission }); 
                }
            }
        });
    });

    router.get('/management', function(req, res) {
        User.find({}, function(err, users) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. ' + err });
            } else {
                User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong. ' + err });
                    } else {
                        if (!mainUser) {
                            res.json({ success: false, message: 'No user found' }); 
                        } else {
                            if (mainUser.permission === 'admin') {
                                if (!users) {
                                    res.json({ success: false, message: 'Users not found' }); 
                                } else {
                                    res.json({ success: true, users: users, permission: mainUser.permission });
                                }
                            } else {
                                res.json({ success: false, message: 'Insufficient Permissions' }); 
                            }
                        }
                    }
                });
            }
        });
    });

    router.delete('/management/:username', function(req, res) {
        var deletedUser = req.params.username; 
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. ' + err });
            } else {
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); 
                } else {
                    if (mainUser.permission !== 'admin') {
                        res.json({ success: false, message: 'Insufficient Permissions' }); 
                    } else {
                        User.findOneAndRemove({ username: deletedUser }, function(err, user) {
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong. ' + err });
                            } else {
                                res.json({ success: true }); 
                            }
                        });
                    }
                }
            }
        });
    });

    router.get('/userDetails', function (req, res) {
        var userId = req.decoded.userID;
        if (userId == undefined) {
            res.json({ success: false, message: 'User id  is undefined, reload the page. ' });
        } else {
            User.findById(userId, function (err, user) {
                if (err) {
                    res.json({ success: false, message: 'User id is not in database, error: ' + err });
                } else {
                    res.json({ success: true, user: user });
                }
            });
        }
    });

    router.get('/getUser/:id', function (req, res) {
        var userId = req.params.id;
        User.findById(userId, function (err, user) {
            if (err) {
                res.json({ success: false, message: 'Somthing went wrong to get user details. ' + err });
            } else {
                res.json({ success: true, user: user });
            }
        }); 
    });

    router.get('/getProduct/:id', function (req, res) {
        var productId = req.params.id;
        Product.findById(productId, function (err, product) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong here. Error: ' + err });
            } else {
                res.json({ success: true, product: product });
            }
        });
    });

    router.put('/editUser', function (req, res) {
        var edit_user = new User();
        edit_user.name = req.body.name;
        edit_user._id = req.body.id
        edit_user.username = req.body.username;
        edit_user.email = req.body.email;
        edit_user.permission = req.body.permission;
        edit_user.city = req.body.city;
        edit_user.street = req.body.street;
        User.findById(edit_user._id, function (err, user) {
            if (err) {
                res.json({ success: false, message: 'User id did not found in database. ' + err });
            } else {
                user.name = edit_user.name;
                user.username = edit_user.username;
                user.email = edit_user.email;
                user.permission = edit_user.permission;
                user.city = edit_user.city;
                user.street = edit_user.street;
                user.update(user, function (err) {
                    if (err) {
                        res.json({ success: false, message: 'Somthing went wrong where updating user details. ' + err });
                    } else {
                        res.json({ success: true, user: user, message: 'User details update successfully!' });
                    }
                });
            }
        });
    });

    router.put('/editProduct', function (req, res) {
        var edit_product = new Product();
        edit_product.title = req.body.title;
        edit_product.category = req.body.category;
        edit_product.price = req.body.price;
        edit_product.imagePath = req.body.imagePath;
        edit_product._id = req.body.id;
        Product.findById(edit_product._id, function (err, product) {
            product = edit_product;
            product.update(product, function (err) {
                if (err) {
                    res.json({ success: false, message: 'product did not updated!. reason: ' + err });
                } else {
                    res.json({ success: true, message: 'product successfully updated!' });
                }
            });
                
        }); 
    }); 

    router.get('/store', function(req, res) {
        Product.find(function(err, products) {
            if (err) {
                res.json({ success: false, message: 'Somthing went wrong.. ' + err });
            }
            res.json({ success: true, products: products });
        });
    });

    router.get('/add-to-cart', function(req, res) {
        if (req.session.cart == null) {
            Save_cart.findOne({ userID: req.decoded.userID }, function (err, savedCart) {
                if (err) {
                    console.log('Somthing went wrong in findig userID in save-cart. Error: ' + err);
                } else if (savedCart == null) {
                    console.log('User id is not in any cart, creating new cart: ');
                    var cart = new Cart();
                    cart.products = {};
                    cart.totalPrice = 0;
                    cart.totalQty = 0;
                    cart.userID = req.decoded.userID;
                    req.session.cart = cart;
                    res.json({ success: true, products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty });
                } else {
                    console.log('Cart found in database: ');
                    req.session.cart = savedCart;
                    var cart = new Cart(req.session.cart);
                    res.json({ success: true, products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty });
                }
            });
        } else if (req.decoded.userID !== req.session.cart.userID) {
            console.log('cart userID and decoded userID are no match!');
            Save_cart.findOne({ userID: req.decoded.userID }, function (err, savedCart) {
                if (err) {
                    console.log('Somthing went wrong in findig userID in save-cart. Error: ' + err);
                } else {
                    console.log('Cart found in database: ');
                    req.session.cart = savedCart;
                    var cart = new Cart(req.session.cart);
                    res.json({ success: true, products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty });
                }
            });

        } else {
            console.log('userIDs is a match');
            var cart = new Cart(req.session.cart);
            res.json({ success: true, products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty });
        }
        
     });

    router.get('/add-to-cart/:id', function(req, res) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart? req.session.cart: {});
        Product.findById(productId, function (err, product) {
            if (err) {
                console.log('Didnt Work in Product.findById...');
                res.json({ success: false });
            }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.json({ success: true });          
        }); 
    });

    router.get('/reduce/:id', function (req, res) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.reduceByOne(productId);
        req.session.cart = cart;
        res.json({ success: true, products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty });
        console.log('Product have been deleted!');
    });
    
    router.get('/remove/:id', function(req, res) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
    
        cart.removeItem(productId);
        req.session.cart = cart;
        res.json({ success: true, products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty });
        console.log('All products deleted!');
    });
    
    router.post('/save-cart', function(req, res) {
        var saveCart = new Save_cart();
        saveCart.userID = req.decoded.userID;
        saveCart.products = req.body.cartProducts;
        saveCart.totalQty = req.body.totalQty;
        saveCart.totalPrice = req.body.totalPrice;

        saveCart.save(function (err) {
            if (err) {
                res.json({ success: false });
                console.log('Somthing went wring in saving the cart. The error: ' + err);
            } else {
                res.json({ success: true });
                console.log('Cart saved in the system!');
            }
        });

    });

    router.post('/checkout', function (req, res) {
        var order = new Order();
        order.userID = req.decoded.userID;
        order.cart = req.session.cart;
        order.city = req.body.city;
        order.street = req.body.street;
        order.shipping_date = req.body.shipping_date;
        order.credit_card = req.body.credit_card;
        order.cc_date = req.body.cc_date;
        order.cc_cvv = req.body.cc_cvv;
        order.save(function (err) {
            if (err) {
                console.log('Somthing went wrong in saving order. Error: ' + err);
                res.json({ success: false, message: 'Somthing went wrong in saving order. Error: ' + err});
            } else {
                req.session.cart = null;
                Save_cart.findOneAndRemove({ userID: order.userID }, function (err, cartRemoved) {
                    if (err) {
                        res.json({ success: false, message: 'Somthing went wrong in searching saved cart. Error: ' + err});                        
                        console.log('Somthing went wrong in findAndRemove userID. Error: ' + err);
                    } else if(cartRemoved) {
                        console.log('Order saved in database. Also old cart removed from database.');
                        console.log(cartRemoved);
                        res.json({ success: true, order: order, message: 'Order saved in database. Also old cart removed from database.' });
                    } else {
                        console.log('Order saved in database.');
                        res.json({ success: true, order: order, message: 'Order saved in database.' });

                    }
                });
            }
        });
    }); 

    router.post('/new-product', function (req, res) {
        new_product = new Product();
        new_product.title = req.body.title;
        new_product.category = req.body.category;
        new_product.price = req.body.price;
        new_product.imagePath = req.body.imagePath;

        new_product.save(function (err) {
            if (err) {
                console.log('Somthing went wrong in saving new product. Error: ' + err);
                res.json({ success: false, message: 'Somthing went wrong in saving new product. Error: ' + err});
            } else {
                console.log('New product added to database!');
                res.json({ success: true, message: 'New product added to database!' })
            }
        });
    });

    return router; 
};
