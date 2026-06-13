import React, { useState } from 'react';
import {Link} from "react-router-dom";
import Modal from "../components/Modal";

function DashboardPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [joinId, setJoinId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [newTitle, setNewTitle] = useState('');

    const handleJoinDocument = async () => {
    };

    const handleCreateDocument = async () => {
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
    )
}

export default DashboardPage