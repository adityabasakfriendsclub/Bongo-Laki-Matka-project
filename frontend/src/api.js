const API_BASE = '/api';

export async function fetchTodayResult() {
  const res = await fetch(`${API_BASE}/results/today`);
  if (!res.ok) throw new Error('Failed to fetch results');
  return res.json();
}

export async function fetchOldResults() {
  const res = await fetch(`${API_BASE}/results/old`);
  if (!res.ok) throw new Error('Failed to fetch old results');
  return res.json();
}

export async function fetchTips(date) {
  const res = await fetch(`${API_BASE}/tips/${date}`);
  if (!res.ok) throw new Error('Failed to fetch tips');
  return res.json();
}

export async function fetchPatti() {
  const res = await fetch(`${API_BASE}/patti`);
  if (!res.ok) throw new Error('Failed to fetch patti');
  return res.json();
}
