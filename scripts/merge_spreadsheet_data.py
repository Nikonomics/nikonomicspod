"""
Merge episode spreadsheet data (links, dates, titles) with extracted metadata
"""
import json
import csv
from datetime import datetime

# File paths
CSV_FILE = '/Users/nikolashulewsky/Downloads/Podcast Database - Episode Links (1).csv'
METADATA_FILE = 'episodes_batch.json'
OUTPUT_FILE = 'episodes_batch_merged.json'

def parse_date(date_str):
    """Convert MM/DD/YY to a proper date string"""
    try:
        date_obj = datetime.strptime(date_str, '%m/%d/%y')
        return date_obj.strftime('%Y-%m-%d')
    except:
        return None

def normalize_episode_number(ep_num):
    """Normalize episode number to handle both '7' and '07' formats"""
    ep_num = ep_num.strip()
    # Try to convert to int and back to string to remove leading zeros
    try:
        return str(int(ep_num))
    except:
        return ep_num

def load_spreadsheet_data():
    """Load episode data from CSV"""
    episodes_dict = {}

    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            ep_num = row['Ep #'].strip()
            normalized_num = normalize_episode_number(ep_num)
            episodes_dict[normalized_num] = {
                'episode_number': ep_num,
                'date': parse_date(row['Date']),
                'duration': row['Duration (seconds)'],
                'apple_url': row['Apple Link'],
                'spotify_url': row['Spotify Link'],
                'youtube_url': row['YouTube'],
                'title': row['Title'],
                'guest': row['Guest'],
                're_release': row['Re-release?'].strip() != ''
            }

    return episodes_dict

def merge_data():
    """Merge spreadsheet data with extracted metadata"""
    print("Loading spreadsheet data...")
    spreadsheet_data = load_spreadsheet_data()
    print(f"✓ Loaded {len(spreadsheet_data)} episodes from spreadsheet")

    print("\nLoading extracted metadata...")
    with open(METADATA_FILE, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    print(f"✓ Loaded {len(metadata)} episodes from metadata extraction")

    print("\nMerging data...")
    merged_episodes = []
    matched = 0
    unmatched_metadata = 0

    for episode in metadata:
        ep_num = episode.get('Episode #', '').strip()
        normalized_num = normalize_episode_number(ep_num)

        if normalized_num in spreadsheet_data:
            # Merge spreadsheet data into metadata
            sheet_data = spreadsheet_data[normalized_num]

            # Update with spreadsheet data (overriding AI-extracted where applicable)
            episode['Episode Date'] = sheet_data['date']
            episode['Episode Duration'] = sheet_data['duration']
            episode['youtube_url'] = sheet_data['youtube_url']
            episode['spotify_url'] = sheet_data['spotify_url']
            episode['apple_url'] = sheet_data['apple_url']
            episode['Re-release'] = sheet_data['re_release']

            # ALWAYS use spreadsheet title as primary (CSV titles are authoritative)
            if sheet_data['title'] and len(sheet_data['title']) > 10:
                episode['Episode Title'] = sheet_data['title']

            # ALWAYS use spreadsheet guest as primary
            if sheet_data['guest']:
                episode['Guest Name'] = sheet_data['guest']

            merged_episodes.append(episode)
            matched += 1
        else:
            # Keep metadata even if no spreadsheet match
            merged_episodes.append(episode)
            unmatched_metadata += 1

    # Add episodes from spreadsheet that don't have metadata yet
    existing_ep_nums = set(normalize_episode_number(ep.get('Episode #', '')) for ep in metadata)
    for ep_num, sheet_data in spreadsheet_data.items():
        if ep_num not in existing_ep_nums:
            # Create minimal episode entry from spreadsheet
            merged_episodes.append({
                'Episode #': ep_num,
                'Episode Title': sheet_data['title'],
                'Guest Name': sheet_data['guest'],
                'Episode Date': sheet_data['date'],
                'Episode Duration': sheet_data['duration'],
                'youtube_url': sheet_data['youtube_url'],
                'spotify_url': sheet_data['spotify_url'],
                'apple_url': sheet_data['apple_url'],
                'Re-release': sheet_data['re_release'],
                'Episode Summary': f"Episode with {sheet_data['guest']}" if sheet_data['guest'] else "Episode coming soon"
            })

    # Sort by episode number
    merged_episodes.sort(key=lambda x: int(x.get('Episode #', 0)) if x.get('Episode #', '').isdigit() else 999)

    # Save merged data
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(merged_episodes, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Merged {len(merged_episodes)} total episodes")
    print(f"  - {matched} episodes matched with metadata")
    print(f"  - {unmatched_metadata} episodes have metadata but no spreadsheet entry")
    print(f"  - {len(merged_episodes) - matched - unmatched_metadata} episodes from spreadsheet only")
    print(f"\n✓ Saved to: {OUTPUT_FILE}")

if __name__ == '__main__':
    merge_data()
