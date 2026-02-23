export interface CountryType {
    name: string
    code: string
    flag: string
    dialCode: string
}

export const countries: CountryType[] = [
    { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', dialCode: '+971' },
    { name: 'Qatar', code: 'QA', flag: '🇶🇦', dialCode: '+974' },
    { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', dialCode: '+966' },
    { name: 'Oman', code: 'OM', flag: '🇴🇲', dialCode: '+968' },
    { name: 'Kuwait', code: 'KW', flag: '🇰🇼', dialCode: '+965' },
    { name: 'Bahrain', code: 'BH', flag: '🇧🇭', dialCode: '+973' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dialCode: '+44' },
    { name: 'United States', code: 'US', flag: '🇺🇸', dialCode: '+1' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦', dialCode: '+1' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺', dialCode: '+61' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪', dialCode: '+49' },
    { name: 'France', code: 'FR', flag: '🇫🇷', dialCode: '+33' },
    { name: 'Singapore', code: 'SG', flag: '🇸🇬', dialCode: '+65' },
    { name: 'Malaysia', code: 'MY', flag: '🇲🇾', dialCode: '+60' },
    { name: 'India', code: 'IN', flag: '🇮🇳', dialCode: '+91' },
    { name: 'Switzerland', code: 'CH', flag: '🇨🇭', dialCode: '+41' },
    { name: 'Netherlands', code: 'NL', flag: '🇳🇱', dialCode: '+31' },
    { name: 'Italy', code: 'IT', flag: '🇮🇹', dialCode: '+39' },
    { name: 'Spain', code: 'ES', flag: '🇪🇸', dialCode: '+34' },
    { name: 'Japan', code: 'JP', flag: '🇯🇵', dialCode: '+81' },
    { name: 'South Korea', code: 'KR', flag: '🇰🇷', dialCode: '+82' },
    { name: 'Norway', code: 'NO', flag: '🇳🇴', dialCode: '+47' },
    { name: 'Sweden', code: 'SE', flag: '🇸🇪', dialCode: '+46' },
    { name: 'Denmark', code: 'DK', flag: '🇩🇰', dialCode: '+45' },
    { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', dialCode: '+64' },
    { name: 'Ireland', code: 'IE', flag: '🇮🇪', dialCode: '+353' },
    { name: 'South Africa', code: 'ZA', flag: '🇿🇦', dialCode: '+27' },
    { name: 'Brazil', code: 'BR', flag: '🇧🇷', dialCode: '+55' },
    { name: 'Mexico', code: 'MX', flag: '🇲🇽', dialCode: '+52' },
    { name: 'Turkey', code: 'TR', flag: '🇹🇷', dialCode: '+90' },
    { name: 'Russia', code: 'RU', flag: '🇷🇺', dialCode: '+7' },
    { name: 'China', code: 'CN', flag: '🇨🇳', dialCode: '+86' },
    { name: 'Thailand', code: 'TH', flag: '🇹🇭', dialCode: '+66' },
    { name: 'Vietnam', code: 'VN', flag: '🇻🇳', dialCode: '+84' },
    { name: 'Indonesia', code: 'ID', flag: '🇮🇩', dialCode: '+62' },
    { name: 'Philippines', code: 'PH', flag: '🇵🇭', dialCode: '+63' },
    { name: 'Egypt', code: 'EG', flag: '🇪🇬', dialCode: '+20' },
    { name: 'Nigeria', code: 'NG', flag: '🇳🇬', dialCode: '+234' },
    { name: 'Pakistan', code: 'PK', flag: '🇵🇰', dialCode: '+92' },
    { name: 'Bangladesh', code: 'BD', flag: '🇧🇩', dialCode: '+880' },
    { name: 'Sri Lanka', code: 'LK', flag: '🇱🇰', dialCode: '+94' },
    { name: 'Nepal', code: 'NP', flag: '🇳🇵', dialCode: '+977' },
    { name: 'Maldives', code: 'MV', flag: '🇲🇻', dialCode: '+960' },
    { name: 'Kenya', code: 'KE', flag: '🇰🇪', dialCode: '+254' },
    { name: 'Israel', code: 'IL', flag: '🇮🇱', dialCode: '+972' },
    { name: 'Jordan', code: 'JO', flag: '🇯🇴', dialCode: '+962' },
    { name: 'Lebanon', code: 'LB', flag: '🇱🇧', dialCode: '+961' },
]

export const commonCountries = countries.slice(0, 14) // Gulf + Major Western
