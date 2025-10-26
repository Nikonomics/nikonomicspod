# Nikonomics Toolkit - Content Conversion Workflow

This document outlines the step-by-step process for converting Google Docs and other content into HTML resources for the Nikonomics toolkit.

## Overview

The toolkit supports two main types of content:
1. **Static Content** (Business Plans, Guides, Templates) - Use `static-content.html` template
2. **Interactive Tools** (Calculators, Tools) - Use `calculator.html` template

## Quick Start

### For Static Content (Business Plans, Guides)

1. **Copy the template**
   ```bash
   cp resources/template/static-content.html resources/[category]/[resource-name]/index.html
   ```

2. **Update the template** with your content
3. **Add to resource registry** in `js/resources-data.js`
4. **Test locally** and push to GitHub

### For Interactive Tools (Calculators)

1. **Copy the template**
   ```bash
   cp resources/template/calculator.html resources/calculators/[tool-name]/index.html
   ```

2. **Customize the calculator** logic
3. **Add to resource registry** in `js/resources-data.js`
4. **Test locally** and push to GitHub

## Detailed Workflow

### Step 1: Prepare Your Content

#### For Google Docs:
1. Open your Google Doc
2. Copy the content (Ctrl+A, Ctrl+C)
3. Note the structure: headings, lists, examples, etc.

#### For Claude Artifacts:
1. Open the artifact in Claude
2. Copy the HTML content
3. Note any interactive elements or calculations

### Step 2: Choose the Right Template

#### Static Content Template (`static-content.html`)
Use for:
- Business plans
- Step-by-step guides
- How-to articles
- Templates and frameworks
- E-books and playbooks

#### Calculator Template (`calculator.html`)
Use for:
- ROI calculators
- Budget calculators
- Pricing calculators
- Financial projections
- Any interactive tool

### Step 3: Create the Resource Page

#### For Static Content:

1. **Create directory structure:**
   ```bash
   mkdir -p resources/[category]/[resource-name]
   ```

2. **Copy template:**
   ```bash
   cp resources/template/static-content.html resources/[category]/[resource-name]/index.html
   ```

3. **Replace placeholders in the HTML:**
   - `[RESOURCE TITLE]` → Your resource title
   - `[RESOURCE DESCRIPTION]` → Brief description
   - `[RESOURCE TYPE]` → e.g., "📄 PDF Template", "📖 Guide"
   - `[ESTIMATED TIME]` → e.g., "30 min read", "45 min setup"

4. **Structure your content:**
   - Replace `[Section 1 Title]`, `[Section 2 Title]`, etc. with your actual sections
   - Add your content under each section
   - Use proper HTML structure:
     ```html
     <h2 class="font-futura">Your Section Title</h2>
     <p class="text-refined">Your content here</p>
     ```

5. **Add examples and highlights:**
   ```html
   <div style="background: #F2F5F5; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
       <h4 class="text-refined-bold">Example:</h4>
       <p class="text-refined">Your example content</p>
   </div>
   ```

#### For Interactive Tools:

1. **Create directory structure:**
   ```bash
   mkdir -p resources/calculators/[tool-name]
   ```

2. **Copy template:**
   ```bash
   cp resources/template/calculator.html resources/calculators/[tool-name]/index.html
   ```

3. **Update the form fields:**
   - Replace `[Input Field 1 Label]` with your field labels
   - Add/remove input fields as needed
   - Update the dropdown options if applicable

4. **Customize the JavaScript:**
   - Replace the example calculations with your actual formulas
   - Update result labels and formatting
   - Add any specific validation rules

5. **Update the results display:**
   - Modify the result items to match your calculations
   - Update the main result display
   - Add any additional result formatting

### Step 4: Add to Resource Registry

1. **Open `js/resources-data.js`**

2. **Add your resource to the appropriate category:**
   ```javascript
   'business-plans': [
     // ... existing resources
     {
       title: 'Your Resource Title',
       description: 'Your resource description',
       url: '/resources/business-plans/your-resource/',
       category: 'Business Plan',
       type: '📄 PDF Template',
       time: '30 min read',
       featured: false
     }
   ]
   ```

3. **Update the main page** if needed (resources will appear automatically)

### Step 5: Test and Deploy

1. **Test locally:**
   ```bash
   cd /Users/nikolashulewsky/nikonomics-tools
   python3 -m http.server 8000
   ```
   Visit: `http://localhost:8000`

2. **Check your resource:**
   - Navigate to your resource from the main page
   - Test all links and functionality
   - Verify mobile responsiveness

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add [Resource Name]"
   git push origin main
   ```

4. **Deploy to Render:**
   - Changes will auto-deploy from GitHub
   - Check your live site after a few minutes

## Content Guidelines

### Writing Style
- Use clear, actionable language
- Include practical examples
- Break content into digestible sections
- Use bullet points and numbered lists
- Include "Key Takeaways" or "Action Items"

### HTML Structure
- Use semantic HTML tags (`<h1>`, `<h2>`, `<p>`, `<ul>`, `<ol>`)
- Apply the provided CSS classes for consistent styling
- Use the highlight boxes for important information
- Include proper navigation and back links

### Interactive Elements
- Make calculators user-friendly with clear labels
- Include helpful tooltips or explanations
- Provide real-time feedback where possible
- Add export/print functionality for results

## Common Patterns

### For Business Plans:
```html
<div class="content-section" id="executive-summary">
    <h2 class="font-futura">Executive Summary</h2>
    <p class="text-refined">Your executive summary content...</p>
</div>
```

### For Calculators:
```javascript
// Example calculation
const result = input1 * input2 * (1 + input3/100);
document.getElementById('result').textContent = this.formatCurrency(result);
```

### For Step-by-Step Guides:
```html
<h3 class="font-futura-medium">Step 1: [Action Title]</h3>
<p class="text-refined">[Detailed instructions]</p>
<div style="background: #F2F5F5; padding: 1.5rem; border-radius: 8px;">
    <h4 class="text-refined-bold">Pro Tip:</h4>
    <p class="text-refined">[Helpful tip]</p>
</div>
```

## Troubleshooting

### Common Issues:

1. **Resource not appearing on main page:**
   - Check the URL in `resources-data.js`
   - Ensure the file path is correct
   - Verify the resource is in the right category

2. **Styling not applied:**
   - Check that CSS classes are correctly applied
   - Ensure the `styles.css` file is linked
   - Verify the HTML structure matches the template

3. **Calculator not working:**
   - Check JavaScript console for errors
   - Verify form field IDs match the JavaScript
   - Test calculations manually

4. **Mobile responsiveness issues:**
   - Test on different screen sizes
   - Check the responsive CSS rules
   - Adjust grid layouts if needed

## Best Practices

1. **Keep it simple:** Don't overcomplicate the content structure
2. **Test thoroughly:** Always test locally before deploying
3. **Use consistent formatting:** Follow the template structure
4. **Include navigation:** Always provide back links to the main toolkit
5. **Optimize for mobile:** Test on mobile devices
6. **Add value:** Focus on actionable, practical content

## Support

If you need help with the conversion process:
1. Check this documentation first
2. Look at existing resources as examples
3. Test changes locally before deploying
4. Keep backups of your original content

Remember: The goal is to create valuable, easy-to-use resources that help your audience succeed in business.
