export const encodeImages = async (images) => {
    /**
     * Returns an object with images encoded in base64 string
     * ------------------------------------------------------
     * Object structure: {main: "Encoded main image", secondaryImages: ["encoded secondary images", ...]}
     * ------------------------------------------------------
     * @param images object with files inside
     */
    let encodedImages = { main: null, secondaryImages: [] };
    // create a promise that resolves with the main image data URL
    let mainImagePromise = new Promise((resolve, reject) => {
      // convert the main image to base64 string
      const mainImageReader = new FileReader();
      mainImageReader.readAsDataURL(images.main);
      mainImageReader.onloadend = () => {
        // resolve the promise with the result
        resolve(mainImageReader.result);
      };
      mainImageReader.onerror = () => {
        // reject the promise with the error
        reject(mainImageReader.error);
      };
    });
    // assign the main image data URL to the encodedImages object
    encodedImages.main = await mainImagePromise;
    // create an array of promises for the secondary images
    let secondaryImagesPromises = [];
    // convert the secondary images to base64 strings
    for (let i = 0; i < images.secondaryImages.length; i++) {
      // create a promise for each secondary image
      secondaryImagesPromises[i] = new Promise((resolve, reject) => {
        const secondaryImageReader = new FileReader();
        secondaryImageReader.readAsDataURL(images.secondaryImages[i]);
        secondaryImageReader.onloadend = () => {
          // resolve the promise with the result
          resolve(secondaryImageReader.result);
        };
        secondaryImageReader.onerror = () => {
          // reject the promise with the error
          reject(secondaryImageReader.error);
        };
      });
    }
    // assign the array of secondary images data URLs to the encodedImages object
    encodedImages.secondaryImages = await Promise.all(secondaryImagesPromises);
    // return the encodedImages object
    return encodedImages;
  };