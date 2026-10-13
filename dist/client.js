window.__ModuleLoader__.load({id:"@local/dsh-pi-login",factory(require){const module={exports:{}};const exports=module.exports;
var Be=Object.defineProperty;var xt=Object.getOwnPropertyDescriptor;var It=Object.getOwnPropertyNames;var yt=Object.prototype.hasOwnProperty;var Mt=(e,n)=>{for(var t in n)Be(e,t,{get:n[t],enumerable:!0})},_t=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of It(n))!yt.call(e,s)&&s!==t&&Be(e,s,{get:()=>n[s],enumerable:!(r=xt(n,s))||r.enumerable});return e};var Lt=e=>_t(Be({},"__esModule",{value:!0}),e);var eo={};Mt(eo,{ConnectionUI:()=>kt,UpdateUI:()=>vt,apply:()=>zt,inject:()=>Zt});module.exports=Lt(eo);var i=require("react");var Je=require("react");function Ye(e){var n,t,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var s=e.length;for(n=0;n<s;n++)e[n]&&(t=Ye(e[n]))&&(r&&(r+=" "),r+=t)}else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function Pt(){for(var e,n,t=0,r="",s=arguments.length;t<s;t++)(e=arguments[t])&&(n=Ye(e))&&(r&&(r+=" "),r+=n);return r}var B=Pt;var we={button:"dshpi_13ed0003_button",md:"dshpi_13ed0003_md",sm:"dshpi_13ed0003_sm",primary:"dshpi_13ed0003_primary",ghost:"dshpi_13ed0003_ghost",outline:"dshpi_13ed0003_outline",toolbar:"dshpi_13ed0003_toolbar",icon:"dshpi_13ed0003_icon"};var ye=require("react/jsx-runtime"),I=(0,Je.forwardRef)(function({variant:n="ghost",size:t="md",icon:r,className:s,children:a,...m},d){return(0,ye.jsxs)("button",{ref:d,type:"button",className:B(we.button,we[n],we[t],s),...m,children:[r!=null&&(0,ye.jsx)("span",{className:we.icon,children:r}),a]})});var Xe=require("react");var Me={wrap:"dshpi_fda332f6_wrap",icon:"dshpi_fda332f6_icon",input:"dshpi_fda332f6_input"};var be=require("react/jsx-runtime"),ee=(0,Xe.forwardRef)(function({icon:n,className:t,...r},s){return(0,be.jsxs)("span",{className:B(Me.wrap,t),children:[n!=null&&(0,be.jsx)("span",{className:Me.icon,children:n}),(0,be.jsx)("input",{ref:s,className:Me.input,...r})]})});var Te={switch:"dshpi_7ae83aee_switch",thumb:"dshpi_7ae83aee_thumb"};var Ve=require("react/jsx-runtime");function _e({checked:e,onChange:n,label:t,disabled:r=!1,title:s,className:a}){return(0,Ve.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":t,title:s,disabled:r,className:B(Te.switch,a),onClick:()=>{n(!e)},children:(0,Ve.jsx)("span",{className:Te.thumb})})}var F=require("react"),dt=require("react-dom");var Wt=require("react");var ze=require("react/jsx-runtime");var q=require("react/jsx-runtime");var Le=1;var Ot=({size:e=16,className:n,strokeWidth:t})=>(0,q.jsxs)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,q.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,q.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),Pe=e=>(0,q.jsx)(Ot,{...e,strokeWidth:Le});var Nt=({size:e=16,className:n,strokeWidth:t})=>(0,q.jsx)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,q.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),We=e=>(0,q.jsx)(Nt,{...e,strokeWidth:Le});var St=({size:e=14,className:n,strokeWidth:t})=>(0,q.jsx)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:(0,q.jsx)("path",{d:"M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6",stroke:"currentColor"})}),De=e=>(0,q.jsx)(St,{...e,strokeWidth:Le});var At=({size:e=16,className:n,strokeWidth:t})=>(0,q.jsxs)("svg",{width:e,height:e,className:n,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:t,children:[(0,q.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,q.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),et=e=>(0,q.jsx)(At,{...e,strokeWidth:Le});function tt(e){let n=document.documentElement,t=Number.parseFloat(getComputedStyle(n).getPropertyValue("--dsh-frame-top-clearance"));return Number.isNaN(t)?e:Math.max(e,(n.hasAttribute("data-fullscreen")?0:t)+20)}var re=require("react"),Rt=200;function ot(e){let n=(0,re.useRef)(null),t=(0,re.useRef)(e);t.current=e;let r=(0,re.useCallback)(()=>{n.current!==null&&(clearTimeout(n.current),n.current=null)},[]),s=(0,re.useCallback)(()=>{r(),n.current=setTimeout(()=>{n.current=null,t.current()},Rt)},[r]);return(0,re.useEffect)(()=>r,[r]),{arm:s,cancel:r}}var Se=require("react");function Oe(e){let n=!1,t=!1,r=()=>{n=!0},s=()=>{n=!1,t=!0},a=()=>{t=!1},m=()=>{n=!1,t=!1};return e.addEventListener("compositionstart",r,!0),e.addEventListener("compositionend",s,!0),e.addEventListener("keyup",a,!0),e.defaultView?.addEventListener("blur",m),{guards:d=>{let g=n||t||d.isComposing||d.keyCode===229;return t=!1,g},dispose:()=>{e.removeEventListener("compositionstart",r,!0),e.removeEventListener("compositionend",s,!0),e.removeEventListener("keyup",a,!0),e.defaultView?.removeEventListener("blur",m)}}}var Fe=new WeakMap,Ht=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function he(e,n){Fe.get(e)?.();let t=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",t),e.removeEventListener("keydown",r,!0),Fe.delete(e)},r=s=>{!s.isComposing&&!s.ctrlKey&&!s.altKey&&!s.metaKey&&Ht.has(s.key)&&t()};Fe.set(e,t),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",t),e.addEventListener("keydown",r,!0),e.focus(n),e.matches(":focus")||t()}var Ne=new WeakMap;function rt(e){if(e===null)return!1;let n=Ne.get(e.ownerDocument)?.at(-1);return n!==void 0&&!n.element.contains(e)}var nt='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function st(e,n,t){let r=(0,Se.useRef)(t);r.current=t,(0,Se.useLayoutEffect)(()=>{let s=e.current;if(!n||s===null)return;let a=s.ownerDocument,m=Oe(a),d=a.activeElement,g=Ne.get(a)??[];Ne.set(a,g);let c={element:s,close:()=>{r.current()}};g.push(c);let w=s.querySelector("[data-modal-autofocus]")??s.querySelector(nt)??s;s.contains(a.activeElement)||he(w);let x=u=>{let C=m.guards(u);if(g.at(-1)!==c||u.defaultPrevented||C||u.ctrlKey||u.altKey||u.metaKey||(u.key==="Escape"&&!u.shiftKey&&(u.preventDefault(),u.repeat||r.current()),u.key!=="Tab")||a.activeElement?.closest('[role="menu"]'))return;let p=[...s.querySelectorAll(nt)].filter(f=>!f.closest("[inert], [hidden]")),y=p[0]??s,b=p.at(-1)??s,W=u.shiftKey?a.activeElement===y:a.activeElement===b;(a.activeElement===s||!s.contains(a.activeElement)||W)&&(u.preventDefault(),(u.shiftKey?b:y).focus())};return a.addEventListener("keydown",x),()=>{m.dispose();let u=g.at(-1)===c;if(g.splice(g.indexOf(c),1),a.removeEventListener("keydown",x),g.length===0&&Ne.delete(a),u){let C=d instanceof HTMLElement&&d.isConnected?d:g.at(-1)?.element;C!==void 0&&he(C)}}},[e,n])}var ge={keys:"dshpi_042ff8c4_keys",key:"dshpi_042ff8c4_key",tooltip:"dshpi_042ff8c4_tooltip",separator:"dshpi_042ff8c4_separator",joined:"dshpi_042ff8c4_joined"};var Ze=require("react/jsx-runtime");function Ue({keys:e,variant:n="plain",className:t}){return(0,Ze.jsx)("span",{className:B(ge.keys,n==="tooltip"&&ge.tooltip,n==="tooltip"&&e.includes("+")&&ge.joined,t),children:e.map((r,s)=>(0,Ze.jsx)("kbd",{className:r==="+"?ge.separator:ge.key,children:r},s))})}var ie=require("react"),it=require("react-dom");var me={surface:"dshpi_a00a35bd_surface",backing:"dshpi_a00a35bd_backing",compact:"dshpi_a00a35bd_compact",material:"dshpi_a00a35bd_material"};var se=require("react/jsx-runtime"),qe=(0,ie.forwardRef)(function({compact:n=!1,className:t,style:r,children:s,...a},m){let d=(0,ie.useId)(),g=(0,ie.useRef)(null);(0,ie.useLayoutEffect)(()=>{document.body.appendChild(g.current)},[]);let c={"--dsh-menu-anchor":`--dsh-menu-${d.replaceAll(":","")}`};return(0,se.jsxs)(se.Fragment,{children:[(0,se.jsxs)("div",{...a,ref:m,"data-menu-material":"translucent",className:B(me.surface,n&&me.compact,t),style:{...r,...c},children:[(0,se.jsx)("div",{"aria-hidden":"true",className:me.material}),s]}),(0,it.createPortal)((0,se.jsx)("div",{ref:g,"aria-hidden":"true","data-menu-backing":"",className:B(me.backing,n&&me.compact),style:{...c,visibility:r?.visibility}}),document.body)]})});var O={root:"dshpi_1911279a_root",list:"dshpi_1911279a_list",submenu:"dshpi_1911279a_submenu",scrollable:"dshpi_1911279a_scrollable",viewport:"dshpi_1911279a_viewport",css:"dshpi_1911279a_css",portal:"dshpi_1911279a_portal",sideTop:"dshpi_1911279a_sideTop",alignEnd:"dshpi_1911279a_alignEnd",tsx:"dshpi_1911279a_tsx",footer:"dshpi_1911279a_footer",separator:"dshpi_1911279a_separator",itemWrap:"dshpi_1911279a_itemWrap",item:"dshpi_1911279a_item",denseList:"dshpi_1911279a_denseList",label:"dshpi_1911279a_label",compactList:"dshpi_1911279a_compactList",itemIcon:"dshpi_1911279a_itemIcon",check:"dshpi_1911279a_check",itemLabel:"dshpi_1911279a_itemLabel",shortcut:"dshpi_1911279a_shortcut",shortcutKeys:"dshpi_1911279a_shortcutKeys",selected:"dshpi_1911279a_selected",selectedFill:"dshpi_1911279a_selectedFill",danger:"dshpi_1911279a_danger"};var T=require("react/jsx-runtime");function at(e){return"type"in e&&e.type==="separator"}function lt(e){return"type"in e&&e.type==="label"}var Et={visibility:"hidden",left:0,top:0};function Ke({open:e,anchor:n,items:t=[],children:r,selectedId:s,selectedIds:a,onSelect:m,onClose:d,align:g="start",side:c="bottom",portal:w=!1,closeOnPointerLeave:x=!1,dense:u=!1,compact:C=!1,autoFocus:p=!1,selection:y="check",getAnchorRect:b,footer:W,className:f,listClassName:A}){let k=(0,F.useRef)(null),M=(0,F.useRef)(null),E=(0,F.useRef)(null),N=(0,F.useRef)(null),v=(0,F.useRef)(!1),L=(h=!1)=>{let S=N.current,G=S!==null&&document.contains(S)&&!S.disabled?S:k.current?.querySelector("button:not(:disabled)");G!=null&&(h?G.focus():he(G))},_=()=>{let h=v.current;queueMicrotask(()=>{if(H.current)return;let S=document.activeElement;(S===null||S===document.body||M.current?.contains(S)===!0)&&L(h)})},H=(0,F.useRef)(e);H.current=e;let[Z,R]=(0,F.useState)(null),[te,Y]=(0,F.useState)(null),{arm:J,cancel:l}=ot(d);(0,F.useLayoutEffect)(()=>{if(!e||!w){Y(null);return}let h=()=>{let V;if(b!==void 0?V=b():V=k.current?.getBoundingClientRect()??null,V===null)return;let D=12,Ie=window.innerWidth,P=window.innerHeight,oe=M.current,pe=oe?.offsetWidth??0,ne=oe?.offsetHeight??0,z,$;c==="right"?(z=V.right+4,$=V.top):g==="start"?(z=V.left,$=c==="bottom"?V.bottom+4:V.top-ne-4):(z=V.right-pe,$=c==="bottom"?V.bottom+4:V.top-ne-4),pe>0&&(z=Math.min(Math.max(z,D),Ie-pe-D)),ne>0&&($=Math.min(Math.max($,tt(D)),P-ne-D)),Y(ue=>ue?.left===z&&ue.top===$?ue:{left:z,top:$})};h();let S=()=>{h(),G=requestAnimationFrame(S)},G=requestAnimationFrame(S);return window.addEventListener("scroll",h,!0),window.addEventListener("resize",h),()=>{cancelAnimationFrame(G),window.removeEventListener("scroll",h,!0),window.removeEventListener("resize",h)}},[e,w,g,c,b]),(0,F.useEffect)(()=>{if(!e){N.current=null;return}let h=document.activeElement;N.current=h instanceof HTMLElement&&k.current?.contains(h)===!0?h:null},[e]),(0,F.useEffect)(()=>{if(!e||!p)return;let h=M.current?.querySelector("button:not(:disabled)");E.current=h==null?null:0,h!=null&&he(h)},[e,p]),(0,F.useEffect)(()=>{if(!e){R(null),E.current=null;return}let h=Oe(document),S=P=>{P.target instanceof Node&&k.current?.contains(P.target)!==!0&&M.current?.contains(P.target)!==!0&&d()},G=P=>{if(h.guards(P)||rt(k.current)||P.defaultPrevented||P.ctrlKey||P.altKey||P.metaKey)return;let oe=document.activeElement,pe=M.current?.contains(oe)===!0,ne=k.current?.contains(oe)===!0||pe;if(P.key==="Escape"&&!P.shiftKey){if(P.preventDefault(),P.repeat)return;d(),(ne||p)&&L()}if(P.key==="Tab"){let Ge=M.current;if(Ge===null||!ne)return;if(P.shiftKey){P.preventDefault(),d(),L(!0);return}if(pe){if(oe instanceof Element&&oe.getAttribute("role")==="menuitem"){P.preventDefault(),v.current=!0;try{oe.click()}finally{v.current=!1}}return}let Qe=Ge.querySelector("button:not(:disabled)");if(Qe===null)return;P.preventDefault(),Qe.focus(),E.current=0;return}if(!["ArrowDown","ArrowUp","Home","End"].includes(P.key))return;let z=M.current;if(z===null||!ne)return;let $=Array.from(z.querySelectorAll("button:not(:disabled)"));if($.length===0)return;let ue=$.indexOf(oe),$e=ue>=0?ue:E.current,je=P.key==="Home"?0:P.key==="End"?$.length-1:$e===null?P.key==="ArrowDown"?0:$.length-1:($e+(P.key==="ArrowDown"?1:-1)+$.length)%$.length;P.preventDefault(),E.current=je,$[je]?.focus()},V=()=>{document.activeElement instanceof HTMLIFrameElement&&d()};document.addEventListener("pointerdown",S);let D=P=>{P.key==="Escape"&&G(P)},Ie=P=>{P.key!=="Escape"&&G(P)};return document.addEventListener("keydown",Ie),document.addEventListener("keydown",D,!0),window.addEventListener("blur",V),()=>{h.dispose(),document.removeEventListener("pointerdown",S),document.removeEventListener("keydown",Ie),document.removeEventListener("keydown",D,!0),window.removeEventListener("blur",V)}},[e,d,p]),(0,F.useEffect)(()=>{e||l()},[e,l]);let U=!t.some(h=>!at(h)&&!lt(h)&&h.submenu!==void 0&&h.submenu.length>0),xe=h=>{if(at(h))return(0,T.jsx)("div",{className:O.separator,role:"separator"},h.id);if(lt(h))return(0,T.jsx)("div",{className:O.label,role:"presentation",children:h.text},h.id);let S=h.submenu!==void 0&&h.submenu.length>0,G=S&&Z===h.id,V=h.id===s||a?.includes(h.id)===!0;return(0,T.jsxs)("div",{className:O.itemWrap,onMouseEnter:S?()=>{R(h.id)}:void 0,onMouseLeave:()=>{R(null)},children:[(0,T.jsxs)("button",{type:"button",role:"menuitem",className:B(O.item,V&&(y==="fill"?O.selectedFill:O.selected),h.danger===!0&&O.danger),disabled:h.disabled,"aria-keyshortcuts":h.shortcut?.aria,"aria-haspopup":S?"menu":void 0,"aria-expanded":S?G:void 0,onFocus:S?()=>{R(h.id)}:void 0,onClick:()=>{if(S){R(h.id);return}m?.(h.id)},children:[h.icon!==void 0&&(0,T.jsx)("span",{className:O.itemIcon,children:h.icon}),(0,T.jsx)("span",{className:O.itemLabel,children:h.label}),h.shortcut!==void 0&&(0,T.jsx)("span",{"aria-hidden":"true",className:O.shortcut,children:(0,T.jsx)(Ue,{keys:h.shortcut.keys,className:O.shortcutKeys})}),V&&y==="check"&&(0,T.jsx)(We,{className:O.check})]}),G&&h.submenu!==void 0&&(0,T.jsx)(qe,{compact:C,className:B(O.submenu,C&&O.compactList),role:"menu",children:h.submenu.map(D=>(0,T.jsxs)("button",{type:"button",role:"menuitem",className:O.item,disabled:D.disabled,"aria-keyshortcuts":D.shortcut?.aria,onClick:()=>{m?.(D.id),_()},children:[D.icon!==void 0&&(0,T.jsx)("span",{className:O.itemIcon,children:D.icon}),(0,T.jsx)("span",{className:O.itemLabel,children:D.label}),D.shortcut!==void 0&&(0,T.jsx)("span",{"aria-hidden":"true",className:O.shortcut,children:(0,T.jsx)(Ue,{keys:D.shortcut.keys,className:O.shortcutKeys})})]},D.id))})]},h.id)},Ce=h=>{let S=h.target instanceof Element?h.target.closest('button[role="menuitem"]'):null;S===null||S.getAttribute("aria-haspopup")==="menu"||S.closest('[role="menu"]')===h.currentTarget&&R(null)},ve=e&&(0,T.jsxs)(qe,{compact:C,ref:M,className:B(O.list,A,u&&O.denseList,C&&O.compactList,U&&O.scrollable,w&&O.portal,c==="top"&&!w&&O.sideTop,g==="end"&&!w&&O.alignEnd),style:w?te??Et:void 0,role:"menu",onClick:h=>{h.stopPropagation();let S=h.target instanceof Element?h.target.closest('button[role="menuitem"]'):null;S!==null&&S.getAttribute("aria-haspopup")!=="menu"&&_()},onMouseOver:Ce,onFocus:Ce,children:[(0,T.jsxs)("div",{className:O.viewport,role:"presentation",children:[t.map(xe),r]}),W!==void 0&&W.length>0&&(0,T.jsx)("div",{className:O.footer,role:"presentation",children:W.map(xe)})]});return(0,T.jsxs)("span",{ref:k,className:B(O.root,f),onPointerEnter:x?l:void 0,onPointerLeave:x?()=>{e&&J()}:void 0,children:[n,w?ve!==!1&&(0,dt.createPortal)(ve,document.body):ve]})}var ct=require("react"),pt=require("react-dom");var X={root:"dshpi_b97756f9_root",mask:"dshpi_b97756f9_mask",dialog:"dshpi_b97756f9_dialog",content:"dshpi_b97756f9_content",header:"dshpi_b97756f9_header",title:"dshpi_b97756f9_title",close:"dshpi_b97756f9_close",description:"dshpi_b97756f9_description",body:"dshpi_b97756f9_body",footer:"dshpi_b97756f9_footer"};var K=require("react/jsx-runtime");function le({open:e,onClose:n,title:t,closeLabel:r,description:s,children:a,footer:m,className:d,contentClassName:g,onKeyDownCapture:c,headless:w=!1,backdropBlur:x=!0,shortcutModal:u}){let C=(0,ct.useRef)(null);return st(C,e,n),e?(0,pt.createPortal)((0,K.jsxs)("div",{className:X.root,role:"presentation",onKeyDownCapture:c,children:[(0,K.jsx)("div",{className:X.mask,style:x?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:n}),(0,K.jsx)("div",{ref:C,tabIndex:-1,"data-shortcut-modal":u,className:B(X.dialog,d),role:"dialog","aria-modal":"true","aria-label":t,children:w?a:(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)("div",{className:B(X.content,g),children:[(0,K.jsxs)("div",{className:X.header,children:[(0,K.jsx)("h2",{className:X.title,children:t}),(0,K.jsx)("button",{type:"button",className:X.close,"aria-label":r,onClick:n,children:(0,K.jsx)(et,{size:14})})]}),s!==void 0&&s!==""&&(0,K.jsx)("p",{className:X.description,children:s}),a!==void 0&&(0,K.jsx)("div",{className:X.body,children:a})]}),m!==void 0&&(0,K.jsx)("div",{className:X.footer,children:m})]})})]}),document.body):null}var de={dot:"dshpi_34138a6f_dot",spinner:"dshpi_34138a6f_spinner",spinnerMotion:"dshpi_34138a6f_spinnerMotion",spinnerTrack:"dshpi_34138a6f_spinnerTrack",spinnerArc:"dshpi_34138a6f_spinnerArc",step:"dshpi_34138a6f_step"};var ae=require("react/jsx-runtime");function Bt(e){e!==null&&(ut(e),e.addEventListener("animationstart",()=>{ut(e)}))}function ut(e){let n=e;for(let t of n.getAnimations?.({subtree:!0})??[])t.startTime=0}function Ae({state:e,size:n,className:t,appearance:r="dot"}){let s=n??(e==="ongoing"?14:10);return e==="ongoing"?(0,ae.jsx)("svg",{ref:Bt,className:B(de.spinner,t),"data-state":"ongoing",width:s,height:s,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,ae.jsxs)("g",{className:de.spinnerMotion,children:[(0,ae.jsx)("circle",{className:de.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,ae.jsx)("circle",{className:de.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,ae.jsx)("span",{className:B(r==="step"?de.step:de.dot,t),"data-state":e,style:{width:s,height:s},"aria-hidden":"true",children:r==="step"&&e==="done"&&(0,ae.jsx)(We,{size:s-2})})}var Tt=Object.freeze({status:"idle",entries:[],integrations:[],services:[],error:!1}),Re=class{constructor(n){this.connection=n,this.state=Tt,this.listeners=new Set,this.pending=void 0,this.closed=!1,this.tickets=new Set}getSnapshot=()=>this.state;subscribe=n=>(this.listeners.add(n),()=>this.listeners.delete(n));publish(n){if(!this.closed){this.state=n;for(let t of this.listeners)t()}}async call(n,t={},r){let s=await this.connection.rpc.call("/api",`dsh-pi-login/${n}`,t,r);if(!s.ok)throw new Error(s.error.code);return s.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let n={abort:new AbortController};return n.promise=this.call("connection-list",{},n.abort.signal).then(t=>{this.pending===n&&this.publish({status:"ready",...t,entries:t.connections??[],error:!1})},()=>{this.pending===n&&this.publish({...this.state,status:"ready",error:!0})}).finally(()=>{this.pending===n&&(this.pending=void 0)}),this.pending=n,this.publish({...this.state,status:"loading",error:!1}),n.promise}refresh(){let n=this.pending;return this.pending=void 0,n?.abort.abort(),this.load()}mutation(n,t={},r){let{profileKey:s,generation:a}=this.state;return this.call(n,{...t,profileKey:s,generation:a},r)}async start(n,t){let r=await this.mutation("start",{connectionId:n,method:t});if(typeof r.ticket!="string")throw new Error("invalid ticket");if(this.closed)throw await this.mutation("cancel",r),new Error("disposed");return this.tickets.add(r.ticket),r.ticket}async cancel(n){this.tickets.delete(n);try{await this.mutation("cancel",{ticket:n})}finally{await this.refresh()}}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear();for(let n of this.tickets)this.mutation("cancel",{ticket:n}).catch(()=>{});this.tickets.clear()}};var Vt="dsh-pi-login:update",He=class{constructor(n,t){if(t===void 0)try{t=globalThis.sessionStorage}catch{}this.connection=n,this.storage=t,this.listeners=new Set,this.state={status:"blocked",reason:"manager-unavailable"},this.generation=0,this.closed=!1,this.timer=null,this.profileKey=void 0,this.requestId=void 0}getSnapshot=()=>this.state;subscribe=n=>(this.listeners.add(n),()=>this.listeners.delete(n));storageKey(){return this.profileKey?`${Vt}:${this.profileKey}`:void 0}selectProfile(n){let t=typeof n=="string"&&/^[a-f0-9]{64}$/.test(n)?n:void 0;if(t!==this.profileKey&&(this.profileKey=t,this.requestId=void 0,t))try{this.requestId=this.storage?.getItem(this.storageKey())||void 0}catch{}}publish(n){if(!this.closed){n.profileKey&&this.selectProfile(n.profileKey),this.state=n;for(let t of this.listeners)t()}}async call(n,t={}){if(!this.connection)return{status:"blocked",reason:"manager-unavailable"};let r=await this.connection.rpc.call("/api",`dsh-pi-login/update-${n}`,t);if(!r.ok){let s=new Error(r.error.code);throw s.rejected=!0,s}return r.value}async load(){if(this.closed)return;let n=++this.generation;clearTimeout(this.timer);try{let t=await this.call("status");if(this.closed||n!==this.generation)return;this.selectProfile(t.profileKey),t.requestId&&(this.requestId=t.requestId);let r=this.requestId?await this.call("reconcile",{requestId:this.requestId,profileKey:this.profileKey}):t;if(this.closed||n!==this.generation)return;if(r.requestId){this.requestId=r.requestId;try{this.storage?.setItem(this.storageKey(),r.requestId)}catch{}}this.publish(r),["preparing","installing"].includes(r.status)&&(this.timer=setTimeout(()=>{this.load()},800))}catch{n===this.generation&&this.publish({...this.state,status:this.requestId?"unknown":"blocked",reason:"network"})}}async check(){if(this.closed||["checking","preparing","installing","starting","unknown"].includes(this.state.status))return;let n=++this.generation;this.publish({...this.state,status:"checking"});try{let t=await this.call("check");n===this.generation&&this.publish(t)}catch{n===this.generation&&this.publish({...this.state,status:"blocked",reason:"network"})}}async begin(){if(this.closed||!this.profileKey||this.state.status!=="available")return;let n=this.state.candidate,t=++this.generation;this.requestId=crypto.randomUUID();try{this.storage?.setItem(this.storageKey(),this.requestId)}catch{}this.publish({...this.state,status:"starting"});try{let r=await this.call("begin",{candidateId:n.id,requestId:this.requestId,profileKey:this.profileKey});if(this.closed||t!==this.generation)return;if(typeof r.requestId!="string")throw new Error("invalid request");this.requestId=r.requestId;try{this.storage?.setItem(this.storageKey(),r.requestId)}catch{}t===this.generation&&(this.publish({...this.state,...r}),await this.load())}catch(r){if(this.closed||t!==this.generation)return;if(r.rejected){this.requestId=void 0;try{this.storage?.removeItem(this.storageKey())}catch{}}t===this.generation&&this.publish({...this.state,status:r.rejected?"failed":"unknown",reason:r.message.endsWith("/busy")?"busy":r.message.endsWith("/profile")?"profile":"network"})}}dispose(){this.closed=!0,this.generation++,clearTimeout(this.timer),this.listeners.clear()}};var j={updateReason_storage:"Could not write the update files to the profile.",updateReason_interrupted:"The download was interrupted before installation. Check again.",updateTitle:"Pi plugin",updateIdle:"Check for a plugin release separately from the model catalog.",updateChecking:"Checking for updates\u2026",updateCurrent:"No newer stable release.",updateAvailable:"A plugin update is available. Your saved credentials and model choices are kept.",updateBlocked:"The update could not be checked or is unavailable.",updatePreparing:"Downloading and verifying the release\u2026",updateInstalling:"Installing the plugin\u2026",updateRestart:"Installed. Restart DSH when your current work is finished to apply the update.",updateApplied:"The updated plugin version is running.",updateFailed:"Update failed. Review the stage below and check again.",updateCancelled:"The installer confirmed cancellation.",updateOverridden:"Saved settings prevent the update from applying.",updateUnknown:"The installation result is unknown. Reconcile the operation before starting another update.",updateCheck:"Check plugin update",updateInstall:"Update plugin",updateReconcile:"Check installation result",updateManual:"Releases / manual update",updateChecked:"Last checked",updateStage:"Installer stage","updateReason_manager-unavailable":"Plugin manager or writable profile is unavailable. Use the Releases page.","updateReason_read-only":"This bundle is not writable in the active profile.",updateReason_source:"This installation source requires a manual update. Its version pin will be preserved.",updateReason_incompatible:"The release does not support this DSH version.","updateReason_compatibility-unknown":"The release compatibility could not be confirmed.",updateReason_busy:"Finish sign-in and settings saves before updating.",updateReason_profile:"The connected profile changed. Check again.",updateReason_network:"Could not contact the release service. Try again later.",updateReason_metadata:"Release metadata is invalid. Use the release link to review it.",updateReason_asset:"The required release assets are missing or ambiguous.",updateReason_channel:"This update accepts stable releases only.",updateReason_checksum:"Release checksum verification failed.",updateReason_redirect:"The release redirected to an unapproved host.",updateReason_size:"The release exceeded its download size limit.","updateReason_stale-candidate":"The release or installation changed. Check again.","updateReason_release-unavailable":"The release service returned no accessible release.",metaRateLimited:"Meta limited the account check. Wait before trying again.",reloadModels:"Update model list",catalogRefreshUnsupported:"Model list refresh is not supported for this provider yet. Update the plugin or SDK to get new models.",catalogRefreshFailed:"Could not update the model list. Try again or sign in again if needed.",metaSubscriptionActive:"Muse subscription active",metaSubscriptionInactive:"Muse subscription inactive",metaSubscriptionUnknown:"Muse subscription could not be confirmed",metaReloadHint:"Checks your Muse subscription and fetches its model list. New models start off. This does not test generation or Contributor billing. Reload again after restarting.",metaContributorHint:"Review Meta\u2019s Contributor data-use terms before enabling a Contributor model.",capabilitiesUnknown:"Capabilities not supplied: text only, provider-default reasoning, configured token limits.",metaLoginRequired:"Sign in to Meta with your Muse account first.",metaKeyOverride:"An API-key reference overrides your Muse login. Choose \u201CUse saved credentials\u201D or remove that reference first.",metaSettingsIncompatible:"Muse account reload requires the default Meta endpoint and saved login, without an Authorization header override.",metaAccountChanged:"Your Meta account changed during reload. Reload again.",useLogin:"Use saved credentials",keyOverride:"The configured API-key reference takes priority.",models:"Models",manageModels:"Choose models",useProvider:"Use this provider",searchModels:"Search models",fastWarning:"Fast mode uses paid priority processing or additional subscription credits. Availability depends on your account and model.",modelEnabled:"Use model",loading:"Loading\u2026",modelsFailed:"Could not load the models.",saveFailed:"Could not save settings. Try again.",modelsHint:"When the provider is on, selected models are available to chats and agents.",noResults:"No matching models.",disabledHint:"Turning this off keeps your credentials and model choices.",activateFirst:"Enable the provider before choosing models.",title:"Pi connections",description:"Choose a provider and sign-in method.",provider:"Provider",method:"Sign-in method",oauth:"Browser sign-in",apiKey:"API key",signIn:"Sign in",signInAgain:"Sign in again",connected:"Connected",notConnected:"Not connected",busy:"Signing in\u2026",openBrowser:"Continue in browser",code:"Verification code",copy:"Copy code",copied:"Copied",cancel:"Cancel",close:"Close",submit:"Continue",success:"Signed in",successDescription:"Your credentials are saved in DeepSeek Harness.",enable:"Enable provider",enabled:"Provider enabled.",failed:"Sign-in failed. Sign in again.",cancelled:"Sign-in cancelled. Sign in again.",providerExpired:"The verification code expired. Sign in again.",timedOut:"Sign-in timed out. Sign in again.",loadFailed:"Could not load the providers.",retry:"Retry",empty:"No Pi sign-in providers are available.",answer:"Enter the requested value",secret:"Enter your API key",selection:"Choose an option",enableFailed:"Signed in, but the provider could not be enabled. Try again.",waiting:"Complete the sign-in in your browser.",readOnly:"Credentials are read-only in this environment."},Q={updateReason_storage:"profile\u5185\u306B\u66F4\u65B0\u7528\u30D5\u30A1\u30A4\u30EB\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_interrupted:"\u5C0E\u5165\u524D\u306E\u53D6\u5F97\u51E6\u7406\u304C\u4E2D\u65AD\u3055\u308C\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateTitle:"Pi\u30D7\u30E9\u30B0\u30A4\u30F3",updateIdle:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3068\u306F\u5225\u306B\u3001\u30D7\u30E9\u30B0\u30A4\u30F3\u672C\u4F53\u306E\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",updateChecking:"\u66F4\u65B0\u3092\u78BA\u8A8D\u4E2D\u2026",updateCurrent:"\u65B0\u3057\u3044\u6B63\u5F0F\u7248\u306F\u3042\u308A\u307E\u305B\u3093\u3002",updateAvailable:"\u66F4\u65B0\u304C\u3042\u308A\u307E\u3059\u3002\u4FDD\u5B58\u6E08\u307F\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateBlocked:"\u66F4\u65B0\u3092\u78BA\u8A8D\u3067\u304D\u306A\u3044\u304B\u3001\u3053\u306E\u74B0\u5883\u3067\u306F\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002",updatePreparing:"\u914D\u5E03\u7269\u3092\u53D6\u5F97\u30FB\u691C\u8A3C\u4E2D\u2026",updateInstalling:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u4E2D\u2026",updateRestart:"\u5C0E\u5165\u3057\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u4F5C\u696D\u3092\u7D42\u3048\u3066\u304B\u3089DSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u9069\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateApplied:"\u66F4\u65B0\u3057\u305F\u30D7\u30E9\u30B0\u30A4\u30F3\u304C\u52D5\u4F5C\u3057\u3066\u3044\u307E\u3059\u3002",updateFailed:"\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u5931\u6557\u6BB5\u968E\u3092\u78BA\u8A8D\u3057\u3066\u518D\u5EA6\u66F4\u65B0\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCancelled:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30E9\u30FC\u304C\u53D6\u6D88\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",updateOverridden:"\u4FDD\u5B58\u8A2D\u5B9A\u306B\u3088\u308A\u66F4\u65B0\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3002",updateUnknown:"\u5C0E\u5165\u7D50\u679C\u306F\u4E0D\u660E\u3067\u3059\u3002\u518D\u9001\u305B\u305A\u3001\u7D50\u679C\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateCheck:"\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u66F4\u65B0\u3092\u78BA\u8A8D",updateInstall:"\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u66F4\u65B0\u3059\u308B",updateReconcile:"\u5C0E\u5165\u7D50\u679C\u3092\u78BA\u8A8D",updateManual:"\u914D\u5E03\u7248\u30FB\u624B\u52D5\u66F4\u65B0",updateChecked:"\u78BA\u8A8D\u6642\u523B",updateStage:"\u5C0E\u5165\u6BB5\u968E","updateReason_manager-unavailable":"plugin manager\u307E\u305F\u306F\u66F8\u304D\u8FBC\u307F\u53EF\u80FD\u306Aprofile\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u304B\u3089\u624B\u52D5\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_read-only":"\u3053\u306Eprofile\u3067\u306Fbundle\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_source:"\u3053\u306E\u5C0E\u5165\u5143\u306F\u624B\u52D5\u66F4\u65B0\u304C\u5FC5\u8981\u3067\u3059\u3002\u7248\u56FA\u5B9A\u306F\u7DAD\u6301\u3057\u307E\u3059\u3002",updateReason_incompatible:"\u3053\u306E\u914D\u5E03\u7248\u306F\u5B9F\u884C\u4E2D\u306EDSH\u7248\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","updateReason_compatibility-unknown":"\u914D\u5E03\u7248\u306EDSH\u4E92\u63DB\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",updateReason_busy:"\u30ED\u30B0\u30A4\u30F3\u3068\u8A2D\u5B9A\u4FDD\u5B58\u3092\u5B8C\u4E86\u3057\u3066\u304B\u3089\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_profile:"\u63A5\u7D9A\u4E2D\u306E\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_network:"\u914D\u5E03\u30B5\u30FC\u30D3\u30B9\u3068\u306E\u901A\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_metadata:"\u914D\u5E03\u60C5\u5831\u304C\u4E0D\u6B63\u3067\u3059\u3002\u914D\u5E03\u30DA\u30FC\u30B8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_asset:"\u5FC5\u8981\u306A\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u306A\u3044\u304B\u3001\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002",updateReason_channel:"\u3053\u306E\u66F4\u65B0\u6A5F\u80FD\u306F\u6B63\u5F0F\u7248\u306E\u307F\u6271\u3044\u307E\u3059\u3002",updateReason_checksum:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u306E\u30C1\u30A7\u30C3\u30AF\u30B5\u30E0\u691C\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",updateReason_redirect:"\u914D\u5E03\u53D6\u5F97\u5148\u304C\u8A31\u53EF\u3057\u3066\u3044\u306A\u3044\u30DB\u30B9\u30C8\u306B\u8EE2\u9001\u3055\u308C\u307E\u3057\u305F\u3002",updateReason_size:"\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u53D6\u5F97\u30B5\u30A4\u30BA\u4E0A\u9650\u3092\u8D85\u3048\u307E\u3057\u305F\u3002","updateReason_stale-candidate":"\u914D\u5E03\u60C5\u5831\u307E\u305F\u306F\u5C0E\u5165\u72B6\u614B\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_release-unavailable":"\u53D6\u5F97\u3067\u304D\u308B\u914D\u5E03\u7248\u304C\u3042\u308A\u307E\u305B\u3093\u3002",metaRateLimited:"Meta\u306E\u5951\u7D04\u78BA\u8A8D\u304C\u56DE\u6570\u5236\u9650\u306B\u9054\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",reloadModels:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0",catalogRefreshUnsupported:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306F\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u518D\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC\u3067\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u30D7\u30E9\u30B0\u30A4\u30F3\u307E\u305F\u306FSDK\u306E\u66F4\u65B0\u3067\u8FFD\u52A0\u3055\u308C\u307E\u3059\u3002",catalogRefreshFailed:"\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3059\u308B\u304B\u3001\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30ED\u30B0\u30A4\u30F3\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSubscriptionActive:"Muse\u5951\u7D04\u306F\u6709\u52B9\u3067\u3059",metaSubscriptionInactive:"Muse\u5951\u7D04\u306F\u7121\u52B9\u3067\u3059",metaSubscriptionUnknown:"Muse\u5951\u7D04\u306E\u6709\u52B9\u6027\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",metaReloadHint:"\u5951\u7D04\u3092\u78BA\u8A8D\u3057\u3066\u30E2\u30C7\u30EB\u4E00\u89A7\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\u65B0\u30E2\u30C7\u30EB\u306F\u6700\u521D\u306F\u30AA\u30D5\u3067\u3059\u3002\u751F\u6210\u3084Contributor\u5229\u7528\u67A0\u306E\u691C\u8A3C\u306F\u884C\u3044\u307E\u305B\u3093\u3002\u518D\u8D77\u52D5\u5F8C\u306F\u518D\u8AAD\u307F\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059\u3002",metaContributorHint:"Contributor\u3092\u6709\u52B9\u306B\u3059\u308B\u524D\u306B\u3001Meta\u306E\u30C7\u30FC\u30BF\u5229\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",capabilitiesUnknown:"\u80FD\u529B\u60C5\u5831\u306A\u3057\uFF1A\u30C6\u30AD\u30B9\u30C8\u306E\u307F\u3001\u63A8\u8AD6\u306F\u63A5\u7D9A\u5148\u306E\u65E2\u5B9A\u5024\u3001\u30C8\u30FC\u30AF\u30F3\u4E0A\u9650\u306F\u8A2D\u5B9A\u5024\u3092\u4F7F\u7528\u3002",metaLoginRequired:"\u5148\u306BMuse\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067Meta\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaKeyOverride:"API\u30AD\u30FC\u53C2\u7167\u304CMuse\u30ED\u30B0\u30A4\u30F3\u3088\u308A\u512A\u5148\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u300C\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046\u300D\u3092\u9078\u3076\u304B\u3001\u53C2\u7167\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaSettingsIncompatible:"Muse\u5951\u7D04\u306E\u518D\u8AAD\u307F\u8FBC\u307F\u306B\u306F\u3001Meta\u306E\u6A19\u6E96\u63A5\u7D9A\u5148\u3068\u4FDD\u5B58\u6E08\u307F\u30ED\u30B0\u30A4\u30F3\u3092\u4F7F\u3044\u3001Authorization\u30D8\u30C3\u30C0\u30FC\u306E\u4E0A\u66F8\u304D\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",metaAccountChanged:"\u518D\u8AAD\u307F\u8FBC\u307F\u4E2D\u306BMeta\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u518D\u5EA6\u8AAD\u307F\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002",useLogin:"\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u3092\u4F7F\u3046",keyOverride:"\u8A2D\u5B9A\u6E08\u307F\u306EAPI\u30AD\u30FC\u53C2\u7167\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002",models:"\u30E2\u30C7\u30EB",manageModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",useProvider:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",searchModels:"\u30E2\u30C7\u30EB\u3092\u691C\u7D22",fastWarning:"Fast\u30E2\u30FC\u30C9\u306F\u901A\u5E38\u3088\u308A\u9AD8\u3044\u6599\u91D1\u30FB\u30AF\u30EC\u30B8\u30C3\u30C8\u6D88\u8CBB\u304C\u767A\u751F\u3057\u307E\u3059\u3002\u5229\u7528\u53EF\u5426\u306F\u30E2\u30C7\u30EB\u3068\u5951\u7D04\u306B\u3088\u308A\u307E\u3059\u3002",modelEnabled:"\u30E2\u30C7\u30EB\u3092\u4F7F\u3046",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",modelsFailed:"\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",noResults:"\u4E00\u81F4\u3059\u308B\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002",disabledHint:"\u30AA\u30D5\u306B\u3057\u3066\u3082\u8A8D\u8A3C\u60C5\u5831\u3068\u30E2\u30C7\u30EB\u306E\u9078\u629E\u306F\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",activateFirst:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",title:"Pi\u63A5\u7D9A",description:"\u63A5\u7D9A\u5148\u3068\u30ED\u30B0\u30A4\u30F3\u65B9\u6CD5\u3092\u9078\u3073\u307E\u3059\u3002",provider:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",method:"\u63A5\u7D9A\u65B9\u6CD5",oauth:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3",apiKey:"API\u30AD\u30FC",signIn:"\u30ED\u30B0\u30A4\u30F3",signInAgain:"\u518D\u30ED\u30B0\u30A4\u30F3",connected:"\u63A5\u7D9A\u6E08\u307F",notConnected:"\u672A\u63A5\u7D9A",busy:"\u30ED\u30B0\u30A4\u30F3\u4E2D\u2026",openBrowser:"\u30D6\u30E9\u30A6\u30B6\u3067\u7D9A\u3051\u308B",code:"\u8A8D\u8A3C\u30B3\u30FC\u30C9",copy:"\u30B3\u30FC\u30C9\u3092\u30B3\u30D4\u30FC",copied:"\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",close:"\u9589\u3058\u308B",submit:"\u7D9A\u3051\u308B",success:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F",successDescription:"\u8A8D\u8A3C\u60C5\u5831\u3092DeepSeek Harness\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",enable:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",failed:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cancelled:"\u30ED\u30B0\u30A4\u30F3\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",providerExpired:"\u8A8D\u8A3C\u30B3\u30FC\u30C9\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",timedOut:"\u30ED\u30B0\u30A4\u30F3\u306E\u5F85\u6A5F\u6642\u9593\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loadFailed:"\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",retry:"\u518D\u8A66\u884C",empty:"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u308BPi\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093\u3002",answer:"\u8981\u6C42\u3055\u308C\u305F\u5024\u3092\u5165\u529B",secret:"API\u30AD\u30FC\u3092\u5165\u529B",selection:"\u9805\u76EE\u3092\u9078\u629E",enableFailed:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u304C\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",waiting:"\u30D6\u30E9\u30A6\u30B6\u3067\u30ED\u30B0\u30A4\u30F3\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044\u3002",readOnly:"\u3053\u306E\u74B0\u5883\u3067\u306F\u8A8D\u8A3C\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3002"};Object.assign(j,{title:"AI connections & usage",description:"Manage each account and its models. Open usage details when needed.",connectionsTab:"Connections & models",usageTab:"Usage",addConnection:"Add connection",connectionSettings:"Connection settings",manageModels:"Manage models",searchConnections:"Search connections",filterStatus:"Status",filter_all:"All",filter_connected:"Connected",filter_disconnected:"Not connected",integration:"Integration",service:"Service",connectionName:"Connection name",namePlaceholder:"Personal Pro / Company API",oauthShort:"OAuth",endpoint:"Endpoint URL (optional)",protocol:"Protocol",oauthHint:"Sign in to this account in the browser. Credentials stay within this connection.",save:"Save",saved:"Connection settings saved.",confirmSave:"Confirm change and save",methodChangeWarning:"Changing the sign-in method changes the account or billing used by this connection. Confirm before saving.",cloneConnection:"Duplicate settings",copySuffix:"copy",deleteConnection:"Delete connection",confirmDelete:"Delete this connection",deleteWarning:"Delete this connection and its saved credentials? Its models will no longer be available.",keySaved:"A key is saved. Leave this field empty to keep it. The saved key is never displayed.",showSecret:"Show input",hideSecret:"Hide input",paste:"Paste",pasteFailed:"Clipboard access was unavailable. Paste directly into the field.",availableModels:"Models enabled",authExpired:"Sign-in expired",externalSettings:"Open integration settings",refreshUsage:"Refresh usage",usageFailed:"Could not refresh usage. The last available reading is kept.",usage_available:"Account usage",usage_unobserved:"Not observed yet",usage_unsupported:"Usage is not supported",usage_unknown:"Usage is unknown",usage_unavailable:"Usage is unavailable",usage_auth_required:"Sign in to check usage","usage_auth-required":"Sign in to check usage",usage_stale:"Last reading is out of date","usage_rate-limited":"Rate limited. Retry after the time below.",usage_error:"Usage could not be checked",quota_unlimited:"Unlimited",quota_unavailable:"Limit unavailable",quota_unallocated:"No quota allocated",quota_unknown:"Amount unknown",used:"used",remaining:"Remaining",estimated:"Estimated",unit_credits:"credits",unit_requests:"requests",resets:"Resets",resetDate:"Reset date (time not supplied)",retryAt:"Retry after",observedAt:"Last observed",checkedAt:"Last checked",lastObserved:"Recorded from a prior response. Opening this screen does not run a generation.",endpointUntrusted:"This endpoint is not trusted by the host. Add it to the host allowlist before saving.",serviceUnavailable:"This integration does not provide a supported model connection in this DSH version.",cloneHint:"The copy starts disabled and has no credentials. Configure its account separately."});Object.assign(Q,{title:"AI\u63A5\u7D9A\u30FB\u5229\u7528\u72B6\u6CC1",description:"\u30A2\u30AB\u30A6\u30F3\u30C8\u3054\u3068\u306B\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB\u3092\u7BA1\u7406\u3057\u307E\u3059\u3002\u5229\u7528\u72B6\u6CC1\u306F\u5FC5\u8981\u306A\u3068\u304D\u306B\u958B\u3051\u307E\u3059\u3002",connectionsTab:"\u63A5\u7D9A\u3068\u30E2\u30C7\u30EB",usageTab:"\u5229\u7528\u72B6\u6CC1",addConnection:"\u63A5\u7D9A\u3092\u8FFD\u52A0",connectionSettings:"\u63A5\u7D9A\u8A2D\u5B9A",manageModels:"\u30E2\u30C7\u30EB\u3092\u7BA1\u7406",searchConnections:"\u63A5\u7D9A\u3092\u691C\u7D22",filterStatus:"\u63A5\u7D9A\u72B6\u614B",filter_all:"\u3059\u3079\u3066",filter_connected:"\u63A5\u7D9A\u6E08\u307F",filter_disconnected:"\u672A\u63A5\u7D9A",integration:"\u9023\u643A",service:"\u30B5\u30FC\u30D3\u30B9",connectionName:"\u63A5\u7D9A\u540D",namePlaceholder:"\u500B\u4EBAPro\u30FB\u4F1A\u793EAPI\u306A\u3069",oauthShort:"OAuth",endpoint:"\u63A5\u7D9A\u5148URL\uFF08\u4EFB\u610F\uFF09",protocol:"\u901A\u4FE1\u65B9\u5F0F",oauthHint:"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u3067\u30D6\u30E9\u30A6\u30B6\u304B\u3089\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3059\u3002\u8A8D\u8A3C\u60C5\u5831\u306F\u63A5\u7D9A\u3054\u3068\u306B\u4FDD\u5B58\u3057\u307E\u3059\u3002",save:"\u4FDD\u5B58",saved:"\u63A5\u7D9A\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",confirmSave:"\u5909\u66F4\u3092\u78BA\u8A8D\u3057\u3066\u4FDD\u5B58",methodChangeWarning:"\u8A8D\u8A3C\u65B9\u5F0F\u3092\u5909\u3048\u308B\u3068\u3001\u3053\u306E\u63A5\u7D9A\u3067\u4F7F\u3046\u30A2\u30AB\u30A6\u30F3\u30C8\u3084\u8AB2\u91D1\u5148\u304C\u5909\u308F\u308A\u307E\u3059\u3002\u78BA\u8A8D\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",cloneConnection:"\u8A2D\u5B9A\u3092\u8907\u88FD",copySuffix:"\u30B3\u30D4\u30FC",deleteConnection:"\u63A5\u7D9A\u3092\u524A\u9664",confirmDelete:"\u3053\u306E\u63A5\u7D9A\u3092\u524A\u9664\u3059\u308B",deleteWarning:"\u3053\u306E\u63A5\u7D9A\u3068\u4FDD\u5B58\u6E08\u307F\u306E\u8A8D\u8A3C\u60C5\u5831\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F\u3053\u306E\u63A5\u7D9A\u306E\u30E2\u30C7\u30EB\u306F\u5229\u7528\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059\u3002",keySaved:"\u30AD\u30FC\u306F\u4FDD\u5B58\u6E08\u307F\u3067\u3059\u3002\u5909\u66F4\u3057\u306A\u3044\u5834\u5408\u306F\u7A7A\u6B04\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u4FDD\u5B58\u6E08\u307F\u306E\u30AD\u30FC\u306F\u8868\u793A\u3057\u307E\u305B\u3093\u3002",showSecret:"\u5165\u529B\u3092\u8868\u793A",hideSecret:"\u5165\u529B\u3092\u96A0\u3059",paste:"\u8CBC\u308A\u4ED8\u3051",pasteFailed:"\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u5165\u529B\u6B04\u306B\u76F4\u63A5\u8CBC\u308A\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044\u3002",availableModels:"\u30E2\u30C7\u30EB\u6709\u52B9",authExpired:"\u8A8D\u8A3C\u5207\u308C",externalSettings:"\u9023\u643A\u5143\u306E\u8A2D\u5B9A\u3092\u958B\u304F",refreshUsage:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0",usageFailed:"\u5229\u7528\u72B6\u6CC1\u3092\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u524D\u56DE\u306E\u53D6\u5F97\u7D50\u679C\u3092\u4FDD\u6301\u3057\u3066\u3044\u307E\u3059\u3002",usage_available:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u72B6\u6CC1",usage_unobserved:"\u307E\u3060\u89B3\u6E2C\u3057\u3066\u3044\u307E\u305B\u3093",usage_unsupported:"\u5229\u7528\u72B6\u6CC1\u306E\u53D6\u5F97\u306B\u672A\u5BFE\u5FDC",usage_unknown:"\u5229\u7528\u72B6\u6CC1\u306F\u4E0D\u660E\u3067\u3059",usage_unavailable:"\u5229\u7528\u72B6\u6CC1\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093",usage_auth_required:"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059","usage_auth-required":"\u5229\u7528\u72B6\u6CC1\u306E\u78BA\u8A8D\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059",usage_stale:"\u524D\u56DE\u306E\u60C5\u5831\u3067\u3059\u3002\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044","usage_rate-limited":"\u53D6\u5F97\u56DE\u6570\u306E\u5236\u9650\u4E2D\u3067\u3059\u3002\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",usage_error:"\u5229\u7528\u72B6\u6CC1\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",quota_unlimited:"\u7121\u5236\u9650",quota_unavailable:"\u5229\u7528\u67A0\u306F\u4E0D\u660E",quota_unallocated:"\u5229\u7528\u67A0\u306E\u5272\u5F53\u306A\u3057",quota_unknown:"\u4F7F\u7528\u91CF\u306F\u4E0D\u660E",used:"\u4F7F\u7528",remaining:"\u6B8B\u91CF",estimated:"\u63A8\u5B9A",unit_credits:"\u30AF\u30EC\u30B8\u30C3\u30C8",unit_requests:"\u30EA\u30AF\u30A8\u30B9\u30C8",resets:"\u30EA\u30BB\u30C3\u30C8\u6642\u523B",resetDate:"\u30EA\u30BB\u30C3\u30C8\u65E5\uFF08\u6642\u523B\u306E\u60C5\u5831\u306A\u3057\uFF09",retryAt:"\u518D\u8A66\u884C\u53EF\u80FD\u6642\u523B",observedAt:"\u6700\u7D42\u89B3\u6E2C\u6642\u523B",checkedAt:"\u6700\u7D42\u53D6\u5F97\u6642\u523B",lastObserved:"\u904E\u53BB\u306E\u5FDC\u7B54\u3067\u89B3\u6E2C\u3057\u305F\u60C5\u5831\u3067\u3059\u3002\u3053\u306E\u753B\u9762\u3092\u958B\u3044\u3066\u3082\u751F\u6210\u306F\u884C\u3044\u307E\u305B\u3093\u3002",endpointUntrusted:"\u3053\u306E\u63A5\u7D9A\u5148\u306F\u30DB\u30B9\u30C8\u3067\u8A31\u53EF\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u30DB\u30B9\u30C8\u306E\u8A31\u53EF\u30EA\u30B9\u30C8\u306B\u8FFD\u52A0\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",serviceUnavailable:"\u3053\u306EDSH\u7248\u3067\u306F\u3001\u3053\u306E\u9023\u643A\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002",cloneHint:"\u8907\u88FD\u3057\u305F\u63A5\u7D9A\u306F\u7121\u52B9\u30FB\u8A8D\u8A3C\u306A\u3057\u3067\u4F5C\u6210\u3057\u307E\u3059\u3002\u30A2\u30AB\u30A6\u30F3\u30C8\u306F\u5225\u306B\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(j,{hours:"hours",days:"days",minutes:"minutes",accountQuota:"Account quota",unit_tokens:"tokens",unit_USD:"USD",ownerManaged:"Managed by integration",directory_live:"Available",directory_declared:"Declared",directory_unavailable:"Unavailable",sourceUnknown:"Owner unknown","serviceUnavailable_muse-code-bridge-unverified":"Muse Code requires the official CLI and a supported agent session connection in this environment. It is separate from the Meta Model API through Pi."});Object.assign(Q,{hours:"\u6642\u9593",days:"\u65E5",minutes:"\u5206",accountQuota:"\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u5229\u7528\u67A0",unit_tokens:"\u30C8\u30FC\u30AF\u30F3",unit_USD:"USD",ownerManaged:"\u9023\u643A\u5143\u3067\u7BA1\u7406",directory_live:"\u5229\u7528\u53EF\u80FD",directory_declared:"\u8A2D\u5B9A\u3042\u308A",directory_unavailable:"\u5229\u7528\u4E0D\u53EF",sourceUnknown:"\u7BA1\u7406\u5143\u4E0D\u660E","serviceUnavailable_muse-code-bridge-unverified":"Muse Code\u306B\u306F\u516C\u5F0FCLI\u3068\u3001\u3053\u306E\u74B0\u5883\u3067\u5BFE\u5FDC\u3059\u308B\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u63A5\u7D9A\u304C\u5FC5\u8981\u3067\u3059\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u306E\u9023\u643A\u3067\u3059\u3002"});Object.assign(j,{museModels:"Muse Code model",museSessionHint:"Muse Code runs independent agent sessions. These models are separate from Pi\u2019s Meta Model API and are not added to the standard DSH model list.",museCatalogDiagnostic:"The host supplied a diagnostic catalog without a supported session model. Model availability does not confirm your account entitlement.",agentSessionEnabled:"Agent connection enabled","error_muse-code-cli-required":"Install the official Muse Code CLI and supported MSP SDK on the host, then retry.","error_muse-code-protocol-unsupported":"This Muse Code CLI does not support account or settings management. Update the official CLI.","error_muse-code-login-required":"Sign in to this Muse Code connection first.","error_muse-code-login-failed":"Muse Code sign-in did not complete. Retry from this connection\u2019s settings.","error_muse-code-mode-unavailable":"This account or CLI could not apply the selected model.","error_muse-code-connection-changed":"The Muse Code connection changed. Close this panel and open it again.","error_muse-code-busy":"Muse Code is already performing an operation. Retry after it finishes.","error_muse-code-model-unavailable":"This model was not advertised by the current Muse Code host. Reload the panel.","error_muse-code-unavailable":"Muse Code is unavailable. Check the official CLI and this connection\u2019s sign-in.","error_muse-code-llm-unsupported":"This Muse Code host does not provide a standard DSH model bridge.","error_muse-code-session-failed":"The Muse Code agent session failed. Check this connection and retry."});Object.assign(Q,{museModels:"Muse Code\u306E\u30E2\u30C7\u30EB",museSessionHint:"Muse Code\u306F\u72EC\u7ACB\u3057\u305F\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u3067\u3059\u3002Pi\u7D4C\u7531\u306EMeta Model API\u3068\u306F\u5225\u3067\u3001DSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u4E00\u89A7\u306B\u306F\u8FFD\u52A0\u3057\u307E\u305B\u3093\u3002",museCatalogDiagnostic:"\u3053\u306E\u30DB\u30B9\u30C8\u306E\u4E00\u89A7\u306F\u78BA\u8A8D\u7528\u3067\u3001\u5BFE\u5FDC\u3059\u308B\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u30E2\u30C7\u30EB\u4E00\u89A7\u306E\u53D6\u5F97\u3060\u3051\u3067\u306F\u5951\u7D04\u306B\u3088\u308B\u5229\u7528\u53EF\u5426\u306F\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",agentSessionEnabled:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u63A5\u7D9A\u6709\u52B9","error_muse-code-cli-required":"\u30DB\u30B9\u30C8\u306B\u516C\u5F0FMuse Code CLI\u3068\u5BFE\u5FDC\u3059\u308BMSP SDK\u3092\u5C0E\u5165\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-protocol-unsupported":"\u3053\u306EMuse Code CLI\u306F\u30A2\u30AB\u30A6\u30F3\u30C8\u30FB\u8A2D\u5B9A\u7BA1\u7406\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-required":"\u5148\u306B\u3053\u306EMuse Code\u63A5\u7D9A\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-login-failed":"Muse Code\u306E\u30ED\u30B0\u30A4\u30F3\u304C\u5B8C\u4E86\u3057\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u306E\u8A2D\u5B9A\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-mode-unavailable":"\u3053\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u307E\u305F\u306FCLI\u3067\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002","error_muse-code-connection-changed":"Muse Code\u63A5\u7D9A\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u3053\u306E\u753B\u9762\u3092\u9589\u3058\u3066\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-busy":"Muse Code\u306E\u51E6\u7406\u4E2D\u3067\u3059\u3002\u5B8C\u4E86\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-model-unavailable":"\u73FE\u5728\u306EMuse Code\u30DB\u30B9\u30C8\u306B\u3053\u306E\u30E2\u30C7\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-unavailable":"Muse Code\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u516C\u5F0FCLI\u3068\u3053\u306E\u63A5\u7D9A\u306E\u30ED\u30B0\u30A4\u30F3\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","error_muse-code-llm-unsupported":"\u3053\u306EMuse Code\u30DB\u30B9\u30C8\u306FDSH\u306E\u901A\u5E38\u306E\u30E2\u30C7\u30EB\u63A5\u7D9A\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002","error_muse-code-session-failed":"Muse Code\u306E\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(j,{authUnavailable:"Account status unavailable"});Object.assign(Q,{authUnavailable:"\u63A5\u7D9A\u72B6\u614B\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093"});Object.assign(j,{authVerified:"Sign-in verified"});Object.assign(Q,{authVerified:"\u63A5\u7D9A\u78BA\u8A8D\u6E08\u307F"});Object.assign(j,{"usageScope_muse-code-subscription-weekly":"Weekly quota","error_muse-code-observation-invalid":"The Muse Code response could not be verified. Update the official CLI and reopen this panel."});Object.assign(Q,{"usageScope_muse-code-subscription-weekly":"\u9031\u9593\u306E\u5229\u7528\u67A0","error_muse-code-observation-invalid":"Muse Code\u306E\u5FDC\u7B54\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u516C\u5F0FCLI\u3092\u66F4\u65B0\u3057\u3001\u753B\u9762\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002"});Object.assign(j,{useProvider:"Use this connection",enable:"Enable connection",enabled:"Connection enabled.",activateFirst:"Enable this connection before choosing models.",modelsHint:"When this connection is enabled, its selected models are available to chats and agents."});Object.assign(Q,{useProvider:"\u3053\u306E\u63A5\u7D9A\u3092\u4F7F\u3046",enable:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3059\u308B",enabled:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u307E\u3057\u305F\u3002",activateFirst:"\u63A5\u7D9A\u3092\u6709\u52B9\u306B\u3057\u3066\u304B\u3089\u30E2\u30C7\u30EB\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",modelsHint:"\u3053\u306E\u63A5\u7D9A\u304C\u6709\u52B9\u306A\u3068\u304D\u3001\u9078\u3093\u3060\u30E2\u30C7\u30EB\u3092\u30C1\u30E3\u30C3\u30C8\u3084\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002"});Object.assign(j,{museEntitlementUnverified:"This model appears in the catalog. Generation entitlement for this subscription has not been verified."});Object.assign(Q,{museEntitlementUnverified:"\u4E00\u89A7\u306B\u3042\u308B\u30E2\u30C7\u30EB\u3067\u3059\u3002\u3053\u306E\u5951\u7D04\u3067\u306E\u751F\u6210\u6A29\u9650\u306F\u672A\u78BA\u8A8D\u3067\u3059\u3002"});Object.assign(j,{museModelSaved:"Muse Code model saved.",museWonderOne:"Wonder1",museWonderFull:"Wonder Full"});Object.assign(Q,{museModelSaved:"Muse Code\u306E\u30E2\u30C7\u30EB\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",museWonderOne:"Wonder1",museWonderFull:"Wonder Full"});Object.assign(j,{title:"AI connections",addAndSignIn:"Add and sign in",add:"Add",advanced:"Advanced",chooseModels:"Choose models",modelsShort:"Models",modelsOn:"{count} on",modelsHint:"Models you turn on are available in chats and agents while this connection is on.",signedInReady:"Signed in. This connection is ready to use.",statusOff:"Off",keySavedPlaceholder:"Saved. Enter a new key to replace it.",emptyConnections:"No connections yet. Add one to sign in or use an API key.",deleted:"Connection deleted.",cloned:"Settings duplicated. The copy starts off and needs its own sign-in.",lastObservedShort:"From an earlier response"});Object.assign(Q,{title:"AI\u63A5\u7D9A",addAndSignIn:"\u8FFD\u52A0\u3057\u3066\u30ED\u30B0\u30A4\u30F3",add:"\u8FFD\u52A0",advanced:"\u8A73\u7D30\u8A2D\u5B9A",chooseModels:"\u30E2\u30C7\u30EB\u3092\u9078\u3076",modelsShort:"\u30E2\u30C7\u30EB",modelsOn:"{count}\u4EF6\u30AA\u30F3",modelsHint:"\u30AA\u30F3\u306B\u3057\u305F\u30E2\u30C7\u30EB\u306F\u3001\u3053\u306E\u63A5\u7D9A\u304C\u30AA\u30F3\u306E\u3068\u304D\u30C1\u30E3\u30C3\u30C8\u3068\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3067\u4F7F\u3048\u307E\u3059\u3002",signedInReady:"\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u3002\u3053\u306E\u63A5\u7D9A\u3092\u4F7F\u3048\u307E\u3059\u3002",statusOff:"\u30AA\u30D5",keySavedPlaceholder:"\u4FDD\u5B58\u6E08\u307F\u3002\u5909\u66F4\u3059\u308B\u3068\u304D\u3060\u3051\u5165\u529B",emptyConnections:"\u63A5\u7D9A\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002\u300C\u63A5\u7D9A\u3092\u8FFD\u52A0\u300D\u304B\u3089\u30ED\u30B0\u30A4\u30F3\u307E\u305F\u306FAPI\u30AD\u30FC\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",deleted:"\u63A5\u7D9A\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002",cloned:"\u8A2D\u5B9A\u3092\u8907\u88FD\u3057\u307E\u3057\u305F\u3002\u8907\u88FD\u306F\u30AA\u30D5\u30FB\u672A\u30ED\u30B0\u30A4\u30F3\u3067\u4F5C\u6210\u3055\u308C\u307E\u3059\u3002",lastObservedShort:"\u4EE5\u524D\u306E\u5FDC\u7B54\u304B\u3089"});var ht=`.dsh-pi-login { color: var(--dsw-alias-label-primary); font-family: var(--dsw-font-family); font-size: 13px; line-height: 1.6; }
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
`;var o=require("react/jsx-runtime"),ft="dsh.piLogin",Zt=["slots","locale","connection"];function Ut(e){return(0,i.useSyncExternalStore)(n=>e.subscribe(n),()=>e.getSnapshot().revision),e.bind(ft)}function Ct(e){try{let n=new URL(e);if(n.protocol==="https:"||n.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(n.hostname))return n.href}catch{}}function Ee(e,n=!1){if(!e)return;let t=new Date(e);if(Number.isNaN(t.valueOf()))return n?e:void 0;let r=document.documentElement.lang||void 0;try{return new Intl.DateTimeFormat(r,n?{dateStyle:"medium"}:{dateStyle:"medium",timeStyle:"short"}).format(t)}catch{return t.toLocaleString()}}function fe({label:e,value:n,options:t,onChange:r,disabled:s}){let[a,m]=(0,i.useState)(!1),d=(0,i.useId)();return(0,o.jsxs)("div",{className:"dsh-pi-choice",children:[(0,o.jsx)("span",{id:d,className:"dsh-pi-caption",children:e}),(0,o.jsx)(Ke,{open:a,onClose:()=>m(!1),portal:!0,selectedId:n,items:t,onSelect:g=>{r(g),m(!1)},anchor:(0,o.jsxs)(I,{variant:"outline",disabled:s,"aria-labelledby":d,"aria-haspopup":"menu","aria-expanded":a,onClick:()=>m(!a),className:"dsh-pi-choice-button",children:[(0,o.jsx)("span",{children:t.find(g=>g.id===n)?.label}),(0,o.jsx)(De,{size:14})]})})]})}function qt({prompt:e,ticket:n,controller:t,t:r,onFailure:s}){let[a,m]=(0,i.useState)(""),[d,g]=(0,i.useState)(!1),[c,w]=(0,i.useState)(!1),[x,u]=(0,i.useState)(!1),C=(0,i.useId)();async function p(y){y.preventDefault();let b=a;m(""),g(!0);try{await t.mutation("answer",{ticket:n,id:e.id,value:b})}catch{s()}finally{g(!1)}}return(0,o.jsxs)("form",{onSubmit:p,className:"dsh-pi-prompt",children:[e.kind==="select"?(0,o.jsx)(fe,{label:e.message||r("selection"),value:a,options:e.options,onChange:m,disabled:d}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("label",{htmlFor:C,children:e.message||r(e.kind==="secret"?"secret":"answer")}),(0,o.jsx)(ee,{id:C,"data-modal-autofocus":!0,type:e.kind==="secret"&&!c?"password":"text",autoComplete:"off",spellCheck:!1,value:a,placeholder:e.placeholder,onChange:y=>m(y.target.value)}),e.kind==="secret"?(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[(0,o.jsx)(I,{size:"sm",onClick:()=>w(!c),"aria-pressed":c,children:r(c?"hideSecret":"showSecret")}),(0,o.jsx)(I,{size:"sm",onClick:async()=>{try{m(await navigator.clipboard.readText()),u(!1)}catch{u(!0)}},children:r("paste")})]}):null]}),x?(0,o.jsx)("p",{role:"alert",children:r("pasteFailed")}):null,(0,o.jsx)("div",{className:"dsh-pi-actions",children:(0,o.jsx)(I,{type:"submit",variant:"primary",disabled:d||e.kind==="select"&&!a,children:r("submit")})})]})}function Kt({entry:e,method:n,controller:t,t:r,onClose:s,onModels:a}){let m=(0,i.useRef)(),[d,g]=(0,i.useState)(),[c,w]=(0,i.useState)({status:"running"}),[x,u]=(0,i.useState)(!1),[C,p]=(0,i.useState)(!1),[y,b]=(0,i.useState)(e.enabled===!0),[W,f]=(0,i.useState)(!1),[A,k]=(0,i.useState)(!1),[M,E]=(0,i.useState)(!1);(0,i.useEffect)(()=>{let Z=!0;return t.start(e.connectionId,n).then(R=>{m.current=R,Z?g(R):t.cancel(R).catch(()=>{})},R=>{Z&&u(ce(R))}),()=>{Z=!1,m.current&&t.cancel(m.current).catch(()=>{})}},[]),(0,i.useEffect)(()=>{if(!d)return;let Z=!0,R,te=new AbortController;async function Y(){try{let J=await t.call("state",{ticket:d},te.signal);if(!Z)return;w(J),J.status==="running"?R=setTimeout(Y,800):(t.tickets.delete(d),J.status==="authorized"&&e.enabled!==!0?await _():await t.refresh())}catch(J){Z&&u(ce(J))}}return Y(),()=>{Z=!1,te.abort(),clearTimeout(R)}},[d]);let N=Ct(c.notice?.url),v=c.status!=="running"||x,L=c.reason?.startsWith("muse-code-")?ce(new Error(c.reason)):c.reason==="provider-expired"?"providerExpired":c.reason==="timeout"?"timedOut":c.status==="cancelled"?"cancelled":"failed";async function _(Z=!1){p(!0),f(!1);try{await t.mutation(Z?"use-login":"enable",{connectionId:e.connectionId}),b(!0),k(!1)}catch(R){f(!0),k(R.message.endsWith("/api-key-override"))}finally{p(!1),await t.refresh().catch(()=>{})}}let H=c.status==="authorized";return(0,o.jsxs)(le,{open:!0,onClose:s,title:e.displayName,closeLabel:r("close"),className:"dsh-pi-login dsh-pi-dialog",footer:(0,o.jsxs)(o.Fragment,{children:[H&&y&&a&&e.capabilities?.models!==!1?(0,o.jsx)(I,{variant:"primary",onClick:()=>a(e),children:r("chooseModels")}):null,(0,o.jsx)(I,{variant:"outline",onClick:s,children:r(v?"close":"cancel")})]}),children:[x||c.status==="failed"?(0,o.jsx)("p",{role:"alert",children:r(x||L)}):null,H?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:"status",className:"dsh-pi-success",children:r(y?"signedInReady":C?"loading":"success")}),W?(0,o.jsx)("p",{role:"alert",children:r(A?"keyOverride":"enableFailed")}):null,W&&!A?(0,o.jsx)(I,{variant:"outline",onClick:()=>{_()},disabled:C,children:r("enable")}):null,A&&!y?(0,o.jsx)(I,{variant:"outline",onClick:()=>{_(!0)},disabled:C,children:r("useLogin")}):null]}):null,c.status==="cancelled"?(0,o.jsx)("p",{role:c.reason==="timeout"?"alert":"status",children:r(L)}):null,v?null:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:"status",children:c.notice?.message||r(N?"waiting":"busy")}),c.notice?.code?(0,o.jsxs)("div",{className:"dsh-pi-verification",children:[(0,o.jsx)("span",{className:"dsh-pi-muted",children:r("code")}),(0,o.jsxs)("div",{className:"dsh-pi-verification-row",children:[(0,o.jsx)("code",{children:c.notice.code}),(0,o.jsx)(I,{size:"sm",variant:"outline",onClick:async()=>{try{await navigator.clipboard.writeText(c.notice.code),E(!0)}catch{E(!1)}},children:r(M?"copied":"copy")})]})]}):null,N?(0,o.jsx)("a",{className:"dsh-pi-button-link",href:N,target:"_blank",rel:"noopener noreferrer",children:r("openBrowser")}):null,c.prompt?(0,o.jsx)(qt,{prompt:c.prompt,ticket:d,controller:t,t:r,onFailure:()=>u("failed")},c.prompt.id):null]})]})}function $t({entry:e,controller:n,t,onClose:r}){let[s,a]=(0,i.useState)(),[m,d]=(0,i.useState)(""),[g,c]=(0,i.useState)(()=>new Set),[w,x]=(0,i.useState)(!1),[u,C]=(0,i.useState)(!1),[p,y]=(0,i.useState)(""),b=(0,i.useRef)(),W=(0,i.useRef)(0),f=(0,i.useRef)(Promise.resolve());(0,i.useEffect)(()=>{let v=new AbortController;return n.call("models",{connectionId:e.connectionId},v.signal).then(a,()=>{v.signal.aborted||C(!0)}),()=>{v.abort(),b.current?.abort(),W.current++}},[e.connectionId]);async function A(){let v=++W.current;b.current?.abort();let L=new AbortController;b.current=L,x(!0),y(""),C(!1);try{let _=await n.call("refresh-models",{connectionId:e.connectionId},L.signal);!L.signal.aborted&&v===W.current&&a(_)}catch(_){if(!L.signal.aborted&&v===W.current){let H=_.message.split("/").pop();y(s?.refresh?.errors?.[H]??"catalogRefreshFailed")}}finally{!L.signal.aborted&&v===W.current&&x(!1)}}function k(v,L){C(!1),c(_=>new Set(_).add(v)),a(_=>({..._,models:_.models.map(H=>H.id===v?{...H,enabled:L}:H)})),f.current=f.current.then(async()=>{try{let _=await n.call("models",{connectionId:e.connectionId});await n.mutation("set-model",{connectionId:e.connectionId,model:v,enabled:L,revision:_.revision})}catch{C(!0)}try{a(await n.call("models",{connectionId:e.connectionId}))}catch{}c(_=>{let H=new Set(_);return H.delete(v),H})}),f.current.then(()=>n.refresh()).catch(()=>{})}let M=m.trim().toLowerCase(),E=s?.models.filter(v=>`${v.id} ${v.name}`.toLowerCase().includes(M)),N=s?.models.filter(v=>v.enabled).length??0;return(0,o.jsxs)(le,{open:!0,title:e.displayName,description:t("modelsHint"),closeLabel:t("close"),onClose:r,className:"dsh-pi-login dsh-pi-dialog dsh-pi-models-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsx)(I,{variant:"outline",onClick:r,children:t("close")}),children:[s&&s.models.length>8?(0,o.jsx)(ee,{icon:(0,o.jsx)(Pe,{size:16}),"aria-label":t("searchModels"),placeholder:t("searchModels"),"data-modal-autofocus":!0,value:m,onChange:v=>d(v.target.value)}):null,(0,o.jsxs)("div",{className:"dsh-pi-toolbar dsh-pi-models-toolbar",children:[s?(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("modelsOn").replace("{count}",String(N))}):(0,o.jsx)("span",{role:"status",children:u?"":t("loading")}),s?.refresh?.canRefresh?(0,o.jsx)(I,{variant:"ghost",size:"sm",disabled:w||!e.writable,onClick:()=>{A()},children:t(w?"loading":"reloadModels")}):null]}),s?.refresh?.status?(0,o.jsxs)("p",{role:"status",className:"dsh-pi-muted",children:[t(s.refresh.status.message),s.refresh.status.detail?` \xB7 ${s.refresh.status.detail}`:""]}):null,p?(0,o.jsx)("p",{role:"alert",children:t(p)}):null,u?(0,o.jsx)("p",{role:"alert",children:t(s?"saveFailed":"modelsFailed")}):null,s?.models.some(v=>v.fast&&v.enabled)?(0,o.jsx)("p",{className:"dsh-pi-note",children:t("fastWarning")}):null,(0,o.jsxs)("div",{className:"dsh-pi-model-list",children:[E?.map(v=>(0,o.jsxs)("div",{className:"dsh-pi-model-row",children:[(0,o.jsxs)("div",{className:"dsh-pi-model-label",children:[(0,o.jsx)("span",{children:v.name}),v.contributor?(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("metaContributorHint")}):null,v.capabilityUnverified?(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("capabilitiesUnknown")}):null]}),(0,o.jsx)(_e,{label:`${t("modelEnabled")}: ${v.name}`,checked:v.enabled,disabled:g.has(v.id)||!e.writable,onChange:L=>k(v.id,L)})]},v.id)),E?.length===0?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("noResults")}):null]})]})}function ce(e){let n=e.message.split("/").pop();return n==="endpoint-untrusted"?"endpointUntrusted":n?.startsWith("muse-code-")?Object.hasOwn(j,`error_${n}`)?`error_${n}`:"error_muse-code-unavailable":"saveFailed"}function jt(e,n){let t=e.museCode?.modelId,r=t==="muse-wonder-1.0"?n("museWonderOne"):t==="muse-wonder-full-1.0"?n("museWonderFull"):t;return r?`${r}${e.museCode?.contributorMode===!0?" Contributor":""}`:void 0}function Gt({entry:e,controller:n,t,onClose:r}){let[s,a]=(0,i.useState)(),[m,d]=(0,i.useState)(""),[g,c]=(0,i.useState)(!1),[w,x]=(0,i.useState)(""),[u,C]=(0,i.useState)(!1),p=(0,i.useRef)(),y=(0,i.useId)();(0,i.useEffect)(()=>{let k=new AbortController;return p.current=k,n.mutation("models",{connectionId:e.connectionId},k.signal).then(M=>{if(k.signal.aborted)return;a(M);let E=M.models?.find(N=>N.selected)??M.models?.find(N=>N.modelId===e.museCode?.modelId&&N.contributor===(e.museCode?.contributorMode===!0));d(E?.id??"")},M=>{k.signal.aborted||x(ce(M))}),()=>{k.abort()}},[e.connectionId]);let b=(s?.models??[]).filter(k=>k.sessionSupported===!0);async function W(k){let M=b.find(N=>N.id===k);if(!M||g)return;let E=m;d(k),c(!0),x(""),C(!1);try{await n.mutation("connection-update",{connectionId:e.connectionId,revision:s.revision??e.revision,patch:{modelId:M.modelId,contributorMode:M.contributor===!0}},p.current.signal),await n.refresh(),C(!0),a({...s,revision:n.getSnapshot().revision})}catch(N){p.current.signal.aborted||(d(E),x(ce(N)))}finally{p.current.signal.aborted||c(!1)}}let f=b.find(k=>k.id===m),A=g||!e.writable||!e.configured;return(0,o.jsxs)(le,{open:!0,title:e.displayName,description:t("museSessionHint"),closeLabel:t("close"),onClose:r,className:"dsh-pi-login dsh-pi-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsx)(I,{variant:"outline",onClick:r,children:t("close")}),children:[!s&&!w?(0,o.jsx)("p",{role:"status",children:t("loading")}):null,w?(0,o.jsx)("p",{role:"alert",children:t(w)}):null,b.length?(0,o.jsxs)("fieldset",{className:"dsh-pi-radio-list",disabled:A,children:[(0,o.jsx)("legend",{className:"dsh-pi-caption",children:t("museModels")}),b.map(k=>(0,o.jsxs)("label",{className:"dsh-pi-radio-row",children:[(0,o.jsx)("input",{type:"radio",name:y,value:k.id,checked:m===k.id,onChange:()=>{W(k.id)}}),(0,o.jsx)("span",{children:k.name??k.label})]},k.id))]}):s?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("museCatalogDiagnostic")}):null,g?(0,o.jsx)("p",{role:"status",className:"dsh-pi-muted",children:t("loading")}):u?(0,o.jsx)("p",{role:"status",className:"dsh-pi-success",children:t("museModelSaved")}):null,f?.contributor?(0,o.jsx)("p",{className:"dsh-pi-note",children:t("metaContributorHint")}):null,f?.entitlement==="unverified"?(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("museEntitlementUnverified")}):null]})}function vt({controller:e,t:n}){let t=(0,i.useSyncExternalStore)(e.subscribe,e.getSnapshot),[r,s]=(0,i.useState)(!1);(0,i.useEffect)(()=>{e.load()},[e]);let a=["checking","starting","preparing","installing"].includes(t.status),m={idle:"updateIdle",checking:"updateChecking",current:"updateCurrent",available:"updateAvailable",blocked:"updateBlocked",starting:"updatePreparing",preparing:"updatePreparing",installing:"updateInstalling","restart-required":"updateRestart",applied:"updateApplied",failed:"updateFailed",cancelled:"updateCancelled",overridden:"updateOverridden",unknown:"updateUnknown"},d=!r&&["idle","blocked","current"].includes(t.status);return(0,o.jsxs)("div",{className:"dsh-pi-updates",children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[n("updateTitle"),t.runtimeVersion?` ${t.runtimeVersion}`:""]}),(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[t.status==="available"?(0,o.jsx)(I,{size:"sm",variant:"primary",onClick:()=>{e.begin()},children:n("updateInstall")}):null,t.status==="unknown"?(0,o.jsx)(I,{size:"sm",variant:"outline",onClick:()=>{e.load()},children:n("updateReconcile")}):null,(0,o.jsx)(I,{size:"sm",variant:"ghost",disabled:a||t.status==="unknown"||t.status==="restart-required",onClick:()=>{s(!0),e.check()},children:n("updateCheck")})]})]}),d?null:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{role:["failed","blocked"].includes(t.status)?"alert":"status",children:n(m[t.status]||"updateUnknown")}),t.reason?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[n(`updateReason_${t.reason}`)||n("updateReason_network")," ",(0,o.jsx)("a",{className:"dsh-pi-link",href:"https://github.com/Aero123421/dsh-pi-login/releases",target:"_blank",rel:"noopener noreferrer",children:n("updateManual")})]}):null,t.candidate?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("p",{children:[t.runtimeVersion," \u2192 ",t.candidate.version," \xB7 DSH ",t.candidate.compatibility]}),(0,o.jsx)("p",{className:"dsh-pi-update-notes",children:t.candidate.notes})]}):null,t.result?.stage?(0,o.jsxs)("p",{className:"dsh-pi-muted",children:[n("updateStage"),": ",t.result.stage,t.result.error?.code?` \xB7 ${t.result.error.code}`:""]}):null]})]})}function mt(e,n){let t=e.windowSeconds;return t&&t%86400===0?`${t/86400} ${n("days")}`:t&&t%3600===0?`${t/3600} ${n("hours")}`:t&&t%60===0?`${t/60} ${n("minutes")}`:e.scope==="account"?n("accountQuota"):Object.hasOwn(j,`usageScope_${e.scope}`)?n(`usageScope_${e.scope}`):e.scope}function Qt({entry:e,controller:n,t}){let[r,s]=(0,i.useState)(),[a,m]=(0,i.useState)(!1),[d,g]=(0,i.useState)(!1),c=(0,i.useRef)(),w=(0,i.useRef)(0);async function x(p=!1){let y=++w.current;c.current?.abort();let b=new AbortController;c.current=b,m(!0),g(!1);try{let W=await n.mutation("usage",{connectionId:e.connectionId,refresh:p},b.signal);!b.signal.aborted&&y===w.current&&s(W)}catch{!b.signal.aborted&&y===w.current&&g(!0)}finally{!b.signal.aborted&&y===w.current&&m(!1)}}(0,i.useEffect)(()=>(x(),()=>{w.current++,c.current?.abort()}),[e.connectionId]);let u=r?.status==="rate-limited"&&new Date(r.retryAt).valueOf()>Date.now(),C=r?.windows??[];return(0,o.jsxs)("section",{className:"dsh-pi-section dsh-pi-usage","aria-busy":a,"aria-label":t("usageTab"),children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("h4",{children:t("usageTab")}),(0,o.jsx)(I,{variant:"ghost",size:"sm",disabled:a||u,onClick:()=>{x(!0)},children:t(a?"loading":"refreshUsage")})]}),d?(0,o.jsx)("p",{role:"alert",children:t("usageFailed")}):null,r&&(!C.length||r.status!=="available")?(0,o.jsx)("p",{role:"status",className:"dsh-pi-muted",children:t(`usage_${r.status}`)}):null,u&&r.retryAt?(0,o.jsxs)("p",{className:"dsh-pi-muted dsh-pi-small",children:[t("retryAt"),": ",Ee(r.retryAt)]}):null,C.map(p=>(0,o.jsxs)("div",{className:"dsh-pi-usage-window",children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("span",{children:mt(p,t)}),p.quotaState?(0,o.jsx)("strong",{children:t(`quota_${p.quotaState}`)}):typeof p.usedPercent=="number"?(0,o.jsxs)("strong",{children:[p.usedPercent,"% ",t("used")]}):(0,o.jsx)("span",{className:"dsh-pi-muted",children:t("quota_unknown")})]}),!p.quotaState&&typeof p.usedPercent=="number"?(0,o.jsx)("progress",{max:"100",value:Math.min(100,Math.max(0,p.usedPercent)),"aria-label":mt(p,t)}):null,p.quota?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[p.quota.estimated?`${t("estimated")} \xB7 `:"",p.quota.remaining!=null?`${t("remaining")}: ${p.quota.remaining}`:p.quota.used!=null?`${t("used")}: ${p.quota.used}`:t("quota_unknown"),p.quota.total!=null?` / ${p.quota.total}`:""," ",t(`unit_${p.quota.unit}`)]}):null,p.resetsAt?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[t("resets"),": ",Ee(p.resetsAt)]}):p.resetsOn?(0,o.jsxs)("span",{className:"dsh-pi-muted",children:[t("resetDate"),": ",Ee(p.resetsOn,!0)]}):null]},p.id)),r?.checkedAt||r?.sourceObservedAt?(0,o.jsxs)("p",{className:"dsh-pi-muted dsh-pi-small",children:[r.source==="last-observed"?`${t("lastObservedShort")} \xB7 `:"",t(r.sourceObservedAt?"observedAt":"checkedAt"),": ",Ee(r.sourceObservedAt??r.checkedAt)]}):null]})}function wt({value:e,onChange:n,t,disabled:r,saved:s}){let[a,m]=(0,i.useState)(!1),[d,g]=(0,i.useState)(!1),c=(0,i.useId)();return(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:c,children:t("apiKey")}),(0,o.jsxs)("div",{className:"dsh-pi-secret",children:[(0,o.jsx)(ee,{id:c,type:a?"text":"password",autoComplete:"off",spellCheck:!1,value:e,disabled:r,placeholder:s?t("keySavedPlaceholder"):"",onChange:w=>n(w.target.value)}),(0,o.jsx)(I,{size:"sm",disabled:r,"aria-pressed":a,onClick:()=>m(!a),children:t(a?"hideSecret":"showSecret")}),(0,o.jsx)(I,{size:"sm",disabled:r,onClick:async()=>{try{n(await navigator.clipboard.readText()),g(!1)}catch{g(!0)}},children:t("paste")})]}),d?(0,o.jsx)("p",{role:"alert",children:t("pasteFailed")}):null]})}function ke(e){return`${e.integrationId}/${e.serviceId??e.id}`}function Yt({state:e,controller:n,t,onClose:r,onLogin:s,onSaved:a}){let m=e.services,d=new Map;for(let l of m){let U=l.label??l.serviceLabel;d.set(U,(d.get(U)??0)+1)}let g=l=>e.integrations.find(U=>(U.id??U.integrationId)===l)?.label,c=l=>{let U=l.label??l.serviceLabel;return d.get(U)>1?`${U}\uFF08${g(l.integrationId)}\uFF09`:U},[w,x]=(0,i.useState)(m[0]?ke(m[0]):""),u=m.find(l=>ke(l)===w)??m[0],C=u?.methods??[],[p,y]=(0,i.useState)(C[0]?.id??"oauth"),b=C.find(l=>l.id===p)?.id??C[0]?.id??p,[W,f]=(0,i.useState)(""),[A,k]=(0,i.useState)(""),[M,E]=(0,i.useState)(""),[N,v]=(0,i.useState)(""),[L,_]=(0,i.useState)(!1),[H,Z]=(0,i.useState)(""),R=(0,i.useId)(),te=u?.capabilities?.settings===!1,Y=W.trim()||c(u??{})||"";async function J(){_(!0),Z("");try{let l={displayName:Y,authMethod:b,...N?{apiKey:N}:{},...A.trim()?{endpointUrl:A.trim()}:{},...M?{api:M}:{}},U=await n.mutation("connection-create",{integrationId:u.integrationId,serviceId:u.serviceId??u.id,...l,revision:e.revision});if(v(""),await n.refresh(),a(),b==="oauth"){let xe=U.connection??U,Ce=n.getSnapshot().entries.find(ve=>ve.connectionId===xe.connectionId);Ce&&s(Ce)}}catch(l){Z(ce(l))}finally{_(!1)}}return(0,o.jsxs)(le,{open:!0,title:t("addConnection"),closeLabel:t("close"),onClose:r,className:"dsh-pi-login dsh-pi-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(I,{variant:"outline",onClick:r,disabled:L,children:t("cancel")}),(0,o.jsx)(I,{variant:"primary",disabled:L||!u||te||u.writable===!1||!Y||b==="api-key"&&!N.trim(),onClick:()=>{J()},children:t(L?"loading":b==="oauth"?"addAndSignIn":"add")})]}),children:[(0,o.jsx)(fe,{label:t("service"),value:u?ke(u):"",options:m.map(l=>({id:ke(l),label:c(l)})),disabled:L,onChange:l=>{x(l),y(m.find(U=>ke(U)===l)?.methods?.[0]?.id??"oauth"),v("")}}),te?(0,o.jsx)("p",{role:"status",children:t(u.unavailableReason==="muse-code-bridge-unverified"?`serviceUnavailable_${u.unavailableReason}`:"serviceUnavailable")}):null,C.length>1?(0,o.jsx)(fe,{label:t("method"),value:b,options:C.map(l=>({id:l.id,label:t(l.id==="oauth"?"oauth":"apiKey")})),disabled:L,onChange:l=>{y(l),v("")}}):null,(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${R}-name`,children:t("connectionName")}),(0,o.jsx)(ee,{id:`${R}-name`,"data-modal-autofocus":!0,maxLength:80,value:W,disabled:L,placeholder:c(u??{})??t("namePlaceholder"),onChange:l=>f(l.target.value)})]}),b==="api-key"?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(wt,{value:N,onChange:v,t,disabled:L}),(0,o.jsxs)("details",{className:"dsh-pi-advanced",children:[(0,o.jsx)("summary",{children:t("advanced")}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${R}-url`,children:t("endpoint")}),(0,o.jsx)(ee,{id:`${R}-url`,type:"url",value:A,disabled:L,placeholder:"https://\u2026",onChange:l=>k(l.target.value)})]}),u?.apis?.length?(0,o.jsx)(fe,{label:t("protocol"),value:M||u.apis[0],options:u.apis.map(l=>({id:l,label:l})),disabled:L,onChange:E}):null]})]}):(0,o.jsx)("p",{className:"dsh-pi-muted",children:t("oauthHint")}),H?(0,o.jsx)("p",{role:"alert",children:t(H)}):null]})}function bt(e){return e.inFlight||e.authStatus==="updating"?{dot:"ongoing",copy:"busy"}:e.authStatus==="expired"?{dot:"error",copy:"authExpired"}:e.authStatus==="unavailable"?{dot:"warning",copy:"authUnavailable"}:e.configured?e.enabled?{dot:"done",copy:"connected"}:{dot:"idle",copy:"statusOff"}:{dot:"idle",copy:"notConnected"}}function Jt({entry:e,state:n,controller:t,t:r,onClose:s,onLogin:a,onSaved:m}){let d=n.services.find(l=>l.integrationId===e.integrationId&&(l.serviceId??l.id)===e.serviceId)?.methods??e.methods??[],[g,c]=(0,i.useState)(e.authMethod),[w,x]=(0,i.useState)(e.displayName??""),[u,C]=(0,i.useState)(e.profile?.baseURL??""),[p,y]=(0,i.useState)(e.profile?.api??""),[b,W]=(0,i.useState)(""),[f,A]=(0,i.useState)(!1),[k,M]=(0,i.useState)(""),[E,N]=(0,i.useState)(),v=(0,i.useId)(),L=n.services.find(l=>l.integrationId===e.integrationId&&(l.serviceId??l.id)===e.serviceId),_=e.writable!==!1,H=g!==e.authMethod,Z=w.trim()!==e.displayName||H||!!b||u.trim()!==(e.profile?.baseURL??"")||p!==(e.profile?.api??""),R=bt(e);async function te(){if(H&&E!=="method"){N("method");return}A(!0),M("");try{let l={displayName:w.trim(),...H?{authMethod:g}:{},...b?{apiKey:b}:{},...u.trim()?{endpointUrl:u.trim()}:e.profile?.baseURL?{endpointUrl:""}:{},...p?{api:p}:{}};await t.mutation("connection-update",{connectionId:e.connectionId,patch:l,revision:n.revision}),W(""),await t.refresh(),m()}catch(l){M(ce(l))}finally{A(!1)}}async function Y(l){A(!0),M("");try{await t.mutation(`connection-${l}`,{connectionId:e.connectionId,revision:n.revision,...l==="clone"?{displayName:`${w} ${r("copySuffix")}`}:{}}),await t.refresh(),m(l)}catch{M("saveFailed")}finally{A(!1)}}let J=e.authMethod==="oauth"&&e.capabilities?.auth!==!1;return(0,o.jsxs)(le,{open:!0,title:e.displayName,description:`${e.serviceLabel} \xB7 ${r(e.authMethod==="oauth"?"oauthShort":"apiKey")}`,closeLabel:r("close"),onClose:s,className:"dsh-pi-login dsh-pi-dialog",contentClassName:"dsh-pi-modal-content",footer:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(I,{variant:"outline",onClick:s,disabled:f,children:r("close")}),(0,o.jsx)(I,{variant:"primary",disabled:f||!_||!Z||L?.capabilities?.settings===!1||E==="delete"||!w.trim(),onClick:()=>{te()},children:r(f?"loading":E==="method"?"confirmSave":"save")})]}),children:[(0,o.jsxs)("div",{className:"dsh-pi-status-card",children:[(0,o.jsxs)("span",{className:"dsh-pi-status",children:[(0,o.jsx)(Ae,{state:R.dot,size:8}),r(R.copy)]}),J?(0,o.jsx)(I,{size:"sm",variant:e.configured&&e.authStatus!=="expired"?"outline":"primary",disabled:f||!_||H,onClick:()=>a(e),children:r(e.configured?"signInAgain":"signIn")}):null]}),e.configured&&e.capabilities?.usage!==!1?(0,o.jsx)(Qt,{entry:e,controller:t,t:r}):null,(0,o.jsxs)("section",{className:"dsh-pi-section","aria-label":r("connectionSettings"),children:[(0,o.jsx)("h4",{children:r("connectionSettings")}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${v}-name`,children:r("connectionName")}),(0,o.jsx)(ee,{id:`${v}-name`,maxLength:80,value:w,disabled:f||!_,placeholder:r("namePlaceholder"),onChange:l=>x(l.target.value)})]}),d.length>1?(0,o.jsx)(fe,{label:r("method"),value:g,options:d.map(l=>({id:l.id,label:r(l.id==="oauth"?"oauth":"apiKey")})),disabled:f||!_,onChange:l=>{c(l),W(""),N(void 0)}}):null,H?(0,o.jsx)("p",{role:"alert",children:r("methodChangeWarning")}):null,g==="api-key"?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(wt,{value:b,onChange:W,t:r,disabled:f||!_,saved:e.configured&&!H}),(0,o.jsxs)("details",{className:"dsh-pi-advanced",open:e.profile?.baseURL?!0:void 0,children:[(0,o.jsx)("summary",{children:r("advanced")}),(0,o.jsxs)("div",{className:"dsh-pi-field",children:[(0,o.jsx)("label",{htmlFor:`${v}-url`,children:r("endpoint")}),(0,o.jsx)(ee,{id:`${v}-url`,type:"url",value:u,disabled:f||!_,placeholder:"https://\u2026",onChange:l=>C(l.target.value)})]}),L?.apis?.length?(0,o.jsx)(fe,{label:r("protocol"),value:p||L.apis[0],options:L.apis.map(l=>({id:l,label:l})),disabled:f||!_,onChange:y}):null]})]}):null]}),k?(0,o.jsx)("p",{role:"alert",children:r(k)}):null,_?null:(0,o.jsx)("p",{className:"dsh-pi-muted",children:r("readOnly")}),(0,o.jsx)("section",{className:"dsh-pi-section dsh-pi-danger","aria-label":r("deleteConnection"),children:E==="delete"?(0,o.jsxs)("div",{className:"dsh-pi-confirm",children:[(0,o.jsx)("p",{role:"alert",children:r("deleteWarning")}),(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[(0,o.jsx)(I,{size:"sm",variant:"outline",disabled:f,onClick:()=>N(void 0),children:r("cancel")}),(0,o.jsx)(I,{size:"sm",variant:"primary",disabled:f,onClick:()=>{Y("delete")},children:r("confirmDelete")})]})]}):(0,o.jsxs)("div",{className:"dsh-pi-inline-actions",children:[(0,o.jsx)(I,{size:"sm",disabled:f||!_,title:r("cloneHint"),onClick:()=>{Y("clone")},children:r("cloneConnection")}),(0,o.jsx)(I,{size:"sm",className:"dsh-pi-danger-button",disabled:f||!_,onClick:()=>N("delete"),children:r("deleteConnection")})]})})]})}function Xt({entry:e,controller:n,t,writableRevision:r,onOpen:s,onLogin:a,onModels:m}){let[d,g]=(0,i.useState)(!1),[c,w]=(0,i.useState)(!1),x=bt(e),u=e.authStatus==="owner-managed",C=e.capabilities?.settings!==!1,p=!C&&e.settingsUrl?Ct(e.settingsUrl):void 0;async function y(f){g(!0),w(!1);try{await n.mutation("connection-update",{connectionId:e.connectionId,patch:{enabled:f},revision:r}),await n.refresh()}catch{w(!0)}finally{g(!1)}}let b=[u?`${t(`directory_${e.directoryState??"unavailable"}`)} \xB7 ${e.source??t("sourceUnknown")}`:`${t(e.authMethod==="oauth"?"oauthShort":"apiKey")} \xB7 ${t(x.copy)}`,e.integrationId==="meta-muse-code"?jt(e,t):void 0].filter(Boolean).join(" \xB7 "),W=(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("span",{className:"dsh-pi-row-name",children:[u?null:(0,o.jsx)(Ae,{state:x.dot,size:8}),e.displayName]}),(0,o.jsx)("span",{className:`dsh-pi-row-meta${x.dot==="error"?" dsh-pi-row-meta-alert":""}`,children:b})]});return(0,o.jsxs)("li",{className:"dsh-pi-connection-row",children:[C?(0,o.jsx)("button",{type:"button",className:"dsh-pi-row-main","aria-label":`${t("connectionSettings")}: ${e.displayName}`,onClick:()=>s(e),children:W}):(0,o.jsxs)("div",{className:"dsh-pi-row-main",children:[W,p?(0,o.jsx)("a",{className:"dsh-pi-link",href:p,target:"_blank",rel:"noopener noreferrer",children:t("externalSettings")}):null]}),(0,o.jsxs)("div",{className:"dsh-pi-row-actions",children:[c?(0,o.jsx)("span",{role:"alert",className:"dsh-pi-row-meta-alert",children:t("saveFailed")}):null,!e.configured&&e.authMethod==="oauth"&&e.capabilities?.auth!==!1&&e.writable!==!1?(0,o.jsx)(I,{size:"sm",variant:"primary",onClick:()=>a(e),children:t("signIn")}):e.authStatus==="expired"&&e.authMethod==="oauth"&&e.writable!==!1?(0,o.jsx)(I,{size:"sm",variant:"primary",onClick:()=>a(e),children:t("signInAgain")}):(0,o.jsxs)(o.Fragment,{children:[e.capabilities?.models!==!1&&e.configured?(0,o.jsx)(I,{size:"sm",variant:"outline","aria-label":`${t("manageModels")}: ${e.displayName}`,onClick:()=>m(e),children:t("modelsShort")}):null,C&&e.configured?(0,o.jsx)(_e,{label:`${t("useProvider")}: ${e.displayName}`,checked:e.enabled===!0,disabled:d||e.writable===!1,onChange:f=>{y(f)}}):null]})]})]})}function kt({controller:e,updates:n,locale:t}){let r=(0,i.useSyncExternalStore)(e.subscribe,e.getSnapshot),s=Ut(t),[a,m]=(0,i.useState)(""),[d,g]=(0,i.useState)(),[c,w]=(0,i.useState)(""),x=(0,i.useId)();(0,i.useEffect)(()=>{e.load()},[e]),(0,i.useEffect)(()=>{g(void 0),w("")},[r.profileKey,r.generation]);let u=a.trim().toLocaleLowerCase(),C=new Map;for(let f of r.entries){if(!`${f.displayName} ${f.integrationLabel} ${f.serviceLabel}`.toLocaleLowerCase().includes(u))continue;let A=`${f.integrationId}/${f.serviceId}`;C.has(A)||C.set(A,{label:f.serviceLabel??f.integrationLabel,entries:[]}),C.get(A).entries.push(f)}let p=()=>g(void 0);function y(f){w(""),g({kind:"login",entry:f,method:f.authMethod})}function b(f){g({kind:"models",entry:e.getSnapshot().entries.find(A=>A.connectionId===f.connectionId)??f})}function W(f){g(void 0),w(f==="delete"?"deleted":f==="clone"?"cloned":"saved")}return(0,o.jsxs)("section",{className:"dsh-pi-login dsh-pi-footer","aria-labelledby":x,children:[(0,o.jsxs)("div",{className:"dsh-pi-toolbar",children:[(0,o.jsx)("h3",{id:x,children:s("title")}),(0,o.jsx)(I,{variant:"outline",size:"sm",onClick:()=>{w(""),g({kind:"add"})},disabled:r.status!=="ready"||r.services.length===0,children:s("addConnection")})]}),c?(0,o.jsx)("p",{role:"status",className:"dsh-pi-success",children:s(c)}):null,r.error?(0,o.jsxs)("p",{role:"alert",children:[s("loadFailed")," ",(0,o.jsx)(I,{size:"sm",onClick:()=>{e.refresh()},children:s("retry")})]}):null,r.status==="loading"&&r.entries.length===0?(0,o.jsx)("p",{role:"status",className:"dsh-pi-loading",children:s("loading")}):null,r.entries.length>8?(0,o.jsx)("div",{className:"dsh-pi-search",children:(0,o.jsx)(ee,{"aria-label":s("searchConnections"),placeholder:s("searchConnections"),icon:(0,o.jsx)(Pe,{size:16}),value:a,onChange:f=>m(f.target.value)})}):null,[...C].map(([f,A])=>(0,o.jsxs)("div",{className:"dsh-pi-group",children:[(0,o.jsx)("h4",{className:"dsh-pi-group-label",children:A.label}),(0,o.jsx)("ul",{className:"dsh-pi-connection-list",children:A.entries.map(k=>(0,o.jsx)(Xt,{entry:k,controller:e,t:s,writableRevision:r.revision,onOpen:M=>{w(""),g({kind:"settings",entry:M})},onLogin:y,onModels:b},k.connectionId))})]},f)),r.status==="ready"&&C.size===0&&!r.error?(0,o.jsx)("p",{className:"dsh-pi-muted",children:s(r.entries.length?"noResults":"emptyConnections")}):null,n?(0,o.jsx)(vt,{controller:n,t:s}):null,d?.kind==="login"?(0,o.jsx)(Kt,{...d,controller:e,t:s,onClose:p,onModels:b}):null,d?.kind==="models"?d.entry.integrationId==="meta-muse-code"?(0,o.jsx)(Gt,{entry:d.entry,controller:e,t:s,onClose:p}):(0,o.jsx)($t,{entry:d.entry,controller:e,t:s,onClose:p}):null,d?.kind==="add"?(0,o.jsx)(Yt,{state:r,controller:e,t:s,onClose:p,onLogin:y,onSaved:W}):null,d?.kind==="settings"?(0,o.jsx)(Jt,{entry:d.entry,state:r,controller:e,t:s,onClose:p,onLogin:y,onSaved:W},d.entry.connectionId):null]})}function zt(e){let n=new Re(e.connection),t=new He(e.connection);e.effect(()=>()=>t.dispose(),"dsh-pi-login: update requests"),e.effect(()=>()=>n.dispose(),"dsh-pi-login: UI requests"),e.effect(()=>e.locale.register(ft,{en:j,ja:Q}),"dsh-pi-login: copy"),e.effect(()=>{let s=document.createElement("style");return s.dataset.dshPiLogin="",s.textContent=gt+ht,document.head.append(s),()=>s.remove()},"dsh-pi-login: official controls"),e.on("connection/reset",()=>{n.refresh(),t.load()});let r=()=>({controller:n,updates:t,locale:e.locale});e.slots.inject("settings.models.footer",()=>e.slots.register({name:"settings.models.footer",id:"dsh-pi-login",order:10,inject:r},kt))}

return module.exports;}});
