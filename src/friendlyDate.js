const dayFormatter = new Intl.DateTimeFormat([], {
  month: 'long',
  day: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat([], {
  year: 'numeric',
  month: 'long',
});

const friendlyDate = (iso8601) => {
  if (!iso8601) return undefined;
  const date = new Date(Date.parse(iso8601));
  const now = new Date();

  const deltaMilliseconds = now - date;
  const deltaSeconds = Math.floor(deltaMilliseconds / 1000);
  const deltaMinutes = Math.floor(deltaSeconds / 60);
  const deltaHours = Math.floor(deltaMinutes / 60);

  if (deltaSeconds < 5) {
    return 'just now';
  } else if (deltaSeconds < 60) {
    return deltaSeconds + ' seconds ago';
  } else if (deltaMinutes == 1) {
    return '1 minute ago';
  } else if (deltaMinutes < 60) {
    return deltaMinutes + ' minutes ago';
  } else if (deltaHours == 1) {
    return '1 hour ago';
  } else if (deltaHours < 6) {
    return deltaHours + ' hours ago';
  } else if (date.getYear() === now.getYear()) {
    return dayFormatter.format(date);
  } else {
    return monthFormatter.format(date);
  }
};

export default friendlyDate;
