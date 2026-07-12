import React from "react";
import { ChevronDown, CloudUpload, Info } from "lucide-react";

const SubmitComplaint = () => {
  return (
    <main className="min-h-screen bg-(--color-background) flex flex-col items-center p-4 md:p-8 font-sans">
      {/* Main Content Container / Form Card */}
      <div className="w-full max-w-[600px] mt-4 md:mt-8 bg-[var(--color-surface-lowest)] rounded-md p-6 md:p-10 border border-outline-border shadow-(--shadow-level-1)">
        <h1 className="text-(length:--text-headline-sm) font-(--text-headline-sm--font-weight) text-(--color-primary-container) mb-6">
          Something wrong with order PWS-0012?
        </h1>

        <form className="flex flex-col gap-6">
          {/* Issue Type Dropdown */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="issue-type"
              className="text-(length:--text-body-md) text-on-surface-variant"
            >
              Issue type:
            </label>
            <div className="relative">
              <select
                id="issue-type"
                defaultValue=""
                className="w-full appearance-none bg-[#F4FBF4] border border-outline-border rounded-sm px-4 py-3 text-[length:var(--text-body-md)] text-[var(--color-on-surface)] outline-none focus:border-[var(--color-primary)] transition-colors cursor-pointer"
              >
                <option value="" disabled>
                  Select an issue...
                </option>
                <option value="missing">Missing Item</option>
                <option value="damaged">Damaged Item</option>
                <option value="wrong">Wrong Item</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                size={20}
              />
            </div>
          </div>

          {/* Upload Photo Area */}
          <div className="flex flex-col gap-2">
            <label className="text-[length:var(--text-body-md)] text-[var(--color-on-surface-variant)]">
              Upload photo of issue (optional)
            </label>
            <div className="w-full border-2 border-dashed border-outline-border rounded-default bg-surface-categories flex flex-col items-center justify-center py-10 cursor-pointer hover:bg-[var(--color-surface-dim)] transition-colors group">
              <CloudUpload
                className="text-[#717973] group-hover:text-[var(--color-on-surface)] transition-colors mb-3"
                size={32}
              />
              <span className="text-[16px] text-[#717973] group-hover:text-(--color-on-surface) transition-colors">
                Click to browse or drag and drop
              </span>
            </div>
          </div>

          {/* Describe Issue Textarea */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-[length:var(--text-body-md)] text-[var(--color-on-surface-variant)]"
            >
              Describe the issue:
            </label>
            <textarea
              id="description"
              placeholder="Please provide details..."
              rows={4}
              className="w-full bg-[#F4FBF4] border border-outline-border rounded-sm px-4 py-3 text-[length:var(--text-body-md)] text-[var(--color-on-surface)] outline-none focus:border-[var(--color-primary)] transition-colors resize-none placeholder:text-[var(--color-outline)]"
            ></textarea>
          </div>

          {/* Notice Alert */}
          <div className="bg-[var(--color-surface-categories)] border border-outline-border rounded-sm p-3 flex items-center gap-3">
            <Info
              className="text-[var(--color-on-surface-variant)] shrink-0"
              size={18}
            />
            <span className="text-[length:var(--text-body-md)] text-[var(--color-on-surface-variant)]">
              We will respond within 24 hours.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mt-4">
            <button
              type="button"
              className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 rounded-[var(--radius-default)] text-[length:var(--text-body-lg)] font-[var(--text-headline-sm--font-weight)] hover:bg-[var(--color-primary-container)] transition-colors shadow-[var(--shadow-level-1)]"
            >
              Submit Complaint
            </button>
            <button
              type="button"
              className="w-full text-[length:var(--text-body-lg)] font-[var(--text-headline-sm--font-weight)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SubmitComplaint;
