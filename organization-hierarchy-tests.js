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
  var entityManager;
  var testEntity = {name: 'Vikram', _id:'2233'};
  beforeAll(function() {
    entityManager = new EntityManager();
    var allCollObjs = [{
      obj: entityManager,
      field: 'entities'
    },{
      obj: entityManager.entityInstanceManager,
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
    caps.addEntityInstance('User', testEntity);
    expect(caps.allEntityInstances.length).toEqual(1);
  });
  it('should get specific entity instance', function() {
    var entityInstance = entityManager.getEntityInstance(testEntity._id);
    expect(entityInstance).toBeDefined();
  });
  it('should add all existing entities and objects in the access matrix', function() {
    var objectLength = entityManager.objectManager.allObjects.length;
    var entityLength = entityManager.allEntities.length;
    var entityInstance = entityManager.getEntityInstance(testEntity._id);
    expect(entityInstance.accessControl).toBeDefined();
    expect(entityInstance.accessControl.length).toEqual(objectLength + entityLength);
  });
  describe('Entity Instance access testing', function() {
    it('should not allow access by default', function() {
      var bool = entityManager.canInstancePerform('User', testEntity, 'edit', 'User', testEntity._id);
      expect(bool).toBeFalsy();
    });
  });
});