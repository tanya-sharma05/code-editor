import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [joinId, setJoinId] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if(storedUserInfo) {
            const parsedInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedInfo);
            fetchDocuments(parsedInfo.token);
        } 
        else {
            toast.error('You must be logged in.');
            navigate('/login');
        }
    }, [navigate]); 

    const fetchDocuments = async (token) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/docs`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
            setDocuments(data);
        } 
        catch (error) {
            toast.error('Could not fetch documents.');
        }
    };

    const handleJoinDocument = async () => {
        if (!joinId) {
            return toast.error('Please enter a Document ID.');
        }
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/docs/${joinId}/collaborators`,
                {}, 
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );

            toast.success('Joining document...');
            navigate(`/editor/${joinId}`);
        } 
        catch (error) {
            toast.error(error.response?.data?.message || 'Failed to join document.');
        }
    };

    const handleCreateDocument = async () => {
        if (!newTitle) {
            return toast.error('Title is required.');
        }
        try {
            const { data: newDocument } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/docs`,
                { title: newTitle }, 
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            toast.success('New document created!');
            setIsModalOpen(false); 
            setNewTitle(''); 
            navigate(`/editor/${newDocument._id}`); 
        } 
        catch (error) {
            toast.error('Could not create a new document.');
        }
    };

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="auth-input-group">
                    <h3 className="mainLabel" style={{ marginBottom: '1rem' }}>Create New Document</h3>
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="Enter document title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button onClick={handleCreateDocument} className="btn joinBtn">
                        Create
                    </button>
                </div>
            </Modal>

            <div className="dashboard-page-wrapper">
                <div className="dashboard-header">
                    <h1>Welcome, {userInfo?.user?.name}!</h1>
                    <div className="dashboard-actions">
                        <div className="join-doc-group">
                            <input
                                type="text"
                                className="inputBox"
                                placeholder="Enter Document ID to Join"
                                value={joinId}
                                onChange={(e) => setJoinId(e.target.value)}
                            />
                            <button onClick={handleJoinDocument} className="btn">
                                Join
                            </button>
                        </div>
                        
                        <button onClick={() => setIsModalOpen(true)} className="btn joinBtn">
                            + Create New Document
                        </button>
                    </div>
                </div>

                <h2>Your Documents</h2>
                {documents.length > 0 ? (
                    <div className="document-list">
                        {documents.map((doc) => (
                            <Link to={`/editor/${doc._id}`} key={doc._id} className="document-card">
                                <h3>{doc.title}</h3>
                                <p>Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>You have no documents yet. Create one to get started!</p>
                )}
            </div>
        </>
    );
};

export default DashboardPage;