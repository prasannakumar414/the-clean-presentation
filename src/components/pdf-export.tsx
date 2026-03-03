"use client";

import type { PresentationPage, Project } from "@/lib/types";

declare global {
  interface Window {
    html2pdf: (
      element: HTMLElement,
      options: Record<string, unknown>,
    ) => Promise<void>;
  }
}

async function loadHtml2Pdf() {
  if (typeof window === "undefined") return null;
  if (window.html2pdf) return window.html2pdf;

  const mod = await import("html2pdf.js");
  return mod.default ?? mod;
}

function slideMarkup(project: Project, page: PresentationPage, pageIndex: number): string {
  const title = page.title || (page.type === "title" ? "Title Slide" : "Untitled Slide");
  const image = page.imageUrl
    ? `<img src="${page.imageUrl}" alt="${title}" style="max-width:100%;max-height:260px;object-fit:contain;border-radius:8px;" />`
    : `<div style="height:260px;border:1px dashed #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#64748b;">No image</div>`;

  const body =
    page.type === "title"
      ? `<h1 style="font-size:48px;text-align:center;margin-top:140px;">${title}</h1>`
      : `
      <h2 style="font-size:32px;margin:0 0 16px 0;">${title}</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start;">
        <pre style="white-space:pre-wrap;font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.6;margin:0;">${
          page.content || "No content"
        }</pre>
        <div>${image}</div>
      </div>`;

  return `
    <section style="width:1280px;height:720px;padding:36px;box-sizing:border-box;border:1px solid #e2e8f0;background:#ffffff;color:#0f172a;display:flex;flex-direction:column;justify-content:flex-start;break-after:page;">
      <div style="font-size:12px;color:#64748b;margin-bottom:8px;">${project.title} - Slide ${
        pageIndex + 1
      }</div>
      ${body}
    </section>`;
}

export async function downloadProjectPdf(project: Project, pages: PresentationPage[]) {
  if (!pages.length) return;

  const html2pdf = await loadHtml2Pdf();
  if (!html2pdf) return;

  const container = document.createElement("div");
  container.style.width = "1280px";
  container.innerHTML = pages
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((page, index) => slideMarkup(project, page, index))
    .join("");

  document.body.appendChild(container);

  try {
    await html2pdf(container, {
      margin: 0,
      filename: `${project.title.replace(/\s+/g, "-").toLowerCase() || "presentation"}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "px", format: [1280, 720], orientation: "landscape" },
      pagebreak: { mode: ["css", "legacy"] },
    });
  } finally {
    document.body.removeChild(container);
  }
}
