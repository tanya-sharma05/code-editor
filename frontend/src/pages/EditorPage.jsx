import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Client from '../components/Client';
import Editor from '../components/Editor';
import ExplanationPanel from '../components/ExplanationPanel';
import { initSocket } from '../socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Logo from '../components/Logo';

// All supported languages. Value = Monaco language id, label = display name.
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
    { value: 'shell',      label: 'Bash / Shell' },
    { value: 'markdown',   label: 'Markdown' },
];

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

    // Language is LOCAL — each user picks their own syntax highlighting.
    // No socket sync needed (see comments in README/Phase 1 notes).
    const [language, setLanguage] = useState('javascript');

    // Load user info from localStorage
    useEffect(() => {
        const info = localStorage.getItem('userInfo');
        if (info) {
            setUserInfo(JSON.parse(info));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Manage socket connection
    useEffect(() => {
        if (!userInfo) return;

        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleErrors);
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
        } catch (error) {
            toast.error('Failed to get explanation from AI.');
            setIsPanelOpen(false);
        } finally {
            setIsAiLoading(false);
        }
    };

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(documentId);
            toast.success('Document ID copied to clipboard');
        } catch (err) {
            toast.error('Could not copy the Document ID');
        }
    }

    function leaveRoom() {
        navigate('/dashboard');
    }

    if (!userInfo) return null;

    return (
        <div className={`editor-layout ${isPanelOpen ? 'ai-panel-active' : ''}`}>
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
                        {/* ── Language Selector ── */}
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
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        <button className="btn ai-btn" onClick={handleExplainCode}>
                            Debug/Explain with AI
                        </button>
                        <button className="btn copy-btn" onClick={copyRoomId}>
                            Copy Doc ID
                        </button>
                        <button className="btn leave-btn" onClick={leaveRoom}>
                            Leave Room
                        </button>
                    </div>
                </aside>
            )}

            <main className="editor-main">
                <Editor
                    socketRef={socketRef}
                    documentId={documentId}
                    language={language}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </main>
        </div>
    );
};

export default EditorPage;

// import React, { useState, useRef, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import Client from '../components/Client';
// import Editor from '../components/Editor';
// import ExplanationPanel from '../components/ExplanationPanel';
// import { initSocket } from '../socket';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import Logo from '../components/Logo';

// const EditorPage = () => {
//     const socketRef = useRef(null);
//     const codeRef = useRef(null);
//     const location = useLocation();
//     const { documentId } = useParams();
//     const navigate = useNavigate();

//     const [clients, setClients] = useState([]);
//     const [userInfo, setUserInfo] = useState(null);
//     const [aiResponse, setAiResponse] = useState(null);
//     const [isAiLoading, setIsAiLoading] = useState(false);
//     const [isPanelOpen, setIsPanelOpen] = useState(false);

//     const [language, setLanguage] = useState("javascript");

//     // Effect to load user info from localStorage
//     useEffect(() => {
//         const info = localStorage.getItem('userInfo');
//         if(info) {
//             setUserInfo(JSON.parse(info));
//         } 
//         else {
//             navigate('/login');
//         }
//     }, [navigate]);

//     // Effect to manage the socket connection
//     useEffect(() => {
//         if(!userInfo) return;

//         const init = async () => {
//             socketRef.current = await initSocket();
//             socketRef.current.on('connect_error', (err) => handleErrors(err));
//             socketRef.current.on('connect_failed', (err) => handleErrors(err));

//             function handleErrors(e) {
//                 console.log('socket error', e);
//                 toast.error('Socket connection failed, try again later.');
//                 navigate('/dashboard');
//             }

//             socketRef.current.emit('join-document', {
//                 documentId,
//                 username: userInfo.user.name,
//             });

//             socketRef.current.on('update-client-list', (clients) => {
//                 setClients(clients);
//             });
//         };

//         init();

//         // Cleanup function for when the component unmounts
//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//                 socketRef.current.off('update-client-list');
//             }
//         };
//     }, [userInfo, documentId, navigate]);

//     const handleExplainCode = async () => {
//         if (!selectedCode || selectedCode.trim().length < 10) {
//             toast.error('Please select at least 10 characters of code to explain.');
//             return;
//         }
//         setIsPanelOpen(true);
//         setIsAiLoading(true);
//         setAiResponse(null);
//         try {
//             const { data } = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/ai/explain`,
//                 { code: selectedCode },
//                 { headers: { Authorization: `Bearer ${userInfo.token}` } }
//             );
//             setAiResponse(data);
//         } 
//         catch (error) {
//             toast.error('Failed to get explanation from AI.');
//             setIsPanelOpen(false);
//         } 
//         finally {
//             setIsAiLoading(false);
//         }
//     };

//     async function copyRoomId() {
//         try {
//             await navigator.clipboard.writeText(documentId);
//             toast.success('Document ID copied to clipboard');
//         } 
//         catch (err) {
//             toast.error('Could not copy the Document ID');
//         }
//     }

//     function leaveRoom() {
//         navigate('/dashboard');
//     }

//     if(!userInfo) {
//         return null;
//     }

//     return (
//         <div
//             className={`editor-layout ${
//                 isPanelOpen ? 'ai-panel-active' : ''
//             }`}
//         >
//             {isPanelOpen ? (
//                 <ExplanationPanel
//                     isLoading={isAiLoading}
//                     response={aiResponse}
//                     onClose={() => setIsPanelOpen(false)}
//                 />
//             ) : (
//                 <aside className="editor-sidebar">
//                     <div className="sidebar-header">
//                         <Logo />
//                         <h3>Connected Users</h3>
//                     </div>
//                     <div className="sidebar-clients">
//                         {clients.map((client) => (
//                             <Client
//                                 key={client.socketId}
//                                 username={client.username}
//                                 isCurrentUser={
//                                     client.username === userInfo.user.name
//                                 }
//                             />
//                         ))}
//                     </div>
//                     <div className="sidebar-footer">


//                     <select
//     className="language-select"
//     value={language}
//     onChange={(e)=>setLanguage(e.target.value)}
// >

//     <option value="javascript">
//         JavaScript
//     </option>

//     <option value="python">
//         Python
//     </option>

//     <option value="java">
//         Java
//     </option>

//     <option value="cpp">
//         C++
//     </option>

//     <option value="go">
//         Go
//     </option>

//     <option value="rust">
//         Rust
//     </option>

// </select>

//                         <button
//                             className="btn ai-btn"
//                             onClick={handleExplainCode}
//                         >
//                             Debug/Explain with AI
//                         </button>
//                         <button
//                             className="btn copy-btn"
//                             onClick={copyRoomId}
//                         >
//                             Copy Doc ID
//                         </button>
//                         <button
//                             className="btn leave-btn"
//                             onClick={leaveRoom}
//                         >
//                             Leave Room
//                         </button>
//                     </div>
//                 </aside>
//             )}

//             <main className="editor-main">
//                 <Editor
//                     socketRef={socketRef}
//                     documentId={documentId}
//                     language={language}
//                     onCodeChange={(code) => {
//                         codeRef.current = code;
//                     }}
//                 />
//             </main>
//         </div>
//     );
// };

// export default EditorPage;