import type { LatLngExpression } from "leaflet";

export interface StopAttributes {
  latitude: number;
  longitude: number;
  name: string;
  municipality: string;
  address: string;
}

export type Stop = { attributes: StopAttributes };

export interface Route {
  id: string;
  coordinates: LatLngExpression[];
  stops: Stop[];
}

export interface RouteMap {
  [routeId: string]: {
    shape: L.Polyline;
    stops: L.Circle[];
  };
}
