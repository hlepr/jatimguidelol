import React, { useState } from 'react';
import { MapPin, Star, UtensilsCrossed, Hotel, Ticket, Loader2, X } from 'lucide-react';

interface Destination {
  id: number;
  name: string;
  type: string;
  description: string;
}

interface HotelType {
  id: number;
  name: string;
  rating: number;
  location: string;
  price: string;
}

interface FoodType {
  id: number;
  name: string;
  rating: number;
  price: string;
  location: string;
}

interface RouteDay {
  day: number;
  title: string;
  locations: string[];
  activities: string[];
  hotel: string;
  food: string[];
  notes?: string;
}

interface GeneratedRoute {
  title: string;
  summary: string;
  days: RouteDay[];
  totalBudget: string;
  tips: string[];
}

export default function JatimGuide() {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [startPoint, setStartPoint] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('Public Transport');
  const [duration, setDuration] = useState<string>('');
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addedHotels, setAddedHotels] = useState<HotelType[]>([]);
  const [addedFoods, setAddedFoods] = useState<FoodType[]>([]);
  
  const destinations: Destination[] = [
    { id: 1, name: 'Bromo Tengger Semeru', type: 'Gunung', description: 'Destinasi pegunungan terkenal' },
    { id: 2, name: 'Pantai Malang Selatan', type: 'Pantai', description: 'Pantai indah di selatan' },
  ];
  
  const hotels: HotelType[] = [
    { id: 1, name: 'Hotel Santika Malang', rating: 4.5, location: 'Malang', price: 'Rp 650.000/night' },
    { id: 2, name: 'Grand Inna Malioboro', rating: 4.3, location: 'Surabaya', price: 'Rp 550.000/night' },
    { id: 3, name: 'Whiz Prime Surabaya', rating: 4.2, location: 'Surabaya', price: 'Rp 450.000/night' },
    { id: 4, name: 'Swiss-Belinn Malang', rating: 4.4, location: 'Malang', price: 'Rp 600.000/night' },
  ];
  
  const foods: FoodType[] = [
    { id: 1, name: 'Rawon Setan', rating: 4.8, price: 'Rp 35.000', location: 'Surabaya' },
    { id: 2, name: 'Bakso President', rating: 4.6, price: 'Rp 25.000', location: 'Malang' },
    { id: 3, name: 'Soto Ayam Lamongan', rating: 4.7, price: 'Rp 20.000', location: 'Surabaya' },
    { id: 4, name: 'Pecel Madiun', rating: 4.5, price: 'Rp 15.000', location: 'Madiun' },
  ];

  const addHotelToRoute = (hotel: HotelType): void => {
    if (!addedHotels.find(h => h.id === hotel.id)) {
      setAddedHotels([...addedHotels, hotel]);
    }
  };

  const removeHotelFromRoute = (hotelId: number): void => {
    setAddedHotels(addedHotels.filter(h => h.id !== hotelId));
  };

  const addFoodToRoute = (food: FoodType): void => {
    if (!addedFoods.find(f => f.id === food.id)) {
      setAddedFoods([...addedFoods, food]);
    }
  };

  const removeFoodFromRoute = (foodId: number): void => {
    setAddedFoods(addedFoods.filter(f => f.id !== foodId));
  };

