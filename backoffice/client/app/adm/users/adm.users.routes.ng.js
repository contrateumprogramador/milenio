'use strict'

angular.module('fuseapp')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.adm-users', {
                url: '/adm/usuarios',
                views: {
                    'content@app': {
                        templateUrl: 'client/app/adm/users/adm.users.view.ng.html',
                        controller: 'AdmUsersCtrl as vm'
                    }
                },
                resolve: {
                    user: function($auth) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin']);
                        });
                    },
                    UsersList: function($q, toast) {
                        return $q(function(resolve, reject) {
                            Meteor.call('usersList', function(err, r) {
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
                bodyClass: 'adm-users'
            });
    });
