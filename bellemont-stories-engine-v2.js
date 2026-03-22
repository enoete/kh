(function(){
var PC=[["#2d3a2e","#8b6f47"],["#8b6f47","#2d3a2e"],["#3a4a5a","#7a8c6e"],["#5a3e28","#2d3a2e"],["#1a2a1a","#c9a96e"],["#3d3028","#7a8c6e"]];

// ── STATS ──
function getStat(id){try{return JSON.parse(localStorage.getItem('bm_stats')||'{}')[id]||{r:0,s:0};}catch(e){return{r:0,s:0};}}
function addRead(id){try{var a=JSON.parse(localStorage.getItem('bm_stats')||'{}');if(!a[id])a[id]={r:0,s:0};a[id].r++;localStorage.setItem('bm_stats',JSON.stringify(a));}catch(e){}}
function addShare(id){try{var a=JSON.parse(localStorage.getItem('bm_stats')||'{}');if(!a[id])a[id]={r:0,s:0};a[id].s++;localStorage.setItem('bm_stats',JSON.stringify(a));}catch(e){}}
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
  return '<div class="bm-share-wrap">'
    +'<button class="bm-share-btn" data-sid="'+s.id+'">Share</button>'
    +'<div class="bm-share-panel" id="bsp-'+s.id+'">'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="facebook"><span class="bm-icon" style="background:#1877f2;">f</span>Facebook</button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="twitter"><span class="bm-icon" style="background:#000;">𝕏</span>X / Twitter</button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="whatsapp"><span class="bm-icon" style="background:#25d366;">W</span>WhatsApp</button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="email"><span class="bm-icon" style="background:#8b6f47;">@</span>Email</button>'
    +'<hr style="border:none;border-top:1px solid #e2dbd2;margin:4px 0;">'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="copy"><span class="bm-icon" style="background:#1a1a18;">&#x2398;</span>Copy Link</button>'
    +'</div>'
    +'</div>';
}

var cur="all";

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
          email:"mailto:?subject="+et+"&body="+eu
        };
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
  window.bmRender("all");
});
})();
