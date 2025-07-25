// Converts UUID to a numeric string
export const uuidToNumericString = (uuid) => {
    return uuid.replace(/-/g, ''); // Remove all hyphens globally
};

export const numericStringToUuid = (numericString) => {
    // Insert hyphens at the standard UUID positions: 8, 13, 18, 23
    return (
        numericString.substring(0, 8) + '-' +
        numericString.substring(8, 12) + '-' +
        numericString.substring(12, 16) + '-' +
        numericString.substring(16, 20) + '-' +
        numericString.substring(20, 32)
    );
}