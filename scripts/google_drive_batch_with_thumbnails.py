"""
Batch process episodes directly from Google Drive
Automatically downloads transcripts, thumbnails, and processes metadata
"""

import os
import io
import json
import time
from pathlib import Path
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

from extract_episode_metadata import EpisodeExtractor

# Google Drive API scopes
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

# Your Google Drive folder ID
DRIVE_FOLDER_ID = '1RneILflekH6dK4qk6j5nZ0eqlZbj-5Gr'

# Thumbnail storage directory
THUMBNAILS_DIR = '../resources/episodes/thumbnails'

def authenticate_google_drive():
    """Authenticate with Google Drive API using Service Account"""
    service_account_file = 'service_account.json'

    if not os.path.exists(service_account_file):
        print("\n❌ ERROR: service_account.json not found")
        return None

    try:
        creds = service_account.Credentials.from_service_account_file(
            service_account_file, scopes=SCOPES)
        return creds
    except Exception as e:
        print(f"\n❌ ERROR: Failed to load service account credentials: {str(e)}\n")
        return None

def get_episode_folders(service, folder_id):
    """Get all episode folders from Google Drive"""
    print(f"\n📁 Fetching episode folders from Google Drive...")

    query = f"'{folder_id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false"
    results = service.files().list(
        q=query,
        fields="files(id, name)",
        orderBy="name"
    ).execute()

    folders = results.get('files', [])
    print(f"✓ Found {len(folders)} episode folders")
    return folders

def get_transcript_from_folder(service, folder_id, folder_name):
    """Get transcript file from an episode folder"""
    try:
        query = f"'{folder_id}' in parents and trashed=false and (name contains 'transcript' or name contains 'Transcript')"
        results = service.files().list(
            q=query,
            fields="files(id, name, mimeType)"
        ).execute()

        files = results.get('files', [])

        if not files:
            return None

        # Prefer Google Doc, then text file
        transcript_file = None
        for file in files:
            if 'google-apps.document' in file['mimeType']:
                transcript_file = file
                break
            elif 'text/plain' in file['mimeType']:
                transcript_file = file

        if not transcript_file:
            transcript_file = files[0]

        return transcript_file

    except Exception as e:
        print(f"  ✗ Error finding transcript: {str(e)}")
        return None

def get_thumbnail_from_folder(service, folder_id, folder_name):
    """Get thumbnail image from an episode folder (searches recursively in subfolders)"""
    try:
        # First, look for image files directly in the episode folder
        query = f"'{folder_id}' in parents and trashed=false and (mimeType contains 'image/')"
        results = service.files().list(
            q=query,
            fields="files(id, name, mimeType)",
            pageSize=5
        ).execute()

        files = results.get('files', [])

        if files:
            return files[0]

        # If no images found directly, look in subfolders
        # First get all subfolders
        query = f"'{folder_id}' in parents and trashed=false and mimeType='application/vnd.google-apps.folder'"
        subfolders = service.files().list(
            q=query,
            fields="files(id, name)"
        ).execute()

        subfolder_list = subfolders.get('files', [])

        # Search for images in each subfolder
        for subfolder in subfolder_list:
            query = f"'{subfolder['id']}' in parents and trashed=false and (mimeType contains 'image/')"
            results = service.files().list(
                q=query,
                fields="files(id, name, mimeType)",
                pageSize=5
            ).execute()

            files = results.get('files', [])
            if files:
                print(f"    Found in subfolder: {subfolder['name']}")
                return files[0]

        return None

    except Exception as e:
        print(f"  ⚠️  Error finding thumbnail: {str(e)}")
        return None

def download_transcript(service, file_id, mime_type):
    """Download transcript content from Google Drive"""
    try:
        if 'google-apps.document' in mime_type:
            request = service.files().export_media(
                fileId=file_id,
                mimeType='text/plain'
            )
        else:
            request = service.files().get_media(fileId=file_id)

        file_stream = io.BytesIO()
        downloader = MediaIoBaseDownload(file_stream, request)

        done = False
        while not done:
            status, done = downloader.next_chunk()

        file_stream.seek(0)
        content = file_stream.read().decode('utf-8', errors='ignore')
        return content

    except Exception as e:
        print(f"  ✗ Error downloading transcript: {str(e)}")
        return None

def download_thumbnail(service, file_id, file_name, episode_number, thumbnails_dir):
    """Download thumbnail image from Google Drive"""
    try:
        # Create thumbnails directory if it doesn't exist
        Path(thumbnails_dir).mkdir(parents=True, exist_ok=True)

        # Get file extension
        extension = Path(file_name).suffix or '.jpg'

        # Save as episode_number.ext (e.g., "07.jpg", "251.png")
        local_filename = f"{episode_number}{extension}"
        local_path = Path(thumbnails_dir) / local_filename

        # Download the file
        request = service.files().get_media(fileId=file_id)
        file_stream = io.BytesIO()
        downloader = MediaIoBaseDownload(file_stream, request)

        done = False
        while not done:
            status, done = downloader.next_chunk()

        # Save to disk
        file_stream.seek(0)
        with open(local_path, 'wb') as f:
            f.write(file_stream.read())

        return str(local_path)

    except Exception as e:
        print(f"  ⚠️  Error downloading thumbnail: {str(e)}")
        return None

