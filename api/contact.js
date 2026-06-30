export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: ['munozmichael01@gmail.com'],
        reply_to: email,
        subject: `Nuevo mensaje de ${name}`,
        html: `
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.message || 'Resend error' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
