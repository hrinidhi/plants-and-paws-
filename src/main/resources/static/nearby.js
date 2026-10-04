document.addEventListener("DOMContentLoaded", () => {
  const mapHost = document.querySelector("#map");
  const searchInput = document.querySelector("#nearbySearch");
  const searchForm = document.querySelector("#locationSearchForm");
  const locateButton = document.querySelector("#useMyLocation");
  const message = document.querySelector("#mapMessage");
  const host = document.querySelector("#nearbyCards");
  const empty = document.querySelector("#nearbyEmpty");
  const summary = document.querySelector("#resultSummary");
  const filterButtons = [...document.querySelectorAll("[data-nearby-filter]")];
  if (!mapHost || !window.L) {
    message.textContent = "The interactive map could not load. Check your connection and refresh to try again.";
    message.className = "form-result error";
    return;
  }

  const map = L.map(mapHost, { scrollWheelZoom: false }).setView([13.0827, 80.2707], 12);
  const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
  }).addTo(map);
  tiles.on("tileerror", () => {
    message.textContent = "Map tiles could not be loaded. Check your internet connection; place search and listings may also be unavailable.";
    message.className = "form-result error";
  });

  let center = { lat: 13.0827, lon: 80.2707, label: "Chennai" };
  let routeOrigin = null;
  let selectedCategory = "all";
  let places = [];
  let currentLocationMarker = null;
  let requestController = null;
  let requestNumber = 0;
  const markers = L.layerGroup().addTo(map);
  const radiusMeters = 15000;
  const categories = {
    veterinary: { label: "Veterinary clinic", color: "#315943", icon: "✚" },
    shelter: { label: "Animal shelter", color: "#8a6740", icon: "⌂" },
    rescue: { label: "Rescue centre", color: "#8a5146", icon: "♡" },
    emergency: { label: "Emergency / animal rescue", color: "#a33f32", icon: "!" },
    pet: { label: "Pet services", color: "#6e7650", icon: "✿" },
    plant: { label: "Plant services", color: "#52734e", icon: "❧" }
  };

  function setMessage(text, error = false) {
    message.textContent = text;
    message.className = `form-result${error ? " error" : ""}`;
  }

  function distanceKm(a, b) {
    const radians = value => value * Math.PI / 180;
    const latDelta = radians(b.lat - a.lat);
    const lonDelta = radians(b.lon - a.lon);
    const h = Math.sin(latDelta / 2) ** 2 +
      Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(lonDelta / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function elementCoordinates(element) {
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;
    return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
  }

  function classify(tags = {}) {
    if (tags.emergency === "animal_rescue") return "emergency";
    if (tags.amenity === "veterinary") return "veterinary";
    if (tags.amenity === "animal_shelter") return "shelter";
    if (tags.rescue === "animal" || tags.amenity === "rescue") return "rescue";
    if (tags.amenity === "animal_boarding" || tags.amenity === "animal_breeding" || tags.shop === "pet") return "pet";
    if (tags.shop === "garden_centre" || tags.shop === "florist") return "plant";
    return null;
  }

  function addressOf(tags) {
    const parts = [tags["addr:street"], tags["addr:suburb"] || tags["addr:city"]].filter(Boolean);
    return parts.join(", ") || tags["addr:place"] || tags["addr:postcode"] || "Address not listed";
  }

  function nameOf(tags, category) {
    return tags.name || tags.brand || categories[category].label;
  }

  function escapedPopup(place) {
    const phone = place.phone ? `<br><a href="tel:${encodeURIComponent(place.phone.replace(/\s/g, ""))}">Call ${escapeHtml(place.phone)}</a>` : "";
    const coordinate = `${place.lat},${place.lon}`;
    const direction = routeOrigin
      ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&amp;route=${routeOrigin.lat},${routeOrigin.lon};${coordinate}`
      : `https://www.openstreetmap.org/?mlat=${place.lat}&amp;mlon=${place.lon}#map=17/${place.lat}/${place.lon}`;
    const directionLabel = routeOrigin ? "Directions from searched location" : "Open on OpenStreetMap";
    return `<strong>${escapeHtml(place.name)}</strong><br>${escapeHtml(categories[place.category].label)}<br>${escapeHtml(place.address)}<br>${place.distance.toFixed(1)} km away${phone}<br><a href="${direction}" target="_blank" rel="noopener noreferrer">${directionLabel}</a>`;
  }

  function drawResults() {
    const visible = places
      .filter(place => selectedCategory === "all" || place.category === selectedCategory)
      .sort((a, b) => a.distance - b.distance);
    markers.clearLayers();
    visible.forEach(place => {
      const style = categories[place.category];
      L.circleMarker([place.lat, place.lon], {
        radius: 9, color: "#fffefa", weight: 2, fillColor: style.color, fillOpacity: 1
      }).bindPopup(escapedPopup(place)).addTo(markers);
    });
    host.innerHTML = visible.slice(0, 30).map(place => {
      const style = categories[place.category];
      const phone = place.phone
        ? `<a class="btn alt small" href="tel:${encodeURIComponent(place.phone.replace(/\s/g, ""))}">Call ${escapeHtml(place.phone)}</a>`
        : `<span class="small-text muted">No phone listed on OpenStreetMap</span>`;
      const directionsUrl = routeOrigin
        ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&amp;route=${routeOrigin.lat},${routeOrigin.lon};${place.lat},${place.lon}`
        : `https://www.openstreetmap.org/?mlat=${place.lat}&amp;mlon=${place.lon}#map=17/${place.lat}/${place.lon}`;
      const directionsLabel = routeOrigin ? "Directions" : "Open map";
      return `<article class="card feature-card"><span class="feature-icon" style="color:${style.color}" aria-hidden="true">${escapeHtml(style.icon)}</span><span class="pill">${escapeHtml(style.label)}</span><h3 style="margin-top:12px">${escapeHtml(place.name)}</h3><div class="card-meta"><span>&#128205; ${escapeHtml(place.address)}</span><span>&#10148; ${place.distance.toFixed(1)} km</span></div><div class="actions">${phone}<a class="btn small" href="${directionsUrl}" target="_blank" rel="noopener noreferrer">${directionsLabel}</a><button type="button" class="btn soft small" data-focus-place="${place.id}">View on map</button></div></article>`;
    }).join("");
    empty.hidden = visible.length !== 0;
    summary.textContent = `${visible.length} OpenStreetMap ${visible.length === 1 ? "place" : "places"} within about 15 km of ${center.label}.`;
    host.querySelectorAll("[data-focus-place]").forEach(button => button.addEventListener("click", () => {
      const place = visible.find(item => String(item.id) === button.dataset.focusPlace);
      if (!place) return;
      map.setView([place.lat, place.lon], 16);
      markers.eachLayer(marker => {
        if (marker.getLatLng().lat === place.lat && marker.getLatLng().lng === place.lon) marker.openPopup();
      });
      mapHost.scrollIntoView({ behavior: "smooth", block: "center" });
    }));
  }

  async function loadPlaces() {
    requestController?.abort();
    requestController = new AbortController();
    const currentRequest = ++requestNumber;
    setMessage(`Searching OpenStreetMap around ${center.label}…`);
    host.innerHTML = "";
    const { lat, lon } = center;
    const query = `[out:json][timeout:25];(nwr["amenity"~"^(veterinary|animal_shelter|animal_boarding|animal_breeding)$"](around:${radiusMeters},${lat},${lon});nwr["shop"~"^(pet|garden_centre|florist)$"](around:${radiusMeters},${lat},${lon});nwr["rescue"="animal"](around:${radiusMeters},${lat},${lon});nwr["emergency"="animal_rescue"](around:${radiusMeters},${lat},${lon}););out center tags;`;
    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: `data=${encodeURIComponent(query)}`,
        signal: requestController.signal
      });
      if (!response.ok) throw new Error(`OpenStreetMap search returned ${response.status}`);
      const data = await response.json();
      if (currentRequest !== requestNumber) return;
      places = (data.elements || []).flatMap(element => {
        const coordinates = elementCoordinates(element);
        const category = classify(element.tags);
        if (!coordinates || !category) return [];
        return [{
          id: `${element.type}-${element.id}`,
          lat: coordinates.lat,
          lon: coordinates.lon,
          category,
          name: nameOf(element.tags, category),
          address: addressOf(element.tags),
          phone: element.tags.phone || element.tags["contact:phone"] || "",
          distance: distanceKm(center, coordinates)
        }];
      });
      drawResults();
      setMessage(places.length ? "Results are sourced from OpenStreetMap. Place details and opening information may be incomplete." : "No matching places were mapped in this area. Try another location or category.");
    } catch (error) {
      if (error.name === "AbortError" || currentRequest !== requestNumber) return;
      places = [];
      drawResults();
      setMessage("Nearby place search is temporarily unavailable. The map remains available; please try again later.", true);
    }
  }

  async function searchLocation(query) {
    const term = query.trim();
    if (!term) {
      setMessage("Enter a city or neighbourhood to search.", true);
      return;
    }
    setMessage("Finding that place…");
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(term)}`;
      const response = await fetch(url, { headers: { "Accept-Language": document.documentElement.lang || "en" } });
      if (!response.ok) throw new Error(`Location search returned ${response.status}`);
      const results = await response.json();
      if (!results.length) {
        setMessage("We could not find that place. Try a nearby town or district name.", true);
        return;
      }
      const result = results[0];
      center = { lat: Number(result.lat), lon: Number(result.lon), label: result.display_name.split(",").slice(0, 2).join(",") };
      routeOrigin = center;
      map.setView([center.lat, center.lon], 13);
      await loadPlaces();
    } catch (error) {
      setMessage("Location search is temporarily unavailable. Check your connection and try again.", true);
    }
  }

  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    searchLocation(searchInput.value);
  });
  filterButtons.forEach(button => button.addEventListener("click", () => {
    selectedCategory = button.dataset.nearbyFilter;
    filterButtons.forEach(filter => filter.setAttribute("aria-pressed", String(filter === button)));
    drawResults();
  }));
  locateButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      setMessage("Location access is not available in this browser. Search for a city or neighbourhood instead.", true);
      return;
    }
    locateButton.disabled = true;
    setMessage("Waiting for your location permission…");
    navigator.geolocation.getCurrentPosition(async position => {
      center = { lat: position.coords.latitude, lon: position.coords.longitude, label: "your current location" };
      routeOrigin = center;
      map.setView([center.lat, center.lon], 14);
      if (currentLocationMarker) currentLocationMarker.remove();
      currentLocationMarker = L.circleMarker([center.lat, center.lon], {
        radius: 8, color: "#fffefa", weight: 3, fillColor: "#4777a5", fillOpacity: 1
      }).bindPopup("Your current location").addTo(map);
      locateButton.disabled = false;
      await loadPlaces();
    }, error => {
      locateButton.disabled = false;
      const text = error.code === error.PERMISSION_DENIED
        ? "Location permission was denied. Search for a city or neighbourhood instead."
        : "Your location could not be determined. Search for a city or neighbourhood instead.";
      setMessage(text, true);
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 });
  });

  requestAnimationFrame(() => map.invalidateSize());
  loadPlaces();
});
