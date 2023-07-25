'use strict';

// Parent
function Builder() {}

// Add base plus method
Builder.prototype.plus = function(args) {
    let total = Number.isFinite(args[0]) ? 0 : '';
    for (let arg of args) {
        total += arg;
    }
    return total;
};

// Add base minus method
Builder.prototype.minus = function(args) {
    return Array.isArray(args) ? args.reduce((sum, current) => sum + current, 0) : args;
};


// Child class IntBuilder in ES6 style
class IntBuilder extends Builder {
    constructor(int = 0) {
        super();
        this.int = int;
    }

    plus(...n) {
        this.int += super.plus(n);
        return this;
    }

    minus(...n) {
        this.int -= super.minus(n);
        return this;
    }

    multiply(n) {
        this.int *= n;
        return this;
    }

    divide(n) {
       this.int = Math.trunc(this.int / n);
       return this;
    }

    mod(n) {
        this.int %= n;
        return this;
    }

    get() {
        return this.int;
    }

    static random(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }
}

// Child class StringBuilder in ES5 style
function StringBuilder(str = '') {
    this.str = str;
}

// Passing StringBuilder Builder's methods
StringBuilder.prototype = Object.create(Builder.prototype);


// Overriding plus method for Strings
StringBuilder.prototype.plus = function(...str) {
    this.str += Builder.prototype.plus.call(this, str);
    return this;
}

// Overriding minus method for Strings
StringBuilder.prototype.minus = function(str) {
    let countDiffSymbols = this.str.length - Builder.prototype.minus.call(this, str);
    this.str = this.str.substring(0, countDiffSymbols);
    return this;
}

// Add multiply method for Strings
StringBuilder.prototype.multiply = function(int) {
    this.str = this.str.repeat(int);
    return this;
}

// Add divide method for Strings
StringBuilder.prototype.divide = function(n) {
    this.str = this.str.substring(0, Math.floor(this.str.length / n));
    return this;
}

// Add remove method for Strings
StringBuilder.prototype.remove = function(str) {
    this.str = this.str.split(str).join('');
    return this;
}

// Add sub method for Strings
StringBuilder.prototype.sub = function(from, n) {
    this.str = this.str.substring(from, from + n);
    return this;
}

// Add get method for Strings
StringBuilder.prototype.get = function(){
    return this.str;
}


// Tests from task for IntBuilder
// --------- Numbers ----------
console.log('----- NUMBRES -----');

// Separately
console.log('---- Separately ----');

let intBuilder = new IntBuilder(10);

//plus
console.log(`Result of the plus method: ${intBuilder.plus(2, 3, 2).get()}`);
//minus
console.log(`Result of the minus method: ${intBuilder.minus(1, 2).get()}`);
//multiply
console.log(`Result of the multiply method: ${intBuilder.multiply(2).get()}`);
//divide
console.log(`Result of the divide method: ${intBuilder.divide(4).get()}`);
//mod
console.log(`Result of the mod method: ${intBuilder.mod(3).get()}`);
//get
console.log(`Result of the get method: ${intBuilder.get()}`);
//random
console.log(`Result of static random method: ${IntBuilder.random(10, 100)}`);

// Method chain
console.log('---- Method chain ----');

intBuilder = new IntBuilder(10);

console.log(`Result method chain: ${intBuilder
                                        .plus(2, 3, 2)
                                        .minus(1, 2)
                                        .multiply(2)
                                        .divide(4)
                                        .mod(3)
                                        .get()}`
);


// Tests from task for StringBuilder
// ---------- String --------------
console.log('----- STRINGS -----');

// Separately
console.log('---- Separately ----');

let strBuilder  = new StringBuilder('Hello');

//plus
console.log(`Result of the plus method: ${strBuilder.plus(' all', '!').get()}`);
//minus
console.log(`Result of the minus method: ${strBuilder.minus(4).get()}`);
//multiply
console.log(`Result of the multiply method: ${strBuilder.multiply(3).get()}`);
//divide
console.log(`Result of the divide method: ${strBuilder.divide(4).get()}`);
//mod
console.log(`Result of the remove method: ${strBuilder.remove('l').get()}`);
//sub
console.log(`Result of the sub method: ${strBuilder.sub(1, 1).get()}`);
//get
console.log(`Result of the get method: ${strBuilder.get()}`);

// Method chain
console.log('---- Method chain ----');

strBuilder = new StringBuilder('Hello');

console.log(`Result method chain: ${strBuilder
                                        .plus(' all', '!')
                                        .minus(4)
                                        .multiply(3)
                                        .divide(4)
                                        .remove('l')
                                        .sub(1, 1)
                                        .get()}`
);