window.__ModuleLoader__.load({id:"@local/dsh-pi-login",factory(require){const module={exports:{}};const exports=module.exports;
var Te=Object.defineProperty;var Mt=Object.getOwnPropertyDescriptor;var _t=Object.getOwnPropertyNames;var Lt=Object.prototype.hasOwnProperty;var Pt=(e,n)=>{for(var t in n)Te(e,t,{get:n[t],enumerable:!0})},Wt=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of _t(n))!Lt.call(e,s)&&s!==t&&Te(e,s,{get:()=>n[s],enumerable:!(r=Mt(n,s))||r.enumerable});return e};var Ot=e=>Wt(Te({},"__esModule",{value:!0}),e);var to={};Pt(to,{ConnectionUI:()=>yt,UpdateUI:()=>bt,apply:()=>eo,inject:()=>Kt});module.exports=Ot(to);var i=require("react");var Je=require("react");function ze(e){var n,t,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var s=e.length;for(n=0;n<s;n++)e[n]&&(t=ze(e[n]))&&(r&&(r+=" "),r+=t)}else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function Nt(){for(var e,n,t=0,r="",s=arguments.length;t<s;t++)(e=arguments[t])&&(n=ze(e))&&(r&&(r+=" "),r+=n);return r}var R=Nt;var we={button:"dshpi_13ed0003_button",md:"dshpi_13ed0003_md",sm:"dshpi_13ed0003_sm",primary:"dshpi_13ed0003_primary",ghost:"dshpi_13ed0003_ghost",outline:"dshpi_13ed0003_outline",toolbar:"dshpi_13ed0003_toolbar",icon:"dshpi_13ed0003_icon"};var Me=require("react/jsx-runtime"),b=(0,Je.forwardRef)(function({variant:n="ghost",size:t="md",icon:r,className:s,children:a,...m},u){return(0,Me.jsxs)("button",{ref:u,type:"button",className:R(we.button,we[n],we[t],s),...m,children:[r!=null&&(0,Me.jsx)("span",{className:we.icon,children:r}),a]})});var Xe=require("react");var _e={wrap:"dshpi_fda332f6_wrap",icon:"dshpi_fda332f6_icon",input:"dshpi_fda332f6_input"};var ke=require("react/jsx-runtime"),ee=(0,Xe.forwardRef)(function({icon:n,className:t,...r},s){return(0,ke.jsxs)("span",{className:R(_e.wrap,t),children:[n!=null&&(0,ke.jsx)("span",{className:_e.icon,children:n}),(0,ke.jsx)("input",{ref:s,className:_e.input,...r})]})});var Ve={switch:"dshpi_7ae83aee_switch",thumb:"dshpi_7ae83aee_thumb"};var De=require("react/jsx-runtime");function Le({checked:e,onChange:n,label:t,disabled:r=!1,title:s,className:a}){return(0,De.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":t,title:s,disabled:r,className:R(Ve.switch,a),onClick:()=>{n(!e)},children:(0,De.jsx)("span",{className:Ve.thumb})})}var F=require("react"),ct=require("react-dom");var St=require("react");var et=require("react/jsx-runtime");var q=require("react/jsx-runtime");var Pe=1;var At=({size:e=16,className:n,strokeWidth:t})=>(0,q.jsxs)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,q.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,q.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),We=e=>(0,q.jsx)(At,{...e,strokeWidth:Pe});var Rt=({size:e=16,className:n,strokeWidth:t})=>(0,q.jsx)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,q.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),Oe=e=>(0,q.jsx)(Rt,{...e,strokeWidth:Pe});var Ht=({size:e=14,className:n,strokeWidth:t})=>(0,q.jsx)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,q.jsx)("path",{d:"M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6",stroke:"currentColor"})}),Fe=e=>(0,q.jsx)(Ht,{...e,strokeWidth:Pe});var Et=({size:e=16,className:n,strokeWidth:t})=>(0,q.jsxs)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,q.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,q.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),tt=e=>(0,q.jsx)(Et,{...e,strokeWidth:Pe});function ot(e){let n=document.documentElement,t=Number.parseFloat(getComputedStyle(n).getPropertyValue("--dsh-frame-top-clearance"));return Number.isNaN(t)?e:Math.max(e,(n.hasAttribute("data-fullscreen")?0:t)+20)}var re=require("react"),Bt=200;function nt(e){let n=(0,re.useRef)(null),t=(0,re.useRef)(e);t.current=e;let r=(0,re.useCallback)(()=>{n.current!==null&&(clearTimeout(n.current),n.current=null)},[]),s=(0,re.useCallback)(()=>{r(),n.current=setTimeout(()=>{n.current=null,t.current()},Bt)},[r]);return(0,re.useEffect)(()=>r,[r]),{arm:s,cancel:r}}var Ae=require("react");function Ne(e){let n=!1,t=!1,r=()=>{n=!0},s=()=>{n=!1,t=!0},a=()=>{t=!1},m=()=>{n=!1,t=!1};return e.addEventListener("compositionstart",r,!0),e.addEventListener("compositionend",s,!0),e.addEventListener("keyup",a,!0),e.defaultView?.addEventListener("blur",m),{guards:u=>{let g=n||t||u.isComposing||u.keyCode===229;return t=!1,g},dispose:()=>{e.removeEventListener("compositionstart",r,!0),e.removeEventListener("compositionend",s,!0),e.removeEventListener("keyup",a,!0),e.defaultView?.removeEventListener("blur",m)}}}var Ze=new WeakMap,Tt=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function pe(e,n){Ze.get(e)?.();let t=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",t),e.removeEventListener("keydown",r,!0),Ze.delete(e)},r=s=>{!s.isComposing&&!s.ctrlKey&&!s.altKey&&!s.metaKey&&Tt.has(s.key)&&t()};Ze.set(e,t),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",t),e.addEventListener("keydown",r,!0),e.focus(n),e.matches(":focus")||t()}var Se=new WeakMap;function st(e){if(e===null)return!1;let n=Se.get(e.ownerDocument)?.at(-1);return n!==void 0&&!n.element.contains(e)}var rt='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function it(e,n,t){let r=(0,Ae.useRef)(t);r.current=t,(0,Ae.useLayoutEffect)(()=>{let s=e.current;if(!n||s===null)return;let a=s.ownerDocument,m=Ne(a),u=a.activeElement,g=Se.get(a)??[];Se.set(a,g);let c={element:s,close:()=>{r.current()}};g.push(c);let v=s.querySelector("[data-modal-autofocus]")??s.querySelector(rt)??s;s.contains(a.activeElement)||pe(v);let _=p=>{let w=m.guards(p);if(g.at(-1)!==c||p.defaultPrevented||w||p.ctrlKey||p.altKey||p.metaKey||(p.key==="Escape"&&!p.shiftKey&&(p.preventDefault(),p.repeat||r.current()),p.key!=="Tab")||a.activeElement?.closest('[role="menu"]'))return;let h=[...s.querySelectorAll(rt)].filter(f=>!f.closest("[inert], [hidden]")),M=h[0]??s,k=h.at(-1)??s,P=p.shiftKey?a.activeElement===M:a.activeElement===k;(a.activeElement===s||!s.contains(a.activeElement)||P)&&(p.preventDefault(),(p.shiftKey?k:M).focus())};return a.addEventListener("keydown",_),()=>{m.dispose();let p=g.at(-1)===c;if(g.splice(g.indexOf(c),1),a.removeEventListener("keydown",_),g.length===0&&Se.delete(a),p){let w=u instanceof HTMLElement&&u.isConnected?u:g.at(-1)?.element;w!==void 0&&pe(w)}}},[e,n])}var ue={keys:"dshpi_042ff8c4_keys",key:"dshpi_042ff8c4_key",tooltip:"dshpi_042ff8c4_tooltip",separator:"dshpi_042ff8c4_separator",joined:"dshpi_042ff8c4_joined"};var Ue=require("react/jsx-runtime");function qe({keys:e,variant:n="plain",className:t}){return(0,Ue.jsx)("span",{className:R(ue.keys,n==="tooltip"&&ue.tooltip,n==="tooltip"&&e.includes("+")&&ue.joined,t),children:e.map((r,s)=>(0,Ue.jsx)("kbd",{className:r==="+"?ue.separator:ue.key,children:r},s))})}var ie=require("react"),at=require("react-dom");var he={surface:"dshpi_a00a35bd_surface",backing:"dshpi_a00a35bd_backing",compact:"dshpi_a00a35bd_compact",material:"dshpi_a00a35bd_material"};var se=require("react/jsx-runtime"),Ke=(0,ie.forwardRef)(function({compact:n=!1,className:t,style:r,children:s,...a},m){let u=(0,ie.useId)(),g=(0,ie.useRef)(null);(0,ie.useLayoutEffect)(()=>{document.body.appendChild(g.current)},[]);let c={"--dsh-menu-anchor":`--dsh-menu-${u.replaceAll(":","")}`};return(0,se.jsxs)(se.Fragment,{children:[(0,se.jsxs)("div",{...a,ref:m,"data-menu-material":"translucent",className:R(he.surface,n&&he.compact,t),style:{...r,...c},children:[(0,se.jsx)("div",{"aria-hidden":"true",className:he.material}),s]}),(0,at.createPortal)((0,se.jsx)("div",{ref:g,"aria-hidden":"true","data-menu-backing":"",className:R(he.backing,n&&he.compact),style:{...c,visibility:r?.visibility}}),document.body)]})});var L={root:"dshpi_1911279a_root",list:"dshpi_1911279a_list",submenu:"dshpi_1911279a_submenu",scrollable:"dshpi_1911279a_scrollable",viewport:"dshpi_1911279a_viewport",css:"dshpi_1911279a_css",portal:"dshpi_1911279a_portal",sideTop:"dshpi_1911279a_sideTop",alignEnd:"dshpi_1911279a_alignEnd",tsx:"dshpi_1911279a_tsx",footer:"dshpi_1911279a_footer",separator:"dshpi_1911279a_separator",itemWrap:"dshpi_1911279a_itemWrap",item:"dshpi_1911279a_item",denseList:"dshpi_1911279a_denseList",label:"dshpi_1911279a_label",compactList:"dshpi_1911279a_compactList",itemIcon:"dshpi_1911279a_itemIcon",check:"dshpi_1911279a_check",itemLabel:"dshpi_1911279a_itemLabel",shortcut:"dshpi_1911279a_shortcut",shortcutKeys:"dshpi_1911279a_shortcutKeys",selected:"dshpi_1911279a_selected",selectedFill:"dshpi_1911279a_selectedFill",danger:"dshpi_1911279a_danger"};var H=require("react/jsx-runtime");function lt(e){return"type"in e&&e.type==="separator"}function dt(e){return"type"in e&&e.type==="label"}var Vt={visibility:"hidden",left:0,top:0};function $e({open:e,anchor:n,items:t=[],children:r,selectedId:s,selectedIds:a,onSelect:m,onClose:u,align:g="start",side:c="bottom",portal:v=!1,closeOnPointerLeave:_=!1,dense:p=!1,compact:w=!1,autoFocus:h=!1,selection:M="check",getAnchorRect:k,footer:P,className:f,listClassName:O}){let E=(0,F.useRef)(null),A=(0,F.useRef)(null),T=(0,F.useRef)(null),B=(0,F.useRef)(null),C=(0,F.useRef)(!1),I=(d=!1)=>{let W=B.current,Q=W!==null&&document.contains(W)&&!W.disabled?W:E.current?.querySelector("button:not(:disabled)");Q!=null&&(d?Q.focus():pe(Q))},x=()=>{let d=C.current;queueMicrotask(()=>{if(S.current)return;let W=document.activeElement;(W===null||W===document.body||A.current?.contains(W)===!0)&&I(d)})},S=(0,F.useRef)(e);S.current=e;let[Z,N]=(0,F.useState)(null),[te,Y]=(0,F.useState)(null),{arm:z,cancel:l}=nt(u);(0,F.useLayoutEffect)(()=>{if(!e||!v){Y(null);return}let d=()=>{let V;if(k!==void 0?V=k():V=E.current?.getBoundingClientRect()??null,V===null)return;let D=12,ye=window.innerWidth,y=window.innerHeight,oe=A.current,de=oe?.offsetWidth??0,ne=oe?.offsetHeight??0,X,$;c==="right"?(X=V.right+4,$=V.top):g==="start"?(X=V.left,$=c==="bottom"?V.bottom+4:V.top-ne-4):(X=V.right-de,$=c==="bottom"?V.bottom+4:V.top-ne-4),de>0&&(X=Math.min(Math.max(X,D),ye-de-D)),ne>0&&($=Math.min(Math.max($,ot(D)),y-ne-D)),Y(ce=>ce?.left===X&&ce.top===$?ce:{left:X,top:$})};d();let W=()=>{d(),Q=requestAnimationFrame(W)},Q=requestAnimationFrame(W);return window.addEventListener("scroll",d,!0),window.addEventListener("resize",d),()=>{cancelAnimationFrame(Q),window.removeEventListener("scroll",d,!0),window.removeEventListener("resize",d)}},[e,v,g,c,k]),(0,F.useEffect)(()=>{if(!e){B.current=null;return}let d=document.activeElement;B.current=d instanceof HTMLElement&&E.current?.contains(d)===!0?d:null},[e]),(0,F.useEffect)(()=>{if(!e||!h)return;let d=A.current?.querySelector("button:not(:disabled)");T.current=d==null?null:0,d!=null&&pe(d)},[e,h]),(0,F.useEffect)(()=>{if(!e){N(null),T.current=null;return}let d=Ne(document),W=y=>{y.target instanceof Node&&E.current?.contains(y.target)!==!0&&A.current?.contains(y.target)!==!0&&u()},Q=y=>{if(d.guards(y)||st(E.current)||y.defaultPrevented||y.ctrlKey||y.altKey||y.metaKey)return;let oe=document.activeElement,de=A.current?.contains(oe)===!0,ne=E.current?.contains(oe)===!0||de;if(y.key==="Escape"&&!y.shiftKey){if(y.preventDefault(),y.repeat)return;u(),(ne||h)&&I()}if(y.key==="Tab"){let Qe=A.current;if(Qe===null||!ne)return;if(y.shiftKey){y.preventDefault(),u(),I(!0);return}if(de){if(oe instanceof Element&&oe.getAttribute("role")==="menuitem"){y.preventDefault(),C.current=!0;try{oe.click()}finally{C.current=!1}}return}let Ye=Qe.querySelector("button:not(:disabled)");if(Ye===null)return;y.preventDefault(),Ye.focus(),T.current=0;return}if(!["ArrowDown","ArrowUp","Home","End"].includes(y.key))return;let X=A.current;if(X===null||!ne)return;let $=Array.from(X.querySelectorAll("button:not(:disabled)"));if($.length===0)return;let ce=$.indexOf(oe),je=ce>=0?ce:T.current,Ge=y.key==="Home"?0:y.key==="End"?$.length-1:je===null?y.key==="ArrowDown"?0:$.length-1:(je+(y.key==="ArrowDown"?1:-1)+$.length)%$.length;y.preventDefault(),T.current=Ge,$[Ge]?.focus()},V=()=>{document.activeElement instanceof HTMLIFrameElement&&u()};document.addEventListener("pointerdown",W);let D=y=>{y.key==="Escape"&&Q(y)},ye=y=>{y.key!=="Escape"&&Q(y)};return document.addEventListener("keydown",ye),document.addEventListener("keydown",D,!0),window.addEventListener("blur",V),()=>{d.dispose(),document.removeEventListener("pointerdown",W),document.removeEventListener("keydown",ye),document.removeEventListener("keydown",D,!0),window.removeEventListener("blur",V)}},[e,u,h]),(0,F.useEffect)(()=>{e||l()},[e,l]);let U=!t.some(d=>!lt(d)&&!dt(d)&&d.submenu!==void 0&&d.submenu.length>0),Ie=d=>{if(lt(d))return(0,H.jsx)("div",{className:L.separator,role:"separator"},d.id);if(dt(d))return(0,H.jsx)("div",{className:L.label,role:"presentation",children:d.text},d.id);let W=d.submenu!==void 0&&d.submenu.length>0,Q=W&&Z===d.id,V=d.id===s||a?.includes(d.id)===!0;return(0,H.jsxs)("div",{className:L.itemWrap,onMouseEnter:W?()=>{N(d.id)}:void 0,onMouseLeave:()=>{N(null)},children:[(0,H.jsxs)("button",{type:"button",role:"menuitem",className:R(L.item,V&&(M==="fill"?L.selectedFill:L.selected),d.danger===!0&&L.danger),disabled:d.disabled,"aria-keyshortcuts":d.shortcut?.aria,"aria-haspopup":W?"menu":void 0,"aria-expanded":W?Q:void 0,onFocus:W?()=>{N(d.id)}:void 0,onClick:()=>{if(W){N(d.id);return}m?.(d.id)},children:[d.icon!==void 0&&(0,H.jsx)("span",{className:L.itemIcon,children:d.icon}),(0,H.jsx)("span",{className:L.itemLabel,children:d.label}),d.shortcut!==void 0&&(0,H.jsx)("span",{"aria-hidden":"true",className:L.shortcut,children:(0,H.jsx)(qe,{keys:d.shortcut.keys,className:L.shortcutKeys})}),V&&M==="check"&&(0,H.jsx)(Oe,{className:L.check})]}),Q&&d.submenu!==void 0&&(0,H.jsx)(Ke,{compact:w,className:R(L.submenu,w&&L.compactList),role:"menu",children:d.submenu.map(D=>(0,H.jsxs)("button",{type:"button",role:"menuitem",className:L.item,disabled:D.disabled,"aria-keyshortcuts":D.shortcut?.aria,onClick:()=>{m?.(D.id),x()},children:[D.icon!==void 0&&(0,H.jsx)("span",{className:L.itemIcon,children:D.icon}),(0,H.jsx)("span",{className:L.itemLabel,children:D.label}),D.shortcut!==void 0&&(0,H.jsx)("span",{"aria-hidden":"true",className:L.shortcut,children:(0,H.jsx)(qe,{keys:D.shortcut.keys,className:L.shortcutKeys})})]},D.id))})]},d.id)},Ce=d=>{let W=d.target instanceof Element?d.target.closest('button[role="menuitem"]'):null;W===null||W.getAttribute("aria-haspopup")==="menu"||W.closest('[role="menu"]')===d.currentTarget&&N(null)},ve=e&&(0,H.jsxs)(Ke,{compact:w,ref:A,className:R(L.list,O,p&&L.denseList,w&&L.compactList,U&&L.scrollable,v&&L.portal,c==="top"&&!v&&L.sideTop,g==="end"&&!v&&L.alignEnd),style:v?te??Vt:void 0,role:"menu",onClick:d=>{d.stopPropagation();let W=d.target instanceof Element?d.target.closest('button[role="menuitem"]'):null;W!==null&&W.getAttribute("aria-haspopup")!=="menu"&&x()},onMouseOver:Ce,onFocus:Ce,children:[(0,H.jsxs)("div",{className:L.viewport,role:"presentation",children:[t.map(Ie),r]}),P!==void 0&&P.length>0&&(0,H.jsx)("div",{className:L.footer,role:"presentation",children:P.map(Ie)})]});return(0,H.jsxs)("span",{ref:E,className:R(L.root,f),onPointerEnter:_?l:void 0,onPointerLeave:_?()=>{e&&z()}:void 0,children:[n,v?ve!==!1&&(0,ct.createPortal)(ve,document.body):ve]})}var pt=require("react"),ut=require("react-dom");var J={root:"dshpi_b97756f9_root",mask:"dshpi_b97756f9_mask",dialog:"dshpi_b97756f9_dialog",content:"dshpi_b97756f9_content",header:"dshpi_b97756f9_header",title:"dshpi_b97756f9_title",close:"dshpi_b97756f9_close",description:"dshpi_b97756f9_description",body:"dshpi_b97756f9_body",footer:"dshpi_b97756f9_footer"};var K=require("react/jsx-runtime");function ge({open:e,onClose:n,title:t,closeLabel:r,description:s,children:a,footer:m,className:u,contentClassName:g,onKeyDownCapture:c,headless:v=!1,backdropBlur:_=!0,shortcutModal:p}){let w=(0,pt.useRef)(null);return it(w,e,n),e?(0,ut.createPortal)((0,K.jsxs)("div",{className:J.root,role:"presentation",onKeyDownCapture:c,children:[(0,K.jsx)("div",{className:J.mask,style:_?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:n}),(0,K.jsx)("div",{ref:w,tabIndex:-1,"data-shortcut-modal":p,className:R(J.dialog,u),role:"dialog","aria-modal":"true","aria-label":t,children:v?a:(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)("div",{className:R(J.content,g),children:[(0,K.jsxs)("div",{className:J.header,children:[(0,K.jsx)("h2",{className:J.title,children:t}),(0,K.jsx)("button",{type:"button",className:J.close,"aria-label":r,onClick:n,children:(0,K.jsx)(tt,{size:14})})]}),s!==void 0&&s!==""&&(0,K.jsx)("p",{className:J.description,children:s}),a!==void 0&&(0,K.jsx)("div",{className:J.body,children:a})]}),m!==void 0&&(0,K.jsx)("div",{className:J.footer,children:m})]})})]}),document.body):null}var le={dot:"dshpi_34138a6f_dot",spinner:"dshpi_34138a6f_spinner",spinnerMotion:"dshpi_34138a6f_spinnerMotion",spinnerTrack:"dshpi_34138a6f_spinnerTrack",spinnerArc:"dshpi_34138a6f_spinnerArc",step:"dshpi_34138a6f_step"};var ae=require("react/jsx-runtime");function Dt(e){e!==null&&(ht(e),e.addEventListener("animationstart",()=>{ht(e)}))}function ht(e){let n=e;for(let t of n.getAnimations?.({subtree:!0})??[])t.startTime=0}function Re({state:e,size:n,className:t,appearance:r="dot"}){let s=n??(e==="ongoing"?14:10);return e==="ongoing"?(0,ae.jsx)("svg",{ref:Dt,className:R(le.spinner,t),"data-state":"ongoing",width:s,height:s,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,ae.jsxs)("g",{className:le.spinnerMotion,children:[(0,ae.jsx)("circle",{className:le.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,ae.jsx)("circle",{className:le.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,ae.jsx)("span",{className:R(r==="step"?le.step:le.dot,t),"data-state":e,style:{width:s,height:s},"aria-hidden":"true",children:r==="step"&&e==="done"&&(0,ae.jsx)(Oe,{size:s-2})})}var Ft=Object.freeze({status:"idle",entries:[],integrations:[],services:[],error:!1}),He=class{constructor(n){this.connection=n,this.state=Ft,this.listeners=new Set,this.pending=void 0,this.closed=!1,this.tickets=new Set}getSnapshot=()=>this.state;subscribe=n=>(this.listeners.add(n),()=>this.listeners.delete(n));publish(n){if(!this.closed){this.state=n;for(let t of this.listeners)t()}}async call(n,t={},r){let s=await this.connection.rpc.call("/api",`dsh-pi-login/${n}`,t,r);if(!s.ok)throw new Error(s.error.code);return s.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let n={abort:new AbortController};return n.promise=this.call("connection-list",{},n.abort.signal).then(t=>{this.pending===n&&this.publish({status:"ready",...t,entries:t.connections??[],error:!1})},()=>{this.pending===n&&this.publish({...this.state,status:"ready",error:!0})}).finally(()=>{this.pending===n&&(this.pending=void 0)}),this.pending=n,this.publish({...this.state,status:"loading",error:!1}),n.promise}refresh(){let n=this.pending;return this.pending=void 0,n?.abort.abort(),this.load()}mutation(n,t={},r){let{profileKey:s,generation:a}=this.state;return this.call(n,{...t,profileKey:s,generation:a},r)}async start(n,t){let r=await this.mutation("start",{connectionId:n,method:t});if(typeof r.ticket!="string")throw new Error("invalid ticket");if(this.closed)throw await this.mutation("cancel",r),new Error("disposed");return this.tickets.add(r.ticket),r.ticket}async cancel(n){this.tickets.delete(n);try{await this.mutation("cancel",{ticket:n})}finally{await this.refresh()}}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear();for(let n of this.tickets)this.mutation("cancel",{ticket:n}).catch(()=>{});this.tickets.clear()}};var Zt="dsh-pi-login:update",Ee=class{constructor(n,t){if(t===void 0)try{t=globalThis.sessionStorage}catch{}this.connection=n,this.storage=t,this.listeners=new Set,this.state={status:"blocked",reason:"manager-unavailable"},this.generation=0,this.closed=!1,this.timer=null,this.profileKey=void 0,this.requestId=void 0}getSnapshot=()=>this.state;subscribe=n=>(this.listeners.add(n),()=>this.listeners.delete(n));storageKey(){return this.profileKey?`${Zt}:${this.profileKey}`:void 0}selectProfile(n){let t=typeof n=="string"&&/^[a-f0-9]{64}$/.test(n)?n:void 0;if(t!==this.profileKey&&(this.profileKey=t,this.requestId=void 0,t))try{this.requestId=this.storage?.getItem(this.storageKey())||void 0}catch{}}publish(n){if(!this.closed){n.profileKey&&this.selectProfile(n.profileKey),this.state=n;for(let t of this.listeners)t()}}async call(n,t={}){if(!this.connection)return{status:"blocked",reason:"manager-unavailable"};let r=await this.connection.rpc.call("/api",`dsh-pi-login/update-${n}`,t);if(!r.ok){let s=new Error(r.error.code);throw s.rejected=!0,s}return r.value}async load(){if(this.closed)return;let n=++this.generation;clearTimeout(this.timer);try{let t=await this.call("status");if(this.closed||n!==this.generation)return;this.selectProfile(t.profileKey),t.requestId&&(this.requestId=t.requestId);let r=this.requestId?await this.call("reconcile",{requestId:this.requestId,profileKey:this.profileKey}):t;if(this.closed||n!==this.generation)return;if(r.requestId){this.requestId=r.requestId;try{this.storage?.setItem(this.storageKey(),r.requestId)}catch{}}this.publish(r),["preparing","installing"].includes(r.status)&&(this.timer=setTimeout(()=>{this.load()},800))}catch{n===this.generation&&this.publish({...this.state,status:this.requestId?"unknown":"blocked",reason:"network"})}}async check(){if(this.closed||["checking","preparing","installing","starting","unknown"].includes(this.state.status))return;let n=++this.generation;this.publish({...this.state,status:"checking"});try{let t=await this.call("check");n===this.generation&&this.publish(t)}catch{n===this.generation&&this.publish({...this.state,status:"blocked",reason:"network"})}}async begin(){if(this.closed||!this.profileKey||this.state.status!=="available")return;let n=this.state.candidate,t=++this.generation;this.requestId=crypto.randomUUID();try{this.storage?.setItem(this.storageKey(),this.requestId)}catch{}this.publish({...this.state,status:"starting"});try{let r=await this.call("begin",{candidateId:n.id,requestId:this.requestId,profileKey:this.profileKey});if(this.closed||t!==this.generation)return;if(typeof r.requestId!="string")throw new Error("invalid request");this.requestId=r.requestId;try{this.storage?.setItem(this.storageKey(),r.requestId)}catch{}t===this.generation&&(this.publish({...this.state,...r}),await this.load())}catch(r){if(this.closed||t!==this.generation)return;if(r.rejected){this.requestId=void 0;try{this.storage?.removeItem(this.storageKey())}catch{}}t===this.generation&&this.publish({...this.state,status:r.rejected?"failed":"unknown",reason:r.message.endsWith("/busy")?"busy":r.message.endsWith("/profile")?"profile":"network"})}}dispose(){this.closed=!0,this.generation++,clearTimeout(this.timer),this.listeners.clear()}};var j={updateReason_storage:"Could not write the update files to the profile.",updateReason_interrupted:"The download was interrupted before installation. Check again.",updateTitle:"Pi plugin",updateIdle:"Check for a plugin release separately from the model catalog.",updateChecking:"Checking for updates\u2026",updateCurrent:"No newer stable release.",updateAvailable:"A plugin update is available. Your saved credentials and model choices are kept.",updateBlocked:"The update could not be checked or is unavailable.",updatePreparing:"Downloading and verifying the release\u2026",updateInstalling:"Installing the plugin\u2026",updateRestart:"Installed. Restart DSH when your current work is finished to apply the update.",updateApplied:"The updated plugin version is running.",updateFailed:"Update failed. Review the stage below and check again.",updateCancelled:"The installer confirmed cancellation.",updateOverridden:"Saved settings prevent the update from applying.",updateUnknown:"The installation result is unknown. Reconcile the operation before starting another update.",updateCheck:"Check plugin update",updateInstall:"Update plugin",updateReconcile:"Check installation result",updateManual:"Releases / manual update",updateChecked:"Last checked",updateStage:"Installer stage","updateReason_manager-unavailable":"Plugin manager or writable profile is unavailable. Use the Releases page.","updateReason_read-only":"This bundle is not writable in the active profile.",updateReason_source:"This installation source requires a manual update. Its version pin will be preserved.",updateReason_incompatible:"The release does not support this DSH version.","updateReason_compatibility-unknown":"The release compatibility could not be confirmed.",updateReason_busy:"Finish sign-in and settings saves before updating.",updateReason_profile:"The connected profile changed. Check again.",updateReason_network:"Could not contact the release service. Try again later.",updateReason_metadata:"Release metadata is invalid. Use the release link to review it.",updateReason_asset:"The required release assets are missing or ambiguous.",updateReason_channel:"This update accepts stable releases only.",updateReason_checksum:"Release checksum verification failed.",updateReason_redirect:"The release redirected to an unapproved host.",updateReason_size:"The release exceeded its download size limit.","updateReason_stale-candidate":"The release or installation changed. Check again.","updateReason_release-unavailable":"The release service returned no accessible release.",metaRateLimited:"Meta limited the account check. Wait before trying again.",reloadModels:"Update model list",catalogRefreshUnsupported:"Model list refresh is not supported for this provider yet. Update the plugin or SDK to get new models.",catalogRefreshFailed:"Could not update the model list. Try again or sign in again if needed.",metaSubscriptionActive:"Muse subscription active",metaSubscriptionInactive:"Muse subscription inactive",metaSubscriptionUnknown:"Muse subscription could not be confirmed",metaReloadHint:"Checks your Muse subscription and fetches its model list. New models start off. This does not test generation or Contributor billing. Reload again after restarting.",metaContributorHint:"Review Meta\u2019s Contributor data-use terms before enabling a Contributor model.",capabilitiesUnknown:"Capabilities not supplied: text only, provider-default reasoning, configured token limits.",metaLoginRequired:"Sign in to Meta with your Muse account first.",metaKeyOverride:"An API-key reference overrides your Muse login. Choose \u201CUse saved credentials\u201D or remove that reference first.",metaSettingsIncompatible:"Muse account reload requires the default Meta endpoint and saved login, without an Authorization header override.",metaAccountChanged:"Your Meta account changed during reload. Reload again.",useLogin:"Use saved credentials",keyOverride:"The configured API-key reference takes priority.",models:"Models",manageModels:"Choose models",useProvider:"Use this provider",searchModels:"Search models",fastWarning:"Fast mode uses paid priority processing or additional subscription credits. Availability depends on your account and model.",modelEnabled:"Use model",loading:"Loading\u2026",modelsFailed:"Could not load the models.",saveFailed:"Could not save settings. Try again.",modelsHint:"When the provider is on, selected models are available to chats and agents.",noResults:"No matching models.",disabledHint:"Turning this off keeps your credentials and model choices.",activateFirst:"Enable the provider before choosing models.",title:"Pi connections",description:"Choose a provider and sign-in method.",provider:"Provider",method:"Sign-in method",oauth:"Browser sign-in",apiKey:"API key",signIn:"Sign in",signInAgain:"Sign in again",connected:"Connected",notConnected:"Not connected",busy:"Signing in\u2026",openBrowser:"Continue in browser",code:"Verification code",copy:"Copy code",copied:"Copied",cancel:"Cancel",close:"Close",submit:"Continue",success:"Signed in",successDescription:"Your credentials are saved in DeepSeek Harness.",enable:"Enable provider",enabled:"Provider enabled.",failed:"Sign-in failed. Sign in again.",cancelled:"Sign-in cancelled. Sign in again.",providerExpired:"The verification code expired. Sign in again.",timedOut:"Sign-in timed out. Sign in again.",loadFailed:"Could not load the providers.",retry:"Retry",empty:"No Pi sign-in providers are available.",answer:"Enter the requested value",secret:"Enter your API key",selection:"Choose an option",enableFailed:"Signed in, but the provider could not be enabled. Try again.",waiting:"Complete the sign-in in your browser.",readOnly:"Credentials are read-only in this environment."},G={updateReason_storage:"profile\u5185\u306B\u66F4\u65B0\u7528\u30D5\u30A1\u30A4\u30EB\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_interrupted:"\u5C0E\u5165\u524D\u306E\u53D6\u5F97\u51E6\u7406\u304C\u4E2D\u65AD\u3055\u308C\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateTitle:"Pi\u30D7\u30E9\u30B0\u30A4\u30F3",updateIdle:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3068\u306F\u5225\u306B\u3001\u30D7\u30E9\u30B0\u30A4\u30F3\u672C\u4F53\u306E\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",updateChecking:"\u66F4\u65B0\u3092\u78BA\u8A8D\u4E2D\u2026",updateCurrent:"\u65B0\u3057\u3044\u6B63\u5F0F\u7248\u306F\u3042\u308A\u307E\u305B\u3093\u3002",updateAvailable:"\u66F4\u65B0\u304C\u3042\u308A\u307E\u3059\u3002\u4FDD\u5B58\u6E08\u307F\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateBlocked:"\u66F4\u65B0\u3092\u78BA\u8A8D\u3067\u304D\u306A\u3044\u304B\u3001\u3053\u306E\u74B0\u5883\u3067\u306F\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002",updatePreparing:"\u914D\u5E03\u7269\u3092\u53D6\u5F97\u30FB\u691C\u8A3C\u4E2D\u2026",updateInstalling:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u4E2D\u2026",updateRestart:"\u5C0E\u5165\u3057\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u4F5C\u696D\u3092\u7D42\u3048\u3066\u304B\u3089DSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u9069\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateApplied:"\u66F4\u65B0\u3057\u305F\u30D7\u30E9\u30B0\u30A4\u30F3\u304C\u52D5\u4F5C\u3057\u3066\u3044\u307E\u3059\u3002",updateFailed:"\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u5931\u6557\u6BB5\u968E\u3092\u78BA\u8A8D\u3057\u3066\u518D\u5EA6\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCancelled:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30E9\u30FC\u304C\u53D6\u6D88\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",updateOverridden:"\u4FDD\u5B58\u8A2D\u5B9A\u306B\u3088\u308A\u66F4\u65B0\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3002",updateUnknown:"\u5C0E\u5165\u7D50\u679C\u306F\u4E0D\u660E\u3067\u3059\u3002\u518D\u9001\u305B\u305A\u3001\u7D50\u679C\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCheck:"\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u66F4\u65B0\u3092\u78BA\u8A8D",updateInstall:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u66F4\u65B0\u3059\u308B",updateReconcile:"\u5C0E\u5165\u7D50\u679C\u3092\u78BA\u8A8D",updateManual:"\u914D\u5E03\u7248\u30FB\u624B\u52D5\u66F4\u65B0",updateChecked:"\u78BA\u8A8D\u6642\u523B",updateStage:"\u5C0E\u5165\u6BB5\u968E","updateReason_manager-unavailable":"plugin manager\u307E\u305F\u306F\u66F8\u304D\u8FBC\u307F\u53EF\u80FD\u306Aprofile\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u304B\u3089\u624B\u52D5\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_read-only":"\u3053\u306Eprofile\u3067\u306Fbundle\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_source:"\u3053\u306E\u5C0E\u5165\u5143\u306F\u624B\u52D5\u66F4\u65B0\u304C\u5FC5\u8981\u3067\u3059\u3002\u7248\u56FA\u5B9A\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateReason_incompatible:"\u3053\u306E\u914D\u5E03\u7248\u306F\u5B9F\u884C\u4E2D\u306EDSH\u7248\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","updateReason_compatibility-unknown":"\u914D\u5E03\u7248\u306EDSH\u4E92\u63DB\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_busy:"\u30ED\u30B0\u30A4\u30F3\u3068\u8A2D\u5B9A\u4FDD\u5B58\u3092\u5B8C\u4E86\u3057\u3066\u304B\u3089\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_profile:"\u63A5\u7D9A\u4E2D\u306E\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_network:"\u914D\u5E03\u30B5\u30FC\u30D3\u30B9\u3068\u306E\u901A\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_metadata:"\u914D\u5E03\u60C5\u5831\u304C\u4E0D\u6B63\u3067\u3059\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_asset:"\u5FC5\u8981\u306A\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u306A\u3044\u304B\u3001\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002",updateReason_channel:"\u3053\u306E\u66F4\u65B0\u6A5F\u80FD\u306F\u6B63\u5F0F\u7248\u306E\u307F\u6271\u3044\u307E\u3059\u3002",updateReason_checksum:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u306E\u30C1\u30A7\u30C3\u30AF\u30B5\u30E0\u691C\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",updateReason_redirect:"\u914D\u5E03\u53D6\u5F97\u5148\u304C\u8A31\u53EF\u3057\u3066\u3044\u306A\u3044\u30DB\u30B9\u30C8\u306B\u8EE2\u9001\u3055\u308C\u307E\u3057\u305F\u3002",updateReason_size:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u53D6\u5F97\u30B5\u30A4\u30BA\u4E0A\u9650\u3092\u8D85\u3048\u307E\u3057\u305F\u3002","updateReason_stale-candidate":"\u914D\u5E03\u60C5\u5831\u307E\u305F\u306F\u5C0E\u5165\u72B6\u614B\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_release-unavailable":"\u53D6\u5F97\u3067\u304D\u308B\u914D\u5E03\u7248\u304C\u3042\u308A\u307E\u305B\u3093\u3002",metaRateLimited:"Meta\u306E\u5951\u7D04\u78BA\u8A8D\u304C\u56DE\u6570\u5236\u9650\u306B\u9054\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",reloadModels:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0",catalogRefreshUnsupported:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306F\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u518D\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC\u3067\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u30D7\u30E9\u30B0\u30A4\u30F3\u307E\u305F\u306FSDK\u306E\u66F4\u65B0\u3067\u8FFD\u52A0\u3055\u308C\u307E\u3059\u3002",catalogRefreshFailed:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3059\u308B\u304B\u3001\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30ED\u30B0\u30A4\u30F3\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSubscriptionActive:"Muse\u5951\u7D04\u306F\u6709\u52B9\u3067\u3059",metaSubscriptionInactive:"Muse\u5951\u7D04\u306F\u7121\u52B9\u3067\u3059",metaSubscriptionUnknown:"Muse\u5951\u7D04\u306E\u6709\u52B9\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",metaReloadHint:"\u5951\u7D04\u3092\u78BA\u8A8D\u3057\u3066\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002\u751F\u6210\u3084Contributor\u5229\u7528\u67A0\u306E\u691C\u8A3C\u306F\u884C\u3044\u307E\u305B\u3093\u3002\u518D\u8D77\u52D5\u5F8C\u306F\u518D\u8AAD\u307F\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059\u3002",metaContributorHint:"Contributor\u3092\u6709\u52B9\u306B\u3059\u308B\u524D\u306B\u3001Meta\u306E\u30C7\u30FC\u30BF\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",capabilitiesUnknown:"\u80FD\u529B\u60C5\u5831\u306A\u3057\uFF1A\u30C6\u30AD\u30B9\u30C8\u306E\u307F\u3001\u63A8\u8AD6\u306F\u63A5\u7D9A\u5148\u306E\u65E2\u5B9A\u5024\u3001\u30C8\u30FC\u30AF\u30F3\u4E0A\u9650\u306F\u8A2D\u5B9A\u5024\u3092\u4F7F\u7528\u3002",metaLoginRequired:"\u5148\u306BMuse\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067Meta\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaKeyOverride:"API\u30AD\u30FC\u53C2\u7167\u304CMuse\u30ED\u30B0\u30A4\u30F3\u3088\u308A\u512A\u5148\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u300C\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046\u300D\u3092\u9078\u3076\u304B\u3001\u53C2\u7167\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSettingsIncompatible:"Muse\u5951\u7D04\u306E\u518D\u8AAD\u307F\u8FBC\u307F\u306B\u306F\u3001Meta\u306E\u6A19\u6E96\u63A5\u7D9A\u5148\u3068\u4FDD\u5B58\u6E08\u307F\u30ED\u30B0\u30A4\u30F3\u3092\u4F7F\u3044\u3001Authorization\u30D8\u30C3\u30C0\u30FC\u306E\u4E0A\u66F8\u304D\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaAccountChanged:"\u518D\u8AAD\u307F\u8FBC\u307F\u4E2D\u306BMeta\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u8AAD\u307F\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002",useLogin:"\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046",keyOverride:"\u8A2D\u5B9A\u6E08\u307F\u306EAPI\u30AD\u30FC\u53C2\u7167\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002",models:"\u30E2\u30C7\u30EB",manageModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",useProvider:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",searchModels:"\u30E2\u30C7\u30EB\u3092\u691C\u7D22",fastWarning:"Fast\u30E2\u30FC\u30C9\u306F\u901A\u5E38\u3088\u308A\u9AD8\u3044\u6599\u91D1\u30FB\u30AF\u30EC\u30B8\u30C3\u30C8\u6D88\u8CBB\u304C\u767A\u751F\u3057\u307E\u3059\u3002\u5229\u7528\u53EF\u5426\u306F\u30E2\u30C7\u30EB\u3068\u5951\u7D04\u306B\u3088\u308A\u307E\u3059\u3002",modelEnabled:"\u30E2\u30C7\u30EB\u3092\u4F7F\u3046",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",modelsFailed:"\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",noResults:"\u4E00\u81F4\u3059\u308B\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002",disabledHint:"\u30AA\u30D5\u306B\u3057\u3066\u3082\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",activateFirst:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",title:"Pi\u63A5\u7D9A",description:"\u63A5\u7D9A\u5148\u3068\u30ED\u30B0\u30A4\u30F3\u65B9\u6CD5\u3092\u9078\u3073\u307E\u3059\u3002",provider:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",method:"\u63A5\u7D9A\u65B9\u6CD5",oauth:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3",apiKey:"API\u30AD\u30FC",signIn:"\u30ED\u30B0\u30A4\u30F3",signInAgain:"\u518D\u30ED\u30B0\u30A4\u30F3",connected:"\u63A5\u7D9A\u6E08\u307F",notConnected:"\u672A\u63A5\u7D9A",busy:"\u30ED\u30B0\u30A4\u30F3\u4E2D\u2026",openBrowser:"\u30D6\u30E9\u30A6\u30B6\u3067\u7D9A\u3051\u308B",code:"\u8A8D\u8A3C\u30B3\u30FC\u30C9",copy:"\u30B3\u30FC\u30C9\u3092\u30B3\u30D4\u30FC",copied:"\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",close:"\u9589\u3058\u308B",submit:"\u7D9A\u3051\u308B",success:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F",successDescription:"\u8A8D\u8A3C\u60C5\u5831\u3092DeepSeek Harness\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",enable:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",failed:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cancelled:"\u30ED\u30B0\u30A4\u30F3\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",providerExpired:"\u8A8D\u8A3C\u30B3\u30FC\u30C9\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",timedOut:"\u30ED\u30B0\u30A4\u30F3\u306E\u5F85\u6A5F\u6642\u9593\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loadFailed:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",retry:"\u518D\u8A66\u884C",empty:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u308BPi\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093\u3002",answer:"\u8981\u6C42\u3055\u308C\u305F\u5024\u3092\u5165\u529B",secret:"API\u30AD\u30FC\u3092\u5165\u529B",selection:"\u9805\u76EE\u3092\u9078\u629E",enableFailed:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u304C\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",waiting:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044\u3002",readOnly:"\u3053\u306E\u74B0\u5883\u3067\u306F\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002"};Object.assign(j,{title:"AI connections & usage",description:"Manage each account and its models. Open usage details when needed.",connectionsTab:"Connections & models",usageTab:"Usage",addConnection:"Add connection",connectionSettings:"Connection settings",manageModels:"Manage models",searchConnections:"Search connections",filterStatus:"Status",filter_all:"All",filter_connected:"Connected",filter_disconnected:"Not connected",integration:"Integration",service:"Service",connectionName:"Connection name",namePlaceholder:"Personal Pro / Company API",oauthShort:"OAuth",endpoint:"Endpoint URL (optional)",protocol:"Protocol",oauthHint:"Sign in to this account in the browser. Credentials stay within this connection.",save:"Save",saved:"Connection settings saved.",confirmSave:"Confirm change and save",methodChangeWarning:"Changing the sign-in method changes the account or billing used by this connection. Confirm before saving.",cloneConnection:"Duplicate settings",copySuffix:"copy",deleteConnection:"Delete connection",confirmDelete:"Delete this connection",deleteWarning:"Delete this connection and its saved credentials? Its models will no longer be available.",keySaved:"A key is saved. Leave this field empty to keep it. The saved key is never displayed.",showSecret:"Show input",hideSecret:"Hide input",paste:"Paste",pasteFailed:"Clipboard access was unavailable. Paste directly into the field.",availableModels:"Models enabled",authExpired:"Sign-in expired",externalSettings:"Open integration settings",refreshUsage:"Refresh usage",usageFailed:"Could not refresh usage. The last available reading is kept.",usage_available:"Account usage",usage_unobserved:"Not observed yet",usage_unsupported:"Usage is not supported",usage_unknown:"Usage is unknown",usage_unavailable:"Usage is unavailable",usage_auth_required:"Sign in to check usage","usage_auth-required":"Sign in to check usage",usage_stale:"Last reading is out of date","usage_rate-limited":"Rate limited. Retry after the time below.",usage_error:"Usage could not be checked",quota_unlimited:"Unlimited",quota_unavailable:"Limit unavailable",quota_unallocated:"No quota allocated",quota_unknown:"Amount unknown",used:"used",remaining:"Remaining",estimated:"Estimated",unit_credits:"credits",unit_requests:"requests",resets:"Resets",resetDate:"Reset date (time not supplied)",retryAt:"Retry after",observedAt:"Last observed",checkedAt:"Last checked",lastObserved:"Recorded from a prior response. Opening this screen does not run a generation.",endpointUntrusted:"This endpoint is not trusted by the host. Add it to the host allowlist before saving.",serviceUnavailable:"This integration does not provide a supported model connection in this DSH version.",cloneHint:"The copy starts disabled and has no credentials. Configure its account separately."});Object.assign(G,{title:"AI\u63A5\u7D9A\u30FB\u5229\u7528\u72B6\u6CC1",description:"\u30A2\u30AB\u30A6\u30F3\u30C8\u3054\u3068\u306B\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB\u3092\u7BA1\u7406\u3057\u307E\u3059\u3002\u5229\u7528\u72B6\u6CC1\u306F\u5FC5\u8981\u306A\u3068\u304D\u306B\u958B\u3051\u307E\u3059\u3002",connectionsTab:"\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB",usageTab:"\u5229\u7528\u72B6\u6CC1",addConnection:"\u63A5\u7D9A\u3092\u8FFD\u52A0",connectionSettings:"\u63A5\u7D9A\u8A2D\u5B9A",manageModels:"\u30E2\u30C7\u30EB\u3092\u7BA1\u7406",searchConnections:"\u63A5\u7D9A\u3092\u691C\u7D22",filterStatus:"\u63A5\u7D9A\u72B6\u614B",filter_all:"\u3059\u3079\u3066",filter_connected:"\u63A5\u7D9A\u6E08\u307F",filter_disconnected:"\u672A\u63A5\u7D9A",integration:"\u9023\u643A",service:"\u30B5\u30FC\u30D3\u30B9",connectionName:"\u63A5\u7D9A\u540D",namePlaceholder:"\u500B\u4EBAPro\u30FB\u4F1A\u793EAPI\u306A\u3069",oauthShort:"OAuth",endpoint:"\u63A5\u7D9A\u5148URL\uFF08\u4EFB\u610F\uFF09",protocol:"\u901A\u4FE1\u65B9\u5F0F",oauthHint:"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067\u30D6\u30E9\u30A6\u30B6\u304B\u3089\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3059\u3002\u8A8D\u8A3C\u60C5\u5831\u306F\u63A5\u7D9A\u3054\u3068\u306B\u4FDD\u5B58\u3057\u307E\u3059\u3002",save:"\u4FDD\u5B58",saved:"\u63A5\u7D9A\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",confirmSave:"\u5909\u66F4\u3092\u78BA\u8A8D\u3057\u3066\u4FDD\u5B58",methodChangeWarning:"\u8A8D\u8A3C\u65B9\u5F0F\u3092\u5909\u3048\u308B\u3068\u3001\u3053\u306E\u63A5\u7D9A\u3067\u4F7F\u3046\u30A2\u30AB\u30A6\u30F3\u30C8\u3084\u8AB2\u91D1\u5148\u304C\u5909\u308F\u308A\u307E\u3059\u3002\u78BA\u8A8D\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cloneConnection:"\u8A2D\u5B9A\u3092\u8907\u88FD",copySuffix:"\u30B3\u30D4\u30FC",deleteConnection:"\u63A5\u7D9A\u3092\u524A\u9664",confirmDelete:"\u3053\u306E\u63A5\u7D9A\u3092\u524A\u9664\u3059\u308B",deleteWarning:"\u3053\u306E\u63A5\u7D9A\u3068\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u60C5\u5831\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F\u3053\u306E\u63A5\u7D9A\u306E\u30E2\u30C7\u30EB\u306F\u5229\u7528\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059\u3002",keySaved:"\u30AD\u30FC\u306F\u4FDD\u5B58\u6E08\u307F\u3067\u3059\u3002\u5909\u66F4\u3057\u306A\u3044\u5834\u5408\u306F\u7A7A\u6B04\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u4FDD\u5B58\u6E08\u307F\u306E\u30AD\u30FC\u306F\u8868\u793A\u3057\u307E\u305B\u3093\u3002",showSecret:"\u5165\u529B\u3092\u8868\u793A",hideSecret:"\u5165\u529B\u3092\u96A0\u3059",paste:"\u8CBC\u308A\u4ED8\u3051",pasteFailed:"\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u5165\u529B\u6B04\u306B\u76F4\u63A5\u8CBC\u308A\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044\u3002",availableModels:"\u30E2\u30C7\u30EB\u6709\u52B9",authExpired:"\u8A8D\u8A3C\u5207\u308C",externalSettings:"\u9023\u643A\u5143\u306E\u8A2D\u5B9A\u3092\u958B\u304F",refreshUsage:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0",usageFailed:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u524D\u56DE\u306E\u53D6\u5F97\u7D50\u679C\u3092\u4FDD\u6301\u3057\u3066\u3044\u307E\u3059\u3002",usage_available:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u72B6\u6CC1",usage_unobserved:"\u307E\u3060\u89B3\u6E2C\u3057\u3066\u3044\u307E\u305B\u3093",usage_unsupported:"\u5229\u7528\u72B6\u6CC1\u306E\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC",usage_unknown:"\u5229\u7528\u72B6\u6CC1\u306F\u4E0D\u660E\u3067\u3059",usage_unavailable:"\u5229\u7528\u72B6\u6CC1\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093",usage_auth_required:"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059","usage_auth-required":"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059",usage_stale:"\u524D\u56DE\u306E\u60C5\u5831\u3067\u3059\u3002\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044","usage_rate-limited":"\u53D6\u5F97\u56DE\u6570\u306E\u5236\u9650\u4E2D\u3067\u3059\u3002\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",usage_error:"\u5229\u7528\u72B6\u6CC1\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",quota_unlimited:"\u7121\u5236\u9650",quota_unavailable:"\u5229\u7528\u67A0\u306F\u4E0D\u660E",quota_unallocated:"\u5229\u7528\u67A0\u306E\u5272\u5F53\u306A\u3057",quota_unknown:"\u4F7F\u7528\u91CF\u306F\u4E0D\u660E",used:"\u4F7F\u7528",remaining:"\u6B8B\u91CF",estimated:"\u63A8\u5B9A",unit_credits:"\u30AF\u30EC\u30B8\u30C3\u30C8",unit_requests:"\u30EA\u30AF\u30A8\u30B9\u30C8",resets:"\u30EA\u30BB\u30C3\u30C8\u6642\u523B",resetDate:"\u30EA\u30BB\u30C3\u30C8\u65E5\uFF08\u6642\u523B\u306E\u60C5\u5831\u306A\u3057\uFF09",retryAt:"\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B",observedAt:"\u6700\u7D42\u89B3\u6E2C\u6642\u523B",checkedAt:"\u6700\u7D42\u53D6\u5F97\u6642\u523B",lastObserved:"\u904E\u53BB\u306E\u5FDC\u7B54\u3067\u89B3\u6E2C\u3057\u305F\u60C5\u5831\u3067\u3059\u3002\u3053\u306E\u753B\u9762\u3092\u958B\u3044\u3066\u3082\u751F\u6210\u306F\u884C\u3044\u307E\u305B\u3093\u3002",endpointUntrusted:"\u3053\u306E\u63A5\u7D9A\u5148\u306F\u30DB\u30B9\u30C8\u3067\u8A31\u53EF\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u30DB\u30B9\u30C8\u306E\u8A31\u53EF\u30EA\u30B9\u30C8\u306B\u8FFD\u52A0\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",serviceUnavailable:"\u3053\u306EDSH\u7248\u3067\u306F\u3001\u3053\u306E\u9023\u643A\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002",cloneHint:"\u8907\u88FD\u3057\u305F\u63A5\u7D9A\u306F\u7121\u52B9\u30FB\u8A8D\u8A3C\u306A\u3057\u3067\u4F5C\u6210\u3057\u307E\u3059\u3002\u30A2\u30AB\u30A6\u30F3\u30C8\u306F\u5225\u306B\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(j,{hours:"hours",days:"days",minutes:"minutes",accountQuota:"Account quota",unit_tokens:"tokens",unit_USD:"USD",ownerManaged:"Managed by integration",directory_live:"Available",directory_declared:"Declared",directory_unavailable:"Unavailable",sourceUnknown:"Owner unknown","serviceUnavailable_muse-code-bridge-unverified":"Muse Code requires the official CLI and a supported agent session connection in this environment. It is separate from the Meta Model API through Pi."});Object.assign(G,{hours:"\u6642\u9593",days:"\u65E5",minutes:"\u5206",accountQuota:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u67A0",unit_tokens:"\u30C8\u30FC\u30AF\u30F3",unit_USD:"USD",ownerManaged:"\u9023\u643A\u5143\u3067\u7BA1\u7406",directory_live:"\u5229\u7528\u53EF\u80FD",directory_declared:"\u8A2D\u5B9A\u3042\u308A",directory_unavailable:"\u5229\u7528\u4E0D\u53EF",sourceUnknown:"\u7BA1\u7406\u5143\u4E0D\u660E","serviceUnavailable_muse-code-bridge-unverified":"Muse Code\u306B\u306F\u516C\u5F0FCLI\u3068\u3001\u3053\u306E\u74B0\u5883\u3067\u5BFE\u5FDC\u3059\u308B\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u63A5\u7D9A\u304C\u5FC5\u8981\u3067\u3059\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u306E\u9023\u643A\u3067\u3059\u3002"});Object.assign(j,{museModels:"Muse Code model",museSessionHint:"Muse Code runs independent agent sessions. These models are separate from Pi\u2019s Meta Model API and are not added to the standard DSH model list.",museCatalogDiagnostic:"The host supplied a diagnostic catalog without a supported session model. Model availability does not confirm your account entitlement.",agentSessionEnabled:"Agent connection enabled","error_muse-code-cli-required":"Install the official Muse Code CLI and supported MSP SDK on the host, then retry.","error_muse-code-protocol-unsupported":"This Muse Code CLI does not support account or settings management. Update the official CLI.","error_muse-code-login-required":"Sign in to this Muse Code connection first.","error_muse-code-login-failed":"Muse Code sign-in did not complete. Retry from this connection\u2019s settings.","error_muse-code-mode-unavailable":"This account or CLI could not apply the selected model.","error_muse-code-connection-changed":"The Muse Code connection changed. Close this panel and open it again.","error_muse-code-busy":"Muse Code is already performing an operation. Retry after it finishes.","error_muse-code-model-unavailable":"This model was not advertised by the current Muse Code host. Reload the panel.","error_muse-code-unavailable":"Muse Code is unavailable. Check the official CLI and this connection\u2019s sign-in.","error_muse-code-llm-unsupported":"This Muse Code host does not provide a standard DSH model bridge.","error_muse-code-session-failed":"The Muse Code agent session failed. Check this connection and retry."});Object.assign(G,{museModels:"Muse Code\u306E\u30E2\u30C7\u30EB",museSessionHint:"Muse Code\u306F\u72EC\u7ACB\u3057\u305F\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u3067\u3059\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u3067\u3001DSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u4E00\u89A7\u306B\u306F\u8FFD\u52A0\u3057\u307E\u305B\u3093\u3002",museCatalogDiagnostic:"\u3053\u306E\u30DB\u30B9\u30C8\u306E\u4E00\u89A7\u306F\u78BA\u8A8D\u7528\u3067\u3001\u5BFE\u5FDC\u3059\u308B\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u53D6\u5F97\u3060\u3051\u3067\u306F\u5951\u7D04\u306B\u3088\u308B\u5229\u7528\u53EF\u5426\u306F\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",agentSessionEnabled:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u63A5\u7D9A\u6709\u52B9","error_muse-code-cli-required":"\u30DB\u30B9\u30C8\u306B\u516C\u5F0FMuse Code CLI\u3068\u5BFE\u5FDC\u3059\u308BMSP SDK\u3092\u5C0E\u5165\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-protocol-unsupported":"\u3053\u306EMuse Code CLI\u306F\u30A2\u30AB\u30A6\u30F3\u30C8\u30FB\u8A2D\u5B9A\u7BA1\u7406\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-required":"\u5148\u306B\u3053\u306EMuse Code\u63A5\u7D9A\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-failed":"Muse Code\u306E\u30ED\u30B0\u30A4\u30F3\u304C\u5B8C\u4E86\u3057\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u306E\u8A2D\u5B9A\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-mode-unavailable":"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u307E\u305F\u306FCLI\u3067\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002","error_muse-code-connection-changed":"Muse Code\u63A5\u7D9A\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3053\u306E\u753B\u9762\u3092\u9589\u3058\u3066\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-busy":"Muse Code\u306E\u51E6\u7406\u4E2D\u3067\u3059\u3002\u5B8C\u4E86\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-model-unavailable":"\u73FE\u5728\u306EMuse Code\u30DB\u30B9\u30C8\u306B\u3053\u306E\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-unavailable":"Muse Code\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3068\u3053\u306E\u63A5\u7D9A\u306E\u30ED\u30B0\u30A4\u30F3\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-llm-unsupported":"\u3053\u306EMuse Code\u30DB\u30B9\u30C8\u306FDSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","error_muse-code-session-failed":"Muse Code\u306E\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(j,{authUnavailable:"Account status unavailable"});Object.assign(G,{authUnavailable:"\u63A5\u7D9A\u72B6\u614B\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093"});Object.assign(j,{authVerified:"Sign-in verified"});Object.assign(G,{authVerified:"\u63A5\u7D9A\u78BA\u8A8D\u6E08\u307F"});Object.assign(j,{"usageScope_muse-code-subscription-weekly":"Weekly quota","error_muse-code-observation-invalid":"The Muse Code response could not be verified. Update the official CLI and reopen this panel."});Object.assign(G,{"usageScope_muse-code-subscription-weekly":"\u9031\u9593\u306E\u5229\u7528\u67A0","error_muse-code-observation-invalid":"Muse Code\u306E\u5FDC\u7B54\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3001\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(j,{useProvider:"Use this connection",enable:"Enable connection",enabled:"Connection enabled.",activateFirst:"Enable this connection before choosing models.",modelsHint:"When this connection is enabled, its selected models are available to chats and agents."});Object.assign(G,{useProvider:"\u3053\u306E\u63A5\u7D9A\u3092\u4F7F\u3046",enable:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",activateFirst:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u3053\u306E\u63A5\u7D9A\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002"});Object.assign(j,{museEntitlementUnverified:"This model appears in the catalog. Generation entitlement for this subscription has not been verified."});Object.assign(G,{museEntitlementUnverified:"\u4E00\u89A7\u306B\u3042\u308B\u30E2\u30C7\u30EB\u3067\u3059\u3002\u3053\u306E\u5951\u7D04\u3067\u306E\u751F\u6210\u6A29\u9650\u306F\u672A\u78BA\u8A8D\u3067\u3059\u3002"});Object.assign(j,{museModelSaved:"Muse Code model saved.",museWonderOne:"Wonder1",museWonderFull:"Wonder Full"});Object.assign(G,{museModelSaved:"Muse Code\u306E\u30E2\u30C7\u30EB\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",museWonderOne:"Wonder1",museWonderFull:"Wonder Full"});Object.assign(j,{title:"AI connections",addAndSignIn:"Add and sign in",add:"Add",advanced:"Advanced",chooseModels:"Choose models",modelsShort:"Models",modelsOn:"{count} on",modelsHint:"Models you turn on are available in chats and agents while this connection is on.",signedInReady:"Signed in. This connection is ready to use.",statusOff:"Off",keySavedPlaceholder:"Saved. Enter a new key to replace it.",emptyConnections:"No connections yet. Add one to sign in or use an API key.",deleted:"Connection deleted.",cloned:"Settings duplicated. The copy starts off and needs its own sign-in.",lastObservedShort:"From an earlier response"});Object.assign(G,{title:"AI\u63A5\u7D9A",addAndSignIn:"\u8FFD\u52A0\u3057\u3066\u30ED\u30B0\u30A4\u30F3",add:"\u8FFD\u52A0",advanced:"\u8A73\u7D30\u8A2D\u5B9A",chooseModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",modelsShort:"\u30E2\u30C7\u30EB",modelsOn:"{count}\u4EF6\u30AA\u30F3",modelsHint:"\u30AA\u30F3\u306B\u3057\u305F\u30E2\u30C7\u30EB\u306F\u3001\u3053\u306E\u63A5\u7D9A\u304C\u30AA\u30F3\u306E\u3068\u304D\u30C1\u30E3\u30C3\u30C8\u3068\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",signedInReady:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u3092\u4F7F\u3048\u307E\u3059\u3002",statusOff:"\u30AA\u30D5",keySavedPlaceholder:"\u4FDD\u5B58\u6E08\u307F\u3002\u5909\u66F4\u3059\u308B\u3068\u304D\u3060\u3051\u5165\u529B",emptyConnections:"\u63A5\u7D9A\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002\u300C\u63A5\u7D9A\u3092\u8FFD\u52A0\u300D\u304B\u3089\u30ED\u30B0\u30A4\u30F3\u307E\u305F\u306FAPI\u30AD\u30FC\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",deleted:"\u63A5\u7D9A\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002",cloned:"\u8A2D\u5B9A\u3092\u8907\u88FD\u3057\u307E\u3057\u305F\u3002\u8907\u88FD\u306F\u30AA\u30D5\u30FB\u672A\u30ED\u30B0\u30A4\u30F3\u3067\u4F5C\u6210\u3055\u308C\u307E\u3059\u3002",lastObservedShort:"\u4EE5\u524D\u306E\u5FDC\u7B54\u304B\u3089"});Object.assign(j,{museContributorNote:"Contributor choices let Meta use your content to train future models, in exchange for more plan usage. They start off; turn on only the ones you want.",museCatalogEmpty:"Load this account\u2019s Muse Code models. New models appear here; Contributor versions start off.",museLoginRequired:"Sign in to this Muse Code connection first.",museCatalogFailed:"Could not load the Muse Code model list. Sign in again or try later."});Object.assign(G,{museContributorNote:"Contributor\u7248\u306F\u3001\u5229\u7528\u67A0\u304C\u5897\u3048\u308B\u4EE3\u308F\u308A\u306BMeta\u304C\u5185\u5BB9\u3092\u5C06\u6765\u306E\u30E2\u30C7\u30EB\u306E\u5B66\u7FD2\u306B\u4F7F\u3044\u307E\u3059\u3002\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002\u4F7F\u3046\u3082\u306E\u3060\u3051\u30AA\u30F3\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",museCatalogEmpty:"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u306EMuse Code\u306E\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3059\u3002Contributor\u7248\u306F\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002",museLoginRequired:"\u5148\u306B\u3053\u306EMuse Code\u63A5\u7D9A\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",museCatalogFailed:"Muse Code\u306E\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u30ED\u30B0\u30A4\u30F3\u3059\u308B\u304B\u3001\u6642\u9593\u3092\u304A\u3044\u3066\u8A66\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});var gt=`.dsh-pi-login { color: var(--dsw-alias-label-primary); font-family: var(--dsw-font-family); font-size: 13px; line-height: 1.6; }
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
`;var o=require("react/jsx-runtime"),vt="dsh.piLogin",Kt=["slots","locale","connection"];function $t(e){return(0,i.useSyncExternalStore)(n=>e.subscribe(n),()=>e.getSnapshot().revision),e.bind(vt)}function wt(e){try{let n=new URL(e);if(n.protocol==="https:"||n.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(n.hostname))return n.href}catch{}}function Be(e,n=!1){if(!e)return;let t=new Date(e);if(Number.isNaN(t.valueOf()))return n?e:void 0;let r=document.documentElement.lang||void 0;try{return new Intl.DateTimeFormat(r,n?{dateStyle:"medium"}:{dateStyle:"medium",timeStyle:"short"}).format(t)}catch{return t.toLocaleString()}}var ft=typeof CSS<"u"&&CSS.supports?.("-webkit-text-security","disc")===!0,fe={autoComplete:"off",autoCapitalize:"off",autoCorrect:"off",spellCheck:!1,"data-1p-ignore":"","data-lpignore":"true","data-form-type":"other"};function kt(e){return{...fe,type:e&&!ft?"password":"text",className:e&&ft?"dsh-pi-masked":void 0}}function me({label:e,value:n,options:t,onChange:r,disabled:s}){let[a,m]=(0,i.useState)(!1),u=(0,i.useId)();return(0,o.jsxs)("div",{className:"dsh-pi-choice",children:[(0,o.jsx)("span",{id:u,className:"dsh-pi-caption",children:e}),(0,o.jsx)($e,{open:a,onClose:()=>m(!1),portal:!0,selectedId:n,items:t,onSelect:g=>{r(g),m(!1)},anchor:(0,o.jsxs)(b,{variant:"outline",disabled:s,"aria-labelledby":u,"aria-haspopup":"menu","aria-expanded":a,onClick:()=>m(!a),className:"dsh-pi-choice-button",children:[(0,o.jsx)("span",{children:t.find(g=>g.id===n)?.label}),(0,o.jsx)(Fe,{size:14})]})})]})}function jt({prompt:e,ticket:n,controller:t,t:r,onFailure:s}){let[a,m]=(0,i.useState)(""),[u,g]=(0,i.useState)(!1),[c,v]=(0,i.useState)(!1),[_,p]=(0,i.useState)(!1),w=(0,i.useId)();async function h(M){M.preventDefault();let k=a;m(""),g(!0);try{await t.mutation("answer",{ticket:n,id:e.id,value:k})}catch{s()}finally{g(!1)}}return(0,o.jsxs)("form",{onSubmit:h,className:"dsh-pi-prompt",children:[e.kind==="select"?(0,o.jsx)(me,{label:e.message||r("selection"),value:a,options:e.options,onChange:m,disabled:u}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("label",{htmlFor:w,children:e.message||r(e.kind==="secret"?"secret":"answer")}),(0,o.jsx)(ee,{id:w,"data-modal-autofocus":!0,...e.kind==="secret"?kt(!c):fe,value:a,placeholder:e.placeholder,onChange:M=>m(M.target.value)}),e.kind==="secret"?(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[(0,o.jsx)(b,{size:"sm",onClick:()=>v(!c),"aria-pressed":c,children:r(c?"hideSecret":"showSecret")}),(0,o.jsx)(b,{size:"sm",onClick:async()=>{try{m(await navigator.clipboard.readText()),p(!1)}catch{p(!0)}},children:r("paste")})]}):null]}),_?(0,o.jsx)("p",{role:"alert",children:r("pasteFailed")}):null,(0,o.jsx)("div",{className:"dsh-pi-actions",children:(0,o.jsx)(b,{type:"submit",variant:"primary",disabled:u||e.kind==="select"&&!a,children:r("submit")})})]})}function Gt({entry:e,method:n,controller:t,t:r,onClose:s,onModels:a}){let m=(0,i.useRef)(),[u,g]=(0,i.useState)(),[c,v]=(0,i.useState)({status:"running"}),[_,p]=(0,i.useState)(!1),[w,h]=(0,i.useState)(!1),[M,k]=(0,i.useState)(e.enabled===!0),[P,f]=(0,i.useState)(!1),[O,E]=(0,i.useState)(!1),[A,T]=(0,i.useState)(!1);(0,i.useEffect)(()=>{let Z=!0;return t.start(e.connectionId,n).then(N=>{m.current=N,Z?g(N):t.cancel(N).catch(()=>{})},N=>{Z&&p(xe(N))}),()=>{Z=!1,m.current&&t.cancel(m.current).catch(()=>{})}},[]),(0,i.useEffect)(()=>{if(!u)return;let Z=!0,N,te=new AbortController;async function Y(){try{let z=await t.call("state",{ticket:u},te.signal);if(!Z)return;v(z),z.status==="running"?N=setTimeout(Y,800):(t.tickets.delete(u),z.status==="authorized"&&e.enabled!==!0?await x():await t.refresh())}catch(z){Z&&p(xe(z))}}return Y(),()=>{Z=!1,te.abort(),clearTimeout(N)}},[u]);let B=wt(c.notice?.url),C=c.status!=="running"||_,I=c.reason?.startsWith("muse-code-")?xe(new Error(c.reason)):c.reason==="provider-expired"?"providerExpired":c.reason==="timeout"?"timedOut":c.status==="cancelled"?"cancelled":"failed";async function x(Z=!1){h(!0),f(!1);try{await t.mutation(Z?"use-login":"enable",{connectionId:e.connectionId}),k(!0),E(!1)}catch(N){f(!0),E(N.message.endsWith("/api-key-override"))}finally{h(!1),await t.refresh().catch(()=>{})}}let S=c.status==="authorized";return(0,o.jsxs)(ge,{open:!0,onClose:s,title:e.displayName,closeLabel:r("close"),className:"dsh-pi-login dsh-pi-dialog",footer:(0,o.jsxs)(o.Fragment,{children:[S&&M&&a&&e.capabilities?.models!==!1?(0,o.jsx)(b,{variant:"primary",onClick:()=>a(e),children:r("chooseModels")}):null,(0,o.jsx)(b,{variant:"outline",onClick:s,children:r(C?"close":"cancel")})]}),children:[_||c.status==="failed"?(0,o.jsx)("p",{role:"alert",children:r(_||I)}):null,S?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:"status",className:"dsh-pi-success",children:r(M?"signedInReady":w?"loading":"success")}),P?(0,o.jsx)("p",{role:"alert",children:r(O?"keyOverride":"enableFailed")}):null,P&&!O?(0,o.jsx)(b,{variant:"outline",onClick:()=>{x()},disabled:w,children:r("enable")}):null,O&&!M?(0,o.jsx)(b,{variant:"outline",onClick:()=>{x(!0)},disabled:w,children:r("useLogin")}):null]}):null,c.status==="cancelled"?(0,o.jsx)("p",{role:c.reason==="timeout"?"alert":"status",children:r(I)}):null,C?null:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:"status",children:c.notice?.message||r(B?"waiting":"busy")}),c.notice?.code?(0,o.jsxs)("div",{className:"dsh-pi-verification",children:[(0,o.jsx)("span",{className:"dsh-pi-muted",children:r("code")}),(0,o.jsxs)("div",{className:"dsh-pi-verification-row",children:[(0,o.jsx)("code",{children:c.notice.code}),(0,o.jsx)(b,{size:"sm",variant:"outline",onClick:async()=>{try{await navigator.clipboard.writeText(c.notice.code),T(!0)}catch{T(!1)}},children:r(A?"copied":"copy")})]})]}):null,B?(0,o.jsx)("a",{className:"dsh-pi-button-link",href:B,target:"_blank",rel:"noopener noreferrer",children:r("openBrowser")}):null,c.prompt?(0,o.jsx)(jt,{prompt:c.prompt,ticket:u,controller:t,t:r,onFailure:()=>p("failed")},c.prompt.id):null]})]})}function Qt({entry:e,controller:n,t,onClose:r}){let[s,a]=(0,i.useState)(),[m,u]=(0,i.useState)(""),[g,c]=(0,i.useState)(()=>new Set),[v,_]=(0,i.useState)(!1),[p,w]=(0,i.useState)(!1),[h,M]=(0,i.useState)(""),k=(0,i.useRef)(),P=(0,i.useRef)(0),f=(0,i.useRef)(Promise.resolve());(0,i.useEffect)(()=>{let C=new AbortController;return n.call("models",{connectionId:e.connectionId},C.signal).then(a,()=>{C.signal.aborted||w(!0)}),()=>{C.abort(),k.current?.abort(),P.current++}},[e.connectionId]);async function O(){let C=++P.current;k.current?.abort();let I=new AbortController;k.current=I,_(!0),M(""),w(!1);try{let x=await n.call("refresh-models",{connectionId:e.connectionId},I.signal);!I.signal.aborted&&C===P.current&&a(x)}catch(x){if(!I.signal.aborted&&C===P.current){let S=x.message.split("/").pop();M(s?.refresh?.errors?.[S]??"catalogRefreshFailed")}}finally{!I.signal.aborted&&C===P.current&&_(!1)}}function E(C,I){w(!1),c(x=>new Set(x).add(C)),a(x=>({...x,models:x.models.map(S=>S.id===C?{...S,enabled:I}:S)})),f.current=f.current.then(async()=>{try{let x=await n.call("models",{connectionId:e.connectionId});await n.mutation("set-model",{connectionId:e.connectionId,model:C,enabled:I,revision:x.revision})}catch{w(!0)}try{a(await n.call("models",{connectionId:e.connectionId}))}catch{}c(x=>{let S=new Set(x);return S.delete(C),S})}),f.current.then(()=>n.refresh()).catch(()=>{})}let A=m.trim().toLowerCase(),T=s?.models.filter(C=>`${C.id} ${C.name}`.toLowerCase().includes(A)),B=s?.models.filter(C=>C.enabled).length??0;return(0,o.jsxs)(ge,{open:!0,title:e.displayName,description:t("modelsHint"),closeLabel:t("close"),onClose:r,className:"dsh-pi-login dsh-pi-dialog dsh-pi-models-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsx)(b,{variant:"outline",onClick:r,children:t("close")}),children:[s&&s.models.length>8?(0,o.jsx)(ee,{icon:(0,o.jsx)(We,{size:16}),"aria-label":t("searchModels"),placeholder:t("searchModels"),"data-modal-autofocus":!0,value:m,onChange:C=>u(C.target.value)}):null,(0,o.jsxs)("div",{className:"dsh-pi-toolbar dsh-pi-models-toolbar",children:[s?(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("modelsOn").replace("{count}",String(B))}):(0,o.jsx)("span",{role:"status",children:p?"":t("loading")}),s?.refresh?.canRefresh&&s.models.length?(0,o.jsx)(b,{variant:"ghost",size:"sm",disabled:v||!e.writable,onClick:()=>{O()},children:t(v?"loading":"reloadModels")}):null]}),s?.refresh?.status?(0,o.jsxs)("p",{role:"status",className:"dsh-pi-muted",children:[t(s.refresh.status.message),s.refresh.status.detail?` \xB7 ${s.refresh.status.detail}`:""]}):null,h?(0,o.jsx)("p",{role:"alert",children:t(h)}):null,p?(0,o.jsx)("p",{role:"alert",children:t(s?"saveFailed":"modelsFailed")}):null,s&&!s.models.length&&s.refresh?.canRefresh?(0,o.jsxs)("div",{className:"dsh-pi-empty-models",children:[(s.refresh.notes??[]).map(C=>(0,o.jsx)("p",{className:"dsh-pi-muted",children:t(C)},C)),(0,o.jsx)(b,{variant:"primary",disabled:v||!e.writable,onClick:()=>{O()},children:t(v?"loading":"reloadModels")})]}):null,s?.models.some(C=>C.fast&&C.enabled)?(0,o.jsx)("p",{className:"dsh-pi-note",children:t("fastWarning")}):null,s?.models.some(C=>C.contributor)?(0,o.jsx)("p",{className:"dsh-pi-note",children:t("museContributorNote")}):null,(0,o.jsxs)("div",{className:"dsh-pi-model-list",children:[T?.map(C=>(0,o.jsxs)("div",{className:"dsh-pi-model-row",children:[(0,o.jsxs)("div",{className:"dsh-pi-model-label",children:[(0,o.jsx)("span",{children:C.name}),C.capabilityUnverified?(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("capabilitiesUnknown")}):null]}),(0,o.jsx)(Le,{label:`${t("modelEnabled")}: ${C.name}`,checked:C.enabled,disabled:g.has(C.id)||!e.writable,onChange:I=>E(C.id,I)})]},C.id)),T?.length===0?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("noResults")}):null]})]})}function xe(e){let n=e.message.split("/").pop();return n==="endpoint-untrusted"?"endpointUntrusted":n?.startsWith("muse-code-")?Object.hasOwn(j,`error_${n}`)?`error_${n}`:"error_muse-code-unavailable":"saveFailed"}function bt({controller:e,t:n}){let t=(0,i.useSyncExternalStore)(e.subscribe,e.getSnapshot),[r,s]=(0,i.useState)(!1);(0,i.useEffect)(()=>{e.load()},[e]);let a=["checking","starting","preparing","installing"].includes(t.status),m={idle:"updateIdle",checking:"updateChecking",current:"updateCurrent",available:"updateAvailable",blocked:"updateBlocked",starting:"updatePreparing",preparing:"updatePreparing",installing:"updateInstalling","restart-required":"updateRestart",applied:"updateApplied",failed:"updateFailed",cancelled:"updateCancelled",overridden:"updateOverridden",unknown:"updateUnknown"},u=!r&&["idle","blocked","current"].includes(t.status);return(0,o.jsxs)("div",{className:"dsh-pi-updates",children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[n("updateTitle"),t.runtimeVersion?` ${t.runtimeVersion}`:""]}),(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[t.status==="available"?(0,o.jsx)(b,{size:"sm",variant:"primary",onClick:()=>{e.begin()},children:n("updateInstall")}):null,t.status==="unknown"?(0,o.jsx)(b,{size:"sm",variant:"outline",onClick:()=>{e.load()},children:n("updateReconcile")}):null,(0,o.jsx)(b,{size:"sm",variant:"ghost",disabled:a||t.status==="unknown"||t.status==="restart-required",onClick:()=>{s(!0),e.check()},children:n("updateCheck")})]})]}),u?null:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:["failed","blocked"].includes(t.status)?"alert":"status",children:n(m[t.status]||"updateUnknown")}),t.reason?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[n(`updateReason_${t.reason}`)||n("updateReason_network")," ",(0,o.jsx)("a",{className:"dsh-pi-link",href:"https://github.com/Aero123421/dsh-pi-login/releases",target:"_blank",rel:"noopener noreferrer",children:n("updateManual")})]}):null,t.candidate?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("p",{children:[t.runtimeVersion," \u2192 ",t.candidate.version," \xB7 DSH ",t.candidate.compatibility]}),(0,o.jsx)("p",{className:"dsh-pi-update-notes",children:t.candidate.notes})]}):null,t.result?.stage?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[n("updateStage"),": ",t.result.stage,t.result.error?.code?` \xB7 ${t.result.error.code}`:""]}):null]})]})}function Ct(e,n){let t=e.windowSeconds;return t&&t%86400===0?`${t/86400} ${n("days")}`:t&&t%3600===0?`${t/3600} ${n("hours")}`:t&&t%60===0?`${t/60} ${n("minutes")}`:e.scope==="account"?n("accountQuota"):Object.hasOwn(j,`usageScope_${e.scope}`)?n(`usageScope_${e.scope}`):e.scope}function Yt({entry:e,controller:n,t}){let[r,s]=(0,i.useState)(),[a,m]=(0,i.useState)(!1),[u,g]=(0,i.useState)(!1),c=(0,i.useRef)(),v=(0,i.useRef)(0);async function _(h=!1){let M=++v.current;c.current?.abort();let k=new AbortController;c.current=k,m(!0),g(!1);try{let P=await n.mutation("usage",{connectionId:e.connectionId,refresh:h},k.signal);!k.signal.aborted&&M===v.current&&s(P)}catch{!k.signal.aborted&&M===v.current&&g(!0)}finally{!k.signal.aborted&&M===v.current&&m(!1)}}(0,i.useEffect)(()=>(_(),()=>{v.current++,c.current?.abort()}),[e.connectionId]);let p=r?.status==="rate-limited"&&new Date(r.retryAt).valueOf()>Date.now(),w=r?.windows??[];return(0,o.jsxs)("section",{className:"dsh-pi-section dsh-pi-usage","aria-busy":a,"aria-label":t("usageTab"),children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("h4",{children:t("usageTab")}),(0,o.jsx)(b,{variant:"ghost",size:"sm",disabled:a||p,onClick:()=>{_(!0)},children:t(a?"loading":"refreshUsage")})]}),u?(0,o.jsx)("p",{role:"alert",children:t("usageFailed")}):null,r&&(!w.length||r.status!=="available")?(0,o.jsx)("p",{role:"status",className:"dsh-pi-muted",children:t(`usage_${r.status}`)}):null,p&&r.retryAt?(0,o.jsxs)("p",{className:"dsh-pi-muted dsh-pi-small",children:[t("retryAt"),": ",Be(r.retryAt)]}):null,w.map(h=>(0,o.jsxs)("div",{className:"dsh-pi-usage-window",children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("span",{children:Ct(h,t)}),h.quotaState?(0,o.jsx)("strong",{children:t(`quota_${h.quotaState}`)}):typeof h.usedPercent=="number"?(0,o.jsxs)("strong",{children:[h.usedPercent,"% ",t("used")]}):(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("quota_unknown")})]}),!h.quotaState&&typeof h.usedPercent=="number"?(0,o.jsx)("progress",{max:"100",value:Math.min(100,Math.max(0,h.usedPercent)),"aria-label":Ct(h,t)}):null,h.quota?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[h.quota.estimated?`${t("estimated")} \xB7 `:"",h.quota.remaining!=null?`${t("remaining")}: ${h.quota.remaining}`:h.quota.used!=null?`${t("used")}: ${h.quota.used}`:t("quota_unknown"),h.quota.total!=null?` / ${h.quota.total}`:""," ",t(`unit_${h.quota.unit}`)]}):null,h.resetsAt?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[t("resets"),": ",Be(h.resetsAt)]}):h.resetsOn?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[t("resetDate"),": ",Be(h.resetsOn,!0)]}):null]},h.id)),r?.checkedAt||r?.sourceObservedAt?(0,o.jsxs)("p",{className:"dsh-pi-muted dsh-pi-small",children:[r.source==="last-observed"?`${t("lastObservedShort")} \xB7 `:"",t(r.sourceObservedAt?"observedAt":"checkedAt"),": ",Be(r.sourceObservedAt??r.checkedAt)]}):null]})}function xt({value:e,onChange:n,t,disabled:r,saved:s}){let[a,m]=(0,i.useState)(!1),[u,g]=(0,i.useState)(!1),c=(0,i.useId)();return(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:c,children:t("apiKey")}),(0,o.jsxs)("div",{className:"dsh-pi-secret",children:[(0,o.jsx)(ee,{id:c,...kt(!a),value:e,disabled:r,placeholder:s?t("keySavedPlaceholder"):"",onChange:v=>n(v.target.value)}),(0,o.jsx)(b,{size:"sm",disabled:r,"aria-pressed":a,onClick:()=>m(!a),children:t(a?"hideSecret":"showSecret")}),(0,o.jsx)(b,{size:"sm",disabled:r,onClick:async()=>{try{n(await navigator.clipboard.readText()),g(!1)}catch{g(!0)}},children:t("paste")})]}),u?(0,o.jsx)("p",{role:"alert",children:t("pasteFailed")}):null]})}function be(e){return`${e.integrationId}/${e.serviceId??e.id}`}function zt({state:e,controller:n,t,onClose:r,onLogin:s,onSaved:a}){let m=e.services,u=new Map;for(let l of m){let U=l.label??l.serviceLabel;u.set(U,(u.get(U)??0)+1)}let g=l=>e.integrations.find(U=>(U.id??U.integrationId)===l)?.label,c=l=>{let U=l.label??l.serviceLabel;return u.get(U)>1?`${U}\uFF08${g(l.integrationId)}\uFF09`:U},[v,_]=(0,i.useState)(m[0]?be(m[0]):""),p=m.find(l=>be(l)===v)??m[0],w=p?.methods??[],[h,M]=(0,i.useState)(w[0]?.id??"oauth"),k=w.find(l=>l.id===h)?.id??w[0]?.id??h,[P,f]=(0,i.useState)(""),[O,E]=(0,i.useState)(""),[A,T]=(0,i.useState)(""),[B,C]=(0,i.useState)(""),[I,x]=(0,i.useState)(!1),[S,Z]=(0,i.useState)(""),N=(0,i.useId)(),te=p?.capabilities?.settings===!1,Y=P.trim()||c(p??{})||"";async function z(){x(!0),Z("");try{let l={displayName:Y,authMethod:k,...B?{apiKey:B}:{},...O.trim()?{endpointUrl:O.trim()}:{},...A?{api:A}:{}},U=await n.mutation("connection-create",{integrationId:p.integrationId,serviceId:p.serviceId??p.id,...l,revision:e.revision});if(C(""),await n.refresh(),a(),k==="oauth"){let Ie=U.connection??U,Ce=n.getSnapshot().entries.find(ve=>ve.connectionId===Ie.connectionId);Ce&&s(Ce)}}catch(l){Z(xe(l))}finally{x(!1)}}return(0,o.jsxs)(ge,{open:!0,title:t("addConnection"),closeLabel:t("close"),onClose:r,className:"dsh-pi-login dsh-pi-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(b,{variant:"outline",onClick:r,disabled:I,children:t("cancel")}),(0,o.jsx)(b,{variant:"primary",disabled:I||!p||te||p.writable===!1||!Y||k==="api-key"&&!B.trim(),onClick:()=>{z()},children:t(I?"loading":k==="oauth"?"addAndSignIn":"add")})]}),children:[(0,o.jsx)(me,{label:t("service"),value:p?be(p):"",options:m.map(l=>({id:be(l),label:c(l)})),disabled:I,onChange:l=>{_(l),M(m.find(U=>be(U)===l)?.methods?.[0]?.id??"oauth"),C("")}}),te?(0,o.jsx)("p",{role:"status",children:t(p.unavailableReason==="muse-code-bridge-unverified"?`serviceUnavailable_${p.unavailableReason}`:"serviceUnavailable")}):null,w.length>1?(0,o.jsx)(me,{label:t("method"),value:k,options:w.map(l=>({id:l.id,label:t(l.id==="oauth"?"oauth":"apiKey")})),disabled:I,onChange:l=>{M(l),C("")}}):null,(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${N}-name`,children:t("connectionName")}),(0,o.jsx)(ee,{id:`${N}-name`,...fe,"data-modal-autofocus":!0,maxLength:80,value:P,disabled:I,placeholder:c(p??{})??t("namePlaceholder"),onChange:l=>f(l.target.value)})]}),k==="api-key"?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(xt,{value:B,onChange:C,t,disabled:I}),(0,o.jsxs)("details",{className:"dsh-pi-advanced",children:[(0,o.jsx)("summary",{children:t("advanced")}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${N}-url`,children:t("endpoint")}),(0,o.jsx)(ee,{id:`${N}-url`,...fe,type:"url",value:O,disabled:I,placeholder:"https://\u2026",onChange:l=>E(l.target.value)})]}),p?.apis?.length?(0,o.jsx)(me,{label:t("protocol"),value:A||p.apis[0],options:p.apis.map(l=>({id:l,label:l})),disabled:I,onChange:T}):null]})]}):(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("oauthHint")}),S?(0,o.jsx)("p",{role:"alert",children:t(S)}):null]})}function It(e){return e.inFlight||e.authStatus==="updating"?{dot:"ongoing",copy:"busy"}:e.authStatus==="expired"?{dot:"error",copy:"authExpired"}:e.authStatus==="unavailable"?{dot:"warning",copy:"authUnavailable"}:e.configured?e.enabled?{dot:"done",copy:"connected"}:{dot:"idle",copy:"statusOff"}:{dot:"idle",copy:"notConnected"}}function Jt({entry:e,state:n,controller:t,t:r,onClose:s,onLogin:a,onSaved:m}){let u=n.services.find(l=>l.integrationId===e.integrationId&&(l.serviceId??l.id)===e.serviceId)?.methods??e.methods??[],[g,c]=(0,i.useState)(e.authMethod),[v,_]=(0,i.useState)(e.displayName??""),[p,w]=(0,i.useState)(e.profile?.baseURL??""),[h,M]=(0,i.useState)(e.profile?.api??""),[k,P]=(0,i.useState)(""),[f,O]=(0,i.useState)(!1),[E,A]=(0,i.useState)(""),[T,B]=(0,i.useState)(),C=(0,i.useId)(),I=n.services.find(l=>l.integrationId===e.integrationId&&(l.serviceId??l.id)===e.serviceId),x=e.writable!==!1,S=g!==e.authMethod,Z=v.trim()!==e.displayName||S||!!k||p.trim()!==(e.profile?.baseURL??"")||h!==(e.profile?.api??""),N=It(e);async function te(){if(S&&T!=="method"){B("method");return}O(!0),A("");try{let l={displayName:v.trim(),...S?{authMethod:g}:{},...k?{apiKey:k}:{},...p.trim()?{endpointUrl:p.trim()}:e.profile?.baseURL?{endpointUrl:""}:{},...h?{api:h}:{}};await t.mutation("connection-update",{connectionId:e.connectionId,patch:l,revision:n.revision}),P(""),await t.refresh(),m()}catch(l){A(xe(l))}finally{O(!1)}}async function Y(l){O(!0),A("");try{await t.mutation(`connection-${l}`,{connectionId:e.connectionId,revision:n.revision,...l==="clone"?{displayName:`${v} ${r("copySuffix")}`}:{}}),await t.refresh(),m(l)}catch{A("saveFailed")}finally{O(!1)}}let z=e.authMethod==="oauth"&&e.capabilities?.auth!==!1;return(0,o.jsxs)(ge,{open:!0,title:e.displayName,description:`${e.serviceLabel} \xB7 ${r(e.authMethod==="oauth"?"oauthShort":"apiKey")}`,closeLabel:r("close"),onClose:s,className:"dsh-pi-login dsh-pi-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(b,{variant:"outline",onClick:s,disabled:f,children:r("close")}),(0,o.jsx)(b,{variant:"primary",disabled:f||!x||!Z||I?.capabilities?.settings===!1||T==="delete"||!v.trim(),onClick:()=>{te()},children:r(f?"loading":T==="method"?"confirmSave":"save")})]}),children:[(0,o.jsxs)("div",{className:"dsh-pi-status-card",children:[(0,o.jsxs)("span",{className:"dsh-pi-status",children:[(0,o.jsx)(Re,{state:N.dot,size:8}),r(N.copy)]}),z?(0,o.jsx)(b,{size:"sm",variant:e.configured&&e.authStatus!=="expired"?"outline":"primary",disabled:f||!x||S,onClick:()=>a(e),children:r(e.configured?"signInAgain":"signIn")}):null]}),e.configured&&e.capabilities?.usage!==!1?(0,o.jsx)(Yt,{entry:e,controller:t,t:r}):null,(0,o.jsxs)("section",{className:"dsh-pi-section","aria-label":r("connectionSettings"),children:[(0,o.jsx)("h4",{children:r("connectionSettings")}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${C}-name`,children:r("connectionName")}),(0,o.jsx)(ee,{id:`${C}-name`,...fe,maxLength:80,value:v,disabled:f||!x,placeholder:r("namePlaceholder"),onChange:l=>_(l.target.value)})]}),u.length>1?(0,o.jsx)(me,{label:r("method"),value:g,options:u.map(l=>({id:l.id,label:r(l.id==="oauth"?"oauth":"apiKey")})),disabled:f||!x,onChange:l=>{c(l),P(""),B(void 0)}}):null,S?(0,o.jsx)("p",{role:"alert",children:r("methodChangeWarning")}):null,g==="api-key"?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(xt,{value:k,onChange:P,t:r,disabled:f||!x,saved:e.configured&&!S}),(0,o.jsxs)("details",{className:"dsh-pi-advanced",open:e.profile?.baseURL?!0:void 0,children:[(0,o.jsx)("summary",{children:r("advanced")}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${C}-url`,children:r("endpoint")}),(0,o.jsx)(ee,{id:`${C}-url`,...fe,type:"url",value:p,disabled:f||!x,placeholder:"https://\u2026",onChange:l=>w(l.target.value)})]}),I?.apis?.length?(0,o.jsx)(me,{label:r("protocol"),value:h||I.apis[0],options:I.apis.map(l=>({id:l,label:l})),disabled:f||!x,onChange:M}):null]})]}):null]}),E?(0,o.jsx)("p",{role:"alert",children:r(E)}):null,x?null:(0,o.jsx)("p",{className:"dsh-pi-muted",children:r("readOnly")}),(0,o.jsx)("section",{className:"dsh-pi-section dsh-pi-danger","aria-label":r("deleteConnection"),children:T==="delete"?(0,o.jsxs)("div",{className:"dsh-pi-confirm",children:[(0,o.jsx)("p",{role:"alert",children:r("deleteWarning")}),(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[(0,o.jsx)(b,{size:"sm",variant:"outline",disabled:f,onClick:()=>B(void 0),children:r("cancel")}),(0,o.jsx)(b,{size:"sm",variant:"primary",disabled:f,onClick:()=>{Y("delete")},children:r("confirmDelete")})]})]}):(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[(0,o.jsx)(b,{size:"sm",disabled:f||!x,title:r("cloneHint"),onClick:()=>{Y("clone")},children:r("cloneConnection")}),(0,o.jsx)(b,{size:"sm",className:"dsh-pi-danger-button",disabled:f||!x,onClick:()=>B("delete"),children:r("deleteConnection")})]})})]})}function Xt({entry:e,controller:n,t,writableRevision:r,onOpen:s,onLogin:a,onModels:m}){let[u,g]=(0,i.useState)(!1),[c,v]=(0,i.useState)(!1),_=It(e),p=e.authStatus==="owner-managed",w=e.capabilities?.settings!==!1,h=!w&&e.settingsUrl?wt(e.settingsUrl):void 0;async function M(f){g(!0),v(!1);try{await n.mutation("connection-update",{connectionId:e.connectionId,patch:{enabled:f},revision:r}),await n.refresh()}catch{v(!0)}finally{g(!1)}}let k=[p?`${t(`directory_${e.directoryState??"unavailable"}`)} \xB7 ${e.source??t("sourceUnknown")}`:`${t(e.authMethod==="oauth"?"oauthShort":"apiKey")} \xB7 ${t(_.copy)}`].filter(Boolean).join(" \xB7 "),P=(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("span",{className:"dsh-pi-row-name",children:[p?null:(0,o.jsx)(Re,{state:_.dot,size:8}),e.displayName]}),(0,o.jsx)("span",{className:`dsh-pi-row-meta${_.dot==="error"?" dsh-pi-row-meta-alert":""}`,children:k})]});return(0,o.jsxs)("li",{className:"dsh-pi-connection-row",children:[w?(0,o.jsx)("button",{type:"button",className:"dsh-pi-row-main","aria-label":`${t("connectionSettings")}: ${e.displayName}`,onClick:()=>s(e),children:P}):(0,o.jsxs)("div",{className:"dsh-pi-row-main",children:[P,h?(0,o.jsx)("a",{className:"dsh-pi-link",href:h,target:"_blank",rel:"noopener noreferrer",children:t("externalSettings")}):null]}),(0,o.jsxs)("div",{className:"dsh-pi-row-actions",children:[c?(0,o.jsx)("span",{role:"alert",className:"dsh-pi-row-meta-alert",children:t("saveFailed")}):null,!e.configured&&e.authMethod==="oauth"&&e.capabilities?.auth!==!1&&e.writable!==!1?(0,o.jsx)(b,{size:"sm",variant:"primary",onClick:()=>a(e),children:t("signIn")}):e.authStatus==="expired"&&e.authMethod==="oauth"&&e.writable!==!1?(0,o.jsx)(b,{size:"sm",variant:"primary",onClick:()=>a(e),children:t("signInAgain")}):(0,o.jsxs)(o.Fragment,{children:[e.capabilities?.models!==!1&&e.configured?(0,o.jsx)(b,{size:"sm",variant:"outline","aria-label":`${t("manageModels")}: ${e.displayName}`,onClick:()=>m(e),children:t("modelsShort")}):null,w&&e.configured?(0,o.jsx)(Le,{label:`${t("useProvider")}: ${e.displayName}`,checked:e.enabled===!0,disabled:u||e.writable===!1,onChange:f=>{M(f)}}):null]})]})]})}function yt({controller:e,updates:n,locale:t}){let r=(0,i.useSyncExternalStore)(e.subscribe,e.getSnapshot),s=$t(t),[a,m]=(0,i.useState)(""),[u,g]=(0,i.useState)(),[c,v]=(0,i.useState)(""),_=(0,i.useId)();(0,i.useEffect)(()=>{e.load()},[e]),(0,i.useEffect)(()=>{g(void 0),v("")},[r.profileKey,r.generation]);let p=a.trim().toLocaleLowerCase(),w=new Map;for(let f of r.entries){if(!`${f.displayName} ${f.integrationLabel} ${f.serviceLabel}`.toLocaleLowerCase().includes(p))continue;let O=`${f.integrationId}/${f.serviceId}`;w.has(O)||w.set(O,{label:f.serviceLabel??f.integrationLabel,entries:[]}),w.get(O).entries.push(f)}let h=()=>g(void 0);function M(f){v(""),g({kind:"login",entry:f,method:f.authMethod})}function k(f){g({kind:"models",entry:e.getSnapshot().entries.find(O=>O.connectionId===f.connectionId)??f})}function P(f){g(void 0),v(f==="delete"?"deleted":f==="clone"?"cloned":"saved")}return(0,o.jsxs)("section",{className:"dsh-pi-login dsh-pi-footer","aria-labelledby":_,children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("h3",{id:_,children:s("title")}),(0,o.jsx)(b,{variant:"outline",size:"sm",onClick:()=>{v(""),g({kind:"add"})},disabled:r.status!=="ready"||r.services.length===0,children:s("addConnection")})]}),c?(0,o.jsx)("p",{role:"status",className:"dsh-pi-success",children:s(c)}):null,r.error?(0,o.jsxs)("p",{role:"alert",children:[s("loadFailed")," ",(0,o.jsx)(b,{size:"sm",onClick:()=>{e.refresh()},children:s("retry")})]}):null,r.status==="loading"&&r.entries.length===0?(0,o.jsx)("p",{role:"status",className:"dsh-pi-loading",children:s("loading")}):null,r.entries.length>8?(0,o.jsx)("div",{className:"dsh-pi-search",children:(0,o.jsx)(ee,{"aria-label":s("searchConnections"),placeholder:s("searchConnections"),icon:(0,o.jsx)(We,{size:16}),value:a,onChange:f=>m(f.target.value)})}):null,[...w].map(([f,O])=>(0,o.jsxs)("div",{className:"dsh-pi-group",children:[(0,o.jsx)("h4",{className:"dsh-pi-group-label",children:O.label}),(0,o.jsx)("ul",{className:"dsh-pi-connection-list",children:O.entries.map(E=>(0,o.jsx)(Xt,{entry:E,controller:e,t:s,writableRevision:r.revision,onOpen:A=>{v(""),g({kind:"settings",entry:A})},onLogin:M,onModels:k},E.connectionId))})]},f)),r.status==="ready"&&w.size===0&&!r.error?(0,o.jsx)("p",{className:"dsh-pi-muted",children:s(r.entries.length?"noResults":"emptyConnections")}):null,n?(0,o.jsx)(bt,{controller:n,t:s}):null,u?.kind==="login"?(0,o.jsx)(Gt,{...u,controller:e,t:s,onClose:h,onModels:k}):null,u?.kind==="models"?(0,o.jsx)(Qt,{entry:u.entry,controller:e,t:s,onClose:h}):null,u?.kind==="add"?(0,o.jsx)(zt,{state:r,controller:e,t:s,onClose:h,onLogin:M,onSaved:P}):null,u?.kind==="settings"?(0,o.jsx)(Jt,{entry:u.entry,state:r,controller:e,t:s,onClose:h,onLogin:M,onSaved:P},u.entry.connectionId):null]})}function eo(e){let n=new He(e.connection),t=new Ee(e.connection);e.effect(()=>()=>t.dispose(),"dsh-pi-login: update requests"),e.effect(()=>()=>n.dispose(),"dsh-pi-login: UI requests"),e.effect(()=>e.locale.register(vt,{en:j,ja:G}),"dsh-pi-login: copy"),e.effect(()=>{let s=document.createElement("style");return s.dataset.dshPiLogin="",s.textContent=mt+gt,document.head.append(s),()=>s.remove()},"dsh-pi-login: official controls"),e.on("connection/reset",()=>{n.refresh(),t.load()});let r=()=>({controller:n,updates:t,locale:e.locale});e.slots.inject("settings.models.footer",()=>e.slots.register({name:"settings.models.footer",id:"dsh-pi-login",order:10,inject:r},yt))}

return module.exports;}});
