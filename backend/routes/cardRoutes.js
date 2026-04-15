const express = require('express');
const router = express.Router();
const { getCards, createCard, updateCard, deleteCard } = require('../controllers/cardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/list/:listId').get(getCards).post(createCard);
router.route('/:id').put(updateCard).delete(deleteCard);

module.exports = router;
