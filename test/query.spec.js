'use strict';

//dependencies
var path = require('path');
var _ = require('lodash');
var async = require('async');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product;

//import money schema
var Money = require(path.join(__dirname, '..', 'index'));

//prepare fake prices
var prices = [
    new Money(1.234, Money.USD),
    new Money(98.993, Money.USD),
    new Money(948, Money.USD),
    new Money(8888.7905, Money.USD),
    new Money(9999.9999, Money.USD)
];

describe('Money Schema Type Queries', function() {

    before(function(done) {
        //product schema
        var ProductSchema = new Schema({
            price: {
                type: Schema.Types.Money,
                required: true,
                index: true
            }
        });
        Product = mongoose.model('Product_', ProductSchema);

        async
            .parallel({
                '0': function(next) {
                    new Product({
                        price: prices[0]
                    }).save(next);
                },
                '1': function(next) {
                    new Product({
                        price: prices[1]
                    }).save(next);
                },
                '2': function(next) {
                    new Product({
                        price: prices[2]
                    }).save(next);
                },
                '3': function(next) {
                    new Product({
                        price: prices[3]
                    }).save(next);
                },
                '4': function(next) {
                    new Product({
                        price: prices[4]
                    }).save(next);
                }
            }, done);
    });

    it('should be able to save money instance', function(done) {
        var price = new Money(7775.55555, Money.USD);

        async
            .waterfall([
                function(next) {
                    Product.create({
                        price: price
                    }, next);
                },
                function(product, next) {
                    expect(product.price.isEqualTo(price)).to.be.true;
                    next(null, product);
                },
                function(product, next) {
                    product.remove(next);
                }
            ], function(error, result) {
                done(error, result);
            });
    });

    it('should be able to use money instance in `eq` query', function(done) {

        var query = Product
            .where('price')
            .equals(prices[0]);

        query.exec(function(error, products) {

            expect(products).to.not.be.null;
            expect(products).to.have.length(1);
            expect(products[0].price.isEqualTo(prices[0])).to.be.true;

            done(error, products);
        });
    });

    it('should be able to use money instance in `gt` query', function(done) {

        var query = Product
            .where('price')
            .gt(prices[3]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(money) {
                return money.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(1);
            expect(_prices).to.contain(prices[4].toString());

            done(error, products);
        });
    });

    it('should be able to use money instance in `gte` query', function(done) {

        var query = Product
            .where('price')
            .gte(prices[3]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(money) {
                return money.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(2);
            expect(_prices).to.contain(prices[3].toString());
            expect(_prices).to.contain(prices[4].toString());

            done(error, products);
        });
    });


    it('should be able to use money instance in `lt` query', function(done) {

        var query = Product
            .where('price')
            .lt(prices[1]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(money) {
                return money.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(1);
            expect(_prices).to.contain(prices[0].toString());

            done(error, products);
        });
    });


    it('should be able to use money instance in `lte` query', function(done) {

        var query = Product
            .where('price')
            .lte(prices[2]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(money) {
                return money.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(3);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[1].toString());
            expect(_prices).to.contain(prices[2].toString());

            done(error, products);
        });
    });


    it('should be able to use money instance in `ne` query', function(done) {

        var query = Product
            .where('price')
            .ne(prices[4]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(money) {
                return money.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(4);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[1].toString());
            expect(_prices).to.contain(prices[2].toString());
            expect(_prices).to.contain(prices[3].toString());

            done(error, products);
        });
    });

    it('should be able to use money instances in `or` query', function(done) {

        var query = Product
            .where('price')
            .or([{
                price: prices[4]
            }, {
                price: prices[3]
            }]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(money) {
                return money.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(2);

            expect(_prices).to.contain(prices[4].toString());
            expect(_prices).to.contain(prices[3].toString());

            done(error, products);
        });
    });

    it('should be able to use money instances in `nor` query', function(done) {

        var query = Product
            .where('price')
            .nor([{
                price: prices[4]
            }, {
                price: prices[3]
            }]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(money) {
                return money.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(3);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[1].toString());
            expect(_prices).to.contain(prices[2].toString());

            done(error, products);
        });
    });

    it('should be able to use money instances in `lt` and `gt` range query', function(done) {

        var query = Product
            .where({
                price: {
                    $gt: prices[0],
                    $lt: prices[2]
                }
            });

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(money) {
                return money.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(1);

            expect(_prices).to.contain(prices[1].toString());

            done(error, products);
        });
    });


    it('should be able to use money instances in `lte` and `gte` range query', function(done) {

        var query = Product
            .where({
                price: {
                    $gte: prices[0],
                    $lte: prices[2]
                }
            });

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(money) {
                return money.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(3);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[1].toString());
            expect(_prices).to.contain(prices[2].toString());

            done(error, products);
        });
    });

});