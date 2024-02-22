export function POSTAL_CODE_REGEX(): RegExp {
    return /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/;
}

export function MINUTES_TO_MILLISECONDS(minutes: number) {
    return SECONDS_TO_MILLISECONDS(minutes * 60);
}

export function SECONDS_TO_MILLISECONDS(seconds: number) {
    return seconds * 1000;
}
