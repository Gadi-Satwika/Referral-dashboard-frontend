import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const ReferralDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Logout
  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login', { replace: true });
  };

  // Profit formatter
  const formatProfit = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Date formatter (YYYY-MM-DD -> YYYY/MM/DD)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.replace(/-/g, '/');
  };

  useEffect(() => {
    let active = true;
    const token = Cookies.get('jwt_token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setErrorMsg('');

      try {
        const response = await fetch(
          `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const responseJson = await response.json();

        if (active) {
          if (response.ok && responseJson.success && responseJson.data) {
            const data = responseJson.data;
            let foundReferral = null;

            if (data.id === Number(id) || String(data.id) === String(id)) {
              foundReferral = data;
            } 
            else if (Array.isArray(data.referrals)) {
              foundReferral = data.referrals.find((r) => String(r.id) === String(id));
            } 
            else if (data.data) {
              if (data.data.id === Number(id) || String(data.data.id) === String(id)) {
                foundReferral = data.data;
              } else if (Array.isArray(data.data.referrals)) {
                foundReferral = data.data.referrals.find((r) => String(r.id) === String(id));
              }
            }

            if (foundReferral) {
              setReferral(foundReferral);
            } else {
              setErrorMsg('Referral not found');
            }
          } else {
            setErrorMsg('Referral not found');
          }
        }
      } catch (err) {
        if (active) {
          setErrorMsg('Referral not found');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  return (
    <div className="dashboard-container">
      {/* Navbar Component */}
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" aria-label="Go to dashboard home">
            Go Business
          </Link>
          <div className="navbar-links" aria-label="Primary">
            <button className="btn-tryfree">Try for free</button>
            <button onClick={handleLogout} className="btn-logout">
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="dashboard-main details-main">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading referral details...</p>
          </div>
        ) : errorMsg || !referral ? (
          <div className="not-found-container">
            <h1 className="error-heading">Referral not found</h1>
            <Link to="/" className="btn-back">
              &larr; Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="details-wrapper">
            <div className="details-header-block">
              <Link to="/" className="back-to-dashboard-link" aria-label="Back to dashboard">
                &larr; Back to dashboard
              </Link>
              <h1 className="details-main-title">Referral Details</h1>
              <p className="details-main-subtitle">Full information for this referral partner.</p>
            </div>

            <div className="details-card">
              <div className="details-card-header">
                <h2 className="partner-name">{referral.name}</h2>
                <span className="badge-service">{referral.serviceName}</span>
              </div>

              <div className="details-card-body">
                <dl className="details-list">
                  <div className="details-row">
                    <dt>REFERRAL ID</dt>
                    <dd>{referral.id}</dd>
                  </div>
                  <div className="details-row">
                    <dt>NAME</dt>
                    <dd>{referral.name}</dd>
                  </div>
                  <div className="details-row">
                    <dt>SERVICE NAME</dt>
                    <dd>{referral.serviceName}</dd>
                  </div>
                  <div className="details-row">
                    <dt>DATE</dt>
                    <dd>{formatDate(referral.date)}</dd>
                  </div>
                  <div className="details-row">
                    <dt>PROFIT</dt>
                    <dd>{formatProfit(referral.profit)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Component */}
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-brand">Go Business</span>
          <nav className="footer-nav" aria-label="Footer">
            <a href="#about" className="footer-link">About</a>
            <a href="#privacy" className="footer-link">Privacy</a>
          </nav>
          <span className="footer-copyright">© 2024 Go Business</span>
        </div>
      </footer>
    </div>
  );
};

export default ReferralDetails;
