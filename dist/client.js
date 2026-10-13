window.__ModuleLoader__.load({id:"@local/dsh-pi-login",factory(require){const module={exports:{}};const exports=module.exports;
var He=Object.defineProperty;var kt=Object.getOwnPropertyDescriptor;var bt=Object.getOwnPropertyNames;var xt=Object.prototype.hasOwnProperty;var It=(e,n)=>{for(var t in n)He(e,t,{get:n[t],enumerable:!0})},Mt=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of bt(n))!xt.call(e,s)&&s!==t&&He(e,s,{get:()=>n[s],enumerable:!(r=kt(n,s))||r.enumerable});return e};var _t=e=>Mt(He({},"__esModule",{value:!0}),e);var Yt={};It(Yt,{ConnectionUI:()=>vt,UpdateUI:()=>wt,apply:()=>Qt,inject:()=>Dt});module.exports=_t(Yt);var a=require("react");var Je=require("react");function Ye(e){var n,t,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var s=e.length;for(n=0;n<s;n++)e[n]&&(t=Ye(e[n]))&&(r&&(r+=" "),r+=t)}else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function yt(){for(var e,n,t=0,r="",s=arguments.length;t<s;t++)(e=arguments[t])&&(n=Ye(e))&&(r&&(r+=" "),r+=n);return r}var N=yt;var be={button:"dshpi_13ed0003_button",md:"dshpi_13ed0003_md",sm:"dshpi_13ed0003_sm",primary:"dshpi_13ed0003_primary",ghost:"dshpi_13ed0003_ghost",outline:"dshpi_13ed0003_outline",toolbar:"dshpi_13ed0003_toolbar",icon:"dshpi_13ed0003_icon"};var Me=require("react/jsx-runtime"),M=(0,Je.forwardRef)(function({variant:n="ghost",size:t="md",icon:r,className:s,children:d,...h},m){return(0,Me.jsxs)("button",{ref:m,type:"button",className:N(be.button,be[n],be[t],s),...h,children:[r!=null&&(0,Me.jsx)("span",{className:be.icon,children:r}),d]})});var Xe=require("react");var _e={wrap:"dshpi_fda332f6_wrap",icon:"dshpi_fda332f6_icon",input:"dshpi_fda332f6_input"};var xe=require("react/jsx-runtime"),te=(0,Xe.forwardRef)(function({icon:n,className:t,...r},s){return(0,xe.jsxs)("span",{className:N(_e.wrap,t),children:[n!=null&&(0,xe.jsx)("span",{className:_e.icon,children:n}),(0,xe.jsx)("input",{ref:s,className:_e.input,...r})]})});var Ee={switch:"dshpi_7ae83aee_switch",thumb:"dshpi_7ae83aee_thumb"};var Be=require("react/jsx-runtime");function ye({checked:e,onChange:n,label:t,disabled:r=!1,title:s,className:d}){return(0,Be.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":t,title:s,disabled:r,className:N(Ee.switch,d),onClick:()=>{n(!e)},children:(0,Be.jsx)("span",{className:Ee.thumb})})}var B=require("react"),dt=require("react-dom");var Lt=require("react");var ze=require("react/jsx-runtime");var T=require("react/jsx-runtime");var Le=1;var Pt=({size:e=16,className:n,strokeWidth:t})=>(0,T.jsxs)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,T.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,T.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),Pe=e=>(0,T.jsx)(Pt,{...e,strokeWidth:Le});var Wt=({size:e=16,className:n,strokeWidth:t})=>(0,T.jsx)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,T.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),We=e=>(0,T.jsx)(Wt,{...e,strokeWidth:Le});var Ot=({size:e=14,className:n,strokeWidth:t})=>(0,T.jsx)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,T.jsx)("path",{d:"M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6",stroke:"currentColor"})}),Ve=e=>(0,T.jsx)(Ot,{...e,strokeWidth:Le});var Nt=({size:e=16,className:n,strokeWidth:t})=>(0,T.jsxs)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,T.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,T.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),et=e=>(0,T.jsx)(Nt,{...e,strokeWidth:Le});function tt(e){let n=document.documentElement,t=Number.parseFloat(getComputedStyle(n).getPropertyValue("--dsh-frame-top-clearance"));return Number.isNaN(t)?e:Math.max(e,(n.hasAttribute("data-fullscreen")?0:t)+20)}var oe=require("react"),Rt=200;function ot(e){let n=(0,oe.useRef)(null),t=(0,oe.useRef)(e);t.current=e;let r=(0,oe.useCallback)(()=>{n.current!==null&&(clearTimeout(n.current),n.current=null)},[]),s=(0,oe.useCallback)(()=>{r(),n.current=setTimeout(()=>{n.current=null,t.current()},Rt)},[r]);return(0,oe.useEffect)(()=>r,[r]),{arm:s,cancel:r}}var Re=require("react");function Oe(e){let n=!1,t=!1,r=()=>{n=!0},s=()=>{n=!1,t=!0},d=()=>{t=!1},h=()=>{n=!1,t=!1};return e.addEventListener("compositionstart",r,!0),e.addEventListener("compositionend",s,!0),e.addEventListener("keyup",d,!0),e.defaultView?.addEventListener("blur",h),{guards:m=>{let p=n||t||m.isComposing||m.keyCode===229;return t=!1,p},dispose:()=>{e.removeEventListener("compositionstart",r,!0),e.removeEventListener("compositionend",s,!0),e.removeEventListener("keyup",d,!0),e.defaultView?.removeEventListener("blur",h)}}}var Te=new WeakMap,At=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function me(e,n){Te.get(e)?.();let t=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",t),e.removeEventListener("keydown",r,!0),Te.delete(e)},r=s=>{!s.isComposing&&!s.ctrlKey&&!s.altKey&&!s.metaKey&&At.has(s.key)&&t()};Te.set(e,t),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",t),e.addEventListener("keydown",r,!0),e.focus(n),e.matches(":focus")||t()}var Ne=new WeakMap;function rt(e){if(e===null)return!1;let n=Ne.get(e.ownerDocument)?.at(-1);return n!==void 0&&!n.element.contains(e)}var nt='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function st(e,n,t){let r=(0,Re.useRef)(t);r.current=t,(0,Re.useLayoutEffect)(()=>{let s=e.current;if(!n||s===null)return;let d=s.ownerDocument,h=Oe(d),m=d.activeElement,p=Ne.get(d)??[];Ne.set(d,p);let g={element:s,close:()=>{r.current()}};p.push(g);let x=s.querySelector("[data-modal-autofocus]")??s.querySelector(nt)??s;s.contains(d.activeElement)||me(x);let w=i=>{let v=h.guards(i);if(p.at(-1)!==g||i.defaultPrevented||v||i.ctrlKey||i.altKey||i.metaKey||(i.key==="Escape"&&!i.shiftKey&&(i.preventDefault(),i.repeat||r.current()),i.key!=="Tab")||d.activeElement?.closest('[role="menu"]'))return;let k=[...s.querySelectorAll(nt)].filter(b=>!b.closest("[inert], [hidden]")),I=k[0]??s,P=k.at(-1)??s,O=i.shiftKey?d.activeElement===I:d.activeElement===P;(d.activeElement===s||!s.contains(d.activeElement)||O)&&(i.preventDefault(),(i.shiftKey?P:I).focus())};return d.addEventListener("keydown",w),()=>{h.dispose();let i=p.at(-1)===g;if(p.splice(p.indexOf(g),1),d.removeEventListener("keydown",w),p.length===0&&Ne.delete(d),i){let v=m instanceof HTMLElement&&m.isConnected?m:p.at(-1)?.element;v!==void 0&&me(v)}}},[e,n])}var fe={keys:"dshpi_042ff8c4_keys",key:"dshpi_042ff8c4_key",tooltip:"dshpi_042ff8c4_tooltip",separator:"dshpi_042ff8c4_separator",joined:"dshpi_042ff8c4_joined"};var De=require("react/jsx-runtime");function Fe({keys:e,variant:n="plain",className:t}){return(0,De.jsx)("span",{className:N(fe.keys,n==="tooltip"&&fe.tooltip,n==="tooltip"&&e.includes("+")&&fe.joined,t),children:e.map((r,s)=>(0,De.jsx)("kbd",{className:r==="+"?fe.separator:fe.key,children:r},s))})}var re=require("react"),it=require("react-dom");var Ce={surface:"dshpi_a00a35bd_surface",backing:"dshpi_a00a35bd_backing",compact:"dshpi_a00a35bd_compact",material:"dshpi_a00a35bd_material"};var ne=require("react/jsx-runtime"),Ze=(0,re.forwardRef)(function({compact:n=!1,className:t,style:r,children:s,...d},h){let m=(0,re.useId)(),p=(0,re.useRef)(null);(0,re.useLayoutEffect)(()=>{document.body.appendChild(p.current)},[]);let g={"--dsh-menu-anchor":`--dsh-menu-${m.replaceAll(":","")}`};return(0,ne.jsxs)(ne.Fragment,{children:[(0,ne.jsxs)("div",{...d,ref:h,"data-menu-material":"translucent",className:N(Ce.surface,n&&Ce.compact,t),style:{...r,...g},children:[(0,ne.jsx)("div",{"aria-hidden":"true",className:Ce.material}),s]}),(0,it.createPortal)((0,ne.jsx)("div",{ref:p,"aria-hidden":"true","data-menu-backing":"",className:N(Ce.backing,n&&Ce.compact),style:{...g,visibility:r?.visibility}}),document.body)]})});var L={root:"dshpi_1911279a_root",list:"dshpi_1911279a_list",submenu:"dshpi_1911279a_submenu",scrollable:"dshpi_1911279a_scrollable",viewport:"dshpi_1911279a_viewport",css:"dshpi_1911279a_css",portal:"dshpi_1911279a_portal",sideTop:"dshpi_1911279a_sideTop",alignEnd:"dshpi_1911279a_alignEnd",tsx:"dshpi_1911279a_tsx",footer:"dshpi_1911279a_footer",separator:"dshpi_1911279a_separator",itemWrap:"dshpi_1911279a_itemWrap",item:"dshpi_1911279a_item",denseList:"dshpi_1911279a_denseList",label:"dshpi_1911279a_label",compactList:"dshpi_1911279a_compactList",itemIcon:"dshpi_1911279a_itemIcon",check:"dshpi_1911279a_check",itemLabel:"dshpi_1911279a_itemLabel",shortcut:"dshpi_1911279a_shortcut",shortcutKeys:"dshpi_1911279a_shortcutKeys",selected:"dshpi_1911279a_selected",selectedFill:"dshpi_1911279a_selectedFill",danger:"dshpi_1911279a_danger"};var R=require("react/jsx-runtime");function at(e){return"type"in e&&e.type==="separator"}function lt(e){return"type"in e&&e.type==="label"}var St={visibility:"hidden",left:0,top:0};function Ue({open:e,anchor:n,items:t=[],children:r,selectedId:s,selectedIds:d,onSelect:h,onClose:m,align:p="start",side:g="bottom",portal:x=!1,closeOnPointerLeave:w=!1,dense:i=!1,compact:v=!1,autoFocus:k=!1,selection:I="check",getAnchorRect:P,footer:O,className:b,listClassName:H}){let f=(0,B.useRef)(null),u=(0,B.useRef)(null),W=(0,B.useRef)(null),E=(0,B.useRef)(null),C=(0,B.useRef)(!1),K=(c=!1)=>{let l=E.current,F=l!==null&&document.contains(l)&&!l.disabled?l:f.current?.querySelector("button:not(:disabled)");F!=null&&(c?F.focus():me(F))},V=()=>{let c=C.current;queueMicrotask(()=>{if(y.current)return;let l=document.activeElement;(l===null||l===document.body||u.current?.contains(l)===!0)&&K(c)})},y=(0,B.useRef)(e);y.current=e;let[J,$]=(0,B.useState)(null),[j,ie]=(0,B.useState)(null),{arm:pe,cancel:z}=ot(m);(0,B.useLayoutEffect)(()=>{if(!e||!x){ie(null);return}let c=()=>{let S;if(P!==void 0?S=P():S=f.current?.getBoundingClientRect()??null,S===null)return;let A=12,ue=window.innerWidth,_=window.innerHeight,X=u.current,he=X?.offsetWidth??0,ee=X?.offsetHeight??0,Y,Z;g==="right"?(Y=S.right+4,Z=S.top):p==="start"?(Y=S.left,Z=g==="bottom"?S.bottom+4:S.top-ee-4):(Y=S.right-he,Z=g==="bottom"?S.bottom+4:S.top-ee-4),he>0&&(Y=Math.min(Math.max(Y,A),ue-he-A)),ee>0&&(Z=Math.min(Math.max(Z,tt(A)),_-ee-A)),ie(ge=>ge?.left===Y&&ge.top===Z?ge:{left:Y,top:Z})};c();let l=()=>{c(),F=requestAnimationFrame(l)},F=requestAnimationFrame(l);return window.addEventListener("scroll",c,!0),window.addEventListener("resize",c),()=>{cancelAnimationFrame(F),window.removeEventListener("scroll",c,!0),window.removeEventListener("resize",c)}},[e,x,p,g,P]),(0,B.useEffect)(()=>{if(!e){E.current=null;return}let c=document.activeElement;E.current=c instanceof HTMLElement&&f.current?.contains(c)===!0?c:null},[e]),(0,B.useEffect)(()=>{if(!e||!k)return;let c=u.current?.querySelector("button:not(:disabled)");W.current=c==null?null:0,c!=null&&me(c)},[e,k]),(0,B.useEffect)(()=>{if(!e){$(null),W.current=null;return}let c=Oe(document),l=_=>{_.target instanceof Node&&f.current?.contains(_.target)!==!0&&u.current?.contains(_.target)!==!0&&m()},F=_=>{if(c.guards(_)||rt(f.current)||_.defaultPrevented||_.ctrlKey||_.altKey||_.metaKey)return;let X=document.activeElement,he=u.current?.contains(X)===!0,ee=f.current?.contains(X)===!0||he;if(_.key==="Escape"&&!_.shiftKey){if(_.preventDefault(),_.repeat)return;m(),(ee||k)&&K()}if(_.key==="Tab"){let Ge=u.current;if(Ge===null||!ee)return;if(_.shiftKey){_.preventDefault(),m(),K(!0);return}if(he){if(X instanceof Element&&X.getAttribute("role")==="menuitem"){_.preventDefault(),C.current=!0;try{X.click()}finally{C.current=!1}}return}let Qe=Ge.querySelector("button:not(:disabled)");if(Qe===null)return;_.preventDefault(),Qe.focus(),W.current=0;return}if(!["ArrowDown","ArrowUp","Home","End"].includes(_.key))return;let Y=u.current;if(Y===null||!ee)return;let Z=Array.from(Y.querySelectorAll("button:not(:disabled)"));if(Z.length===0)return;let ge=Z.indexOf(X),Ke=ge>=0?ge:W.current,je=_.key==="Home"?0:_.key==="End"?Z.length-1:Ke===null?_.key==="ArrowDown"?0:Z.length-1:(Ke+(_.key==="ArrowDown"?1:-1)+Z.length)%Z.length;_.preventDefault(),W.current=je,Z[je]?.focus()},S=()=>{document.activeElement instanceof HTMLIFrameElement&&m()};document.addEventListener("pointerdown",l);let A=_=>{_.key==="Escape"&&F(_)},ue=_=>{_.key!=="Escape"&&F(_)};return document.addEventListener("keydown",ue),document.addEventListener("keydown",A,!0),window.addEventListener("blur",S),()=>{c.dispose(),document.removeEventListener("pointerdown",l),document.removeEventListener("keydown",ue),document.removeEventListener("keydown",A,!0),window.removeEventListener("blur",S)}},[e,m,k]),(0,B.useEffect)(()=>{e||z()},[e,z]);let ve=!t.some(c=>!at(c)&&!lt(c)&&c.submenu!==void 0&&c.submenu.length>0),U=c=>{if(at(c))return(0,R.jsx)("div",{className:L.separator,role:"separator"},c.id);if(lt(c))return(0,R.jsx)("div",{className:L.label,role:"presentation",children:c.text},c.id);let l=c.submenu!==void 0&&c.submenu.length>0,F=l&&J===c.id,S=c.id===s||d?.includes(c.id)===!0;return(0,R.jsxs)("div",{className:L.itemWrap,onMouseEnter:l?()=>{$(c.id)}:void 0,onMouseLeave:()=>{$(null)},children:[(0,R.jsxs)("button",{type:"button",role:"menuitem",className:N(L.item,S&&(I==="fill"?L.selectedFill:L.selected),c.danger===!0&&L.danger),disabled:c.disabled,"aria-keyshortcuts":c.shortcut?.aria,"aria-haspopup":l?"menu":void 0,"aria-expanded":l?F:void 0,onFocus:l?()=>{$(c.id)}:void 0,onClick:()=>{if(l){$(c.id);return}h?.(c.id)},children:[c.icon!==void 0&&(0,R.jsx)("span",{className:L.itemIcon,children:c.icon}),(0,R.jsx)("span",{className:L.itemLabel,children:c.label}),c.shortcut!==void 0&&(0,R.jsx)("span",{"aria-hidden":"true",className:L.shortcut,children:(0,R.jsx)(Fe,{keys:c.shortcut.keys,className:L.shortcutKeys})}),S&&I==="check"&&(0,R.jsx)(We,{className:L.check})]}),F&&c.submenu!==void 0&&(0,R.jsx)(Ze,{compact:v,className:N(L.submenu,v&&L.compactList),role:"menu",children:c.submenu.map(A=>(0,R.jsxs)("button",{type:"button",role:"menuitem",className:L.item,disabled:A.disabled,"aria-keyshortcuts":A.shortcut?.aria,onClick:()=>{h?.(A.id),V()},children:[A.icon!==void 0&&(0,R.jsx)("span",{className:L.itemIcon,children:A.icon}),(0,R.jsx)("span",{className:L.itemLabel,children:A.label}),A.shortcut!==void 0&&(0,R.jsx)("span",{"aria-hidden":"true",className:L.shortcut,children:(0,R.jsx)(Fe,{keys:A.shortcut.keys,className:L.shortcutKeys})})]},A.id))})]},c.id)},ae=c=>{let l=c.target instanceof Element?c.target.closest('button[role="menuitem"]'):null;l===null||l.getAttribute("aria-haspopup")==="menu"||l.closest('[role="menu"]')===c.currentTarget&&$(null)},ke=e&&(0,R.jsxs)(Ze,{compact:v,ref:u,className:N(L.list,H,i&&L.denseList,v&&L.compactList,ve&&L.scrollable,x&&L.portal,g==="top"&&!x&&L.sideTop,p==="end"&&!x&&L.alignEnd),style:x?j??St:void 0,role:"menu",onClick:c=>{c.stopPropagation();let l=c.target instanceof Element?c.target.closest('button[role="menuitem"]'):null;l!==null&&l.getAttribute("aria-haspopup")!=="menu"&&V()},onMouseOver:ae,onFocus:ae,children:[(0,R.jsxs)("div",{className:L.viewport,role:"presentation",children:[t.map(U),r]}),O!==void 0&&O.length>0&&(0,R.jsx)("div",{className:L.footer,role:"presentation",children:O.map(U)})]});return(0,R.jsxs)("span",{ref:f,className:N(L.root,b),onPointerEnter:w?z:void 0,onPointerLeave:w?()=>{e&&pe()}:void 0,children:[n,x?ke!==!1&&(0,dt.createPortal)(ke,document.body):ke]})}var ct=require("react"),pt=require("react-dom");var G={root:"dshpi_b97756f9_root",mask:"dshpi_b97756f9_mask",dialog:"dshpi_b97756f9_dialog",content:"dshpi_b97756f9_content",header:"dshpi_b97756f9_header",title:"dshpi_b97756f9_title",close:"dshpi_b97756f9_close",description:"dshpi_b97756f9_description",body:"dshpi_b97756f9_body",footer:"dshpi_b97756f9_footer"};var D=require("react/jsx-runtime");function le({open:e,onClose:n,title:t,closeLabel:r,description:s,children:d,footer:h,className:m,contentClassName:p,onKeyDownCapture:g,headless:x=!1,backdropBlur:w=!0,shortcutModal:i}){let v=(0,ct.useRef)(null);return st(v,e,n),e?(0,pt.createPortal)((0,D.jsxs)("div",{className:G.root,role:"presentation",onKeyDownCapture:g,children:[(0,D.jsx)("div",{className:G.mask,style:w?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:n}),(0,D.jsx)("div",{ref:v,tabIndex:-1,"data-shortcut-modal":i,className:N(G.dialog,m),role:"dialog","aria-modal":"true","aria-label":t,children:x?d:(0,D.jsxs)(D.Fragment,{children:[(0,D.jsxs)("div",{className:N(G.content,p),children:[(0,D.jsxs)("div",{className:G.header,children:[(0,D.jsx)("h2",{className:G.title,children:t}),(0,D.jsx)("button",{type:"button",className:G.close,"aria-label":r,onClick:n,children:(0,D.jsx)(et,{size:14})})]}),s!==void 0&&s!==""&&(0,D.jsx)("p",{className:G.description,children:s}),d!==void 0&&(0,D.jsx)("div",{className:G.body,children:d})]}),h!==void 0&&(0,D.jsx)("div",{className:G.footer,children:h})]})})]}),document.body):null}var de={dot:"dshpi_34138a6f_dot",spinner:"dshpi_34138a6f_spinner",spinnerMotion:"dshpi_34138a6f_spinnerMotion",spinnerTrack:"dshpi_34138a6f_spinnerTrack",spinnerArc:"dshpi_34138a6f_spinnerArc",step:"dshpi_34138a6f_step"};var se=require("react/jsx-runtime");function Ht(e){e!==null&&(ut(e),e.addEventListener("animationstart",()=>{ut(e)}))}function ut(e){let n=e;for(let t of n.getAnimations?.({subtree:!0})??[])t.startTime=0}function qe({state:e,size:n,className:t,appearance:r="dot"}){let s=n??(e==="ongoing"?14:10);return e==="ongoing"?(0,se.jsx)("svg",{ref:Ht,className:N(de.spinner,t),"data-state":"ongoing",width:s,height:s,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,se.jsxs)("g",{className:de.spinnerMotion,children:[(0,se.jsx)("circle",{className:de.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,se.jsx)("circle",{className:de.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,se.jsx)("span",{className:N(r==="step"?de.step:de.dot,t),"data-state":e,style:{width:s,height:s},"aria-hidden":"true",children:r==="step"&&e==="done"&&(0,se.jsx)(We,{size:s-2})})}var Et=Object.freeze({status:"idle",entries:[],integrations:[],services:[],error:!1}),Ae=class{constructor(n){this.connection=n,this.state=Et,this.listeners=new Set,this.pending=void 0,this.closed=!1,this.tickets=new Set}getSnapshot=()=>this.state;subscribe=n=>(this.listeners.add(n),()=>this.listeners.delete(n));publish(n){if(!this.closed){this.state=n;for(let t of this.listeners)t()}}async call(n,t={},r){let s=await this.connection.rpc.call("/api",`dsh-pi-login/${n}`,t,r);if(!s.ok)throw new Error(s.error.code);return s.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let n={abort:new AbortController};return n.promise=this.call("connection-list",{},n.abort.signal).then(t=>{this.pending===n&&this.publish({status:"ready",...t,entries:t.connections??[],error:!1})},()=>{this.pending===n&&this.publish({...this.state,status:"ready",error:!0})}).finally(()=>{this.pending===n&&(this.pending=void 0)}),this.pending=n,this.publish({...this.state,status:"loading",error:!1}),n.promise}refresh(){let n=this.pending;return this.pending=void 0,n?.abort.abort(),this.load()}mutation(n,t={},r){let{profileKey:s,generation:d}=this.state;return this.call(n,{...t,profileKey:s,generation:d},r)}async start(n,t){let r=await this.mutation("start",{connectionId:n,method:t});if(typeof r.ticket!="string")throw new Error("invalid ticket");if(this.closed)throw await this.mutation("cancel",r),new Error("disposed");return this.tickets.add(r.ticket),r.ticket}async cancel(n){this.tickets.delete(n);try{await this.mutation("cancel",{ticket:n})}finally{await this.refresh()}}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear();for(let n of this.tickets)this.mutation("cancel",{ticket:n}).catch(()=>{});this.tickets.clear()}};var Bt="dsh-pi-login:update",Se=class{constructor(n,t){if(t===void 0)try{t=globalThis.sessionStorage}catch{}this.connection=n,this.storage=t,this.listeners=new Set,this.state={status:"blocked",reason:"manager-unavailable"},this.generation=0,this.closed=!1,this.timer=null,this.profileKey=void 0,this.requestId=void 0}getSnapshot=()=>this.state;subscribe=n=>(this.listeners.add(n),()=>this.listeners.delete(n));storageKey(){return this.profileKey?`${Bt}:${this.profileKey}`:void 0}selectProfile(n){let t=typeof n=="string"&&/^[a-f0-9]{64}$/.test(n)?n:void 0;if(t!==this.profileKey&&(this.profileKey=t,this.requestId=void 0,t))try{this.requestId=this.storage?.getItem(this.storageKey())||void 0}catch{}}publish(n){if(!this.closed){n.profileKey&&this.selectProfile(n.profileKey),this.state=n;for(let t of this.listeners)t()}}async call(n,t={}){if(!this.connection)return{status:"blocked",reason:"manager-unavailable"};let r=await this.connection.rpc.call("/api",`dsh-pi-login/update-${n}`,t);if(!r.ok){let s=new Error(r.error.code);throw s.rejected=!0,s}return r.value}async load(){if(this.closed)return;let n=++this.generation;clearTimeout(this.timer);try{let t=await this.call("status");if(this.closed||n!==this.generation)return;this.selectProfile(t.profileKey),t.requestId&&(this.requestId=t.requestId);let r=this.requestId?await this.call("reconcile",{requestId:this.requestId,profileKey:this.profileKey}):t;if(this.closed||n!==this.generation)return;if(r.requestId){this.requestId=r.requestId;try{this.storage?.setItem(this.storageKey(),r.requestId)}catch{}}this.publish(r),["preparing","installing"].includes(r.status)&&(this.timer=setTimeout(()=>{this.load()},800))}catch{n===this.generation&&this.publish({...this.state,status:this.requestId?"unknown":"blocked",reason:"network"})}}async check(){if(this.closed||["checking","preparing","installing","starting","unknown"].includes(this.state.status))return;let n=++this.generation;this.publish({...this.state,status:"checking"});try{let t=await this.call("check");n===this.generation&&this.publish(t)}catch{n===this.generation&&this.publish({...this.state,status:"blocked",reason:"network"})}}async begin(){if(this.closed||!this.profileKey||this.state.status!=="available")return;let n=this.state.candidate,t=++this.generation;this.requestId=crypto.randomUUID();try{this.storage?.setItem(this.storageKey(),this.requestId)}catch{}this.publish({...this.state,status:"starting"});try{let r=await this.call("begin",{candidateId:n.id,requestId:this.requestId,profileKey:this.profileKey});if(this.closed||t!==this.generation)return;if(typeof r.requestId!="string")throw new Error("invalid request");this.requestId=r.requestId;try{this.storage?.setItem(this.storageKey(),r.requestId)}catch{}t===this.generation&&(this.publish({...this.state,...r}),await this.load())}catch(r){if(this.closed||t!==this.generation)return;if(r.rejected){this.requestId=void 0;try{this.storage?.removeItem(this.storageKey())}catch{}}t===this.generation&&this.publish({...this.state,status:r.rejected?"failed":"unknown",reason:r.message.endsWith("/busy")?"busy":r.message.endsWith("/profile")?"profile":"network"})}}dispose(){this.closed=!0,this.generation++,clearTimeout(this.timer),this.listeners.clear()}};var q={updateReason_storage:"Could not write the update files to the profile.",updateReason_interrupted:"The download was interrupted before installation. Check again.",updateTitle:"Pi plugin",updateIdle:"Check for a plugin release separately from the model catalog.",updateChecking:"Checking for updates\u2026",updateCurrent:"No newer stable release.",updateAvailable:"A plugin update is available. Your saved credentials and model choices are kept.",updateBlocked:"The update could not be checked or is unavailable.",updatePreparing:"Downloading and verifying the release\u2026",updateInstalling:"Installing the plugin\u2026",updateRestart:"Installed. Restart DSH when your current work is finished to apply the update.",updateApplied:"The updated plugin version is running.",updateFailed:"Update failed. Review the stage below and check again.",updateCancelled:"The installer confirmed cancellation.",updateOverridden:"Saved settings prevent the update from applying.",updateUnknown:"The installation result is unknown. Reconcile the operation before starting another update.",updateCheck:"Check plugin update",updateInstall:"Update plugin",updateReconcile:"Check installation result",updateManual:"Releases / manual update",updateChecked:"Last checked",updateStage:"Installer stage","updateReason_manager-unavailable":"Plugin manager or writable profile is unavailable. Use the Releases page.","updateReason_read-only":"This bundle is not writable in the active profile.",updateReason_source:"This installation source requires a manual update. Its version pin will be preserved.",updateReason_incompatible:"The release does not support this DSH version.","updateReason_compatibility-unknown":"The release compatibility could not be confirmed.",updateReason_busy:"Finish sign-in and settings saves before updating.",updateReason_profile:"The connected profile changed. Check again.",updateReason_network:"Could not contact the release service. Try again later.",updateReason_metadata:"Release metadata is invalid. Use the release link to review it.",updateReason_asset:"The required release assets are missing or ambiguous.",updateReason_channel:"This update accepts stable releases only.",updateReason_checksum:"Release checksum verification failed.",updateReason_redirect:"The release redirected to an unapproved host.",updateReason_size:"The release exceeded its download size limit.","updateReason_stale-candidate":"The release or installation changed. Check again.","updateReason_release-unavailable":"The release service returned no accessible release.",metaRateLimited:"Meta limited the account check. Wait before trying again.",reloadModels:"Update model list",catalogRefreshUnsupported:"Model list refresh is not supported for this provider yet. Update the plugin or SDK to get new models.",catalogRefreshFailed:"Could not update the model list. Try again or sign in again if needed.",metaSubscriptionActive:"Muse subscription active",metaSubscriptionInactive:"Muse subscription inactive",metaSubscriptionUnknown:"Muse subscription could not be confirmed",metaReloadHint:"Checks your Muse subscription and fetches its model list. New models start off. This does not test generation or Contributor billing. Reload again after restarting.",metaContributorHint:"Review Meta\u2019s Contributor data-use terms before enabling a Contributor model.",capabilitiesUnknown:"Capabilities not supplied: text only, provider-default reasoning, configured token limits.",metaLoginRequired:"Sign in to Meta with your Muse account first.",metaKeyOverride:"An API-key reference overrides your Muse login. Choose \u201CUse saved credentials\u201D or remove that reference first.",metaSettingsIncompatible:"Muse account reload requires the default Meta endpoint and saved login, without an Authorization header override.",metaAccountChanged:"Your Meta account changed during reload. Reload again.",useLogin:"Use saved credentials",keyOverride:"The configured API-key reference takes priority.",models:"Models",manageModels:"Choose models",useProvider:"Use this provider",searchModels:"Search models",fastWarning:"Fast mode uses paid priority processing or additional subscription credits. Availability depends on your account and model.",modelEnabled:"Use model",loading:"Loading\u2026",modelsFailed:"Could not load the models.",saveFailed:"Could not save settings. Try again.",modelsHint:"When the provider is on, selected models are available to chats and agents.",noResults:"No matching models.",disabledHint:"Turning this off keeps your credentials and model choices.",activateFirst:"Enable the provider before choosing models.",title:"Pi connections",description:"Choose a provider and sign-in method.",provider:"Provider",method:"Sign-in method",oauth:"Browser sign-in",apiKey:"API key",signIn:"Sign in",signInAgain:"Sign in again",connected:"Connected",notConnected:"Not connected",busy:"Signing in\u2026",openBrowser:"Continue in browser",code:"Verification code",copy:"Copy code",copied:"Copied",cancel:"Cancel",close:"Close",submit:"Continue",success:"Signed in",successDescription:"Your credentials are saved in DeepSeek Harness.",enable:"Enable provider",enabled:"Provider enabled.",failed:"Sign-in failed. Sign in again.",cancelled:"Sign-in cancelled. Sign in again.",providerExpired:"The verification code expired. Sign in again.",timedOut:"Sign-in timed out. Sign in again.",loadFailed:"Could not load the providers.",retry:"Retry",empty:"No Pi sign-in providers are available.",answer:"Enter the requested value",secret:"Enter your API key",selection:"Choose an option",enableFailed:"Signed in, but the provider could not be enabled. Try again.",waiting:"Complete the sign-in in your browser.",readOnly:"Credentials are read-only in this environment."},Q={updateReason_storage:"profile\u5185\u306B\u66F4\u65B0\u7528\u30D5\u30A1\u30A4\u30EB\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_interrupted:"\u5C0E\u5165\u524D\u306E\u53D6\u5F97\u51E6\u7406\u304C\u4E2D\u65AD\u3055\u308C\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateTitle:"Pi\u30D7\u30E9\u30B0\u30A4\u30F3",updateIdle:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3068\u306F\u5225\u306B\u3001\u30D7\u30E9\u30B0\u30A4\u30F3\u672C\u4F53\u306E\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",updateChecking:"\u66F4\u65B0\u3092\u78BA\u8A8D\u4E2D\u2026",updateCurrent:"\u65B0\u3057\u3044\u6B63\u5F0F\u7248\u306F\u3042\u308A\u307E\u305B\u3093\u3002",updateAvailable:"\u66F4\u65B0\u304C\u3042\u308A\u307E\u3059\u3002\u4FDD\u5B58\u6E08\u307F\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateBlocked:"\u66F4\u65B0\u3092\u78BA\u8A8D\u3067\u304D\u306A\u3044\u304B\u3001\u3053\u306E\u74B0\u5883\u3067\u306F\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002",updatePreparing:"\u914D\u5E03\u7269\u3092\u53D6\u5F97\u30FB\u691C\u8A3C\u4E2D\u2026",updateInstalling:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u4E2D\u2026",updateRestart:"\u5C0E\u5165\u3057\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u4F5C\u696D\u3092\u7D42\u3048\u3066\u304B\u3089DSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u9069\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateApplied:"\u66F4\u65B0\u3057\u305F\u30D7\u30E9\u30B0\u30A4\u30F3\u304C\u52D5\u4F5C\u3057\u3066\u3044\u307E\u3059\u3002",updateFailed:"\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u5931\u6557\u6BB5\u968E\u3092\u78BA\u8A8D\u3057\u3066\u518D\u5EA6\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCancelled:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30E9\u30FC\u304C\u53D6\u6D88\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",updateOverridden:"\u4FDD\u5B58\u8A2D\u5B9A\u306B\u3088\u308A\u66F4\u65B0\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3002",updateUnknown:"\u5C0E\u5165\u7D50\u679C\u306F\u4E0D\u660E\u3067\u3059\u3002\u518D\u9001\u305B\u305A\u3001\u7D50\u679C\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCheck:"\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u66F4\u65B0\u3092\u78BA\u8A8D",updateInstall:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u66F4\u65B0\u3059\u308B",updateReconcile:"\u5C0E\u5165\u7D50\u679C\u3092\u78BA\u8A8D",updateManual:"\u914D\u5E03\u7248\u30FB\u624B\u52D5\u66F4\u65B0",updateChecked:"\u78BA\u8A8D\u6642\u523B",updateStage:"\u5C0E\u5165\u6BB5\u968E","updateReason_manager-unavailable":"plugin manager\u307E\u305F\u306F\u66F8\u304D\u8FBC\u307F\u53EF\u80FD\u306Aprofile\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u304B\u3089\u624B\u52D5\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_read-only":"\u3053\u306Eprofile\u3067\u306Fbundle\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_source:"\u3053\u306E\u5C0E\u5165\u5143\u306F\u624B\u52D5\u66F4\u65B0\u304C\u5FC5\u8981\u3067\u3059\u3002\u7248\u56FA\u5B9A\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateReason_incompatible:"\u3053\u306E\u914D\u5E03\u7248\u306F\u5B9F\u884C\u4E2D\u306EDSH\u7248\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","updateReason_compatibility-unknown":"\u914D\u5E03\u7248\u306EDSH\u4E92\u63DB\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_busy:"\u30ED\u30B0\u30A4\u30F3\u3068\u8A2D\u5B9A\u4FDD\u5B58\u3092\u5B8C\u4E86\u3057\u3066\u304B\u3089\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_profile:"\u63A5\u7D9A\u4E2D\u306E\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_network:"\u914D\u5E03\u30B5\u30FC\u30D3\u30B9\u3068\u306E\u901A\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_metadata:"\u914D\u5E03\u60C5\u5831\u304C\u4E0D\u6B63\u3067\u3059\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_asset:"\u5FC5\u8981\u306A\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u306A\u3044\u304B\u3001\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002",updateReason_channel:"\u3053\u306E\u66F4\u65B0\u6A5F\u80FD\u306F\u6B63\u5F0F\u7248\u306E\u307F\u6271\u3044\u307E\u3059\u3002",updateReason_checksum:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u306E\u30C1\u30A7\u30C3\u30AF\u30B5\u30E0\u691C\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",updateReason_redirect:"\u914D\u5E03\u53D6\u5F97\u5148\u304C\u8A31\u53EF\u3057\u3066\u3044\u306A\u3044\u30DB\u30B9\u30C8\u306B\u8EE2\u9001\u3055\u308C\u307E\u3057\u305F\u3002",updateReason_size:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u53D6\u5F97\u30B5\u30A4\u30BA\u4E0A\u9650\u3092\u8D85\u3048\u307E\u3057\u305F\u3002","updateReason_stale-candidate":"\u914D\u5E03\u60C5\u5831\u307E\u305F\u306F\u5C0E\u5165\u72B6\u614B\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_release-unavailable":"\u53D6\u5F97\u3067\u304D\u308B\u914D\u5E03\u7248\u304C\u3042\u308A\u307E\u305B\u3093\u3002",metaRateLimited:"Meta\u306E\u5951\u7D04\u78BA\u8A8D\u304C\u56DE\u6570\u5236\u9650\u306B\u9054\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",reloadModels:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0",catalogRefreshUnsupported:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306F\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u518D\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC\u3067\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u30D7\u30E9\u30B0\u30A4\u30F3\u307E\u305F\u306FSDK\u306E\u66F4\u65B0\u3067\u8FFD\u52A0\u3055\u308C\u307E\u3059\u3002",catalogRefreshFailed:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3059\u308B\u304B\u3001\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30ED\u30B0\u30A4\u30F3\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSubscriptionActive:"Muse\u5951\u7D04\u306F\u6709\u52B9\u3067\u3059",metaSubscriptionInactive:"Muse\u5951\u7D04\u306F\u7121\u52B9\u3067\u3059",metaSubscriptionUnknown:"Muse\u5951\u7D04\u306E\u6709\u52B9\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",metaReloadHint:"\u5951\u7D04\u3092\u78BA\u8A8D\u3057\u3066\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002\u751F\u6210\u3084Contributor\u5229\u7528\u67A0\u306E\u691C\u8A3C\u306F\u884C\u3044\u307E\u305B\u3093\u3002\u518D\u8D77\u52D5\u5F8C\u306F\u518D\u8AAD\u307F\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059\u3002",metaContributorHint:"Contributor\u3092\u6709\u52B9\u306B\u3059\u308B\u524D\u306B\u3001Meta\u306E\u30C7\u30FC\u30BF\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",capabilitiesUnknown:"\u80FD\u529B\u60C5\u5831\u306A\u3057\uFF1A\u30C6\u30AD\u30B9\u30C8\u306E\u307F\u3001\u63A8\u8AD6\u306F\u63A5\u7D9A\u5148\u306E\u65E2\u5B9A\u5024\u3001\u30C8\u30FC\u30AF\u30F3\u4E0A\u9650\u306F\u8A2D\u5B9A\u5024\u3092\u4F7F\u7528\u3002",metaLoginRequired:"\u5148\u306BMuse\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067Meta\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaKeyOverride:"API\u30AD\u30FC\u53C2\u7167\u304CMuse\u30ED\u30B0\u30A4\u30F3\u3088\u308A\u512A\u5148\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u300C\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046\u300D\u3092\u9078\u3076\u304B\u3001\u53C2\u7167\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSettingsIncompatible:"Muse\u5951\u7D04\u306E\u518D\u8AAD\u307F\u8FBC\u307F\u306B\u306F\u3001Meta\u306E\u6A19\u6E96\u63A5\u7D9A\u5148\u3068\u4FDD\u5B58\u6E08\u307F\u30ED\u30B0\u30A4\u30F3\u3092\u4F7F\u3044\u3001Authorization\u30D8\u30C3\u30C0\u30FC\u306E\u4E0A\u66F8\u304D\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaAccountChanged:"\u518D\u8AAD\u307F\u8FBC\u307F\u4E2D\u306BMeta\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u8AAD\u307F\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002",useLogin:"\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046",keyOverride:"\u8A2D\u5B9A\u6E08\u307F\u306EAPI\u30AD\u30FC\u53C2\u7167\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002",models:"\u30E2\u30C7\u30EB",manageModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",useProvider:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",searchModels:"\u30E2\u30C7\u30EB\u3092\u691C\u7D22",fastWarning:"Fast\u30E2\u30FC\u30C9\u306F\u901A\u5E38\u3088\u308A\u9AD8\u3044\u6599\u91D1\u30FB\u30AF\u30EC\u30B8\u30C3\u30C8\u6D88\u8CBB\u304C\u767A\u751F\u3057\u307E\u3059\u3002\u5229\u7528\u53EF\u5426\u306F\u30E2\u30C7\u30EB\u3068\u5951\u7D04\u306B\u3088\u308A\u307E\u3059\u3002",modelEnabled:"\u30E2\u30C7\u30EB\u3092\u4F7F\u3046",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",modelsFailed:"\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",noResults:"\u4E00\u81F4\u3059\u308B\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002",disabledHint:"\u30AA\u30D5\u306B\u3057\u3066\u3082\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",activateFirst:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",title:"Pi\u63A5\u7D9A",description:"\u63A5\u7D9A\u5148\u3068\u30ED\u30B0\u30A4\u30F3\u65B9\u6CD5\u3092\u9078\u3073\u307E\u3059\u3002",provider:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",method:"\u63A5\u7D9A\u65B9\u6CD5",oauth:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3",apiKey:"API\u30AD\u30FC",signIn:"\u30ED\u30B0\u30A4\u30F3",signInAgain:"\u518D\u30ED\u30B0\u30A4\u30F3",connected:"\u63A5\u7D9A\u6E08\u307F",notConnected:"\u672A\u63A5\u7D9A",busy:"\u30ED\u30B0\u30A4\u30F3\u4E2D\u2026",openBrowser:"\u30D6\u30E9\u30A6\u30B6\u3067\u7D9A\u3051\u308B",code:"\u8A8D\u8A3C\u30B3\u30FC\u30C9",copy:"\u30B3\u30FC\u30C9\u3092\u30B3\u30D4\u30FC",copied:"\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",close:"\u9589\u3058\u308B",submit:"\u7D9A\u3051\u308B",success:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F",successDescription:"\u8A8D\u8A3C\u60C5\u5831\u3092DeepSeek Harness\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",enable:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",failed:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cancelled:"\u30ED\u30B0\u30A4\u30F3\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",providerExpired:"\u8A8D\u8A3C\u30B3\u30FC\u30C9\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",timedOut:"\u30ED\u30B0\u30A4\u30F3\u306E\u5F85\u6A5F\u6642\u9593\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loadFailed:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",retry:"\u518D\u8A66\u884C",empty:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u308BPi\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093\u3002",answer:"\u8981\u6C42\u3055\u308C\u305F\u5024\u3092\u5165\u529B",secret:"API\u30AD\u30FC\u3092\u5165\u529B",selection:"\u9805\u76EE\u3092\u9078\u629E",enableFailed:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u304C\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",waiting:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044\u3002",readOnly:"\u3053\u306E\u74B0\u5883\u3067\u306F\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002"};Object.assign(q,{title:"AI connections & usage",description:"Manage each account and its models. Open usage details when needed.",connectionsTab:"Connections & models",usageTab:"Usage",addConnection:"Add connection",connectionSettings:"Connection settings",manageModels:"Manage models",searchConnections:"Search connections",filterStatus:"Status",filter_all:"All",filter_connected:"Connected",filter_disconnected:"Not connected",integration:"Integration",service:"Service",connectionName:"Connection name",namePlaceholder:"Personal Pro / Company API",oauthShort:"OAuth",endpoint:"Endpoint URL (optional)",protocol:"Protocol",oauthHint:"Sign in to this account in the browser. Credentials stay within this connection.",save:"Save",saved:"Connection settings saved.",confirmSave:"Confirm change and save",methodChangeWarning:"Changing the sign-in method changes the account or billing used by this connection. Confirm before saving.",cloneConnection:"Duplicate settings",copySuffix:"copy",deleteConnection:"Delete connection",confirmDelete:"Delete this connection",deleteWarning:"Delete this connection and its saved credentials? Its models will no longer be available.",keySaved:"A key is saved. Leave this field empty to keep it. The saved key is never displayed.",showSecret:"Show input",hideSecret:"Hide input",paste:"Paste",pasteFailed:"Clipboard access was unavailable. Paste directly into the field.",availableModels:"Models enabled",authExpired:"Sign-in expired",externalSettings:"Open integration settings",refreshUsage:"Refresh usage",usageFailed:"Could not refresh usage. The last available reading is kept.",usage_available:"Account usage",usage_unobserved:"Not observed yet",usage_unsupported:"Usage is not supported",usage_unknown:"Usage is unknown",usage_unavailable:"Usage is unavailable",usage_auth_required:"Sign in to check usage","usage_auth-required":"Sign in to check usage",usage_stale:"Last reading is out of date","usage_rate-limited":"Rate limited. Retry after the time below.",usage_error:"Usage could not be checked",quota_unlimited:"Unlimited",quota_unavailable:"Limit unavailable",quota_unallocated:"No quota allocated",quota_unknown:"Amount unknown",used:"used",remaining:"Remaining",estimated:"Estimated",unit_credits:"credits",unit_requests:"requests",resets:"Resets",resetDate:"Reset date (time not supplied)",retryAt:"Retry after",observedAt:"Last observed",checkedAt:"Last checked",lastObserved:"Recorded from a prior response. Opening this screen does not run a generation.",endpointUntrusted:"This endpoint is not trusted by the host. Add it to the host allowlist before saving.",serviceUnavailable:"This integration does not provide a supported model connection in this DSH version.",cloneHint:"The copy starts disabled and has no credentials. Configure its account separately."});Object.assign(Q,{title:"AI\u63A5\u7D9A\u30FB\u5229\u7528\u72B6\u6CC1",description:"\u30A2\u30AB\u30A6\u30F3\u30C8\u3054\u3068\u306B\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB\u3092\u7BA1\u7406\u3057\u307E\u3059\u3002\u5229\u7528\u72B6\u6CC1\u306F\u5FC5\u8981\u306A\u3068\u304D\u306B\u958B\u3051\u307E\u3059\u3002",connectionsTab:"\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB",usageTab:"\u5229\u7528\u72B6\u6CC1",addConnection:"\u63A5\u7D9A\u3092\u8FFD\u52A0",connectionSettings:"\u63A5\u7D9A\u8A2D\u5B9A",manageModels:"\u30E2\u30C7\u30EB\u3092\u7BA1\u7406",searchConnections:"\u63A5\u7D9A\u3092\u691C\u7D22",filterStatus:"\u63A5\u7D9A\u72B6\u614B",filter_all:"\u3059\u3079\u3066",filter_connected:"\u63A5\u7D9A\u6E08\u307F",filter_disconnected:"\u672A\u63A5\u7D9A",integration:"\u9023\u643A",service:"\u30B5\u30FC\u30D3\u30B9",connectionName:"\u63A5\u7D9A\u540D",namePlaceholder:"\u500B\u4EBAPro\u30FB\u4F1A\u793EAPI\u306A\u3069",oauthShort:"OAuth",endpoint:"\u63A5\u7D9A\u5148URL\uFF08\u4EFB\u610F\uFF09",protocol:"\u901A\u4FE1\u65B9\u5F0F",oauthHint:"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067\u30D6\u30E9\u30A6\u30B6\u304B\u3089\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3059\u3002\u8A8D\u8A3C\u60C5\u5831\u306F\u63A5\u7D9A\u3054\u3068\u306B\u4FDD\u5B58\u3057\u307E\u3059\u3002",save:"\u4FDD\u5B58",saved:"\u63A5\u7D9A\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",confirmSave:"\u5909\u66F4\u3092\u78BA\u8A8D\u3057\u3066\u4FDD\u5B58",methodChangeWarning:"\u8A8D\u8A3C\u65B9\u5F0F\u3092\u5909\u3048\u308B\u3068\u3001\u3053\u306E\u63A5\u7D9A\u3067\u4F7F\u3046\u30A2\u30AB\u30A6\u30F3\u30C8\u3084\u8AB2\u91D1\u5148\u304C\u5909\u308F\u308A\u307E\u3059\u3002\u78BA\u8A8D\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cloneConnection:"\u8A2D\u5B9A\u3092\u8907\u88FD",copySuffix:"\u30B3\u30D4\u30FC",deleteConnection:"\u63A5\u7D9A\u3092\u524A\u9664",confirmDelete:"\u3053\u306E\u63A5\u7D9A\u3092\u524A\u9664\u3059\u308B",deleteWarning:"\u3053\u306E\u63A5\u7D9A\u3068\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u60C5\u5831\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F\u3053\u306E\u63A5\u7D9A\u306E\u30E2\u30C7\u30EB\u306F\u5229\u7528\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059\u3002",keySaved:"\u30AD\u30FC\u306F\u4FDD\u5B58\u6E08\u307F\u3067\u3059\u3002\u5909\u66F4\u3057\u306A\u3044\u5834\u5408\u306F\u7A7A\u6B04\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u4FDD\u5B58\u6E08\u307F\u306E\u30AD\u30FC\u306F\u8868\u793A\u3057\u307E\u305B\u3093\u3002",showSecret:"\u5165\u529B\u3092\u8868\u793A",hideSecret:"\u5165\u529B\u3092\u96A0\u3059",paste:"\u8CBC\u308A\u4ED8\u3051",pasteFailed:"\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u5165\u529B\u6B04\u306B\u76F4\u63A5\u8CBC\u308A\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044\u3002",availableModels:"\u30E2\u30C7\u30EB\u6709\u52B9",authExpired:"\u8A8D\u8A3C\u5207\u308C",externalSettings:"\u9023\u643A\u5143\u306E\u8A2D\u5B9A\u3092\u958B\u304F",refreshUsage:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0",usageFailed:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u524D\u56DE\u306E\u53D6\u5F97\u7D50\u679C\u3092\u4FDD\u6301\u3057\u3066\u3044\u307E\u3059\u3002",usage_available:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u72B6\u6CC1",usage_unobserved:"\u307E\u3060\u89B3\u6E2C\u3057\u3066\u3044\u307E\u305B\u3093",usage_unsupported:"\u5229\u7528\u72B6\u6CC1\u306E\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC",usage_unknown:"\u5229\u7528\u72B6\u6CC1\u306F\u4E0D\u660E\u3067\u3059",usage_unavailable:"\u5229\u7528\u72B6\u6CC1\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093",usage_auth_required:"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059","usage_auth-required":"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059",usage_stale:"\u524D\u56DE\u306E\u60C5\u5831\u3067\u3059\u3002\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044","usage_rate-limited":"\u53D6\u5F97\u56DE\u6570\u306E\u5236\u9650\u4E2D\u3067\u3059\u3002\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",usage_error:"\u5229\u7528\u72B6\u6CC1\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",quota_unlimited:"\u7121\u5236\u9650",quota_unavailable:"\u5229\u7528\u67A0\u306F\u4E0D\u660E",quota_unallocated:"\u5229\u7528\u67A0\u306E\u5272\u5F53\u306A\u3057",quota_unknown:"\u4F7F\u7528\u91CF\u306F\u4E0D\u660E",used:"\u4F7F\u7528",remaining:"\u6B8B\u91CF",estimated:"\u63A8\u5B9A",unit_credits:"\u30AF\u30EC\u30B8\u30C3\u30C8",unit_requests:"\u30EA\u30AF\u30A8\u30B9\u30C8",resets:"\u30EA\u30BB\u30C3\u30C8\u6642\u523B",resetDate:"\u30EA\u30BB\u30C3\u30C8\u65E5\uFF08\u6642\u523B\u306E\u60C5\u5831\u306A\u3057\uFF09",retryAt:"\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B",observedAt:"\u6700\u7D42\u89B3\u6E2C\u6642\u523B",checkedAt:"\u6700\u7D42\u53D6\u5F97\u6642\u523B",lastObserved:"\u904E\u53BB\u306E\u5FDC\u7B54\u3067\u89B3\u6E2C\u3057\u305F\u60C5\u5831\u3067\u3059\u3002\u3053\u306E\u753B\u9762\u3092\u958B\u3044\u3066\u3082\u751F\u6210\u306F\u884C\u3044\u307E\u305B\u3093\u3002",endpointUntrusted:"\u3053\u306E\u63A5\u7D9A\u5148\u306F\u30DB\u30B9\u30C8\u3067\u8A31\u53EF\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u30DB\u30B9\u30C8\u306E\u8A31\u53EF\u30EA\u30B9\u30C8\u306B\u8FFD\u52A0\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",serviceUnavailable:"\u3053\u306EDSH\u7248\u3067\u306F\u3001\u3053\u306E\u9023\u643A\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002",cloneHint:"\u8907\u88FD\u3057\u305F\u63A5\u7D9A\u306F\u7121\u52B9\u30FB\u8A8D\u8A3C\u306A\u3057\u3067\u4F5C\u6210\u3057\u307E\u3059\u3002\u30A2\u30AB\u30A6\u30F3\u30C8\u306F\u5225\u306B\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(q,{hours:"hours",days:"days",minutes:"minutes",accountQuota:"Account quota",unit_tokens:"tokens",unit_USD:"USD",ownerManaged:"Managed by integration",directory_live:"Available",directory_declared:"Declared",directory_unavailable:"Unavailable",sourceUnknown:"Owner unknown","serviceUnavailable_muse-code-bridge-unverified":"Muse Code requires the official CLI and a supported agent session connection in this environment. It is separate from the Meta Model API through Pi."});Object.assign(Q,{hours:"\u6642\u9593",days:"\u65E5",minutes:"\u5206",accountQuota:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u67A0",unit_tokens:"\u30C8\u30FC\u30AF\u30F3",unit_USD:"USD",ownerManaged:"\u9023\u643A\u5143\u3067\u7BA1\u7406",directory_live:"\u5229\u7528\u53EF\u80FD",directory_declared:"\u8A2D\u5B9A\u3042\u308A",directory_unavailable:"\u5229\u7528\u4E0D\u53EF",sourceUnknown:"\u7BA1\u7406\u5143\u4E0D\u660E","serviceUnavailable_muse-code-bridge-unverified":"Muse Code\u306B\u306F\u516C\u5F0FCLI\u3068\u3001\u3053\u306E\u74B0\u5883\u3067\u5BFE\u5FDC\u3059\u308B\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u63A5\u7D9A\u304C\u5FC5\u8981\u3067\u3059\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u306E\u9023\u643A\u3067\u3059\u3002"});Object.assign(q,{museModels:"Muse Code model",museSessionHint:"Muse Code runs independent agent sessions. These models are separate from Pi\u2019s Meta Model API and are not added to the standard DSH model list.",museCatalogDiagnostic:"The host supplied a diagnostic catalog without a supported session model. Model availability does not confirm your account entitlement.",agentSessionEnabled:"Agent connection enabled","error_muse-code-cli-required":"Install the official Muse Code CLI and supported MSP SDK on the host, then retry.","error_muse-code-protocol-unsupported":"This Muse Code CLI does not support account or settings management. Update the official CLI.","error_muse-code-login-required":"Sign in to this Muse Code connection first.","error_muse-code-login-failed":"Muse Code sign-in did not complete. Retry from this connection\u2019s settings.","error_muse-code-mode-unavailable":"This account or CLI could not apply the selected model.","error_muse-code-connection-changed":"The Muse Code connection changed. Close this panel and open it again.","error_muse-code-busy":"Muse Code is already performing an operation. Retry after it finishes.","error_muse-code-model-unavailable":"This model was not advertised by the current Muse Code host. Reload the panel.","error_muse-code-unavailable":"Muse Code is unavailable. Check the official CLI and this connection\u2019s sign-in.","error_muse-code-llm-unsupported":"This Muse Code host does not provide a standard DSH model bridge.","error_muse-code-session-failed":"The Muse Code agent session failed. Check this connection and retry."});Object.assign(Q,{museModels:"Muse Code\u306E\u30E2\u30C7\u30EB",museSessionHint:"Muse Code\u306F\u72EC\u7ACB\u3057\u305F\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u3067\u3059\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u3067\u3001DSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u4E00\u89A7\u306B\u306F\u8FFD\u52A0\u3057\u307E\u305B\u3093\u3002",museCatalogDiagnostic:"\u3053\u306E\u30DB\u30B9\u30C8\u306E\u4E00\u89A7\u306F\u78BA\u8A8D\u7528\u3067\u3001\u5BFE\u5FDC\u3059\u308B\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u53D6\u5F97\u3060\u3051\u3067\u306F\u5951\u7D04\u306B\u3088\u308B\u5229\u7528\u53EF\u5426\u306F\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",agentSessionEnabled:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u63A5\u7D9A\u6709\u52B9","error_muse-code-cli-required":"\u30DB\u30B9\u30C8\u306B\u516C\u5F0FMuse Code CLI\u3068\u5BFE\u5FDC\u3059\u308BMSP SDK\u3092\u5C0E\u5165\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-protocol-unsupported":"\u3053\u306EMuse Code CLI\u306F\u30A2\u30AB\u30A6\u30F3\u30C8\u30FB\u8A2D\u5B9A\u7BA1\u7406\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-required":"\u5148\u306B\u3053\u306EMuse Code\u63A5\u7D9A\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-failed":"Muse Code\u306E\u30ED\u30B0\u30A4\u30F3\u304C\u5B8C\u4E86\u3057\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u306E\u8A2D\u5B9A\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-mode-unavailable":"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u307E\u305F\u306FCLI\u3067\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002","error_muse-code-connection-changed":"Muse Code\u63A5\u7D9A\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3053\u306E\u753B\u9762\u3092\u9589\u3058\u3066\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-busy":"Muse Code\u306E\u51E6\u7406\u4E2D\u3067\u3059\u3002\u5B8C\u4E86\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-model-unavailable":"\u73FE\u5728\u306EMuse Code\u30DB\u30B9\u30C8\u306B\u3053\u306E\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-unavailable":"Muse Code\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3068\u3053\u306E\u63A5\u7D9A\u306E\u30ED\u30B0\u30A4\u30F3\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-llm-unsupported":"\u3053\u306EMuse Code\u30DB\u30B9\u30C8\u306FDSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","error_muse-code-session-failed":"Muse Code\u306E\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(q,{authUnavailable:"Account status unavailable"});Object.assign(Q,{authUnavailable:"\u63A5\u7D9A\u72B6\u614B\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093"});Object.assign(q,{authVerified:"Sign-in verified"});Object.assign(Q,{authVerified:"\u63A5\u7D9A\u78BA\u8A8D\u6E08\u307F"});Object.assign(q,{"usageScope_muse-code-subscription-weekly":"Weekly quota","error_muse-code-observation-invalid":"The Muse Code response could not be verified. Update the official CLI and reopen this panel."});Object.assign(Q,{"usageScope_muse-code-subscription-weekly":"\u9031\u9593\u306E\u5229\u7528\u67A0","error_muse-code-observation-invalid":"Muse Code\u306E\u5FDC\u7B54\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3001\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(q,{useProvider:"Use this connection",enable:"Enable connection",enabled:"Connection enabled.",activateFirst:"Enable this connection before choosing models.",modelsHint:"When this connection is enabled, its selected models are available to chats and agents."});Object.assign(Q,{useProvider:"\u3053\u306E\u63A5\u7D9A\u3092\u4F7F\u3046",enable:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",activateFirst:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u3053\u306E\u63A5\u7D9A\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002"});Object.assign(q,{museEntitlementUnverified:"This model appears in the catalog. Generation entitlement for this subscription has not been verified."});Object.assign(Q,{museEntitlementUnverified:"\u4E00\u89A7\u306B\u3042\u308B\u30E2\u30C7\u30EB\u3067\u3059\u3002\u3053\u306E\u5951\u7D04\u3067\u306E\u751F\u6210\u6A29\u9650\u306F\u672A\u78BA\u8A8D\u3067\u3059\u3002"});Object.assign(q,{museModelSaved:"Muse Code model saved.",museWonderOne:"Wonder1",museWonderFull:"Wonder Full"});Object.assign(Q,{museModelSaved:"Muse Code\u306E\u30E2\u30C7\u30EB\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",museWonderOne:"Wonder1",museWonderFull:"Wonder Full"});var ht=`.dsh-pi-login { color: var(--dsw-alias-label-primary); font-family: var(--dsw-font-family); font-size: 13px; line-height: 1.6; }
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
`;var o=require("react/jsx-runtime"),Ct="dsh.piLogin",Dt=["slots","locale","connection"];function Ft(e){return(0,a.useSyncExternalStore)(n=>e.subscribe(n),()=>e.getSnapshot().revision),e.bind(Ct)}function $e(e){try{let n=new URL(e);if(n.protocol==="https:"||n.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(n.hostname))return n.href}catch{}}function ce({label:e,value:n,options:t,onChange:r,disabled:s}){let[d,h]=(0,a.useState)(!1),m=(0,a.useId)();return(0,o.jsxs)("div",{className:"dsh-pi-choice",children:[(0,o.jsx)("span",{id:m,className:"dsh-pi-caption",children:e}),(0,o.jsx)(Ue,{open:d,onClose:()=>h(!1),portal:!0,selectedId:n,items:t,onSelect:p=>{r(p),h(!1)},anchor:(0,o.jsxs)(M,{variant:"outline",disabled:s,"aria-labelledby":m,"aria-haspopup":"menu","aria-expanded":d,onClick:()=>h(!d),className:"dsh-pi-choice-button",children:[(0,o.jsx)("span",{children:t.find(p=>p.id===n)?.label}),(0,o.jsx)(Ve,{size:14})]})})]})}function Zt({prompt:e,ticket:n,controller:t,t:r,onFailure:s}){let[d,h]=(0,a.useState)(""),[m,p]=(0,a.useState)(!1),[g,x]=(0,a.useState)(!1),[w,i]=(0,a.useState)(!1),v=(0,a.useId)();async function k(I){I.preventDefault();let P=d;h(""),p(!0);try{await t.mutation("answer",{ticket:n,id:e.id,value:P})}catch{s()}finally{p(!1)}}return(0,o.jsxs)("form",{onSubmit:k,className:"dsh-pi-prompt",children:[e.kind==="select"?(0,o.jsx)(ce,{label:e.message||r("selection"),value:d,options:e.options,onChange:h,disabled:m}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("label",{htmlFor:v,children:e.message||r(e.kind==="secret"?"secret":"answer")}),(0,o.jsx)(te,{id:v,"data-modal-autofocus":!0,type:e.kind==="secret"&&!g?"password":"text",autoComplete:"off",spellCheck:!1,value:d,placeholder:e.placeholder,onChange:I=>h(I.target.value)}),e.kind==="secret"?(0,o.jsxs)("div",{className:"dsh-pi-secret-actions",children:[(0,o.jsx)(M,{onClick:()=>x(!g),"aria-pressed":g,children:r(g?"hideSecret":"showSecret")}),(0,o.jsx)(M,{onClick:async()=>{try{h(await navigator.clipboard.readText()),i(!1)}catch{i(!0)}},children:r("paste")})]}):null]}),w?(0,o.jsx)("p",{role:"alert",children:r("pasteFailed")}):null,(0,o.jsx)("div",{className:"dsh-pi-actions",children:(0,o.jsx)(M,{type:"submit",variant:"primary",disabled:m||e.kind==="select"&&!d,children:r("submit")})})]})}function Ut({entry:e,method:n,controller:t,t:r,onClose:s}){let d=(0,a.useRef)(),[h,m]=(0,a.useState)(),[p,g]=(0,a.useState)({status:"running"}),[x,w]=(0,a.useState)(!1),[i,v]=(0,a.useState)(!1),[k,I]=(0,a.useState)(!1),[P,O]=(0,a.useState)(!1),[b,H]=(0,a.useState)(!1),[f,u]=(0,a.useState)(!1);(0,a.useEffect)(()=>{let V=!0;return t.start(e.connectionId,n).then(y=>{d.current=y,V?m(y):t.cancel(y).catch(()=>{})},y=>{V&&w(we(y))}),()=>{V=!1,d.current&&t.cancel(d.current).catch(()=>{})}},[]),(0,a.useEffect)(()=>{if(!h)return;let V=!0,y,J=new AbortController;async function $(){try{let j=await t.call("state",{ticket:h},J.signal);if(!V)return;g(j),j.status==="running"?y=setTimeout($,800):(t.tickets.delete(h),await t.refresh())}catch(j){V&&w(we(j))}}return $(),()=>{V=!1,J.abort(),clearTimeout(y)}},[h]);let W=$e(p.notice?.url),E=p.status!=="running"||x,C=p.reason?.startsWith("muse-code-")?we(new Error(p.reason)):p.reason==="provider-expired"?"providerExpired":p.reason==="timeout"?"timedOut":p.status==="cancelled"?"cancelled":"failed";async function K(V=!1){v(!0),O(!1);try{await t.mutation(V?"use-login":"enable",{connectionId:e.connectionId}),I(!0),await t.refresh()}catch(y){O(!0),H(y.message.endsWith("/api-key-override"))}finally{v(!1)}}return(0,o.jsxs)(le,{open:!0,onClose:s,title:e.displayName,closeLabel:r("close"),className:"dsh-pi-login",footer:(0,o.jsx)(M,{variant:"outline",onClick:s,children:r(E?"close":"cancel")}),children:[x||p.status==="failed"?(0,o.jsx)("p",{role:"alert",children:r(x||C)}):null,p.status==="authorized"?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:"status",children:r("success")}),(0,o.jsx)("p",{className:"dsh-pi-muted",children:r("successDescription")}),k?(0,o.jsx)("p",{role:"status",children:r("enabled")}):(0,o.jsx)(M,{variant:"primary",onClick:()=>{K()},disabled:i,children:r("enable")}),P?(0,o.jsx)("p",{role:"alert",children:r(b?"keyOverride":"enableFailed")}):null,b&&!k?(0,o.jsx)(M,{variant:"outline",onClick:()=>{K(!0)},disabled:i,children:r("useLogin")}):null]}):null,p.status==="cancelled"?(0,o.jsx)("p",{role:p.reason==="timeout"?"alert":"status",children:r(C)}):null,E?null:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:"status",children:p.notice?.message||r(W?"waiting":"busy")}),W?(0,o.jsx)("a",{className:"dsh-pi-link",href:W,target:"_blank",rel:"noopener noreferrer",children:r("openBrowser")}):null,p.notice?.code?(0,o.jsxs)("div",{className:"dsh-pi-verification",children:[(0,o.jsx)("span",{className:"dsh-pi-muted",children:r("code")}),(0,o.jsxs)("div",{className:"dsh-pi-verification-row",children:[(0,o.jsx)("code",{children:p.notice.code}),(0,o.jsx)(M,{size:"sm",variant:"outline",onClick:async()=>{try{await navigator.clipboard.writeText(p.notice.code),u(!0)}catch{u(!1)}},children:r(f?"copied":"copy")})]})]}):null,p.prompt?(0,o.jsx)(Zt,{prompt:p.prompt,ticket:h,controller:t,t:r,onFailure:()=>w("failed")},p.prompt.id):null]})]})}function qt({entry:e,controller:n,t,onClose:r}){let[s,d]=(0,a.useState)(),[h,m]=(0,a.useState)(""),[p,g]=(0,a.useState)(!1),[x,w]=(0,a.useState)(!1),[i,v]=(0,a.useState)(""),k=(0,a.useRef)(),I=(0,a.useRef)(0);(0,a.useEffect)(()=>{let f=new AbortController;return n.call("models",{connectionId:e.connectionId},f.signal).then(d,()=>{f.signal.aborted||w(!0)}),()=>{f.abort(),k.current?.abort(),I.current++}},[e.connectionId]);async function P(){let f=++I.current;k.current?.abort();let u=new AbortController;k.current=u,g(!0),v(""),w(!1);try{let W=await n.call("refresh-models",{connectionId:e.connectionId},u.signal);!u.signal.aborted&&f===I.current&&d(W)}catch(W){if(!u.signal.aborted&&f===I.current){let E=W.message.split("/").pop();v(s?.refresh?.errors?.[E]??"catalogRefreshFailed")}}finally{!u.signal.aborted&&f===I.current&&g(!1)}}async function O(f,u){g(!0),w(!1);try{await n.mutation("set-model",{connectionId:e.connectionId,model:f,enabled:u,revision:s.revision}),d(await n.call("models",{connectionId:e.connectionId})),await n.refresh()}catch{w(!0);try{d(await n.call("models",{connectionId:e.connectionId}))}catch{}}finally{g(!1)}}let b=h.trim().toLowerCase(),H=s?.models.filter(f=>`${f.id} ${f.name}`.toLowerCase().includes(b));return(0,o.jsxs)(le,{open:!0,title:`${e.displayName} \xB7 ${t("models")}`,description:t("modelsHint"),closeLabel:t("close"),onClose:r,className:"dsh-pi-login dsh-pi-models-dialog",footer:(0,o.jsx)(M,{variant:"outline",onClick:r,children:t("close")}),children:[(0,o.jsx)(te,{icon:(0,o.jsx)(Pe,{size:16}),"aria-label":t("searchModels"),placeholder:t("searchModels"),"data-modal-autofocus":!0,value:h,onChange:f=>m(f.target.value)}),s?.refresh?.canRefresh?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(M,{variant:"outline",size:"sm",disabled:p||!e.writable,onClick:()=>{P()},children:t(p?"loading":"reloadModels")}),s.refresh.status?(0,o.jsxs)("p",{role:"status",children:[t(s.refresh.status.message),s.refresh.status.detail?` \xB7 ${s.refresh.status.detail}`:""]}):null,(s.refresh.notes??[]).map(f=>(0,o.jsx)("p",{className:"dsh-pi-muted",children:t(f)},f))]}):s?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("catalogRefreshUnsupported")}):null,i?(0,o.jsx)("p",{role:"alert",children:t(i)}):null,x?(0,o.jsx)("p",{role:"alert",children:t(s?"saveFailed":"modelsFailed")}):null,!s&&!x?(0,o.jsx)("p",{role:"status",children:t("loading")}):null,s&&!e.enabled?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("activateFirst")}):null,s?.models.some(f=>f.fast)?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("fastWarning")}):null,(0,o.jsxs)("div",{className:"dsh-pi-model-list",children:[H?.map(f=>(0,o.jsxs)("div",{className:"dsh-pi-model-row",children:[(0,o.jsxs)("div",{className:"dsh-pi-model-label",children:[(0,o.jsxs)("span",{children:[f.name," \xB7 ",e.displayName]}),(0,o.jsx)("span",{className:"dsh-pi-model-id",children:f.id}),f.contributor?(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("metaContributorHint")}):null,f.capabilityUnverified?(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("capabilitiesUnknown")}):null]}),(0,o.jsx)(ye,{label:`${t("modelEnabled")}: ${f.name}`,checked:f.enabled,disabled:p||!e.writable||!e.enabled,onChange:u=>{O(f.id,u)}})]},f.id)),H?.length===0?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("noResults")}):null]})]})}function we(e){let n=e.message.split("/").pop();return n==="endpoint-untrusted"?"endpointUntrusted":n?.startsWith("muse-code-")?Object.hasOwn(q,`error_${n}`)?`error_${n}`:"error_muse-code-unavailable":"saveFailed"}function mt(e,n){let t=e.museCode?.modelId,r=t==="muse-wonder-1.0"?n("museWonderOne"):t==="muse-wonder-full-1.0"?n("museWonderFull"):t;return r?`${r}${e.museCode?.contributorMode===!0?" Contributor":""}`:void 0}function $t({entry:e,controller:n,t,onClose:r}){let[s,d]=(0,a.useState)(),[h,m]=(0,a.useState)(""),[p,g]=(0,a.useState)(!1),[x,w]=(0,a.useState)(""),[i,v]=(0,a.useState)(!1),k=(0,a.useRef)();(0,a.useEffect)(()=>{let b=new AbortController;return k.current=b,n.mutation("models",{connectionId:e.connectionId},b.signal).then(H=>{if(b.signal.aborted)return;d(H);let f=H.models?.find(u=>u.selected)??H.models?.find(u=>u.modelId===e.museCode?.modelId&&u.contributor===(e.museCode?.contributorMode===!0));m(f?.id??"")},H=>{b.signal.aborted||w(we(H))}),()=>{b.abort()}},[e.connectionId]);let I=(s?.models??[]).filter(b=>b.sessionSupported===!0),P=I.find(b=>b.id===h);async function O(){if(P){g(!0),w(""),v(!1);try{await n.mutation("connection-update",{connectionId:e.connectionId,revision:s.revision??e.revision,patch:{modelId:P.modelId,contributorMode:P.contributor===!0}},k.current.signal),await n.refresh(),v(!0),d({...s,revision:n.getSnapshot().revision})}catch(b){k.current.signal.aborted||w(we(b))}finally{k.current.signal.aborted||g(!1)}}}return(0,o.jsxs)(le,{open:!0,title:`${e.displayName} \xB7 ${t("museModels")}`,description:t("museSessionHint"),closeLabel:t("close"),onClose:r,className:"dsh-pi-login dsh-pi-connection-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(M,{variant:"outline",onClick:r,children:t("close")}),(0,o.jsx)(M,{variant:"primary",onClick:()=>{O()},disabled:p||!e.writable||!e.configured||!s||!P,children:t(p?"loading":"save")})]}),children:[!s&&!x?(0,o.jsx)("p",{role:"status",children:t("loading")}):null,x?(0,o.jsx)("p",{role:"alert",children:t(x)}):null,i?(0,o.jsx)("p",{role:"status",children:t("museModelSaved")}):null,I.length?(0,o.jsx)(ce,{label:t("museModels"),value:h,options:I.map(b=>({id:b.id,label:`${b.name??b.label} \xB7 ${e.displayName}`})),disabled:p||!e.configured||!e.writable,onChange:b=>{m(b),v(!1)}}):s?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("museCatalogDiagnostic")}):null,P?.entitlement==="unverified"?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("museEntitlementUnverified")}):null]})}function wt({controller:e,t:n}){let t=(0,a.useSyncExternalStore)(e.subscribe,e.getSnapshot);(0,a.useEffect)(()=>{e.load()},[e]);let r=["checking","starting","preparing","installing"].includes(t.status),s={idle:"updateIdle",checking:"updateChecking",current:"updateCurrent",available:"updateAvailable",blocked:"updateBlocked",starting:"updatePreparing",preparing:"updatePreparing",installing:"updateInstalling","restart-required":"updateRestart",applied:"updateApplied",failed:"updateFailed",cancelled:"updateCancelled",overridden:"updateOverridden",unknown:"updateUnknown"};return(0,o.jsxs)("div",{className:"dsh-pi-updates",children:[(0,o.jsxs)("h4",{children:[n("updateTitle"),t.runtimeVersion?` \xB7 ${t.runtimeVersion}`:""]}),(0,o.jsx)("p",{role:["failed","blocked"].includes(t.status)?"alert":"status",children:n(s[t.status]||"updateUnknown")}),t.reason?(0,o.jsx)("p",{className:"dsh-pi-muted",children:n(`updateReason_${t.reason}`)||n("updateReason_network")}):null,t.checkedAt?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[n("updateChecked"),": ",new Date(t.checkedAt).toLocaleString()]}):null,t.candidate?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("p",{children:[t.runtimeVersion," \u2192 ",t.candidate.version," \xB7 DSH ",t.candidate.compatibility]}),(0,o.jsx)("p",{className:"dsh-pi-update-notes",children:t.candidate.notes})]}):null,(0,o.jsxs)("div",{className:"dsh-pi-actions",children:[(0,o.jsx)(M,{size:"sm",variant:"outline",disabled:r||t.status==="unknown"||t.status==="restart-required",onClick:()=>{e.check()},children:n("updateCheck")}),t.status==="available"?(0,o.jsx)(M,{size:"sm",variant:"primary",onClick:()=>{e.begin()},children:n("updateInstall")}):null,t.status==="unknown"?(0,o.jsx)(M,{size:"sm",variant:"outline",onClick:()=>{e.load()},children:n("updateReconcile")}):null,(0,o.jsx)("a",{className:"dsh-pi-link",href:"https://github.com/Aero123421/dsh-pi-login/releases",target:"_blank",rel:"noopener noreferrer",children:n("updateManual")})]}),t.result?.stage?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[n("updateStage"),": ",t.result.stage,t.result.error?.code?` \xB7 ${t.result.error.code}`:""]}):null]})}function Ie(e,n=!1){if(!e)return;if(n)return e;let t=new Date(e);return Number.isNaN(t.valueOf())?void 0:t.toLocaleString()}function ft(e,n){let t=e.windowSeconds;return t&&t%86400===0?`${t/86400} ${n("days")}`:t&&t%3600===0?`${t/3600} ${n("hours")}`:t&&t%60===0?`${t/60} ${n("minutes")}`:e.scope==="account"?n("accountQuota"):Object.hasOwn(q,`usageScope_${e.scope}`)?n(`usageScope_${e.scope}`):e.scope}function Kt({entry:e,controller:n,t}){let[r,s]=(0,a.useState)(),[d,h]=(0,a.useState)(!1),[m,p]=(0,a.useState)(!1),g=(0,a.useRef)(),x=(0,a.useRef)(0);async function w(i=!1){let v=++x.current;g.current?.abort();let k=new AbortController;g.current=k,h(!0),p(!1);try{let I=await n.mutation("usage",{connectionId:e.connectionId,refresh:i},k.signal);!k.signal.aborted&&v===x.current&&s(I)}catch{!k.signal.aborted&&v===x.current&&p(!0)}finally{!k.signal.aborted&&v===x.current&&h(!1)}}return(0,a.useEffect)(()=>(w(),()=>{x.current++,g.current?.abort()}),[e.connectionId]),(0,o.jsxs)("div",{className:"dsh-pi-usage","aria-busy":d,children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("p",{role:"status",children:t(r?`usage_${r.status}`:"loading")}),(0,o.jsx)(M,{variant:"outline",disabled:d||r?.status==="rate-limited"&&new Date(r.retryAt).valueOf()>Date.now(),onClick:()=>{w(!0)},children:t("refreshUsage")})]}),m?(0,o.jsx)("p",{role:"alert",children:t("usageFailed")}):null,(r?.windows??[]).map(i=>(0,o.jsxs)("div",{className:"dsh-pi-usage-window",children:[(0,o.jsx)("span",{children:ft(i,t)}),i.quotaState?(0,o.jsx)("strong",{children:t(`quota_${i.quotaState}`)}):typeof i.usedPercent=="number"?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("strong",{children:[i.usedPercent,"% ",t("used")]}),(0,o.jsx)("progress",{max:"100",value:Math.min(100,Math.max(0,i.usedPercent)),"aria-label":ft(i,t)})]}):(0,o.jsx)("span",{children:t("quota_unknown")}),i.quota?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[i.quota.estimated?`${t("estimated")} \xB7 `:"",i.quota.remaining!=null?`${t("remaining")}: ${i.quota.remaining}`:i.quota.used!=null?`${t("used")}: ${i.quota.used}`:t("quota_unknown"),i.quota.total!=null?` / ${i.quota.total}`:""," ",t(`unit_${i.quota.unit}`)]}):null,i.resetsAt?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[t("resets"),": ",Ie(i.resetsAt)]}):i.resetsOn?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[t("resetDate"),": ",Ie(i.resetsOn,!0)]}):null]},i.id)),r?.retryAt?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[t("retryAt"),": ",Ie(r.retryAt)]}):null,r?.sourceObservedAt?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[t("observedAt"),": ",Ie(r.sourceObservedAt)]}):null,r?.checkedAt?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[t("checkedAt"),": ",Ie(r.checkedAt)]}):null,r?.source==="last-observed"?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("lastObserved")}):null]})}function jt({value:e,onChange:n,t,disabled:r}){let[s,d]=(0,a.useState)(!1),[h,m]=(0,a.useState)(!1),p=(0,a.useId)();return(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:p,children:t("apiKey")}),(0,o.jsx)(te,{id:p,type:s?"text":"password",autoComplete:"off",spellCheck:!1,value:e,disabled:r,onChange:g=>n(g.target.value)}),(0,o.jsxs)("div",{className:"dsh-pi-secret-actions",children:[(0,o.jsx)(M,{disabled:r,"aria-pressed":s,onClick:()=>d(!s),children:t(s?"hideSecret":"showSecret")}),(0,o.jsx)(M,{disabled:r,onClick:async()=>{try{n(await navigator.clipboard.readText()),m(!1)}catch{m(!0)}},children:t("paste")})]}),h?(0,o.jsx)("p",{role:"alert",children:t("pasteFailed")}):null]})}function Gt({entry:e,state:n,controller:t,t:r,onClose:s,onLogin:d,onSaved:h}){let[m,p]=(0,a.useState)(e?.integrationId??n.integrations[0]?.id??"pi"),g=n.services.filter(l=>l.integrationId===m),[x,w]=(0,a.useState)(e?.serviceId??g[0]?.serviceId??g[0]?.id??""),i=g.find(l=>(l.serviceId??l.id)===x)??g[0],v=i?.methods??e?.methods??[],[k,I]=(0,a.useState)(e?.authMethod??v[0]?.id??"oauth"),P=v.find(l=>l.id===k)?.id??v[0]?.id??k,[O,b]=(0,a.useState)(e?.displayName??""),[H,f]=(0,a.useState)(e?.enabled??!1),[u,W]=(0,a.useState)(e?.profile?.baseURL??""),[E,C]=(0,a.useState)(e?.profile?.api??""),[K,V]=(0,a.useState)(""),[y,J]=(0,a.useState)(!1),[$,j]=(0,a.useState)(""),[ie,pe]=(0,a.useState)(),z=(0,a.useId)(),ve=n.revision,U=e?.writable??i?.writable!==!1,ae=e&&P!==e.authMethod;async function ke(){if(ae&&ie!=="method"){pe("method");return}J(!0),j("");try{let l={displayName:O.trim(),...!e||ae?{authMethod:P}:{},...e?{enabled:H}:{},...K?{apiKey:K}:{},...u.trim()?{endpointUrl:u.trim()}:e?.profile?.baseURL?{endpointUrl:""}:{},...E?{api:E}:{}},F=await t.mutation(e?"connection-update":"connection-create",e?{connectionId:e.connectionId,patch:l,revision:ve}:{integrationId:m,serviceId:i.serviceId??i.id,...l,revision:ve});if(V(""),await t.refresh(),h(),!e&&P==="oauth"){let S=F.connection??F,A=t.getSnapshot().entries.find(ue=>ue.connectionId===S.connectionId);A&&d(A)}}catch(l){j(we(l))}finally{J(!1)}}async function c(l){J(!0),j("");try{await t.mutation(`connection-${l}`,{connectionId:e.connectionId,revision:ve,...l==="clone"?{displayName:`${O} ${r("copySuffix")}`}:{}}),await t.refresh(),h()}catch{j("saveFailed")}finally{J(!1)}}return(0,o.jsxs)(le,{open:!0,title:e?`${e.displayName} \xB7 ${r("connectionSettings")}`:r("addConnection"),closeLabel:r("close"),onClose:s,className:"dsh-pi-login dsh-pi-connection-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(M,{variant:"outline",onClick:s,disabled:y,children:r("cancel")}),(0,o.jsx)(M,{variant:"primary",disabled:y||!U||!i||i.capabilities?.settings===!1||ie==="delete"||!O.trim()||!e&&P==="api-key"&&!K.trim(),onClick:()=>{ke()},children:r(y?"loading":ie==="method"?"confirmSave":"save")})]}),children:[e?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[e.integrationLabel," / ",e.serviceLabel]}):(0,o.jsxs)("div",{className:"dsh-pi-fields",children:[(0,o.jsx)(ce,{label:r("integration"),value:m,options:n.integrations.map(l=>({id:l.id??l.integrationId,label:l.label})),disabled:y,onChange:l=>{p(l),w(""),I("oauth")}}),g.length>1?(0,o.jsx)(ce,{label:r("service"),value:i?.serviceId??i?.id,options:g.map(l=>({id:l.serviceId??l.id,label:l.label??l.serviceLabel})),disabled:y,onChange:w}):null]}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${z}-name`,children:r("connectionName")}),(0,o.jsx)(te,{id:`${z}-name`,"data-modal-autofocus":!0,maxLength:80,value:O,disabled:y||!U,placeholder:r("namePlaceholder"),onChange:l=>b(l.target.value)})]}),e?(0,o.jsxs)("div",{className:"dsh-pi-provider-row",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("span",{children:r("useProvider")}),(0,o.jsx)("p",{className:"dsh-pi-muted",children:r("disabledHint")})]}),(0,o.jsx)(ye,{label:`${r("useProvider")}: ${e.displayName}`,checked:H,disabled:y||!U||!e.configured,onChange:f})]}):null,i?.capabilities?.settings===!1?(0,o.jsx)("p",{role:"status",children:r(i.unavailableReason==="muse-code-bridge-unverified"?`serviceUnavailable_${i.unavailableReason}`:"serviceUnavailable")}):null,v.length>1?(0,o.jsx)(ce,{label:r("method"),value:P,options:v.map(l=>({id:l.id,label:r(l.id==="oauth"?"oauth":"apiKey")})),disabled:y||!U,onChange:l=>{I(l),V(""),pe(void 0)}}):null,P==="api-key"?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(jt,{value:K,onChange:V,t:r,disabled:y||!U}),e?.configured?(0,o.jsx)("p",{className:"dsh-pi-muted",children:r("keySaved")}):null,(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${z}-url`,children:r("endpoint")}),(0,o.jsx)(te,{id:`${z}-url`,type:"url",value:u,disabled:y||!U,placeholder:"https://\u2026",onChange:l=>W(l.target.value)})]}),i?.apis?.length?(0,o.jsx)(ce,{label:r("protocol"),value:E||i.apis[0],options:i.apis.map(l=>({id:l,label:l})),disabled:y||!U,onChange:C}):null]}):(0,o.jsx)("p",{className:"dsh-pi-muted",children:r("oauthHint")}),ae?(0,o.jsx)("p",{role:"alert",children:r("methodChangeWarning")}):null,e?(0,o.jsxs)("div",{className:"dsh-pi-detail-actions",children:[e.authMethod==="oauth"&&e.capabilities?.auth!==!1?(0,o.jsx)(M,{variant:"outline",disabled:y||!U||ae,onClick:()=>d(e),children:r(e.configured?"signInAgain":"signIn")}):null,(0,o.jsx)(M,{variant:"outline",disabled:y||!U,onClick:()=>{c("clone")},children:r("cloneConnection")}),(0,o.jsx)(M,{disabled:y||!U,onClick:()=>pe("delete"),children:r("deleteConnection")})]}):null,e?(0,o.jsx)("p",{className:"dsh-pi-muted",children:r("cloneHint")}):null,ie==="delete"?(0,o.jsxs)("div",{className:"dsh-pi-confirm",children:[(0,o.jsx)("p",{role:"alert",children:r("deleteWarning")}),(0,o.jsx)(M,{variant:"outline",disabled:y,onClick:()=>pe(void 0),children:r("cancel")}),(0,o.jsx)(M,{variant:"primary",disabled:y,onClick:()=>{c("delete")},children:r("confirmDelete")})]}):null,$?(0,o.jsx)("p",{role:"alert",children:r($)}):null,U?null:(0,o.jsx)("p",{className:"dsh-pi-muted",children:r("readOnly")})]})}function vt({controller:e,updates:n,locale:t}){let r=(0,a.useSyncExternalStore)(e.subscribe,e.getSnapshot),s=Ft(t),[d,h]=(0,a.useState)("connections"),[m,p]=(0,a.useState)(""),[g,x]=(0,a.useState)("all"),[w,i]=(0,a.useState)(),[v,k]=(0,a.useState)(!1),I=(0,a.useId)();(0,a.useEffect)(()=>{e.load()},[e]),(0,a.useEffect)(()=>{i(void 0),k(!1)},[r.profileKey,r.generation]);let P=m.trim().toLocaleLowerCase(),O=new Map;for(let u of r.entries){if(!`${u.displayName} ${u.integrationLabel} ${u.serviceLabel}`.toLocaleLowerCase().includes(P)||g==="connected"&&!u.configured||g==="disconnected"&&u.configured)continue;let W=`${u.integrationId}/${u.serviceId}`;O.has(W)||O.set(W,{label:`${u.integrationLabel} / ${u.serviceLabel}`,entries:[]}),O.get(W).entries.push(u)}let b=["connections","usage"];function H(u){i({kind:"login",entry:u,method:u.authMethod})}function f(){i(void 0),k(!0)}return(0,o.jsxs)("section",{className:"dsh-pi-login dsh-pi-footer","aria-labelledby":`${I}-title`,children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("h3",{id:`${I}-title`,children:s("title")}),(0,o.jsx)(M,{variant:"outline",onClick:()=>{k(!1),i({kind:"settings"})},disabled:r.status!=="ready"||r.services.length===0,children:s("addConnection")})]}),(0,o.jsx)("p",{className:"dsh-pi-muted",children:s("description")}),(0,o.jsx)("div",{className:"dsh-pi-tabs",role:"tablist","aria-label":s("title"),children:b.map(u=>(0,o.jsx)(M,{id:`${I}-${u}`,role:"tab","aria-selected":d===u,"aria-controls":`${I}-panel`,tabIndex:d===u?0:-1,variant:d===u?"outline":"ghost",onClick:()=>h(u),onKeyDown:W=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(W.key))return;W.preventDefault();let E=W.key==="Home"?b[0]:W.key==="End"?b[1]:b[1-b.indexOf(u)];h(E),document.getElementById(`${I}-${E}`)?.focus()},children:s(u==="connections"?"connectionsTab":"usageTab")},u))}),v?(0,o.jsx)("p",{role:"status",children:s("saved")}):null,r.error?(0,o.jsxs)("p",{role:"alert",children:[s("loadFailed")," ",(0,o.jsx)(M,{onClick:()=>{e.refresh()},children:s("retry")})]}):null,r.status==="loading"&&r.entries.length===0?(0,o.jsx)("p",{role:"status",className:"dsh-pi-loading",children:s("loading")}):null,(0,o.jsxs)("div",{className:"dsh-pi-fields dsh-pi-search",children:[(0,o.jsx)(te,{"aria-label":s("searchConnections"),placeholder:s("searchConnections"),icon:(0,o.jsx)(Pe,{size:16}),value:m,onChange:u=>p(u.target.value)}),(0,o.jsx)(ce,{label:s("filterStatus"),value:g,options:["all","connected","disconnected"].map(u=>({id:u,label:s(`filter_${u}`)})),onChange:x})]}),(0,o.jsxs)("div",{id:`${I}-panel`,role:"tabpanel","aria-labelledby":`${I}-${d}`,children:[[...O].map(([u,W],E)=>(0,o.jsxs)("details",{className:"dsh-pi-group",open:r.entries.length<=8||E===0||P?!0:void 0,children:[(0,o.jsxs)("summary",{children:[(0,o.jsx)("span",{children:W.label}),(0,o.jsx)("span",{className:"dsh-pi-muted",children:W.entries.length})]}),W.entries.map(C=>(0,o.jsxs)("div",{className:"dsh-pi-connection-row",children:[(0,o.jsxs)("div",{className:"dsh-pi-row-label",children:[(0,o.jsx)("span",{children:C.displayName}),(0,o.jsxs)("div",{className:"dsh-pi-row-meta",children:[(0,o.jsx)("span",{children:s(C.authMethod==="owner-managed"?"ownerManaged":C.authMethod==="oauth"?"oauthShort":"apiKey")}),C.authStatus==="owner-managed"?(0,o.jsxs)("span",{children:[s(`directory_${C.directoryState??"unavailable"}`)," \xB7 ",C.source??s("sourceUnknown")]}):(0,o.jsxs)("span",{className:"dsh-pi-status",children:[(0,o.jsx)(qe,{state:C.inFlight||C.authStatus==="updating"?"ongoing":C.configured?"done":"pending",size:8}),s(C.inFlight||C.authStatus==="updating"?"busy":C.authStatus==="unavailable"?"authUnavailable":C.authStatus==="expired"?"authExpired":C.authStatus==="verified"?"authVerified":C.configured?"connected":"notConnected")]}),C.enabled?(0,o.jsx)("span",{children:s(C.executionKind==="agent-session"?"agentSessionEnabled":"availableModels")}):null,C.integrationId==="meta-muse-code"&&mt(C,s)?(0,o.jsx)("span",{children:mt(C,s)}):null]})]}),(0,o.jsx)("div",{className:"dsh-pi-row-actions",children:d==="usage"?C.capabilities?.usage!==!1?(0,o.jsx)(M,{variant:"outline","aria-label":`${s("usageTab")}: ${C.displayName}`,onClick:()=>i({kind:"usage",entry:C}),children:s("usageTab")}):(0,o.jsx)("span",{className:"dsh-pi-muted",children:s("usage_unsupported")}):(0,o.jsxs)(o.Fragment,{children:[C.capabilities?.models!==!1?(0,o.jsx)(M,{variant:"outline","aria-label":`${s("manageModels")}: ${C.displayName}`,onClick:()=>i({kind:"models",entry:C}),children:s("manageModels")}):null,C.capabilities?.settings!==!1?(0,o.jsx)(M,{"aria-label":`${s("connectionSettings")}: ${C.displayName}`,onClick:()=>{k(!1),i({kind:"settings",entry:C})},children:s("connectionSettings")}):C.settingsUrl&&$e(C.settingsUrl)?(0,o.jsx)("a",{className:"dsh-pi-link",href:$e(C.settingsUrl),target:"_blank",rel:"noopener noreferrer",children:s("externalSettings")}):null]})})]},C.connectionId))]},u)),r.status==="ready"&&O.size===0&&!r.error?(0,o.jsx)("p",{className:"dsh-pi-muted",children:s(r.entries.length?"noResults":"empty")}):null]}),n?(0,o.jsx)(wt,{controller:n,t:s}):null,w?.kind==="login"?(0,o.jsx)(Ut,{...w,controller:e,t:s,onClose:()=>i(void 0)}):null,w?.kind==="models"?w.entry.integrationId==="meta-muse-code"?(0,o.jsx)($t,{entry:w.entry,controller:e,t:s,onClose:()=>i(void 0)}):(0,o.jsx)(qt,{entry:w.entry,controller:e,t:s,onClose:()=>i(void 0)}):null,w?.kind==="settings"?(0,o.jsx)(Gt,{entry:w.entry,state:r,controller:e,t:s,onClose:()=>i(void 0),onLogin:H,onSaved:f}):null,w?.kind==="usage"?(0,o.jsx)(le,{open:!0,title:`${w.entry.displayName} \xB7 ${s("usageTab")}`,closeLabel:s("close"),onClose:()=>i(void 0),className:"dsh-pi-login dsh-pi-connection-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsx)(M,{variant:"outline",onClick:()=>i(void 0),children:s("close")}),children:(0,o.jsx)(Kt,{entry:w.entry,controller:e,t:s})}):null]})}function Qt(e){let n=new Ae(e.connection),t=new Se(e.connection);e.effect(()=>()=>t.dispose(),"dsh-pi-login: update requests"),e.effect(()=>()=>n.dispose(),"dsh-pi-login: UI requests"),e.effect(()=>e.locale.register(Ct,{en:q,ja:Q}),"dsh-pi-login: copy"),e.effect(()=>{let s=document.createElement("style");return s.dataset.dshPiLogin="",s.textContent=gt+ht,document.head.append(s),()=>s.remove()},"dsh-pi-login: official controls"),e.on("connection/reset",()=>{n.refresh(),t.load()});let r=()=>({controller:n,updates:t,locale:e.locale});e.slots.inject("settings.models.footer",()=>e.slots.register({name:"settings.models.footer",id:"dsh-pi-login",order:10,inject:r},vt))}

return module.exports;}});
