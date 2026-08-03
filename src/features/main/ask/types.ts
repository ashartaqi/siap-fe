// Matches the /ask response contract exactly (see PHASE2_5_FINDINGS.md / handoff doc).
export interface AskResponse {
  answer: string;
  sources: string[];
  degraded: boolean;
}
