"""
Tag cleanup script - standardizes and consolidates episode tags
"""
import json
from collections import Counter

# Tag normalization rules
TAG_MAPPINGS = {
    # Format fixes (spaces to hyphens)
    'ai integration': 'ai-integration',
    'business acquisition': 'acquisitions',
    'business frameworks': 'business-frameworks',
    'business growth': 'growth-strategy',
    'business ideas': 'entrepreneurship',
    'business models': 'business-model',
    'business operations': 'operations',
    'career transition': 'career-transition',
    'content creation': 'content-creation',
    'corporate to entrepreneur': 'career-transition',
    'customer service': 'customer-service',
    'decision making': 'decision-making',
    'digital marketing': 'marketing',
    'email marketing': 'email-marketing',
    'market research': 'market-research',
    'real estate': 'real-estate',
    'sales strategy': 'sales',
    'social media': 'social-media',
    'supply chain': 'supply-chain',
    'team building': 'team-building',
    'work life balance': 'work-life-balance',

    # Duplicates/variations
    'ecommerce': 'e-commerce',
    'acquisition': 'acquisitions',
    'startup': 'entrepreneurship',
    'growth': 'growth-strategy',
    'business': 'entrepreneurship',
    'company': 'entrepreneurship',

    # Overly generic tags to remove
    'success': None,  # None means delete this tag
    'entrepreneur': 'entrepreneurship',

    # Consolidate similar concepts
    'ai': 'artificial-intelligence',
    'machine-learning': 'artificial-intelligence',
    'chatgpt': 'artificial-intelligence',
    'llm': 'artificial-intelligence',

    # SaaS variations
    'software-as-a-service': 'saas',
    'sass': 'saas',

    # B2B/B2C standardization
    'b-2-b': 'b2b',
    'b-2-c': 'b2c',

    # Marketing consolidation
    'advertising': 'marketing',
    'ads': 'marketing',
    'ad-spend': 'marketing',

    # Operations variations
    'operational-efficiency': 'operations',
    'process': 'process-improvement',
    'processes': 'process-improvement',

    # Team/hiring consolidation
    'recruiting': 'hiring',
    'recruitment': 'hiring',
    'talent': 'hiring',
    'team': 'team-building',
    'culture': 'company-culture',

    # Financial consolidation
    'revenue': 'profitability',
    'profit': 'profitability',
    'margins': 'profitability',
    'investment': 'fundraising',
    'funding': 'fundraising',
    'capital': 'fundraising',
    'investors': 'fundraising',

    # Growth variations
    'scale': 'scaling',
    'growth-hacking': 'growth-strategy',
    'expansion': 'scaling',

    # Customer variations
    'customers': 'customer-retention',
    'customer-success': 'customer-retention',
    'churn': 'customer-retention',
    'retention': 'customer-retention',
    'acquisition-strategy': 'customer-acquisition',

    # Product variations
    'product': 'product-development',
    'product-development': 'product-market-fit',

    # Sales variations
    'selling': 'sales',
    'sales-process': 'sales',
    'business-development': 'sales',
}

def normalize_tag(tag):
    """Normalize a single tag"""
    tag = tag.strip().lower()

    # Apply mapping if exists
    if tag in TAG_MAPPINGS:
        return TAG_MAPPINGS[tag]

    # Replace spaces with hyphens
    tag = tag.replace(' ', '-')

    # Remove very long tags (likely phrases)
    if len(tag) > 35:
        return None

    return tag

