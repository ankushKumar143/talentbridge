import re
from collections import OrderedDict

SKILLS = [
    "javascript", "typescript", "python", "java", "c++", "c#", ".net", "react", "react.js", "next.js", "vue", "angular", "html", "css", "tailwind", "node.js", "node", "express", "fastapi", "flask", "django", "sql", "postgresql", "mysql", "mongodb", "redis", "aws", "azure", "gcp", "docker", "kubernetes", "git", "rest api", "graphql", "machine learning", "deep learning", "data science", "pandas", "numpy", "excel", "power bi", "figma", "linux", "pytest", "testing", "communication", "leadership", "problem solving", "data validation", "debugging"
]
LEARNING = {
    "python": ["Python fundamentals", "Object-Oriented Programming", "Exception Handling", "File Handling"],
    "flask": ["Flask application structure", "Routing and HTTP methods", "REST API development", "Authentication"],
    "sql": ["SQL queries", "Joins and Subqueries", "Aggregate Functions", "Database Optimization"],
    "react": ["Components and props", "State and effects", "Testing React interfaces"],
    "javascript": ["Modern JavaScript", "Async programming", "Browser APIs"],
    "fastapi": ["Routing and validation", "Dependency injection", "API documentation"],
    "docker": ["Images and containers", "Volumes and networking", "Compose projects"],
    "git": ["Branches and commits", "Merging and rebasing", "Pull request workflow"],
    "rest api": ["HTTP methods and status codes", "REST architecture", "Request and response handling", "API authentication"],
    "mysql": ["Database design", "Joins and Indexing", "Transactions", "Query Optimization"],
    "debugging": ["Reading errors and stack traces", "Python breakpoints", "Logging and exception handling", "Runtime error diagnosis"],
    "data validation": ["Input validation", "Regular Expressions", "Data Type Validation", "Pydantic and Schema Validation"],
    "linux": ["Linux commands", "File Permissions", "Process Management", "Shell Scripting"],
    "redis": ["Redis fundamentals", "Key-Value Data Storage", "Caching", "Redis with Python"],
}
LEARNING_PROJECTS = {
    "python": "Build a Python-based file management application.",
    "flask": "Build a REST API using Flask.",
    "fastapi": "Build a CRUD API using FastAPI.",
    "sql": "Build a database-driven inventory management system.",
    "rest api": "Develop a REST API for a recruitment platform.",
    "mysql": "Create a relational database for an employee management system.",
    "git": "Collaborate on a project using Git branches and pull requests.",
    "debugging": "Improve an existing application by finding and fixing runtime errors.",
    "data validation": "Build a validation module for a resume upload system.",
    "docker": "Containerize a Python web application.",
    "linux": "Create a shell script to automate application backups.",
    "redis": "Add caching to a Python REST API using Redis.",
}
SKILL_ALIASES = {
    "react": {"react", "reactjs", "react.js"},
    "nodejs": {"node", "nodejs", "node.js"},
    "tailwind": {"tailwind", "tailwindcss", "tailwind css"},
    "javascript": {"javascript", "java script"},
    "typescript": {"typescript", "type script"},
    "postgresql": {"postgresql", "postgres"},
}
SKILL_LABELS = {"react": "React.js", "nodejs": "Node.js", "tailwind": "Tailwind CSS", "postgresql": "PostgreSQL"}

def normalized_skill(skill: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "", skill.lower().strip())
    for canonical, aliases in SKILL_ALIASES.items():
        if value in {re.sub(r"[^a-z0-9]+", "", alias) for alias in aliases}:
            return canonical
    return value

def skill_in_text(skill: str, text: str) -> bool:
    variants = SKILL_ALIASES.get(normalized_skill(skill), {skill})
    return any(re.search(r"(?<![a-z0-9])" + re.escape(alias.lower()) + r"(?![a-z0-9])", text) for alias in variants)

