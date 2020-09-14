// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-customers.js.
import { name as packageName } from "meteor/lojainteligente:api-customers";

// Write your tests here!
// Here is an example.
Tinytest.add('api-customers - example', function (test) {
  test.equal(packageName, "api-customers");
});
