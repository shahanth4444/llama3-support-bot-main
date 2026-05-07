# Architecture

```mermaid
graph TD
    A[chatbot.py] --> B[Load Prompt Template]
    B --> C[Format Query]
    C --> D[POST /api/generate]
    D --> E[Ollama localhost:11434]
    E --> F[Llama 3.2 3B]
    F --> E
    E --> G[JSON Response]
    G --> H[eval/results.md]
```

## Components

- `chatbot.py`: orchestrates prompts, requests, and logging
- `prompts/*.txt`: zero-shot and one-shot templates
- `Ollama`: local inference API
- `eval/results.md`: evaluation output + manual scoring
- `static/*`: optional UI for live chat testing
