# Workflow

```mermaid
flowchart TD
    A[Install Ollama + Pull model] --> B[Install Python deps]
    B --> C[Run chatbot.py]
    C --> D[Generate responses for 20 queries x 2 methods]
    D --> E[Review eval/results.md]
    E --> F[Manual scoring]
    F --> G[Write report.md]
```

## Steps

1. Install Ollama and `llama3.2:3b`.
2. Create venv and install `requirements.txt`.
3. Run `python chatbot.py`.
4. Score responses in `eval/results.md`.
5. Complete `report.md`.
