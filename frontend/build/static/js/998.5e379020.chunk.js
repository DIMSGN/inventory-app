"use strict";(self.webpackChunkinventory_app=self.webpackChunkinventory_app||[]).push([[998],{998:(e,a,s)=>{s.r(a),s.d(a,{default:()=>o});var r=s(43);const i={sidebar:"Sidebar_sidebar__PkV2r",gradientShift:"Sidebar_gradientShift__r8vu2",sidebarContainer:"Sidebar_sidebarContainer__LoN5p",collapsed:"Sidebar_collapsed__Cj6Sz",sidebarHeader:"Sidebar_sidebarHeader__+o-VP",logo:"Sidebar_logo__hQ0rS",logoIcon:"Sidebar_logoIcon__EEOZi",logoSvg:"Sidebar_logoSvg__o0DaC",logoText:"Sidebar_logoText__IzcrJ",toggleButton:"Sidebar_toggleButton__UGZBZ",searchContainer:"Sidebar_searchContainer__iPQM4",searchWrapper:"Sidebar_searchWrapper__Bnh2X",searchIcon:"Sidebar_searchIcon__YyYhg",searchInput:"Sidebar_searchInput__Q5JNC",sidebarNav:"Sidebar_sidebarNav__AvxrV",navList:"Sidebar_navList__XKFJj",navItem:"Sidebar_navItem__EN3FY",navLink:"Sidebar_navLink__PVEC3",active:"Sidebar_active__-7EE0",navIcon:"Sidebar_navIcon__2e9-w",navText:"Sidebar_navText__hdZCM",tooltip:"Sidebar_tooltip__toqBF",sidebarFooter:"Sidebar_sidebarFooter__VqB11",helpLink:"Sidebar_helpLink__YzCU8",helpIcon:"Sidebar_helpIcon__1YNip",userInfo:"Sidebar_userInfo__eS91S",userAvatar:"Sidebar_userAvatar__7e1WI",userData:"Sidebar_userData__VIhj0",userName:"Sidebar_userName__CZZw8",userRole:"Sidebar_userRole__6cgnC",mobileToggle:"Sidebar_mobileToggle__X3xkC",overlay:"Sidebar_overlay__e7RmA",showOverlay:"Sidebar_showOverlay__V1wGN",mobileOpen:"Sidebar_mobileOpen__w-y8C",modalOverlay:"Sidebar_modalOverlay__aiVHq",fadeIn:"Sidebar_fadeIn__3QJlC",helpModal:"Sidebar_helpModal__mIWYB",scaleIn:"Sidebar_scaleIn__68Xy-",closeButton:"Sidebar_closeButton__UnXWl",helpContent:"Sidebar_helpContent__jh2W7",helpSection:"Sidebar_helpSection__kt4i4",helpFooter:"Sidebar_helpFooter__F8zTA",helpCloseButton:"Sidebar_helpCloseButton__qGKDC"};var l=s(774),n=s(579);const o=e=>{let{collapsed:a,onToggle:s,activeItem:o="dashboard",onNavigation:d}=e;const[c,t]=(0,r.useState)(""),[h,_]=(0,r.useState)(!1),[p,x]=(0,r.useState)(!1),b=()=>{x(!1)},j=[{id:"dashboard",icon:(0,n.jsx)(l.$BV,{}),label:"Dashboard"},{id:"products",icon:(0,n.jsx)(l.TXh,{}),label:"Product Inventory"},{id:"economy",icon:(0,n.jsx)(l.YYR,{}),label:"Economy"}].filter((e=>e.label.toLowerCase().includes(c.toLowerCase())));return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("button",{className:i.mobileToggle,onClick:()=>{_(!h)},"aria-label":"Toggle mobile menu",children:(0,n.jsx)(l.OXb,{})}),(0,n.jsxs)("aside",{className:`\n        ${i.sidebar} \n        ${a?i.collapsed:""}\n        ${h?i.mobileOpen:""}\n      `,children:[(0,n.jsxs)("div",{className:i.sidebarContainer,children:[(0,n.jsxs)("div",{className:i.sidebarHeader,children:[(0,n.jsxs)("div",{className:i.logo,children:[(0,n.jsx)("div",{className:i.logoIcon,children:(0,n.jsxs)("svg",{viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg",className:i.logoSvg,children:[(0,n.jsx)("rect",{width:"100",height:"100",fill:"transparent"}),(0,n.jsx)("path",{d:"M33 20C33 20 48 20 55 20C62 20 67 25 67 32C67 39 62 44 55 44C48 44 45 44 45 44L45 56C45 56 48 56 55 56C62 56 67 61 67 68C67 75 62 80 55 80C48 80 33 80 33 80L33 68C33 68 48 68 50 68C52 68 55 66 55 63C55 60 52 58 50 58C48 58 45 58 45 58L45 42C45 42 48 42 50 42C52 42 55 40 55 37C55 34 52 32 50 32C48 32 33 32 33 32L33 20Z",fill:"#9333EA"}),(0,n.jsx)("path",{d:"M43 17C43 17 58 17 65 17C72 17 77 22 77 29C77 36 72 41 65 41C58 41 55 41 55 41L55 53C55 53 58 53 65 53C72 53 77 58 77 65C77 72 72 77 65 77C58 77 43 77 43 77L43 65C43 65 58 65 60 65C62 65 65 63 65 60C65 57 62 55 60 55C58 55 55 55 55 55L55 39C55 39 58 39 60 39C62 39 65 37 65 34C65 31 62 29 60 29C58 29 43 29 43 29L43 17Z",fill:"#7D25F6"})]})}),!a&&(0,n.jsxs)("div",{className:i.logoText,children:[(0,n.jsx)("h1",{children:"Inventory"}),(0,n.jsx)("p",{children:"Management System"})]})]}),(0,n.jsx)("button",{className:i.toggleButton,onClick:s,"aria-label":a?"Expand sidebar":"Collapse sidebar",children:a?(0,n.jsx)(l.FDZ,{}):(0,n.jsx)(l.ed2,{})})]}),!a&&(0,n.jsx)("div",{className:i.searchContainer,children:(0,n.jsxs)("div",{className:i.searchWrapper,children:[(0,n.jsx)(l.KSO,{className:i.searchIcon}),(0,n.jsx)("input",{type:"text",placeholder:"Search menu...",value:c,onChange:e=>t(e.target.value),className:i.searchInput})]})}),(0,n.jsx)("nav",{className:i.sidebarNav,children:(0,n.jsx)("ul",{className:i.navList,children:j.map((e=>(0,n.jsx)("li",{className:`\n                    ${i.navItem} \n                    ${o===e.id?i.active:""}\n                  `,children:(0,n.jsxs)("button",{className:i.navLink,onClick:()=>(e=>{d&&d(e),window.innerWidth<992&&_(!1)})(e.id),"aria-current":o===e.id?"page":void 0,children:[(0,n.jsx)("span",{className:i.navIcon,children:e.icon}),!a&&(0,n.jsx)("span",{className:i.navText,children:e.label}),a&&(0,n.jsx)("span",{className:i.tooltip,children:e.label})]})},e.id)))})}),(0,n.jsxs)("div",{className:i.sidebarFooter,children:[(0,n.jsxs)("button",{className:i.helpLink,onClick:()=>{x(!0)},children:[(0,n.jsx)("span",{className:i.helpIcon,children:(0,n.jsx)(l.gZZ,{})}),!a&&(0,n.jsx)("span",{className:i.helpText,children:"Need Help?"}),a&&(0,n.jsx)("span",{className:i.tooltip,children:"Need Help?"})]}),!a&&(0,n.jsxs)("div",{className:i.userInfo,children:[(0,n.jsx)("div",{className:i.userAvatar,children:(0,n.jsx)("img",{src:"https://ui-avatars.com/api/?name=User&background=random",alt:"User"})}),(0,n.jsxs)("div",{className:i.userData,children:[(0,n.jsx)("p",{className:i.userName,children:"User"}),(0,n.jsx)("p",{className:i.userRole,children:"Administrator"})]})]})]})]}),(0,n.jsx)("div",{className:`${i.overlay} ${h?i.showOverlay:""}`,onClick:()=>_(!1)})]}),p&&(0,n.jsx)("div",{className:i.modalOverlay,onClick:b,children:(0,n.jsxs)("div",{className:i.helpModal,onClick:e=>e.stopPropagation(),children:[(0,n.jsx)("button",{className:i.closeButton,onClick:b,children:"\xd7"}),(0,n.jsx)("h2",{children:"Application Guide"}),(0,n.jsxs)("div",{className:i.helpContent,children:[(0,n.jsxs)("div",{className:i.helpSection,children:[(0,n.jsx)("h3",{children:"Dashboard"}),(0,n.jsx)("p",{children:"Get an overview of your business with key metrics and statistics:"}),(0,n.jsxs)("ul",{children:[(0,n.jsx)("li",{children:"Total inventory value"}),(0,n.jsx)("li",{children:"Low stock alerts"}),(0,n.jsx)("li",{children:"Sales performance"}),(0,n.jsx)("li",{children:"Revenue metrics"})]})]}),(0,n.jsxs)("div",{className:i.helpSection,children:[(0,n.jsx)("h3",{children:"Product Inventory"}),(0,n.jsx)("p",{children:"Manage your product catalog and inventory levels:"}),(0,n.jsxs)("ul",{children:[(0,n.jsxs)("li",{children:[(0,n.jsx)("strong",{children:"Products:"})," Add, edit, and delete products in your inventory"]}),(0,n.jsxs)("li",{children:[(0,n.jsx)("strong",{children:"Categories:"})," Organize products by category for better management"]}),(0,n.jsxs)("li",{children:[(0,n.jsx)("strong",{children:"Rules:"})," Set up alerts for low stock or other inventory conditions"]})]})]}),(0,n.jsxs)("div",{className:i.helpSection,children:[(0,n.jsx)("h3",{children:"Economy"}),(0,n.jsx)("p",{children:"Track your business finances and performance:"}),(0,n.jsxs)("ul",{children:[(0,n.jsxs)("li",{children:[(0,n.jsx)("strong",{children:"Income:"})," Record and analyze revenue streams"]}),(0,n.jsxs)("li",{children:[(0,n.jsx)("strong",{children:"Expenses:"})," Track costs and expenditures"]}),(0,n.jsxs)("li",{children:[(0,n.jsx)("strong",{children:"Reports:"})," Generate financial reports and insights"]})]})]})]}),(0,n.jsx)("div",{className:i.helpFooter,children:(0,n.jsx)("button",{className:i.helpCloseButton,onClick:b,children:"Close Guide"})})]})})]})}}}]);
//# sourceMappingURL=998.5e379020.chunk.js.map