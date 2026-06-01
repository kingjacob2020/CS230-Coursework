const express = require('express');
const cors = require('cors');
require('./db');

const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const songRoutes = require('./routes/songRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Music Library API');
});

app.use("/artists", artistRoutes);
app.use("/albums", albumRoutes);
app.use("/songs", songRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});