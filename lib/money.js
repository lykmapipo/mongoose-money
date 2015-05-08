'use strict';

//dependencies
var path = require('path');
var _ = require('lodash');
var currencies = require(path.join(__dirname, 'currencies'));
var BigDecimal = require('big.js');


/**
 * @constructor
 * @description Javascript money implementation that borrows a lot from others.
 *              The created money instances are immutable object.
 * @public
 */
function Money(amount, currency, time) {
    //set a date when this money has been created
    //Note!: Money value flactuate with time
    //
    //highly used in corverting this money instance to
    //other instances
    if (arguments.length === 3) {
        this.time = time;
    } else {
        this.time = new Date();
    }

    //use big.js to track amount
    this.amount = new BigDecimal(amount);

    //reference the whole currency details
    this.currency = currency;

    //freeze object to make it mutable
    //See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
    Object.freeze(this);
}


/**
 * @function
 * @description check if this money instance is equal to other instance
 * @param {Money} other money instance to compare with this instance of money
 * @returns {boolean} true if both have equal currency and equal amount, 
 *                         otherwise false
 * @private
 */
Money.prototype.equals =
    Money.prototype.isEqual =
    Money.prototype.isEqualTo =
    Money.prototype.equalTo =
    Money.prototype.equal =
    Money.prototype.eq = function(other) {
        return this.amount.eq(other.amount) &&
            (_.isEqual(this.currency, other.currency));
    };


/**
 * @function
 * @description check if this money instance is less than the other money instance
 * @param {Money} other money instance to compare with this instance of money
 * @returns {boolean} true if this money instance is less, otherwise false
 * @private
 */
Money.prototype.isLessThan =
    Money.prototype.lessThan =
    Money.prototype.lt = function(other) {
        //check if they have same currency
        if (_.isEqual(this.currency, other.currency)) {
            return this.amount.lt(other.amount);
        } else {
            //TODO handle different currency format
            return false;
        }
    };


/**
 * @function
 * @description check if this money instance is greater than the other money 
 *              instance
 * @param {Money} other money instance to compare with this instance of money
 * @returns {boolean}  true if this money instance is greater, otherwise false
 * @private
 */
Money.prototype.isGreaterThan =
    Money.prototype.greaterThan =
    Money.prototype.gt = function(other) {
        //check if they have same currency
        if (_.isEqual(this.currency, other.currency)) {
            return this.amount.gt(other.amount);
        } else {
            //TODO handle different currency format
            return false;
        }
    };


/**
 * @function
 * @description check if this money instance has zero amount.
 * @returns {boolean} true if this money instance has zero amount, 
 *                         otherwise false
 * @private
 */
Money.prototype.isZero = function() {
    return this.amount.eq(new BigDecimal(0));
};


/**
 * @function
 * @description check if this money instance has amount which positive.
 * @returns {boolean} true if this money instance has amount which is positive, 
 *                         otherwise false
 * @private
 */
Money.prototype.isPositive = function() {
    return this.amount.gt(new BigDecimal(0));
};


/**
 * @function
 * @description check if this money instance has amount which is negative.
 * @returns {boolean} true if this money instance has amount which is negative, 
 *                         otherwise false
 * @private
 */
Money.prototype.isNegative = function() {
    return !this.isPositive();
};


/**
 * @function
 * @description perform scalar multiplication on the money instance using 
 *              provided the multiplier and return a new Money instance 
 *              that holds the result of the operation.
 * @param {Number} multiplier a scalar multiplier to multiply this money with
 * @returns {Money} a new instance of money which hold result of operation
 * @private
 */
Money.prototype.multiply = Money.prototype.multiplyBy = function(multiplier) {
    return new Money(this.amount.times(multiplier), this.currency);
};


/**
 * @function
 * @description perform scalar division on the money instance using provided 
 *              divisor and return a new Money instance that holds the 
 *              result of the operation.
 * @param {Number} divisor a scalar divisor to divide this money with
 * @returns {Money} a new instance of money which hold the result of operation
 * @private
 */
Money.prototype.divide = Money.prototype.divideBy = function(divisor) {
    return new Money(this.amount.div(divisor), this.currency);
};


/**
 * @function
 * @description add other money instance into this money instance and return new
 *              money instance whose currency set to this money instance currency
 * @param {Money} other other money instance to add to this money instance
 * @returns {Money} a new money instance which hold the result of operation
 */
Money.prototype.add =
    Money.prototype.plus = function(other) {
        //check if they have same currency
        if (_.isEqual(this.currency, other.currency)) {
            return new Money(this.amount.plus(other.amount), this.currency);
        } else {
            //TODO handle diffent currency
            return this;
        }
    };


/**
 * @function
 * @description subtract other money instance from this money instance and 
 *              return a new Money instance whose currency is set to this money
 *              instance currency.
 * @param {Money} other other money instance to add to this money instance
 * @returns {Money} a new money instance which hold the result of operation
 * @private
 */
Money.prototype.subtract =
    Money.prototype.minus = function(other) {
        //check if they have same currency
        if (_.isEqual(this.currency, other.currency)) {
            return new Money(this.amount.minus(other.amount), this.currency);
        } else {
            //TODO handle diffent currency
            return this;
        }
    };


/**
 * @function
 * @description create a new money instance whose amount is fixed to given numbers
 *              of decimal places
 * @param  {Number} dp number of decimal places to fix in this money instance
 * @return {Money}     a new money instance with required fixed decimal places
 */
Money.prototype.toFixed = function(dp) {
    return new Money(this.amount.toFixed(dp), this.currencyDetails);
};


/**
 * @function
 * @description create a new money instance whose amount is of provided 
 *              significant figures
 * @param  {Number} dp number of fignificant figures to use
 * @return {Money}     a new money instance with required significant figures
 */
Money.prototype.toPrecision = function(dp) {
    return new Money(this.amount.toPrecision(dp), this.currencyDetails);
};


/**
 * @function
 * @description convert this money instance to its string representation
 * @return {String} a string representation of this money instance
 * @private
 */
Money.prototype.toString = function() {
    return this.currency.code + ' ' + this.amount.toString();
};


/**
 * @function
 * @description convert this money instance to its JSON representation
 * @return {Object} a JSON representation of this money instance
 * @private
 */
Money.prototype.toJSON =
    Money.prototype.asJSON = function() {
        return {
            amount: Number(this.amount.toJSON()),
            currency: this.currency.code,
            time: this.time
        };
    };


/**
 * @function
 * @description compute valueOf representation of this money instance
 * @return {Object} a valueOf presentation of this money instance
 * @private
 */
Money.prototype.valueOf = function() {
    return this.toJSON();
};


/**
 * @function
 * @description compute object representation of this money instance
 * @return {Object} object representation of this money
 * @private
 */
Money.prototype.toObject =
    Money.prototype.asObject =
    Money.prototype.toObj = function() {
        return this.toJSON();
    };


/**
 * @description export money js type
 * @type {Money}
 */
module.exports = Money;


//add currencies data into Money
module.exports = _.extend(module.exports, currencies);