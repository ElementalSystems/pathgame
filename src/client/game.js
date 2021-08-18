let isLead = 0;


function startGameMulti(lead, gamemsg, gameend) {
  let gb = document.getElementById("game");
  gb.classList.toggle('gone', false);
  isLead = lead ? 1 : 0;

  if (lead) {
    //init game
    gameState.turn = 1;
    gameState.initTime = +new Date();
    gamemsg(gameState);
    updateBoard();
  }
}

function msgGame(data) {}

function endGame() {}

function updateBoard() {}


function startGame() {
  let grid_c = null;

  let _gs = 9;

  let setTile = (t, b, c, ht) => {
    for (i = 0; i < 5; i += 1)
      t.classList.toggle('l' + i,b & (1 << i));
    t.classList.toggle('p1', c == 0);
    t.classList.toggle('p2', c == 1);
    t.classList.toggle('ht', !!ht);
  }

  let posTile = (t, i) => {
    let x = (i % _gs),
      y = Math.floor(i / _gs)
    if (y == _gs) x = -1.5;
    if (y == (_gs + 1)) x = _gs + .5;
    if (y >= _gs) y = (i % _gs) * 1.2 + .3;
    t.style.left = (x * 100 / _gs) + "%";
    t.style.top = (y * 100 / _gs) + "%";
    t.style.width = t.style.height = (100 / _gs) + "%";
    return t;
  }

  ge_gone('game', false);

  //make the game state
  let bs = [11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5].sort(()=>(Math.random()-.5));

  let gs = {
    tn: 0, //turn number
    tls: new Array(_gs * _gs).fill(0), //tiles that are the current board
    own: new Array(_gs * _gs).fill(-1), //ownership of board
    ft: [bs, bs.map(n => {
      x = ((n >> 1) ^ (n >> 3)) & 1;
      return n ^ ((x << 1) | (x << 3));
    })], //upcoming list of tiles for two players invert one player list
  }

  let checkOwn=(i)=>{
    if (gs.own[i]>=0) return; //we already have a colour
    //otherwise we need to check on our surrounds
    for (i=0;i<4;i+=1) //for each direction
      if (gs.tls[i]&(1<<i)) {//if we have path
         //check ownership by direction
      }

  }
  let gs_add=(i,t,o)=>{
    gs.tls[i]=t;
    gs.own[i]=o;
    checkOwn(i);
  };

  gs_add(40,31,-1);
  gs_add(27,23,0);
  gs_add(53-18,29,1);

  //make the game grid
  let gg = new Array(_gs * (_gs + 2)).fill(0).map((d, i) => {
    let t = clone('gamebrd', 'tile')
    posTile(t, i);
    t.onclick = () => {
      if (grid_c) grid_c(i);
    }
    return t;
  });

  let updateBoard = () => { //set up grid
    gg.forEach((t, i) => {
      if (i < _gs * _gs)
        setTile(t, gs.tls[i], gs.own[i]); //main rack
      else if (i - _gs < _gs * _gs) {
        setTile(t, gs.ft[0][i - _gs * _gs], -1); //p1 side
      } else {
        setTile(t, gs.ft[1][i - _gs * _gs - _gs], -1); //p2 side
      }
    });
  }

  let checkTile = (i, xo, yo, path, bit, own) => { //return +1 if tile is okay; -10 if tile is impossible or 0 if tile is open
      let xp = i % _gs + xo,
        yp = Math.floor(i / _gs) + yo;
      if ((xp < 0) || (xp >= _gs) || (yp < 0) || (yp >= _gs)) return path ? -10 : 0;
      let t = gs.tls[i + xo + yo * _gs];
      if (!t) return 0; //complete tiles don't hold space either way
      let o = gs.own[i + xo + yo * _gs];
      if (path && (o != own) && (o >= 0)) return -10; //it's owned by my enemy
      let isP = (t & bit);
      return ((!!isP) == (!!path)) ? 1 : -10;
    }

  let canPlay = (i, t, o) => {
    if (gs.tls[i] != 0) return false; //already something there
    //check if I can play
    return (checkTile(i, 0, -1, t & 1, 4, o) + checkTile(i, 0, 1, t & 4, 1, o) + checkTile(i, 1, 0, t & 2, 8, o) + checkTile(i, -1, 0, t & 8, 2, o)) > 0;
  }

  let doTurn = () => {
    updateBoard();
    let pn = gs.tn % 2; //which player
    let ntl = gs.ft[pn][0]; //the top tile
    gecl('gamebrd', 'p1', pn);

    //calculate legal moves
    gs.tls.forEach((t, i) => {
      if (canPlay(i, ntl, pn))
        setTile(gg[i], ntl, -1, true);
    })

    //now set up for that players turn
    grid_c = (i) => {
      //make the move
      gs.tls[i] = ntl;
      gs.own[i] = -1;
      gs.tn += 1;
      gs.ft[pn].shift(); //use up the tile
      doTurn();
    }

  }

  doTurn();


}
