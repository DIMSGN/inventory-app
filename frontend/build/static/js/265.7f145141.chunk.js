"use strict";(self.webpackChunkinventory_app=self.webpackChunkinventory_app||[]).push([[265],{265:(e,t,o)=>{o.r(t),o.d(t,{default:()=>l});var r=o(43),a=o(416),n=o(276),d=o(580),c=o(529);var s=o(579);const l=e=>{let{onClose:t}=e;const{addProduct:o,addCategory:l,deleteCategory:u,categories:i,products:g}=(0,d.Us)(),[_,m]=(0,r.useState)(""),[y,p]=(0,r.useState)({product_id:null,product_name:"",unit:"",category:"",amount:""}),[h,f]=(0,r.useState)(null),[C,x]=(0,r.useState)(!1),F=(0,r.useRef)(null);(0,r.useEffect)((()=>{if(g&&g.length>=0){const e=(e=>e&&0!==e.length?Math.max(...e.map((e=>"string"===typeof e.product_id?parseInt(e.product_id,10):e.product_id)))+1:1)(g);p((t=>({...t,product_id:e})))}}),[g]),(0,r.useEffect)((()=>{F.current&&F.current.focus()}),[]);const P=e=>{const{name:t,value:o}=e.target;if(console.log(`Form field ${t} changed to: ${o} (type: ${typeof o})`),"category"===t){console.log("Category selected:",o);const e=isNaN(o)?o:parseInt(o,10);console.log("Normalized category value:",e,"(type:",typeof e,")"),p({...y,[t]:e})}else p({...y,[t]:o})};return(0,s.jsxs)("form",{className:a.A.form,onSubmit:async e=>{e.preventDefault(),x(!0);try{if(!y.product_id||!y.product_name||!y.unit||!y.category||""===y.amount)return(0,c.Qg)("All fields are required"),void x(!1);const e={...y,product_id:parseInt(y.product_id,10)};await o(e)&&t()}catch(r){console.error("Error submitting form:",r),(0,c.Qg)(r.message||"Failed to add product")}finally{x(!1)}},children:[(0,s.jsx)("h2",{className:a.A.heading,children:"Product Manager"}),(0,s.jsxs)("label",{children:["Product ID:",(0,s.jsx)("input",{type:"text",name:"product_id",value:y.product_id?`#${j=y.product_id,j.toString().padStart(4,"0")}`:"",readOnly:!0,className:a.A.generatedField}),(0,s.jsx)("small",{className:a.A.fieldNote,children:"Auto-generated sequential ID"})]}),(0,s.jsxs)("label",{children:["Product Name:",(0,s.jsx)("input",{type:"text",name:"product_name",value:y.product_name,onChange:P,ref:F,required:!0})]}),(0,s.jsxs)("label",{children:["Unit:",(0,s.jsx)("input",{type:"text",name:"unit",value:y.unit,onChange:P,required:!0})]}),(0,s.jsxs)("label",{children:["Category:",(0,s.jsxs)("select",{name:"category",value:y.category,onChange:P,required:!0,children:[(0,s.jsx)("option",{value:"",children:"Select a category"}),i.map(((e,t)=>(0,s.jsx)("option",{value:"object"===typeof e?e.id:e,children:"object"===typeof e?e.name:e},t)))]})]}),(0,s.jsxs)("div",{className:a.A.categorySection,children:[(0,s.jsxs)("div",{className:a.A.newCategoryInput,children:[(0,s.jsx)("input",{type:"text",placeholder:"New category name",value:_,onChange:e=>m(e.target.value)}),(0,s.jsx)(n.A,{type:"button",onClick:async()=>{if(_.trim())if(i.includes(_.trim()))(0,c.Qg)("Category already exists");else try{await l(_),m("")}catch(e){console.error("Error adding category:",e),(0,c.Qg)(e.message||"Failed to add category")}else(0,c.Qg)("Category name cannot be empty")},variant:"success",icon:"fas fa-plus",children:"Add Category"})]}),(0,s.jsxs)("div",{className:a.A.deleteCategoryInput,children:[(0,s.jsxs)("select",{value:h||"",onChange:e=>f(e.target.value),children:[(0,s.jsx)("option",{value:"",children:"Select a category to delete"}),i.map(((e,t)=>(0,s.jsx)("option",{value:"object"===typeof e?e.id:e,children:"object"===typeof e?e.name:e},t)))]}),(0,s.jsx)(n.A,{type:"button",onClick:async()=>{if(h)try{await u(h),f(null),y.category===h&&p({...y,category:""})}catch(e){console.error("Error deleting category:",e),(0,c.Qg)(e.message||"Failed to delete category")}else(0,c.Qg)("Please select a category to delete")},variant:"delete",icon:"fas fa-trash-alt",children:"Delete Category"})]})]}),(0,s.jsxs)("label",{children:["Amount:",(0,s.jsx)("input",{type:"number",name:"amount",value:y.amount,onChange:P,required:!0})]}),(0,s.jsxs)("div",{className:a.A.buttonGroup,children:[(0,s.jsx)(n.A,{type:"submit",variant:"success",icon:"fas fa-save",disabled:C,children:C?"Adding...":"Add Product"}),(0,s.jsx)(n.A,{type:"button",onClick:t,variant:"secondary",disabled:C,icon:"fas fa-times",children:"Cancel"})]})]});var j}},416:(e,t,o)=>{o.d(t,{A:()=>r});const r={form:"ProductForm_form__2eyCa",heading:"ProductForm_heading__NA0ph",generatedField:"ProductForm_generatedField__9VTzt",fieldNote:"ProductForm_fieldNote__1MS8-",newCategoryInput:"ProductForm_newCategoryInput__lIdil",deleteCategoryInput:"ProductForm_deleteCategoryInput__IIZiA",categorySection:"ProductForm_categorySection__yH2V+",buttonGroup:"ProductForm_buttonGroup__Q+LmU",customDropdown:"ProductForm_customDropdown__nFLPj",selectedCategory:"ProductForm_selectedCategory__LPaC+",dropdownMenu:"ProductForm_dropdownMenu__VpjEr",dropdownItem:"ProductForm_dropdownItem__VkJb6",categoryName:"ProductForm_categoryName__ohrn8",deleteButton:"ProductForm_deleteButton__L7lFs",addNewCategory:"ProductForm_addNewCategory__7EpW5",addCategoryButton:"ProductForm_addCategoryButton__yE3NN",noCategories:"ProductForm_noCategories__D7dwo",categoryContainer:"ProductForm_categoryContainer__pTazC",categoryEditSection:"ProductForm_categoryEditSection__Rpx2O",helpText:"ProductForm_helpText__fBG5t",warningText:"ProductForm_warningText__P8DAq",categoryList:"ProductForm_categoryList__T7+n8",categoryItem:"ProductForm_categoryItem__7x0wS",categoryEditForm:"ProductForm_categoryEditForm__Wkt+4",editCategoryInput:"ProductForm_editCategoryInput__Vm+En",categoryEditButtons:"ProductForm_categoryEditButtons__+cDWB"}}}]);
//# sourceMappingURL=265.7f145141.chunk.js.map