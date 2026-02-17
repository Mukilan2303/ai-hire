# HireMind AI - Intelligent Hiring Platform

An AI-powered recruitment platform that analyzes candidate resumes against specific job requirements and provides intelligent rankings, insights, and recommendations.

## 🚀 Features

### ✅ Job-Specific Candidate Analysis
- Select a job position from your active postings
- Upload candidate resumes (PDF/DOCX)
- Get candidates ranked based on job-specific requirements
- Match scores calculated using:
  - **60% Skills Match** - Comparison against required job skills
  - **40% Experience Match** - Years of experience vs. requirements

### ✅ AI-Powered Insights
- Real-time candidate analysis
- Skills gap identification
- Success probability prediction
- Risk assessment (Low/Medium/High)
- Hidden talent detection

### ✅ Bias Monitoring
- Diversity scorecard with 5 key metrics
- Active bias alerts
- Skill diversity analysis
- Experience distribution tracking

### ✅ AI Copilot
- Intelligent chat interface
- Answers questions about candidates
- Compares candidates for specific roles
- Generates personalized interview questions
- Provides hiring recommendations

### ✅ Interview Questions Generator
- 14 personalized questions per candidate
- Technical, behavioral, and scenario-based questions
- Based on candidate's actual skills
- Copy-to-clipboard functionality

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **State Management:** React Context API

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Mukilan2303/ai-hire.git
cd ai-hire
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 How to Use

### 1. Select a Job Position
- Navigate to **Candidates** page
- Choose a job from the dropdown (e.g., "Senior ML Engineer")
- View job requirements (skills, experience, education)

### 2. Upload Resumes
- Drag & drop PDF/DOCX files or click "Browse Files"
- Resumes are automatically associated with the selected job
- System parses candidate skills and experience

### 3. Analyze Candidates
- Click **"Analyze Candidates"** button
- AI evaluates each candidate against job requirements
- View ranked results with match scores

### 4. Review Rankings
- See candidates ranked by match score
- View strengths and gaps for each candidate
- Click on candidates to see detailed profiles
- Generate personalized interview questions

## 📊 Match Score Algorithm

**Example: Senior ML Engineer**

**Required Skills:** Python, TensorFlow, PyTorch, MLOps, AWS

**Candidate A:**
- Skills: Python, TensorFlow, Docker (3/5 skills)
- Experience: 5 years
- **Match Score:** 76%
- **Gaps:** Missing MLOps, AWS

**Candidate B:**
- Skills: Python, TensorFlow, PyTorch, MLOps, AWS (5/5 skills)
- Experience: 7 years
- **Match Score:** 100%
- **Gaps:** None

## 🗂️ Project Structure

```
ai-hire/
├── app/
│   ├── dashboard/
│   │   ├── candidates/      # Candidate upload & analysis
│   │   ├── insights/        # AI insights dashboard
│   │   ├── bias/           # Bias monitoring
│   │   ├── copilot/        # AI chat interface
│   │   └── jobs/           # Job postings management
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/          # Dashboard components
│   └── ui/                 # Shadcn UI components
├── lib/
│   ├── store.tsx           # Global state management
│   ├── job-matcher.ts      # Job matching algorithm
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## 🔑 Key Components

### Job Matcher Algorithm
Located in `lib/job-matcher.ts`
- Compares candidate skills vs. job requirements
- Calculates weighted match scores
- Generates strengths and gaps
- Assesses risk levels

### Global State
Located in `lib/store.tsx`
- Manages jobs, candidates, and activities
- Handles job selection
- Filters candidates by job
- Provides helper functions

### Candidates Page
Located in `app/dashboard/candidates/page.tsx`
- Job selector dropdown
- Resume upload interface
- Candidate ranking table
- Analysis controls

## 🎨 Features Showcase

### Dashboard
- Overview of all active jobs
- Candidate statistics
- Recent activity feed
- Quick access to all features

### AI Insights
- Top candidate highlights
- Pipeline health metrics
- Skills gap analysis
- Candidate funnel visualization
- Top skills distribution

### Bias Monitor
- Diversity scorecard
- Active bias alerts
- Skill concentration tracking
- Score distribution analysis

### AI Copilot
- Natural language queries
- Candidate comparisons
- Ranking explanations
- Interview question generation
- Hiring recommendations

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] Database persistence
- [ ] Real AI/ML model integration
- [ ] User authentication
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Advanced analytics
- [ ] Export reports (PDF/Excel)

## 📝 License

MIT License

## 👤 Author

**Mukilan K**
- GitHub: [@Mukilan2303](https://github.com/Mukilan2303)

## 🙏 Acknowledgments

- Built with Next.js and TypeScript
- UI components from Shadcn UI
- Icons from Lucide React

---

**Note:** This is a frontend demo application. Resume parsing and AI analysis are currently simulated. For production use, integrate with actual AI/ML services and backend infrastructure.
