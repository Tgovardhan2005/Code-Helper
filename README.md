<h1 align="center">✨ Code Helper ✨<br><sub>AI-Powered DSA Logic Visualizer</sub></h1>

<p align="center">
  <img alt="Code Helper Demo Logo" src="https://via.placeholder.com/1000x500/0f172a/38bdf8?text=%E2%9C%A8+Code+Helper:+Interactive+Execution+Engine+%E2%9C%A8" width="100%">
</p>

<p align="center">
  <b>Code Helper</b> is an advanced interactive educational tool designed to break down and visualize complex coding problems and data structures autonomously using Generative AI (Google Gemini 2.5 Flash).
</p>

<hr>

## 📸 Screenshots

### 1. 🤖 AI Problem Analysis & Progressive Hints
*(Place screenshot of the main query input and Phase 1 Contextual Hints here)*
<img src="https://via.placeholder.com/800x400/1e293b/94a3b8?text=Screenshot:+Main+Input+and+Hints" width="800">

### 2. 🧩 Multi-Language Code Implementations
*(Place screenshot of Step 3 Code Viewer with C++, Java, JS, Python tabs here)*
<img src="https://via.placeholder.com/800x400/1e293b/94a3b8?text=Screenshot:+Multi-Language+Code+Selector" width="800">

### 3. 🎥 Interactive Execution Trace & 2D Animations
*(Place screenshot of Step 4 Interactive Web Visualizer with arrays/matrices floating here)*
<img src="https://via.placeholder.com/800x400/1e293b/94a3b8?text=Screenshot:+Tree/Matrix/Array+Animations" width="800">

---

## 🚀 Key Features
- 🎨 **Dynamic 2D Visualizer Engine:** Natively renders bounding boxes, matrices, and recursive trees using Framer Motion. Traces live variable pointer values mapped directly to specific elements frame-by-frame.
- 🎓 **Progressive Disclosure Learning:** Code Helper maps an educational journey rather than just giving answers away:
  - 🔍 **Phase 1:** Contextual Hints
  - 🧠 **Phase 2:** Logic Walkthrough
  - 💻 **Phase 3:** Raw Implementation (C, C++, Java, JS, Python)
  - 🎬 **Phase 4:** Full Interactive Execution Trace Visualizer
- ⚡ **Multi-Algorithm Support:** The AI breaks down answers into both **Brute Force** and **Optimal** approaches, rendering separate code traces and animated paths for each strategy!
- 🔮 **Glassmorphism Aesthetic:** A stunning responsive design, deep space UI with blurred accents, custom flex-grid visuals, and fluid `framer-motion` animations.

---

## 🛠 Tech Stack
- **Frontend Layer:** React.js, Vite ⚡, Framer Motion 🎥, React Syntax Highlighter ✨, Lucide React icons.
- **Backend API:** Node.js 🟩, Express.js.
- **AI Core Processing:** `@google/genai` (Google Gemini 2.5 Flash SDK) customized with highly-structured Tier-Response system prompts.
- **Database:** MongoDB 🍃 (via Mongoose) to track saved hints/problems locally.

---

## ⚙️ Local Development Setup

### 1️⃣ Requirements
- `Node.js v18+`
- MongoDB local instance or Atlas Cloud
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2️⃣ Backend Setup
Navigate into the server repository and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coding-doubt-solver
GEMINI_API_KEY=your_gemini_api_key_here
```
Run the Node server:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
Open a new terminal session.
```bash
cd client
npm install
npm run dev
```

### 4️⃣ Running the App
Go to `http://localhost:5173` in your browser. Type in any LeetCode problem or general programming concept (e.g., *"Merge Sort"*, *"Two Sum"*, or *"Level Order Tree Traversal"*) and watch the AI seamlessly map the execution!

---

*📝 Note on Graph Visualizations: Algorithmic `Graphs` are projected automatically into Adjacency Matrices using the Matrix renderer to avoid recursive physics-clipping layout issues!*
