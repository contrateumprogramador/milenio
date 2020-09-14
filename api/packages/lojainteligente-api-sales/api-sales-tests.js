// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-sales.js.
import { name as packageName } from "meteor/lojainteligente:api-sales";

// Write your tests here!
// Here is an example.
Tinytest.add('api-sales - example', function (test) {
  test.equal(packageName, "api-sales");
});
