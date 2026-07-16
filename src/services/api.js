export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5050/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    const validationMessage = data.errors?.[0]?.msg;
    const error = new Error(
      validationMessage ||
        data.message ||
        "Something went wrong. Please try again.",
    );
    error.data = data;
    throw error;
  }
  return data;
}

export const authHeader = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};
