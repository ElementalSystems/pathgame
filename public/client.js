function mk_brd(o){let l=null,s=(e,t,n,l)=>{for(i=0;i<5;i+=1)e.classList.toggle("l"+i,t&1<<i);e.classList.toggle("p1",0==n),e.classList.toggle("p2",1==n),e.classList.toggle("ht",!!l)};let a=new Array(o.s*(o.s+2)).fill(0).map((e,t)=>{let n=clone("gamebrd","tile");return((e,t)=>{let n=t%o.s,l=Math.floor(t/o.s);l==o.s&&(n=-1.5),l==o.s+1&&(n=o.s+.5),l>=o.s&&(l=t%o.s*1.2+.3),e.style.left=100*n/o.s+"%",e.style.top=100*l/o.s+"%",e.style.width=e.style.height=100/o.s+"%"})(n,t),n.onclick=()=>{l&&l(t)},n});return{setT:(e,t,n,l)=>s(a[e],t,n,l),setClk:e=>{l=e},update:()=>{gecl("gamebrd","p1",o.tn%2),a.forEach((e,t)=>{t<o.s*o.s?s(e,o.tls[t],o.own[t]):t-o.s<o.s*o.s?s(e,o.ft[0][t-o.s*o.s],-1):s(e,o.ft[1][t-o.s*o.s-o.s],-1)})}}}let isLead=0;function startGameMulti(e,t,n){let l=document.getElementById("game");l.classList.toggle("gone",!1),isLead=e?1:0,e&&(gameState.turn=1,gameState.initTime=+new Date,t(gameState),updateBoard())}function msgGame(e){}function endGame(){}function updateBoard(){}function startGame(){ge_gone("game",!1);let t=m_gs(11,!0,[31,23,21,26],[3,6,12,5,11,7,5,10,14,15,15,13,3,6,9,12,7,5]),o=h_gs(t),s=mk_brd(t),a=()=>{s.update();let n=t.tn%2,l=t.ft[n][0];t.tls.forEach((e,t)=>{o.canPlay(t,l,n)&&s.setT(t,l,-1,!0)}),s.setClk(e=>{o.add(e,l,-1),t.tn+=1,t.ft[n].shift(),a()})};a()}function m_gs(e,t,n,l){let o=e=>(x=1&(e>>1^e>>3),y=1&(e>>0^e>>2),e^(x<<1|x<<3)^(y<<0|y<<2)),s=new Array(5).fill(l).flat().sort(()=>Math.random()-.5),a={tn:0,s:e,tls:new Array(e*e).fill(0),own:new Array(e*e).fill(-1),ft:[s,s.map(e=>o(e))]},r=h_gs(a),g=(e,t)=>{let n;for(;n=Math.floor(Math.random()*a.s*a.s),t&&(n=Math.floor(n/a.s)*a.s),!r.canPlace(n,e,t?0:-1););r.add(n,e,t?0:-1),r.add(a.s*a.s-1-n,o(e),t?1:-1)};return t&&r.add(Math.floor(a.s*a.s/2),31,-1),g(23,!0),n.forEach(e=>g(e)),a}function h_gs(g){let l=t=>{var e,n;0<=g.own[t]||(cq=[],e=e=>{0!=g.tls[e]&&(0<=g.own[e]?g.own[t]=g.own[e]:cq.push(e))},1&(n=g.tls[t])&&e(t-g.s),2&n&&e(t+1),4&n&&e(t+g.s),8&n&&e(t-1),0<=g.own[t]&&cq.forEach(e=>l(e)))};let o=(e,t,n,l,o,s)=>{var a=e%g.s+t,r=Math.floor(e/g.s)+n;if(a<0||a>=g.s||r<0||r>=g.s)return l?-10:0;r=g.tls[e+t+n*g.s];if(!r)return 0;n=g.own[e+t+n*g.s];return!(l&&n!=s&&0<=n)&&!!(r&o)==!!l?1:-10};return{add:(e,t,n)=>{g.tls[e]=t,g.own[e]=n,l(e)},canPlay:(e,t,n)=>0==g.tls[e]&&0<=o(e,0,-1,1&t,4,n)+o(e,0,1,4&t,1,n)+o(e,1,0,2&t,8,n)+o(e,-1,0,8&t,2,n),canPlace:(e,t,n)=>0==g.tls[e]&&0<=o(e,0,-1,1&t,4,n)+o(e,0,1,4&t,1,n)+o(e,1,0,2&t,8,n)+o(e,-1,0,8&t,2,n),checkOwn:l,gs:g}}function _init_lobby(){let n=io({upgrade:!1,transports:["websocket"]}),t=document.getElementById("board");ge("nick").value="user"+ +new Date%1e4,n.on("connect",()=>{}),n.on("lobby",e=>{t.innerHTML="",e.available.forEach(t=>{if(t.nick!=ge("nick").value){let e=clone("board","brde");e.textContent="Start Game with: "+t.nick+" - ["+t.level+"]",e.onclick=()=>{n.emit("reqstart",{opponent:t.id})}}})}),n.on("disconnect",()=>{}),n.on("playstart",e=>{ge_gone("lobby",!0),startGame(e.lead,e=>{n.emit("gamemsg",e)},e=>{n.emit("reqend")})}),n.on("playend",()=>{ge_gone("lobby",!1),endGame()}),n.on("gamemsg",e=>{msgGame(e)}),n.on("error",()=>{}),geclk("enter",()=>{n.emit("el",{nick:ge("nick").value,level:ge("lev").value}),ge_no("top",!0),ge_no("bot",!1)}),geclk("leave",()=>{n.emit("ll",{}),ge_no("top",!1),ge_no("bot",!0)})}var _lobby_up=!1;function start_lobby(){_lobby_up||_init_lobby(),_lobby_up=!0,ge_gone("lobby",!1)}function init(){startGame()}let ge=e=>document.getElementById(e),gecl=(e,t,n)=>ge(e).classList.toggle(t,n),geclk=(e,t)=>ge(e).onclick=t,ge_gone=(e,t)=>gecl(e,"gone",t),ge_no=(e,t)=>gecl(e,"no",t),clone=(e,t)=>{t=document.querySelector("#"+t).content.firstElementChild.cloneNode(!0);return ge(e).appendChild(t),t};