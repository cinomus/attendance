var C="attendance-v21";
var FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(FILES.map(function(f){return c.add(new Request(f,{cache:"reload"})).catch(function(){})}));
  }));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}));
  }));
  self.clients.claim();
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(hit){
    var net=fetch(e.request.url,{cache:"no-cache"}).then(function(r){
      if(r&&r.ok){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp)})}
      return r;
    }).catch(function(){return hit||caches.match("./index.html")});
    e.waitUntil(net.catch(function(){}));
    return hit||net;
  }));
});
