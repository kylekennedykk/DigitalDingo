export function getContactEmailTemplate(data: any) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      dateStyle: 'long',
      timeStyle: 'short'
    })
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #D17B30;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #fff;
            padding: 30px 20px;
            border: 1px solid #eee;
            border-radius: 0 0 8px 8px;
          }
          .info-group {
            margin-bottom: 25px;
          }
          .info-group:last-child {
            margin-bottom: 0;
          }
          .label {
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          .message {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
            white-space: pre-wrap;
          }
          .metadata {
            font-size: 13px;
            color: #666;
            border-top: 1px solid #eee;
            margin-top: 30px;
            padding-top: 20px;
          }
          .metadata-item {
            margin-bottom: 8px;
          }
          .logo {
            margin-bottom: 15px;
          }
          .logo img {
            height: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="https://digitaldingo.uk/logo.png" alt="DigitalDingo" />
            </div>
            <h2 style="margin:0">New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="info-group">
              <div class="label">Contact Details</div>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
            </div>
            
            <div class="info-group">
              <div class="label">Message</div>
              <div class="message">${data.message}</div>
            </div>
            
            <div class="metadata">
              <div class="label">Additional Information</div>
              <div class="metadata-item">
                <strong>Submitted:</strong> ${formatDate(data.metadata.timestamp)}
              </div>
              ${data.metadata.location ? `
                <div class="metadata-item">
                  <strong>Location:</strong> ${data.metadata.location.city || ''}, ${data.metadata.location.region || ''}, ${data.metadata.location.country || ''}
                </div>
              ` : ''}
              <div class="metadata-item">
                <strong>Device:</strong> ${data.metadata.platform}
              </div>
              <div class="metadata-item">
                <strong>Browser:</strong> ${data.metadata.userAgent}
              </div>
              ${data.metadata.referrer ? `
                <div class="metadata-item">
                  <strong>Referrer:</strong> ${data.metadata.referrer}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </body>
    </html>
  `
} 