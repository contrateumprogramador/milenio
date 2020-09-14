Faq = new Mongo.Collection('faq');

Faq.allow({
  insert: function(userId, faq) {
    return userId;
  },
  update: function(userId, faq, fields, modifier) {
    return userId;
  },
  remove: function(userId, faq) {
    return userId;
  }
});

Faq.attachBehaviour('timestampable');