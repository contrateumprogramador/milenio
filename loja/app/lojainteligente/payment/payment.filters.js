module.exports = function(LojaInteligenteModule) {
    LojaInteligenteModule
        .filter('creditCardNumber', function() {
            return function(input) {
                return (input) ? input.substr(0, 4) + ' ' + input.substr(4, 4) + ' ' + input.substr(8, 4) + ' ' + input.substr(12, 4) : '';
            };
        })
        .filter('dateFilter', function() {
            return function(input, type) {
                if (input) {
                    input = input.toString();
                    return (input.length == 1) ? '0' + input : input;
                }

                if (type) {
                    switch (type) {
                        case 'year':
                            return 'AA';
                        case 'month':
                            return 'MM';
                    }
                }

                return 'MM';
            };
        });
};
