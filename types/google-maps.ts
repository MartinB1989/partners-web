export interface AutocompleteOptions {
  componentRestrictions?: { country: string | string[] };
  fields?: string[];
  types?: string[];
}

export interface GoogleAutocomplete {
  addListener: (event: string, callback: () => void) => void;
  getPlace: () => GooglePlace;
}

export interface GooglePlace {
  formatted_address: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  name: string;
}

export interface PlaceResult {
  address: string;
  location: { lat: number; lng: number };
  placeDetails: GooglePlace;
}