def clean(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = text.replace("\r", "\n")
    return re.sub(r"[ \t]+", " ", text).strip()

def match_terms(text: str, terms: list[str]) -> list[str]:
    found = []
    seen = set()
    low = text.lower()
    for term in terms:
        term = term.strip()
        if term and re.search(r"(?<![a-z0-9])" + re.escape(term.lower()) + r"(?![a-z0-9])", low):
            key = normalized_skill(term)
            if key not in seen:
                found.append(SKILL_LABELS.get(key, term))
                seen.add(key)
    return found

DEGREE_PATTERNS = [
    ("Bachelor of Computer Applications (BCA)", r"\b(?:BCA|Bachelor['’]?s?\s+(?:of|in)\s+Computer Applications)\b"),
    ("Bachelor of Technology (B.Tech)", r"\b(?:B\.?\s?Tech\.?|Bachelor['’]?s?\s+(?:of|in)\s+Technology)\b"),
    ("Bachelor of Engineering (B.E.)", r"\b(?:B\.?\s?E\.?|Bachelor['’]?s?\s+(?:of|in)\s+Engineering)\b"),
    ("Bachelor of Science (B.Sc.)", r"\b(?:B\.?\s?Sc\.?|Bachelor['’]?s?\s+(?:of|in)\s+Science)\b"),
    ("Master of Computer Applications (MCA)", r"\b(?:MCA|Master['’]?s?\s+(?:of|in)\s+Computer Applications)\b"),
    ("Master of Technology (M.Tech)", r"\b(?:M\.?\s?Tech\.?|Master['’]?s?\s+(?:of|in)\s+Technology)\b"),
    ("Master of Science (M.Sc.)", r"\b(?:M\.?\s?Sc\.?|Master['’]?s?\s+(?:of|in)\s+Science)\b"),
    ("Master of Business Administration (MBA)", r"\b(?:MBA|Master['’]?s?\s+(?:of|in)\s+Business Administration)\b"),
]

def extract_degrees(text: str) -> list[str]:
    return [label for label, pattern in DEGREE_PATTERNS if re.search(pattern, text, re.I)]

SECTION_PATTERNS = {
    "education": r"^(?:education|academic background|academic qualifications|qualifications)\s*:?\s*$",
    "experience": r"^(?:work experience|professional experience|employment history|experience|internships?)\s*:?\s*$",
    "projects": r"^(?:personal projects|academic projects|projects?)\s*:?\s*$",
    "skills": r"^(?:technical skills|skills|core competencies)\s*:?\s*$",
    "certifications": r"^(?:certifications?|licenses?)\s*:?\s*$",
}

def _section(line: str) -> str | None:
    for section, pattern in SECTION_PATTERNS.items():
        if re.match(pattern, line.strip(), re.I):
            return section
    return None

def _date_range(line: str) -> str | None:
    found = re.search(r"\b(?:19|20)\d{2}\s*(?:-|–|to)\s*(?:present|current|(?:19|20)\d{2})\b", line, re.I)
    return found.group(0).strip() if found else None

def _is_institution(text: str) -> bool:
    return bool(re.search(r"\b(university|institute|college|school|academy)\b", text, re.I))

def _education_score(text: str) -> str:
    patterns = [r"\bCGPA\s*[:=-]?\s*(\d+(?:\.\d+)?(?:\s*/\s*10)?)", r"\bGPA\s*[:=-]?\s*(\d+(?:\.\d+)?(?:\s*/\s*10)?)", r"\b(\d+(?:\.\d+)?\s*/\s*10)\s*(?:CGPA|GPA)\b", r"\b(\d+(?:\.\d+)?)\s*(?:CGPA|GPA)\b"]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match: return match.group(1).strip()
    return ""

def _parse_education(lines: list[str]) -> dict:
    entries = []
    current = None
    for line in lines:
        found_degrees = extract_degrees(line)
        parts = [part.strip(" \t,;|") for part in re.split(r"\s*[|•]\s*", line) if part.strip(" \t,;|")]
        institution = next((part for part in parts if _is_institution(part) and not extract_degrees(part)), "")
        if not institution and found_degrees and len(parts) > 1:
            institution = next((part for part in parts if not extract_degrees(part) and not _date_range(part) and not re.search(r"\b(?:CGPA|GPA|grade|percentage)\b", part, re.I)), "")
        degree = found_degrees[0] if found_degrees else ""
        duration, score = _date_range(line) or "", _education_score(line)
        if institution and not degree:
            current = {"institution": institution, "degree": "", "duration": duration, "score": score}
            entries.append(current)
        elif degree and current and not current["degree"] and (not institution or institution.lower() == current["institution"].lower()):
            current["degree"] = degree
            current["duration"] = duration or current["duration"]
            current["score"] = score or current["score"]
        elif institution or degree:
            current = {"institution": institution, "degree": degree, "duration": duration, "score": score}
            entries.append(current)
        elif current:
            current["duration"] = duration or current["duration"]
            current["score"] = score or current["score"]
    entries = list({(x["institution"].lower(), x["degree"].lower()): x for x in entries}.values())
    colleges = list(OrderedDict((x["institution"].lower(), x["institution"]) for x in entries if x["institution"]).values())
    degrees = list(OrderedDict((x["degree"].lower(), x["degree"]) for x in entries if x["degree"]).values())
    return {"degrees": degrees, "colleges": colleges, "entries": entries}

def _parse_projects(lines: list[str]) -> list[dict]:
    projects = []
    current = None
    bullet_re = re.compile(r"^\s*[-*•▪◦]\s*")
    sentence_start = re.compile(r"^(?:built|implemented|developed|designed|created|deployed|configured|added|worked|used|integrated|responsible|contributed|engineered|led|managed|delivered|optimized|improved|•)\b", re.I)

    def starts_project(content: str) -> bool:
        # Resume project descriptions often wrap onto several lines. Start a
        # new card only for a concise, title-like heading, never for prose.
        if sentence_start.search(content) or content.endswith((".", ";", ",")):
            return False
        if re.search(r"\s+[—–]\s+", content) or " | " in content:
            return True
        words = content.split()
        if len(content) <= 90 and len(words) <= 7 and not re.search(r"[.!?]", content):
            title_words = [word for word in words if word.lower() not in {"and", "of", "for", "in", "with", "to"}]
            title_case_words = sum(bool(re.match(r"^[A-Z0-9]", word)) for word in title_words)
            return bool(title_words) and title_case_words / len(title_words) >= 0.7
        return False

    for raw in lines:
        line = raw.strip()
        if not line: continue
        is_bullet = bool(bullet_re.match(raw))
        content = bullet_re.sub("", line).strip()
        tech = re.match(r"^(?:tech(?:nology)?\s*stack|technologies|tools)\s*:\s*(.*)$", content, re.I)
        if tech:
            if current is None:
                current = {"title": "Project", "description": "", "technologies": [], "link": ""}
                projects.append(current)
            current["technologies"].extend(x.strip(" .") for x in re.split(r"[,;|]", tech.group(1)) if x.strip(" ."))
            continue
        url = re.search(r"(?:https?://|www\.)\S+", content, re.I)
        if url:
            if current is None:
                current = {"title": "Project", "description": "", "technologies": [], "link": ""}
                projects.append(current)
            current["link"] = url.group(0).rstrip(".,)")
            content = (content[:url.start()] + content[url.end():]).strip(" -|:")
            if not content: continue
        if not content: continue
        if current is None or starts_project(content):
            parts = [x.strip() for x in re.split(r"\s*[|]\s*", content) if x.strip()]
            dash_parts = re.split(r"\s+[—–]\s+", parts[0], maxsplit=1)
            title = dash_parts[0].strip(" :-–—")
            technologies = []
            inline_description = dash_parts[1].strip() if len(dash_parts) > 1 else ""
            if len(parts) > 1 and len(parts) <= 3:
                maybe_stack = parts[1]
                if re.search(r"\b(stack|mern|mean|react|node|python|java|\.net|flutter)\b", maybe_stack, re.I):
                    technologies.extend(x.strip() for x in re.split(r"[,/+]+", maybe_stack) if x.strip())
                elif not inline_description:
                    inline_description = " | ".join(parts[1:])
            current = {"title": title[:120] or "Project", "description": inline_description, "technologies": technologies, "link": ""}
            projects.append(current)
        else:
            current["description"] = "\n".join(x for x in (current["description"], content) if x)
    for project in projects:
        project["technologies"] = list(OrderedDict((x.lower(), x) for x in project["technologies"]).values())
    return [project for project in projects if project["title"] or project["description"] or project["technologies"]]

def parse_resume(text: str) -> dict:
    text = clean(text)
    if not text:
        raise ValueError("No readable text was found in this file. Scanned PDFs may need OCR.")
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    name = None
    if lines and len(lines[0].split()) <= 4 and len(lines[0]) <= 60 and not re.search(r"[\d@:/\\]", lines[0]):
        name = lines[0]
    # PDF text extraction can insert spaces around @ and dots when contact
    # details use separate visual text boxes.
    email_pattern = r"(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9-]+(?:\s*\.\s*[A-Za-z0-9-]+)+"
    emails = list(OrderedDict.fromkeys(re.sub(r"\s+", "", value).lower() for value in re.findall(email_pattern, text)))
    urls = list(OrderedDict.fromkeys(re.findall(r"(?:https?://|www\.)[^\s<>]+", text)))
    phones = []
    for phone in re.findall(r"(?<!\d)(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{5,10}(?!\d)", text):
        if 10 <= len(re.sub(r"\D", "", phone)) <= 13 and phone not in phones:
            phones.append(phone.strip())
    skills = match_terms(text, SKILLS)
    section = None
    education_lines, experience_lines, project_lines = [], [], []
    for line in lines:
        heading = _section(line)
        if heading:
            section = heading
            continue
        degree_found = extract_degrees(line)
        date_range = _date_range(line)
        looks_like_education = bool(degree_found or (_is_institution(line) and date_range))
        if section == "education" or (looks_like_education and section != "experience"):
            education_lines.append(line)
        elif section == "experience":
            experience_lines.append(line)
        elif date_range and not looks_like_education:
            experience_lines.append(line)
        if section == "projects":
            project_lines.append(line)

    education = _parse_education(education_lines)
    experience_entries = []
    for line in experience_lines:
        date_range = _date_range(line)
        if date_range or not experience_entries:
            experience_entries.append({"summary": line, "responsibilities": [line] if not date_range else []})
        elif experience_entries:
            experience_entries[-1]["responsibilities"].append(line)
            experience_entries[-1]["summary"] = " ".join(x for x in (experience_entries[-1]["summary"], line) if x)
    projects = _parse_projects(project_lines)
    score_weights = {"name": 10, "email": 10, "phone": 5, "skills": 20, "education": 20, "experience": 15, "projects": 10, "certifications": 5, "portfolio_links": 5}
    checks = {"name": bool(name), "email": bool(emails), "phone": bool(phones), "skills": bool(skills), "education": bool(education["degrees"] or education["colleges"] or education["entries"]), "experience": bool(experience_entries), "projects": bool(projects), "certifications": bool(match_terms(text, ["certification", "certified", "certificate"])), "portfolio_links": bool(urls)}
    return {"candidate": {"name": name, "emails": emails, "phone_numbers": phones, "urls": urls}, "skills": skills, "education": education, "experience": experience_entries, "projects": projects, "resume_score": {"score": sum(score_weights[k] for k,v in checks.items() if v), "checks": checks}, "limitations": ["Extraction uses local text patterns and a built-in skill list; names, education, and sections may be missed.", "Scanned image PDFs require OCR, which is not enabled."]}

def job_requirements(description: str, skills: list[str]) -> dict:
    desc = clean(description)
    found = match_terms(desc, skills + SKILLS)
    required = list(OrderedDict((x.lower(), x) for x in (skills + found)).values())
    preferred_terms = [x for x in found if re.search(r"\b(preferred|nice to have|bonus|plus|desirable)\b", desc[max(0, desc.lower().find(x.lower())-80):desc.lower().find(x.lower())], re.I)]
    preferred = list(OrderedDict((x.lower(),x) for x in preferred_terms).values())
    required = [x for x in required if x.lower() not in {p.lower() for p in preferred}]
    other = [x for x in found if x.lower() not in {p.lower() for p in preferred+required}]
    return {"required_skills": required, "preferred_skills": preferred, "other_skills": other}

def analyze_match(resume: dict, requirements: dict) -> dict:
    # Accept both the simple structure returned by TalentBridge's parser and
    # the richer experience/project structure used in the supplied notebook.
    profile = set()
    for item in resume.get("skills", []):
        value = item.get("n") if isinstance(item, dict) else item
        if isinstance(value, str) and value.strip(): profile.add(normalized_skill(value))
    experience_parts, project_parts = [], []
    for item in resume.get("experience", []):
        if isinstance(item, dict):
            summary = item.get("summary", "")
            responsibilities = item.get("responsibilities", [])
            experience_parts.extend([str(summary)] if summary else [])
            experience_parts.extend(str(x) for x in responsibilities if x)
        else:
            experience_parts.append(str(item))
    for item in resume.get("projects", []):
        if isinstance(item, dict):
            for key in ("description", "technologies", "tags"):
                value = item.get(key, [])
                project_parts.extend([str(value)] if isinstance(value, str) else [str(x) for x in value])
        else:
            project_parts.append(str(item))
    experience_text = " ".join(experience_parts).lower()
    project_text = " ".join(project_parts).lower()
    results = {}
    for category in ("required_skills", "preferred_skills", "other_skills"):
        entries=[]
        for skill in requirements.get(category, []):
            prof = normalized_skill(skill) in profile
            experience_match = skill_in_text(skill, experience_text)
            project_match = skill_in_text(skill, project_text)
            sources = (["Experience"] if experience_match else []) + (["Projects"] if project_match else [])
            entries.append({"skill":skill,"profile_match":prof,"experience_match":experience_match,"project_match":project_match,"evidence_status":"Supported" if sources else ("Profile Only" if prof else "Missing"),"evidence_sources":sources})
        results[category]=entries

    summary = {}
    extraction_gaps = []
    supported_count = profile_only_count = missing_count = total_count = 0
    for category, entries in results.items():
        supported = [x["skill"] for x in entries if x["evidence_status"] == "Supported"]
        profile_only = [x["skill"] for x in entries if x["evidence_status"] == "Profile Only"]
        missing = [x["skill"] for x in entries if x["evidence_status"] == "Missing"]
        extraction_gaps.extend(x["skill"] for x in entries if x["evidence_status"] == "Supported" and not x["profile_match"])
        summary[category] = {"supported": supported, "profile_only": profile_only, "missing": missing, "total": len(entries)}
        total_count += len(entries); supported_count += len(supported); profile_only_count += len(profile_only); missing_count += len(missing)

    weight={"required_skills":.6,"preferred_skills":.3,"other_skills":.1}
    # The percentage counts skills detected in the resume profile as matches.
    # Evidence status remains separate to show profile-only skills clearly.
    scores={k: (round(sum(1 for x in results[k] if x["profile_match"] or x["experience_match"] or x["project_match"])*100/summary[k]["total"],2) if summary[k]["total"] else 0) for k in weight}
    active_weight = sum(weight[k] for k in weight if summary[k]["total"])
    coverage=round(sum(scores[k]*weight[k] for k in weight)/active_weight,1) if active_weight else 0
    matched=[x["skill"] for entries in results.values() for x in entries if x["profile_match"] or x["experience_match"] or x["project_match"]]
    missing=[x["skill"] for entries in results.values() for x in entries if x["evidence_status"]=="Missing"]
    recommendations=[]
    for category in ("required_skills","preferred_skills","other_skills"):
        for item in results[category]:
            if item["evidence_status"]=="Missing":
                skill=item["skill"]
                recommendations.append({"skill":skill,"category":category,"priority":{"required_skills":"High","preferred_skills":"Medium","other_skills":"Low"}[category],"topics_to_learn":LEARNING.get(skill.lower(),[f"Fundamentals of {skill}",f"Practical applications of {skill}" ]),"suggested_project":LEARNING_PROJECTS.get(skill.lower(), f"Build a practical project using {skill}.")})
    gap_summary = {"categories": summary, "total_skills": total_count, "matched_count": supported_count + profile_only_count, "supported_count": supported_count,
        "profile_only_count": profile_only_count, "missing_count": missing_count,
        "profile_extraction_gaps": list(dict.fromkeys(extraction_gaps)),
        "evidence_coverage": round(supported_count * 100 / total_count, 2) if total_count else 0}
    return {"score":coverage,"category_scores":scores,"matched_skills":list(dict.fromkeys(matched)),"missing_skills":list(dict.fromkeys(missing)),"skill_analysis":results,"skill_gap_summary":gap_summary,"learning_recommendations":recommendations,"method":"Resume match counts detected profile skills and skills evidenced in experience/projects, weighted by job requirement category (60% required, 30% preferred, 10% other; weights normalized across categories present). Evidence status is separate so profile-only skills remain distinguishable.","decision_support_note":"For human review only. Parsed data and scores can be incomplete; do not use them to automatically reject candidates."}



