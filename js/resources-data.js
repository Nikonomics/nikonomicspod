// Nikonomics Resources Registry
// This file manages all resources for the toolkit hub
// To add a new resource: 1) Create the resource page, 2) Add entry here, 3) Resource appears automatically

const resources = {
  'business-plans': [
    {
      title: 'Christmas Tree Lot Business Plan',
      description: 'Complete business plan for seasonal Christmas tree lot with 25-40% net margins, location selection strategies, and 6-week revenue cycle optimization',
      url: '/resources/christmas-tree-lot/',
      category: 'Business Plan',
      type: '📄 Business Plan',
      time: '50 min read',
      featured: false
    },
    {
      title: 'Shaved Ice Stand Business Plan',
      description: 'Complete business plan for starting a shaved ice business with 88-94% margins, event booking strategies, and seasonal success framework',
      url: '/resources/shaved-ice-business-plan/',
      category: 'Business Plan',
      type: '📄 Business Plan',
      time: '45 min read',
      featured: false
    },
    {
      title: 'Complete Business Plan Template',
      description: 'Step-by-step guide to creating a professional business plan that investors and lenders will love',
      url: '/resources/business-plans/complete-template/',
      category: 'Business Plan',
      type: '📄 PDF Template',
      time: '30 min read',
      featured: false
    },
    {
      title: 'Lean Canvas Template',
      description: 'One-page business model canvas to quickly validate and iterate on your business idea',
      url: '/resources/business-plans/lean-canvas/',
      category: 'Framework',
      type: '📋 Interactive',
      time: '15 min',
      featured: false
    },
    {
      title: '3-Year Financial Projections',
      description: 'Excel template with built-in formulas for revenue, expenses, and cash flow projections',
      url: '/resources/business-plans/financial-projections/',
      category: 'Financial Model',
      type: '📊 Excel',
      time: '45 min setup',
      featured: false
    }
  ],
  'calculators': [
    {
      title: 'Business Investment ROI Calculator',
      description: 'Calculate the return on investment for marketing campaigns, equipment purchases, and business investments',
      url: '/resources/calculators/roi-calculator/',
      category: 'ROI Calculator',
      type: '🧮 Interactive',
      time: '5 min',
      featured: false
    },
    {
      title: 'Marketing Budget Calculator',
      description: 'Determine the optimal marketing spend based on your revenue, industry, and growth stage',
      url: '/resources/calculators/marketing-budget/',
      category: 'Budgeting',
      type: '💰 Interactive',
      time: '10 min',
      featured: false
    },
    {
      title: 'Service Pricing Calculator',
      description: 'Find the right price for your services based on costs, desired profit margins, and market rates',
      url: '/resources/calculators/service-pricing/',
      category: 'Pricing',
      type: '💵 Interactive',
      time: '15 min',
      featured: false
    }
  ],
  'guides': [
    {
      title: 'How to Find Off-Market Businesses',
      description: 'Complete framework for identifying and approaching business owners who aren\'t actively selling',
      url: '/resources/guides/off-market-businesses/',
      category: 'Acquisition',
      type: '📖 Guide',
      time: '45 min read',
      featured: false
    },
    {
      title: 'Content Marketing Playbook',
      description: 'Step-by-step guide to building a content marketing system that generates leads and sales',
      url: '/resources/guides/content-marketing/',
      category: 'Marketing',
      type: '📚 Playbook',
      time: '60 min read',
      featured: false
    },
    {
      title: 'Business Process Documentation',
      description: 'Framework for documenting and optimizing your business processes for consistency and growth',
      url: '/resources/guides/process-documentation/',
      category: 'Operations',
      type: '📋 Template',
      time: '30 min read',
      featured: false
    }
  ],
  'featured': [
    {
      title: 'The Off-Market Acquisition Playbook',
      description: 'Your complete guide to finding & closing 7-figure healthcare businesses before the competition even knows they exist. Interactive framework with real-world examples.',
      url: '/resources/off-market-playbook/',
      category: 'Featured',
      type: '🎯 Interactive Guide',
      time: '90 min',
      featured: true
    }
  ]
};

// Helper functions for resource management
function getAllResources() {
  const allResources = [];
  Object.keys(resources).forEach(category => {
    if (category !== 'featured') {
      allResources.push(...resources[category]);
    }
  });
  return allResources;
}

function getFeaturedResources() {
  return resources.featured || [];
}

function getResourcesByCategory(category) {
  return resources[category] || [];
}

function getResourceByUrl(url) {
  const allResources = getAllResources();
  const featuredResources = getFeaturedResources();
  return [...allResources, ...featuredResources].find(resource => resource.url === url);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    resources,
    getAllResources,
    getFeaturedResources,
    getResourcesByCategory,
    getResourceByUrl
  };
}
