window.__ModuleLoader__.load({id:"@local/dsh-pi-login",factory(require){const module={exports:{}};const exports=module.exports;
var ye=Object.defineProperty;var Ct=Object.getOwnPropertyDescriptor;var wt=Object.getOwnPropertyNames;var ft=Object.prototype.hasOwnProperty;var kt=(e,o)=>{for(var t in o)ye(e,t,{get:o[t],enumerable:!0})},vt=(e,o,t,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let s of wt(o))!ft.call(e,s)&&s!==t&&ye(e,s,{get:()=>o[s],enumerable:!(r=Ct(o,s))||r.enumerable});return e};var xt=e=>vt(ye({},"__esModule",{value:!0}),e);var Dt={};kt(Dt,{ConnectionUI:()=>Be,UpdateUI:()=>ut,apply:()=>Ft,inject:()=>Et});module.exports=xt(Dt);var c=require("react");var je=require("react");function Ke(e){var o,t,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var s=e.length;for(o=0;o<s;o++)e[o]&&(t=Ke(e[o]))&&(r&&(r+=" "),r+=t)}else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function bt(){for(var e,o,t=0,r="",s=arguments.length;t<s;t++)(e=arguments[t])&&(o=Ke(e))&&(r&&(r+=" "),r+=o);return r}var I=bt;var se={button:"dshpi_13ed0003_button",md:"dshpi_13ed0003_md",sm:"dshpi_13ed0003_sm",primary:"dshpi_13ed0003_primary",ghost:"dshpi_13ed0003_ghost",outline:"dshpi_13ed0003_outline",toolbar:"dshpi_13ed0003_toolbar",icon:"dshpi_13ed0003_icon"};var ce=require("react/jsx-runtime"),R=(0,je.forwardRef)(function({variant:o="ghost",size:t="md",icon:r,className:s,children:i,...p},g){return(0,ce.jsxs)("button",{ref:g,type:"button",className:I(se.button,se[o],se[t],s),...p,children:[r!=null&&(0,ce.jsx)("span",{className:se.icon,children:r}),i]})});var Ge=require("react");var pe={wrap:"dshpi_fda332f6_wrap",icon:"dshpi_fda332f6_icon",input:"dshpi_fda332f6_input"};var ie=require("react/jsx-runtime"),he=(0,Ge.forwardRef)(function({icon:o,className:t,...r},s){return(0,ie.jsxs)("span",{className:I(pe.wrap,t),children:[o!=null&&(0,ie.jsx)("span",{className:pe.icon,children:o}),(0,ie.jsx)("input",{ref:s,className:pe.input,...r})]})});var _e={switch:"dshpi_7ae83aee_switch",thumb:"dshpi_7ae83aee_thumb"};var Le=require("react/jsx-runtime");function ue({checked:e,onChange:o,label:t,disabled:r=!1,title:s,className:i}){return(0,Le.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":t,title:s,disabled:r,className:I(_e.switch,i),onClick:()=>{o(!e)},children:(0,Le.jsx)("span",{className:_e.thumb})})}var W=require("react"),nt=require("react-dom");var It=require("react");var $e=require("react/jsx-runtime");var H=require("react/jsx-runtime");var ge=1;var Mt=({size:e=16,className:o,strokeWidth:t})=>(0,H.jsxs)("svg",{width:e,height:e,className:o,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,H.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,H.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),Pe=e=>(0,H.jsx)(Mt,{...e,strokeWidth:ge});var yt=({size:e=16,className:o,strokeWidth:t})=>(0,H.jsx)("svg",{width:e,height:e,className:o,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,H.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),me=e=>(0,H.jsx)(yt,{...e,strokeWidth:ge});var _t=({size:e=14,className:o,strokeWidth:t})=>(0,H.jsx)("svg",{width:e,height:e,className:o,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,H.jsx)("path",{d:"M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6",stroke:"currentColor"})}),We=e=>(0,H.jsx)(_t,{...e,strokeWidth:ge});var Lt=({size:e=16,className:o,strokeWidth:t})=>(0,H.jsxs)("svg",{width:e,height:e,className:o,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,H.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,H.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),Qe=e=>(0,H.jsx)(Lt,{...e,strokeWidth:ge});function Ye(e){let o=document.documentElement,t=Number.parseFloat(getComputedStyle(o).getPropertyValue("--dsh-frame-top-clearance"));return Number.isNaN(t)?e:Math.max(e,(o.hasAttribute("data-fullscreen")?0:t)+20)}var G=require("react"),Pt=200;function Je(e){let o=(0,G.useRef)(null),t=(0,G.useRef)(e);t.current=e;let r=(0,G.useCallback)(()=>{o.current!==null&&(clearTimeout(o.current),o.current=null)},[]),s=(0,G.useCallback)(()=>{r(),o.current=setTimeout(()=>{o.current=null,t.current()},Pt)},[r]);return(0,G.useEffect)(()=>r,[r]),{arm:s,cancel:r}}var fe=require("react");function Ce(e){let o=!1,t=!1,r=()=>{o=!0},s=()=>{o=!1,t=!0},i=()=>{t=!1},p=()=>{o=!1,t=!1};return e.addEventListener("compositionstart",r,!0),e.addEventListener("compositionend",s,!0),e.addEventListener("keyup",i,!0),e.defaultView?.addEventListener("blur",p),{guards:g=>{let l=o||t||g.isComposing||g.keyCode===229;return t=!1,l},dispose:()=>{e.removeEventListener("compositionstart",r,!0),e.removeEventListener("compositionend",s,!0),e.removeEventListener("keyup",i,!0),e.defaultView?.removeEventListener("blur",p)}}}var Oe=new WeakMap,Wt=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function oe(e,o){Oe.get(e)?.();let t=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",t),e.removeEventListener("keydown",r,!0),Oe.delete(e)},r=s=>{!s.isComposing&&!s.ctrlKey&&!s.altKey&&!s.metaKey&&Wt.has(s.key)&&t()};Oe.set(e,t),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",t),e.addEventListener("keydown",r,!0),e.focus(o),e.matches(":focus")||t()}var we=new WeakMap;function ze(e){if(e===null)return!1;let o=we.get(e.ownerDocument)?.at(-1);return o!==void 0&&!o.element.contains(e)}var Xe='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function et(e,o,t){let r=(0,fe.useRef)(t);r.current=t,(0,fe.useLayoutEffect)(()=>{let s=e.current;if(!o||s===null)return;let i=s.ownerDocument,p=Ce(i),g=i.activeElement,l=we.get(i)??[];we.set(i,l);let k={element:s,close:()=>{r.current()}};l.push(k);let v=s.querySelector("[data-modal-autofocus]")??s.querySelector(Xe)??s;s.contains(i.activeElement)||oe(v);let x=w=>{let M=p.guards(w);if(l.at(-1)!==k||w.defaultPrevented||M||w.ctrlKey||w.altKey||w.metaKey||(w.key==="Escape"&&!w.shiftKey&&(w.preventDefault(),w.repeat||r.current()),w.key!=="Tab")||i.activeElement?.closest('[role="menu"]'))return;let _=[...s.querySelectorAll(Xe)].filter(E=>!E.closest("[inert], [hidden]")),O=_[0]??s,B=_.at(-1)??s,S=w.shiftKey?i.activeElement===O:i.activeElement===B;(i.activeElement===s||!s.contains(i.activeElement)||S)&&(w.preventDefault(),(w.shiftKey?B:O).focus())};return i.addEventListener("keydown",x),()=>{p.dispose();let w=l.at(-1)===k;if(l.splice(l.indexOf(k),1),i.removeEventListener("keydown",x),l.length===0&&we.delete(i),w){let M=g instanceof HTMLElement&&g.isConnected?g:l.at(-1)?.element;M!==void 0&&oe(M)}}},[e,o])}var re={keys:"dshpi_042ff8c4_keys",key:"dshpi_042ff8c4_key",tooltip:"dshpi_042ff8c4_tooltip",separator:"dshpi_042ff8c4_separator",joined:"dshpi_042ff8c4_joined"};var Re=require("react/jsx-runtime");function He({keys:e,variant:o="plain",className:t}){return(0,Re.jsx)("span",{className:I(re.keys,o==="tooltip"&&re.tooltip,o==="tooltip"&&e.includes("+")&&re.joined,t),children:e.map((r,s)=>(0,Re.jsx)("kbd",{className:r==="+"?re.separator:re.key,children:r},s))})}var Q=require("react"),tt=require("react-dom");var ne={surface:"dshpi_a00a35bd_surface",backing:"dshpi_a00a35bd_backing",compact:"dshpi_a00a35bd_compact",material:"dshpi_a00a35bd_material"};var $=require("react/jsx-runtime"),Ne=(0,Q.forwardRef)(function({compact:o=!1,className:t,style:r,children:s,...i},p){let g=(0,Q.useId)(),l=(0,Q.useRef)(null);(0,Q.useLayoutEffect)(()=>{document.body.appendChild(l.current)},[]);let k={"--dsh-menu-anchor":`--dsh-menu-${g.replaceAll(":","")}`};return(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)("div",{...i,ref:p,"data-menu-material":"translucent",className:I(ne.surface,o&&ne.compact,t),style:{...r,...k},children:[(0,$.jsx)("div",{"aria-hidden":"true",className:ne.material}),s]}),(0,tt.createPortal)((0,$.jsx)("div",{ref:l,"aria-hidden":"true","data-menu-backing":"",className:I(ne.backing,o&&ne.compact),style:{...k,visibility:r?.visibility}}),document.body)]})});var C={root:"dshpi_1911279a_root",list:"dshpi_1911279a_list",submenu:"dshpi_1911279a_submenu",scrollable:"dshpi_1911279a_scrollable",viewport:"dshpi_1911279a_viewport",css:"dshpi_1911279a_css",portal:"dshpi_1911279a_portal",sideTop:"dshpi_1911279a_sideTop",alignEnd:"dshpi_1911279a_alignEnd",tsx:"dshpi_1911279a_tsx",footer:"dshpi_1911279a_footer",separator:"dshpi_1911279a_separator",itemWrap:"dshpi_1911279a_itemWrap",item:"dshpi_1911279a_item",denseList:"dshpi_1911279a_denseList",label:"dshpi_1911279a_label",compactList:"dshpi_1911279a_compactList",itemIcon:"dshpi_1911279a_itemIcon",check:"dshpi_1911279a_check",itemLabel:"dshpi_1911279a_itemLabel",shortcut:"dshpi_1911279a_shortcut",shortcutKeys:"dshpi_1911279a_shortcutKeys",selected:"dshpi_1911279a_selected",selectedFill:"dshpi_1911279a_selectedFill",danger:"dshpi_1911279a_danger"};var y=require("react/jsx-runtime");function ot(e){return"type"in e&&e.type==="separator"}function rt(e){return"type"in e&&e.type==="label"}var Ot={visibility:"hidden",left:0,top:0};function Ae({open:e,anchor:o,items:t=[],children:r,selectedId:s,selectedIds:i,onSelect:p,onClose:g,align:l="start",side:k="bottom",portal:v=!1,closeOnPointerLeave:x=!1,dense:w=!1,compact:M=!1,autoFocus:_=!1,selection:O="check",getAnchorRect:B,footer:S,className:E,listClassName:h}){let d=(0,W.useRef)(null),b=(0,W.useRef)(null),m=(0,W.useRef)(null),D=(0,W.useRef)(null),X=(0,W.useRef)(!1),z=(a=!1)=>{let f=D.current,T=f!==null&&document.contains(f)&&!f.disabled?f:d.current?.querySelector("button:not(:disabled)");T!=null&&(a?T.focus():oe(T))},V=()=>{let a=X.current;queueMicrotask(()=>{if(Z.current)return;let f=document.activeElement;(f===null||f===document.body||b.current?.contains(f)===!0)&&z(a)})},Z=(0,W.useRef)(e);Z.current=e;let[ae,q]=(0,W.useState)(null),[le,Ve]=(0,W.useState)(null),{arm:gt,cancel:Ie}=Je(g);(0,W.useLayoutEffect)(()=>{if(!e||!v){Ve(null);return}let a=()=>{let L;if(B!==void 0?L=B():L=d.current?.getBoundingClientRect()??null,L===null)return;let P=12,de=window.innerWidth,u=window.innerHeight,K=b.current,ee=K?.offsetWidth??0,j=K?.offsetHeight??0,U,A;k==="right"?(U=L.right+4,A=L.top):l==="start"?(U=L.left,A=k==="bottom"?L.bottom+4:L.top-j-4):(U=L.right-ee,A=k==="bottom"?L.bottom+4:L.top-j-4),ee>0&&(U=Math.min(Math.max(U,P),de-ee-P)),j>0&&(A=Math.min(Math.max(A,Ye(P)),u-j-P)),Ve(te=>te?.left===U&&te.top===A?te:{left:U,top:A})};a();let f=()=>{a(),T=requestAnimationFrame(f)},T=requestAnimationFrame(f);return window.addEventListener("scroll",a,!0),window.addEventListener("resize",a),()=>{cancelAnimationFrame(T),window.removeEventListener("scroll",a,!0),window.removeEventListener("resize",a)}},[e,v,l,k,B]),(0,W.useEffect)(()=>{if(!e){D.current=null;return}let a=document.activeElement;D.current=a instanceof HTMLElement&&d.current?.contains(a)===!0?a:null},[e]),(0,W.useEffect)(()=>{if(!e||!_)return;let a=b.current?.querySelector("button:not(:disabled)");m.current=a==null?null:0,a!=null&&oe(a)},[e,_]),(0,W.useEffect)(()=>{if(!e){q(null),m.current=null;return}let a=Ce(document),f=u=>{u.target instanceof Node&&d.current?.contains(u.target)!==!0&&b.current?.contains(u.target)!==!0&&g()},T=u=>{if(a.guards(u)||ze(d.current)||u.defaultPrevented||u.ctrlKey||u.altKey||u.metaKey)return;let K=document.activeElement,ee=b.current?.contains(K)===!0,j=d.current?.contains(K)===!0||ee;if(u.key==="Escape"&&!u.shiftKey){if(u.preventDefault(),u.repeat)return;g(),(j||_)&&z()}if(u.key==="Tab"){let Ue=b.current;if(Ue===null||!j)return;if(u.shiftKey){u.preventDefault(),g(),z(!0);return}if(ee){if(K instanceof Element&&K.getAttribute("role")==="menuitem"){u.preventDefault(),X.current=!0;try{K.click()}finally{X.current=!1}}return}let qe=Ue.querySelector("button:not(:disabled)");if(qe===null)return;u.preventDefault(),qe.focus(),m.current=0;return}if(!["ArrowDown","ArrowUp","Home","End"].includes(u.key))return;let U=b.current;if(U===null||!j)return;let A=Array.from(U.querySelectorAll("button:not(:disabled)"));if(A.length===0)return;let te=A.indexOf(K),Fe=te>=0?te:m.current,De=u.key==="Home"?0:u.key==="End"?A.length-1:Fe===null?u.key==="ArrowDown"?0:A.length-1:(Fe+(u.key==="ArrowDown"?1:-1)+A.length)%A.length;u.preventDefault(),m.current=De,A[De]?.focus()},L=()=>{document.activeElement instanceof HTMLIFrameElement&&g()};document.addEventListener("pointerdown",f);let P=u=>{u.key==="Escape"&&T(u)},de=u=>{u.key!=="Escape"&&T(u)};return document.addEventListener("keydown",de),document.addEventListener("keydown",P,!0),window.addEventListener("blur",L),()=>{a.dispose(),document.removeEventListener("pointerdown",f),document.removeEventListener("keydown",de),document.removeEventListener("keydown",P,!0),window.removeEventListener("blur",L)}},[e,g,_]),(0,W.useEffect)(()=>{e||Ie()},[e,Ie]);let mt=!t.some(a=>!ot(a)&&!rt(a)&&a.submenu!==void 0&&a.submenu.length>0),Te=a=>{if(ot(a))return(0,y.jsx)("div",{className:C.separator,role:"separator"},a.id);if(rt(a))return(0,y.jsx)("div",{className:C.label,role:"presentation",children:a.text},a.id);let f=a.submenu!==void 0&&a.submenu.length>0,T=f&&ae===a.id,L=a.id===s||i?.includes(a.id)===!0;return(0,y.jsxs)("div",{className:C.itemWrap,onMouseEnter:f?()=>{q(a.id)}:void 0,onMouseLeave:()=>{q(null)},children:[(0,y.jsxs)("button",{type:"button",role:"menuitem",className:I(C.item,L&&(O==="fill"?C.selectedFill:C.selected),a.danger===!0&&C.danger),disabled:a.disabled,"aria-keyshortcuts":a.shortcut?.aria,"aria-haspopup":f?"menu":void 0,"aria-expanded":f?T:void 0,onFocus:f?()=>{q(a.id)}:void 0,onClick:()=>{if(f){q(a.id);return}p?.(a.id)},children:[a.icon!==void 0&&(0,y.jsx)("span",{className:C.itemIcon,children:a.icon}),(0,y.jsx)("span",{className:C.itemLabel,children:a.label}),a.shortcut!==void 0&&(0,y.jsx)("span",{"aria-hidden":"true",className:C.shortcut,children:(0,y.jsx)(He,{keys:a.shortcut.keys,className:C.shortcutKeys})}),L&&O==="check"&&(0,y.jsx)(me,{className:C.check})]}),T&&a.submenu!==void 0&&(0,y.jsx)(Ne,{compact:M,className:I(C.submenu,M&&C.compactList),role:"menu",children:a.submenu.map(P=>(0,y.jsxs)("button",{type:"button",role:"menuitem",className:C.item,disabled:P.disabled,"aria-keyshortcuts":P.shortcut?.aria,onClick:()=>{p?.(P.id),V()},children:[P.icon!==void 0&&(0,y.jsx)("span",{className:C.itemIcon,children:P.icon}),(0,y.jsx)("span",{className:C.itemLabel,children:P.label}),P.shortcut!==void 0&&(0,y.jsx)("span",{"aria-hidden":"true",className:C.shortcut,children:(0,y.jsx)(He,{keys:P.shortcut.keys,className:C.shortcutKeys})})]},P.id))})]},a.id)},Ze=a=>{let f=a.target instanceof Element?a.target.closest('button[role="menuitem"]'):null;f===null||f.getAttribute("aria-haspopup")==="menu"||f.closest('[role="menu"]')===a.currentTarget&&q(null)},Me=e&&(0,y.jsxs)(Ne,{compact:M,ref:b,className:I(C.list,h,w&&C.denseList,M&&C.compactList,mt&&C.scrollable,v&&C.portal,k==="top"&&!v&&C.sideTop,l==="end"&&!v&&C.alignEnd),style:v?le??Ot:void 0,role:"menu",onClick:a=>{a.stopPropagation();let f=a.target instanceof Element?a.target.closest('button[role="menuitem"]'):null;f!==null&&f.getAttribute("aria-haspopup")!=="menu"&&V()},onMouseOver:Ze,onFocus:Ze,children:[(0,y.jsxs)("div",{className:C.viewport,role:"presentation",children:[t.map(Te),r]}),S!==void 0&&S.length>0&&(0,y.jsx)("div",{className:C.footer,role:"presentation",children:S.map(Te)})]});return(0,y.jsxs)("span",{ref:d,className:I(C.root,E),onPointerEnter:x?Ie:void 0,onPointerLeave:x?()=>{e&&gt()}:void 0,children:[o,v?Me!==!1&&(0,nt.createPortal)(Me,document.body):Me]})}var st=require("react"),it=require("react-dom");var F={root:"dshpi_b97756f9_root",mask:"dshpi_b97756f9_mask",dialog:"dshpi_b97756f9_dialog",content:"dshpi_b97756f9_content",header:"dshpi_b97756f9_header",title:"dshpi_b97756f9_title",close:"dshpi_b97756f9_close",description:"dshpi_b97756f9_description",body:"dshpi_b97756f9_body",footer:"dshpi_b97756f9_footer"};var N=require("react/jsx-runtime");function ke({open:e,onClose:o,title:t,closeLabel:r,description:s,children:i,footer:p,className:g,contentClassName:l,onKeyDownCapture:k,headless:v=!1,backdropBlur:x=!0,shortcutModal:w}){let M=(0,st.useRef)(null);return et(M,e,o),e?(0,it.createPortal)((0,N.jsxs)("div",{className:F.root,role:"presentation",onKeyDownCapture:k,children:[(0,N.jsx)("div",{className:F.mask,style:x?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:o}),(0,N.jsx)("div",{ref:M,tabIndex:-1,"data-shortcut-modal":w,className:I(F.dialog,g),role:"dialog","aria-modal":"true","aria-label":t,children:v?i:(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)("div",{className:I(F.content,l),children:[(0,N.jsxs)("div",{className:F.header,children:[(0,N.jsx)("h2",{className:F.title,children:t}),(0,N.jsx)("button",{type:"button",className:F.close,"aria-label":r,onClick:o,children:(0,N.jsx)(Qe,{size:14})})]}),s!==void 0&&s!==""&&(0,N.jsx)("p",{className:F.description,children:s}),i!==void 0&&(0,N.jsx)("div",{className:F.body,children:i})]}),p!==void 0&&(0,N.jsx)("div",{className:F.footer,children:p})]})})]}),document.body):null}var J={dot:"dshpi_34138a6f_dot",spinner:"dshpi_34138a6f_spinner",spinnerMotion:"dshpi_34138a6f_spinnerMotion",spinnerTrack:"dshpi_34138a6f_spinnerTrack",spinnerArc:"dshpi_34138a6f_spinnerArc",step:"dshpi_34138a6f_step"};var Y=require("react/jsx-runtime");function Rt(e){e!==null&&(at(e),e.addEventListener("animationstart",()=>{at(e)}))}function at(e){let o=e;for(let t of o.getAnimations?.({subtree:!0})??[])t.startTime=0}function Ee({state:e,size:o,className:t,appearance:r="dot"}){let s=o??(e==="ongoing"?14:10);return e==="ongoing"?(0,Y.jsx)("svg",{ref:Rt,className:I(J.spinner,t),"data-state":"ongoing",width:s,height:s,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,Y.jsxs)("g",{className:J.spinnerMotion,children:[(0,Y.jsx)("circle",{className:J.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,Y.jsx)("circle",{className:J.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,Y.jsx)("span",{className:I(r==="step"?J.step:J.dot,t),"data-state":e,style:{width:s,height:s},"aria-hidden":"true",children:r==="step"&&e==="done"&&(0,Y.jsx)(me,{size:s-2})})}var Ht=Object.freeze({status:"idle",entries:[],error:!1}),ve=class{constructor(o){this.connection=o,this.state=Ht,this.listeners=new Set,this.pending=void 0,this.closed=!1,this.tickets=new Set}getSnapshot=()=>this.state;subscribe=o=>(this.listeners.add(o),()=>this.listeners.delete(o));publish(o){if(!this.closed){this.state=o;for(let t of this.listeners)t()}}async call(o,t={},r){let s=await this.connection.rpc.call("/api",`dsh-pi-login/${o}`,t,r);if(!s.ok)throw new Error(s.error.code);return s.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let o={abort:new AbortController};return o.promise=this.call("list",{},o.abort.signal).then(t=>{this.pending===o&&this.publish({status:"ready",entries:t,error:!1})},()=>{this.pending===o&&this.publish({...this.state,status:"ready",error:!0})}).finally(()=>{this.pending===o&&(this.pending=void 0)}),this.pending=o,this.publish({...this.state,status:"loading",error:!1}),o.promise}refresh(){let o=this.pending;return this.pending=void 0,o?.abort.abort(),this.load()}async start(o,t){let r=await this.call("start",{key:o,method:t});if(typeof r.ticket!="string")throw new Error("invalid ticket");if(this.closed)throw await this.call("cancel",r),new Error("disposed");return this.tickets.add(r.ticket),r.ticket}async cancel(o){this.tickets.delete(o);try{await this.call("cancel",{ticket:o})}finally{await this.refresh()}}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear();for(let o of this.tickets)this.call("cancel",{ticket:o}).catch(()=>{});this.tickets.clear()}};var xe="dsh-pi-login:update",be=class{constructor(o,t){if(t===void 0)try{t=globalThis.sessionStorage}catch{}this.connection=o,this.storage=t,this.listeners=new Set,this.state={status:"idle"},this.generation=0,this.closed=!1,this.timer=null;try{this.requestId=t?.getItem(xe)||void 0}catch{}}getSnapshot=()=>this.state;subscribe=o=>(this.listeners.add(o),()=>this.listeners.delete(o));publish(o){if(!this.closed){this.state=o;for(let t of this.listeners)t()}}async call(o,t={}){let r=await this.connection.rpc.call("/api",`dsh-pi-login/update-${o}`,t);if(!r.ok){let s=new Error(r.error.code);throw s.rejected=!0,s}return r.value}async load(){if(this.closed)return;let o=++this.generation;clearTimeout(this.timer);try{let t=await this.call(this.requestId?"reconcile":"status",this.requestId?{requestId:this.requestId}:{});if(this.closed||o!==this.generation)return;if(t.requestId){this.requestId=t.requestId;try{this.storage?.setItem(xe,t.requestId)}catch{}}this.publish(t),["preparing","installing"].includes(t.status)&&(this.timer=setTimeout(()=>{this.load()},800))}catch{o===this.generation&&this.publish({...this.state,status:this.requestId?"unknown":"blocked",reason:"network"})}}async check(){if(this.closed||["checking","preparing","installing","starting","unknown"].includes(this.state.status))return;let o=++this.generation;this.publish({...this.state,status:"checking"});try{let t=await this.call("check");o===this.generation&&this.publish(t)}catch{o===this.generation&&this.publish({...this.state,status:"blocked",reason:"network"})}}async begin(){if(this.closed||this.state.status!=="available")return;let o=this.state.candidate,t=++this.generation;this.requestId=crypto.randomUUID();try{this.storage?.setItem(xe,this.requestId)}catch{}this.publish({...this.state,status:"starting"});try{let r=await this.call("begin",{candidateId:o.id,requestId:this.requestId});if(typeof r.requestId!="string")throw new Error("invalid request");this.requestId=r.requestId;try{this.storage?.setItem(xe,r.requestId)}catch{}t===this.generation&&(this.publish({...this.state,...r}),await this.load())}catch(r){t===this.generation&&this.publish({...this.state,status:r.rejected?"failed":"unknown",reason:r.message.endsWith("/busy")?"busy":"network"})}}dispose(){this.closed=!0,this.generation++,clearTimeout(this.timer),this.listeners.clear()}};var lt={updateReason_storage:"Could not write the update files to the profile.",updateReason_interrupted:"The download was interrupted before installation. Check again.",updateTitle:"Pi plugin",updateIdle:"Check for a plugin release separately from the model catalog.",updateChecking:"Checking for updates\u2026",updateCurrent:"No newer stable release.",updateAvailable:"A plugin update is available. Your saved credentials and model choices are kept.",updateBlocked:"The update could not be checked or is unavailable.",updatePreparing:"Downloading and verifying the release\u2026",updateInstalling:"Installing the plugin\u2026",updateRestart:"Installed. Restart DSH when your current work is finished to apply the update.",updateApplied:"The updated plugin version is running.",updateFailed:"Update failed. Review the stage below and check again.",updateCancelled:"The installer confirmed cancellation.",updateOverridden:"Saved settings prevent the update from applying.",updateUnknown:"The installation result is unknown. Reconcile the operation before starting another update.",updateCheck:"Check plugin update",updateInstall:"Update plugin",updateReconcile:"Check installation result",updateManual:"Releases / manual update",updateChecked:"Last checked",updateStage:"Installer stage","updateReason_manager-unavailable":"Plugin manager or writable profile is unavailable. Use the Releases page.","updateReason_read-only":"This bundle is not writable in the active profile.",updateReason_source:"This installation source requires a manual update. Its version pin will be preserved.",updateReason_incompatible:"The release does not support this DSH version.","updateReason_compatibility-unknown":"The release compatibility could not be confirmed.",updateReason_busy:"Finish sign-in and settings saves before updating.",updateReason_network:"Could not contact the release service. Try again later.",updateReason_metadata:"Release metadata is invalid. Use the release link to review it.",updateReason_asset:"The required release assets are missing or ambiguous.",updateReason_channel:"This update accepts stable releases only.",updateReason_checksum:"Release checksum verification failed.",updateReason_redirect:"The release redirected to an unapproved host.",updateReason_size:"The release exceeded its download size limit.","updateReason_stale-candidate":"The release or installation changed. Check again.","updateReason_release-unavailable":"The release service returned no accessible release.",metaRateLimited:"Meta limited the account check. Wait before trying again.",reloadModels:"Update model list",catalogRefreshUnsupported:"Model list refresh is not supported for this provider yet. Update the plugin or SDK to get new models.",catalogRefreshFailed:"Could not update the model list. Try again or sign in again if needed.",metaSubscriptionActive:"Muse subscription active",metaSubscriptionInactive:"Muse subscription inactive",metaSubscriptionUnknown:"Muse subscription could not be confirmed",metaReloadHint:"Checks your Muse subscription and fetches its model list. New models start off. This does not test generation or Contributor billing. Reload again after restarting.",metaContributorHint:"Review Meta\u2019s Contributor data-use terms before enabling a Contributor model.",capabilitiesUnknown:"Capabilities not supplied: text only, provider-default reasoning, configured token limits.",metaLoginRequired:"Sign in to Meta with your Muse account first.",metaKeyOverride:"An API-key reference overrides your Muse login. Choose \u201CUse saved credentials\u201D or remove that reference first.",metaSettingsIncompatible:"Muse account reload requires the default Meta endpoint and saved login, without an Authorization header override.",metaAccountChanged:"Your Meta account changed during reload. Reload again.",useLogin:"Use saved credentials",keyOverride:"The configured API-key reference takes priority.",models:"Models",manageModels:"Choose models",useProvider:"Use this provider",searchModels:"Search models",fastWarning:"Fast mode uses paid priority processing or additional subscription credits. Availability depends on your account and model.",modelEnabled:"Use model",loading:"Loading\u2026",modelsFailed:"Could not load the models.",saveFailed:"Could not save settings. Try again.",modelsHint:"When the provider is on, selected models are available to chats and agents.",noResults:"No matching models.",disabledHint:"Turning this off keeps your credentials and model choices.",activateFirst:"Enable the provider before choosing models.",title:"Pi connections",description:"Choose a provider and sign-in method.",provider:"Provider",method:"Sign-in method",oauth:"Browser sign-in",apiKey:"API key",signIn:"Sign in",signInAgain:"Sign in again",connected:"Connected",notConnected:"Not connected",busy:"Signing in\u2026",openBrowser:"Continue in browser",code:"Verification code",copy:"Copy code",copied:"Copied",cancel:"Cancel",close:"Close",submit:"Continue",success:"Signed in",successDescription:"Your credentials are saved in DeepSeek Harness.",enable:"Enable provider",enabled:"Provider enabled.",failed:"Sign-in failed. Sign in again.",cancelled:"Sign-in cancelled. Sign in again.",providerExpired:"The verification code expired. Sign in again.",timedOut:"Sign-in timed out. Sign in again.",loadFailed:"Could not load the providers.",retry:"Retry",empty:"No Pi sign-in providers are available.",answer:"Enter the requested value",secret:"Enter your API key",selection:"Choose an option",enableFailed:"Signed in, but the provider could not be enabled. Try again.",waiting:"Complete the sign-in in your browser.",readOnly:"Credentials are read-only in this environment."},dt={updateReason_storage:"profile\u5185\u306B\u66F4\u65B0\u7528\u30D5\u30A1\u30A4\u30EB\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_interrupted:"\u5C0E\u5165\u524D\u306E\u53D6\u5F97\u51E6\u7406\u304C\u4E2D\u65AD\u3055\u308C\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateTitle:"Pi\u30D7\u30E9\u30B0\u30A4\u30F3",updateIdle:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3068\u306F\u5225\u306B\u3001\u30D7\u30E9\u30B0\u30A4\u30F3\u672C\u4F53\u306E\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",updateChecking:"\u66F4\u65B0\u3092\u78BA\u8A8D\u4E2D\u2026",updateCurrent:"\u65B0\u3057\u3044\u6B63\u5F0F\u7248\u306F\u3042\u308A\u307E\u305B\u3093\u3002",updateAvailable:"\u66F4\u65B0\u304C\u3042\u308A\u307E\u3059\u3002\u4FDD\u5B58\u6E08\u307F\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateBlocked:"\u66F4\u65B0\u3092\u78BA\u8A8D\u3067\u304D\u306A\u3044\u304B\u3001\u3053\u306E\u74B0\u5883\u3067\u306F\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002",updatePreparing:"\u914D\u5E03\u7269\u3092\u53D6\u5F97\u30FB\u691C\u8A3C\u4E2D\u2026",updateInstalling:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u4E2D\u2026",updateRestart:"\u5C0E\u5165\u3057\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u4F5C\u696D\u3092\u7D42\u3048\u3066\u304B\u3089DSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u9069\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateApplied:"\u66F4\u65B0\u3057\u305F\u30D7\u30E9\u30B0\u30A4\u30F3\u304C\u52D5\u4F5C\u3057\u3066\u3044\u307E\u3059\u3002",updateFailed:"\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u5931\u6557\u6BB5\u968E\u3092\u78BA\u8A8D\u3057\u3066\u518D\u5EA6\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCancelled:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30E9\u30FC\u304C\u53D6\u6D88\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",updateOverridden:"\u4FDD\u5B58\u8A2D\u5B9A\u306B\u3088\u308A\u66F4\u65B0\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3002",updateUnknown:"\u5C0E\u5165\u7D50\u679C\u306F\u4E0D\u660E\u3067\u3059\u3002\u518D\u9001\u305B\u305A\u3001\u7D50\u679C\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCheck:"\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u66F4\u65B0\u3092\u78BA\u8A8D",updateInstall:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u66F4\u65B0\u3059\u308B",updateReconcile:"\u5C0E\u5165\u7D50\u679C\u3092\u78BA\u8A8D",updateManual:"\u914D\u5E03\u7248\u30FB\u624B\u52D5\u66F4\u65B0",updateChecked:"\u78BA\u8A8D\u6642\u523B",updateStage:"\u5C0E\u5165\u6BB5\u968E","updateReason_manager-unavailable":"plugin manager\u307E\u305F\u306F\u66F8\u304D\u8FBC\u307F\u53EF\u80FD\u306Aprofile\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u304B\u3089\u624B\u52D5\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_read-only":"\u3053\u306Eprofile\u3067\u306Fbundle\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_source:"\u3053\u306E\u5C0E\u5165\u5143\u306F\u624B\u52D5\u66F4\u65B0\u304C\u5FC5\u8981\u3067\u3059\u3002\u7248\u56FA\u5B9A\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateReason_incompatible:"\u3053\u306E\u914D\u5E03\u7248\u306F\u5B9F\u884C\u4E2D\u306EDSH\u7248\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","updateReason_compatibility-unknown":"\u914D\u5E03\u7248\u306EDSH\u4E92\u63DB\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_busy:"\u30ED\u30B0\u30A4\u30F3\u3068\u8A2D\u5B9A\u4FDD\u5B58\u3092\u5B8C\u4E86\u3057\u3066\u304B\u3089\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_network:"\u914D\u5E03\u30B5\u30FC\u30D3\u30B9\u3068\u306E\u901A\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_metadata:"\u914D\u5E03\u60C5\u5831\u304C\u4E0D\u6B63\u3067\u3059\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_asset:"\u5FC5\u8981\u306A\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u306A\u3044\u304B\u3001\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002",updateReason_channel:"\u3053\u306E\u66F4\u65B0\u6A5F\u80FD\u306F\u6B63\u5F0F\u7248\u306E\u307F\u6271\u3044\u307E\u3059\u3002",updateReason_checksum:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u306E\u30C1\u30A7\u30C3\u30AF\u30B5\u30E0\u691C\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",updateReason_redirect:"\u914D\u5E03\u53D6\u5F97\u5148\u304C\u8A31\u53EF\u3057\u3066\u3044\u306A\u3044\u30DB\u30B9\u30C8\u306B\u8EE2\u9001\u3055\u308C\u307E\u3057\u305F\u3002",updateReason_size:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u53D6\u5F97\u30B5\u30A4\u30BA\u4E0A\u9650\u3092\u8D85\u3048\u307E\u3057\u305F\u3002","updateReason_stale-candidate":"\u914D\u5E03\u60C5\u5831\u307E\u305F\u306F\u5C0E\u5165\u72B6\u614B\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_release-unavailable":"\u53D6\u5F97\u3067\u304D\u308B\u914D\u5E03\u7248\u304C\u3042\u308A\u307E\u305B\u3093\u3002",metaRateLimited:"Meta\u306E\u5951\u7D04\u78BA\u8A8D\u304C\u56DE\u6570\u5236\u9650\u306B\u9054\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",reloadModels:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0",catalogRefreshUnsupported:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306F\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u518D\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC\u3067\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u30D7\u30E9\u30B0\u30A4\u30F3\u307E\u305F\u306FSDK\u306E\u66F4\u65B0\u3067\u8FFD\u52A0\u3055\u308C\u307E\u3059\u3002",catalogRefreshFailed:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3059\u308B\u304B\u3001\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30ED\u30B0\u30A4\u30F3\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSubscriptionActive:"Muse\u5951\u7D04\u306F\u6709\u52B9\u3067\u3059",metaSubscriptionInactive:"Muse\u5951\u7D04\u306F\u7121\u52B9\u3067\u3059",metaSubscriptionUnknown:"Muse\u5951\u7D04\u306E\u6709\u52B9\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",metaReloadHint:"\u5951\u7D04\u3092\u78BA\u8A8D\u3057\u3066\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002\u751F\u6210\u3084Contributor\u5229\u7528\u67A0\u306E\u691C\u8A3C\u306F\u884C\u3044\u307E\u305B\u3093\u3002\u518D\u8D77\u52D5\u5F8C\u306F\u518D\u8AAD\u307F\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059\u3002",metaContributorHint:"Contributor\u3092\u6709\u52B9\u306B\u3059\u308B\u524D\u306B\u3001Meta\u306E\u30C7\u30FC\u30BF\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",capabilitiesUnknown:"\u80FD\u529B\u60C5\u5831\u306A\u3057\uFF1A\u30C6\u30AD\u30B9\u30C8\u306E\u307F\u3001\u63A8\u8AD6\u306F\u63A5\u7D9A\u5148\u306E\u65E2\u5B9A\u5024\u3001\u30C8\u30FC\u30AF\u30F3\u4E0A\u9650\u306F\u8A2D\u5B9A\u5024\u3092\u4F7F\u7528\u3002",metaLoginRequired:"\u5148\u306BMuse\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067Meta\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaKeyOverride:"API\u30AD\u30FC\u53C2\u7167\u304CMuse\u30ED\u30B0\u30A4\u30F3\u3088\u308A\u512A\u5148\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u300C\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046\u300D\u3092\u9078\u3076\u304B\u3001\u53C2\u7167\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSettingsIncompatible:"Muse\u5951\u7D04\u306E\u518D\u8AAD\u307F\u8FBC\u307F\u306B\u306F\u3001Meta\u306E\u6A19\u6E96\u63A5\u7D9A\u5148\u3068\u4FDD\u5B58\u6E08\u307F\u30ED\u30B0\u30A4\u30F3\u3092\u4F7F\u3044\u3001Authorization\u30D8\u30C3\u30C0\u30FC\u306E\u4E0A\u66F8\u304D\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaAccountChanged:"\u518D\u8AAD\u307F\u8FBC\u307F\u4E2D\u306BMeta\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u8AAD\u307F\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002",useLogin:"\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046",keyOverride:"\u8A2D\u5B9A\u6E08\u307F\u306EAPI\u30AD\u30FC\u53C2\u7167\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002",models:"\u30E2\u30C7\u30EB",manageModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",useProvider:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",searchModels:"\u30E2\u30C7\u30EB\u3092\u691C\u7D22",fastWarning:"Fast\u30E2\u30FC\u30C9\u306F\u901A\u5E38\u3088\u308A\u9AD8\u3044\u6599\u91D1\u30FB\u30AF\u30EC\u30B8\u30C3\u30C8\u6D88\u8CBB\u304C\u767A\u751F\u3057\u307E\u3059\u3002\u5229\u7528\u53EF\u5426\u306F\u30E2\u30C7\u30EB\u3068\u5951\u7D04\u306B\u3088\u308A\u307E\u3059\u3002",modelEnabled:"\u30E2\u30C7\u30EB\u3092\u4F7F\u3046",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",modelsFailed:"\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",noResults:"\u4E00\u81F4\u3059\u308B\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002",disabledHint:"\u30AA\u30D5\u306B\u3057\u3066\u3082\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",activateFirst:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",title:"Pi\u63A5\u7D9A",description:"\u63A5\u7D9A\u5148\u3068\u30ED\u30B0\u30A4\u30F3\u65B9\u6CD5\u3092\u9078\u3073\u307E\u3059\u3002",provider:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",method:"\u63A5\u7D9A\u65B9\u6CD5",oauth:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3",apiKey:"API\u30AD\u30FC",signIn:"\u30ED\u30B0\u30A4\u30F3",signInAgain:"\u518D\u30ED\u30B0\u30A4\u30F3",connected:"\u63A5\u7D9A\u6E08\u307F",notConnected:"\u672A\u63A5\u7D9A",busy:"\u30ED\u30B0\u30A4\u30F3\u4E2D\u2026",openBrowser:"\u30D6\u30E9\u30A6\u30B6\u3067\u7D9A\u3051\u308B",code:"\u8A8D\u8A3C\u30B3\u30FC\u30C9",copy:"\u30B3\u30FC\u30C9\u3092\u30B3\u30D4\u30FC",copied:"\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",close:"\u9589\u3058\u308B",submit:"\u7D9A\u3051\u308B",success:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F",successDescription:"\u8A8D\u8A3C\u60C5\u5831\u3092DeepSeek Harness\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",enable:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",failed:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cancelled:"\u30ED\u30B0\u30A4\u30F3\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",providerExpired:"\u8A8D\u8A3C\u30B3\u30FC\u30C9\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",timedOut:"\u30ED\u30B0\u30A4\u30F3\u306E\u5F85\u6A5F\u6642\u9593\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loadFailed:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",retry:"\u518D\u8A66\u884C",empty:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u308BPi\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093\u3002",answer:"\u8981\u6C42\u3055\u308C\u305F\u5024\u3092\u5165\u529B",secret:"API\u30AD\u30FC\u3092\u5165\u529B",selection:"\u9805\u76EE\u3092\u9078\u629E",enableFailed:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u304C\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",waiting:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044\u3002",readOnly:"\u3053\u306E\u74B0\u5883\u3067\u306F\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002"};var ct=`.dsh-pi-login { color: var(--dsw-alias-label-primary); font-family: var(--dsw-font-family); font-size: 13px; line-height: 1.6; }
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
`;var pt=`/* Button sizes share the global control-radius scale. */
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
`;var n=require("react/jsx-runtime"),ht="dsh.piLogin",Et=["slots","locale","connection"];function St(e){return(0,c.useSyncExternalStore)(o=>e.subscribe(o),()=>e.getSnapshot().revision),e.bind(ht)}function Bt(e){try{let o=new URL(e);if(o.protocol==="https:"||o.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(o.hostname))return o.href}catch{}}function Se({label:e,value:o,options:t,onChange:r,disabled:s}){let[i,p]=(0,c.useState)(!1),g=(0,c.useId)();return(0,n.jsxs)("div",{className:"dsh-pi-choice",children:[(0,n.jsx)("span",{id:g,className:"dsh-pi-caption",children:e}),(0,n.jsx)(Ae,{open:i,onClose:()=>p(!1),portal:!0,selectedId:o,items:t,onSelect:l=>{r(l),p(!1)},anchor:(0,n.jsxs)(R,{variant:"outline",disabled:s,"aria-labelledby":g,"aria-haspopup":"menu","aria-expanded":i,onClick:()=>p(!i),className:"dsh-pi-choice-button",children:[(0,n.jsx)("span",{children:t.find(l=>l.id===o)?.label}),(0,n.jsx)(We,{size:14})]})})]})}function Vt({prompt:e,ticket:o,controller:t,t:r,onFailure:s}){let[i,p]=(0,c.useState)(""),[g,l]=(0,c.useState)(!1),k=(0,c.useId)();async function v(x){x.preventDefault();let w=i;p(""),l(!0);try{await t.call("answer",{ticket:o,id:e.id,value:w})}catch{s()}finally{l(!1)}}return(0,n.jsxs)("form",{onSubmit:v,className:"dsh-pi-prompt",children:[e.kind==="select"?(0,n.jsx)(Se,{label:e.message||r("selection"),value:i,options:e.options,onChange:p,disabled:g}):(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("label",{htmlFor:k,children:e.message||r(e.kind==="secret"?"secret":"answer")}),(0,n.jsx)(he,{id:k,"data-modal-autofocus":!0,type:e.kind==="secret"?"password":"text",autoComplete:"off",spellCheck:!1,value:i,placeholder:e.placeholder,onChange:x=>p(x.target.value)})]}),(0,n.jsx)("div",{className:"dsh-pi-actions",children:(0,n.jsx)(R,{type:"submit",variant:"primary",disabled:g||e.kind==="select"&&!i,children:r("submit")})})]})}function Tt({entry:e,method:o,controller:t,t:r,onClose:s}){let i=(0,c.useRef)(),[p,g]=(0,c.useState)(),[l,k]=(0,c.useState)({status:"running"}),[v,x]=(0,c.useState)(!1),[w,M]=(0,c.useState)(!1),[_,O]=(0,c.useState)(!1),[B,S]=(0,c.useState)(!1),[E,h]=(0,c.useState)(!1),[d,b]=(0,c.useState)(!1);(0,c.useEffect)(()=>{let V=!0;return t.start(e.key,o).then(Z=>{i.current=Z,V?g(Z):t.cancel(Z).catch(()=>{})},()=>{V&&x(!0)}),()=>{V=!1,i.current&&t.cancel(i.current).catch(()=>{})}},[]),(0,c.useEffect)(()=>{if(!p)return;let V=!0,Z,ae=new AbortController;async function q(){try{let le=await t.call("state",{ticket:p},ae.signal);if(!V)return;k(le),le.status==="running"?Z=setTimeout(q,800):(t.tickets.delete(p),await t.refresh())}catch{V&&x(!0)}}return q(),()=>{V=!1,ae.abort(),clearTimeout(Z)}},[p]);let m=Bt(l.notice?.url),D=l.status!=="running"||v,X=l.reason==="provider-expired"?"providerExpired":l.reason==="timeout"?"timedOut":l.status==="cancelled"?"cancelled":"failed";async function z(V=!1){M(!0),S(!1);try{await t.call(V?"use-login":"enable",{key:e.key}),O(!0),await t.refresh()}catch(Z){S(!0),h(Z.message.endsWith("/api-key-override"))}finally{M(!1)}}return(0,n.jsxs)(ke,{open:!0,onClose:s,title:e.label,closeLabel:r("close"),className:"dsh-pi-login",footer:(0,n.jsx)(R,{variant:"outline",onClick:s,children:r(D?"close":"cancel")}),children:[v||l.status==="failed"?(0,n.jsx)("p",{role:"alert",children:r(v?"failed":X)}):null,l.status==="authorized"?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("p",{role:"status",children:r("success")}),(0,n.jsx)("p",{className:"dsh-pi-muted",children:r("successDescription")}),_?(0,n.jsx)("p",{role:"status",children:r("enabled")}):(0,n.jsx)(R,{variant:"primary",onClick:()=>{z()},disabled:w,children:r("enable")}),B?(0,n.jsx)("p",{role:"alert",children:r(E?"keyOverride":"enableFailed")}):null,E&&!_?(0,n.jsx)(R,{variant:"outline",onClick:()=>{z(!0)},disabled:w,children:r("useLogin")}):null]}):null,l.status==="cancelled"?(0,n.jsx)("p",{role:l.reason==="timeout"?"alert":"status",children:r(X)}):null,D?null:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("p",{role:"status",children:l.notice?.message||r(m?"waiting":"busy")}),m?(0,n.jsx)("a",{className:"dsh-pi-link",href:m,target:"_blank",rel:"noopener noreferrer",children:r("openBrowser")}):null,l.notice?.code?(0,n.jsxs)("div",{className:"dsh-pi-verification",children:[(0,n.jsx)("span",{className:"dsh-pi-muted",children:r("code")}),(0,n.jsxs)("div",{className:"dsh-pi-verification-row",children:[(0,n.jsx)("code",{children:l.notice.code}),(0,n.jsx)(R,{size:"sm",variant:"outline",onClick:async()=>{try{await navigator.clipboard.writeText(l.notice.code),b(!0)}catch{b(!1)}},children:r(d?"copied":"copy")})]})]}):null,l.prompt?(0,n.jsx)(Vt,{prompt:l.prompt,ticket:p,controller:t,t:r,onFailure:()=>x(!0)},l.prompt.id):null]})]})}function Zt({entry:e,controller:o,t,onClose:r}){let[s,i]=(0,c.useState)(),[p,g]=(0,c.useState)(""),[l,k]=(0,c.useState)(!1),[v,x]=(0,c.useState)(!1),[w,M]=(0,c.useState)(""),_=(0,c.useRef)(),O=(0,c.useRef)(0);(0,c.useEffect)(()=>{let d=new AbortController;return o.call("models",{key:e.key},d.signal).then(i,()=>{d.signal.aborted||x(!0)}),()=>{d.abort(),_.current?.abort(),O.current++}},[e.key]);async function B(){let d=++O.current;_.current?.abort();let b=new AbortController;_.current=b,k(!0),M(""),x(!1);try{let m=await o.call("refresh-models",{key:e.key},b.signal);!b.signal.aborted&&d===O.current&&i(m)}catch(m){if(!b.signal.aborted&&d===O.current){let D=m.message.split("/").pop();M(s?.refresh?.errors?.[D]??"catalogRefreshFailed")}}finally{!b.signal.aborted&&d===O.current&&k(!1)}}async function S(d,b){k(!0),x(!1);try{await o.call("set-model",{key:e.key,model:d,enabled:b,revision:s.revision}),i(await o.call("models",{key:e.key}))}catch{x(!0);try{i(await o.call("models",{key:e.key}))}catch{}}finally{k(!1)}}let E=p.trim().toLowerCase(),h=s?.models.filter(d=>`${d.id} ${d.name}`.toLowerCase().includes(E));return(0,n.jsxs)(ke,{open:!0,title:`${e.label} \xB7 ${t("models")}`,description:t("modelsHint"),closeLabel:t("close"),onClose:r,className:"dsh-pi-login dsh-pi-models-dialog",footer:(0,n.jsx)(R,{variant:"outline",onClick:r,children:t("close")}),children:[(0,n.jsx)(he,{icon:(0,n.jsx)(Pe,{size:16}),"aria-label":t("searchModels"),placeholder:t("searchModels"),"data-modal-autofocus":!0,value:p,onChange:d=>g(d.target.value)}),s?.refresh?.canRefresh?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(R,{variant:"outline",size:"sm",disabled:l||!e.writable,onClick:()=>{B()},children:t(l?"loading":"reloadModels")}),s.refresh.status?(0,n.jsxs)("p",{role:"status",children:[t(s.refresh.status.message),s.refresh.status.detail?` \xB7 ${s.refresh.status.detail}`:""]}):null,s.refresh.notes.map(d=>(0,n.jsx)("p",{className:"dsh-pi-muted",children:t(d)},d))]}):s?(0,n.jsx)("p",{className:"dsh-pi-muted",children:t("catalogRefreshUnsupported")}):null,w?(0,n.jsx)("p",{role:"alert",children:t(w)}):null,v?(0,n.jsx)("p",{role:"alert",children:t(s?"saveFailed":"modelsFailed")}):null,!s&&!v?(0,n.jsx)("p",{role:"status",children:t("loading")}):null,s&&!e.managed?(0,n.jsx)("p",{className:"dsh-pi-muted",children:t("activateFirst")}):null,s?.models.some(d=>d.fast)?(0,n.jsx)("p",{className:"dsh-pi-muted",children:t("fastWarning")}):null,(0,n.jsxs)("div",{className:"dsh-pi-model-list",children:[h?.map(d=>(0,n.jsxs)("div",{className:"dsh-pi-model-row",children:[(0,n.jsxs)("div",{className:"dsh-pi-model-label",children:[(0,n.jsx)("span",{children:d.name}),(0,n.jsx)("span",{className:"dsh-pi-model-id",children:d.id}),d.capabilityUnverified?(0,n.jsx)("span",{className:"dsh-pi-muted",children:t("capabilitiesUnknown")}):null]}),(0,n.jsx)(ue,{label:`${t("modelEnabled")}: ${d.name}`,checked:d.enabled,disabled:l||!e.writable||!e.managed,onChange:b=>{S(d.id,b)}})]},d.id)),h?.length===0?(0,n.jsx)("p",{className:"dsh-pi-muted",children:t("noResults")}):null]})]})}function ut({controller:e,t:o}){let t=(0,c.useSyncExternalStore)(e.subscribe,e.getSnapshot);(0,c.useEffect)(()=>{e.load()},[e]);let r=["checking","starting","preparing","installing"].includes(t.status),s={idle:"updateIdle",checking:"updateChecking",current:"updateCurrent",available:"updateAvailable",blocked:"updateBlocked",starting:"updatePreparing",preparing:"updatePreparing",installing:"updateInstalling","restart-required":"updateRestart",applied:"updateApplied",failed:"updateFailed",cancelled:"updateCancelled",overridden:"updateOverridden",unknown:"updateUnknown"};return(0,n.jsxs)("div",{className:"dsh-pi-updates",children:[(0,n.jsxs)("h4",{children:[o("updateTitle"),t.runtimeVersion?` \xB7 ${t.runtimeVersion}`:""]}),(0,n.jsx)("p",{role:["failed","blocked"].includes(t.status)?"alert":"status",children:o(s[t.status]||"updateUnknown")}),t.reason?(0,n.jsx)("p",{className:"dsh-pi-muted",children:o(`updateReason_${t.reason}`)||o("updateReason_network")}):null,t.checkedAt?(0,n.jsxs)("p",{className:"dsh-pi-muted",children:[o("updateChecked"),": ",new Date(t.checkedAt).toLocaleString()]}):null,t.candidate?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("p",{children:[t.runtimeVersion," \u2192 ",t.candidate.version," \xB7 DSH ",t.candidate.compatibility]}),(0,n.jsx)("p",{className:"dsh-pi-update-notes",children:t.candidate.notes})]}):null,(0,n.jsxs)("div",{className:"dsh-pi-actions",children:[(0,n.jsx)(R,{size:"sm",variant:"outline",disabled:r||t.status==="unknown"||t.status==="restart-required",onClick:()=>{e.check()},children:o("updateCheck")}),t.status==="available"?(0,n.jsx)(R,{size:"sm",variant:"primary",onClick:()=>{e.begin()},children:o("updateInstall")}):null,t.status==="unknown"?(0,n.jsx)(R,{size:"sm",variant:"outline",onClick:()=>{e.load()},children:o("updateReconcile")}):null,(0,n.jsx)("a",{className:"dsh-pi-link",href:"https://github.com/Aero123421/dsh-pi-login/releases",target:"_blank",rel:"noopener noreferrer",children:o("updateManual")})]}),t.result?.stage?(0,n.jsxs)("p",{className:"dsh-pi-muted",children:[o("updateStage"),": ",t.result.stage,t.result.error?.code?` \xB7 ${t.result.error.code}`:""]}):null]})}function Be({controller:e,updates:o,locale:t,provider:r}){let s=(0,c.useSyncExternalStore)(e.subscribe,e.getSnapshot),i=St(t),[p,g]=(0,c.useState)("llm-pi-ai/openai"),[l,k]=(0,c.useState)("oauth"),[v,x]=(0,c.useState)(),[w,M]=(0,c.useState)(!1),[_,O]=(0,c.useState)(!1),[B,S]=(0,c.useState)(!1);(0,c.useEffect)(()=>{e.load()},[e]);let E=r?s.entries.filter(m=>m.provider===r.provider):s.entries,h=E.find(m=>m.key===p)||E[0],d=h?.methods.find(m=>m.id===l)||h?.methods[0];async function b(m){O(!0),S(!1);try{let D=await e.call("models",{key:h.key});await e.call("set-provider",{key:h.key,enabled:m,revision:D.revision}),await e.refresh()}catch{S(!0),await e.refresh()}finally{O(!1)}}return r&&!h&&!s.error?null:(0,n.jsxs)("section",{className:`dsh-pi-login ${r?"dsh-pi-card":"dsh-pi-footer"}`,children:[r?null:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("h3",{children:i("title")}),(0,n.jsx)("p",{className:"dsh-pi-muted",children:i("description")})]}),s.error?(0,n.jsxs)("p",{role:"alert",children:[i("loadFailed")," ",(0,n.jsx)(R,{size:"sm",onClick:()=>{e.refresh()},children:i("retry")})]}):null,s.status==="ready"&&!s.error&&E.length===0&&!r?(0,n.jsx)("p",{children:i("empty")}):null,h?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{className:"dsh-pi-fields",children:[r?null:(0,n.jsx)(Se,{label:i("provider"),value:h.key,options:E.map(m=>({id:m.key,label:m.label})),onChange:g,disabled:_}),h.methods.length>1?(0,n.jsx)(Se,{label:i("method"),value:d.id,options:h.methods.map(m=>({id:m.id,label:m.id==="oauth"?i("oauth"):m.id==="api-key"?i("apiKey"):m.label})),onChange:k,disabled:_}):null]}),(0,n.jsxs)("div",{className:"dsh-pi-account-row",children:[(0,n.jsxs)("span",{className:"dsh-pi-status",children:[(0,n.jsx)(Ee,{state:h.inFlight?"ongoing":h.configured?"done":"pending",size:10}),i(h.inFlight?"busy":h.configured?"connected":"notConnected")]}),(0,n.jsx)(R,{variant:h.configured?"outline":"primary",size:"sm",disabled:h.inFlight||!h.writable||!d,onClick:()=>x({entry:h,method:d.id}),children:i(h.configured?"signInAgain":"signIn")})]}),(0,n.jsxs)("div",{className:"dsh-pi-provider-row",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{children:i("useProvider")}),(0,n.jsx)("p",{className:"dsh-pi-muted",children:i("disabledHint")})]}),(0,n.jsx)(ue,{label:`${i("useProvider")}: ${h.label}`,checked:h.enabled,disabled:_||!h.writable||!h.configured&&!h.managed,onChange:m=>{b(m)}})]}),(0,n.jsx)(R,{variant:"outline",size:"sm",disabled:_,onClick:()=>M(!0),children:i("manageModels")}),B?(0,n.jsx)("p",{role:"alert",children:i("saveFailed")}):null,h.writable?null:(0,n.jsx)("p",{className:"dsh-pi-muted",children:i("readOnly")})]}):null,!r&&o?(0,n.jsx)(ut,{controller:o,t:i}):null,v?(0,n.jsx)(Tt,{...v,controller:e,t:i,onClose:()=>x(void 0)}):null,w&&h?(0,n.jsx)(Zt,{entry:h,controller:e,t:i,onClose:()=>M(!1)}):null]})}function Ft(e){let o=new ve(e.connection),t=new be(e.connection);e.effect(()=>()=>t.dispose(),"dsh-pi-login: update requests"),e.effect(()=>()=>o.dispose(),"dsh-pi-login: UI requests"),e.effect(()=>e.locale.register(ht,{en:lt,ja:dt}),"dsh-pi-login: copy"),e.effect(()=>{let s=document.createElement("style");return s.dataset.dshPiLogin="",s.textContent=pt+ct,document.head.append(s),()=>s.remove()},"dsh-pi-login: official controls"),e.on("connection/reset",()=>{o.refresh(),t.load()});let r=()=>({controller:o,updates:t,locale:e.locale});e.slots.inject("settings.models.footer",()=>e.slots.register({name:"settings.models.footer",id:"dsh-pi-login",order:10,inject:r},Be)),e.slots.inject("settings.models.provider-card",()=>e.slots.register({name:"settings.models.provider-card",id:"dsh-pi-login",key:"dsh-pi-login",inject:r},Be))}

return module.exports;}});
