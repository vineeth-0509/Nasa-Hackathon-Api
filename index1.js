// const express = require("express");
// const mongoose = require("mongoose");
// const app = express();
// const PORT = 3001;

// // MongoDB connection URL
// const mongoURI = "mongodb+srv://vineeththungani:VINEETHVINEETH@cluster0.z6mqvzy.mongodb.net/factors";

// // Connect to MongoDB
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });

// // Define the schema for state data
// const stateSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   co2Level: { type: Number, required: true },
//   energyConsumption: { type: Number, required: true },
//   waterQualityIndex: { type: Number, required: true },
//   seaLevelIndex: { type: Number, required: true }
// });

// // Create a model for state data
// const State = mongoose.model("State", stateSchema);

// app.use(express.json());

// // POST /state/:name
// app.post('/state/:name', async (req, res) => {
//   const stateName = req.params.name;
//   const { co2Level, energyConsumption, waterQualityIndex, seaLevelIndex } = req.body;

//   if (
//     typeof co2Level !== 'number' ||
//     typeof energyConsumption !== 'number' ||
//     typeof waterQualityIndex !== 'number' ||
//     typeof seaLevelIndex !== 'number'
//   ) {
//     return res.status(400).json({
//       error: 'All values must be numbers'
//     });
//   }

//   try {
//     const existingState = await State.findOne({ name: stateName });

//     if (existingState) {
//       // Update existing state data
//       existingState.co2Level = co2Level;
//       existingState.energyConsumption = energyConsumption;
//       existingState.waterQualityIndex = waterQualityIndex;
//       existingState.seaLevelIndex = seaLevelIndex;
//       await existingState.save();
//       res.json({ message: `Data for ${stateName} has been updated successfully.`, data: existingState });
//     } else {
//       // Create new state data
//       const newState = new State({ name: stateName, co2Level, energyConsumption, waterQualityIndex, seaLevelIndex });
//       await newState.save();
//       res.json({ message: `Data for ${stateName} has been added successfully.`, data: newState });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // GET /state/:name
// app.get('/state/:name', async (req, res) => {
//   const stateName = req.params.name;

//   try {
//     const data = await State.findOne({ name: stateName });

//     if (!data) {
//       return res.status(404).json({
//         error: `No data found for state: ${stateName}`
//       });
//     }
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // DELETE /state/:name
// app.delete('/state/:name', async (req, res) => {
//   const stateName = req.params.name;

//   try {
//     const result = await State.deleteOne({ name: stateName });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: `No data found for state: ${stateName}` });
//     }

//     res.json({ message: `Data for ${stateName} has been deleted successfully.` });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // GET /states
// app.get('/states', async (req, res) => {
//   try {
//     const states = await State.find({});
//     res.json(states);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


// netlify-functions/index.js
import express, { Router, json } from "express";
import serverless from "serverless-http";
import { connect, Schema, model } from "mongoose";

const app = express();
const router = Router();

// MongoDB connection URL
const mongoURI = "mongodb+srv://vineeththungani:VINEETHVINEETH@cluster0.z6mqvzy.mongodb.net/factors";

// Connect to MongoDB
connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Define the schema for state data
const stateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  co2Level: { type: Number, required: true },
  energyConsumption: { type: Number, required: true },
  waterQualityIndex: { type: Number, required: true },
  seaLevelIndex: { type: Number, required: true }
});

// Create a model for state data
const State = model("State", stateSchema);

app.use(json());

router.post('/state/:name', async (req, res) => {
  const stateName = req.params.name;
  const { co2Level, energyConsumption, waterQualityIndex, seaLevelIndex } = req.body;

  if (
    typeof co2Level !== 'number' ||
    typeof energyConsumption !== 'number' ||
    typeof waterQualityIndex !== 'number' ||
    typeof seaLevelIndex !== 'number'
  ) {
    return res.status(400).json({
      error: 'All values must be numbers'
    });
  }

  try {
    const existingState = await State.findOne({ name: stateName });

    if (existingState) {
      // Update existing state data
      existingState.co2Level = co2Level;
      existingState.energyConsumption = energyConsumption;
      existingState.waterQualityIndex = waterQualityIndex;
      existingState.seaLevelIndex = seaLevelIndex;
      await existingState.save();
      res.json({ message: `Data for ${stateName} has been updated successfully.`, data: existingState });
    } else {
      // Create new state data
      const newState = new State({ name: stateName, co2Level, energyConsumption, waterQualityIndex, seaLevelIndex });
      await newState.save();
      res.json({ message: `Data for ${stateName} has been added successfully.`, data: newState });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/state/:name', async (req, res) => {
  const stateName = req.params.name;

  try {
    const data = await State.findOne({ name: stateName });

    if (!data) {
      return res.status(404).json({
        error: `No data found for state: ${stateName}`
      });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/state/:name', async (req, res) => {
  const stateName = req.params.name;

  try {
    const result = await State.deleteOne({ name: stateName });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: `No data found for state: ${stateName}` });
    }

    res.json({ message: `Data for ${stateName} has been deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/states', async (req, res) => {
  try {
    const states = await State.find({});
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api', router);

export const handler = serverless(app);
