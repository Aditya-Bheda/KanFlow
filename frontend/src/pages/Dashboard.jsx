import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [title, setTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const res = await axios.get('/api/boards');
            setBoards(res.data);
        } catch (error) {
            console.error('Error fetching boards', error);
        }
    };

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/boards', { title });
            setBoards([res.data, ...boards]);
            setTitle('');
            setIsCreating(false);
        } catch (error) {
            console.error('Error creating board', error);
        }
    };

    const handleDeleteBoard = async (e, id) => {
        e.stopPropagation(); // prevent navigating to board
        if (window.confirm("Are you sure you want to delete this board?")) {
            try {
                await axios.delete(`/api/boards/${id}`);
                setBoards(boards.filter(b => b._id !== id));
            } catch (error) {
                console.error("Error deleting board", error);
            }
        }
    };

    return (
        <div className="dashboard-container container">
            <div className="dashboard-header">
                <h2>Your Workspaces</h2>
            </div>
            
            <div className="boards-grid">
                {boards.map(board => (
                    <div 
                        key={board._id} 
                        className="board-card glass-panel"
                        onClick={() => navigate(`/board/${board._id}`)}
                    >
                        <div className="board-card-header">
                            <h3>{board.title}</h3>
                            <button 
                                className="icon-btn delete-btn" 
                                onClick={(e) => handleDeleteBoard(e, board._id)}
                                title="Delete Board"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {!isCreating ? (
                    <div className="board-card glass-panel create-board-btn" onClick={() => setIsCreating(true)}>
                        <Plus />
                        <span>Create new board</span>
                    </div>
                ) : (
                    <div className="board-card glass-panel creating-state">
                        <form onSubmit={handleCreateBoard}>
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Board title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <div className="create-actions">
                                <button type="submit" className="btn-primary">Create</button>
                                <button type="button" onClick={() => setIsCreating(false)} className="btn-ghost">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
