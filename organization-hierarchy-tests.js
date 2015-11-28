var resetCollection = function(collection) {
  collection.find().fetch().forEach(function(obj) {
    collection.remove({_id: obj._id});
  });
};
describe('Singleton checking', function () {
  it('CapabilityManager must be a Singleton', function (next) {
    var caps = new CapabilityManager();
    Meteor.setTimeout(function() {
      caps2 = new CapabilityManager();
      expect(caps).toBe(caps2);
      next();
    }, 2000);
  });
  it('EntityManager must be a Singleton', function (next) {
    var caps = new EntityManager();
    Meteor.setTimeout(function() {
      caps2 = new EntityManager();
      expect(caps).toBe(caps2);
      next();
    }, 2000);
  });
});
describe('Entity Functionality testing', function () {
  beforeAll(function() {
    var enMgr = new EntityManager();
    var allCollObjs = [{
      obj: enMgr,
      field: 'entities'
    },{
      obj: enMgr.entityInstanceManager,
      field: 'entityInstances'
    }
    ];
    allCollObjs.forEach(collObj => {
      console.log('resetting ' + collObj.field);
      resetCollection(collObj.obj[collObj.field]);
    });
  });
  it('should add entity', function () {
    var caps = new EntityManager();
    caps.addEntity('User');
    expect(caps.allEntities.length).toEqual(1);
  });
  it('should add entity with instance', function () {
    var caps = new EntityManager();
    expect(caps.allEntities.length).toEqual(1);
    caps.addEntityInstance('User', {name: 'Vikram', _id:'2233'});
    expect(caps.allEntityInstances.length).toEqual(1);
  });
});