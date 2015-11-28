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
			this.entityInstanceManager = new EntityInstanceManager();
			instance = this;
		}
		else return instance;
	}
	/**
	 * Adds an entity in the system
	 */
	addEntity(name, collection) {
		this.entities.insert({name: name, collection: collection});
		if(collection) {
		}
	}
	/**
	 * Adds an entity instance in the system. Extracts the name and objectId
	 */
	addEntityInstance(entityName, instanceObj) {
		var entity = this.entities.findOne({name: entityName});
		this.entityInstanceManager.addEntityInstance(entity, instanceObj);
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
			result = result.concat(entity);
		});
		return result;
	}
};