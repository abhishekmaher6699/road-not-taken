const MapToggle = ( {setBasemap, basemap} ) => {
  return (
    <div className="absolute top-18 right-4 z-2000">
      <button
        onClick={() =>
          setBasemap((prev) => (prev === "imagery" ? "normal" : "imagery"))
        }
        className="relative h-12 w-12 overflow-hidden 
               rounded-full shadow-lg 
               border-2 border-white
               hover:scale-100 active:scale-95
               transition"
      >
        <img
          src={basemap === "imagery" ? "/map-normal.png" : "/map-satellite.png"}
          alt="Toggle map"
          className="h-full w-full object-cover"
        />
      </button>
    </div>
  );
};

export default MapToggle;
