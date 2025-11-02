"use client";
import React, { createContext, useContext, useState } from "react";
import LoaderComponent from "../components/LoaderComponent";

interface LoaderContextType {
  startLoading: () => void;
  stopLoading: (error?: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  const startLoading = () => {
    setVisible(true);
    setHasError(false);
    setProgress(20);
    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 10 : p));
    }, 200);
    (window as any).__loaderInterval = interval;
  };

  const stopLoading = (error = false) => {
    clearInterval((window as any).__loaderInterval);
    setHasError(error);
    setProgress(100);
    setTimeout(() => setVisible(false), 400);
  };

  return (
    <>
      <LoaderContext.Provider value={{ startLoading, stopLoading }}>
        {children}
      </LoaderContext.Provider>
      <LoaderComponent progress={progress} hasError={hasError} visible={visible} />
    </>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader debe usarse dentro de LoaderProvider");
  }
  return context;
};
