const client_id = "a5e5c0ec-a516-42b2-9240-75fbbea11ca1"
const client_secret = "381b80510ed847d69fc033c0b552cbda"

const getAccessToken = () => {
    const apiData = Apis.findOne({name: "RD Station"})

    try {
        const params = {client_id, client_secret, refresh_token: apiData.refresh_token}
        const token = Meteor.http.call('POST', 'https://api.rd.services/auth/token', {params})

        Apis.update({name: "RD Station"}, {$set: token.data})
        return token.data.access_token

    } catch (ex) {
        throw new Meteor.Error("Não foi possível buscar o token da RD")
    }
}

Meteor.methods({
    "RdStation.sendEvent": (params) => {
        /*
        * params type
        * {
        * type: 'ORDER_PLACED'
        * payload :
        * {
        *       "name": "Contact's Name",
        *       "email": "email@email.com",
        *       "cf_order_id": "order identifier",
        *       "cf_order_total_items": 2,
        *       "cf_order_status": "pending_payment",
        *       "cf_order_payment_method": "Credit Card",
        *       "cf_order_payment_amount": 40.20,
        *   }
        * }
        * */

        var data = {
            "event_type": params.event_type,
            "event_family":"CDP",
            "payload": {
                ...params.payload,
            }
        }

        const accessToken = getAccessToken()

        try {
            const headers = {Authorization: `Bearer ${accessToken}`}
            const result = Meteor.http.call('POST', 'https://api.rd.services/platform/events', {data, headers})

            result.data.type = "rdstation_event";

            Events.insert(result.data)
        } catch (ex) {
            console.log(ex)
            throw new Meteor.Error("Não foi possível enviar o evento para a RD")
        }
    }
})