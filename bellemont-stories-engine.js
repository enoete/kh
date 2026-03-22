(function(){
var PC=[["#2d3a2e","#8b6f47"],["#8b6f47","#2d3a2e"],["#3a4a5a","#7a8c6e"],["#5a3e28","#2d3a2e"],["#1a2a1a","#c9a96e"],["#3d3028","#7a8c6e"]];

// ── STATS ──
function getStat(id){try{return JSON.parse(localStorage.getItem('bm_stats')||'{}')[id]||{r:0,s:0};}catch(e){return{r:0,s:0};}}
function addRead(id){try{var a=JSON.parse(localStorage.getItem('bm_stats')||'{}');if(!a[id])a[id]={r:0,s:0};a[id].r++;localStorage.setItem('bm_stats',JSON.stringify(a));}catch(e){}}
function addShare(id){try{var a=JSON.parse(localStorage.getItem('bm_stats')||'{}');if(!a[id])a[id]={r:0,s:0};a[id].s++;localStorage.setItem('bm_stats',JSON.stringify(a));}catch(e){}}
function score(id){var s=getStat(id);return s.r+s.s*3;}

// ── SVG ICONS ──
var ICONS={
  facebook:'<svg width="16" height="16" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  twitter:'<svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  whatsapp:'<svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  email:'<svg width="16" height="16" viewBox="0 0 24 24" fill="#8b6f47"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  copy:'<svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1a18"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>'
};

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
    +'<button class="bm-share-btn" data-sid="'+s.id+'">'
    +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
    +' Share'
    +'</button>'
    +'<div class="bm-share-panel" id="bsp-'+s.id+'">'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="facebook">'+ICONS.facebook+'<span>Facebook</span></button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="twitter">'+ICONS.twitter+'<span>X / Twitter</span></button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="whatsapp">'+ICONS.whatsapp+'<span>WhatsApp</span></button>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="email">'+ICONS.email+'<span>Email</span></button>'
    +'<div class="bm-share-divider"></div>'
    +'<button class="bm-sopt" data-sid="'+s.id+'" data-p="copy">'+ICONS.copy+'<span>Copy Link</span></button>'
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
  var fh='<a class="featured-story story-lnk" href="'+f.url+'" data-sid="'+f.id+'">'
    +'<div class="featured-image">'+imgHtml(f,500,0)+'</div>'
    +'<div class="featured-body">'
    +'<span class="story-tag">'+f.categoryLabel+'</span>'
    +'<h2 class="featured-title">'+f.title+'</h2>'
    +'<p class="featured-excerpt">'+f.excerpt+'</p>'
    +'<div class="story-meta">'
    +'<span>'+f.date+'</span><span>'+f.readTime+'</span>'
    +(fs.r>0?'<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'+fs.r+'</span>':'')
    +'<span class="read-more">Read Story</span>'
    +'</div>'
    +shareHtml(f)
    +'</div></a>';

  var gh=rest.length?'<div class="stories-grid">'+rest.map(function(s,i){
    var st=getStat(s.id);
    return '<a class="story-card story-lnk" href="'+s.url+'" data-sid="'+s.id+'" data-category="'+s.category+'">'
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
      +(st.r>0?'<span>👁 '+st.r+'</span>':'')
      +'</div>'
      +shareHtml(s)
      +'</div></a>';
  }).join("")+'</div>':"";

  ce.innerHTML=fh+gh;
  bmBind();
};

// ── BIND EVENTS ──
window.bmBind=function(){
  document.querySelectorAll(".story-lnk").forEach(function(el){
    el.addEventListener("click",function(){addRead(this.dataset.sid);});
  });
  document.querySelectorAll(".bm-share-btn").forEach(function(btn){
    btn.addEventListener("click",function(e){
      e.preventDefault();e.stopPropagation();
      var p=document.getElementById("bsp-"+this.dataset.sid);
      document.querySelectorAll(".bm-share-panel").forEach(function(x){if(x!==p)x.classList.remove("open");});
      p.classList.toggle("open");
    });
  });
  document.querySelectorAll(".bm-sopt").forEach(function(btn){
    btn.addEventListener("click",function(e){
      e.preventDefault();e.stopPropagation();
      var sid=this.dataset.sid,p=this.dataset.p;
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
      if(p==="copy"){
        navigator.clipboard.writeText(fu).then(function(){
          var panel=document.getElementById("bsp-"+sid);
          panel.innerHTML='<div style="padding:0.8rem 1rem;font-size:12px;color:#27ae60;display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Link copied!</div>';
          setTimeout(function(){window.bmRender(cur);},1500);
        });
      } else {
        window.open(links[p],"_blank","width=600,height=400");
        document.getElementById("bsp-"+sid).classList.remove("open");
      }
    });
  });
  document.addEventListener("click",function h(){
    document.querySelectorAll(".bm-share-panel").forEach(function(p){p.classList.remove("open");});
    document.removeEventListener("click",h);
  });
};

window.bmSetFilter=function(f){
  cur=f;
  document.querySelectorAll(".filter-btn").forEach(function(b){
    b.classList.toggle("active",b.dataset.filter===f);
  });
  window.bmRender(f);
};

// ── INJECT STYLES ──
var st=document.createElement("style");
st.textContent=`
  .bm-share-wrap{position:relative;display:inline-block;margin-top:1.2rem;}
  .bm-share-btn{
    display:inline-flex;align-items:center;gap:6px;
    background:none;border:1px solid #e2dbd2;
    color:#9a9088;font-family:'Jost',sans-serif;
    font-size:11px;letter-spacing:0.12em;text-transform:uppercase;
    padding:7px 14px;cursor:pointer;transition:all 0.2s;
    border-radius:2px;
  }
  .bm-share-btn:hover{border-color:#1a1a18;color:#1a1a18;}
  .bm-share-panel{
    display:none;flex-direction:column;
    position:absolute;bottom:calc(100% + 8px);left:0;
    background:#fff;border:1px solid #e2dbd2;
    padding:6px;
    box-shadow:0 8px 32px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.06);
    min-width:200px;z-index:99;border-radius:4px;
  }
  .bm-share-panel.open{display:flex;}
  .bm-sopt{
    display:flex;align-items:center;gap:10px;
    background:none;border:none;text-align:left;
    padding:10px 12px;font-family:'Jost',sans-serif;
    font-size:13px;font-weight:300;letter-spacing:0.04em;
    color:#1a1a18;cursor:pointer;width:100%;
    border-radius:3px;transition:background 0.15s;
  }
  .bm-sopt:hover{background:#f7f3ee;}
  .bm-sopt svg{flex-shrink:0;}
  .bm-share-divider{height:1px;background:#e2dbd2;margin:4px 0;}
`;
document.head.appendChild(st);

// ── INIT ──
document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll(".filter-btn").forEach(function(b){
    b.addEventListener("click",function(){window.bmSetFilter(b.dataset.filter);});
  });
  window.bmRender("all");
});
})();
