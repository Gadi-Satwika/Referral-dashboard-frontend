import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const navigate = useNavigate();

  // Search and sort states
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  
  // API response states
  const [metrics, setMetrics] = useState([]);
  const [serviceSummary, setServiceSummary] = useState(null);
  const [shareReferral, setShareReferral] = useState({ link: '', code: '' });
  const [referrals, setReferrals] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copyStatus, setCopyStatus] = useState({ link: false, code: false });

  // Handle Logout
  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login', { replace: true });
  };

  // Fetch referrals and overview data from API (triggered only on mount)
  useEffect(() => {
    let active = true;
    const token = Cookies.get('jwt_token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const response = await fetch(
          `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals`,
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
          if (response.ok && responseJson.success) {
            const data = responseJson.data;
            if (data) {
              setMetrics(data.metrics || []);
              setServiceSummary(data.serviceSummary || null);
              setShareReferral(data.referral || { link: '', code: '' });
              setReferrals(data.referrals || []);
            }
            setCurrentPage(1);
          } else {
            const statusText = response.status ? ` (Status ${response.status})` : '';
            setErrorMsg((responseJson.message || 'Failed to retrieve referrals dashboard') + statusText);
          }
        }
      } catch (err) {
        if (active) {
          setErrorMsg(`Network error: ${err.message || 'Failed to fetch data'}`);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [navigate]);

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Copy to clipboard helper
  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
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

  // Metric Icon Lookup
  const getMetricIcon = (id) => {
    const baseStyle = { width: '22px', height: '22px' };
    switch (id) {
      case 'balance':
        return (
          <svg style={baseStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        );
      case 'discountPct':
        return (
          <svg style={baseStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
        );
      case 'totalRef':
        return (
          <svg style={baseStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        );
      case 'discountAmt':
        return (
          <svg style={baseStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 2h14"></path>
            <path d="M5 22h14"></path>
            <path d="M19 2v4c0 4-4 6-4 6s4 2 4 6v4"></path>
            <path d="M5 2v4c0 4 4 6 4 6s-4 2-4 6v4"></path>
          </svg>
        );
      case 'commissionAmt':
        return (
          <svg style={baseStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="5" x2="5" y2="19"></line>
            <circle cx="6.5" cy="6.5" r="2.5"></circle>
            <circle cx="17.5" cy="17.5" r="2.5"></circle>
          </svg>
        );
      case 'totalEarn':
        return (
          <svg style={baseStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 7a2 2 0 0 0-2-2h-2.58A6.97 6.97 0 0 0 12 3a6.97 6.97 0 0 0-2.42 2H7a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V7z"></path>
            <path d="M5 14a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6V9H5v5z"></path>
            <path d="M12 12v4"></path>
            <path d="M10 14h4"></path>
          </svg>
        );
      case 'commissionDisc':
        return (
          <svg style={baseStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      case 'bankTransfer':
        return (
          <svg style={baseStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"></polyline>
            <line x1="3" y1="5" x2="21" y2="5"></line>
            <polyline points="7 23 3 19 7 15"></polyline>
            <line x1="21" y1="19" x2="3" y2="19"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  // Client-side sorting and filtering
  const filteredReferrals = React.useMemo(() => {
    // 1. Sort referrals client-side
    const sorted = [...referrals].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sort === 'desc' ? dateB - dateA : dateA - dateB;
    });

    // 2. Filter referrals client-side
    const query = search.toLowerCase();
    return sorted.filter((row) => {
      return (
        (row.name && row.name.toLowerCase().includes(query)) ||
        (row.serviceName && row.serviceName.toLowerCase().includes(query))
      );
    });
  }, [referrals, sort, search]);

  // Client-side pagination logic
  const itemsPerPage = 10;
  const totalEntries = filteredReferrals.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  
  const indexOfLastRow = currentPage * itemsPerPage;
  const indexOfFirstRow = indexOfLastRow - itemsPerPage;
  const currentReferrals = filteredReferrals.slice(indexOfFirstRow, indexOfLastRow);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Footer summary calculation
  const fromEntry = totalEntries === 0 ? 0 : indexOfFirstRow + 1;
  const toEntry = indexOfLastRow > totalEntries ? totalEntries : indexOfLastRow;

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

      {/* Main Dashboard Layout */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Referral Dashboard</h1>
          <p className="dashboard-subtitle">
            Track your referrals, earnings, and partner activity in one place.
          </p>
        </header>

        {/* Loading and Error States */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        )}

        {errorMsg && (
          <div className="error-alert" role="alert">
            <p>{errorMsg}</p>
          </div>
        )}

        {!loading && !errorMsg && (
          /* Large White Wrapper enclosing all Content sections */
          <div className="dashboard-card-wrapper">
            
            {/* Overview Section */}
            <section className="dashboard-section" role="region" aria-label="Overview metrics">
              <h2 className="section-title">Overview</h2>
              <div className="metrics-grid">
                {metrics.map((metric) => (
                  <div key={metric.id} className="metric-card">
                    <div className="metric-icon-badge">
                      {getMetricIcon(metric.id)}
                    </div>
                    <span className="metric-value">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Service Summary Section (Full Width) */}
            <section className="dashboard-section" aria-label="Service summary">
              <h2 className="section-title">Service summary</h2>
              {serviceSummary ? (
                <div className="service-summary-row">
                  <div className="summary-card">
                    <span className="summary-label">SERVICE</span>
                    <span className="summary-value service-name-val">
                      {serviceSummary.service}
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">YOUR REFERRALS</span>
                    <span className="summary-value">{serviceSummary.yourReferrals}</span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">ACTIVE REFERRALS</span>
                    <span className="summary-value">{serviceSummary.activeReferrals}</span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">TOTAL REF. EARNINGS</span>
                    <span className="summary-value">{serviceSummary.totalRefEarnings}</span>
                  </div>
                </div>
              ) : (
                <p className="no-data-text">No service summary details available.</p>
              )}
            </section>

            {/* Share Referral Section (Full Width) */}
            <section className="dashboard-section" aria-label="Share referral">
              <h2 className="section-title">Refer friends and earn more</h2>
              <div className="share-row-grid">
                <div className="share-col">
                  <label htmlFor="ref-link" className="share-label">YOUR REFERRAL LINK</label>
                  <div className="share-input-wrapper">
                    <input
                      type="text"
                      id="ref-link"
                      readOnly
                      value={shareReferral.link}
                      className="share-input-field"
                    />
                    <button
                      onClick={() => handleCopy(shareReferral.link, 'link')}
                      className={`btn-copy-action ${copyStatus.link ? 'copied' : ''}`}
                    >
                      {copyStatus.link ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="share-col">
                  <label htmlFor="ref-code" className="share-label">YOUR REFERRAL CODE</label>
                  <div className="share-input-wrapper">
                    <input
                      type="text"
                      id="ref-code"
                      readOnly
                      value={shareReferral.code}
                      className="share-input-field"
                    />
                    <button
                      onClick={() => handleCopy(shareReferral.code, 'code')}
                      className={`btn-copy-action ${copyStatus.code ? 'copied' : ''}`}
                    >
                      {copyStatus.code ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* All Referrals Table Section */}
            <section className="dashboard-section table-section">
              <h2 className="section-title">All referrals</h2>
              
              <div className="table-filter-sort-row">
                <div className="search-control-group">
                  <span className="control-label">Search</span>
                  <input
                    type="search"
                    placeholder="Name or service…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-field"
                    aria-label="Search referrals"
                  />
                </div>

                <div className="sort-control-group">
                  <span className="control-label">Sort by date</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="sort-dropdown"
                  >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </div>
              </div>

              {/* Table Wrapper */}
              <div className="table-container">
                <table className="referrals-data-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>SERVICE</th>
                      <th>DATE</th>
                      <th>PROFIT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReferrals.length > 0 ? (
                      currentReferrals.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => navigate(`/referral/${row.id}`)}
                          className="data-row"
                        >
                          <td className="row-name">{row.name}</td>
                          <td className="row-service">{row.serviceName}</td>
                          <td className="row-date">{formatDate(row.date)}</td>
                          <td className="row-profit">{formatProfit(row.profit)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="table-empty-row">
                          No matching entries
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Pagination */}
              <div className="table-pagination-footer">
                <span className="table-summary-text">
                  Showing {fromEntry}–{toEntry} of {totalEntries} entries
                </span>

                {totalPages > 1 && (
                  <div className="pagination-btn-group">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="page-nav-btn"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNo) => (
                      <button
                        key={pageNo}
                        onClick={() => setCurrentPage(pageNo)}
                        className={`page-number-btn ${
                          currentPage === pageNo ? 'active' : ''
                        }`}
                      >
                        {pageNo}
                      </button>
                    ))}

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="page-nav-btn"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </section>

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

export default Dashboard;
