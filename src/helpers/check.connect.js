"use strict";

const mongoose = require("mongoose");
const _SECONDS = 5000;
const os = require("os");
const process = require("process");

// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log("Number of connection: " + numConnection);
};

//check overload connect
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maxium number of connection based  on nuumber of cores
    const maxConnection = numCore * 5;

    console.log(
      "Memory usage: " + (memoryUsage / 1024 / 1024).toFixed(2) + " MB"
    );
    console.log("Active connections: " + numConnection);

    if (numConnection > maxConnection) {
      console.log("Connection overload !!!");
    }
  }, _SECONDS); //Monitor every 5 seconds
};

module.exports = { countConnect, checkOverload };
