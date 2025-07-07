# Bookmark Manager

A simple web application to manage your bookmarks. Add, view, and organize your favorite links easily.

## Features
- Add new bookmarks
- View all saved bookmarks
- Simple and clean UI

## Getting Started

### Prerequisites
- Docker (recommended) or Node.js (for manual run)

### Using Docker
1. Build and run the container:
   ```bash
   docker-compose up --build
   ```
2. Open your browser and go to `http://localhost:8080` (or the port specified in your `docker-compose.yml`).

### Manual Run
1. Open `index.html` in your browser.

## File Structure
- `index.html` - Main HTML file
- `script.js` - JavaScript logic for managing bookmarks
- `style.css` - Stylesheet
- `Dockerfile` & `docker-compose.yml` - For containerized deployment

## License
MIT
