const Board = require('../models/Board');

// @desc    Get user boards
// @route   GET /api/boards
// @access  Private
const getBoards = async (req, res) => {
    try {
        const boards = await Board.find({ user: req.user }).sort({ createdAt: -1 });
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ message: 'Board title is required' });
        }

        const board = await Board.create({
            title: req.body.title,
            user: req.user
        });

        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Check if user owns board
        if (board.user.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await board.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBoards, createBoard, deleteBoard };
