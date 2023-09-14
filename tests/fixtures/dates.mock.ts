export const _currentYear = new Date().getFullYear().toString()
export const _nextYear = (new Date().getFullYear() + 1).toString()
export const _todayDate = new Date()

export const _chartersExpirationDate = new Date([_currentYear, '08', '31'].join('-'))
export const _chartersExpirationDay = '08-31'