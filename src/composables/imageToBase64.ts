export const convertImageToBase64 = async (image: File): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const file = new FileReader();
    file.readAsDataURL(image);
    file.onload = () => resolve(file.result as string);
    file.onerror = (err) => reject(err);
  });
};
