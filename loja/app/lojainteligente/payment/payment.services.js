module.exports = function(LojaInteligenteModule) {
    LojaInteligenteModule
        .factory('creditcard', function($http, $mdToast, $q, $timeout) {
            // Private API
            var ccInit = {
                number: '0000000000000000',
                expirationMonth: '',
                expirationYear: '',
                brand: ''
            };

            var paymentInit = {
                method: 'Cartão de Crédito',
                brand: '',
                holder: '',
                number: '',
                cvv: '',
                expirationMonth: '',
                expirationYear: '',
                installments: 1
            };

            var dataInit = {
                transacao: {
                    pedido: {
                        numero: '',
                        total: '',
                        moeda: 'real',
                        descricao: '',
                        desconto: ''
                    },
                    pagamento: {
                        bandeira: '',
                        meio_pagamento: 'cielo',
                        nome_titular_cartao: '',
                        cartao_numero: '',
                        cartao_cvv: '',
                        cartao_validade: '',
                        parcelas: 1,
                        tipo_operacao: 'credito_a_vista'
                    },
                    comprador: {
                        id: '',
                        nome: '',
                        documento: '',
                        endereco: '',
                        numero: '',
                        complemento: '',
                        cep: '',
                        bairro: '',
                        cidade: '',
                        estado: '',
                        ip: ''
                    },
                    itens: []
                }
            };

            var transacaoInit = {
                parcelamento: {},
                cartao: {
                    numero: '',
                    nome: '',
                    validadeMes: '',
                    validadeAno: '',
                    cvv: '',
                    bandeira: ''
                }
            };

            function checkoutClose(delay) {
                $timeout(function() {
                    post("checkoutClose");
                }, (delay || 5000));
            }

            function post(method, data) {
                var message = {
                    method: method,
                    data: data || ''
                };

                parent.postMessage(JSON.stringify(message), "*");
            }

            function toast(message) {
                $mdToast.show(
                    $mdToast.simple()
                    .content(message)
                    .position('top right')
                    .hideDelay(5000)
                );
            }

            // Public API
            return {
                cardBrand: function(brand) {
                    switch (brand) {
                        case 'Visa':
                            return 'visa';
                        case 'MasterCard':
                            return 'mastercard';
                        case 'Elo':
                            return 'elo';
                        case 'Diners Club':
                            return 'diners';
                        case 'Discover':
                            return 'discovers';
                        case 'American Express':
                            return 'amex';
                    }
                },
                cardExpiration: function(month, year) {
                    month = month.toString();
                    month = (month.length < 2) ? '0' + month : month;

                    year = year.toString();

                    return month + year;
                },
                cardIsElo: function(num) {
                    num = num.substr(0, 6);

                    var eloCards = [
                        '401178',
                        '636368',
                        '401179',
                        '431274',
                        '438935',
                        '451416',
                        '457393',
                        '457631',
                        '457632',
                        '504175',
                        '627780',
                        '636297'
                    ];

                    // 6 dígitos
                    if (eloCards.indexOf(num) > -1)
                        return true;

                    num = parseInt(num);

                    if (
                        (num >= 650031 && num <= 650033) ||
                        (num >= 650035 && num <= 650051) ||
                        (num >= 650405 && num <= 650439) ||
                        (num >= 650485 && num <= 650538) ||
                        (num >= 650541 && num <= 650598) ||
                        (num >= 650700 && num <= 650718) ||
                        (num >= 650720 && num <= 650727) ||
                        (num >= 650901 && num <= 650920) ||
                        (num >= 506699 && num <= 506778) ||
                        (num >= 651652 && num <= 651679) ||
                        (num >= 509000 && num <= 509999) ||
                        (num >= 655000 && num <= 655019) ||
                        (num >= 655021 && num <= 655058)
                    ) {
                        return true;
                    }

                    return false;
                },
                calcInstallments: function(total, max) {
                    var installments = [];

                    for (var i = 1; i <= max; i++) {
                        installments.push({
                            parcelas: i,
                            valor: Math.floor(total / i * 100) / 100
                        });
                    }

                    return installments;
                },
                close: function() {
                    checkoutClose(1);
                },
                companyValidate: function(id) {
                    return $q(function(resolve, reject) {
                        Meteor.call('companyValidate', id, function(err, r) {
                            if (err) {
                                toast(err.data.message);
                                checkoutClose();

                                resolve(false);
                            } else {
                                resolve(id);
                            }
                        });
                    });
                },
                complete: function(data, timeout) {
                    $timeout(function() {
                        post("checkoutComplete", data);
                    }, timeout || 0);

                    return true;
                },
                dataValidate: function(data) {
                    var compradorErrors = ['id', 'nome', 'documento', 'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado'],
                        pedidoErrors = ['numero', 'parcelamento', 'total'],
                        error = false;

                    angular.forEach(compradorErrors, function(v, key) {
                        if (!data.comprador[v])
                            error = 'comprador';
                    });

                    angular.forEach(pedidoErrors, function(v, key) {
                        if (!data.pedido[v])
                            error = 'pedido';
                    });

                    if (error) {
                        var message = (error == 'comprador') ? 'Informe todos os dados corretamente.' : 'O sistema de pagamentos não pode ser iniciado, por favor entre em contato com a loja.';

                        toast(message);
                        checkoutClose();

                        return false;
                    } else {
                        return true;
                    }
                },
                getIP: function() {
                    return $http({
                        method: 'GET',
                        url: "//freegeoip.net/json/"
                    }).then(function(r) {
                        return r.data.ip;
                    }, function(err) {
                        return err;
                    });
                },
                init: function(type) {
                    switch (type) {
                        case 'cc':
                            return angular.copy(ccInit);
                        case 'data':
                            return angular.copy(dataInit);
                        case 'payment':
                            return angular.copy(paymentInit);
                        case 'transacao':
                            return angular.copy(transacaoInit);
                    }
                },
                loaded: function() {
                    post("checkoutLoaded");
                }
            };
        });
};
