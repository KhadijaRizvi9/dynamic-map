import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./mapStyles.css";
import imageBlue from "../assets/blue.png";
import imageYellow from "../assets/yellow.png";
import imagePink from "../assets/pink.png";
import image  from "../assets/gps.png";

// Function to determine marker icon color
const getIcon = (count) => {
  let iconUrl = imagePink; // Default pink for low density
  if (count > 3) iconUrl = imageBlue;
  else if (count > 2) iconUrl = imageYellow;
  
  return new L.Icon({
    iconUrl,
    iconSize: [40, 55], // Increased size for better visibility
    iconAnchor: [20, 55],
    popupAnchor: [1, -34],
  });
};

const stateIcon = new L.Icon({
  iconUrl: image,
  iconSize: [50, 50], // Increased size for state markers
  iconAnchor: [25, 50],
  popupAnchor: [1, -34],
});

// Sample Locations Data
const locations = [
  { id: 1, name: "Delhi NGO", lat: 28.7041, lng: 77.1025, category: "Education" },
  { id: 2, name: "Mumbai Health Center", lat: 19.076, lng: 72.8777, category: "Health" },
  { id: 3, name: "AIIMS Delhi", lat: 28.5672, lng: 77.2100, category: "Health" },
  { id: 3, name: "AIIM Delhi", lat: 28.5672, lng: 77.2100, category: "Health" },
  { id: 4, name: "Fortis Hospital Bangalore", lat: 12.9352, lng: 77.6245, category: "Health" },
  { id: 5, name: "Apollo Chennai", lat: 13.066, lng: 80.234, category: "Health" },
  { id: 6, name: "Kokilaben Dhirubhai Hospital Mumbai", lat: 19.132, lng: 72.826, category: "Health" },
  { id: 7, name: "Tata Memorial Cancer Hospital", lat: 18.998, lng: 72.841, category: "Health" },
  { id: 8, name: "Chennai Fundraiser", lat: 13.0827, lng: 80.2707, category: "Charity" },
  { id: 9, name: "Bangalore Shelter", lat: 12.9716, lng: 77.5946, category: "Housing" },
  { id: 10, name: "London Charity", lat: 51.5074, lng: -0.1278, category: "Charity" },
  { id: 11, name: "New York ", lat: 40.7128, lng: -74.006, category: "Health" },
  { id: 12, name: "Sydney Wildlife Rescue", lat: -33.8688, lng: 151.2093, category: "Environment" },
  { id: 13, name: "Berlin Education Initiative", lat: 52.52, lng: 13.405, category: "Education" },
  { id: 14, name: "Paris Homeless Shelter", lat: 48.8566, lng: 2.3522, category: "Housing" },
];
const stateLocations = [
  { id: 10, name: "Maharashtra", lat: 19.7515, lng: 75.7139 },
  { id: 11, name: "Karnataka", lat: 15.3173, lng: 75.7139 },
  { id: 12, name: "Tamil Nadu", lat: 11.1271, lng: 78.6569 },
  { id: 13, name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { id: 14, name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { id: 15, name: "West Bengal", lat: 22.9868, lng: 87.855 },
  { id: 16, name: "Gujarat", lat: 22.2587, lng: 71.1924 },
  { id: 17, name: "Rajasthan", lat: 27.0238, lng: 74.2179 },
  { id: 18, name: "Punjab", lat: 31.1471, lng: 75.3412 },
  { id: 19, name: "Haryana", lat: 29.0588, lng: 76.0856 },
  { id: 20, name: "Bihar", lat: 25.0961, lng: 85.3131 },
  { id: 21, name: "Madhya Pradesh", lat: 22.9734, lng: 78.6569 },
  { id: 22, name: "Odisha", lat: 20.9517, lng: 85.0985 },
  { id: 23, name: "Kerala", lat: 10.8505, lng: 76.2711 },
  { id: 24, name: "Assam", lat: 26.2006, lng: 92.9376 },
  { id: 25, name: "India", lat: 20.5937, lng: 78.9629 },
  { id: 26, name: "USA", lat: 37.0902, lng: -95.7129 },
  { id: 27, name: "UK", lat: 55.3781, lng: -3.436 },
  { id: 28, name: "Australia", lat: -25.2744, lng: 133.7751 },
  { id: 29, name: "Canada", lat: 56.1304, lng: -106.3468 },
  { id: 30, name: "Germany", lat: 51.1657, lng: 10.4515 },
  { id: 31, name: "France", lat: 46.6034, lng: 1.8883 },
];

// Count occurrences of locations in the same city
const locationCounts = locations.reduce((acc, loc) => {
  
  const key = `${loc.lat}-${loc.lng}`;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

export default function LeafletMap() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredLocations =
    selectedCategory === "All"
      ? locations
      : locations.filter((loc) => loc.category === selectedCategory);
   
  return (
    <div className="h-full w-full">
    <div class = "box">
      <label class="filter-label">
        Filter by Category:
      </label>
      <select
        class="filter-select"
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {["All", ...new Set(locations.map((loc) => loc.category))].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
 
  



      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100vh", width: "100vw" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Colorful Map">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

   
  <MarkerClusterGroup
iconCreateFunction={(cluster) => {
  const count = cluster.getChildCount(); // Get the number of markers

  // Define color based on count
  let backgroundColor = "yellow"; // Default: Low density
  if (count >= 3 && count <= 5) backgroundColor = "orange"; // Medium density
  if (count > 5) backgroundColor = "pink"; // High density

  // Define size dynamically based on count
  let size = 35; // Default size
  if (count > 5) size = 50; // Bigger cluster = Bigger circle
  if (count > 10) size = 70; // Even bigger for very large clusters
  if (count > 20) size = 90; // Maximum size for huge clusters

  return new L.DivIcon({
    html: `<div style="background-color: ${backgroundColor}; color: white; 
          border-radius: 50%; width: ${size}px; height: ${size}px; 
          display: flex; justify-content: center; align-items: center; font-weight: bold;">
          ${count}
          </div>`,
    className: "custom-cluster-icon",
    iconSize: L.point(size, size), // Adjusted size dynamically
  });
}}

>
  {filteredLocations.map((location) => (
    <Marker
      key={location.id}
      position={[location.lat, location.lng]}
      
      icon={getIcon(locationCounts[`${location.lat}-${location.lng}`])}
    >
      <Popup>
        <strong>{location.name}</strong>
          <br />
        <strong> {location.category}</strong>
            
        </Popup>
    </Marker>
  ))}



          {stateLocations.map((state) => (
            <Marker key={state.id} position={[state.lat, state.lng]} icon={stateIcon}>
              <Popup>
                <strong>{state.name}</strong>
              </Popup>
            </Marker>
          ))}
           {filteredLocations.map((state) => (
            <Marker key={state.id} position={[state.lat, state.lng]} icon={stateIcon}>
              <Popup>
                <strong>{state.name}</strong>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
