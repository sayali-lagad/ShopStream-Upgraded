const Loader = ({ full = false }) => (
  <div className={`flex items-center justify-center ${full ? 'min-h-[60vh]' : 'py-16'}`}>
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-2 border-ink-700" />
      <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  </div>
);

export default Loader;
