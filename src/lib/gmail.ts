import { getAccessToken } from './auth';

export const sendEmail = async (to: string, subject: string, bodyText: string) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    bodyText,
  ];

  const email = emailLines.join('\r\n').trim();
  const base64EncodedEmail = btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64EncodedEmail,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to send email: ${errorData.error?.message || 'Unknown error'}`);
  }

  return response.json();
};
