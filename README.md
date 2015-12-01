#Meteor-Access-Control
A meteor package which provides flexible, hierarchical and extensible access control

Package on Atmosphere: https://atmospherejs.com/vikramthyagarajan/meteor-access-control

There are 3 types of elements in the system- 
- Entities: These are real world elements that exist in the system. Entities hold power and control over other entities and objects. Examples are Branch, Roles, Users etc.
- Objects: Objects can be controlled, however they cannot have access or control over other objects or entities. Examples are Documents, Files, Messages etc
- Capabilities: Entities are given access through capabilites. Capabilities can be granted or revoked at will. All access control is implemented through capabilities. There are 3 initial capabilities that are provided- "no objects", "all objects" and "specific objects". The default is no objects, so entities must be set a different capability to access anything

## Installation- 
1. Go to your meteor app directory
2. run meteor add vikramthyagarajan:meteor-access-control

## Usage-
1) Initialize the AccessControlEngine, which is a singleton class. So you can run `new AccessControlEngine` whenever required
```js
	var accessControlEngine = new AccessControlEngine();
```

2) Add in the entities in your system, which you want to implement access control for. Most simply, it is just the roles collection
```js
	var roles = new Meteor.Collection('roles');
	accessControlEngine.addEntity('Role', roles);
```

3) Add a few objects in the system. Let's say we're building a gallery application, and people can view different galleries based on their roles-
```js
	var galleries = new Meteor.Collection('galleries');
	accessControlEngine.addObject('Gallery', galleries);
```

4) By default, no galleries are linked to entities. So no roles can see any galleries. Let's change that.
```js
	//create an admin role
	var adminRoleId = roles.insert({name: 'admin'});
	var adminRole = roles.findOne(adminRoleId);
	//set it such that the admin can change view all galleries
	accessControlEngine.setCapabilityOfInstance('Role', adminRole, 'view', 'object', 'Gallery', 'all objects')
```

5) Let us set it such that another role, manager can only view 2 galleries
```js
	//create the manager role	
	var managerRoleId = roles.insert({name: 'manager'});
	var managerRole = roles.findOne(managerRoleId);

	//create the 2 galleries he can view
	var gallery1 = galleries.insert({name:'Gallery 1',photos:[]});
	var gallery2 = galleries.insert({name:'Gallery 2',photos:[]});

	//set access such that managers can only view those 2 galleries
	//when using the specific objects capability, the args must be passed, which
	//has a schema like {objects:[{objId: objId}]}, where objects is the array of objects/entities and objId are their ids
	accessControlEngine.setCapabilityOfInstance('Role', managerRole, 'view', 'object', 'Gallery', 'specific objects', {objects:[{objId: gallery1},{objId: gallery2}]});
```

6) Get the rules whenever required using the 'can' method
```js
	var canView = AccessControlEngine.can('Role', adminRole, 'view', 'object', 'Gallery', gallery1);
	if(canView) {
		//show gallery 1
	}
```
