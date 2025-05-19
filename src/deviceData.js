// Central device data storage
const devices = {
    device1: {
      name: "Device 1",
      location: "Living Room",
      aqi: 45,
      temp: 22,
      humidity: 65
    },
    device2: {
      name: "Device 2", 
      location: "Bedroom",
      aqi: 38,
      temp: 24,
      humidity: 58
    }
  };
  
  function updateDevice(deviceId, newName, newLocation) {
    devices[deviceId].name = newName;
    devices[deviceId].location = newLocation;
    updateAllDeviceDisplays();
  }
  
  function updateAllDeviceDisplays() {
    // This will be called after any device update
    if (typeof updateDashboardDevices === 'function') updateDashboardDevices();
    if (typeof updateDevice1Page === 'function') updateDevice1Page();
    if (typeof updateDevice2Page === 'function') updateDevice2Page();
  }
  
  export { devices, updateDevice };