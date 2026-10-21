
(function(global){
  async function request(method,url,data){
    const options={method,headers:{}};
    if(data!==undefined){options.headers['Content-Type']='application/json';options.body=JSON.stringify(data)}
    const response=await fetch(url,options);
    let payload; try{payload=await response.json()}catch{payload=await response.text()}
    if(!response.ok){const error=new Error(payload?.message||payload?.error||`Request failed with status ${response.status}`);error.response={status:response.status,data:payload};throw error}
    return {data:payload,status:response.status};
  }
  global.axios={get:(u)=>request('GET',u),post:(u,d)=>request('POST',u,d),put:(u,d)=>request('PUT',u,d),delete:(u)=>request('DELETE',u)};
})(window);

