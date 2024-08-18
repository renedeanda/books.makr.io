'use client';

import React from 'react';
import { toPng } from 'html-to-image';
import { Button } from "@/components/ui/button";
import { Image } from 'lucide-react';

const LinkedInCarouselExport = ({ readingList, listName }) => {
  const generateCarouselImages = async () => {
    const images = await Promise.all(readingList.map(async (book, index) => {
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

        // Clone the existing book DOM element and use it for export
        const bookClone = bookElement.cloneNode(true);
        bookClone.style.width = '320px';
        bookClone.style.height = '480px';
        bookClone.style.marginRight = '40px';
        bookClone.style.borderRadius = '15px';
        bookClone.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';

        node.innerHTML = `
          <div style="text-align: center; width: 100%;">
            <h1 style="font-size: 60px; margin-bottom: 20px; color: #ff6600;">${listName}</h1>
            <h2 style="font-size: 40px; margin-bottom: 20px;">${index + 1} of ${readingList.length}</h2>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
          </div>
          <div style="width: 100%; text-align: center; margin-top: 40px;">
            <p style="font-size: 30px; color: #95a5a6;">Made with ❤️ by books.makr.io</p>
          </div>
        `;
        node.querySelector('div:nth-child(2)').appendChild(bookClone);

        document.body.appendChild(node);
        const image = await toPng(node, { cacheBust: true });
        document.body.removeChild(node);
        return image;
      }
    }));

    // Create a zip file containing all images
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    images.forEach((image, index) => {
      zip.file(`carousel_image_${index + 1}.png`, image.split('base64,')[1], { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${listName}_linkedin_carousel.zip`;
    link.click();
  };

  return (
    <Button onClick={generateCarouselImages} disabled={readingList.length === 0}>
      <Image className="mr-2" /> Export for LinkedIn
    </Button>
  );
};

export default LinkedInCarouselExport;