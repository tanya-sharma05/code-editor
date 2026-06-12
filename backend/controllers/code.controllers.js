import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const FREE_JUDGE0 = "https://ce.judge0.com";

// Correct IDs for ce.judge0.com (NOT the RapidAPI version)
// Source: https://ce.judge0.com/languages
const LANGUAGE_ID_MAP = {
    javascript: 63,   // Node.js 12.14.0
    typescript: 74,   // TypeScript 3.7.4
    python:     71,   // Python 3.8.1
    java:       62,   // Java OpenJDK 13
    cpp:        54,   // C++ GCC 9.2.0
    c:          50,   // C GCC 9.2.0
    csharp:     51,   // C# Mono 6.6.0
    go:         60,   // Go 1.13.5
    rust:       73,   // Rust 1.40.0
    ruby:       72,   // Ruby 2.7.0
    php:        68,   // PHP 7.4.1
    swift:      83,   // Swift 5.2.3
    kotlin:     78,   // Kotlin 1.3.70
    bash:       46,   // Bash 5.0.0
    sql:        82,   // SQLite 3.31.1
    // html, css, json, markdown → not executable, handled below
};

async function pollResult(token) {
    const MAX_ATTEMPTS = 15;
    let attempts = 0;
    let result;
    do {
        await new Promise((r) => setTimeout(r, 1000));
        const res = await axios.get(
            `${FREE_JUDGE0}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,message,status,time,memory`,
            { headers: { Accept: "application/json" } }
        );
        result = res.data;
        attempts++;
    } while (
        (result.status?.id === 1 || result.status?.id === 2) &&
        attempts < MAX_ATTEMPTS
    );
    return result;
}

async function runCode(req, res) {
    try {
        const { code, language } = req.body;

        if (!code?.trim()) {
            return res.status(400).json({ message: "No code provided." });
        }
        if (!language) {
            return res.status(400).json({ message: "No language specified." });
        }

        const languageId = LANGUAGE_ID_MAP[language];

        if (!languageId) {
            return res.status(200).json({
                stdout: null, stderr: null, compile_output: null,
                message: `"${language}" cannot be executed. Try JavaScript, Python, Java, C++, etc.`,
                status: { id: 0, description: "Not Executable" },
                time: null, memory: null,
            });
        }

        const submitRes = await axios.post(
            `${FREE_JUDGE0}/submissions?base64_encoded=false&wait=false`,
            {
                source_code: code,
                language_id: languageId,
                stdin: "",
                cpu_time_limit: 5,
                memory_limit: 128000,
            },
            { headers: { "Content-Type": "application/json", Accept: "application/json" } }
        );

        const token = submitRes.data?.token;
        if (!token) throw new Error("No token from Judge0.");

        const result = await pollResult(token);

        return res.status(200).json({
            stdout:         result.stdout         || null,
            stderr:         result.stderr         || null,
            compile_output: result.compile_output || null,
            message:        result.message        || null,
            status:         result.status,
            time:           result.time,
            memory:         result.memory,
        });

    } catch (error) {
        console.error("Code execution error:", error?.response?.data || error.message);
        return res.status(500).json({ message: "Code execution failed. Please try again." });
    }
}

export default runCode;