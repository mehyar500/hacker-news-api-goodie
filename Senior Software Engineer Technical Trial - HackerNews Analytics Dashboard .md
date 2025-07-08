This assessment evaluates your full-stack development skills, architectural decision-making, and ability to build a data-driven application optimized for performance, extensibility, and maintainability.

### **Time Frame**

Estimated effort: **10 hours**

**Objective**

Build a real-time analytics dashboard that fetches, processes, and visualizes Hacker News data, with a focus on AI-related topics, brands, and engagement patterns.

### **Data Source**

Use the [Hacker News public API](https://github.com/HackerNews/API):

| Endpoint | Description |
| :---- | :---- |
| `/v0/topstories.json` | Returns IDs of top stories |
| `/v0/item/<ID>.json` | Returns full story metadata |

Fetch the top **50 stories**, extracting:

* `title`, `url`, `time`, `score`, `descendants` (comments), `by` (author)

**Backend (Python – Django)**

Design and implement a maintainable API layer that:

* Efficiently fetches and caches story data  
* Implements a smart refresh strategy (e.g., TTL-based caching or timestamp checks)  
* Detects AI-related keywords or brand mentions (ChatGPT, Claude, Anthropic, etc.) in story titles   
* Extracts linked domains from story URLs  
* Exposes endpoints for:  
  * Raw stories  
  * Aggregated insights (e.g., keyword frequencies, top domains)  
* Handles common error cases gracefully (e.g., failed fetches, missing fields)  
* Type-safe backend using `pydantic` or `drf-spectacular`

### 

### **Frontend (React \+ TypeScript)**

Framework: **React (SSR)**

Build a responsive dashboard that includes:

#### **Analytics Dashboard**

* Brand/Keyword Frequency Chart (interactive)  
* Top Domains Chart

#### **Data Explorer**

* Ability to sort and filter data table (basic filters: keyword, date range)

### **Technical Requirements**

* Clean, modular architecture with separation of concerns  
* Efficient data fetching strategy   
* Fully responsive layout with error and loading states

### **Submission Checklist**

Your GitHub repository should include:

- [ ] ✅ Full source code (backend \+ frontend)  
- [ ] ✅ `README.md` including:  
      - [ ] Setup instructions  
      - [ ] Technical architecture overview with diagram  
      - [ ] Key design decisions and tradeoffs  
      - [ ] Future scaling considerations (e.g., more data sources or real-time updates)

### **Optional Enhancements (Time Permitting)**

These are not required, but will be viewed positively if any are implemented:

* Add a Redis or in-memory caching layer  
* Create a "Trending Topics" module using basic NLP  
* Implement WebSocket-based real-time story updates  
* Include a Score vs. Comments correlation chart  
* Add a "Saved Stories" feature using localStorage  
* Set up CI/CD via GitHub Actions or similar  
* Add basic unit tests for core backend or frontend logic

### **Evaluation Criteria**

| Category | Weight |
| :---- | :---- |
| Architecture & technical decisions | 30% |
| Code quality, structure, and organization | 30% |
| Data processing, caching, API design | 20% |
| UI implementation & user experience | 20% |

We're evaluating your ability to build maintainable, performant systems. Focus on clarity, design rationale, and thoughtful implementation — not feature overload.

### **Trial Presentation (1 Hour)**

Please prepare to walk us through your project in the following format:

* **15 min** – Architecture overview & key decisions  
* **15 min** – Live demo of the application  
* **15 min** – Code walkthrough (data flow, logic)  
* **15 min** – Q\&A with the team

