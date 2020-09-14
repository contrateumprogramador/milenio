(function() {
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($mdDateLocaleProvider, $mdThemingProvider) {

        $mdDateLocaleProvider.msgCalendar = 'Calendário';
        $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendário';
        $mdDateLocaleProvider.months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        $mdDateLocaleProvider.formatDate = function(date) {
            return (date) ? moment(date).format('DD/MM/YYYY') : '';
        };

        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };

        $mdThemingProvider.definePalette('arquivexPrimary', {
            '50': '#9dccfb',
            '100': '#54a5f8',
            '200': '#1e89f5',
            '300': '#0965c4',
            '400': '#0756a6',
            '500': '#064789',
            '600': '#05386c',
            '700': '#03294e',
            '800': '#021931',
            '900': '#010a14',
            'A100': '#8fc7ff',
            'A200': '#2993ff',
            'A400': '#0060c2',
            'A700': '#0354a6',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 A100'
        });

        $mdThemingProvider.definePalette('arquivexAccent', {
            '50': '#f2fbff',
            '100': '#a6e1ff',
            '200': '#6ecdff',
            '300': '#26b5ff',
            '400': '#08abff',
            '500': '#0099e8',
            '600': '#0085c9',
            '700': '#0071ab',
            '800': '#005c8c',
            '900': '#00486e',
            'A100': '#e8f7ff',
            'A200': '#82d4ff',
            'A400': '#1cb2ff',
            'A700': '#02a9ff',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 200 300 400 A100 A200 A400 A700'
        });

        $mdThemingProvider.definePalette('arquivexWarn', {
            '50': '#ffffff',
            '100': '#fff0c2',
            '200': '#ffe28a',
            '300': '#ffd042',
            '400': '#ffc924',
            '500': '#ffc105',
            '600': '#e5ad00',
            '700': '#c79500',
            '800': '#a87e00',
            '900': '#8a6700',
            'A100': '#ffffff',
            'A200': '#ffe79e',
            'A400': '#ffce38',
            'A700': '#ffc71e',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 200 300 400 500 600 700 A100 A200 A400 A700'
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('arquivexPrimary')
            .accentPalette('arquivexAccent', {
                default: '500'
            })
            .warnPalette('arquivexWarn');
    };

})();
