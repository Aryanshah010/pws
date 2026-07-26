import React from 'react';

const SearchDropdown = ({
  query,
  products = [],
  aliasMatch = null,
  totalCount = 0,
  onSelectProduct,
  onViewAll
}) => {
  const containerStyle = {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    backgroundColor: '#FAFAF8',
    border: '1px solid #E2EAE3',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    zIndex: 100,
    overflow: 'hidden',
    fontFamily: 'Montserrat, sans-serif',
  };

  const headerStyle = {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#1B1C1A',
    padding: '14px 16px 12px',
  };

  const aliasRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 16px 12px',
  };

  const pillStyle = {
    backgroundColor: '#E2EAE3',
    color: '#717973',
    fontSize: '12px',
    borderRadius: '9999px',
    padding: '4px 10px',
  };

  const arrowStyle = {
    color: '#717973',
  };

  const resolvedStyle = {
    color: '#1B5E40',
    fontSize: '14px',
    fontWeight: 700,
  };

  const dividerStyle = {
    height: '1px',
    backgroundColor: '#E2EAE3',
    width: '100%',
  };

  const productRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #F0F0EE',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s',
  };

  const imageStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: '#F5F3F0',
    flexShrink: 0,
  };

  const middleColStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
    marginLeft: '12px',
    marginRight: '12px',
  };

  const productNameStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1B1C1A',
    marginBottom: '4px',
  };

  const badgePriceRowStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const footerStyle = {
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1B5E40',
    padding: '14px',
    borderTop: '1px solid #E2EAE3',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const getStockBadge = (product) => {
    const stockText = product.stockStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock');
    let badgeTxt = 'IN STOCK';
    let bg = '#DCF5E4';
    let color = '#1B5E40';

    if (stockText.toLowerCase() === 'low stock') {
      badgeTxt = 'LOW STOCK';
      bg = '#FFF3E0';
      color = '#E65100';
    } else if (stockText.toLowerCase() === 'out of stock') {
      badgeTxt = 'OUT OF STOCK';
      bg = '#FFEBEE';
      color = '#C62828';
    }

    return (
      <span style={{
        backgroundColor: bg,
        color: color,
        textTransform: 'uppercase',
        fontSize: '10px',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '4px',
      }}>
        {badgeTxt}
      </span>
    );
  };

  if (!query) return null;

  const displayQuery = aliasMatch ? aliasMatch.resolved : query;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>Search Results</div>
      
      {aliasMatch && (
        <div style={aliasRowStyle}>
          <div style={pillStyle}>{aliasMatch.query}</div>
          <div style={arrowStyle}>&rarr;</div>
          <div style={resolvedStyle}>{aliasMatch.resolved}</div>
        </div>
      )}

      <div style={dividerStyle}></div>

      <div>
        {products.slice(0, 5).map((product) => (
          <div 
            key={product._id} 
            style={productRowStyle}
            onClick={() => onSelectProduct && onSelectProduct(product._id)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F8F6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} style={imageStyle} />
            ) : (
              <div style={imageStyle}></div>
            )}
            
            <div style={middleColStyle}>
              <div style={productNameStyle}>{product.name}</div>
              <div style={badgePriceRowStyle}>
                {getStockBadge(product)}
                <span style={{
                  fontSize: '13px',
                  color: '#414943',
                  fontWeight: 500,
                  marginLeft: '8px',
                }}>Rs.{product.retailPrice}</span>
              </div>
            </div>

            <div style={{ color: '#717973', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div 
        style={footerStyle} 
        onClick={() => onViewAll && onViewAll()}
        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
      >
        View all results for "{displayQuery}"
      </div>
    </div>
  );
};

export default SearchDropdown;
