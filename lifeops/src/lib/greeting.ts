export function getGreeting() {
    const hour = Number(
        new Intl.DateTimeFormat(
            "en-AU",
            {
                timeZone: "Australia/Melbourne",
                hour: "numeric",
                hour12: false,
            },
        ).format(new Date())
    );

    if (hour < 12) {
        return "Good morning.";
    }

    if (hour < 18) {
        return "Good afternoon.";
    }
    
    return "Good evening."
}

export function getTodayLabel() {
    return new Intl.DateTimeFormat(
        "en-AU",
        {
            timeZone: "Australia/Melbourne",
            weekday: "long",
            day: "numeric",
            month: "long",
        }
    ).format(new Date())
}