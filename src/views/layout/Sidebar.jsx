import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from '../layout/sidebardata'; 
import AuthContext from '../../AuthContext'; 
import '../layout/Sidebar.css'; 

const Sidebar = () => {
  const { authState } = useContext(AuthContext);
  const userRole = authState.role; 

  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  const handleMenuClick = (menuValue) => {
    setActiveMenu(activeMenu === menuValue ? null : menuValue);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); 
  };

  const renderMenu = (menu) => {
    if (!menu.roles.includes(userRole)) return null;

    return (
      <div key={menu.menuValue} className="menu-item">
        {menu.hasSubRoute ? (
          <div className="menu-header" onClick={() => handleMenuClick(menu.menuValue)}>
            <i className={menu.icon}></i>
            <span>{menu.menuValue}</span>
            {menu.hasSubRoute && <i className={`arrow ${activeMenu === menu.menuValue ? 'down' : 'right'}`}></i>}
          </div>
        ) : (
          <Link to={menu.route} className="menu-link">
            <div className="menu-header">
              <i className={menu.icon}></i>
              <span>{menu.menuValue}</span>
            </div>
          </Link>
        )}
        {menu.hasSubRoute && activeMenu === menu.menuValue && (
          <div className="sub-menu">
            {menu.subMenus.map((subMenu) => (
              subMenu.roles.includes(userRole) && (
                <div key={subMenu.menuValue} className="sub-menu-item">
                  <Link to={subMenu.route}>{subMenu.menuValue}</Link>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <button className="toggle-btn" onClick={toggleSidebar} style={{color:'#FE8939'}}>
        {isSidebarOpen } 
      </button>
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        {SidebarData.map((section) => (
          section.roles.includes(userRole) && (
            <div key={section.tittle} className="sidebar-section">
              <h3 className="sidebar-title">{section.tittle}</h3>
              {section.menu.map(renderMenu)}
            </div>
          )
        ))}
      </div>
    </>
  );
};

export default Sidebar;
