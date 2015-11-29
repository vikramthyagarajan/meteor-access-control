let instance = null;
/**
 * Singleton Class that manages entity instances in the system. An entity instance has the schema-
 * name: Identifier for the entity instance
 * accessControl: matrix (array of object and entities) that the entity controls
 *
 * The schema of accessControl is like this-
 * type: can be entity or object. The access object it has control over
 * objId: the objectId or entityId
 * rules: an array of {method, capability, args} where method can be CRUD capability is the Capability
 *  for the entity, and args are the special args if required
 * 		
 * TODO:- Hide the entities collection by implementing it as an es6 symbol
 */
EntityInstanceManager = class {
	constructor(){
		if(!instance){
			this.entityInstances = new Meteor.Collection('aclEntityInstances');
			this.entityInstances.allow({
				insert:function() {return true;},
				update:function() {return true;},
				remove:function() {return true;},
			});
			instance = this;
		}
		else return instance;
	}
	/**
	 * Adds an entity instance in the system. Extracts the name and objectId
	 */
	addEntityInstance(entity, instanceObj, allEntities, allObjects) {
		var name, id;
		if(instanceObj.name)
			name = instanceObj.name;
		if(instanceObj._id)
			id = instanceObj._id;
		var accessControl = [];
		[allEntities,allObjects].forEach( (arr,ind) =>	{
			var type = (ind==0 ? 'entity':'object');
			arr.forEach(obj => {
				accessControl.push({
					type: type,
					entity: obj._id,
					rules: []
				});
			});
		});
		this.entityInstances.insert({
			entity: entity._id,
			name: name,
			instanceId: id,
			accessControl: accessControl
		});
	}
	/**
	 * Sets the capability of a particular entity instance.
	 * @param {ObjectId} entityInstanceId The instance that the rule is to be set for
	 * @param {String} action           The CRUD method that must be set
	 * @param {String} objectType       The entity/object name. Eg User, Branch etc
	 * @param {String} capabilityName   The name of the capability that must be set
	 */
	setCapabilityOfInstance(entityInstanceId, action, objectType, capabilityName) {
		//TODO:- Implement this after architecture change. But would need to run this code
		//on the server, as $ is not implemented on minimongo
		// this.entityInstances.update({})
	}
	/**
	 * Gets a specific entity instance
	 */
	getEntityInstance(entityInstanceId) {
		return this.entityInstances.findOne({instanceId: entityInstanceId});
	}
	/**
	 * Returns the ruleObj for an instance
	 * @return {Object}            The rule object, consisting of {method, capability, args}
	 */
	getRuleOfInstance(instanceId, entityId, actionType) {
		var entityInstance = this.entityInstances.findOne({instanceId: instanceId});
		var foundEntity = _.findWhere(entityInstance.accessControl, {entity: entityId});
		var foundRule = _.findWhere(foundEntity.rules, {method: actionType});
		return foundRule;
	}
	/**
	 * Gets all the entities in the system
	 */
	getEntityInstances(entity) {
		return this.entityInstances.find({entity: entity}).fetch();
	}
};