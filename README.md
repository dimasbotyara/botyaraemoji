# 😀 botyaraemoji

Self-hosted web emoji picker on Flask. Browse emojis by category, click to copy — recents are remembered automatically. No accounts, no cloud.

## Features

- Emoji catalog organized by categories (`emojis.py`)
- **Recents** — the emojis you use most stay on top
- Copy on click
- Settings persist server-side per client IP (`data/settings.json`)
- Single-page vanilla JS frontend

## Quick start

```bash
pip install flask
python app.py
```

## Adding emojis

Append entries to `EMOJI_DATA` in `emojis.py` — categories are plain data, no code changes needed.
