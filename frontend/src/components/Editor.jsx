import { useRef } from "react";
import MonacoEditor from "@monaco-editor/react";

const LANGUAGE_MAP = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    go: "go",
    rs: "rust",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
};


const Editor = ({
    socketRef,
    documentId,
    onCodeChange,
    language = "javascript"
}) => {

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const isRemote = useRef(false);

    const handleChange = (value) => {
        if(isRemote.current){
            return;
        }

        onCodeChange(value);

        if(socketRef.current){
            socketRef.current.emit(
                "send-changes",
                {
                    documentId,
                    content:value
                }
            );
        }
    };

    const handleEditorMount=(editor,monaco)=>{
        editorRef.current = editor;
        monacoRef.current = monaco;
        
        window.getSelectedCode = () => {
            const selection = editor.getSelection();
            if(!selection){
                return "";
            }
            return editor
                .getModel()
                .getValueInRange(selection);
        };

        window.getEditorValue = () => editor.getValue() ?? '';

        if(socketRef.current){
            socketRef.current.on(
                "receive-changes",
                (content)=>{
                    isRemote.current=true;

                    if(editor.getValue() !== content){
                        editor.setValue(
                            content || ""
                        );
                    }
                    isRemote.current=false;
                }
            );
        }
        editor.focus();
    };

    const resolvedLanguage = LANGUAGE_MAP[language] ?? language;

    return (
        <MonacoEditor
            height="100%"
            width="100%"
            theme="vs-dark"
            language={resolvedLanguage}
            defaultValue="// Start coding here!"
            onChange={handleChange}
            onMount={handleEditorMount}
            options={{
                fontSize:14,
                fontFamily:
                "'Fira Code', 'Cascadia Code', Consolas, monospace",
                fontLigatures:true,
                minimap:{
                    enabled:true
                },
                scrollBeyondLastLine:false,
                wordWrap:"on",
                automaticLayout:true,
                tabSize:2,
                lineNumbers:"on",
                renderWhitespace:"selection",
                cursorBlinking:"smooth",
                smoothScrolling:true,
                padding:{
                    top:16
                }
            }}
        />
    );
};


export default Editor;