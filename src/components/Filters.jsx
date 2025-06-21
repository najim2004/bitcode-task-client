function Filters({
  category,
  setCategory,
  status,
  setStatus,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="sticky top-0 bg-white shadow-sm rounded-lg p-4 mb-6 z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <select
            className="w-full p-2 border border-gray-200 rounded-lg appearance-none bg-white cursor-pointer !rounded-button"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="feature">Feature</option>
            <option value="bug">Bug</option>
            <option value="enhancement">Enhancement</option>
          </select>
          <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <div className="relative">
          <select
            className="w-full p-2 border border-gray-200 rounded-lg appearance-none bg-white cursor-pointer !rounded-button"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <div className="relative">
          <select
            className="w-full p-2 border border-gray-200 rounded-lg appearance-none bg-white cursor-pointer !rounded-button"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>
          <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>
  );
}

export default Filters;
