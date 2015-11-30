let instance = null;
/**
 * Singleton Class that manages entity instances in the system. An entity instance has the schema-
 * name: Identifier for the entity instance
 * accessControl: matrix (array of object and entities) that the entity controls
 *
 * The schema of accessControl is like this-
 * type: can be entity or object. The access object it has control over
 * objId: the objectId or entityId
 * rules: an object of {method:{capability, args}} where method can be CRUD capability is the Capability
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
				accessControl.push(this.generateAccessControlObj(type, obj._id));
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
	 * DRY function that scaffolds a default access rule object
	 */
	generateAccessControlObj(type, entityId) {
		return {
			type: type,
			entity: entityId,
			rules: {}
		};
	}
	/**
	 * Sets the capability of a particular entity instance.
	 * @param {ObjectId} entityInstanceId The instance that the rule is to be set for
	 * @param {String} action           The CRUD method that must be set
	 * @param {String} objectType       The entity/object name. Eg User, Branch etc
	 * @param {String} capabilityName   The name of the capability that must be set
	 */
	setCapabilityOfInstance(entityInstanceId, action, objectType, capability, args) {
		//TODO:- Implement this after architecture change. But would need to run this code
		//on the server, as $ is not implemented on minimongo
		var setObj = {};
		var instance = this.entityInstances.findOne({instanceId: entityInstanceId});
		if(!instance)
			throw Error('no such instance');
		if(capability) {
			setObj['accessControl.$.rules.'+action+'.capability'] = capability;
		}
		if(args){
			setObj['accessControl.$.rules.'+action+'.args'] = args;
		}
		var query = {_id: instance._id, 'accessControl.entity': objectType};
		if(this.entityInstances.findOne(query)) {
			this.entityInstances.update(query, {$set: setObj});
		}
		else {
			//creates the acess control object since it doesn't exist for this entity/object
			var ruleObj = this.generateAccessControlObj('entity', objectType);
			ruleObj.rules[action]={
				capability: capability,
				args: args
			};
			this.entityInstances.update({_id: instance._id}, {$push: 
				{accessControl: ruleObj}});
		}
	}
	/**
	 * Gets a specific entity instance
	 */
	getEntityInstance(entityInstanceId) {
		return this.entityInstances.findOne({instanceId: entityInstanceId});
	}
	/**
	 * Returns the ruleObj for an instance
	 * @return {Object}            The rule object, consisting of {capability, args}
	 */
	getRuleOfInstance(instanceId, entityId, actionType) {
		var entityInstance = this.entityInstances.findOne({instanceId: instanceId});
		var foundEntity = _.findWhere(entityInstance.accessControl, {entity: entityId});
		var foundRule;
		if(foundEntity && foundEntity.rules)
			foundRule = foundEntity.rules[actionType];
		return foundRule;
	}
	/**
	 * Gets all the entities in the system
	 */
	getEntityInstances(entity) {
		return this.entityInstances.find({entity: entity}).fetch();
	}
};