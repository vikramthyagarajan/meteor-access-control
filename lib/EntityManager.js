let instance = null;
/**
 * Singleton Class that manages entities in the system. An entity has the following schema-
 * name: Identifier for the entity
 * collection: The meteor collection(if it exists)
 * accessControl: matrix (array of object and entities) that the entity controls
 *
 * The schema of accessControl is like this-
 * type: can be entity or object. The access object it has control over
 * objId: the objectId
 * rules: an array of {type, capability} where type can be CRUD and capability is the Capability
 * 	it represents for the entity
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
			})
			instance = this;
		}
		else return instance;
	}
	/**
	 * Adds an entity in the system
	 */
	addEntity(name, collection) {
	}
	/**
	 * Gets all the entities in the system
	 */
	get allEntities() {
		return this.entities.find().fetch();
	}
};