import { Link } from "react-router-dom"
import "./LandingPage.css"

function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="navbar-logo">
          <h2>🌾 FarmAid</h2>
        </div>
        <div className="navbar-links">
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">FarmAid</h1>
          <p className="hero-subtitle">Connecting farmers with resources to cultivate success</p>
          <Link to="/login" className="enter-button">
            Enter FarmAid →
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2>How FarmAid Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Land Rental</h3>
            <p>Connect farmers with landowners to expand agricultural operations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Agricultural Loans</h3>
            <p>Access financial resources tailored for farming needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚜</div>
            <h3>Equipment Sharing</h3>
            <p>Rent agricultural instruments to optimize farming efficiency</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3>Pesticide Solutions</h3>
            <p>Get affordable pesticide installment plans for crop protection</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-content">
          <h2>About FarmAid</h2>
          <p>
            FarmAid is a comprehensive platform designed to support farmers by connecting them with essential resources.
            Our mission is to empower agricultural communities by providing access to land, financial support,
            equipment, and agricultural supplies through a collaborative ecosystem.
          </p>
          <p>
            We believe that by bridging the gap between farmers and resource providers, we can contribute to sustainable
            farming practices, increased productivity, and improved livelihoods for farming communities.
          </p>
        </div>
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Farmland at sunset"
          />
        </div>
      </section>

      {/* Contact/Footer Section */}
      <footer className="footer-section" id="contact">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>🌾 FarmAid</h2>
            <p>Cultivating connections, growing success</p>
          </div>
          <div className="developer-info">
            <h3>Developer Contact</h3>
            <p>
              <strong>Name:</strong> Your Name
            </p>
            <p>
              <strong>Email:</strong> your.email@example.com
            </p>
            <p>
              <strong>Phone:</strong> +1 (123) 456-7890
            </p>
            <div className="social-links">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} FarmAid. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
