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
});