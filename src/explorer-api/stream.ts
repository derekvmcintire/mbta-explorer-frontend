import { get } from "svelte/store";
import { liveData } from "../stores/boston_subway_store";
import { mapLayerControl, mapStore, type MapStore } from "../stores/map_store";
import { addLayerToMap, createVehicleLayers, plotLiveData, removeExistingLayer, updateLayerControl, updateLiveData } from "../utils/map_live_data";
import L from "leaflet";

let eventSource: EventSource;

export function startListening() {
  // Include the API key in the query parameters
  const url = `http://localhost:8080/stream/vehicles`;
  
  eventSource = new EventSource(url, { withCredentials: false });

  const map = get(mapStore);
  const layerControl = get(mapLayerControl);

  const removeVehicleById = (layerGroup: L.LayerGroup, vehicleId: string) => {
    layerGroup.eachLayer((layer) => {
      // Check if the layer has the `vehicleId` property
      if ((layer as any).options?.id === vehicleId) {
        layerGroup.removeLayer(layer);
      }
    });
  };
  

  // Handle the "reset" event
  eventSource.addEventListener("reset", (event) => {
    const data = JSON.parse(event.data);
    plotLiveData(data, "Red");
    console.log("Reset event received", data);
  });

  // Handle the "add" event
  eventSource.addEventListener("add", (event) => {
    const data = JSON.parse(event.data);
    plotLiveData(data, "Red");
    console.log("Add event received", data);
    // Handle added data (e.g., merge with existing data)
  });

  // Handle the "update" event
  eventSource.addEventListener("update", (event) => {
    const data = JSON.parse(event.data);
    // update only sends a single vehicle
    // need to check if that vehicle already exists
    const currentLiveData = get(liveData);
    const layerGroup = currentLiveData.get("Red")
    console.log('***** currentLiveData is: ', currentLiveData)
    removeExistingLayer("Red", map, layerControl);
    if (layerGroup) {
      console.log("I will be very surprised if this works: ", layerGroup)
      const vehicle = createVehicleLayers([data])[0];
      const vehicleId = data.attributes.vehicle_id;
      removeVehicleById(layerGroup, vehicleId);
      layerGroup?.addLayer(vehicle)
      addLayerToMap(layerGroup, map);
      updateLayerControl(layerGroup, "Red", layerControl);
      updateLiveData("Red", layerGroup)
    } else {
      console.log("I guess layerGroup aint nothing: ", layerGroup)
      const newLayerGroup = L.layerGroup(createVehicleLayers([data]));
      addLayerToMap(newLayerGroup, map);
      updateLayerControl(newLayerGroup, "Red", layerControl);
      updateLiveData("Red", newLayerGroup)
    }
    

    

    console.log("Update event received", data);
    // Handle updated data (e.g., update specific entries)
  });

  // Handle the "remove" event
  eventSource.addEventListener("remove", (event) => {
    const data = JSON.parse(event.data);
    plotLiveData(data, "Red");
    console.log("Remove event received", data);
    // Handle removed data (e.g., remove entries from your store)
  });

  // Handle connection errors
  eventSource.onerror = (error) => {
    console.error("SSE connection error", error);
    eventSource.close();
  };
}

export function stopListening() {
  if (eventSource) {
    eventSource.close();
    console.log("SSE connection closed");
  }
}
