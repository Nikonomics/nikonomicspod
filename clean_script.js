    <script>
        // Initialize Lucide icons when page loads
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            } else {
                console.log('Lucide not loaded yet, retrying...');
                setTimeout(() => {
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }
                }, 100);
            }
        });

        // Toggle section functionality
        function toggleSection(sectionNumber) {
            console.log('Toggling section:', sectionNumber);
            const section = document.getElementById(`section-${sectionNumber}`);
            const chevron = document.getElementById(`chevron-${sectionNumber}`);
            
            if (!section || !chevron) {
                console.error('Element not found for section:', sectionNumber);
                return;
            }
            
            if (section.classList.contains('hidden')) {
                section.classList.remove('hidden');
                chevron.setAttribute('data-lucide', 'chevron-up');
                console.log('Expanding section:', sectionNumber);
            } else {
                section.classList.add('hidden');
                chevron.setAttribute('data-lucide', 'chevron-down');
                console.log('Collapsing section:', sectionNumber);
            }
            
            // Re-initialize icons after changing attributes
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }

        // Button functionality
        function subscribeToPodcast() {
            const podcastUrls = {
                spotify: 'https://open.spotify.com/show/0vmmQi1QAMugxu8iDzHqHT',
                apple: 'https://podcasts.apple.com/us/podcast/nikonomics-the-economics-of-small-business/id1740361365',
                youtube: 'https://www.youtube.com/@nikonomicspod',
                buzzsprout: 'https://www.buzzsprout.com/YOUR_PODCAST_ID'
            };
            
            const choice = confirm('Choose your preferred platform:\n\nOK = Spotify\nCancel = Apple Podcasts\n\nOr visit our main website for all options.');
            
            if (choice) {
                window.open(podcastUrls.spotify, '_blank');
            } else {
                window.open(podcastUrls.apple, '_blank');
            }
        }

        function downloadPDF() {
            const pdfWindow = window.open('', '_blank');
            pdfWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Off-Market Acquisition Playbook - PDF</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; margin-bottom: 30px; border-radius: 10px; }
                        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
                        .step { margin: 30px 0; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; }
                        .step-header { background: #f8f9fa; padding: 20px; font-weight: bold; font-size: 1.2rem; }
                        .step-content { padding: 20px; background: white; }
                        .step-number { background: #007bff; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; }
                        .pro-tip { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 5px; }
                        .highlight-box { background: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 15px 0; border-radius: 5px; }
                        @media print { body { margin: 0; } .step { page-break-inside: avoid; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>🎯 The Off-Market Acquisition Playbook</h1>
                        <p>Your Complete Guide to Finding & Closing 7-Figure Healthcare Businesses Before the Competition Even Knows They Exist</p>
                        <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 20px; display: inline-block; margin-top: 20px; font-weight: bold;">EXCLUSIVE NIKONOMICS PODCAST RESOURCE</div>
                    </div>
                    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 5px;">
                        <h2>⚠️ Why 87% of First-Time Buyers Fail</h2>
                        <p>Most entrepreneurs waste 6-12 months competing for the same 200 overpriced listings on BizBuySell. They end up paying 30-40% premiums in bidding wars, or worse—walking away empty-handed after burning through their budget on brokers and advisors.</p>
                        <p><strong>The solution? Stop competing. Start prospecting where no one else is looking.</strong></p>
                    </div>
                    <h2>The 5-Step Off-Market Framework</h2>
                    <div class="step">
                        <div class="step-header"><span class="step-number">1</span>Identify Fragmented Niches</div>
                        <div class="step-content">
                            <p>Fragmentation is your friend. When an industry has thousands of independent operators instead of a few large chains, you have leverage. Healthcare is the goldmine because 60-70% of practices are still independently owned.</p>
                            <h3>Top Healthcare Niches for Off-Market Deals:</h3>
                            <ul>
                                <li><strong>🦷 Dental Practices</strong> - 165,000+ independent practices | Avg. valuation: $800K-$2M | High cash flow</li>
                                <li><strong>🏥 Urgent Care Centers</strong> - 9,000+ facilities | Avg. valuation: $1.5M-$4M | Growing demand</li>
                                <li><strong>💪 Physical Therapy</strong> - 38,000+ clinics | Avg. valuation: $600K-$1.5M | Aging population driver</li>
                                <li><strong>🏠 Home Health Agencies</strong> - 33,000+ agencies | Avg. valuation: $500K-$2M | Medicare-backed revenue</li>
                            </ul>
                            <div class="pro-tip"><strong>PRO TIP:</strong> Look for niches where the average owner is 55+ years old. In healthcare, 40% of practice owners are approaching retirement but haven't listed their business yet—they're waiting for the "right buyer" to approach them.</div>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-header"><span class="step-number">2</span>Build Your Owner Database</div>
                        <div class="step-content">
                            <p>Healthcare licensing makes sourcing easier than any other industry. Every practice must register publicly, giving you free access to owner names, business addresses, contact information, and entity structures.</p>
                            <h3>Essential Data Sources:</h3>
                            <ul>
                                <li><strong>NPI Registry (NPPES)</strong> - National Provider Identifier database with business details, taxonomy codes, and practice locations</li>
                                <li><strong>CMS Provider Data</strong> - Medicare/Medicaid participating providers with revenue indicators and patient volumes</li>
                                <li><strong>State Health Department Registries</strong> - State-specific licensing databases with entity ownership and compliance histories</li>
                            </ul>
                            <div class="highlight-box"><strong>WORKFLOW HACK:</strong> Start with a geographic radius. Pull all licensed facilities within 50 miles of your target market, then cross-reference against broker listings to eliminate what's already for sale. What's left is your off-market goldmine.</div>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-header"><span class="step-number">3</span>Craft Personalized Outreach</div>
                        <div class="step-content">
                            <p>Mass emails with "Are you looking to sell?" get 1-2% response rates. Personalized letters that show genuine interest and understanding get 15-20% responses. The difference is treating owners like people, not transactions.</p>
                            <h3>What Makes Outreach Work:</h3>
                            <ul>
                                <li>Research their specific practice - mention years in business, community involvement, or recent achievements</li>
                                <li>Lead with admiration, not acquisition - express genuine interest in their business model</li>
                                <li>Be transparent about your intent - share that you're actively looking to acquire a practice</li>
                                <li>Offer a no-pressure conversation - invite them to discuss their future plans</li>
                            </ul>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-header"><span class="step-number">4</span>Lead With Value, Not Money</div>
                        <div class="step-content">
                            <p>Most owners who've built a business for 20+ years care about more than just the check. They want to know their staff will be taken care of, their patients won't be abandoned, and their legacy will continue.</p>
                            <h3>The Three Trust Pillars:</h3>
                            <ul>
                                <li><strong>Staff Retention Commitment</strong> - Offer employment agreements to show commitment to continuity</li>
                                <li><strong>Patient Continuity Plan</strong> - Outline how you'll maintain quality of care and service</li>
                                <li><strong>Smooth Transition Strategy</strong> - Propose a 30-90 day transition period with the owner as consultant</li>
                            </ul>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-header"><span class="step-number">5</span>Use AI to Scale Your Research</div>
                        <div class="step-content">
                            <p>The bottleneck in off-market sourcing isn't finding prospects—it's researching and personalizing outreach for hundreds of them. AI can cut your research time from 4 hours per prospect to 15 minutes.</p>
                            <h3>High-Value AI Applications:</h3>
                            <ul>
                                <li><strong>Automated License Data Extraction</strong> - Use AI to scrape state licensing websites and organize data</li>
                                <li><strong>Owner Profile Summaries</strong> - Get concise summaries of owner backgrounds and potential selling motivations</li>
                                <li><strong>Personalized Outreach Drafts</strong> - Generate customized letter templates based on owner research</li>
                            </ul>
                        </div>
                    </div>
                    <div style="background: #007bff; color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0;">
                        <h2>Ready to Start Sourcing?</h2>
                        <p>This framework has helped dozens of first-time buyers acquire healthcare businesses without ever touching a broker listing. The opportunity is massive—healthcare remains one of the most fragmented industries in America.</p>
                        <p><strong>Don't wait for businesses to hit the market. Go find them yourself.</strong></p>
                    </div>
                    <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #ddd; color: #666;">
                        <p><strong>Want more insights like this?</strong></p>
                        <p>Subscribe to the Nikonomics Podcast for weekly strategies on business acquisition, entrepreneurship, and building wealth through ownership.</p>
                        <p>© 2025 Nikonomics Podcast | Exclusive Lead Magnet for Followers</p>
                    </div>
                    <script>
                        setTimeout(() => { window.print(); }, 1000);
                    </script>
                </body>
                </html>
            `);
            pdfWindow.document.close();
        }

        // Navigation function
        function goBack() {
            if (document.referrer && document.referrer.includes("nikonomics")) {
                window.history.back();
            } else {
                window.location.href = "../index.html";
            }
        }
    </script>
