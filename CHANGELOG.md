# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-05-07

### Added
- Initial project release with core functionality
- Ollama integration for local LLM inference
- Zero-shot and one-shot prompt templates
- 20 e-commerce customer support queries adapted from Ubuntu Dialogue Corpus
- Comprehensive evaluation framework with manual scoring system
- Web UI with glassmorphism design
- Detailed documentation and architecture guides
- Complete analysis comparing zero-shot vs one-shot prompting
- MIT License and contributing guidelines

### Features
- Local, privacy-first chatbot deployment (no cloud connectivity)
- Support for Llama 3.2 3B model
- Real-time response logging
- Error handling and graceful degradation
- Configurable prompt templates
- Markdown evaluation results export

### Evaluation Results
- Zero-Shot Average: 4.35 / 5.0
- One-Shot Average: 4.9 / 5.0
- Overall improvement: +12.6%
- Perfect coherence: 5.0 / 5.0 for both methods

### Documentation
- README with quick start guide
- Setup guide with step-by-step instructions
- Architecture documentation
- Workflow explanation
- Comprehensive analysis report

### Limitations (Known Issues)
- Single-turn conversation evaluation (multi-turn support planned)
- CPU-only inference (GPU acceleration recommended)
- No real-time database integration
- Potential hallucination risk on policy-specific questions without RAG

## [Planned Features]

### v1.1.0 - RAG Integration
- Implement Retrieval-Augmented Generation for policy knowledge base
- Add vector database for policy storage
- Reduce hallucination on policy-specific queries
- Estimated: June 2026

### v1.2.0 - Multi-Turn Support
- Add conversation history management
- Implement session-based context persistence
- Support follow-up clarifications
- Estimated: July 2026

### v2.0.0 - Production Deployment
- REST API service (FastAPI)
- Docker containerization
- Kubernetes deployment guide
- Performance monitoring
- Estimated: August 2026

---

For more details, see the [report.md](report.md) and [README.md](README.md).
