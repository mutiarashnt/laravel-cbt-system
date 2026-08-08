import glob
import re

model_files = glob.glob("app/Models/*.php")

for file in model_files:
    with open(file, 'r') as f:
        content = f.read()

    lines = content.split("\n")
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        
        m = re.search(r"public function \w+\(\):\s*(HasMany|BelongsTo|BelongsToMany)", line)
        if m:
            relation_type = m.group(1)
            model_name = "Model"
            for j in range(i+1, min(i+5, len(lines))):
                m_model = re.search(r"return \$this->\w+\(\s*([a-zA-Z0-9_]+)::class", lines[j])
                if m_model:
                    model_name = m_model.group(1)
                    break
            
            if "/**" not in lines[i-1] and "*/" not in lines[i-1]:
                new_lines.append(f"    /** @return {relation_type}<{model_name}, $this> */")
        
        new_lines.append(line)
        i += 1

    new_content = "\n".join(new_lines)
    
    if "Exam.php" in file:
        if "/**" in new_content:
            new_content = new_content.replace(
                " * @property \\Illuminate\\Support\\Carbon|null $updated_at\n */",
                " * @property \\Illuminate\\Support\\Carbon|null $updated_at\n * @property \\App\\Models\\Participant|null $user_participant\n */"
            )
        else:
            new_content = re.sub(r"class Exam", "/**\n * @property \\\\App\\\\Models\\\\Participant|null $user_participant\n */\nclass Exam", new_content)
            
    with open(file, 'w') as f:
        f.write(new_content)
