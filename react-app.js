import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const customStyles = {
  root: {
    '--bg-primary': '#D0EBF3',
    '--bg-secondary': '#C0C0C0',
    '--ink-primary': '#080808',
    '--ink-secondary': '#FFFFFF',
    '--border-width': '1.5px',
    '--border-color': '#080808',
    '--spacing-unit': '24px',
    '--grid-gap': '1px',
  },
  body: {
    backgroundColor: '#D0EBF3',
    color: '#080808',
    fontFamily: "'JetBrains Mono', monospace",
    overflowX: 'hidden',
    border: '1.5px solid #080808',
    minHeight: '100vh',
  },
  metaBar: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    borderBottom: '1.5px solid #080808',
  },
  metaCell: {
    padding: '12px',
    borderRight: '1.5px solid #080808',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaCellLast: {
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandHero: {
    padding: '60px 40px',
    textAlign: 'center',
    position: 'relative',
  },
  h1: {
    fontFamily: "'Chakra Petch', sans-serif",
    fontWeight: 700,
    fontSize: '8vw',
    lineHeight: 0.8,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
  },
  triangleRight: {
    width: 0,
    height: 0,
    borderTop: '2vw solid transparent',
    borderBottom: '2vw solid transparent',
    borderLeft: '3vw solid #080808',
  },
  triangleLeft: {
    width: 0,
    height: 0,
    borderTop: '2vw solid transparent',
    borderBottom: '2vw solid transparent',
    borderRight: '3vw solid #080808',
  },
  filterMatrix: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    borderBottom: '1.5px solid #080808',
    background: '#080808',
    color: '#D0EBF3',
  },
  filterItem: {
    padding: '16px',
    textAlign: 'center',
    fontFamily: "'Chakra Petch', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    borderRight: '1px solid rgba(208, 235, 243, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.9rem',
  },
  filterItemActive: {
    padding: '16px',
    textAlign: 'center',
    fontFamily: "'Chakra Petch', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    borderRight: '1px solid rgba(208, 235, 243, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.9rem',
    background: '#C0C0C0',
    color: '#080808',
    fontWeight: 'bold',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    background: '#080808',
    gap: '1.5px',
  },
  card: {
    background: '#D0EBF3',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
    transition: 'transform 0.2s ease',
  },
  cardHeader: {
    padding: '8px 12px',
    borderBottom: '1.5px solid #080808',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: '1/1',
    overflow: 'hidden',
    borderBottom: '1.5px solid #080808',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(100%) contrast(120%)',
    transition: 'filter 0.3s ease',
  },
  cardImageHover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(0%) contrast(110%)',
    transition: 'filter 0.3s ease',
  },
  cardBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: '#080808',
    color: '#D0EBF3',
    padding: '4px 8px',
    fontFamily: "'Chakra Petch', sans-serif",
    fontSize: '0.8rem',
    clipPath: 'polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)',
  },
  cardBody: {
    padding: '16px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: "'Chakra Petch', sans-serif",
    fontSize: '1.5rem',
    lineHeight: 1.1,
    textTransform: 'uppercase',
    marginBottom: '12px',
    fontWeight: 600,
  },
  cardMeta: {
    fontSize: '0.75rem',
    color: '#444',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '8px 16px',
    marginBottom: '20px',
  },
  metaLabel: {
    opacity: 0.6,
  },
  cardActions: {
    marginTop: 'auto',
    display: 'flex',
    borderTop: '1.5px solid #080808',
  },
  actionBtnShare: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '12px',
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: '0.8rem',
    cursor: 'pointer',
    borderRight: '1.5px solid #080808',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  actionBtnAcquire: {
    flex: 1,
    border: 'none',
    padding: '12px',
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: '#080808',
    color: '#D0EBF3',
  },
  wireframeZone: {
    background: '#C0C0C0',
    color: '#FFFFFF',
    padding: '60px',
    borderTop: '1.5px solid #080808',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '400px',
  },
  wireframeTextGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    position: 'relative',
    zIndex: 2,
  },
  wireframeBigType: {
    fontFamily: "'Chakra Petch', sans-serif",
    fontSize: '4rem',
    opacity: 0.5,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  ringGraphic: {
    position: 'absolute',
    top: '50%',
    borderRadius: '50%',
    zIndex: 1,
  },
  priceTag: {
    fontFamily: "'Chakra Petch', sans-serif",
    fontSize: '1.2rem',
    fontWeight: 700,
  },
  oldPrice: {
    textDecoration: 'line-through',
    opacity: 0.5,
    fontSize: '0.9rem',
    marginLeft: '8px',
  },
};

const filters = [
  'ALL_SYSTEMS',
  'TECH_HARDWARE',
  'APPAREL_OPS',
  'DOMESTIC_UNIT',
  'AUDIO_VISUAL',
  'TACTICAL_GEAR',
];

