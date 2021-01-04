import  myAxios from './interceptor';


function request(url,params,options={error:true},method){
    return new Promise((resolve,reject) => {
        let data = {};
        if(method === 'get'){
            data = {params};
        }
        if(method === 'post'){
            data = {data :params}
        }
        myAxios({url,method,...data}).then((res) =>{
            if(res.status === 200){
                resolve(res.data);
            }else{
                if(options.error){
                    console.log(res.message);
                }else{
                    reject(res);
                }
            }

        }).catch((error) => {
            console.log(error);
        })
    })
}
function get(url,params,options){
    return request(url,params,options,'get');
}
function post(url,params,options){
    return request(url,params,options,'post');
}
export default {
    get,post
}