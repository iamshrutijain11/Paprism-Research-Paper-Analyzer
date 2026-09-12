# Paprism — AI-Powered Research Paper Simplifier
> **Tagline:** Read. Refract. Reveal.  
> **Project Domain:** Artificial Intelligence, NLP, RAG, Full-Stack Web Development  
> **Project Type:** B.Tech 3rd Year Mini Project

---

## 🌟 Overview
**Paprism** is an intelligent web application designed to help students, researchers, and educators understand complex academic papers through:
1. **Multi-Level Summaries**: Beginner (analogies), Intermediate, and Technical views.
2. **Grounded RAG Assistant**: Document-specific Q&A backed by ChromaDB with clickable `Sources: Page X` citations.
3. **Active Recall Quizzes**: AI-generated multiple-choice questions with instant scoring and explanations.
4. **3D Flip Flashcards**: Interactive memory cards linked to paper coordinates.
5. **Creative Interactive UI**: 3D Curved Dome Gallery, Flowing Velocity Menu, Splash Cursor, and Pixel Transitions.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Tailwind CSS, Framer Motion, Lucide React, Axios, React Router v6, Vite
- **Design System**: Editorial Academic Minimalist (`#F7FBF9`, `#C8F3E4`, `#00A878`, `#003F36`)
- **Typography**: `DM Sans` (Display headings) & `Inter` (Body text)
- **Backend / AI (Architecture)**: Node.js, Express, Python FastAPI, PyMuPDF, ChromaDB, Groq Llama 3 70B

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps to Run:
1. Open a terminal in this directory:
   ```bash
   cd frontend
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure
```
src/
├── components/
│   ├── Sidebar.jsx              # 250px Dark Teal navigation
│   ├── Navbar.jsx               # Top header with search & user avatar
│   ├── UploadZone.jsx           # Drag & drop upload with multi-stage progress
│   ├── FloatingPaperCard.jsx    # Weightless floating paper cards
│   ├── AIChatPanel.jsx          # Glassmorphic RAG assistant with source jumping
│   ├── SummaryView.jsx          # Multi-level summary & 01-04 structured breakdown
│   ├── FlashcardCard.jsx        # 3D interactive flip card
│   ├── QuizComponent.jsx        # MCQ exam engine with score calculation
│   ├── KeywordsCloud.jsx        # Extracted research entities
│   ├── EmptyState.jsx           # Custom empty state with ripple pattern
│   └── creative/
│       ├── SplashCursor.jsx     # Fluid mint/emerald particle trail canvas
│       ├── FlowingMenu.jsx      # Velocity ribbon menu with hover previews
│       ├── DomeGallery.jsx      # 3D cylindrical curved paper dome
│       └── PixelTransition.jsx  # Matrix grid pixel transition
├── pages/
│   ├── Landing.jsx              # Complete website homepage & hero
│   ├── Login.jsx                # Split auth sign in
│   ├── Signup.jsx               # Split auth registration
│   ├── Dashboard.jsx            # User workspace & recent papers
│   ├── Papers.jsx               # Research paper repository
│   ├── PaperWorkspace.jsx       # 3-column full-screen research environment
│   ├── Summary.jsx              # Dedicated editorial summary view
│   ├── Chat.jsx                 # Full-page conversational RAG chat
│   ├── Flashcards.jsx           # Interactive flashcard deck
│   ├── Quiz.jsx                 # Comprehension examination room
│   ├── Profile.jsx              # Study analytics & pipeline status
│   └── Settings.jsx             # LLM model selector & RAG parameters
├── context/
│   └── UserContext.jsx          # Global state, auth, papers, and citation sync
├── hooks/
│   └── usePaper.js              # Custom hook for paper actions & RAG queries
├── services/
│   └── api.js                   # Axios client + offline mock database
├── App.jsx                      # Router & global splash cursor
├── index.css                    # Design tokens & custom scrollbars
└── main.jsx                     # DOM mount point
```

---

## 📄 License
Academic and Educational Use — B.Tech 3rd Year Mini Project 2026.
