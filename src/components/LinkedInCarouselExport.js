
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
      node.style.justifyContent = 'center';
      node.style.alignItems = 'center';
      node.style.backgroundColor = '#f0f0f0';
      node.style.padding = '40px';
      node.style.boxSizing = 'border-box';
      
      // Fetch book cover
      const coverResponse = await fetch(`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`);
      const coverBlob = await coverResponse.blob();
      const coverUrl = URL.createObjectURL(coverBlob);
      
      node.innerHTML = `
        <h1 style="font-size: 48px; margin-bottom: 20px; text-align: center; color: #333;">${listName} Reading List</h1>
        <h2 style="font-size: 36px; margin-bottom: 10px; text-align: center; color: #555;">${index + 1}/${readingList.length}</h2>
        <img src="${coverUrl}" alt="Book cover" style="width: 200px; height: 300px; object-fit: cover; margin-bottom: 20px;">
        <h3 style="font-size: 32px; margin-bottom: 20px; text-align: center; color: #333;">${book.title}</h3>
        <p style="font-size: 24px; margin-bottom: 10px; text-align: center; color: #555;">by ${book.author_name?.[0] || 'Unknown'}</p>
        <p style="font-size: 24px; margin-bottom: 20px; text-align: center; color: #555;">Published: ${book.first_publish_year || 'Unknown'}</p>
        <p style="font-size: 18px; position: absolute; bottom: 20px; right: 20px; color: #777;">Created with books.makr.io</p>
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
