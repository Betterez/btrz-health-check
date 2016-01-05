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

All custom providers will return a promise that resolves or fails with the service name and status.

    {name: "ServiceName", status: 200} //if promise resolves
    {name: "ServiceName", status: 200} //if promise rejects

All custom providers also take an optional `options` parameter that allow to override the service name and to provide a logger object.

Override the service name is useful when you need to validate the connection to multiple services of the same type.

    let mongoChecker = new MongoDbHealthChecker(mongoDriver, {name: "MyCustomServiceName"});

You can also provide a logger to log the error on failure. The object should have an `.error` function. It will be called with the name of the service and the error.

    let mongoChecker = new MongoDbHealthChecker(mongoDriver, {logger: myLogger});

## Build in checkers

### SQS

Will check connectivity to Amazon SQS. It will read a list of queues available for the logged in user.

    {name: "SQS", status: 200} //if promise resolves
    {name: "SQS", status: 200} //if promise rejects

    #### Usage

        let SQSHealthChecker =  require("btrz-health-checker").SQSHealthChecker;

        let sqsChecker = new SQSHealthChecker(awsSqsDriver);
        sqsChecker.checkStatus()
          .then(function (result) {
            //If's working fine
          })
          .catch(function (result) {
            //Something is not wright.
          });

The only mandatory parameter is an instance of a properly configured AWS SQS driver.
Internally we will call the `listQueues()` function, so it should at least implement that function.


### MongoDb

Will check connectivity to MongoDb doing a call to collectionNames in the MongoDb driver.

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

The only mandatory parameter is an instance of a properly configured mongoDriver.
Internally we will call the `collectionNames()` function, so it should at least implement that function.


### Socket

Will check connectivity to a socket server using the `net` module

    {name: "Socket", status: 200} //if promise resolves
    {name: "Socket", status: 200} //if promise rejects

#### Usage

    let SocketHealthChecker =  require("btrz-health-checker").SocketHealthChecker;

    let socketChecker = new SocketHealthChecker(mongoDriver);
    socketChecker.checkStatus()
      .then(function (result) {
        //If's working fine
      })
      .catch(function (result) {
        //Something is not wright.
      });

The only mandatory parameter is a config literal with a host and port to connect to.
The config can also contains a `timeout` property and it will be use to fail in case the timeout is reached, the default value is 5000.
