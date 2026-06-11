import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function explainCode(req, res) {
    try {
        const {code} = req.body;
        if(!code) {
            return res.status(400).json({ message: 'Code snippet is required' });
        }

        const prompt = `Analyze the following code snippet. Your response MUST be a single, raw JSON object and nothing else.
            Do NOT include any explanatory text, markdown formatting, or backticks.

            The JSON object must have the following structure:
            - "hasError": A boolean value, 'true' if you find bugs or syntax errors, otherwise 'false'.
            - "errorAnalysis": A string explaining the bug. If no bug, this should be an empty string.
            - "correctedCode": A string containing the corrected code. If no bug, this should be an empty string.
            - "explanation": A string (in markdown format) explaining what the code does.
            - "keyConcepts": An array of strings, with each string being a key concept found in the code.

            Example of a response for code with an error:
            {"hasError": true, "errorAnalysis": "The function 'myFunc' is called but never defined.", "correctedCode": "function myFunc() {\\n  console.log('Corrected');\\n}", "explanation": "This Javascript code defines and calls a function named 'myFunc'.", "keyConcepts": ["function", "console.log"]}
            
            Example of a response for code with no error:
            {"hasError": false, "errorAnalysis": "", "correctedCode": "", "explanation": "This Javascript code correctly logs a message to the console.", "keyConcepts": ["console.log"]}

            Analyze this code:
            ${code}
        `;

        const response = await genAI.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [{parts: [{text: prompt}]}],
        });

        const rawText = response.text;
        const jsonStartIndex = rawText.indexOf('{');
        const jsonEndIndex = rawText.lastIndexOf('}');

        if(jsonStartIndex === -1 || jsonEndIndex === -1) {
            throw new Error("AI response did not contain a valid JSON object.");
        }

        const jsonString = rawText.substring(jsonStartIndex, jsonEndIndex + 1);

        res.status(200).json(JSON.parse(jsonString));
    } 
    catch (error) {
        console.error('AI API Error:', error);
        res.status(500).json({ message: "Sorry, can't get explanation from AI" });
    }
}

export default explainCode;