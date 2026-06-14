import { useRef } from "react";
import MonacoEditor from "@monaco-editor/react";

const Editor = ({socketRef, documentId, onCodeChange, language = "javascript"
}) => {
    const isRemote = useRef(false);

    // Runs whenever user changes something inside Monaco editor like typing, deleting, etc.
    const handleChange = (value) => {
        // if change is coming from another user through socket then don't send it back
        if(isRemote.current) return;

        // update local react state
        onCodeChange(value);

        if(socketRef.current){
            // send current code changes to backend
            socketRef.current.emit("send-changes", {
                    documentId,
                    content: value
                }
            );
        }
    };

    // This function runs when Monaco Editor is successfully mounted/loaded
    // editor -> Monaco editor instance
    // monaco -> Monaco library object
    const handleEditorMount=(editor,monaco)=>{
        // Create a global function on window object to get currently highlighted code from Monaco editor
        window.getSelectedCode = () => {
            const selection = editor.getSelection();
            if(!selection){
                return "";
            }
            // Get complete editor content then extract only selected range
            return editor
                .getModel()
                .getValueInRange(selection);
        };

        // Create a global function named getEditorValue. 
        // Whenever somebody calls it, return Monaco's latest code. If Monaco gives nothing, return empty string
        window.getEditorValue = () => editor.getValue() ?? '';

        if(socketRef.current){
            // Listen for code updates coming from OTHER users
            socketRef.current.on("receive-changes",
                (content)=>{
                    isRemote.current=true;

                    if(editor.getValue() !== content){
                        // Replace editor content with latest received code
                        editor.setValue(
                            content || ""
                        );
                    }
                    // Remote update finished
                    // Allow user's own typing again
                    isRemote.current=false;
                }
            );
        }
        
        editor.focus();
    };

    return (
        <MonacoEditor
            height="100%"
            width="100%"
            theme="vs-dark"
            language={language}
            defaultValue=""
            onChange={handleChange}
            onMount={handleEditorMount}
            options={{
                fontSize:14,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
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