import React, { useState } from 'react';
import axios from 'axios';
import '../styles/VerificationForm.css';

function VerificationForm() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === '') {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            setError(null);

    
            if (value && index < 5) {
                document.getElementById(`digit-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && code[index] === '' && index > 0) {
            document.getElementById(`digit-${index - 1}`).focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').split('');
        if (paste.length === 6 && paste.every(char => /^\d$/.test(char))) {
            setCode(paste);
            document.getElementById('digit-5').focus();
            setError(null);
        } else {
            setError('Invalid code format. Please paste exactly 6 digits.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent form submission if code is incomplete
        if (code.includes('')) {
            setError('All fields must be filled.');
            return;
        }

        const fullCode = code.join('');
        setIsSubmitting(true); // Disable submit button when submitting

        try {
            const response = await axios.post('https://my-app-ov1p.onrender.com/verify-code', { code: fullCode });
            if (response.status === 200) {
                window.location.href = '/success'; // Redirect to success page
            }
        } catch (err) {
            setError('Verification Error: Invalid code.');
        } finally {
            setIsSubmitting(false); // Enable the submit button after request completes
        }
    };

    return (
        <form onSubmit={handleSubmit} className="verification-form">
            <label className="verification-label">Verification code:</label>
            <div className="input-container" onPaste={handlePaste}>
                {code.map((digit, index) => (
                    <input
                        key={index}
                        id={`digit-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`digit-input ${error && code[index] === '' ? 'input-error' : ''}`} // Highlight empty fields on error
                        aria-label={`Digit ${index + 1}`}
                    />
                ))}
            </div>
            {error && <p className="error-message">{error}</p>}
            <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || code.includes('')} // Disable button if submitting or incomplete
            >
                {isSubmitting ? 'Submitting...' : 'SUBMIT'}
            </button>
        </form>
    );
}

export default VerificationForm;
