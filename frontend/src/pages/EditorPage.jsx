import React, { useEffect, useRef, useState } from 'react';
import Logo from "../components/Logo";
import {useNavigate, useParams} from "react-router-dom";
import Client from "../components/Client";
import ExplanationPanel from '../components/ExplainationPanel';
import Editor from '../components/Editor';
import OutputTerminal from '../components/OutputTerminal';

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

    const handleExplainCode = async () => {
    };

    async function copyRoomId() {
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
                                // key={client.socketId}
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
                        // socketRef={socketRef}
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