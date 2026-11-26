/* Shared data layer. With PHP hosting it talks to api.php; otherwise it keeps changes in this browser. */
window.Luna=(function(){
var KEY='luna-content-v2',OKEY='luna-orders-v1',mem={},server=false,authed=false,csrf='';
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);return true}catch(e){if(v===undefined)return mem[k]||null;mem[k]=v;return false}}
function clone(o){return JSON.parse(JSON.stringify(o))}
function merge(d,s){if(Array.isArray(d))return Array.isArray(s)?s:clone(d);if(d&&typeof d==='object'){var o={};Object.keys(d).forEach(function(k){o[k]=merge(d[k],s?s[k]:undefined)});return o}return s===undefined||typeof s!==typeof d?d:s}
function api(action,body){var o={credentials:'same-origin',headers:{'X-Luna':'1'}};if(body!==undefined){o.method='POST';if(body instanceof FormData)o.body=body;else{o.body=JSON.stringify(body);o.headers['Content-Type']='application/json'}}if(csrf)o.headers['X-CSRF']=csrf;
 return fetch('api.php?action='+action,o).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'Request failed');return j})})}
function upgrade(d,s){var m=merge(d,s||{});if(s&&!(s.version>=3)){if(!m.contact.instagram)m.contact.instagram=d.contact.instagram;m.version=3}return m}
function load(){var d=window.LUNA_DEFAULTS;
 var remote=(window.LUNA_PREVIEW||location.protocol==='file:')?Promise.reject():api('get');
 return remote.then(function(j){if(!j||j.luna!==true)throw 0;server=true;authed=j.authed;csrf=j.csrf||'';var c=j.content||{};return upgrade(d,c.brand?c:null)},null)
 .catch(function(){server=false;var s=null;try{s=JSON.parse(ls(KEY))}catch(e){}return upgrade(d,s)})}
