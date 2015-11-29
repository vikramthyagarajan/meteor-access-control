Meteor.call('clearDB', function(){
  Meteor.call('loadFixtures', function() {
  });
});