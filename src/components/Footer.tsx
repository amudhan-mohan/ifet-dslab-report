export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-auto border-t border-slate-200 bg-slate-50 py-6 text-center"
      role="contentinfo"
    >
      <p className="text-sm font-medium text-slate-600">
        Developed by{' '}
        <span className="font-semibold text-[#1e3a5f]">Annamalai University</span>
        {' '} for <span className="font-semibold text-[#1e3a5f]">IFET College of Engineering</span>
      </p>
      <p className="mt-1 text-xs text-slate-400">
        &copy; {year} Annamalai University. All rights reserved.
      </p>
    </footer>
  );
}
