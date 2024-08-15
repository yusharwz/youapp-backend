const horoscopeDates = [
  {
    name: 'Aries',
    symbol: '♈',
    start: new Date(Date.UTC(2024, 2, 21)),
    end: new Date(Date.UTC(2024, 3, 19)),
  },
  {
    name: 'Taurus',
    symbol: '♉',
    start: new Date(Date.UTC(2024, 3, 20)),
    end: new Date(Date.UTC(2024, 4, 20)), //
  },
  {
    name: 'Gemini',
    symbol: '♊',
    start: new Date(Date.UTC(2024, 4, 21)),
    end: new Date(Date.UTC(2024, 5, 21)),
  },
  {
    name: 'Cancer',
    symbol: '♋',
    start: new Date(Date.UTC(2024, 5, 22)),
    end: new Date(Date.UTC(2024, 6, 22)),
  },
  {
    name: 'Leo',
    symbol: '♌',
    start: new Date(Date.UTC(2024, 6, 23)),
    end: new Date(Date.UTC(2024, 7, 22)),
  },
  {
    name: 'Virgo',
    symbol: '♍',
    start: new Date(Date.UTC(2024, 7, 23)),
    end: new Date(Date.UTC(2024, 8, 22)),
  },
  {
    name: 'Libra',
    symbol: '♎',
    start: new Date(Date.UTC(2024, 8, 23)),
    end: new Date(Date.UTC(2024, 9, 23)),
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    start: new Date(Date.UTC(2024, 9, 24)),
    end: new Date(Date.UTC(2024, 10, 21)),
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    start: new Date(Date.UTC(2024, 10, 22)),
    end: new Date(Date.UTC(2024, 11, 21)),
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    start: new Date(Date.UTC(2024, 11, 22)),
    end: new Date(Date.UTC(2025, 0, 19)),
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    start: new Date(Date.UTC(2025, 0, 20)),
    end: new Date(Date.UTC(2025, 1, 18)),
  },
  {
    name: 'Pisces',
    symbol: '♓',
    start: new Date(Date.UTC(2025, 1, 19)),
    end: new Date(Date.UTC(2025, 2, 20)),
  },
];

const zodiacCycle = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
];

function getZodiacYear(birthDate: Date): string {
  const baseYear = 2020;
  const yearDifference = birthDate.getFullYear() - baseYear;
  const cycleIndex = ((yearDifference % 12) + 12) % 12;
  return zodiacCycle[cycleIndex];
}

export function getHoroscopeAndZodiac(birthDate: Date): {
  horoscope: string;
  zodiac: string;
} {
  let horoscope = '';
  let zodiac = '';

  const normalizedBirthDate = new Date(
    Date.UTC(
      birthDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
    ),
  );

  for (const sign of horoscopeDates) {
    let signStart = new Date(
      Date.UTC(
        normalizedBirthDate.getUTCFullYear(),
        sign.start.getUTCMonth(),
        sign.start.getUTCDate(),
      ),
    );
    let signEnd = new Date(
      Date.UTC(
        normalizedBirthDate.getUTCFullYear(),
        sign.end.getUTCMonth(),
        sign.end.getUTCDate(),
      ),
    );

    if (sign.name === 'Capricorn') {
      const prevYearStart = new Date(
        Date.UTC(
          normalizedBirthDate.getUTCFullYear() - 1,
          sign.start.getUTCMonth(),
          sign.start.getUTCDate(),
        ),
      );
      if (
        normalizedBirthDate >= prevYearStart &&
        normalizedBirthDate <= signEnd
      ) {
        horoscope = `${sign.symbol} ${sign.name}`;
        break;
      }
    } else if (
      normalizedBirthDate >= signStart &&
      normalizedBirthDate <= signEnd
    ) {
      horoscope = `${sign.symbol} ${sign.name}`;
      break;
    }
  }

  zodiac = getZodiacYear(normalizedBirthDate);
  return { horoscope, zodiac };
}
