const List = require('../models/List');
const Board = require('../models/Board');

// @desc    Get lists for a board
// @route   GET /api/lists/board/:boardId
// @access  Private
const getLists = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const board = await Board.findById(boardId);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        if (board.user.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const lists = await List.find({ board: boardId }).sort({ order: 1 });
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a list
// @route   POST /api/lists/board/:boardId
// @access  Private
const createList = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'List title is required' });
        }

        const board = await Board.findById(boardId);
        if (!board) return res.status(404).json({ message: 'Board not found' });
        if (board.user.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const listCount = await List.countDocuments({ board: boardId });
        
        const list = await List.create({
            title,
            board: boardId,
            order: listCount
        });

        res.status(201).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a list
// @route   PUT /api/lists/:id
// @access  Private
const updateList = async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).json({ message: 'List not found' });

        const updatedList = await List.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a list
// @route   DELETE /api/lists/:id
// @access  Private
const deleteList = async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).json({ message: 'List not found' });

        // Note: Ideally, we also delete all cards within this list here, 
        // but for simplicity in UI it'll work without it (cards orphaned but not matched).
        // Let's add a quick cleanup for cards inside it.
        const Card = require('../models/Card');
        await Card.deleteMany({ list: req.params.id });

        await list.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLists, createList, updateList, deleteList };
