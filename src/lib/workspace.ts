export const createGoogleDoc = async (accessToken: string, title: string) => {
  const response = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  return response.json();
};

export const createGoogleSheet = async (accessToken: string, title: string) => {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties: { title } }),
  });
  return response.json();
};

export const updateGoogleSheet = async (accessToken: string, spreadsheetId: string, values: any[][]) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:D10?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });
  return response.json();
};

export const createGoogleSlide = async (accessToken: string, title: string) => {
  const response = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  return response.json();
};

export const createGoogleForm = async (accessToken: string, title: string) => {
  const response = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ info: { title, documentTitle: title } }),
  });
  return response.json();
};

export const createGoogleMeet = async (accessToken: string) => {
  const response = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  return response.json();
};

export const createGoogleChatSpace = async (accessToken: string, spaceName: string) => {
  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      displayName: spaceName,
      spaceType: 'SPACE',
    }),
  });
  return response.json();
};

export const postMessageToChatSpace = async (accessToken: string, spaceName: string, text: string) => {
  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  return response.json();
};
