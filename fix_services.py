import glob
import re

service_files = glob.glob("app/Services/*.php")

for file in service_files:
    with open(file, 'r') as f:
        content = f.read()

    lines = content.split("\n")
    new_lines = []
    
    for i in range(len(lines)):
        line = lines[i]
        
        m = re.search(r"(public function get(All|Recent)\w*\([^)]*\))\s*$", line)
        if m:
            if ": array" not in line and ": Collection" not in line and ": \Illuminate" not in line and ": ?array" not in line:
                line = re.sub(r"(public function get(All|Recent)\w*\([^)]*\))\s*$", r"\1: \\Illuminate\\Database\\Eloquent\\Collection", line)
        
        if "array $data" in line:
            if new_lines[-1].strip() == "*/":
                new_lines[-1] = "     * @param array<string, mixed> $data\n     */"
            else:
                new_lines.append("    /**\n     * @param array<string, mixed> $data\n     */")

        if "array $answersData" in line:
            if new_lines[-1].strip() == "*/":
                new_lines[-1] = "     * @param array<int, array<string, mixed>> $answersData\n     */"

        new_lines.append(line)

    new_content = "\n".join(new_lines)
    with open(file, 'w') as f:
        f.write(new_content)
