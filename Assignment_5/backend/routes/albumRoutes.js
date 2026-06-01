const express = require('express');
const router = express.Router();

const albumController = require('../controllers/albumController');

// Get all albums
router.get('/', albumController.getAllAlbums);

// Get a single album by ID
router.get('/:id', albumController.getAlbumById);

// Create a new album
router.post('/', albumController.createAlbum);

// Update an existing album
router.put('/:id', albumController.updateAlbum);

// Delete an album
router.delete('/:id', albumController.deleteAlbum);

module.exports = router;