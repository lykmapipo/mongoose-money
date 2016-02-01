'use strict';

//dependencies
var path = require('path');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Money = require('moneyjs');

require(path.join(__dirname, '..', 'index'));

var Schema = mongoose.Schema;
var Product;


describe('Money Schema Type', function() {

    before(function(done) {
        //product schema
        var ProductSchema = new Schema({
            price: {
                type: Schema.Types.Money,
                required: true
            },
            tax: {
                type: Schema.Types.Money
            }
        });
        Product = mongoose.model('Product', ProductSchema);
        done();
    });

    it('should be loaded into Schema Types', function(done) {
        expect(mongoose.Schema.Types.Money).to.exist;
        expect(mongoose.Types.Money).to.exist;
        done();
    });

    it('should be able to use it as schema type', function(done) {
        var ProductSchema = new Schema({
            price: {
                type: Schema.Types.Money
            }
        });

        expect(ProductSchema.paths.price.instance).to.be.equal('Money');

        done();
    });

    it('should be auto indexed', function(done) {
        var ProductSchema = new Schema({
            price: {
                type: Schema.Types.Money,
                index: true
            },
            tax: {
                type: Schema.Types.Money
            }
        });

        expect(ProductSchema.paths.price._index).to.be.true;

        done();
    });

    it('should be able to set default value to it', function(done) {
        var CarSchema = new Schema({
            price: {
                type: Schema.Types.Money,
                index: true,
                default: new Money(12, Money.USD)
            },
            tax: {
                type: Schema.Types.Money
            }
        });
        var Car = mongoose.model('Car', CarSchema);
        var car = new Car();

        expect(car.price).to.be.an.instanceof(Money);

        done();
    });

    it('should be able to set value to it by using setter', function(done) {
        var book = new Product();

        book.price = new Money(12, Money.USD);

        expect(book.price).to.be.an.instanceof(Money);

        done();
    });

    it('should be able to set value to it from model constructor', function(done) {

        var book = new Product({
            price: new Money(12, Money.USD)
        });

        expect(book.price).to.be.an.instanceof(Money);

        done();
    });

    it('should be able to validate that it is required', function(done) {
        var book = new Product();

        book.validate(function(error) {

            expect(error).to.not.be.null;
            expect(error.name).to.be.equal('ValidationError');

            expect(error.errors.price).to.exist;
            expect(error.errors.price.kind).to.be.equal('required');

            done();
        });
    });

    it('should be able to validate that it is money type that is required', function(done) {
        var book = new Product({
            price: 4
        });

        book.validate(function(error) {

            expect(error).to.not.be.null;
            expect(error.name).to.be.equal('ValidationError');

            expect(error.errors.price).to.exist;
            expect(error.errors.price.name).to.be.equal('CastError');
            expect(error.errors.price.kind).to.be.equal('Money');

            done();
        });
    });

    it('should be able to validate its minimum allowed value', function(done) {
        var HardwareSchema = new Schema({
            price: {
                type: Schema.Types.Money,
                required: true,
                index: true,
                min: new Money(4, Money.USD)
            }
        });
        var Hardware = mongoose.model('Hardware', HardwareSchema);

        var hammer = new Hardware();
        hammer.price = new Money(2, Money.USD);

        hammer.validate(function(error) {
            expect(error).to.not.be.null;
            expect(error.name).to.be.equal('ValidationError');

            expect(error.errors.price).to.exist;
            expect(error.errors.price.name).to.be.equal('ValidatorError');
            expect(error.errors.price.kind).to.be.equal('min');
            done();
        });
    });


    it('should be able to validate its maximum allowed value', function(done) {
        var SoftwareSchema = new Schema({
            price: {
                type: Schema.Types.Money,
                required: true,
                index: true,
                max: new Money(4000, Money.USD)
            },
            tax: {
                type: Schema.Types.Money
            }
        });
        var Software = mongoose.model('Software', SoftwareSchema);

        var inventory = new Software();
        inventory.price = new Money(6200, Money.USD);

        inventory.validate(function(error) {

            expect(error).to.not.be.null;
            expect(error.name).to.be.equal('ValidationError');

            expect(error.errors.price).to.exist;
            expect(error.errors.price.name).to.be.equal('ValidatorError');
            expect(error.errors.price.kind).to.be.equal('max');
            done();
        });
    });

});