const generateRoute = async (): Promise<void> => {
  if (!startPoint || !duration) {
    setError('Please fill in starting point and duration');
    return;
  }
  
  setIsGenerating(true);
  setError(null);
  setGeneratedRoute(null);
  setAddedHotels([]);
  setAddedFoods([]);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    // Mock generated route
    const mockRoute: GeneratedRoute = {
      title: `${duration}-Day East Java Adventure from ${startPoint}`,
      summary: `Explore the best of East Java starting from ${startPoint} using ${transportMode}`,
      days: Array.from({ length: parseInt(duration) }, (_, i) => ({
        day: i + 1,
        title: i === 0 ? "Arrival & City Exploration" : `Day ${i + 1} Adventure`,
        locations: i === 0 
          ? [startPoint, "Tugu Pahlawan", "House of Sampoerna"]
          : ["Mount Bromo", "Madakaripura Waterfall", "Cemoro Lawang"],
        activities: [
          "Morning city tour and local breakfast",
          "Visit historical landmarks",
          "Explore local markets",
          "Sunset photography session"
        ],
        hotel: i % 2 === 0 ? "Hotel Santika Malang" : "Jiwa Jawa Resort Bromo",
        food: ["Rawon Setan", "Soto Ayam", "Pecel Madiun"],
        notes: "Book sunrise tour tickets in advance. Bring warm clothes for mountain areas."
      })),
      totalBudget: `Rp ${parseInt(duration) * 1500000 - 2000000} - Rp ${parseInt(duration) * 1500000}`,
      tips: [
        "Bring warm clothes for mountain areas",
        "Book accommodations in advance during peak season",
        "Try local street food for authentic experience",
        "Hire a local guide for better insights"
      ]
    };

    setGeneratedRoute(mockRoute);
  } catch (err) {
    console.error('Error generating route:', err);
    setError('An error occurred while generating the route. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};

    setIsGenerating(true);
    setError(null);
    setGeneratedRoute(null);
    setAddedHotels([]);
    setAddedFoods([]);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a travel planner for East Java (Jawa Timur), Indonesia. Generate a detailed ${duration}-day travel itinerary starting from ${startPoint} using ${transportMode}.

Include:
- Daily schedule with specific destinations in East Java
- Recommended activities at each location
- Estimated travel times between locations
- Hotel recommendations for each night
- Local food recommendations
- Budget estimates in IDR

Format your response as JSON with this structure:
{
  "title": "Trip title",
  "summary": "Brief overview",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "locations": ["location1", "location2"],
      "activities": ["activity1", "activity2"],
      "hotel": "hotel name",
      "food": ["food1", "food2"],
      "notes": "Additional tips"
    }
  ],
  "totalBudget": "estimated budget",
  "tips": ["tip1", "tip2"]
}

