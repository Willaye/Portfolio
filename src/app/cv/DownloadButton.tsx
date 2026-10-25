"use client";

export function DownloadButton() {
  return (
    <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()}>
      Download PDF
    </button>
  );
}
