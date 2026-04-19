export function extractErrorMessage(err: unknown): string {
  if (!err || typeof err !== "object") return "Something went wrong.";
  const axiosErr = err as {
    response?: {
      data?: { message?: unknown; detail?: unknown; error?: unknown };
    };
    message?: string;
  };
  const data = axiosErr.response?.data;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.detail === "string") return data.detail;
  // FastAPI returns Pydantic validation errors as an array of {msg, loc, ...}
  if (Array.isArray(data?.detail)) {
    const msgs = (data.detail as { msg?: string }[])
      .map((e) => e.msg)
      .filter(Boolean)
      .join(", ");
    if (msgs) return msgs;
  }
  if (typeof data?.error === "string") return data.error;
  if (axiosErr.message) return axiosErr.message;
  return "Something went wrong.";
}
