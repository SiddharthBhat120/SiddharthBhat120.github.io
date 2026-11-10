# SB—120 · Siddharth Bhat's portfolio

A risograph zine about building things. Static HTML/CSS/JS, no build step.

- `index.html`: cover, pitch, projects, skills sticker sheet, playground, resume, contact
- `brand.html`: the brand identity sheet
- `assets/Siddharth-Bhat-Resume.pdf`: downloadable resume (source: `../resume/siddharth-bhat-resume.tex`)

## Run locally

```bash
python -m http.server 5520
```

Then open http://localhost:5520.

## Publish on GitHub Pages

1. Create a public repo named `SiddharthBhat120.github.io`.
2. Push the contents of this folder to its `main` branch.
3. The site goes live at https://siddharthbhat120.github.io (Settings → Pages if it doesn't appear).

When you change CSS/JS, bump the `?v=` number in the HTML so browsers load the new files.
