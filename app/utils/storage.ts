let id: string | null = null;
let token: string | null = null;

if (typeof window !== 'undefined') {
  id = sessionStorage.getItem("id") ?? null;
  token = sessionStorage.getItem("token") ?? null;
}

export { id, token };