var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'desktop'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/desktop-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'desktop'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/desktop-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'desktop'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/desktop-production'
  }
};

module.exports = config[env];
