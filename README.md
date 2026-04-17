# Tianqi Luo - Academic Homepage

A clean, data-driven academic homepage built with pure HTML/CSS/JS. No build step required.

## Quick Start

1. **Local preview** -- open `index.html` in a browser, or serve with any static server:
   ```bash
   # Python
   python3 -m http.server 8000
   # Node
   npx serve .
   ```
   Then visit `http://localhost:8000`.

2. **Deploy to GitHub Pages**:
   ```bash
   git init
   git add .
   git commit -m "Initial homepage"
   git remote add origin git@github.com:<USERNAME>/<USERNAME>.github.io.git
   git push -u origin main
   ```
   Go to **Settings → Pages → Source: Deploy from branch `main`**, root `/`.
   Your site will be live at `https://<USERNAME>.github.io/`.

## Updating Content

All content lives in JSON files under `data/`. Edit these files and push -- no code changes needed.

| File | What it controls |
|---|---|
| `data/personal.json` | Name, title, bio, avatar path, contact links, research keywords |
| `data/news.json` | News items (set `"recent": true` for items shown by default) |
| `data/publications.json` | Papers with year, venue, authors, links, image, badges |
| `data/education.json` | Education entries with school, degree, dates, details |
| `data/experience.json` | Work experience with company, role, dates, description |
| `data/honors.json` | Awards with year, title, context |
| `data/services.json` | Service roles (reviewer, talks, organizing) |

### Adding a new publication

Append to `data/publications.json`:

```json
{
  "year": 2026,
  "venue": "SIGMOD 2026",
  "title": "My New Paper Title",
  "authors": ["Tianqi Luo", "Co-Author Name"],
  "links": {
    "paper": "https://arxiv.org/abs/...",
    "homepage": "https://project-page.github.io/",
    "code": "https://github.com/..."
  },
  "image": "assets/papers/my-paper.png",
  "badges": ["Best Paper Award"],
  "highlight": true
}
```

### Adding a news item

Append to `data/news.json`:

```json
{
  "date": "2026.04",
  "text": "Our paper has been accepted by <a href='https://...'>Conference 2026</a>.",
  "recent": true
}
```

When the item becomes old, change `"recent"` to `false` to move it behind the "Show earlier updates" toggle.

### Replacing your profile photo

Replace `assets/avatar.svg` (or `.jpg`/`.png`) and update the `"avatar"` path in `data/personal.json`.

## File Structure

```
├── index.html              # Page shell (section containers, no hardcoded content)
├── css/style.css            # All styles (responsive, sidebar, cards, timeline)
├── js/main.js               # Fetches data/*.json, renders sections, handles interactions
├── data/                    # Editable content (JSON)
│   ├── personal.json
│   ├── news.json
│   ├── publications.json
│   ├── education.json
│   ├── experience.json
│   ├── honors.json
│   └── services.json
├── assets/                  # Images and static files
│   ├── avatar.svg
│   └── favicon.svg
└── README.md
```

## Sections that auto-hide

If a JSON file is empty (`[]`), the corresponding section and its sidebar nav link are automatically hidden. This lets you show only the sections you have content for.
