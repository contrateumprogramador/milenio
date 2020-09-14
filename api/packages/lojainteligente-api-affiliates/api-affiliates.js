// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See api-customers-tests.js for an example of importing.
export const name = "api-affiliates";

if (Meteor.isServer) {
    // Auth API configuration
    var Api = new Restivus({
        apiPath: "affiliates/",
        defaultHeaders: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept, X-User-Id, X-Auth-Token",
            "Access-Control-Allow-Methods":
                "DELETE, GET, OPTIONS, PATCH, POST, PUT",
            "Content-Type": "application/json"
        },
        enableCors: false,
        prettyJson: true
    });

    // Affiliates
    // =============================================================================

    // Maps to: /affiliates/identify
    Api.addRoute(
        "identify",
        { authRequired: false },
        {
            get: {
                action: function() {
                    const params = this.queryParams;

                    const affiliate = Meteor.users.findOne(
                            {
                                _id: params.affiliateId,
                                roles: "affiliate"
                            },
                            {
                                fields: {
                                    "profile.firstname": 1,
                                    "profile.lastname": 1
                                }
                            }
                        ),
                        customer = Customers.findOne(
                            {
                                _id: params.customerId,
                                affiliateId: params.affiliateId
                            },
                            {
                                fields: {
                                    email: 1,
                                    firstname: 1,
                                    lastname: 1,
                                    document: 1,
                                    phone: 1
                                }
                            }
                        );

                    if (!affiliate || !customer)
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message: "Decorador ou cliente não encontrado."
                            }
                        };

                    affiliate.profile.affiliateId = affiliate._id;

                    customer.customerId = customer._id;
                    delete customer._id;

                    return {
                        status: "success",
                        data: {
                            affiliate: affiliate.profile,
                            customer
                        }
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );
}
