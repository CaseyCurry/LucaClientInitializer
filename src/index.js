"use strict";

const express = require("express");
const helmet = require("helmet");
const serviceRegistry = require("luca-service-registry-library");

const initialize = (name, staticFileLocation) => {
  serviceRegistry.register(name)
    .then(port => {
      initializeWithPort(port, staticFileLocation);
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports.initialize = initialize;

const initializeApplication = (port, staticFileLocation, home) => {
  const registerRoutes = (app) => {
    app.get("/", (request, response) => {
      response.send(`${staticFileLocation}/${home}`);
      response.end();
    });
  };
  initializeWithPort(port, staticFileLocation, registerRoutes);
};

module.exports.initializeApplication = initializeApplication;

const initializeWithPort = (port, staticFileLocation, registerRoutes) => {
  const app = express();
  app.use(helmet());

  app.use(express.static(staticFileLocation));

  if (registerRoutes) {
    registerRoutes(app);
  } else {
    // add a "/" route so that the service registry can poll the service
    serviceRegistry.addStatusRoute(app);
  }

  app.listen(port, () => {
    console.log(`listening on port ${port}...`);
  });
};

module.exports.initializeWithPort = initializeWithPort;
