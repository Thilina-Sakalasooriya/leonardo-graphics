# Leonardo Graphics & Artworks

Static portfolio website for Leonardo Graphics & Artworks.

## Pages

- `index.html` — home, gallery, work, packages and contact
- `story.html` — project/story detail view
- `studio.html` — studio information

## Structure

- `css/template.css` — all active styling
- `js/main.js` — shared navigation, theme, reveal and contact behaviour
- `js/stories.js` — story data
- `js/article.js` — story detail rendering
- `assets/images/` — site imagery

## Deployment

Deploys to GitHub Pages with `.github/workflows/static.yml` on pushes to `main`.
Keep Pages source set to **GitHub Actions**. Relative paths are used throughout so the site works from the `/leonardo-graphics/` subpath.
