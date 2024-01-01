// Function to encode a single image
export const encodeOneImage = async (image) => {

  if (!image || !(image instanceof File)) {
    return null; // Handle null or undefined image
  }

  const imageReader = new FileReader();
  imageReader.readAsDataURL(image);

  return new Promise((resolve, reject) => {
    imageReader.onloadend = () => resolve(imageReader.result);
    imageReader.onerror = () => reject(imageReader.error);
  });
};

// Function to encode multiple images
export const encodeManyImages = async (images) => {
  if (!images || images.length === 0) {
    return null; // Handle empty array or undefined images
  }

  const promises = images.map(encodeOneImage);
  return await Promise.all(promises);
};

// Updated encodeImages function
export const encodeImages = async (images) => {
  /**
   * Returns an object with images encoded in base64 string
   * ------------------------------------------------------
   * Object structure: {main: "Encoded main image", secondaryImages: ["encoded secondary images", ...]}
   * ------------------------------------------------------
   * @param images object with files inside
   */
  try {
    // encode main image
    const encodedMain = await encodeOneImage(images.main);
    // encode secondary images
    const encodedSecondary = await encodeManyImages(images.secondaryImages);

    return { main: encodedMain, secondaryImages: encodedSecondary };
  } catch (error) {
    throw new Error("Failed to encode images: " + error.message);
  }
};



