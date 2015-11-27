Tinytest.addAsync('CapabilityManager must be a Singleton', function (test, next) {
  var caps = new CapabilityManager();
  console.log(caps.capabilities.find().fetch());
  Meteor.setTimeout(function() {
  	  caps2 = new CapabilityManager();
      test.equal(caps, caps2);
      next();
  }, 2000)
  test.equal(1,1);
});
Tinytest.addAsync('EntityManager must be a Singleton', function (test, next) {
  var caps = new EntityManager();
  console.log(caps.allEntities);
  Meteor.setTimeout(function() {
      caps2 = new EntityManager();
      test.equal(caps, caps2);
      next();
  }, 2000)
});
// Tinytest.add('should add entity', function (test, next) {
//   var caps = new EntityManager();
//   caps.addEntity();
//   test.equal(1,1);
//   console.log(caps.entities.find().fetch());
// });
