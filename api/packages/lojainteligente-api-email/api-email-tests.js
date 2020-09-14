// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-email.js.
import { name as packageName } from "meteor/lojainteligente:api-email";

// Write your tests here!
// Here is an example.
Tinytest.add('api-email - example', function (test) {
  test.equal(packageName, "api-email");
});
