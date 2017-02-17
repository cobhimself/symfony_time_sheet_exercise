module.exports = {
    /**
     * Round the given number to two decimal places.
     *
     * @param {Number} money
     * @return {Number}
     */
    moneyRound: function moneyRound(money) {
        "use strict";
        return Number(Math.round(money+'e2')+'e-2');
    }
};
