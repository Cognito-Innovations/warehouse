// Common states and cities for major countries
// This is a simplified version - in production, you'd fetch this from an API

export const countryStatesCities: Record<string, { states: Record<string, string[]> }> = {
  India: {
    states: {
      "Andhra Pradesh": ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
      "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      "Delhi": ["New Delhi", "Delhi"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
      "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
      "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
      "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"],
      "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    },
  },
  "United States": {
    states: {
      "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
      "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
      "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
      "Florida": ["Miami", "Tampa", "Orlando", "Jacksonville", "Tallahassee"],
      "Illinois": ["Chicago", "Aurora", "Naperville", "Peoria", "Rockford"],
    },
  },
  "United Kingdom": {
    states: {
      "England": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
      "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
      "Wales": ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry"],
      "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry", "Bangor"],
    },
  },
  Singapore: {
    states: {
      "Singapore": ["Singapore"],
    },
  },
};

export const getStatesForCountry = (country: string): string[] => {
  return countryStatesCities[country]?.states ? Object.keys(countryStatesCities[country].states) : [];
};

export const getCitiesForState = (country: string, state: string): string[] => {
  return countryStatesCities[country]?.states[state] || [];
};

