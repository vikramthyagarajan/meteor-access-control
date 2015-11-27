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
			this.entityInstances = new Meteor.Collection('aclEntityInstances');
			this.entityInstances.allow({
				insert:function() {return true;},
				update:function() {return true;},
				remove:function() {return true;},
			});
			this.entityInstanceManager = new EntityInstanceManager(this.entityInstances);
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