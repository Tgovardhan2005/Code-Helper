<h1 align="center">✨ Code Helper ✨<br><sub>AI-Powered DSA Logic Visualizer</sub></h1>

<p align="center">
  <b>Code Helper</b> is an advanced interactive educational tool designed to break down and visualize complex coding problems and data structures autonomously using Generative AI (Google Gemini 2.5 Flash).
</p>

## 📸 Screenshots

### 1. 🤖 AI Problem Analysis & Progressive Hints

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a01199f2-f467-42d3-b3df-00b9f8b77008" />


### 2. 🧩 Multi-Language Code Implementations

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d528c2f0-1eac-4b26-adcb-93259394b2d7" />


### 3. 🎥 Interactive Execution Trace & 2D Animations

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4937592f-2cb7-40ef-904e-53fa3442fc29" />



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
