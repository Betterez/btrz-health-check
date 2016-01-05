"use strict";

let net = require("net");

class SocketServer {
  constructor(port) {
    this.server = net.createServer();
    this.server.listen(port);
  }
  close(){
    this.server.close();
  }
}

exports.SocketServer = SocketServer;
