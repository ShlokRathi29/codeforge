import json
import re
import time
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional, Tuple
from app.core.config import get_settings

settings = get_settings()

# Curated Campus Wellness Knowledge Base for RAG
WELLNESS_KNOWLEDGE_BASE: List[Dict[str, Any]] = [
    {
        "id": "kb-01",
        "category": "Sleep & Circadian Rhythm",
        "keywords": ["sleep", "insomnia", "tired", "rest", "night", "awake", "exhausted", "fatigue", "nap", "energy", "neend", "soya"],
        "title": "Evidence-Based Sleep Hygiene for University Students",
        "content": (
            "1. 30-Minute Screen Cutoff: Blue light suppresses melatonin production. Use warm night-shift mode or read physical notes.\n"
            "2. 4-7-8 Breathing Technique: Inhale for 4 seconds, hold for 7 seconds, exhale slowly for 8 seconds to engage parasympathetic tone.\n"
            "3. Caffeine Half-Life: Caffeine has a 5-7 hour half-life; eliminate coffee and energy drinks after 2:00 PM.\n"
            "4. Consistent Wakeup Times: Maintaining wake-up time within a 45-minute window anchors circadian rhythms even after late study sessions."
        ),
        "source": "Campus Health & Sleep Medicine Guidelines",
    },
    {
        "id": "kb-02",
        "category": "Exam Anxiety & Academic Stress",
        "keywords": ["exam", "study", "deadline", "finals", "midterms", "grade", "pressure", "homework", "fail", "procrastination", "academic", "test", "padhai", "paper"],
        "title": "Cognitive De-escalation & Chunking for High-Stakes Exams",
        "content": (
            "1. Micro-Chunking (25/5 Pomodoro): Break complex assignments into 20-25 minute focused sprints followed by 5-minute cognitive resets.\n"
            "2. Cognitive Reframing: Differentiate between productive concern (actionable study steps) and rumination (catastrophizing grades).\n"
            "3. Active Recall vs. Passive Reading: Self-quizzing reduces test-taking panic by priming neural retrieval pathways.\n"
            "4. Academic Accommodations: If stress impairs functioning, the University Academic Support Center grants structured extensions with counselor advocacy."
        ),
        "source": "CodeForge Academic Support Protocol",
    },
    {
        "id": "kb-03",
        "category": "Nutrition, Hydration & Brain Fog",
        "keywords": ["food", "eat", "meal", "nutrition", "water", "hungry", "diet", "brain fog", "dizzy", "headache", "khana", "bhookh"],
        "title": "Nutritional Stability & Cognitive Endurance",
        "content": (
            "1. Complex Carbohydrates & Stable Glucose: Replace refined sugar rushes with oats, whole grains, and bananas to prevent mid-afternoon cognitive crashes.\n"
            "2. Hydration Baseline: Mild dehydration (1-2% body weight) causes measurable drops in working memory and heightened perceived stress. Aim for 2 liters daily.\n"
            "3. Omega-3 & Micronutrients: Nuts, seeds, and healthy fats support neuronal membrane fluidity during high cognitive load.\n"
            "4. Campus Food Pantry: Free fresh produce and staples are available daily at the Campus Student Center with zero qualification barriers."
        ),
        "source": "Student Wellbeing Nutrition Services",
    },
    {
        "id": "kb-04",
        "category": "Social Connection & Isolation",
        "keywords": ["lonely", "friends", "isolated", "alone", "social", "roommate", "connection", "homesick", "talk", "belonging", "akela", "dost"],
        "title": "Combating University Isolation & Building Peer Support",
        "content": (
            "1. Low-Stakes Co-Working: Studying alongside peers in public library spaces fosters 'ambient social connection' without high conversational demand.\n"
            "2. Peer Mentorship Network: Connect with department senior mentors who navigated identical adjustment challenges.\n"
            "3. Micro-Interactions: A 2-minute greeting with a classmate or barista measurably boosts oxytocin and counters feelings of invisibility.\n"
            "4. Student Clubs & Interest Circles: Over 120 campus student-run organizations meet weekly for gaming, hiking, robotics, and creative arts."
        ),
        "source": "Campus Community Life Handbook",
    },
    {
        "id": "kb-05",
        "category": "Physical Movement & Somatic Release",
        "keywords": ["exercise", "gym", "walk", "active", "stiff", "movement", "sitting", "physical", "body", "stretch", "kasrat", "sharir"],
        "title": "Somatic Stress Discharge & Physical Wellbeing",
        "content": (
            "1. 10-Minute Brisk Walk: A quick walk outdoors lowers serum cortisol levels and increases endorphin circulation.\n"
            "2. Desk Decompression: Shoulder rolls, neck stretches, and hip openers reduce somatic tension from marathon typing sessions.\n"
            "3. Recreation Center Access: All enrolled students have full access to campus swimming pools, climbing walls, and guided yoga classes.\n"
            "4. Mindful Stretching: A 5-minute pre-bed stretch relieves muscle rigidity and speeds sleep onset."
        ),
        "source": "Recreational Sports & Somatic Wellness",
    },
    {
        "id": "kb-06",
        "category": "Crisis Intervention & Emergency Support",
        "keywords": ["crisis", "emergency", "hopeless", "harm", "suicide", "severe", "988", "urgent", "help me", "breakdown", "panic", "madad"],
        "title": "Campus Crisis Escalation & Immediate Emergency Safeties",
        "content": (
            "1. 988 Suicide & Crisis Lifeline: Call or text 988 (free, confidential, 24/7/365 English & Spanish).\n"
            "2. Crisis Text Line: Text HOME to 741741 to connect with a live, trained crisis volunteer immediately.\n"
            "3. Campus Crisis Walk-In Clinic: Student Health Center Floor 2, open 8:30 AM - 5:00 PM weekdays; 24/7 on-call triage officer reachable at campus security.\n"
            "4. Strict Student Protection: Under Requirement 07 and FERPA, seeking crisis help never appears on transcripts or academic records."
        ),
        "source": "University Emergency Safety Protocol",
    },
    {
        "id": "kb-07",
        "category": "Counselor Outreach & Triage Guide",
        "keywords": ["counselor", "staff", "outreach", "triage", "intervention", "support signal", "contact", "email"],
        "title": "Trauma-Informed Student Outreach Protocol (Rule 07 Compliant)",
        "content": (
            "1. Warm, Non-Accusatory Tone: Never mention algorithmic flags or surveillance. Frame outreach as a routine mid-semester campus check-in.\n"
            "2. Zero Note Ingestion (Rule 07): Counselors must NEVER request or reference private student journal reflections.\n"
            "3. Low-Pressure Invitation: Offer multiple formats—virtual Zoom, in-person coffee walk, or asynchronous email guidance.\n"
            "4. Immediate Resource Hand-off: Attach direct booking links with zero waitlist priority for students on sustained 3-day stress streaks."
        ),
        "source": "Counselor Operations & FERPA Compliance Standards",
    },
]

