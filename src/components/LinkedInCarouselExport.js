'use client';

import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";
import { Image } from 'lucide-react';

const LinkedInCarouselExport = ({ readingList, listName }) => {
  const generatePDF = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [1080, 1080],
    });

    for (let i = 0; i < readingList.length; i++) {
      const book = readingList[i];
      const bookElement = document.getElementById(`book-${book.key}`);
      
      if (bookElement) {
        const node = document.createElement('div');
        node.style.width = '1080px';
        node.style.height = '1080px';
        node.style.display = 'flex';
        node.style.flexDirection = 'column';
        node.style.justifyContent = 'space-between';
        node.style.alignItems = 'center';
        node.style.backgroundColor = '#fdf6e3';
        node.style.padding = '50px';
        node.style.boxSizing = 'border-box';
        node.style.fontFamily = "'Poppins', sans-serif";
        node.style.color = '#2c3e50';
        node.style.border = '10px solid #eee';
        node.style.borderRadius = '20px';
        node.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';

        const bookClone = bookElement.cloneNode(true);
        bookClone.style.width = '320px';
        bookClone.style.height = '480px';
        bookClone.style.marginRight = '40px';
        bookClone.style.borderRadius = '15px';
        bookClone.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';

        node.innerHTML = `
          <div style="text-align: center; width: 100%;">
            <h1 style="font-size: 60px; margin-bottom: 20px; color: #ff6600;">${listName}</h1>
            <h2 style="font-size: 40px; margin-bottom: 20px;">${i + 1} of ${readingList.length}</h2>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
          </div>
          <div style="width: 100%; text-align: center; margin-top: 40px;">
            <p style="font-size: 30px; color: #95a5a6;">Made with ❤️ by books.makr.io</p>
          </div>
        `;
        node.querySelector('div:nth-child(2)').appendChild(bookClone);

        document.body.appendChild(node);

        // Capture the content as an image
        const canvas = await html2canvas(node);
        const imgData = canvas.toDataURL('image/png');

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1080);

        document.body.removeChild(node);
      }
    }

    // Save the PDF
    pdf.save(`${listName}_linkedin_carousel.pdf`);
  };

  return (
    <Button onClick={generatePDF} disabled={readingList.length === 0}>
      <Image className="mr-2" /> Export for LinkedIn
    </Button>
  );
};

export default LinkedInCarouselExport;