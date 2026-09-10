import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

/**
 * Reusable, touch-friendly Searchable Dropdown component
 * Meets accessibility, mobile standards, and dynamic dependency requirements.
 */
const SearchableDropdown = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  disabled = false,
  emptyMessage = 'No matching options found',
  required = false,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    String(opt).toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full text-left" ref={dropdownRef} id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl border text-left font-semibold text-xs md:text-sm flex items-center justify-between transition-all ${
          disabled
            ? 'bg-farmer-bg/60 border-farmer-border text-farmer-secondary/60 cursor-not-allowed opacity-70'
            : isOpen
            ? 'bg-white border-farmer-primary ring-2 ring-farmer-primary/20 text-farmer-text shadow-sm'
            : 'bg-farmer-bg border-farmer-border text-farmer-text hover:border-farmer-primary/50'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`truncate ${!value ? 'text-farmer-secondary font-normal' : 'font-bold text-farmer-text'}`}>
          {value || placeholder}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
              className="p-1 rounded-full text-farmer-secondary hover:text-farmer-error hover:bg-farmer-error-light/50 transition-colors"
              title="Clear"
              aria-label="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-farmer-secondary transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-farmer-primary' : ''
            }`}
          />
        </div>
      </button>

      {/* Hidden input for HTML form validation if required */}
      {required && (
        <input
          type="text"
          value={value}
          required={required}
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Dropdown Popover */}
      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-2xl border border-farmer-border shadow-farmer-card overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          
          {/* Search Box */}
          <div className="p-2.5 border-b border-farmer-border bg-farmer-bg/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-9 pr-8 text-xs md:text-sm font-semibold rounded-xl border border-farmer-border bg-white text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary hover:text-farmer-text p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1.5 divide-y divide-farmer-border/30">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option === value;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full min-h-[44px] px-3 py-2.5 rounded-xl text-left text-xs md:text-sm font-semibold flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-farmer-primary text-white font-bold'
                        : 'text-farmer-text hover:bg-farmer-primary-light hover:text-farmer-primary'
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 px-4 text-center text-xs text-farmer-secondary font-medium">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
