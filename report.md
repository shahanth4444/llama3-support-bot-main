# Report: Zero-Shot vs One-Shot Prompting Comparison (Llama 3.2 Offline)

## 1. Introduction

This project evaluates the feasibility of deploying a local Large Language Model (`llama3.2:3b` via Ollama) for e-commerce customer support while maintaining complete data privacy. The evaluation specifically compares two fundamental prompting strategies:

- **Zero-Shot Prompting**: Instructions without examples, relying solely on the model's pre-trained knowledge
- **One-Shot Prompting**: Instructions with a single high-quality example to guide output tone and format

The hypothesis guiding this work is that one-shot prompting, by providing a reference example, would yield more consistent, actionable, and business-aligned responses compared to zero-shot prompting—particularly for policy-specific inquiries.

## 2. Methodology

### 2.1 Query Adaptation

We sourced 20 customer support queries inspired by the Ubuntu Dialogue Corpus and adapted them to e-commerce scenarios for Chic Boutique, a fictional online retailer. Adapted queries span:

- **Order Management**: tracking, cancellation, updates
- **Payment & Discounts**: payment methods, voucher codes, gift cards
- **Returns & Exchanges**: policies, procedures, damaged items
- **Shipping & Logistics**: timeframes, international delivery, address changes
- **Account & Authentication**: password resets, account access
- **General Information**: contact methods, loyalty programs, warranties, materials
- **Policy Inquiries**: return windows, exchange procedures, price matching

### 2.2 Prompt Templates

**Zero-Shot Template** (`prompts/zero_shot_template.txt`):
- Clear role assignment: "helpful, friendly, and concise customer support agent"
- No examples; relies entirely on instruction clarity
- Constraint reminder: "Do not make up information about policies"

**One-Shot Template** (`prompts/one_shot_template.txt`):
- Identical preamble and constraints
- Single hardcoded example: return policy query with a professional, structured response
- Demonstrates desired tone (friendly, specific, action-oriented)

### 2.3 Evaluation Criteria

Each response was scored on three dimensions (1-5 scale):

1. **Relevance**: Does the response address the customer's actual question?
2. **Coherence**: Is the response grammatically sound and logically structured?
3. **Helpfulness**: Does it provide actionable information or genuine value?

Scores reflect subjective assessment based on real-world customer support standards.

---

## 3. Quantitative Results

### 3.1 Overall Performance Summary

| Criterion | Zero-Shot Avg | One-Shot Avg | Delta |
|-----------|---:|---:|---:|
| **Relevance** | 4.15 / 5.0 | 4.95 / 5.0 | **+0.80** |
| **Coherence** | 5.00 / 5.0 | 5.00 / 5.0 | **0.00** |
| **Helpfulness** | 3.90 / 5.0 | 4.80 / 5.0 | **+0.90** |
| **Overall Average** | 4.35 / 5.0 | 4.9 / 5.0 | **+0.55** |

### 3.2 Performance by Query Category

**High-Confidence Queries** (Both methods scored 5/5):
- Query 1: Order tracking
- Query 8: Password reset
- Query 11: Order cancellation
- Query 18: Newsletter signup

These procedural, account-based questions yielded perfect scores with both methods, suggesting the model has strong understanding of universal e-commerce workflows.

**Policy-Specific Queries** (One-Shot showed largest gains):
- Query 3: Return policy (+1.0 improvement)
- Query 6: International shipping (+1.7 improvement)
- Query 7: Exchange procedures (+1.0 improvement)
- Query 12: Loyalty program (+1.7 improvement)
- Query 15: Contact information (+1.7 improvement)

Average one-shot improvement on policy questions: **+1.32 points**

**General Knowledge Queries** (Zero-Shot underperformance):
- Queries 6, 12, 15, 20: When specific business policy knowledge is required, zero-shot responses either:
  - Acknowledge uncertainty ("I don't have specific information...")
  - Make vague generalizations without commitment
  - Assign the query to escalation

### 3.3 Coherence Consistency

Both methods maintained **perfect coherence (5.0/5.0 across all 20 queries)**. This indicates that Llama 3.2:3b has excellent grammatical and structural competency. There were no instances of incoherence, malformed sentences, or confusing phrasing with either prompting method.

