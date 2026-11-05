import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useLangStore } from "@/shared/i18n";
import { App } from "./App";
import "./styles/tokens.css";
import "./styles/global.css";

document.documentElement.lang = useLangStore.getState().lang;

const root = document.getElementById("root");
if (!root) throw new Error("#root 요소가 없습니다");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
