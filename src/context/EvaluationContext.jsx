import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const EvaluationContext = createContext(null);
const STORAGE_KEY = "buyorbye-evaluations";

function readEvaluations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function EvaluationProvider({ children }) {
  const [evaluations, setEvaluations] = useState(readEvaluations);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
    } catch (error) {
      console.error("Could not save evaluations:", error);
    }
  }, [evaluations]);

  const saveEvaluation = useCallback((evaluation) => {
    setEvaluations((current) => {
      const existing = current.find(
        (item) => item.product.id === evaluation.product.id
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === evaluation.product.id
            ? {
                ...evaluation,
                id: existing.id,
                createdAt: existing.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...evaluation,
          id: `${evaluation.product.id}-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const getEvaluation = useCallback(
    (productId) =>
      evaluations.find((item) => item.product.id === productId) ?? null,
    [evaluations]
  );

  const removeEvaluation = useCallback((evaluationId) => {
    setEvaluations((current) =>
      current.filter((item) => item.id !== evaluationId)
    );
  }, []);

  return (
    <EvaluationContext.Provider
      value={{
        evaluations,
        saveEvaluation,
        getEvaluation,
        removeEvaluation,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluations() {
  const context = useContext(EvaluationContext);

  if (!context) {
    throw new Error(
      "useEvaluations must be used within EvaluationProvider"
    );
  }

  return context;
}
