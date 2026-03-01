# Code Helper - AI Logic Visualizer

**Code Helper** is an advanced interactive tool designed to break down and visualize complex coding problems and data structures autonomously using Generative AI (Google Gemini 2.5). 

Rather than just receiving blocks of code as answers, this application intelligently analyzes Data Structures and Algorithms (DSA) questions and maps out the complete execution trace, creating step-by-step native web visualizations for Arrays, Matrices, and Abstract syntax/recursive trees.

![Code Helper Visualizer Demo Placeholder](https://via.placeholder.com/800x400?text=Code+Helper+Visualization+Engine)

## 🚀 Key Features
- **Dynamic 2D Visualizer Engine:** Natively renders arrays, matrices, and recursive trees in real-time, mapping exact pointers and variable tracking states frame-by-frame.
- **Progressive Disclosure Learning:** Follows an educational journey rather than just giving answers away:
  - Phase 1: Contextual Hints
  - Phase 2: Logic Walkthrough
  - Phase 3: Raw Implementation (C, C++, Java, JS, Python)
  - Phase 4: Full Interactive Execution Trace Visualizer
- **Multi-Algorithm Support:** Gemini AI breaks down answers into both Brute Force and Optimal approaches, rendering separate code and visual paths for each.
- **Glassmorphism UI:** Stunning responsive design, custom dynamic flex-grid visuals, and fluid `framer-motion` animations.

## 🛠 Tech Stack
- **Frontend Layer:** React.js, Vite, Framer Motion, Vanilla Animations, React Syntax Highlighter, Lucide React icons.
- **Backend API:** Node.js, Express.js.
- **AI Core Processing:** `@google/genai` (Google Gemini 2.5 Flash SDK) customized with highly-structured Tier-Response system prompts.
- **Database:** MongoDB (via Mongoose) to track saved hints/problems locally.

## ⚙️ Local Development Setup

### 1. Requirements
- Node.js `v18+`
- MongoDB local or Atlas Cloud Instance
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Backend Setup
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

### 3. Frontend Setup
Open a new terminal session.
```bash
cd client
npm install
npm run dev
```

### 4. Running the App
Navigate to `http://localhost:5173` in your browser. Type in any LeetCode problem or general programming concept (e.g., "Merge Sort", "Two Sum", or "Print a tree level order") and watch the AI seamlessly map the execution!

---

**Note on Graph API Visualizations:** As of the latest stable build, algorithmic `Graphs` are projected automatically into Adjacency Matrices natively to avoid recursive physics-clipping engine issues!
