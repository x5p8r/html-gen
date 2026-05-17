(() => {
  const qs = s => document.querySelector(s);
  const $ = id => document.getElementById(id);

  const siteTitle = $('siteTitle');
  const primaryColor = $('primaryColor');
  const fontStyle = $('fontStyle');
  const layoutStyle = $('layoutStyle');
  const modeToggle = $('modeToggle');
  const heroText = $('heroText');
  const btnText = $('btnText');
  const previewBtn = $('previewBtn');
  const previewFrame = $('previewFrame');
  const downloadAll = $('downloadAll');
  const downloadHTML = $('downloadHTML');
  const downloadCSS = $('downloadCSS');
  const downloadJS = $('downloadJS');
  const copyHTML = $('copyHTML');
  const copyCSS = $('copyCSS');
  const copyJS = $('copyJS');
  const loader = $('loader');
  let loaderTimer = null;
  const avatarFile = $('avatarFile');
  const avatarPreview = $('avatarPreview');

  const yearSpan = document.getElementById('year');
  yearSpan.textContent = new Date().getFullYear();

  let avatarData = '';

  function showLoader(on = true){
    if(on){
      loader.classList.add('show');
      loader.hidden = false;
      if(loaderTimer) clearTimeout(loaderTimer);
      loaderTimer = setTimeout(()=>{
        loader.classList.remove('show');
        setTimeout(()=>{ loader.hidden = true; loaderTimer = null; }, 320);
      }, 15000);
    } else {
      loader.classList.remove('show');
      if(loaderTimer) { clearTimeout(loaderTimer); loaderTimer = null; }
      setTimeout(()=>{ loader.hidden = true; }, 320);
    }
  }

  function buildFontLink(name){
    const map = {
      'Inter':'Inter:wght@300;400;600;700',
      'Merriweather':'Merriweather:wght@300;400;700',
      'IBM+Plex+Mono':'IBM+Plex+Mono:ital,wght@0,300;0,400;1,300'
    };
    const key = map[name] ? map[name] : name;
    return `https://fonts.googleapis.com/css2?family=${key}&display=swap`;
  }

  function generateFiles(){
    const opts = {
      title: siteTitle.value || 'My Project',
      color: primaryColor.value || '#b08b60',
      font: fontStyle.value,
      layout: layoutStyle.value,
      mode: modeToggle.value,
      hero: heroText.value || 'Build beautiful sites in minutes.',
      button: btnText.value || 'Get Started',
      avatar: avatarData
    };

    const fontLink = buildFontLink(opts.font);

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
  <link href="${fontLink}" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <style> :root{--accent:${opts.color}} </style>
</head>
<body>
  <header class="hero-header">
    <div class="hero-avatar">${opts.avatar?`<img src="${opts.avatar}" alt="avatar">`:''}</div>
    <div class="hero-content">
      <h1>${escapeHtml(opts.hero)}</h1>
      <p><a class="cta" href="#">${escapeHtml(opts.button)}</a></p>
    </div>
  </header>
  <script src="script.js"></script>
</body>
</html>`;

    const css = `/* Generated template styles */\n@import url('${fontLink}');\nbody{font-family:'${opts.font.replace('+',' ')}',system-ui,Arial,sans-serif;margin:0;background:${opts.mode==='dark'?"#0b0b0c":"#f6f4f2"};color:${opts.mode==='dark'?"#eae7e4":"#1b1918"};}\n.hero-header{display:flex;align-items:center;gap:14px;padding:48px;background:linear-gradient(180deg,rgba(0,0,0,0.2),transparent);}\n.hero-avatar img{width:72px;height:72px;border-radius:999px;object-fit:cover;border:3px solid rgba(255,255,255,0.06)}\n.h1{font-size:28px}\n.cta{display:inline-block;padding:12px 18px;background:var(--accent);color:#fff;border-radius:10px;text-decoration:none}`;

    const js = `// minimal behavior for generated template\ndocument.querySelectorAll('.cta').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();alert('CTA clicked')}))`;

    return { html, css, js };
  }

  function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }

  function updatePreview(){
    const files = generateFiles();
    previewFrame.srcdoc = files.html.replace('styles.css', 'data:text/css,' + encodeURIComponent(files.css));
  }

  function downloadFile(filename, content, type='text/plain'){ const a = document.createElement('a'); const blob = new Blob([content],{type}); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),5000); }

  async function downloadZipPackage(){
    showLoader(true);
    try{
      const files = generateFiles();
      if(window.JSZip){
        const zip = new JSZip();
        zip.file('index.html', files.html);
        zip.file('styles.css', files.css);
        zip.file('script.js', files.js);
        const content = await zip.generateAsync({type:'blob'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(content); a.download = `${(siteTitle.value||'site').replace(/\s+/g,'_')}.zip`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
      } else {
        // fallback: download files individually
        downloadFile('index.html', files.html, 'text/html');
        downloadFile('styles.css', files.css, 'text/css');
        downloadFile('script.js', files.js, 'application/javascript');
      }
    }catch(err){
      console.error('Zip generation failed', err);
      alert('Generation failed — check console.');
    }finally{
      showLoader(false);
    }
  }

  function applyPreset(name){
    if(name==='minimal'){
      siteTitle.value='Sleek Site'; heroText.value='Crafted for performance.'; btnText.value='Explore'; primaryColor.value='#b08b60'; layoutStyle.value='centered'; fontStyle.value='Inter'; modeToggle.value='dark';
    } else if(name==='blog'){
      siteTitle.value='Writer'; heroText.value='Thoughtful long-form articles.'; btnText.value='Read Latest'; primaryColor.value='#8a5a38'; fontStyle.value='Merriweather'; modeToggle.value='light';
    } else if(name==='landing'){
      siteTitle.value='Product'; heroText.value='A beautiful landing page.'; btnText.value='Get Access'; primaryColor.value='#b08b60'; fontStyle.value='Inter'; modeToggle.value='dark';
    }
    updatePreview();
  }

  // copy helpers
  async function copyText(text){ try{ await navigator.clipboard.writeText(text); alert('Copied to clipboard'); }catch(e){ alert('Copy failed') } }

  // wire events
  [siteTitle,primaryColor,fontStyle,layoutStyle,modeToggle,heroText,btnText].forEach(el=>el.addEventListener('input',()=>{ updatePreview() }));

  previewBtn.addEventListener('click', e=>{ e.preventDefault(); updatePreview(); });
  downloadAll.addEventListener('click', e=>{ e.preventDefault(); downloadZipPackage(); });
  downloadHTML.addEventListener('click', ()=>{ const f = generateFiles(); downloadFile('index.html', f.html, 'text/html'); });
  downloadCSS.addEventListener('click', ()=>{ const f = generateFiles(); downloadFile('styles.css', f.css, 'text/css'); });
  downloadJS.addEventListener('click', ()=>{ const f = generateFiles(); downloadFile('script.js', f.js, 'application/javascript'); });

  copyHTML.addEventListener('click', ()=>{ copyText(generateFiles().html) });
  copyCSS.addEventListener('click', ()=>{ copyText(generateFiles().css) });
  copyJS.addEventListener('click', ()=>{ copyText(generateFiles().js) });

  document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click', e=>applyPreset(e.target.dataset.preset)));

  avatarFile.addEventListener('change', e=>{
    const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = ()=>{ avatarData = reader.result; avatarPreview.style.backgroundImage = `url(${avatarData})`; avatarPreview.style.backgroundSize='cover'; updatePreview(); }; reader.readAsDataURL(file);
  });

  const generateBtn = $('generateBtn');
  if(generateBtn) generateBtn.addEventListener('click', e=>{ e.preventDefault(); downloadZipPackage(); });

  // initial preview
  updatePreview();

})();
