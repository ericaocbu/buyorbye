
import { ArrowRight, Sparkles } from "lucide-react";

export default function PlaceholderPage({ eyebrow, title, description, next }) {
  return (
    <div className="content-page">
      <div className="page-intro">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <section className="coming-soon-card">
        <div className="coming-soon-icon">
          <Sparkles size={24} />
        </div>
        <h3>Let's build this next.</h3>
        <p>
          This space is ready for its next feature. We're building Buy or
          Bye one connected experience at a time.
        </p>
        {next && (
          <div className="next-feature">
            <span>NEXT UP</span>
            <strong>{next}</strong>
            <ArrowRight size={17} />
          </div>
        )}
      </section>
    </div>
  );
}
