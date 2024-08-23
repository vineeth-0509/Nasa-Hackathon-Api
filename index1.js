// const express = require('express');
// const serverless = require('serverless-http');
// const mongoose = require('mongoose');
// const { Router, json } = express;

// const app = express();
// const router = Router();

// const mongoURI = process.env.MONGO_URI; // Use environment variable
// connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });

// const stateSchema = new Schema({
//   name: { type: String, required: true, unique: true },
//   co2Level: { type: Number, required: true },
//   energyConsumption: { type: Number, required: true },
//   waterQualityIndex: { type: Number, required: true },
//   seaLevelIndex: { type: Number, required: true }
// });

// const State = model("State", stateSchema);

// app.use(json());

// router.post('/', async (req, res) => {
//   const stateName = req.query.name;
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
//       existingState.co2Level = co2Level;
//       existingState.energyConsumption = energyConsumption;
//       existingState.waterQualityIndex = waterQualityIndex;
//       existingState.seaLevelIndex = seaLevelIndex;
//       await existingState.save();
//       res.json({ message: `Data for ${stateName} has been updated successfully.`, data: existingState });
//     } else {
//       const newState = new State({ name: stateName, co2Level, energyConsumption, waterQualityIndex, seaLevelIndex });
//       await newState.save();
//       res.json({ message: `Data for ${stateName} has been added successfully.`, data: newState });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.get('/', async (req, res) => {
//   const stateName = req.query.name;

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

// router.delete('/', async (req, res) => {
//   const stateName = req.query.name;

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

// export default serverless(app);



const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

const mongoURI = process.env.MONGO_URI; // Use environment variable
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  co2Level: { type: Number, required: true },
  energyConsumption: { type: Number, required: true },
  waterQualityIndex: { type: Number, required: true },
  seaLevelIndex: { type: Number, required: true }
});

const State = mongoose.model("State", stateSchema);

app.use(express.json());

router.post('/', async (req, res) => {
  const stateName = req.query.name;
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
      existingState.co2Level = co2Level;
      existingState.energyConsumption = energyConsumption;
      existingState.waterQualityIndex = waterQualityIndex;
      existingState.seaLevelIndex = seaLevelIndex;
      await existingState.save();
      res.json({ message: `Data for ${stateName} has been updated successfully.`, data: existingState });
    } else {
      const newState = new State({ name: stateName, co2Level, energyConsumption, waterQualityIndex, seaLevelIndex });
      await newState.save();
      res.json({ message: `Data for ${stateName} has been added successfully.`, data: newState });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  const stateName = req.query.name;

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

router.delete('/', async (req, res) => {
  const stateName = req.query.name;

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

app.use('/api/state', router);

module.exports = serverless(app);

