import type {
  VehicleAttributes,
  VehicleStateMap,
  Vehicle,
} from "../stores/live_track_store";
import * as L from "leaflet";

const VEHICLE_STATUS_TEXT_MAP = new Map([
  ["STOPPED_AT", "Stopped"],
  ["IN_TRANSIT_TO", "In Transit"],
  ["INCOMING_AT", "Arriving"],
]);

/**
 * Manages the creation, updating, and rendering of vehicle markers on a map.
 */
export class VehicleMarkerManager {
  /**
   * Generates the popup content for a vehicle marker.
   *
   * @param {VehicleAttributes & { route?: string }} attributes - The vehicle attributes including optional route information.
   * @returns {string} The HTML content for the popup.
   */
  private static createPopupContent(
    attributes: VehicleAttributes & { route?: string },
  ): string {
    const { current_status, speed, route, updated_at } = attributes;
    const vehicleStatus =
      VEHICLE_STATUS_TEXT_MAP.get(current_status || "") || "";

    const routeText = route || "Not Provided";

    const UNKNOWN_SPEED = "Unknown";
    const haveSpeed = speed || speed === 0;
    const speedText = haveSpeed ? speed : UNKNOWN_SPEED;
    const speedLabel = speedText === UNKNOWN_SPEED ? "" : "mph";

    return `
      <strong>Route: ${routeText}</strong><br>
      Speed: ${speedText}${speedLabel}<br>
      Status: ${vehicleStatus}<br>
      Updated At: ${updated_at}<br>
    `;
  }

  /**
   * Creates a new marker for a vehicle on the map.
   *
   * @param {L.Map | L.LayerGroup<any>} map - The Leaflet map or layer group.
   * @param {VehicleAttributes & { route?: string }} attributes - The vehicle attributes including optional route information.
   * @returns {L.Circle} The created Leaflet marker.
   */
  private static createMarker(
    map: L.Map | L.LayerGroup<any>,
    attributes: VehicleAttributes & { route?: string },
  ): L.Circle {
    const marker = L.circle([attributes.latitude, attributes.longitude], {
      color: "yellow",
      fillColor: "yellow",
      fillOpacity: 1,
      radius: 50,
    });

    marker.bindPopup(this.createPopupContent(attributes));
    marker.addTo(map);
    return marker;
  }

  /**
   * Updates an existing vehicle marker with new attributes.
   *
   * @param {VehicleStateMap} markerState - The current state of the vehicle marker.
   * @param {VehicleAttributes & { route?: string }} newAttributes - The updated vehicle attributes.
   */
  private static updateMarker(
    markerState: VehicleStateMap,
    newAttributes: VehicleAttributes & { route?: string },
  ): void {
    const updatedAttributes = { ...markerState.data };

    // Update position
    updatedAttributes.latitude = newAttributes.latitude;
    updatedAttributes.longitude = newAttributes.longitude;
    markerState.marker.setLatLng([
      newAttributes.latitude,
      newAttributes.longitude,
    ]);

    // Update other attributes if they exist and are valid
    if (newAttributes.direction !== undefined)
      updatedAttributes.direction = newAttributes.direction;
    if (newAttributes.speed !== undefined && newAttributes.speed !== 0)
      updatedAttributes.speed = newAttributes.speed;
    if (newAttributes.updated_at)
      updatedAttributes.updated_at = newAttributes.updated_at;
    if (newAttributes.current_status)
      updatedAttributes.current_status = newAttributes.current_status;
    if (newAttributes.bearing !== undefined)
      updatedAttributes.bearing = newAttributes.bearing;
    if (newAttributes.route) updatedAttributes.route = newAttributes.route;

    // Update the popup content with new information
    markerState.marker.setPopupContent(
      this.createPopupContent(updatedAttributes),
    );

    // Update the stored data
    markerState.data = updatedAttributes;
  }

  /**
   * Handles updates for a single vehicle, creating or updating its marker on the map.
   *
   * @param {Vehicle} vehicle - The vehicle data to update.
   * @param {Record<string, VehicleStateMap>} vehicleStates - The current state of all vehicles.
   * @param {L.Map} map - The Leaflet map instance.
   * @returns {Record<string, VehicleStateMap>} The updated state of all vehicles.
   */
  static handleVehicleUpdate(
    vehicle: Vehicle,
    vehicleStates: Record<string, VehicleStateMap>,
    map: L.Map,
  ): Record<string, VehicleStateMap> {
    const { id, attributes } = vehicle;
    const route = vehicle?.relationships?.route?.data?.id || "";
    const enrichedAttributes = { ...attributes, route };

    if (vehicleStates[id]) {
      this.updateMarker(vehicleStates[id], enrichedAttributes);
    } else {
      const marker = this.createMarker(map, enrichedAttributes);
      vehicleStates[id] = { marker, data: enrichedAttributes };
    }

    return vehicleStates;
  }
}
