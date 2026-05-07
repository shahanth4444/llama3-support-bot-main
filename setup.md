# Setup Guide

## 1) Install Ollama

Download and install Ollama from the official site, then verify:

```bash
ollama --version
```

## 2) Pull model

```bash
ollama pull llama3.2:3b
```

## 3) Create Python environment

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 4) Run evaluation script

```bash
python chatbot.py
```

This generates/updates `eval/results.md` with:

- 20 queries
- 2 methods per query (Zero-Shot + One-Shot)
- scoring columns to fill manually

## 5) Complete evaluation

Open `eval/results.md` and add manual scores:

- Relevance (1-5)
- Coherence (1-5)
- Helpfulness (1-5)

Then summarize findings in `report.md`.

## Optional: run web UI

```bash
python -m http.server 8000
```

Visit: `http://localhost:8000/static/`

## Troubleshooting

- If connection fails, start/verify Ollama and confirm `http://localhost:11434`
- If model missing, run `ollama pull llama3.2:3b`
