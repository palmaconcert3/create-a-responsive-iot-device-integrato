// oc4t_create_a_respon.js

// Import required libraries and frameworks
const express = require('express');
const app = express();
const mqtt = require('mqtt');
const WebSocket = require('ws');

// Set up MQTT broker connection
const mqttClient = mqtt.connect('mqtt://localhost:1883');

// Set up WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Set up Express.js server
app.use(express.json());

// Define devices API endpoint
app.post('/devices', (req, res) => {
  const deviceData = req.body;
  // Handle device registration and send data to MQTT broker
  mqttClient.publish('devices', JSON.stringify(deviceData));
  res.send(`Device registered: ${deviceData.name}`);
});

// Define data API endpoint
app.get('/data', (req, res) => {
  // Retrieve data from MQTT broker and send to client
  mqttClient.subscribe('data');
  mqttClient.on('message', (topic, message) => {
    res.send(message.toString());
  });
});

// Set up WebSocket event listener
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages from client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Process message and send response back to client
    ws.send(`Response: ${message}`);
  });

  // Handle errors and disconnections
  ws.on('error', (error) => {
    console.log('Error occurred');
    console.log(error);
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start Express.js server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});