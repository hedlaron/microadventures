import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-1 justify-end gap-8">
      <div className="flex items-center gap-9">
        <Link className="text-[#121714] text-sm font-medium leading-normal" to="/explore">Explore</Link>
        <Link className="text-[#121714] text-sm font-medium leading-normal" to="/about">About</Link>
        <Link className="text-[#121714] text-sm font-medium leading-normal" to="/contact">Contact</Link>
      </div>
      <div className="flex gap-2">
        <button
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#fbfdfc] text-[#121714] text-sm font-bold leading-normal tracking-[0.015em]"
          onClick={() => navigate('/signup')}
        >
          <span className="truncate">Sign Up</span>
        </button>
        <button
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#ebefed] text-[#121714] text-sm font-bold leading-normal tracking-[0.015em]"
          onClick={() => navigate('/login')}
        >
          <span className="truncate">Log In</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
