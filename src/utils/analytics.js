/**
 * Analytics utility functions
 */

export const trackEvent = (action, category = 'JSON Tool') => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: 'User Action'
    });
  }
};
