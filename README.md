# AI-Powered 360° Feedback System for Government News in Regional Media

## 📌 Project Overview

This system automatically collects news from regional media (websites, e-papers, YouTube), processes multiple Indian languages, performs sentiment analysis and department tagging, translates if needed, and displays results in a real-time dashboard. Alerts are sent for negative news, and an admin panel allows review of flagged items.

---

## 👥 Team Collaboration Guide

### 1. Branching Strategy (Git)

* **`main` branch**: Always stable, production-ready code.
* **Feature branches**: Each member creates their own branch for a new feature or bug fix.
  Example:

  ```
  git checkout -b feature/news-scraper
  ```
* **Pull Requests (PRs)**: Before merging into `main`, create a PR for review by at least 1 teammate.

---

### 2. Roles & Responsibilities

| Member       | Role                     | Example Tasks                                                                          |
| ------------ | ------------------------ | -------------------------------------------------------------------------------------- |
| **Member 1** | **Backend & Scraping**   | FastAPI setup, PostgreSQL integration, news scraping scripts                           |
| **Member 2** | **AI/ML Processing**     | Language detection, translation pipeline, sentiment & department classification models |
| **Member 3** | **Frontend & Dashboard** | React dashboard, Tailwind styling, charts, filters, admin panel                        |

*(Members can help each other, but lead their assigned parts.)*

---

### 3. How to Make Code Changes

1. **Update your branch** before starting work:

   ```
   git pull origin main
   ```
2. **Make changes** in your local branch.
3. **Test your code** to ensure nothing breaks.
4. **Commit with clear messages**:

   ```
   git commit -m "Added sentiment analysis pipeline"
   ```
5. **Push changes**:

   ```
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** on GitHub and request review.

---

### 4. Code Standards

* **Backend**: Follow PEP8 for Python.
* **Frontend**: Use consistent Tailwind classes & React functional components.
* **Comments**: Write docstrings for functions/classes, comment tricky logic.
* **Naming**: Use descriptive variable/function names.

---

### 5. Communication & Task Updates

* Use our **project tracker** (Trello/Jira/Google Sheet) to assign and update tasks.
* Discuss major changes before implementation in our **team group chat**.
* Commit often, but keep commits small and focused.

---

### 6. Testing Before Merging

* Run **backend**:

  ```
  uvicorn main:app --reload
  ```
* Run **frontend**:

  ```
  npm start
  ```
* Ensure new changes **don’t break existing features**.

---

### 7. Common Commands

**Clone repo**

```
git clone <repo_url>
```

**Create new branch**

```
git checkout -b feature/your-feature-name
```

**Switch branch**

```
git checkout branch-name
```

**Merge changes**

```
git merge branch-name
```

---

## 🛠 Project Setup (Local Development)

### Backend (FastAPI + Python)

1. Install Python 3.10+
2. Create a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate     # Windows
   ```
3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```
4. Run backend:

   ```
   uvicorn main:app --reload
   ```

### Frontend (React + Tailwind)

1. Install Node.js (LTS version)
2. Navigate to frontend folder:

   ```
   cd frontend
   ```
3. Install dependencies:

   ```
   npm install
   ```
4. Run frontend:

   ```
   npm start
   ```

---

## ✅ Final Notes

* Keep `main` stable — no direct pushes without review.
* Small, frequent commits are better than big ones.
* Document new features in this README if they affect how others work.
* If unsure, **ask before you code** to avoid conflicts.
