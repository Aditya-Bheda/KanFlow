const express = require('express');
const router = express.Router();
const { getLists, createList, updateList, deleteList } = require('../controllers/listController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/board/:boardId').get(getLists).post(createList);
router.route('/:id').put(updateList).delete(deleteList);

module.exports = router;
