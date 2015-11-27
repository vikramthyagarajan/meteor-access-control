let instance = null;
/**
 * Singleton Class that manages capabilities in the system. A capability has the following schema-
 * name: Identifier for the capability
 * displayName: display name
 * ability: function that returns whether the entity is allowed to view the object. An additional 
 * 		object can be passed to be used in the function. The entity will keep this stored in its db
 * 		
 * TODO:- Hide the capabilites collection by implementing it as an es6 symbol
 */
CapabilityManager = class {
	constructor(){
		if(!instance){
			this.capabilities = new Meteor.Collection('aclCapabilities');
			this.capabilities.allow({
				insert:function() {return true;},
				update:function() {return true;},
				remove:function() {return true;},
			})
			this.addDefaultCapabilities();
			instance = this;
		}
		else return instance;
	}
	/**
	 * Adds the default capabilities, which are all objects, no objects and specific objects, which
	 * returns true, false and checks the array in args to see if objectId exists in it
	 */
	addDefaultCapabilities() {
		var defaultCapabilityObjects=[{
			name:'all objects',
			ability: function(entityObj, objectId, args){
				return true;
			}
		},{
			name:'no objects',
			ability: function(entityObj, objectId, args){
				return false;
			}
		},{
			name:'specific objects',
			ability: function(entityObj, objectId, args){
				if(_.findWhere(args.objects,{objId:objectId}))
					return true;
				else return false;
			},
		}];
		defaultCapabilityObjects.forEach(obj => {
			this.capabilities.insert(obj);
		});
	}
	/**
	 * Adds an additional capability in the system. TBD
	 */
	addCapability() {
	}
};