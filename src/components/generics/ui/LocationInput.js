"use client";

import React, { useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import Input from "./Input";

const libraries = ["places"];

export default function LocationInput({
  label,
  value,
  onChange,
  onLocationSelect,
  error,
  placeholder,
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries,
  });

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["geocode", "establishment"] }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        handlePlaceSelect(place);
      });
    }
  }, [isLoaded]);

  const handlePlaceSelect = (place) => {
    if (!place.geometry) return;

    const getComponent = (type) =>
      place.address_components?.find((c) => c.types.includes(type))
        ?.long_name || "";

    const addressData = {
      address: place.formatted_address,
      city:
        getComponent("locality") ||
        getComponent("postal_town") ||
        getComponent("administrative_area_level_2"),
      country: getComponent("country"),
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };

    onLocationSelect(addressData);
  };

  return (
    <Input
      ref={inputRef}
      label={label}
      icon={MapPin}
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Search address..."}
      error={error}
    />
  );
}
