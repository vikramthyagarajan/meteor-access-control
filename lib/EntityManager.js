let instance = null;
/**
 * Singleton Class that manages entities in the system. An entity has the following schema-
 * name: Identifier for the entity
 * collection: Reference to the meteor collection(if it exists)
 * 		
 * TODO:- Hide the entities collection by implementing it as an es6 symbol
 */
EntityManager = class {
	constructor(){
		if(!instance){
			this.entities = new Meteor.Collection('aclEntities');
			this.entities.allow({
				insert:function() {return true;},
				update:function() {return true;},
				remove:function() {return true;},
			});
			this.syncDatabase();
			this.entityInstanceManager = new EntityInstanceManager();
			this.objectManager = new ObjectManager();
			this.capabilityManager = new CapabilityManager();
			instance = this;
		}
		else return instance;
	}
	/**
	 * Sets up publish subscribe rules such that the server and client are synced up
	 */
	syncDatabase() {
		if(Meteor.isServer)
			Meteor.publish('aclEntities', () => {
				return this.entities.find({});
			});
		else {
			Meteor.subscribe('aclEntities');
		}
	}
	/**
	 * Adds an entity in the system
	 */
	addEntity(name, collection, config) {
		config = config?config:{};
		//if the entity with same name exists, then overwriting with current datas
		if(this.entities.findOne({name: name})) {
			this.entities.update({name: name}, {$set: {config:config}});
		}
		else
			this.entities.insert({name: name, config: config});
		if(collection) {
			var collElems = collection.find({});
			collElems.observe({
				added: (newDocument) => {
					this.addEntityInstance(name, newDocument);
				}
			});
		}
	}
	/**
	 * Adds an entity instance in the system. Extracts the name and objectId
	 */
	addEntityInstance(entityName, instanceObj) {
		var entity = this.entities.findOne({name: entityName});
		var allObjects = this.objectManager.allObjects;
		var allEntities = this.allEntities;
		this.entityInstanceManager.addEntityInstance(entity, instanceObj, allEntities, allObjects);
	}
	/**
	 * Returns whether the entityInstance, given by the id inside entityObj can perform a specific
	 * action on another entity/object. This function takes the required entityName, obj, converts 
	 * it into an entity, and passes the rest of the data onto the entityInstance Manager.
	 *
	 * Incase of hierarchical permission, this function gets these permissions by parsing the
	 * hierarchy and returning true prematurely if it gets its permissions. Also might extract connected entities if they exist, and check permissions for them.
	 * @param  {String} entityName Name of entity
	 * @param  {Object} entityObj  The entityObject. Might extract connected entities if exists
	 * @param  {String} action     CRUD. The action to perform
	 * @param  {String} actionType Whether the action is upon an entity or object
	 * @param  {String} objectType The object that the action must be done upon. Eg User, Branch etc
	 * @param  {ObjectId} objectId   The id of the object instance
	 * @return {Boolean}            Whether the entity instance the perform the action on the object
	 */
	canInstancePerform(entityName, entityObj, action, actionType, objectType, objectId) {
		var entity,initiator = this.entities.findOne({name: entityName});
		if(actionType == 'entity'){
			entity = this.entities.findOne({name: objectType});
		}
		else entity = this.objectManager.getObject(objectType);
		//run rules for entity if exist. TODO
		var instanceId = entityObj._id;
		var ruleObj = this.entityInstanceManager.getRuleOfInstance(instanceId, 
			entity._id, action);
		var capability, args;
		if(ruleObj){
			capability = this.capabilityManager.getCapabilityById(ruleObj.capability);
			args = ruleObj.args;
		}
		//if entity has been assigned a default capability, then run that
		//with the specified args
		else if(initiator.config.defaults && initiator.config.defaults.capability) {
			capability = this.capabilityManager.getCapability(
				initiator.config.defaults.capability);
			args = initiator.config.defaults.args;
		}
		else {
			capability = this.capabilityManager.defaultCapability;
		}
		return this.capabilityManager.runCapability(capability, entityObj, objectId, args);
		//run rules on connected entities. TODO
	}
	/**
	 * Sets the capability of a particular entity instance.
	 * @param {String} entityName       name of entity
	 * @param {ObjectId} entityInstanceId The instance that the rule is to be set for
	 * @param {String} action           The CRUD method that must be set
	 * @param {String} objectType       Whether the object is an Entity or Object
	 * @param {String} objectName       The name of the Entity or Object
	 * @param {String} capabilityName   The name of the capability. can be null
	 * @param {Object} args   Can set args used by capability function. Can be null
	 */
	setCapabilityOfInstance(entityName, entityInstanceId, action, objectType, objectName, capabilityName, args) {
		var capability = {_id: null};
		if(capabilityName) {
			capability = this.capabilityManager.getCapability(capabilityName);
			if(!capability)
				throw Error('no such capability');
		}
		var object;
		if(objectType == 'entity') {
			object = this.getEntity(objectName);
		}
		else {
			object = this.objectManager.getObject(objectName);
		}
		this.entityInstanceManager.setCapabilityOfInstance(entityInstanceId, action, object._id,
			capability._id, args);
	}
	/**
	 * Gets all the entities in the system
	 */
	get allEntities() {
		return this.entities.find().fetch();
	}
	/**
	 * Gets all the entity instances in the system
	 */
	get allEntityInstances() {
		var result = [];
		this.entities.find().forEach(entity => {
			var arr = this.entityInstanceManager.getEntityInstances(entity._id);
			result = result.concat(arr);
		});
		return result;
	}
	/**
	 * Gets a specific entity
	 */
	getEntity(entityName) {
		return this.entities.findOne({name: entityName});
	}
	/**
	 * Gets a specific entity instance
	 */
	getEntityInstance(entityInstanceId) {
		return this.entityInstanceManager.getEntityInstance(entityInstanceId);
	}
};