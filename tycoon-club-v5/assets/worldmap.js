// Tycoon Club V5 — flat dotted world map with member photos connected by
// animated dashed lines. Continents come from the same land-mask data as the globe.
(function () {
  var TAU = Math.PI * 2;

  function continents() {
    return [
      [[-159,71],[-156,71],[-140,70],[-128,70],[-114,73],[-100,73],[-90,73],[-82,73],[-78,68],[-80,62],[-78,58],[-94,58],[-95,50],[-90,48],[-84,46],[-82,42],[-79,43],[-76,44],[-70,47],[-66,49],[-60,47],[-66,45],[-70,42],[-71,41],[-74,40],[-75,38],[-76,35],[-79,33],[-81,31],[-80,27],[-80,25],[-82,25],[-83,28],[-85,30],[-88,30],[-90,29],[-94,29],[-97,28],[-97,26],[-95,22],[-96,19],[-101,18],[-105,20],[-105,23],[-109,23],[-110,24],[-112,26],[-114,29],[-114,31],[-117,33],[-118,34],[-121,35],[-122,37],[-124,40],[-124,43],[-124,46],[-124,48],[-128,51],[-131,53],[-135,57],[-138,59],[-141,60],[-147,60],[-150,59],[-152,58],[-157,57],[-160,59],[-162,60],[-165,61],[-166,66],[-168,68]],
      [[-78,8],[-74,11],[-70,12],[-64,11],[-61,9],[-58,6],[-52,5],[-50,1],[-49,-1],[-44,-2],[-39,-4],[-35,-6],[-35,-8],[-37,-11],[-39,-13],[-40,-18],[-43,-23],[-48,-25],[-49,-29],[-54,-34],[-58,-35],[-57,-39],[-62,-41],[-65,-43],[-67,-46],[-69,-50],[-71,-53],[-74,-52],[-74,-48],[-73,-44],[-72,-40],[-71,-35],[-72,-30],[-71,-26],[-70,-21],[-70,-17],[-75,-15],[-78,-9],[-81,-5],[-81,-2],[-80,2],[-79,5]],
      [[-16,15],[-16,21],[-12,26],[-9,30],[-6,33],[-2,35],[3,37],[9,37],[10,34],[11,33],[19,31],[25,31],[30,31],[32,30],[33,28],[35,24],[37,19],[39,15],[41,12],[43,11],[51,12],[51,9],[44,5],[42,0],[41,-4],[40,-10],[39,-15],[35,-19],[33,-25],[28,-32],[25,-34],[20,-35],[18,-34],[16,-29],[14,-23],[13,-17],[12,-12],[9,-2],[8,4],[4,6],[-2,5],[-8,4],[-12,7],[-14,11]],
      [[44,-16],[47,-15],[50,-19],[49,-24],[45,-25],[43,-21],[43,-18]],
      [[-9,39],[-9,43],[-2,44],[-1,49],[2,51],[7,54],[8,57],[5,59],[8,63],[13,65],[18,69],[24,71],[30,70],[33,68],[40,66],[50,68],[60,69],[70,70],[80,73],[90,75],[100,76],[110,74],[120,73],[130,71],[140,66],[145,60],[150,59],[155,55],[160,58],[163,60],[160,53],[155,51],[143,49],[140,46],[135,43],[131,43],[130,40],[128,38],[122,40],[121,37],[120,34],[121,31],[118,25],[110,21],[108,16],[106,11],[104,8],[103,5],[100,7],[100,13],[98,16],[94,18],[92,22],[89,22],[87,21],[80,16],[79,9],[77,8],[75,12],[73,16],[70,21],[67,24],[62,25],[58,24],[57,20],[53,17],[48,13],[44,12],[40,13],[36,14],[35,28],[36,33],[36,36],[34,36],[28,41],[26,40],[23,40],[20,40],[16,41],[13,44],[8,44],[3,43],[-1,40],[-6,38]],
      [[130,31],[132,33],[135,34],[138,35],[140,38],[141,41],[143,43],[145,44],[142,42],[140,40],[137,36],[133,34],[131,32]],
      [[-5,50],[-3,53],[-3,56],[-5,58],[-8,57],[-6,54],[-6,51]],
      [[114,-22],[114,-26],[115,-30],[118,-34],[122,-34],[126,-32],[131,-32],[134,-33],[138,-35],[140,-38],[144,-38],[147,-38],[150,-37],[153,-31],[153,-28],[151,-24],[146,-19],[143,-13],[138,-12],[136,-14],[132,-12],[130,-12],[126,-14],[123,-17],[120,-20]],
      [[-46,60],[-40,63],[-30,68],[-22,70],[-18,74],[-22,77],[-32,81],[-45,82],[-58,80],[-60,76],[-54,70],[-50,66],[-48,62]],
      [[167,-46],[170,-44],[174,-41],[178,-38],[175,-41],[171,-44],[168,-47]]
    ];
  }

  function buildMask() {
    var W = 720, H = 360, m = new Uint8Array(W * H), polys = continents();
    function pip(x, y, p) {
      var inside = false;
      for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
        var xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
      }
      return inside;
    }
    for (var j = 0; j < H; j++) {
      var lat = 90 - (j + 0.5) / H * 180;
      for (var i = 0; i < W; i++) {
        var lon = -180 + (i + 0.5) / W * 360;
        for (var k = 0; k < polys.length; k++) { if (pip(lon, lat, polys[k])) { m[j * W + i] = 1; break; } }
      }
    }
    return { m: m, W: W, H: H };
  }

  window.makeWorldMap = function (mount, cfg) {
    cfg = cfg || {};
    var W = 1000, H = 500, latTop = 80, latBot = -56, PHOTOS = 7;
    function proj(lon, lat) { return [(lon + 180) / 360 * W, (latTop - lat) / (latTop - latBot) * H]; }
    var mk = buildMask(), mask = mk.m, mW = mk.W, mH = mk.H;
    function landAt(lon, lat) {
      var mi = ((lon + 180) / 360 * mW) | 0; if (mi < 0) mi = 0; else if (mi >= mW) mi = mW - 1;
      var mj = ((90 - lat) / 180 * mH) | 0; if (mj < 0) mj = 0; else if (mj >= mH) mj = mH - 1;
      return mask[mj * mW + mi];
    }

    mount.innerHTML = '';
    var stage = document.createElement('div'); stage.className = 'wm-stage';
    stage.innerHTML =
      '<canvas class="wm-canvas"></canvas>' +
      '<svg class="wm-svg" viewBox="0 0 ' + W + ' ' + H + '"><defs><clipPath id="wmclip"><circle cx="0" cy="0" r="13"/></clipPath></defs></svg>';
    mount.appendChild(stage);
    var cv = stage.querySelector('.wm-canvas'), svg = stage.querySelector('.wm-svg');
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    var ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);

    // member locations (lon, lat) spread across the continents
    var M = cfg.members || [
      { lon: -98, lat: 41 }, { lon: -119, lat: 37 }, { lon: -58, lat: -15 }, { lon: 12, lat: 50 },
      { lon: 3, lat: 9 }, { lon: 26, lat: -28 }, { lon: 78, lat: 22 }, { lon: 112, lat: 34 },
      { lon: 106, lat: 8 }, { lon: 134, lat: -25 }, { lon: 46, lat: 30 }, { lon: 139, lat: 37 },
      { lon: -90, lat: 16 }, { lon: 38, lat: 0 }, { lon: 68, lat: 52 },
      { lon: -75, lat: 45 }, { lon: -43, lat: -22 }, { lon: -4, lat: 40 }, { lon: 30, lat: 60 },
      { lon: 85, lat: 26 }, { lon: 121, lat: 14 }, { lon: 174, lat: -41 }, { lon: 18, lat: -5 }
    ];
    M.forEach(function (p, i) { var xy = proj(p.lon, p.lat); p.x = xy[0]; p.y = xy[1]; p.photo = (i % PHOTOS) + 1; });
    var links = cfg.links || [
      [0,1],[0,3],[0,2],[3,4],[3,10],[3,6],[10,6],[6,7],[6,8],[7,11],[7,9],[8,9],[4,5],[2,5],[2,4],[0,7],[3,7],[10,7],
      [12,0],[12,2],[13,4],[13,10],[13,5],[14,3],[14,6],[14,7],
      [15,0],[15,3],[16,2],[16,13],[17,3],[17,4],[18,3],[18,14],[19,6],[19,7],[20,8],[20,7],[21,9],[22,4],[22,13]
    ];
    var arcs = links.map(function (L) {
      var a = M[L[0]], b = M[L[1]];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      var nx = -dy / len, ny = dx / len, bulge = Math.max(20, Math.min(110, len * 0.22));
      var cx = mx + nx * bulge, cy = my + ny * bulge;
      if (cy > my) { cx = mx - nx * bulge; cy = my - ny * bulge; } // bow upward
      return { a: a, b: b, cx: cx, cy: cy };
    });

    // static dotted land map -> offscreen
    var dots = document.createElement('canvas'); dots.width = W * dpr; dots.height = H * dpr;
    var dctx = dots.getContext('2d'); dctx.scale(dpr, dpr); dctx.fillStyle = 'rgba(244,196,48,0.5)';
    var step = 7;
    for (var sy = 0; sy < H; sy += step) {
      var lat = latTop - sy / H * (latTop - latBot);
      for (var sx = 0; sx < W; sx += step) {
        var lon = sx / W * 360 - 180;
        if (landAt(lon, lat)) { dctx.beginPath(); dctx.arc(sx, sy, 1.5, 0, TAU); dctx.fill(); }
      }
    }

    // member avatars (SVG, clipped to circles, with pulse)
    var NS = 'http://www.w3.org/2000/svg';
    M.forEach(function (p, i) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')');
      g.innerHTML =
        '<circle class="wm-pulse" r="14" fill="none" stroke="#F4C430" stroke-width="1.4" style="animation-delay:' + (i * 0.28).toFixed(2) + 's"/>' +
        '<circle r="14" fill="rgba(20,14,8,0.92)" stroke="#F4C430" stroke-width="2"/>' +
        '<image href="assets/pin' + p.photo + '.png" x="-13" y="-13" width="26" height="26" clip-path="url(#wmclip)" preserveAspectRatio="xMidYMid slice"/>';
      svg.appendChild(g);
    });

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var off = 0, raf;
    function frame() {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(dots, 0, 0, W, H);
      ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(244,196,48,0.6)';
      ctx.setLineDash([1.5, 7]); ctx.lineDashOffset = off;
      for (var i = 0; i < arcs.length; i++) {
        var ar = arcs[i];
        ctx.beginPath(); ctx.moveTo(ar.a.x, ar.a.y);
        ctx.quadraticCurveTo(ar.cx, ar.cy, ar.b.x, ar.b.y); ctx.stroke();
      }
      ctx.setLineDash([]);
      if (!reduce) { off -= 0.35; raf = requestAnimationFrame(frame); }
    }
    frame();
  };
})();
