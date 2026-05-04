import os
import re

def increase_tailwind_text(match, increment):
    size = match.group(1)
    
    # Exclude certain utility classes that start with text- but aren't sizes
    exclude = ["left", "right", "center", "justify", "transparent", "white", "black", "muted", "on-surface", "on-primary", "primary", "green", "neon"]
    if size in exclude or size.startswith("var") or size.startswith("[#"):
        return match.group(0)
    
    # Mapping for standard tailwind text sizes
    # We define steps of 1 point (increment = 2 means 2 steps)
    sizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"]
    
    if size in sizes:
        idx = sizes.index(size)
        # Note: increment could be 2 or 3
        new_idx = min(len(sizes) - 1, idx + increment)
        return f"text-{sizes[new_idx]}"
    
    # Check for text-[13px] etc
    px_match = re.match(r'^\[(\d+)px\]$', size)
    if px_match:
        val = int(px_match.group(1))
        return f"text-[{val + increment}px]"
        
    return match.group(0)

def process_file(filepath, increment):
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Find text-sm, text-[13px], text-center etc.
    new_content = re.sub(r'text-([a-zA-Z0-9\[\]\#\-]+)', lambda m: increase_tailwind_text(m, increment), content)
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath} with +{increment} points")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            filepath = os.path.join(root, file)
            # Default increment is 2
            inc = 2
            
            # Dashboard gets +3
            if 'dashboard' in filepath.lower():
                inc = 3
                
            # Tabs for players/dream team etc... this is LayoutShell
            if 'LayoutShell' in file:
                inc = 3
                
            process_file(filepath, inc)

print("Done")
