export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export function handleOptions() {
  return { statusCode: 200, headers: CORS_HEADERS, body: '' }
}
