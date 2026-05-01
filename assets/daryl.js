/* ================================================================
   DARYL — Knoxville Land Clearing chatbot
   Self-contained widget. Injects its own styles + markup.
   Tennessee/Florida good-ol'-boy voice. Static knowledge base
   (no API calls). Always routes to phone / quote form / email.
================================================================ */
(function(){
  if (window.__darylLoaded) return;
  window.__darylLoaded = true;

  /* -------- styles -------- */
  var css = `
  .daryl-fab{position:fixed;right:22px;bottom:22px;z-index:9998;display:flex;align-items:center;gap:10px;background:#D4A017;color:#151004;border:0;padding:12px 18px 12px 14px;font-family:'Inter',system-ui,sans-serif;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;box-shadow:0 14px 30px rgba(0,0,0,.45),0 0 0 1px rgba(212,160,23,.5);transition:transform .2s ease,background .2s ease;border-radius:0}
  .daryl-fab:hover{background:#e9b92b;transform:translateY(-2px)}
  .daryl-fab .daryl-av{width:34px;height:34px;border-radius:50%;background:#080808;color:#D4A017;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',Impact,sans-serif;font-size:18px;letter-spacing:.04em;flex:0 0 auto;border:1px solid #151004}
  .daryl-fab .daryl-pulse{width:8px;height:8px;border-radius:50%;background:#0a5d0a;box-shadow:0 0 0 0 rgba(20,180,20,.7);animation:darylPulse 2s infinite}
  @keyframes darylPulse{0%{box-shadow:0 0 0 0 rgba(20,180,20,.7)}70%{box-shadow:0 0 0 10px rgba(20,180,20,0)}100%{box-shadow:0 0 0 0 rgba(20,180,20,0)}}
  .daryl-fab.hidden{display:none}

  .daryl-panel{position:fixed;right:22px;bottom:22px;z-index:9999;width:380px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 40px);background:#0e0e0e;border:1px solid rgba(242,237,230,0.18);box-shadow:0 30px 80px rgba(0,0,0,.6);display:none;flex-direction:column;font-family:'Inter',system-ui,sans-serif;color:#F2EDE6;overflow:hidden}
  .daryl-panel.open{display:flex}

  .daryl-head{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid rgba(242,237,230,0.10);background:linear-gradient(180deg,#151513 0%,#0e0e0e 100%);position:relative}
  .daryl-head .av{width:42px;height:42px;border-radius:50%;background:#D4A017;color:#151004;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',Impact,sans-serif;font-size:22px;letter-spacing:.04em;flex:0 0 auto;border:1px solid #8a6a0f}
  .daryl-head .who{flex:1;min-width:0}
  .daryl-head .name{font-family:'Bebas Neue',Impact,sans-serif;font-size:20px;letter-spacing:.04em;line-height:1}
  .daryl-head .role{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#b8b1a5;margin-top:4px;display:flex;align-items:center;gap:8px}
  .daryl-head .role .live{width:6px;height:6px;border-radius:50%;background:#3a9c3a;box-shadow:0 0 8px #3a9c3a}
  .daryl-head .x{width:30px;height:30px;border:1px solid rgba(242,237,230,0.18);background:transparent;color:#F2EDE6;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1}
  .daryl-head .x:hover{background:rgba(212,160,23,0.12);border-color:#D4A017}

  .daryl-msgs{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
  .daryl-msgs::-webkit-scrollbar{width:6px}
  .daryl-msgs::-webkit-scrollbar-thumb{background:rgba(242,237,230,0.18);border-radius:3px}

  .daryl-msg{max-width:85%;padding:11px 14px;font-size:14px;line-height:1.5;border-radius:0;word-wrap:break-word}
  .daryl-msg.bot{background:#151513;border:1px solid rgba(242,237,230,0.10);color:#F2EDE6;align-self:flex-start;border-left:2px solid #D4A017}
  .daryl-msg.user{background:#D4A017;color:#151004;align-self:flex-end;font-weight:500}
  .daryl-msg a{color:#D4A017;text-decoration:underline;text-underline-offset:2px}
  .daryl-msg.user a{color:#151004}
  .daryl-msg b{color:#D4A017}
  .daryl-msg.user b{color:#151004}

  .daryl-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:#151513;border:1px solid rgba(242,237,230,0.10);border-left:2px solid #D4A017}
  .daryl-typing span{width:6px;height:6px;border-radius:50%;background:#b8b1a5;animation:darylDot 1.2s infinite}
  .daryl-typing span:nth-child(2){animation-delay:.15s}
  .daryl-typing span:nth-child(3){animation-delay:.3s}
  @keyframes darylDot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}

  .daryl-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 18px 10px}
  .daryl-chip{background:transparent;border:1px solid rgba(242,237,230,0.22);color:#F2EDE6;padding:7px 12px;font-size:12px;font-family:'JetBrains Mono',ui-monospace,monospace;letter-spacing:.04em;cursor:pointer;transition:all .15s}
  .daryl-chip:hover{background:#D4A017;color:#151004;border-color:#D4A017}

  .daryl-input{display:flex;align-items:stretch;border-top:1px solid rgba(242,237,230,0.10);background:#080808}
  .daryl-input input{flex:1;background:transparent;border:0;color:#F2EDE6;padding:14px 16px;font-family:inherit;font-size:14px;outline:none}
  .daryl-input input::placeholder{color:#6a6459}
  .daryl-input button{background:#D4A017;color:#151004;border:0;padding:0 18px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;cursor:pointer;transition:background .15s}
  .daryl-input button:hover{background:#e9b92b}
  .daryl-input button:disabled{opacity:.5;cursor:not-allowed}

  .daryl-foot{padding:6px 18px 10px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#6a6459;text-align:center;border-top:1px solid rgba(242,237,230,0.06)}

  @media (max-width:480px){
    .daryl-panel{right:0;bottom:0;width:100vw;max-width:100vw;height:100vh;max-height:100vh;border:0}
    .daryl-fab{right:14px;bottom:14px;padding:10px 14px 10px 12px;font-size:12px}
    .daryl-fab .daryl-av{width:30px;height:30px;font-size:16px}
  }
  `;
  var s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);

  /* -------- markup -------- */
  var fab = document.createElement('button');
  fab.className = 'daryl-fab';
  fab.setAttribute('aria-label','Chat with Daryl');
  fab.innerHTML = '<span class="daryl-av">D</span><span>Ask Daryl</span><span class="daryl-pulse"></span>';
  document.body.appendChild(fab);

  var panel = document.createElement('div');
  panel.className = 'daryl-panel';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','Chat with Daryl');
  panel.innerHTML = `
    <div class="daryl-head">
      <div class="av">D</div>
      <div class="who">
        <div class="name">Daryl</div>
        <div class="role"><span class="live"></span>Knoxville Land Clearing · Online</div>
      </div>
      <button class="x" aria-label="Close chat">×</button>
    </div>
    <div class="daryl-msgs" id="darylMsgs"></div>
    <div class="daryl-chips" id="darylChips"></div>
    <form class="daryl-input" id="darylForm" autocomplete="off">
      <input id="darylInput" type="text" placeholder="Ask Daryl anything…" maxlength="400" />
      <button type="submit">Send</button>
    </form>
    <div class="daryl-foot">Daryl's a friendly bot · for a real human, call (865) 459-0722</div>
  `;
  document.body.appendChild(panel);

  var msgsEl = panel.querySelector('#darylMsgs');
  var chipsEl = panel.querySelector('#darylChips');
  var formEl = panel.querySelector('#darylForm');
  var inputEl = panel.querySelector('#darylInput');
  var closeEl = panel.querySelector('.x');

  /* -------- knowledge base -------- */
  // Each intent: keywords (any match) + response. First match wins (ordered by specificity).
  var KB = [
    {
      id:'greet',
      kw:['hello','hi ','hi!','hey','howdy','yo ','sup','good morning','good afternoon','good evening','hola'],
      r: () => pick([
        "Well hey there, y'all! Daryl here. Glad you stopped by. What can I help ya with — pricin', service area, gettin' a quote?",
        "Howdy! Daryl at your service. Y'all lookin' to clear some land or just kickin' the tires? Either way, fire away.",
        "Hey friend! Name's Daryl. Been workin' brush from the Smokies down to the Florida swamps for a long while — what's on your mind?"
      ])
    },
    {
      id:'who_are_you',
      kw:['who are you','what are you','your name','about you','about daryl','who is daryl','are you a bot','are you real','human or bot','ai or human'],
      r: () => "I'm Daryl — the digital fella over here at Knoxville Land Clearing. I ain't a real person, but I know our pricin', service area, and how we run a job. Anythin' I can't answer, I'll point ya straight to a real human at <b>(865) 459-0722</b>."
    },
    {
      id:'pricing',
      kw:['price','cost','pricing','how much','quote','rate','rates','expensive','cheap','budget','dollar','$','per acre'],
      r: () => "Alrighty, here's the straight talk on pricin' — every job's different but here's what we typically see:<br><br>" +
        "• <b>Lot clearin' (under 1 acre):</b> $700–$2,200<br>" +
        "• <b>Forestry mulchin':</b> $350–$800 per acre<br>" +
        "• <b>Site prep / new build:</b> $1,500–$6,000+<br>" +
        "• <b>Bush hoggin':</b> $75–$150 per hour<br><br>" +
        "Big factors: tree density, site access, terrain, and whether ya want grade work too. Best move is a free on-site walk — <a href='#quote'>request a quote here</a> or holler at <b>(865) 459-0722</b>."
    },
    {
      id:'estimate',
      kw:['estimate','free quote','book','schedule','consultation','assessment','walk the property','site visit'],
      r: () => "Yes sir — every estimate is <b>free</b> and we walk the property in person. Quote's written and line-itemed within 48 hours, no deposit till ya sign. Easiest way is to <a href='#quote'>fill out the quote form</a> or ring <b>(865) 459-0722</b>. We'll usually be on the property within 5 business days."
    },
    {
      id:'services',
      kw:['service','services','what do you do','what do y\'all do','offer','work','jobs you do'],
      r: () => "We run heavy iron — tracked mulchers, skid steers with grapples, and dozers. Here's what we do:<br><br>" +
        "• <b>Land Clearin'</b> — full sites up to 40+ acres<br>" +
        "• <b>Forestry Mulchin'</b> — one-pass, no burn piles, no haulin'<br>" +
        "• <b>Lot Clearin'</b> — residential and cabin lots<br>" +
        "• <b>Bush Hoggin'</b> — pasture, fence lines, ROW maintenance<br>" +
        "• <b>Site Preparation</b> — rough gradin', pad prep, driveway cuts<br><br>" +
        "We don't do landscapin' — we leave the ground build-ready and hand it off to the next crew."
    },
    {
      id:'mulching_what',
      kw:['forestry mulching','mulching','mulch','what is mulch','what is forestry'],
      r: () => "Forestry mulchin's our bread and butter. Tracked machine with a drum head grinds standin' trees, brush, and brier into a clean mulch mat — one pass, no burnin', no haulin'. Leaves nutrient mulch on the ground for erosion control. Great for acreage, fence lines, and lots where ya don't wanna haul debris."
    },
    {
      id:'service_area',
      kw:['where do you','service area','do you service','do you work in','do you cover','do you go to','area','radius','how far','county','region','location','located','based','headquartered','out of town'],
      r: () => "We're based right in <b>Knoxville</b> and run a 60-mile radius from downtown. That covers <b>Knox, Anderson, Blount, Loudon, and Roane counties</b>. Cities we hit regular: Knoxville, Maryville, Oak Ridge, Farragut, Lenoir City, Morristown, and Sevierville. If you're outside that radius, just ask — we'll let ya know honest if we can swing it."
    },
    {
      id:'hours',
      kw:['hour','open','closed','when are you','what time','schedule','availability','available','today','sunday','weekend'],
      r: () => "We're on the clock <b>Monday through Saturday, 7AM to 7PM</b>. Closed Sundays — even ol' Daryl needs a day to set on the porch. Email comes to <a href='mailto:quotes@knoxvillelandclearing.com'>quotes@knoxvillelandclearing.com</a> any time, and we'll get back to ya next business day."
    },
    {
      id:'phone',
      kw:['phone','call','number','contact','reach you','how do i contact','talk to someone','speak to','human','real person','agent'],
      r: () => "Easiest way to reach a real human: <b><a href='tel:+18654590722'>(865) 459-0722</a></b>. Or email <a href='mailto:quotes@knoxvillelandclearing.com'>quotes@knoxvillelandclearing.com</a>. Mon–Sat 7AM–7PM. Tell 'em Daryl sent ya."
    },
    {
      id:'email',
      kw:['email','e-mail','address','mail you'],
      r: () => "Drop us a line at <a href='mailto:quotes@knoxvillelandclearing.com'>quotes@knoxvillelandclearing.com</a>. We answer next business day. Or call <b>(865) 459-0722</b> if you're in a hurry."
    },
    {
      id:'how_long',
      kw:['how long','how fast','timeline','when can you','how soon','start','schedule the work','lead time','wait','get on the schedule'],
      r: () => "Here's the rhythm: free walk-through within about 5 business days, written quote in 48 hours after that, and we usually get on the schedule <b>2–4 weeks out</b>. It moves faster in winter when the leaves are down. We'll lock in a firm start date before any deposit."
    },
    {
      id:'job_size',
      kw:['acreage','how many acres','small job','big job','large','40 acre','too small','minimum','small lot','quarter acre','half acre','one acre','small parcel'],
      r: () => "We handle anythin' from a quarter-acre cabin lot up to <b>40+ acres</b>. No job too small if it's in our service area. Big jobs we'll usually scope as forestry mulchin' to keep cost down — small lots get the precision treatment around setbacks and property lines."
    },
    {
      id:'license_insure',
      kw:['license','licens','insur','insured','bond','liabili','workers comp','coverage','permit'],
      r: () => "We're <b>fully licensed and insured</b> — liability + equipment. Family-owned, locally operated, been workin' East Tennessee since 2014. Happy to send proof of insurance before ya sign anythin'."
    },
    {
      id:'experience',
      kw:['experience','how long have you','years','since','reputation','review','rating','testimonial','reference','reviews'],
      r: () => "Been clearin' East Tennessee since 2014 — over <b>547 acres</b> turned from brier to build-ready. Family-owned, locally operated. Y'all can read field reports right on the homepage from folks in West Knox, Farragut, and Loudon County."
    },
    {
      id:'cleanup',
      kw:['cleanup','clean up','debris','haul','burn','what happens to the trees','disposal','wood chips','stumps left'],
      r: () => "Two ways to handle the wood:<br><br>" +
        "• <b>Forestry mulchin'</b> grinds it on-site into a mulch mat — no burnin', no haulin'. That's the clean option.<br>" +
        "• <b>Traditional clearin'</b> stacks the wood. We can haul it off, burn (where allowed), or leave piles for ya — your call.<br><br>" +
        "Either way, we sweep neighbor-facin' edges and grade access points clean."
    },
    {
      id:'stumps',
      kw:['stump','grind','grinding stumps','remove stump','dig out'],
      r: () => "Stumps can go a few ways: ground flush, dug out, or mulched in place. Diggin' 'em out is more work and costs more, so most folks pick grindin' or mulchin' unless you're poundin' a footer right where the stump sat. We'll sort that out on the site walk."
    },
    {
      id:'permit',
      kw:['permit','permitting','need a permit','approval','setback','tree ordinance','protected'],
      r: () => "Permittin' depends on your jurisdiction — Knox County, City of Knoxville, and the smaller towns each have their own rules on land disturbance, tree protection, and erosion control. We work with builders and surveyors all the time and respect setbacks, easements, and protected trees. If ya need help figurin' out what your lot needs, ask at the site walk."
    },
    {
      id:'landscape',
      kw:['landscape','landscaping','grass','lawn','sod','plant','garden','flowerbed','trees plant'],
      r: () => "Daryl's gotta be straight with ya — <b>we don't do landscapin'</b>. We clear, mulch, and prep ground. Once it's build-ready, ya bring in your landscaper, builder, or surveyor for the next stage."
    },
    {
      id:'wet_soil',
      kw:['wet','flood','flooded','mud','rain','soggy','swamp','saturat','river','creek','bottom land'],
      r: () => "Ha — Daryl knows wet ground. Tracked mulchers spread weight wide so we can work softer soil than wheeled equipment, but truly saturated ground we'll wait out for everyone's sake. Knox County bottoms can get sloppy when the river rises. We'll call it honest at the walk-through."
    },
    {
      id:'access',
      kw:['access','road','driveway access','narrow','gate','fence','can you fit','equipment access','easement'],
      r: () => "We can typically squeeze a tracked mulcher through an 8-foot openin', wider's better. If access is real tight or fenced in, sometimes we cut a temporary access path or stage from the neighbor's drive (with permission). Tell us about access on the quote form and we'll plan it out."
    },
    {
      id:'protected_trees',
      kw:['save tree','keep tree','protected tree','specimen','mature tree','heritage','preserve','don\'t cut'],
      r: () => "Absolutely — we mark and preserve any tree ya wanna keep. Mature hardwoods, specimen trees, property line markers, whatever ya call out at the walk-through. We work surgical around 'em."
    },
    {
      id:'environmental',
      kw:['environment','ecolog','wildlife','habitat','sustain','erosion','runoff','water quality'],
      r: () => "Forestry mulchin' is the low-impact option — leaves a nutrient mulch mat that controls erosion, holds moisture, and breaks down into soil. No burn, no haul, less disturbance to wildlife corridors than traditional clearin'."
    },
    {
      id:'commercial',
      kw:['commercial','developer','builder','homebuilder','contractor','subdivision','build site','new build','construction'],
      r: () => "Big slice of our work is for <b>builders, developers, and commercial contractors</b>. Cleared 80+ lots in Knox County, includin' tight urban-fringe parcels and flood-plain adjacent land. We coordinate with surveyors and builders, respect setbacks, and hand over ground that's ready for footer work. Ring <b>(865) 459-0722</b> and ask for the dev pricin'."
    },
    {
      id:'deposit',
      kw:['deposit','down payment','upfront','prepay','advance'],
      r: () => "<b>No deposit till you sign</b>. Estimate's free, walk's free, quote's written and line-itemed. Once ya sign and we lock the date, we work out the deposit — straight forward, nothin' sneaky."
    },
    {
      id:'thanks',
      kw:['thank','thanks','appreciate','gratitude','cheers','bless'],
      r: () => pick(["Anytime, friend. Holler if anythin' else comes up.", "Y'all are welcome. Daryl's right here when ya need me.", "Don't mention it. Now go on and get that quote started."])
    },
    {
      id:'bye',
      kw:['bye','goodbye','later','see ya','take care','signing off','that\'s all'],
      r: () => "Take 'er easy. When you're ready, ring <b>(865) 459-0722</b> or fill out the <a href='#quote'>quote form</a>. Daryl out."
    }
  ];

  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function findIntent(text){
    var t = ' ' + text.toLowerCase().replace(/[^a-z0-9$' ]/g,' ').replace(/\s+/g,' ') + ' ';
    var best = null, bestScore = 0;
    for (var i=0; i<KB.length; i++){
      var intent = KB[i];
      for (var j=0; j<intent.kw.length; j++){
        var k = intent.kw[j].toLowerCase();
        var idx = t.indexOf(' ' + k);
        if (idx === -1) idx = t.indexOf(k);
        if (idx >= 0){
          var score = k.length;
          if (score > bestScore){ bestScore = score; best = intent; }
          break;
        }
      }
    }
    return best;
  }

  function fallback(){
    return "Daryl ain't sure he caught that one. Try askin' about <b>pricin'</b>, <b>service area</b>, <b>hours</b>, <b>how fast we can start</b>, or <b>what we do</b>. Or ring a real human at <b><a href='tel:+18654590722'>(865) 459-0722</a></b> — we'll square ya away.";
  }

  /* -------- chat plumbing -------- */
  function addMsg(role, html){
    var m = document.createElement('div');
    m.className = 'daryl-msg ' + role;
    m.innerHTML = html;
    msgsEl.appendChild(m);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return m;
  }

  function showTyping(){
    var t = document.createElement('div');
    t.className = 'daryl-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgsEl.appendChild(t);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return t;
  }

  function botReply(text){
    var typing = showTyping();
    var delay = 500 + Math.min(1400, text.replace(/<[^>]+>/g,'').length * 12);
    setTimeout(function(){
      typing.remove();
      addMsg('bot', text);
    }, delay);
  }

  function handle(text){
    if (!text || !text.trim()) return;
    addMsg('user', escapeHtml(text));
    var intent = findIntent(text);
    var reply = intent ? intent.r() : fallback();
    botReply(reply);
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  /* -------- quick chips -------- */
  var CHIPS = [
    {label:'Pricing', q:'How much does it cost?'},
    {label:'Service area', q:'Where do you service?'},
    {label:'Hours', q:'What are your hours?'},
    {label:'Get a quote', q:'How do I get a free estimate?'},
    {label:'How fast?', q:'How soon can you start?'},
    {label:'What do you do?', q:'What services do you offer?'}
  ];
  CHIPS.forEach(function(c){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'daryl-chip';
    b.textContent = c.label;
    b.addEventListener('click', function(){ handle(c.q); });
    chipsEl.appendChild(b);
  });

  /* -------- events -------- */
  var greeted = false;
  function open(){
    panel.classList.add('open');
    fab.classList.add('hidden');
    if (!greeted){
      greeted = true;
      botReply("Well howdy! I'm <b>Daryl</b> — the friendly bot keepin' watch over Knoxville Land Clearing. I can answer pricin', service area, hours, how we run a job — y'all just holler.");
    }
    setTimeout(function(){ inputEl.focus(); }, 100);
  }
  function close(){
    panel.classList.remove('open');
    fab.classList.remove('hidden');
  }
  fab.addEventListener('click', open);
  closeEl.addEventListener('click', close);
  formEl.addEventListener('submit', function(e){
    e.preventDefault();
    var v = inputEl.value;
    inputEl.value = '';
    handle(v);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });
})();
