import Link from 'next/link'
import { Menu, MenuItem, ProSidebar, SidebarContent, SidebarFooter, SidebarHeader, SubMenu } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'

const Sidebar = () =>
  <ProSidebar>
    <SidebarHeader>
      <div className="sidebar-header" style={{
        padding: '24px',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: '14px',
        letterSpacing: '1px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        Insurance Management
      </div>
    </SidebarHeader>
    <SidebarContent>
      <Menu iconShape="square">
        <SubMenu title="Clients">
          <MenuItem> <Link href={'/clients/add'}><a>Add Client</a></Link></MenuItem>
          <MenuItem> <Link href={'/clients'}><a>Clients list</a></Link></MenuItem>
        </SubMenu>
        <SubMenu title="Contracts">
          <MenuItem> <Link href={'/contrats/add'}><a>Add Contract</a></Link></MenuItem>
          <MenuItem> <Link href={'/contrats'}><a>Contracts list</a></Link></MenuItem>
        </SubMenu>
      </Menu>
    </SidebarContent>
    <SidebarFooter className={'p-5'}>
      <small style={{padding: '10px'}}>
        💻 @By
        Bahije Salsabil,
        Boukaa Haitam,
        Larhzal Othmane
      </small>
    </SidebarFooter>
  </ProSidebar>

export default Sidebar
