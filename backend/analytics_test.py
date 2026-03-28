import os
import glob
import json
from google import genai
from google.genai import types

# --- 1. SETUP CONFIGURATION ---
\
client = genai.Client(api_key=API_KEY)
base_directory = "worksheets"
marking_scheme_path = "Marking_Scheme.pdf"

print("Uploading Master Marking Scheme to Gemini...")
ms_file = client.files.upload(file=marking_scheme_path)

master_database = {
    "all_classes": []
}

# --- 2. PASS 1: THE PRE-SCAN (Extracting Dynamic Ground Truth) ---
print("Pre-scanning Marking Scheme for Total Marks and Topics...")

prescan_prompt = """
Analyze this marking scheme. 
Return ONLY a valid JSON object with two keys:
1. "paper_total_marks": (Integer) The maximum total marks achievable for the entire paper.
2. "topics": (An array of strings) An exhaustive list of the distinct mathematical topics assessed. Group them into standard, broad syllabus-level categories (e.g., "Fractions", "Algebra", "Geometry"). Do not use overly granular sub-skills.
"""

prescan_response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[ms_file, prescan_prompt],
    config=types.GenerateContentConfig(response_mime_type="application/json")
)

prescan_data = json.loads(prescan_response.text)
paper_total_marks = prescan_data.get("paper_total_marks", 100)
approved_topics = prescan_data.get("topics", [])

print(f"Pre-Scan Complete! Paper Total: {paper_total_marks} marks.")
print(f"Standardized Topics for this paper: {approved_topics}\n")


# --- 3. PASS 2: THE GRADING LOOP ---
print("Starting overall system scan...\n")

for class_folder_name in os.listdir(base_directory):
    class_folder_path = os.path.join(base_directory, class_folder_name)
    
    if not os.path.isdir(class_folder_path):
        continue
        
    class_id = class_folder_name
    print(f"=====================================")
    print(f"Detected Class: {class_id}")
    print(f"=====================================")
    
    pdf_files = glob.glob(f"{class_folder_path}/*.pdf")
    if not pdf_files:
        print(f"No student worksheets found in {class_id}. Skipping...\n")
        continue

    all_students_data = []

    for file_path in pdf_files:
        student_name = os.path.basename(file_path).replace(".pdf", "")
        print(f"  -> Grading {student_name}...")

        student_file = client.files.upload(file=file_path)

        # The CO-STAR & Mega-Payload Prompt
        prompt = f"""
        CONTEXT: You are an expert MOE Mathematics examiner at Stalford Learning Centre. 
        OBJECTIVE: Compare Document 1 (Master Marking Scheme) against Document 2 (Student Submission for {student_name}). Grade the student's work step-by-step. You MUST award Method Marks (M1) and Accuracy Marks (A1) strictly as defined in Document 1.
        STYLE: Objective, analytical, and highly precise.
        TONE: Professional examiner.
        AUDIENCE: Tuition center tutors who need actionable data.
        
        RULES & CONSTRAINTS:
        1. FEW-SHOT GRADING: If the marking scheme allocates "M1" for a method and "A1" for the final answer, and the student's method is correct but the final calculation is wrong, you MUST award the M1 mark but deny the A1 mark.
        2. TOPIC CONSISTENCY: You MUST classify every question into one of these exact topics: {json.dumps(approved_topics)}. Do not invent new topics.
        3. PAPER TOTAL: The maximum possible marks for this paper is {paper_total_marks}.
        
        RESPONSE SCHEMA:
        Return ONLY a valid JSON object matching this exact structure:
        {{
            "student_name": "{student_name}",
            "class_id": "{class_id}",
            "student_total_marks": (Integer total marks awarded),
            "paper_total_marks": {paper_total_marks},
            "overall_percentage": (Integer 0-100),
            "topic_scores": {{
                // Provide a percentage score (0-100) for ONLY the topics from the approved list. If a topic wasn't attempted, output null.
            }},
            "detailed_grading": [
                {{
                    "question_number": "e.g., 1a",
                    "marks_awarded": (Integer),
                    "max_marks": (Integer),
                    "topic_tag": (Must be from the approved list),
                    "is_fully_correct": (Boolean),
                    "error_type": (String e.g., "Calculation Error", "Conceptual Error", or null if correct),
                    "tutor_reasoning": "Step-by-step explanation of marks awarded/denied based on the marking scheme.",
                    "student_exam_tip": "One actionable sentence to avoid future errors."
                }}
            ]
        }}
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[ms_file, student_file, prompt],
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        
        student_json = json.loads(response.text)
        all_students_data.append(student_json)


    # --- 4. MATH SECTION: CLASS AVERAGES ---
    print(f"  -> Calculating analytics for {class_id}...")
    total_students = len(all_students_data)
    total_class_percentage = 0
    students_needing_attention = 0
    
    # Dynamically track the topics found in the pre-scan
    class_topic_totals = {topic: 0 for topic in approved_topics}
    class_topic_counts = {topic: 0 for topic in approved_topics}

    for student in all_students_data:
        total_class_percentage += student.get('overall_percentage', 0)
        if student.get('overall_percentage', 0) < 75: 
            students_needing_attention += 1
            
        for topic, score in student.get('topic_scores', {}).items():
            if score is not None and topic in class_topic_totals:
                class_topic_totals[topic] += score
                class_topic_counts[topic] += 1 

    class_topic_averages = {}
    for topic in approved_topics:
        if class_topic_counts[topic] > 0:
            class_topic_averages[topic] = int(class_topic_totals[topic] / class_topic_counts[topic])
        else:
            class_topic_averages[topic] = None

    class_average_percentage = int(total_class_percentage / total_students) if total_students > 0 else 0

    # --- 5. COMPILE: THE MEGA-PAYLOAD ---
    class_payload = {
        "class_summary": {
            "class_id": class_id,
            "total_students": total_students,
            "paper_total_marks": paper_total_marks,
            "class_average_percentage": class_average_percentage,
            "students_needing_attention": students_needing_attention,
            "performance_by_topic": class_topic_averages
        },
        "students": all_students_data
    }
    
    master_database["all_classes"].append(class_payload)
    print(f"Finished processing {class_id}.\n")

# --- 6. FINAL OUTPUT ---
with open("database_feed.json", "w") as f:
    json.dump(master_database, f, indent=4)

print("Pipeline complete! Master database_feed.json is ready for the Figma frontend.")