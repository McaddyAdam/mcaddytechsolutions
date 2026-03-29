from pathlib import Path
root = Path('.')
index = root / 'index.html'
text = index.read_text(encoding='utf-8')
start = text.index('<!-- Topbar Start -->')
end = text.index('<!-- Full Screen Search End -->') + len('<!-- Full Screen Search End -->')
header_block = text[start:end]
fs = text.index('<!-- Footer Start -->')
fe = text.index('<!-- Back to Top -->')
footer_block = text[fs:fe]
changed_files=[]
for f in root.glob('*.html'):
    if f.name == 'index.html':
        continue
    page = f.read_text(encoding='utf-8')
    if '<!-- Topbar Start -->' in page and '<!-- Full Screen Search End -->' in page:
        s = page.index('<!-- Topbar Start -->')
        e = page.index('<!-- Full Screen Search End -->') + len('<!-- Full Screen Search End -->')
        page = page[:s] + header_block + page[e:]
    else:
        print('skip header', f)
        continue
    if '<!-- Footer Start -->' in page and '<!-- Back to Top -->' in page:
        s2 = page.index('<!-- Footer Start -->')
        e2 = page.index('<!-- Back to Top -->')
        page = page[:s2] + footer_block + page[e2:]
    else:
        print('skip footer', f)
        continue
    f.write_text(page, encoding='utf-8')
    changed_files.append(f.name)
print('updated:', changed_files)
