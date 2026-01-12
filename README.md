# Java Quiz (Local Web App)

This repository contains a small static web app for Java/Vue quiz questions.

Run locally:

- Open `index.html` in your browser (double-click) or serve via a local web server.


Using Python 3 built-in server (Windows PowerShell):

```powershell
cd c:\Users\kaiwen\dev\java-quiz
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Using VS Code: install "Live Server" extension and click "Go Live".

This project can also be run as a React app (Vite). To run locally with Node.js/npm:

```powershell
cd c:\Users\kaiwen\dev\java-quiz
npm install
npm run dev
# then open the address shown by Vite, usually http://localhost:5173
```

To initialize git and create the initial commit (already done in this repo):

```powershell
git init
git add .
git commit -m "Initial commit"
```

If you want to push to GitHub, create a repo on GitHub and run:

```powershell
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

If you want more questions, see `questions.json` and `java-questions.json`.
