import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ListTodo, CreditCard } from 'lucide-react';
import './MyActivity.css';

const MyActivity = () => {
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            // 1. Get all Boards
            const boardsRes = await axios.get('/api/boards');
            const boards = boardsRes.data;

            // 2. Map through each board and get its lists and cards
            const comprehensiveData = await Promise.all(
                boards.map(async (board) => {
                    const listsRes = await axios.get(`/api/lists/board/${board._id}`);
                    const lists = listsRes.data;

                    const listsWithCards = await Promise.all(
                        lists.map(async (list) => {
                            const cardsRes = await axios.get(`/api/cards/list/${list._id}`);
                            return { ...list, cards: cardsRes.data };
                        })
                    );

                    return { ...board, lists: listsWithCards };
                })
            );

            setActivityData(comprehensiveData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching comprehensive data', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="activity-container loading">Loading your workspace data...</div>;
    }

    return (
        <div className="dashboard-page">
            <div className="activity-container container">
                <div className="dashboard-header" style={{marginBottom: '20px'}}>
                    <h2>Global Activity Tracker</h2>
                    <p style={{color: 'var(--text-muted)'}}>Overview of all your Lists and Cards across all Workspaces.</p>
                </div>

                {activityData.length === 0 ? (
                    <div className="glass-panel" style={{padding: '30px', textAlign: 'center', borderRadius: '12px'}}>
                        <p>You haven't created any boards or cards yet!</p>
                        <Link to="/dashboard" className="btn-primary" style={{display: 'inline-block', marginTop: '15px'}}>Go to Dashboard</Link>
                    </div>
                ) : (
                    <div className="activity-layout">
                        {/* Summary Column */}
                        <div className="activity-summary glass-panel">
                            <h3><LayoutDashboard size={18}/> Workspace Summary</h3>
                            <div className="summary-stats">
                                <div className="stat-box">
                                    <span className="stat-num">{activityData.length}</span>
                                    <span className="stat-label">Boards</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-num">{activityData.reduce((acc, board) => acc + board.lists.length, 0)}</span>
                                    <span className="stat-label">Lists</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-num">{activityData.reduce((acc, board) => acc + board.lists.reduce((acc2, list) => acc2 + list.cards.length, 0), 0)}</span>
                                    <span className="stat-label">Cards</span>
                                </div>
                            </div>
                        </div>

                        {/* Detail Column */}
                        <div className="activity-details">
                            {activityData.map(board => (
                                <div key={board._id} className="activity-board-section glass-panel">
                                    <div className="activity-board-header">
                                        <Link to={`/board/${board._id}`} className="activity-board-title">
                                           {board.title} <span style={{fontSize: '0.8rem', fontWeight: 400, color: 'var(--primary-color)'}}>(Go to Board ↗)</span>
                                        </Link>
                                    </div>
                                    
                                    <div className="activity-lists-grid">
                                        {board.lists.map(list => (
                                            <div key={list._id} className="activity-list-box">
                                                <h4 className="activity-list-title"><ListTodo size={14}/> {list.title}</h4>
                                                <ul className="activity-cards">
                                                    {list.cards.length > 0 ? (
                                                        list.cards.map(card => (
                                                            <li key={card._id} className="activity-card-item">
                                                                <Link to={`/board/${board._id}`} style={{color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px', width: '100%'}}>
                                                                    <CreditCard size={12}/> {card.title}
                                                                </Link>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="empty-text">No cards in this list</li>
                                                    )}
                                                </ul>
                                            </div>
                                        ))}
                                        {board.lists.length === 0 && <p className="empty-text">No lists created in this board.</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyActivity;
