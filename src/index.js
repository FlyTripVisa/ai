/**
 * FlyTripVisa — Main Entry Point & Router
 * Routes requests to page modules and API handlers.
 */

import { renderLayout } from "./lib/render.js";
import { getHomePage } from "./pages/home.js";
import { getLoginPage } from "./pages/login.js";
import { getSignupPage } from "./pages/signup.js";
import { getVisaPage } from "./pages/visa.js";
import { getStatusPage } from "./pages/status.js";
import { getPaymentPage } from "./pages/payment.js";
import { getPrivacyPage } from "./pages/privacy.js";
import { getRefundPage } from "./pages/refund.js";

import { handleLogin, handleSignup, handleGetUser } from "./api/auth.js";
import { handleChat } from "./api/chat.js";
import { handleVisaSubmit, handleVisaStatus } from "./api/visa.js";
import { handlePayment } from "./api/payment.js";
import { handleInitDb } from "./lib/db.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // ===== API Routes =====
    if (path === "/api/init-db" && method === "POST") return handleInitDb(env);
    if (path === "/api/login" && method === "POST") return handleLogin(request, env);
    if (path === "/api/signup" && method === "POST") return handleSignup(request, env);
    if (path === "/api/user" && method === "GET") return handleGetUser(request, env);
    if (path === "/api/chat" && method === "POST") return handleChat(request, env);
    if (path === "/api/visa/submit" && method === "POST") return handleVisaSubmit(request, env);
    if (path === "/api/visa/status" && method === "POST") return handleVisaStatus(request, env);
    if (path === "/api/payment" && method === "POST") return handlePayment(request, env);

    // ===== Page Routes =====
    const pageMap = {
      "/": getHomePage,
      "/login": getLoginPage,
      "/signup": getSignupPage,
      "/visa-application": getVisaPage,
      "/status-check": getStatusPage,
      "/payment": getPaymentPage,
      "/privacy-policy": getPrivacyPage,
      "/refund-policy": getRefundPage,
    };

    const titleMap = {
      "/": "AI Chat",
      "/login": "Login",
      "/signup": "Sign Up",
      "/visa-application": "Visa Application",
      "/status-check": "Status Check",
      "/payment": "Payment",
      "/privacy-policy": "Privacy Policy",
      "/refund-policy": "Refund Policy",
    };

    const pageFn = pageMap[path];
    if (pageFn) {
      const html = await pageFn(request, env);
      return renderLayout(html, titleMap[path] || "FlyTripVisa");
    }

    return new Response("Not Found", { status: 404 });
  },
};