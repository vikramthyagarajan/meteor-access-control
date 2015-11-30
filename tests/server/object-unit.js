var resetCollection = function(collection) {
  collection.find().fetch().forEach(function(obj) {
    collection.remove({_id: obj._id});
  });
};
describe('Object Unit testing', function () {
  var entityManager, objectManager;
  var testEntity = {name: 'Vikram', _id:'2233'};
  beforeAll(function() {
    entityManager = new EntityManager();
    objectManager = new ObjectManager();
    var allCollObjs = [{
      obj: entityManager,
      field: 'entities'
    },{
      obj: entityManager.entityInstanceManager,
      field: 'entityInstances'
    },{
      obj: objectManager,
      field: 'objects'
    }
    ];
    allCollObjs.forEach(collObj => {
      console.log('resetting ' + collObj.field);
      resetCollection(collObj.obj[collObj.field]);
    });
    entityManager.addEntity('User');
    entityManager.addEntityInstance('User', testEntity);
  });
  it('should add object', function () {
    var caps = new ObjectManager();
    caps.addObject('Deck');
    expect(caps.allObjects.length).toEqual(1);
  });
  it('should get specific object', function () {
    var objectObj = objectManager.getObject('Deck');
    expect(objectObj).toBeDefined();
  });
  describe('Object Instance access testing', function() {
    var args = {objects:[{objId: testEntity._id}]};
    var fakeArgs = {objects:[{objId: 'fake_id'}]};
    var testObj = {name: 'testObj', _id: '2233'};
    it('should not allow access by default', function() {
      var bool = entityManager.canInstancePerform('User', testEntity, 'edit', 'object',
        'Deck', testObj._id);
      expect(bool).toBeFalsy();
    });
    // it('should set args with capability in db', function() {
    //   entityManager.setCapabilityOfInstance('User', testEntity._id, 'edit', 'object', 
    //     'Deck', 'specific objects', args);
    //   var obj = objectManager.getObject('Deck');
    //   var entityInstance = entityManager.getEntityInstance(testEntity._id);
    //   var foundEntity = _.findWhere(entityInstance.accessControl, {entity : obj._id});
    //   var foundRule = foundEntity.rules.edit;
    //   var allObjectCapability = entityManager.capabilityManager.getCapability('specific objects');
    //   expect(foundRule.capability).toEqual(allObjectCapability._id);
    //   expect(foundRule.args).toEqual(args);
    // });
    // it('should succeed for correct args', function() {
    //   var bool = entityManager.canInstancePerform('User', testEntity, 'edit', 'object',
    //     'Deck', testObj._id);
    //   expect(bool).toBeTruthy();
    // });
    // it('should fail for incorrect args', function() {
    //   entityManager.setCapabilityOfInstance('User', testEntity._id, 'edit', 'object', 
    //     'Deck', 'specific objects', fakeArgs);
    //   var bool = entityManager.canInstancePerform('User', testEntity, 'edit', 
    //     'User', testObj._id);
    //   expect(bool).toBeFalsy();
    // });
  });
});