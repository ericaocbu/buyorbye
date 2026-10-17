import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  ExternalLink,
  History,
  Pencil,
  ShoppingBag,
} from "lucide-react";

import { useEvaluations } from "../context/EvaluationContext";

function formatCurrency(value) {
  const price = Number(value);

  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(price)
  ) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const decisionLabels = {
  BUY: "Buy",
  WAIT: "Wait",
  BYE: "Bye",
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const { evaluations } = useEvaluations();

  const sortedEvaluations = [...evaluations].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

    return dateB - dateA;
  });

  function editEvaluation(evaluation) {
    navigate("/evaluations", {
      state: { product: evaluation.product },
    });
  }

  if (sortedEvaluations.length === 0) {
    return (
      <section className="history-page">
        <div className="history-intro">
          <span className="eyebrow">YOUR SHOPPING JOURNAL</span>
          <h2>Your decisions, all in one place.</h2>
          <p>
            Keep track of the products you've considered and the choices
            you've made.
          </p>
        </div>

        <div className="history-empty">
          <div className="history-empty-icon">
            <History size={28} />
          </div>

          <h3>No decisions yet</h3>
          <p>
            When you evaluate a product and save your decision, it will show
            up here. You can revisit it whenever you need to.
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate("/explore")}
          >
            Explore products
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="history-page">
      <div className="history-intro">
        <span className="eyebrow">YOUR SHOPPING JOURNAL</span>
        <h2>Your decisions, all in one place.</h2>
        <p>
          Revisit your reasoning, update an evaluation, or see how your
          decisions have changed.
        </p>
      </div>

      <div className="history-summary">
        <div className="history-summary-icon">
          <History size={20} />
        </div>

        <div>
          <strong>
            {sortedEvaluations.length}{" "}
            {sortedEvaluations.length === 1 ? "decision" : "decisions"}
          </strong>
          <span>Your saved purchase evaluations</span>
        </div>
      </div>

      <div className="history-list">
        {sortedEvaluations.map((evaluation) => {
          const product = evaluation.product;
          const recommendation =
            evaluation.recommendation?.decision || "";
          const finalDecision = evaluation.finalDecision || "";
          const date = evaluation.updatedAt || evaluation.createdAt;
          const decisionLabel =
            decisionLabels[finalDecision] || finalDecision || "Not set";
          const recommendationLabel =
            decisionLabels[recommendation] || recommendation || "Not available";

          const decisionClass = finalDecision.toLowerCase();
          const recommendationClass = recommendation.toLowerCase();

          return (
            <article className="history-card" key={evaluation.id}>
              <div className="history-card-main">
                <div className="history-product-image">
                  {product.imageUrl || product.image ? (
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <ShoppingBag size={26} />
                  )}
                </div>

                <div className="history-product-details">
                  <div className="history-product-heading">
                    <div>
                      <h3>{product.name}</h3>
                      <p className="history-product-meta">
                        {[product.brand, product.retailer]
                          .filter(Boolean)
                          .join(" · ") || "Product evaluation"}
                      </p>
                    </div>

                    <span className={`history-decision ${decisionClass}`}>
                      {decisionLabel}
                    </span>
                  </div>

                  <p className="history-product-price">
                    {formatCurrency(product.price)}
                  </p>

                  <div className="history-badges">
                    <span className="history-badge-label">
                      Our recommendation
                    </span>
                    <span
                      className={`history-recommendation ${recommendationClass}`}
                    >
                      {recommendationLabel}
                    </span>

                    {recommendation &&
                      finalDecision &&
                      recommendation !== finalDecision && (
                        <span className="history-adjusted-label">
                          Your choice differed
                        </span>
                      )}
                  </div>

                  <div className="history-date">
                    <CalendarDays size={14} />
                    <span>Last updated {formatDate(date)}</span>
                  </div>
                </div>
              </div>

              <div className="history-card-actions">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => editEvaluation(evaluation)}
                >
                  <Pencil size={15} />
                  Edit evaluation
                </button>

                {product.productUrl && (
                  <a
                    className="history-product-link"
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View product
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="history-footer-note">
        <Clock3 size={16} />
        <p>
          Changed your mind? Edit an evaluation to update your answers and
          decision. Your existing entry will be updated rather than duplicated.
        </p>
      </div>
    </section>
  );
}