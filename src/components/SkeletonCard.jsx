function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
      <div className="h-4 w-16 bg-white/10 rounded-full mb-4"></div>
      <div className="h-5 w-32 bg-white/10 rounded-lg mb-2"></div>
      <div className="h-4 w-24 bg-white/10 rounded-lg mb-5"></div>
      <div className="border-t border-white/10 pt-4 flex justify-between">
        <div className="h-5 w-20 bg-white/10 rounded-lg"></div>
        <div className="h-5 w-16 bg-white/10 rounded-full"></div>
      </div>
    </div>
  )
}

export default SkeletonCard