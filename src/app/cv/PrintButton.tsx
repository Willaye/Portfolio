"use client";

export function PrintButton() {
  return (
    <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()}>
      Download / Print PDF
    </button>
  );
}
