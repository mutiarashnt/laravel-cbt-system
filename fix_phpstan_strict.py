import glob
import re

# Fix HasFactory
models = glob.glob("app/Models/*.php")
for file in models:
    with open(file, 'r') as f:
        content = f.read()
    
    # Remove any existing top-level @use HasFactory
    content = re.sub(r"/\*\*\n \* @use \\Illuminate\\[^\n]+\n \*/\n(class \w+ extends Model)", r"\1", content)
    
    # Add @use above `use HasFactory;`
    model_name = file.split("/")[-1].split(".")[0]
    factory_class = f"\\Database\\Factories\\{model_name}Factory"
    
    content = re.sub(r"(\s+)use HasFactory;", f"\\1/** @use \\\\Illuminate\\\\Database\\\\Eloquent\\\\Factories\\\\HasFactory<{factory_class}> */\\1use HasFactory;", content)
    
    with open(file, 'w') as f:
        f.write(content)

# Fix Services Collection Covariance
def replace_collection_doc(filepath, model_name):
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace("\\Illuminate\\Database\\Eloquent\\Collection<int, \\Illuminate\\Database\\Eloquent\\Model>", f"\\Illuminate\\Database\\Eloquent\\Collection<int, \\App\\Models\\{model_name}>")
    with open(filepath, 'w') as f:
        f.write(content)

replace_collection_doc("app/Services/AdminExamService.php", "Exam") # Actually getAllQuestions returns Question, let's fix below
with open("app/Services/AdminExamService.php", "r") as f:
    c = f.read()
c = c.replace("Collection<int, \\App\\Models\\Exam>\n     */\n    public function getAllQuestions", "Collection<int, \\App\\Models\\Question>\n     */\n    public function getAllQuestions")
with open("app/Services/AdminExamService.php", "w") as f:
    f.write(c)

replace_collection_doc("app/Services/DashboardService.php", "Exam")
replace_collection_doc("app/Services/ExamService.php", "Exam")
replace_collection_doc("app/Services/QuestionService.php", "Question")
with open("app/Services/QuestionService.php", "r") as f:
    c = f.read()
c = c.replace("Collection<int, \\App\\Models\\Question>\n     */\n    public function getAllSubjects", "Collection<int, \\App\\Models\\Subject>\n     */\n    public function getAllSubjects")
with open("app/Services/QuestionService.php", "w") as f:
    f.write(c)
replace_collection_doc("app/Services/SubjectService.php", "Subject")

# Fix getPublishedExamsForUser Collection issue
with open("app/Services/ExamService.php", "r") as f:
    c = f.read()
c = c.replace("public function getPublishedExamsForUser(int $userId): \\Illuminate\\Support\\Collection", "public function getPublishedExamsForUser(int $userId): \\Illuminate\\Database\\Eloquent\\Collection")
with open("app/Services/ExamService.php", "w") as f:
    f.write(c)

