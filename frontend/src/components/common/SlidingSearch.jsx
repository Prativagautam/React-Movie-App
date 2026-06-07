import { Search } from "lucide-react";
export function  SlidingSearch({
  value,
  onChange,
  isOpen,
  onOpen,
  onClose,
  placeholder = "Search...",
}) {
  return (
    <div className="relative ml-2">
      {!isOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="px-4 py-3 rounded-full text-center text-sm font-medium border border-white/30 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 hover:scale-105"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Search size={20} className="text-white" />
        </button>
      ) : (
        <div className="flex items-center bg-gray-900/50 border border-white/30 rounded-full overflow-hidden search-slide-in backdrop-blur-sm">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-[250px] px-4 py-2.5 bg-transparent text-white placeholder-gray-400 border-none outline-none"
            autoFocus
            onBlur={() => {
              if (!value) {
                setTimeout(onClose, 150);
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              onChange("");
              onClose();
            }}
            className="px-3 py-2.5 border-none bg-transparent cursor-pointer transition-colors duration-300 hover:bg-white/10"
          >
            <Search size={18} className="text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}
