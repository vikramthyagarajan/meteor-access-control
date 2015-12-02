let instance = null;
/**
 * Singleton Class that provides helpers for managing the access control of the system.
 * Most important capabilities of the manager engines are provided through this class
 * for easy access. Ideally, this class should be the single point of entry for the package
 * 
 * TODO:- Hide the entities collection by implementing it as an es6 symbol
 */
AccessControlEngine = class {
	constructor(){
		if(!instance){
			this.capabilityManager = new CapabilityManager();
			if(this.capabilityManager.allCapabilities.length == 0) {
				this.capabilityManager.addDefaultCapabilities();
			}
			this.entityManager = new EntityManager();
			this.entityInstanceManager = new EntityInstanceManager();
			this.objectManager = new ObjectManager();
			instance = this;
		}
		else return instance;
	}
	/**
	 * Adds an entity in the system
	 */
	addEntity(name, collection, config) {
		if(!this.entityManager.getEntity(name))
			this.entityManager.addEntity(name, collection, config);
	}
	/**
	 * Adds an objects in the system
	 */
	addObject(name, collection) {
		if(!this.objectManager.getObject(name))
			this.objectManager.addObject(name, collection, config);
	}
	/**
	 * Adds an entity instance in the system. Extracts the name and objectId
	 */
	addEntityInstance(entityName, instanceObj) {
		if(!this.entityManager.getEntityInstance(instanceObj._id))
			this.entityManager.addEntityInstance(entityName, instanceObj);
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
	can(entityName, entityObj, action, actionType, objectType, objectId) {
		return this.entityManager.canInstancePerform(entityName, entityObj, action, actionType,
			objectType, objectId);
	}
	/**
	 * Sets the capability of a particular entity instance.
	 * @param {String} entityName       name of entity
	 * @param {ObjectId} entityInstanceId The instance that the rule is to be set for
	 * @param {String} action           The CRUD method that must be set
	 * @param {String} objectType       Whether the object is an Entity or Object
	 * @param {String} objectName       The name of the Entity or Object
	 * @param {String} capabilityName   The name of the capability that must be set
	 */
	setCapabilityOfInstance(entityName, entityInstanceId, action, objectType, objectName, capabilityName, args) {
		this.entityManager.setCapabilityOfInstance(entityName, entityInstanceId, action,
			objectType, objectName, capabilityName, args);
	}
}
