// SimpleRest.setMethodOptions(
//     'apiCartGet', {
//         url: '/api/cart/:0',
//         httpMethod: 'get'
//     }
// );
if (Meteor.isServer) {
    var Api = new Restivus({
        useDefaultAuth: true,
        prettyJson: true
    });

    Api.addRoute(
        'address',
        {authRequired: true},
        {
            post: function() {
                return Meteor.call('apiAddressAdd', this.user, this.bodyParams);
            },
            get: function() {
                return Meteor.call('apiAddressList', this.user);
            }
        }
    )

    Api.addRoute(
        'address/:id',
        {authRequired: true},
        {
            delete: function() {
                return Meteor.call('apiAddressRemove', this.user, this.urlParams.id);
            },
            put: function() {
                return Meteor.call('apiAddressUpdate', this.user, this.bodyParams, this.urlParams.id);
            }
        }
    )

    Api.addRoute(
        'cart/:code',
        { authRequired: true },
        {
            get: function() {
            	return Meteor.call('apiCartGet', this.urlParams.code);
            }
        }
    );

    Api.addRoute(
        'campainha',
        { authRequired: false },
        {
            post: function() {
                var body = this.request.body;

                Meteor.defer(function() {
                    Meteor.call('paymentSuperPayUpdate', body);
                });

                return 'ok';
            }
        }
    );

    Api.addRoute(
        'categories',
        {authRequired: true},
        {
            get: function() {
                return Meteor.call('apiTagsGet', this.user);
            }
        }
    );

    Api.addRoute(
        'faq',
        {authRequired: true},
        {
            get: function() {
                return Meteor.call('apiFaqGet', this.user);
            }
        }
    );

    Api.addRoute(
        'items',
        {authRequired: true},
        {
            get: function() {
                return Meteor.call('apiItemsGet', this.user);
            }
        }
    );

    Api.addRoute(
        'items/:category',
        {authRequired: true},
        {
            get: function() {
                return Meteor.call('apiItemsGet', this.user, this.urlParams.category);
            }
        }
    );


    // Methods
    Meteor.methods({
        apiCartGet: function(code) {
            check(code, String);

            var cart = Carts.findOne({
                code: code
            }, {
                fields: {
                    code: 1,
                    customer: 1,
                    items: 1,
                    number: 1,
                    shipping: 1,
                    shipping_price: 1,
                    status: 1,
                    total: 1,
                }
            });

            if (!cart)
                throw new Meteor.Error(404, 'Carrinho não encontrado.');

            var payment = Payments.findOne({
                cartId: cart._id
            }, {
                sort: {
                    createdAt: -1
                }
            });

            if (payment) {
                cart.payment = payment.credit_card;
                cart.payment.installments = payment.transaction.parcelas;
                cart.payment.time = payment.createdAt;
                cart.payment.status = payment.transaction.statusTransacao;
            }

            delete cart.customer.companies;
            delete cart.customer.customerId;
            delete cart.shipping.customerId

            return cart;
        },
        apiTagsGet: function(user){

            if (!Roles.userIsInRole(user.userId(), 'api'))
                throw new Meteor.Error(403, 'Permissão negada.');

            var tags = Tags.find({
                main: true,
                companyId: user.profile.company.companyId
            }, {
                fields: {
                    name: 1,
                    url: 1,
                    itemsCount: 1,
                    tagsGroup: 1
                }
            }).fetch();

            if(!tags)
                throw new Meteor.Error(404, 'Tag não encontrada.');

            return tags;
        },
        apiItemsGet: function(user, category){

            if (!Roles.userIsInRole(user.userId(), 'api'))
                throw new Meteor.Error(403, 'Permissão negada.');

            var query = (category) ? {'companyId': user.profile.company.companyId, 'tags.url': category, 'active': true} :
            {'companyId': user.profile.company.companyId, 'active': true};

            var items = Items.find(query,{
                fields: {
                    pictures: 1,
                    title: 1,
                    tags: 1,
                    url: 1,
                    price: 1,
                    salesPrice: 1,
                    description: 1
                }
            }).fetch();

            return items;
        },
        apiFaqGet: function(user){
            if (!Roles.userIsInRole(user.userId(), 'api'))
                throw new Meteor.Error(403, 'Permissão negada.');

            var faq = Faqs.find({
                companyId: user.profile.company.companyId
            },{
                fields: {
                    faqs: 1
                }
            }).fetch();
            return faq;
        },
        apiAddressAdd: function(user, address) {
            check(address, Object);

            if (!Roles.userIsInRole(user.userId(), 'api'))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({_id: user.profile.company.companyId});
            if(!company)
                throw new Meteor.Error(404, 'Empresa não encontrada');

            var customer = Customers.findOne({ _id: address.customerId });

            if (!customer)
                throw new Meteor.Error(404, 'Cliente não encontrado.');

            address.companyId = company._id;

            var response = Addresses.insert(address);

            return (response) ? 'success' : 'you don\'t have permission';
        },
        apiAddressList: function(user){

            if (!Roles.userIsInRole(user.userId(), 'api'))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({_id: user.profile.company.companyId});
            if(!company)
                throw new Meteor.Error(404, 'Empresa não encontrada');

            return Addresses.find({
                companyId: company._id
            }, {
                fields: {
                    zip: 1,
                    address: 1,
                    district: 1,
                    city: 1,
                    state: 1,
                    number: 1,
                    complement: 1
                }
            }).fetch();

        },
        apiAddressUpdate: function(user, address, id){

            if (!Roles.userIsInRole(user.userId(), 'api'))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({_id: user.profile.company.companyId});
            if(!company)
                throw new Meteor.Error(404, 'Empresa não encontrada');

            var response = Addresses.update({
                _id: id,
                companyId: company._id
            }, {
                $set: address
            });

            return (response) ? 'success' : 'you don\'t have permission';
        },
        apiAddressRemove: function(user, id){

            if (!Roles.userIsInRole(user.userId(), 'api'))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({_id: user.profile.company.companyId});
            if(!company)
                throw new Meteor.Error(404, 'Empresa não encontrada');

            var response = Addresses.remove({_id: id, companyId: company._id});

            return (response) ? 'success' : 'you don\'t have permission';
        }
    });
}
