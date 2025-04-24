export const findFittingImage = (images, ratio = "3_2", wishedHeight = 400) => {
  if (!Array.isArray(images)) return "";

  const image = images.find(
    (img) => img.ratio === ratio && img.height > wishedHeight
  );
  return image?.url || images[0]?.url || "";
};
