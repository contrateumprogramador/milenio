// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-checkout.js.
import { name as packageName } from "meteor/lojainteligente:api-checkout";

// Write your tests here!
// Here is an example.
Tinytest.add('api-checkout - example', function (test) {
  test.equal(packageName, "api-checkout");
});
