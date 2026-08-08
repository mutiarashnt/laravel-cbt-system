import re
import glob

# 1. Question.php BelongsTo -> BelongsToMany
with open("app/Models/Question.php", "r") as f:
    q = f.read()
q = q.replace("/** @return BelongsTo<Exam, $this> */\n    public function exams(): BelongsToMany", "/** @return BelongsToMany<Exam, $this> */\n    public function exams(): BelongsToMany")
q = re.sub(r"class Question extends Model\n\{", "/**\n * @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<\\Database\\Factories\\QuestionFactory>\n */\nclass Question extends Model\n{", q)
with open("app/Models/Question.php", "w") as f:
    f.write(q)

# 2. ExamQuestion.php missing HasFactory generics
with open("app/Models/ExamQuestion.php", "r") as f:
    eq = f.read()
eq = re.sub(r"class ExamQuestion extends Model\n\{", "/**\n * @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<\\Database\\Factories\\ExamQuestionFactory>\n */\nclass ExamQuestion extends Model\n{", eq)
with open("app/Models/ExamQuestion.php", "w") as f:
    f.write(eq)

# 3. Participant.php missing HasFactory generics
with open("app/Models/Participant.php", "r") as f:
    p = f.read()
p = re.sub(r"class Participant extends Model\n\{", "/**\n * @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<\\Database\\Factories\\ParticipantFactory>\n */\nclass Participant extends Model\n{", p)
with open("app/Models/Participant.php", "w") as f:
    f.write(p)

# 4. Subject.php missing HasFactory generics
with open("app/Models/Subject.php", "r") as f:
    s = f.read()
s = re.sub(r"class Subject extends Model\n\{", "/**\n * @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<\\Database\\Factories\\SubjectFactory>\n */\nclass Subject extends Model\n{", s)
with open("app/Models/Subject.php", "w") as f:
    f.write(s)

# 5. Exam.php user_participant
with open("app/Models/Exam.php", "r") as f:
    e = f.read()
if "/**" not in e[:300]:
    e = e.replace("class Exam extends Model", "/**\n * @property \\App\\Models\\Participant|null $user_participant\n */\nclass Exam extends Model")
with open("app/Models/Exam.php", "w") as f:
    f.write(e)

# 6. AdminExamService.php
with open("app/Services/AdminExamService.php", "r") as f:
    aes = f.read()
aes = aes.replace(": \\Illuminate\\Database\\Eloquent\\Collection", ": \\Illuminate\\Database\\Eloquent\\Collection<int, \\App\\Models\\Exam|\\App\\Models\\Question>")
# Wait, let's just remove generic from Collection in services and use `Collection` if PHPStan allows without generics, or properly type it.
# Actually PHPStan requires TKey, TModel for Eloquent Collection. 
# `\Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam>` etc.
