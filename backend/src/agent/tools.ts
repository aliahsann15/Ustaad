import Provider from '../models/Provider';

// Helper to fetch from Google Maps
const fetchFromGoogleMaps = async (serviceType: string, lat: number, lng: number, radiusMeters: number) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === 'your_google_maps_key_here') return [];

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&keyword=${encodeURIComponent(serviceType)}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.results.map((place: any) => ({
        _id: place.place_id,
        name: place.name,
        phoneNumber: 'N/A', // Requires Place Details API for real phone number
        skills: [serviceType],
        specializationLevel: 'intermediate',
        location: {
          type: 'Point',
          coordinates: [place.geometry.location.lng, place.geometry.location.lat]
        },
        availability: true,
        rating: place.rating || 4.0,
        reviewCount: place.user_ratings_total || 10,
        onTimeScore: 90, // mock default for external providers
        cancellationRate: 5, // mock default
        baseRatePerHour: 1000, // mock default
        isVerified: true,
        source: 'google_maps'
      }));
    }
  } catch (error) {
    console.error('Error fetching from Google Maps:', error);
  }
  return [];
};

// Multi-factor Matching Algorithm with Maps + DB Fallback
export const searchProvidersTool = async (serviceType: string, urgency: string, lat: number, lng: number, maxBudget?: number) => {
  console.log(`[TOOL] Searching providers for "${serviceType}" near ${lat},${lng}`);
  
  let finalProviders: any[] = [];
  
  // 1. Google Maps Expanding Radius Search
  for (let radiusKm = 5; radiusKm <= 30; radiusKm += 5) {
    console.log(`[TOOL] Checking Google Maps within ${radiusKm}km radius...`);
    const mapProviders = await fetchFromGoogleMaps(serviceType, lat, lng, radiusKm * 1000);
    if (mapProviders.length > 0) {
      console.log(`[TOOL] Found ${mapProviders.length} providers on Google Maps at ${radiusKm}km radius.`);
      finalProviders = mapProviders;
      break;
    }
  }

  // 2. Fallback to Database if Google Maps fails
  if (finalProviders.length === 0) {
    console.log(`[TOOL] No providers found on Maps within 30km. Falling back to DB closest providers...`);
    const dbProviders = await Provider.find({
      skills: { $regex: new RegExp(serviceType, 'i') }, // Flexible matching for any service type
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] }
        }
      },
      availability: true
    }).limit(10);
    
    finalProviders = dbProviders;
  }

  if (finalProviders.length === 0) return { error: 'No providers found anywhere.' };

  // 3. Multi-factor Scoring
  const ranked = finalProviders.map(p => {
    let score = ((p.rating || 4) * 20 * 0.4) + ((p.onTimeScore || 90) * 0.3) - ((p.cancellationRate || 5) * 0.2);
    
    const rate = p.baseRatePerHour || 1000;
    if (maxBudget && rate <= maxBudget) {
      score += 10;
    } else if (maxBudget) {
      score -= 20;
    }

    if (urgency === 'high' && (p.onTimeScore || 90) > 90) {
      score += 15;
    }

    return { provider: p, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return { matchedProviders: ranked.slice(0, 4) }; // Return top 4
};

export const calculatePricingTool = (baseRate: number, urgency: string, complexityLevel: string, distanceKm: number) => {
  console.log(`[TOOL] Calculating pricing: base=${baseRate}, urgency=${urgency}`);
  let distanceCost = distanceKm * 20; // 20 PKR per km
  
  let urgencyMultiplier = 1.0;
  if (urgency === 'high') urgencyMultiplier = 1.5;
  if (urgency === 'medium') urgencyMultiplier = 1.2;

  let complexityMultiplier = 1.0;
  if (complexityLevel === 'expert') complexityMultiplier = 1.3;
  if (complexityLevel === 'intermediate') complexityMultiplier = 1.1;

  const visitFee = baseRate * complexityMultiplier * urgencyMultiplier;
  const totalEstimated = visitFee + distanceCost;

  return {
    visitFee: Math.round(visitFee),
    distanceCost: Math.round(distanceCost),
    urgencyAdjustment: Math.round(visitFee - baseRate),
    totalEstimated: Math.round(totalEstimated)
  };
};

export const contactProviderMockTool = async (providerId: string, details: string) => {
  console.log(`[TOOL] Sending WhatsApp to provider ${providerId}...`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate a 90% chance of acceptance for the prototype
  const accepted = Math.random() > 0.1; 
  if (accepted) {
    return { status: 'accepted', message: 'Provider replied: "1" (Accepted)' };
  } else {
    return { status: 'declined', message: 'Provider replied: "2" (Declined)' };
  }
};
