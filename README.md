# Offline Customer Support Chatbot with Ollama & Llama 3.2

A production-ready, open-source customer support chatbot demonstrating how to deploy an LLM entirely locally for data-sensitive e-commerce applications. Built with Python, Ollama, and Meta's Llama 3.2 3B model.

**🔐 Privacy-First**: All processing happens on your local machine—zero data sent to the cloud.
**⚡ Zero Latency**: No API calls, no rate limits, no dependency on third-party services.
**📊 Benchmark-Ready**: Includes evaluation framework comparing zero-shot vs. one-shot prompting.

---

## 📋 Project Overview

### Problem Statement
Companies handling sensitive customer data (names, addresses, order histories) face significant compliance risks when using cloud-based LLM APIs (GDPR, CCPA, DPDP compliance). This project demonstrates that smaller, open-weight LLMs like **Llama 3.2 3B** can effectively handle first-line customer support **entirely offline**.

### Key Findings
- **One-shot prompting improves quality by 12.6%** compared to zero-shot
- **4.9 / 5.0 average response quality** achieved with guided prompting
- **100% coherence** across all responses (no grammatical failures)
- **Policy-specific queries improved by +1.7 points** with one-shot examples

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   Customer Support Queries (20)      │ ← Adapted from Ubuntu Dialogue Corpus
│   • Tracking, returns, payments     │
│   • International shipping, rewards  │
│   • Account issues, warranties       │
└────────────┬────────────────────────┘
             │
             ├──────────────────────────────┐
             │                              │
    ┌────────▼─────────┐         ┌────────▼──────────┐
    │ Zero-Shot Method │         │ One-Shot Method   │
    │ (No examples)    │         │ (1 policy example)│
    └────────┬─────────┘         └────────┬──────────┘
             │                           │
             └──────────────┬────────────┘
                            │
                    ┌───────▼────────┐
                    │ Ollama Server  │
                    │ (localhost:    │
                    │  11434)        │
                    └───────┬────────┘
                            │
                    ┌───────▼────────────┐
                    │ Llama 3.2 Model    │
                    │ (3B parameters)    │
                    │ (Quantized)        │
                    └───────┬────────────┘
                            │
                    ┌───────▼────────┐
                    │ Responses →    │
                    │ eval/results.md│
                    │ (Scored &      │
                    │  analyzed)     │
                    └────────────────┘
```

---

## 📂 Project Structure

```
llama3-support-bot/
├── chatbot.py                    # Main orchestration script
├── requirements.txt              # Dependencies (requests, datasets)
│
├── prompts/
│   ├── zero_shot_template.txt   # No examples prompt
│   └── one_shot_template.txt    # Policy example prompt
│
├── eval/
│   └── results.md               # Complete evaluation table + scoring
│
├── docs/
│   ├── README.md                # Architecture overview
│   ├── architecture.md          # System design deep-dive
│   └── workflow.md              # Step-by-step execution flow
│
├── static/                       # Optional web UI
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── setup.md                      # Installation & setup guide
├── report.md                     # Detailed analysis & conclusions
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- 4GB RAM minimum (2GB for model, 2GB for OS/overhead)
- 15 minutes setup time (first-run model download)

### 1. Install Ollama

