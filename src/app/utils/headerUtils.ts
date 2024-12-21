export function createAuthHeaders(document: Document): { Authorization: string } {
  const window = document.defaultView;
  const tg = window?.Telegram?.WebApp;

  const securityToken = tg?.initData;

  return {
    Authorization: `${securityToken || ''}`,
  };
}