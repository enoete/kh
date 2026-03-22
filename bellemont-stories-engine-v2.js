(function(){
var PC=[["#2d3a2e","#8b6f47"],["#8b6f47","#2d3a2e"],["#3a4a5a","#7a8c6e"],["#5a3e28","#2d3a2e"],["#1a2a1a","#c9a96e"],["#3d3028","#7a8c6e"]];

// ── STATS — hits API + localStorage fallback ──
function getStat(id){try{return JSON.parse(localStorage.getItem('bm_stats')||'{}')[id]||{r:0,s:0};}catch(e){return{r:0,s:0};}}
function addRead(id){
  fetch(BM_API+'/'+id+'/read',{method:'POST'}).catch(function(){});
  try{var a=JSON.parse(localStorage.getItem('bm_stats')||'{}');if(!a[id])a[id]={r:0,s:0};a[id].r++;localStorage.setItem('bm_stats',JSON.stringify(a));}catch(e){}
}
function addShare(id){
  fetch(BM_API+'/'+id+'/share',{method:'POST'}).catch(function(){});
  try{var a=JSON.parse(localStorage.getItem('bm_stats')||'{}');if(!a[id])a[id]={r:0,s:0};a[id].s++;localStorage.setItem('bm_stats',JSON.stringify(a));}catch(e){}
}
function score(id){var s=getStat(id);return s.r+s.s*3;}

// ── IMAGE HTML ──
function imgHtml(story,h,idx){
  var c=PC[idx%PC.length];
  return story.image
    ?'<img src="'+story.image+'" alt="'+story.title+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">'
    :'<div style="background:linear-gradient(135deg,'+c[0]+','+c[1]+');min-height:'+h+'px;width:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.25);font-size:9px;letter-spacing:0.2em;text-transform:uppercase;">Image</div>';
}

// ── SHARE HTML ──
function shareHtml(s){
  var icons={
    facebook:'<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram:'<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    twitter:'<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    whatsapp:'<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    email:'<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
    copy:'<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>'
  };
  return '<div class="bm-share-wrap">'
    +'<button class="bm-share-btn" data-sid="'+s.id+'">Share</button>'
    +'<div class="bm-share-panel" id="bsp-'+s.id+'">'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="facebook"><span class="bm-icon" style="background:#1877f2;">'+icons.facebook+'</span>Facebook</button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="instagram"><span class="bm-icon" style="background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);">'+icons.instagram+'</span>Instagram</button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="twitter"><span class="bm-icon" style="background:#000;">'+icons.twitter+'</span>X / Twitter</button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="whatsapp"><span class="bm-icon" style="background:#25d366;">'+icons.whatsapp+'</span>WhatsApp</button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="email"><span class="bm-icon" style="background:#8b6f47;">'+icons.email+'</span>Email</button>'
    +'<hr style="border:none;border-top:1px solid #e2dbd2;margin:4px 0;">'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="copy"><span class="bm-icon" style="background:#1a1a18;">'+icons.copy+'</span>Copy Link</button>'
    +'</div>'
    +'</div>';
}

var cur="all";
var BM_API="https://stories.bellemontsanctuaryresort.com/api/stories";

// ── FETCH AND RENDER ──
window.bmLoad=function(){
  var ce=document.getElementById("storiesContent");
  var sc=document.getElementById("storiesCount");
  if(ce) ce.innerHTML='<div style="padding:4rem 3rem;text-align:center;color:#9a9088;font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;">Loading stories...</div>';
  fetch(BM_API)
    .then(function(r){return r.json();})
    .then(function(stories){
      window.BM_STORIES=stories.map(function(s){
        return {
          id:s.id, title:s.title, excerpt:s.excerpt,
          category:s.category, categoryLabel:s.category_label,
          date:s.date, readTime:s.read_time,
          image:s.image, url:s.url, featured:s.featured,
          reads:s.reads, shares:s.shares
        };
      });
      window.bmRender(cur);
    })
    .catch(function(){
      // Fallback to static BM_STORIES if API unreachable
      console.warn('Stories API unreachable, using static data');
      window.bmRender(cur);
    });
};

// ── RENDER ──
window.bmRender=function(filter){
  var STORIES=window.BM_STORIES||[];
  var fl=filter==="all"?STORIES
    :filter==="popular"?[].concat(STORIES).sort(function(a,b){return score(b.id)-score(a.id);})
    :STORIES.filter(function(s){return s.category===filter;});
  var ce=document.getElementById("storiesContent");
  var sc=document.getElementById("storiesCount");
  if(sc) sc.textContent=fl.length+" "+(fl.length===1?"Story":"Stories");
  if(!fl.length){
    ce.innerHTML='<div class="no-stories-yet"><h2>No stories yet.</h2><p>Check back soon.</p></div>';
    return;
  }
  var f=fl[0],rest=fl.slice(1),fs=getStat(f.id);
  var fh='<div class="featured-story-wrap">'
    +'<a class="featured-story story-lnk" href="'+f.url+'" data-sid="'+f.id+'">'
    +'<div class="featured-image">'+imgHtml(f,500,0)+'</div>'
    +'<div class="featured-body">'
    +'<span class="story-tag">'+f.categoryLabel+'</span>'
    +'<h2 class="featured-title">'+f.title+'</h2>'
    +'<p class="featured-excerpt">'+f.excerpt+'</p>'
    +'<div class="story-meta">'
    +'<span>'+f.date+'</span><span>'+f.readTime+'</span>'
    +(fs.r>0?'<span>&#128065; '+fs.r+'</span>':'')
    +'<span class="read-more">Read Story</span>'
    +'</div>'
    +'</div></a>'
    +'<div class="featured-share-bar">'+shareHtml(f)+'</div>'
    +'</div>';

  var gh=rest.length?'<div class="stories-grid">'+rest.map(function(s,i){
    var st=getStat(s.id);
    return '<div class="story-card-wrap" data-category="'+s.category+'">'
      +'<a class="story-card story-lnk" href="'+s.url+'" data-sid="'+s.id+'">'
      +'<div class="story-card-image">'+imgHtml(s,260,i+1)
      +'<div class="story-card-overlay">'
      +'<span class="overlay-tag">'+s.categoryLabel+'</span>'
      +'<div class="overlay-title">'+s.title+'</div>'
      +'<div class="overlay-excerpt">'+s.excerpt.substring(0,120)+'...</div>'
      +'<span class="overlay-cta">Read Story</span>'
      +'</div></div>'
      +'<div class="story-card-body">'
      +'<span class="story-tag">'+s.categoryLabel+'</span>'
      +'<h3 class="story-card-title">'+s.title+'</h3>'
      +'<p class="story-card-excerpt">'+s.excerpt.substring(0,100)+'...</p>'
      +'<div class="story-card-footer">'
      +'<span>'+s.date+'</span><span>'+s.readTime+'</span>'
      +(st.r>0?'<span>&#128065; '+st.r+'</span>':'')
      +'</div>'
      +'</div></a>'
      +'<div style="padding:0 1.8rem 1.8rem;">'+shareHtml(s)+'</div>'
      +'</div>';
  }).join("")+'</div>':"";


  ce.innerHTML=fh+gh;

  setTimeout(function(){
    document.querySelectorAll(".bm-share-btn").forEach(function(btn){
      var fresh = btn.cloneNode(true);
      btn.parentNode.replaceChild(fresh, btn);
      fresh.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var sid = this.dataset.sid;
        var panel = document.getElementById("bsp-"+sid);
        if(!panel) return;
        var isOpen = panel.style.display === 'flex';
        document.querySelectorAll(".bm-share-panel").forEach(function(p){p.style.display='none';});
        panel.style.display = isOpen ? 'none' : 'flex';
      });
    });
    document.querySelectorAll(".bm-sopt").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var sid=this.dataset.sid, plt=this.dataset.p;
        var s=(window.BM_STORIES||[]).find(function(x){return x.id===sid;});
        if(!s) return;
        var fu=window.location.origin+s.url,eu=encodeURIComponent(fu),et=encodeURIComponent(s.title);
        addShare(sid);
        var links={
          facebook:"https://www.facebook.com/sharer/sharer.php?u="+eu,
          twitter:"https://twitter.com/intent/tweet?url="+eu+"&text="+et,
          whatsapp:"https://api.whatsapp.com/send?text="+et+"%20"+eu,
          email:"mailto:?subject="+et+"&body="+eu,
          instagram:"https://www.instagram.com/"
        };
        if(plt==="instagram"){
          // Instagram doesn't support direct URL sharing — copy link and open IG
          navigator.clipboard.writeText(fu).then(function(){
            var panel=document.getElementById("bsp-"+sid);
            panel.innerHTML='<div style="padding:0.8rem 1rem;font-size:12px;color:#8b6f47;font-family:Jost,sans-serif;line-height:1.5;">&#10003; Link copied!<br><span style="color:#9a9088;">Paste it in your Instagram story or bio.</span></div>';
            setTimeout(function(){window.open("https://www.instagram.com/","_blank");},800);
          });
          return;
        }
        if(plt==="copy"){
          navigator.clipboard.writeText(fu).then(function(){
            var panel=document.getElementById("bsp-"+sid);
            panel.innerHTML='<div style="padding:0.8rem 1rem;font-size:13px;color:#27ae60;font-family:Jost,sans-serif;">&#10003; Copied!</div>';
            setTimeout(function(){window.bmRender(cur);},1500);
          });
        } else {
          window.open(links[plt],"_blank","width=600,height=400");
          document.getElementById("bsp-"+sid).style.display='none';
        }
      });
    });
    // Close on outside click — use timeout to avoid catching the opening click
    setTimeout(function(){
      document.addEventListener("click", function(e){
        if(!e.target.closest(".bm-share-wrap")){
          document.querySelectorAll(".bm-share-panel").forEach(function(p){p.style.display='none';});
        }
      });
    }, 100);
  }, 0);
};

