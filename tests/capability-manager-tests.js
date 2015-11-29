var resetCollection = function(collection) {
  collection.find().fetch().forEach(function(obj) {
    collection.remove({_id: obj._id});
  });
};
describe('CapabilityManager', function() {
	var capabilityManager;
	beforeAll(function() {
		capabilityManager = new CapabilityManager();
    var allCollObjs = [{
      obj: capabilityManager,
      field: 'capabilities'
    }];
    allCollObjs.forEach(collObj => {
      console.log('resetting ' + collObj.field);
      resetCollection(collObj.obj[collObj.field]);
    });
	});
	it('should set initial capabilities', function() {
		var allCaps = capabilityManager.allCapabilities;
		expect(allCaps.length).toEqual(3);
	});
	it('should get default capability', function() {
		var defCap = capabilityManager.defaultCapability;
		expect(defCap).toBeDefined();
		expect(defCap.name).toEqual('no objects');
	});
	it('should get specific capability', function() {
		var allObjectCapability = capabilityManager.getCapability('all objects');
		expect(allObjectCapability).toBeDefined();
		expect(allObjectCapability.name).toEqual('all objects');
	});
});
