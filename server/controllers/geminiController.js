import { GoogleGenAI } from '@google/genai';

let genai;
if (process.env.GEMINI_API_KEY) {
  genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}


const GEMINI_SYSTEM_PROMPT = `You are an expert, highly encouraging coding tutor. A user will provide a coding problem or a piece of buggy code. Your job is to break down the solution into progressive learning steps.

CRITICAL: First, evaluate if the user's input is a valid coding problem, algorithm discussion, or technical logic issue. If the input is casual greeting, unrelated general knowledge, or conversational, set "is_coding_problem" to false, provide a polite "general_message", and leave the rest of the fields empty or minimal.

You must analyze the problem and respond ONLY with a valid JSON object. Do not include markdown code block formatting like \`\`\`json in your response. The JSON must strictly follow this structure:

{
  "is_coding_problem": true,
  "general_message": "String (Only used if is_coding_problem is false. Explain kindly that you only assist with coding problems and algorithmic concepts, and cannot help with general knowledge or unrelated casual conversation. If true, leave empty.)",
  "tier_1_hints": [
    "Provide hint 1 to nudge them in the right direction without revealing the answer.",
    "Provide hint 2 building on hint 1.",
    "Provide hint 3 about edge cases.",
    "Provide hint 4.",
    "Provide hint 5."
  ],
  "tier_2_logic": {
    "recommended_data_structures": ["Name of DS 1", "Name of DS 2"],
    "english_explanation": [
      "Point 1 explaining the logic. MUST be extremely short (1-2 sentences max).",
      "Point 2 explaining the next step. Keep it brief and punchy.",
      "Point 3... (Break long paragraphs down into 5 to 6 concise bullet points instead of a wall of text)"
    ]
  },
  "tier_3_code": {
    "brute_force": {
      "python": "Write the brute force code in Python.",
      "java": "Write the brute force code in Java.",
      "c": "Write the brute force code in C.",
      "cpp": "Write the brute force code in C++.",
      "js": "Write the brute force code in JavaScript."
    },
    "optimal": {
      "python": "Write the optimal code in Python.",
      "java": "Write the optimal code in Java.",
      "c": "Write the optimal code in C.",
      "cpp": "Write the optimal code in C++.",
      "js": "Write the optimal code in JavaScript."
    }
  },
  "tier_4_visualization": {
    "brute_force": {
      "code_snippets": {
        "python": "def brute_solve()...",
        "java": "void brute_solve()...",
        "c": "void brute_solve()...",
        "cpp": "void brute_solve()...",
        "js": "function brute_solve()..."
      },
      "test_cases": [
        {
          "input_label": "Input 1",
          "input_str": "arr = [0, 1, 0, 3, 12]",
          "steps": [
            {
              "description": "Describe brute force step.",
              "highlight_lines": {"python": 2, "java": 3, "c": 3, "cpp": 3, "js": 2},
              "primary_array": [0, 1, 0, 3, 12],
              "matrix": null,
              "tree": null,
              "graph": null,
              "pointers": {"i": 0, "j": 1},
              "variables": {"temp": 0}
            }
          ]
        },
        {
          "input_label": "Input 2 (Edge Case)",
          "input_str": "arr = [0, 0, 0]",
          "steps": []
        },
        {
          "input_label": "Input 3",
          "input_str": "arr = [1, 2, 3]",
          "steps": []
        }
      ]
    },
    "optimal": {
      "code_snippets": {
        "python": "def optimal_solve()...",
        "java": "void optimal_solve()...",
        "c": "void optimal_solve()...",
        "cpp": "void optimal_solve()...",
        "js": "function optimal_solve()..."
      },
      "test_cases": [
        {
          "input_label": "Input 1",
          "input_str": "Provide string representation of input",
          "steps": [
            {
              "description": "Describe optimal step.",
              "highlight_lines": {"python": 2, "java": 3, "c": 3, "cpp": 3, "js": 2},
              "primary_array": [0, 1, 0, 3, 12],
              "matrix": [[1, 2], [3, 4]],
              "tree": {"id": "root", "val": 1, "left": {"id": "l", "val": 2, "left": null, "right": null}, "right": null},
              "pointers": {"readPos": 0, "writePos": 0},
              "variables": {"temp": 0}
            }
          ]
        },
        {
          "input_label": "Input 2",
          "input_str": "...",
          "steps": []
        },
        {
          "input_label": "Input 3",
          "input_str": "...",
          "steps": []
        }
      ]
    }
  }
}

Use ONLY ONE of data structures per step (e.g. if it's a matrix problem, provide "matrix" and set primary_array, tree to null). For graph problems, simply model them using "matrix" (adjacency matrix) or "primary_array" (adjacency list visualization). Ensure tree nodes have unique string "id" fields if you use them.`;

export const solveDoubt = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!genai) {
      console.warn("GEMINI_API_KEY not configured. Please add it to .env");
      return res.status(503).json({ error: 'AI capabilities currently disabled' });
    }

    // Call Gemini API
    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: GEMINI_SYSTEM_PROMPT,
        responseMimeType: "application/json",
      }
    });

    const rawText = response.text;

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", rawText);
      return res.status(500).json({ error: 'Failed to process AI response' });
    }

    // Attempt to save to database if available
    try {
      const Session = (await import('../models/Session.js')).default;
      const newSession = new Session({
        question,
        geminiResponse: parsedResponse
      });
      await newSession.save();
    } catch (dbError) {
      console.error("Warning: Failed to save to MongoDB", dbError.message);
      // We still return the response to the user even if DB fails
    }

    return res.json({ data: parsedResponse });

  } catch (error) {
    console.error('Gemini API Error:', error.message || error);
    if (error.status === 429) {
      return res.status(429).json({ error: 'Google Gemini API Rate Limit Exceeded: You have run out of free quota. Please wait a few moments before trying again, or upgrade your API key.' });
    }
    res.status(500).json({ error: 'Failed to generate solution from AI. Please try again later.' });
  }
};
