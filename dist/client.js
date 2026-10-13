window.__ModuleLoader__.load({id:"@local/dsh-pi-login",factory(require){const module={exports:{}};const exports=module.exports;
var Ie=Object.defineProperty;var u1=Object.getOwnPropertyDescriptor;var g1=Object.getOwnPropertyNames;var C1=Object.prototype.hasOwnProperty;var m1=(e,t)=>{for(var o in t)Ie(e,o,{get:t[o],enumerable:!0})},w1=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of g1(t))!C1.call(e,r)&&r!==o&&Ie(e,r,{get:()=>t[r],enumerable:!(n=u1(t,r))||n.enumerable});return e};var f1=e=>w1(Ie({},"__esModule",{value:!0}),e);var Z1={};m1(Z1,{ConnectionUI:()=>Ee,apply:()=>V1,inject:()=>N1});module.exports=f1(Z1);var p=require("react");var Ue=require("react");function Ke(e){var t,o,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var r=e.length;for(t=0;t<r;t++)e[t]&&(o=Ke(e[t]))&&(n&&(n+=" "),n+=o)}else for(o in e)e[o]&&(n&&(n+=" "),n+=o);return n}function k1(){for(var e,t,o=0,n="",r=arguments.length;o<r;o++)(e=arguments[o])&&(t=Ke(e))&&(n&&(n+=" "),n+=t);return n}var I=k1;var se={button:"dshpi_13ed0003_button",md:"dshpi_13ed0003_md",sm:"dshpi_13ed0003_sm",primary:"dshpi_13ed0003_primary",ghost:"dshpi_13ed0003_ghost",outline:"dshpi_13ed0003_outline",toolbar:"dshpi_13ed0003_toolbar",icon:"dshpi_13ed0003_icon"};var ce=require("react/jsx-runtime"),B=(0,Ue.forwardRef)(function({variant:t="ghost",size:o="md",icon:n,className:r,children:l,...u},C){return(0,ce.jsxs)("button",{ref:C,type:"button",className:I(se.button,se[t],se[o],r),...u,children:[n!=null&&(0,ce.jsx)("span",{className:se.icon,children:n}),l]})});var je=require("react");var pe={wrap:"dshpi_fda332f6_wrap",icon:"dshpi_fda332f6_icon",input:"dshpi_fda332f6_input"};var ie=require("react/jsx-runtime"),he=(0,je.forwardRef)(function({icon:t,className:o,...n},r){return(0,ie.jsxs)("span",{className:I(pe.wrap,o),children:[t!=null&&(0,ie.jsx)("span",{className:pe.icon,children:t}),(0,ie.jsx)("input",{ref:r,className:pe.input,...n})]})});var Me={switch:"dshpi_7ae83aee_switch",thumb:"dshpi_7ae83aee_thumb"};var ye=require("react/jsx-runtime");function ue({checked:e,onChange:t,label:o,disabled:n=!1,title:r,className:l}){return(0,ye.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":o,title:r,disabled:n,className:I(Me.switch,l),onClick:()=>{t(!e)},children:(0,ye.jsx)("span",{className:Me.thumb})})}var W=require("react"),o1=require("react-dom");var v1=require("react");var Ge=require("react/jsx-runtime");var P=require("react/jsx-runtime");var ge=1;var x1=({size:e=16,className:t,strokeWidth:o})=>(0,P.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,P.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,P.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),_e=e=>(0,P.jsx)(x1,{...e,strokeWidth:ge});var b1=({size:e=16,className:t,strokeWidth:o})=>(0,P.jsx)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:(0,P.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),Ce=e=>(0,P.jsx)(b1,{...e,strokeWidth:ge});var I1=({size:e=14,className:t,strokeWidth:o})=>(0,P.jsx)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:(0,P.jsx)("path",{d:"M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6",stroke:"currentColor"})}),Le=e=>(0,P.jsx)(I1,{...e,strokeWidth:ge});var M1=({size:e=16,className:t,strokeWidth:o})=>(0,P.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,P.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,P.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),qe=e=>(0,P.jsx)(M1,{...e,strokeWidth:ge});function $e(e){let t=document.documentElement,o=Number.parseFloat(getComputedStyle(t).getPropertyValue("--dsh-frame-top-clearance"));return Number.isNaN(o)?e:Math.max(e,(t.hasAttribute("data-fullscreen")?0:o)+20)}var q=require("react"),y1=200;function Qe(e){let t=(0,q.useRef)(null),o=(0,q.useRef)(e);o.current=e;let n=(0,q.useCallback)(()=>{t.current!==null&&(clearTimeout(t.current),t.current=null)},[]),r=(0,q.useCallback)(()=>{n(),t.current=setTimeout(()=>{t.current=null,o.current()},y1)},[n]);return(0,q.useEffect)(()=>n,[n]),{arm:r,cancel:n}}var fe=require("react");function me(e){let t=!1,o=!1,n=()=>{t=!0},r=()=>{t=!1,o=!0},l=()=>{o=!1},u=()=>{t=!1,o=!1};return e.addEventListener("compositionstart",n,!0),e.addEventListener("compositionend",r,!0),e.addEventListener("keyup",l,!0),e.defaultView?.addEventListener("blur",u),{guards:C=>{let a=t||o||C.isComposing||C.keyCode===229;return o=!1,a},dispose:()=>{e.removeEventListener("compositionstart",n,!0),e.removeEventListener("compositionend",r,!0),e.removeEventListener("keyup",l,!0),e.defaultView?.removeEventListener("blur",u)}}}var We=new WeakMap,_1=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function oe(e,t){We.get(e)?.();let o=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",o),e.removeEventListener("keydown",n,!0),We.delete(e)},n=r=>{!r.isComposing&&!r.ctrlKey&&!r.altKey&&!r.metaKey&&_1.has(r.key)&&o()};We.set(e,o),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",o),e.addEventListener("keydown",n,!0),e.focus(t),e.matches(":focus")||o()}var we=new WeakMap;function Je(e){if(e===null)return!1;let t=we.get(e.ownerDocument)?.at(-1);return t!==void 0&&!t.element.contains(e)}var Ye='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function Xe(e,t,o){let n=(0,fe.useRef)(o);n.current=o,(0,fe.useLayoutEffect)(()=>{let r=e.current;if(!t||r===null)return;let l=r.ownerDocument,u=me(l),C=l.activeElement,a=we.get(l)??[];we.set(l,a);let f={element:r,close:()=>{n.current()}};a.push(f);let v=r.querySelector("[data-modal-autofocus]")??r.querySelector(Ye)??r;r.contains(l.activeElement)||oe(v);let b=m=>{let x=u.guards(m);if(a.at(-1)!==f||m.defaultPrevented||x||m.ctrlKey||m.altKey||m.metaKey||(m.key==="Escape"&&!m.shiftKey&&(m.preventDefault(),m.repeat||n.current()),m.key!=="Tab")||l.activeElement?.closest('[role="menu"]'))return;let y=[...r.querySelectorAll(Ye)].filter(h=>!h.closest("[inert], [hidden]")),H=y[0]??r,E=y.at(-1)??r,N=m.shiftKey?l.activeElement===H:l.activeElement===E;(l.activeElement===r||!r.contains(l.activeElement)||N)&&(m.preventDefault(),(m.shiftKey?E:H).focus())};return l.addEventListener("keydown",b),()=>{u.dispose();let m=a.at(-1)===f;if(a.splice(a.indexOf(f),1),l.removeEventListener("keydown",b),a.length===0&&we.delete(l),m){let x=C instanceof HTMLElement&&C.isConnected?C:a.at(-1)?.element;x!==void 0&&oe(x)}}},[e,t])}var re={keys:"dshpi_042ff8c4_keys",key:"dshpi_042ff8c4_key",tooltip:"dshpi_042ff8c4_tooltip",separator:"dshpi_042ff8c4_separator",joined:"dshpi_042ff8c4_joined"};var Pe=require("react/jsx-runtime");function Oe({keys:e,variant:t="plain",className:o}){return(0,Pe.jsx)("span",{className:I(re.keys,t==="tooltip"&&re.tooltip,t==="tooltip"&&e.includes("+")&&re.joined,o),children:e.map((n,r)=>(0,Pe.jsx)("kbd",{className:n==="+"?re.separator:re.key,children:n},r))})}var Q=require("react"),ze=require("react-dom");var ne={surface:"dshpi_a00a35bd_surface",backing:"dshpi_a00a35bd_backing",compact:"dshpi_a00a35bd_compact",material:"dshpi_a00a35bd_material"};var $=require("react/jsx-runtime"),He=(0,Q.forwardRef)(function({compact:t=!1,className:o,style:n,children:r,...l},u){let C=(0,Q.useId)(),a=(0,Q.useRef)(null);(0,Q.useLayoutEffect)(()=>{document.body.appendChild(a.current)},[]);let f={"--dsh-menu-anchor":`--dsh-menu-${C.replaceAll(":","")}`};return(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)("div",{...l,ref:u,"data-menu-material":"translucent",className:I(ne.surface,t&&ne.compact,o),style:{...n,...f},children:[(0,$.jsx)("div",{"aria-hidden":"true",className:ne.material}),r]}),(0,ze.createPortal)((0,$.jsx)("div",{ref:a,"aria-hidden":"true","data-menu-backing":"",className:I(ne.backing,t&&ne.compact),style:{...f,visibility:n?.visibility}}),document.body)]})});var w={root:"dshpi_1911279a_root",list:"dshpi_1911279a_list",submenu:"dshpi_1911279a_submenu",scrollable:"dshpi_1911279a_scrollable",viewport:"dshpi_1911279a_viewport",css:"dshpi_1911279a_css",portal:"dshpi_1911279a_portal",sideTop:"dshpi_1911279a_sideTop",alignEnd:"dshpi_1911279a_alignEnd",tsx:"dshpi_1911279a_tsx",footer:"dshpi_1911279a_footer",separator:"dshpi_1911279a_separator",itemWrap:"dshpi_1911279a_itemWrap",item:"dshpi_1911279a_item",denseList:"dshpi_1911279a_denseList",label:"dshpi_1911279a_label",compactList:"dshpi_1911279a_compactList",itemIcon:"dshpi_1911279a_itemIcon",check:"dshpi_1911279a_check",itemLabel:"dshpi_1911279a_itemLabel",shortcut:"dshpi_1911279a_shortcut",shortcutKeys:"dshpi_1911279a_shortcutKeys",selected:"dshpi_1911279a_selected",selectedFill:"dshpi_1911279a_selectedFill",danger:"dshpi_1911279a_danger"};var M=require("react/jsx-runtime");function e1(e){return"type"in e&&e.type==="separator"}function t1(e){return"type"in e&&e.type==="label"}var L1={visibility:"hidden",left:0,top:0};function Ne({open:e,anchor:t,items:o=[],children:n,selectedId:r,selectedIds:l,onSelect:u,onClose:C,align:a="start",side:f="bottom",portal:v=!1,closeOnPointerLeave:b=!1,dense:m=!1,compact:x=!1,autoFocus:y=!1,selection:H="check",getAnchorRect:E,footer:N,className:h,listClassName:F}){let d=(0,W.useRef)(null),c=(0,W.useRef)(null),A=(0,W.useRef)(null),j=(0,W.useRef)(null),X=(0,W.useRef)(!1),z=(i=!1)=>{let k=j.current,V=k!==null&&document.contains(k)&&!k.disabled?k:d.current?.querySelector("button:not(:disabled)");V!=null&&(i?V.focus():oe(V))},S=()=>{let i=X.current;queueMicrotask(()=>{if(Z.current)return;let k=document.activeElement;(k===null||k===document.body||c.current?.contains(k)===!0)&&z(i)})},Z=(0,W.useRef)(e);Z.current=e;let[ae,K]=(0,W.useState)(null),[le,Be]=(0,W.useState)(null),{arm:p1,cancel:xe}=Qe(C);(0,W.useLayoutEffect)(()=>{if(!e||!v){Be(null);return}let i=()=>{let _;if(E!==void 0?_=E():_=d.current?.getBoundingClientRect()??null,_===null)return;let L=12,de=window.innerWidth,g=window.innerHeight,U=c.current,ee=U?.offsetWidth??0,G=U?.offsetHeight??0,D,R;f==="right"?(D=_.right+4,R=_.top):a==="start"?(D=_.left,R=f==="bottom"?_.bottom+4:_.top-G-4):(D=_.right-ee,R=f==="bottom"?_.bottom+4:_.top-G-4),ee>0&&(D=Math.min(Math.max(D,L),de-ee-L)),G>0&&(R=Math.min(Math.max(R,$e(L)),g-G-L)),Be(te=>te?.left===D&&te.top===R?te:{left:D,top:R})};i();let k=()=>{i(),V=requestAnimationFrame(k)},V=requestAnimationFrame(k);return window.addEventListener("scroll",i,!0),window.addEventListener("resize",i),()=>{cancelAnimationFrame(V),window.removeEventListener("scroll",i,!0),window.removeEventListener("resize",i)}},[e,v,a,f,E]),(0,W.useEffect)(()=>{if(!e){j.current=null;return}let i=document.activeElement;j.current=i instanceof HTMLElement&&d.current?.contains(i)===!0?i:null},[e]),(0,W.useEffect)(()=>{if(!e||!y)return;let i=c.current?.querySelector("button:not(:disabled)");A.current=i==null?null:0,i!=null&&oe(i)},[e,y]),(0,W.useEffect)(()=>{if(!e){K(null),A.current=null;return}let i=me(document),k=g=>{g.target instanceof Node&&d.current?.contains(g.target)!==!0&&c.current?.contains(g.target)!==!0&&C()},V=g=>{if(i.guards(g)||Je(d.current)||g.defaultPrevented||g.ctrlKey||g.altKey||g.metaKey)return;let U=document.activeElement,ee=c.current?.contains(U)===!0,G=d.current?.contains(U)===!0||ee;if(g.key==="Escape"&&!g.shiftKey){if(g.preventDefault(),g.repeat)return;C(),(G||y)&&z()}if(g.key==="Tab"){let Fe=c.current;if(Fe===null||!G)return;if(g.shiftKey){g.preventDefault(),C(),z(!0);return}if(ee){if(U instanceof Element&&U.getAttribute("role")==="menuitem"){g.preventDefault(),X.current=!0;try{U.click()}finally{X.current=!1}}return}let De=Fe.querySelector("button:not(:disabled)");if(De===null)return;g.preventDefault(),De.focus(),A.current=0;return}if(!["ArrowDown","ArrowUp","Home","End"].includes(g.key))return;let D=c.current;if(D===null||!G)return;let R=Array.from(D.querySelectorAll("button:not(:disabled)"));if(R.length===0)return;let te=R.indexOf(U),Ze=te>=0?te:A.current,Te=g.key==="Home"?0:g.key==="End"?R.length-1:Ze===null?g.key==="ArrowDown"?0:R.length-1:(Ze+(g.key==="ArrowDown"?1:-1)+R.length)%R.length;g.preventDefault(),A.current=Te,R[Te]?.focus()},_=()=>{document.activeElement instanceof HTMLIFrameElement&&C()};document.addEventListener("pointerdown",k);let L=g=>{g.key==="Escape"&&V(g)},de=g=>{g.key!=="Escape"&&V(g)};return document.addEventListener("keydown",de),document.addEventListener("keydown",L,!0),window.addEventListener("blur",_),()=>{i.dispose(),document.removeEventListener("pointerdown",k),document.removeEventListener("keydown",de),document.removeEventListener("keydown",L,!0),window.removeEventListener("blur",_)}},[e,C,y]),(0,W.useEffect)(()=>{e||xe()},[e,xe]);let h1=!o.some(i=>!e1(i)&&!t1(i)&&i.submenu!==void 0&&i.submenu.length>0),Se=i=>{if(e1(i))return(0,M.jsx)("div",{className:w.separator,role:"separator"},i.id);if(t1(i))return(0,M.jsx)("div",{className:w.label,role:"presentation",children:i.text},i.id);let k=i.submenu!==void 0&&i.submenu.length>0,V=k&&ae===i.id,_=i.id===r||l?.includes(i.id)===!0;return(0,M.jsxs)("div",{className:w.itemWrap,onMouseEnter:k?()=>{K(i.id)}:void 0,onMouseLeave:()=>{K(null)},children:[(0,M.jsxs)("button",{type:"button",role:"menuitem",className:I(w.item,_&&(H==="fill"?w.selectedFill:w.selected),i.danger===!0&&w.danger),disabled:i.disabled,"aria-keyshortcuts":i.shortcut?.aria,"aria-haspopup":k?"menu":void 0,"aria-expanded":k?V:void 0,onFocus:k?()=>{K(i.id)}:void 0,onClick:()=>{if(k){K(i.id);return}u?.(i.id)},children:[i.icon!==void 0&&(0,M.jsx)("span",{className:w.itemIcon,children:i.icon}),(0,M.jsx)("span",{className:w.itemLabel,children:i.label}),i.shortcut!==void 0&&(0,M.jsx)("span",{"aria-hidden":"true",className:w.shortcut,children:(0,M.jsx)(Oe,{keys:i.shortcut.keys,className:w.shortcutKeys})}),_&&H==="check"&&(0,M.jsx)(Ce,{className:w.check})]}),V&&i.submenu!==void 0&&(0,M.jsx)(He,{compact:x,className:I(w.submenu,x&&w.compactList),role:"menu",children:i.submenu.map(L=>(0,M.jsxs)("button",{type:"button",role:"menuitem",className:w.item,disabled:L.disabled,"aria-keyshortcuts":L.shortcut?.aria,onClick:()=>{u?.(L.id),S()},children:[L.icon!==void 0&&(0,M.jsx)("span",{className:w.itemIcon,children:L.icon}),(0,M.jsx)("span",{className:w.itemLabel,children:L.label}),L.shortcut!==void 0&&(0,M.jsx)("span",{"aria-hidden":"true",className:w.shortcut,children:(0,M.jsx)(Oe,{keys:L.shortcut.keys,className:w.shortcutKeys})})]},L.id))})]},i.id)},Ve=i=>{let k=i.target instanceof Element?i.target.closest('button[role="menuitem"]'):null;k===null||k.getAttribute("aria-haspopup")==="menu"||k.closest('[role="menu"]')===i.currentTarget&&K(null)},be=e&&(0,M.jsxs)(He,{compact:x,ref:c,className:I(w.list,F,m&&w.denseList,x&&w.compactList,h1&&w.scrollable,v&&w.portal,f==="top"&&!v&&w.sideTop,a==="end"&&!v&&w.alignEnd),style:v?le??L1:void 0,role:"menu",onClick:i=>{i.stopPropagation();let k=i.target instanceof Element?i.target.closest('button[role="menuitem"]'):null;k!==null&&k.getAttribute("aria-haspopup")!=="menu"&&S()},onMouseOver:Ve,onFocus:Ve,children:[(0,M.jsxs)("div",{className:w.viewport,role:"presentation",children:[o.map(Se),n]}),N!==void 0&&N.length>0&&(0,M.jsx)("div",{className:w.footer,role:"presentation",children:N.map(Se)})]});return(0,M.jsxs)("span",{ref:d,className:I(w.root,h),onPointerEnter:b?xe:void 0,onPointerLeave:b?()=>{e&&p1()}:void 0,children:[t,v?be!==!1&&(0,o1.createPortal)(be,document.body):be]})}var r1=require("react"),n1=require("react-dom");var T={root:"dshpi_b97756f9_root",mask:"dshpi_b97756f9_mask",dialog:"dshpi_b97756f9_dialog",content:"dshpi_b97756f9_content",header:"dshpi_b97756f9_header",title:"dshpi_b97756f9_title",close:"dshpi_b97756f9_close",description:"dshpi_b97756f9_description",body:"dshpi_b97756f9_body",footer:"dshpi_b97756f9_footer"};var O=require("react/jsx-runtime");function ke({open:e,onClose:t,title:o,closeLabel:n,description:r,children:l,footer:u,className:C,contentClassName:a,onKeyDownCapture:f,headless:v=!1,backdropBlur:b=!0,shortcutModal:m}){let x=(0,r1.useRef)(null);return Xe(x,e,t),e?(0,n1.createPortal)((0,O.jsxs)("div",{className:T.root,role:"presentation",onKeyDownCapture:f,children:[(0,O.jsx)("div",{className:T.mask,style:b?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:t}),(0,O.jsx)("div",{ref:x,tabIndex:-1,"data-shortcut-modal":m,className:I(T.dialog,C),role:"dialog","aria-modal":"true","aria-label":o,children:v?l:(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)("div",{className:I(T.content,a),children:[(0,O.jsxs)("div",{className:T.header,children:[(0,O.jsx)("h2",{className:T.title,children:o}),(0,O.jsx)("button",{type:"button",className:T.close,"aria-label":n,onClick:t,children:(0,O.jsx)(qe,{size:14})})]}),r!==void 0&&r!==""&&(0,O.jsx)("p",{className:T.description,children:r}),l!==void 0&&(0,O.jsx)("div",{className:T.body,children:l})]}),u!==void 0&&(0,O.jsx)("div",{className:T.footer,children:u})]})})]}),document.body):null}var J={dot:"dshpi_34138a6f_dot",spinner:"dshpi_34138a6f_spinner",spinnerMotion:"dshpi_34138a6f_spinnerMotion",spinnerTrack:"dshpi_34138a6f_spinnerTrack",spinnerArc:"dshpi_34138a6f_spinnerArc",step:"dshpi_34138a6f_step"};var Y=require("react/jsx-runtime");function W1(e){e!==null&&(s1(e),e.addEventListener("animationstart",()=>{s1(e)}))}function s1(e){let t=e;for(let o of t.getAnimations?.({subtree:!0})??[])o.startTime=0}function Ae({state:e,size:t,className:o,appearance:n="dot"}){let r=t??(e==="ongoing"?14:10);return e==="ongoing"?(0,Y.jsx)("svg",{ref:W1,className:I(J.spinner,o),"data-state":"ongoing",width:r,height:r,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,Y.jsxs)("g",{className:J.spinnerMotion,children:[(0,Y.jsx)("circle",{className:J.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,Y.jsx)("circle",{className:J.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,Y.jsx)("span",{className:I(n==="step"?J.step:J.dot,o),"data-state":e,style:{width:r,height:r},"aria-hidden":"true",children:n==="step"&&e==="done"&&(0,Y.jsx)(Ce,{size:r-2})})}var P1=Object.freeze({status:"idle",entries:[],error:!1}),ve=class{constructor(t){this.connection=t,this.state=P1,this.listeners=new Set,this.pending=void 0,this.closed=!1,this.tickets=new Set}getSnapshot=()=>this.state;subscribe=t=>(this.listeners.add(t),()=>this.listeners.delete(t));publish(t){if(!this.closed){this.state=t;for(let o of this.listeners)o()}}async call(t,o={},n){let r=await this.connection.rpc.call("/api",`dsh-pi-login/${t}`,o,n);if(!r.ok)throw new Error(r.error.code);return r.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let t={abort:new AbortController};return t.promise=this.call("list",{},t.abort.signal).then(o=>{this.pending===t&&this.publish({status:"ready",entries:o,error:!1})},()=>{this.pending===t&&this.publish({...this.state,status:"ready",error:!0})}).finally(()=>{this.pending===t&&(this.pending=void 0)}),this.pending=t,this.publish({...this.state,status:"loading",error:!1}),t.promise}refresh(){let t=this.pending;return this.pending=void 0,t?.abort.abort(),this.load()}async start(t,o){let n=await this.call("start",{key:t,method:o});if(typeof n.ticket!="string")throw new Error("invalid ticket");if(this.closed)throw await this.call("cancel",n),new Error("disposed");return this.tickets.add(n.ticket),n.ticket}async cancel(t){this.tickets.delete(t);try{await this.call("cancel",{ticket:t})}finally{await this.refresh()}}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear();for(let t of this.tickets)this.call("cancel",{ticket:t}).catch(()=>{});this.tickets.clear()}};var i1={metaRateLimited:"Meta limited the account check. Wait before trying again.",reloadModels:"Update model list",catalogRefreshUnsupported:"Model list refresh is not supported for this provider yet. Update the plugin or SDK to get new models.",catalogRefreshFailed:"Could not update the model list. Try again or sign in again if needed.",metaSubscriptionActive:"Muse subscription active",metaSubscriptionInactive:"Muse subscription inactive",metaSubscriptionUnknown:"Muse subscription could not be confirmed",metaReloadHint:"Checks your Muse subscription and fetches its model list. New models start off. This does not test generation or Contributor billing. Reload again after restarting.",metaContributorHint:"Review Meta\u2019s Contributor data-use terms before enabling a Contributor model.",capabilitiesUnknown:"Capabilities not supplied: text only, provider-default reasoning, configured token limits.",metaLoginRequired:"Sign in to Meta with your Muse account first.",metaKeyOverride:"An API-key reference overrides your Muse login. Choose \u201CUse saved credentials\u201D or remove that reference first.",metaSettingsIncompatible:"Muse account reload requires the default Meta endpoint and saved login, without an Authorization header override.",metaAccountChanged:"Your Meta account changed during reload. Reload again.",useLogin:"Use saved credentials",keyOverride:"The configured API-key reference takes priority.",models:"Models",manageModels:"Choose models",useProvider:"Use this provider",searchModels:"Search models",fastWarning:"Fast mode uses paid priority processing or additional subscription credits. Availability depends on your account and model.",modelEnabled:"Use model",loading:"Loading\u2026",modelsFailed:"Could not load the models.",saveFailed:"Could not save settings. Try again.",modelsHint:"When the provider is on, selected models are available to chats and agents.",noResults:"No matching models.",disabledHint:"Turning this off keeps your credentials and model choices.",activateFirst:"Enable the provider before choosing models.",title:"Pi connections",description:"Choose a provider and sign-in method.",provider:"Provider",method:"Sign-in method",oauth:"Browser sign-in",apiKey:"API key",signIn:"Sign in",signInAgain:"Sign in again",connected:"Connected",notConnected:"Not connected",busy:"Signing in\u2026",openBrowser:"Continue in browser",code:"Verification code",copy:"Copy code",copied:"Copied",cancel:"Cancel",close:"Close",submit:"Continue",success:"Signed in",successDescription:"Your credentials are saved in DeepSeek Harness.",enable:"Enable provider",enabled:"Provider enabled.",failed:"Sign-in failed. Sign in again.",cancelled:"Sign-in cancelled. Sign in again.",providerExpired:"The verification code expired. Sign in again.",timedOut:"Sign-in timed out. Sign in again.",loadFailed:"Could not load the providers.",retry:"Retry",empty:"No Pi sign-in providers are available.",answer:"Enter the requested value",secret:"Enter your API key",selection:"Choose an option",enableFailed:"Signed in, but the provider could not be enabled. Try again.",waiting:"Complete the sign-in in your browser.",readOnly:"Credentials are read-only in this environment."},a1={metaRateLimited:"Meta\u306E\u5951\u7D04\u78BA\u8A8D\u304C\u56DE\u6570\u5236\u9650\u306B\u9054\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",reloadModels:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0",catalogRefreshUnsupported:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306F\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u518D\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC\u3067\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u30D7\u30E9\u30B0\u30A4\u30F3\u307E\u305F\u306FSDK\u306E\u66F4\u65B0\u3067\u8FFD\u52A0\u3055\u308C\u307E\u3059\u3002",catalogRefreshFailed:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3059\u308B\u304B\u3001\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30ED\u30B0\u30A4\u30F3\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSubscriptionActive:"Muse\u5951\u7D04\u306F\u6709\u52B9\u3067\u3059",metaSubscriptionInactive:"Muse\u5951\u7D04\u306F\u7121\u52B9\u3067\u3059",metaSubscriptionUnknown:"Muse\u5951\u7D04\u306E\u6709\u52B9\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",metaReloadHint:"\u5951\u7D04\u3092\u78BA\u8A8D\u3057\u3066\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002\u751F\u6210\u3084Contributor\u5229\u7528\u67A0\u306E\u691C\u8A3C\u306F\u884C\u3044\u307E\u305B\u3093\u3002\u518D\u8D77\u52D5\u5F8C\u306F\u518D\u8AAD\u307F\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059\u3002",metaContributorHint:"Contributor\u3092\u6709\u52B9\u306B\u3059\u308B\u524D\u306B\u3001Meta\u306E\u30C7\u30FC\u30BF\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",capabilitiesUnknown:"\u80FD\u529B\u60C5\u5831\u306A\u3057\uFF1A\u30C6\u30AD\u30B9\u30C8\u306E\u307F\u3001\u63A8\u8AD6\u306F\u63A5\u7D9A\u5148\u306E\u65E2\u5B9A\u5024\u3001\u30C8\u30FC\u30AF\u30F3\u4E0A\u9650\u306F\u8A2D\u5B9A\u5024\u3092\u4F7F\u7528\u3002",metaLoginRequired:"\u5148\u306BMuse\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067Meta\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaKeyOverride:"API\u30AD\u30FC\u53C2\u7167\u304CMuse\u30ED\u30B0\u30A4\u30F3\u3088\u308A\u512A\u5148\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u300C\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046\u300D\u3092\u9078\u3076\u304B\u3001\u53C2\u7167\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSettingsIncompatible:"Muse\u5951\u7D04\u306E\u518D\u8AAD\u307F\u8FBC\u307F\u306B\u306F\u3001Meta\u306E\u6A19\u6E96\u63A5\u7D9A\u5148\u3068\u4FDD\u5B58\u6E08\u307F\u30ED\u30B0\u30A4\u30F3\u3092\u4F7F\u3044\u3001Authorization\u30D8\u30C3\u30C0\u30FC\u306E\u4E0A\u66F8\u304D\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaAccountChanged:"\u518D\u8AAD\u307F\u8FBC\u307F\u4E2D\u306BMeta\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u8AAD\u307F\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002",useLogin:"\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046",keyOverride:"\u8A2D\u5B9A\u6E08\u307F\u306EAPI\u30AD\u30FC\u53C2\u7167\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002",models:"\u30E2\u30C7\u30EB",manageModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",useProvider:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",searchModels:"\u30E2\u30C7\u30EB\u3092\u691C\u7D22",fastWarning:"Fast\u30E2\u30FC\u30C9\u306F\u901A\u5E38\u3088\u308A\u9AD8\u3044\u6599\u91D1\u30FB\u30AF\u30EC\u30B8\u30C3\u30C8\u6D88\u8CBB\u304C\u767A\u751F\u3057\u307E\u3059\u3002\u5229\u7528\u53EF\u5426\u306F\u30E2\u30C7\u30EB\u3068\u5951\u7D04\u306B\u3088\u308A\u307E\u3059\u3002",modelEnabled:"\u30E2\u30C7\u30EB\u3092\u4F7F\u3046",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",modelsFailed:"\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",noResults:"\u4E00\u81F4\u3059\u308B\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002",disabledHint:"\u30AA\u30D5\u306B\u3057\u3066\u3082\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",activateFirst:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",title:"Pi\u63A5\u7D9A",description:"\u63A5\u7D9A\u5148\u3068\u30ED\u30B0\u30A4\u30F3\u65B9\u6CD5\u3092\u9078\u3073\u307E\u3059\u3002",provider:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",method:"\u63A5\u7D9A\u65B9\u6CD5",oauth:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3",apiKey:"API\u30AD\u30FC",signIn:"\u30ED\u30B0\u30A4\u30F3",signInAgain:"\u518D\u30ED\u30B0\u30A4\u30F3",connected:"\u63A5\u7D9A\u6E08\u307F",notConnected:"\u672A\u63A5\u7D9A",busy:"\u30ED\u30B0\u30A4\u30F3\u4E2D\u2026",openBrowser:"\u30D6\u30E9\u30A6\u30B6\u3067\u7D9A\u3051\u308B",code:"\u8A8D\u8A3C\u30B3\u30FC\u30C9",copy:"\u30B3\u30FC\u30C9\u3092\u30B3\u30D4\u30FC",copied:"\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",close:"\u9589\u3058\u308B",submit:"\u7D9A\u3051\u308B",success:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F",successDescription:"\u8A8D\u8A3C\u60C5\u5831\u3092DeepSeek Harness\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",enable:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",failed:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cancelled:"\u30ED\u30B0\u30A4\u30F3\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",providerExpired:"\u8A8D\u8A3C\u30B3\u30FC\u30C9\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",timedOut:"\u30ED\u30B0\u30A4\u30F3\u306E\u5F85\u6A5F\u6642\u9593\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loadFailed:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",retry:"\u518D\u8A66\u884C",empty:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u308BPi\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093\u3002",answer:"\u8981\u6C42\u3055\u308C\u305F\u5024\u3092\u5165\u529B",secret:"API\u30AD\u30FC\u3092\u5165\u529B",selection:"\u9805\u76EE\u3092\u9078\u629E",enableFailed:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u304C\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",waiting:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044\u3002",readOnly:"\u3053\u306E\u74B0\u5883\u3067\u306F\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002"};var l1=`.dsh-pi-login { color: var(--dsw-alias-label-primary); font-family: var(--dsw-font-family); font-size: 13px; line-height: 1.6; }
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
`;var d1=`/* Button sizes share the global control-radius scale. */
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
`;var s=require("react/jsx-runtime"),c1="dsh.piLogin",N1=["slots","locale","connection"];function A1(e){return(0,p.useSyncExternalStore)(t=>e.subscribe(t),()=>e.getSnapshot().revision),e.bind(c1)}function R1(e){try{let t=new URL(e);if(t.protocol==="https:"||t.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(t.hostname))return t.href}catch{}}function Re({label:e,value:t,options:o,onChange:n,disabled:r}){let[l,u]=(0,p.useState)(!1),C=(0,p.useId)();return(0,s.jsxs)("div",{className:"dsh-pi-choice",children:[(0,s.jsx)("span",{id:C,className:"dsh-pi-caption",children:e}),(0,s.jsx)(Ne,{open:l,onClose:()=>u(!1),portal:!0,selectedId:t,items:o,onSelect:a=>{n(a),u(!1)},anchor:(0,s.jsxs)(B,{variant:"outline",disabled:r,"aria-labelledby":C,"aria-haspopup":"menu","aria-expanded":l,onClick:()=>u(!l),className:"dsh-pi-choice-button",children:[(0,s.jsx)("span",{children:o.find(a=>a.id===t)?.label}),(0,s.jsx)(Le,{size:14})]})})]})}function E1({prompt:e,ticket:t,controller:o,t:n,onFailure:r}){let[l,u]=(0,p.useState)(""),[C,a]=(0,p.useState)(!1),f=(0,p.useId)();async function v(b){b.preventDefault();let m=l;u(""),a(!0);try{await o.call("answer",{ticket:t,id:e.id,value:m})}catch{r()}finally{a(!1)}}return(0,s.jsxs)("form",{onSubmit:v,className:"dsh-pi-prompt",children:[e.kind==="select"?(0,s.jsx)(Re,{label:e.message||n("selection"),value:l,options:e.options,onChange:u,disabled:C}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("label",{htmlFor:f,children:e.message||n(e.kind==="secret"?"secret":"answer")}),(0,s.jsx)(he,{id:f,"data-modal-autofocus":!0,type:e.kind==="secret"?"password":"text",autoComplete:"off",spellCheck:!1,value:l,placeholder:e.placeholder,onChange:b=>u(b.target.value)})]}),(0,s.jsx)("div",{className:"dsh-pi-actions",children:(0,s.jsx)(B,{type:"submit",variant:"primary",disabled:C||e.kind==="select"&&!l,children:n("submit")})})]})}function B1({entry:e,method:t,controller:o,t:n,onClose:r}){let l=(0,p.useRef)(),[u,C]=(0,p.useState)(),[a,f]=(0,p.useState)({status:"running"}),[v,b]=(0,p.useState)(!1),[m,x]=(0,p.useState)(!1),[y,H]=(0,p.useState)(!1),[E,N]=(0,p.useState)(!1),[h,F]=(0,p.useState)(!1),[d,c]=(0,p.useState)(!1);(0,p.useEffect)(()=>{let S=!0;return o.start(e.key,t).then(Z=>{l.current=Z,S?C(Z):o.cancel(Z).catch(()=>{})},()=>{S&&b(!0)}),()=>{S=!1,l.current&&o.cancel(l.current).catch(()=>{})}},[]),(0,p.useEffect)(()=>{if(!u)return;let S=!0,Z,ae=new AbortController;async function K(){try{let le=await o.call("state",{ticket:u},ae.signal);if(!S)return;f(le),le.status==="running"?Z=setTimeout(K,800):(o.tickets.delete(u),await o.refresh())}catch{S&&b(!0)}}return K(),()=>{S=!1,ae.abort(),clearTimeout(Z)}},[u]);let A=R1(a.notice?.url),j=a.status!=="running"||v,X=a.reason==="provider-expired"?"providerExpired":a.reason==="timeout"?"timedOut":a.status==="cancelled"?"cancelled":"failed";async function z(S=!1){x(!0),N(!1);try{await o.call(S?"use-login":"enable",{key:e.key}),H(!0),await o.refresh()}catch(Z){N(!0),F(Z.message.endsWith("/api-key-override"))}finally{x(!1)}}return(0,s.jsxs)(ke,{open:!0,onClose:r,title:e.label,closeLabel:n("close"),className:"dsh-pi-login",footer:(0,s.jsx)(B,{variant:"outline",onClick:r,children:n(j?"close":"cancel")}),children:[v||a.status==="failed"?(0,s.jsx)("p",{role:"alert",children:n(v?"failed":X)}):null,a.status==="authorized"?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{role:"status",children:n("success")}),(0,s.jsx)("p",{className:"dsh-pi-muted",children:n("successDescription")}),y?(0,s.jsx)("p",{role:"status",children:n("enabled")}):(0,s.jsx)(B,{variant:"primary",onClick:()=>{z()},disabled:m,children:n("enable")}),E?(0,s.jsx)("p",{role:"alert",children:n(h?"keyOverride":"enableFailed")}):null,h&&!y?(0,s.jsx)(B,{variant:"outline",onClick:()=>{z(!0)},disabled:m,children:n("useLogin")}):null]}):null,a.status==="cancelled"?(0,s.jsx)("p",{role:a.reason==="timeout"?"alert":"status",children:n(X)}):null,j?null:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{role:"status",children:a.notice?.message||n(A?"waiting":"busy")}),A?(0,s.jsx)("a",{className:"dsh-pi-link",href:A,target:"_blank",rel:"noopener noreferrer",children:n("openBrowser")}):null,a.notice?.code?(0,s.jsxs)("div",{className:"dsh-pi-verification",children:[(0,s.jsx)("span",{className:"dsh-pi-muted",children:n("code")}),(0,s.jsxs)("div",{className:"dsh-pi-verification-row",children:[(0,s.jsx)("code",{children:a.notice.code}),(0,s.jsx)(B,{size:"sm",variant:"outline",onClick:async()=>{try{await navigator.clipboard.writeText(a.notice.code),c(!0)}catch{c(!1)}},children:n(d?"copied":"copy")})]})]}):null,a.prompt?(0,s.jsx)(E1,{prompt:a.prompt,ticket:u,controller:o,t:n,onFailure:()=>b(!0)},a.prompt.id):null]})]})}function S1({entry:e,controller:t,t:o,onClose:n}){let[r,l]=(0,p.useState)(),[u,C]=(0,p.useState)(""),[a,f]=(0,p.useState)(!1),[v,b]=(0,p.useState)(!1),[m,x]=(0,p.useState)(""),y=(0,p.useRef)(),H=(0,p.useRef)(0);(0,p.useEffect)(()=>{let d=new AbortController;return t.call("models",{key:e.key},d.signal).then(l,()=>{d.signal.aborted||b(!0)}),()=>{d.abort(),y.current?.abort(),H.current++}},[e.key]);async function E(){let d=++H.current;y.current?.abort();let c=new AbortController;y.current=c,f(!0),x(""),b(!1);try{let A=await t.call("refresh-models",{key:e.key},c.signal);!c.signal.aborted&&d===H.current&&l(A)}catch(A){if(!c.signal.aborted&&d===H.current){let j=A.message.split("/").pop();x(r?.refresh?.errors?.[j]??"catalogRefreshFailed")}}finally{!c.signal.aborted&&d===H.current&&f(!1)}}async function N(d,c){f(!0),b(!1);try{await t.call("set-model",{key:e.key,model:d,enabled:c,revision:r.revision}),l(await t.call("models",{key:e.key}))}catch{b(!0);try{l(await t.call("models",{key:e.key}))}catch{}}finally{f(!1)}}let h=u.trim().toLowerCase(),F=r?.models.filter(d=>`${d.id} ${d.name}`.toLowerCase().includes(h));return(0,s.jsxs)(ke,{open:!0,title:`${e.label} \xB7 ${o("models")}`,description:o("modelsHint"),closeLabel:o("close"),onClose:n,className:"dsh-pi-login dsh-pi-models-dialog",footer:(0,s.jsx)(B,{variant:"outline",onClick:n,children:o("close")}),children:[(0,s.jsx)(he,{icon:(0,s.jsx)(_e,{size:16}),"aria-label":o("searchModels"),placeholder:o("searchModels"),"data-modal-autofocus":!0,value:u,onChange:d=>C(d.target.value)}),r?.refresh?.canRefresh?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(B,{variant:"outline",size:"sm",disabled:a||!e.writable,onClick:()=>{E()},children:o(a?"loading":"reloadModels")}),r.refresh.status?(0,s.jsxs)("p",{role:"status",children:[o(r.refresh.status.message),r.refresh.status.detail?` \xB7 ${r.refresh.status.detail}`:""]}):null,r.refresh.notes.map(d=>(0,s.jsx)("p",{className:"dsh-pi-muted",children:o(d)},d))]}):r?(0,s.jsx)("p",{className:"dsh-pi-muted",children:o("catalogRefreshUnsupported")}):null,m?(0,s.jsx)("p",{role:"alert",children:o(m)}):null,v?(0,s.jsx)("p",{role:"alert",children:o(r?"saveFailed":"modelsFailed")}):null,!r&&!v?(0,s.jsx)("p",{role:"status",children:o("loading")}):null,r&&!e.managed?(0,s.jsx)("p",{className:"dsh-pi-muted",children:o("activateFirst")}):null,r?.models.some(d=>d.fast)?(0,s.jsx)("p",{className:"dsh-pi-muted",children:o("fastWarning")}):null,(0,s.jsxs)("div",{className:"dsh-pi-model-list",children:[F?.map(d=>(0,s.jsxs)("div",{className:"dsh-pi-model-row",children:[(0,s.jsxs)("div",{className:"dsh-pi-model-label",children:[(0,s.jsx)("span",{children:d.name}),(0,s.jsx)("span",{className:"dsh-pi-model-id",children:d.id}),d.capabilityUnverified?(0,s.jsx)("span",{className:"dsh-pi-muted",children:o("capabilitiesUnknown")}):null]}),(0,s.jsx)(ue,{label:`${o("modelEnabled")}: ${d.name}`,checked:d.enabled,disabled:a||!e.writable||!e.managed,onChange:c=>{N(d.id,c)}})]},d.id)),F?.length===0?(0,s.jsx)("p",{className:"dsh-pi-muted",children:o("noResults")}):null]})]})}function Ee({controller:e,locale:t,provider:o}){let n=(0,p.useSyncExternalStore)(e.subscribe,e.getSnapshot),r=A1(t),[l,u]=(0,p.useState)("llm-pi-ai/openai"),[C,a]=(0,p.useState)("oauth"),[f,v]=(0,p.useState)(),[b,m]=(0,p.useState)(!1),[x,y]=(0,p.useState)(!1),[H,E]=(0,p.useState)(!1);(0,p.useEffect)(()=>{e.load()},[e]);let N=o?n.entries.filter(c=>c.provider===o.provider):n.entries,h=N.find(c=>c.key===l)||N[0],F=h?.methods.find(c=>c.id===C)||h?.methods[0];async function d(c){y(!0),E(!1);try{let A=await e.call("models",{key:h.key});await e.call("set-provider",{key:h.key,enabled:c,revision:A.revision}),await e.refresh()}catch{E(!0),await e.refresh()}finally{y(!1)}}return o&&!h&&!n.error?null:(0,s.jsxs)("section",{className:`dsh-pi-login ${o?"dsh-pi-card":"dsh-pi-footer"}`,children:[o?null:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("h3",{children:r("title")}),(0,s.jsx)("p",{className:"dsh-pi-muted",children:r("description")})]}),n.error?(0,s.jsxs)("p",{role:"alert",children:[r("loadFailed")," ",(0,s.jsx)(B,{size:"sm",onClick:()=>{e.refresh()},children:r("retry")})]}):null,n.status==="ready"&&!n.error&&N.length===0&&!o?(0,s.jsx)("p",{children:r("empty")}):null,h?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{className:"dsh-pi-fields",children:[o?null:(0,s.jsx)(Re,{label:r("provider"),value:h.key,options:N.map(c=>({id:c.key,label:c.label})),onChange:u,disabled:x}),h.methods.length>1?(0,s.jsx)(Re,{label:r("method"),value:F.id,options:h.methods.map(c=>({id:c.id,label:c.id==="oauth"?r("oauth"):c.id==="api-key"?r("apiKey"):c.label})),onChange:a,disabled:x}):null]}),(0,s.jsxs)("div",{className:"dsh-pi-account-row",children:[(0,s.jsxs)("span",{className:"dsh-pi-status",children:[(0,s.jsx)(Ae,{state:h.inFlight?"ongoing":h.configured?"done":"pending",size:10}),r(h.inFlight?"busy":h.configured?"connected":"notConnected")]}),(0,s.jsx)(B,{variant:h.configured?"outline":"primary",size:"sm",disabled:h.inFlight||!h.writable||!F,onClick:()=>v({entry:h,method:F.id}),children:r(h.configured?"signInAgain":"signIn")})]}),(0,s.jsxs)("div",{className:"dsh-pi-provider-row",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{children:r("useProvider")}),(0,s.jsx)("p",{className:"dsh-pi-muted",children:r("disabledHint")})]}),(0,s.jsx)(ue,{label:`${r("useProvider")}: ${h.label}`,checked:h.enabled,disabled:x||!h.writable||!h.configured&&!h.managed,onChange:c=>{d(c)}})]}),(0,s.jsx)(B,{variant:"outline",size:"sm",disabled:x,onClick:()=>m(!0),children:r("manageModels")}),H?(0,s.jsx)("p",{role:"alert",children:r("saveFailed")}):null,h.writable?null:(0,s.jsx)("p",{className:"dsh-pi-muted",children:r("readOnly")})]}):null,f?(0,s.jsx)(B1,{...f,controller:e,t:r,onClose:()=>v(void 0)}):null,b&&h?(0,s.jsx)(S1,{entry:h,controller:e,t:r,onClose:()=>m(!1)}):null]})}function V1(e){let t=new ve(e.connection);e.effect(()=>()=>t.dispose(),"dsh-pi-login: UI requests"),e.effect(()=>e.locale.register(c1,{en:i1,ja:a1}),"dsh-pi-login: copy"),e.effect(()=>{let n=document.createElement("style");return n.dataset.dshPiLogin="",n.textContent=d1+l1,document.head.append(n),()=>n.remove()},"dsh-pi-login: official controls"),e.on("connection/reset",()=>{t.refresh()});let o=()=>({controller:t,locale:e.locale});e.slots.inject("settings.models.footer",()=>e.slots.register({name:"settings.models.footer",id:"dsh-pi-login",order:10,inject:o},Ee)),e.slots.inject("settings.models.provider-card",()=>e.slots.register({name:"settings.models.provider-card",id:"dsh-pi-login",key:"dsh-pi-login",inject:o},Ee))}

return module.exports;}});
