export const findFittingImage = (images, ratio = "3_2", wishedWidth = 300) => {
  if (!Array.isArray(images)) return "";

  const image = images.find(
    (img) => img.ratio === ratio && img.width > wishedWidth
  );
  return image?.url || images[0]?.url || "";
};
