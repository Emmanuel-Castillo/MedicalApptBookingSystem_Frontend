export function formatHeight(totalInches: number) {
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12
    return `${feet}ft. ${inches}in.`
}

export function formatWeight(totalOunces: number) {
    const pounds = Math.floor(totalOunces / 16)
    const ounces = totalOunces % 16
    return `${pounds}lb. ${ounces}oz.`
}