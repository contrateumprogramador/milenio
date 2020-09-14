'use strict'

angular.module('fuseapp')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.store-sections', {
                url: '/loja/secoes',
                views: {
                    'content@app': {
                        templateUrl: 'client/app/store/sections/adm.sections.view.ng.html',
                        controller: 'AdmSectionsCtrl as vm'
                    }
                },
                resolve: {
                    user: function($auth) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']);
                        });
                    },
                    Sections: function($q, toast){
                        return $q(function(resolve, reject) {
                            Meteor.call('sectionsList', function(err, r) {
                                if (err) {
                                    toast.message(err.reason);
                                    reject('NO_DATA');
                                } else {
                                    resolve(r);
                                }
                            })
                        });
                    },
                    Tags: function($q, toast){
                        return $q(function(resolve, reject) {
                            Meteor.call('tagsList', function(err, r) {
                                if (err) {
                                    toast.message(err.reason);
                                    reject('NO_DATA');
                                } else {
                                    resolve(r);
                                }
                            })
                        });
                    }
                },
                bodyClass: 'store-sections'
            });
    });
