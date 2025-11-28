import React from "react";
import { Outlet } from "react-router";
import NavBar from "./NavBar";
import { MobileSidebar, NavItems } from "componentsCreated";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";

const PageLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar isAdmin={false} />

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default PageLayout;

// import React from 'react'
// import { Outlet } from 'react-router'
// import NavBar from './NavBar'
// import { MobileSidebar, NavItems } from 'componentsCreated'
// import { SidebarComponent } from '@syncfusion/ej2-react-navigations'

// const PageLayout = () => {
//   return (
//     <div className='admin-layout'
//     >
//         <MobileSidebar/>
//          {/* <aside className='hidden lg:flex' >
//             <SidebarComponent width={270} enableGestures={false}>
//                 <NavBar/>
//              </SidebarComponent>
//         </aside>  */}
//         <aside className='children'>
//             <Outlet/>
//         </aside>
//     </div>
//   )
// }

// export default PageLayout
