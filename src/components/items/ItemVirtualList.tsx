import React, { useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Item } from '../../schemas/item';
import { FileQuestion, ChevronRight } from 'lucide-react';

interface ItemVirtualListProps {
  items: Item[];
  onSelect: (item: Item) => void;
  selectedItemId: string | null;
  emptyText?: string;
}

export const ItemVirtualList: React.FC<ItemVirtualListProps> = ({
  items,
  onSelect,
  selectedItemId,
  emptyText = 'No hay ítems para esta materia.',
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // estimate row height
    overscan: 5,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!items.length) return;
      
      let nextIndex: number | null = null;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = activeIndex === null ? 0 : Math.min(activeIndex + 1, items.length - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = activeIndex === null ? items.length - 1 : Math.max(activeIndex - 1, 0);
      } else if (e.key === 'Enter' && activeIndex !== null) {
        e.preventDefault();
        onSelect(items[activeIndex]);
      }

      if (nextIndex !== null) {
        setActiveIndex(nextIndex);
        rowVirtualizer.scrollToIndex(nextIndex, { align: 'center' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items, onSelect, rowVirtualizer]);

  return (
    <div ref={parentRef} className="h-full w-full overflow-y-auto no-scrollbar" role="listbox">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-text-secondary p-4">
            {emptyText}
          </div>
        ) : (
          rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const item = items[virtualItem.index];
            const isSelected = item.id === selectedItemId;
            const isActive = virtualItem.index === activeIndex;

            return (
              <div
                key={virtualItem.key}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                ref={rowVirtualizer.measureElement}
                data-index={virtualItem.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className={`p-2 ${isActive ? 'ring-2 ring-info rounded-lg' : ''}`}
                onMouseMove={() => setActiveIndex(virtualItem.index)}
              >
                <button
                  onClick={() => {
                    onSelect(item);
                    setActiveIndex(virtualItem.index);
                  }}
                  className={`w-full h-full text-left p-4 rounded-lg flex items-center gap-4 transition-colors ${
                    isSelected ? 'bg-primary/20 border-primary' : 'bg-surface-2 border-border hover:border-primary/50'
                  } border`}
                >
                  <FileQuestion className="h-6 w-6 text-text-secondary flex-shrink-0" />
                  <div className="flex-grow overflow-hidden">
                    <p className="truncate font-medium text-text-primary" dangerouslySetInnerHTML={{ __html: item.statement.replace(/<[^>]*>/g, '').replace(/\$\$.*?\$\$/g, '[Fórmula]') }}></p>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                      <span>{item.type}</span>
                      <span className="w-1 h-1 bg-muted rounded-full"></span>
                      <span>{item.difficulty}</span>
                       <span className="w-1 h-1 bg-muted rounded-full"></span>
                      <span>{item.cognitiveLevel}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-text-secondary flex-shrink-0" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ItemVirtualList;
