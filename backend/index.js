const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const server = express();
const PORT = 5000;

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect('mongodb://0.0.0.0:27017/emissions');
    console.log("Connection Succesfull ! :  ", connection.connection.name);
  } catch (err) {
    console.log(err);
  }
};

connectDatabase();

const emissionSchema = new mongoose.Schema({
  pollutant: String,
  value: Number,
});

const EmissionModel = mongoose.model('emissions', emissionSchema);

server.use(express.json());
server.use(cors({
  origin: ['http://localhost:3000']
}));

server.get('/api/emissions', async (req, res) => {
  try {
    const emissions = await EmissionModel.find();
    res.json(emissions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.get('/api/emissions/:id', async (req, res) => {
  try {
    const emission = await EmissionModel.findById(req.params.id);
    if (!emission) {
      return res.status(404).json({ error: 'Emission not found' });
    }
    res.json(emission);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.post('/api/emissions', async (req, res) => {
  console.log("post:   ", req.body);
  try {
    const newEmission = await EmissionModel.create(req.body);
    res.status(201).json(newEmission);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.put('/api/emissions/:id', async (req, res) => {
  try {
    const updatedEmission = await EmissionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmission) {
      return res.status(404).json({ error: 'Emission not found' });
    }
    res.json(updatedEmission);
  } catch (error) {
    res.status(500).json({ error: 'Internal  Error' });
  }
});

server.delete('/api/emissions/:id', async (req, res) => {
  try {
    const deletedEmission = await EmissionModel.findByIdAndDelete(req.params.id);
    if (!deletedEmission) {
      return res.status(404).json({ error: 'Emission not found' });
    }
    res.json({ message: 'Emission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Error' });
  }
});

server.listen(PORT, () => {
  console.log(`Backend on port ${PORT}`);
});
                    