const allDeals = [
  {
    id: '#9921-A',
    discount: '-45% OFF',
    badge: 'HOT_DEAL',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    alt: 'Sneaker',
    title: 'NIKE_PROTO MAX_V2',
    vendor: 'AMAZON_PRIME',
    category: 'FOOTWEAR',
    exp: '24H 12M',
    price: '$89.00',
    oldPrice: '$160.00',
    filter: 'APPAREL_OPS',
  },
  {
    id: '#8842-X',
    discount: '-20% OFF',
    badge: null,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop',
    alt: 'Keyboard',
    title: 'MECH_KEYBOARD 60%',
    vendor: 'NEWEGG_INC',
    category: 'PERIPHERALS',
    exp: '06H 00M',
    price: '$120.00',
    oldPrice: '$150.00',
    filter: 'TECH_HARDWARE',
  },
  {
    id: '#1102-B',
    discount: '-60% OFF',
    badge: 'LIMITED',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    alt: 'Headphones',
    title: 'SONY_XM5 NOISE_CX',
    vendor: 'BEST_BUY',
    category: 'AUDIO',
    exp: '48H 00M',
    price: '$249.99',
    oldPrice: '$348.00',
    filter: 'AUDIO_VISUAL',
  },
  {
    id: '#4421-Z',
    discount: '-15% OFF',
    badge: null,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop',
    alt: 'Camera',
    title: 'POLAROID_NOW+',
    vendor: 'BH_PHOTO',
    category: 'OPTICS',
    exp: '12H 30M',
    price: '$139.00',
    oldPrice: '$160.00',
    filter: 'AUDIO_VISUAL',
  },
  {
    id: '#7731-Q',
    discount: '-30% OFF',
    badge: null,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop',
    alt: 'Coffee Maker',
    title: 'BREVILLE_BARISTA',
    vendor: 'WILLIAMS_S',
    category: 'HOME',
    exp: '72H 00M',
    price: '$599.00',
    oldPrice: '$850.00',
    filter: 'DOMESTIC_UNIT',
  },
  {
    id: '#3312-M',
    discount: '-50% OFF',
    badge: 'CLEARANCE',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop',
    alt: 'Smart Watch',
    title: 'APPLE_WATCH_U',
    vendor: 'TARGET',
    category: 'WEARABLE',
    exp: '02H 15M',
    price: '$399.00',
    oldPrice: '$799.00',
    filter: 'TECH_HARDWARE',
  },
  {
    id: '#5591-K',
    discount: '-25% OFF',
    badge: null,
    image: 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?q=80&w=1000&auto=format&fit=crop',
    alt: 'Backpack',
    title: 'PEAK_DESIGN_V2',
    vendor: 'REI_COOP',
    category: 'CARRY',
    exp: '10H 00M',
    price: '$189.00',
    oldPrice: '$260.00',
    filter: 'TACTICAL_GEAR',
  },
  {
    id: '#2201-P',
    discount: '-10% OFF',
    badge: null,
    image: 'https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=1000&auto=format&fit=crop',
    alt: 'Chair',
    title: 'HERMAN_MILLER_A',
    vendor: 'OFFICE_D',
    category: 'FURNITURE',
    exp: '30D 00H',
    price: '$995.00',
    oldPrice: '$1200.00',
    filter: 'DOMESTIC_UNIT',
  },
];