def process_batch_from_drive(batch_size=20, output_file='episodes_batch.json'):
    """Process episodes directly from Google Drive"""

    # Check for Anthropic API key
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ ERROR: ANTHROPIC_API_KEY environment variable not set")
        return

    # Authenticate with Google Drive
    print("\n" + "="*60)
    print("GOOGLE DRIVE AUTHENTICATION")
    print("="*60)

    creds = authenticate_google_drive()
    if not creds:
        return

    service = build('drive', 'v3', credentials=creds)
    print("✓ Successfully authenticated with Google Drive")

    # Load existing episodes data to avoid reprocessing
    existing_episodes = {}
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                # Index by episode number for quick lookup
                for ep in existing_data:
                    ep_num = ep.get('Episode #', '').strip()
                    # Only consider episodes with meaningful AI metadata as "processed"
                    if ep_num and ep.get('Episode Summary') and len(ep.get('Episode Summary', '')) > 50:
                        existing_episodes[ep_num] = ep
                print(f"\n✓ Loaded {len(existing_data)} existing episodes")
                print(f"✓ Found {len(existing_episodes)} episodes already processed with AI metadata")
        except Exception as e:
            print(f"\n⚠️  Could not load existing data: {str(e)}")

    # Get episode folders
    episode_folders = get_episode_folders(service, DRIVE_FOLDER_ID)

    if not episode_folders:
        print("❌ No episode folders found")
        return

    # Filter out already processed episodes
    folders_to_process = []
    for folder in episode_folders:
        folder_name = folder['name']
        # Extract episode number (e.g., "07 - Sam Thompson" -> "07")
        ep_num = folder_name.split(' - ')[0].strip()
        if ep_num not in existing_episodes:
            folders_to_process.append(folder)
        if len(folders_to_process) >= batch_size:
            break

    if not folders_to_process:
        print("\n✓ All episodes already processed!")
        return

    print(f"\n{'='*60}")
    print(f"PROCESSING BATCH: {len(folders_to_process)} new episodes")
    print(f"Skipping {len(existing_episodes)} already processed")
    print(f"{'='*60}\n")

    # Initialize extractor
    extractor = EpisodeExtractor(api_key)
    # Start with existing episodes
    episodes_data = list(existing_episodes.values()) if existing_episodes else []
    successful = 0
    failed = 0

    for i, folder in enumerate(folders_to_process, 1):
        folder_name = folder['name']
        folder_id = folder['id']

        print(f"\n[{i}/{len(folders_to_process)}] {folder_name}")

        try:
            # Get transcript file
            transcript_file = get_transcript_from_folder(service, folder_id, folder_name)

            if not transcript_file:
                print(f"  ⚠️  No transcript found")
                failed += 1
                continue

            print(f"  📄 Found: {transcript_file['name']}")

            # Download transcript
            transcript = download_transcript(
                service,
                transcript_file['id'],
                transcript_file['mimeType']
            )

            if not transcript or len(transcript) < 100:
                print(f"  ⚠️  Transcript too short or empty")
                failed += 1
                continue

            print(f"  ✓ Downloaded transcript ({len(transcript)} characters)")

            # Get and download thumbnail
            thumbnail_file = get_thumbnail_from_folder(service, folder_id, folder_name)
            thumbnail_path = None

            if thumbnail_file:
                print(f"  🖼️  Found: {thumbnail_file['name']}")

                # Extract episode number from folder name (e.g., "07 - Sam Thompson" -> "07")
                episode_number = folder_name.split(' - ')[0].strip()

                thumbnail_path = download_thumbnail(
                    service,
                    thumbnail_file['id'],
                    thumbnail_file['name'],
                    episode_number,
                    THUMBNAILS_DIR
                )

                if thumbnail_path:
                    print(f"  ✓ Downloaded thumbnail to {thumbnail_path}")
            else:
                print(f"  ⚠️  No thumbnail found")

            # Process episode
            metadata = extractor.process_episode_folder(
                folder_name=folder_name,
                transcript_text=transcript,
                thumbnail_path=thumbnail_path
            )

            if metadata:
                episodes_data.append(metadata)
                successful += 1
                print(f"  ✓ Metadata extracted ({len(metadata)} fields)")
            else:
                failed += 1
                print(f"  ✗ Failed to extract metadata")

        except Exception as e:
            print(f"  ✗ Error processing episode: {str(e)}")
            failed += 1
            continue

        # Rate limiting (be nice to APIs)
        time.sleep(0.5)

        # Save progress after each episode (in case of crash)
        if episodes_data:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(episodes_data, f, indent=2, ensure_ascii=False)

    # Final save
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(episodes_data, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*60}")
    print(f"BATCH COMPLETE")
    print(f"{'='*60}")
    print(f"\n✓ Successful: {successful}")
    print(f"✗ Failed: {failed}")
    print(f"📊 Total episodes in file: {len(episodes_data)}")
    print(f"📁 Output: {output_file}")
    print(f"🖼️  Thumbnails: {THUMBNAILS_DIR}")
    print(f"\n💰 Estimated cost (this batch): ${successful * 0.05:.2f}")
    print(f"⏱️  Time taken: ~{successful * 2} minutes\n")

if __name__ == "__main__":
    import sys

    batch_size = int(sys.argv[1]) if len(sys.argv) > 1 else 20

    print("\n" + "="*60)
    print("NIKONOMICS PODCAST - BATCH PROCESSOR WITH THUMBNAILS")
    print("="*60)

    process_batch_from_drive(batch_size)
