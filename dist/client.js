window.__ModuleLoader__.load({id:"@local/dsh-pi-login",factory(require){const module={exports:{}};const exports=module.exports;
var Ee=Object.defineProperty;var vt=Object.getOwnPropertyDescriptor;var bt=Object.getOwnPropertyNames;var kt=Object.prototype.hasOwnProperty;var xt=(e,r)=>{for(var o in r)Ee(e,o,{get:r[o],enumerable:!0})},It=(e,r,o,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of bt(r))!kt.call(e,s)&&s!==o&&Ee(e,s,{get:()=>r[s],enumerable:!(n=vt(r,s))||n.enumerable});return e};var Mt=e=>It(Ee({},"__esModule",{value:!0}),e);var Qt={};xt(Qt,{ConnectionUI:()=>wt,UpdateUI:()=>Ct,apply:()=>Gt,inject:()=>Vt});module.exports=Mt(Qt);var a=require("react");var Je=require("react");function Ye(e){var r,o,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var s=e.length;for(r=0;r<s;r++)e[r]&&(o=Ye(e[r]))&&(n&&(n+=" "),n+=o)}else for(o in e)e[o]&&(n&&(n+=" "),n+=o);return n}function _t(){for(var e,r,o=0,n="",s=arguments.length;o<s;o++)(e=arguments[o])&&(r=Ye(e))&&(n&&(n+=" "),n+=r);return n}var R=_t;var ke={button:"dshpi_13ed0003_button",md:"dshpi_13ed0003_md",sm:"dshpi_13ed0003_sm",primary:"dshpi_13ed0003_primary",ghost:"dshpi_13ed0003_ghost",outline:"dshpi_13ed0003_outline",toolbar:"dshpi_13ed0003_toolbar",icon:"dshpi_13ed0003_icon"};var _e=require("react/jsx-runtime"),I=(0,Je.forwardRef)(function({variant:r="ghost",size:o="md",icon:n,className:s,children:l,...m},f){return(0,_e.jsxs)("button",{ref:f,type:"button",className:R(ke.button,ke[r],ke[o],s),...m,children:[n!=null&&(0,_e.jsx)("span",{className:ke.icon,children:n}),l]})});var Xe=require("react");var ye={wrap:"dshpi_fda332f6_wrap",icon:"dshpi_fda332f6_icon",input:"dshpi_fda332f6_input"};var xe=require("react/jsx-runtime"),te=(0,Xe.forwardRef)(function({icon:r,className:o,...n},s){return(0,xe.jsxs)("span",{className:R(ye.wrap,o),children:[r!=null&&(0,xe.jsx)("span",{className:ye.icon,children:r}),(0,xe.jsx)("input",{ref:s,className:ye.input,...n})]})});var Be={switch:"dshpi_7ae83aee_switch",thumb:"dshpi_7ae83aee_thumb"};var Te=require("react/jsx-runtime");function Ie({checked:e,onChange:r,label:o,disabled:n=!1,title:s,className:l}){return(0,Te.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":o,title:s,disabled:n,className:R(Be.switch,l),onClick:()=>{r(!e)},children:(0,Te.jsx)("span",{className:Be.thumb})})}var T=require("react"),dt=require("react-dom");var yt=require("react");var ze=require("react/jsx-runtime");var V=require("react/jsx-runtime");var Le=1;var Lt=({size:e=16,className:r,strokeWidth:o})=>(0,V.jsxs)("svg",{width:e,height:e,className:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,V.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,V.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),Pe=e=>(0,V.jsx)(Lt,{...e,strokeWidth:Le});var Pt=({size:e=16,className:r,strokeWidth:o})=>(0,V.jsx)("svg",{width:e,height:e,className:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:(0,V.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),We=e=>(0,V.jsx)(Pt,{...e,strokeWidth:Le});var Wt=({size:e=14,className:r,strokeWidth:o})=>(0,V.jsx)("svg",{width:e,height:e,className:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:(0,V.jsx)("path",{d:"M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6",stroke:"currentColor"})}),Ve=e=>(0,V.jsx)(Wt,{...e,strokeWidth:Le});var Ot=({size:e=16,className:r,strokeWidth:o})=>(0,V.jsxs)("svg",{width:e,height:e,className:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,V.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,V.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),et=e=>(0,V.jsx)(Ot,{...e,strokeWidth:Le});function tt(e){let r=document.documentElement,o=Number.parseFloat(getComputedStyle(r).getPropertyValue("--dsh-frame-top-clearance"));return Number.isNaN(o)?e:Math.max(e,(r.hasAttribute("data-fullscreen")?0:o)+20)}var oe=require("react"),Nt=200;function ot(e){let r=(0,oe.useRef)(null),o=(0,oe.useRef)(e);o.current=e;let n=(0,oe.useCallback)(()=>{r.current!==null&&(clearTimeout(r.current),r.current=null)},[]),s=(0,oe.useCallback)(()=>{n(),r.current=setTimeout(()=>{r.current=null,o.current()},Nt)},[n]);return(0,oe.useEffect)(()=>n,[n]),{arm:s,cancel:n}}var Se=require("react");function Oe(e){let r=!1,o=!1,n=()=>{r=!0},s=()=>{r=!1,o=!0},l=()=>{o=!1},m=()=>{r=!1,o=!1};return e.addEventListener("compositionstart",n,!0),e.addEventListener("compositionend",s,!0),e.addEventListener("keyup",l,!0),e.defaultView?.addEventListener("blur",m),{guards:f=>{let u=r||o||f.isComposing||f.keyCode===229;return o=!1,u},dispose:()=>{e.removeEventListener("compositionstart",n,!0),e.removeEventListener("compositionend",s,!0),e.removeEventListener("keyup",l,!0),e.defaultView?.removeEventListener("blur",m)}}}var De=new WeakMap,St=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function me(e,r){De.get(e)?.();let o=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",o),e.removeEventListener("keydown",n,!0),De.delete(e)},n=s=>{!s.isComposing&&!s.ctrlKey&&!s.altKey&&!s.metaKey&&St.has(s.key)&&o()};De.set(e,o),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",o),e.addEventListener("keydown",n,!0),e.focus(r),e.matches(":focus")||o()}var Ne=new WeakMap;function rt(e){if(e===null)return!1;let r=Ne.get(e.ownerDocument)?.at(-1);return r!==void 0&&!r.element.contains(e)}var nt='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function st(e,r,o){let n=(0,Se.useRef)(o);n.current=o,(0,Se.useLayoutEffect)(()=>{let s=e.current;if(!r||s===null)return;let l=s.ownerDocument,m=Oe(l),f=l.activeElement,u=Ne.get(l)??[];Ne.set(l,u);let h={element:s,close:()=>{n.current()}};u.push(h);let M=s.querySelector("[data-modal-autofocus]")??s.querySelector(nt)??s;s.contains(l.activeElement)||me(M);let w=i=>{let b=m.guards(i);if(u.at(-1)!==h||i.defaultPrevented||b||i.ctrlKey||i.altKey||i.metaKey||(i.key==="Escape"&&!i.shiftKey&&(i.preventDefault(),i.repeat||n.current()),i.key!=="Tab")||l.activeElement?.closest('[role="menu"]'))return;let _=[...s.querySelectorAll(nt)].filter(S=>!S.closest("[inert], [hidden]")),k=_[0]??s,W=_.at(-1)??s,N=i.shiftKey?l.activeElement===k:l.activeElement===W;(l.activeElement===s||!s.contains(l.activeElement)||N)&&(i.preventDefault(),(i.shiftKey?W:k).focus())};return l.addEventListener("keydown",w),()=>{m.dispose();let i=u.at(-1)===h;if(u.splice(u.indexOf(h),1),l.removeEventListener("keydown",w),u.length===0&&Ne.delete(l),i){let b=f instanceof HTMLElement&&f.isConnected?f:u.at(-1)?.element;b!==void 0&&me(b)}}},[e,r])}var fe={keys:"dshpi_042ff8c4_keys",key:"dshpi_042ff8c4_key",tooltip:"dshpi_042ff8c4_tooltip",separator:"dshpi_042ff8c4_separator",joined:"dshpi_042ff8c4_joined"};var Fe=require("react/jsx-runtime");function Ze({keys:e,variant:r="plain",className:o}){return(0,Fe.jsx)("span",{className:R(fe.keys,r==="tooltip"&&fe.tooltip,r==="tooltip"&&e.includes("+")&&fe.joined,o),children:e.map((n,s)=>(0,Fe.jsx)("kbd",{className:n==="+"?fe.separator:fe.key,children:n},s))})}var re=require("react"),it=require("react-dom");var Ce={surface:"dshpi_a00a35bd_surface",backing:"dshpi_a00a35bd_backing",compact:"dshpi_a00a35bd_compact",material:"dshpi_a00a35bd_material"};var ne=require("react/jsx-runtime"),Ue=(0,re.forwardRef)(function({compact:r=!1,className:o,style:n,children:s,...l},m){let f=(0,re.useId)(),u=(0,re.useRef)(null);(0,re.useLayoutEffect)(()=>{document.body.appendChild(u.current)},[]);let h={"--dsh-menu-anchor":`--dsh-menu-${f.replaceAll(":","")}`};return(0,ne.jsxs)(ne.Fragment,{children:[(0,ne.jsxs)("div",{...l,ref:m,"data-menu-material":"translucent",className:R(Ce.surface,r&&Ce.compact,o),style:{...n,...h},children:[(0,ne.jsx)("div",{"aria-hidden":"true",className:Ce.material}),s]}),(0,it.createPortal)((0,ne.jsx)("div",{ref:u,"aria-hidden":"true","data-menu-backing":"",className:R(Ce.backing,r&&Ce.compact),style:{...h,visibility:n?.visibility}}),document.body)]})});var P={root:"dshpi_1911279a_root",list:"dshpi_1911279a_list",submenu:"dshpi_1911279a_submenu",scrollable:"dshpi_1911279a_scrollable",viewport:"dshpi_1911279a_viewport",css:"dshpi_1911279a_css",portal:"dshpi_1911279a_portal",sideTop:"dshpi_1911279a_sideTop",alignEnd:"dshpi_1911279a_alignEnd",tsx:"dshpi_1911279a_tsx",footer:"dshpi_1911279a_footer",separator:"dshpi_1911279a_separator",itemWrap:"dshpi_1911279a_itemWrap",item:"dshpi_1911279a_item",denseList:"dshpi_1911279a_denseList",label:"dshpi_1911279a_label",compactList:"dshpi_1911279a_compactList",itemIcon:"dshpi_1911279a_itemIcon",check:"dshpi_1911279a_check",itemLabel:"dshpi_1911279a_itemLabel",shortcut:"dshpi_1911279a_shortcut",shortcutKeys:"dshpi_1911279a_shortcutKeys",selected:"dshpi_1911279a_selected",selectedFill:"dshpi_1911279a_selectedFill",danger:"dshpi_1911279a_danger"};var A=require("react/jsx-runtime");function at(e){return"type"in e&&e.type==="separator"}function lt(e){return"type"in e&&e.type==="label"}var Rt={visibility:"hidden",left:0,top:0};function qe({open:e,anchor:r,items:o=[],children:n,selectedId:s,selectedIds:l,onSelect:m,onClose:f,align:u="start",side:h="bottom",portal:M=!1,closeOnPointerLeave:w=!1,dense:i=!1,compact:b=!1,autoFocus:_=!1,selection:k="check",getAnchorRect:W,footer:N,className:S,listClassName:U}){let g=(0,T.useRef)(null),p=(0,T.useRef)(null),x=(0,T.useRef)(null),H=(0,T.useRef)(null),C=(0,T.useRef)(!1),v=(c=!1)=>{let d=H.current,F=d!==null&&document.contains(d)&&!d.disabled?d:g.current?.querySelector("button:not(:disabled)");F!=null&&(c?F.focus():me(F))},O=()=>{let c=C.current;queueMicrotask(()=>{if(y.current)return;let d=document.activeElement;(d===null||d===document.body||p.current?.contains(d)===!0)&&v(c)})},y=(0,T.useRef)(e);y.current=e;let[J,K]=(0,T.useState)(null),[j,ie]=(0,T.useState)(null),{arm:pe,cancel:z}=ot(f);(0,T.useLayoutEffect)(()=>{if(!e||!M){ie(null);return}let c=()=>{let B;if(W!==void 0?B=W():B=g.current?.getBoundingClientRect()??null,B===null)return;let E=12,ue=window.innerWidth,L=window.innerHeight,X=p.current,he=X?.offsetWidth??0,ee=X?.offsetHeight??0,Y,Z;h==="right"?(Y=B.right+4,Z=B.top):u==="start"?(Y=B.left,Z=h==="bottom"?B.bottom+4:B.top-ee-4):(Y=B.right-he,Z=h==="bottom"?B.bottom+4:B.top-ee-4),he>0&&(Y=Math.min(Math.max(Y,E),ue-he-E)),ee>0&&(Z=Math.min(Math.max(Z,tt(E)),L-ee-E)),ie(ge=>ge?.left===Y&&ge.top===Z?ge:{left:Y,top:Z})};c();let d=()=>{c(),F=requestAnimationFrame(d)},F=requestAnimationFrame(d);return window.addEventListener("scroll",c,!0),window.addEventListener("resize",c),()=>{cancelAnimationFrame(F),window.removeEventListener("scroll",c,!0),window.removeEventListener("resize",c)}},[e,M,u,h,W]),(0,T.useEffect)(()=>{if(!e){H.current=null;return}let c=document.activeElement;H.current=c instanceof HTMLElement&&g.current?.contains(c)===!0?c:null},[e]),(0,T.useEffect)(()=>{if(!e||!_)return;let c=p.current?.querySelector("button:not(:disabled)");x.current=c==null?null:0,c!=null&&me(c)},[e,_]),(0,T.useEffect)(()=>{if(!e){K(null),x.current=null;return}let c=Oe(document),d=L=>{L.target instanceof Node&&g.current?.contains(L.target)!==!0&&p.current?.contains(L.target)!==!0&&f()},F=L=>{if(c.guards(L)||rt(g.current)||L.defaultPrevented||L.ctrlKey||L.altKey||L.metaKey)return;let X=document.activeElement,he=p.current?.contains(X)===!0,ee=g.current?.contains(X)===!0||he;if(L.key==="Escape"&&!L.shiftKey){if(L.preventDefault(),L.repeat)return;f(),(ee||_)&&v()}if(L.key==="Tab"){let Ge=p.current;if(Ge===null||!ee)return;if(L.shiftKey){L.preventDefault(),f(),v(!0);return}if(he){if(X instanceof Element&&X.getAttribute("role")==="menuitem"){L.preventDefault(),C.current=!0;try{X.click()}finally{C.current=!1}}return}let Qe=Ge.querySelector("button:not(:disabled)");if(Qe===null)return;L.preventDefault(),Qe.focus(),x.current=0;return}if(!["ArrowDown","ArrowUp","Home","End"].includes(L.key))return;let Y=p.current;if(Y===null||!ee)return;let Z=Array.from(Y.querySelectorAll("button:not(:disabled)"));if(Z.length===0)return;let ge=Z.indexOf(X),Ke=ge>=0?ge:x.current,je=L.key==="Home"?0:L.key==="End"?Z.length-1:Ke===null?L.key==="ArrowDown"?0:Z.length-1:(Ke+(L.key==="ArrowDown"?1:-1)+Z.length)%Z.length;L.preventDefault(),x.current=je,Z[je]?.focus()},B=()=>{document.activeElement instanceof HTMLIFrameElement&&f()};document.addEventListener("pointerdown",d);let E=L=>{L.key==="Escape"&&F(L)},ue=L=>{L.key!=="Escape"&&F(L)};return document.addEventListener("keydown",ue),document.addEventListener("keydown",E,!0),window.addEventListener("blur",B),()=>{c.dispose(),document.removeEventListener("pointerdown",d),document.removeEventListener("keydown",ue),document.removeEventListener("keydown",E,!0),window.removeEventListener("blur",B)}},[e,f,_]),(0,T.useEffect)(()=>{e||z()},[e,z]);let ve=!o.some(c=>!at(c)&&!lt(c)&&c.submenu!==void 0&&c.submenu.length>0),q=c=>{if(at(c))return(0,A.jsx)("div",{className:P.separator,role:"separator"},c.id);if(lt(c))return(0,A.jsx)("div",{className:P.label,role:"presentation",children:c.text},c.id);let d=c.submenu!==void 0&&c.submenu.length>0,F=d&&J===c.id,B=c.id===s||l?.includes(c.id)===!0;return(0,A.jsxs)("div",{className:P.itemWrap,onMouseEnter:d?()=>{K(c.id)}:void 0,onMouseLeave:()=>{K(null)},children:[(0,A.jsxs)("button",{type:"button",role:"menuitem",className:R(P.item,B&&(k==="fill"?P.selectedFill:P.selected),c.danger===!0&&P.danger),disabled:c.disabled,"aria-keyshortcuts":c.shortcut?.aria,"aria-haspopup":d?"menu":void 0,"aria-expanded":d?F:void 0,onFocus:d?()=>{K(c.id)}:void 0,onClick:()=>{if(d){K(c.id);return}m?.(c.id)},children:[c.icon!==void 0&&(0,A.jsx)("span",{className:P.itemIcon,children:c.icon}),(0,A.jsx)("span",{className:P.itemLabel,children:c.label}),c.shortcut!==void 0&&(0,A.jsx)("span",{"aria-hidden":"true",className:P.shortcut,children:(0,A.jsx)(Ze,{keys:c.shortcut.keys,className:P.shortcutKeys})}),B&&k==="check"&&(0,A.jsx)(We,{className:P.check})]}),F&&c.submenu!==void 0&&(0,A.jsx)(Ue,{compact:b,className:R(P.submenu,b&&P.compactList),role:"menu",children:c.submenu.map(E=>(0,A.jsxs)("button",{type:"button",role:"menuitem",className:P.item,disabled:E.disabled,"aria-keyshortcuts":E.shortcut?.aria,onClick:()=>{m?.(E.id),O()},children:[E.icon!==void 0&&(0,A.jsx)("span",{className:P.itemIcon,children:E.icon}),(0,A.jsx)("span",{className:P.itemLabel,children:E.label}),E.shortcut!==void 0&&(0,A.jsx)("span",{"aria-hidden":"true",className:P.shortcut,children:(0,A.jsx)(Ze,{keys:E.shortcut.keys,className:P.shortcutKeys})})]},E.id))})]},c.id)},ae=c=>{let d=c.target instanceof Element?c.target.closest('button[role="menuitem"]'):null;d===null||d.getAttribute("aria-haspopup")==="menu"||d.closest('[role="menu"]')===c.currentTarget&&K(null)},be=e&&(0,A.jsxs)(Ue,{compact:b,ref:p,className:R(P.list,U,i&&P.denseList,b&&P.compactList,ve&&P.scrollable,M&&P.portal,h==="top"&&!M&&P.sideTop,u==="end"&&!M&&P.alignEnd),style:M?j??Rt:void 0,role:"menu",onClick:c=>{c.stopPropagation();let d=c.target instanceof Element?c.target.closest('button[role="menuitem"]'):null;d!==null&&d.getAttribute("aria-haspopup")!=="menu"&&O()},onMouseOver:ae,onFocus:ae,children:[(0,A.jsxs)("div",{className:P.viewport,role:"presentation",children:[o.map(q),n]}),N!==void 0&&N.length>0&&(0,A.jsx)("div",{className:P.footer,role:"presentation",children:N.map(q)})]});return(0,A.jsxs)("span",{ref:g,className:R(P.root,S),onPointerEnter:w?z:void 0,onPointerLeave:w?()=>{e&&pe()}:void 0,children:[r,M?be!==!1&&(0,dt.createPortal)(be,document.body):be]})}var ct=require("react"),pt=require("react-dom");var G={root:"dshpi_b97756f9_root",mask:"dshpi_b97756f9_mask",dialog:"dshpi_b97756f9_dialog",content:"dshpi_b97756f9_content",header:"dshpi_b97756f9_header",title:"dshpi_b97756f9_title",close:"dshpi_b97756f9_close",description:"dshpi_b97756f9_description",body:"dshpi_b97756f9_body",footer:"dshpi_b97756f9_footer"};var D=require("react/jsx-runtime");function le({open:e,onClose:r,title:o,closeLabel:n,description:s,children:l,footer:m,className:f,contentClassName:u,onKeyDownCapture:h,headless:M=!1,backdropBlur:w=!0,shortcutModal:i}){let b=(0,ct.useRef)(null);return st(b,e,r),e?(0,pt.createPortal)((0,D.jsxs)("div",{className:G.root,role:"presentation",onKeyDownCapture:h,children:[(0,D.jsx)("div",{className:G.mask,style:w?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:r}),(0,D.jsx)("div",{ref:b,tabIndex:-1,"data-shortcut-modal":i,className:R(G.dialog,f),role:"dialog","aria-modal":"true","aria-label":o,children:M?l:(0,D.jsxs)(D.Fragment,{children:[(0,D.jsxs)("div",{className:R(G.content,u),children:[(0,D.jsxs)("div",{className:G.header,children:[(0,D.jsx)("h2",{className:G.title,children:o}),(0,D.jsx)("button",{type:"button",className:G.close,"aria-label":n,onClick:r,children:(0,D.jsx)(et,{size:14})})]}),s!==void 0&&s!==""&&(0,D.jsx)("p",{className:G.description,children:s}),l!==void 0&&(0,D.jsx)("div",{className:G.body,children:l})]}),m!==void 0&&(0,D.jsx)("div",{className:G.footer,children:m})]})})]}),document.body):null}var de={dot:"dshpi_34138a6f_dot",spinner:"dshpi_34138a6f_spinner",spinnerMotion:"dshpi_34138a6f_spinnerMotion",spinnerTrack:"dshpi_34138a6f_spinnerTrack",spinnerArc:"dshpi_34138a6f_spinnerArc",step:"dshpi_34138a6f_step"};var se=require("react/jsx-runtime");function At(e){e!==null&&(ut(e),e.addEventListener("animationstart",()=>{ut(e)}))}function ut(e){let r=e;for(let o of r.getAnimations?.({subtree:!0})??[])o.startTime=0}function $e({state:e,size:r,className:o,appearance:n="dot"}){let s=r??(e==="ongoing"?14:10);return e==="ongoing"?(0,se.jsx)("svg",{ref:At,className:R(de.spinner,o),"data-state":"ongoing",width:s,height:s,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,se.jsxs)("g",{className:de.spinnerMotion,children:[(0,se.jsx)("circle",{className:de.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,se.jsx)("circle",{className:de.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,se.jsx)("span",{className:R(n==="step"?de.step:de.dot,o),"data-state":e,style:{width:s,height:s},"aria-hidden":"true",children:n==="step"&&e==="done"&&(0,se.jsx)(We,{size:s-2})})}var Ht=Object.freeze({status:"idle",entries:[],integrations:[],services:[],error:!1}),Re=class{constructor(r){this.connection=r,this.state=Ht,this.listeners=new Set,this.pending=void 0,this.closed=!1,this.tickets=new Set}getSnapshot=()=>this.state;subscribe=r=>(this.listeners.add(r),()=>this.listeners.delete(r));publish(r){if(!this.closed){this.state=r;for(let o of this.listeners)o()}}async call(r,o={},n){let s=await this.connection.rpc.call("/api",`dsh-pi-login/${r}`,o,n);if(!s.ok)throw new Error(s.error.code);return s.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let r={abort:new AbortController};return r.promise=this.call("connection-list",{},r.abort.signal).then(o=>{this.pending===r&&this.publish({status:"ready",...o,entries:o.connections??[],error:!1})},()=>{this.pending===r&&this.publish({...this.state,status:"ready",error:!0})}).finally(()=>{this.pending===r&&(this.pending=void 0)}),this.pending=r,this.publish({...this.state,status:"loading",error:!1}),r.promise}refresh(){let r=this.pending;return this.pending=void 0,r?.abort.abort(),this.load()}mutation(r,o={},n){let{profileKey:s,generation:l}=this.state;return this.call(r,{...o,profileKey:s,generation:l},n)}async start(r,o){let n=await this.mutation("start",{connectionId:r,method:o});if(typeof n.ticket!="string")throw new Error("invalid ticket");if(this.closed)throw await this.mutation("cancel",n),new Error("disposed");return this.tickets.add(n.ticket),n.ticket}async cancel(r){this.tickets.delete(r);try{await this.mutation("cancel",{ticket:r})}finally{await this.refresh()}}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear();for(let r of this.tickets)this.mutation("cancel",{ticket:r}).catch(()=>{});this.tickets.clear()}};var Et="dsh-pi-login:update",Ae=class{constructor(r,o){if(o===void 0)try{o=globalThis.sessionStorage}catch{}this.connection=r,this.storage=o,this.listeners=new Set,this.state={status:"blocked",reason:"manager-unavailable"},this.generation=0,this.closed=!1,this.timer=null,this.profileKey=void 0,this.requestId=void 0}getSnapshot=()=>this.state;subscribe=r=>(this.listeners.add(r),()=>this.listeners.delete(r));storageKey(){return this.profileKey?`${Et}:${this.profileKey}`:void 0}selectProfile(r){let o=typeof r=="string"&&/^[a-f0-9]{64}$/.test(r)?r:void 0;if(o!==this.profileKey&&(this.profileKey=o,this.requestId=void 0,o))try{this.requestId=this.storage?.getItem(this.storageKey())||void 0}catch{}}publish(r){if(!this.closed){r.profileKey&&this.selectProfile(r.profileKey),this.state=r;for(let o of this.listeners)o()}}async call(r,o={}){if(!this.connection)return{status:"blocked",reason:"manager-unavailable"};let n=await this.connection.rpc.call("/api",`dsh-pi-login/update-${r}`,o);if(!n.ok){let s=new Error(n.error.code);throw s.rejected=!0,s}return n.value}async load(){if(this.closed)return;let r=++this.generation;clearTimeout(this.timer);try{let o=await this.call("status");if(this.closed||r!==this.generation)return;this.selectProfile(o.profileKey),o.requestId&&(this.requestId=o.requestId);let n=this.requestId?await this.call("reconcile",{requestId:this.requestId,profileKey:this.profileKey}):o;if(this.closed||r!==this.generation)return;if(n.requestId){this.requestId=n.requestId;try{this.storage?.setItem(this.storageKey(),n.requestId)}catch{}}this.publish(n),["preparing","installing"].includes(n.status)&&(this.timer=setTimeout(()=>{this.load()},800))}catch{r===this.generation&&this.publish({...this.state,status:this.requestId?"unknown":"blocked",reason:"network"})}}async check(){if(this.closed||["checking","preparing","installing","starting","unknown"].includes(this.state.status))return;let r=++this.generation;this.publish({...this.state,status:"checking"});try{let o=await this.call("check");r===this.generation&&this.publish(o)}catch{r===this.generation&&this.publish({...this.state,status:"blocked",reason:"network"})}}async begin(){if(this.closed||!this.profileKey||this.state.status!=="available")return;let r=this.state.candidate,o=++this.generation;this.requestId=crypto.randomUUID();try{this.storage?.setItem(this.storageKey(),this.requestId)}catch{}this.publish({...this.state,status:"starting"});try{let n=await this.call("begin",{candidateId:r.id,requestId:this.requestId,profileKey:this.profileKey});if(this.closed||o!==this.generation)return;if(typeof n.requestId!="string")throw new Error("invalid request");this.requestId=n.requestId;try{this.storage?.setItem(this.storageKey(),n.requestId)}catch{}o===this.generation&&(this.publish({...this.state,...n}),await this.load())}catch(n){if(this.closed||o!==this.generation)return;if(n.rejected){this.requestId=void 0;try{this.storage?.removeItem(this.storageKey())}catch{}}o===this.generation&&this.publish({...this.state,status:n.rejected?"failed":"unknown",reason:n.message.endsWith("/busy")?"busy":n.message.endsWith("/profile")?"profile":"network"})}}dispose(){this.closed=!0,this.generation++,clearTimeout(this.timer),this.listeners.clear()}};var $={updateReason_storage:"Could not write the update files to the profile.",updateReason_interrupted:"The download was interrupted before installation. Check again.",updateTitle:"Pi plugin",updateIdle:"Check for a plugin release separately from the model catalog.",updateChecking:"Checking for updates\u2026",updateCurrent:"No newer stable release.",updateAvailable:"A plugin update is available. Your saved credentials and model choices are kept.",updateBlocked:"The update could not be checked or is unavailable.",updatePreparing:"Downloading and verifying the release\u2026",updateInstalling:"Installing the plugin\u2026",updateRestart:"Installed. Restart DSH when your current work is finished to apply the update.",updateApplied:"The updated plugin version is running.",updateFailed:"Update failed. Review the stage below and check again.",updateCancelled:"The installer confirmed cancellation.",updateOverridden:"Saved settings prevent the update from applying.",updateUnknown:"The installation result is unknown. Reconcile the operation before starting another update.",updateCheck:"Check plugin update",updateInstall:"Update plugin",updateReconcile:"Check installation result",updateManual:"Releases / manual update",updateChecked:"Last checked",updateStage:"Installer stage","updateReason_manager-unavailable":"Plugin manager or writable profile is unavailable. Use the Releases page.","updateReason_read-only":"This bundle is not writable in the active profile.",updateReason_source:"This installation source requires a manual update. Its version pin will be preserved.",updateReason_incompatible:"The release does not support this DSH version.","updateReason_compatibility-unknown":"The release compatibility could not be confirmed.",updateReason_busy:"Finish sign-in and settings saves before updating.",updateReason_profile:"The connected profile changed. Check again.",updateReason_network:"Could not contact the release service. Try again later.",updateReason_metadata:"Release metadata is invalid. Use the release link to review it.",updateReason_asset:"The required release assets are missing or ambiguous.",updateReason_channel:"This update accepts stable releases only.",updateReason_checksum:"Release checksum verification failed.",updateReason_redirect:"The release redirected to an unapproved host.",updateReason_size:"The release exceeded its download size limit.","updateReason_stale-candidate":"The release or installation changed. Check again.","updateReason_release-unavailable":"The release service returned no accessible release.",metaRateLimited:"Meta limited the account check. Wait before trying again.",reloadModels:"Update model list",catalogRefreshUnsupported:"Model list refresh is not supported for this provider yet. Update the plugin or SDK to get new models.",catalogRefreshFailed:"Could not update the model list. Try again or sign in again if needed.",metaSubscriptionActive:"Muse subscription active",metaSubscriptionInactive:"Muse subscription inactive",metaSubscriptionUnknown:"Muse subscription could not be confirmed",metaReloadHint:"Checks your Muse subscription and fetches its model list. New models start off. This does not test generation or Contributor billing. Reload again after restarting.",metaContributorHint:"Review Meta\u2019s Contributor data-use terms before enabling a Contributor model.",capabilitiesUnknown:"Capabilities not supplied: text only, provider-default reasoning, configured token limits.",metaLoginRequired:"Sign in to Meta with your Muse account first.",metaKeyOverride:"An API-key reference overrides your Muse login. Choose \u201CUse saved credentials\u201D or remove that reference first.",metaSettingsIncompatible:"Muse account reload requires the default Meta endpoint and saved login, without an Authorization header override.",metaAccountChanged:"Your Meta account changed during reload. Reload again.",useLogin:"Use saved credentials",keyOverride:"The configured API-key reference takes priority.",models:"Models",manageModels:"Choose models",useProvider:"Use this provider",searchModels:"Search models",fastWarning:"Fast mode uses paid priority processing or additional subscription credits. Availability depends on your account and model.",modelEnabled:"Use model",loading:"Loading\u2026",modelsFailed:"Could not load the models.",saveFailed:"Could not save settings. Try again.",modelsHint:"When the provider is on, selected models are available to chats and agents.",noResults:"No matching models.",disabledHint:"Turning this off keeps your credentials and model choices.",activateFirst:"Enable the provider before choosing models.",title:"Pi connections",description:"Choose a provider and sign-in method.",provider:"Provider",method:"Sign-in method",oauth:"Browser sign-in",apiKey:"API key",signIn:"Sign in",signInAgain:"Sign in again",connected:"Connected",notConnected:"Not connected",busy:"Signing in\u2026",openBrowser:"Continue in browser",code:"Verification code",copy:"Copy code",copied:"Copied",cancel:"Cancel",close:"Close",submit:"Continue",success:"Signed in",successDescription:"Your credentials are saved in DeepSeek Harness.",enable:"Enable provider",enabled:"Provider enabled.",failed:"Sign-in failed. Sign in again.",cancelled:"Sign-in cancelled. Sign in again.",providerExpired:"The verification code expired. Sign in again.",timedOut:"Sign-in timed out. Sign in again.",loadFailed:"Could not load the providers.",retry:"Retry",empty:"No Pi sign-in providers are available.",answer:"Enter the requested value",secret:"Enter your API key",selection:"Choose an option",enableFailed:"Signed in, but the provider could not be enabled. Try again.",waiting:"Complete the sign-in in your browser.",readOnly:"Credentials are read-only in this environment."},Q={updateReason_storage:"profile\u5185\u306B\u66F4\u65B0\u7528\u30D5\u30A1\u30A4\u30EB\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_interrupted:"\u5C0E\u5165\u524D\u306E\u53D6\u5F97\u51E6\u7406\u304C\u4E2D\u65AD\u3055\u308C\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateTitle:"Pi\u30D7\u30E9\u30B0\u30A4\u30F3",updateIdle:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3068\u306F\u5225\u306B\u3001\u30D7\u30E9\u30B0\u30A4\u30F3\u672C\u4F53\u306E\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",updateChecking:"\u66F4\u65B0\u3092\u78BA\u8A8D\u4E2D\u2026",updateCurrent:"\u65B0\u3057\u3044\u6B63\u5F0F\u7248\u306F\u3042\u308A\u307E\u305B\u3093\u3002",updateAvailable:"\u66F4\u65B0\u304C\u3042\u308A\u307E\u3059\u3002\u4FDD\u5B58\u6E08\u307F\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateBlocked:"\u66F4\u65B0\u3092\u78BA\u8A8D\u3067\u304D\u306A\u3044\u304B\u3001\u3053\u306E\u74B0\u5883\u3067\u306F\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002",updatePreparing:"\u914D\u5E03\u7269\u3092\u53D6\u5F97\u30FB\u691C\u8A3C\u4E2D\u2026",updateInstalling:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u4E2D\u2026",updateRestart:"\u5C0E\u5165\u3057\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u4F5C\u696D\u3092\u7D42\u3048\u3066\u304B\u3089DSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u9069\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateApplied:"\u66F4\u65B0\u3057\u305F\u30D7\u30E9\u30B0\u30A4\u30F3\u304C\u52D5\u4F5C\u3057\u3066\u3044\u307E\u3059\u3002",updateFailed:"\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u5931\u6557\u6BB5\u968E\u3092\u78BA\u8A8D\u3057\u3066\u518D\u5EA6\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCancelled:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30E9\u30FC\u304C\u53D6\u6D88\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",updateOverridden:"\u4FDD\u5B58\u8A2D\u5B9A\u306B\u3088\u308A\u66F4\u65B0\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3002",updateUnknown:"\u5C0E\u5165\u7D50\u679C\u306F\u4E0D\u660E\u3067\u3059\u3002\u518D\u9001\u305B\u305A\u3001\u7D50\u679C\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCheck:"\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u66F4\u65B0\u3092\u78BA\u8A8D",updateInstall:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u66F4\u65B0\u3059\u308B",updateReconcile:"\u5C0E\u5165\u7D50\u679C\u3092\u78BA\u8A8D",updateManual:"\u914D\u5E03\u7248\u30FB\u624B\u52D5\u66F4\u65B0",updateChecked:"\u78BA\u8A8D\u6642\u523B",updateStage:"\u5C0E\u5165\u6BB5\u968E","updateReason_manager-unavailable":"plugin manager\u307E\u305F\u306F\u66F8\u304D\u8FBC\u307F\u53EF\u80FD\u306Aprofile\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u304B\u3089\u624B\u52D5\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_read-only":"\u3053\u306Eprofile\u3067\u306Fbundle\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_source:"\u3053\u306E\u5C0E\u5165\u5143\u306F\u624B\u52D5\u66F4\u65B0\u304C\u5FC5\u8981\u3067\u3059\u3002\u7248\u56FA\u5B9A\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateReason_incompatible:"\u3053\u306E\u914D\u5E03\u7248\u306F\u5B9F\u884C\u4E2D\u306EDSH\u7248\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","updateReason_compatibility-unknown":"\u914D\u5E03\u7248\u306EDSH\u4E92\u63DB\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_busy:"\u30ED\u30B0\u30A4\u30F3\u3068\u8A2D\u5B9A\u4FDD\u5B58\u3092\u5B8C\u4E86\u3057\u3066\u304B\u3089\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_profile:"\u63A5\u7D9A\u4E2D\u306E\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_network:"\u914D\u5E03\u30B5\u30FC\u30D3\u30B9\u3068\u306E\u901A\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_metadata:"\u914D\u5E03\u60C5\u5831\u304C\u4E0D\u6B63\u3067\u3059\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_asset:"\u5FC5\u8981\u306A\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u306A\u3044\u304B\u3001\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002",updateReason_channel:"\u3053\u306E\u66F4\u65B0\u6A5F\u80FD\u306F\u6B63\u5F0F\u7248\u306E\u307F\u6271\u3044\u307E\u3059\u3002",updateReason_checksum:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u306E\u30C1\u30A7\u30C3\u30AF\u30B5\u30E0\u691C\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",updateReason_redirect:"\u914D\u5E03\u53D6\u5F97\u5148\u304C\u8A31\u53EF\u3057\u3066\u3044\u306A\u3044\u30DB\u30B9\u30C8\u306B\u8EE2\u9001\u3055\u308C\u307E\u3057\u305F\u3002",updateReason_size:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u53D6\u5F97\u30B5\u30A4\u30BA\u4E0A\u9650\u3092\u8D85\u3048\u307E\u3057\u305F\u3002","updateReason_stale-candidate":"\u914D\u5E03\u60C5\u5831\u307E\u305F\u306F\u5C0E\u5165\u72B6\u614B\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_release-unavailable":"\u53D6\u5F97\u3067\u304D\u308B\u914D\u5E03\u7248\u304C\u3042\u308A\u307E\u305B\u3093\u3002",metaRateLimited:"Meta\u306E\u5951\u7D04\u78BA\u8A8D\u304C\u56DE\u6570\u5236\u9650\u306B\u9054\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",reloadModels:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0",catalogRefreshUnsupported:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306F\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u518D\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC\u3067\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u30D7\u30E9\u30B0\u30A4\u30F3\u307E\u305F\u306FSDK\u306E\u66F4\u65B0\u3067\u8FFD\u52A0\u3055\u308C\u307E\u3059\u3002",catalogRefreshFailed:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3059\u308B\u304B\u3001\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30ED\u30B0\u30A4\u30F3\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSubscriptionActive:"Muse\u5951\u7D04\u306F\u6709\u52B9\u3067\u3059",metaSubscriptionInactive:"Muse\u5951\u7D04\u306F\u7121\u52B9\u3067\u3059",metaSubscriptionUnknown:"Muse\u5951\u7D04\u306E\u6709\u52B9\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",metaReloadHint:"\u5951\u7D04\u3092\u78BA\u8A8D\u3057\u3066\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002\u751F\u6210\u3084Contributor\u5229\u7528\u67A0\u306E\u691C\u8A3C\u306F\u884C\u3044\u307E\u305B\u3093\u3002\u518D\u8D77\u52D5\u5F8C\u306F\u518D\u8AAD\u307F\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059\u3002",metaContributorHint:"Contributor\u3092\u6709\u52B9\u306B\u3059\u308B\u524D\u306B\u3001Meta\u306E\u30C7\u30FC\u30BF\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",capabilitiesUnknown:"\u80FD\u529B\u60C5\u5831\u306A\u3057\uFF1A\u30C6\u30AD\u30B9\u30C8\u306E\u307F\u3001\u63A8\u8AD6\u306F\u63A5\u7D9A\u5148\u306E\u65E2\u5B9A\u5024\u3001\u30C8\u30FC\u30AF\u30F3\u4E0A\u9650\u306F\u8A2D\u5B9A\u5024\u3092\u4F7F\u7528\u3002",metaLoginRequired:"\u5148\u306BMuse\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067Meta\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaKeyOverride:"API\u30AD\u30FC\u53C2\u7167\u304CMuse\u30ED\u30B0\u30A4\u30F3\u3088\u308A\u512A\u5148\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u300C\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046\u300D\u3092\u9078\u3076\u304B\u3001\u53C2\u7167\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSettingsIncompatible:"Muse\u5951\u7D04\u306E\u518D\u8AAD\u307F\u8FBC\u307F\u306B\u306F\u3001Meta\u306E\u6A19\u6E96\u63A5\u7D9A\u5148\u3068\u4FDD\u5B58\u6E08\u307F\u30ED\u30B0\u30A4\u30F3\u3092\u4F7F\u3044\u3001Authorization\u30D8\u30C3\u30C0\u30FC\u306E\u4E0A\u66F8\u304D\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaAccountChanged:"\u518D\u8AAD\u307F\u8FBC\u307F\u4E2D\u306BMeta\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u8AAD\u307F\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002",useLogin:"\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046",keyOverride:"\u8A2D\u5B9A\u6E08\u307F\u306EAPI\u30AD\u30FC\u53C2\u7167\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002",models:"\u30E2\u30C7\u30EB",manageModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",useProvider:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",searchModels:"\u30E2\u30C7\u30EB\u3092\u691C\u7D22",fastWarning:"Fast\u30E2\u30FC\u30C9\u306F\u901A\u5E38\u3088\u308A\u9AD8\u3044\u6599\u91D1\u30FB\u30AF\u30EC\u30B8\u30C3\u30C8\u6D88\u8CBB\u304C\u767A\u751F\u3057\u307E\u3059\u3002\u5229\u7528\u53EF\u5426\u306F\u30E2\u30C7\u30EB\u3068\u5951\u7D04\u306B\u3088\u308A\u307E\u3059\u3002",modelEnabled:"\u30E2\u30C7\u30EB\u3092\u4F7F\u3046",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",modelsFailed:"\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",noResults:"\u4E00\u81F4\u3059\u308B\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002",disabledHint:"\u30AA\u30D5\u306B\u3057\u3066\u3082\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",activateFirst:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",title:"Pi\u63A5\u7D9A",description:"\u63A5\u7D9A\u5148\u3068\u30ED\u30B0\u30A4\u30F3\u65B9\u6CD5\u3092\u9078\u3073\u307E\u3059\u3002",provider:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",method:"\u63A5\u7D9A\u65B9\u6CD5",oauth:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3",apiKey:"API\u30AD\u30FC",signIn:"\u30ED\u30B0\u30A4\u30F3",signInAgain:"\u518D\u30ED\u30B0\u30A4\u30F3",connected:"\u63A5\u7D9A\u6E08\u307F",notConnected:"\u672A\u63A5\u7D9A",busy:"\u30ED\u30B0\u30A4\u30F3\u4E2D\u2026",openBrowser:"\u30D6\u30E9\u30A6\u30B6\u3067\u7D9A\u3051\u308B",code:"\u8A8D\u8A3C\u30B3\u30FC\u30C9",copy:"\u30B3\u30FC\u30C9\u3092\u30B3\u30D4\u30FC",copied:"\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",close:"\u9589\u3058\u308B",submit:"\u7D9A\u3051\u308B",success:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F",successDescription:"\u8A8D\u8A3C\u60C5\u5831\u3092DeepSeek Harness\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",enable:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",failed:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cancelled:"\u30ED\u30B0\u30A4\u30F3\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",providerExpired:"\u8A8D\u8A3C\u30B3\u30FC\u30C9\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",timedOut:"\u30ED\u30B0\u30A4\u30F3\u306E\u5F85\u6A5F\u6642\u9593\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loadFailed:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",retry:"\u518D\u8A66\u884C",empty:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u308BPi\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093\u3002",answer:"\u8981\u6C42\u3055\u308C\u305F\u5024\u3092\u5165\u529B",secret:"API\u30AD\u30FC\u3092\u5165\u529B",selection:"\u9805\u76EE\u3092\u9078\u629E",enableFailed:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u304C\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",waiting:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044\u3002",readOnly:"\u3053\u306E\u74B0\u5883\u3067\u306F\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002"};Object.assign($,{title:"AI connections & usage",description:"Manage each account and its models. Open usage details when needed.",connectionsTab:"Connections & models",usageTab:"Usage",addConnection:"Add connection",connectionSettings:"Connection settings",manageModels:"Manage models",searchConnections:"Search connections",filterStatus:"Status",filter_all:"All",filter_connected:"Connected",filter_disconnected:"Not connected",integration:"Integration",service:"Service",connectionName:"Connection name",namePlaceholder:"Personal Pro / Company API",oauthShort:"OAuth",endpoint:"Endpoint URL (optional)",protocol:"Protocol",oauthHint:"Sign in to this account in the browser. Credentials stay within this connection.",save:"Save",saved:"Connection settings saved.",confirmSave:"Confirm change and save",methodChangeWarning:"Changing the sign-in method changes the account or billing used by this connection. Confirm before saving.",cloneConnection:"Duplicate settings",copySuffix:"copy",deleteConnection:"Delete connection",confirmDelete:"Delete this connection",deleteWarning:"Delete this connection and its saved credentials? Its models will no longer be available.",keySaved:"A key is saved. Leave this field empty to keep it. The saved key is never displayed.",showSecret:"Show input",hideSecret:"Hide input",paste:"Paste",pasteFailed:"Clipboard access was unavailable. Paste directly into the field.",availableModels:"Models enabled",authExpired:"Sign-in expired",externalSettings:"Open integration settings",refreshUsage:"Refresh usage",usageFailed:"Could not refresh usage. The last available reading is kept.",usage_available:"Account usage",usage_unobserved:"Not observed yet",usage_unsupported:"Usage is not supported",usage_unknown:"Usage is unknown",usage_unavailable:"Usage is unavailable",usage_auth_required:"Sign in to check usage","usage_auth-required":"Sign in to check usage",usage_stale:"Last reading is out of date","usage_rate-limited":"Rate limited. Retry after the time below.",usage_error:"Usage could not be checked",quota_unlimited:"Unlimited",quota_unavailable:"Limit unavailable",quota_unallocated:"No quota allocated",quota_unknown:"Amount unknown",used:"used",remaining:"Remaining",estimated:"Estimated",unit_credits:"credits",unit_requests:"requests",resets:"Resets",resetDate:"Reset date (time not supplied)",retryAt:"Retry after",observedAt:"Last observed",checkedAt:"Last checked",lastObserved:"Recorded from a prior response. Opening this screen does not run a generation.",endpointUntrusted:"This endpoint is not trusted by the host. Add it to the host allowlist before saving.",serviceUnavailable:"This integration does not provide a supported model connection in this DSH version.",cloneHint:"The copy starts disabled and has no credentials. Configure its account separately.",contributorConfirm:"I have reviewed Meta\u2019s Contributor data-use terms for this model."});Object.assign(Q,{title:"AI\u63A5\u7D9A\u30FB\u5229\u7528\u72B6\u6CC1",description:"\u30A2\u30AB\u30A6\u30F3\u30C8\u3054\u3068\u306B\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB\u3092\u7BA1\u7406\u3057\u307E\u3059\u3002\u5229\u7528\u72B6\u6CC1\u306F\u5FC5\u8981\u306A\u3068\u304D\u306B\u958B\u3051\u307E\u3059\u3002",connectionsTab:"\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB",usageTab:"\u5229\u7528\u72B6\u6CC1",addConnection:"\u63A5\u7D9A\u3092\u8FFD\u52A0",connectionSettings:"\u63A5\u7D9A\u8A2D\u5B9A",manageModels:"\u30E2\u30C7\u30EB\u3092\u7BA1\u7406",searchConnections:"\u63A5\u7D9A\u3092\u691C\u7D22",filterStatus:"\u63A5\u7D9A\u72B6\u614B",filter_all:"\u3059\u3079\u3066",filter_connected:"\u63A5\u7D9A\u6E08\u307F",filter_disconnected:"\u672A\u63A5\u7D9A",integration:"\u9023\u643A",service:"\u30B5\u30FC\u30D3\u30B9",connectionName:"\u63A5\u7D9A\u540D",namePlaceholder:"\u500B\u4EBAPro\u30FB\u4F1A\u793EAPI\u306A\u3069",oauthShort:"OAuth",endpoint:"\u63A5\u7D9A\u5148URL\uFF08\u4EFB\u610F\uFF09",protocol:"\u901A\u4FE1\u65B9\u5F0F",oauthHint:"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067\u30D6\u30E9\u30A6\u30B6\u304B\u3089\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3059\u3002\u8A8D\u8A3C\u60C5\u5831\u306F\u63A5\u7D9A\u3054\u3068\u306B\u4FDD\u5B58\u3057\u307E\u3059\u3002",save:"\u4FDD\u5B58",saved:"\u63A5\u7D9A\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",confirmSave:"\u5909\u66F4\u3092\u78BA\u8A8D\u3057\u3066\u4FDD\u5B58",methodChangeWarning:"\u8A8D\u8A3C\u65B9\u5F0F\u3092\u5909\u3048\u308B\u3068\u3001\u3053\u306E\u63A5\u7D9A\u3067\u4F7F\u3046\u30A2\u30AB\u30A6\u30F3\u30C8\u3084\u8AB2\u91D1\u5148\u304C\u5909\u308F\u308A\u307E\u3059\u3002\u78BA\u8A8D\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cloneConnection:"\u8A2D\u5B9A\u3092\u8907\u88FD",copySuffix:"\u30B3\u30D4\u30FC",deleteConnection:"\u63A5\u7D9A\u3092\u524A\u9664",confirmDelete:"\u3053\u306E\u63A5\u7D9A\u3092\u524A\u9664\u3059\u308B",deleteWarning:"\u3053\u306E\u63A5\u7D9A\u3068\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u60C5\u5831\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F\u3053\u306E\u63A5\u7D9A\u306E\u30E2\u30C7\u30EB\u306F\u5229\u7528\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059\u3002",keySaved:"\u30AD\u30FC\u306F\u4FDD\u5B58\u6E08\u307F\u3067\u3059\u3002\u5909\u66F4\u3057\u306A\u3044\u5834\u5408\u306F\u7A7A\u6B04\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u4FDD\u5B58\u6E08\u307F\u306E\u30AD\u30FC\u306F\u8868\u793A\u3057\u307E\u305B\u3093\u3002",showSecret:"\u5165\u529B\u3092\u8868\u793A",hideSecret:"\u5165\u529B\u3092\u96A0\u3059",paste:"\u8CBC\u308A\u4ED8\u3051",pasteFailed:"\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u5165\u529B\u6B04\u306B\u76F4\u63A5\u8CBC\u308A\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044\u3002",availableModels:"\u30E2\u30C7\u30EB\u6709\u52B9",authExpired:"\u8A8D\u8A3C\u5207\u308C",externalSettings:"\u9023\u643A\u5143\u306E\u8A2D\u5B9A\u3092\u958B\u304F",refreshUsage:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0",usageFailed:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u524D\u56DE\u306E\u53D6\u5F97\u7D50\u679C\u3092\u4FDD\u6301\u3057\u3066\u3044\u307E\u3059\u3002",usage_available:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u72B6\u6CC1",usage_unobserved:"\u307E\u3060\u89B3\u6E2C\u3057\u3066\u3044\u307E\u305B\u3093",usage_unsupported:"\u5229\u7528\u72B6\u6CC1\u306E\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC",usage_unknown:"\u5229\u7528\u72B6\u6CC1\u306F\u4E0D\u660E\u3067\u3059",usage_unavailable:"\u5229\u7528\u72B6\u6CC1\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093",usage_auth_required:"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059","usage_auth-required":"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059",usage_stale:"\u524D\u56DE\u306E\u60C5\u5831\u3067\u3059\u3002\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044","usage_rate-limited":"\u53D6\u5F97\u56DE\u6570\u306E\u5236\u9650\u4E2D\u3067\u3059\u3002\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",usage_error:"\u5229\u7528\u72B6\u6CC1\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",quota_unlimited:"\u7121\u5236\u9650",quota_unavailable:"\u5229\u7528\u67A0\u306F\u4E0D\u660E",quota_unallocated:"\u5229\u7528\u67A0\u306E\u5272\u5F53\u306A\u3057",quota_unknown:"\u4F7F\u7528\u91CF\u306F\u4E0D\u660E",used:"\u4F7F\u7528",remaining:"\u6B8B\u91CF",estimated:"\u63A8\u5B9A",unit_credits:"\u30AF\u30EC\u30B8\u30C3\u30C8",unit_requests:"\u30EA\u30AF\u30A8\u30B9\u30C8",resets:"\u30EA\u30BB\u30C3\u30C8\u6642\u523B",resetDate:"\u30EA\u30BB\u30C3\u30C8\u65E5\uFF08\u6642\u523B\u306E\u60C5\u5831\u306A\u3057\uFF09",retryAt:"\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B",observedAt:"\u6700\u7D42\u89B3\u6E2C\u6642\u523B",checkedAt:"\u6700\u7D42\u53D6\u5F97\u6642\u523B",lastObserved:"\u904E\u53BB\u306E\u5FDC\u7B54\u3067\u89B3\u6E2C\u3057\u305F\u60C5\u5831\u3067\u3059\u3002\u3053\u306E\u753B\u9762\u3092\u958B\u3044\u3066\u3082\u751F\u6210\u306F\u884C\u3044\u307E\u305B\u3093\u3002",endpointUntrusted:"\u3053\u306E\u63A5\u7D9A\u5148\u306F\u30DB\u30B9\u30C8\u3067\u8A31\u53EF\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u30DB\u30B9\u30C8\u306E\u8A31\u53EF\u30EA\u30B9\u30C8\u306B\u8FFD\u52A0\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",serviceUnavailable:"\u3053\u306EDSH\u7248\u3067\u306F\u3001\u3053\u306E\u9023\u643A\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002",cloneHint:"\u8907\u88FD\u3057\u305F\u63A5\u7D9A\u306F\u7121\u52B9\u30FB\u8A8D\u8A3C\u306A\u3057\u3067\u4F5C\u6210\u3057\u307E\u3059\u3002\u30A2\u30AB\u30A6\u30F3\u30C8\u306F\u5225\u306B\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",contributorConfirm:"\u3053\u306E\u30E2\u30C7\u30EB\u306EMeta Contributor\u30C7\u30FC\u30BF\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002"});Object.assign($,{hours:"hours",days:"days",minutes:"minutes",accountQuota:"Account quota",unit_tokens:"tokens",unit_USD:"USD",ownerManaged:"Managed by integration",directory_live:"Available",directory_declared:"Declared",directory_unavailable:"Unavailable",sourceUnknown:"Owner unknown","serviceUnavailable_muse-code-bridge-unverified":"Muse Code runs independent agent sessions. Authentication, account isolation and Contributor consent are not supported by this build. It is separate from the Meta Model API through Pi."});Object.assign(Q,{hours:"\u6642\u9593",days:"\u65E5",minutes:"\u5206",accountQuota:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u67A0",unit_tokens:"\u30C8\u30FC\u30AF\u30F3",unit_USD:"USD",ownerManaged:"\u9023\u643A\u5143\u3067\u7BA1\u7406",directory_live:"\u5229\u7528\u53EF\u80FD",directory_declared:"\u8A2D\u5B9A\u3042\u308A",directory_unavailable:"\u5229\u7528\u4E0D\u53EF",sourceUnknown:"\u7BA1\u7406\u5143\u4E0D\u660E","serviceUnavailable_muse-code-bridge-unverified":"Muse Code\u306F\u72EC\u7ACB\u3057\u305F\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u3067\u3059\u3002\u3053\u306E\u7248\u3067\u306F\u8A8D\u8A3C\u30FB\u30A2\u30AB\u30A6\u30F3\u30C8\u5206\u96E2\u30FBContributor\u306E\u540C\u610F\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u306E\u9023\u643A\u3067\u3059\u3002"});Object.assign($,{museModels:"Muse Code model & mode",museSessionHint:"Muse Code runs independent agent sessions. These models are separate from Pi\u2019s Meta Model API and are not added to the standard DSH model list.",museCatalogDiagnostic:"The host supplied a diagnostic catalog without a supported session model. Model availability does not confirm your account entitlement.",museContributor:"Contributor mode",museStandard:"Standard mode. Contributor data-use consent is off.",museStandardShort:"Standard",museContributorEnabled:"Contributor mode applies to eligible Muse Code models, including Wonder1 and Wonder Full. It is separate from model selection.",museContributorExplanation:"Meta may use your prompts, code, files, context and model responses to train future models. Do not submit personal or confidential information in Contributor mode.",museTerms:"Read Meta Contributor terms",museConsent:"I have read these terms and explicitly consent to Contributor data use for this connection.",museModeSaved:"The host confirmed the Muse Code model and mode.",agentSessionEnabled:"Agent connection enabled","error_muse-code-cli-required":"Install the official Muse Code CLI and supported MSP SDK on the host, then retry.","error_muse-code-protocol-unsupported":"This Muse Code CLI does not support account or settings management. Update the official CLI.","error_muse-code-login-required":"Sign in to this Muse Code connection first.","error_muse-code-login-failed":"Muse Code sign-in did not complete. Retry from this connection\u2019s settings.","error_muse-code-consent-required":"Review the Contributor terms and explicitly consent before enabling it.","error_muse-code-mode-unavailable":"This account or CLI could not apply Contributor mode. The mode was not changed.","error_muse-code-connection-changed":"The Muse Code connection changed. Close this panel and open it again.","error_muse-code-busy":"Muse Code is already performing an operation. Retry after it finishes.","error_muse-code-model-unavailable":"This model was not advertised by the current Muse Code host. Reload the panel.","error_muse-code-unavailable":"Muse Code is unavailable. Check the official CLI and this connection\u2019s sign-in.","error_muse-code-llm-unsupported":"This Muse Code host does not provide a standard DSH model bridge.","error_muse-code-session-failed":"The Muse Code agent session failed. Check this connection and retry."});Object.assign(Q,{museModels:"Muse Code\u306E\u30E2\u30C7\u30EB\u30FB\u30E2\u30FC\u30C9",museSessionHint:"Muse Code\u306F\u72EC\u7ACB\u3057\u305F\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u3067\u3059\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u3067\u3001DSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u4E00\u89A7\u306B\u306F\u8FFD\u52A0\u3057\u307E\u305B\u3093\u3002",museCatalogDiagnostic:"\u3053\u306E\u30DB\u30B9\u30C8\u306E\u4E00\u89A7\u306F\u78BA\u8A8D\u7528\u3067\u3001\u5BFE\u5FDC\u3059\u308B\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u53D6\u5F97\u3060\u3051\u3067\u306F\u5951\u7D04\u306B\u3088\u308B\u5229\u7528\u53EF\u5426\u306F\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",museContributor:"Contributor\u30E2\u30FC\u30C9",museStandard:"Standard\u30E2\u30FC\u30C9\u3067\u3059\u3002Contributor\u306E\u30C7\u30FC\u30BF\u5229\u7528\u540C\u610F\u306F\u30AA\u30D5\u3067\u3059\u3002",museStandardShort:"Standard",museContributorEnabled:"Contributor\u306FWonder1\u30FBWonder Full\u3092\u542B\u3080\u5BFE\u5FDC\u30E2\u30C7\u30EB\u306B\u9069\u7528\u3057\u307E\u3059\u3002\u30E2\u30C7\u30EB\u9078\u629E\u3068\u306F\u5225\u306E\u8A2D\u5B9A\u3067\u3059\u3002",museContributorExplanation:"Meta\u306F\u5165\u529B\u30FB\u30B3\u30FC\u30C9\u30FB\u30D5\u30A1\u30A4\u30EB\u30FB\u6587\u8108\u30FB\u30E2\u30C7\u30EB\u5FDC\u7B54\u3092\u5C06\u6765\u306E\u30E2\u30C7\u30EB\u306E\u5B66\u7FD2\u306B\u5229\u7528\u3059\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002Contributor\u3067\u306F\u500B\u4EBA\u60C5\u5831\u3084\u6A5F\u5BC6\u60C5\u5831\u3092\u9001\u4FE1\u3057\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002",museTerms:"Meta Contributor\u306E\u5229\u7528\u6761\u4EF6\u3092\u8AAD\u3080",museConsent:"\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3001\u3053\u306E\u63A5\u7D9A\u3067Contributor\u306E\u30C7\u30FC\u30BF\u5229\u7528\u306B\u660E\u793A\u7684\u306B\u540C\u610F\u3057\u307E\u3059\u3002",museModeSaved:"\u30DB\u30B9\u30C8\u3067Muse Code\u306E\u30E2\u30C7\u30EB\u30FB\u30E2\u30FC\u30C9\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",agentSessionEnabled:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u63A5\u7D9A\u6709\u52B9","error_muse-code-cli-required":"\u30DB\u30B9\u30C8\u306B\u516C\u5F0FMuse Code CLI\u3068\u5BFE\u5FDC\u3059\u308BMSP SDK\u3092\u5C0E\u5165\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-protocol-unsupported":"\u3053\u306EMuse Code CLI\u306F\u30A2\u30AB\u30A6\u30F3\u30C8\u30FB\u8A2D\u5B9A\u7BA1\u7406\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-required":"\u5148\u306B\u3053\u306EMuse Code\u63A5\u7D9A\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-failed":"Muse Code\u306E\u30ED\u30B0\u30A4\u30F3\u304C\u5B8C\u4E86\u3057\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u306E\u8A2D\u5B9A\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-consent-required":"Contributor\u306E\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3001\u660E\u793A\u7684\u306B\u540C\u610F\u3057\u3066\u304B\u3089\u6709\u52B9\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-mode-unavailable":"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u307E\u305F\u306FCLI\u3067Contributor\u8A2D\u5B9A\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30E2\u30FC\u30C9\u306F\u5909\u66F4\u3057\u3066\u3044\u307E\u305B\u3093\u3002","error_muse-code-connection-changed":"Muse Code\u63A5\u7D9A\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3053\u306E\u753B\u9762\u3092\u9589\u3058\u3066\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-busy":"Muse Code\u306E\u51E6\u7406\u4E2D\u3067\u3059\u3002\u5B8C\u4E86\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-model-unavailable":"\u73FE\u5728\u306EMuse Code\u30DB\u30B9\u30C8\u306B\u3053\u306E\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-unavailable":"Muse Code\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3068\u3053\u306E\u63A5\u7D9A\u306E\u30ED\u30B0\u30A4\u30F3\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-llm-unsupported":"\u3053\u306EMuse Code\u30DB\u30B9\u30C8\u306FDSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","error_muse-code-session-failed":"Muse Code\u306E\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign($,{authUnavailable:"Account status unavailable"});Object.assign(Q,{authUnavailable:"\u63A5\u7D9A\u72B6\u614B\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093"});Object.assign($,{authVerified:"Sign-in verified"});Object.assign(Q,{authVerified:"\u63A5\u7D9A\u78BA\u8A8D\u6E08\u307F"});Object.assign($,{"usageScope_muse-code-subscription-weekly":"Weekly quota","error_muse-code-observation-invalid":"The Muse Code response could not be verified. Update the official CLI and reopen this panel."});Object.assign(Q,{"usageScope_muse-code-subscription-weekly":"\u9031\u9593\u306E\u5229\u7528\u67A0","error_muse-code-observation-invalid":"Muse Code\u306E\u5FDC\u7B54\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3001\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign($,{useProvider:"Use this connection",enable:"Enable connection",enabled:"Connection enabled.",activateFirst:"Enable this connection before choosing models.",modelsHint:"When this connection is enabled, its selected models are available to chats and agents."});Object.assign(Q,{useProvider:"\u3053\u306E\u63A5\u7D9A\u3092\u4F7F\u3046",enable:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",activateFirst:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u3053\u306E\u63A5\u7D9A\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002"});Object.assign($,{museModePending:"The mode changes when you save. It has not been applied yet."});Object.assign(Q,{museModePending:"\u30E2\u30FC\u30C9\u306F\u4FDD\u5B58\u3059\u308B\u3068\u5207\u308A\u66FF\u308F\u308A\u307E\u3059\u3002\u307E\u3060\u9069\u7528\u3057\u3066\u3044\u307E\u305B\u3093\u3002"});Object.assign($,{museEntitlementUnverified:"This model appears in the catalog. Generation entitlement for this subscription has not been verified."});Object.assign(Q,{museEntitlementUnverified:"\u4E00\u89A7\u306B\u3042\u308B\u30E2\u30C7\u30EB\u3067\u3059\u3002\u3053\u306E\u5951\u7D04\u3067\u306E\u751F\u6210\u6A29\u9650\u306F\u672A\u78BA\u8A8D\u3067\u3059\u3002"});var ht=`.dsh-pi-login { color: var(--dsw-alias-label-primary); font-family: var(--dsw-font-family); font-size: 13px; line-height: 1.6; }
.dsh-pi-login h3 { margin: 0; font-size: 14px; font-weight: 500; }
.dsh-pi-login p { margin: 6px 0 12px; }
.dsh-pi-muted, .dsh-pi-caption, .dsh-pi-model-id { color: var(--dsw-alias-label-secondary); }
.dsh-pi-card { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-footer { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-fields { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
.dsh-pi-choice { display: flex; flex: 1 1 180px; min-width: 0; flex-direction: column; gap: 6px; }
.dsh-pi-choice > span:last-child { display: block; }
.dsh-pi-choice-button { width: 100%; justify-content: space-between; }
.dsh-pi-choice-button > span { text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-pi-account-row, .dsh-pi-provider-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.dsh-pi-status { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary); }
.dsh-pi-provider-row { margin: 16px 0; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-provider-row p { margin: 4px 0 0; }
.dsh-pi-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.dsh-pi-prompt { display: flex; flex-direction: column; gap: 8px; }
.dsh-pi-link { display: inline-flex; color: var(--dsw-alias-brand-primary); text-underline-offset: 3px; margin-bottom: 12px; }
.dsh-pi-verification { margin: 8px 0 16px; }
.dsh-pi-verification-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 12px; margin-top: 6px; border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-layer-1); }
.dsh-pi-verification code { font-size: 16px; letter-spacing: .06em; overflow-wrap: anywhere; }
.dsh-pi-models-dialog { width: min(560px, 100%); max-height: 100%; }
.dsh-pi-model-list { margin-top: 16px; max-height: min(440px, 45dvh); overflow-y: auto; overscroll-behavior: contain; }
.dsh-pi-model-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-model-row:last-child { border-bottom: 0; }
.dsh-pi-model-label { display: flex; flex-direction: column; min-width: 0; overflow-wrap: anywhere; }
.dsh-pi-model-id { font-size: 12px; }
.dsh-pi-login [role='alert'] { overflow-wrap: anywhere; }

.dsh-pi-login .dsh-pi-updates { margin-top: 20px; border-top: 1px solid var(--dsw-alias-border-l2); padding-top: 12px; min-width: 0; }
.dsh-pi-login .dsh-pi-updates h4 { margin: 0; }
.dsh-pi-login .dsh-pi-update-notes { white-space: pre-wrap; overflow-wrap: anywhere; max-height: 180px; overflow: auto; }
.dsh-pi-login .dsh-pi-updates .dsh-pi-actions { flex-wrap: wrap; }

.dsh-pi-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.dsh-pi-toolbar p { margin: 0; }
.dsh-pi-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--dsw-alias-border-l2); padding-bottom: 8px; }
.dsh-pi-search { align-items: end; }
.dsh-pi-search > span { flex: 2 1 180px; min-width: 0; }
.dsh-pi-search > .dsh-pi-choice { flex: 1 1 120px; }
.dsh-pi-group { border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-group summary { display: flex; align-items: center; gap: 8px; min-height: 44px; cursor: pointer; font-weight: 500; }
.dsh-pi-group summary::before { content: '\u203A'; width: 12px; font-size: 17px; }
.dsh-pi-group[open] summary::before { transform: rotate(90deg); }
.dsh-pi-group summary::-webkit-details-marker { display: none; }
.dsh-pi-connection-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0 10px 20px; }
.dsh-pi-row-label { min-width: 0; overflow-wrap: anywhere; }
.dsh-pi-row-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 12px; color: var(--dsw-alias-label-secondary); font-size: 12px; }
.dsh-pi-row-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.dsh-pi-connection-dialog { width: min(520px, 100%); max-height: 100%; }
.dsh-pi-modal-content { min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.dsh-pi-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.dsh-pi-connection-dialog .dsh-pi-choice { flex: 0 0 auto; margin-bottom: 14px; }
.dsh-pi-connection-dialog .dsh-pi-fields > .dsh-pi-choice { flex: 1 1 180px; }
.dsh-pi-secret-actions, .dsh-pi-detail-actions { display: flex; flex-wrap: wrap; gap: 4px; }
.dsh-pi-detail-actions { margin-top: 16px; border-top: 1px solid var(--dsw-alias-border-l2); padding-top: 12px; }
.dsh-pi-confirm { border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); padding: 12px; margin-top: 12px; }
.dsh-pi-loading { min-height: 80px; }
.dsh-pi-usage-window { display: flex; flex-direction: column; gap: 4px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-usage-window progress { width: 100%; height: 8px; accent-color: var(--dsw-alias-brand-primary); }
.dsh-pi-login :is(button, input) { min-height: 44px; }
.dsh-pi-login button { min-width: 44px; }
.dsh-pi-login [role='switch'] { width: 60px; height: 44px; border: 12px solid transparent; background-clip: padding-box; }
.dsh-pi-login :is(button, input, summary, a):focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 3px; }
@media (max-width: 540px) {
  .dsh-pi-connection-row { flex-wrap: wrap; padding-left: 20px; }
  .dsh-pi-row-label { flex: 1 1 100%; }
  .dsh-pi-row-actions { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
  .dsh-pi-actions { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-pi-login *, .dsh-pi-login *::before { transition: none !important; animation: none !important; }
}
.dsh-pi-login input::placeholder { color: var(--dsw-alias-label-secondary); opacity: 1; }
.dsh-pi-consent { display: flex; align-items: flex-start; gap: 8px; cursor: pointer; }
.dsh-pi-consent input { flex: 0 0 auto; width: 20px; margin: 0; }
.dsh-pi-consent span { padding-top: 10px; }
`;var gt=`/* Button sizes share the global control-radius scale. */
.dshpi_13ed0003_button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  border-radius: var(--dsw-radius-md);
  cursor: pointer;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
  background: transparent;
  padding: 0 14px;
}

.dshpi_13ed0003_button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.dshpi_13ed0003_md {
  height: 36px;
}

/* Compact controls retain their dimensions across filled and outlined variants. */
.dshpi_13ed0003_sm {
  height: 28px;
  font-size: 12px;
  line-height: 18px;
  padding: 0 10px;
  border-radius: var(--dsw-radius-sm);
}

.dshpi_13ed0003_primary {
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-foreground);
}

.dshpi_13ed0003_primary:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover);
}

.dshpi_13ed0003_ghost:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dshpi_13ed0003_ghost:active:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-active);
}

/* Outlined actions use the same neutral stroke as settings links. */
.dshpi_13ed0003_outline {
  border: 0.5px solid var(--dsw-alias-border-l3);
  background: transparent;
}

.dshpi_13ed0003_outline:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dshpi_13ed0003_toolbar {
  background: var(--dsw-alias-button-tool-bar-fill);
}

.dshpi_13ed0003_toolbar:hover:not(:disabled) {
  background: var(--dsw-alias-button-tool-bar-hover);
}

.dshpi_13ed0003_icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
}

.dshpi_fda332f6_wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 8px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.dshpi_fda332f6_wrap:focus-within {
  border-color: var(--dsw-alias-state-business-primary);
}

.dshpi_fda332f6_icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  color: var(--dsw-alias-label-tertiary);
}

.dshpi_fda332f6_input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
}

.dshpi_fda332f6_input::placeholder {
  color: var(--dsw-alias-label-dimmed);
}

.dshpi_1911279a_root {
  position: relative;
  display: inline-flex;
}

/* Compact translucent dropdown card shared by feature menus. */
.dshpi_1911279a_list,
.dshpi_1911279a_submenu {
  /* min-widths below are the design's outer card widths \u2014 include the pad. */
  box-sizing: border-box;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 0;
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);
  box-shadow: var(--dsw-elevation-prominent);
  /* Elevated surface: the scrollbar thumb takes the l2 elevation tokens. The
     declaration sits on the card rather than on \`.dshpi_1911279a_scrollable .dshpi_1911279a_viewport\`
     because the elevation is a property of this surface, and the custom
     properties inherit down to whichever descendant actually scrolls (see
     ui-theme styles/scrollbar.dshpi_1911279a_css for the rebinding contract). */
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
}

/* Primary cards grow with their content between compact and readable bounds. */
.dshpi_1911279a_list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  min-width: 144px;
  max-width: 360px;
}

/* Portal mode: fixed in the viewport, coordinates supplied inline from the
 * anchor rect (side/align resolved in JS, the in-place offset rules above
 * don't apply). Portaled lists must layer above modal overlays (z 1000) \u2014
 * an anchor inside a dialog still expects its menu on top. */
.dshpi_1911279a_portal {
  position: fixed;
  top: auto;
  left: auto;
  z-index: 1100;
}

/* Open above the anchor (empty-state workspace chip: figma 122:9481). */
.dshpi_1911279a_sideTop {
  top: auto;
  bottom: calc(100% + 4px);
}

.dshpi_1911279a_alignEnd {
  left: auto;
  right: 0;
}

/* Viewport fit: the card stops 12px short of the viewport's top/bottom edges
 * (the portal MARGIN in Menu.dshpi_1911279a_tsx; the top side widens to the frame's published
 * overlay inset) and taller content scrolls inside
 * .dshpi_1911279a_viewport, so a pinned .dshpi_1911279a_footer stays visible. Menus with submenu rows skip
 * this class \u2014 the overflow clip would crop the side card, so they rely on
 * staying short. */
.dshpi_1911279a_scrollable {
  max-height: calc(100vh - 12px - max(12px, var(--dsh-frame-overlay-top, 12px)));
}

.dshpi_1911279a_viewport {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.dshpi_1911279a_scrollable .dshpi_1911279a_viewport {
  overflow-y: auto;
}

/* Pinned rows below the scroll region; l2 hairline (l1 is near-invisible on
 * the menu surface) mirrors the .dshpi_1911279a_separator spacing. */
.dshpi_1911279a_footer {
  flex: none;
  display: flex;
  flex-direction: column;
  margin-top: 3px;
  padding-top: 3px;
  border-top: 0.5px solid var(--dsw-alias-border-l2);
}

.dshpi_1911279a_itemWrap {
  position: relative;
}

/* Menu cell: compact text, icon, and selection spacing. */
.dshpi_1911279a_item {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 34px;
  padding: 6px 8px;
  border: none;
  border-radius: var(--dsw-radius-md);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
  text-align: left;
}

.dshpi_1911279a_item:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

/* Arrow navigation moves real focus, so the row the keyboard is on carries the
   same fill the pointer gets: the fill is the row's focus indication, and the
   browser's default ring would double it. */
.dshpi_1911279a_item:focus-visible:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  outline: none;
}

.dshpi_1911279a_denseList .dshpi_1911279a_item {
  min-height: 30px;
  padding-block: 4px;
}

.dshpi_1911279a_denseList .dshpi_1911279a_label {
  padding-block: 3px;
}

.dshpi_1911279a_list.dshpi_1911279a_compactList,
.dshpi_1911279a_submenu.dshpi_1911279a_compactList {
  min-width: 156px;
  padding: 4px;
}

.dshpi_1911279a_compactList .dshpi_1911279a_item {
  min-height: 24px;
  gap: 5px;
  padding: 2px 6px;
  border-radius: var(--dsw-radius-sm);
  font-size: 11px;
  line-height: 17px;
}

.dshpi_1911279a_compactList .dshpi_1911279a_itemIcon {
  width: 12px;
  height: 12px;
}

.dshpi_1911279a_compactList .dshpi_1911279a_separator {
  margin: 2px;
}

.dshpi_1911279a_compactList .dshpi_1911279a_label {
  padding: 3px 6px;
  font-size: 10px;
  line-height: 15px;
}

.dshpi_1911279a_item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dshpi_1911279a_itemIcon {
  display: inline-flex;
  flex: none;
  width: 14px;
  height: 14px;
  align-items: center;
  justify-content: center;
  color: var(--dsw-alias-menu-icon);
}

.dshpi_1911279a_itemIcon svg,
.dshpi_1911279a_check {
  width: 14px;
  height: 14px;
}

.dshpi_1911279a_compactList .dshpi_1911279a_itemIcon svg,
.dshpi_1911279a_compactList .dshpi_1911279a_check {
  width: 12px;
  height: 12px;
}

.dshpi_1911279a_itemLabel {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dshpi_1911279a_shortcut {
  flex: none;
  margin-inline-start: auto;
}

.dshpi_1911279a_shortcut .dshpi_1911279a_shortcutKeys {
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
  line-height: 16px;
}

.dshpi_1911279a_check {
  flex: none;
  color: var(--dsw-alias-label-primary);
}

/* Selected cell keeps the plain fill (marker is the trailing check); the
 * class remains as a hook for owner-side emphasis. */
.dshpi_1911279a_selected {
  background: transparent;
}

/* Fill-mode selection: the row holds the hover fill instead of a check. */
.dshpi_1911279a_selectedFill {
  background: var(--dsw-alias-interactive-bg-hover);
}

/* Destructive row: error text/icon, danger hover fill. */
.dshpi_1911279a_danger {
  color: var(--dsw-alias-state-error-primary);
}

.dshpi_1911279a_danger .dshpi_1911279a_itemIcon {
  color: var(--dsw-alias-state-error-primary);
}

.dshpi_1911279a_danger:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
}

.dshpi_1911279a_danger:focus-visible:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
  outline: none;
}

/* Heading row: non-interactive small grey text, padding aligned with items. */
.dshpi_1911279a_label {
  padding: 6px 8px;
  font-size: 11px;
  line-height: 15px;
  color: var(--dsw-alias-label-tertiary);
}

/* Separator cell (figma 122:9481): py 4 / px 2 around the hairline. l2, not
 * l1, for the same reason as .dshpi_1911279a_footer: l1 is near-invisible on this surface. */
.dshpi_1911279a_separator {
  height: 0.5px;
  margin: 3px 2px;
  background: var(--dsw-alias-border-l2);
}

/* A data separator directly followed by a row that starts a group draws one
 * line, not two; a group start on the list's first row draws none. */
.dshpi_1911279a_separator + .dshpi_1911279a_separator,
.dshpi_1911279a_separator + .dshpi_1911279a_itemWrap > .dshpi_1911279a_separator:first-child,
.dshpi_1911279a_itemWrap:first-child > .dshpi_1911279a_separator:first-child {
  display: none;
}

/* The submenu aligns with the parent's bottom edge. Its hit bridge covers
 * the menu inset and the 6px gap so pointer movement keeps it open. */
.dshpi_1911279a_submenu {
  position: absolute;
  top: auto;
  bottom: -4px;
  left: calc(100% + 10px);
  z-index: 101;
  min-width: 163px;
}

.dshpi_1911279a_submenu::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -10px;
  width: 10px;
}

.dshpi_a00a35bd_surface,
.dshpi_a00a35bd_backing {
  border-radius: var(--dsw-radius-lg);
}

.dshpi_a00a35bd_compact {
  border-radius: var(--dsw-radius-md);
}

:where(.dshpi_a00a35bd_surface) {
  position: relative;
}

.dshpi_a00a35bd_surface {
  anchor-name: var(--dsh-menu-anchor);
  isolation: isolate;
}

/* Filtering only the background keeps nested menus and fixed overlays free of
 * an ancestor backdrop root or a new fixed-position containing block. */
.dshpi_a00a35bd_material {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: var(--dsw-menu-surface-fill);
  backdrop-filter: var(--dsw-menu-backdrop-filter);
  pointer-events: none;
}

.dshpi_a00a35bd_backing {
  display: none;
}

/* Chromium needs opaque pixels behind the page content to blur it over native
 * vibrancy. Body isolation keeps this backing above the native window and below
 * the page; CSS anchors limit it to this menu without a layout observer. */
html[data-platform='darwin'] .dshpi_a00a35bd_backing {
  display: block;
  position: fixed;
  position-anchor: var(--dsh-menu-anchor);
  top: anchor(top);
  left: anchor(left);
  width: anchor-size(width, 0px);
  height: anchor-size(height, 0px);
  z-index: -1;
  background: var(--dsw-alias-bg-base);
  pointer-events: none;
}

/* Full-viewport layer (figma Mask + Dialog 451:18655): mask + centered card.
   24px of air on every side; the top/bottom widen to the frame's published
   overlay inset so a tall card stays clear of it.
   Cards size against this padding box: consumers cap growth with
   \`max-height: 100%\`, never their own viewport calc. */
.dshpi_b97756f9_root {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(24px, var(--dsh-frame-overlay-top, 24px)) 24px;
}

/* Only paint excludes the native caption; the root still blocks background clicks. */
.dshpi_b97756f9_mask {
  position: absolute;
  inset: var(--dsh-frame-chrome-top, 0px) 0 0;
  backdrop-filter: var(--dsw-mask-blur);
}

.dshpi_b97756f9_mask::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--dsw-alias-bg-mask-1);
  animation: modalEnter var(--ds-transition-duration) var(--ds-ease-in-out);
}

/* Dialogs use the prominent elevation on the secondary layer. */
.dshpi_b97756f9_dialog {
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: min(380px, 100%);
  padding: 0 0 24px;
  overflow: hidden;
  border: 0;
  border-radius: var(--dsw-radius-panel);
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: var(--dsw-elevation-prominent);
  animation: modalEnter var(--ds-transition-duration) var(--ds-ease-in-out);
}

@keyframes modalEnter {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .dshpi_b97756f9_mask::after, .dshpi_b97756f9_dialog { animation: none; }
}

.dshpi_b97756f9_dialog:focus {
  outline: none;
}

.dshpi_b97756f9_content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Header row (figma Title row): pad l24/t22/r14/b12, SPACE_BETWEEN \u2014
 * title left, close button right. */
.dshpi_b97756f9_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 22px 14px 12px 24px;
}

.dshpi_b97756f9_title {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500; /* figma wt510, rendered 500 */
  color: var(--dsw-alias-label-primary);
}

.dshpi_b97756f9_close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--dsw-radius-sm);
  background: transparent;
  cursor: pointer;
  color: var(--dsw-alias-label-secondary);
}

.dshpi_b97756f9_close:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

/* Description and body share the 332px content column (24px side pads). */
.dshpi_b97756f9_description {
  margin: 0;
  padding: 0 24px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: var(--dsw-alias-label-primary);
}

.dshpi_b97756f9_body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-top: 20px;
  padding: 0 24px;
}

.dshpi_b97756f9_footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 24px;
}

.dshpi_042ff8c4_keys {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 3px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
}

.dshpi_042ff8c4_key {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
}

.dshpi_042ff8c4_tooltip { color: inherit; font-size: 11px; line-height: 14px; gap: 2px; }
.dshpi_042ff8c4_tooltip .dshpi_042ff8c4_key {
  min-width: 16px;
  height: 16px;
  padding: 0 2px;
  border-radius: 4px;
  border: 0;
  background: var(--dsw-alias-tooltip-key-bg);
}

.dshpi_042ff8c4_separator { font: inherit; }

.dshpi_042ff8c4_joined { box-sizing: border-box; height: 16px; padding: 0 4px; border-radius: 4px; background: var(--dsw-alias-tooltip-key-bg); }
.dshpi_042ff8c4_joined .dshpi_042ff8c4_key { min-width: 0; height: auto; padding: 0; border: 0; background: transparent; }

/* Solid states keep the 10px layout slot but paint one 6px currentColor core. */
.dshpi_34138a6f_dot {
  position: relative;
  display: inline-block;
  flex: none;
}

.dshpi_34138a6f_dot::after {
  content: '';
  position: absolute;
  inset: 20%;
  border-radius: 50%;
  corner-shape: round;
  background: currentColor;
}

.dshpi_34138a6f_dot[data-state='done'] {
  color: var(--dsw-alias-state-success-primary);
}

.dshpi_34138a6f_dot[data-state='warning'] {
  color: var(--dsw-alias-state-warn-primary);
}

.dshpi_34138a6f_dot[data-state='error'] {
  color: var(--dsw-alias-state-error-primary);
}

/* Idle is the absence of activity and uses the theme's neutral state step. */
.dshpi_34138a6f_dot[data-state='idle'] {
  color: var(--dsw-alias-state-idle-primary);
}

/* Ongoing is the sole non-dot state: a quiet full ring sits behind a centered
 * breathing arc while the complete glyph rotates continuously. Both animations
 * share one 1.5s period so pinning their start times aligns them together. */
.dshpi_34138a6f_spinner {
  flex: none;
  color: var(--dsw-alias-label-tertiary);
}

.dshpi_34138a6f_spinnerMotion {
  transform-origin: center;
  animation: dsh-state-dot-spin 1.5s linear infinite;
}

.dshpi_34138a6f_spinnerTrack,
.dshpi_34138a6f_spinnerArc {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.dshpi_34138a6f_spinnerTrack {
  opacity: 0.25;
}

.dshpi_34138a6f_spinnerArc {
  stroke-dasharray: 12 150;
  animation: dsh-state-dot-dash 1.5s ease-in-out infinite;
}

@keyframes dsh-state-dot-spin {
  to { transform: rotate(360deg); }
}

@keyframes dsh-state-dot-dash {
  0% {
    stroke-dasharray: 12 150;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 24 150;
    stroke-dashoffset: -6;
  }

  100% {
    stroke-dasharray: 12 150;
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dshpi_34138a6f_spinnerMotion,
  .dshpi_34138a6f_spinnerArc {
    animation: none;
  }

  .dshpi_34138a6f_spinnerArc {
    stroke-dasharray: 18 150;
    stroke-dashoffset: -3;
  }
}

.dshpi_34138a6f_step { display: inline-flex; flex: none; align-items: center; justify-content: center; box-sizing: border-box; border-radius: 50%; corner-shape: round; border: 1.5px solid var(--dsw-alias-label-tertiary); color: var(--dsw-alias-label-primary-foreground); }
.dshpi_34138a6f_step[data-state='done'] { border-color: var(--dsw-alias-state-success-primary); background: var(--dsw-alias-state-success-primary); }
.dshpi_34138a6f_step[data-state='error'] { border-color: var(--dsw-alias-state-error-primary); background: var(--dsw-alias-state-error-primary); }
.dshpi_34138a6f_step[data-state='warning'] { border-color: var(--dsw-alias-state-warn-primary); }

/* The on/off appearance keys off aria-checked rather than a parallel class, so
 * the visual state cannot disagree with the state assistive technology reads.
 *
 * The capsule track and circular thumb opt out of the global superellipse. */
.dshpi_7ae83aee_switch {
  box-sizing: border-box;
  position: relative;
  flex: 0 0 auto;
  width: 36px;
  height: 20px;
  padding: 2px;
  border: 0;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsw-alias-border-l3);
  cursor: pointer;
}

.dshpi_7ae83aee_switch[aria-checked='true'] {
  background: var(--dsw-alias-brand-primary);
}

.dshpi_7ae83aee_switch:disabled {
  cursor: default;
  opacity: 0.5;
}

.dshpi_7ae83aee_switch:focus-visible {
  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: 2px;
}

.dshpi_7ae83aee_thumb {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsw-alias-label-primary-foreground);
  transition: transform 120ms ease;
}

.dshpi_7ae83aee_switch[aria-checked='false'] .dshpi_7ae83aee_thumb {
  background: var(--dsw-alias-switch-thumb);
}

.dshpi_7ae83aee_switch[aria-checked='true'] .dshpi_7ae83aee_thumb {
  transform: translateX(16px);
}
`;var t=require("react/jsx-runtime"),ft="dsh.piLogin",Vt=["slots","locale","connection"];function Dt(e){return(0,a.useSyncExternalStore)(r=>e.subscribe(r),()=>e.getSnapshot().revision),e.bind(ft)}function He(e){try{let r=new URL(e);if(r.protocol==="https:"||r.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(r.hostname))return r.href}catch{}}function ce({label:e,value:r,options:o,onChange:n,disabled:s}){let[l,m]=(0,a.useState)(!1),f=(0,a.useId)();return(0,t.jsxs)("div",{className:"dsh-pi-choice",children:[(0,t.jsx)("span",{id:f,className:"dsh-pi-caption",children:e}),(0,t.jsx)(qe,{open:l,onClose:()=>m(!1),portal:!0,selectedId:r,items:o,onSelect:u=>{n(u),m(!1)},anchor:(0,t.jsxs)(I,{variant:"outline",disabled:s,"aria-labelledby":f,"aria-haspopup":"menu","aria-expanded":l,onClick:()=>m(!l),className:"dsh-pi-choice-button",children:[(0,t.jsx)("span",{children:o.find(u=>u.id===r)?.label}),(0,t.jsx)(Ve,{size:14})]})})]})}function Ft({prompt:e,ticket:r,controller:o,t:n,onFailure:s}){let[l,m]=(0,a.useState)(""),[f,u]=(0,a.useState)(!1),[h,M]=(0,a.useState)(!1),[w,i]=(0,a.useState)(!1),b=(0,a.useId)();async function _(k){k.preventDefault();let W=l;m(""),u(!0);try{await o.mutation("answer",{ticket:r,id:e.id,value:W})}catch{s()}finally{u(!1)}}return(0,t.jsxs)("form",{onSubmit:_,className:"dsh-pi-prompt",children:[e.kind==="select"?(0,t.jsx)(ce,{label:e.message||n("selection"),value:l,options:e.options,onChange:m,disabled:f}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("label",{htmlFor:b,children:e.message||n(e.kind==="secret"?"secret":"answer")}),(0,t.jsx)(te,{id:b,"data-modal-autofocus":!0,type:e.kind==="secret"&&!h?"password":"text",autoComplete:"off",spellCheck:!1,value:l,placeholder:e.placeholder,onChange:k=>m(k.target.value)}),e.kind==="secret"?(0,t.jsxs)("div",{className:"dsh-pi-secret-actions",children:[(0,t.jsx)(I,{onClick:()=>M(!h),"aria-pressed":h,children:n(h?"hideSecret":"showSecret")}),(0,t.jsx)(I,{onClick:async()=>{try{m(await navigator.clipboard.readText()),i(!1)}catch{i(!0)}},children:n("paste")})]}):null]}),w?(0,t.jsx)("p",{role:"alert",children:n("pasteFailed")}):null,(0,t.jsx)("div",{className:"dsh-pi-actions",children:(0,t.jsx)(I,{type:"submit",variant:"primary",disabled:f||e.kind==="select"&&!l,children:n("submit")})})]})}function Zt({entry:e,method:r,controller:o,t:n,onClose:s}){let l=(0,a.useRef)(),[m,f]=(0,a.useState)(),[u,h]=(0,a.useState)({status:"running"}),[M,w]=(0,a.useState)(!1),[i,b]=(0,a.useState)(!1),[_,k]=(0,a.useState)(!1),[W,N]=(0,a.useState)(!1),[S,U]=(0,a.useState)(!1),[g,p]=(0,a.useState)(!1);(0,a.useEffect)(()=>{let O=!0;return o.start(e.connectionId,r).then(y=>{l.current=y,O?f(y):o.cancel(y).catch(()=>{})},y=>{O&&w(we(y))}),()=>{O=!1,l.current&&o.cancel(l.current).catch(()=>{})}},[]),(0,a.useEffect)(()=>{if(!m)return;let O=!0,y,J=new AbortController;async function K(){try{let j=await o.call("state",{ticket:m},J.signal);if(!O)return;h(j),j.status==="running"?y=setTimeout(K,800):(o.tickets.delete(m),await o.refresh())}catch(j){O&&w(we(j))}}return K(),()=>{O=!1,J.abort(),clearTimeout(y)}},[m]);let x=He(u.notice?.url),H=u.status!=="running"||M,C=u.reason?.startsWith("muse-code-")?we(new Error(u.reason)):u.reason==="provider-expired"?"providerExpired":u.reason==="timeout"?"timedOut":u.status==="cancelled"?"cancelled":"failed";async function v(O=!1){b(!0),N(!1);try{await o.mutation(O?"use-login":"enable",{connectionId:e.connectionId}),k(!0),await o.refresh()}catch(y){N(!0),U(y.message.endsWith("/api-key-override"))}finally{b(!1)}}return(0,t.jsxs)(le,{open:!0,onClose:s,title:e.displayName,closeLabel:n("close"),className:"dsh-pi-login",footer:(0,t.jsx)(I,{variant:"outline",onClick:s,children:n(H?"close":"cancel")}),children:[M||u.status==="failed"?(0,t.jsx)("p",{role:"alert",children:n(M||C)}):null,u.status==="authorized"?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{role:"status",children:n("success")}),(0,t.jsx)("p",{className:"dsh-pi-muted",children:n("successDescription")}),_?(0,t.jsx)("p",{role:"status",children:n("enabled")}):(0,t.jsx)(I,{variant:"primary",onClick:()=>{v()},disabled:i,children:n("enable")}),W?(0,t.jsx)("p",{role:"alert",children:n(S?"keyOverride":"enableFailed")}):null,S&&!_?(0,t.jsx)(I,{variant:"outline",onClick:()=>{v(!0)},disabled:i,children:n("useLogin")}):null]}):null,u.status==="cancelled"?(0,t.jsx)("p",{role:u.reason==="timeout"?"alert":"status",children:n(C)}):null,H?null:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{role:"status",children:u.notice?.message||n(x?"waiting":"busy")}),x?(0,t.jsx)("a",{className:"dsh-pi-link",href:x,target:"_blank",rel:"noopener noreferrer",children:n("openBrowser")}):null,u.notice?.code?(0,t.jsxs)("div",{className:"dsh-pi-verification",children:[(0,t.jsx)("span",{className:"dsh-pi-muted",children:n("code")}),(0,t.jsxs)("div",{className:"dsh-pi-verification-row",children:[(0,t.jsx)("code",{children:u.notice.code}),(0,t.jsx)(I,{size:"sm",variant:"outline",onClick:async()=>{try{await navigator.clipboard.writeText(u.notice.code),p(!0)}catch{p(!1)}},children:n(g?"copied":"copy")})]})]}):null,u.prompt?(0,t.jsx)(Ft,{prompt:u.prompt,ticket:m,controller:o,t:n,onFailure:()=>w("failed")},u.prompt.id):null]})]})}function Ut({entry:e,controller:r,t:o,onClose:n}){let[s,l]=(0,a.useState)(),[m,f]=(0,a.useState)(""),[u,h]=(0,a.useState)(!1),[M,w]=(0,a.useState)(!1),[i,b]=(0,a.useState)(""),_=(0,a.useRef)(),k=(0,a.useRef)(0);(0,a.useEffect)(()=>{let g=new AbortController;return r.call("models",{connectionId:e.connectionId},g.signal).then(l,()=>{g.signal.aborted||w(!0)}),()=>{g.abort(),_.current?.abort(),k.current++}},[e.connectionId]);async function W(){let g=++k.current;_.current?.abort();let p=new AbortController;_.current=p,h(!0),b(""),w(!1);try{let x=await r.call("refresh-models",{connectionId:e.connectionId},p.signal);!p.signal.aborted&&g===k.current&&l(x)}catch(x){if(!p.signal.aborted&&g===k.current){let H=x.message.split("/").pop();b(s?.refresh?.errors?.[H]??"catalogRefreshFailed")}}finally{!p.signal.aborted&&g===k.current&&h(!1)}}async function N(g,p){h(!0),w(!1);try{await r.mutation("set-model",{connectionId:e.connectionId,model:g,enabled:p,revision:s.revision}),l(await r.call("models",{connectionId:e.connectionId})),await r.refresh()}catch{w(!0);try{l(await r.call("models",{connectionId:e.connectionId}))}catch{}}finally{h(!1)}}let S=m.trim().toLowerCase(),U=s?.models.filter(g=>`${g.id} ${g.name}`.toLowerCase().includes(S));return(0,t.jsxs)(le,{open:!0,title:`${e.displayName} \xB7 ${o("models")}`,description:o("modelsHint"),closeLabel:o("close"),onClose:n,className:"dsh-pi-login dsh-pi-models-dialog",footer:(0,t.jsx)(I,{variant:"outline",onClick:n,children:o("close")}),children:[(0,t.jsx)(te,{icon:(0,t.jsx)(Pe,{size:16}),"aria-label":o("searchModels"),placeholder:o("searchModels"),"data-modal-autofocus":!0,value:m,onChange:g=>f(g.target.value)}),s?.refresh?.canRefresh?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(I,{variant:"outline",size:"sm",disabled:u||!e.writable,onClick:()=>{W()},children:o(u?"loading":"reloadModels")}),s.refresh.status?(0,t.jsxs)("p",{role:"status",children:[o(s.refresh.status.message),s.refresh.status.detail?` \xB7 ${s.refresh.status.detail}`:""]}):null,(s.refresh.notes??[]).map(g=>(0,t.jsx)("p",{className:"dsh-pi-muted",children:o(g)},g))]}):s?(0,t.jsx)("p",{className:"dsh-pi-muted",children:o("catalogRefreshUnsupported")}):null,i?(0,t.jsx)("p",{role:"alert",children:o(i)}):null,M?(0,t.jsx)("p",{role:"alert",children:o(s?"saveFailed":"modelsFailed")}):null,!s&&!M?(0,t.jsx)("p",{role:"status",children:o("loading")}):null,s&&!e.enabled?(0,t.jsx)("p",{className:"dsh-pi-muted",children:o("activateFirst")}):null,s?.models.some(g=>g.fast)?(0,t.jsx)("p",{className:"dsh-pi-muted",children:o("fastWarning")}):null,(0,t.jsxs)("div",{className:"dsh-pi-model-list",children:[U?.map(g=>(0,t.jsxs)("div",{className:"dsh-pi-model-row",children:[(0,t.jsxs)("div",{className:"dsh-pi-model-label",children:[(0,t.jsxs)("span",{children:[g.name," \xB7 ",e.displayName]}),(0,t.jsx)("span",{className:"dsh-pi-model-id",children:g.id}),g.contributor?(0,t.jsx)("span",{className:"dsh-pi-muted",children:o("metaContributorHint")}):null,g.capabilityUnverified?(0,t.jsx)("span",{className:"dsh-pi-muted",children:o("capabilitiesUnknown")}):null]}),(0,t.jsx)(Ie,{label:`${o("modelEnabled")}: ${g.name}`,checked:g.enabled,disabled:u||!e.writable||!e.enabled,onChange:p=>{N(g.id,p)}})]},g.id)),U?.length===0?(0,t.jsx)("p",{className:"dsh-pi-muted",children:o("noResults")}):null]})]})}function we(e){let r=e.message.split("/").pop();return r==="endpoint-untrusted"?"endpointUntrusted":r?.startsWith("muse-code-")?Object.hasOwn($,`error_${r}`)?`error_${r}`:"error_muse-code-unavailable":"saveFailed"}function qt({entry:e,service:r,controller:o,t:n,onClose:s}){let[l,m]=(0,a.useState)(),[f,u]=(0,a.useState)(e.museCode?.modelId??""),[h,M]=(0,a.useState)(e.museCode?.contributorMode===!0),[w,i]=(0,a.useState)(!1),[b,_]=(0,a.useState)(!1),[k,W]=(0,a.useState)(""),[N,S]=(0,a.useState)(!1),U=(0,a.useId)(),g=(0,a.useRef)(e.museCode?.contributorMode===!0),p=(0,a.useRef)();(0,a.useEffect)(()=>{let v=new AbortController;return p.current=v,o.mutation("models",{connectionId:e.connectionId},v.signal).then(O=>{v.signal.aborted||(m(O),typeof O.contributor=="boolean"&&(M(O.contributor),g.current=O.contributor),u(e.museCode?.modelId??O.selectedModelId??O.models?.find(y=>y.selected)?.id??""))},O=>{v.signal.aborted||W(we(O))}),()=>{v.abort()}},[e.connectionId]);let x=(l?.models??[]).filter(v=>v.sessionSupported===!0).map(v=>({...v,id:v.id??v.modelId,name:v.name??v.label??v.displayLabel??v.modelId})),H=He(r?.termsUrl??r?.sourceTermsUrl??"https://dev.meta.ai/help/subscriptions/muse-code-contributor-mode");async function C(){_(!0),W(""),S(!1);try{await o.mutation("connection-update",{connectionId:e.connectionId,revision:l.revision??e.revision,patch:{...f?{modelId:f}:{},contributorMode:h,...h?{contributorConsent:w||g.current}:{}}},p.current.signal),await o.refresh(),g.current=h,i(!1),S(!0),m({...l,revision:o.getSnapshot().revision})}catch(v){p.current.signal.aborted||W(we(v))}finally{p.current.signal.aborted||_(!1)}}return(0,t.jsxs)(le,{open:!0,title:`${e.displayName} \xB7 ${n("museModels")}`,description:n("museSessionHint"),closeLabel:n("close"),onClose:s,className:"dsh-pi-login dsh-pi-connection-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(I,{variant:"outline",onClick:s,children:n("close")}),(0,t.jsx)(I,{variant:"primary",onClick:()=>{C()},disabled:b||!e.writable||!e.configured||!l||x.length===0||!f||h&&!g.current&&!w,children:n(b?"loading":"save")})]}),children:[!l&&!k?(0,t.jsx)("p",{role:"status",children:n("loading")}):null,k?(0,t.jsx)("p",{role:"alert",children:n(k)}):null,N?(0,t.jsx)("p",{role:"status",children:n("museModeSaved")}):null,h!==g.current?(0,t.jsx)("p",{role:"status",className:"dsh-pi-muted",children:n("museModePending")}):null,x.length?(0,t.jsx)(ce,{label:n("museModels"),value:f,options:x.map(v=>({id:v.id,label:`${v.name} \xB7 ${e.displayName}`})),disabled:b||!e.configured||!e.writable,onChange:v=>{u(v),S(!1)}}):l?(0,t.jsx)("p",{className:"dsh-pi-muted",children:n("museCatalogDiagnostic")}):null,x.find(v=>v.id===f)?.entitlement==="unverified"?(0,t.jsx)("p",{className:"dsh-pi-muted",children:n("museEntitlementUnverified")}):null,l?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"dsh-pi-provider-row",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{children:n("museContributor")}),(0,t.jsx)("p",{className:"dsh-pi-muted",children:n(h?"museContributorEnabled":"museStandard")})]}),(0,t.jsx)(Ie,{label:n("museContributor"),checked:h,disabled:b||!e.configured||!e.writable||!x.length,onChange:v=>{M(v),i(!1),S(!1)}})]}),(0,t.jsx)("p",{className:"dsh-pi-muted",children:n("museContributorExplanation")}),H?(0,t.jsx)("a",{className:"dsh-pi-link",href:H,target:"_blank",rel:"noopener noreferrer",children:n("museTerms")}):null,h&&!g.current?(0,t.jsxs)("label",{className:"dsh-pi-consent",htmlFor:U,children:[(0,t.jsx)("input",{id:U,type:"checkbox",checked:w,disabled:b,onChange:v=>i(v.target.checked)}),(0,t.jsx)("span",{children:n("museConsent")})]}):null]}):null]})}function Ct({controller:e,t:r}){let o=(0,a.useSyncExternalStore)(e.subscribe,e.getSnapshot);(0,a.useEffect)(()=>{e.load()},[e]);let n=["checking","starting","preparing","installing"].includes(o.status),s={idle:"updateIdle",checking:"updateChecking",current:"updateCurrent",available:"updateAvailable",blocked:"updateBlocked",starting:"updatePreparing",preparing:"updatePreparing",installing:"updateInstalling","restart-required":"updateRestart",applied:"updateApplied",failed:"updateFailed",cancelled:"updateCancelled",overridden:"updateOverridden",unknown:"updateUnknown"};return(0,t.jsxs)("div",{className:"dsh-pi-updates",children:[(0,t.jsxs)("h4",{children:[r("updateTitle"),o.runtimeVersion?` \xB7 ${o.runtimeVersion}`:""]}),(0,t.jsx)("p",{role:["failed","blocked"].includes(o.status)?"alert":"status",children:r(s[o.status]||"updateUnknown")}),o.reason?(0,t.jsx)("p",{className:"dsh-pi-muted",children:r(`updateReason_${o.reason}`)||r("updateReason_network")}):null,o.checkedAt?(0,t.jsxs)("p",{className:"dsh-pi-muted",children:[r("updateChecked"),": ",new Date(o.checkedAt).toLocaleString()]}):null,o.candidate?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("p",{children:[o.runtimeVersion," \u2192 ",o.candidate.version," \xB7 DSH ",o.candidate.compatibility]}),(0,t.jsx)("p",{className:"dsh-pi-update-notes",children:o.candidate.notes})]}):null,(0,t.jsxs)("div",{className:"dsh-pi-actions",children:[(0,t.jsx)(I,{size:"sm",variant:"outline",disabled:n||o.status==="unknown"||o.status==="restart-required",onClick:()=>{e.check()},children:r("updateCheck")}),o.status==="available"?(0,t.jsx)(I,{size:"sm",variant:"primary",onClick:()=>{e.begin()},children:r("updateInstall")}):null,o.status==="unknown"?(0,t.jsx)(I,{size:"sm",variant:"outline",onClick:()=>{e.load()},children:r("updateReconcile")}):null,(0,t.jsx)("a",{className:"dsh-pi-link",href:"https://github.com/Aero123421/dsh-pi-login/releases",target:"_blank",rel:"noopener noreferrer",children:r("updateManual")})]}),o.result?.stage?(0,t.jsxs)("p",{className:"dsh-pi-muted",children:[r("updateStage"),": ",o.result.stage,o.result.error?.code?` \xB7 ${o.result.error.code}`:""]}):null]})}function Me(e,r=!1){if(!e)return;if(r)return e;let o=new Date(e);return Number.isNaN(o.valueOf())?void 0:o.toLocaleString()}function mt(e,r){let o=e.windowSeconds;return o&&o%86400===0?`${o/86400} ${r("days")}`:o&&o%3600===0?`${o/3600} ${r("hours")}`:o&&o%60===0?`${o/60} ${r("minutes")}`:e.scope==="account"?r("accountQuota"):Object.hasOwn($,`usageScope_${e.scope}`)?r(`usageScope_${e.scope}`):e.scope}function $t({entry:e,controller:r,t:o}){let[n,s]=(0,a.useState)(),[l,m]=(0,a.useState)(!1),[f,u]=(0,a.useState)(!1),h=(0,a.useRef)(),M=(0,a.useRef)(0);async function w(i=!1){let b=++M.current;h.current?.abort();let _=new AbortController;h.current=_,m(!0),u(!1);try{let k=await r.mutation("usage",{connectionId:e.connectionId,refresh:i},_.signal);!_.signal.aborted&&b===M.current&&s(k)}catch{!_.signal.aborted&&b===M.current&&u(!0)}finally{!_.signal.aborted&&b===M.current&&m(!1)}}return(0,a.useEffect)(()=>(w(),()=>{M.current++,h.current?.abort()}),[e.connectionId]),(0,t.jsxs)("div",{className:"dsh-pi-usage","aria-busy":l,children:[(0,t.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,t.jsx)("p",{role:"status",children:o(n?`usage_${n.status}`:"loading")}),(0,t.jsx)(I,{variant:"outline",disabled:l||n?.status==="rate-limited"&&new Date(n.retryAt).valueOf()>Date.now(),onClick:()=>{w(!0)},children:o("refreshUsage")})]}),f?(0,t.jsx)("p",{role:"alert",children:o("usageFailed")}):null,(n?.windows??[]).map(i=>(0,t.jsxs)("div",{className:"dsh-pi-usage-window",children:[(0,t.jsx)("span",{children:mt(i,o)}),i.quotaState?(0,t.jsx)("strong",{children:o(`quota_${i.quotaState}`)}):typeof i.usedPercent=="number"?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("strong",{children:[i.usedPercent,"% ",o("used")]}),(0,t.jsx)("progress",{max:"100",value:Math.min(100,Math.max(0,i.usedPercent)),"aria-label":mt(i,o)})]}):(0,t.jsx)("span",{children:o("quota_unknown")}),i.quota?(0,t.jsxs)("span",{className:"dsh-pi-muted",children:[i.quota.estimated?`${o("estimated")} \xB7 `:"",i.quota.remaining!=null?`${o("remaining")}: ${i.quota.remaining}`:i.quota.used!=null?`${o("used")}: ${i.quota.used}`:o("quota_unknown"),i.quota.total!=null?` / ${i.quota.total}`:""," ",o(`unit_${i.quota.unit}`)]}):null,i.resetsAt?(0,t.jsxs)("span",{className:"dsh-pi-muted",children:[o("resets"),": ",Me(i.resetsAt)]}):i.resetsOn?(0,t.jsxs)("span",{className:"dsh-pi-muted",children:[o("resetDate"),": ",Me(i.resetsOn,!0)]}):null]},i.id)),n?.retryAt?(0,t.jsxs)("p",{className:"dsh-pi-muted",children:[o("retryAt"),": ",Me(n.retryAt)]}):null,n?.sourceObservedAt?(0,t.jsxs)("p",{className:"dsh-pi-muted",children:[o("observedAt"),": ",Me(n.sourceObservedAt)]}):null,n?.checkedAt?(0,t.jsxs)("p",{className:"dsh-pi-muted",children:[o("checkedAt"),": ",Me(n.checkedAt)]}):null,n?.source==="last-observed"?(0,t.jsx)("p",{className:"dsh-pi-muted",children:o("lastObserved")}):null]})}function Kt({value:e,onChange:r,t:o,disabled:n}){let[s,l]=(0,a.useState)(!1),[m,f]=(0,a.useState)(!1),u=(0,a.useId)();return(0,t.jsxs)("div",{className:"dsh-pi-field",children:[(0,t.jsx)("label",{htmlFor:u,children:o("apiKey")}),(0,t.jsx)(te,{id:u,type:s?"text":"password",autoComplete:"off",spellCheck:!1,value:e,disabled:n,onChange:h=>r(h.target.value)}),(0,t.jsxs)("div",{className:"dsh-pi-secret-actions",children:[(0,t.jsx)(I,{disabled:n,"aria-pressed":s,onClick:()=>l(!s),children:o(s?"hideSecret":"showSecret")}),(0,t.jsx)(I,{disabled:n,onClick:async()=>{try{r(await navigator.clipboard.readText()),f(!1)}catch{f(!0)}},children:o("paste")})]}),m?(0,t.jsx)("p",{role:"alert",children:o("pasteFailed")}):null]})}function jt({entry:e,state:r,controller:o,t:n,onClose:s,onLogin:l,onSaved:m}){let[f,u]=(0,a.useState)(e?.integrationId??r.integrations[0]?.id??"pi"),h=r.services.filter(d=>d.integrationId===f),[M,w]=(0,a.useState)(e?.serviceId??h[0]?.serviceId??h[0]?.id??""),i=h.find(d=>(d.serviceId??d.id)===M)??h[0],b=i?.methods??e?.methods??[],[_,k]=(0,a.useState)(e?.authMethod??b[0]?.id??"oauth"),W=b.find(d=>d.id===_)?.id??b[0]?.id??_,[N,S]=(0,a.useState)(e?.displayName??""),[U,g]=(0,a.useState)(e?.enabled??!1),[p,x]=(0,a.useState)(e?.profile?.baseURL??""),[H,C]=(0,a.useState)(e?.profile?.api??""),[v,O]=(0,a.useState)(""),[y,J]=(0,a.useState)(!1),[K,j]=(0,a.useState)(""),[ie,pe]=(0,a.useState)(),z=(0,a.useId)(),ve=r.revision,q=e?.writable??i?.writable!==!1,ae=e&&W!==e.authMethod;async function be(){if(ae&&ie!=="method"){pe("method");return}J(!0),j("");try{let d={displayName:N.trim(),...!e||ae?{authMethod:W}:{},...e?{enabled:U}:{},...v?{apiKey:v}:{},...p.trim()?{endpointUrl:p.trim()}:e?.profile?.baseURL?{endpointUrl:""}:{},...H?{api:H}:{}},F=await o.mutation(e?"connection-update":"connection-create",e?{connectionId:e.connectionId,patch:d,revision:ve}:{integrationId:f,serviceId:i.serviceId??i.id,...d,revision:ve});if(O(""),await o.refresh(),m(),!e&&W==="oauth"){let B=F.connection??F,E=o.getSnapshot().entries.find(ue=>ue.connectionId===B.connectionId);E&&l(E)}}catch(d){j(we(d))}finally{J(!1)}}async function c(d){J(!0),j("");try{await o.mutation(`connection-${d}`,{connectionId:e.connectionId,revision:ve,...d==="clone"?{displayName:`${N} ${n("copySuffix")}`}:{}}),await o.refresh(),m()}catch{j("saveFailed")}finally{J(!1)}}return(0,t.jsxs)(le,{open:!0,title:e?`${e.displayName} \xB7 ${n("connectionSettings")}`:n("addConnection"),closeLabel:n("close"),onClose:s,className:"dsh-pi-login dsh-pi-connection-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(I,{variant:"outline",onClick:s,disabled:y,children:n("cancel")}),(0,t.jsx)(I,{variant:"primary",disabled:y||!q||!i||i.capabilities?.settings===!1||ie==="delete"||!N.trim()||!e&&W==="api-key"&&!v.trim(),onClick:()=>{be()},children:n(y?"loading":ie==="method"?"confirmSave":"save")})]}),children:[e?(0,t.jsxs)("p",{className:"dsh-pi-muted",children:[e.integrationLabel," / ",e.serviceLabel]}):(0,t.jsxs)("div",{className:"dsh-pi-fields",children:[(0,t.jsx)(ce,{label:n("integration"),value:f,options:r.integrations.map(d=>({id:d.id??d.integrationId,label:d.label})),disabled:y,onChange:d=>{u(d),w(""),k("oauth")}}),h.length>1?(0,t.jsx)(ce,{label:n("service"),value:i?.serviceId??i?.id,options:h.map(d=>({id:d.serviceId??d.id,label:d.label??d.serviceLabel})),disabled:y,onChange:w}):null]}),(0,t.jsxs)("div",{className:"dsh-pi-field",children:[(0,t.jsx)("label",{htmlFor:`${z}-name`,children:n("connectionName")}),(0,t.jsx)(te,{id:`${z}-name`,"data-modal-autofocus":!0,maxLength:80,value:N,disabled:y||!q,placeholder:n("namePlaceholder"),onChange:d=>S(d.target.value)})]}),e?(0,t.jsxs)("div",{className:"dsh-pi-provider-row",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{children:n("useProvider")}),(0,t.jsx)("p",{className:"dsh-pi-muted",children:n("disabledHint")})]}),(0,t.jsx)(Ie,{label:`${n("useProvider")}: ${e.displayName}`,checked:U,disabled:y||!q||!e.configured,onChange:g})]}):null,i?.capabilities?.settings===!1?(0,t.jsx)("p",{role:"status",children:n(i.unavailableReason==="muse-code-bridge-unverified"?`serviceUnavailable_${i.unavailableReason}`:"serviceUnavailable")}):null,b.length>1?(0,t.jsx)(ce,{label:n("method"),value:W,options:b.map(d=>({id:d.id,label:n(d.id==="oauth"?"oauth":"apiKey")})),disabled:y||!q,onChange:d=>{k(d),O(""),pe(void 0)}}):null,W==="api-key"?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(Kt,{value:v,onChange:O,t:n,disabled:y||!q}),e?.configured?(0,t.jsx)("p",{className:"dsh-pi-muted",children:n("keySaved")}):null,(0,t.jsxs)("div",{className:"dsh-pi-field",children:[(0,t.jsx)("label",{htmlFor:`${z}-url`,children:n("endpoint")}),(0,t.jsx)(te,{id:`${z}-url`,type:"url",value:p,disabled:y||!q,placeholder:"https://\u2026",onChange:d=>x(d.target.value)})]}),i?.apis?.length?(0,t.jsx)(ce,{label:n("protocol"),value:H||i.apis[0],options:i.apis.map(d=>({id:d,label:d})),disabled:y||!q,onChange:C}):null]}):(0,t.jsx)("p",{className:"dsh-pi-muted",children:n("oauthHint")}),ae?(0,t.jsx)("p",{role:"alert",children:n("methodChangeWarning")}):null,e?(0,t.jsxs)("div",{className:"dsh-pi-detail-actions",children:[e.authMethod==="oauth"&&e.capabilities?.auth!==!1?(0,t.jsx)(I,{variant:"outline",disabled:y||!q||ae,onClick:()=>l(e),children:n(e.configured?"signInAgain":"signIn")}):null,(0,t.jsx)(I,{variant:"outline",disabled:y||!q,onClick:()=>{c("clone")},children:n("cloneConnection")}),(0,t.jsx)(I,{disabled:y||!q,onClick:()=>pe("delete"),children:n("deleteConnection")})]}):null,e?(0,t.jsx)("p",{className:"dsh-pi-muted",children:n("cloneHint")}):null,ie==="delete"?(0,t.jsxs)("div",{className:"dsh-pi-confirm",children:[(0,t.jsx)("p",{role:"alert",children:n("deleteWarning")}),(0,t.jsx)(I,{variant:"outline",disabled:y,onClick:()=>pe(void 0),children:n("cancel")}),(0,t.jsx)(I,{variant:"primary",disabled:y,onClick:()=>{c("delete")},children:n("confirmDelete")})]}):null,K?(0,t.jsx)("p",{role:"alert",children:n(K)}):null,q?null:(0,t.jsx)("p",{className:"dsh-pi-muted",children:n("readOnly")})]})}function wt({controller:e,updates:r,locale:o}){let n=(0,a.useSyncExternalStore)(e.subscribe,e.getSnapshot),s=Dt(o),[l,m]=(0,a.useState)("connections"),[f,u]=(0,a.useState)(""),[h,M]=(0,a.useState)("all"),[w,i]=(0,a.useState)(),[b,_]=(0,a.useState)(!1),k=(0,a.useId)();(0,a.useEffect)(()=>{e.load()},[e]),(0,a.useEffect)(()=>{i(void 0),_(!1)},[n.profileKey,n.generation]);let W=f.trim().toLocaleLowerCase(),N=new Map;for(let p of n.entries){if(!`${p.displayName} ${p.integrationLabel} ${p.serviceLabel}`.toLocaleLowerCase().includes(W)||h==="connected"&&!p.configured||h==="disconnected"&&p.configured)continue;let x=`${p.integrationId}/${p.serviceId}`;N.has(x)||N.set(x,{label:`${p.integrationLabel} / ${p.serviceLabel}`,entries:[]}),N.get(x).entries.push(p)}let S=["connections","usage"];function U(p){i({kind:"login",entry:p,method:p.authMethod})}function g(){i(void 0),_(!0)}return(0,t.jsxs)("section",{className:"dsh-pi-login dsh-pi-footer","aria-labelledby":`${k}-title`,children:[(0,t.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,t.jsx)("h3",{id:`${k}-title`,children:s("title")}),(0,t.jsx)(I,{variant:"outline",onClick:()=>{_(!1),i({kind:"settings"})},disabled:n.status!=="ready"||n.services.length===0,children:s("addConnection")})]}),(0,t.jsx)("p",{className:"dsh-pi-muted",children:s("description")}),(0,t.jsx)("div",{className:"dsh-pi-tabs",role:"tablist","aria-label":s("title"),children:S.map(p=>(0,t.jsx)(I,{id:`${k}-${p}`,role:"tab","aria-selected":l===p,"aria-controls":`${k}-panel`,tabIndex:l===p?0:-1,variant:l===p?"outline":"ghost",onClick:()=>m(p),onKeyDown:x=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(x.key))return;x.preventDefault();let H=x.key==="Home"?S[0]:x.key==="End"?S[1]:S[1-S.indexOf(p)];m(H),document.getElementById(`${k}-${H}`)?.focus()},children:s(p==="connections"?"connectionsTab":"usageTab")},p))}),b?(0,t.jsx)("p",{role:"status",children:s("saved")}):null,n.error?(0,t.jsxs)("p",{role:"alert",children:[s("loadFailed")," ",(0,t.jsx)(I,{onClick:()=>{e.refresh()},children:s("retry")})]}):null,n.status==="loading"&&n.entries.length===0?(0,t.jsx)("p",{role:"status",className:"dsh-pi-loading",children:s("loading")}):null,(0,t.jsxs)("div",{className:"dsh-pi-fields dsh-pi-search",children:[(0,t.jsx)(te,{"aria-label":s("searchConnections"),placeholder:s("searchConnections"),icon:(0,t.jsx)(Pe,{size:16}),value:f,onChange:p=>u(p.target.value)}),(0,t.jsx)(ce,{label:s("filterStatus"),value:h,options:["all","connected","disconnected"].map(p=>({id:p,label:s(`filter_${p}`)})),onChange:M})]}),(0,t.jsxs)("div",{id:`${k}-panel`,role:"tabpanel","aria-labelledby":`${k}-${l}`,children:[[...N].map(([p,x],H)=>(0,t.jsxs)("details",{className:"dsh-pi-group",open:n.entries.length<=8||H===0||W?!0:void 0,children:[(0,t.jsxs)("summary",{children:[(0,t.jsx)("span",{children:x.label}),(0,t.jsx)("span",{className:"dsh-pi-muted",children:x.entries.length})]}),x.entries.map(C=>(0,t.jsxs)("div",{className:"dsh-pi-connection-row",children:[(0,t.jsxs)("div",{className:"dsh-pi-row-label",children:[(0,t.jsx)("span",{children:C.displayName}),(0,t.jsxs)("div",{className:"dsh-pi-row-meta",children:[(0,t.jsx)("span",{children:s(C.authMethod==="owner-managed"?"ownerManaged":C.authMethod==="oauth"?"oauthShort":"apiKey")}),C.authStatus==="owner-managed"?(0,t.jsxs)("span",{children:[s(`directory_${C.directoryState??"unavailable"}`)," \xB7 ",C.source??s("sourceUnknown")]}):(0,t.jsxs)("span",{className:"dsh-pi-status",children:[(0,t.jsx)($e,{state:C.inFlight||C.authStatus==="updating"?"ongoing":C.configured?"done":"pending",size:8}),s(C.inFlight||C.authStatus==="updating"?"busy":C.authStatus==="unavailable"?"authUnavailable":C.authStatus==="expired"?"authExpired":C.authStatus==="verified"?"authVerified":C.configured?"connected":"notConnected")]}),C.enabled?(0,t.jsx)("span",{children:s(C.executionKind==="agent-session"?"agentSessionEnabled":"availableModels")}):null,C.integrationId==="meta-muse-code"?(0,t.jsx)("span",{children:s(C.museCode?.contributorMode?"museContributor":"museStandardShort")}):null]})]}),(0,t.jsx)("div",{className:"dsh-pi-row-actions",children:l==="usage"?C.capabilities?.usage!==!1?(0,t.jsx)(I,{variant:"outline","aria-label":`${s("usageTab")}: ${C.displayName}`,onClick:()=>i({kind:"usage",entry:C}),children:s("usageTab")}):(0,t.jsx)("span",{className:"dsh-pi-muted",children:s("usage_unsupported")}):(0,t.jsxs)(t.Fragment,{children:[C.capabilities?.models!==!1?(0,t.jsx)(I,{variant:"outline","aria-label":`${s("manageModels")}: ${C.displayName}`,onClick:()=>i({kind:"models",entry:C}),children:s("manageModels")}):null,C.capabilities?.settings!==!1?(0,t.jsx)(I,{"aria-label":`${s("connectionSettings")}: ${C.displayName}`,onClick:()=>{_(!1),i({kind:"settings",entry:C})},children:s("connectionSettings")}):C.settingsUrl&&He(C.settingsUrl)?(0,t.jsx)("a",{className:"dsh-pi-link",href:He(C.settingsUrl),target:"_blank",rel:"noopener noreferrer",children:s("externalSettings")}):null]})})]},C.connectionId))]},p)),n.status==="ready"&&N.size===0&&!n.error?(0,t.jsx)("p",{className:"dsh-pi-muted",children:s(n.entries.length?"noResults":"empty")}):null]}),r?(0,t.jsx)(Ct,{controller:r,t:s}):null,w?.kind==="login"?(0,t.jsx)(Zt,{...w,controller:e,t:s,onClose:()=>i(void 0)}):null,w?.kind==="models"?w.entry.integrationId==="meta-muse-code"?(0,t.jsx)(qt,{entry:w.entry,service:n.services.find(p=>p.integrationId===w.entry.integrationId&&p.serviceId===w.entry.serviceId),controller:e,t:s,onClose:()=>i(void 0)}):(0,t.jsx)(Ut,{entry:w.entry,controller:e,t:s,onClose:()=>i(void 0)}):null,w?.kind==="settings"?(0,t.jsx)(jt,{entry:w.entry,state:n,controller:e,t:s,onClose:()=>i(void 0),onLogin:U,onSaved:g}):null,w?.kind==="usage"?(0,t.jsx)(le,{open:!0,title:`${w.entry.displayName} \xB7 ${s("usageTab")}`,closeLabel:s("close"),onClose:()=>i(void 0),className:"dsh-pi-login dsh-pi-connection-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,t.jsx)(I,{variant:"outline",onClick:()=>i(void 0),children:s("close")}),children:(0,t.jsx)($t,{entry:w.entry,controller:e,t:s})}):null]})}function Gt(e){let r=new Re(e.connection),o=new Ae(e.connection);e.effect(()=>()=>o.dispose(),"dsh-pi-login: update requests"),e.effect(()=>()=>r.dispose(),"dsh-pi-login: UI requests"),e.effect(()=>e.locale.register(ft,{en:$,ja:Q}),"dsh-pi-login: copy"),e.effect(()=>{let s=document.createElement("style");return s.dataset.dshPiLogin="",s.textContent=gt+ht,document.head.append(s),()=>s.remove()},"dsh-pi-login: official controls"),e.on("connection/reset",()=>{r.refresh(),o.load()});let n=()=>({controller:r,updates:o,locale:e.locale});e.slots.inject("settings.models.footer",()=>e.slots.register({name:"settings.models.footer",id:"dsh-pi-login",order:10,inject:n},wt))}

return module.exports;}});
