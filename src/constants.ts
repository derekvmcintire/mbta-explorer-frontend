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