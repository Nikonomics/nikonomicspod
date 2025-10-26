# 🤖 Automation Setup for Nikonomics Toolkit

## Quick Start (Recommended)

### Method 1: Export from Google Docs (Easiest)

1. **Export your Google Docs as HTML:**
   - Open each Google Doc
   - File → Download → Web Page (.html)
   - Save all HTML files in a folder (e.g., `~/Downloads/playbooks/`)

2. **Run the batch converter:**
   ```bash
   cd /Users/nikolashulewsky/nikonomics-tools
   python3 scripts/batch-converter.py
   ```

3. **Follow the prompts:**
   - Enter path to your HTML files
   - Choose category (guides/business-plans/calculators)
   - Done! ✨

### Method 2: Google Docs API (Advanced)

1. **Set up Google API credentials:**
   ```bash
   # Install required packages
   pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib beautifulsoup4
   
   # Get credentials from Google Cloud Console
   # Save as 'credentials.json' in the scripts folder
   ```

2. **Run the API converter:**
   ```bash
   python3 scripts/google-docs-converter.py
   ```

3. **Update the document IDs in the script with your actual Google Doc IDs**

## 🚀 **Super Simple Method (No Coding)**

### Step 1: Export from Google Docs
1. Open each Google Doc
2. File → Download → Web Page (.html)
3. Save in a folder like `~/Downloads/playbooks/`

### Step 2: Use the Batch Converter
```bash
cd /Users/nikolashulewsky/nikonomics-tools
python3 scripts/batch-converter.py
```

### Step 3: Follow Prompts
- Enter: `/Users/nikolashulewsky/Downloads/playbooks/`
- Choose category: `guides`
- Press Enter

**That's it!** All your playbooks will be converted and added to the website.

## 📁 **File Structure After Conversion**

```
/nikonomics-tools/
  /resources/
    /guides/
      /customer-acquisition-playbook/
        index.html
      /content-marketing-playbook/
        index.html
      /sales-funnel-playbook/
        index.html
    /business-plans/
      /startup-business-plan/
        index.html
```

## 🔧 **Manual Override (If Needed)**

If you want to customize any converted playbook:

1. **Edit the generated file:**
   ```bash
   # Open any converted playbook
   open resources/guides/customer-acquisition-playbook/index.html
   ```

2. **Make your changes** (add custom styling, sections, etc.)

3. **Test locally:**
   ```bash
   python3 -m http.server 8000
   # Visit: http://localhost:8000/nikonomics-tools/
   ```

## 🎯 **Pro Tips**

### For Best Results:
1. **Clean up your Google Docs first:**
   - Use consistent heading styles (Heading 1, Heading 2, etc.)
   - Remove any complex formatting
   - Keep it simple and readable

2. **Organize by category:**
   - Guides → `guides/`
   - Business Plans → `business-plans/`
   - Calculators → `calculators/`

3. **Test after conversion:**
   - Always check the converted pages
   - Make sure links work
   - Verify mobile responsiveness

### Troubleshooting:
- **"No module named 'bs4'"** → Run: `pip install beautifulsoup4`
- **"Permission denied"** → Make sure you're in the right directory
- **"File not found"** → Check the path to your HTML files

## 🚀 **Next Steps After Conversion**

1. **Test locally:**
   ```bash
   python3 -m http.server 8000
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add converted playbooks"
   git push origin main
   ```

3. **Deploy to Render:**
   - Changes will auto-deploy
   - Check your live site in a few minutes

## 📊 **Expected Results**

After running the converter, you should see:
- ✅ All playbooks converted to HTML
- ✅ Added to the main toolkit page
- ✅ Proper navigation and styling
- ✅ Mobile-responsive design
- ✅ Newsletter signup integration

**Time to convert 10 playbooks: ~5 minutes** ⚡
