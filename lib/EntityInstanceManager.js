let instance = null;
/**
 * Singleton Class that manages entity instances in the system. An entity instance has the schema-
 * name: Identifier for the entity instance
 * accessControl: matrix (array of object and entities) that the entity controls
 *
 * The schema of accessControl is like this-
 * type: can be entity or object. The access object it has control over
 * objId: the objectId or entityId
 * rules: an array of {type, capability} where type can be CRUD and capability is the Capability
 * 	it represents for the entity
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
	addEntityInstance(entity, instanceObj) {
		var name, id;
		if(instanceObj.name)
			name = instanceObj.name;
		if(instanceObj._id)
			id = instanceObj._id;
		this.entityInstances.insert({
			entity: entity._id,
			name: name,
			id: id,
			accessControl:[]
		});
	}
	/**
	 * Gets all the entities in the system
	 */
	getEntityInstances(entity) {
		return this.entityInstances.find({entity: entity}).fetch();
	}
};