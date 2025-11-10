import os
import pathlib
from typing import List, Optional

import chromadb
from chromadb.config import Settings as ChromaSettings
from openai import OpenAI
from PyPDF2 import PdfReader
import json
import logging

from app.config.settings import get_settings

logger = logging.getLogger(__name__)


def _extract_text_from_pdf(path: str) -> str:
    """Extract text from a PDF file using PyPDF2 (simple MVP)."""
    try:
        reader = PdfReader(path)
        pages = []
        for page in reader.pages:
            text = page.extract_text() or ""
            pages.append(text)
        return "\n\n".join(pages)
    except Exception:
        return ""


def _get_chroma_client(persist_directory: str):
    # Use local persistent Chroma (filesystem). Chroma will create a folder.
    return chromadb.Client(ChromaSettings(chroma_db_impl="duckdb+parquet", persist_directory=persist_directory))


def build_or_get_collection(client: OpenAI, collection_name: str = "edital"):
    settings = get_settings()
    persist_dir = settings.CHROMA_PERSIST_DIR
    logger.info("Initializing Chroma client with persist dir: %s", persist_dir)
    print(f"[RAG] build_or_get_collection: persist_dir={persist_dir}")
    chroma = _get_chroma_client(persist_dir)
    # If collection exists, return it
    try:
        collection = chroma.get_collection(collection_name)
    except Exception:
        collection = chroma.create_collection(collection_name)

    # If collection empty, index the edital folder
    if collection.count() == 0:
        logger.info("Chroma collection '%s' is empty — starting indexing of edital/", collection_name)
        print(f"[RAG] collection '{collection_name}' is empty — starting indexing")
        _index_edital(collection, client)
        chroma.persist()
        logger.info("Indexing complete and persisted to %s", persist_dir)
        print(f"[RAG] indexing complete, persisted to {persist_dir}")

    return chroma, collection


def _index_edital(collection, client: OpenAI):
    """Index files from the repository `edital` folder into Chroma.

    MVP: reads PDFs in the top-level `edital/` folder and splits each page as a document.
    """
    repo_root = pathlib.Path(__file__).resolve().parents[2]
    edital_dir = repo_root / "edital"

    if not edital_dir.exists():
        logger.warning("edital directory not found at %s — skipping indexing", edital_dir)
        print(f"[RAG] edital directory not found at {edital_dir} — skipping indexing")
        return

    settings = get_settings()
    embedding_model = settings.OPENAI_EMBEDDING_MODEL

    doc_id = 0
    # also persist a plain-text index for fallback retrieval when embeddings fail
    settings = get_settings()
    persist_dir = pathlib.Path(settings.CHROMA_PERSIST_DIR)
    persist_dir.mkdir(parents=True, exist_ok=True)
    index_file = persist_dir / "edital_index.json"
    index_docs = []
    logger.info("Indexing PDF files from %s", edital_dir)
    print(f"[RAG] Indexing PDF files from {edital_dir}")
    for path in edital_dir.iterdir():
        if path.is_file() and path.suffix.lower() in {".pdf"}:
            print(f"[RAG] Processing file: {path.name}")
            text = _extract_text_from_pdf(str(path))
            if not text:
                print(f"[RAG] No text extracted from {path.name} — skipping")
                continue

            # Split by page breaks (we extracted pages joined by double-newline)
            pages = text.split("\n\n")
            for i, page_text in enumerate(pages):
                if not page_text.strip():
                    continue

                # create embedding via OpenAI-compatible embeddings API
                print(f"[RAG] Creating embedding for {path.name} page {i}")
                try:
                    resp = client.embeddings.create(model=embedding_model, input=page_text)
                    emb = resp.data[0].embedding
                    print(f"[RAG] Embedding succeeded for {path.name} page {i}")
                except Exception as e:
                    emb = None
                    logger.warning("Embedding generation failed for %s page %s: %s", path.name, i, e)
                    print(f"[RAG] Embedding FAILED for {path.name} page {i}: {e}")

                metadata = {"source": path.name, "page": i}
                doc_uid = f"doc-{doc_id}"
                if emb is not None:
                    collection.add(ids=[doc_uid], embeddings=[emb], metadatas=[metadata], documents=[page_text])
                else:
                    # fallback: store without embedding (Chroma requires embeddings; skip)
                    logger.debug("Storing page %s of %s in fallback index only (no embedding)", i, path.name)
                    print(f"[RAG] Storing page {i} of {path.name} in fallback index only (no embedding)")
                # always store text in fallback index so we can do keyword matching
                index_docs.append({"id": doc_uid, "text": page_text, "metadata": metadata})
                doc_id += 1

    # write fallback plain-text index
    try:
        with open(index_file, "w", encoding="utf-8") as f:
            json.dump(index_docs, f, ensure_ascii=False)
        logger.info("Wrote fallback edital index with %d docs to %s", len(index_docs), index_file)
        print(f"[RAG] Wrote fallback edital index with {len(index_docs)} docs to {index_file}")
    except Exception as e:
        logger.exception("Failed to write fallback edital index to %s", index_file)
        print(f"[RAG] Failed to write fallback index to {index_file}: {e}")


