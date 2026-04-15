const express = require('express');
const router = express.Router();
const { getBoards, createBoard, deleteBoard } = require('../controllers/boardController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all board routes

router.route('/').get(getBoards).post(createBoard);
router.route('/:id').delete(deleteBoard);

module.exports = router;
