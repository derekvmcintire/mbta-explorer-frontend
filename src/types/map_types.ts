import type { LatLngExpression } from "leaflet";

export interface StopAttributes {
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  coordinates: LatLngExpression[];
  stops: { attributes: StopAttributes }[];
}

export interface RouteMap {
  [routeId: string]: {
    shape: L.Polyline;
    stops: L.Circle[];
  };
}