---

## 4. Qualitative Analysis

### 4.1 Key Difference: Confidence vs. Uncertainty

**Zero-Shot Behavior:**
The zero-shot model frequently hedges with phrases like:
- "Most retailers offer..., but I don't have specific information about Chic Boutique..."
- "I recommend checking our policy page or contacting customer support..."
- "Chic Boutique may have one, but I don't have specific details..."

While this demonstrates appropriate caution, it reduces perceived helpfulness and may frustrate customers seeking immediate answers.

**One-Shot Behavior:**
The one-shot model, primed by its example, makes confident, first-person policy assertions:
- "We offer a 30-day return policy..."
- "We accept all major credit cards..."
- "Our rewards program earns you 1 point per dollar spent..."

### 4.2 Example Deep-Dive: Query 6 (International Shipping)

**Query**: "Do you offer international shipping to Canada?"

**Zero-Shot Response** (Score: 3, 5, 2):
> "Some e-commerce stores do ship internationally, but I don't have specific information about whether Chic Boutique ships to Canada. I recommend checking our shipping policy page or contacting customer support to confirm availability."

**Issues**: Generic deflection; customer must take additional action; no confidence in answer.

**One-Shot Response** (Score: 5, 5, 5):
> "Yes, we offer international shipping to Canada with an estimated delivery of 10-14 business days. Shipping costs and import duties will be calculated at checkout. Please contact us if you have questions about your delivery."

**Strengths**: Specific, affirmative, timeline-aware, addresses cost clarity.

### 4.3 Example Deep-Dive: Query 16 (Multiple Discount Codes)

**Query**: "Can I combine multiple discount codes?"

**Zero-Shot Response** (Score: 4, 5, 3):
> "Most retailers don't allow stacking multiple discount codes on a single order due to profitability concerns. However, some may offer bundle deals where multiple codes can combine. Check the specific terms of the codes you're using."

**Issues**: Cautious tone; no clear policy commitment; customer must investigate terms independently.

**One-Shot Response** (Score: 5, 5, 4):
> "Our policy allows only one discount code per order, though seasonal sales may have different stacking rules. Check the code terms for details. If you have questions, our support team can help you choose the best savings option."

**Strengths**: Clear policy boundary; mention of exceptions; offer of human escalation; professional tone.

---

## 5. Conclusion & Suitability Assessment

### 5.1 Key Findings

1. **One-Shot Prompting Significantly Improves Quality**: A single well-crafted example improved overall performance by **+0.55 points (12.6% improvement)**, with helpfulness improving by **+0.90 points (23% improvement)**.

2. **Policy Knowledge Gaps Are the Main Limitation**: Zero-shot responses faltered specifically on questions requiring business-specific knowledge (shipping regions, loyalty programs, contact methods). One-shot examples provided a "template" that helped the model infer appropriate company-specific answers.

3. **Llama 3.2:3b is Coherent but Not Autonomous**: The model demonstrates strong language quality and understanding of generic e-commerce workflows, but cannot reliably invent or commit to specific company policies without guidance.

4. **Perfect Coherence Suggests Strong Foundation**: 100% coherence across all responses indicates the model is reliable for grammar, structure, and clarity—key requirements for customer support.

### 5.2 Suitability for Production Deployment

**Recommended Use Cases**:
- ✅ First-line triage and FAQ answering (with pre-built policy knowledge)
- ✅ Procedural guidance (password resets, tracking, shipping timelines)
- ✅ General e-commerce education (how returns work, payment methods overview)
- ✅ Tone-appropriate responses to emotional situations (apologies, empathy)
- ✅ 24/7 availability for offline environments (privacy-compliant, no cloud dependency)

**Not Recommended Without Augmentation**:
- ❌ Real-time order/account lookups (no database integration capability)
- ❌ Policy commitment without explicit grounding data (hallucination risk)
- ❌ Personalized customer history analysis
- ❌ Complex decision-making (fraud detection, override approvals)

### 5.3 Recommended Architecture for Production

