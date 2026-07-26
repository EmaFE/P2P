import { ScrollArea } from './ui/scroll-area'
import React from 'react'
import { cn } from '@/lib/utils'

const FilterSortSideBar = ({ filterOptions, sortOptions, selectedFilters, selectedSort, changeFilters, changeSort}) =>{

  return(
    <aside className='bg-pink-800 sticky top-72 h-[450px] w-64 border flex-shrink-0 rounded-lg md:mr-25 lg:mr-45 p-4 hidden md:block lg:block'>
      <div className='space-y-6'>
        <div>
          <h3 className='text-white text-sm font-bold uppercase mb-3'>
            Filter by
          </h3>
          <ScrollArea className="h-40">
            <div className='space-y-1 pr-4'>
              {filterOptions.map((option) =>{
                const isSelected = selectedFilters.includes(option)
                return <button
                  key={option}
                  onClick={() => changeFilters(option)}
                  className={cn("w-full text-white text-left px-3 py-2 rounded-xl text-sm transition-colors w-35 hover:cursor-pointer hover:bg-white/90 hover:text-[var(--color-six)]", isSelected && "bg-white/70 text-[var(--color-six)]"
                  )}
                >
                  {option}
                </button>
              })}
            </div>
          </ScrollArea>
        </div>

        <div>
          <h3 className='text-sm font-bold uppercase mb-3 text-white'>
            Sort by
          </h3>
          <ScrollArea className="h-40">
            <div className='space-y-1 pr-4'>
              {sortOptions.map((option) =>{
                const isSelected = selectedSort.includes(option)
                return <button
                  key={option}
                  onClick={() => changeSort(option)}
                  className={cn("w-full text-white text-left px-3 py-2 rounded-xl text-sm transition-colors w-35 hover:cursor-pointer hover:bg-white/90 hover:text-[var(--color-six)]", isSelected && "bg-white/70 text-[var(--color-six)]"
                  )}
                >
                  {option}
                </button>
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </aside>
  )
}

export default FilterSortSideBar