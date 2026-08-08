import glob
import re

# 1. Question.php BelongsTo -> BelongsToMany
with open("app/Models/Question.php", "r") as f:
    q = f.read()
q = q.replace("/** @return BelongsTo<Exam, $this> */\n    public function exams(): BelongsToMany", "/** @return BelongsToMany<Exam, $this> */\n    public function exams(): BelongsToMany")
q = q.replace("class Question extends Model\n{", "/**\n * @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<\\Database\\Factories\\QuestionFactory>\n */\nclass Question extends Model\n{")
with open("app/Models/Question.php", "w") as f:
    f.write(q)

# 2. ExamQuestion.php missing HasFactory generics
with open("app/Models/ExamQuestion.php", "r") as f:
    eq = f.read()
eq = eq.replace("class ExamQuestion extends Model\n{", "/**\n * @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<\\Database\\Factories\\ExamQuestionFactory>\n */\nclass ExamQuestion extends Model\n{")
with open("app/Models/ExamQuestion.php", "w") as f:
    f.write(eq)

# 3. Participant.php missing HasFactory generics
with open("app/Models/Participant.php", "r") as f:
    p = f.read()
p = p.replace("class Participant extends Model\n{", "/**\n * @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<\\Database\\Factories\\ParticipantFactory>\n */\nclass Participant extends Model\n{")
with open("app/Models/Participant.php", "w") as f:
    f.write(p)

# 4. Subject.php missing HasFactory generics
with open("app/Models/Subject.php", "r") as f:
    s = f.read()
s = s.replace("class Subject extends Model\n{", "/**\n * @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<\\Database\\Factories\\SubjectFactory>\n */\nclass Subject extends Model\n{")
with open("app/Models/Subject.php", "w") as f:
    f.write(s)

# 5. Exam.php user_participant
with open("app/Models/Exam.php", "r") as f:
    e = f.read()
if "@property \\App\\Models\\Participant|null $user_participant" not in e:
    e = e.replace("class Exam extends Model\n{", "/**\n * @property \\App\\Models\\Participant|null $user_participant\n */\nclass Exam extends Model\n{")
with open("app/Models/Exam.php", "w") as f:
    f.write(e)

# 6. AdminExamService.php
with open("app/Services/AdminExamService.php", "r") as f:
    aes = f.read()
aes = aes.replace("public function getAll(): \\Illuminate\\Database\\Eloquent\\Collection", "public function getAll(): \\Illuminate\\Database\\Eloquent\\Collection") # We will replace with correct generics below
aes = aes.replace(": \\Illuminate\\Database\\Eloquent\\Collection", ": \\Illuminate\\Database\\Eloquent\\Collection<int, \\Illuminate\\Database\\Eloquent\\Model>")
with open("app/Services/AdminExamService.php", "w") as f:
    f.write(aes)

# 7. DashboardService.php
with open("app/Services/DashboardService.php", "r") as f:
    ds = f.read()
ds = ds.replace("public function getUserDashboardStats(int $userId): array", "/** @return array<string, int> */\n    public function getUserDashboardStats(int $userId): array")
ds = ds.replace("public function getAdminDashboardStats(): array", "/** @return array<string, int> */\n    public function getAdminDashboardStats(): array")
ds = ds.replace(": \\Illuminate\\Database\\Eloquent\\Collection", ": \\Illuminate\\Database\\Eloquent\\Collection<int, \\Illuminate\\Database\\Eloquent\\Model>")
with open("app/Services/DashboardService.php", "w") as f:
    f.write(ds)

# 8. ExamService.php
with open("app/Services/ExamService.php", "r") as f:
    es = f.read()
es = es.replace("public function getPublishedExamsForUser(int $userId): \\Illuminate\\Database\\Eloquent\\Collection", "public function getPublishedExamsForUser(int $userId): \\Illuminate\\Database\\Eloquent\\Collection")
es = es.replace(": \\Illuminate\\Database\\Eloquent\\Collection", ": \\Illuminate\\Database\\Eloquent\\Collection<int, \\Illuminate\\Database\\Eloquent\\Model>")
es = es.replace("public function getExamResultData(Exam $exam, ?Participant $participant): ?array", "/** @return array<string, mixed>|null */\n    public function getExamResultData(Exam $exam, ?Participant $participant): ?array")
with open("app/Services/ExamService.php", "w") as f:
    f.write(es)

# 9. ParticipantService.php
with open("app/Services/ParticipantService.php", "r") as f:
    ps = f.read()
ps = ps.replace("$question = Question::find($item['question_id']);", "$question = Question::find((int) $item['question_id']);")
ps = ps.replace("$choice = Choice::find($choiceId);", "$choice = Choice::find((int) $choiceId);")
# Add type hints for find() which can return collection
ps = ps.replace("Question::find((int) $item['question_id']);", "/** @var \\App\\Models\\Question|null $question */\n            $question = Question::find((int) $item['question_id']);")
ps = ps.replace("Choice::find((int) $choiceId);", "/** @var \\App\\Models\\Choice|null $choice */\n                $choice = Choice::find((int) $choiceId);")
with open("app/Services/ParticipantService.php", "w") as f:
    f.write(ps)

# 10. QuestionService.php
with open("app/Services/QuestionService.php", "r") as f:
    qs = f.read()
qs = qs.replace(": \\Illuminate\\Database\\Eloquent\\Collection", ": \\Illuminate\\Database\\Eloquent\\Collection<int, \\Illuminate\\Database\\Eloquent\\Model>")
with open("app/Services/QuestionService.php", "w") as f:
    f.write(qs)

# 11. SubjectService.php
with open("app/Services/SubjectService.php", "r") as f:
    ss = f.read()
ss = ss.replace(": \\Illuminate\\Database\\Eloquent\\Collection", ": \\Illuminate\\Database\\Eloquent\\Collection<int, \\Illuminate\\Database\\Eloquent\\Model>")
with open("app/Services/SubjectService.php", "w") as f:
    f.write(ss)
