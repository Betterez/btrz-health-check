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
It will resolve to a promise if
