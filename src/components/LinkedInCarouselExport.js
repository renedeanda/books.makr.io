'use client';

import React from 'react';
import { jsPDF } from 'jspdf';
import { Button } from "@/components/ui/button";
import { Image } from 'lucide-react';

const LinkedInCarouselExport = ({ readingList, listName }) => {

  const generatePdf = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [1080, 1080], // Square format
      hotfixes: ['px_scaling']
    });

    const noCoverSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="220" viewBox="0 0 150 220">
        <rect width="150" height="220" fill="#e4e4e4" />
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="#999999" text-anchor="middle" alignment-baseline="middle">
          No cover available
        </text>
      </svg>
    `;
    const noCoverImage = `data:image/svg+xml;base64,${btoa(noCoverSvg)}`;

    for (let index = 0; index < readingList.length; index++) {
      const book = readingList[index];
      const bookElement = document.getElementById(`book-${book.key}`);
      
      let imageData = noCoverImage;

      if (bookElement) {
        const bookCover = bookElement.querySelector('img');
        if (bookCover && bookCover.src) {
          try {
            const imageCanvas = document.createElement('canvas');
            const imageContext = imageCanvas.getContext('2d');
            imageCanvas.width = bookCover.naturalWidth;
            imageCanvas.height = bookCover.naturalHeight;
            imageContext.drawImage(bookCover, 0, 0, imageCanvas.width, imageCanvas.height);
            imageData = imageCanvas.toDataURL('image/jpeg');
          } catch (error) {
            console.error("Failed to capture the image from DOM:", error);
          }
        }
      }

      if (imageData === noCoverImage && book.cover_i) {
        try {
          const coverResponse = await fetch(`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`);
          if (coverResponse.ok) {
            const coverBlob = await coverResponse.blob();
            imageData = URL.createObjectURL(coverBlob);
          }
        } catch (error) {
          console.error('Error fetching book cover:', error);
        }
      }

      doc.setFillColor(255, 236, 211);
      doc.rect(0, 0, 1080, 1080, 'F');

      doc.setTextColor('#e67e22');
      doc.setFontSize(48);
      doc.text(`${listName}`, 540, 80, { align: "center" });

      doc.setTextColor('#333');
      doc.setFontSize(24);
      doc.text(`${index + 1} of ${readingList.length}`, 540, 130, { align: "center" });

      doc.setFontSize(36);
      doc.text(book.title, 540, 200, { align: "center" });

      doc.addImage(imageData, 'JPEG', 190, 300, 300, 450); // Centered Image

      doc.setFontSize(24);
      doc.text(`Author: ${book.author_name?.[0] || 'Unknown'}`, 540, 790, { align: "center" });
      doc.text(`First Published: ${book.first_publish_year || 'Unknown'}`, 540, 830, { align: "center" });

      doc.setFontSize(24);
      doc.setTextColor('#e67e22');
      doc.text("Made with books.makr.io", 540, 980, { align: "center" }); // Larger, centered attribution footer

      if (index < readingList.length - 1) {
        doc.addPage();
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