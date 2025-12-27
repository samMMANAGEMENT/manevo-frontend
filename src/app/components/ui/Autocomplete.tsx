import React, { useEffect, useMemo, useRef, useState } from "react";
import Input from "./Input";

export interface AutocompleteProps<T> {
  items: T[];
  value?: T | null;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onSelect: (item: T) => void;
  getOptionLabel: (item: T) => string;
  renderOptionExtra?: (item: T) => React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyText?: string;
  maxOptions?: number;
}

function Autocomplete<T>({
  items,
  value = null,
  inputValue,
  onInputChange,
  onSelect,
  getOptionLabel,
  renderOptionExtra,
  placeholder = "",
  disabled = false,
  loading = false,
  emptyText = "Sin resultados",
  maxOptions = 20,
}: AutocompleteProps<T>) {
  const [internalInput, setInternalInput] = useState(inputValue ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue !== undefined) {
      setInternalInput(inputValue);
    }
  }, [inputValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.slice(0, maxOptions);
  }, [items, maxOptions]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInternalInput(val);
    onInputChange?.(val);
    setOpen(true);
  }

  function handleSelect(item: T) {
    onSelect(item);
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <Input
        placeholder={placeholder}
        value={internalInput}
        onChange={handleInputChange}
        disabled={disabled || loading}
        onBlur={() => {
          // keep open for click within list; onClickOutside handles close
        }}
        onFocus={() => setOpen(true)}
      />
      {open && !disabled && (
        <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow">
          {loading ? (
            <p className="px-3 py-2 text-sm text-gray-500">Cargando...</p>
          ) : visibleItems.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-500">{emptyText}</p>
          ) : (
            visibleItems.map((item, idx) => {
              const label = getOptionLabel(item) ?? "";
              const selected = value ? getOptionLabel(value) === label : false;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 ${selected ? "bg-gray-50" : ""}`}
                  disabled={disabled}
                >
                  <span className="text-gray-900 truncate">{label}</span>
                  {renderOptionExtra ? (
                    <span className="ml-2 text-xs text-gray-500">{renderOptionExtra(item)}</span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default Autocomplete;
