/* VK-адаптер: эмулирует Telegram.WebApp поверх VK Bridge, чтобы код игры не менялся */
(function(){
var B=window.vkBridge,Q=new URLSearchParams(location.search),uid=Q.get('vk_user_id')||'';
try{if(B){B.send('VKWebAppInit').catch(function(){});B.send('VKWebAppSetViewSettings',{status_bar_style:'light',action_bar_color:'#14122e',navigation_bar_color:'#14122e'}).catch(function(){})}}catch(e){}
var CH=3000; /* лимит VK Storage: 4096 символов на ключ, режем на куски */
function sset(k,v){return B?B.send('VKWebAppStorageSet',{key:k,value:v}):Promise.reject(new Error('no bridge'))}
var CS={
 setItem:function(k,v,cb){var n=Math.ceil(v.length/CH)||1,p=[];for(var i=0;i<n;i++)p.push(sset(k+'_'+i,v.slice(i*CH,(i+1)*CH)));p.push(sset(k+'_n',String(n)));
  Promise.all(p).then(function(){cb&&cb(null,true)}).catch(function(e){cb&&cb(e)})},
 getItem:function(k,cb){if(!B)return cb(null,'');
  B.send('VKWebAppStorageGet',{keys:[k+'_n']}).then(function(r){var n=+((r.keys[0]||{}).value)||0;if(!n)return cb(null,'');var ks=[];for(var i=0;i<n;i++)ks.push(k+'_'+i);
   return B.send('VKWebAppStorageGet',{keys:ks}).then(function(r2){var m={};r2.keys.forEach(function(x){m[x.key]=x.value});var s='';for(var i=0;i<n;i++)s+=m[k+'_'+i]||'';cb(null,s)})}).catch(function(){cb(null,'')})},
 removeItem:function(k,cb){sset(k+'_n','0').then(function(){cb&&cb(null,true)}).catch(function(e){cb&&cb(e)})}
};
var W={ready:function(){},expand:function(){},setHeaderColor:function(){},setBackgroundColor:function(){},CloudStorage:CS,
 HapticFeedback:{impactOccurred:function(s){try{B&&B.send('VKWebAppTapticImpactOccurred',{style:s||'light'}).catch(function(){})}catch(e){}}},
 showAlert:function(t){alert(t)},showConfirm:function(m,cb){cb(confirm(m))},
 initDataUnsafe:{user:uid?{id:uid}:undefined,start_param:(location.hash||'').replace(/^#/,'')},platform:'vk'};
window.Telegram={WebApp:W};
/* pid() в игре даёт 'tg'+id; для VK подменяем ниже в vk-patch.js */
window.__VK_UID=uid;
})();
