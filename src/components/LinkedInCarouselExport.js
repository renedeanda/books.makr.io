'use client';

import React from 'react';
import { toPng } from 'html-to-image';
import { Button } from "@/components/ui/button";
import { Image } from 'lucide-react';

const LinkedInCarouselExport = ({ readingList, listName }) => {
  const generateCarouselImages = async () => {
    const images = await Promise.all(readingList.map(async (book, index) => {
      const node = document.createElement('div');
      node.style.width = '1080px';
      node.style.height = '1080px';
      node.style.display = 'flex';
      node.style.flexDirection = 'column';
      node.style.justifyContent = 'space-between';
      node.style.alignItems = 'center';
      node.style.backgroundColor = '#fff';
      node.style.padding = '50px';
      node.style.boxSizing = 'border-box';
      node.style.fontFamily = 'Arial, sans-serif';
      node.style.color = '#2c3e50';
      
      // Directly use cover image URL
      const coverUrl = book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` 
        : '/placeholder-book-cover.jpg';
      
      node.innerHTML = `
        <div style="text-align: center; width: 100%;">
          <h1 style="font-size: 60px; margin-bottom: 20px;">${listName}</h1>
          <h2 style="font-size: 40px; margin-bottom: 20px;">${index + 1} of ${readingList.length}</h2>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
          <img src="${coverUrl}" alt="Book cover" style="width: 320px; height: 480px; object-fit: cover; margin-right: 40px; box-shadow: 0 8px 16px rgba(0,0,0,0.2);">
          <div style="text-align: left; max-width: 600px;">
            <h3 style="font-size: 50px; margin-bottom: 20px;">${book.title}</h3>
            <p style="font-size: 36px; margin-bottom: 10px;">by ${book.author_name?.[0] || 'Unknown'}</p>
            <p style="font-size: 32px; margin-bottom: 20px;">Published: ${book.first_publish_year || 'Unknown'}</p>
          </div>
        </div>
        <div style="width: 100%; text-align: center; margin-top: 40px;">
          <p style="font-size: 30px; color: #95a5a6;">Made with ❤️ by books.makr.io</p>
        </div>
      `;

      document.body.appendChild(node);
      const image = await toPng(node);
      document.body.removeChild(node);
      return image;
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