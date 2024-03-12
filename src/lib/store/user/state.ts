

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const user_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
   
     
   });

  const user_form_state : any = writable({
    uid : 0,
    id : '',
    company : '', // 사업장
    employment : '',
    department : '',

    name : '', // 사용자이름
    email : '', // 이메일
    phone : '', // 연락처
    password : '1111',
    auth:'',
    used : 1,
    
  })
  

  export {user_modal_state,user_form_state};