Download and install from [ollama.ai](https://ollama.ai) for macOS, Windows, or Linux.

Verify installation:
```bash
ollama --version
```

### 2. Pull Llama 3.2 Model

```bash
ollama pull llama3.2:3b
```

**Note**: First pull downloads ~2GB. Subsequent runs use cached model.

### 3. Set Up Python Environment

```bash
# Clone the repository
git clone https://github.com/shahanth4444/llama3-support-bot.git
cd llama3-support-bot

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Run Evaluation

```bash
python chatbot.py
```

**Output**: Populates `eval/results.md` with 40 responses (20 queries × 2 methods)

**What happens**:
1. Script checks Ollama server availability
2. Processes each query with zero-shot template
3. Processes each query with one-shot template
4. Logs responses with placeholders for manual scoring

### 5. Score Results

Open `eval/results.md` and hand-score each response:
- **Relevance** (1-5): Does it address the query?
- **Coherence** (1-5): Is it grammatically correct?
- **Helpfulness** (1-5): Is it actionable?

### 6. Review Analysis

Read `report.md` for:
- Quantitative comparison (averages by method)
- Qualitative observations (success/failure patterns)
- Production recommendations
- Limitations & next steps

---

## 📊 Evaluation Results Summary

### Performance by Prompting Method

| Metric | Zero-Shot | One-Shot | Difference |
|--------|-----------|----------|-----------|
| **Relevance** | 4.15 | 4.95 | +0.80 ✅ |
| **Coherence** | 5.0 | 5.0 | — (Perfect) |
| **Helpfulness** | 3.9 | 4.8 | +0.90 ✅ |
| **Overall** | 4.35 | 4.9 | **+12.6%** |

### Best & Worst Performers

**Strongest (Both methods 5/5)**:
- Order tracking
- Password reset
- Order cancellation
- Newsletter signup

**Needs Improvement (One-shot advantage most pronounced)**:
- International shipping policies (+1.7 pts)
- Loyalty program details (+1.7 pts)
- Contact information (+1.7 pts)
- Return policies (+1.0 pts)

---

## 🎯 Key Insights

### 1️⃣ One-Shot Prompting Matters
Including a single, high-quality example improved responses significantly. The model learned to be more specific, confident, and action-oriented—mimicking the example's tone.

### 2️⃣ Policy-Specific Knowledge Requires Grounding
Zero-shot responses hedged with "I don't have specific information..." for policy questions. **Solution**: Retrieval-Augmented Generation (RAG) to inject company policies into the prompt.

### 3️⃣ Llama 3.2 3B is Coherent & Reliable
100% coherence rate across all responses. No grammatical failures, no incoherent outputs—the model's language generation is production-grade.

### 4️⃣ Procedural Queries Don't Require Examples
Password resets, tracking, and cancellations scored perfectly even with zero-shot prompting. The model has strong pre-trained knowledge of standard workflows.

### 5️⃣ Privacy Win: Total Inference Cost is Zero
After the one-time ~2GB download, every query costs $0 to process. Compare to cloud APIs:
- OpenAI: ~$0.003 per query
- Potential savings: 100K queries/month = $300–$500/month saved
- Privacy: 100% data remains on-premise

---

## 🔧 Technical Specifications

### Model Details
- **Name**: Llama 3.2 (3B parameters)
- **Quantization**: Q4 (4-bit, ~2GB)
- **Training**: Instruction-tuned on general e-commerce & support data
- **Context Window**: 8192 tokens
- **Latency**: 3–10 seconds per query (CPU-dependent)

### API Integration
- **Endpoint**: `http://localhost:11434/api/generate`
- **Method**: HTTP POST
- **Response Format**: JSON with `response` key containing generated text

### Hardware Requirements
| Component | Minimum | Recommended | Ideal |
|-----------|---------|-------------|-------|
| RAM | 4 GB | 8 GB | 16 GB |
| CPU | 2 cores | 4 cores | 8+ cores |
| Storage | 3 GB free | 5 GB | 10 GB |
| GPU | — | Optional | NVIDIA/AMD (10x speedup) |

---

## 📖 Documentation

- **[setup.md](setup.md)**: Step-by-step installation guide
- **[report.md](report.md)**: Full analysis, methodology, conclusions
- **[docs/architecture.md](docs/architecture.md)**: System design details
- **[docs/workflow.md](docs/workflow.md)**: Query processing flow

---

## 💡 Use Cases

✅ **Ideal For**:
- First-line triage & FAQs
- Procedural guidance (returns, tracking, account help)
- 24/7 support for offline environments
- Privacy-sensitive industries (healthcare, finance, government)
- Cost reduction in high-volume support centers

❌ **Not Recommended For**:
- Real-time order/inventory lookups (no DB integration)
- Sensitive account actions (requires human verification)
- Complex decision-making (escalations, fraud detection)
- Production without RAG for policy grounding

---

## 🔐 Privacy & Security

This implementation prioritizes data privacy:

| Feature | Status |
|---------|--------|
| Local processing | ✅ All data stays on-premise |
| Cloud dependency | ❌ None (fully offline) |
| Data persistence | ❌ No logs stored by default |
| API keys | ❌ Not required |
| GDPR compliant | ✅ Yes (no 3rd-party data sharing) |
| CCPA compliant | ✅ Yes (user controls all data) |

---

## 🚀 Next Steps & Extensions

### 1. Implement Retrieval-Augmented Generation (RAG)
```python
# Load company policies into a vector DB
# On each query: retrieve relevant policies
# Inject policies into one-shot prompt
# → Eliminate hallucination, improve accuracy
```

### 2. Add Multi-Turn Support
```python
# Maintain conversation history per session
# Pass context to each new query
# → Support follow-up clarifications
```

### 3. Deploy as API Service
```bash
# Run chatbot.py as a Flask/FastAPI server
# Expose /api/chat endpoint
# → Integrate with existing support platforms
```

### 4. Compare Other Models
```bash
ollama pull mistral:7b
ollama pull neural-chat
# Benchmark against Llama 3.2 3B
```

### 5. Add Human-in-the-Loop
```python
# Flag uncertain responses (confidence < 0.7)
# Route to human agent
# Collect feedback for continuous improvement
```

---

## 📊 Evaluation Methodology

See [report.md](report.md) for full details, but briefly:

1. **20 E-commerce Queries**: Adapted from Ubuntu Dialogue Corpus
2. **2 Prompting Methods**: Zero-shot and one-shot templates
3. **3 Scoring Dimensions**: Relevance, coherence, helpfulness (1-5 each)
4. **Manual Evaluation**: Subjective scoring based on real-world support standards
5. **Quantitative Analysis**: Averages, deltas, category breakdowns

---

## 📝 License & Attribution

Open source. Use freely for academic and commercial projects.

**Attribution**:
- **Model**: Meta's Llama 3.2 (open-weight)
- **Server**: Ollama (Apache 2.0)
- **Data Source**: Ubuntu Dialogue Corpus (research dataset)

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] Multi-turn conversation support
- [ ] RAG integration with policy database
- [ ] Performance benchmarking (latency, throughput)
- [ ] Comparison with other local models
- [ ] Web UI enhancements
- [ ] Multilingual support

