import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Nav = ({links =[]}) => {

  return (
    <nav className='flex bg-theme flex-col h-full py-4 px-2 gap-4 side_nav'>
      {links.map(({to, icon, label}) =>(
        <NavLink to={to} className='flex p-[.75rem] pe-[3rem] text-[#e1e1e183] gap-[.5rem] items-center rounded-[.5rem] transition-all' end>
          <FontAwesomeIcon icon={icon} className='block'/><span>{label}</span>
        </NavLink>))}
    </nav>
  )
}

export default Nav;