function Root() {
  return (
    <div className="flex flex-col gap-1 w-full h-screen items-center justify-center">
      <h1 className="text-7xl text-blue-700">prfx</h1>
      <h2 className="text-2xl">a prefix-based url shortener</h2>
      <p>visit <a href="/about" className="underline hover:text-blue-700">/about</a> to learn more</p>
    </div>
  );
}

export default Root;