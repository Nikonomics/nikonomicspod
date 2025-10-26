#!/usr/bin/env python3
"""
Google Docs to HTML Converter for Nikonomics Toolkit
Automatically converts Google Docs to HTML using the Google Docs API
"""

import os
import re
import json
from pathlib import Path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import pickle

# Scopes for Google Docs API
SCOPES = ['https://www.googleapis.com/auth/documents.readonly']

class GoogleDocsConverter:
    def __init__(self):
        self.service = None
        self.authenticate()
    
    def authenticate(self):
        """Authenticate with Google Docs API"""
        creds = None
        token_file = 'token.pickle'
        
        # Load existing credentials
        if os.path.exists(token_file):
            with open(token_file, 'rb') as token:
                creds = pickle.load(token)
        
        # If no valid credentials, get new ones
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', SCOPES)
                creds = flow.run_local_server(port=0)
            
            # Save credentials for next run
            with open(token_file, 'wb') as token:
                pickle.dump(creds, token)
        
        self.service = build('docs', 'v1', credentials=creds)
    
    def get_document_content(self, document_id):
        """Extract content from Google Doc"""
        doc = self.service.documents().get(documentId=document_id).execute()
        return doc
    
    def convert_to_html(self, doc_content):
        """Convert Google Docs content to HTML"""
        html_content = []
        
        for element in doc_content.get('body', {}).get('content', []):
            if 'paragraph' in element:
                paragraph = element['paragraph']
                html_content.append(self.convert_paragraph(paragraph))
            elif 'table' in element:
                table = element['table']
                html_content.append(self.convert_table(table))
        
        return '\n'.join(html_content)
    
    def convert_paragraph(self, paragraph):
        """Convert a paragraph to HTML"""
        text_content = []
        
        for element in paragraph.get('elements', []):
            if 'textRun' in element:
                text_run = element['textRun']
                text = text_run.get('content', '')
                style = text_run.get('textStyle', {})
                
                # Apply formatting based on style
                if style.get('bold'):
                    text = f'<strong>{text}</strong>'
                if style.get('italic'):
                    text = f'<em>{text}</em>'
                if style.get('underline'):
                    text = f'<u>{text}</u>'
                
                text_content.append(text)
        
        # Determine heading level
        heading_level = self.get_heading_level(paragraph)
        if heading_level:
            return f'<h{heading_level} class="font-futura">{self.clean_text("".join(text_content))}</h{heading_level}>'
        else:
            return f'<p class="text-refined">{self.clean_text("".join(text_content))}</p>'
    
    def get_heading_level(self, paragraph):
        """Determine if paragraph is a heading and what level"""
        style = paragraph.get('paragraphStyle', {})
        named_style = style.get('namedStyleType', '')
        
        heading_map = {
            'HEADING_1': 1,
            'HEADING_2': 2,
            'HEADING_3': 3,
            'HEADING_4': 4,
            'HEADING_5': 5,
            'HEADING_6': 6
        }
        
        return heading_map.get(named_style)
    
    def convert_table(self, table):
        """Convert table to HTML"""
        html_table = ['<table class="table-auto w-full border-collapse border border-gray-300">']
        
        for row in table.get('tableRows', []):
            html_table.append('<tr>')
            for cell in row.get('tableCells', []):
                cell_content = []
                for element in cell.get('content', []):
                    if 'paragraph' in element:
                        cell_content.append(self.convert_paragraph(element['paragraph']))
                html_table.append(f'<td class="border border-gray-300 p-2">{"".join(cell_content)}</td>')
            html_table.append('</tr>')
        
        html_table.append('</table>')
        return '\n'.join(html_table)
    
    def clean_text(self, text):
        """Clean and format text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove trailing newlines
        text = text.strip()
        return text
    
    def create_resource_page(self, doc_id, title, description, category='guides'):
        """Create a complete resource page from Google Doc"""
        # Get document content
        doc_content = self.get_document_content(doc_id)
        html_content = self.convert_to_html(doc_content)
        
        # Create directory structure
        safe_title = re.sub(r'[^a-zA-Z0-9\-_]', '-', title.lower())
        resource_dir = Path(f'resources/{category}/{safe_title}')
        resource_dir.mkdir(parents=True, exist_ok=True)
        
        # Load template
        template_path = Path('resources/template/static-content.html')
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Replace placeholders
        template = template.replace('[RESOURCE TITLE]', title)
        template = template.replace('[RESOURCE DESCRIPTION]', description)
        template = template.replace('[RESOURCE TYPE]', '📚 Playbook')
        template = template.replace('[ESTIMATED TIME]', '45 min read')
        
        # Replace content sections with actual content
        content_section = f'''
        <div class="content-section" id="overview">
            <h2 class="font-futura">Overview</h2>
            <p class="text-refined">{description}</p>
        </div>
        
        <div class="content-section" id="content">
            {html_content}
        </div>
        '''
        
        template = template.replace(
            '<!-- Replace this section -->',
            content_section
        )
        
        # Save the file
        output_path = resource_dir / 'index.html'
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(template)
        
        print(f"✅ Created resource: {output_path}")
        return str(output_path)
    
    def update_resource_registry(self, title, description, url, category='guides'):
        """Update the resources-data.js file"""
        registry_path = Path('js/resources-data.js')
        
        # Read current registry
        with open(registry_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add new resource entry
        new_entry = f'''    {{
      title: '{title}',
      description: '{description}',
      url: '{url}',
      category: '{category.title()}',
      type: '📚 Playbook',
      time: '45 min read',
      featured: false
    }}'''
        
        # Find the guides section and add entry
        pattern = r"('guides': \[)(.*?)(\])"
        replacement = r"\1\2,\n" + new_entry + r"\n  \3"
        updated_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        # Write back to file
        with open(registry_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"✅ Updated resource registry")

def main():
    """Main function to convert Google Docs"""
    converter = GoogleDocsConverter()
    
    # Example usage - replace with your actual document IDs
    documents = [
        {
            'id': 'YOUR_DOCUMENT_ID_1',
            'title': 'Customer Acquisition Playbook',
            'description': 'Complete guide to acquiring customers systematically',
            'category': 'guides'
        },
        {
            'id': 'YOUR_DOCUMENT_ID_2', 
            'title': 'Business Plan Template',
            'description': 'Step-by-step business plan creation guide',
            'category': 'business-plans'
        }
    ]
    
    for doc in documents:
        try:
            # Create resource page
            output_path = converter.create_resource_page(
                doc['id'],
                doc['title'], 
                doc['description'],
                doc['category']
            )
            
            # Update registry
            converter.update_resource_registry(
                doc['title'],
                doc['description'],
                f"/resources/{doc['category']}/{doc['title'].lower().replace(' ', '-')}/",
                doc['category']
            )
            
        except Exception as e:
            print(f"❌ Error processing {doc['title']}: {e}")

if __name__ == "__main__":
    main()
