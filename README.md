# btrz-health-check [![Circle CI](https://circleci.com/gh/Betterez/btrz-health-check.svg?style=svg)](https://circleci.com/gh/Betterez/btrz-health-check) [![NPM version](https://badge-me.herokuapp.com/api/npm/btrz-health-check.png)](http://badges.enytc.com/for/npm/btrz-health-check)

A series of classes that will ping different service types to verify accessibility. Used in Betterez microservices to check status of dependent services.

## Runtimes supported

io.js >= 2.0.3
node >= v4.2

## Usage

The main class is the `HealthCheckers` class.

This class exposes only one method `.checkStatus()` that takes an array of checkers.
Each checker will check one service and returns a promise that will resolve or reject accordingly to the status of the service.
The module comes with a series of checkers that you can configure and use for your particular case (see below for more information).
You can also create your own checkers easily.

## Custom checkers


## Build in checkers

### MongoDb

Will check connectivity to MongoDb doing a call to collectionNames in the MongoDb driver.
It will return a promise that resolves or fails with the service name and status.

    {name: "MongoDb", status: 200} //if promise resolves
    {name: "MongoDb", status: 200} //if promise rejects

#### Usage

    let MongoDbHealthChecker =  require("btrz-health-checker").MongoDbHealthChecker;

    let mongoChecker = new MongoDbHealthChecker(mongoDriver);
    mongoChecker.checkStatus()
      .then(function (result) {
        //If's working fine
      })
      .catch(function (result) {
        //Something is not wright.
      });

The only mandatory parameter is an instance of a properly configured mongoDriver. Internally we will call the `collectionNames()` function, so it should at least implement that function.

A second options parameter allow to override the service name and to provide a logger object.

You can override the service name (by default is "MongoDb"), this is useful when you need to validate the connection to multiple servers or db's.

    let mongoChecker = new MongoDbHealthChecker(mongoDriver, {serviceName: "MyCustomServiceName"});

You can also provide a logger to the constructor to log the error on failure. The object should have an `.error` function. It will be called with the serviceName and the error.

    let mongoChecker = new MongoDbHealthChecker(mongoDriver, {logger: myLogger});
