# Episode Transcripts

This directory stores transcripts for Nikonomics podcast episodes in JSON format.

## File Structure

Each transcript file should be named: `episode-XXX.json` where XXX is the episode number (e.g., `episode-001.json`, `episode-123.json`)

## JSON Schema

```json
{
  "episode_number": 1,
  "episode_title": "Episode Title Here",
  "guest_name": "Guest Name",
  "business_name": "Business Name",
  "transcript": "Full transcript text here...",
  "metadata": {
    "duration": "45:30",
    "date": "2024-01-15",
    "platform_source": "YouTube/Spotify/Other"
  }
}
```

## Fields

- **episode_number**: Integer - The episode number
- **episode_title**: String - Title of the episode
- **guest_name**: String - Name of the guest
- **business_name**: String - Name of the business discussed
- **transcript**: String - Full transcript text (plain text format)
- **metadata**: Object - Additional metadata about the episode
  - **duration**: String - Episode length (MM:SS or HH:MM:SS)
  - **date**: String - Episode release date (YYYY-MM-DD)
  - **platform_source**: String - Where transcript was sourced from

## Usage

Transcripts are loaded on-demand when users interact with episode Q&A features. They are not loaded in bulk to maintain performance.

## File Naming Convention

- Use 3-digit zero-padded episode numbers: `episode-001.json`, `episode-042.json`, `episode-247.json`
- This ensures proper alphabetical sorting

## Adding New Transcripts

1. Export transcript from your podcast platform or transcription service
2. Format as JSON following the schema above
3. Save as `episode-XXX.json` in this directory
4. The Q&A feature will automatically detect and use it