# Common Hinglish/Indic tokens for intelligent language routing
INDIC_TOKENS = {
    "kya", "kaise", "bohot", "bohut", "padhai", "neend", "lag", "raha", "rahi",
    "hai", "karun", "karu", "batao", "tension", "yaar", "mujhe", "akela",
    "dost", "khana", "thak", "gaya", "man", "mann", "kuch", "nahi", "hota"
}


class MultiLLMRAGService:
    """
    Multi-LLM RAG Orchestrator:
    - Provider 1: Groq Cloud (Ultra-low latency, model: openai/gpt-oss-120b)
    - Provider 2: Sarvam AI (Premier Indic & multilingual AI, model: sarvam-105b-conversations)
    - Auto Router: Intelligently selects provider based on query language or latency needs with automatic cross-failover.
    """

    def __init__(self):
        self.knowledge_base = WELLNESS_KNOWLEDGE_BASE

    def is_indic_or_hinglish(self, text: str) -> bool:
        """Detects Indic scripts (Devanagari, etc.) or common Hinglish expressions."""
        # Devanagari script range: U+0900 to U+097F
        if re.search(r"[\u0900-\u097F]", text):
            return True
        words = set(re.findall(r"\w+", text.lower()))
        return len(words.intersection(INDIC_TOKENS)) >= 2

    def retrieve(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """Keyword & semantic term retrieval across knowledge base."""
        query_words = set(re.findall(r"\w+", query.lower()))
        scored_docs = []

        for doc in self.knowledge_base:
            score = 0
            for kw in doc["keywords"]:
                if kw in query_words:
                    score += 3
                elif any(kw in word for word in query_words):
                    score += 1
            title_words = set(re.findall(r"\w+", doc["title"].lower()))
            score += len(query_words.intersection(title_words)) * 2

            content_words = set(re.findall(r"\w+", doc["content"].lower()))
            score += len(query_words.intersection(content_words)) * 0.5

            scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        results = [doc for score, doc in scored_docs if score > 0]
        if not results:
            results = [self.knowledge_base[1], self.knowledge_base[0]]
        return results[:top_k]

    def call_groq(
        self,
        messages: List[Dict[str, str]],
        max_tokens: int = 350,
        temperature: float = 0.4,
    ) -> Tuple[str, str]:
        """Calls Groq Cloud API."""
        api_key = settings.effective_groq_api_key
        if not api_key:
            raise ValueError("GROQ_API_KEY is not configured")

        from groq import Groq

        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return completion.choices[0].message.content or "", completion.model

    def call_sarvam(
        self,
        messages: List[Dict[str, str]],
        max_tokens: int = 350,
        temperature: float = 0.4,
    ) -> Tuple[str, str]:
        """Calls Sarvam AI API via OpenAI-compatible endpoint."""
        api_key = settings.effective_sarvam_api_key
        if not api_key:
            raise ValueError("SARVAM_API_KEY is not configured")

        url = "https://api.sarvam.ai/v1/chat/completions"
        headers = {
            "api-subscription-key": api_key,
            "Content-Type": "application/json",
        }
        payload = json.dumps({
            "model": settings.SARVAM_MODEL,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }).encode("utf-8")

        req = urllib.request.Request(url, data=payload, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode("utf-8"))
            content = data["choices"][0]["message"]["content"] or ""
            return content, settings.SARVAM_MODEL

    def execute_multi_llm(
        self,
        messages: List[Dict[str, str]],
        preferred_provider: str = "auto",
        query_text: str = "",
        max_tokens: int = 350,
    ) -> Dict[str, Any]:
        """
        Intelligent Multi-LLM Execution:
        - Decides between Groq and Sarvam AI.
        - Automatically fails over if primary provider errors out.
        """
        target = preferred_provider.lower().strip()
        if target == "auto":
            if self.is_indic_or_hinglish(query_text):
                primary, secondary = "sarvam", "groq"
            else:
                primary, secondary = "groq", "sarvam"
        elif target == "sarvam":
            primary, secondary = "sarvam", "groq"
        else:
            primary, secondary = "groq", "sarvam"

        start_time = time.time()

        # Attempt primary provider
        try:
            if primary == "sarvam" and settings.effective_sarvam_api_key:
                content, model = self.call_sarvam(messages, max_tokens=max_tokens)
                return {
                    "content": content,
                    "model": model,
                    "provider": "Sarvam AI (Indic / Multilingual)",
                    "latency_ms": int((time.time() - start_time) * 1000),
                    "status": "live",
                }
            elif settings.effective_groq_api_key:
                content, model = self.call_groq(messages, max_tokens=max_tokens)
                return {
                    "content": content,
                    "model": model,
                    "provider": "Groq Cloud (High-Velocity)",
                    "latency_ms": int((time.time() - start_time) * 1000),
                    "status": "live",
                }
        except Exception as e_prim:
            # Automatic failover to secondary provider
            try:
                if secondary == "sarvam" and settings.effective_sarvam_api_key:
                    content, model = self.call_sarvam(messages, max_tokens=max_tokens)
                    return {
                        "content": content,
                        "model": model,
                        "provider": "Sarvam AI (Failover Active)",
                        "latency_ms": int((time.time() - start_time) * 1000),
                        "status": "failover",
                    }
                elif settings.effective_groq_api_key:
                    content, model = self.call_groq(messages, max_tokens=max_tokens)
                    return {
                        "content": content,
                        "model": model,
                        "provider": "Groq Cloud (Failover Active)",
                        "latency_ms": int((time.time() - start_time) * 1000),
                        "status": "failover",
                    }
            except Exception:
                pass

        # Intelligent local synthesis fallback if both APIs fail or offline
        fallback_msg = (
            "Based on verified campus wellness protocols:\n\n"
            "• **Decompress in short intervals (25/5 Pomodoro):** Focus on one assignment at a time.\n"
            "• **Hydrate and step outside:** A brief 10-minute walk drops cortisol levels significantly.\n"
            "• **Restorative rest:** Avoid screens 30 minutes before sleep to allow natural melatonin rise.\n"
            "• **You are not alone:** Reach out to campus counseling or peer mentors whenever you need support."
        )
        return {
            "content": fallback_msg,
            "model": "offline-curated-rag",
            "provider": "Curated Knowledge Base",
            "latency_ms": int((time.time() - start_time) * 1000),
            "status": "offline_fallback",
        }

    def ask_student_assistant(
        self,
        query: str,
        student_name: str = "Student",
        recent_context: Optional[Dict[str, Any]] = None,
        provider: str = "auto",
    ) -> Dict[str, Any]:
        """Student RAG query with multi-LLM orchestration."""
        retrieved_docs = self.retrieve(query, top_k=2)
        context_text = "\n\n".join(
            [f"[{doc['title']} ({doc['category']})]\n{doc['content']}" for doc in retrieved_docs]
        )

        recent_summary_text = "No prior check-in data available."
        if recent_context:
            mood = recent_context.get("mood", "neutral")
            stress = recent_context.get("stress_level", 3)
            sleep = recent_context.get("sleep_quality", 2)
            recent_summary_text = (
                f"Student recent state: Mood: {mood}, Stress: {stress}/5, Sleep: {sleep}/3."
            )

        system_prompt = (
            "You are WellTrack AI, a warm, empathetic campus wellness companion. "
            "Use the provided campus guidelines to answer the student's question clearly. "
            "If the user speaks in Hindi, Hinglish, or an Indian language, reply naturally in that same language or bilingual Hinglish. "
            "RULES:\n"
            "- Never provide clinical medical diagnoses.\n"
            "- Keep answers supportive, practical, and concise (under 180 words).\n"
            "- If crisis signals appear, remind them of 24/7 crisis support (call 988 or text 741741)."
        )

        user_prompt = (
            f"Student Name: {student_name}\n"
            f"Student Question: \"{query}\"\n\n"
            f"Student Wellbeing Trend (Confidential): {recent_summary_text}\n\n"
            f"Verified Campus Knowledge Context:\n{context_text}\n\n"
            f"Provide compassionate, practical advice for {student_name}."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        llm_result = self.execute_multi_llm(
            messages=messages,
            preferred_provider=provider,
            query_text=query,
            max_tokens=350,
        )

        return {
            "answer": llm_result["content"],
            "model": llm_result["model"],
            "provider": llm_result["provider"],
            "latency_ms": llm_result["latency_ms"],
            "references": [
                {"title": d["title"], "category": d["category"], "source": d["source"]}
                for d in retrieved_docs
            ],
            "status": llm_result["status"],
        }

    def generate_counselor_suggestion(
        self,
        student_name: str,
        streak_days: int = 3,
        stress_level: int = 5,
        affected_dates: str = "recent 3 days",
        provider: str = "auto",
    ) -> Dict[str, Any]:
        """Counselor outreach generator (Rule 07 compliant)."""
        retrieved_docs = [self.knowledge_base[6], self.knowledge_base[1]]
        context_text = "\n\n".join([f"[{d['title']}]\n{d['content']}" for d in retrieved_docs])

        system_prompt = (
            "You are an expert university mental health advisor assisting campus counselors. "
            "Generate a warm, trauma-informed, FERPA-compliant outreach email draft for a student with "
            "consecutive high-stress check-in indicators. "
            "RULE 07 ENFORCEMENT: Never mention algorithms or surveillance. Frame outreach as standard campus care."
        )

        user_prompt = (
            f"Student Name: {student_name}\n"
            f"Flag Trigger: Stress ≥ {stress_level} for {streak_days} consecutive days ({affected_dates}).\n"
            f"Outreach Guidelines:\n{context_text}\n\n"
            f"Create: 1) Subject line, 2) Gentle 3-paragraph outreach message, 3) 2 action items for the counselor."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        llm_result = self.execute_multi_llm(
            messages=messages,
            preferred_provider=provider,
            query_text="",
            max_tokens=400,
        )

        return {
            "suggestion": llm_result["content"],
            "model": llm_result["model"],
            "provider": llm_result["provider"],
            "status": llm_result["status"],
        }

    def test_providers(self) -> Dict[str, Any]:
        """Runs live connectivity test against all configured providers."""
        results: Dict[str, Any] = {}

        # 1. Test Groq
        if settings.effective_groq_api_key:
            start = time.time()
            try:
                content, model = self.call_groq([{"role": "user", "content": "Respond with: OK"}], max_tokens=5)
                results["groq"] = {
                    "status": "ok",
                    "provider": "Groq Cloud",
                    "model": model,
                    "latency_ms": int((time.time() - start) * 1000),
                }
            except Exception as e:
                results["groq"] = {
                    "status": "error",
                    "provider": "Groq Cloud",
                    "error": str(e),
                    "latency_ms": int((time.time() - start) * 1000),
                }
        else:
            results["groq"] = {"status": "unconfigured"}

        # 2. Test Sarvam AI
        if settings.effective_sarvam_api_key:
            start = time.time()
            try:
                content, model = self.call_sarvam([{"role": "user", "content": "Respond with: OK"}], max_tokens=5)
                results["sarvam"] = {
                    "status": "ok",
                    "provider": "Sarvam AI",
                    "model": model,
                    "latency_ms": int((time.time() - start) * 1000),
                }
            except Exception as e:
                results["sarvam"] = {
                    "status": "error",
                    "provider": "Sarvam AI",
                    "error": str(e),
                    "latency_ms": int((time.time() - start) * 1000),
                }
        else:
            results["sarvam"] = {"status": "unconfigured"}

        return results


rag_service = MultiLLMRAGService()
