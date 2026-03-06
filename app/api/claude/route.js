export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ error: { message: "ANTHROPIC_API_KEY가 설정되지 않았습니다." } }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { message: "잘못된 요청 형식입니다." } }, { status: 400 });
  }

  const { messages, model, max_tokens } = body;
  if (!messages || !model) {
    return Response.json({ error: { message: "messages와 model은 필수입니다." } }, { status: 400 });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ messages, model, max_tokens }),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
