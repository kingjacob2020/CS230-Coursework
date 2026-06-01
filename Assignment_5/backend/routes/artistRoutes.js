const express = require('express');
const router = express.Router();

const artistController = require('../controllers/artistController');

// Get all artists
router.get('/', artistController.getAllArtists);

// Get a single artist by ID
router.get('/:id', artistController.getArtistById);

// Create a new artist
router.post('/', artistController.createArtist);

// Update an existing artist
router.put('/:id', artistController.updateArtist);

// Delete an artist
router.delete('/:id', artistController.deleteArtist);

module.exports = router;