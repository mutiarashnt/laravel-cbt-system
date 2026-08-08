import glob
import re

models = glob.glob("app/Models/*.php")
for file in models:
    with open(file, 'r') as f:
        c = f.read()
    
    # Clean up previous bad top-level @use
    c = re.sub(r"/\*\*\n \* @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory[^\n]*\n \*/\nclass", "class", c)
    
    model_name = file.split("/")[-1].split(".")[0]
    factory_class = f"\\Database\\Factories\\{model_name}Factory"
    
    # If not already present
    if f"/** @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<{factory_class}> */" not in c:
        c = c.replace("    use HasFactory;", f"    /** @use \\Illuminate\\Database\\Eloquent\\Factories\\HasFactory<{factory_class}> */\n    use HasFactory;")
        
    with open(file, 'w') as f:
        f.write(c)

services = glob.glob("app/Services/*.php")
for file in services:
    with open(file, 'r') as f:
        c = f.read()
    
    # Remove native return type `: \Illuminate\Database\Eloquent\Collection` 
    c = c.replace(": \\Illuminate\\Database\\Eloquent\\Collection", "")
    
    with open(file, 'w') as f:
        f.write(c)

