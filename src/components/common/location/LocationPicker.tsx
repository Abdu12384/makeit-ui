import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

// Fix Leaflet icons
const fixLeafletIcons = () => {
  if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }
};

interface LocationMarkerProps {
  position: [number, number];
  onPositionChange?: (lat: number, lng: number) => void;
  draggable?: boolean;
}

function LocationMarker({ position, onPositionChange, draggable = false }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e) {
      if (draggable && onPositionChange) {
        onPositionChange(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  return (
    <Marker
      position={position}
      draggable={draggable}
      eventHandlers={
        draggable && onPositionChange
          ? {
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                onPositionChange(pos.lat, pos.lng);
              },
            }
          : undefined
      }
    />
  );
}

interface LocationPickerProps {
  mode?: "edit" | "view";
  buttonClassName?: string;
  buttonText?: string;
  containerClassName?: string;
  onLocationSelect?: (data: { lat: number; lng: number; address: string }) => void;
  initialLat?: number | string;
  initialLng?: number | string;
  initialAddress?: string;
}

export default function LocationPicker({
  mode = "edit",
  buttonClassName = "w-full border-sky-200 hover:bg-sky-50 text-sky-700 transition-all duration-300",
  buttonText = "Pick Location on Map",
  containerClassName = "space-y-2",
  onLocationSelect,
  initialLat,
  initialLng,
  initialAddress = "",
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<[number, number]>([
    typeof initialLat === "number"
      ? initialLat
      : typeof initialLat === "string"
        ? parseFloat(initialLat) || 40.7128
        : 40.7128,
    typeof initialLng === "number"
      ? initialLng
      : typeof initialLng === "string"
        ? parseFloat(initialLng) || -74.006
        : -74.006,
  ]);
  const [address, setAddress] = useState<string>(mode === "view" ? initialAddress : "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  useEffect(() => {
    const lat =
      typeof initialLat === "number"
        ? initialLat
        : typeof initialLat === "string"
          ? parseFloat(initialLat) || position[0]
          : position[0];
    const lng =
      typeof initialLng === "number"
        ? initialLng
        : typeof initialLng === "string"
          ? parseFloat(initialLng) || position[1]
          : position[1];

    if (lat !== position[0] || lng !== position[1]) {
      setPosition([lat, lng]);
    }
  }, [initialLat, initialLng]);

  useEffect(() => {
    if (mode === "view") {
      setAddress(initialAddress);
      return;
    }

    const getAddressFromCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&zoom=18&addressdetails=1&accept-language=en`
        );
        const data = await response.json();
        if (data?.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress(`${position[0].toFixed(6)}, ${position[1].toFixed(6)}`);
        }
      } catch (error) {
        setAddress(`${position[0].toFixed(6)}, ${position[1].toFixed(6)}`);
      }
    };

    if (position[0] && position[1]) {
      getAddressFromCoordinates();
    }
  }, [position, mode, initialAddress]);

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data?.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        if (mapRef.current) mapRef.current.flyTo(newPosition, 16);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLocation = () => {
    onLocationSelect?.({
      lat: position[0],
      lng: position[1],
      address,
    });
    setIsOpen(false);
  };

  // View Mode with redirect
  if (mode === "view") {
    return (
      <div className={containerClassName}>
        <a
          href={`https://www.google.com/maps?q=${position[0]},${position[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-[200px] w-full rounded-md overflow-hidden border border-sky-200 cursor-pointer"
        >
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            boxZoom={false}
            keyboard={false}
            zoomControl={false}
          >
            <TileLayer
              attribution='© OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} draggable={false} />
          </MapContainer>
        </a>
        {address && (
          <div className="text-sm text-sky-900 mt-2">
            <p className="font-medium text-sky-700">Address</p>
            <p>{address}</p>
          </div>
        )}
      </div>
    );
  }

  // Edit Mode
  return (
    <>
      <Button type="button" variant="outline" className={buttonClassName} onClick={() => setIsOpen(true)}>
        <MapPin className="mr-2 h-4 w-4 text-sky-500" />
        {buttonText}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-[#124E66] flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Select Location on Map
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-2 space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search for a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 pr-4 py-2 border-sky-200 focus:ring-sky-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400" size={18} />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-sky-500 hover:bg-sky-600 transition-all duration-300"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="h-[400px] w-full rounded-md overflow-hidden border border-sky-200">
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                whenReady={((event: any) => {
                  mapRef.current = event.target;
                }) as () => void}
              >
                <TileLayer
                  attribution='© OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                  position={position}
                  onPositionChange={handlePositionChange}
                  draggable={true}
                />
              </MapContainer>
            </div>

            <div className="space-y-2 bg-sky-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-sky-700">Latitude</p>
                  <p className="text-sky-900">{position[0].toFixed(6)}</p>
                </div>
                <div>
                  <p className="font-medium text-sky-700">Longitude</p>
                  <p className="text-sky-900">{position[1].toFixed(6)}</p>
                </div>
              </div>
              {address && (
                <div>
                  <p className="font-medium text-sky-700">Address</p>
                  <p className="text-sky-900 break-words">{address}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="bg-gray-50 px-6 py-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-sky-200 text-sky-700 hover:bg-sky-50"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmLocation} className="bg-sky-500 hover:bg-sky-600 ml-2">
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
