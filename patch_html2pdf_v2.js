const fs = require('fs');
const path = 'c:/Users/User/Desktop/КПО/diplom/js/lib/html2pdf.bundle.min.js';

try {
    const content = fs.readFileSync(path, 'utf8');

    // Look for A.template
    const searchString = 'A.template={';
    const index = content.indexOf(searchString);

    if (index === -1) {
        console.error('Could not find A.template in the bundle.');
        process.exit(1);
    }

    console.log('Found A.template at index:', index);

    // Extract the object to be safe
    // We expect something like A.template={prop:{...},progress:{...},opt:{...}}
    // Let's find the closing brace of A.template
    let braceCount = 0;
    let endIndex = -1;
    for (let i = index + searchString.length - 1; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') braceCount--;
        if (braceCount === 0) {
            endIndex = i;
            break;
        }
    }

    if (endIndex === -1) {
        console.error('Could not find closing brace for A.template');
        process.exit(1);
    }

    const oldTemplate = content.substring(index, endIndex + 1);
    console.log('Current template:', oldTemplate);

    // Prepare the new template
    // The user wants:
    /*
    opt: {
        margin: [10, 10, 24.5, 10], // Margins (Top, Right, Bottom, Left)
        filename: this.currentFilename, // In lib default should be "file.pdf"
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 4, // Higher quality
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: false,
            windowWidth: 800, // A4 width at 96 DPI
            scrollY: 0,
            scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: ['css', 'legacy'] }
    }
    */

    const newTemplate = 'A.template={prop:{src:null,container:null,overlay:null,canvas:null,img:null,pdf:null,pageSize:null},progress:{val:0,state:null,n:0,stack:[]},opt:{filename:"file.pdf",margin:[10,10,24.5,10],image:{type:"jpeg",quality:0.98},enableLinks:!0,html2canvas:{scale:4,useCORS:true,logging:false,letterRendering:true,allowTaint:false,windowWidth:800,scrollY:0,scrollX:0},jsPDF:{unit:"mm",format:"a4",orientation:"portrait",compress:true},pagebreak:{mode:["css","legacy"]}}}';

    const newFileContent = content.substring(0, index) + newTemplate + content.substring(endIndex + 1);
    fs.writeFileSync(path, newFileContent, 'utf8');
    console.log('Successfully patched html2pdf.bundle.min.js');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
