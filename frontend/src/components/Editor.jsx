import { useRef } from "react";
import MonacoEditor from "@monaco-editor/react";

const Editor = ({
    // socketRef,
    documentId, onCodeChange, language = "javascript"
}) => {

    const handleChange = (value) => {
        //onCodeChange(value);
    };

    const handleEditorMount=(editor,monaco)=>{
        console.log(
            "Editor loaded"
        );
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