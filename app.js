const express = require('express');
const mongoose = require('mongoose');
const uploadRoutes = require('./routes/upload');
const cors = require('cors'); // Import cors

const app = express();

app.use(cors());
// MongoDB connection
mongoose.connect('mongodb+srv://Jay:lZqO9hytpsNFauu1@cluster0.wpyapa4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/api', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));