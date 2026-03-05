import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            tree = ET.XML(docx.read('word/document.xml'))
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for paragraph in tree.findall('.//w:p', namespaces):
                texts = [node.text for node in paragraph.findall('.//w:t', namespaces) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            return '\n'.join(paragraphs)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        path = sys.argv[1]
    else:
        path = r"d:\User\Desktop\diplom\Диплом проверка 2.docx"
    
    text = extract_text_from_docx(path)
    with open("docx_output.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Done")
