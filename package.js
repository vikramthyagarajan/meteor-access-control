Package.describe({
  name: 'vikramthyagarajan:meteor-access-control',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A meteor package which provides flexible, hierarchical and extensible access control',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/vikramthyagarajan/meteor-access-control.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('underscore');
  api.addFiles('lib/CapabilityManager.js');
  api.addFiles('lib/EntityManager.js');
  api.addFiles('lib/ObjectManager.js');
  api.addFiles('lib/EntityInstanceManager.js');
  api.export('CapabilityManager', ['client', 'server']);
  api.export('EntityManager', ['client', 'server']);
  api.export('ObjectManager', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('underscore');
  api.use('sanjo:jasmine@0.20.2');
  api.use('vikramthyagarajan:meteor-access-control');
  api.addFiles('tests/capability-manager-tests.js');
  api.addFiles('organization-hierarchy-tests.js');
});
