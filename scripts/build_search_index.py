"""
Build optimized search index for client-side episode search.

This creates a lightweight JSON file that enables fast, instant search
across episode metadata without needing a backend.
"""
import json
import re
from collections import defaultdict

def tokenize(text):
    """Convert text to searchable tokens"""
    if not text:
        return []

    # Lowercase and remove special characters except hyphens
    text = text.lower()
    # Split on whitespace and punctuation but keep hyphenated words
    tokens = re.findall(r'\b[\w-]+\b', text)
    return [t for t in tokens if len(t) > 2]  # Filter out 1-2 char tokens

def build_search_index():
    """Build search index from episodes_final.json"""

    print("\n" + "="*80)
    print("BUILDING SEARCH INDEX")
    print("="*80 + "\n")

    # Load episodes
    with open('episodes_final.json', 'r', encoding='utf-8') as f:
        episodes = json.load(f)

    print(f"✓ Loaded {len(episodes)} episodes")

    # Build inverted index: token -> [episode_ids]
    inverted_index = defaultdict(set)

    # Build searchable episodes
    searchable_episodes = []

    for ep in episodes:
        ep_num = ep.get('Episode #')
        if not ep_num:
            continue

        # Collect searchable text from key fields
        searchable_fields = [
            ep.get('Episode Title', ''),
            ep.get('Episode Summary', ''),
            ep.get('Guest Name', ''),
            ep.get('Business Name', ''),
            ep.get('Topics', ''),
            ep.get('Tags', ''),
            ep.get('Business Activity', ''),
            ep.get('Industry Category', ''),
            ep.get('Industry Subcategory', ''),
            ep.get('Key Takeaways', ''),
        ]

        # Combine and tokenize
        combined_text = ' '.join(str(f) for f in searchable_fields if f)
        tokens = tokenize(combined_text)

        # Add to inverted index
        for token in set(tokens):  # Use set to avoid duplicates
            inverted_index[token].add(ep_num)

        # Create searchable episode object (full version with all display fields)
        searchable_ep = {
            'id': ep_num,
            'title': ep.get('Episode Title', ''),
            'guest': ep.get('Guest Name', ''),
            'summary': ep.get('Episode Summary', ''),  # Full summary
            'date': ep.get('Episode Date', ''),
            'duration': ep.get('Episode Duration', ''),
            'business_name': ep.get('Business Name', ''),  # Added
            'industry_category': ep.get('Industry Category', ''),
            'industry_subcategory': ep.get('Industry Subcategory', ''),
            'business_activity': ep.get('Business Activity', ''),
            'topics': ep.get('Topics', '').split(',') if ep.get('Topics') else [],  # All topics
            'tags': ep.get('Tags', '').split(',') if ep.get('Tags') else [],  # All tags
            'Key Takeaways': ep.get('Key Takeaways', ''),  # Added
            'Revenue': ep.get('Revenue', ''),  # Added
            'youtube': ep.get('youtube_url', ''),
            'spotify': ep.get('spotify_url', ''),
            'apple': ep.get('apple_url', ''),
        }

        # Clean up topics and tags
        searchable_ep['topics'] = [t.strip() for t in searchable_ep['topics'] if t.strip()]
        searchable_ep['tags'] = [t.strip() for t in searchable_ep['tags'] if t.strip()]

        searchable_episodes.append(searchable_ep)

    # Convert inverted index sets to lists for JSON serialization
    inverted_index_json = {
        token: sorted(list(ep_ids))
        for token, ep_ids in inverted_index.items()
    }

    # Get unique values for filters
    all_industries = set()
    all_subcategories = set()

    for ep in episodes:
        if ep.get('Industry Category') and ep.get('Industry Category') != 'N/A':
            # Handle multiple categories (comma-separated)
            cats = ep.get('Industry Category', '').split(',')
            all_industries.update(c.strip() for c in cats if c.strip())

        if ep.get('Industry Subcategory') and ep.get('Industry Subcategory') != 'N/A':
            # Handle multiple subcategories
            subcats = ep.get('Industry Subcategory', '').split(',')
            all_subcategories.update(s.strip() for s in subcats if s.strip())

    # Build final index
    search_index = {
        'episodes': searchable_episodes,
        'index': inverted_index_json,
        'filters': {
            'industries': sorted(list(all_industries)),
            'subcategories': sorted(list(all_subcategories))
        },
        'metadata': {
            'total_episodes': len(searchable_episodes),
            'total_tokens': len(inverted_index_json),
            'version': '1.0'
        }
    }

    # Write to file
    output_file = 'search-index.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(search_index, f, ensure_ascii=False, separators=(',', ':'))

    # Get file size
    import os
    size_kb = os.path.getsize(output_file) / 1024

    print(f"\n{'='*80}")
    print(f"SEARCH INDEX BUILT")
    print(f"{'='*80}\n")
    print(f"✓ Episodes indexed: {len(searchable_episodes)}")
    print(f"✓ Unique search tokens: {len(inverted_index_json):,}")
    print(f"✓ Industry categories: {len(all_industries)}")
    print(f"✓ Industry subcategories: {len(all_subcategories)}")
    print(f"\n✓ Output file: {output_file}")
    print(f"✓ File size: {size_kb:.1f} KB")
    print(f"\n{'='*80}\n")

    # Show sample tokens
    print("Sample search tokens:")
    sample_tokens = sorted(inverted_index_json.keys())[:20]
    for token in sample_tokens:
        count = len(inverted_index_json[token])
        print(f"  '{token}' → {count} episodes")

    print(f"\n{'='*80}\n")

if __name__ == '__main__':
    build_search_index()
