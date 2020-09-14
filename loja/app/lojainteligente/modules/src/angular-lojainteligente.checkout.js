module.exports = 'LojaInteligente';

// Modules
require('./modules/angular-credit-cards.js'); // Angular CreditCards
require('./modules/angular-flippy.js'); // Angular Flippy

var LojaInteligenteModule = angular.module('LojaInteligente', [
    'credit-cards',
    'angular-flippy'
])
.provider('Loja', function() {
    
});