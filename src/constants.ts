import * as L from 'leaflet';

type CityCoordinates = {
  boston: L.LatLngExpression,
}

export const CITY_COORDINATES: CityCoordinates = {
  boston: [42.3601, -71.0589],
}

export const SUBWAY_ROUTES = [
  "Red",
  "Orange",
  "Blue",
  "Green-B",
  "Green-C",
  "Green-D",
  "Green-E",
  "Mattapan",
]

export const COMMUTER_ROUTES = [
  "CR-Fairmount",
  "CR-Fitchburg",
  "CR-Worcester",
  "CR-Franklin",
  "CR-Greenbush",
  "CR-Haverhill",
  "CR-Kingston",
  "CR-Lowell",
  "CR-Middleborough",
  "CR-Needham",
  "CR-Newburyport",
  "CR-Providence",
  "CR-Foxboro",
]

export const SUBWAY_ROUTE_COLORS = {
  "Red": "red",
  "Orange": "orange",
  "Blue": "blue",
  "Green-B": "green",
  "Green-C": "green",
  "Green-D": "green",
  "Green-E": "green",
  "Mattapan": "pink",
}

export const subwayRouteColorsMap = new Map(Object.entries(SUBWAY_ROUTE_COLORS));

export const getRouteColor = (route: string) => {
  if (SUBWAY_ROUTES.includes(route)) {
    return subwayRouteColorsMap.get(route)
  } else if (COMMUTER_ROUTES.includes(route)) {
    return "purple";
  }
  return "yellow";
}

export const osmTile = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "© OpenStreetMap contributors",
};

export const cartocdnTile = {
  url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>`
}