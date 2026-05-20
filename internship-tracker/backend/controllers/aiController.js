// @desc  Generate AI email template
// @route POST /api/ai/email-template
exports.generateEmailTemplate = async (req, res, next) => {
  try {
    const { type, company, role, contactName, userName, context } = req.body;

    const prompts = {
      'follow-up': `Write a professional follow-up email for a job application. 
        Applicant: ${userName}
        Company: ${company}
        Role: ${role}
        Contact: ${contactName || 'Hiring Manager'}
        Additional context: ${context || 'Applied 2 weeks ago, no response yet'}
        
        Write a concise, professional follow-up email (3-4 paragraphs). Include subject line.`,

      'thank-you': `Write a professional thank-you email after an interview.
        Applicant: ${userName}
        Company: ${company}
        Role: ${role}
        Interviewer: ${contactName || 'the interviewer'}
        Additional context: ${context || 'Had a great interview discussion'}
        
        Write a warm, professional thank-you email (3 paragraphs). Include subject line.`,

      'networking': `Write a professional networking outreach email.
        Sender: ${userName}
        Company of interest: ${company}
        Target role: ${role}
        Contact: ${contactName || 'professional'}
        Additional context: ${context || 'Interested in learning more about the company'}
        
        Write a friendly networking email (3 paragraphs). Include subject line.`,

      'referral-request': `Write a professional referral request email.
        Applicant: ${userName}
        Target company: ${company}
        Role: ${role}
        Contact who can refer: ${contactName || 'a connection'}
        Additional context: ${context || ''}
        
        Write a polite referral request email (3-4 paragraphs). Include subject line.`,

      'withdraw': `Write a professional email to withdraw a job application.
        Applicant: ${userName}
        Company: ${company}
        Role: ${role}
        Contact: ${contactName || 'Hiring Manager'}
        
        Write a brief, professional withdrawal email (2 paragraphs). Include subject line.`,
    };

    const prompt = prompts[type] || prompts['follow-up'];

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const emailText = data.content[0].text;

    // Parse subject and body
    const lines = emailText.split('\n');
    let subject = '';
    let body = '';

    const subjectLine = lines.find((l) => l.toLowerCase().startsWith('subject:'));
    if (subjectLine) {
      subject = subjectLine.replace(/^subject:/i, '').trim();
      body = lines.filter((l) => !l.toLowerCase().startsWith('subject:')).join('\n').trim();
    } else {
      subject = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${role} at ${company}`;
      body = emailText;
    }

    res.json({ success: true, subject, body, type });
  } catch (error) {
    next(error);
  }
};

// @desc  Get AI insights for applications
// @route POST /api/ai/insights
exports.getInsights = async (req, res, next) => {
  try {
    const { stats } = req.body;

    const prompt = `You are a career advisor. Analyze these job application statistics and provide 3 concise, actionable insights:

Total applications: ${stats.total}
Offers received: ${stats.offers}
Interviews: ${stats.interviews}
Response rate: ${stats.responseRate}%
Status breakdown: ${JSON.stringify(stats.statusBreakdown)}

Provide exactly 3 insights as a JSON array with this format:
[{"title": "...", "description": "...", "type": "success|warning|info"}]

Only respond with the JSON array, no other text.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content[0].text;
    const insights = JSON.parse(text.replace(/```json|```/g, '').trim());

    res.json({ success: true, insights });
  } catch (error) {
    // Return default insights on AI failure
    res.json({
      success: true,
      insights: [
        { title: 'Keep Applying', description: 'Consistency is key. Aim for 5-10 applications per week.', type: 'info' },
        { title: 'Follow Up', description: 'Send follow-up emails 1-2 weeks after applying.', type: 'warning' },
        { title: 'Network Actively', description: 'Referrals increase your chances by up to 9x.', type: 'success' },
      ],
    });
  }
};
