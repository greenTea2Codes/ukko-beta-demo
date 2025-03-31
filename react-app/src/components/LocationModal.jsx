import { useState, useEffect } from "react";
import { Box, Button, List, ListItem } from "@mui/material";

const LocationModal = ({ onSave }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("/fin_cities.json")
    .then((res) => res.json())
    .then((data) => setCities(data.city_names_in_Finland))
    .catch((err) => console.error("Failed to load cities:", err));
  });

  useEffect(() => {
    const savedCity = sessionStorage.getItem("selectedLocation");
    if (savedCity) {
      setInputValue(savedCity);
    }
  }, []);
  // Handle user typing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const matches = cities.filter((city) =>
        city.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle selecting a city from suggestions
  const handleSelectCity = (city) => {
    setInputValue(city);
    setShowSuggestions(false);
  };

  // Handle save button click
  const handleSave = () => {
    if (inputValue.trim() === "") return;

    sessionStorage.setItem("selectedLocation", inputValue);
    onSave(inputValue); // inform parent
  };

  return (
    <Box sx={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <Box sx={{
        border: "1px solid #ccc",
        padding: "20px", borderRadius: "8px",
        width: "300px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        backgroundColor: "background.default",
        textAlign: "center"
      }}>
        <h3>Select Your Location</h3>
        <p>Start typing your location:</p>

        <Box sx={{ position: "relative" }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px" }}
            placeholder="e.g., Helsinki"
          />
          {showSuggestions && (
            <List sx={{
              listStyleType: "none", margin: 0, padding: 0,
              position: "absolute", top: "100%", left: 0, right: 0,
              backgroundColor: "background.default",
              border: "1px solid #ccc",
              maxHeight: "150px", overflowY: "auto", zIndex: 10
            }}>
              {suggestions.length > 0 ? (
                suggestions.map((city) => (
                  <ListItem key={city}
                      onClick={() => handleSelectCity(city)}
                      style={{ padding: "6px", cursor: "pointer" }}>
                    {city}
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ padding: "6px" }}>No matches</ListItem>
              )}
            </List>
          )}
        </Box>
        <Button
          onClick={handleSave}
          sx={{ marginTop: "10px", padding: "8px 12px" }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default LocationModal;
