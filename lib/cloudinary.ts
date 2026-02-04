export function getThumbnailUrl(originalUrl: string) {
  return originalUrl.replace(
    "/upload/",
    "/upload/w_300,h_200,c_fill,q_auto,f_auto/"
  );
}
