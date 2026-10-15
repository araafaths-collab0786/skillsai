# ESCO Skills Taxonomy Dataset

This directory contains skills taxonomy reference files mapped from the European Skills, Competences, Qualifications and Occupations (ESCO) v1.1.1 framework.

## Schema
- `uri`: Unique identifier URI conforming to ESCO specification.
- `preferredLabel`: Official normalized skill title (e.g., "Machine Learning", "Kubernetes").
- `altLabels`: Comma-separated synonyms, abbreviations, and informal industry terms (e.g., "ML", "k8s").
- `category`: Broad occupation/functional domain (IT, Data/AI, Healthcare, Logistics, Skilled Trades).
- `description`: Plain-language competence description.

## Synonym Indexing
The NLP loader parses both preferred labels and alternative aliases into a normalized lookup index:
1. Exact lowercase normalization (stripping punctuation and whitespace).
2. Abbreviation expansion ("k8s" -> "Kubernetes", "ML" -> "Machine Learning").
3. Semantic fallback via sentence-transformer cosine calibration table when no exact alias matches.
