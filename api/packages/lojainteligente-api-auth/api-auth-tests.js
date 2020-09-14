// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-auth.js.
import { name as packageName } from "meteor/lojainteligente:api-auth";

// Write your tests here!
// Here is an example.
Tinytest.add('api-auth - example', function (test) {
  test.equal(packageName, "api-auth");
});
