# Annamalai University — Student Experiment Report Portal

A professional, production-quality web application that reads student experiment data from CSV files and provides a clean academic portal for viewing experiment marks by roll number.

---

## Tech Stack

| Tool | Version |
|---|---|
| React | 18 |
| TypeScript | 5 |
| Vite | 5 |
| Tailwind CSS | v4 |
| PapaParse | 5 |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Output is written to `dist/`. Preview the build with:

```bash
npm run preview
```

---

## CSV Data

All student data is read from CSV files in the `reports/` directory:

| File | Purpose |
|---|---|
| `exercise_grading.csv` | Per-experiment marks (primary marks data) |
| `final_summary.csv` | Total marks and evaluation status per student |
| `repository_check.csv` | GitHub repository verification status |
| `username_check.csv` | GitHub username verification status |
| `file_grading.csv` | Detailed per-file grading (supplementary) |
| `process_log.csv` | Processing audit log (not used in UI) |

### Adding New CSV Files

New CSV files with the same column structure can be added to `reports/` without any code changes.
The app uses `import.meta.glob('/reports/*.csv', ...)` which automatically picks up all CSV files at build time.

### Changing CSV Column Names

If CSV column names change, edit **only** `src/utils/csvNormalizer.ts`.
The `COL` constant at the top of that file maps all CSV headers.
React components depend only on the normalized types in `src/types/student.ts`.

---

## URL Deep Linking

A student's result can be shared directly using:

```
http://localhost:5173/?roll=421125106001
```

When the page loads with `?roll=` in the URL, it automatically searches for that student.

---

## Project Structure

```
src/
├── components/          # React UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SearchForm.tsx
│   ├── StudentProfile.tsx
│   ├── GitHubStatus.tsx
│   ├── RepositoryStatus.tsx
│   ├── ExperimentMarksTable.tsx
│   ├── StatusBadge.tsx
│   ├── LoadingState.tsx
│   ├── EmptyState.tsx
│   └── ErrorState.tsx
├── services/
│   ├── csvService.ts    # CSV loading & search
│   └── githubService.ts # GitHub API interface
├── hooks/
│   └── useStudentData.ts
├── types/
│   └── student.ts       # All TypeScript interfaces
├── utils/
│   ├── csvNormalizer.ts # CSV → internal model (column names live here)
│   └── markCalculator.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## Test Roll Numbers

| Roll Number | Expected Result |
|---|---|
| `421125106001` | ABISHEK P — Evaluated, marks visible |
| `421125106002` | ABISHEK R — Repository not found, marks unavailable |
| `421125106004` | AKNEESWARAN V — Evaluated |
| `999999999999` | Student not found |

---

## Security Notes

- No private keys or tokens are embedded in the frontend.
- All data is sourced from pre-verified CSV files.
- User input (roll number) is trimmed and normalized before lookup.
- Raw CSV values are never injected as HTML.
- External links use `rel="noopener noreferrer"`.

---

## Accessibility

- Semantic HTML with ARIA roles and labels
- Keyboard-navigable search form
- Visible focus rings on all interactive elements
- `aria-live` regions for search results
- Status not communicated by color alone (icons + text)
- Skip-to-main-content link

---

## Deployment to GitHub Pages

### 1. Repository Name
The recommended GitHub repository name is **`ifet-dslab-report`**.

If you name your repository `ifet-dslab-report`, your portal URL will be:
```text
https://<your-github-username>.github.io/ifet-dslab-report/
```

> **Note:** If you choose a different repo name (e.g. `my-portal`), update `base: '/my-portal/'` in [`vite.config.ts`](file:///home/user/ifet_github_check_mark/vite.config.ts).

---

### 2. Push to GitHub

Initialize git and push to your new repository:

```bash
git init
git add .
git commit -m "feat: complete student experiment report portal"
git branch -M main
git remote add origin https://github.com/<your-github-username>/ifet-dslab-report.git
git push -u origin main
```

---

### 3. Enable GitHub Pages

1. Go to your GitHub repository in your browser: `https://github.com/<your-github-username>/ifet-dslab-report`
2. Navigate to **Settings** > **Pages** (in the left sidebar)
3. Under **Build and deployment** > **Source**, select **GitHub Actions**
4. The included `.github/workflows/deploy.yml` workflow will automatically trigger, build the application, and publish your site!