// ── SINGLE DELEGATED EVENT HANDLER — works on dynamically rendered content ──
document.addEventListener("click",function(e){

  // Close all panels when clicking outside
  if(!e.target.closest(".bm-share-wrap")){
    document.querySelectorAll(".bm-share-panel").forEach(function(p){p.classList.remove("open");});
    return;
  }

  // Share toggle button
  var shareBtn=e.target.closest(".bm-share-btn");
  if(shareBtn){
    e.preventDefault();e.stopPropagation();
    var sid=shareBtn.dataset.sid;
    var panel=document.getElementById("bsp-"+sid);
    document.querySelectorAll(".bm-share-panel").forEach(function(p){if(p!==panel)p.classList.remove("open");});
    panel.classList.toggle("open");
    return;
  }

  // Share option buttons
  var opt=e.target.closest(".bm-sopt");
  if(opt){
    e.preventDefault();e.stopPropagation();
    var sid=opt.dataset.sid,plt=opt.dataset.p;
    var s=(window.BM_STORIES||[]).find(function(x){return x.id===sid;});
    if(!s)return;
    var fu=window.location.origin+s.url,eu=encodeURIComponent(fu),et=encodeURIComponent(s.title);
    addShare(sid);
    var links={
      facebook:"https://www.facebook.com/sharer/sharer.php?u="+eu,
      twitter:"https://twitter.com/intent/tweet?url="+eu+"&text="+et,
      whatsapp:"https://api.whatsapp.com/send?text="+et+"%20"+eu,
      email:"mailto:?subject="+et+"&body="+eu
    };
    if(plt==="copy"){
      navigator.clipboard.writeText(fu).then(function(){
        var panel=document.getElementById("bsp-"+sid);
        panel.innerHTML='<div style="padding:0.8rem 1rem;font-size:13px;color:#27ae60;font-family:Jost,sans-serif;font-weight:300;">&#10003; Link copied!</div>';
        setTimeout(function(){window.bmRender(cur);},1500);
      });
    } else {
      window.open(links[plt],"_blank","width=600,height=400");
      document.getElementById("bsp-"+sid).classList.remove("open");
    }
    return;
  }

  // Read tracking on story links
  var lnk=e.target.closest(".story-lnk");
  if(lnk&&lnk.dataset.sid) addRead(lnk.dataset.sid);
});

window.bmBind=function(){}; // no-op, delegation handles everything

window.bmSetFilter=function(f){
  cur=f;
  document.querySelectorAll(".filter-btn").forEach(function(b){
    b.classList.toggle("active",b.dataset.filter===f);
  });
  window.bmRender(f);
};

// ── INIT ──
document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll(".filter-btn").forEach(function(b){
    b.addEventListener("click",function(){window.bmSetFilter(b.dataset.filter);});
  });
  // Use API if available, fallback to static BM_STORIES
  if(window.BM_STORIES && window.BM_STORIES.length > 0){
    window.bmRender("all");
  } else {
    window.bmLoad();
  }
});
})();