Respond ONLY with valid JSON, no markdown or explanation.`
            }
          ],
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0]) {
        const text = data.content[0].text;
        const cleanText = text.replace(/```json|```/g, '').trim();
        const parsedRoute: GeneratedRoute = JSON.parse(cleanText);
        setGeneratedRoute(parsedRoute);
      } else {
        setError('Failed to generate route. Please try again.');
      }
    } catch (err) {
      console.error('Error generating route:', err);
      setError('An error occurred while generating the route. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">JatimGuide</h1>
            <nav className="flex gap-6">
              {['Home', 'Routes', 'Map', 'Booking', 'Settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Route Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Route Configuration</h2>
              
              <div className="space-y-4">
                {/* Starting Point */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Starting Point
                  </label>
                  <input
                    type="text"
                    placeholder="Insert your location"
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Transport Mode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transport Mode
                  </label>
                  <select
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Public Transport</option>
                    <option>Private Car</option>
                    <option>Motorcycle</option>
                    <option>Bicycle</option>
                  </select>
                </div>

                {/* Duration of Days */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration of Days
                  </label>
                  <input
                    type="number"
                    placeholder="Insert the duration of days"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="14"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Generate Smart Route Button */}
                <button 
                  onClick={generateRoute}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors mt-4 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Smart Route'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Generated Route Display */}
            {generatedRoute && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{generatedRoute.title}</h2>
                <p className="text-gray-700 mb-6">{generatedRoute.summary}</p>
                
                {/* Days Itinerary */}
                <div className="space-y-4">
                  {generatedRoute.days.map((day) => (
                    <div key={day.day} className="bg-white rounded-lg p-5 shadow">
                      <h3 className="text-lg font-bold text-blue-600 mb-2">
                        Day {day.day}: {day.title}
                      </h3>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Locations: </span>
                          <span className="text-gray-600">{day.locations.join(', ')}</span>
                        </div>
                        
                        <div>
                          <span className="font-semibold text-gray-700">Activities: </span>
                          <ul className="list-disc list-inside text-gray-600 mt-1">
                            {day.activities.map((activity, idx) => (
                              <li key={idx}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <span className="font-semibold text-gray-700">Hotel: </span>
                          <span className="text-gray-600">{day.hotel}</span>
                        </div>
                        
                        <div>
                          <span className="font-semibold text-gray-700">Food to try: </span>
                          <span className="text-gray-600">{day.food.join(', ')}</span>
                        </div>
                        
                        {day.notes && (
                          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                            <span className="font-semibold text-gray-700">💡 Tips: </span>
                            <span className="text-gray-600">{day.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Added Hotels Section */}
                {addedHotels.length > 0 && (
                  <div className="mt-6 bg-white rounded-lg p-4 border-2 border-green-200">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Hotel className="w-5 h-5" />
                      Your Selected Hotels
                    </h4>
                    <div className="space-y-2">
                      {addedHotels.map((hotel) => (
                        <div key={hotel.id} className="flex items-center justify-between bg-green-50 p-3 rounded border border-green-200">
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{hotel.name}</p>
                            <p className="text-xs text-gray-600">{hotel.location} • {hotel.price}</p>
                          </div>
                          <button
                            onClick={() => removeHotelFromRoute(hotel.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Added Foods Section */}
                {addedFoods.length > 0 && (
                  <div className="mt-4 bg-white rounded-lg p-4 border-2 border-orange-200">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5" />
                      Your Selected Foods
                    </h4>
                    <div className="space-y-2">
                      {addedFoods.map((food) => (
                        <div key={food.id} className="flex items-center justify-between bg-orange-50 p-3 rounded border border-orange-200">
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{food.name}</p>
                            <p className="text-xs text-gray-600">{food.location} • {food.price}</p>
                          </div>
                          <button
                            onClick={() => removeFoodFromRoute(food.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Budget and Tips */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-gray-900 mb-1">Estimated Budget</h4>
                    <p className="text-green-700 text-lg font-semibold">{generatedRoute.totalBudget}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-gray-900 mb-2">Travel Tips</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {generatedRoute.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Only show recommendations after route is generated */}
            {generatedRoute && (
              <>
                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search destinations or cities..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Destinations */}
                <div className="space-y-4">
                  {destinations.map((dest) => (
                    <div key={dest.id} className="bg-white rounded-lg shadow p-6 flex items-start gap-4">
                      <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{dest.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">tipe: {dest.type}</p>
                        <p className="text-sm text-gray-500">{dest.description}</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                        Add To Route
                      </button>
                    </div>
                  ))}
                </div>

                {/* Recommended Hotels */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Hotels</h2>
                  <div className="space-y-4">
                    {hotels.map((hotel) => (
                      <div key={hotel.id} className="bg-white rounded-lg shadow p-6 flex items-start gap-4">
                        <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                          <Hotel className="w-8 h-8 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">lokasi: {hotel.location}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{hotel.rating}</span>
                          </div>
                          <p className="text-sm font-semibold text-blue-600">{hotel.price}</p>
                        </div>
                        <button 
                          onClick={() => addHotelToRoute(hotel)}
                          disabled={addedHotels.find(h => h.id === hotel.id) !== undefined}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {addedHotels.find(h => h.id === hotel.id) ? 'Added' : 'Add to Route'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food Recommendations */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Food Recommendations</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {foods.map((food) => (
                      <div key={food.id} className="bg-white rounded-lg shadow p-4">
                        <div className="w-full h-32 bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
                          <UtensilsCrossed className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{food.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{food.location}</p>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{food.rating}</span>
                          </div>
                          <p className="text-sm font-semibold text-blue-600">{food.price}</p>
                        </div>
                        <button 
                          onClick={() => addFoodToRoute(food)}
                          disabled={addedFoods.find(f => f.id === food.id) !== undefined}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {addedFoods.find(f => f.id === food.id) ? 'Added' : 'Add to Route'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Book Tickets & Hotels */}
                <div className="bg-gray-200 rounded-lg shadow p-8 text-center">
                  <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-gray-900">Book Tickets & Hotels</h2>
                </div>
              </>
            )}

            {/* Show message when no route is generated */}
            {!generatedRoute && !isGenerating && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Your Route First</h3>
                <p className="text-gray-600">Fill in the route configuration on the left and click "Generate Smart Route" to get started with your East Java adventure!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between">
            <div className="text-sm text-gray-600">JatimGuide</div>
            <div className="grid grid-cols-3 gap-12">
              <div>
                <p className="text-sm text-gray-600">perusahaan</p>
                <p className="text-sm text-gray-600">perusahaan</p>
                <p className="text-sm text-gray-600">perusahaan</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">aksesbilitas</p>
                <p className="text-sm text-gray-600">aksesbilitas</p>
                <p className="text-sm text-gray-600">aksesbilitas</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">perusahaan</p>
                <p className="text-sm text-gray-600">perusahaan</p>
                <p className="text-sm text-gray-600">perusahaan</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
