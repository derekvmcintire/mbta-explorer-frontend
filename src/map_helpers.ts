import * as L from "leaflet";
import { getRouteColor } from "./constants";

export const plotRoute = (map: any, coordinates: any[], color: string): void => {
  L.polyline(coordinates, { color: color }).addTo(map);
};

export const plotStop = (map: any, coordinates: any[], color: string): void => {
  L.circle(coordinates, {
    color: color,
    fillColor: color,
    fillOpacity: 0.5,
    radius: 50
  }).addTo(map)
};

export const plotMultipleRoutes = ((map: any, routes: any[]): any => {
  routes.forEach((route: any) => {
    const color = getRouteColor(route.id) || '';
    plotRoute(map, route.coordinates, color);
    route.stops.forEach((stop: any) => {
      const { attributes } = stop;
      const coordinates = [attributes.latitude, attributes.longitude];
      plotStop(map, coordinates, color);
    })
  });

  return map;
})

