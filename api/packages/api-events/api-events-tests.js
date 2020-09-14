// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-events.js.
import { name as packageName } from "meteor/lojainteligente:api-events";

// Write your tests here!
// Here is an example.
Tinytest.add('api-events - example', function (test) {
  test.equal(packageName, "api-events");
});
