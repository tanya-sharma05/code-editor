import React, { useEffect, useRef, useState } from 'react';
import Logo from "../components/Logo";
import {useNavigate, useParams} from "react-router-dom";
import Client from "../components/Client";
import ExplanationPanel from '../components/ExplainationPanel';
import Editor from '../components/Editor';
import OutputTerminal from '../components/OutputTerminal';
import {initSocket} from '../socket';
import toast from "react-hot-toast";
import axios from "axios";

const LANGUAGES = [
    {value: 'javascript', label: 'JavaScript' },
    {value: 'typescript', label: 'TypeScript' },
    {value: 'python', label: 'Python' },
    {value: 'java', label: 'Java' },
    {value: 'cpp', label: 'C++' },
    {value: 'c', label: 'C' },
    {value: 'csharp', label: 'C#' },
    {value: 'go', label: 'Go' },
    {value: 'rust', label: 'Rust' },
    {value: 'ruby', label: 'Ruby' },
    {value: 'php', label: 'PHP' },
    {value: 'swift', label: 'Swift' },
    {value: 'kotlin', label: 'Kotlin' },
    {value: 'html', label: 'HTML' },
    {value: 'css', label: 'CSS' },
    {value: 'json', label: 'JSON' },
    {value: 'sql', label: 'SQL' },
    {value: 'bash', label: 'Bash / Shell' },
    {value: 'markdown', label: 'Markdown' },
];

function EditorPage() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [userInfo, setUserInfo] = useState(null); 

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const {documentId} = useParams();
    const [language, setLanguage] = useState('javascript');
    const codeRef = useRef(null);

    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState(null);   
    const [isOutputOpen, setIsOutputOpen] = useState(false);

    const socketRef = useRef(null);

    // loads user info, if not logged in navigate to login page
    useEffect(() => {
        const info = localStorage.getItem('userInfo');
        if(info) setUserInfo(JSON.parse(info));
        else navigate('/login');
    }, [navigate]);

    
    // Used to create socket connection and join document room (show clients)
    useEffect(() => {
        // Stop socket connection until user data exists
        if(!userInfo) return;

        const init = async () => {
            // socketRef.current stores the socket instance
            socketRef.current = await initSocket();
            // Listen for socket connection errors
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later');
                navigate('/dashboard');
            }

            // Send event to backend to join this document room
            socketRef.current.emit('join-document',
                {
                    documentId,
                    username: userInfo.user.name,
                }
            );

            // Listen for updated connected users list from backend when new user joins or any user leaves
            socketRef.current.on('update-client-list',
                (clients) => {
                    console.log("Connected clients:", clients);
                    setClients(clients);
                }
            );

        };

        // Call socket initialization function
        init();

        // runs when user leaves editor page
        return () => {
            if(socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('update-client-list');
            }
        };
    }, [userInfo, documentId, navigate]);


    const handleExplainCode = async () => {
        // Get the code selected by user inside editor
        // window.getSelectedCode is a custom function created in Editor component
        // ?.() means:
        // call function only if it exists
        // ?? '' means:
        // if result is null/undefined use empty string
        const selectedCode = window.getSelectedCode?.() ?? '';
        if(!selectedCode || selectedCode.trim().length < 10) {
            toast.error("Please select at least 10 characters of code to explain");
            return;
        }

        setIsPanelOpen(true);
        setIsAiLoading(true);
        setAiResponse(null);
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ai/explain`,
                                            {code: selectedCode},
                                            {headers: {Authorization: `Bearer ${userInfo.token}`}}
            );
            setAiResponse(data);
        } 
        catch {
            toast.error("Failed to get explanation from AI");
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
        catch {
            toast.error('Could not copy the Document ID');
        }
    };

    const handleRunCode = async () => {
    };

    return (
        <div className={`editor-layout ${isPanelOpen ? 'ai-panel-active' : ''}`}>
            {isPanelOpen ? (
                <ExplanationPanel
                    isLoading={isAiLoading}
                    response={aiResponse}
                    onClose={() => setIsPanelOpen(false)}
                />
            ): (
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
                                isCurrentUser={client.username === userInfo.user.name}
                            />
                        ))}
                    </div>

                    <div className="sidebar-footer">
                        <select
                            id="language-select"
                            className="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {LANGUAGES.map(({value, label}) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>

                        <button
                            className="btn run-btn"
                            onClick={handleRunCode}
                            disabled={isRunning}
                        >
                            {isRunning ? '⏳ Running...' : '▶ Run Code'}
                        </button>

                        <button className="btn ai-btn" onClick={handleExplainCode}>
                            Debug/Explain with AI
                        </button>
                        <button className="btn copy-btn" onClick={copyRoomId}>
                            Copy Doc ID
                        </button>
                        <button className="btn leave-btn" onClick={() => navigate('/dashboard')}>
                            Leave Room
                        </button>
                    </div>
                </aside>
            )}

            <main className="editor-main">
                <div className={`editor-area`}>
                    <Editor
                        socketRef={socketRef}
                        documentId={documentId}
                        language={language}
                        onCodeChange={(code) => {codeRef.current = code}}
                    />
                </div>

                {isOutputOpen && (
                    <OutputTerminal
                        output={output}
                        isLoading={isRunning}
                        onClose={() => setIsOutputOpen(false)}
                    />
                )}
            </main>
            
        </div>
    )
}

export default EditorPage