var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function img(p){p=String(p||'');return (window.LUNA_IMG&&window.LUNA_IMG[p])||(/^(assets\/|uploads\/|data:image\/(png|jpe?g|webp);|https:\/\/)/.test(p)?p:'')}
function url(u){u=String(u||'').trim();return /^(https?:\/\/|mailto:|tel:|#)/i.test(u)?u:''}
function num(v){var n=parseFloat(String(v).replace(/[^0-9.]/g,''));return String(v).trim()===''||isNaN(n)?null:n}
function money(c,v){var n=num(v);return n===null?'':c+' '+n.toLocaleString('en-US')}
/* v is in the base currency; rate = how many base units make 1 unit of the chosen currency */
function convert(content,code,v){var n=num(v),base=content.brand.currency;if(n===null)return'';var cur=content.currencies.filter(function(x){return x.code===code&&x.on})[0],r=cur?num(cur.rate):null;if(code===base||!r)return money(base,n);var d=/^(USD|EUR|GBP|AED|ZAR|CHF|CAD|AUD)$/.test(code)?2:0;return '≈ '+code+' '+(n/r).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})}
function wa(c,text){var n=String(c.contact.whatsapp||'').replace(/\D/g,'');return n?'https://wa.me/'+n+'?text='+encodeURIComponent(text):''}
var P={bag:'<path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>',up:'<path d="M5 15l7-7 7 7"/>',down:'<path d="M5 9l7 7 7-7"/>',hand:'<path d="M7 12V6a1.5 1.5 0 013 0v5-6.5a1.5 1.5 0 013 0V11 6a1.5 1.5 0 013 0v6-3a1.5 1.5 0 013 0v5c0 4-2.5 7-6.5 7S8 19 4 13c1-1.500 2-1.500 3 0"/>',
leaf:'<path d="M5 19C4 10 10 4 20 4c0 10-6 16-15 15z"/><path d="M5 19c3-5 6-8 10-10"/>',pin:'<path d="M12 21s7-6 7-11.500a7 7 0 10-14 0C5 15 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',gift:'<path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13"/><path d="M12 7S8 7 8 5s3-2 4 2c1-4 4-4 4-2s-4 2-4 2z"/>',
clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',cut:'<circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M8 8.500L20 17M8 15.500L20 7"/>',wind:'<path d="M3 9h11a3 3 0 10-3-3M3 13h15a3 3 0 11-3 3M3 17h6"/>',flame:'<path d="M12 3c1 4 6 6 6 11a6 6 0 01-12 0c0-3 2-4 3-6 1 1 1 2 1 3 2-2 3-5 2-8z"/>',
weight:'<path d="M7 8h10l3 12H4L7 8z"/><circle cx="12" cy="6" r="2"/>',wick:'<path d="M12 21v-9"/><path d="M12 3c3 3 3 7 0 8-3-1-3-5 0-8z"/>',phone:'<path d="M5 4h4l2 5-2.500 1.500a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>',mail:'<path d="M3 6h18v12H3z"/><path d="M3 7l9 7 9-7"/>',
chat:'<path d="M4 20l1.5-4.500A8 8 0 1112 20a8 8 0 01-3.500-.800L4 20z"/>',insta:'<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M16.5 7.5h.01"/>',fb:'<path d="M14 21v-8h3l.5-3H14V8c0-1 .5-1.500 2-1.500h1.500V4h-2.500C12.500 4 11 5.500 11 8v2H8v3h3v8"/>',tiktok:'<path d="M14 4v11a4 4 0 11-4-4M14 4c.5 3 2.500 4.500 5 4.500"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>',home:'<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',grid:'<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>',image:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',card:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/>',
truck:'<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.500" r="1.7"/><circle cx="17" cy="17.500" r="1.7"/>',text:'<path d="M5 6h14M5 11h14M5 16h9"/>',palette:'<path d="M12 3a9 9 0 100 18c2 0 1-2 2-3s7 1 7-6c0-5-4-9-9-9z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7.500" r="1"/><circle cx="16" cy="10" r="1"/>',layers:'<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/>',save:'<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>',trash:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',flame2:'<path d="M12 3c3 4 4 6 4 8a4 4 0 01-8 0c0-2 1-4 4-8z"/>',send:'<path d="M4 12l16-8-6 16-3-6-7-2z"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',check:'<path d="M5 12l5 5 9-10"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',eye:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>'};
function icon(n){return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[n]||P.flame)+'</svg>'}
function applyTheme(t){var r=document.documentElement.style;Object.keys(t).forEach(function(k){if(/^#[0-9a-f]{3,8}$/i.test(t[k]))r.setProperty('--'+k,t[k])})}
function toast(msg){var d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=msg;document.body.appendChild(d);setTimeout(function(){d.remove()},2600)}
function localOrders(){try{return JSON.parse(ls(OKEY))||[]}catch(e){return[]}}
return{clone:clone,merge:merge,load:load,api:api,esc:esc,img:img,url:url,num:num,money:money,convert:convert,wa:wa,icon:icon,icons:Object.keys(P),applyTheme:applyTheme,toast:toast,
 isServer:function(){return server},isAuthed:function(){return authed},setAuth:function(a,t){authed=a;csrf=t||''},
 save:function(c){if(server)return api('save',{content:c});return ls(KEY,JSON.stringify(c))?Promise.resolve():Promise.reject(new Error('Browser storage is full or blocked. Use smaller photos or export a backup.'))},
 reset:function(){ls(KEY,null)},
 order:function(o){if(server)return api('order',o);var a=localOrders();a.unshift(o);ls(OKEY,JSON.stringify(a.slice(0,100)));return Promise.resolve(o)},
 orders:function(){return server?api('orders').then(function(j){return j.orders}):Promise.resolve(localOrders())},
 setOrder:function(id,status){if(server)return api('order_status',{id:id,status:status});var a=localOrders();a=status==='delete'?a.filter(function(o){return o.id!==id}):a.map(function(o){if(o.id===id)o.status=status;return o});ls(OKEY,JSON.stringify(a));return Promise.resolve()}
};
})();