---

## ❓ FAQ

**Q: Can I use a GPU to speed things up?**
A: Yes! Install `ollama` GPU support for your hardware (CUDA for NVIDIA, ROCm for AMD). Responses will be ~5–10x faster.

**Q: What if I need responses in non-English?**
A: Llama 3.2 supports multiple languages. Adjust prompts and queries accordingly. Results may vary by language.

**Q: Is this production-ready?**
A: For basic use, yes. For critical systems, add:
- RAG for policy grounding
- Confidence scoring & escalation logic
- Multi-turn context management
- Input validation & rate limiting

**Q: How do I run this in Docker?**
A: See [docs/workflow.md](docs/workflow.md) for containerization guide.

**Q: Can I swap Llama for another model?**
A: Absolutely. Any model available on Ollama works. Update `MODEL_NAME` in `chatbot.py`.

---

## 📞 Support

For issues or questions:
1. Check [setup.md](setup.md) for common setup problems
2. Review [report.md](report.md) for evaluation context
3. Inspect `chatbot.py` for API details
4. Open an issue on GitHub

---

## 📈 Results Overview

**Executive Summary of Findings**:

✅ **Feasibility Confirmed**: Llama 3.2 3B can provide high-quality, coherent customer support responses entirely on local hardware.

✅ **One-Shot Prompting Effective**: A single well-crafted example improved overall quality by 12.6%, with helpfulness improving by 23%.

⚠️ **Policy Grounding Required**: For production deployment, implement RAG to inject company-specific policies and eliminate hallucination on policy-specific questions.

✅ **Privacy & Cost Benefits**: Zero cloud connectivity, zero per-query costs, and full GDPR/CCPA compliance.

### Recommendation
**Deploy with confidence for procedural support queries (tracking, password resets, general info). For policy-specific inquiries, use RAG-enhanced prompting or human escalation.**

---

**Last Updated**: May 7, 2026  
**Project Status**: ✅ Complete & Production-Ready  
**Model**: Llama 3.2 3B via Ollama  
**Repository**: [github.com/shahanth4444/llama3-support-bot-main](https://github.com/shahanth4444/llama3-support-bot-main)  
**Total Commits**: 20+
