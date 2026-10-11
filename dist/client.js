window.__ModuleLoader__.load({id:"@local/dsh-pi-login",factory(require){const module={exports:{}};const exports=module.exports;
var b1=Object.defineProperty;var ue=Object.getOwnPropertyDescriptor;var ge=Object.getOwnPropertyNames;var Ce=Object.prototype.hasOwnProperty;var me=(e,t)=>{for(var o in t)b1(e,o,{get:t[o],enumerable:!0})},we=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of ge(t))!Ce.call(e,n)&&n!==o&&b1(e,n,{get:()=>t[n],enumerable:!(r=ue(t,n))||r.enumerable});return e};var fe=e=>we(b1({},"__esModule",{value:!0}),e);var Ze={};me(Ze,{ConnectionUI:()=>E1,apply:()=>Se,inject:()=>Ne});module.exports=fe(Ze);var d=require("react");var j1=require("react");function K1(e){var t,o,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var n=e.length;for(t=0;t<n;t++)e[t]&&(o=K1(e[t]))&&(r&&(r+=" "),r+=o)}else for(o in e)e[o]&&(r&&(r+=" "),r+=o);return r}function ke(){for(var e,t,o=0,r="",n=arguments.length;o<n;o++)(e=arguments[o])&&(t=K1(e))&&(r&&(r+=" "),r+=t);return r}var I=ke;var s1={button:"dshpi_13ed0003_button",md:"dshpi_13ed0003_md",sm:"dshpi_13ed0003_sm",primary:"dshpi_13ed0003_primary",ghost:"dshpi_13ed0003_ghost",outline:"dshpi_13ed0003_outline",toolbar:"dshpi_13ed0003_toolbar",icon:"dshpi_13ed0003_icon"};var c1=require("react/jsx-runtime"),B=(0,j1.forwardRef)(function({variant:t="ghost",size:o="md",icon:r,className:n,children:a,...c},u){return(0,c1.jsxs)("button",{ref:u,type:"button",className:I(s1.button,s1[t],s1[o],n),...c,children:[r!=null&&(0,c1.jsx)("span",{className:s1.icon,children:r}),a]})});var U1=require("react");var p1={wrap:"dshpi_fda332f6_wrap",icon:"dshpi_fda332f6_icon",input:"dshpi_fda332f6_input"};var i1=require("react/jsx-runtime"),h1=(0,U1.forwardRef)(function({icon:t,className:o,...r},n){return(0,i1.jsxs)("span",{className:I(p1.wrap,o),children:[t!=null&&(0,i1.jsx)("span",{className:p1.icon,children:t}),(0,i1.jsx)("input",{ref:n,className:p1.input,...r})]})});var M1={switch:"dshpi_7ae83aee_switch",thumb:"dshpi_7ae83aee_thumb"};var y1=require("react/jsx-runtime");function u1({checked:e,onChange:t,label:o,disabled:r=!1,title:n,className:a}){return(0,y1.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":o,title:n,disabled:r,className:I(M1.switch,a),onClick:()=>{t(!e)},children:(0,y1.jsx)("span",{className:M1.thumb})})}var L=require("react"),oe=require("react-dom");var ve=require("react");var G1=require("react/jsx-runtime");var P=require("react/jsx-runtime");var g1=1;var xe=({size:e=16,className:t,strokeWidth:o})=>(0,P.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,P.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,P.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),_1=e=>(0,P.jsx)(xe,{...e,strokeWidth:g1});var Ie=({size:e=16,className:t,strokeWidth:o})=>(0,P.jsx)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:(0,P.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),C1=e=>(0,P.jsx)(Ie,{...e,strokeWidth:g1});var be=({size:e=14,className:t,strokeWidth:o})=>(0,P.jsx)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:(0,P.jsx)("path",{d:"M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6",stroke:"currentColor"})}),L1=e=>(0,P.jsx)(be,{...e,strokeWidth:g1});var Me=({size:e=16,className:t,strokeWidth:o})=>(0,P.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,P.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,P.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),q1=e=>(0,P.jsx)(Me,{...e,strokeWidth:g1});function $1(e){let t=document.documentElement,o=Number.parseFloat(getComputedStyle(t).getPropertyValue("--dsh-frame-top-clearance"));return Number.isNaN(o)?e:Math.max(e,(t.hasAttribute("data-fullscreen")?0:o)+20)}var U=require("react"),ye=200;function Q1(e){let t=(0,U.useRef)(null),o=(0,U.useRef)(e);o.current=e;let r=(0,U.useCallback)(()=>{t.current!==null&&(clearTimeout(t.current),t.current=null)},[]),n=(0,U.useCallback)(()=>{r(),t.current=setTimeout(()=>{t.current=null,o.current()},ye)},[r]);return(0,U.useEffect)(()=>r,[r]),{arm:n,cancel:r}}var f1=require("react");function m1(e){let t=!1,o=!1,r=()=>{t=!0},n=()=>{t=!1,o=!0},a=()=>{o=!1},c=()=>{t=!1,o=!1};return e.addEventListener("compositionstart",r,!0),e.addEventListener("compositionend",n,!0),e.addEventListener("keyup",a,!0),e.defaultView?.addEventListener("blur",c),{guards:u=>{let l=t||o||u.isComposing||u.keyCode===229;return o=!1,l},dispose:()=>{e.removeEventListener("compositionstart",r,!0),e.removeEventListener("compositionend",n,!0),e.removeEventListener("keyup",a,!0),e.defaultView?.removeEventListener("blur",c)}}}var W1=new WeakMap,_e=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function o1(e,t){W1.get(e)?.();let o=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",o),e.removeEventListener("keydown",r,!0),W1.delete(e)},r=n=>{!n.isComposing&&!n.ctrlKey&&!n.altKey&&!n.metaKey&&_e.has(n.key)&&o()};W1.set(e,o),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",o),e.addEventListener("keydown",r,!0),e.focus(t),e.matches(":focus")||o()}var w1=new WeakMap;function J1(e){if(e===null)return!1;let t=w1.get(e.ownerDocument)?.at(-1);return t!==void 0&&!t.element.contains(e)}var Y1='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function X1(e,t,o){let r=(0,f1.useRef)(o);r.current=o,(0,f1.useLayoutEffect)(()=>{let n=e.current;if(!t||n===null)return;let a=n.ownerDocument,c=m1(a),u=a.activeElement,l=w1.get(a)??[];w1.set(a,l);let k={element:n,close:()=>{r.current()}};l.push(k);let v=n.querySelector("[data-modal-autofocus]")??n.querySelector(Y1)??n;n.contains(a.activeElement)||o1(v);let b=C=>{let x=c.guards(C);if(l.at(-1)!==k||C.defaultPrevented||x||C.ctrlKey||C.altKey||C.metaKey||(C.key==="Escape"&&!C.shiftKey&&(C.preventDefault(),C.repeat||r.current()),C.key!=="Tab")||a.activeElement?.closest('[role="menu"]'))return;let W=[...n.querySelectorAll(Y1)].filter(p=>!p.closest("[inert], [hidden]")),m=W[0]??n,H=W.at(-1)??n,A=C.shiftKey?a.activeElement===m:a.activeElement===H;(a.activeElement===n||!n.contains(a.activeElement)||A)&&(C.preventDefault(),(C.shiftKey?H:m).focus())};return a.addEventListener("keydown",b),()=>{c.dispose();let C=l.at(-1)===k;if(l.splice(l.indexOf(k),1),a.removeEventListener("keydown",b),l.length===0&&w1.delete(a),C){let x=u instanceof HTMLElement&&u.isConnected?u:l.at(-1)?.element;x!==void 0&&o1(x)}}},[e,t])}var r1={keys:"dshpi_042ff8c4_keys",key:"dshpi_042ff8c4_key",tooltip:"dshpi_042ff8c4_tooltip",separator:"dshpi_042ff8c4_separator",joined:"dshpi_042ff8c4_joined"};var P1=require("react/jsx-runtime");function O1({keys:e,variant:t="plain",className:o}){return(0,P1.jsx)("span",{className:I(r1.keys,t==="tooltip"&&r1.tooltip,t==="tooltip"&&e.includes("+")&&r1.joined,o),children:e.map((r,n)=>(0,P1.jsx)("kbd",{className:r==="+"?r1.separator:r1.key,children:r},n))})}var q=require("react"),z1=require("react-dom");var n1={surface:"dshpi_a00a35bd_surface",backing:"dshpi_a00a35bd_backing",compact:"dshpi_a00a35bd_compact",material:"dshpi_a00a35bd_material"};var G=require("react/jsx-runtime"),H1=(0,q.forwardRef)(function({compact:t=!1,className:o,style:r,children:n,...a},c){let u=(0,q.useId)(),l=(0,q.useRef)(null);(0,q.useLayoutEffect)(()=>{document.body.appendChild(l.current)},[]);let k={"--dsh-menu-anchor":`--dsh-menu-${u.replaceAll(":","")}`};return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsxs)("div",{...a,ref:c,"data-menu-material":"translucent",className:I(n1.surface,t&&n1.compact,o),style:{...r,...k},children:[(0,G.jsx)("div",{"aria-hidden":"true",className:n1.material}),n]}),(0,z1.createPortal)((0,G.jsx)("div",{ref:l,"aria-hidden":"true","data-menu-backing":"",className:I(n1.backing,t&&n1.compact),style:{...k,visibility:r?.visibility}}),document.body)]})});var g={root:"dshpi_1911279a_root",list:"dshpi_1911279a_list",submenu:"dshpi_1911279a_submenu",scrollable:"dshpi_1911279a_scrollable",viewport:"dshpi_1911279a_viewport",css:"dshpi_1911279a_css",portal:"dshpi_1911279a_portal",sideTop:"dshpi_1911279a_sideTop",alignEnd:"dshpi_1911279a_alignEnd",tsx:"dshpi_1911279a_tsx",footer:"dshpi_1911279a_footer",separator:"dshpi_1911279a_separator",itemWrap:"dshpi_1911279a_itemWrap",item:"dshpi_1911279a_item",denseList:"dshpi_1911279a_denseList",label:"dshpi_1911279a_label",compactList:"dshpi_1911279a_compactList",itemIcon:"dshpi_1911279a_itemIcon",check:"dshpi_1911279a_check",itemLabel:"dshpi_1911279a_itemLabel",shortcut:"dshpi_1911279a_shortcut",shortcutKeys:"dshpi_1911279a_shortcutKeys",selected:"dshpi_1911279a_selected",selectedFill:"dshpi_1911279a_selectedFill",danger:"dshpi_1911279a_danger"};var M=require("react/jsx-runtime");function ee(e){return"type"in e&&e.type==="separator"}function te(e){return"type"in e&&e.type==="label"}var Le={visibility:"hidden",left:0,top:0};function N1({open:e,anchor:t,items:o=[],children:r,selectedId:n,selectedIds:a,onSelect:c,onClose:u,align:l="start",side:k="bottom",portal:v=!1,closeOnPointerLeave:b=!1,dense:C=!1,compact:x=!1,autoFocus:W=!1,selection:m="check",getAnchorRect:H,footer:A,className:p,listClassName:Q}){let V=(0,L.useRef)(null),w=(0,L.useRef)(null),S=(0,L.useRef)(null),J=(0,L.useRef)(null),X=(0,L.useRef)(!1),z=(i=!1)=>{let f=J.current,E=f!==null&&document.contains(f)&&!f.disabled?f:V.current?.querySelector("button:not(:disabled)");E!=null&&(i?E.focus():o1(E))},R=()=>{let i=X.current;queueMicrotask(()=>{if(Z.current)return;let f=document.activeElement;(f===null||f===document.body||w.current?.contains(f)===!0)&&z(i)})},Z=(0,L.useRef)(e);Z.current=e;let[a1,D]=(0,L.useState)(null),[l1,B1]=(0,L.useState)(null),{arm:pe,cancel:x1}=Q1(u);(0,L.useLayoutEffect)(()=>{if(!e||!v){B1(null);return}let i=()=>{let y;if(H!==void 0?y=H():y=V.current?.getBoundingClientRect()??null,y===null)return;let _=12,d1=window.innerWidth,h=window.innerHeight,K=w.current,e1=K?.offsetWidth??0,j=K?.offsetHeight??0,F,N;k==="right"?(F=y.right+4,N=y.top):l==="start"?(F=y.left,N=k==="bottom"?y.bottom+4:y.top-j-4):(F=y.right-e1,N=k==="bottom"?y.bottom+4:y.top-j-4),e1>0&&(F=Math.min(Math.max(F,_),d1-e1-_)),j>0&&(N=Math.min(Math.max(N,$1(_)),h-j-_)),B1(t1=>t1?.left===F&&t1.top===N?t1:{left:F,top:N})};i();let f=()=>{i(),E=requestAnimationFrame(f)},E=requestAnimationFrame(f);return window.addEventListener("scroll",i,!0),window.addEventListener("resize",i),()=>{cancelAnimationFrame(E),window.removeEventListener("scroll",i,!0),window.removeEventListener("resize",i)}},[e,v,l,k,H]),(0,L.useEffect)(()=>{if(!e){J.current=null;return}let i=document.activeElement;J.current=i instanceof HTMLElement&&V.current?.contains(i)===!0?i:null},[e]),(0,L.useEffect)(()=>{if(!e||!W)return;let i=w.current?.querySelector("button:not(:disabled)");S.current=i==null?null:0,i!=null&&o1(i)},[e,W]),(0,L.useEffect)(()=>{if(!e){D(null),S.current=null;return}let i=m1(document),f=h=>{h.target instanceof Node&&V.current?.contains(h.target)!==!0&&w.current?.contains(h.target)!==!0&&u()},E=h=>{if(i.guards(h)||J1(V.current)||h.defaultPrevented||h.ctrlKey||h.altKey||h.metaKey)return;let K=document.activeElement,e1=w.current?.contains(K)===!0,j=V.current?.contains(K)===!0||e1;if(h.key==="Escape"&&!h.shiftKey){if(h.preventDefault(),h.repeat)return;u(),(j||W)&&z()}if(h.key==="Tab"){let F1=w.current;if(F1===null||!j)return;if(h.shiftKey){h.preventDefault(),u(),z(!0);return}if(e1){if(K instanceof Element&&K.getAttribute("role")==="menuitem"){h.preventDefault(),X.current=!0;try{K.click()}finally{X.current=!1}}return}let D1=F1.querySelector("button:not(:disabled)");if(D1===null)return;h.preventDefault(),D1.focus(),S.current=0;return}if(!["ArrowDown","ArrowUp","Home","End"].includes(h.key))return;let F=w.current;if(F===null||!j)return;let N=Array.from(F.querySelectorAll("button:not(:disabled)"));if(N.length===0)return;let t1=N.indexOf(K),Z1=t1>=0?t1:S.current,T1=h.key==="Home"?0:h.key==="End"?N.length-1:Z1===null?h.key==="ArrowDown"?0:N.length-1:(Z1+(h.key==="ArrowDown"?1:-1)+N.length)%N.length;h.preventDefault(),S.current=T1,N[T1]?.focus()},y=()=>{document.activeElement instanceof HTMLIFrameElement&&u()};document.addEventListener("pointerdown",f);let _=h=>{h.key==="Escape"&&E(h)},d1=h=>{h.key!=="Escape"&&E(h)};return document.addEventListener("keydown",d1),document.addEventListener("keydown",_,!0),window.addEventListener("blur",y),()=>{i.dispose(),document.removeEventListener("pointerdown",f),document.removeEventListener("keydown",d1),document.removeEventListener("keydown",_,!0),window.removeEventListener("blur",y)}},[e,u,W]),(0,L.useEffect)(()=>{e||x1()},[e,x1]);let he=!o.some(i=>!ee(i)&&!te(i)&&i.submenu!==void 0&&i.submenu.length>0),V1=i=>{if(ee(i))return(0,M.jsx)("div",{className:g.separator,role:"separator"},i.id);if(te(i))return(0,M.jsx)("div",{className:g.label,role:"presentation",children:i.text},i.id);let f=i.submenu!==void 0&&i.submenu.length>0,E=f&&a1===i.id,y=i.id===n||a?.includes(i.id)===!0;return(0,M.jsxs)("div",{className:g.itemWrap,onMouseEnter:f?()=>{D(i.id)}:void 0,onMouseLeave:()=>{D(null)},children:[(0,M.jsxs)("button",{type:"button",role:"menuitem",className:I(g.item,y&&(m==="fill"?g.selectedFill:g.selected),i.danger===!0&&g.danger),disabled:i.disabled,"aria-keyshortcuts":i.shortcut?.aria,"aria-haspopup":f?"menu":void 0,"aria-expanded":f?E:void 0,onFocus:f?()=>{D(i.id)}:void 0,onClick:()=>{if(f){D(i.id);return}c?.(i.id)},children:[i.icon!==void 0&&(0,M.jsx)("span",{className:g.itemIcon,children:i.icon}),(0,M.jsx)("span",{className:g.itemLabel,children:i.label}),i.shortcut!==void 0&&(0,M.jsx)("span",{"aria-hidden":"true",className:g.shortcut,children:(0,M.jsx)(O1,{keys:i.shortcut.keys,className:g.shortcutKeys})}),y&&m==="check"&&(0,M.jsx)(C1,{className:g.check})]}),E&&i.submenu!==void 0&&(0,M.jsx)(H1,{compact:x,className:I(g.submenu,x&&g.compactList),role:"menu",children:i.submenu.map(_=>(0,M.jsxs)("button",{type:"button",role:"menuitem",className:g.item,disabled:_.disabled,"aria-keyshortcuts":_.shortcut?.aria,onClick:()=>{c?.(_.id),R()},children:[_.icon!==void 0&&(0,M.jsx)("span",{className:g.itemIcon,children:_.icon}),(0,M.jsx)("span",{className:g.itemLabel,children:_.label}),_.shortcut!==void 0&&(0,M.jsx)("span",{"aria-hidden":"true",className:g.shortcut,children:(0,M.jsx)(O1,{keys:_.shortcut.keys,className:g.shortcutKeys})})]},_.id))})]},i.id)},S1=i=>{let f=i.target instanceof Element?i.target.closest('button[role="menuitem"]'):null;f===null||f.getAttribute("aria-haspopup")==="menu"||f.closest('[role="menu"]')===i.currentTarget&&D(null)},I1=e&&(0,M.jsxs)(H1,{compact:x,ref:w,className:I(g.list,Q,C&&g.denseList,x&&g.compactList,he&&g.scrollable,v&&g.portal,k==="top"&&!v&&g.sideTop,l==="end"&&!v&&g.alignEnd),style:v?l1??Le:void 0,role:"menu",onClick:i=>{i.stopPropagation();let f=i.target instanceof Element?i.target.closest('button[role="menuitem"]'):null;f!==null&&f.getAttribute("aria-haspopup")!=="menu"&&R()},onMouseOver:S1,onFocus:S1,children:[(0,M.jsxs)("div",{className:g.viewport,role:"presentation",children:[o.map(V1),r]}),A!==void 0&&A.length>0&&(0,M.jsx)("div",{className:g.footer,role:"presentation",children:A.map(V1)})]});return(0,M.jsxs)("span",{ref:V,className:I(g.root,p),onPointerEnter:b?x1:void 0,onPointerLeave:b?()=>{e&&pe()}:void 0,children:[t,v?I1!==!1&&(0,oe.createPortal)(I1,document.body):I1]})}var re=require("react"),ne=require("react-dom");var T={root:"dshpi_b97756f9_root",mask:"dshpi_b97756f9_mask",dialog:"dshpi_b97756f9_dialog",content:"dshpi_b97756f9_content",header:"dshpi_b97756f9_header",title:"dshpi_b97756f9_title",close:"dshpi_b97756f9_close",description:"dshpi_b97756f9_description",body:"dshpi_b97756f9_body",footer:"dshpi_b97756f9_footer"};var O=require("react/jsx-runtime");function k1({open:e,onClose:t,title:o,closeLabel:r,description:n,children:a,footer:c,className:u,contentClassName:l,onKeyDownCapture:k,headless:v=!1,backdropBlur:b=!0,shortcutModal:C}){let x=(0,re.useRef)(null);return X1(x,e,t),e?(0,ne.createPortal)((0,O.jsxs)("div",{className:T.root,role:"presentation",onKeyDownCapture:k,children:[(0,O.jsx)("div",{className:T.mask,style:b?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:t}),(0,O.jsx)("div",{ref:x,tabIndex:-1,"data-shortcut-modal":C,className:I(T.dialog,u),role:"dialog","aria-modal":"true","aria-label":o,children:v?a:(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)("div",{className:I(T.content,l),children:[(0,O.jsxs)("div",{className:T.header,children:[(0,O.jsx)("h2",{className:T.title,children:o}),(0,O.jsx)("button",{type:"button",className:T.close,"aria-label":r,onClick:t,children:(0,O.jsx)(q1,{size:14})})]}),n!==void 0&&n!==""&&(0,O.jsx)("p",{className:T.description,children:n}),a!==void 0&&(0,O.jsx)("div",{className:T.body,children:a})]}),c!==void 0&&(0,O.jsx)("div",{className:T.footer,children:c})]})})]}),document.body):null}var Y={dot:"dshpi_34138a6f_dot",spinner:"dshpi_34138a6f_spinner",spinnerMotion:"dshpi_34138a6f_spinnerMotion",spinnerTrack:"dshpi_34138a6f_spinnerTrack",spinnerArc:"dshpi_34138a6f_spinnerArc",step:"dshpi_34138a6f_step"};var $=require("react/jsx-runtime");function We(e){e!==null&&(se(e),e.addEventListener("animationstart",()=>{se(e)}))}function se(e){let t=e;for(let o of t.getAnimations?.({subtree:!0})??[])o.startTime=0}function A1({state:e,size:t,className:o,appearance:r="dot"}){let n=t??(e==="ongoing"?14:10);return e==="ongoing"?(0,$.jsx)("svg",{ref:We,className:I(Y.spinner,o),"data-state":"ongoing",width:n,height:n,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,$.jsxs)("g",{className:Y.spinnerMotion,children:[(0,$.jsx)("circle",{className:Y.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,$.jsx)("circle",{className:Y.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,$.jsx)("span",{className:I(r==="step"?Y.step:Y.dot,o),"data-state":e,style:{width:n,height:n},"aria-hidden":"true",children:r==="step"&&e==="done"&&(0,$.jsx)(C1,{size:n-2})})}var Pe=Object.freeze({status:"idle",entries:[],error:!1}),v1=class{constructor(t){this.connection=t,this.state=Pe,this.listeners=new Set,this.pending=void 0,this.closed=!1,this.tickets=new Set}getSnapshot=()=>this.state;subscribe=t=>(this.listeners.add(t),()=>this.listeners.delete(t));publish(t){if(!this.closed){this.state=t;for(let o of this.listeners)o()}}async call(t,o={},r){let n=await this.connection.rpc.call("/api",`dsh-pi-login/${t}`,o,r);if(!n.ok)throw new Error(n.error.code);return n.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let t={abort:new AbortController};return t.promise=this.call("list",{},t.abort.signal).then(o=>{this.pending===t&&this.publish({status:"ready",entries:o,error:!1})},()=>{this.pending===t&&this.publish({...this.state,status:"ready",error:!0})}).finally(()=>{this.pending===t&&(this.pending=void 0)}),this.pending=t,this.publish({...this.state,status:"loading",error:!1}),t.promise}refresh(){let t=this.pending;return this.pending=void 0,t?.abort.abort(),this.load()}async start(t,o){let r=await this.call("start",{key:t,method:o});if(typeof r.ticket!="string")throw new Error("invalid ticket");if(this.closed)throw await this.call("cancel",r),new Error("disposed");return this.tickets.add(r.ticket),r.ticket}async cancel(t){this.tickets.delete(t);try{await this.call("cancel",{ticket:t})}finally{await this.refresh()}}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear();for(let t of this.tickets)this.call("cancel",{ticket:t}).catch(()=>{});this.tickets.clear()}};var ie={useLogin:"Use saved credentials",keyOverride:"The configured API-key reference takes priority.",models:"Models",manageModels:"Choose models",useProvider:"Use this provider",searchModels:"Search models",fastWarning:"Fast mode uses paid priority processing or additional subscription credits. Availability depends on your account and model.",modelEnabled:"Use model",loading:"Loading\u2026",modelsFailed:"Could not load the models.",saveFailed:"Could not save settings. Try again.",modelsHint:"When the provider is on, selected models are available to chats and agents.",noResults:"No matching models.",disabledHint:"Turning this off keeps your credentials and model choices.",activateFirst:"Enable the provider before choosing models.",title:"Pi connections",description:"Choose a provider and sign-in method.",provider:"Provider",method:"Sign-in method",oauth:"Browser sign-in",apiKey:"API key",signIn:"Sign in",signInAgain:"Sign in again",connected:"Connected",notConnected:"Not connected",busy:"Signing in\u2026",openBrowser:"Continue in browser",code:"Verification code",copy:"Copy code",copied:"Copied",cancel:"Cancel",close:"Close",submit:"Continue",success:"Signed in",successDescription:"Your credentials are saved in DeepSeek Harness.",enable:"Enable provider",enabled:"Provider enabled.",failed:"Sign-in failed. Sign in again.",cancelled:"Sign-in cancelled. Sign in again.",providerExpired:"The verification code expired. Sign in again.",timedOut:"Sign-in timed out. Sign in again.",loadFailed:"Could not load the providers.",retry:"Retry",empty:"No Pi sign-in providers are available.",answer:"Enter the requested value",secret:"Enter your API key",selection:"Choose an option",enableFailed:"Signed in, but the provider could not be enabled. Try again.",waiting:"Complete the sign-in in your browser.",readOnly:"Credentials are read-only in this environment."},ae={useLogin:"\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046",keyOverride:"\u8A2D\u5B9A\u6E08\u307F\u306EAPI\u30AD\u30FC\u53C2\u7167\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002",models:"\u30E2\u30C7\u30EB",manageModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",useProvider:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",searchModels:"\u30E2\u30C7\u30EB\u3092\u691C\u7D22",fastWarning:"Fast\u30E2\u30FC\u30C9\u306F\u901A\u5E38\u3088\u308A\u9AD8\u3044\u6599\u91D1\u30FB\u30AF\u30EC\u30B8\u30C3\u30C8\u6D88\u8CBB\u304C\u767A\u751F\u3057\u307E\u3059\u3002\u5229\u7528\u53EF\u5426\u306F\u30E2\u30C7\u30EB\u3068\u5951\u7D04\u306B\u3088\u308A\u307E\u3059\u3002",modelEnabled:"\u30E2\u30C7\u30EB\u3092\u4F7F\u3046",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",modelsFailed:"\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",noResults:"\u4E00\u81F4\u3059\u308B\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002",disabledHint:"\u30AA\u30D5\u306B\u3057\u3066\u3082\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",activateFirst:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",title:"Pi\u63A5\u7D9A",description:"\u63A5\u7D9A\u5148\u3068\u30ED\u30B0\u30A4\u30F3\u65B9\u6CD5\u3092\u9078\u3073\u307E\u3059\u3002",provider:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",method:"\u63A5\u7D9A\u65B9\u6CD5",oauth:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3",apiKey:"API\u30AD\u30FC",signIn:"\u30ED\u30B0\u30A4\u30F3",signInAgain:"\u518D\u30ED\u30B0\u30A4\u30F3",connected:"\u63A5\u7D9A\u6E08\u307F",notConnected:"\u672A\u63A5\u7D9A",busy:"\u30ED\u30B0\u30A4\u30F3\u4E2D\u2026",openBrowser:"\u30D6\u30E9\u30A6\u30B6\u3067\u7D9A\u3051\u308B",code:"\u8A8D\u8A3C\u30B3\u30FC\u30C9",copy:"\u30B3\u30FC\u30C9\u3092\u30B3\u30D4\u30FC",copied:"\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",close:"\u9589\u3058\u308B",submit:"\u7D9A\u3051\u308B",success:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F",successDescription:"\u8A8D\u8A3C\u60C5\u5831\u3092DeepSeek Harness\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",enable:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",failed:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cancelled:"\u30ED\u30B0\u30A4\u30F3\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",providerExpired:"\u8A8D\u8A3C\u30B3\u30FC\u30C9\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",timedOut:"\u30ED\u30B0\u30A4\u30F3\u306E\u5F85\u6A5F\u6642\u9593\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loadFailed:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",retry:"\u518D\u8A66\u884C",empty:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u308BPi\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093\u3002",answer:"\u8981\u6C42\u3055\u308C\u305F\u5024\u3092\u5165\u529B",secret:"API\u30AD\u30FC\u3092\u5165\u529B",selection:"\u9805\u76EE\u3092\u9078\u629E",enableFailed:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u304C\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",waiting:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044\u3002",readOnly:"\u3053\u306E\u74B0\u5883\u3067\u306F\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002"};var le=`.dsh-pi-login { color: var(--dsw-alias-label-primary); font-family: var(--dsw-font-family); font-size: 13px; line-height: 1.6; }
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
`;var de=`/* Button sizes share the global control-radius scale. */
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
`;var s=require("react/jsx-runtime"),ce="dsh.piLogin",Ne=["slots","locale","connection"];function Ae(e){return(0,d.useSyncExternalStore)(t=>e.subscribe(t),()=>e.getSnapshot().revision),e.bind(ce)}function Re(e){try{let t=new URL(e);if(t.protocol==="https:"||t.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(t.hostname))return t.href}catch{}}function R1({label:e,value:t,options:o,onChange:r,disabled:n}){let[a,c]=(0,d.useState)(!1),u=(0,d.useId)();return(0,s.jsxs)("div",{className:"dsh-pi-choice",children:[(0,s.jsx)("span",{id:u,className:"dsh-pi-caption",children:e}),(0,s.jsx)(N1,{open:a,onClose:()=>c(!1),portal:!0,selectedId:t,items:o,onSelect:l=>{r(l),c(!1)},anchor:(0,s.jsxs)(B,{variant:"outline",disabled:n,"aria-labelledby":u,"aria-haspopup":"menu","aria-expanded":a,onClick:()=>c(!a),className:"dsh-pi-choice-button",children:[(0,s.jsx)("span",{children:o.find(l=>l.id===t)?.label}),(0,s.jsx)(L1,{size:14})]})})]})}function Ee({prompt:e,ticket:t,controller:o,t:r,onFailure:n}){let[a,c]=(0,d.useState)(""),[u,l]=(0,d.useState)(!1),k=(0,d.useId)();async function v(b){b.preventDefault();let C=a;c(""),l(!0);try{await o.call("answer",{ticket:t,id:e.id,value:C})}catch{n()}finally{l(!1)}}return(0,s.jsxs)("form",{onSubmit:v,className:"dsh-pi-prompt",children:[e.kind==="select"?(0,s.jsx)(R1,{label:e.message||r("selection"),value:a,options:e.options,onChange:c,disabled:u}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("label",{htmlFor:k,children:e.message||r(e.kind==="secret"?"secret":"answer")}),(0,s.jsx)(h1,{id:k,"data-modal-autofocus":!0,type:e.kind==="secret"?"password":"text",autoComplete:"off",spellCheck:!1,value:a,placeholder:e.placeholder,onChange:b=>c(b.target.value)})]}),(0,s.jsx)("div",{className:"dsh-pi-actions",children:(0,s.jsx)(B,{type:"submit",variant:"primary",disabled:u||e.kind==="select"&&!a,children:r("submit")})})]})}function Be({entry:e,method:t,controller:o,t:r,onClose:n}){let a=(0,d.useRef)(),[c,u]=(0,d.useState)(),[l,k]=(0,d.useState)({status:"running"}),[v,b]=(0,d.useState)(!1),[C,x]=(0,d.useState)(!1),[W,m]=(0,d.useState)(!1),[H,A]=(0,d.useState)(!1),[p,Q]=(0,d.useState)(!1),[V,w]=(0,d.useState)(!1);(0,d.useEffect)(()=>{let R=!0;return o.start(e.key,t).then(Z=>{a.current=Z,R?u(Z):o.cancel(Z).catch(()=>{})},()=>{R&&b(!0)}),()=>{R=!1,a.current&&o.cancel(a.current).catch(()=>{})}},[]),(0,d.useEffect)(()=>{if(!c)return;let R=!0,Z,a1=new AbortController;async function D(){try{let l1=await o.call("state",{ticket:c},a1.signal);if(!R)return;k(l1),l1.status==="running"?Z=setTimeout(D,800):(o.tickets.delete(c),await o.refresh())}catch{R&&b(!0)}}return D(),()=>{R=!1,a1.abort(),clearTimeout(Z)}},[c]);let S=Re(l.notice?.url),J=l.status!=="running"||v,X=l.reason==="provider-expired"?"providerExpired":l.reason==="timeout"?"timedOut":l.status==="cancelled"?"cancelled":"failed";async function z(R=!1){x(!0),A(!1);try{await o.call(R?"use-login":"enable",{key:e.key}),m(!0),await o.refresh()}catch(Z){A(!0),Q(Z.message.endsWith("/api-key-override"))}finally{x(!1)}}return(0,s.jsxs)(k1,{open:!0,onClose:n,title:e.label,closeLabel:r("close"),className:"dsh-pi-login",footer:(0,s.jsx)(B,{variant:"outline",onClick:n,children:r(J?"close":"cancel")}),children:[v||l.status==="failed"?(0,s.jsx)("p",{role:"alert",children:r(v?"failed":X)}):null,l.status==="authorized"?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{role:"status",children:r("success")}),(0,s.jsx)("p",{className:"dsh-pi-muted",children:r("successDescription")}),W?(0,s.jsx)("p",{role:"status",children:r("enabled")}):(0,s.jsx)(B,{variant:"primary",onClick:()=>{z()},disabled:C,children:r("enable")}),H?(0,s.jsx)("p",{role:"alert",children:r(p?"keyOverride":"enableFailed")}):null,p&&!W?(0,s.jsx)(B,{variant:"outline",onClick:()=>{z(!0)},disabled:C,children:r("useLogin")}):null]}):null,l.status==="cancelled"?(0,s.jsx)("p",{role:l.reason==="timeout"?"alert":"status",children:r(X)}):null,J?null:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{role:"status",children:l.notice?.message||r(S?"waiting":"busy")}),S?(0,s.jsx)("a",{className:"dsh-pi-link",href:S,target:"_blank",rel:"noopener noreferrer",children:r("openBrowser")}):null,l.notice?.code?(0,s.jsxs)("div",{className:"dsh-pi-verification",children:[(0,s.jsx)("span",{className:"dsh-pi-muted",children:r("code")}),(0,s.jsxs)("div",{className:"dsh-pi-verification-row",children:[(0,s.jsx)("code",{children:l.notice.code}),(0,s.jsx)(B,{size:"sm",variant:"outline",onClick:async()=>{try{await navigator.clipboard.writeText(l.notice.code),w(!0)}catch{w(!1)}},children:r(V?"copied":"copy")})]})]}):null,l.prompt?(0,s.jsx)(Ee,{prompt:l.prompt,ticket:c,controller:o,t:r,onFailure:()=>b(!0)},l.prompt.id):null]})]})}function Ve({entry:e,controller:t,t:o,onClose:r}){let[n,a]=(0,d.useState)(),[c,u]=(0,d.useState)(""),[l,k]=(0,d.useState)(!1),[v,b]=(0,d.useState)(!1);(0,d.useEffect)(()=>{let m=new AbortController;return t.call("models",{key:e.key},m.signal).then(a,()=>{m.signal.aborted||b(!0)}),()=>m.abort()},[e.key]);async function C(m,H){k(!0),b(!1);try{await t.call("set-model",{key:e.key,model:m,enabled:H,revision:n.revision}),a(await t.call("models",{key:e.key}))}catch{b(!0);try{a(await t.call("models",{key:e.key}))}catch{}}finally{k(!1)}}let x=c.trim().toLowerCase(),W=n?.models.filter(m=>`${m.id} ${m.name}`.toLowerCase().includes(x));return(0,s.jsxs)(k1,{open:!0,title:`${e.label} \xB7 ${o("models")}`,description:o("modelsHint"),closeLabel:o("close"),onClose:r,className:"dsh-pi-login dsh-pi-models-dialog",footer:(0,s.jsx)(B,{variant:"outline",onClick:r,children:o("close")}),children:[(0,s.jsx)(h1,{icon:(0,s.jsx)(_1,{size:16}),"aria-label":o("searchModels"),placeholder:o("searchModels"),"data-modal-autofocus":!0,value:c,onChange:m=>u(m.target.value)}),v?(0,s.jsx)("p",{role:"alert",children:o(n?"saveFailed":"modelsFailed")}):null,!n&&!v?(0,s.jsx)("p",{role:"status",children:o("loading")}):null,n&&!e.managed?(0,s.jsx)("p",{className:"dsh-pi-muted",children:o("activateFirst")}):null,n?.models.some(m=>m.fast)?(0,s.jsx)("p",{className:"dsh-pi-muted",children:o("fastWarning")}):null,(0,s.jsxs)("div",{className:"dsh-pi-model-list",children:[W?.map(m=>(0,s.jsxs)("div",{className:"dsh-pi-model-row",children:[(0,s.jsxs)("div",{className:"dsh-pi-model-label",children:[(0,s.jsx)("span",{children:m.name}),(0,s.jsx)("span",{className:"dsh-pi-model-id",children:m.id})]}),(0,s.jsx)(u1,{label:`${o("modelEnabled")}: ${m.name}`,checked:m.enabled,disabled:l||!e.writable||!e.managed,onChange:H=>{C(m.id,H)}})]},m.id)),W?.length===0?(0,s.jsx)("p",{className:"dsh-pi-muted",children:o("noResults")}):null]})]})}function E1({controller:e,locale:t,provider:o}){let r=(0,d.useSyncExternalStore)(e.subscribe,e.getSnapshot),n=Ae(t),[a,c]=(0,d.useState)("llm-pi-ai/openai"),[u,l]=(0,d.useState)("oauth"),[k,v]=(0,d.useState)(),[b,C]=(0,d.useState)(!1),[x,W]=(0,d.useState)(!1),[m,H]=(0,d.useState)(!1);(0,d.useEffect)(()=>{e.load()},[e]);let A=o?r.entries.filter(w=>w.provider===o.provider):r.entries,p=A.find(w=>w.key===a)||A[0],Q=p?.methods.find(w=>w.id===u)||p?.methods[0];async function V(w){W(!0),H(!1);try{let S=await e.call("models",{key:p.key});await e.call("set-provider",{key:p.key,enabled:w,revision:S.revision}),await e.refresh()}catch{H(!0),await e.refresh()}finally{W(!1)}}return o&&!p&&!r.error?null:(0,s.jsxs)("section",{className:`dsh-pi-login ${o?"dsh-pi-card":"dsh-pi-footer"}`,children:[o?null:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("h3",{children:n("title")}),(0,s.jsx)("p",{className:"dsh-pi-muted",children:n("description")})]}),r.error?(0,s.jsxs)("p",{role:"alert",children:[n("loadFailed")," ",(0,s.jsx)(B,{size:"sm",onClick:()=>{e.refresh()},children:n("retry")})]}):null,r.status==="ready"&&!r.error&&A.length===0&&!o?(0,s.jsx)("p",{children:n("empty")}):null,p?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{className:"dsh-pi-fields",children:[o?null:(0,s.jsx)(R1,{label:n("provider"),value:p.key,options:A.map(w=>({id:w.key,label:w.label})),onChange:c,disabled:x}),p.methods.length>1?(0,s.jsx)(R1,{label:n("method"),value:Q.id,options:p.methods.map(w=>({id:w.id,label:w.id==="oauth"?n("oauth"):w.id==="api-key"?n("apiKey"):w.label})),onChange:l,disabled:x}):null]}),(0,s.jsxs)("div",{className:"dsh-pi-account-row",children:[(0,s.jsxs)("span",{className:"dsh-pi-status",children:[(0,s.jsx)(A1,{state:p.inFlight?"ongoing":p.configured?"done":"pending",size:10}),n(p.inFlight?"busy":p.configured?"connected":"notConnected")]}),(0,s.jsx)(B,{variant:p.configured?"outline":"primary",size:"sm",disabled:p.inFlight||!p.writable||!Q,onClick:()=>v({entry:p,method:Q.id}),children:n(p.configured?"signInAgain":"signIn")})]}),(0,s.jsxs)("div",{className:"dsh-pi-provider-row",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{children:n("useProvider")}),(0,s.jsx)("p",{className:"dsh-pi-muted",children:n("disabledHint")})]}),(0,s.jsx)(u1,{label:`${n("useProvider")}: ${p.label}`,checked:p.enabled,disabled:x||!p.writable||!p.configured&&!p.managed,onChange:w=>{V(w)}})]}),(0,s.jsx)(B,{variant:"outline",size:"sm",disabled:x,onClick:()=>C(!0),children:n("manageModels")}),m?(0,s.jsx)("p",{role:"alert",children:n("saveFailed")}):null,p.writable?null:(0,s.jsx)("p",{className:"dsh-pi-muted",children:n("readOnly")})]}):null,k?(0,s.jsx)(Be,{...k,controller:e,t:n,onClose:()=>v(void 0)}):null,b&&p?(0,s.jsx)(Ve,{entry:p,controller:e,t:n,onClose:()=>C(!1)}):null]})}function Se(e){let t=new v1(e.connection);e.effect(()=>()=>t.dispose(),"dsh-pi-login: UI requests"),e.effect(()=>e.locale.register(ce,{en:ie,ja:ae}),"dsh-pi-login: copy"),e.effect(()=>{let r=document.createElement("style");return r.dataset.dshPiLogin="",r.textContent=de+le,document.head.append(r),()=>r.remove()},"dsh-pi-login: official controls"),e.on("connection/reset",()=>{t.refresh()});let o=()=>({controller:t,locale:e.locale});e.slots.inject("settings.models.footer",()=>e.slots.register({name:"settings.models.footer",id:"dsh-pi-login",order:10,inject:o},E1)),e.slots.inject("settings.models.provider-card",()=>e.slots.register({name:"settings.models.provider-card",id:"dsh-pi-login",key:"dsh-pi-login",inject:o},E1))}

return module.exports;}});
