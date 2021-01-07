'use strict'

angular.module('fuseapp')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.store-tags', {
                url: '/loja/tags',
                views: {
                    'content@app': {
                        templateUrl: 'client/app/store/tags/adm.tags.view.ng.html',
                        controller: 'AdmTagsCtrl as vm'
                    }
                },
                resolve: {
                    user: function($auth) {
                        if (Roles.subscription.ready()) {
                            return $auth.awaitUser(function(user) {
                                return Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']);
                            });
                        }
                    },
                    TagsGroups: function($q, toast){
                        return $q(function(resolve, reject) {
                            Meteor.call('tagsGroupList', function(err, r) {
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
                bodyClass: 'store-tags'
            });
    });
