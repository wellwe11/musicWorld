export const findFittingImage = (images, ratio = "16_9") => {
  if (!Array.isArray(images)) return "";

  const image = images.find((img) => img.ratio === ratio);
  return image?.url || images[0]?.url || "";
};