const DealCard = ({ deal }) => {
  const [hovered, setHovered] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);

  const handleShare = () => {
    setShareClicked(true);
    setTimeout(() => setShareClicked(false), 1500);
  };

  return (
    <article
      style={customStyles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={customStyles.cardHeader}>
        <span>ID: {deal.id}</span>
        <span>{deal.discount}</span>
      </div>
      <div style={customStyles.cardImageContainer}>
        {deal.badge && <div style={customStyles.cardBadge}>{deal.badge}</div>}
        <img
          src={deal.image}
          style={hovered ? customStyles.cardImageHover : customStyles.cardImage}
          alt={deal.alt}
        />
      </div>
      <div style={customStyles.cardBody}>
        <div>
          <h2 style={customStyles.cardTitle}>{deal.title}</h2>
          <div style={customStyles.cardMeta}>
            <span style={customStyles.metaLabel}>VENDOR:</span>
            <span>{deal.vendor}</span>
            <span style={customStyles.metaLabel}>CAT:</span>
            <span>{deal.category}</span>
            <span style={customStyles.metaLabel}>EXP:</span>
            <span>{deal.exp}</span>
          </div>
        </div>
        <div style={customStyles.priceTag}>
          {deal.price}
          <span style={customStyles.oldPrice}>{deal.oldPrice}</span>
        </div>
      </div>
      <div style={customStyles.cardActions}>
        <button
          style={{
            ...customStyles.actionBtnShare,
            background: shareClicked ? '#C0C0C0' : 'transparent',
          }}
          onClick={handleShare}
        >
          {shareClicked ? 'COPIED!' : 'SHARE'}
        </button>
        <button
          style={customStyles.actionBtnAcquire}
          onMouseEnter={e => { e.currentTarget.style.background = '#222'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#080808'; }}
          onClick={() => window.open('#', '_blank')}
        >
          ACQUIRE <span>➔</span>
        </button>
      </div>
    </article>
  );
};

const RingGraphic = ({ style }) => (
  <div
    style={{
      ...customStyles.ringGraphic,
      border: '1px solid rgba(255,255,255,0.3)',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        bottom: '20px',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '50%',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        right: '40px',
        bottom: '40px',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '50%',
      }}
    />
  </div>
);

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState('ALL_SYSTEMS');

  const filteredDeals =
    activeFilter === 'ALL_SYSTEMS'
      ? allDeals
      : allDeals.filter(d => d.filter === activeFilter);

  return (
    <div style={customStyles.body}>
      <header style={{ borderBottom: '1.5px solid #080808' }}>
        <div style={customStyles.metaBar}>
          <div style={customStyles.metaCell}>
            <span>SYS.DATE</span>
            <span>2023.10.24</span>
          </div>
          <div style={customStyles.metaCell}>
            <span>REGION</span>
            <span>NORTH_AMERICA_WEST</span>
          </div>
          <div style={customStyles.metaCell}>
            <span>USER_ID</span>
            <span>GUEST_9921</span>
          </div>
          <div style={customStyles.metaCellLast}>
            <span>STATUS</span>
            <span>ONLINE [G]</span>
          </div>
        </div>

        <div style={customStyles.brandHero}>
          <h1 style={customStyles.h1}>
            <div style={customStyles.triangleRight}></div>
            DISC.MATRIX
            <span
              style={{
                fontSize: '2rem',
                alignSelf: 'flex-start',
                marginTop: '20px',
                fontFamily: "'Chakra Petch', sans-serif",
              }}
            >
              TM
            </span>
            <div style={customStyles.triangleLeft}></div>
          </h1>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: '20px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontSize: '0.8rem',
            }}
          >
            Curated Affiliate Manifest // Indexing 4,209 Items
          </div>
        </div>
      </header>

      <nav style={customStyles.filterMatrix}>
        {filters.map((filter, index) => (
          <div
            key={filter}
            style={
              activeFilter === filter
                ? customStyles.filterItemActive
                : {
                    ...customStyles.filterItem,
                    borderRight:
                      index === filters.length - 1
                        ? 'none'
                        : '1px solid rgba(208, 235, 243, 0.3)',
                  }
            }
            onClick={() => setActiveFilter(filter)}
            onMouseEnter={e => {
              if (activeFilter !== filter) {
                e.currentTarget.style.background = '#D0EBF3';
                e.currentTarget.style.color = '#080808';
              }
            }}
            onMouseLeave={e => {
              if (activeFilter !== filter) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#D0EBF3';
              }
            }}
          >
            {filter}
          </div>
        ))}
      </nav>

      <main style={customStyles.contentGrid}>
        {filteredDeals.length > 0 ? (
          filteredDeals.map(deal => <DealCard key={deal.id} deal={deal} />)
        ) : (
          <div
            style={{
              gridColumn: '1 / -1',
              background: '#D0EBF3',
              padding: '60px',
              textAlign: 'center',
              fontFamily: "'Chakra Petch', sans-serif",
              fontSize: '2rem',
              textTransform: 'uppercase',
              opacity: 0.5,
            }}
          >
            NO_DEALS_FOUND
          </div>
        )}
      </main>

      <footer style={customStyles.wireframeZone}>
        <RingGraphic
          style={{
            left: '20%',
            width: '500px',
            height: '500px',
            transform: 'translate(-50%, -40%) rotateX(60deg)',
          }}
        />
        <RingGraphic
          style={{
            left: '80%',
            width: '300px',
            height: '300px',
            transform: 'translate(-50%, -40%) rotateX(60deg)',
          }}
        />

        <div style={customStyles.wireframeTextGrid}>
          <div>
            <div style={customStyles.wireframeBigType}>
              SYSTEM
              <br />
              OFFLINE
            </div>
            <p
              style={{
                marginTop: '20px',
                fontFamily: "'JetBrains Mono', monospace",
                maxWidth: '300px',
              }}
            >
              END OF MANIFEST. ALL DEALS ARE SUBJECT TO REGIONAL AVAILABILITY.
              COPYRIGHT 2023 DISC.MATRIX.
            </p>
          </div>
          <div
            style={{
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                borderTop: '1px solid white',
                paddingTop: '20px',
                display: 'inline-block',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              FILE_NO.9
              <br />
              23 KB
              <br />
              (C) 2023
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;800&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
      body { overflow-x: hidden; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;