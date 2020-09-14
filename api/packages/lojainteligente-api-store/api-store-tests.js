// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-store.js.
import { name as packageName } from "meteor/lojainteligente:api-store";

// Write your tests here!
// Here is an example.
Tinytest.add('api-store - example', function (test) {
  test.equal(packageName, "api-store");
});
