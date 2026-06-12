import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Client from '../components/Client';
import Editor from '../components/Editor';
import ExplanationPanel from '../components/ExplanationPanel';
import OutputTerminal from '../components/OutputTerminal';   // ← NEW (Phase 3)
import { initSocket } from '../socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Logo from '../components/Logo';

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python',     label: 'Python' },
    { value: 'java',       label: 'Java' },
    { value: 'cpp',        label: 'C++' },
    { value: 'c',          label: 'C' },
    { value: 'csharp',     label: 'C#' },
    { value: 'go',         label: 'Go' },
    { value: 'rust',       label: 'Rust' },
    { value: 'ruby',       label: 'Ruby' },
    { value: 'php',        label: 'PHP' },
    { value: 'swift',      label: 'Swift' },
    { value: 'kotlin',     label: 'Kotlin' },
    { value: 'html',       label: 'HTML' },
    { value: 'css',        label: 'CSS' },
    { value: 'json',       label: 'JSON' },
    { value: 'sql',        label: 'SQL' },
    { value: 'bash',       label: 'Bash / Shell' },
    { value: 'markdown',   label: 'Markdown' },
];

const EditorPage = () => {
    const socketRef = useRef(null);
    // const codeRef   = useRef(null);
    const codeRef = useRef('// Start coding here!'); 
    const { documentId } = useParams();
    const navigate = useNavigate();

    const [clients,      setClients]      = useState([]);
    const [userInfo,     setUserInfo]     = useState(null);
    const [language,     setLanguage]     = useState('javascript');

    // AI panel state
    const [aiResponse,   setAiResponse]   = useState(null);
    const [isAiLoading,  setIsAiLoading]  = useState(false);
    const [isPanelOpen,  setIsPanelOpen]  = useState(false);

    // ── Run Code state ──────────────────────────────────────
    const [isRunning,    setIsRunning]    = useState(false);
    const [output,       setOutput]       = useState(null);   // result object from backend
    const [isOutputOpen, setIsOutputOpen] = useState(false);
    // ────────────────────────────────────────────────────────

    // Load user info
    useEffect(() => {
        const info = localStorage.getItem('userInfo');
        if (info) setUserInfo(JSON.parse(info));
        else navigate('/login');
    }, [navigate]);

    // Socket connection
    useEffect(() => {
        if (!userInfo) return;

        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error',  handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

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

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('update-client-list');
            }
        };
    }, [userInfo, documentId, navigate]);

    // ── AI Explain ──────────────────────────────────────────
    const handleExplainCode = async () => {
        const selectedCode = window.getSelectedCode?.() ?? '';
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
        } catch {
            toast.error('Failed to get explanation from AI.');
            setIsPanelOpen(false);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleRunCode = async () => {
    // Try codeRef first, then fall back to reading directly from Monaco
    const code = codeRef.current || window.getEditorValue?.() || '';
 
    if (!code.trim()) {
        toast.error('Editor is empty — nothing to run!');
        return;
    }
 
    setIsRunning(true);
    setOutput(null);
    setIsOutputOpen(true);
 
    try {
        const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/code/run`,
            { code, language },
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setOutput(data);
    } catch (error) {
        const msg = error?.response?.data?.message || 'Code execution failed.';
        toast.error(msg);
        setOutput({ message: msg, status: { description: 'Error' } });
    } finally {
        setIsRunning(false);
    }
};
 
    // // ── Run Code ────────────────────────────────────────────
    // const handleRunCode = async () => {
    //     const code = codeRef.current;
    //     if (!code || !code.trim()) {
    //         toast.error('Editor is empty — nothing to run!');
    //         return;
    //     }

    //     setIsRunning(true);
    //     setOutput(null);
    //     setIsOutputOpen(true);   // open terminal panel immediately (shows loading)

    //     try {
    //         const { data } = await axios.post(
    //             `${import.meta.env.VITE_BACKEND_URL}/api/code/run`,
    //             { code, language },
    //             { headers: { Authorization: `Bearer ${userInfo.token}` } }
    //         );
    //         setOutput(data);
    //     } catch (error) {
    //         const msg = error?.response?.data?.message || 'Code execution failed.';
    //         toast.error(msg);
    //         setOutput({ message: msg, status: { description: 'Error' } });
    //     } finally {
    //         setIsRunning(false);
    //     }
    // };
    // ────────────────────────────────────────────────────────

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(documentId);
            toast.success('Document ID copied to clipboard');
        } catch {
            toast.error('Could not copy the Document ID');
        }
    }

    if (!userInfo) return null;

    return (
        <div className={`editor-layout ${isPanelOpen ? 'ai-panel-active' : ''}`}>

            {/* ── Sidebar ── */}
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
                                isCurrentUser={client.username === userInfo.user.name}
                            />
                        ))}
                    </div>

                    <div className="sidebar-footer">
                        <label className="language-label" htmlFor="language-select">
                            Language
                        </label>
                        <select
                            id="language-select"
                            className="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {LANGUAGES.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>

                        {/* ── Run Code button ── */}
                        <button
                            className="btn run-btn"
                            onClick={handleRunCode}
                            disabled={isRunning}
                        >
                            {isRunning ? '⏳ Running...' : '▶ Run Code'}
                        </button>

                        <button className="btn ai-btn"   onClick={handleExplainCode}>
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

            {/* ── Editor + Output stacked vertically ── */}
            <main className="editor-main">
                <div className={`editor-area ${isOutputOpen ? 'with-output' : ''}`}>
                    <Editor
                        socketRef={socketRef}
                        documentId={documentId}
                        language={language}
                        onCodeChange={(code) => { codeRef.current = code; }}
                    />
                </div>

                {/* ── Output Terminal (Phase 3 component) ── */}
                {isOutputOpen && (
                    <OutputTerminal
                        output={output}
                        isLoading={isRunning}
                        onClose={() => setIsOutputOpen(false)}
                    />
                )}
            </main>
        </div>
    );
};

export default EditorPage;