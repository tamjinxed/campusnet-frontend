export default function timeAgoSocialMedia(date, now = new Date()) {
    const targetDate = new Date(date);
    const currentDate = new Date(now);
    const diffMs = currentDate - targetDate;

    if (diffMs < 1000 * 60) return "just now";

    // Check if it's the same day
    const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const dayDiff = Math.floor((currentDay - targetDay) / (1000 * 60 * 60 * 24));

    // Helper function to format time (12-hour format)
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Helper function to format date
    const formatDate = (date) => {
        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    };

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (dayDiff === 0) {
        // Today - show relative time for recent, actual time for older
        if (diffSeconds < 60) return "just now";
        if (diffMinutes < 60) return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
        if (diffHours < 4) return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
        // For posts more than 4 hours old today, show the time
        return `Today at ${formatTime(targetDate)}`;
    } else if (dayDiff === 1) {
        // Yesterday - show time
        return `Yesterday at ${formatTime(targetDate)}`;
    } else {
        // Older than yesterday - show date
        // const currentYear = currentDate.getFullYear();
        // const targetYear = targetDate.getFullYear();

        // Include year only if different from current year
        return formatDate(targetDate);
    }
}