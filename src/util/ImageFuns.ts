// import Pica from 'pica';
// import Pica from 'pica';

// export const resizeImage = async (file: Blob): Promise<Blob> => {
//      const pica = new Pica();
//      const img = new Image();
//      img.src = URL.createObjectURL(file);

//      await new Promise((resolve) => (img.onload = resolve));

//      const canvas = document.createElement('canvas');
//      canvas.width = img.width; // Set desired width
//      canvas.height = img.height; // Set desired height

//      if (img.width === canvas.width && img.height === canvas.height) {
//           return file;
//      }

//      await pica.resize(img, canvas, {
//           quality: 3, // Higher quality, but slower processing
//           unsharpAmount: 80, // Sharpening
//           unsharpThreshold: 10,
//      });

//      const originalType = file.type; // Example: 'image/png'
//      const blob = await pica.toBlob(canvas, originalType, 1);
//      return blob;
// };

import Pica from 'pica';

export const resizeImage = async (file: Blob): Promise<Blob> => {
     const pica = new Pica();
     const img = new Image();
     img.src = URL.createObjectURL(file);

     await new Promise((resolve) => (img.onload = resolve));

     const canvas = document.createElement('canvas');
     canvas.width = img.width; // Use the original width
     canvas.height = img.height; // Use the original height

  // Skip resizing if dimensions are identical
     if (img.width === canvas.width && img.height === canvas.height) {
     return file; // Return the original file if no resizing is needed
     }

  // Perform resizing
     await pica.resize(img, canvas, {
     quality: 3, // Highest quality
     unsharpAmount: 80, // Sharpening
     unsharpThreshold: 10,
     });

  // Output the image in the same format with the highest quality
     const originalType = file.type || 'image/png'; // Fallback to 'image/png'
     const blob = await pica.toBlob(canvas, originalType, 1); // 1 for maximum quality
     return blob;
};

