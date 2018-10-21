var Product = require('./app/models/product');
var User = require('./app/models/user');
var mongoose = require('mongoose');

mongoose.connect('mongodb://roye:password1@ds038319.mlab.com:38319/shop-online');

var products = [
    new Product({
        title: 'apple pear waffles',
        category: 'snacks',
        price: 22,
        imagePath: 'assets/images/products/snacks/apple_pear_waffles.jpg'
    }),
    new Product({
        title: 'crisps cheese organic',
        category: 'snacks',
        price: 14,
        imagePath: 'assets/images/products/snacks/crisps_cheese_organic.jpg'
    }),
    new Product({
        title: 'energy ball',
        category: 'snacks',
        price: 10,
        imagePath: 'assets/images/products/snacks/energy_ball.jpg'
    }),
    new Product({
        title: 'hazel nuts truffels',
        category: 'snacks',
        price: 31,
        imagePath: 'assets/images/products/snacks/hazel_nuts_truffels.jpg'
    }),
    new Product({
        title: 'lentit chips',
        category: 'snacks',
        price: 17,
        imagePath: 'assets/images/products/snacks/lentit_chips.jpg'
    }),
    new Product({
        title: 'peach strubbery mint rice cake',
        category: 'snacks',
        price: 28,
        imagePath: 'assets/images/products/snacks/mint_rice_cake.jpg'
    }),
    new Product({
        title: 'qinoa cereals',
        category: 'snacks',
        price: 35,
        imagePath: 'assets/images/products/snacks/qinoa_cereals.png'
    }),
    new Product({
        title: 'quinoa puffs',
        category: 'snacks',
        price: 34,
        imagePath: 'assets/images/products/snacks/quinoa_puffs.png'
    }),
    new Product({
        title: 'wildrice cirial',
        category: 'snacks',
        price: 36,
        imagePath: 'assets/images/products/snacks/wildrice_cirial.png'
    }),
    new Product({
        title: 'apple',
        category: 'fresh',
        price: 3,
        imagePath: 'assets/images/products/fresh/apple.jpg'
    }),
    new Product({
        title: 'banana',
        category: 'fresh',
        price: 2.5,
        imagePath: 'assets/images/products/fresh/banana.png'
    }),
    new Product({
        title: 'carrot',
        category: 'fresh',
        price: 3.5,
        imagePath: 'assets/images/products/fresh/carrot.png'
    }),    
    new Product({
        title: 'cherry tomato',
        category: 'fresh',
        price: 5,
        imagePath: 'assets/images/products/fresh/cherry_tomato.jpg'
    }),
    new Product({
        title: 'cucumber',
        category: 'fresh',
        price: 3,
        imagePath: 'assets/images/products/fresh/cucumber.png'
    }),
    new Product({
        title: 'garlic',
        category: 'fresh',
        price: 1.5,
        imagePath: 'assets/images/products/fresh/garlic.png'
    }),
    new Product({
        title: 'goji berry',
        category: 'fresh',
        price: 3,
        imagePath: 'assets/images/products/fresh/goji_berry.png'
    }),
    new Product({
        title: 'purple grapes',
        category: 'fresh',
        price: 3,
        imagePath: 'assets/images/products/fresh/grapes.png'
    }),
    new Product({
        title: 'kale',
        category: 'fresh',
        price: 6,
        imagePath: 'assets/images/products/fresh/kale.png'
    }),
    new Product({
        title: 'lemon',
        category: 'fresh',
        price: 4,
        imagePath: 'assets/images/products/fresh/lemon.png'
    }),
    new Product({
        title: 'lettece',
        category: 'fresh',
        price: 2.5,
        imagePath: 'assets/images/products/fresh/lettece.png'
    }),
    new Product({
        title: 'melon',
        category: 'fresh',
        price: 7,
        imagePath: 'assets/images/products/fresh/melon.jpg'
    }),
    new Product({
        title: 'purple onion',
        category: 'fresh',
        price: 3.5,
        imagePath: 'assets/images/products/fresh/onion.png'
    }),
    new Product({
        title: 'orange',
        category: 'fresh',
        price: 3,
        imagePath: 'assets/images/products/fresh/orange.jpg'
    }),
    new Product({
        title: 'peach',
        category: 'fresh',
        price: 5.5,
        imagePath: 'assets/images/products/fresh/peach.png'
    }),
    new Product({
        title: 'petrozillia',
        category: 'fresh',
        price: 2,
        imagePath: 'assets/images/products/fresh/petrozillia.jpg'
    }),
    new Product({
        title: 'pineapple',
        category: 'fresh',
        price: 15,
        imagePath: 'assets/images/products/fresh/pineapple.png'
    }),
    new Product({
        title: 'potato',
        category: 'fresh',
        price: 12,
        imagePath: 'assets/images/products/fresh/potato.jpg'
    }),
    new Product({
        title: 'sweet potato',
        category: 'fresh',
        price: 14,
        imagePath: 'assets/images/products/fresh/sweet_potato.jpg'
    }),
    new Product({
        title: 'tomato',
        category: 'fresh',
        price: 6,
        imagePath: 'assets/images/products/fresh/tomato.jpg'
    }),
    new Product({
        title: 'watermelon',
        category: 'fresh',
        price: 13,
        imagePath: 'assets/images/products/fresh/watermelon.png'
    }),
    new Product({
        title: 'almond mile',
        category: 'liquids',
        price: 14,
        imagePath: 'assets/images/products/liquids/almond_milk.jpg'
    }),
    new Product({
        title: 'apple cider viniger',
        category: 'liquids',
        price: 9.5,
        imagePath: 'assets/images/products/liquids/apple_cider_vineger.jpg'
    }),
    new Product({
        title: 'apple juice',
        category: 'liquids',
        price: 9.5,
        imagePath: 'assets/images/products/liquids/apple_juice.jpeg'
    }),
    new Product({
        title: 'cbd oil',
        category: 'liquids',
        price: 60,
        imagePath: 'assets/images/products/liquids/cbd_oil.jpg'
    }),
    new Product({
        title: 'vegan coco',
        category: 'liquids',
        price: 9.5,
        imagePath: 'assets/images/products/liquids/coco_vegan.png'
    }),
    new Product({
        title: 'coconut honey',
        category: 'liquids',
        price: 19,
        imagePath: 'assets/images/products/liquids/coconut_honey.jpg'
    }),
    new Product({
        title: 'green juice',
        category: 'liquids',
        price: 7,
        imagePath: 'assets/images/products/liquids/green_juice.jpg'
    }),
    new Product({
        title: 'juice pack',
        category: 'liquids',
        price: 35,
        imagePath: 'assets/images/products/liquids/juice_pack.jpg'
    }),
    new Product({
        title: 'mango nectar',
        category: 'liquids',
        price: 6,
        imagePath: 'assets/images/products/liquids/mango_nectar.jpg'
    }),
    new Product({
        title: 'orange mix juice',
        category: 'liquids',
        price: 8.5,
        imagePath: 'assets/images/products/liquids/orange_juice.png'
    }),    
    new Product({
        title: 'struberry banana juice',
        category: 'liquids',
        price: 8,
        imagePath: 'assets/images/products/liquids/struberry_banana.jpg'
    }),
    new Product({
        title: 'beens',
        category: 'vegan',
        price: 17,
        imagePath: 'assets/images/products/vegan/fresh_beens.jpg'
    }),
    new Product({
        title: 'qinoa',
        category: 'vegan',
        price: 42,
        imagePath: 'assets/images/products/vegan/qinoa.jpg'
    }),
    new Product({
        title: 'rice raper',
        category: 'vegan',
        price: 22,
        imagePath: 'assets/images/products/vegan/rice_raper.jpg'
    }),
    new Product({
        title: 'vegan cheese package',
        category: 'vegan',
        price: 55,
        imagePath: 'assets/images/products/vegan/vegan_cheese.png'
    }),
    new Product({
        title: 'vegan cheese',
        category: 'vegan',
        price: 29,
        imagePath: 'assets/images/products/vegan/vegan_cheese_1.png'
    }),
    new Product({
        title: 'vegan eggs',
        category: 'vegan',
        price: 11.5,
        imagePath: 'assets/images/products/vegan/vegan_egg.jpg'
    }),
    new Product({
        title: 'nuts snack',
        category: 'best_sellers',
        price: 10.5,
        imagePath: 'assets/images/products/best_sellers/nuts_snack.jpg'
    }),
    new Product({
        title: 'organic chocolate cookies',
        category: 'best_sellers',
        price: 14,
        imagePath: 'assets/images/products/best_sellers/organic_chocolate_cookies.jpg'
    }),
    new Product({
        title: 'organic coffee',
        category: 'best_sellers',
        price: 19,
        imagePath: 'assets/images/products/best_sellers/organic_coffee.jpg'
    }),
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}