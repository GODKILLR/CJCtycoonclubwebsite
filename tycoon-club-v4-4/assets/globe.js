// Tycoon Club — revolving globe (gold theme).
// Framework-free adaptation of the "Revolving Globe" component:
// canvas land-mask globe + rotating SVG member pins.
(function () {
  var cv = document.getElementById('globe-canvas');
  var pinsSvg = document.getElementById('globe-pins');
  if (!cv || !pinsSvg) return;

  var SPEED = 0.85;
  var PIN_COLORS = ['#F4C430', '#E0A93B', '#FFD960', '#C8742E'];

  function peopleDefs() {
    return [
      { lat: 41, lon: -96, c: 0 }, { lat: -12, lon: -50, c: 1 }, { lat: 6, lon: 20, c: 2 },
      { lat: 50, lon: 14, c: 3 }, { lat: 32, lon: 100, c: 0 }, { lat: -26, lon: 134, c: 1 },
      { lat: 60, lon: -150, c: 3 }
    ];
  }

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

  // Build member pins (circular member photos clipped to a disc)
  var defs = peopleDefs();
  var NS = 'http://www.w3.org/2000/svg';
  var defsEl = pinsSvg.querySelector('defs');
  if (defsEl && !pinsSvg.querySelector('#pinclip')) {
    var clip = document.createElementNS(NS, 'clipPath');
    clip.setAttribute('id', 'pinclip');
    var cc = document.createElementNS(NS, 'circle');
    cc.setAttribute('cx', '0'); cc.setAttribute('cy', '0'); cc.setAttribute('r', '13');
    clip.appendChild(cc); defsEl.appendChild(clip);
  }
  defs.forEach(function (p, i) {
    var color = PIN_COLORS[p.c % PIN_COLORS.length];
    var delay = (i * 0.32).toFixed(2) + 's';
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'node');
    g.style.opacity = '0';
    g.innerHTML =
      '<circle class="ring" r="20" fill="none" stroke="' + color + '" stroke-width="2.2" style="transform-box:fill-box;transform-origin:center;animation:gshine 2.6s ease-out infinite;animation-delay:' + delay + ';filter:drop-shadow(0 0 6px ' + color + ')"/>' +
      '<circle r="26" fill="' + color + '" style="opacity:.26;filter:blur(6px)"/>' +
      '<circle r="14.5" fill="rgba(28,18,12,0.9)" stroke="' + color + '" stroke-width="2.4" style="filter:drop-shadow(0 0 9px ' + color + ') drop-shadow(0 0 22px ' + color + ')"/>' +
      '<image href="assets/pin' + (i + 1) + '.png" x="-13" y="-13" width="26" height="26" clip-path="url(#pinclip)" preserveAspectRatio="xMidYMid slice"/>';
    pinsSvg.appendChild(g);
  });

  var cx = 300, cy = 300, R = 240, eps = 0.40, D = Math.PI / 180, TAU = Math.PI * 2, PI = Math.PI;
  var maskObj = buildMask(), mask = maskObj.m, mW = maskObj.W, mH = maskObj.H;
  var ce = Math.cos(eps), se = Math.sin(eps);

  var dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = 600 * dpr; cv.height = 600 * dpr;
  var ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;

  var bn = 420, off = document.createElement('canvas');
  off.width = bn; off.height = bn;
  var octx = off.getContext('2d'), img = octx.createImageData(bn, bn), data = img.data;
  var pins = [].slice.call(pinsSvg.querySelectorAll('.node'));

  function view(lo, la, rot) {
    var A = lo + rot, cphi = Math.cos(la), sphi = Math.sin(la), cA = Math.cos(A), sA = Math.sin(A);
    return { X: cphi * sA, Y: ce * sphi - se * cphi * cA, Z: se * sphi + ce * cphi * cA };
  }

  var merid = [], paral = [];
  for (var lon = -180; lon < 180; lon += 30) { var a = []; for (var lat = -82; lat <= 82; lat += 2.5) a.push({ lo: lon * D, la: lat * D }); merid.push(a); }
  var plats = [-60, -30, 0, 30, 60];
  for (var pp = 0; pp < plats.length; pp++) { var a2 = []; for (var l2 = -180; l2 <= 180; l2 += 2.5) a2.push({ lo: l2 * D, la: plats[pp] * D }); paral.push(a2); }

  function drawLine(s, rot) {
    ctx.beginPath(); var pen = false;
    for (var qi = 0; qi < s.length; qi++) {
      var v = view(s[qi].lo, s[qi].la, rot);
      if (v.Z >= 0) { var sx = cx + R * v.X, sy = cy - R * v.Y; if (!pen) { ctx.moveTo(sx, sy); pen = true; } else ctx.lineTo(sx, sy); }
      else pen = false;
    }
    ctx.stroke();
  }

  var rot = 0, last = performance.now();
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf;

  function frame(now) {
    var dt = Math.min(50, now - last); last = now;
    rot += dt * SPEED * 0.00032;
    ctx.clearRect(0, 0, 600, 600);

    // continents — inverse orthographic projection + land-mask lookup
    var idx = 0;
    for (var py = 0; py < bn; py++) {
      var Y = 1 - (py + 0.5) / bn * 2;
      for (var px = 0; px < bn; px++, idx += 4) {
        var X = (px + 0.5) / bn * 2 - 1;
        var r2 = X * X + Y * Y;
        if (r2 > 1) { data[idx + 3] = 0; continue; }
        var Z = Math.sqrt(1 - r2);
        var u = ce * Y + se * Z;
        var w = -se * Y + ce * Z;
        var cphi = Math.sqrt(Math.max(1e-9, 1 - u * u));
        var lat = Math.asin(u < -1 ? -1 : u > 1 ? 1 : u);
        var lon2 = Math.atan2(X / cphi, w / cphi) - rot;
        lon2 = ((lon2 + PI) % TAU + TAU) % TAU - PI;
        var mi = ((lon2 + PI) / TAU * mW) | 0; if (mi < 0) mi = 0; else if (mi >= mW) mi = mW - 1;
        var mj = ((PI / 2 - lat) / PI * mH) | 0; if (mj < 0) mj = 0; else if (mj >= mH) mj = mH - 1;
        if (mask[mj * mW + mi]) {
          var sh = 0.82 + 0.18 * Z;
          data[idx] = 245 * sh; data[idx + 1] = 220 * sh; data[idx + 2] = 150 * sh; data[idx + 3] = 255;
        } else data[idx + 3] = 0;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.drawImage(off, cx - R, cy - R, 2 * R, 2 * R);

    // graticule
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(244,210,150,0.24)';
    for (var m1 = 0; m1 < merid.length; m1++) drawLine(merid[m1], rot);
    for (var p1 = 0; p1 < paral.length; p1++) drawLine(paral[p1], rot);

    // limb rim
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU);
    ctx.lineWidth = 2.2; ctx.strokeStyle = 'rgba(255,216,120,0.9)';
    ctx.shadowColor = 'rgba(244,196,48,0.7)'; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;

    // member pins
    for (var i = 0; i < pins.length; i++) {
      var d = defs[i % defs.length], pv = view(d.lon * D, d.lat * D, rot);
      var sx = cx + R * pv.X, sy = cy - R * pv.Y, sc = 0.6 + 0.42 * Math.max(0, pv.Z);
      pins[i].setAttribute('transform', 'translate(' + sx.toFixed(1) + ',' + sy.toFixed(1) + ') scale(' + sc.toFixed(3) + ')');
      pins[i].style.opacity = pv.Z > 0.04 ? (0.2 + 0.8 * pv.Z).toFixed(3) : '0';
    }

    if (!reduce) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
})();
