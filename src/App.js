import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VerificationForm from './components/VerificationForm';
import SuccessPage from './components/SuccessPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/" element={<VerificationForm />} />
            </Routes>
        </Router>
    );
}

export default App;

