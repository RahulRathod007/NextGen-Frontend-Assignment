'use client';

import { useEffect, useRef, useState } from 'react';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Search({
  value,
  onChange,
  placeholder = 'Search products by title...',
}: SearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onChangeRef.current(inputValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, value]);

  return (
    <div className="relative flex-1">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </span>
      <input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="field pl-11"
        aria-label="Search products"
      />
    </div>
  );
}
