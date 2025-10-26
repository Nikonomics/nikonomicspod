#!/usr/bin/env python3
"""
Simple Batch Converter for Nikonomics Toolkit
Converts exported Google Docs (HTML) to toolkit format
"""

import os
import re
import json
from pathlib import Path
from bs4 import BeautifulSoup

class BatchConverter:
    def __init__(self):
        self.template_path = Path('resources/template/static-content.html')
        self.registry_path = Path('js/resources-data.js')
    
    def load_template(self):
        """Load the HTML template"""
        with open(self.template_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def convert_html_content(self, html_file):
        """Convert exported Google Doc HTML to toolkit format"""
        with open(html_file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        
        # Extract title
        title = soup.find('title')
        title_text = title.get_text() if title else "Untitled Document"
        
        # Convert headings
        for i, heading in enumerate(soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']), 1):
            level = int(heading.name[1])
            if level <= 2:
                heading['class'] = 'font-futura'
            else:
                heading['class'] = 'font-futura-medium'
        
        # Convert paragraphs
        for p in soup.find_all('p'):
            p['class'] = 'text-refined'
        
        # Convert lists
        for ul in soup.find_all('ul'):
            ul['class'] = 'text-refined'
        for ol in soup.find_all('ol'):
            ol['class'] = 'text-refined'
        
        # Get body content
        body = soup.find('body')
        if body:
            content = str(body)
        else:
            content = str(soup)
        
        return title_text, content
    
    def create_resource_page(self, html_file, title, description, category='guides'):
        """Create a resource page from HTML file"""
        # Load template
        template = self.load_template()
        
        # Convert content
        doc_title, html_content = self.convert_html_content(html_file)
        
        # Use provided title or extracted title
        final_title = title or doc_title
        
        # Create safe filename
        safe_title = re.sub(r'[^a-zA-Z0-9\-_]', '-', final_title.lower())
        
        # Create directory
        resource_dir = Path(f'resources/{category}/{safe_title}')
        resource_dir.mkdir(parents=True, exist_ok=True)
        
        # Replace template placeholders
        template = template.replace('[RESOURCE TITLE]', final_title)
        template = template.replace('[RESOURCE DESCRIPTION]', description)
        template = template.replace('[RESOURCE TYPE]', '📚 Playbook')
        template = template.replace('[ESTIMATED TIME]', '45 min read')
        
        # Replace content sections
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
        
        # Save file
        output_path = resource_dir / 'index.html'
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(template)
        
        print(f"✅ Created: {output_path}")
        return str(output_path), final_title
    
    def update_registry(self, title, description, url, category='guides'):
        """Update the resource registry"""
        # Read current registry
        with open(self.registry_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Create new entry
        new_entry = f'''    {{
      title: '{title}',
      description: '{description}',
      url: '{url}',
      category: '{category.title()}',
      type: '📚 Playbook',
      time: '45 min read',
      featured: false
    }}'''
        
        # Find the appropriate category section and add entry
        pattern = f"('{category}': \\[)(.*?)(\\])"
        replacement = r"\1\2,\n" + new_entry + r"\n  \3"
        updated_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        # Write back
        with open(self.registry_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"✅ Updated registry for: {title}")
    
    def batch_convert(self, input_dir, category='guides'):
        """Convert multiple HTML files in a directory"""
        input_path = Path(input_dir)
        
        if not input_path.exists():
            print(f"❌ Input directory not found: {input_dir}")
            return
        
        # Find all HTML files
        html_files = list(input_path.glob('*.html'))
        
        if not html_files:
            print(f"❌ No HTML files found in {input_dir}")
            return
        
        print(f"🔄 Found {len(html_files)} files to convert...")
        
        for html_file in html_files:
            try:
                # Extract title from filename
                title = html_file.stem.replace('-', ' ').replace('_', ' ').title()
                description = f"Complete guide to {title.lower()}"
                
                # Create resource page
                output_path, final_title = self.create_resource_page(
                    html_file, title, description, category
                )
                
                # Update registry
                safe_title = re.sub(r'[^a-zA-Z0-9\-_]', '-', final_title.lower())
                url = f"/resources/{category}/{safe_title}/"
                
                self.update_registry(final_title, description, url, category)
                
            except Exception as e:
                print(f"❌ Error processing {html_file}: {e}")

def main():
    """Main function"""
    converter = BatchConverter()
    
    print("🚀 Nikonomics Batch Converter")
    print("=" * 40)
    
    # Example usage
    input_directory = input("Enter path to HTML files directory: ").strip()
    category = input("Enter category (guides/business-plans/calculators): ").strip() or 'guides'
    
    if input_directory:
        converter.batch_convert(input_directory, category)
    else:
        print("❌ No input directory provided")

if __name__ == "__main__":
    main()