def cleanup_tags(min_occurrences=2, dry_run=True):
    """
    Clean up episode tags

    Args:
        min_occurrences: Minimum times a tag must appear to be kept (default: 2)
        dry_run: If True, show changes without saving (default: True)
    """

    # Load episodes
    with open('episodes_batch.json', 'r', encoding='utf-8') as f:
        episodes = json.load(f)

    print(f"\n{'='*80}")
    print(f"TAG CLEANUP - {'DRY RUN' if dry_run else 'APPLYING CHANGES'}")
    print(f"{'='*80}\n")

    # First pass: collect all normalized tags to determine frequency
    print("Phase 1: Analyzing current tags...")
    all_normalized_tags = []

    for ep in episodes:
        tags_str = ep.get('Tags', '')
        if tags_str:
            tag_list = [t.strip() for t in tags_str.split(',') if t.strip()]
            for tag in tag_list:
                normalized = normalize_tag(tag)
                if normalized:  # None means delete
                    all_normalized_tags.append(normalized)

    # Count frequency
    tag_freq = Counter(all_normalized_tags)

    # Determine which tags to keep (appear min_occurrences or more)
    tags_to_keep = {tag for tag, count in tag_freq.items() if count >= min_occurrences}
    tags_to_remove = {tag for tag, count in tag_freq.items() if count < min_occurrences}

    print(f"Total unique tags (after normalization): {len(tag_freq)}")
    print(f"Tags appearing {min_occurrences}+ times: {len(tags_to_keep)}")
    print(f"Tags appearing <{min_occurrences} times (will be removed): {len(tags_to_remove)}")

    # Show some examples of what will be removed
    print(f"\nSample tags that will be removed (appear only once):")
    for tag in sorted(tags_to_remove)[:20]:
        print(f"  • {tag}")

    # Second pass: clean up tags in each episode
    print(f"\nPhase 2: Cleaning up tags...")

    changes_summary = {
        'episodes_modified': 0,
        'tags_before': 0,
        'tags_after': 0,
        'tags_removed': 0,
        'tags_consolidated': 0,
        'format_fixes': 0
    }

    for ep in episodes:
        tags_str = ep.get('Tags', '')
        if not tags_str:
            continue

        original_tags = [t.strip() for t in tags_str.split(',') if t.strip()]
        changes_summary['tags_before'] += len(original_tags)

        # Normalize and filter tags
        new_tags = []
        had_changes = False

        for tag in original_tags:
            original_normalized = tag.strip().lower()
            normalized = normalize_tag(tag)

            # Track what happened
            if normalized is None:
                changes_summary['tags_removed'] += 1
                had_changes = True
                continue

            if normalized != original_normalized:
                if normalized in TAG_MAPPINGS.values():
                    changes_summary['tags_consolidated'] += 1
                elif ' ' in tag:
                    changes_summary['format_fixes'] += 1
                had_changes = True

            # Only keep if appears frequently enough
            if normalized in tags_to_keep:
                if normalized not in new_tags:  # Remove duplicates
                    new_tags.append(normalized)
            else:
                changes_summary['tags_removed'] += 1
                had_changes = True

        if had_changes:
            changes_summary['episodes_modified'] += 1

        # Update episode with cleaned tags
        ep['Tags'] = ', '.join(sorted(new_tags))
        changes_summary['tags_after'] += len(new_tags)

    # Show summary
    print(f"\n{'='*80}")
    print("CLEANUP SUMMARY")
    print(f"{'='*80}")
    print(f"Episodes modified:      {changes_summary['episodes_modified']}")
    print(f"Tags before:            {changes_summary['tags_before']}")
    print(f"Tags after:             {changes_summary['tags_after']}")
    print(f"Tags removed:           {changes_summary['tags_removed']}")
    print(f"Tags consolidated:      {changes_summary['tags_consolidated']}")
    print(f"Format fixes:           {changes_summary['format_fixes']}")
    print(f"Reduction:              {((changes_summary['tags_before'] - changes_summary['tags_after']) / changes_summary['tags_before'] * 100):.1f}%")

    # Show top tags after cleanup
    print(f"\nTop 20 tags after cleanup:")
    final_tags = []
    for ep in episodes:
        tags_str = ep.get('Tags', '')
        if tags_str:
            final_tags.extend([t.strip() for t in tags_str.split(',') if t.strip()])

    final_freq = Counter(final_tags)
    for i, (tag, count) in enumerate(final_freq.most_common(20), 1):
        pct = (count / len([e for e in episodes if e.get('Tags')])) * 100
        print(f"{i:2d}. {tag:30s} {count:3d} episodes ({pct:5.1f}%)")

    # Save if not dry run
    if not dry_run:
        output_file = 'episodes_batch_cleaned.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(episodes, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Saved cleaned data to: {output_file}")
        print(f"\nTo use this file:")
        print(f"  1. Review episodes_batch_cleaned.json")
        print(f"  2. If satisfied: mv episodes_batch_cleaned.json episodes_batch.json")
        print(f"  3. Deploy to production")
    else:
        print(f"\n⚠️  DRY RUN - No changes saved")
        print(f"To apply changes, run: python3 cleanup_tags.py --apply")

    print(f"\n{'='*80}\n")

if __name__ == '__main__':
    import sys

    # Parse arguments
    apply = '--apply' in sys.argv
    min_occurrences = 2

    if '--min' in sys.argv:
        idx = sys.argv.index('--min')
        if idx + 1 < len(sys.argv):
            min_occurrences = int(sys.argv[idx + 1])

    print("\nTag Cleanup Configuration:")
    print(f"  Minimum occurrences: {min_occurrences}")
    print(f"  Mode: {'APPLY CHANGES' if apply else 'DRY RUN'}")
    print()

    cleanup_tags(min_occurrences=min_occurrences, dry_run=not apply)
