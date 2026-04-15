import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import './Board.css';

const Board = () => {
    const { id } = useParams();
    const [lists, setLists] = useState([]);
    const [isCreatingList, setIsCreatingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    useEffect(() => {
        fetchLists();
    }, [id]);

    const fetchLists = async () => {
        try {
            const listsRes = await axios.get(`/api/lists/board/${id}`);
            const fetchedLists = listsRes.data;

            const listWithCards = await Promise.all(
                fetchedLists.map(async (list) => {
                    const cardsRes = await axios.get(`/api/cards/list/${list._id}`);
                    return { ...list, cards: cardsRes.data };
                })
            );

            setLists(listWithCards);
        } catch (error) {
            console.error('Error fetching board data', error);
        }
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/lists/board/${id}`, { title: newListTitle });
            setLists([...lists, { ...res.data, cards: [] }]);
            setNewListTitle('');
            setIsCreatingList(false);
        } catch (error) {
            console.error('Error creating list', error);
        }
    };

    const handleDeleteList = async (listId) => {
        if(window.confirm("Delete this entire list?")) {
            try {
                await axios.delete(`/api/lists/${listId}`);
                setLists(lists.filter(l => l._id !== listId));
            } catch (error) {
                console.error("Error deleting list", error);
            }
        }
    };

    const handleCreateCard = async (listId, cardTitle) => {
        try {
            const res = await axios.post(`/api/cards/list/${listId}`, { title: cardTitle });
            setLists(lists.map(list => {
                if (list._id === listId) {
                    return { ...list, cards: [...list.cards, res.data] };
                }
                return list;
            }));
        } catch (error) {
            console.error('Error creating card', error);
        }
    };

    const handleUpdateCard = async (listId, cardId, newTitle) => {
        try {
            const res = await axios.put(`/api/cards/${cardId}`, { title: newTitle });
            setLists(lists.map(list => {
                if(list._id === listId) {
                    return {
                        ...list,
                        cards: list.cards.map(c => c._id === cardId ? res.data : c)
                    };
                }
                return list;
            }));
        } catch (error) {
            console.error('Error updating card', error);
        }
    };

    const handleDeleteCard = async (listId, cardId) => {
        if(window.confirm("Delete this card?")) {
            try {
                await axios.delete(`/api/cards/${cardId}`);
                setLists(lists.map(list => {
                    if(list._id === listId) {
                        return {
                            ...list,
                            cards: list.cards.filter(c => c._id !== cardId)
                        };
                    }
                    return list;
                }));
            } catch (error) {
                console.error('Error deleting card', error);
            }
        }
    };

    return (
        <div className="board-container">
            <div className="board-canvas">
                {lists.map(list => (
                    <ListColumn 
                        key={list._id} 
                        list={list} 
                        onCreateCard={handleCreateCard} 
                        onDeleteList={handleDeleteList}
                        onUpdateCard={handleUpdateCard}
                        onDeleteCard={handleDeleteCard}
                    />
                ))}

                <div className="list-wrapper">
                    {!isCreatingList ? (
                        <button className="add-list-btn glass-panel" onClick={() => setIsCreatingList(true)}>
                            <Plus size={18} /> Add another list
                        </button>
                    ) : (
                        <div className="add-list-form glass-panel">
                            <form onSubmit={handleCreateList}>
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder="Enter list title..." 
                                    value={newListTitle}
                                    onChange={(e) => setNewListTitle(e.target.value)}
                                    required
                                />
                                <div className="create-actions">
                                    <button type="submit" className="btn-primary">Add List</button>
                                    <button type="button" onClick={() => setIsCreatingList(false)} className="icon-btn-form"><X size={20}/></button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Subcomponent for cleaner code
const ListColumn = ({ list, onCreateCard, onDeleteList, onUpdateCard, onDeleteCard }) => {
    const [isCreatingCard, setIsCreatingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newCardTitle.trim()) {
            onCreateCard(list._id, newCardTitle);
            setNewCardTitle('');
            setIsCreatingCard(false);
        }
    };

    return (
        <div className="list-wrapper">
            <div className="list-content glass-panel">
                <div className="list-header">
                    <h3>{list.title}</h3>
                    <button className="icon-btn delete-btn" onClick={() => onDeleteList(list._id)} title="Delete List">
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="list-cards custom-scrollbar">
                    {list.cards && list.cards.map(card => (
                        <CardItem 
                            key={card._id} 
                            card={card} 
                            listId={list._id}
                            onUpdateCard={onUpdateCard}
                            onDeleteCard={onDeleteCard}
                        />
                    ))}
                </div>

                {!isCreatingCard ? (
                    <button className="add-card-btn" onClick={() => setIsCreatingCard(true)}>
                        <Plus size={16} /> Add a card
                    </button>
                ) : (
                    <div className="add-card-form">
                        <form onSubmit={handleSubmit}>
                            <textarea 
                                autoFocus
                                placeholder="Enter a title for this card..." 
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                required
                                rows={2}
                                className="card-input"
                            />
                            <div className="create-actions">
                                <button type="submit" className="btn-primary">Add Card</button>
                                <button type="button" onClick={() => setIsCreatingCard(false)} className="icon-btn-form"><X size={20}/></button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

const CardItem = ({ card, listId, onUpdateCard, onDeleteCard }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(card.title);

    const handleSave = () => {
        if(editTitle.trim() && editTitle !== card.title) {
            onUpdateCard(listId, card._id, editTitle);
        }
        setIsEditing(false);
    };

    if(isEditing) {
        return (
            <div className="card editing">
                <textarea 
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    rows={2}
                    className="card-input"
                />
                <div className="edit-actions">
                    <button onClick={handleSave} className="btn-primary" style={{padding: '4px 8px'}}><Check size={14}/></button>
                    <button onClick={() => setIsEditing(false)} className="btn-ghost" style={{padding: '4px 8px'}}><X size={14}/></button>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <span className="card-title">{card.title}</span>
            <div className="card-actions">
                <button className="icon-btn edit-btn" onClick={() => setIsEditing(true)} title="Edit">
                    <Edit2 size={14} />
                </button>
                <button className="icon-btn delete-btn" onClick={() => onDeleteCard(listId, card._id)} title="Delete">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

export default Board;
