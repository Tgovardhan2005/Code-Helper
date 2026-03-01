import React, { useState } from 'react';
import axios from 'axios';
import { Terminal, AlertCircle } from 'lucide-react';
import ChatInput from './components/ChatInput.jsx';
import HintsBox from './components/HintsBox.jsx';
import LogicBox from './components/LogicBox.jsx';
import CodeViewer from './components/CodeViewer.jsx';
import Visualizer from './components/Visualizer.jsx';

// Example fallback data in case AI fails
const FALLBACK_DATA = {
  is_coding_problem: true,
  general_message: "", // Empty if is_coding_problem is true
  tier_1_hints: [
    "Are you sure you understand what the problem is asking?",
    "What data structures seem appropriate here?",
    "Could you break this down into smaller sub-problems?",
    "Think about how you would solve this by hand.",
    "Is there a way to optimize the space or time complexity?"
  ],
  tier_2_logic: {
    recommended_data_structures: ["Array", "Hash Map"],
    english_explanation: [
      "This problem requires us to iterate through the elements.",
      "We keep track of ones we've seen before using a structure with fast lookups.",
      "A Hash Map gives O(1) lookups making it ideal for this."
    ]
  },
  tier_3_code: {
    brute_force: {
      python: "# Brute force solution using O(N^2) time\n...",
      java: "// Brute force solution using O(N^2) time\n...",
      c: "// Brute force solution using O(N^2) time\n...",
      cpp: "// Brute force solution using O(N^2) time\n...",
      js: "// Brute force solution using O(N^2) time\n...",
    },
    optimal: {
      python: "# Optimal solution...",
      java: "// Optimal solution...",
      c: "// Optimal solution...",
      cpp: "// Optimal solution...",
      js: "// Optimal solution...",
    }
  },
  tier_4_visualization: {
    brute_force: {
      code_snippets: {
        python: "def brute(arr):\n  for i in range(len(arr)):\n    for j in range(i+1, len(arr)):\n      if arr[i] == arr[j]: return True\n  return False",
        java: "boolean brute(int[] arr) {\n  for(int i=0; i<arr.length; i++) {\n    for(int j=i+1; j<arr.length; j++) {\n      if(arr[i] == arr[j]) return true;\n    }\n  }\n  return false;\n}",
        c: "bool brute(int* arr, int n) {\n  for(int i=0; i<n; i++) {\n    for(int j=i+1; j<n; j++) {\n      if(arr[i] == arr[j]) return true;\n    }\n  }\n  return false;\n}",
        cpp: "bool brute(vector<int>& arr) {\n  for(int i=0; i<arr.size(); i++) {\n    for(int j=i+1; j<arr.size(); j++) {\n      if(arr[i] == arr[j]) return true;\n    }\n  }\n  return false;\n}",
        js: "function brute(arr) {\n  for(let i=0; i<arr.length; i++) {\n    for(let j=i+1; j<arr.length; j++) {\n      if(arr[i] === arr[j]) return true;\n    }\n  }\n  return false;\n}"
      },
      test_cases: [
        {
          input_label: "Input 1",
          input_str: "arr = [5, 2, 9, 1]",
          steps: [
            {
              description: "Comparing arr[0] and arr[1]",
              highlight_lines: { python: 4, java: 4, c: 4, cpp: 4, js: 4 },
              primary_array: [5, 2, 9, 1],
              pointers: { i: 0, j: 1 },
              variables: { found: false }
            },
            {
              description: "Comparing arr[0] and arr[2]",
              highlight_lines: { python: 4, java: 4, c: 4, cpp: 4, js: 4 },
              primary_array: [5, 2, 9, 1],
              pointers: { i: 0, j: 2 },
              variables: { found: false }
            }
          ]
        },
        {
          input_label: "Input 2 (Matrix)",
          input_str: "matrix = [[1,2],[3,4]]",
          steps: [
            {
              description: "Visiting matrix cell at row 0, col 1",
              highlight_lines: { python: 4, java: 4, c: 4, cpp: 4, js: 4 },
              primary_array: [],
              matrix: [[1, 2], [3, 4]],
              pointers: { "cur": [0, 1] },
              variables: { sum: 3 }
            },
            {
              description: "Visiting matrix cell at row 1, col 0",
              highlight_lines: { python: 5, java: 5, c: 5, cpp: 5, js: 5 },
              primary_array: [],
              matrix: [[1, 2], [3, 4]],
              pointers: { "cur": [1, 0] },
              variables: { sum: 6 }
            }
          ]
        },
        {
          input_label: "Input 3 (Tree)",
          input_str: "tree = [1, 2, 3]",
          steps: [
            {
              description: "Traversing Tree: At Root Node",
              highlight_lines: { python: 2, java: 2, c: 2, cpp: 2, js: 2 },
              primary_array: [],
              tree: { id: 'root', val: 1, left: { id: 'l1', val: 2 }, right: { id: 'r1', val: 3 } },
              pointers: { curr: 'root' },
              variables: { depth: 0 }
            },
            {
              description: "Going to left child",
              highlight_lines: { python: 3, java: 3, c: 3, cpp: 3, js: 3 },
              primary_array: [],
              tree: { id: 'root', val: 1, left: { id: 'l1', val: 2 }, right: { id: 'r1', val: 3 } },
              pointers: { curr: 'l1' },
              variables: { depth: 1 }
            }
          ]
        }
      ]
    },
    optimal: {
      code_snippets: {
        python: "def solve(arr):\n  seen = {}\n  for i in range(len(arr)):\n    seen[arr[i]] = i\n",
        java: "void solve(int[] arr) {\n  Map<Integer, Integer> map = new HashMap<>();\n  for(int i=0; i<arr.length; i++) {\n    map.put(arr[i], i);\n  }\n}",
        c: "void solve(int* arr, int n) {\n  for(int i=0; i<n; i++) {\n    // process mapping\n    hash_put(arr[i], i);\n  }\n}",
        cpp: "void solve(vector<int>& arr) {\n  unordered_map<int, int> map;\n  for(int i=0; i<arr.size(); i++) {\n    map[arr[i]] = i;\n  }\n}",
        js: "function solve(arr) {\n  const map = new Map();\n  for(let i=0; i<arr.length; i++) {\n    map.set(arr[i], i);\n  }\n}"
      },
      test_cases: [
        {
          input_label: "Input 1",
          input_str: "arr = [5, 2, 9, 1]",
          steps: [
            {
              description: "Pointer 'i' starts at index 0. We check if element is in the map.",
              highlight_lines: { python: 3, java: 3, c: 2, cpp: 3, js: 3 },
              primary_array: [5, 2, 9, 1],
              pointers: { i: 0 },
              variables: { current: 5 }
            },
            {
              description: "It's not in the map, so we add it.",
              highlight_lines: { python: 4, java: 4, c: 4, cpp: 4, js: 4 },
              primary_array: [5, 2, 9, 1],
              pointers: { i: 0 },
              variables: { current: 5, mapped_size: 1 }
            },
            {
              description: "Pointer 'i' moves to index 1.",
              highlight_lines: { python: 3, java: 3, c: 2, cpp: 3, js: 3 },
              primary_array: [5, 2, 9, 1],
              pointers: { i: 1 },
              variables: { current: 2, mapped_size: 1 }
            }
          ]
        },
        {
          input_label: "Input 2 (Adjacency List/Matrix)",
          input_str: "nodes = 3, edges = [[0,1], [1,2]]",
          steps: [
            {
              description: "Visiting initial node 0 using Matrix Adjacency representation",
              highlight_lines: { python: 3, java: 3, c: 2, cpp: 3, js: 3 },
              matrix: [[0, 1, 0], [1, 0, 1], [0, 1, 0]],
              pointers: { currRow: [0, 0] },
              variables: { visited: [0] }
            },
            {
              description: "Traversing edge to node 1",
              highlight_lines: { python: 4, java: 4, c: 4, cpp: 4, js: 4 },
              matrix: [[0, 1, 0], [1, 0, 1], [0, 1, 0]],
              pointers: { currRow: [1, 0] },
              variables: { visited: [0, 1] }
            }
          ]
        }
      ]
    }
  }
};

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Disclosure tiers: 1=Hints, 2=Logic, 3=Code, 4=Visualizer
  const [visibleTier, setVisibleTier] = useState(0);

  const handleSubmit = async (question) => {
    setLoading(true);
    setError(null);
    setData(null);
    setVisibleTier(0);

    try {
      const response = await axios.post('http://localhost:5000/api/solve', { question });
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        // Grab backend-provided error message natively (like Rate Limit warnings)
        setError(err.response.data.error);
      } else {
        setError("Failed to generate response. The AI servers might be down or your connection was interrupted. Please try again soon.");
      }
      setData(null);
    } finally {
      setLoading(false);
      setVisibleTier(1); // Auto-show first tier
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Terminal size={40} color="var(--primary)" />
          Code Helper
        </h1>
        <p className="subtitle">Progressive learning to master any coding challenge.</p>
      </header>

      <main>
        <ChatInput onSubmit={handleSubmit} isLoading={loading} />

        {error && (
          <div className="glass-panel" style={{ borderLeft: '4px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', margin: 0 }}>
              <AlertCircle size={20} />
              {error}
            </p>
          </div>
        )}

        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            <span style={{ marginLeft: '1rem', color: 'var(--primary)', fontWeight: 600 }} className="animate-pulse-glow">
              Analyzing problem with AI...
            </span>
          </div>
        )}

        {data && (
          <div style={{ marginTop: '2rem' }}>
            {data.is_coding_problem === false ? (
              <div className="glass-panel" style={{ borderLeft: '4px solid #f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '1.5rem', borderRadius: '8px' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#fcd34d', margin: 0, fontSize: '1.1rem' }}>
                  <AlertCircle size={24} />
                  {data.general_message || "I'm sorry, but I can only assist with coding problems, algorithms, and technical concepts."}
                </p>
              </div>
            ) : (
              <>
                {visibleTier >= 1 && (
                  <HintsBox
                    hints={data.tier_1_hints}
                    onShowMore={() => setVisibleTier(prev => Math.max(prev, 2))}
                  />
                )}

                {visibleTier >= 2 && (
                  <LogicBox
                    logicData={data.tier_2_logic}
                    onShowMore={() => setVisibleTier(prev => Math.max(prev, 3))}
                  />
                )}

                {visibleTier >= 3 && (
                  <CodeViewer
                    codeData={data.tier_3_code}
                    onShowMore={() => setVisibleTier(prev => Math.max(prev, 4))}
                  />
                )}

                {visibleTier >= 4 && (
                  <Visualizer
                    vizData={data.tier_4_visualization}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
