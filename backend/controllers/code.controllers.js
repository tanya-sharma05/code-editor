import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const JUDGE0 = "https://ce.judge0.com";

const LANGUAGE_ID_MAP = {
    javascript: 63,  
    typescript: 74, 
    python: 71,  
    java: 62,  
    cpp: 54,   
    c: 50,  
    csharp: 51,   
    go: 60,   
    rust: 73, 
    ruby: 72,  
    php: 68,  
    swift: 83, 
    kotlin: 78,  
    bash: 46, 
    sql: 82,
};

async function pollResult(token) {
    const MAX_ATTEMPTS = 15;
    let attempts = 0;
    let result;
    do {
        await new Promise((r) => setTimeout(r, 1000));
        const res = await axios.get(`${JUDGE0}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,message,status,time,memory`,
            {headers: {Accept: "application/json"}}
        );
        result = res.data;
        attempts++;
    } 
    while (
        (result.status?.id === 1 || result.status?.id === 2) && attempts < MAX_ATTEMPTS
    );
    return result;
}


async function runCode(req, res) {
    try {
        const {code, language} = req.body;

        if(!code?.trim()) {
            return res.status(400).json({message: "No code provided"});
        }
        if(!language) {
            return res.status(400).json({message: "No language specified"});
        }

        const languageId = LANGUAGE_ID_MAP[language];

        if(!languageId) {
            return res.status(200).json({
                stdout: null, stderr: null, compile_output: null,
                message: `"${language}" cannot be executed. Try JavaScript, Python, Java, C++, etc.`,
                status: {id: 0, description: "Not Executable"},
                time: null, memory: null,
            });
        }

        const submitRes = await axios.post(`${JUDGE0}/submissions?base64_encoded=false&wait=false`, {
                source_code: code,
                language_id: languageId,
                stdin: "",
                cpu_time_limit: 5,
                memory_limit: 128000,
            },
            { 
                headers: {"Content-Type": "application/json",
                Accept: "application/json" } 
            }
        );

        const token = submitRes.data?.token;
        if(!token) throw new Error("No token from Judge0");

        const result = await pollResult(token);

        return res.status(200).json({
            stdout: result.stdout || null,
            stderr: result.stderr || null,
            compile_output: result.compile_output || null,
            message: result.message || null,
            status: result.status,
            time: result.time,
            memory: result.memory,
        });
    } 
    catch(error) {
        console.error("Code execution error:", error?.response?.data || error.message);
        return res.status(500).json({message: "Code execution failed. Please try again"});
    }
}

export default runCode;