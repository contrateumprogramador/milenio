'use strict'

angular.module('fuseapp')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.adm-plans', {
                url: '/adm/planos',
                views: {
                    'content@app': {
                        templateUrl: 'client/app/adm/plans/adm.plans.view.ng.html',
                        controller: 'AdmPlansCtrl as vm'
                    }
                },
                resolve: {
                    user: function($auth) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), ['super-admin']);
                        });
                    },
                    PlansList: function($q, toast) {
                        return $q(function(resolve, reject) {
                            Meteor.call('plansList', function(err, r) {
                                if (err) {
                                    toast.message('Erro ao listar usuários.');
                                    reject('NO_DATA');
                                } else {
                                    resolve(r);
                                }
                            });
                        });
                    }
                },
                bodyClass: 'adm-plans'
            });
    });
