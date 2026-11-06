import css0 from "./assets/lumen-15ead49049b02fa68b10b2cf4b33cf68f0cb24700c45ccf52cd0f2cdd27723e6.css";
import css1 from "./assets/lumen-dark-2c9ed39fb87c78fbe2836c564ad4cebb9c8783be027d8d0b0154b0befaddc2e5.css";
import css2 from "./assets/felix-tokens-a3f8a5723ffb09bb18d2e456cff0c6c5288ebe2ca413a13636657ed31934b8bc.css";
import manifest from './manifest.json';
const bodies=new Map(manifest.assets.map((a,i)=>[a.path,{body:[css0,css1,css2][i],type:'text/css; charset=utf-8',etag:'"sha256-'+a.sha256+'"'}]));
const manifestPath='/v1/manifest-e6e33122f6591cc0c1a68942c6aeef90063ef0ab3d105251830f37e73d6b19f6.json';
bodies.set(manifestPath,{body:JSON.stringify(manifest,null,2)+'\n',type:'application/json; charset=utf-8',etag:'"manifest-'+manifestPath.split('-')[1].split('.')[0]+'"'});
export {manifestPath};
export default {async fetch(request){
 const url=new URL(request.url),asset=bodies.get(url.pathname);
 const common={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, HEAD, OPTIONS','Access-Control-Expose-Headers':'ETag, Content-Length','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'cross-origin','Referrer-Policy':'no-referrer'};
 if(!asset)return new Response('Not found\n',{status:404,headers:{...common,'Cache-Control':'no-store','Content-Type':'text/plain; charset=utf-8'}});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...common,'Access-Control-Max-Age':'86400'}});
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed\n',{status:405,headers:{...common,Allow:'GET, HEAD, OPTIONS','Cache-Control':'no-store'}});
 const headers={...common,'Content-Type':asset.type,'Cache-Control':'public, max-age=31536000, immutable',ETag:asset.etag,'Content-Length':String(new TextEncoder().encode(asset.body).byteLength)};
 if(request.headers.get('If-None-Match')===asset.etag){delete headers['Content-Length'];return new Response(null,{status:304,headers});}
 return new Response(request.method==='HEAD'?null:asset.body,{headers});
}};
