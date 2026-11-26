(function(){var app=document.getElementById('app'),isAdmin=document.body.dataset.page==='admin';
Luna.load().then(function(c){
 if(isAdmin){LunaAdmin.mount(app,c,function(){location.href='index.html'})}
 else{document.title=c.seo.title||c.brand.name;var md=document.querySelector('meta[name=description]');if(md)md.content=c.seo.description;LunaShop.mount(app,c);LunaShop.splash(c);app.addEventListener('click',function(ev){var a=ev.target.closest('[data-admin]');if(a){ev.preventDefault();location.href='admin.html'}})}
}).catch(function(err){console.error(err);var s=document.getElementById('splash');if(s)s.remove();app.textContent='The website could not load. Please refresh.'})})();
