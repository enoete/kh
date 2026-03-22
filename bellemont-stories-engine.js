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
  var fh='<a class="featured-story story-lnk" href="'+f.url+'" data-sid="'+f.id+'">'
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
          panel.innerHTML='<div style="padding:0.8rem 1rem;font-size:13px;color:#27ae60;font-family:Jost,sans-serif;font-weight:300;">&#10003; Link copied!</div>';
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
    font-size:11px;letter-spacing:0.15em;text-transform:uppercase;
    padding:7px 16px;cursor:pointer;transition:all 0.2s;
  }
  .bm-share-btn:hover{border-color:#1a1a18;color:#1a1a18;}
  .bm-share-panel{
    display:none;flex-direction:column;gap:2px;
    position:absolute;bottom:calc(100% + 10px);left:0;
    background:#fff;
    border:1px solid #e2dbd2;
    padding:8px;
    box-shadow:0 -4px 24px rgba(0,0,0,0.1),0 2px 8px rgba(0,0,0,0.05);
    min-width:210px;z-index:999;
  }
  .bm-share-panel.open{display:flex;}
  .bm-sopt{
    display:flex;align-items:center;gap:10px;
    background:none;border:none;text-align:left;
    padding:9px 10px;font-family:'Jost',sans-serif;
    font-size:13px;font-weight:300;letter-spacing:0.03em;
    color:#1a1a18;cursor:pointer;width:100%;
    transition:background 0.15s;
  }
  .bm-sopt:hover{background:#f7f3ee;}
  .bm-icon{
    display:inline-flex;align-items:center;justify-content:center;
    width:24px;height:24px;border-radius:50%;
    color:#fff;font-size:11px;font-weight:700;
    font-family:'Jost',sans-serif;flex-shrink:0;
    font-style:normal;
  }
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
