import "./ReviewBanner.css";

type ReviewBannerProps = {
  quote: string;
  author?: string;
  backgroundImage: string;
};

export default function ReviewBanner({
  quote,
  author,
  backgroundImage,
}: ReviewBannerProps) {
  return (
    <section
      className="review-banner"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-label="Client review"
    >
      <div className="review-banner-overlay" />

      <div className="review-banner-content">
        <p className="review-quote">“{quote}”</p>
        {author && <p className="review-author">— {author}</p>}
      </div>
    </section>
  );
}
