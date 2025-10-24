import React from 'react';

export const CreditCard: React.FC = () => {
  return (
    <section className="neo-card">
      <div className="neo-card-header">
        <div className="neo-card-title">My Cards</div>
        <div className="neo-muted" style={{fontSize:12}}>3 cards</div>
      </div>
      <div className="neo-card-body">
        <div className="neo-cc">
          <div className="brand">Credit Card</div>
          <div className="number">2221&nbsp;0050&nbsp;4680&nbsp;2089</div>
          <div className="row">
            <span>Wade Warren</span>
            <span>12/27</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditCard;