def get_relevant_docs(client: OpenAI, query: str, top_k: int = 3) -> List[str]:
    """Return top-k document texts most similar to the query.

    This will build the index on first call if necessary.
    """
    chroma, collection = build_or_get_collection(client)

    settings = get_settings()
    embedding_model = settings.OPENAI_EMBEDDING_MODEL

    try:
        logger.debug("Creating embedding for query using model %s", embedding_model)
        print(f"[RAG] Creating embedding for QUERY using model {embedding_model}")
        emb_resp = client.embeddings.create(model=embedding_model, input=query)
        q_emb = emb_resp.data[0].embedding
        print(f"[RAG] Query embedding created (len={len(q_emb) if q_emb else 'None'})")
    except Exception as e:
        logger.warning("Failed to create embedding for query: %s", e)
        print(f"[RAG] Failed to create embedding for query: {e}")
        q_emb = None

    # Query chroma
    results = {}
    if q_emb is not None:
        try:
            results = collection.query(query_embeddings=[q_emb], n_results=top_k, include=['documents', 'metadatas', 'distances'])
            logger.info("Chroma query returned results keys: %s", list(results.keys()))
            print(f"[RAG] Chroma query returned keys: {list(results.keys())}")
        except Exception as e:
            logger.warning("Chroma query failed: %s", e)
            print(f"[RAG] Chroma query failed: {e}")
            results = {}

    docs = []
    # results['documents'] is a list of lists
    for docs_list in results.get('documents', []):
        for d in docs_list:
            docs.append(d)

    if docs:
        logger.info("Returning %d docs from Chroma query", len(docs))
        print(f"[RAG] Returning {len(docs)} docs from Chroma query")
        return docs

    # Fallback: simple keyword-overlap search over plain-text index created during indexing
    try:
        settings = get_settings()
        persist_dir = pathlib.Path(settings.CHROMA_PERSIST_DIR)
        index_file = persist_dir / "edital_index.json"
        if index_file.exists():
            with open(index_file, "r", encoding="utf-8") as f:
                index_docs = json.load(f)

            # simple scoring: count matches of query tokens
            q_tokens = [t for t in query.lower().split() if len(t) > 2]
            scored = []
            for item in index_docs:
                text = (item.get("text") or "").lower()
                score = sum(text.count(tok) for tok in q_tokens)
                scored.append((score, item))

            scored.sort(key=lambda x: x[0], reverse=True)
            results_texts = [it[1]["text"] for it in scored if it[0] > 0][:top_k]
            if results_texts:
                logger.info("Returning %d docs from fallback textual index", len(results_texts))
                print(f"[RAG] Returning {len(results_texts)} docs from fallback textual index")
                return results_texts
    except Exception:
        logger.exception("Fallback textual retrieval failed")
        print("[RAG] Fallback textual retrieval failed (exception)" )

    return []
