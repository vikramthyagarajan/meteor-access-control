var resetCollection = function(collection) {
  collection.find().fetch().forEach(function(obj) {
    collection.remove({_id: obj._id});
  });
};
describe('CapabilityManager', function() {
	var capabilityManager;
	beforeAll(function() {
		capabilityManager = new CapabilityManager();
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
	describe('capability testing', function() {
		it('should run all objects capability', function() {
			var capability = capabilityManager.getCapability('all objects');
			var result = capabilityManager.runCapability(capability, null, null, null);
			expect(result).toBeTruthy();
		});
		it('should run no objects capability', function() {
			var capability = capabilityManager.getCapability('no objects');
			var result = capabilityManager.runCapability(capability, null, null, null);
			expect(result).toBeFalsy();
		});
		it('should run specific objects capability', function() {
			var capability = capabilityManager.getCapability('specific objects');
			var result = capabilityManager.runCapability(capability, null, '1234', 
				{objects: [{objId:'1234'}]});
			expect(result).toBeTruthy();
		});
		it('should not run specific objects capability incorrectly', function() {
			var capability = capabilityManager.getCapability('specific objects');
			var result = capabilityManager.runCapability(capability, null, '3456', 
				{objects: [{objId:'1234'}]});
			expect(result).toBeFalsy();
		});
	});
});
