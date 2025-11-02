"use client";

import { useEffect } from "react";
import { useLoader } from "../context/LoaderContext";
import { attachLoaderInterceptors } from "../lib/axios";

export default function AxiosLoaderSetup() {
  const loader = useLoader();

  useEffect(() => {
    attachLoaderInterceptors(loader);
  }, [loader]);

  return null;
}
