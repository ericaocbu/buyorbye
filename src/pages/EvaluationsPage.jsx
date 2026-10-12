import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Heart,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import { useEvaluations } from "../context/EvaluationContext";

const initialAnswers = {
  need: "",
  budget: "",
  usage: "",
  urgency: "",
  alternatives: "",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function getRecommendation(product, answers) {
  const price = Number(product?.price);

  const hasPrice =
    product?.price !== null &&
    product?.price !== undefined &&
    product?.price !== "" &&
    Number.isFinite(price);

  const budget = Number(answers.budget);

  const hasBudget =
    answers.budget !== "" &&
    Number.isFinite(budget) &&
    budget >= 0;

  if (
    !answers.need ||
    !hasBudget ||
    !answers.usage ||
    !answers.urgency ||
    !answers.alternatives
  ) {
    return null;
  }

  if (answers.need === "does_not_solve") {
    return {
      decision: "BYE",
      reasons: [
        "This product doesn't solve the problem you're trying to address.",
      ],
      nextStep:
        "Skip this item and look for something that better fits your needs.",
    };
  }

  if (!hasPrice) {
    return {
      decision: "WAIT",
      reasons: [
        "We couldn't verify a usable price for this listing.",
      ],
      nextStep:
        "Check the retailer's current price before deciding whether it fits your budget.",
    };
  }

  if (price > budget) {
    const reasons = [
      `At ${formatCurrency(price)}, this item is above your comfortable budget of ${formatCurrency(budget)}.`,
    ];

    if (answers.urgency === "need_now") {
      reasons.push(
        "You need it soon, so finding an affordable option is especially important."
      );
    } else {
      reasons.push(
        "Buying it now could put pressure on the amount you feel comfortable spending."
      );
    }

    return {
      decision: "WAIT",
      reasons,
      nextStep:
        "Compare less expensive alternatives or wait until you can comfortably afford it.",
    };
  }

  if (answers.alternatives === "cheaper_found") {
    return {
      decision: "BYE",
      reasons: [
        "You've found a cheaper option that meets your needs.",
        "The more expensive product hasn't shown a clear advantage based on your answers.",
      ],
      nextStep:
        "Compare essential features and total cost before choosing the option that gives you the best value.",
    };
  }

  if (answers.need === "unsure") {
    return {
      decision: "WAIT",
      reasons: [
        "You're not sure how much you need this item yet.",
        "Clarifying what you want it to accomplish may help you avoid an unnecessary purchase.",
      ],
      nextStep:
        "Identify the specific problem this purchase would solve and revisit the decision.",
    };
  }

  if (answers.alternatives === "not_compared") {
    return {
      decision: "WAIT",
      reasons: [
        "You haven't compared alternatives yet.",
        "A quick comparison could reveal a better fit or a lower price.",
      ],
      nextStep:
        "Compare at least two alternatives before committing to this purchase.",
    };
  }

  if (
    answers.need === "mostly_want" &&
    answers.usage === "rarely"
  ) {
    return {
      decision: "BYE",
      reasons: [
        "You don't have a strong need for this item.",
        "You expect to use it rarely, which may make the cost harder to justify.",
      ],
      nextStep:
        "Consider leaving it off your list and revisiting it if your needs change.",
    };
  }

  if (
    answers.usage === "rarely" &&
    answers.need !== "replace"
  ) {
    return {
      decision: "WAIT",
      reasons: [
        "You expect to use this item infrequently.",
        "Its value may depend on whether occasional use justifies the cost.",
      ],
      nextStep:
        "Consider borrowing, renting, or choosing a less expensive option.",
    };
  }

  const reasons = [];

  if (answers.need === "replace") {
    reasons.push(
      "You need a replacement for something you already use."
    );
  } else if (answers.need === "recurring_problem") {
    reasons.push(
      "This purchase could help solve a recurring problem."
    );
  } else {
    reasons.push(
      "This product could be useful, but it isn't essential."
    );
  }

  reasons.push(
    "The listed price is within your comfortable budget."
  );

  if (answers.usage === "daily") {
    reasons.push("You expect to use it daily.");
  } else if (answers.usage === "weekly") {
    reasons.push("You expect to use it regularly.");
  } else {
    reasons.push("You expect to use it occasionally.");
  }

  if (answers.urgency === "no_rush") {
    return {
      decision: "WAIT",
      reasons: [
        ...reasons,
        "There's no urgency, so you have time to look for a better deal.",
      ],
      nextStep:
        "Check prices at other retailers and revisit the purchase before buying.",
    };
  }

  if (
    answers.need === "replace" &&
    answers.usage !== "rarely"
  ) {
    return {
      decision: "BUY",
      reasons,
      nextStep:
        "Double-check that the product meets your requirements, then choose the retailer offering the best overall value.",
    };
  }

  if (
    answers.need === "recurring_problem" &&
    ["daily", "weekly"].includes(answers.usage) &&
    answers.alternatives === "compared"
  ) {
    return {
      decision: "BUY",
      reasons,
      nextStep:
        "If the features and retailer check out, this looks like a reasonable purchase for your needs.",
    };
  }

  return {
    decision: "WAIT",
    reasons: [
      ...reasons,
      "Some uncertainty remains about how worthwhile this purchase will be.",
    ],
    nextStep:
      "Revisit your priorities and compare options before making the final call.",
  };
}

const decisionDetails = {
  BUY: {
    title: "This looks worth buying",
    subtitle: "Your answers suggest this purchase fits your needs.",
    className: "recommendation-buy",
    icon: CheckCircle2,
  },
  WAIT: {
    title: "Give it a little more thought",
    subtitle: "A little more information or preparation could help.",
    className: "recommendation-wait",
    icon: Clock3,
  },
  BYE: {
    title: "This may not be worth it",
    subtitle:
      "Your answers suggest there may be a better use for your money.",
    className: "recommendation-bye",
    icon: Heart,
  },
};

export default function EvaluationsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { wishlist } = useWishlist();
  const { evaluations, saveEvaluation, getEvaluation } = useEvaluations();

  const initialProduct =
    location.state?.product ??
    location.state?.selectedProduct ??
    null;

  const availableProducts = useMemo(() => {
    const products = [
      ...wishlist,
      ...evaluations.map((item) => item.product),
    ];

    const uniqueProducts = new Map();

    products.forEach((product) => {
      if (product?.id) {
        uniqueProducts.set(String(product.id), product);
      }
    });

    if (initialProduct?.id) {
      uniqueProducts.set(String(initialProduct.id), initialProduct);
    }

    return [...uniqueProducts.values()];
  }, [wishlist, evaluations, initialProduct]);

  const [selectedProductId, setSelectedProductId] = useState(
    initialProduct?.id ? String(initialProduct.id) : ""
  );

  const [answers, setAnswers] = useState(() => {
    if (!initialProduct?.id) return initialAnswers;

    return (
      getEvaluation(String(initialProduct.id))?.answers ??
      initialAnswers
    );
  });

  const [finalDecision, setFinalDecision] = useState(() => {
    if (!initialProduct?.id) return "";

    return (
      getEvaluation(String(initialProduct.id))?.finalDecision ?? ""
    );
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const selectedProduct =
    availableProducts.find(
      (product) => String(product.id) === selectedProductId
    ) ?? null;

  const existingEvaluation = selectedProduct
    ? getEvaluation(String(selectedProduct.id))
    : null;

  const recommendation = selectedProduct
    ? getRecommendation(selectedProduct, answers)
    : null;

  const RecommendationIcon = recommendation
    ? decisionDetails[recommendation.decision].icon
    : Sparkles;

  function updateAnswer(name, value) {
    setAnswers((current) => ({
      ...current,
      [name]: value,
    }));

    setShowSuccess(false);
  }

  function selectProduct(productId) {
    setSelectedProductId(productId);
    setShowSuccess(false);

    const existing = getEvaluation(productId);

    setAnswers(existing?.answers ?? initialAnswers);
    setFinalDecision(existing?.finalDecision ?? "");
  }

  function resetAnswers() {
    setAnswers(initialAnswers);
    setFinalDecision("");
    setShowSuccess(false);
  }

  function handleSave() {
    if (!selectedProduct || !recommendation || !finalDecision) {
      return;
    }

    saveEvaluation({
      product: selectedProduct,
      answers,
      recommendation,
      finalDecision,
    });

    setShowSuccess(true);
  }

  function evaluateAnotherProduct() {
    setSelectedProductId("");
    setAnswers(initialAnswers);
    setFinalDecision("");
    setShowSuccess(false);
  }

  return (
    <div className="evaluation-page">
      <section className="evaluation-intro">
        <span className="eyebrow">PAUSE & REFLECT</span>
        <h2>Is it worth it to you?</h2>
        <p>
          Think through what matters to you. We'll use your answers
          to help you decide whether to buy, wait, or move on.
        </p>
      </section>

      {availableProducts.length === 0 ? (
        <section className="evaluation-empty">
          <div className="evaluation-empty-icon">
            <CircleDollarSign size={26} />
          </div>

          <h3>Start with a product</h3>

          <p>
            Save something from Explore first. Then come back here
            to work through whether it's worth buying.
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate("/app/explore")}
          >
            Explore products <ArrowRight size={16} />
          </button>
        </section>
      ) : (
        <div className="evaluation-layout">
          <section className="evaluation-form-panel">
            <div className="evaluation-section-heading">
              <span className="evaluation-step">01</span>
              <div>
                <h3>What are you considering?</h3>
                <p>Choose an item from your saved list.</p>
              </div>
            </div>

            <label
              className="evaluation-label"
              htmlFor="evaluation-product"
            >
              Product
            </label>

            <select
              id="evaluation-product"
              className="evaluation-select"
              value={selectedProductId}
              onChange={(event) => selectProduct(event.target.value)}
            >
              <option value="">Choose a product</option>

              {availableProducts.map((product) => (
                <option
                  key={product.id}
                  value={String(product.id)}
                >
                  {product.name}
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div className="evaluation-product-summary">
                {selectedProduct.imageUrl || selectedProduct.image ? (
                  <img
                    src={
                      selectedProduct.imageUrl ||
                      selectedProduct.image
                    }
                    alt=""
                  />
                ) : (
                  <div className="evaluation-product-placeholder">
                    <CircleDollarSign size={24} />
                  </div>
                )}

                <div>
                  <strong>{selectedProduct.name}</strong>
                  <span>
                    {selectedProduct.retailer || "Retailer not listed"}
                  </span>
                  <b>
                    {selectedProduct.price !== null &&
                    selectedProduct.price !== undefined &&
                    selectedProduct.price !== "" &&
                    Number.isFinite(Number(selectedProduct.price))
                      ? formatCurrency(Number(selectedProduct.price))
                      : "Price unavailable"}
                  </b>
                </div>
              </div>
            )}

            {selectedProduct && !showSuccess && (
              <>
                <div className="evaluation-section-heading evaluation-questions-heading">
                  <span className="evaluation-step">02</span>
                  <div>
                    <h3>Let's think it through</h3>
                    <p>
                      Answer honestly. There are no right or wrong
                      answers.
                    </p>
                  </div>
                </div>

                <fieldset className="evaluation-question">
                  <legend>Why are you considering this item?</legend>

                  {[
                    ["replace", "I need to replace something"],
                    [
                      "recurring_problem",
                      "It would solve a recurring problem",
                    ],
                    ["mostly_want", "I mostly want it"],
                    ["unsure", "I'm not sure yet"],
                    [
                      "does_not_solve",
                      "It doesn't really meet my needs",
                    ],
                  ].map(([value, label]) => (
                    <label className="evaluation-option" key={value}>
                      <input
                        type="radio"
                        name="need"
                        value={value}
                        checked={answers.need === value}
                        onChange={() => updateAnswer("need", value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </fieldset>

                <div className="evaluation-question">
                  <label
                    className="evaluation-label"
                    htmlFor="evaluation-budget"
                  >
                    What's the most you'd feel comfortable spending?
                  </label>

                  <p className="evaluation-help">
                    Use your personal limit, not what you think the
                    product should cost.
                  </p>

                  <div className="evaluation-budget-input">
                    <span>$</span>
                    <input
                      id="evaluation-budget"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 150"
                      value={answers.budget}
                      onChange={(event) =>
                        updateAnswer("budget", event.target.value)
                      }
                    />
                  </div>
                </div>

                <fieldset className="evaluation-question">
                  <legend>How often do you expect to use it?</legend>

                  {[
                    ["daily", "Daily"],
                    ["weekly", "A few times a week"],
                    ["occasionally", "Occasionally"],
                    ["rarely", "Rarely"],
                  ].map(([value, label]) => (
                    <label className="evaluation-option" key={value}>
                      <input
                        type="radio"
                        name="usage"
                        value={value}
                        checked={answers.usage === value}
                        onChange={() => updateAnswer("usage", value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </fieldset>

                <fieldset className="evaluation-question">
                  <legend>How soon do you need it?</legend>

                  {[
                    ["need_now", "Now — I need it soon"],
                    ["soon", "Within the next few weeks"],
                    ["no_rush", "There's no rush"],
                  ].map(([value, label]) => (
                    <label className="evaluation-option" key={value}>
                      <input
                        type="radio"
                        name="urgency"
                        value={value}
                        checked={answers.urgency === value}
                        onChange={() => updateAnswer("urgency", value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </fieldset>

                <fieldset className="evaluation-question">
                  <legend>Have you looked at other options?</legend>

                  {[
                    [
                      "compared",
                      "Yes, I've compared alternatives",
                    ],
                    ["not_compared", "Not yet"],
                    [
                      "cheaper_found",
                      "Yes, I found a cheaper option that meets my needs",
                    ],
                  ].map(([value, label]) => (
                    <label className="evaluation-option" key={value}>
                      <input
                        type="radio"
                        name="alternatives"
                        value={value}
                        checked={answers.alternatives === value}
                        onChange={() =>
                          updateAnswer("alternatives", value)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </fieldset>

                <button
                  type="button"
                  className="button button-secondary evaluation-reset"
                  onClick={resetAnswers}
                >
                  <RotateCcw size={15} />
                  Start over
                </button>
              </>
            )}
          </section>

          <aside className="evaluation-result-panel">
            {showSuccess && selectedProduct && recommendation ? (
              <div className="evaluation-success-panel">
                <div className="evaluation-success-icon">
                  <CheckCircle2 size={28} />
                </div>

                <span className="eyebrow">DECISION SAVED</span>

                <h3>You've made your call.</h3>

                <p className="evaluation-success-product">
                  {selectedProduct.name}
                </p>

                <div className="evaluation-success-summary">
                  <span>Our recommendation</span>
                  <strong
                    className={
                      decisionDetails[recommendation.decision].className
                    }
                  >
                    {recommendation.decision}
                  </strong>

                  <span>Your final decision</span>
                  <strong
                    className={
                      decisionDetails[finalDecision]?.className ?? ""
                    }
                  >
                    {finalDecision}
                  </strong>
                </div>

                {finalDecision !== recommendation.decision && (
                  <p className="evaluation-success-copy">
                    You chose a different outcome from our recommendation.
                    That's okay — the recommendation is guidance, and the
                    final decision is yours.
                  </p>
                )}

                <p className="evaluation-success-copy">
                  Your answers and decision have been saved. You can
                  revisit this evaluation whenever you want to reconsider
                  your choice.
                </p>

                <button
                  type="button"
                  className="button button-primary evaluation-save"
                  onClick={() => navigate("/app/history")}
                >
                  View decision history <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  className="button button-secondary evaluation-save"
                  onClick={evaluateAnotherProduct}
                >
                  Evaluate another product
                </button>

                <button
                  type="button"
                  className="evaluation-edit-button"
                  onClick={() => setShowSuccess(false)}
                >
                  <RotateCcw size={15} />
                  Edit this evaluation
                </button>
              </div>
            ) : (
              <>
                <div className="evaluation-result-top">
                  <span className="eyebrow">
                    YOUR PERSONALIZED GUIDANCE
                  </span>

                  <div className="evaluation-result-icon">
                    <RecommendationIcon size={23} />
                  </div>

                  {!selectedProduct ? (
                    <>
                      <h3>Your recommendation starts here</h3>
                      <p>
                        Select a product and answer the questions to see
                        what makes sense for you.
                      </p>
                    </>
                  ) : !recommendation ? (
                    <>
                      <h3>Let's think it through</h3>
                      <p>
                        Complete all five questions, including your
                        comfortable budget, to see your personalized
                        recommendation.
                      </p>
                    </>
                  ) : (
                    <>
                      <span
                        className={`recommendation-label ${
                          decisionDetails[recommendation.decision]
                            .className
                        }`}
                      >
                        {recommendation.decision}
                      </span>

                      <h3>
                        {decisionDetails[recommendation.decision].title}
                      </h3>

                      <p>
                        {decisionDetails[recommendation.decision].subtitle}
                      </p>

                      <div className="evaluation-reasons">
                        <h4>Here's why</h4>
                        <ul>
                          {recommendation.reasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="evaluation-next-step">
                        <Lightbulb size={18} />
                        <div>
                          <strong>Your next step</strong>
                          <p>{recommendation.nextStep}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {selectedProduct && recommendation && (
                  <div className="evaluation-final-decision">
                    <span className="eyebrow">
                      THE FINAL CALL IS YOURS
                    </span>

                    <h4>What do you want to do?</h4>

                    <p>
                      You can follow the recommendation or choose a
                      different outcome.
                    </p>

                    <div className="evaluation-decision-options">
                      {["BUY", "WAIT", "BYE"].map((decision) => (
                        <button
                          type="button"
                          key={decision}
                          className={`evaluation-decision-button ${
                            finalDecision === decision
                              ? "is-selected"
                              : ""
                          }`}
                          aria-pressed={finalDecision === decision}
                          onClick={() => setFinalDecision(decision)}
                        >
                          {decision}
                          {recommendation.decision === decision && (
                            <span>Suggested</span>
                          )}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="button button-primary evaluation-save"
                      disabled={!finalDecision}
                      onClick={handleSave}
                    >
                      {existingEvaluation
                        ? "Update my decision"
                        : "Save my decision"}
                      <ArrowRight size={16} />
                    </button>

                    {existingEvaluation && (
                      <p className="evaluation-help">
                        Saving will update your existing evaluation for
                        this product.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}