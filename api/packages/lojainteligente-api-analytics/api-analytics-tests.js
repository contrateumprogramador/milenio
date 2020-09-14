// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-analytics.js.
import { name as packageName } from "meteor/lojainteligente:api-analytics";

// Write your tests here!
// Here is an example.
Tinytest.add('api-analytics - example', function (test) {
  test.equal(packageName, "api-analytics");
});
