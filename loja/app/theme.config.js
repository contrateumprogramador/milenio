module.exports = function(ngModule) {
    ngModule.config(function($mdThemingProvider) {
        // Gerador de Paletas: http://mcg.mbitson.com/
        $mdThemingProvider.definePalette('primary', {
            '50': 'e2e7ef',
            '100': 'b7c3d7',
            '200': '889bbd',
            '300': '5872a2',
            '400': '34548e',
            '500': '10367a',
            '600': '0e3072',
            '700': '0c2967',
            '800': '09225d',
            '900': '05164a',
            'A100': '7f95ff',
            'A200': '4c6bff',
            'A400': '1941ff',
            'A700': '002cfe',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
                '50',
                '100',
                '200',
                'A100'
            ],
            'contrastLightColors': [
                '300',
                '400',
                '500',
                '600',
                '700',
                '800',
                '900',
                'A200',
                'A400',
                'A700'
            ]
        });
        $mdThemingProvider.definePalette('accent', {
            '50': 'fbf7e6',
            '100': 'f5eac0',
            '200': 'efdd96',
            '300': 'e8cf6b',
            '400': 'e3c44c',
            '500': 'deba2c',
            '600': 'dab327',
            '700': 'd5ab21',
            '800': 'd1a31b',
            '900': 'c89410',
            'A100': 'fffcf6',
            'A200': 'ffecc3',
            'A400': 'ffdd90',
            'A700': 'ffd577',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
                '50',
                '100',
                '200',
                '300',
                '400',
                '500',
                '600',
                '700',
                '800',
                '900',
                'A100',
                'A200',
                'A400',
                'A700'
            ],
            'contrastLightColors': []
        });
        $mdThemingProvider.definePalette('warn', {
            '50': 'ffebe4',
            '100': 'ffcdbd',
            '200': 'ffab91',
            '300': 'ff8964',
            '400': 'ff7043',
            '500': 'ff5722',
            '600': 'ff4f1e',
            '700': 'ff4619',
            '800': 'ff3c14',
            '900': 'ff2c0c',
            'A100': 'ffffff',
            'A200': 'fff7f6',
            'A400': 'ffc9c3',
            'A700': 'ffb2a9',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
                '50',
                '100',
                '200',
                '300',
                '400',
                '500',
                'A100',
                'A200',
                'A400',
                'A700'
            ],
            'contrastLightColors': [
                '600',
                '700',
                '800',
                '900'
            ]
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('primary')
            .accentPalette('accent')
            .warnPalette('warn');
    });
};