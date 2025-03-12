import { Bell } from 'lucide-react';
import UserProfile from '../UserProfile';
import Dropdown from '../Dropdown';

const Navbar = () => (
    <div className=" text-textblack py-5 pr-4 flex justify-between items-center">
      <div className="flex flex-col">
        <h2 className="text-navheader font-bold -mb-2">Admin Dashboard</h2>
        <p className="text-textgray text-[16px]">Manage Your Restaurant and Get More Returning Customers.</p>
      </div>
      <div className='flex items-center gap-4'>
        {/* <div className='bg-slate-100 py-2 px-3 rounded-md'>
          <Bell />
        </div> */}
        <div>
          <UserProfile />
        </div>
      </div>
    </div>
  );
  
  export default Navbar;

  