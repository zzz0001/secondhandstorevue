import axios from "axios";
import router from '../router'
import store from '../store'
import ElementUI from 'element-ui';

axios.defaults.baseURL="http://localhost:8081"
axios.defaults.timeout=5000

axios.interceptors.request.use( config => {
    const token = store.state.token
    if (token){
        config.headers['Authorization'] = token
    }
    return config;
})

axios.interceptors.response.use( response => {
    // console.log(response.data);
    if (response.data.code === 200){
        return response;
    }else{
        ElementUI.Message({
            showClose: true,
            message: response.data.message,
            type: 'error'
        })
        return Promise.reject(response.data.message);
    }
},error => {
    // console.log(error.response)
    let message;
    if (error.response.code === 401){
        store.commit("REMOVE_USER");
        router.push("/login");
    }else if(error.response.code === 404){
        message = "找不到该页面，请联系管理员";
    }else{
        message = error.response.data.message;
    }
    if (message === null){
        message = '服务器出现错误，请联系管理员'
    }
    ElementUI.Message({
        showClose: true,
        message: message,
        type: 'error'
    })
    return Promise.reject(error)
})