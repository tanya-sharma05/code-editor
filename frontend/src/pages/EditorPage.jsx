import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Client from '../components/Client';
import Editor from '../components/Editor';
import ExplanationPanel from '../components/ExplanationPanel';
import { initSocket } from '../socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Logo from '../components/Logo';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { documentId } = useParams();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [aiResponse, setAiResponse] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Effect to load user info from localStorage
    useEffect(() => {
        const info = localStorage.getItem('userInfo');
        if(info) {
            setUserInfo(JSON.parse(info));
        } 
        else {
            navigate('/login');
        }
    }, [navigate]);

    // Effect to manage the socket connection
    useEffect(() => {
        if(!userInfo) return;

        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                navigate('/dashboard');
            }

            socketRef.current.emit('join-document', {
                documentId,
                username: userInfo.user.name,
            });

            socketRef.current.on('update-client-list', (clients) => {
                setClients(clients);
            });
        };

        init();

        // Cleanup function for when the component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('update-client-list');
            }
        };
    }, [userInfo, documentId, navigate]);

    const handleExplainCode = async () => {
        // const selectedCode = window.getSelection().toString();
        const selectedCode =
    window.getSelectedCode();

    console.log(
    "SELECTED CODE:",
    selectedCode
);

        if (!selectedCode || selectedCode.trim().length < 10) {
            toast.error('Please select at least 10 characters of code to explain.');
            return;
        }
        setIsPanelOpen(true);
        setIsAiLoading(true);
        setAiResponse(null);
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/ai/explain`,
                { code: selectedCode },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            setAiResponse(data);
        } 
        catch (error) {
            toast.error('Failed to get explanation from AI.');
            setIsPanelOpen(false);
        } 
        finally {
            setIsAiLoading(false);
        }
    };

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(documentId);
            toast.success('Document ID copied to clipboard');
        } 
        catch (err) {
            toast.error('Could not copy the Document ID');
        }
    }

    function leaveRoom() {
        navigate('/dashboard');
    }

    if(!userInfo) {
        return null;
    }

    return (
        <div
            className={`editor-layout ${
                isPanelOpen ? 'ai-panel-active' : ''
            }`}
        >
            {isPanelOpen ? (
                <ExplanationPanel
                    isLoading={isAiLoading}
                    response={aiResponse}
                    onClose={() => setIsPanelOpen(false)}
                />
            ) : (
                <aside className="editor-sidebar">
                    <div className="sidebar-header">
                        <Logo />
                        <h3>Connected Users</h3>
                    </div>
                    <div className="sidebar-clients">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                                isCurrentUser={
                                    client.username === userInfo.user.name
                                }
                            />
                        ))}
                    </div>
                    <div className="sidebar-footer">
                        <button
                            className="btn ai-btn"
                            onClick={handleExplainCode}
                        >
                            Debug/Explain with AI
                        </button>
                        <button
                            className="btn copy-btn"
                            onClick={copyRoomId}
                        >
                            Copy Doc ID
                        </button>
                        <button
                            className="btn leave-btn"
                            onClick={leaveRoom}
                        >
                            Leave Room
                        </button>
                    </div>
                </aside>
            )}

            <main className="editor-main">
                <Editor
                    socketRef={socketRef}
                    documentId={documentId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </main>
        </div>
    );
};

export default EditorPage;