Coupons = new Mongo.Collection('coupons');

Coupons.allow({
  insert: function(userId, cupom) {
    return userId;
  },
  update: function(userId, cupom, fields, modifier) {
    return userId;
  },
  remove: function(userId, cupom) {
    return userId;
  }
});

Coupons.attachBehaviour('timestampable');