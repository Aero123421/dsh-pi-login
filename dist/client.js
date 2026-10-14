window.__ModuleLoader__.load({id:"@local/dsh-pi-login",factory(require){const module={exports:{}};const exports=module.exports;
var Te=Object.defineProperty;var Mt=Object.getOwnPropertyDescriptor;var _t=Object.getOwnPropertyNames;var Pt=Object.prototype.hasOwnProperty;var Lt=(e,n)=>{for(var t in n)Te(e,t,{get:n[t],enumerable:!0})},Wt=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of _t(n))!Pt.call(e,i)&&i!==t&&Te(e,i,{get:()=>n[i],enumerable:!(r=Mt(n,i))||r.enumerable});return e};var Ot=e=>Wt(Te({},"__esModule",{value:!0}),e);var to={};Lt(to,{ConnectionUI:()=>yt,UpdateUI:()=>kt,apply:()=>eo,inject:()=>Kt});module.exports=Ot(to);var a=require("react");var Je=require("react");function Ye(e){var n,t,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var i=e.length;for(n=0;n<i;n++)e[n]&&(t=Ye(e[n]))&&(r&&(r+=" "),r+=t)}else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function Nt(){for(var e,n,t=0,r="",i=arguments.length;t<i;t++)(e=arguments[t])&&(n=Ye(e))&&(r&&(r+=" "),r+=n);return r}var H=Nt;var ke={button:"dshpi_13ed0003_button",md:"dshpi_13ed0003_md",sm:"dshpi_13ed0003_sm",primary:"dshpi_13ed0003_primary",ghost:"dshpi_13ed0003_ghost",outline:"dshpi_13ed0003_outline",toolbar:"dshpi_13ed0003_toolbar",icon:"dshpi_13ed0003_icon"};var Me=require("react/jsx-runtime"),M=(0,Je.forwardRef)(function({variant:n="ghost",size:t="md",icon:r,className:i,children:s,...c},l){return(0,Me.jsxs)("button",{ref:l,type:"button",className:H(ke.button,ke[n],ke[t],i),...c,children:[r!=null&&(0,Me.jsx)("span",{className:ke.icon,children:r}),s]})});var Xe=require("react");var _e={wrap:"dshpi_fda332f6_wrap",icon:"dshpi_fda332f6_icon",input:"dshpi_fda332f6_input"};var xe=require("react/jsx-runtime"),ne=(0,Xe.forwardRef)(function({icon:n,className:t,...r},i){return(0,xe.jsxs)("span",{className:H(_e.wrap,t),children:[n!=null&&(0,xe.jsx)("span",{className:_e.icon,children:n}),(0,xe.jsx)("input",{ref:i,className:_e.input,...r})]})});var Ve={switch:"dshpi_7ae83aee_switch",thumb:"dshpi_7ae83aee_thumb"};var Fe=require("react/jsx-runtime");function Pe({checked:e,onChange:n,label:t,disabled:r=!1,title:i,className:s}){return(0,Fe.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":t,title:i,disabled:r,className:H(Ve.switch,s),onClick:()=>{n(!e)},children:(0,Fe.jsx)("span",{className:Ve.thumb})})}var q=require("react"),ct=require("react-dom");var St=require("react");var et=require("react/jsx-runtime");var j=require("react/jsx-runtime");var Le=1;var Rt=({size:e=16,className:n,strokeWidth:t})=>(0,j.jsxs)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,j.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,j.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),We=e=>(0,j.jsx)(Rt,{...e,strokeWidth:Le});var At=({size:e=16,className:n,strokeWidth:t})=>(0,j.jsx)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,j.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),Oe=e=>(0,j.jsx)(At,{...e,strokeWidth:Le});var Ht=({size:e=14,className:n,strokeWidth:t})=>(0,j.jsx)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,j.jsx)("path",{d:"M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6",stroke:"currentColor"})}),De=e=>(0,j.jsx)(Ht,{...e,strokeWidth:Le});var Et=({size:e=16,className:n,strokeWidth:t})=>(0,j.jsxs)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,j.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,j.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),tt=e=>(0,j.jsx)(Et,{...e,strokeWidth:Le});function ot(e){let n=document.documentElement,t=Number.parseFloat(getComputedStyle(n).getPropertyValue("--dsh-frame-top-clearance"));return Number.isNaN(t)?e:Math.max(e,(n.hasAttribute("data-fullscreen")?0:t)+20)}var se=require("react"),Bt=200;function nt(e){let n=(0,se.useRef)(null),t=(0,se.useRef)(e);t.current=e;let r=(0,se.useCallback)(()=>{n.current!==null&&(clearTimeout(n.current),n.current=null)},[]),i=(0,se.useCallback)(()=>{r(),n.current=setTimeout(()=>{n.current=null,t.current()},Bt)},[r]);return(0,se.useEffect)(()=>r,[r]),{arm:i,cancel:r}}var Re=require("react");function Ne(e){let n=!1,t=!1,r=()=>{n=!0},i=()=>{n=!1,t=!0},s=()=>{t=!1},c=()=>{n=!1,t=!1};return e.addEventListener("compositionstart",r,!0),e.addEventListener("compositionend",i,!0),e.addEventListener("keyup",s,!0),e.defaultView?.addEventListener("blur",c),{guards:l=>{let u=n||t||l.isComposing||l.keyCode===229;return t=!1,u},dispose:()=>{e.removeEventListener("compositionstart",r,!0),e.removeEventListener("compositionend",i,!0),e.removeEventListener("keyup",s,!0),e.defaultView?.removeEventListener("blur",c)}}}var Ze=new WeakMap,Tt=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function ge(e,n){Ze.get(e)?.();let t=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",t),e.removeEventListener("keydown",r,!0),Ze.delete(e)},r=i=>{!i.isComposing&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&Tt.has(i.key)&&t()};Ze.set(e,t),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",t),e.addEventListener("keydown",r,!0),e.focus(n),e.matches(":focus")||t()}var Se=new WeakMap;function it(e){if(e===null)return!1;let n=Se.get(e.ownerDocument)?.at(-1);return n!==void 0&&!n.element.contains(e)}var rt='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function st(e,n,t){let r=(0,Re.useRef)(t);r.current=t,(0,Re.useLayoutEffect)(()=>{let i=e.current;if(!n||i===null)return;let s=i.ownerDocument,c=Ne(s),l=s.activeElement,u=Se.get(s)??[];Se.set(s,u);let b={element:i,close:()=>{r.current()}};u.push(b);let h=i.querySelector("[data-modal-autofocus]")??i.querySelector(rt)??i;i.contains(s.activeElement)||ge(h);let _=v=>{let g=c.guards(v);if(u.at(-1)!==b||v.defaultPrevented||g||v.ctrlKey||v.altKey||v.metaKey||(v.key==="Escape"&&!v.shiftKey&&(v.preventDefault(),v.repeat||r.current()),v.key!=="Tab")||s.activeElement?.closest('[role="menu"]'))return;let k=[...i.querySelectorAll(rt)].filter(f=>!f.closest("[inert], [hidden]")),m=k[0]??i,P=k.at(-1)??i,L=v.shiftKey?s.activeElement===m:s.activeElement===P;(s.activeElement===i||!i.contains(s.activeElement)||L)&&(v.preventDefault(),(v.shiftKey?P:m).focus())};return s.addEventListener("keydown",_),()=>{c.dispose();let v=u.at(-1)===b;if(u.splice(u.indexOf(b),1),s.removeEventListener("keydown",_),u.length===0&&Se.delete(s),v){let g=l instanceof HTMLElement&&l.isConnected?l:u.at(-1)?.element;g!==void 0&&ge(g)}}},[e,n])}var me={keys:"dshpi_042ff8c4_keys",key:"dshpi_042ff8c4_key",tooltip:"dshpi_042ff8c4_tooltip",separator:"dshpi_042ff8c4_separator",joined:"dshpi_042ff8c4_joined"};var Ue=require("react/jsx-runtime");function qe({keys:e,variant:n="plain",className:t}){return(0,Ue.jsx)("span",{className:H(me.keys,n==="tooltip"&&me.tooltip,n==="tooltip"&&e.includes("+")&&me.joined,t),children:e.map((r,i)=>(0,Ue.jsx)("kbd",{className:r==="+"?me.separator:me.key,children:r},i))})}var le=require("react"),at=require("react-dom");var fe={surface:"dshpi_a00a35bd_surface",backing:"dshpi_a00a35bd_backing",compact:"dshpi_a00a35bd_compact",material:"dshpi_a00a35bd_material"};var ae=require("react/jsx-runtime"),Ke=(0,le.forwardRef)(function({compact:n=!1,className:t,style:r,children:i,...s},c){let l=(0,le.useId)(),u=(0,le.useRef)(null);(0,le.useLayoutEffect)(()=>{document.body.appendChild(u.current)},[]);let b={"--dsh-menu-anchor":`--dsh-menu-${l.replaceAll(":","")}`};return(0,ae.jsxs)(ae.Fragment,{children:[(0,ae.jsxs)("div",{...s,ref:c,"data-menu-material":"translucent",className:H(fe.surface,n&&fe.compact,t),style:{...r,...b},children:[(0,ae.jsx)("div",{"aria-hidden":"true",className:fe.material}),i]}),(0,at.createPortal)((0,ae.jsx)("div",{ref:u,"aria-hidden":"true","data-menu-backing":"",className:H(fe.backing,n&&fe.compact),style:{...b,visibility:r?.visibility}}),document.body)]})});var O={root:"dshpi_1911279a_root",list:"dshpi_1911279a_list",submenu:"dshpi_1911279a_submenu",scrollable:"dshpi_1911279a_scrollable",viewport:"dshpi_1911279a_viewport",css:"dshpi_1911279a_css",portal:"dshpi_1911279a_portal",sideTop:"dshpi_1911279a_sideTop",alignEnd:"dshpi_1911279a_alignEnd",tsx:"dshpi_1911279a_tsx",footer:"dshpi_1911279a_footer",separator:"dshpi_1911279a_separator",itemWrap:"dshpi_1911279a_itemWrap",item:"dshpi_1911279a_item",denseList:"dshpi_1911279a_denseList",label:"dshpi_1911279a_label",compactList:"dshpi_1911279a_compactList",itemIcon:"dshpi_1911279a_itemIcon",check:"dshpi_1911279a_check",itemLabel:"dshpi_1911279a_itemLabel",shortcut:"dshpi_1911279a_shortcut",shortcutKeys:"dshpi_1911279a_shortcutKeys",selected:"dshpi_1911279a_selected",selectedFill:"dshpi_1911279a_selectedFill",danger:"dshpi_1911279a_danger"};var E=require("react/jsx-runtime");function lt(e){return"type"in e&&e.type==="separator"}function dt(e){return"type"in e&&e.type==="label"}var Vt={visibility:"hidden",left:0,top:0};function $e({open:e,anchor:n,items:t=[],children:r,selectedId:i,selectedIds:s,onSelect:c,onClose:l,align:u="start",side:b="bottom",portal:h=!1,closeOnPointerLeave:_=!1,dense:v=!1,compact:g=!1,autoFocus:k=!1,selection:m="check",getAnchorRect:P,footer:L,className:f,listClassName:A}){let y=(0,q.useRef)(null),S=(0,q.useRef)(null),K=(0,q.useRef)(null),$=(0,q.useRef)(null),B=(0,q.useRef)(!1),Z=(d=!1)=>{let p=$.current,F=p!==null&&document.contains(p)&&!p.disabled?p:y.current?.querySelector("button:not(:disabled)");F!=null&&(d?F.focus():ge(F))},R=()=>{let d=B.current;queueMicrotask(()=>{if(Q.current)return;let p=document.activeElement;(p===null||p===document.body||S.current?.contains(p)===!0)&&Z(d)})},Q=(0,q.useRef)(e);Q.current=e;let[C,x]=(0,q.useState)(null),[w,N]=(0,q.useState)(null),{arm:U,cancel:J}=nt(l);(0,q.useLayoutEffect)(()=>{if(!e||!h){N(null);return}let d=()=>{let V;if(P!==void 0?V=P():V=y.current?.getBoundingClientRect()??null,V===null)return;let D=12,ye=window.innerWidth,W=window.innerHeight,re=S.current,ue=re?.offsetWidth??0,ie=re?.offsetHeight??0,oe,z;b==="right"?(oe=V.right+4,z=V.top):u==="start"?(oe=V.left,z=b==="bottom"?V.bottom+4:V.top-ie-4):(oe=V.right-ue,z=b==="bottom"?V.bottom+4:V.top-ie-4),ue>0&&(oe=Math.min(Math.max(oe,D),ye-ue-D)),ie>0&&(z=Math.min(Math.max(z,ot(D)),W-ie-D)),N(he=>he?.left===oe&&he.top===z?he:{left:oe,top:z})};d();let p=()=>{d(),F=requestAnimationFrame(p)},F=requestAnimationFrame(p);return window.addEventListener("scroll",d,!0),window.addEventListener("resize",d),()=>{cancelAnimationFrame(F),window.removeEventListener("scroll",d,!0),window.removeEventListener("resize",d)}},[e,h,u,b,P]),(0,q.useEffect)(()=>{if(!e){$.current=null;return}let d=document.activeElement;$.current=d instanceof HTMLElement&&y.current?.contains(d)===!0?d:null},[e]),(0,q.useEffect)(()=>{if(!e||!k)return;let d=S.current?.querySelector("button:not(:disabled)");K.current=d==null?null:0,d!=null&&ge(d)},[e,k]),(0,q.useEffect)(()=>{if(!e){x(null),K.current=null;return}let d=Ne(document),p=W=>{W.target instanceof Node&&y.current?.contains(W.target)!==!0&&S.current?.contains(W.target)!==!0&&l()},F=W=>{if(d.guards(W)||it(y.current)||W.defaultPrevented||W.ctrlKey||W.altKey||W.metaKey)return;let re=document.activeElement,ue=S.current?.contains(re)===!0,ie=y.current?.contains(re)===!0||ue;if(W.key==="Escape"&&!W.shiftKey){if(W.preventDefault(),W.repeat)return;l(),(ie||k)&&Z()}if(W.key==="Tab"){let Qe=S.current;if(Qe===null||!ie)return;if(W.shiftKey){W.preventDefault(),l(),Z(!0);return}if(ue){if(re instanceof Element&&re.getAttribute("role")==="menuitem"){W.preventDefault(),B.current=!0;try{re.click()}finally{B.current=!1}}return}let ze=Qe.querySelector("button:not(:disabled)");if(ze===null)return;W.preventDefault(),ze.focus(),K.current=0;return}if(!["ArrowDown","ArrowUp","Home","End"].includes(W.key))return;let oe=S.current;if(oe===null||!ie)return;let z=Array.from(oe.querySelectorAll("button:not(:disabled)"));if(z.length===0)return;let he=z.indexOf(re),je=he>=0?he:K.current,Ge=W.key==="Home"?0:W.key==="End"?z.length-1:je===null?W.key==="ArrowDown"?0:z.length-1:(je+(W.key==="ArrowDown"?1:-1)+z.length)%z.length;W.preventDefault(),K.current=Ge,z[Ge]?.focus()},V=()=>{document.activeElement instanceof HTMLIFrameElement&&l()};document.addEventListener("pointerdown",p);let D=W=>{W.key==="Escape"&&F(W)},ye=W=>{W.key!=="Escape"&&F(W)};return document.addEventListener("keydown",ye),document.addEventListener("keydown",D,!0),window.addEventListener("blur",V),()=>{d.dispose(),document.removeEventListener("pointerdown",p),document.removeEventListener("keydown",ye),document.removeEventListener("keydown",D,!0),window.removeEventListener("blur",V)}},[e,l,k]),(0,q.useEffect)(()=>{e||J()},[e,J]);let I=!t.some(d=>!lt(d)&&!dt(d)&&d.submenu!==void 0&&d.submenu.length>0),T=d=>{if(lt(d))return(0,E.jsx)("div",{className:O.separator,role:"separator"},d.id);if(dt(d))return(0,E.jsx)("div",{className:O.label,role:"presentation",children:d.text},d.id);let p=d.submenu!==void 0&&d.submenu.length>0,F=p&&C===d.id,V=d.id===i||s?.includes(d.id)===!0;return(0,E.jsxs)("div",{className:O.itemWrap,onMouseEnter:p?()=>{x(d.id)}:void 0,onMouseLeave:()=>{x(null)},children:[(0,E.jsxs)("button",{type:"button",role:"menuitem",className:H(O.item,V&&(m==="fill"?O.selectedFill:O.selected),d.danger===!0&&O.danger),disabled:d.disabled,"aria-keyshortcuts":d.shortcut?.aria,"aria-haspopup":p?"menu":void 0,"aria-expanded":p?F:void 0,onFocus:p?()=>{x(d.id)}:void 0,onClick:()=>{if(p){x(d.id);return}c?.(d.id)},children:[d.icon!==void 0&&(0,E.jsx)("span",{className:O.itemIcon,children:d.icon}),(0,E.jsx)("span",{className:O.itemLabel,children:d.label}),d.shortcut!==void 0&&(0,E.jsx)("span",{"aria-hidden":"true",className:O.shortcut,children:(0,E.jsx)(qe,{keys:d.shortcut.keys,className:O.shortcutKeys})}),V&&m==="check"&&(0,E.jsx)(Oe,{className:O.check})]}),F&&d.submenu!==void 0&&(0,E.jsx)(Ke,{compact:g,className:H(O.submenu,g&&O.compactList),role:"menu",children:d.submenu.map(D=>(0,E.jsxs)("button",{type:"button",role:"menuitem",className:O.item,disabled:D.disabled,"aria-keyshortcuts":D.shortcut?.aria,onClick:()=>{c?.(D.id),R()},children:[D.icon!==void 0&&(0,E.jsx)("span",{className:O.itemIcon,children:D.icon}),(0,E.jsx)("span",{className:O.itemLabel,children:D.label}),D.shortcut!==void 0&&(0,E.jsx)("span",{"aria-hidden":"true",className:O.shortcut,children:(0,E.jsx)(qe,{keys:D.shortcut.keys,className:O.shortcutKeys})})]},D.id))})]},d.id)},pe=d=>{let p=d.target instanceof Element?d.target.closest('button[role="menuitem"]'):null;p===null||p.getAttribute("aria-haspopup")==="menu"||p.closest('[role="menu"]')===d.currentTarget&&x(null)},te=e&&(0,E.jsxs)(Ke,{compact:g,ref:S,className:H(O.list,A,v&&O.denseList,g&&O.compactList,I&&O.scrollable,h&&O.portal,b==="top"&&!h&&O.sideTop,u==="end"&&!h&&O.alignEnd),style:h?w??Vt:void 0,role:"menu",onClick:d=>{d.stopPropagation();let p=d.target instanceof Element?d.target.closest('button[role="menuitem"]'):null;p!==null&&p.getAttribute("aria-haspopup")!=="menu"&&R()},onMouseOver:pe,onFocus:pe,children:[(0,E.jsxs)("div",{className:O.viewport,role:"presentation",children:[t.map(T),r]}),L!==void 0&&L.length>0&&(0,E.jsx)("div",{className:O.footer,role:"presentation",children:L.map(T)})]});return(0,E.jsxs)("span",{ref:y,className:H(O.root,f),onPointerEnter:_?J:void 0,onPointerLeave:_?()=>{e&&U()}:void 0,children:[n,h?te!==!1&&(0,ct.createPortal)(te,document.body):te]})}var pt=require("react"),ut=require("react-dom");var ee={root:"dshpi_b97756f9_root",mask:"dshpi_b97756f9_mask",dialog:"dshpi_b97756f9_dialog",content:"dshpi_b97756f9_content",header:"dshpi_b97756f9_header",title:"dshpi_b97756f9_title",close:"dshpi_b97756f9_close",description:"dshpi_b97756f9_description",body:"dshpi_b97756f9_body",footer:"dshpi_b97756f9_footer"};var G=require("react/jsx-runtime");function Ce({open:e,onClose:n,title:t,closeLabel:r,description:i,children:s,footer:c,className:l,contentClassName:u,onKeyDownCapture:b,headless:h=!1,backdropBlur:_=!0,shortcutModal:v}){let g=(0,pt.useRef)(null);return st(g,e,n),e?(0,ut.createPortal)((0,G.jsxs)("div",{className:ee.root,role:"presentation",onKeyDownCapture:b,children:[(0,G.jsx)("div",{className:ee.mask,style:_?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:n}),(0,G.jsx)("div",{ref:g,tabIndex:-1,"data-shortcut-modal":v,className:H(ee.dialog,l),role:"dialog","aria-modal":"true","aria-label":t,children:h?s:(0,G.jsxs)(G.Fragment,{children:[(0,G.jsxs)("div",{className:H(ee.content,u),children:[(0,G.jsxs)("div",{className:ee.header,children:[(0,G.jsx)("h2",{className:ee.title,children:t}),(0,G.jsx)("button",{type:"button",className:ee.close,"aria-label":r,onClick:n,children:(0,G.jsx)(tt,{size:14})})]}),i!==void 0&&i!==""&&(0,G.jsx)("p",{className:ee.description,children:i}),s!==void 0&&(0,G.jsx)("div",{className:ee.body,children:s})]}),c!==void 0&&(0,G.jsx)("div",{className:ee.footer,children:c})]})})]}),document.body):null}var ce={dot:"dshpi_34138a6f_dot",spinner:"dshpi_34138a6f_spinner",spinnerMotion:"dshpi_34138a6f_spinnerMotion",spinnerTrack:"dshpi_34138a6f_spinnerTrack",spinnerArc:"dshpi_34138a6f_spinnerArc",step:"dshpi_34138a6f_step"};var de=require("react/jsx-runtime");function Ft(e){e!==null&&(ht(e),e.addEventListener("animationstart",()=>{ht(e)}))}function ht(e){let n=e;for(let t of n.getAnimations?.({subtree:!0})??[])t.startTime=0}function Ae({state:e,size:n,className:t,appearance:r="dot"}){let i=n??(e==="ongoing"?14:10);return e==="ongoing"?(0,de.jsx)("svg",{ref:Ft,className:H(ce.spinner,t),"data-state":"ongoing",width:i,height:i,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,de.jsxs)("g",{className:ce.spinnerMotion,children:[(0,de.jsx)("circle",{className:ce.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,de.jsx)("circle",{className:ce.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,de.jsx)("span",{className:H(r==="step"?ce.step:ce.dot,t),"data-state":e,style:{width:i,height:i},"aria-hidden":"true",children:r==="step"&&e==="done"&&(0,de.jsx)(Oe,{size:i-2})})}var Dt=Object.freeze({status:"idle",entries:[],integrations:[],services:[],error:!1}),He=class{constructor(n){this.connection=n,this.state=Dt,this.listeners=new Set,this.pending=void 0,this.closed=!1,this.tickets=new Map}getSnapshot=()=>this.state;subscribe=n=>(this.listeners.add(n),()=>this.listeners.delete(n));publish(n){if(!this.closed){this.state=n;for(let t of this.listeners)t()}}async call(n,t={},r){let i=await this.connection.rpc.call("/api",`dsh-pi-login/${n}`,t,r);if(!i.ok){let s=new Error(i.error.code);throw s.code=i.error.code,s}return i.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let n={abort:new AbortController};return n.promise=this.call("connection-list",{},n.abort.signal).then(t=>{this.pending===n&&this.publish({status:"ready",...t,entries:t.connections??[],error:!1})},()=>{this.pending===n&&this.publish({...this.state,status:"ready",error:!0})}).finally(()=>{this.pending===n&&(this.pending=void 0)}),this.pending=n,this.publish({...this.state,status:"loading",error:!1}),n.promise}refresh(){let n=this.pending;return this.pending=void 0,n?.abort.abort(),this.load()}scope(){let{profileKey:n,generation:t}=this.state;return{profileKey:n,generation:t}}isCurrent(n){return this.closed||n.profileKey!==this.state.profileKey||n.generation!==this.state.generation?!1:n.credentialGeneration!==void 0?this.state.entries.some(t=>t.connectionId===n.connectionId&&t.credentialGeneration===n.credentialGeneration):!0}assertCurrent(n){if(this.isCurrent(n))return;let t=!this.closed&&n.profileKey===this.state.profileKey&&n.generation===this.state.generation?"connection-changed":"profile-changed",r=new Error(t);throw r.code=t,r}scoped(n){let t={...this.scope(),...n?.credentialGeneration!==void 0?{connectionId:n.connectionId,credentialGeneration:n.credentialGeneration}:{}},r=async(s,c={},l)=>{this.assertCurrent(t);let u=await this.call(s,{...c,...t},l);return this.assertCurrent(t),u},i={scoped:()=>i,tickets:this.tickets,call:r,mutation:r,start:(s,c)=>this.start(s,c,t),cancel:s=>this.cancel(s,t),refresh:async()=>{this.assertCurrent(t),await this.refresh(),this.assertCurrent(t)},getSnapshot:this.getSnapshot};return i}mutation(n,t={},r){return this.call(n,{...t,...this.scope()},r)}async start(n,t,r=this.scope()){this.assertCurrent(r);let i=await this.call("start",{connectionId:n,method:t,...r});if(typeof i.ticket!="string")throw new Error("invalid ticket");return this.isCurrent(r)||(await this.call("cancel",{...i,...r}).catch(()=>{}),this.assertCurrent(r)),this.tickets.set(i.ticket,r),i.ticket}async cancel(n,t=this.tickets.get(n)??this.scope()){this.tickets.delete(n);try{await this.call("cancel",{ticket:n,...t})}finally{this.isCurrent(t)&&await this.refresh()}}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear();for(let[n,t]of this.tickets)this.call("cancel",{ticket:n,...t}).catch(()=>{});this.tickets.clear()}};var Zt="dsh-pi-login:update",Ee=class{constructor(n,t){if(t===void 0)try{t=globalThis.sessionStorage}catch{}this.connection=n,this.storage=t,this.listeners=new Set,this.state={status:"blocked",reason:"manager-unavailable"},this.generation=0,this.closed=!1,this.timer=null,this.profileKey=void 0,this.requestId=void 0}getSnapshot=()=>this.state;subscribe=n=>(this.listeners.add(n),()=>this.listeners.delete(n));storageKey(){return this.profileKey?`${Zt}:${this.profileKey}`:void 0}selectProfile(n){let t=typeof n=="string"&&/^[a-f0-9]{64}$/.test(n)?n:void 0;if(t!==this.profileKey&&(this.profileKey=t,this.requestId=void 0,t))try{this.requestId=this.storage?.getItem(this.storageKey())||void 0}catch{}}publish(n){if(!this.closed){n.profileKey&&this.selectProfile(n.profileKey),this.state=n;for(let t of this.listeners)t()}}async call(n,t={}){if(!this.connection)return{status:"blocked",reason:"manager-unavailable"};let r=await this.connection.rpc.call("/api",`dsh-pi-login/update-${n}`,t);if(!r.ok){let i=new Error(r.error.code);throw i.rejected=!0,i}return r.value}async load(){if(this.closed)return;let n=++this.generation;clearTimeout(this.timer);try{let t=await this.call("status");if(this.closed||n!==this.generation)return;this.selectProfile(t.profileKey),t.requestId&&(this.requestId=t.requestId);let r=this.requestId?await this.call("reconcile",{requestId:this.requestId,profileKey:this.profileKey}):t;if(this.closed||n!==this.generation)return;if(r.requestId){this.requestId=r.requestId;try{this.storage?.setItem(this.storageKey(),r.requestId)}catch{}}this.publish(r),["preparing","installing"].includes(r.status)&&(this.timer=setTimeout(()=>{this.load()},800))}catch{n===this.generation&&this.publish({...this.state,status:this.requestId?"unknown":"blocked",reason:"network"})}}async check(){if(this.closed||["checking","preparing","installing","starting","unknown"].includes(this.state.status))return;let n=++this.generation;this.publish({...this.state,status:"checking"});try{let t=await this.call("check");n===this.generation&&this.publish(t)}catch{n===this.generation&&this.publish({...this.state,status:"blocked",reason:"network"})}}async begin(){if(this.closed||!this.profileKey||this.state.status!=="available")return;let n=this.state.candidate,t=++this.generation;this.requestId=crypto.randomUUID();try{this.storage?.setItem(this.storageKey(),this.requestId)}catch{}this.publish({...this.state,status:"starting"});try{let r=await this.call("begin",{candidateId:n.id,requestId:this.requestId,profileKey:this.profileKey});if(this.closed||t!==this.generation)return;if(typeof r.requestId!="string")throw new Error("invalid request");this.requestId=r.requestId;try{this.storage?.setItem(this.storageKey(),r.requestId)}catch{}t===this.generation&&(this.publish({...this.state,...r}),await this.load())}catch(r){if(this.closed||t!==this.generation)return;if(r.rejected){this.requestId=void 0;try{this.storage?.removeItem(this.storageKey())}catch{}}t===this.generation&&this.publish({...this.state,status:r.rejected?"failed":"unknown",reason:r.message.endsWith("/busy")?"busy":r.message.endsWith("/profile")?"profile":"network"})}}dispose(){this.closed=!0,this.generation++,clearTimeout(this.timer),this.listeners.clear()}};var Y={updateReason_storage:"Could not write the update files to the profile.",updateReason_interrupted:"The download was interrupted before installation. Check again.",updateTitle:"Pi plugin",updateIdle:"Check for a plugin release separately from the model catalog.",updateChecking:"Checking for updates\u2026",updateCurrent:"No newer stable release.",updateAvailable:"A plugin update is available. Your saved credentials and model choices are kept.",updateBlocked:"The update could not be checked or is unavailable.",updatePreparing:"Downloading and verifying the release\u2026",updateInstalling:"Installing the plugin\u2026",updateRestart:"Installed. Restart DSH when your current work is finished to apply the update.",updateApplied:"The updated plugin version is running.",updateFailed:"Update failed. Review the stage below and check again.",updateCancelled:"The installer confirmed cancellation.",updateOverridden:"Saved settings prevent the update from applying.",updateSuperseded:"A newer plugin version is already running. This earlier update does not need a restart.",updateUnknown:"The installation result is unknown. Reconcile the operation before starting another update.",updateCheck:"Check plugin update",updateInstall:"Update plugin",updateReconcile:"Check installation result",updateManual:"Releases / manual update",updateChecked:"Last checked",updateStage:"Installer stage","updateReason_manager-unavailable":"Plugin manager or writable profile is unavailable. Use the Releases page.","updateReason_read-only":"This bundle is not writable in the active profile.",updateReason_source:"This installation source requires a manual update. Its version pin will be preserved.",updateReason_incompatible:"The release does not support this DSH version.","updateReason_compatibility-unknown":"The release compatibility could not be confirmed.",updateReason_busy:"Finish sign-in and settings saves before updating.",updateReason_profile:"The connected profile changed. Check again.",updateReason_network:"Could not contact the release service. Try again later.",updateReason_metadata:"Release metadata is invalid. Use the release link to review it.",updateReason_asset:"The required release assets are missing or ambiguous.",updateReason_channel:"This update accepts stable releases only.",updateReason_checksum:"Release checksum verification failed.",updateReason_redirect:"The release redirected to an unapproved host.",updateReason_size:"The release exceeded its download size limit.","updateReason_stale-candidate":"The release or installation changed. Check again.","updateReason_release-unavailable":"The release service returned no accessible release.",metaRateLimited:"Meta limited the account check. Wait before trying again.",reloadModels:"Update model list",catalogRefreshUnsupported:"Model list refresh is not supported for this provider yet. Update the plugin or SDK to get new models.",catalogRefreshFailed:"Could not update the model list. Try again or sign in again if needed.",metaSubscriptionActive:"Muse subscription active",metaSubscriptionInactive:"Muse subscription inactive",metaSubscriptionUnknown:"Muse subscription could not be confirmed",metaReloadHint:"Checks your Muse subscription and fetches its model list. New models start off. This does not test generation or Contributor billing. Reload again after restarting.",metaContributorHint:"Review Meta\u2019s Contributor data-use terms before enabling a Contributor model.",capabilitiesUnknown:"Capabilities not supplied: text only, provider-default reasoning, configured token limits.",metaLoginRequired:"Sign in to Meta with your Muse account first.",metaKeyOverride:"An API-key reference overrides your Muse login. Choose \u201CUse saved credentials\u201D or remove that reference first.",metaSettingsIncompatible:"Muse account reload requires the default Meta endpoint and saved login, without an Authorization header override.",metaAccountChanged:"Your Meta account changed during reload. Reload again.",useLogin:"Use saved credentials",keyOverride:"The configured API-key reference takes priority.",models:"Models",manageModels:"Choose models",useProvider:"Use this provider",searchModels:"Search models",fastWarning:"Fast mode uses paid priority processing or additional subscription credits. Availability depends on your account and model.",modelEnabled:"Use model",loading:"Loading\u2026",modelsFailed:"Could not load the models.",saveFailed:"Could not save settings. Try again.",modelsHint:"When the provider is on, selected models are available to chats and agents.",noResults:"No matching models.",disabledHint:"Turning this off keeps your credentials and model choices.",activateFirst:"Enable the provider before choosing models.",title:"Pi connections",description:"Choose a provider and sign-in method.",provider:"Provider",method:"Sign-in method",oauth:"Browser sign-in",apiKey:"API key",signIn:"Sign in",signInAgain:"Sign in again",connected:"Connected",notConnected:"Not connected",busy:"Signing in\u2026",openBrowser:"Continue in browser",code:"Verification code",copy:"Copy code",copied:"Copied",cancel:"Cancel",close:"Close",submit:"Continue",success:"Signed in",successDescription:"Your credentials are saved in DeepSeek Harness.",enable:"Enable provider",enabled:"Provider enabled.",failed:"Sign-in failed. Sign in again.",cancelled:"Sign-in cancelled. Sign in again.",providerExpired:"The verification code expired. Sign in again.",timedOut:"Sign-in timed out. Sign in again.",loadFailed:"Could not load the providers.",retry:"Retry",empty:"No Pi sign-in providers are available.",answer:"Enter the requested value",secret:"Enter your API key",selection:"Choose an option",enableFailed:"Signed in, but the provider could not be enabled. Try again.",waiting:"Complete the sign-in in your browser.",readOnly:"Credentials are read-only in this environment."},X={updateReason_storage:"profile\u5185\u306B\u66F4\u65B0\u7528\u30D5\u30A1\u30A4\u30EB\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_interrupted:"\u5C0E\u5165\u524D\u306E\u53D6\u5F97\u51E6\u7406\u304C\u4E2D\u65AD\u3055\u308C\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateTitle:"Pi\u30D7\u30E9\u30B0\u30A4\u30F3",updateIdle:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3068\u306F\u5225\u306B\u3001\u30D7\u30E9\u30B0\u30A4\u30F3\u672C\u4F53\u306E\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",updateChecking:"\u66F4\u65B0\u3092\u78BA\u8A8D\u4E2D\u2026",updateCurrent:"\u65B0\u3057\u3044\u6B63\u5F0F\u7248\u306F\u3042\u308A\u307E\u305B\u3093\u3002",updateAvailable:"\u66F4\u65B0\u304C\u3042\u308A\u307E\u3059\u3002\u4FDD\u5B58\u6E08\u307F\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateBlocked:"\u66F4\u65B0\u3092\u78BA\u8A8D\u3067\u304D\u306A\u3044\u304B\u3001\u3053\u306E\u74B0\u5883\u3067\u306F\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002",updatePreparing:"\u914D\u5E03\u7269\u3092\u53D6\u5F97\u30FB\u691C\u8A3C\u4E2D\u2026",updateInstalling:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u4E2D\u2026",updateRestart:"\u5C0E\u5165\u3057\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u4F5C\u696D\u3092\u7D42\u3048\u3066\u304B\u3089DSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u9069\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateApplied:"\u66F4\u65B0\u3057\u305F\u30D7\u30E9\u30B0\u30A4\u30F3\u304C\u52D5\u4F5C\u3057\u3066\u3044\u307E\u3059\u3002",updateFailed:"\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u5931\u6557\u6BB5\u968E\u3092\u78BA\u8A8D\u3057\u3066\u518D\u5EA6\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCancelled:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30E9\u30FC\u304C\u53D6\u6D88\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",updateOverridden:"\u4FDD\u5B58\u8A2D\u5B9A\u306B\u3088\u308A\u66F4\u65B0\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3002",updateSuperseded:"\u3088\u308A\u65B0\u3057\u3044\u7248\u304C\u52D5\u4F5C\u3057\u3066\u3044\u307E\u3059\u3002\u3053\u306E\u66F4\u65B0\u8A18\u9332\u306E\u305F\u3081\u306E\u518D\u8D77\u52D5\u306F\u4E0D\u8981\u3067\u3059\u3002",updateUnknown:"\u5C0E\u5165\u7D50\u679C\u306F\u4E0D\u660E\u3067\u3059\u3002\u518D\u9001\u305B\u305A\u3001\u7D50\u679C\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCheck:"\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u66F4\u65B0\u3092\u78BA\u8A8D",updateInstall:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u66F4\u65B0\u3059\u308B",updateReconcile:"\u5C0E\u5165\u7D50\u679C\u3092\u78BA\u8A8D",updateManual:"\u914D\u5E03\u7248\u30FB\u624B\u52D5\u66F4\u65B0",updateChecked:"\u78BA\u8A8D\u6642\u523B",updateStage:"\u5C0E\u5165\u6BB5\u968E","updateReason_manager-unavailable":"plugin manager\u307E\u305F\u306F\u66F8\u304D\u8FBC\u307F\u53EF\u80FD\u306Aprofile\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u304B\u3089\u624B\u52D5\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_read-only":"\u3053\u306Eprofile\u3067\u306Fbundle\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_source:"\u3053\u306E\u5C0E\u5165\u5143\u306F\u624B\u52D5\u66F4\u65B0\u304C\u5FC5\u8981\u3067\u3059\u3002\u7248\u56FA\u5B9A\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateReason_incompatible:"\u3053\u306E\u914D\u5E03\u7248\u306F\u5B9F\u884C\u4E2D\u306EDSH\u7248\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","updateReason_compatibility-unknown":"\u914D\u5E03\u7248\u306EDSH\u4E92\u63DB\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_busy:"\u30ED\u30B0\u30A4\u30F3\u3068\u8A2D\u5B9A\u4FDD\u5B58\u3092\u5B8C\u4E86\u3057\u3066\u304B\u3089\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_profile:"\u63A5\u7D9A\u4E2D\u306E\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_network:"\u914D\u5E03\u30B5\u30FC\u30D3\u30B9\u3068\u306E\u901A\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_metadata:"\u914D\u5E03\u60C5\u5831\u304C\u4E0D\u6B63\u3067\u3059\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_asset:"\u5FC5\u8981\u306A\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u306A\u3044\u304B\u3001\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002",updateReason_channel:"\u3053\u306E\u66F4\u65B0\u6A5F\u80FD\u306F\u6B63\u5F0F\u7248\u306E\u307F\u6271\u3044\u307E\u3059\u3002",updateReason_checksum:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u306E\u30C1\u30A7\u30C3\u30AF\u30B5\u30E0\u691C\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",updateReason_redirect:"\u914D\u5E03\u53D6\u5F97\u5148\u304C\u8A31\u53EF\u3057\u3066\u3044\u306A\u3044\u30DB\u30B9\u30C8\u306B\u8EE2\u9001\u3055\u308C\u307E\u3057\u305F\u3002",updateReason_size:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u53D6\u5F97\u30B5\u30A4\u30BA\u4E0A\u9650\u3092\u8D85\u3048\u307E\u3057\u305F\u3002","updateReason_stale-candidate":"\u914D\u5E03\u60C5\u5831\u307E\u305F\u306F\u5C0E\u5165\u72B6\u614B\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_release-unavailable":"\u53D6\u5F97\u3067\u304D\u308B\u914D\u5E03\u7248\u304C\u3042\u308A\u307E\u305B\u3093\u3002",metaRateLimited:"Meta\u306E\u5951\u7D04\u78BA\u8A8D\u304C\u56DE\u6570\u5236\u9650\u306B\u9054\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",reloadModels:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0",catalogRefreshUnsupported:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306F\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u518D\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC\u3067\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u30D7\u30E9\u30B0\u30A4\u30F3\u307E\u305F\u306FSDK\u306E\u66F4\u65B0\u3067\u8FFD\u52A0\u3055\u308C\u307E\u3059\u3002",catalogRefreshFailed:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3059\u308B\u304B\u3001\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30ED\u30B0\u30A4\u30F3\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSubscriptionActive:"Muse\u5951\u7D04\u306F\u6709\u52B9\u3067\u3059",metaSubscriptionInactive:"Muse\u5951\u7D04\u306F\u7121\u52B9\u3067\u3059",metaSubscriptionUnknown:"Muse\u5951\u7D04\u306E\u6709\u52B9\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",metaReloadHint:"\u5951\u7D04\u3092\u78BA\u8A8D\u3057\u3066\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002\u751F\u6210\u3084Contributor\u5229\u7528\u67A0\u306E\u691C\u8A3C\u306F\u884C\u3044\u307E\u305B\u3093\u3002\u518D\u8D77\u52D5\u5F8C\u306F\u518D\u8AAD\u307F\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059\u3002",metaContributorHint:"Contributor\u3092\u6709\u52B9\u306B\u3059\u308B\u524D\u306B\u3001Meta\u306E\u30C7\u30FC\u30BF\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",capabilitiesUnknown:"\u80FD\u529B\u60C5\u5831\u306A\u3057\uFF1A\u30C6\u30AD\u30B9\u30C8\u306E\u307F\u3001\u63A8\u8AD6\u306F\u63A5\u7D9A\u5148\u306E\u65E2\u5B9A\u5024\u3001\u30C8\u30FC\u30AF\u30F3\u4E0A\u9650\u306F\u8A2D\u5B9A\u5024\u3092\u4F7F\u7528\u3002",metaLoginRequired:"\u5148\u306BMuse\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067Meta\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaKeyOverride:"API\u30AD\u30FC\u53C2\u7167\u304CMuse\u30ED\u30B0\u30A4\u30F3\u3088\u308A\u512A\u5148\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u300C\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046\u300D\u3092\u9078\u3076\u304B\u3001\u53C2\u7167\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSettingsIncompatible:"Muse\u5951\u7D04\u306E\u518D\u8AAD\u307F\u8FBC\u307F\u306B\u306F\u3001Meta\u306E\u6A19\u6E96\u63A5\u7D9A\u5148\u3068\u4FDD\u5B58\u6E08\u307F\u30ED\u30B0\u30A4\u30F3\u3092\u4F7F\u3044\u3001Authorization\u30D8\u30C3\u30C0\u30FC\u306E\u4E0A\u66F8\u304D\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaAccountChanged:"\u518D\u8AAD\u307F\u8FBC\u307F\u4E2D\u306BMeta\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u8AAD\u307F\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002",useLogin:"\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046",keyOverride:"\u8A2D\u5B9A\u6E08\u307F\u306EAPI\u30AD\u30FC\u53C2\u7167\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002",models:"\u30E2\u30C7\u30EB",manageModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",useProvider:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",searchModels:"\u30E2\u30C7\u30EB\u3092\u691C\u7D22",fastWarning:"Fast\u30E2\u30FC\u30C9\u306F\u901A\u5E38\u3088\u308A\u9AD8\u3044\u6599\u91D1\u30FB\u30AF\u30EC\u30B8\u30C3\u30C8\u6D88\u8CBB\u304C\u767A\u751F\u3057\u307E\u3059\u3002\u5229\u7528\u53EF\u5426\u306F\u30E2\u30C7\u30EB\u3068\u5951\u7D04\u306B\u3088\u308A\u307E\u3059\u3002",modelEnabled:"\u30E2\u30C7\u30EB\u3092\u4F7F\u3046",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",modelsFailed:"\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",noResults:"\u4E00\u81F4\u3059\u308B\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002",disabledHint:"\u30AA\u30D5\u306B\u3057\u3066\u3082\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",activateFirst:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",title:"Pi\u63A5\u7D9A",description:"\u63A5\u7D9A\u5148\u3068\u30ED\u30B0\u30A4\u30F3\u65B9\u6CD5\u3092\u9078\u3073\u307E\u3059\u3002",provider:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",method:"\u63A5\u7D9A\u65B9\u6CD5",oauth:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3",apiKey:"API\u30AD\u30FC",signIn:"\u30ED\u30B0\u30A4\u30F3",signInAgain:"\u518D\u30ED\u30B0\u30A4\u30F3",connected:"\u63A5\u7D9A\u6E08\u307F",notConnected:"\u672A\u63A5\u7D9A",busy:"\u30ED\u30B0\u30A4\u30F3\u4E2D\u2026",openBrowser:"\u30D6\u30E9\u30A6\u30B6\u3067\u7D9A\u3051\u308B",code:"\u8A8D\u8A3C\u30B3\u30FC\u30C9",copy:"\u30B3\u30FC\u30C9\u3092\u30B3\u30D4\u30FC",copied:"\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",close:"\u9589\u3058\u308B",submit:"\u7D9A\u3051\u308B",success:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F",successDescription:"\u8A8D\u8A3C\u60C5\u5831\u3092DeepSeek Harness\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",enable:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",failed:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cancelled:"\u30ED\u30B0\u30A4\u30F3\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",providerExpired:"\u8A8D\u8A3C\u30B3\u30FC\u30C9\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",timedOut:"\u30ED\u30B0\u30A4\u30F3\u306E\u5F85\u6A5F\u6642\u9593\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loadFailed:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",retry:"\u518D\u8A66\u884C",empty:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u308BPi\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093\u3002",answer:"\u8981\u6C42\u3055\u308C\u305F\u5024\u3092\u5165\u529B",secret:"API\u30AD\u30FC\u3092\u5165\u529B",selection:"\u9805\u76EE\u3092\u9078\u629E",enableFailed:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u304C\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",waiting:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044\u3002",readOnly:"\u3053\u306E\u74B0\u5883\u3067\u306F\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002"};Object.assign(Y,{settingsShort:"Settings",providerDefault:"Provider default",credentialCleanupPending:"Some retired credentials still need removal. Retry cleanup to keep the current account and remove those records.",credentialCleanupShort:"Key cleanup incomplete",retryCredentialCleanup:"Retry key cleanup",credentialCleanupFailed:"The connection change was saved, but retired credentials could not be removed. Retry key cleanup.",credentialSaveFailed:"Credentials could not be saved. Reopen settings to review the current connection before retrying.",createdCredentialFailed:"The connection was created, but its credentials could not be saved. Close this dialog and open the created connection\u2019s Settings to enter the key again or delete it.",connectionChanged:"This account changed. Reopen this dialog to review the current account and model choices.",deletionPending:"Deletion is incomplete. This connection is off. Retry deletion to remove its remaining saved credentials.",deletionPendingShort:"Deletion incomplete",retryDelete:"Retry deletion",profileChanged:"The connected profile changed. Reopen this dialog in the current profile.",settingsChanged:"Settings changed elsewhere. Reopen this dialog to review the current settings.",manageConnection:"Manage connection",title:"AI connections & usage",description:"Manage each account and its models. Open usage details when needed.",connectionsTab:"Connections & models",usageTab:"Usage",addConnection:"Add connection",connectionSettings:"Connection settings",manageModels:"Manage models",searchConnections:"Search connections",filterStatus:"Status",filter_all:"All",filter_connected:"Connected",filter_disconnected:"Not connected",integration:"Integration",service:"Service",connectionName:"Connection name",namePlaceholder:"Personal Pro / Company API",oauthShort:"OAuth",endpoint:"Endpoint URL (optional)",protocol:"Protocol",oauthHint:"Sign in to this account in the browser. Credentials stay within this connection.",save:"Save",saved:"Connection settings saved.",confirmSave:"Confirm change and save",methodChangeWarning:"Changing the sign-in method changes the account or billing used by this connection. Confirm before saving.",cloneConnection:"Duplicate settings",copySuffix:"copy",deleteConnection:"Delete connection",confirmDelete:"Delete this connection",deleteWarning:"Delete this connection and its saved credentials? Its models will no longer be available.",keySaved:"A key is saved. Leave this field empty to keep it. The saved key is never displayed.",showSecret:"Show input",hideSecret:"Hide input",paste:"Paste",pasteFailed:"Clipboard access was unavailable. Paste directly into the field.",availableModels:"Models enabled",authExpired:"Sign-in expired",externalSettings:"Open integration settings",refreshUsage:"Refresh usage",usageFailed:"Could not load usage. Try again.",usageRefreshFailed:"Could not refresh usage. Try again.",usageRetained:"The figures below are the previous reading, not the result of this refresh.",usage_available:"Account usage",usage_unobserved:"Not observed yet",usage_unsupported:"Usage is not supported",usage_unknown:"Usage is unknown",usage_unavailable:"Usage is unavailable",usage_auth_required:"Sign in to check usage","usage_auth-required":"Sign in to check usage",usage_stale:"Last reading is out of date","usage_rate-limited":"Rate limited. Retry after the time below.",usage_error:"Usage could not be checked",quota_unlimited:"Unlimited",quota_unavailable:"Limit unavailable",quota_unallocated:"No quota allocated",quota_unknown:"Amount unknown",used:"used",remaining:"Remaining",estimated:"Estimated",unit_credits:"credits",unit_requests:"requests",resets:"Resets",resetDate:"Reset date (time not supplied)",retryAt:"Retry after",observedAt:"Last observed",checkedAt:"Last checked",lastObserved:"Recorded from a prior response. Opening this screen does not run a generation.",endpointUntrusted:"This endpoint is not trusted by the host. Add it to the host allowlist before saving.",serviceUnavailable:"This integration does not provide a supported model connection in this DSH version.",cloneHint:"The copy starts disabled and has no credentials. Configure its account separately."});Object.assign(X,{settingsShort:"\u8A2D\u5B9A",providerDefault:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306E\u65E2\u5B9A\u5024",credentialCleanupPending:"\u4EE5\u524D\u306E\u8A8D\u8A3C\u60C5\u5831\u306E\u524A\u9664\u304C\u672A\u5B8C\u4E86\u3067\u3059\u3002\u73FE\u5728\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u7DAD\u6301\u3057\u305F\u307E\u307E\u3001\u8A8D\u8A3C\u60C5\u5831\u306E\u524A\u9664\u3092\u518D\u8A66\u884C\u3067\u304D\u307E\u3059\u3002",credentialCleanupShort:"\u8A8D\u8A3C\u60C5\u5831\u306E\u524A\u9664\u672A\u5B8C\u4E86",retryCredentialCleanup:"\u8A8D\u8A3C\u60C5\u5831\u306E\u524A\u9664\u3092\u518D\u8A66\u884C",credentialCleanupFailed:"\u63A5\u7D9A\u306E\u5909\u66F4\u306F\u4FDD\u5B58\u3057\u307E\u3057\u305F\u304C\u3001\u4EE5\u524D\u306E\u8A8D\u8A3C\u60C5\u5831\u3092\u524A\u9664\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u8A8D\u8A3C\u60C5\u5831\u306E\u524A\u9664\u3092\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",credentialSaveFailed:"\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u63A5\u7D9A\u8A2D\u5B9A\u3092\u958B\u304D\u76F4\u3057\u3066\u73FE\u5728\u306E\u72B6\u614B\u3092\u78BA\u8A8D\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",createdCredentialFailed:"\u63A5\u7D9A\u306F\u4F5C\u6210\u3057\u307E\u3057\u305F\u304C\u3001\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3053\u306E\u753B\u9762\u3092\u9589\u3058\u3001\u4F5C\u6210\u3057\u305F\u63A5\u7D9A\u306E\u300C\u8A2D\u5B9A\u300D\u304B\u3089\u30AD\u30FC\u3092\u518D\u5165\u529B\u3059\u308B\u304B\u63A5\u7D9A\u3092\u524A\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",connectionChanged:"\u3053\u306E\u63A5\u7D9A\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u73FE\u5728\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3068\u30E2\u30C7\u30EB\u9078\u629E\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",deletionPending:"\u524A\u9664\u304C\u672A\u5B8C\u4E86\u3067\u3059\u3002\u3053\u306E\u63A5\u7D9A\u306F\u30AA\u30D5\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002\u6B8B\u3063\u3066\u3044\u308B\u8A8D\u8A3C\u60C5\u5831\u3092\u524A\u9664\u3059\u308B\u306B\u306F\u3001\u524A\u9664\u3092\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",deletionPendingShort:"\u524A\u9664\u672A\u5B8C\u4E86",retryDelete:"\u524A\u9664\u3092\u518D\u8A66\u884C",profileChanged:"\u63A5\u7D9A\u4E2D\u306E\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u3067\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",settingsChanged:"\u5225\u306E\u64CD\u4F5C\u3067\u8A2D\u5B9A\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u73FE\u5728\u306E\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",manageConnection:"\u63A5\u7D9A\u3092\u7BA1\u7406",title:"AI\u63A5\u7D9A\u30FB\u5229\u7528\u72B6\u6CC1",description:"\u30A2\u30AB\u30A6\u30F3\u30C8\u3054\u3068\u306B\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB\u3092\u7BA1\u7406\u3057\u307E\u3059\u3002\u5229\u7528\u72B6\u6CC1\u306F\u5FC5\u8981\u306A\u3068\u304D\u306B\u958B\u3051\u307E\u3059\u3002",connectionsTab:"\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB",usageTab:"\u5229\u7528\u72B6\u6CC1",addConnection:"\u63A5\u7D9A\u3092\u8FFD\u52A0",connectionSettings:"\u63A5\u7D9A\u8A2D\u5B9A",manageModels:"\u30E2\u30C7\u30EB\u3092\u7BA1\u7406",searchConnections:"\u63A5\u7D9A\u3092\u691C\u7D22",filterStatus:"\u63A5\u7D9A\u72B6\u614B",filter_all:"\u3059\u3079\u3066",filter_connected:"\u63A5\u7D9A\u6E08\u307F",filter_disconnected:"\u672A\u63A5\u7D9A",integration:"\u9023\u643A",service:"\u30B5\u30FC\u30D3\u30B9",connectionName:"\u63A5\u7D9A\u540D",namePlaceholder:"\u500B\u4EBAPro\u30FB\u4F1A\u793EAPI\u306A\u3069",oauthShort:"OAuth",endpoint:"\u63A5\u7D9A\u5148URL\uFF08\u4EFB\u610F\uFF09",protocol:"\u901A\u4FE1\u65B9\u5F0F",oauthHint:"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067\u30D6\u30E9\u30A6\u30B6\u304B\u3089\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3059\u3002\u8A8D\u8A3C\u60C5\u5831\u306F\u63A5\u7D9A\u3054\u3068\u306B\u4FDD\u5B58\u3057\u307E\u3059\u3002",save:"\u4FDD\u5B58",saved:"\u63A5\u7D9A\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",confirmSave:"\u5909\u66F4\u3092\u78BA\u8A8D\u3057\u3066\u4FDD\u5B58",methodChangeWarning:"\u8A8D\u8A3C\u65B9\u5F0F\u3092\u5909\u3048\u308B\u3068\u3001\u3053\u306E\u63A5\u7D9A\u3067\u4F7F\u3046\u30A2\u30AB\u30A6\u30F3\u30C8\u3084\u8AB2\u91D1\u5148\u304C\u5909\u308F\u308A\u307E\u3059\u3002\u78BA\u8A8D\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cloneConnection:"\u8A2D\u5B9A\u3092\u8907\u88FD",copySuffix:"\u30B3\u30D4\u30FC",deleteConnection:"\u63A5\u7D9A\u3092\u524A\u9664",confirmDelete:"\u3053\u306E\u63A5\u7D9A\u3092\u524A\u9664\u3059\u308B",deleteWarning:"\u3053\u306E\u63A5\u7D9A\u3068\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u60C5\u5831\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F\u3053\u306E\u63A5\u7D9A\u306E\u30E2\u30C7\u30EB\u306F\u5229\u7528\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059\u3002",keySaved:"\u30AD\u30FC\u306F\u4FDD\u5B58\u6E08\u307F\u3067\u3059\u3002\u5909\u66F4\u3057\u306A\u3044\u5834\u5408\u306F\u7A7A\u6B04\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u4FDD\u5B58\u6E08\u307F\u306E\u30AD\u30FC\u306F\u8868\u793A\u3057\u307E\u305B\u3093\u3002",showSecret:"\u5165\u529B\u3092\u8868\u793A",hideSecret:"\u5165\u529B\u3092\u96A0\u3059",paste:"\u8CBC\u308A\u4ED8\u3051",pasteFailed:"\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u5165\u529B\u6B04\u306B\u76F4\u63A5\u8CBC\u308A\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044\u3002",availableModels:"\u30E2\u30C7\u30EB\u6709\u52B9",authExpired:"\u8A8D\u8A3C\u5207\u308C",externalSettings:"\u9023\u643A\u5143\u306E\u8A2D\u5B9A\u3092\u958B\u304F",refreshUsage:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0",usageFailed:"\u5229\u7528\u72B6\u6CC1\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",usageRefreshFailed:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",usageRetained:"\u4E0B\u306E\u6570\u5024\u306F\u524D\u56DE\u306E\u53D6\u5F97\u7D50\u679C\u3067\u3059\u3002\u4ECA\u56DE\u306E\u66F4\u65B0\u3067\u306F\u78BA\u8A8D\u3067\u304D\u3066\u3044\u307E\u305B\u3093\u3002",usage_available:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u72B6\u6CC1",usage_unobserved:"\u307E\u3060\u89B3\u6E2C\u3057\u3066\u3044\u307E\u305B\u3093",usage_unsupported:"\u5229\u7528\u72B6\u6CC1\u306E\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC",usage_unknown:"\u5229\u7528\u72B6\u6CC1\u306F\u4E0D\u660E\u3067\u3059",usage_unavailable:"\u5229\u7528\u72B6\u6CC1\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093",usage_auth_required:"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059","usage_auth-required":"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059",usage_stale:"\u524D\u56DE\u306E\u60C5\u5831\u3067\u3059\u3002\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044","usage_rate-limited":"\u53D6\u5F97\u56DE\u6570\u306E\u5236\u9650\u4E2D\u3067\u3059\u3002\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",usage_error:"\u5229\u7528\u72B6\u6CC1\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",quota_unlimited:"\u7121\u5236\u9650",quota_unavailable:"\u5229\u7528\u67A0\u306F\u4E0D\u660E",quota_unallocated:"\u5229\u7528\u67A0\u306E\u5272\u5F53\u306A\u3057",quota_unknown:"\u4F7F\u7528\u91CF\u306F\u4E0D\u660E",used:"\u4F7F\u7528",remaining:"\u6B8B\u91CF",estimated:"\u63A8\u5B9A",unit_credits:"\u30AF\u30EC\u30B8\u30C3\u30C8",unit_requests:"\u30EA\u30AF\u30A8\u30B9\u30C8",resets:"\u30EA\u30BB\u30C3\u30C8\u6642\u523B",resetDate:"\u30EA\u30BB\u30C3\u30C8\u65E5\uFF08\u6642\u523B\u306E\u60C5\u5831\u306A\u3057\uFF09",retryAt:"\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B",observedAt:"\u6700\u7D42\u89B3\u6E2C\u6642\u523B",checkedAt:"\u6700\u7D42\u53D6\u5F97\u6642\u523B",lastObserved:"\u904E\u53BB\u306E\u5FDC\u7B54\u3067\u89B3\u6E2C\u3057\u305F\u60C5\u5831\u3067\u3059\u3002\u3053\u306E\u753B\u9762\u3092\u958B\u3044\u3066\u3082\u751F\u6210\u306F\u884C\u3044\u307E\u305B\u3093\u3002",endpointUntrusted:"\u3053\u306E\u63A5\u7D9A\u5148\u306F\u30DB\u30B9\u30C8\u3067\u8A31\u53EF\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u30DB\u30B9\u30C8\u306E\u8A31\u53EF\u30EA\u30B9\u30C8\u306B\u8FFD\u52A0\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",serviceUnavailable:"\u3053\u306EDSH\u7248\u3067\u306F\u3001\u3053\u306E\u9023\u643A\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002",cloneHint:"\u8907\u88FD\u3057\u305F\u63A5\u7D9A\u306F\u7121\u52B9\u30FB\u8A8D\u8A3C\u306A\u3057\u3067\u4F5C\u6210\u3057\u307E\u3059\u3002\u30A2\u30AB\u30A6\u30F3\u30C8\u306F\u5225\u306B\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(Y,{hours:"hours",days:"days",minutes:"minutes",accountQuota:"Account quota",unit_tokens:"tokens",unit_USD:"USD",ownerManaged:"Managed by integration",directory_live:"Available",directory_declared:"Declared",directory_unavailable:"Unavailable",sourceUnknown:"Owner unknown","serviceUnavailable_muse-code-bridge-unverified":"Muse Code requires the official CLI and a supported agent session connection in this environment. It is separate from the Meta Model API through Pi."});Object.assign(X,{hours:"\u6642\u9593",days:"\u65E5",minutes:"\u5206",accountQuota:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u67A0",unit_tokens:"\u30C8\u30FC\u30AF\u30F3",unit_USD:"USD",ownerManaged:"\u9023\u643A\u5143\u3067\u7BA1\u7406",directory_live:"\u5229\u7528\u53EF\u80FD",directory_declared:"\u8A2D\u5B9A\u3042\u308A",directory_unavailable:"\u5229\u7528\u4E0D\u53EF",sourceUnknown:"\u7BA1\u7406\u5143\u4E0D\u660E","serviceUnavailable_muse-code-bridge-unverified":"Muse Code\u306B\u306F\u516C\u5F0FCLI\u3068\u3001\u3053\u306E\u74B0\u5883\u3067\u5BFE\u5FDC\u3059\u308B\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u63A5\u7D9A\u304C\u5FC5\u8981\u3067\u3059\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u306E\u9023\u643A\u3067\u3059\u3002"});Object.assign(Y,{museModels:"Muse Code model",museSessionHint:"Muse Code runs independent agent sessions. These models are separate from Pi\u2019s Meta Model API and are not added to the standard DSH model list.",museCatalogDiagnostic:"The host supplied a diagnostic catalog without a supported session model. Model availability does not confirm your account entitlement.",agentSessionEnabled:"Agent connection enabled","error_muse-code-cli-required":"Install the official Muse Code CLI and supported MSP SDK on the host, then retry.","error_muse-code-protocol-unsupported":"This Muse Code CLI does not support account or settings management. Update the official CLI.","error_muse-code-login-required":"Sign in to this Muse Code connection first.","error_muse-code-login-failed":"Muse Code sign-in did not complete. Retry from this connection\u2019s settings.","error_muse-code-mode-unavailable":"This account or CLI could not apply the selected model.","error_muse-code-connection-changed":"The Muse Code connection changed. Close this panel and open it again.","error_muse-code-busy":"Muse Code is already performing an operation. Retry after it finishes.","error_muse-code-model-unavailable":"This model was not advertised by the current Muse Code host. Reload the panel.","error_muse-code-unavailable":"Muse Code is unavailable. Check the official CLI and this connection\u2019s sign-in.","error_muse-code-llm-unsupported":"This Muse Code host does not provide a standard DSH model bridge.","error_muse-code-session-failed":"The Muse Code agent session failed. Check this connection and retry."});Object.assign(X,{museModels:"Muse Code\u306E\u30E2\u30C7\u30EB",museSessionHint:"Muse Code\u306F\u72EC\u7ACB\u3057\u305F\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u3067\u3059\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u3067\u3001DSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u4E00\u89A7\u306B\u306F\u8FFD\u52A0\u3057\u307E\u305B\u3093\u3002",museCatalogDiagnostic:"\u3053\u306E\u30DB\u30B9\u30C8\u306E\u4E00\u89A7\u306F\u78BA\u8A8D\u7528\u3067\u3001\u5BFE\u5FDC\u3059\u308B\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u53D6\u5F97\u3060\u3051\u3067\u306F\u5951\u7D04\u306B\u3088\u308B\u5229\u7528\u53EF\u5426\u306F\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",agentSessionEnabled:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u63A5\u7D9A\u6709\u52B9","error_muse-code-cli-required":"\u30DB\u30B9\u30C8\u306B\u516C\u5F0FMuse Code CLI\u3068\u5BFE\u5FDC\u3059\u308BMSP SDK\u3092\u5C0E\u5165\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-protocol-unsupported":"\u3053\u306EMuse Code CLI\u306F\u30A2\u30AB\u30A6\u30F3\u30C8\u30FB\u8A2D\u5B9A\u7BA1\u7406\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-required":"\u5148\u306B\u3053\u306EMuse Code\u63A5\u7D9A\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-failed":"Muse Code\u306E\u30ED\u30B0\u30A4\u30F3\u304C\u5B8C\u4E86\u3057\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u306E\u8A2D\u5B9A\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-mode-unavailable":"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u307E\u305F\u306FCLI\u3067\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002","error_muse-code-connection-changed":"Muse Code\u63A5\u7D9A\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3053\u306E\u753B\u9762\u3092\u9589\u3058\u3066\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-busy":"Muse Code\u306E\u51E6\u7406\u4E2D\u3067\u3059\u3002\u5B8C\u4E86\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-model-unavailable":"\u73FE\u5728\u306EMuse Code\u30DB\u30B9\u30C8\u306B\u3053\u306E\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-unavailable":"Muse Code\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3068\u3053\u306E\u63A5\u7D9A\u306E\u30ED\u30B0\u30A4\u30F3\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-llm-unsupported":"\u3053\u306EMuse Code\u30DB\u30B9\u30C8\u306FDSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","error_muse-code-session-failed":"Muse Code\u306E\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(Y,{authUnavailable:"Account status unavailable"});Object.assign(X,{authUnavailable:"\u63A5\u7D9A\u72B6\u614B\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093"});Object.assign(Y,{authVerified:"Sign-in verified"});Object.assign(X,{authVerified:"\u63A5\u7D9A\u78BA\u8A8D\u6E08\u307F"});Object.assign(Y,{"usageScope_muse-code-subscription-weekly":"Weekly quota","error_muse-code-observation-invalid":"The Muse Code response could not be verified. Update the official CLI and reopen this panel."});Object.assign(X,{"usageScope_muse-code-subscription-weekly":"\u9031\u9593\u306E\u5229\u7528\u67A0","error_muse-code-observation-invalid":"Muse Code\u306E\u5FDC\u7B54\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3001\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(Y,{useProvider:"Use this connection",enable:"Enable connection",enabled:"Connection enabled.",activateFirst:"Enable this connection before choosing models.",modelsHint:"When this connection is enabled, its selected models are available to chats and agents."});Object.assign(X,{useProvider:"\u3053\u306E\u63A5\u7D9A\u3092\u4F7F\u3046",enable:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",activateFirst:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u3053\u306E\u63A5\u7D9A\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002"});Object.assign(Y,{museEntitlementUnverified:"This model appears in the catalog. Generation entitlement for this subscription has not been verified."});Object.assign(X,{museEntitlementUnverified:"\u4E00\u89A7\u306B\u3042\u308B\u30E2\u30C7\u30EB\u3067\u3059\u3002\u3053\u306E\u5951\u7D04\u3067\u306E\u751F\u6210\u6A29\u9650\u306F\u672A\u78BA\u8A8D\u3067\u3059\u3002"});Object.assign(Y,{museModelSaved:"Muse Code model saved.",museWonderOne:"Wonder1",museWonderFull:"Wonder Full"});Object.assign(X,{museModelSaved:"Muse Code\u306E\u30E2\u30C7\u30EB\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",museWonderOne:"Wonder1",museWonderFull:"Wonder Full"});Object.assign(Y,{title:"AI connections",addAndSignIn:"Add and sign in",add:"Add",advanced:"Advanced",chooseModels:"Choose models",modelsShort:"Models",modelsOn:"{count} on",modelsHint:"Models you turn on are available in chats and agents while this connection is on.",signedInReady:"Signed in. This connection is ready to use.",statusOff:"Off",keySavedPlaceholder:"Saved. Enter a new key to replace it.",emptyConnections:"No connections yet. Add one to sign in or use an API key.",deleted:"Connection deleted.",cloned:"Settings duplicated. The copy starts off and needs its own sign-in.",lastObservedShort:"From an earlier response"});Object.assign(X,{title:"AI\u63A5\u7D9A",addAndSignIn:"\u8FFD\u52A0\u3057\u3066\u30ED\u30B0\u30A4\u30F3",add:"\u8FFD\u52A0",advanced:"\u8A73\u7D30\u8A2D\u5B9A",chooseModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",modelsShort:"\u30E2\u30C7\u30EB",modelsOn:"{count}\u4EF6\u30AA\u30F3",modelsHint:"\u30AA\u30F3\u306B\u3057\u305F\u30E2\u30C7\u30EB\u306F\u3001\u3053\u306E\u63A5\u7D9A\u304C\u30AA\u30F3\u306E\u3068\u304D\u30C1\u30E3\u30C3\u30C8\u3068\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",signedInReady:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u3092\u4F7F\u3048\u307E\u3059\u3002",statusOff:"\u30AA\u30D5",keySavedPlaceholder:"\u4FDD\u5B58\u6E08\u307F\u3002\u5909\u66F4\u3059\u308B\u3068\u304D\u3060\u3051\u5165\u529B",emptyConnections:"\u63A5\u7D9A\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002\u300C\u63A5\u7D9A\u3092\u8FFD\u52A0\u300D\u304B\u3089\u30ED\u30B0\u30A4\u30F3\u307E\u305F\u306FAPI\u30AD\u30FC\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",deleted:"\u63A5\u7D9A\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002",cloned:"\u8A2D\u5B9A\u3092\u8907\u88FD\u3057\u307E\u3057\u305F\u3002\u8907\u88FD\u306F\u30AA\u30D5\u30FB\u672A\u30ED\u30B0\u30A4\u30F3\u3067\u4F5C\u6210\u3055\u308C\u307E\u3059\u3002",lastObservedShort:"\u4EE5\u524D\u306E\u5FDC\u7B54\u304B\u3089"});Object.assign(Y,{museContributorNote:"Contributor choices let Meta use your content to train future models, in exchange for more plan usage. They start off; turn on only the ones you want.",museCatalogEmpty:"Load this account\u2019s Muse Code models. New models appear here; Contributor versions start off.",museLoginRequired:"Sign in to this Muse Code connection first.",museCatalogFailed:"Could not load the Muse Code model list. Sign in again or try later."});Object.assign(X,{museContributorNote:"Contributor\u7248\u306F\u3001\u5229\u7528\u67A0\u304C\u5897\u3048\u308B\u4EE3\u308F\u308A\u306BMeta\u304C\u5185\u5BB9\u3092\u5C06\u6765\u306E\u30E2\u30C7\u30EB\u306E\u5B66\u7FD2\u306B\u4F7F\u3044\u307E\u3059\u3002\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002\u4F7F\u3046\u3082\u306E\u3060\u3051\u30AA\u30F3\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",museCatalogEmpty:"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u306EMuse Code\u306E\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3059\u3002Contributor\u7248\u306F\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002",museLoginRequired:"\u5148\u306B\u3053\u306EMuse Code\u63A5\u7D9A\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",museCatalogFailed:"Muse Code\u306E\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u30ED\u30B0\u30A4\u30F3\u3059\u308B\u304B\u3001\u6642\u9593\u3092\u304A\u3044\u3066\u8A66\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});var gt=`.dsh-pi-login { color: var(--dsw-alias-label-primary); font-family: var(--dsw-font-family); font-size: 13px; line-height: 1.6; }
.dsh-pi-login h3 { margin: 0; font-size: 14px; font-weight: 500; }
.dsh-pi-login h4 { margin: 0; font-size: 13px; font-weight: 500; }
.dsh-pi-login p { margin: 6px 0 12px; }
.dsh-pi-muted, .dsh-pi-caption { color: var(--dsw-alias-label-secondary); }
.dsh-pi-small { font-size: 12px; }
.dsh-pi-success { color: var(--dsw-alias-label-primary); }
.dsh-pi-note { color: var(--dsw-alias-label-secondary); font-size: 12px; }
.dsh-pi-footer { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 8px 12px; flex-wrap: wrap; }
.dsh-pi-toolbar p { margin: 0; }
.dsh-pi-inline-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
.dsh-pi-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.dsh-pi-link { color: var(--dsw-alias-brand-primary); text-underline-offset: 3px; }
.dsh-pi-loading { min-height: 48px; }

/* Connection list */
.dsh-pi-search { margin: 12px 0 4px; }
.dsh-pi-search > * { width: 100%; box-sizing: border-box; }
.dsh-pi-group { margin-top: 16px; }
.dsh-pi-group-label { color: var(--dsw-alias-label-secondary); font-size: 12px !important; font-weight: 400 !important; padding-bottom: 4px; }
.dsh-pi-connection-list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); }
.dsh-pi-connection-row { display: flex; align-items: center; gap: 8px; padding: 4px 8px 4px 0; min-height: 52px; }
.dsh-pi-connection-row + .dsh-pi-connection-row { border-top: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 0; padding: 6px 12px; margin: 0; border: 0; border-radius: var(--dsw-radius-md); background: transparent; color: inherit; font: inherit; text-align: left; overflow-wrap: anywhere; }
button.dsh-pi-row-main { cursor: pointer; }
button.dsh-pi-row-main:hover { background: var(--dsw-alias-bg-layer-1); }
.dsh-pi-row-name { display: inline-flex; align-items: center; gap: 8px; }
.dsh-pi-row-meta { padding-left: 16px; color: var(--dsw-alias-label-secondary); font-size: 12px; }
.dsh-pi-row-meta-alert { color: var(--dsw-alias-label-danger, #d93025); font-size: 12px; }
.dsh-pi-row-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }

/* Dialogs */
.dsh-pi-dialog { width: min(520px, 100%); max-height: 100%; }
.dsh-pi-modal-content { min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.dsh-pi-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-section > h4 { margin-bottom: 8px; }
.dsh-pi-status-card { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dsh-pi-status { display: inline-flex; align-items: center; gap: 8px; }
.dsh-pi-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.dsh-pi-choice { display: flex; min-width: 0; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.dsh-pi-choice-button { width: 100%; justify-content: space-between; }
.dsh-pi-choice-button > span { text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-pi-secret { display: flex; align-items: center; gap: 4px; }
.dsh-pi-secret > :first-child { flex: 1 1 auto; min-width: 0; }
.dsh-pi-masked input { -webkit-text-security: disc; }
.dsh-pi-advanced { margin-bottom: 14px; }
.dsh-pi-advanced summary { cursor: pointer; color: var(--dsw-alias-label-secondary); margin-bottom: 8px; width: fit-content; }
.dsh-pi-danger { display: flex; justify-content: flex-start; }
.dsh-pi-danger-button { color: var(--dsw-alias-label-danger, #d93025) !important; }
.dsh-pi-confirm { width: 100%; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); padding: 12px; }
.dsh-pi-confirm p { margin-top: 0; }
.dsh-pi-prompt { display: flex; flex-direction: column; gap: 8px; }
.dsh-pi-button-link { display: inline-flex; align-items: center; justify-content: center; min-height: 36px; padding: 0 16px; margin: 4px 0 12px; border-radius: var(--dsw-radius-md); background: var(--dsw-alias-brand-primary); color: #fff; text-decoration: none; font-weight: 500; }
.dsh-pi-verification { margin: 8px 0 12px; }
.dsh-pi-verification-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 12px; margin-top: 6px; border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-layer-1); }
.dsh-pi-verification code { font-size: 18px; letter-spacing: .08em; overflow-wrap: anywhere; }

/* Models */
.dsh-pi-models-dialog { width: min(560px, 100%); }
.dsh-pi-models-toolbar { margin: 8px 0 4px; min-height: 28px; }
.dsh-pi-model-list { max-height: min(440px, 50dvh); overflow-y: auto; overscroll-behavior: contain; }
.dsh-pi-model-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 8px 0; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-pi-model-row:last-child { border-bottom: 0; }
.dsh-pi-model-label { display: flex; flex-direction: column; min-width: 0; overflow-wrap: anywhere; }
.dsh-pi-model-label .dsh-pi-muted { font-size: 12px; }
.dsh-pi-radio-list { border: 0; margin: 0; padding: 0; min-width: 0; }
.dsh-pi-radio-list legend { padding: 0; margin-bottom: 6px; }
.dsh-pi-radio-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); cursor: pointer; }
.dsh-pi-radio-row + .dsh-pi-radio-row { margin-top: 6px; }
.dsh-pi-radio-row:has(input:checked) { border-color: var(--dsw-alias-brand-primary); }
.dsh-pi-radio-row input { accent-color: var(--dsw-alias-brand-primary); width: 16px; height: 16px; margin: 0; }
.dsh-pi-radio-list:disabled .dsh-pi-radio-row { cursor: default; opacity: .7; }

/* Usage */
.dsh-pi-usage-window { display: flex; flex-direction: column; gap: 4px; padding: 8px 0; }
.dsh-pi-usage-window progress { width: 100%; height: 6px; accent-color: var(--dsw-alias-brand-primary); }

/* Plugin update */
.dsh-pi-login .dsh-pi-updates { margin-top: 20px; min-width: 0; }
.dsh-pi-login .dsh-pi-update-notes { white-space: pre-wrap; overflow-wrap: anywhere; max-height: 180px; overflow: auto; }

.dsh-pi-login [role='alert'] { overflow-wrap: anywhere; }
.dsh-pi-login :is(button, summary, a):focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.dsh-pi-login input::placeholder { color: var(--dsw-alias-label-secondary); opacity: 1; }
/* Touch screens keep 44px targets; pointer devices keep the native density. */
@media (pointer: coarse) {
  .dsh-pi-login :is(button, input) { min-height: 44px; }
  .dsh-pi-login button { min-width: 44px; }
  .dsh-pi-login [role='switch'] { width: 60px; height: 44px; border: 12px solid transparent; background-clip: padding-box; }
}
@media (max-width: 420px) {
  .dsh-pi-secret { flex-wrap: wrap; }
  .dsh-pi-secret > :first-child { flex-basis: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-pi-login *, .dsh-pi-login *::before { transition: none !important; animation: none !important; }
}
.dsh-pi-empty-models { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 8px 0 12px; }
`;var mt=`/* Button sizes share the global control-radius scale. */
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
`;var o=require("react/jsx-runtime"),vt="dsh.piLogin",Kt=["slots","locale","connection"];function $t(e){return(0,a.useSyncExternalStore)(n=>e.subscribe(n),()=>e.getSnapshot().revision),e.bind(vt)}function wt(e){try{let n=new URL(e);if(n.protocol==="https:"||n.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(n.hostname))return n.href}catch{}}function Be(e,n=!1){if(!e)return;let t=new Date(e);if(Number.isNaN(t.valueOf()))return n?e:void 0;let r=document.documentElement.lang||void 0;try{return new Intl.DateTimeFormat(r,n?{dateStyle:"medium"}:{dateStyle:"medium",timeStyle:"short"}).format(t)}catch{return t.toLocaleString()}}var ft=typeof CSS<"u"&&CSS.supports?.("-webkit-text-security","disc")===!0,be={autoComplete:"off",autoCapitalize:"off",autoCorrect:"off",spellCheck:!1,"data-1p-ignore":"","data-lpignore":"true","data-form-type":"other"};function bt(e){return{...be,type:e&&!ft?"password":"text",className:e&&ft?"dsh-pi-masked":void 0}}function ve({label:e,value:n,options:t,onChange:r,disabled:i}){let[s,c]=(0,a.useState)(!1),l=(0,a.useId)();return(0,o.jsxs)("div",{className:"dsh-pi-choice",children:[(0,o.jsx)("span",{id:l,className:"dsh-pi-caption",children:e}),(0,o.jsx)($e,{open:s,onClose:()=>c(!1),portal:!0,selectedId:n,items:t,onSelect:u=>{r(u),c(!1)},anchor:(0,o.jsxs)(M,{variant:"outline",disabled:i,"aria-labelledby":l,"aria-haspopup":"menu","aria-expanded":s,onClick:()=>c(!s),className:"dsh-pi-choice-button",children:[(0,o.jsx)("span",{children:t.find(u=>u.id===n)?.label}),(0,o.jsx)(De,{size:14})]})})]})}function jt({prompt:e,ticket:n,controller:t,t:r,onFailure:i}){let[s,c]=(0,a.useState)(""),[l,u]=(0,a.useState)(!1),[b,h]=(0,a.useState)(!1),[_,v]=(0,a.useState)(!1),g=(0,a.useId)();async function k(m){m.preventDefault();let P=s;c(""),u(!0);try{await t.mutation("answer",{ticket:n,id:e.id,value:P})}catch{i()}finally{u(!1)}}return(0,o.jsxs)("form",{onSubmit:k,className:"dsh-pi-prompt",children:[e.kind==="select"?(0,o.jsx)(ve,{label:e.message||r("selection"),value:s,options:e.options,onChange:c,disabled:l}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("label",{htmlFor:g,children:e.message||r(e.kind==="secret"?"secret":"answer")}),(0,o.jsx)(ne,{id:g,"data-modal-autofocus":!0,...e.kind==="secret"?bt(!b):be,value:s,placeholder:e.placeholder,onChange:m=>c(m.target.value)}),e.kind==="secret"?(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[(0,o.jsx)(M,{size:"sm",onClick:()=>h(!b),"aria-pressed":b,children:r(b?"hideSecret":"showSecret")}),(0,o.jsx)(M,{size:"sm",onClick:async()=>{try{c(await navigator.clipboard.readText()),v(!1)}catch{v(!0)}},children:r("paste")})]}):null]}),_?(0,o.jsx)("p",{role:"alert",children:r("pasteFailed")}):null,(0,o.jsx)("div",{className:"dsh-pi-actions",children:(0,o.jsx)(M,{type:"submit",variant:"primary",disabled:l||e.kind==="select"&&!s,children:r("submit")})})]})}function Gt({entry:e,method:n,controller:t,t:r,onClose:i,onModels:s}){let[c]=(0,a.useState)(()=>t.scoped()),l=(0,a.useRef)(),[u,b]=(0,a.useState)(),[h,_]=(0,a.useState)({status:"running"}),[v,g]=(0,a.useState)(!1),[k,m]=(0,a.useState)(!1),[P,L]=(0,a.useState)(e.enabled===!0),[f,A]=(0,a.useState)(!1),[y,S]=(0,a.useState)(!1),[K,$]=(0,a.useState)(!1);(0,a.useEffect)(()=>{let x=!0;return c.start(e.connectionId,n).then(w=>{l.current=w,x?b(w):c.cancel(w).catch(()=>{})},w=>{x&&g(we(w))}),()=>{x=!1,l.current&&c.cancel(l.current).catch(()=>{})}},[]),(0,a.useEffect)(()=>{if(!u)return;let x=!0,w,N=new AbortController;async function U(){try{let J=await c.call("state",{ticket:u},N.signal);if(!x)return;_(J),J.status==="running"?w=setTimeout(U,800):(c.tickets.delete(u),J.status==="authorized"&&e.enabled!==!0?await Q():await c.refresh())}catch(J){x&&g(we(J))}}return U(),()=>{x=!1,N.abort(),clearTimeout(w)}},[u]);let B=wt(h.notice?.url),Z=h.status!=="running"||v,R=h.reason?.startsWith("muse-code-")?we(new Error(h.reason)):h.reason==="provider-expired"?"providerExpired":h.reason==="timeout"?"timedOut":h.status==="cancelled"?"cancelled":"failed";async function Q(x=!1){m(!0),A(!1);try{await c.mutation(x?"use-login":"enable",{connectionId:e.connectionId}),L(!0),S(!1)}catch(w){A(!0),S(w.message.endsWith("/api-key-override"))}finally{m(!1),await c.refresh().catch(()=>{})}}let C=h.status==="authorized";return(0,o.jsxs)(Ce,{open:!0,onClose:i,title:e.displayName,closeLabel:r("close"),className:"dsh-pi-login dsh-pi-dialog",footer:(0,o.jsxs)(o.Fragment,{children:[C&&P&&s&&e.capabilities?.models!==!1?(0,o.jsx)(M,{variant:"primary",onClick:()=>s(e),children:r("chooseModels")}):null,(0,o.jsx)(M,{variant:"outline",onClick:i,children:r(Z?"close":"cancel")})]}),children:[v||h.status==="failed"?(0,o.jsx)("p",{role:"alert",children:r(v||R)}):null,C?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:"status",className:"dsh-pi-success",children:r(P?"signedInReady":k?"loading":"success")}),f?(0,o.jsx)("p",{role:"alert",children:r(y?"keyOverride":"enableFailed")}):null,f&&!y?(0,o.jsx)(M,{variant:"outline",onClick:()=>{Q()},disabled:k,children:r("enable")}):null,y&&!P?(0,o.jsx)(M,{variant:"outline",onClick:()=>{Q(!0)},disabled:k,children:r("useLogin")}):null]}):null,h.status==="cancelled"?(0,o.jsx)("p",{role:h.reason==="timeout"?"alert":"status",children:r(R)}):null,Z?null:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:"status",children:h.notice?.message||r(B?"waiting":"busy")}),h.notice?.code?(0,o.jsxs)("div",{className:"dsh-pi-verification",children:[(0,o.jsx)("span",{className:"dsh-pi-muted",children:r("code")}),(0,o.jsxs)("div",{className:"dsh-pi-verification-row",children:[(0,o.jsx)("code",{children:h.notice.code}),(0,o.jsx)(M,{size:"sm",variant:"outline",onClick:async()=>{try{await navigator.clipboard.writeText(h.notice.code),$(!0)}catch{$(!1)}},children:r(K?"copied":"copy")})]})]}):null,B?(0,o.jsx)("a",{className:"dsh-pi-button-link",href:B,target:"_blank",rel:"noopener noreferrer",children:r("openBrowser")}):null,h.prompt?(0,o.jsx)(jt,{prompt:h.prompt,ticket:u,controller:c,t:r,onFailure:()=>g("failed")},h.prompt.id):null]})]})}function Qt({entry:e,controller:n,t,onClose:r}){let[i]=(0,a.useState)(()=>n.scoped(e)),[s,c]=(0,a.useState)(),[l,u]=(0,a.useState)(""),[b,h]=(0,a.useState)(()=>new Set),[_,v]=(0,a.useState)(!1),[g,k]=(0,a.useState)(!1),[m,P]=(0,a.useState)(""),L=(0,a.useRef)(),f=(0,a.useRef)(0),A=(0,a.useRef)(Promise.resolve()),y=(0,a.useRef)(new AbortController);(0,a.useEffect)(()=>{let C=new AbortController;return i.call("models",{connectionId:e.connectionId},C.signal).then(x=>{C.signal.aborted||c(x)},()=>{C.signal.aborted||k(!0)}),()=>{y.current.abort(),C.abort(),L.current?.abort(),f.current++}},[e.connectionId]);async function S(){let C=++f.current;L.current?.abort();let x=new AbortController;L.current=x,v(!0),P(""),k(!1);try{let w=await i.call("refresh-models",{connectionId:e.connectionId},x.signal);!x.signal.aborted&&C===f.current&&c(w)}catch(w){if(!x.signal.aborted&&C===f.current){let N=String(w.code??w.message).split("/").pop();P(s?.refresh?.errors?.[N]??"catalogRefreshFailed")}}finally{!x.signal.aborted&&C===f.current&&v(!1)}}function K(C,x){k(!1),h(w=>new Set(w).add(C)),c(w=>({...w,models:w.models.map(N=>N.id===C?{...N,enabled:x}:N)})),A.current=A.current.then(async()=>{let w=y.current.signal;if(!w.aborted){try{let N=await i.call("models",{connectionId:e.connectionId},w);if(w.aborted)return;await i.mutation("set-model",{connectionId:e.connectionId,model:C,enabled:x,revision:N.revision},w)}catch{w.aborted||k(!0)}if(!w.aborted){try{let N=await i.call("models",{connectionId:e.connectionId},w);w.aborted||c(N)}catch{w.aborted||k(!0)}w.aborted||h(N=>{let U=new Set(N);return U.delete(C),U})}}}),A.current.then(()=>{if(!y.current.signal.aborted)return i.refresh()}).catch(()=>{})}let $=b.size>0,B=()=>{$||r()},Z=l.trim().toLowerCase(),R=s?.models.filter(C=>`${C.id} ${C.name}`.toLowerCase().includes(Z)),Q=s?.models.filter(C=>C.enabled).length??0;return(0,o.jsxs)(Ce,{open:!0,title:e.displayName,description:t("modelsHint"),closeLabel:t("close"),onClose:B,className:"dsh-pi-login dsh-pi-dialog dsh-pi-models-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsx)(M,{variant:"outline",disabled:$,onClick:B,children:t("close")}),children:[s&&s.models.length>8?(0,o.jsx)(ne,{icon:(0,o.jsx)(We,{size:16}),"aria-label":t("searchModels"),placeholder:t("searchModels"),"data-modal-autofocus":!0,value:l,onChange:C=>u(C.target.value)}):null,(0,o.jsxs)("div",{className:"dsh-pi-toolbar dsh-pi-models-toolbar",children:[s?(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("modelsOn").replace("{count}",String(Q))}):(0,o.jsx)("span",{role:"status",children:g?"":t("loading")}),s?.refresh?.canRefresh&&s.models.length?(0,o.jsx)(M,{variant:"ghost",size:"sm",disabled:_||!e.writable,onClick:()=>{S()},children:t(_?"loading":"reloadModels")}):null]}),s?.refresh?.status?(0,o.jsxs)("p",{role:"status",className:"dsh-pi-muted",children:[t(s.refresh.status.message),s.refresh.status.detail?` \xB7 ${s.refresh.status.detail}`:""]}):null,m?(0,o.jsx)("p",{role:"alert",children:t(m)}):null,g?(0,o.jsx)("p",{role:"alert",children:t(s?"saveFailed":"modelsFailed")}):null,s&&!s.models.length&&s.refresh?.canRefresh?(0,o.jsxs)("div",{className:"dsh-pi-empty-models",children:[(s.refresh.notes??[]).map(C=>(0,o.jsx)("p",{className:"dsh-pi-muted",children:t(C)},C)),(0,o.jsx)(M,{variant:"primary",disabled:_||!e.writable,onClick:()=>{S()},children:t(_?"loading":"reloadModels")})]}):null,s?.models.some(C=>C.fast&&C.enabled)?(0,o.jsx)("p",{className:"dsh-pi-note",children:t("fastWarning")}):null,s?.models.some(C=>C.contributor)?(0,o.jsx)("p",{className:"dsh-pi-note",children:t("museContributorNote")}):null,(0,o.jsxs)("div",{className:"dsh-pi-model-list",children:[R?.map(C=>(0,o.jsxs)("div",{className:"dsh-pi-model-row",children:[(0,o.jsxs)("div",{className:"dsh-pi-model-label",children:[(0,o.jsx)("span",{children:C.name}),C.capabilityUnverified?(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("capabilitiesUnknown")}):null]}),(0,o.jsx)(Pe,{label:`${t("modelEnabled")}: ${C.name}`,checked:C.enabled,disabled:b.has(C.id)||!e.writable,onChange:x=>K(C.id,x)})]},C.id)),R?.length===0?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("noResults")}):null]})]})}function we(e){let n=String(e.code??e.message).split("/").pop();return n==="endpoint-untrusted"?"endpointUntrusted":n==="credential-delete-failed"?"deletionPending":n==="credential-cleanup-failed"?"credentialCleanupFailed":n==="credential-save-failed"?"credentialSaveFailed":n==="profile-changed"?"profileChanged":n==="connection-changed"?"connectionChanged":n==="settings-changed"?"settingsChanged":n?.startsWith("muse-code-")?Object.hasOwn(Y,`error_${n}`)?`error_${n}`:"error_muse-code-unavailable":"saveFailed"}function kt({controller:e,t:n}){let t=(0,a.useSyncExternalStore)(e.subscribe,e.getSnapshot),[r,i]=(0,a.useState)(!1);(0,a.useEffect)(()=>{e.load()},[e]);let s=["checking","starting","preparing","installing"].includes(t.status),c={idle:"updateIdle",checking:"updateChecking",current:"updateCurrent",available:"updateAvailable",blocked:"updateBlocked",starting:"updatePreparing",preparing:"updatePreparing",installing:"updateInstalling","restart-required":"updateRestart",applied:"updateApplied",failed:"updateFailed",cancelled:"updateCancelled",overridden:"updateOverridden",superseded:"updateSuperseded",unknown:"updateUnknown"},l=!r&&["idle","blocked","current"].includes(t.status);return(0,o.jsxs)("div",{className:"dsh-pi-updates",children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[n("updateTitle"),t.runtimeVersion?` ${t.runtimeVersion}`:""]}),(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[t.status==="available"?(0,o.jsx)(M,{size:"sm",variant:"primary",onClick:()=>{e.begin()},children:n("updateInstall")}):null,t.status==="unknown"?(0,o.jsx)(M,{size:"sm",variant:"outline",onClick:()=>{e.load()},children:n("updateReconcile")}):null,(0,o.jsx)(M,{size:"sm",variant:"ghost",disabled:s||t.status==="unknown"||t.status==="restart-required",onClick:()=>{i(!0),e.check()},children:n("updateCheck")})]})]}),l?null:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:["failed","blocked"].includes(t.status)?"alert":"status",children:n(c[t.status]||"updateUnknown")}),t.reason?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[n(`updateReason_${t.reason}`)||n("updateReason_network")," ",(0,o.jsx)("a",{className:"dsh-pi-link",href:"https://github.com/Aero123421/dsh-pi-login/releases",target:"_blank",rel:"noopener noreferrer",children:n("updateManual")})]}):null,t.candidate?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("p",{children:[t.runtimeVersion," \u2192 ",t.candidate.version," \xB7 DSH ",t.candidate.compatibility]}),(0,o.jsx)("p",{className:"dsh-pi-update-notes",children:t.candidate.notes})]}):null,t.result?.stage?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[n("updateStage"),": ",t.result.stage,t.result.error?.code?` \xB7 ${t.result.error.code}`:""]}):null]})]})}function Ct(e,n){let t=e.windowSeconds;return t&&t%86400===0?`${t/86400} ${n("days")}`:t&&t%3600===0?`${t/3600} ${n("hours")}`:t&&t%60===0?`${t/60} ${n("minutes")}`:e.scope==="account"?n("accountQuota"):Object.hasOwn(Y,`usageScope_${e.scope}`)?n(`usageScope_${e.scope}`):e.scope}function zt({entry:e,controller:n,t}){let[r]=(0,a.useState)(()=>n.scoped()),[i,s]=(0,a.useState)(),[c,l]=(0,a.useState)(!1),[u,b]=(0,a.useState)(!1),h=(0,a.useRef)(),_=(0,a.useRef)(0);async function v(m=!1){let P=++_.current;h.current?.abort();let L=new AbortController;h.current=L,l(!0),b(!1);try{let f=await r.mutation("usage",{connectionId:e.connectionId,credentialGeneration:e.credentialGeneration,refresh:m},L.signal);!L.signal.aborted&&P===_.current&&s(f)}catch{!L.signal.aborted&&P===_.current&&b(!0)}finally{!L.signal.aborted&&P===_.current&&l(!1)}}(0,a.useEffect)(()=>(v(),()=>{_.current++,h.current?.abort()}),[e.connectionId]);let g=i?.status==="rate-limited"&&new Date(i.retryAt).valueOf()>Date.now(),k=i?.windows??[];return(0,o.jsxs)("section",{className:"dsh-pi-section dsh-pi-usage","aria-busy":c,"aria-label":t("usageTab"),children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("h4",{children:t("usageTab")}),(0,o.jsx)(M,{variant:"ghost",size:"sm",disabled:c||g,onClick:()=>{v(!0)},children:t(c?"loading":"refreshUsage")})]}),u?(0,o.jsx)("p",{role:"alert",children:t(i?"usageRefreshFailed":"usageFailed")}):null,u&&i?(0,o.jsx)("p",{role:"status",className:"dsh-pi-muted",children:t("usageRetained")}):null,i&&!u&&(!k.length||i.status!=="available")?(0,o.jsx)("p",{role:"status",className:"dsh-pi-muted",children:t(`usage_${i.status}`)}):null,g&&i.retryAt?(0,o.jsxs)("p",{className:"dsh-pi-muted dsh-pi-small",children:[t("retryAt"),": ",Be(i.retryAt)]}):null,k.map(m=>(0,o.jsxs)("div",{className:"dsh-pi-usage-window",children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("span",{children:Ct(m,t)}),m.quotaState?(0,o.jsx)("strong",{children:t(`quota_${m.quotaState}`)}):typeof m.usedPercent=="number"?(0,o.jsxs)("strong",{children:[m.usedPercent,"% ",t("used")]}):(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("quota_unknown")})]}),!m.quotaState&&typeof m.usedPercent=="number"?(0,o.jsx)("progress",{max:"100",value:Math.min(100,Math.max(0,m.usedPercent)),"aria-label":Ct(m,t)}):null,m.quota?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[m.quota.estimated?`${t("estimated")} \xB7 `:"",m.quota.remaining!=null?`${t("remaining")}: ${m.quota.remaining}`:m.quota.used!=null?`${t("used")}: ${m.quota.used}`:t("quota_unknown"),m.quota.total!=null?` / ${m.quota.total}`:""," ",t(`unit_${m.quota.unit}`)]}):null,m.resetsAt?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[t("resets"),": ",Be(m.resetsAt)]}):m.resetsOn?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[t("resetDate"),": ",Be(m.resetsOn,!0)]}):null]},m.id)),i?.checkedAt||i?.sourceObservedAt?(0,o.jsxs)("p",{className:"dsh-pi-muted dsh-pi-small",children:[i.source==="last-observed"?`${t("lastObservedShort")} \xB7 `:"",t(i.sourceObservedAt?"observedAt":"checkedAt"),": ",Be(i.sourceObservedAt??i.checkedAt)]}):null]})}function xt({value:e,onChange:n,t,disabled:r,saved:i}){let[s,c]=(0,a.useState)(!1),[l,u]=(0,a.useState)(!1),b=(0,a.useId)();return(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:b,children:t("apiKey")}),(0,o.jsxs)("div",{className:"dsh-pi-secret",children:[(0,o.jsx)(ne,{id:b,...bt(!s),value:e,disabled:r,placeholder:i?t("keySavedPlaceholder"):"",onChange:h=>n(h.target.value)}),(0,o.jsx)(M,{size:"sm",disabled:r,"aria-pressed":s,onClick:()=>c(!s),children:t(s?"hideSecret":"showSecret")}),(0,o.jsx)(M,{size:"sm",disabled:r,onClick:async()=>{try{n(await navigator.clipboard.readText()),u(!1)}catch{u(!0)}},children:t("paste")})]}),l?(0,o.jsx)("p",{role:"alert",children:t("pasteFailed")}):null]})}function Ie(e){return`${e.integrationId}/${e.serviceId??e.id}`}function Yt({state:e,controller:n,t,onClose:r,onLogin:i,onSaved:s}){let[c]=(0,a.useState)(()=>n.scoped()),l=e.services,u=new Map;for(let I of l){let T=I.label??I.serviceLabel;u.set(T,(u.get(T)??0)+1)}let b=I=>e.integrations.find(T=>(T.id??T.integrationId)===I)?.label,h=I=>{let T=I.label??I.serviceLabel;return u.get(T)>1?`${T}\uFF08${b(I.integrationId)}\uFF09`:T},[_,v]=(0,a.useState)(l[0]?Ie(l[0]):""),g=l.find(I=>Ie(I)===_)??l[0],k=g?.methods??[],[m,P]=(0,a.useState)(k[0]?.id??"oauth"),L=k.find(I=>I.id===m)?.id??k[0]?.id??m,[f,A]=(0,a.useState)(""),[y,S]=(0,a.useState)(""),[K,$]=(0,a.useState)(""),[B,Z]=(0,a.useState)(""),[R,Q]=(0,a.useState)(!1),[C,x]=(0,a.useState)(""),w=(0,a.useId)(),N=g?.capabilities?.settings===!1,U=f.trim()||h(g??{})||"";async function J(){Q(!0),x("");try{let I={displayName:U,authMethod:L,...B?{apiKey:B}:{},...y.trim()?{endpointUrl:y.trim()}:{},...K?{api:K}:{}},T=await c.mutation("connection-create",{integrationId:g.integrationId,serviceId:g.serviceId??g.id,...I,revision:e.revision});if(Z(""),await c.refresh(),s(),L==="oauth"){let pe=T.connection??T,te=c.getSnapshot().entries.find(d=>d.connectionId===pe.connectionId);te&&i(te)}}catch(I){x(we(I)==="credentialSaveFailed"?"createdCredentialFailed":we(I)),await c.refresh().catch(()=>{})}finally{Q(!1)}}return(0,o.jsxs)(Ce,{open:!0,title:t("addConnection"),closeLabel:t("close"),onClose:()=>{R||r()},className:"dsh-pi-login dsh-pi-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(M,{variant:"outline",onClick:r,disabled:R,children:t("cancel")}),(0,o.jsx)(M,{variant:"primary",disabled:R||C==="createdCredentialFailed"||!g||N||g.writable===!1||!U||L==="api-key"&&!B.trim(),onClick:()=>{J()},children:t(R?"loading":L==="oauth"?"addAndSignIn":"add")})]}),children:[(0,o.jsx)(ve,{label:t("service"),value:g?Ie(g):"",options:l.map(I=>({id:Ie(I),label:h(I)})),disabled:R,onChange:I=>{v(I),P(l.find(T=>Ie(T)===I)?.methods?.[0]?.id??"oauth"),Z(""),S(""),$("")}}),N?(0,o.jsx)("p",{role:"status",children:t(g.unavailableReason==="muse-code-bridge-unverified"?`serviceUnavailable_${g.unavailableReason}`:"serviceUnavailable")}):null,k.length>1?(0,o.jsx)(ve,{label:t("method"),value:L,options:k.map(I=>({id:I.id,label:t(I.id==="oauth"?"oauth":"apiKey")})),disabled:R,onChange:I=>{P(I),Z("")}}):null,(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${w}-name`,children:t("connectionName")}),(0,o.jsx)(ne,{id:`${w}-name`,...be,"data-modal-autofocus":!0,maxLength:80,value:f,disabled:R,placeholder:h(g??{})??t("namePlaceholder"),onChange:I=>A(I.target.value)})]}),L==="api-key"?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(xt,{value:B,onChange:Z,t,disabled:R}),(0,o.jsxs)("details",{className:"dsh-pi-advanced",children:[(0,o.jsx)("summary",{children:t("advanced")}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${w}-url`,children:t("endpoint")}),(0,o.jsx)(ne,{id:`${w}-url`,...be,type:"url",value:y,disabled:R,placeholder:"https://\u2026",onChange:I=>S(I.target.value)})]}),g?.apis?.length?(0,o.jsx)(ve,{label:t("protocol"),value:K,options:[{id:"",label:t("providerDefault")},...g.apis.map(I=>({id:I,label:I}))],disabled:R,onChange:$}):null]})]}):(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("oauthHint")}),C?(0,o.jsx)("p",{role:"alert",children:t(C)}):null]})}function It(e){return e.deletionPending?{dot:"warning",copy:"deletionPendingShort"}:e.inFlight||e.authStatus==="updating"?{dot:"ongoing",copy:"busy"}:e.authStatus==="expired"?{dot:"error",copy:"authExpired"}:e.authStatus==="unavailable"?{dot:"warning",copy:"authUnavailable"}:e.configured?e.enabled?{dot:"done",copy:"connected"}:{dot:"idle",copy:"statusOff"}:{dot:"idle",copy:"notConnected"}}function Jt({entry:e,state:n,controller:t,t:r,onClose:i,onLogin:s,onSaved:c}){let[l]=(0,a.useState)(()=>t.scoped()),[u]=(0,a.useState)(e.revision??n.revision),b=n.services.find(p=>p.integrationId===e.integrationId&&(p.serviceId??p.id)===e.serviceId)?.methods??e.methods??[],[h,_]=(0,a.useState)(e.authMethod),[v,g]=(0,a.useState)(e.displayName??""),[k,m]=(0,a.useState)(e.profile?.baseURL??""),[P,L]=(0,a.useState)(e.profile?.api??""),[f,A]=(0,a.useState)(""),[y,S]=(0,a.useState)(!1),[K,$]=(0,a.useState)(""),[B,Z]=(0,a.useState)(),R=(0,a.useId)(),Q=n.services.find(p=>p.integrationId===e.integrationId&&(p.serviceId??p.id)===e.serviceId),C=n.entries.find(p=>p.connectionId===e.connectionId)?.credentialCleanupPending??e.credentialCleanupPending,x=n.entries.find(p=>p.connectionId===e.connectionId)?.deletionPending??e.deletionPending,w=e.writable!==!1,N=w&&!x,U=h!==e.authMethod,J=v.trim()!==e.displayName||U||!!f||k.trim()!==(e.profile?.baseURL??"")||P!==(e.profile?.api??""),I=It({...e,deletionPending:x});async function T(p){let F=we(p);$(F);try{await l.refresh();let V=l.getSnapshot().entries.find(D=>D.connectionId===e.connectionId);V&&V.credentialGeneration!==e.credentialGeneration&&c(F)}catch{}}async function pe(){if(U&&B!=="method"){Z("method");return}S(!0),$("");try{let p={displayName:v.trim(),...U?{authMethod:h}:{},...f?{apiKey:f}:{},...k.trim()?{endpointUrl:k.trim()}:e.profile?.baseURL?{endpointUrl:""}:{},...P!==(e.profile?.api??"")?{api:P}:{}};await l.mutation("connection-update",{connectionId:e.connectionId,patch:p,revision:u,credentialGeneration:e.credentialGeneration}),A(""),await l.refresh(),c()}catch(p){await T(p)}finally{S(!1)}}async function te(p){S(!0),$("");try{let F=p==="delete"&&e.deletionPending||p==="cleanup"&&e.credentialCleanupPending;await l.mutation(`connection-${p}`,{connectionId:e.connectionId,revision:F?n.revision:u,credentialGeneration:e.credentialGeneration,...p==="clone"?{displayName:`${v} ${r("copySuffix")}`}:{}}),await l.refresh(),c(p)}catch(F){await T(F)}finally{S(!1)}}let d=!x&&e.authMethod==="oauth"&&e.capabilities?.auth!==!1;return(0,o.jsxs)(Ce,{open:!0,title:e.displayName,description:`${e.serviceLabel} \xB7 ${r(e.authMethod==="oauth"?"oauthShort":"apiKey")}`,closeLabel:r("close"),onClose:()=>{y||i()},className:"dsh-pi-login dsh-pi-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(M,{variant:"outline",onClick:i,disabled:y,children:r("close")}),(0,o.jsx)(M,{variant:"primary",disabled:y||!N||!J||Q?.capabilities?.settings===!1||B==="delete"||!v.trim(),onClick:()=>{pe()},children:r(y?"loading":B==="method"?"confirmSave":"save")})]}),children:[(0,o.jsxs)("div",{className:"dsh-pi-status-card",children:[(0,o.jsxs)("span",{className:"dsh-pi-status",children:[(0,o.jsx)(Ae,{state:I.dot,size:8}),r(I.copy)]}),d?(0,o.jsx)(M,{size:"sm",variant:e.configured&&e.authStatus!=="expired"?"outline":"primary",disabled:y||!w||U,onClick:()=>s(e),children:r(e.configured?"signInAgain":"signIn")}):null]}),C&&!x?(0,o.jsxs)("div",{className:"dsh-pi-confirm",children:[(0,o.jsx)("p",{role:"alert",children:r("credentialCleanupPending")}),(0,o.jsx)(M,{size:"sm",variant:"outline",disabled:y||!w,onClick:()=>{te("cleanup")},children:r("retryCredentialCleanup")})]}):null,x?(0,o.jsx)("p",{role:"alert",children:r("deletionPending")}):null,!x&&e.configured&&e.capabilities?.usage!==!1?(0,o.jsx)(zt,{entry:e,controller:l,t:r}):null,(0,o.jsxs)("section",{className:"dsh-pi-section","aria-label":r("connectionSettings"),children:[(0,o.jsx)("h4",{children:r("connectionSettings")}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${R}-name`,children:r("connectionName")}),(0,o.jsx)(ne,{id:`${R}-name`,...be,maxLength:80,value:v,disabled:y||!N,placeholder:r("namePlaceholder"),onChange:p=>g(p.target.value)})]}),b.length>1?(0,o.jsx)(ve,{label:r("method"),value:h,options:b.map(p=>({id:p.id,label:r(p.id==="oauth"?"oauth":"apiKey")})),disabled:y||!N,onChange:p=>{_(p),A(""),Z(void 0)}}):null,U?(0,o.jsx)("p",{role:"alert",children:r("methodChangeWarning")}):null,h==="api-key"?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(xt,{value:f,onChange:A,t:r,disabled:y||!N,saved:e.configured&&!U}),(0,o.jsxs)("details",{className:"dsh-pi-advanced",open:e.profile?.baseURL?!0:void 0,children:[(0,o.jsx)("summary",{children:r("advanced")}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${R}-url`,children:r("endpoint")}),(0,o.jsx)(ne,{id:`${R}-url`,...be,type:"url",value:k,disabled:y||!N,placeholder:"https://\u2026",onChange:p=>m(p.target.value)})]}),Q?.apis?.length?(0,o.jsx)(ve,{label:r("protocol"),value:P,options:[{id:"",label:r("providerDefault")},...Q.apis.map(p=>({id:p,label:p}))],disabled:y||!N,onChange:L}):null]})]}):null]}),K?(0,o.jsx)("p",{role:"alert",children:r(K)}):null,w?null:(0,o.jsx)("p",{className:"dsh-pi-muted",children:r("readOnly")}),(0,o.jsx)("section",{className:"dsh-pi-section dsh-pi-danger","aria-label":r("deleteConnection"),children:B==="delete"?(0,o.jsxs)("div",{className:"dsh-pi-confirm",children:[(0,o.jsx)("p",{role:"alert",children:r("deleteWarning")}),(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[(0,o.jsx)(M,{size:"sm",variant:"outline",disabled:y,onClick:()=>Z(void 0),children:r("cancel")}),(0,o.jsx)(M,{size:"sm",variant:"primary",disabled:y,onClick:()=>{te("delete")},children:r("confirmDelete")})]})]}):(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[(0,o.jsx)(M,{size:"sm",disabled:y||!N,title:r("cloneHint"),onClick:()=>{te("clone")},children:r("cloneConnection")}),(0,o.jsx)(M,{size:"sm",className:"dsh-pi-danger-button",disabled:y||!w,onClick:()=>Z("delete"),children:r(x?"retryDelete":"deleteConnection")})]})})]})}function Xt({entry:e,controller:n,t,writableRevision:r,onOpen:i,onLogin:s,onModels:c}){let[l,u]=(0,a.useState)(!1),[b,h]=(0,a.useState)(!1),_=It(e),v=e.authStatus==="owner-managed",g=e.deletionPending||e.capabilities?.settings!==!1,k=!g&&e.settingsUrl?wt(e.settingsUrl):void 0;async function m(f){u(!0),h(!1);try{await n.mutation("connection-update",{connectionId:e.connectionId,patch:{enabled:f},revision:r}),await n.refresh()}catch{h(!0)}finally{u(!1)}}let P=[v?`${t(`directory_${e.directoryState??"unavailable"}`)} \xB7 ${e.source??t("sourceUnknown")}`:`${t(e.authMethod==="oauth"?"oauthShort":"apiKey")} \xB7 ${t(_.copy)}`].filter(Boolean).join(" \xB7 "),L=(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("span",{className:"dsh-pi-row-name",children:[v?null:(0,o.jsx)(Ae,{state:_.dot,size:8}),e.displayName]}),(0,o.jsx)("span",{className:`dsh-pi-row-meta${_.dot==="error"?" dsh-pi-row-meta-alert":""}`,children:P})]});return(0,o.jsxs)("li",{className:"dsh-pi-connection-row",children:[g?(0,o.jsx)("button",{type:"button",className:"dsh-pi-row-main","aria-label":`${t("connectionSettings")}: ${e.displayName}`,onClick:()=>i(e),children:L}):(0,o.jsxs)("div",{className:"dsh-pi-row-main",children:[L,k?(0,o.jsx)("a",{className:"dsh-pi-link",href:k,target:"_blank",rel:"noopener noreferrer",children:t("externalSettings")}):null]}),(0,o.jsxs)("div",{className:"dsh-pi-row-actions",children:[g?(0,o.jsx)(M,{size:"sm",variant:"outline","aria-label":`${t("manageConnection")}: ${e.displayName}`,onClick:()=>i(e),children:t("settingsShort")}):null,e.credentialCleanupPending&&!e.deletionPending?(0,o.jsx)("span",{role:"alert",className:"dsh-pi-row-meta-alert",children:t("credentialCleanupShort")}):null,b?(0,o.jsx)("span",{role:"alert",className:"dsh-pi-row-meta-alert",children:t("saveFailed")}):null,e.deletionPending?(0,o.jsx)("span",{role:"alert",className:"dsh-pi-row-meta-alert",children:t("deletionPendingShort")}):!e.configured&&e.authMethod==="oauth"&&e.capabilities?.auth!==!1&&e.writable!==!1?(0,o.jsx)(M,{size:"sm",variant:"primary",onClick:()=>s(e),children:t("signIn")}):e.authStatus==="expired"&&e.authMethod==="oauth"&&e.writable!==!1?(0,o.jsx)(M,{size:"sm",variant:"primary",onClick:()=>s(e),children:t("signInAgain")}):(0,o.jsxs)(o.Fragment,{children:[e.capabilities?.models!==!1&&e.configured?(0,o.jsx)(M,{size:"sm",variant:"outline","aria-label":`${t("manageModels")}: ${e.displayName}`,onClick:()=>c(e),children:t("modelsShort")}):null,g&&e.configured?(0,o.jsx)(Pe,{label:`${t("useProvider")}: ${e.displayName}`,checked:e.enabled===!0,disabled:l||e.writable===!1,onChange:f=>{m(f)}}):null]})]})]})}function yt({controller:e,updates:n,locale:t}){let r=(0,a.useSyncExternalStore)(e.subscribe,e.getSnapshot),i=$t(t),[s,c]=(0,a.useState)(""),[l,u]=(0,a.useState)(),[b,h]=(0,a.useState)(""),_=(0,a.useId)();(0,a.useEffect)(()=>{e.load()},[e]),(0,a.useEffect)(()=>{u(void 0),h("")},[r.profileKey,r.generation]);let v=s.trim().toLocaleLowerCase(),g=new Map;for(let f of r.entries){if(!`${f.displayName} ${f.integrationLabel} ${f.serviceLabel}`.toLocaleLowerCase().includes(v))continue;let A=`${f.integrationId}/${f.serviceId}`;g.has(A)||g.set(A,{label:f.serviceLabel??f.integrationLabel,entries:[]}),g.get(A).entries.push(f)}let k=()=>u(void 0);function m(f){h(""),u({kind:"login",entry:f,method:f.authMethod})}function P(f){u({kind:"models",entry:e.getSnapshot().entries.find(A=>A.connectionId===f.connectionId)??f})}function L(f){u(void 0),h(f==="delete"?"deleted":f==="clone"?"cloned":f&&f!=="cleanup"?f:"saved")}return(0,o.jsxs)("section",{className:"dsh-pi-login dsh-pi-footer","aria-labelledby":_,children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("h3",{id:_,children:i("title")}),(0,o.jsx)(M,{variant:"outline",size:"sm",onClick:()=>{h(""),u({kind:"add"})},disabled:r.status!=="ready"||r.services.length===0,children:i("addConnection")})]}),b?(0,o.jsx)("p",{role:["saved","deleted","cloned"].includes(b)?"status":"alert",className:["saved","deleted","cloned"].includes(b)?"dsh-pi-success":void 0,children:i(b)}):null,r.error?(0,o.jsxs)("p",{role:"alert",children:[i("loadFailed")," ",(0,o.jsx)(M,{size:"sm",onClick:()=>{e.refresh()},children:i("retry")})]}):null,r.status==="loading"&&r.entries.length===0?(0,o.jsx)("p",{role:"status",className:"dsh-pi-loading",children:i("loading")}):null,r.entries.length>8?(0,o.jsx)("div",{className:"dsh-pi-search",children:(0,o.jsx)(ne,{"aria-label":i("searchConnections"),placeholder:i("searchConnections"),icon:(0,o.jsx)(We,{size:16}),value:s,onChange:f=>c(f.target.value)})}):null,[...g].map(([f,A])=>(0,o.jsxs)("div",{className:"dsh-pi-group",children:[(0,o.jsx)("h4",{className:"dsh-pi-group-label",children:A.label}),(0,o.jsx)("ul",{className:"dsh-pi-connection-list",children:A.entries.map(y=>(0,o.jsx)(Xt,{entry:y,controller:e,t:i,writableRevision:r.revision,onOpen:S=>{h(""),u({kind:"settings",entry:S})},onLogin:m,onModels:P},y.connectionId))})]},f)),r.status==="ready"&&g.size===0&&!r.error?(0,o.jsx)("p",{className:"dsh-pi-muted",children:i(r.entries.length?"noResults":"emptyConnections")}):null,n?(0,o.jsx)(kt,{controller:n,t:i}):null,l?.kind==="login"?(0,o.jsx)(Gt,{...l,controller:e,t:i,onClose:k,onModels:P}):null,l?.kind==="models"?(0,o.jsx)(Qt,{entry:l.entry,controller:e,t:i,onClose:k}):null,l?.kind==="add"?(0,o.jsx)(Yt,{state:r,controller:e,t:i,onClose:k,onLogin:m,onSaved:L}):null,l?.kind==="settings"?(0,o.jsx)(Jt,{entry:l.entry,state:r,controller:e,t:i,onClose:k,onLogin:m,onSaved:L},l.entry.connectionId):null]})}function eo(e){let n=new He(e.connection),t=new Ee(e.connection);e.effect(()=>()=>t.dispose(),"dsh-pi-login: update requests"),e.effect(()=>()=>n.dispose(),"dsh-pi-login: UI requests"),e.effect(()=>e.locale.register(vt,{en:Y,ja:X}),"dsh-pi-login: copy"),e.effect(()=>{let i=document.createElement("style");return i.dataset.dshPiLogin="",i.textContent=mt+gt,document.head.append(i),()=>i.remove()},"dsh-pi-login: official controls"),e.on("connection/reset",()=>{n.refresh(),t.load()});let r=()=>({controller:n,updates:t,locale:e.locale});e.slots.inject("settings.models.footer",()=>e.slots.register({name:"settings.models.footer",id:"dsh-pi-login",order:10,inject:r},yt))}

return module.exports;}});
