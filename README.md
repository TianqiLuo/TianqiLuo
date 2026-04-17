# Tianqi Luo - Academic Homepage

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
