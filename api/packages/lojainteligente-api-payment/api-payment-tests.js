// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-payment.js.
import { name as packageName } from "meteor/lojainteligente:api-payment";

// Write your tests here!
// Here is an example.
Tinytest.add('api-payment - example', function (test) {
  test.equal(packageName, "api-payment");
});
