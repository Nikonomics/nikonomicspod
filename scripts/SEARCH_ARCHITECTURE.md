# Episode Search Architecture

## Overview

Building a hybrid search system that combines:
1. **Metadata search** - Fast filtering by industry, tags, topics
2. **Semantic search** - Deep AI-powered search across transcripts
3. **Keyword search** - Traditional text matching

## Current Assets

### Data
- ✅ **251 episodes** with 36 metadata fields each (`episodes_final.json`)
- ✅ **246 transcripts** (~30-50k characters each) in `resources/episodes/transcripts/`
- ✅ **Rich metadata**: Episode Summary, Topics (932), Tags (217), Industry Categories, Key Takeaways

### Missing (5 transcripts)
Episodes 1-6 likely don't have transcripts (intro/overview episodes)

## Search Architecture Options

### Option 1: Simple Client-Side Search (FASTEST TO BUILD)
**Implementation Time:** 1-2 hours
**Cost:** $0/month
**Best for:** MVP, getting feedback quickly

**How it works:**
```
User types query → JavaScript searches through:
  1. Episode metadata (titles, summaries, tags, topics)
  2. Pre-computed search index (lowercase, tokenized)
  3. Returns matching episodes instantly
```

**Pros:**
- No backend needed
- Instant results
- Works offline
- Zero cost

**Cons:**
- Can't search full transcripts (too large for browser)
- Basic keyword matching only
- No semantic understanding ("scaling a business" won't match "growing a company")

**Recommendation:** Start here, upgrade later if needed

---

### Option 2: Hybrid Search with Vector Database (MOST POWERFUL)
**Implementation Time:** 4-6 hours
**Cost:** ~$20-50/month
**Best for:** Production-ready deep search

**How it works:**
```
Setup Phase (one-time):
  1. Chunk each transcript into 500-word segments
  2. Generate embeddings for each chunk using OpenAI
  3. Store in vector database (Pinecone or local ChromaDB)
  4. Store metadata alongside vectors

Search Phase (real-time):
  User query → Generate query embedding → Vector search
  → Return top matching chunks with episode metadata
  → Rank by relevance
```

**Pros:**
- Semantic understanding ("scaling" matches "growth")
- Search full transcripts
- Find conceptual matches
- Can ask questions ("episodes about exits")

**Cons:**
- Requires backend API
- Embedding costs (~$5 to process all transcripts once)
- Vector DB hosting ($20-50/month or local)
- More complex to build

---

### Option 3: Claude-Powered Contextual Search (MOST INTELLIGENT)
**Implementation Time:** 2-3 hours
**Cost:** ~$10-30/month in API calls
**Best for:** Conversational search, "find me episodes about X"

**How it works:**
```
User query → Send to Claude with:
  - All episode metadata
  - User's question
  → Claude analyzes and returns ranked results
  → Optional: Pull full transcripts for deep questions
```

**Pros:**
- Natural language queries
- Can understand complex requests
- Leverage Claude's reasoning
- Easy to implement

**Cons:**
- Slower than vector search (2-5 seconds)
- Can't scale to searching full transcripts efficiently
- API cost per search

---

## Recommended Approach: Progressive Enhancement

### Phase 1: Client-Side Metadata Search (THIS WEEK)
Build in 1-2 hours:
- Search: Episode Summary, Topics, Tags, Business Activity
- Filters: Industry Category, Industry Subcategory
- No backend needed
- Deploy immediately

**User Experience:**
```
Search: "saas marketing"
Results:
  - Episodes tagged with 'saas' OR 'marketing'
  - Episodes with those words in summary
  - Episodes in SaaS industry category
```

### Phase 2: Add Vector Search for Transcripts (NEXT WEEK)
Add deep search capabilities:
- Process 246 transcripts into embeddings
- Set up vector database (ChromaDB locally first)
- Add "Deep Search" button that searches transcripts
- Progressive enhancement - metadata search still works if this fails

**User Experience:**
```
Search: "negotiation tactics for acquisitions"
Deep Search Results:
  - Finds episodes mentioning negotiation strategies
  - Even if tags/topics don't include exact phrase
  - Shows relevant transcript snippets
```

### Phase 3: Analytics Dashboard (LATER)
Once you have performance data:
- Which episodes perform best by industry
- Guest type correlation with views
- Topic trends over time

## Implementation Plan for Phase 1 (Client-Side Search)

### Files to Create

1. **`search-index.json`** - Pre-computed search index
```json
{
  "episodes": [
    {
      "id": 7,
      "title": "...",
      "searchable_text": "lowercase tokenized all searchable fields",
      "topics": ["saas", "marketing"],
      "tags": ["sales", "b2b"],
      "industry_category": "Technology & SaaS",
      "industry_subcategory": "Software/SaaS"
    }
  ],
  "index": {
    "saas": [7, 12, 45],
    "marketing": [7, 23, 89]
  }
}
```

2. **`search.js`** - Search logic
```javascript
function search(query, filters) {
  // 1. Tokenize query
  // 2. Search index for matches
  // 3. Apply filters (industry, etc)
  // 4. Rank results
  // 5. Return top 20
}
```

3. **Update `episodes.html`** - Add search UI
```html
<input type="search" placeholder="Search episodes...">
<select id="industry-filter">...</select>
<div id="search-results"></div>
```

### Build Script

```python
# build_search_index.py
# 1. Load episodes_final.json
# 2. For each episode:
#    - Combine searchable fields
#    - Tokenize and lowercase
#    - Build inverted index
# 3. Save search-index.json
```

## Estimated Costs & Performance

### Option 1: Client-Side
- **Cost:** $0
- **Search Speed:** <50ms
- **Coverage:** Metadata only

### Option 2: Vector Search
- **One-time setup:** ~$5 (embeddings)
- **Monthly hosting:** $0 (ChromaDB local) or $20-50 (Pinecone)
- **Per search:** ~$0.0001
- **Search Speed:** 100-500ms
- **Coverage:** Full transcripts

### Option 3: Claude Search
- **Per search:** ~$0.01-0.03
- **Search Speed:** 2-5 seconds
- **Coverage:** Full dataset
- **Monthly (100 searches/day):** ~$30-90

## Technical Stack Recommendation

### Phase 1 (Now)
- **Frontend:** Vanilla JS (no framework needed)
- **Data:** Static JSON files
- **Hosting:** GitHub Pages or existing hosting

### Phase 2 (Later)
- **Vector DB:** ChromaDB (local, free) or Pinecone (hosted, $20/mo)
- **Embeddings:** OpenAI text-embedding-3-small ($0.02 per 1M tokens)
- **Backend:** Python FastAPI or Flask
- **Hosting:** Fly.io or Railway ($5-10/mo)

## Next Steps

1. Build Phase 1 client-side search (1-2 hours)
2. Deploy and get user feedback
3. If users want deeper search → Add Phase 2 vector search
4. If users ask questions → Add Phase 3 Claude search

**Decision point:** Do you want to start with Phase 1 (simple, fast) or jump to Phase 2 (powerful, slower)?
