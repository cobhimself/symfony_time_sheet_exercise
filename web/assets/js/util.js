module.exports = {
    moneyRound: function moneyRound(money) {
        "use strict";
        return Number(Math.round(money+'e2')+'e-2');
    }
};
