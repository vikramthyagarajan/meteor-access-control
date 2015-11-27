A meteor package which provides flexible, hierarchical and extensible access control

There are 3 types of 
- Entities: These are real world elements that exist in the system. Entities hold power and control over other entities and objects. Examples are Branch, Roles, Users etc.
- Objects: Objects can be controlled, however they cannot have access or control over other objects or entities. Examples are Documents, Files, Messages etc
- Capabilities: Entities are given access through capabilites. Capabilities can be granted or revoked at will. All access control is implemented through capabilities
