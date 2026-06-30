import re
import glob
import os

files = glob.glob('src/app/(public)/fleet/*/page.tsx')
count = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content
    
    # 1. Add applicableCountry
    content = re.sub(
        r'("@type":\s*"MerchantReturnPolicy",\s*)("returnPolicyCategory")',
        r'\1"applicableCountry": "SA",\n            \2',
        content
    )
    
    # 2. Change hasCertification to award
    content = re.sub(
        r'"hasCertification":\s*"([^"]+)"',
        r'"award": "\1"',
        content
    )
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1
        print(f"Updated {f}")

print(f"Successfully updated {count} files.")
