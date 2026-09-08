import os, base64
def write_file(path, b64_content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'wb').write(base64.b64decode(b64_content))
    print(f'Successfully wrote {path}')
