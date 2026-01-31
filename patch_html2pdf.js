const fs = require('fs');
const path = 'c:/Users/User/Desktop/КПО/diplom/js/lib/html2pdf.bundle.min.js';

try {
    let content = fs.readFileSync(path, 'utf8');
    
    // Use a regex to find the opt section in A.template
    const optRegex = /opt:\{filename:"file\.pdf",margin:\[0,0,0,0\],image:\{type:"jpeg",quality:\.?95\},enableLinks:!0,html2canvas:\{\},jsPDF:\{\}\}/;
    
    if (!optRegex.test(content)) {
        console.error('Could not find the default options template in the bundle.');
        // Try searching for a smaller piece to see what it looks like
        const partial = content.indexOf('filename:"file.pdf"');
        if (partial !== -1) {
            console.log('Found filename partial at:', partial);
            console.log('Context:', content.substring(partial, partial + 200));
        }
        process.exit(1);
    }
    
    const replacement = 'opt:{filename:"file.pdf",margin:[10,10,24.5,10],image:{type:"jpeg",quality:0.98},enableLinks:!0,html2canvas:{scale:4,useCORS:true,logging:false,letterRendering:true,allowTaint:false,windowWidth:800,scrollY:0,scrollX:0},jsPDF:{unit:"mm",format:"a4",orientation:"portrait",compress:true},pagebreak:{mode:["css","legacy"]}}';
    
    const newContent = content.replace(optRegex, replacement);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log('Successfully patched html2pdf.bundle.min.js');
} catch (err) {
    console.error('Error patching file:', err);
    process.exit(1);
}
