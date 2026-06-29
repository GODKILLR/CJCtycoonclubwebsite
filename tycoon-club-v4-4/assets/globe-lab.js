// Tycoon Club — globe factory for the variations lab.
// Reusable makeGlobe(mount, cfg): canvas land-mask globe + crowded member-photo pins.
(function () {
  var D = Math.PI / 180, TAU = Math.PI * 2, PI = Math.PI, PHOTOS = 7;

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

  var MASK = null;
  function getMask() {
    if (MASK) return MASK;
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
    MASK = { m: m, W: W, H: H };
    return MASK;
  }

  // Evenly distributed points on land. Collect land candidates across the WHOLE
  // globe (north->south), then sample `count` evenly so both hemispheres fill.
  function landPoints(count) {
    var mk = getMask(), m = mk.m, mW = mk.W, mH = mk.H;
    var all = [], ga = PI * (3 - Math.sqrt(5)), M = 2400;
    for (var k = 0; k < M; k++) {
      var y = 1 - (k / (M - 1)) * 2, th = k * ga;
      var lon = ((th % TAU) / TAU) * 360 - 180;
      var lat = Math.asin(y) / D;
      if (lat > 80 || lat < -56) continue; // skip pole caps / Antarctica
      var mi = (((lon + 180) / 360) * mW) | 0; if (mi < 0) mi = 0; else if (mi >= mW) mi = mW - 1;
      var mj = (((90 - lat) / 180) * mH) | 0; if (mj < 0) mj = 0; else if (mj >= mH) mj = mH - 1;
      if (m[mj * mW + mi]) all.push({ lat: lat, lon: lon });
    }
    if (all.length <= count) return all;
    var out = [], step = all.length / count;
    for (var i = 0; i < count; i++) out.push(all[Math.floor(i * step)]);
    return out;
  }

  window.makeGlobe = function (mount, cfg) {
    cfg = cfg || {};
    var stage = document.createElement('div');
    stage.className = 'gl-stage';
    stage.innerHTML =
      '<div class="gl-halo" style="background:' + (cfg.halo || 'radial-gradient(circle, rgba(244,196,48,0.16) 0%, rgba(217,145,63,0.07) 42%, transparent 70%)') + '"></div>' +
      '<div class="gl-sphere" style="background:' + cfg.sphere + '"></div>' +
      '<canvas class="gl-canvas"></canvas>' +
      '<svg class="gl-pins" viewBox="0 0 600 600"></svg>';
    mount.appendChild(stage);
    var cv = stage.querySelector('.gl-canvas');
    var pinsSvg = stage.querySelector('.gl-pins');

    var pts = landPoints(cfg.pinCount || 28);
    var NS = 'http://www.w3.org/2000/svg';
    pts.forEach(function (p) {
      var la = p.lat * D, lo = p.lon * D, cphi = Math.cos(la);
      p.ux = cphi * Math.sin(lo); p.uy = Math.sin(la); p.uz = cphi * Math.cos(lo);
    });
    var links = [];
    if (cfg.links) {
      var ct = Math.cos((cfg.linkDeg || 32) * D);
      for (var a = 0; a < pts.length; a++) for (var b = a + 1; b < pts.length; b++) {
        var dp = pts[a].ux * pts[b].ux + pts[a].uy * pts[b].uy + pts[a].uz * pts[b].uz;
        if (dp > ct) links.push([a, b]);
      }
    }
    var ring = cfg.pinRing || '#F4C430';
    pts.forEach(function (p, i) {
      var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'gl-node'); g.style.opacity = '0';
      g.innerHTML =
        '<circle r="13.4" fill="rgba(20,14,8,0.92)" stroke="' + ring + '" stroke-width="1.6"/>' +
        '<image href="assets/pin' + ((i % PHOTOS) + 1) + '.png" x="-12" y="-12" width="24" height="24" clip-path="url(#glpinclip)" preserveAspectRatio="xMidYMid slice"/>';
      pinsSvg.appendChild(g); p.el = g;
    });

    var cx = 300, cy = 300, R = 240, eps = 0.40, ce = Math.cos(eps), se = Math.sin(eps);
    var mk = getMask(), mask = mk.m, mW = mk.W, mH = mk.H;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = 600 * dpr; cv.height = 600 * dpr;
    var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = true;
    var bn = cfg.bn || 260, off = document.createElement('canvas'); off.width = bn; off.height = bn;
    var octx = off.getContext('2d'), img = octx.createImageData(bn, bn), data = img.data;

    var land = cfg.land || [14, 10, 7];
    var grat = cfg.grat || 'rgba(244,210,150,0.16)';
    var rim = cfg.rim || 'rgba(255,216,120,0.85)';
    var rimGlow = cfg.rimGlow || 'rgba(244,196,48,0.6)';
    var speed = cfg.speed || 0.8;

    function view(lo, la, rot) {
      var A = lo + rot, cphi = Math.cos(la), sphi = Math.sin(la), cA = Math.cos(A), sA = Math.sin(A);
      return { X: cphi * sA, Y: ce * sphi - se * cphi * cA, Z: se * sphi + ce * cphi * cA };
    }
    var merid = [], paral = [];
    for (var lon = -180; lon < 180; lon += 30) { var arr = []; for (var lat = -82; lat <= 82; lat += 3) arr.push({ lo: lon * D, la: lat * D }); merid.push(arr); }
    [-60, -30, 0, 30, 60].forEach(function (L) { var arr2 = []; for (var l2 = -180; l2 <= 180; l2 += 3) arr2.push({ lo: l2 * D, la: L * D }); paral.push(arr2); });
    function drawLine(s, rot) {
      ctx.beginPath(); var pen = false;
      for (var i = 0; i < s.length; i++) { var v = view(s[i].lo, s[i].la, rot); if (v.Z >= 0) { var sx = cx + R * v.X, sy = cy - R * v.Y; if (!pen) { ctx.moveTo(sx, sy); pen = true; } else ctx.lineTo(sx, sy); } else pen = false; }
      ctx.stroke();
    }

    var rot = 0, last = performance.now();
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var raf;
    function frame(now) {
      var dt = Math.min(50, now - last); last = now; rot += dt * speed * 0.00032;
      ctx.clearRect(0, 0, 600, 600);
      var idx = 0;
      for (var py = 0; py < bn; py++) {
        var Y = 1 - (py + 0.5) / bn * 2;
        for (var px = 0; px < bn; px++, idx += 4) {
          var X = (px + 0.5) / bn * 2 - 1, r2 = X * X + Y * Y;
          if (r2 > 1) { data[idx + 3] = 0; continue; }
          var Z = Math.sqrt(1 - r2);
          var u = ce * Y + se * Z, w = -se * Y + ce * Z;
          var cphi = Math.sqrt(Math.max(1e-9, 1 - u * u));
          var lat = Math.asin(u < -1 ? -1 : u > 1 ? 1 : u);
          var lon2 = Math.atan2(X / cphi, w / cphi) - rot;
          lon2 = ((lon2 + PI) % TAU + TAU) % TAU - PI;
          var mi = ((lon2 + PI) / TAU * mW) | 0; if (mi < 0) mi = 0; else if (mi >= mW) mi = mW - 1;
          var mj = ((PI / 2 - lat) / PI * mH) | 0; if (mj < 0) mj = 0; else if (mj >= mH) mj = mH - 1;
          if (mask[mj * mW + mi]) { var sh = 0.78 + 0.22 * Z; data[idx] = land[0] * sh; data[idx + 1] = land[1] * sh; data[idx + 2] = land[2] * sh; data[idx + 3] = 255; }
          else data[idx + 3] = 0;
        }
      }
      octx.putImageData(img, 0, 0);
      ctx.drawImage(off, cx - R, cy - R, 2 * R, 2 * R);

      ctx.lineWidth = 1; ctx.strokeStyle = grat;
      for (var a = 0; a < merid.length; a++) drawLine(merid[a], rot);
      for (var b = 0; b < paral.length; b++) drawLine(paral[b], rot);

      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU);
      ctx.lineWidth = 2.2; ctx.strokeStyle = rim; ctx.shadowColor = rimGlow; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], v = view(p.lon * D, p.lat * D, rot);
        p.sx = cx + R * v.X; p.sy = cy - R * v.Y; p.Z = v.Z;
        var s = 0.6 + 0.42 * Math.max(0, v.Z);
        p.el.setAttribute('transform', 'translate(' + p.sx.toFixed(1) + ',' + p.sy.toFixed(1) + ') scale(' + s.toFixed(3) + ')');
        p.el.style.opacity = v.Z > 0.03 ? (0.12 + 0.88 * v.Z).toFixed(3) : '0';
      }

      if (links.length) {
        ctx.lineWidth = 0.8; ctx.strokeStyle = cfg.linkColor || 'rgba(244,196,48,0.16)'; ctx.beginPath();
        for (var L = 0; L < links.length; L++) {
          var pa = pts[links[L][0]], pb = pts[links[L][1]];
          if (pa.Z > 0.06 && pb.Z > 0.06) { ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy); }
        }
        ctx.stroke();
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  };
})();
