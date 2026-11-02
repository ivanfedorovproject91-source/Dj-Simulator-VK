/* VK-патч: загружается ПОСЛЕ основных скриптов игры */
(function(){
var B=window.vkBridge;
/* идентификатор игрока: vk + id (сначала из параметров запуска, они доступны сразу) */
window.pid=function(){if(window.__VK_UID)return 'vk'+window.__VK_UID;var p=null;try{p=localStorage.getItem('djsim_pid')}catch(e){}if(!p){p='w'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('djsim_pid',p)}catch(e){}}return p};
/* ссылка-приглашение: https://vk.com/app<ID>#ref_<id> */
window.refLink=function(){var a=APP_LINK;if(!a||/app$/.test(a))return '';return a+'#ref_'+pid()};
window.invite=function(){var l=refLink();if(!l)return friendsScr('Не удалось определить ссылку на игру. Открой игру из VK.');
 if(B)B.send('VKWebAppShare',{link:l}).catch(function(){});else tip('Твоя ссылка: '+esc(l),12000)};
window.copyLink=function(){var l=refLink();if(!l)return friendsScr('Не удалось определить ссылку на игру. Открой игру из VK.');
 if(B)B.send('VKWebAppCopyText',{text:l}).then(function(){tip('Ссылка скопирована.',4000)}).catch(function(){tip('Твоя ссылка: '+esc(l),12000)});else tip('Твоя ссылка: '+esc(l),12000)};
})();
