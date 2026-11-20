const DEFAULT_BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

type MailAddress = {
  email: string;
  name: string;
};

export interface ContactEmailInput {
  to: MailAddress;
  replyTo: MailAddress;
  name: string;
  message: string;
}

function parseSender(raw: string | undefined): MailAddress | null {
  const value = raw?.trim();
  if (!value) return null;

  // Aceita tanto "Nome <email@dominio.com>" quanto apenas "email@dominio.com".
  const named = value.match(/^(.+?)\s*<([^>]+)>\s*$/);
  if (named) {
    return {
      name: named[1].trim(),
      email: named[2].trim().toLowerCase(),
    };
  }

  return { name: "Portfólio", email: value.toLowerCase() };
}

export function isBrevoConfigured(): boolean {
  return Boolean(
    process.env.BREVO_API_KEY?.trim() && parseSender(process.env.BREVO_FROM)
  );
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/g, (char) => entities[char]);
}

export async function sendContactEmail(input: ContactEmailInput): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const sender = parseSender(process.env.BREVO_FROM);

  if (!apiKey || !sender) {
    throw new Error("Brevo não está configurado.");
  }

  const apiUrl = (
    process.env.BREVO_API_URL?.trim() || DEFAULT_BREVO_API_URL
  ).replace(/\/+$/, "");

  const safeName = input.name.replace(/\s+/g, " ").trim();
  const safeMessage = escapeHtml(input.message).replace(/\r?\n/g, "<br />");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender,
      to: [input.to],
      replyTo: input.replyTo,
      subject: `Novo contato via portfólio — ${safeName}`,
      htmlContent: [
        `<p><strong>Nome:</strong> ${escapeHtml(safeName)}</p>`,
        `<p><strong>E-mail:</strong> ${escapeHtml(input.replyTo.email)}</p>`,
        "<p><strong>Mensagem:</strong></p>",
        `<p>${safeMessage}</p>`,
      ].join(""),
      textContent: [
        `Nome: ${safeName}`,
        `E-mail: ${input.replyTo.email}`,
        "",
        "Mensagem:",
        input.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message || `Brevo retornou HTTP ${response.status}.`);
  }
}
