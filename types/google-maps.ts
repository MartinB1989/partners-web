// Definición de la estructura de la biblioteca Google Maps
export interface GoogleMapsLibrary {
  maps: {
    places: {
      // API Antigua (disponible hasta al menos marzo 2025)
      Autocomplete: new (
        input: HTMLInputElement, 
        options?: AutocompleteOptions
      ) => GoogleAutocomplete;
      
      // Nueva API recomendada
      PlaceAutocompleteElement: {
        new (options?: PlaceAutocompleteElementOptions): GooglePlaceAutocompleteElement;
      };
    };
    event: {
      clearInstanceListeners: (instance: GoogleAutocomplete | GooglePlaceAutocompleteElement) => void;
    };
  };
}

// Interfaces para la API antigua
export interface AutocompleteOptions {
  componentRestrictions?: { country: string | string[] };
  fields?: string[];
  types?: string[];
}

export interface GoogleAutocomplete {
  addListener: (event: string, callback: () => void) => void;
  getPlace: () => GooglePlace;
}

// Interfaces para la nueva API PlaceAutocompleteElement
export interface PlaceAutocompleteElementOptions {
  types?: string[];
  fields?: string[];
  componentRestrictions?: { country: string | string[] };
  textInputOptions?: {
    placeholder?: string;
    label?: string;
  };
}

// La interfaz para el elemento personalizado de Google Maps
export interface GooglePlaceAutocompleteElement extends HTMLElement {
  // No sobrescribimos addEventListener, lo extenderemos en el código
  value?: string;
}

export interface PlaceSelectEvent {
  place: GooglePlace;
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