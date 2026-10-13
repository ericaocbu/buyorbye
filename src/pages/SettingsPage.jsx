import { useEffect, useState } from "react";
import {
  Check,
  RotateCcw,
  SlidersHorizontal,
  Wallet,
  ShoppingBag,
  Database,
  Download,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { useSettings } from "../context/SettingsContext";
import { useWishlist } from "../context/WishlistContext";
import { useEvaluations } from "../context/EvaluationContext";

const STORAGE_KEY = "buyorbye-settings";

const currencySymbols = {
  USD: "$",
  CAD: "CA$",
  GBP: "£",
  EUR: "€",
};

const priorityOptions = [
  {
    value: "price",
    label: "Price",
    description: "Find an option that costs less.",
  },
  {
    value: "quality",
    label: "Quality",
    description: "Focus on product ratings and performance.",
  },
  {
    value: "reviews",
    label: "Customer reviews",
    description: "Consider ratings and buyer feedback.",
  },
  {
    value: "longevity",
    label: "Long-term value",
    description: "Prioritize products that last.",
  },
];

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    saveSettings: persistSettings,
    resetSettings: resetSharedSettings,
    ratesLoading,
    ratesAvailable,
    rateDate,
  } = useSettings();

  const [saved, setSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const { wishlist, removeFromWishlist } = useWishlist();
  const { evaluations, removeEvaluation } = useEvaluations();

  function updateSetting(key, value) {
    updateSettings({ [key]: value });
    setSaved(false);
  }

  function togglePriority(value) {
    const priorities = settings.priorities.includes(value)
      ? settings.priorities.filter((item) => item !== value)
      : [...settings.priorities, value];

    updateSettings({ priorities });
    setSaved(false);
  }

  function handleSaveSettings(event) {
    event.preventDefault();

    const success = persistSettings(settings);
    setSaved(success);

    if (!success) {
      window.alert("Your settings could not be saved. Please try again.");
    }
  }

  function handleResetSettings() {
    resetSharedSettings();
    setSaved(false);
  }

  function exportData() {
    const data = {
      exportedAt: new Date().toISOString(),
      settings,
      wishlist,
      evaluations,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "buyorbye-data.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function clearSavedData() {
    try {
      localStorage.removeItem("buyorbye-wishlist");
      localStorage.removeItem("buyorbye-evaluations");
      localStorage.removeItem(STORAGE_KEY);

      wishlist.forEach((product) => {
        removeFromWishlist(product.id);
      });

      evaluations.forEach((evaluation) => {
        removeEvaluation(evaluation.id);
      });

      resetSharedSettings();
      setSaved(false);
      setShowClearConfirm(false);
    } catch {
      window.alert("Some data could not be cleared. Please try again.");
    }
  }

  useEffect(() => {
    document.title = "Settings | Buy or Bye";

    return () => {
      document.title = "Buy or Bye";
    };
  }, []);

  return (
    <div className="settings-page">
      <div className="settings-intro">
        <span className="eyebrow">MAKE IT YOURS</span>
        <h2>Your preferences.</h2>
        <p>
          Shape how you evaluate purchases and manage the information
          you've saved.
        </p>
      </div>

      <form onSubmit={handleSaveSettings}>
        <section className="settings-card">
          <div className="settings-section-heading">
            <div className="settings-section-icon">
              <Wallet size={20} />
            </div>
            <div>
              <h3>Shopping preferences</h3>
              <p>Set a starting point for evaluating purchases.</p>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="default-budget">
              Comfortable spending amount
            </label>
            <p className="settings-field-help">
              Your typical budget for a single purchase. You can still
              change the budget for each evaluation.
            </p>

            <div className="settings-input-wrap">
              <span>{currencySymbols[settings.currency] || "$"}</span>
              <input
                id="default-budget"
                type="number"
                min="0"
                step="0.01"
                value={settings.budget}
                onChange={(event) =>
                  updateSetting("budget", event.target.value)
                }
                placeholder="150"
              />
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="default-currency">Display currency</label>
            <p className="settings-field-help">
              Choose the currency used to display prices and evaluate your
              budget.
            </p>

            <select
              id="default-currency"
              value={settings.currency}
              onChange={(event) =>
                updateSetting("currency", event.target.value)
              }
              className="settings-select"
            >
              <option value="USD">USD — US Dollar</option>
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="EUR">EUR — Euro</option>
            </select>

            <p className="settings-field-note">
              {ratesLoading
                ? "Loading exchange rates…"
                : ratesAvailable
                  ? `Prices are converted from USD using the latest available reference rates${rateDate ? ` dated ${rateDate}` : ""}.`
                  : "Exchange rates are unavailable. Prices in other currencies cannot currently be converted."}
            </p>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-section-heading">
            <div className="settings-section-icon">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3>What matters to you?</h3>
              <p>
                Choose the factors you care about when comparing products.
              </p>
            </div>
          </div>

          <div className="settings-priority-list">
            {priorityOptions.map((option) => {
              const checked = settings.priorities.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={`settings-priority-option ${
                    checked ? "is-selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePriority(option.value)}
                  />

                  <span className="settings-custom-check">
                    {checked && <Check size={14} />}
                  </span>

                  <span className="settings-priority-copy">
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </span>
                </label>
              );
            })}
          </div>

          <p className="settings-field-note">
            These preferences can guide purchase recommendations. Some
            factors, such as product durability, may not be available in
            search results.
          </p>
        </section>

        <section className="settings-card">
          <div className="settings-section-heading">
            <div className="settings-section-icon">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <h3>Decision style</h3>
              <p>Choose how cautious you'd like to be with purchases.</p>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="decision-style">Your approach</label>

            <select
              id="decision-style"
              className="settings-select"
              value={settings.reminder}
              onChange={(event) =>
                updateSetting("reminder", event.target.value)
              }
            >
              <option value="cautious">
                Extra cautious — take more time
              </option>
              <option value="balanced">
                Balanced — weigh needs and value
              </option>
              <option value="practical">
                Practical — focus on solving the need
              </option>
            </select>

            <p className="settings-field-note">
              Your decision style is saved with your preferences and can
              guide how purchase recommendations weigh uncertainty, needs,
              and value.
            </p>
          </div>
        </section>

        <div className="settings-save-row">
          <button
            type="button"
            className="button button-secondary"
            onClick={handleResetSettings}
          >
            <RotateCcw size={15} />
            Reset preferences
          </button>

          <div className="settings-save-actions">
            {saved && (
              <span className="settings-saved-message" role="status">
                <Check size={15} />
                Preferences saved
              </span>
            )}

            <button type="submit" className="button button-primary">
              Save preferences
            </button>
          </div>
        </div>
      </form>

      <section className="settings-card settings-data-card">
        <div className="settings-section-heading">
          <div className="settings-section-icon">
            <Database size={20} />
          </div>
          <div>
            <h3>Your data</h3>
            <p>Keep a copy of your saved items and purchase decisions.</p>
          </div>
        </div>

        <div className="settings-data-summary">
          <div>
            <span>Saved products</span>
            <strong>{wishlist.length}</strong>
          </div>
          <div>
            <span>Evaluations</span>
            <strong>{evaluations.length}</strong>
          </div>
        </div>

        <button
          type="button"
          className="button button-secondary settings-export-button"
          onClick={exportData}
        >
          <Download size={16} />
          Export my data
        </button>

        <div className="settings-danger-zone">
          <div>
            <h4>Clear saved data</h4>
            <p>
              Permanently remove your saved products, evaluations, and
              preferences from this browser.
            </p>
          </div>

          <button
            type="button"
            className="button button-danger-outline"
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 size={15} />
            Clear data
          </button>
        </div>

        {showClearConfirm && (
          <div className="settings-confirm-panel" role="alert">
            <div className="settings-confirm-heading">
              <AlertTriangle size={18} />
              <strong>Are you sure?</strong>
            </div>

            <p>
              This removes all saved products and evaluations from this
              browser. Export your data first if you'd like to keep a copy.
            </p>

            <div className="settings-confirm-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="button button-danger"
                onClick={clearSavedData}
              >
                Yes, clear my data
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="settings-storage-note">
        Your current preferences and saved items are stored locally in this
        browser. They aren't synced across devices.
      </p>
    </div>
  );
}