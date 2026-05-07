import requests
import json
import os
from datetime import datetime

# Constants
OLLAMA_ENDPOINT = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2:3b"

# 20 Adapted E-commerce Queries (from Ubuntu Dialogue Corpus)
QUERIES = [
    "How do I track my order status?",
    "My discount code isn't working at checkout. What should I do?",
    "What is your return policy for clothing items?",
    "I received the wrong item in my order. How can I get the correct one?",
    "How long does standard shipping take?",
    "Do you offer international shipping to Canada?",
    "Can I exchange an item for a different size?",
    "My account password isn't working. How do I reset it?",
    "What payment methods do you accept?",
    "How do I apply a gift card to my order?",
    "I need to cancel my order. Is it too late?",
    "Do you have a loyalty or rewards program?",
    "How can I update my shipping address after placing an order?",
    "What happens if an item is out of stock?",
    "How do I contact customer service by phone?",
    "Can I combine multiple discount codes?",
    "What is the warranty on electronics purchased from your store?",
    "How do I sign up for your newsletter?",
    "I have a question about a product's material. Who can I ask?",
    "Do you offer price matching with competitors?"
]

def load_prompt_template(filepath):
    """Load a prompt template from a file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def format_prompt(template, query):
    """Insert the query into the prompt template."""
    return template.replace("{query}", query)

def sanitize_markdown_cell(text):
    """Keep markdown table rows valid by removing line breaks and escaping separators."""
    cleaned = text.replace("\r", " ").replace("\n", " ").replace("|", "/").strip()
    # Collapse repeated spaces for cleaner logs
    return " ".join(cleaned.split())

def query_ollama(prompt):
    """Send a prompt to Ollama and return the response."""
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False  # We want the full response at once
    }
    try:
        response = requests.post(OLLAMA_ENDPOINT, json=payload, timeout=30)
        response.raise_for_status()  # Raise an exception for bad status codes
        # The actual response text is in the 'response' key of the JSON
        result = json.loads(response.text)
        return result.get("response", "").strip()
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to Ollama. Is the server running?"
    except requests.exceptions.Timeout:
        return "Error: Request timed out. The model might be taking too long to respond."
    except requests.exceptions.RequestException as e:
        return f"Error querying Ollama: {e}"
    except json.JSONDecodeError:
        return "Error: Invalid response from Ollama server."

def evaluate_responses(queries, zero_shot_template, one_shot_template):
    """Run evaluation for all queries and log results."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Load templates
    zero_template = load_prompt_template(zero_shot_template)
    one_template = load_prompt_template(one_shot_template)

    # Prepare results file
    results_dir = "eval"
    os.makedirs(results_dir, exist_ok=True)

    results_file = os.path.join(results_dir, "results.md")

    with open(results_file, 'w', encoding='utf-8') as f:
        f.write(f"# Evaluation Results\n\n")
        f.write(f"Generated on: {timestamp}\n\n")
        f.write(f"Model: {MODEL_NAME}\n\n")
        f.write("## Scoring Rubric\n\n")
        f.write("- **Relevance (1-5)**: How well does the response address the customer's query?\n")
        f.write("- **Coherence (1-5)**: Is the response grammatically correct and easy to understand?\n")
        f.write("- **Helpfulness (1-5)**: Does the response provide a useful, actionable answer?\n\n")
        f.write("## Results Table\n\n")
        f.write("| Query # | Customer Query | Prompting Method | Response | Relevance | Coherence | Helpfulness |\n")
        f.write("|---------|----------------|------------------|----------|-----------|-----------|-------------|\n")

        print("Starting evaluation...")
        print(f"Total queries to process: {len(queries)}")

        for idx, query in enumerate(queries, 1):
            print(f"\nProcessing query {idx}/{len(queries)}: {query[:50]}...")

            # Zero-shot
            print("  - Zero-shot...", end=" ", flush=True)
            zero_prompt = format_prompt(zero_template, query)
            zero_response = query_ollama(zero_prompt)
            print("done")

            # One-shot
            print("  - One-shot...", end=" ", flush=True)
            one_prompt = format_prompt(one_template, query)
            one_response = query_ollama(one_prompt)
            print("done")

            # Write results (scores to be filled manually)
            safe_query = sanitize_markdown_cell(query)
            safe_zero = sanitize_markdown_cell(zero_response)
            safe_one = sanitize_markdown_cell(one_response)
            zero_row = f"| {idx} | {safe_query} | Zero-Shot | {safe_zero} | ? | ? | ? |\n"
            one_row = f"| {idx} | {safe_query} | One-Shot | {safe_one} | ? | ? | ? |\n"

            f.write(zero_row)
            f.write(one_row)

    print(f"\nEvaluation complete! Results saved to {results_file}")
    print("Please manually score the responses in the results table.")

if __name__ == "__main__":
    print("=" * 60)
    print("Customer Support Chatbot - Evaluation Script")
    print("=" * 60)

    # Check if Ollama is running
    try:
        test_response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if test_response.status_code == 200:
            print("✓ Ollama server is running")
            models = test_response.json().get("models", [])
            llama_installed = any(m.get("name", "").startswith("llama3.2:3b") for m in models)
            if llama_installed:
                print("✓ Llama 3.2:3b model is available")
            else:
                print("⚠ Llama 3.2:3b model not found. Please run: ollama pull llama3.2:3b")
        else:
            print("✗ Ollama server responded with an error")
    except requests.exceptions.ConnectionError:
        print("✗ Ollama server is not running. Please start Ollama and try again.")
        print("  On Windows/Mac: Look for Ollama in system tray and start it")
        print("  On Linux: systemctl --user start ollama")
        exit(1)

    # Run evaluation
    evaluate_responses(
        QUERIES,
        "prompts/zero_shot_template.txt",
        "prompts/one_shot_template.txt"
    )

    print("\n" + "=" * 60)
    print("Next steps:")
    print("1. Review eval/results.md")
    print("2. Manually score each response (1-5) for Relevance, Coherence, and Helpfulness")
    print("3. Calculate average scores for each method")
    print("4. Write your analysis in report.md")
    print("=" * 60)
