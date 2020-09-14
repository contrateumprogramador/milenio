'use strict';

angular.module('fuseapp')
    .factory('konduto', function() {

        // Private API
        var kondutoRecommendation = {
        	'approve': 'Aprovar',
        	'review': 'Rever',
        	'decline': 'Recusar',
        	'none': 'Não analisado'
        };

        var kondutoStatus = {
        	'approved': 'Aprovado',
            'canceled': 'Cancelado',
        	'fraud': 'Fraude',
        	'not_analyzed': 'Não analisado',
            'not_authorized': 'Não autorizado',
            'pending': 'Pendente',
            'declined': 'Recusado'
        };

        // Public API
        return {
        	link: function(k) {
        		return 'https://app.konduto.com/orders/1232/' + k.order.id;
        	},
        	recommendation: function(k) {
        		return kondutoRecommendation[k.order.recommendation] || '';
        	},
            status: function(k) {
                return kondutoStatus[k.order.status] || '';
            },
            statusList: function() {
            	return kondutoStatus;
            }
        };
    });
