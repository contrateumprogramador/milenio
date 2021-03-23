const client_id = "a5e5c0ec-a516-42b2-9240-75fbbea11ca1"
const client_secret = "381b80510ed847d69fc033c0b552cbda"

const getAccessToken = () => {
  const apiData = Apis.findOne({ name: "RD Station" })

  try {
    const params = { client_id, client_secret, refresh_token: apiData.refresh_token }
    const token = Meteor.http.call('POST', 'https://api.rd.services/auth/token', { params })
    
    Apis.update({ name: "RD Station" }, { $set: token.data })
    return token.data.access_token

  } catch (ex) {
    throw new Meteor.Error("Não foi possível buscar o token da RD")
  }
}

Meteor.methods({
  "RdStation.sendEvent": (params) => {
    const accessToken = getAccessToken()

    try {
      const headers = { Authorization: `Bearer ${accessToken}` }
      const { data } = Meteor.http.call('POST', 'https://api.rd.services/platform/events', { data: params, headers })

      data.type = "rdstation_event"

      Events.insert(data)
    } catch (ex) {
      console.log(ex)
      throw new Meteor.Error("Não foi possível enviar o evento para a RD")
    }
  }
})