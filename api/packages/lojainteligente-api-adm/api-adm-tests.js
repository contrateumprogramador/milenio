// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by api-adm.js.
import { name as packageName } from "meteor/lojainteligente:api-adm";

// Write your tests here!
// Here is an example.
Tinytest.add('api-adm - example', function (test) {
  test.equal(packageName, "api-adm");
});