```
Customer Query
    ↓
[Lightweight Classifier: Is this policy-specific?]
    ↓
No → Zero-Shot (procedural questions)
    ↓
Yes → Retrieval-Augmented Generation (RAG)
        - Fetch policy doc from local knowledge base
        - Include policy in one-shot prompt
        - Generate response with actual company data
```

This hybrid approach would leverage the model's strengths while mitigating policy hallucination risks.

---

## 6. Limitations & Future Work

### 6.1 Evaluation Limitations

1. **Single-Turn Conversation**: This evaluation assessed isolated queries without multi-turn context. Real support often requires follow-up clarification.

2. **Manual Scoring Bias**: While structured rubrics were used, human evaluation is subjective. Aggregating opinions from multiple evaluators would increase reliability.

3. **Limited Model Variant Testing**: Only Llama 3.2:3b was tested. Comparing against Mistral 7B, Phi-3, or other local models would provide valuable context.

4. **No Customer Satisfaction Metric**: We measured technical quality but not actual customer satisfaction, which may differ.

### 6.2 Technical Limitations of Current Approach

1. **No Real-Time Integration**: The chatbot cannot access live order databases, payment systems, or inventory—limiting genuine helpfulness for account-specific queries.

2. **Hallucination Risk Remains**: While one-shot prompting reduced average uncertainty, the model can still "invent" plausible-sounding policies if not explicitly grounded.

3. **Latency on CPU Hardware**: Response generation took several seconds per query on standard hardware. GPU acceleration would be needed for production scale.

4. **Context Window Limits**: Multi-turn conversations approaching 2000+ tokens would exceed Llama 3.2:3b's 8K context window.

### 6.3 Recommended Future Enhancements

1. **Implement Retrieval-Augmented Generation (RAG)**: Ground model responses in a local vector database of real company policies.

2. **Add Conversation Memory**: Maintain session context to handle multi-turn support interactions.

3. **Integrate Intent Classification**: Route query types (account issue vs. product question) to appropriate handlers before prompting.

4. **Test with Larger Models**: Evaluate Llama 2 70B or Mistral Large (if hardware permits) to see if scale reduces hallucination.

5. **User Testing**: Deploy responses to real customers and measure satisfaction, first-contact resolution rates, and escalation frequency.

---

## 7. Technical Notes

### 7.1 Environment Details

- **Model**: Llama 3.2 (quantized) via Ollama
- **Parameters**: ~3 billion (3B variant)
- **API**: HTTP REST (OpenAI-compatible)
- **Deployment**: Fully local (no cloud connectivity required)
- **Setup Time**: ~15 minutes (including model download on broadband)

### 7.2 Cost Comparison

| Factor | Cloud LLM (e.g., OpenAI) | Local Ollama |
|--------|---|---|
| Per-query cost | $0.003–$0.016 | $0.00 (after download) |
| Privacy risk | High (data leaves your system) | None |
| Setup complexity | API key required | Download & run locally |
| Response latency | 1–3 seconds (network) | 3–10 seconds (CPU) |
| Availability | Depends on API provider | Always available offline |

For companies with strict privacy requirements (GDPR, CCPA, financial data), local deployment offers **significant value despite the latency trade-off**.

---

## 8. Summary Table: Zero-Shot vs. One-Shot

| Aspect | Zero-Shot | One-Shot |
|--------|-----------|----------|
| Average Score | 4.35 | 4.90 |
| Confidence Level | Low (hedging) | High (committed) |
| Policy-Specific Accuracy | Weak | Strong |
| Procedural Queries | Strong | Strong |
| Tone Consistency | Variable | Excellent |
| Best For | General information requests | Business-specific policies |
| Recommended Usage | Fallback/escalation trigger | Primary method |

---

## Conclusion Statement

**Llama 3.2 3B offline deployment is viable for e-commerce customer support**, particularly when combined with one-shot prompting and policy grounding. The model excels at procedural guidance and maintains excellent language quality, making it suitable for privacy-sensitive deployments. However, production systems should implement retrieval-augmented generation to ground policy responses and reduce hallucination. With these safeguards, local LLM deployment offers a compelling alternative to cloud-based solutions for organizations prioritizing data privacy and operational cost reduction.
