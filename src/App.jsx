import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle, submitting, success, error
  const [apiResponse, setApiResponse] = useState(null)
  const [focusedField, setFocusedField] = useState(null)

  const validateField = (name, value) => {
    let error = ''
    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address.'
      }
    }
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for that field as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setFocusedField(null)
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleFocus = (e) => {
    setFocusedField(e.target.name)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('https://soniagkalliath.app.n8n.cloud/webhook/b33b6838-fb2f-4e72-baa5-a6d402c97f57', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      // JSONPlaceholder returns the object with an added id (usually 101)
      setApiResponse(data)
      setStatus('success')
    } catch (err) {
      console.error('API Error:', err)
      setStatus('error')
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    setErrors({})
    setApiResponse(null)
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <div className="contact-container success-card">
        <div className="success-icon-wrapper">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2>Message Sent!</h2>
        <p>Thank you for reaching out. We have successfully received your query and will contact you shortly.</p>
        
        <div className="response-box">
          <h3>API Response (Simulated DB Entry)</h3>
          <pre className="response-json">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>

        <button onClick={handleReset} className="reset-btn">
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div className="contact-container">
      <div className="header">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Drop us a message below!</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={`form-group ${focusedField === 'name' ? 'focused' : ''} ${errors.name ? 'has-error' : ''}`}>
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="John Doe"
            disabled={status === 'submitting'}
          />
          {errors.name && (
            <div className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.name}
            </div>
          )}
        </div>

        <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'has-error' : ''}`}>
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="john@example.com"
            disabled={status === 'submitting'}
          />
          {errors.email && (
            <div className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.email}
            </div>
          )}
        </div>

        <div className={`form-group ${focusedField === 'subject' ? 'focused' : ''} ${errors.subject ? 'has-error' : ''}`}>
          <label htmlFor="subject" className="form-label">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="form-control"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="How can we help you?"
            disabled={status === 'submitting'}
          />
          {errors.subject && (
            <div className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.subject}
            </div>
          )}
        </div>

        <div className={`form-group ${focusedField === 'message' ? 'focused' : ''} ${errors.message ? 'has-error' : ''}`}>
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            className="form-control"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="Type your message here..."
            disabled={status === 'submitting'}
          ></textarea>
          {errors.message && (
            <div className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.message}
            </div>
          )}
        </div>

        {status === 'error' && (
          <div className="form-group error-message" style={{ justifyContent: 'center', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Failed to send message. Please try again.
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? (
            <>
              <div className="spinner"></div>
              Sending message...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  )
}

export default App
