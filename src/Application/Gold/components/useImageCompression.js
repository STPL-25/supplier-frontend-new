import { useState, useCallback } from 'react';
const useImageCompression = (defaultTargetSizeKB = 100) => {
    const [isCompressing, setIsCompressing] = useState(false);
    
    const compressAndConvertToJPG = useCallback(async (file, targetSizeKB = defaultTargetSizeKB) => {
      setIsCompressing(true);
      
      try {
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            
            img.onload = async () => {
              let quality = 0.8; // Start with a high quality
              let width = img.width;
              let height = img.height;
              let blob;
  
              do {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
  
                // Scale canvas dimensions (if needed)
                canvas.width = width;
                canvas.height = height;
  
                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0, width, height);
  
                // Compress and convert to JPG
                blob = await new Promise((res) =>
                  canvas.toBlob((b) => res(b), "image/jpeg", quality)
                );
  
                // Reduce quality or dimensions iteratively if size is larger
                if (blob.size / 1024 > targetSizeKB) {
                  quality -= 0.1; // Reduce quality
                  if (quality < 0.2) {
                    // If quality gets too low, scale down the dimensions
                    width = Math.round(width * 0.9);
                    height = Math.round(height * 0.9);
                    quality = 0.8; // Reset quality
                  }
                }
              } while (blob.size / 1024 > targetSizeKB);
  
              // Resolve with the final compressed file
              resolve(
                new File([blob], `${file.name.split(".")[0]}.jpg`, {
                  type: "image/jpeg",
                })
              );
            };
          };
          
          reader.onerror = reject;
        });
      } catch (error) {
        throw error;
      } finally {
        setIsCompressing(false);
      }
    }, [defaultTargetSizeKB]);
  
    return {
      compressAndConvertToJPG,
      isCompressing
    };
  };
  
  export default useImageCompression;
