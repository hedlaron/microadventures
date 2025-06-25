import { Link } from 'react-router-dom';

function AppFooter() {
  return (
    <footer className="flex justify-center">
      <div className="flex max-w-[960px] flex-1 flex-col">
        <div className="flex flex-col gap-6 px-5 py-10 text-center @container">
          <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
            <Link className="text-[#648273] text-base font-normal leading-normal min-w-40" to="/privacy">Privacy Policy</Link>
            <Link className="text-[#648273] text-base font-normal leading-normal min-w-40" to="/terms">Terms of Service</Link>
            <Link className="text-[#648273] text-base font-normal leading-normal min-w-40" to="/contact">Contact Us</Link>
          </div>
          <p className="text-[#648273] text-base font-normal leading-normal">@2024 Microadventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
