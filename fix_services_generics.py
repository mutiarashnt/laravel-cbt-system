import glob
import re

service_files = glob.glob("app/Services/*.php")

for file in service_files:
    with open(file, 'r') as f:
        content = f.read()

    # Find the malformed return type and fix it
    # We want to change:
    # public function getAll(): \Illuminate\Database\Eloquent\Collection<int, \Illuminate\Database\Eloquent\Model>
    # to:
    # /** @return \Illuminate\Database\Eloquent\Collection<int, \Illuminate\Database\Eloquent\Model> */
    # public function getAll(): \Illuminate\Database\Eloquent\Collection
    
    lines = content.split("\n")
    new_lines = []
    
    for i in range(len(lines)):
        line = lines[i]
        
        m = re.search(r"(public function get\w*\([^)]*\)): \\Illuminate\\Database\\Eloquent\\Collection<int, \\Illuminate\\Database\\Eloquent\\Model>", line)
        if m:
            func_sig = m.group(1)
            # Add PHPDoc before it
            if "/**" not in new_lines[-1] and "*/" not in new_lines[-1] and "/**" not in new_lines[-2] if len(new_lines) > 1 else True:
                new_lines.append("    /** @return \\Illuminate\\Database\\Eloquent\\Collection<int, \\Illuminate\\Database\\Eloquent\\Model> */")
            else:
                # If there's an existing docblock, we can just replace its ending '*/' with the @return, or just insert it
                # For simplicity, if previous line is '*/', let's insert it before
                if new_lines[-1].strip() == "*/":
                    new_lines[-1] = "     * @return \\Illuminate\\Database\\Eloquent\\Collection<int, \\Illuminate\\Database\\Eloquent\\Model>\n     */"
            
            line = f"    {func_sig}: \\Illuminate\\Database\\Eloquent\\Collection"
            
        new_lines.append(line)

    with open(file, 'w') as f:
        f.write("\n".join(new_lines))
