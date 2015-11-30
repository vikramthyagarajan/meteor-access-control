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
    var args = {objects:[{objId: testEntity._id}]};
    var fakeArgs = {objects:[{objId: 'fake_id'}]};
    it('should not allow access by default', function() {
      var bool = entityManager.canInstancePerform('User', testEntity, 'edit', 'entity',
        'User', testEntity._id);
      expect(bool).toBeFalsy();
    });
    it('should set capability of entity in db', function() {
      //sets capability such that testEntity can edit all users
      entityManager.setCapabilityOfInstance('User', testEntity._id, 'edit', 'entity', 'User', 'all objects');
      var entity = entityManager.getEntity('User');
      var entityInstance = entityManager.getEntityInstance(testEntity._id);
      var foundEntity = _.findWhere(entityInstance.accessControl, {entity : entity._id});
      var foundRule = foundEntity.rules.edit;
      var allObjectCapability = entityManager.capabilityManager.getCapability('all objects');
      expect(foundRule.capability).toEqual(allObjectCapability._id);
    });
    it('should allow access for all objects capability', function() {
      var bool = entityManager.canInstancePerform('User', testEntity, 'edit', 'entity',
        'User', testEntity._id);
      expect(bool).toBeTruthy();
    });
    it('should set args with capability in db', function() {
      entityManager.setCapabilityOfInstance('User', testEntity._id, 'edit', 'entity', 
        'User', 'specific objects', args);
      var entity = entityManager.getEntity('User');
      var entityInstance = entityManager.getEntityInstance(testEntity._id);
      var foundEntity = _.findWhere(entityInstance.accessControl, {entity : entity._id});
      var foundRule = foundEntity.rules.edit;
      var allObjectCapability = entityManager.capabilityManager.getCapability('specific objects');
      expect(foundRule.capability).toEqual(allObjectCapability._id);
      expect(foundRule.args).toEqual(args);
    });
    it('should succeed for correct args', function() {
      var bool = entityManager.canInstancePerform('User', testEntity, 'edit', 'entity',
        'User', testEntity._id);
      expect(bool).toBeTruthy();
    });
    it('should change args', function() {
      entityManager.setCapabilityOfInstance('User', testEntity._id, 'edit', 'entity',
        'User', null, fakeArgs);
      var entity = entityManager.getEntity('User');
      var entityInstance = entityManager.getEntityInstance(testEntity._id);
      var foundEntity = _.findWhere(entityInstance.accessControl, {entity : entity._id});
      var foundRule = foundEntity.rules.edit;
      expect(foundRule.args).toEqual(fakeArgs);
    });
    it('should fail for incorrect args', function() {
      var bool = entityManager.canInstancePerform('User', testEntity, 'edit', 'entity',
        'User', testEntity._id);
      expect(bool).toBeFalsy();
    });
  });
});
describe('Entity Unit testing by collection', function() {
  var entityColl;
  beforeAll(function() {
    entityColl = new Meteor.Collection(null);
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
  it('should add entity and store all its instances', function () {
    entityColl.insert({name: 'Tester1'});
    entityColl.insert({name: 'Tester2'});
    entityColl.insert({name: 'Tester3'});
    entityColl.insert({name: 'Tester4'});
    entityColl.insert({name: 'Tester5'});
    var caps = new EntityManager();
    caps.addEntity('Tester', entityColl);
    expect(caps.allEntities.length).toEqual(1);
    expect(caps.allEntityInstances.length).toEqual(5);
  });
  it('should get specific entity again', function () {
    var entityObj = entityManager.getEntity('Tester');
    expect(entityObj).toBeDefined();
  });
  it('should add entity instance from DB', function () {
    var caps = new EntityManager();
    expect(caps.allEntities.length).toEqual(1);
    entityColl.insert({name: 'Tester6'});
    expect(caps.allEntityInstances.length).toEqual(6);
  });
  it('should get specific entity instance again', function() {
    var entityObj = entityColl.findOne({name: 'Tester1'});
    var entityInstance = entityManager.getEntityInstance(entityObj._id);
    expect(entityInstance).toBeDefined();
  });
});