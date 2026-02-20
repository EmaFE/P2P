import { ScrollArea } from './ui/scroll-area'
import React from 'react'
import { cn } from '@/lib/utils'

const FilterSortSideBar = ({ filterOptions, sortOptions, selectedFilters, selectedSort, changeFilters, changeSort}) =>{

  return(
    <aside className='sticky top-72 h-[400px] w-64 border bg-slate-200 flex-shrink-0 rounded-lg mr-20 p-4 hidden lg:block'>
      <div className='space-y-6'>
        <div>
          <h3 className='text-sm font-bold uppercase tracking-wide mb-3'>
            Filter by
          </h3>
          <ScrollArea className="h-40">
            <div className='space-y-1 pr-4'>
              {filterOptions.map((option) =>{
                const isSelected = selectedFilters.includes(option)
                return <button
                  key={option}
                  onClick={() => changeFilters(option)}
                  className={cn("w-full text-left px-3 py-2 rounded-xl text-sm transition-colors w-35 hover:bg-slate-200 hover:text-pink-800", isSelected && "bg-slate-200 text-pink-800"
                  )}
                >
                  {option}
                </button>
              })}
            </div>
          </ScrollArea>
        </div>

        <div>
          <h3 className='text-sm font-bold uppercase tracking-wide mb-3'>
            Sort by
          </h3>
          <ScrollArea className="h-40">
            <div className='space-y-1 pr-4'>
              {sortOptions.map((option) =>{
                const isSelected = selectedSort.includes(option)
                return <button
                  key={option}
                  onClick={() => changeSort(option)}
                  className={cn("w-full text-left px-3 py-2 rounded-md text-sm transition-colors", isSelected && "bg-slate-200 text-pink-800"
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