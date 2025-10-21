import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export default function LeadMagnet() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-10 h-10" />
              <h1 className="text-3xl font-bold">The Off-Market Acquisition Playbook</h1>
            </div>
            <p className="text-lg text-blue-100">
              Your Complete Guide to Finding & Closing 7-Figure Healthcare Businesses Before the Competition Even Knows They Exist
            </p>
            <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm font-semibold">EXCLUSIVE NIKONOMICS PODCAST RESOURCE</p>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="p-8 bg-gradient-to-b from-amber-50 to-white border-b-4 border-amber-400">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Why 87% of First-Time Buyers Fail</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Most entrepreneurs waste 6-12 months competing for the same 200 overpriced listings on BizBuySell. They end up paying 30-40% premiums in bidding wars, or worse—walking away empty-handed after burning through their budget on brokers and advisors.
                </p>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  The solution? Stop competing. Start prospecting where no one else is looking.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The 5-Step Off-Market Framework</h2>

            {/* Step 1 */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(1)}
                className="w-full bg-blue-50 hover:bg-blue-100 p-6 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Identify Fragmented Niches</h3>
                </div>
                {expandedSection === 1 ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedSection === 1 && (
                <div className="p-6 bg-white">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Fragmentation is your friend. When an industry has thousands of independent operators instead of a few large chains, you have leverage. Healthcare is the goldmine because 60-70% of practices are still independently owned.
                  </p>
                  <h4 className="font-bold text-gray-900 mb-3">Top Healthcare Niches for Off-Market Deals:</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h5 className="font-bold text-green-900 mb-2">🦷 Dental Practices</h5>
                      <p className="text-sm text-gray-700">165,000+ independent practices | Avg. valuation: $800K-$2M | High cash flow</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h5 className="font-bold text-green-900 mb-2">🏥 Urgent Care Centers</h5>
                      <p className="text-sm text-gray-700">9,000+ facilities | Avg. valuation: $1.5M-$4M | Growing demand</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h5 className="font-bold text-green-900 mb-2">💪 Physical Therapy</h5>
                      <p className="text-sm text-gray-700">38,000+ clinics | Avg. valuation: $600K-$1.5M | Aging population driver</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h5 className="font-bold text-green-900 mb-2">🏠 Home Health Agencies</h5>
                      <p className="text-sm text-gray-700">33,000+ agencies | Avg. valuation: $500K-$2M | Medicare-backed revenue</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="text-sm font-semibold text-blue-900 mb-2">PRO TIP:</p>
                    <p className="text-sm text-gray-700">
                      Look for niches where the average owner is 55+ years old. In healthcare, 40% of practice owners are approaching retirement but haven't listed their business yet—they're waiting for the "right buyer" to approach them.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(2)}
                className="w-full bg-blue-50 hover:bg-blue-100 p-6 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Build Your Owner Database</h3>
                </div>
                {expandedSection === 2 ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedSection === 2 && (
                <div className="p-6 bg-white">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Healthcare licensing makes sourcing easier than any other industry. Every practice must register publicly, giving you free access to owner names, business addresses, contact information, and entity structures.
                  </p>
                  <h4 className="font-bold text-gray-900 mb-3">Essential Data Sources:</h4>
                  <div className="space-y-4 mb-4">
                    <div className="border-l-4 border-indigo-600 pl-4">
                      <h5 className="font-bold text-gray-900 mb-1">NPI Registry (NPPES)</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        National Provider Identifier database - every healthcare provider in the US is listed here with business details, taxonomy codes, and practice locations.
                      </p>
                      <p className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
                        npiregistry.cms.hhs.gov
                      </p>
                    </div>
                    <div className="border-l-4 border-indigo-600 pl-4">
                      <h5 className="font-bold text-gray-900 mb-1">CMS Provider Data</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        Medicare/Medicaid participating providers with revenue indicators, patient volumes, and service histories - critical for valuation insights.
                      </p>
                      <p className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
                        data.cms.gov/provider-data
                      </p>
                    </div>
                    <div className="border-l-4 border-indigo-600 pl-4">
                      <h5 className="font-bold text-gray-900 mb-1">State Health Department Registries</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        State-specific licensing databases with entity ownership, inspection records, and compliance histories. Each state has its own portal.
                      </p>
                      <p className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
                        Search: "[State] health facility license lookup"
                      </p>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                    <p className="text-sm font-semibold text-purple-900 mb-2">WORKFLOW HACK:</p>
                    <p className="text-sm text-gray-700 mb-3">
                      Start with a geographic radius. Pull all licensed facilities within 50 miles of your target market, then cross-reference against broker listings to eliminate what's already for sale. What's left is your off-market goldmine.
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Time investment:</span> 2-4 hours to build a database of 100-200 prospects in your target niche.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(3)}
                className="w-full bg-blue-50 hover:bg-blue-100 p-6 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Craft Personalized Outreach</h3>
                </div>
                {expandedSection === 3 ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedSection === 3 && (
                <div className="p-6 bg-white">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Mass emails with "Are you looking to sell?" get 1-2% response rates. Personalized letters that show genuine interest and understanding get 15-20% responses. The difference is treating owners like people, not transactions.
                  </p>
                  <h4 className="font-bold text-gray-900 mb-3">What Makes Outreach Work:</h4>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Research their specific practice</p>
                        <p className="text-sm text-gray-700">Mention years in business, community involvement, or recent achievements you found online</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Lead with admiration, not acquisition</p>
                        <p className="text-sm text-gray-700">Express genuine interest in their business model and what they've built over the years</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Be transparent about your intent</p>
                        <p className="text-sm text-gray-700">Share that you're actively looking to acquire a practice and why theirs caught your attention</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Offer a no-pressure conversation</p>
                        <p className="text-sm text-gray-700">Invite them to a call to discuss their future plans, even if selling isn't on their radar yet</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <h5 className="font-bold text-gray-900 mb-3">Sample Opening (Physical Therapy Clinic):</h5>
                    <div className="text-sm text-gray-700 italic leading-relaxed">
                      <p className="mb-2">
                        "Dear Dr. Johnson,
                      </p>
                      <p className="mb-2">
                        I came across your practice while researching well-established physical therapy clinics in the Portland area. It's impressive to see a practice that's been serving the community for 22 years with such strong patient reviews.
                      </p>
                      <p className="mb-2">
                        I'm an entrepreneur looking to acquire and grow a physical therapy practice in Oregon, and I'm specifically interested in businesses like yours that have a strong reputation and loyal patient base.
                      </p>
                      <p>
                        Even if you haven't considered an exit, I'd value a brief conversation about your vision for the practice's future. Would you be open to a 15-minute call?"
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                    <p className="text-sm font-semibold text-amber-900 mb-2">MULTI-CHANNEL APPROACH:</p>
                    <p className="text-sm text-gray-700">
                      Send a physical letter first (90% open rate vs 20% for email), follow up with email after 7-10 days, then LinkedIn connection with a personalized note. Triple touchpoints = 3x response rate.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4 */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(4)}
                className="w-full bg-blue-50 hover:bg-blue-100 p-6 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Lead With Value, Not Money</h3>
                </div>
                {expandedSection === 4 ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedSection === 4 && (
                <div className="p-6 bg-white">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Most owners who've built a business for 20+ years care about more than just the check. They want to know their staff will be taken care of, their patients won't be abandoned, and their legacy will continue. Address these concerns upfront and you'll close deals competitors can't touch.
                  </p>
                  <h4 className="font-bold text-gray-900 mb-3">The Three Trust Pillars:</h4>
                  <div className="space-y-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                      <h5 className="font-bold text-green-900 mb-2">1. Staff Retention Commitment</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        Healthcare owners are loyal to their teams. Assure them you're committed to retaining key employees and offer employment agreements to prove it.
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">What to say:</span> "I want to retain your entire team. I'd like to offer 1-year employment agreements with raises to show my commitment to continuity."
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                      <h5 className="font-bold text-blue-900 mb-2">2. Patient Continuity Plan</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        Patients are the lifeblood of healthcare practices. Outline how you'll maintain quality of care, communication standards, and the same level of service.
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">What to say:</span> "I plan to keep the same hours, providers, and patient communication systems. I want this to feel like a seamless transition for your patients."
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                      <h5 className="font-bold text-purple-900 mb-2">3. Smooth Transition Strategy</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        Propose a 30-90 day transition period where the owner stays on as a consultant. This gives them peace of mind and gives you crucial knowledge transfer.
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">What to say:</span> "I'd like you to stay on for 60 days post-close to help with the transition. I'll compensate you as a consultant and learn everything I can from you."
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-sm font-semibold text-red-900 mb-2">AVOID THIS MISTAKE:</p>
                    <p className="text-sm text-gray-700">
                      Don't lead conversations with valuation, financing, or deal structure. These are important, but they come AFTER trust is established. Owners who feel understood will work with you on price. Owners who feel like a transaction will shop you around.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 5 */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(5)}
                className="w-full bg-blue-50 hover:bg-blue-100 p-6 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    5
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Use AI to Scale Your Research</h3>
                </div>
                {expandedSection === 5 ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedSection === 5 && (
                <div className="p-6 bg-white">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    The bottleneck in off-market sourcing isn't finding prospects—it's researching and personalizing outreach for hundreds of them. AI can cut your research time from 4 hours per prospect to 15 minutes, letting you scale from 5 contacts per week to 50.
                  </p>
                  <h4 className="font-bold text-gray-900 mb-3">High-Value AI Applications:</h4>
                  <div className="space-y-4 mb-4">
                    <div className="border-l-4 border-blue-600 pl-4">
                      <h5 className="font-bold text-gray-900 mb-2">Automated License Data Extraction</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        Use AI to scrape state licensing websites and organize data into spreadsheets with owner names, addresses, license numbers, and expiration dates.
                      </p>
                      <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded mb-2">
                        <span className="font-semibold">Tools:</span> ChatGPT with Code Interpreter, Claude, or custom Python scripts
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Prompt example:</span> "Extract all physical therapy clinic licenses from this state database page and create a CSV with facility name, owner name, address, license number, and issue date"
                      </p>
                    </div>
                    <div className="border-l-4 border-indigo-600 pl-4">
                      <h5 className="font-bold text-gray-900 mb-2">Owner Profile Summaries</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        Feed AI publicly available information (LinkedIn, practice websites, news articles) and get concise summaries of owner backgrounds, business histories, and potential selling motivations.
                      </p>
                      <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded mb-2">
                        <span className="font-semibold">Tools:</span> Perplexity AI, ChatGPT with web browsing, Claude
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Prompt example:</span> "Research Dr. Sarah Martinez who owns Westside Physical Therapy in Austin, TX. Summarize her background, how long she's owned the practice, any community involvement, and estimate her age based on education timeline"
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-600 pl-4">
                      <h5 className="font-bold text-gray-900 mb-2">Personalized Outreach Drafts</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        Generate customized letter and email templates based on owner research that you can quickly review and send. AI handles the first draft, you add the human touch.
                      </p>
                      <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded mb-2">
                        <span className="font-semibold">Tools:</span> ChatGPT, Claude, Jasper
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Prompt example:</span> "Write a personalized acquisition letter to Dr. Johnson who has owned Portland Physical Therapy for 22 years. Mention his longevity, patient reviews, and community presence. Keep it warm and consultative, not transactional"
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                    <p className="text-sm font-semibold text-green-900 mb-2">THE MULTIPLICATION EFFECT:</p>
                    <p className="text-sm text-gray-700 mb-2">
                      Without AI: Research 1 prospect = 3-4 hours. 5 prospects per week = your limit.
                    </p>
                    <p className="text-sm text-gray-700">
                      With AI: Research 1 prospect = 15 minutes. 50+ prospects per week = achievable while maintaining quality.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bonus Section */}
          <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h2 className="text-2xl font-bold mb-4">BONUS: Expected Timeline & Results</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Weeks 1-2</h3>
                <p className="text-sm text-blue-100">
                  Build database of 100-200 prospects. Complete initial research. Prepare outreach materials.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Weeks 3-8</h3>
                <p className="text-sm text-blue-100">
                  Send first wave of outreach. Expect 15-20 responses. Start initial conversations. Identify 3-5 serious opportunities.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Weeks 9-16</h3>
                <p className="text-sm text-blue-100">
                  Enter preliminary due diligence with top 2-3 prospects. Negotiate LOIs. Close your first off-market deal.
                </p>
              </div>
            </div>
            <div className="mt-6 bg-white/20 backdrop-blur rounded-lg p-4">
              <p className="font-bold text-lg mb-2">Average Success Rate:</p>
              <p className="text-sm text-blue-100">
                15-20% response rate on initial outreach → 5-8% serious conversations → 1-2% closed deals
              </p>
              <p className="text-sm text-blue-100 mt-2">
                Translation: Contact 100 prospects = 1-2 acquisitions within 4-6 months
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-8 bg-gray-50 border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Sourcing?</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              This framework has helped dozens of first-time buyers acquire healthcare businesses without ever touching a broker listing. The opportunity is massive—healthcare remains one of the most fragmented industries in America, with thousands of aging owners waiting for the right buyer to approach them.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed font-semibold">
              Don't wait for businesses to hit the market. Go find them yourself.
            </p>
            <div className="bg-blue-600 text-white p-6 rounded-lg">
              <p className="font-bold text-lg mb-2">Want more insights like this?</p>
              <p className="text-blue-100 text-sm mb-4">
                Subscribe to the Nikonomics Podcast for weekly strategies on business acquisition, entrepreneurship, and building wealth through ownership.
              </p>
              <div className="flex gap-3">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm">
                  Subscribe to Podcast
                </button>
                <button className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>© 2025 Nikonomics Podcast | Exclusive Lead Magnet for Followers</p>
        </div>
      </div>
    </div>
  );
}
