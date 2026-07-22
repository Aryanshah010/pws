import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, CloudUpload, Info } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import Spinner from "../../components/common/Spinner";
import { apiRequest, authHeader } from "../../services/api";

const SubmitComplaint = () => {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { checkoutOrder, token } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const orderId =
    new URLSearchParams(location.search).get("orderId") || checkoutOrder?._id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!orderId || !token) return navigate("/myorder");
    setError("");
    setSubmitting(true);
    try {
      const imageDataUrl = file
        ? await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
        : "";
      await apiRequest(`/orders/${orderId}/complaints`, {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify({
          issueType,
          description,
          imageName: file?.name || "",
          imageDataUrl,
        }),
      });
      setSubmitted(true);
      toast.success("Complaint submitted — we'll respond within 24 hours");
      navigate("/myorder");
    } catch (requestError) {
      setError(requestError.message);
      toast.error(requestError.message || "Could not submit the complaint");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="min-h-screen bg-(--color-background) flex flex-col items-center p-4 md:p-8 font-sans">
      {/* Main Content Container / Form Card */}
      <div className="w-full max-w-[600px] mt-4 md:mt-8 bg-[var(--color-surface-lowest)] rounded-md p-6 md:p-10 border border-outline-border shadow-(--shadow-level-1)">
        <h1 className="text-(length:--text-headline-sm) font-(--text-headline-sm--font-weight) text-(--color-primary-container) mb-6">
          Something wrong with order{" "}
          {orderId ? `PWS-${orderId.slice(-4).toUpperCase()}` : "—"}
          ?
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                value={issueType}
                onChange={(event) => setIssueType(event.target.value)}
                required
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
            <label className="w-full border-2 border-dashed border-outline-border rounded-default bg-surface-categories flex flex-col items-center justify-center py-10 cursor-pointer hover:bg-[var(--color-surface-dim)] transition-colors group">
              <CloudUpload
                className="text-[#717973] group-hover:text-[var(--color-on-surface)] transition-colors mb-3"
                size={32}
              />
              <span className="text-[16px] text-[#717973] group-hover:text-(--color-on-surface) transition-colors">
                {file ? file.name : "Click to browse or drag and drop"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </label>
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
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              className="w-full bg-[#F4FBF4] border border-outline-border rounded-sm px-4 py-3 text-[length:var(--text-body-md)] text-[var(--color-on-surface)] outline-none focus:border-[var(--color-primary)] transition-colors resize-none placeholder:text-[var(--color-outline)]"
            />
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
              type="submit"
              disabled={submitting || submitted}
              className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 rounded-[var(--radius-default)] text-[length:var(--text-body-lg)] font-[var(--text-headline-sm--font-weight)] hover:bg-[var(--color-primary-container)] transition-colors shadow-[var(--shadow-level-1)]"
            >
              {submitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Spinner size={18} />
                  Submitting...
                </span>
              ) : submitted ? (
                "Complaint Submitted"
              ) : (
                "Submit Complaint"
              )}
            </button>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              type="button"
              onClick={() => navigate("/myorder")}
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
