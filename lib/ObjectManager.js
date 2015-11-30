let instance = null;
/**
 * Singleton Class that manages objects in the system. An object has the following schema-
 * name: Identifier for the object
 * collection: Reference to the meteor collection(if it exists)
 * 		
 * TODO:- Hide the objects collection by implementing it as an es6 symbol
 */
ObjectManager = class {
	constructor(){
		if(!instance){
			this.objects = new Meteor.Collection('aclObjects');
			this.objects.allow({
				insert:function() {return true;},
				update:function() {return true;},
				remove:function() {return true;},
			})
			instance = this;
		}
		else return instance;
	}
	/**
	 * Adds an objects in the system
	 */
	addObject(name, collection) {
		this.objects.insert({name: name});
	}
	/**
	 * Gets a specific object in the system
	 */
	getObject(objectName) {
		return this.objects.findOne({name: objectName});
	}
	/**
	 * Gets all the objects in the system
	 */
	get allObjects() {
		return this.objects.find().fetch();
	}
};