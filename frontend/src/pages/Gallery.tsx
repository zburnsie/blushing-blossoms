import "./Gallery.css";

const images = [
  "/images/GalleryImages/gal1.JPG",
  "/images/GalleryImages/gal2.JPG",
  "/images/GalleryImages/gal3.JPG",
  "/images/GalleryImages/gal4.JPG",
  "/images/GalleryImages/gal5.JPG",
  "/images/GalleryImages/gal6.JPG",
  "/images/GalleryImages/gal7.JPG",
  "/images/GalleryImages/gal8.JPG",
  "/images/GalleryImages/gal9.JPG",
  "/images/GalleryImages/gal10.JPG",
  "/images/GalleryImages/gal11.JPG",
  "/images/GalleryImages/gal12.JPG",
  "/images/GalleryImages/gal13.JPG",
  "/images/GalleryImages/gal14.JPG",
  "/images/GalleryImages/gal15.JPG",
  "/images/GalleryImages/gal16.JPG",
  "/images/GalleryImages/gal17.JPG",
  "/images/GalleryImages/gal18.JPG",
  "/images/GalleryImages/gal19.JPG",
  "/images/GalleryImages/gal20.JPG",
  "/images/GalleryImages/gal21.JPG",
  "/images/GalleryImages/gal22.JPG",
  "/images/GalleryImages/gal23.JPG",
  "/images/GalleryImages/gal24.JPG",
  "/images/GalleryImages/gal25.JPG",
  "/images/GalleryImages/gal26.JPG",
  "/images/GalleryImages/gal27.JPG",
  "/images/GalleryImages/gal28.JPG",
  "/images/GalleryImages/gal29.JPG",
  "/images/GalleryImages/gal30.JPG",
  "/images/GalleryImages/gal31.JPG",
  "/images/GalleryImages/gal32.JPG",
  "/images/GalleryImages/gal33.JPG",
  "/images/GalleryImages/gal34.JPG",
  "/images/GalleryImages/gal35.JPG",
  "/images/GalleryImages/gal36.JPG",
  "/images/GalleryImages/gal37.JPG",
  "/images/GalleryImages/gal38.JPG",
  "/images/GalleryImages/gal39.JPG",
  "/images/GalleryImages/gal40.JPG",
  "/images/GalleryImages/gal41.JPG",
  "/images/GalleryImages/gal42.JPG",
  "/images/GalleryImages/gal43.JPG",
  "/images/GalleryImages/gal44.JPG",
  "/images/GalleryImages/gal45.JPG",
  "/images/GalleryImages/gal46.JPG",
  "/images/GalleryImages/gal47.JPG",
  "/images/GalleryImages/gal48.JPG",
  "/images/GalleryImages/gal49.JPG",
  "/images/GalleryImages/gal50.JPG",
  "/images/GalleryImages/gal51.JPG",
  "/images/GalleryImages/gal52.JPG",
  "/images/GalleryImages/gal53.JPG",
  "/images/GalleryImages/gal54.JPG",
  "/images/GalleryImages/gal55.JPG",
  "/images/GalleryImages/gal56.JPG",
];

export default function Gallery() {
  return (
    <div className="gallery-page">
      <div className="gallery-wrap">
        <h1 className="gallery-title">Gallery</h1>

        <section className="masonry">
          {images.map((src) => (
            <figure className="masonry-item" key={src}>
              <img className="masonry-img" src={src} alt="Blushing Blossoms gallery" loading="lazy" />
            </figure>
          ))}
        </section>
      </div>
    </div>
  );
}