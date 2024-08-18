'use client';

import React from 'react';
import { toPng } from 'html-to-image';
import { Button } from "@/components/ui/button"
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
      node.style.backgroundColor = '#f0f0f0';
      node.style.padding = '40px';
      node.style.boxSizing = 'border-box';
      node.style.fontFamily = 'Arial, sans-serif';
      
      // Fetch book cover
      let coverUrl = '/placeholder-book-cover.jpg';
      try {
        const coverResponse = await fetch(`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`);
        if (coverResponse.ok) {
          const coverBlob = await coverResponse.blob();
          coverUrl = URL.createObjectURL(coverBlob);
        }
      } catch (error) {
        console.error('Error fetching book cover:', error);
      }
      
      node.innerHTML = `
        <div style="text-align: center; width: 100%;">
          <h1 style="font-size: 48px; margin-bottom: 20px; color: #333;">${listName}</h1>
          <h2 style="font-size: 36px; margin-bottom: 10px; color: #555;">${index + 1} of ${readingList.length}</h2>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
          <img src="${coverUrl}" alt="Book cover" style="width: 300px; height: 450px; object-fit: cover; margin-right: 40px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: left;">
            <h3 style="font-size: 40px; margin-bottom: 20px; color: #333;">${book.title}</h3>
            <p style="font-size: 32px; margin-bottom: 10px; color: #555;">by ${book.author_name?.[0] || 'Unknown'}</p>
            <p style="font-size: 28px; margin-bottom: 20px; color: #777;">Published: ${book.first_publish_year || 'Unknown'}</p>
            <p style="font-size: 24px; color: #999;">Genre: ${book.subject?.[0] || 'Not specified'}</p>
          </div>
        </div>
        <div style="width: 100%; text-align: center; margin-top: 20px;">
          <p style="font-size: 24px; color: #999;">Made with books.makr.io</p>
        </div>
      `;

      document.body.appendChild(node);
      const image = await toPng(node);
      document.body.removeChild(node);
      URL.revokeObjectURL(coverUrl);
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