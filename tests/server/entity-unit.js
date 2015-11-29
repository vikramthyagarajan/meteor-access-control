var resetCollection = function(collection) {
  collection.find().fetch().forEach(function(obj) {
    collection.remove({_id: obj._id});
  });
};
describe('Entity Unit testing', function () {
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
  it('should get specific entity', function () {
    var entityObj = entityManager.getEntity('User');
    expect(entityObj).toBeDefined();
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
    it('should set capability in db', function() {
      //sets capability such that testEntity can edit all users
      entityManager.setCapabilityOfInstance('User', testEntity._id, 'edit', 'entity', 'User', 'all objects');
      var entity = entityManager.getEntity('User');
      var entityInstance = entityManager.getEntityInstance(testEntity._id);
      var foundEntity = _.findWhere(entityInstance.accessControl, {entity : entity._id});
      var foundRule = foundEntity.rules.edit;
      var allObjectCapability = entityManager.capabilityManager.getCapability('all objects');
      console.log(foundRule);
      console.log(allObjectCapability);
      expect(foundRule.capability).toEqual(allObjectCapability._id);
    });
    it('should allow access for all objects capability', function() {
      var bool = entityManager.canInstancePerform('User', testEntity, 'edit', 'User', testEntity._id);
      expect(bool).toBeTruthy();
    });
  });
});