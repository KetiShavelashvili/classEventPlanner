import React from 'react';

// Decorator Pattern — wraps any card component and optionally renders a pulsing
// "URGENT" banner. The wrapper div is ALWAYS present (the contract of Decorator);
// only the banner inside it is conditional. The wrapped component is never returned
// bare — that would bypass the decoration.
function withUrgencyBanner(WrappedCard) {
  function UrgentCard({ event, ...props }) {
    const hoursUntilStart = (new Date(event.startDate) - new Date()) / (1000 * 60 * 60);
    const isUrgent = event.priority === 'high' && hoursUntilStart > 0 && hoursUntilStart <= 48;

    return (
      <div className="urgency-wrapper">
        {isUrgent && <span className="urgent-banner">⚡ URGENT</span>}
        <WrappedCard event={event} {...props} />
      </div>
    );
  }

  UrgentCard.displayName = `withUrgencyBanner(${WrappedCard.displayName || WrappedCard.name})`;
  return UrgentCard;
}

export default withUrgencyBanner;
