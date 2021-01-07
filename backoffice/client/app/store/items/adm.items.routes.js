'use strict';

angular
.module('fuseapp')
.config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
    .state('app.store-items', {
        url: '/loja/itens',
        views: {
            'content@app': {
                templateUrl: 'client/app/store/items/adm.items.view.ng.html',
                controller: 'AdmItemsCtrl as vm'
            }
        },
        resolve: {
            user: function($auth) {
                if (Roles.subscription.ready()) {
                    return $auth.awaitUser(function(user) {
                        return Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance', 'expedition']);
                    });
                }
            },
            Items: function($q, toast){
                return $q(function(resolve, reject) {
                    
                    var pagination = {
                        limit: 10,
                        skip: 0
                    };

                    Meteor.call('itemsList', pagination, function(err, r) {
                        if (err) {
                            toast.message(err.reason);
                            reject('NO_DATA');
                        } else {
                            resolve(r);
                        }
                    })
                });
            },
            Tags: function($q, toast) {
                return $q(function(resolve, reject){
                    Meteor.call('tagsList', function(err, r) {
                        if(err){
                            toast.message(err.reason);
                            reject('NO_DATA');
                        } else {
                            resolve(getTags(r));
                        }
                    });
                });
            },
            Customizations: function ($q, toast) {
                return $q(function(resolve, reject) {
                    Meteor.call('listCustomizations', function(err, r) {
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
        bodyClass: 'store-items'
    });
}

function getTags(tagsGroup){
    var tags = [];
    tagsGroup.forEach(function(group){
        group.tags.forEach(function(tag){
            tag.tagsGroup = group.name;
            tags.push(tag);
        });
    });
    return tags;
}
