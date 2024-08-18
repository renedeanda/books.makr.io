'use client';

import React from 'react';
import { jsPDF } from 'jspdf';
import { Button } from "@/components/ui/button";
import { Image } from 'lucide-react';

const LinkedInCarouselExport = ({ readingList, listName }) => {

  const generatePdf = async () => {
    const doc = new jsPDF({
      unit: 'px',
      format: 'a4',
      hotfixes: ['px_scaling']
    });

    const noCoverSvg = `
      <svg width="150" height="220" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="220" fill="#e4e4e4" />
        <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#999999" text-anchor="middle" alignment-baseline="middle">
          No cover available
        </text>
      </svg>
    `;

    for (let index = 0; index < readingList.length; index++) {
      const book = readingList[index];
      const bookElement = document.getElementById(`book-${book.key}`);
      
      if (bookElement) {
        doc.setFillColor(255, 236, 211);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

        doc.setTextColor('#e67e22');
        doc.setFontSize(48);
        doc.text(`${listName}`, 100, 80);

        doc.setTextColor('#333');
        doc.setFontSize(24);
        doc.text(`${index + 1} of ${readingList.length}`, 100, 130);

        doc.setFontSize(36);
        doc.text(book.title, 100, 180);

        const bookCover = bookElement.querySelector('img');
        let imageData = '';

        if (bookCover && bookCover.src) {
          try {
            // Create a canvas element to extract the image data
            const imageCanvas = document.createElement('canvas');
            const imageContext = imageCanvas.getContext('2d');
            imageCanvas.width = bookCover.naturalWidth;
            imageCanvas.height = bookCover.naturalHeight;
            imageContext.drawImage(bookCover, 0, 0, imageCanvas.width, imageCanvas.height);
            imageData = imageCanvas.toDataURL('image/jpeg');
          } catch (error) {
            console.error("Failed to capture the image:", error);
          }
        }

        if (!imageData) {
          // Fallback to "No cover available" SVG if no image data
          imageData = `data:image/svg+xml;base64,${btoa(noCoverSvg)}`;
        }

        doc.addImage(imageData, 'JPEG', 100, 200, 150, 220);

        doc.setFontSize(24);
        doc.text(`Author: ${book.author_name?.[0] || 'Unknown'}`, 100, 450);
        doc.text(`First Published: ${book.first_publish_year || 'Unknown'}`, 100, 490);

        if (index < readingList.length - 1) {
          doc.addPage();
        }
      }
    }

    doc.save(`${listName}_reading_list.pdf`);
  };

  return (
    <Button onClick={generatePdf} disabled={readingList.length === 0}>
      <Image className="mr-2" /> Export for LinkedIn
    </Button>
  );
};

export default LinkedInCarouselExport;