import MovieCard from "./MovieCard"

export function ContentGrid({contentItems, activeTab}){
     return (
    <section>
      <div className="flex flex-wrap gap-6 md:gap-8">
        {contentItems.map((movie) => (
          <div key={movie.id} className="w-[140px] md:w-[180px] flex-shrink-0">
            <MovieCard
              movie={movie}
              contentType={activeTab}
            />
          </div>
        ))}
      </div>
    </section>
  )
}