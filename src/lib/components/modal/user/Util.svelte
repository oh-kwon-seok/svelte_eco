
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {user_modal_state, user_form_state} from '$lib/store/user/state';
    import {common_alert_state, common_company_filter_state,common_department_state,common_employment_state} from '$lib/store/common/state';
    
    import {save,modalClose} from '$lib/store/user/function';

    
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {businessNumber,phoneNumber,validEmail} from '$lib/module/common/function';
    
    import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';

    import {onMount,afterUpdate } from 'svelte';
    export let title;


    let show = false; // 비밀번호용
  
  
    console.log('title',title);
    
    let label_title = '';
   
   
    if(title === 'add'){
      label_title = '추가';
    }else if(title === 'update'){
      label_title = '수정';
    }else if(title === 'delete'){
      label_title = '삭제';
    }else if(title === 'check_delete'){
      label_title = '선택 삭제';
    }

    let color = title === 'add' || title === 'update'   ? 'blue' : 'red'; 


    let filteredEmployment = [];
    let filteredDepartment = [];


    const handleCompanyChange = (e) => {

      console.log('e.target.value : ', e.target.value);
      // 선택한 type_uid에 해당하는 회사 필터링
      filteredEmployment = $common_employment_state.filter(item => item.company['uid'] == e.target.value);
      filteredDepartment = $common_department_state.filter(item => item.company['uid'] == e.target.value);

      console.log('filteredEmployment : ', filteredEmployment, $common_employment_state);
      if(filteredEmployment.length > 0){
        $user_form_state['employment'] = filteredEmployment[0]['uid'];

      }else{
       
      }if(filteredDepartment.length > 0){
        $user_form_state['department'] = filteredEmployment[0]['uid'];

      }else{
       
      }
      

}
    afterUpdate(()=>{
      if($user_modal_state['title'] === 'update'){

        filteredEmployment = $common_employment_state.filter(item => item.company['uid'] == $user_form_state['company']);
        filteredDepartment = $common_department_state.filter(item => item.company['uid'] == $user_form_state['company']);

      }
      
    })



    </script>

 

    <Modal title={`회원 ${label_title}`}  permanent={true} color={color} bind:open={$user_modal_state[title]['use']} size="xl" placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
          
      

          <Label class="space-y-2">
            <span>사업장</span>
            <Select id="countrie" class="mt-2" bind:value={$user_form_state['company']} placeholder="" on:change={handleCompanyChange}>
                {#each $common_company_filter_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>

          <Label class="space-y-2">
            <span>직급</span>
            <Select id="countrie" class="mt-2" bind:value={$user_form_state['employment']} placeholder="" >
                {#each filteredEmployment as item}
                  <option value={item.uid}>{item.name}{item.name2 !== '' ? "[" + item.name2 + "]" : ""}</option>
                {/each}
              </Select>
          </Label>

          <Label class="space-y-2">
            <span>부서</span>
            <Select id="countrie" class="mt-2" bind:value={$user_form_state['department']} placeholder="" >
                {#each filteredDepartment as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>

        
          <!-- 사업장 ID는 사업자등록번호로 연결시켜놓음 -->
          {#if $user_modal_state['title'] === 'add'}
          <Label class="space-y-2"> 
            <span>ID</span>
            <Input type="text" id="id"  placeholder="ID를 입력하세요" required bind:value={$user_form_state['id']}/>

            {#if $user_form_state['code'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>
          {/if}

              <!-- 사업장 ID는 사업자등록번호로 연결시켜놓음 -->
              
              {#if $user_modal_state['title'] === 'add' || ($user_modal_state['title'] === 'update' && $user_form_state['auth'] === 'ROLE_ADMIN' )  }
              <Label class="space-y-2">  
                <span>비밀번호</span>
                <Input id="show-password" type={show ? 'text' : 'password'} placeholder="비밀번호를 입력하세요"  bind:value={$user_form_state['password']}>
                  <button slot="left" on:click={() => (show = !show)} class="pointer-events-auto">
                    {#if show}
                      <!-- svelte-ignore missing-declaration -->
                      <EyeOutline class="w-6 h-6" />
                    {:else}
                      <EyeSlashOutline class="w-6 h-6" />
                    {/if}
                  </button>
                </Input>
                {#if $user_form_state['code'] === '' && $common_alert_state['value'] === true}
                <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
                {/if}
              </Label>
              {/if}

              <Label class="space-y-2">
                <span>이름</span>
                <Input type="text" id="name" placeholder="이름을 입력하세요" required bind:value={$user_form_state['name']}/>
                
                {#if $user_form_state['name'] === '' && $common_alert_state['value'] === true}
                <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
                {/if}
              </Label>



              <Label class="space-y-2">
                <span>연락처 {phoneNumber($user_form_state.phone)}</span>
                <Input maxlength="11" type="text" placeholder="연락처를 입력하세요" required bind:value={$user_form_state['phone']} on:input={phoneNumber($user_form_state.phone)}/>
              </Label>
              <Label class="space-y-2">
                <span>이메일 {validEmail($user_form_state.email) ? 'OK' : '형식이 맞지 않습니다.'}</span>
                <Input maxlength="50" type="text" placeholder="이메일을 입력하세요" required bind:value={$user_form_state['email']} on:input={validEmail($user_form_state.email)}/>
              </Label>



        
  

          {#if $user_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$user_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
         

      
        

         
       

         {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
            
         <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

       {/if}
       
        
          {#if $common_alert_state['type'] === 'select' && $common_alert_state['value'] === true}
            
            <Alert  state={'select'} color={DATA_SELECT_ALERT.color} title={DATA_SELECT_ALERT['select'].title} content={DATA_SELECT_ALERT['select'].content} />

          {/if}
          

          <div class="grid grid-cols-6 gap-4">
           
          </div>
            {:else }
              {#if title === 'delete'}
              <div>삭제하시겠습니까?</div>
              {:else }
              <div>선택한 항목을 삭제하시겠습니까?</div>
              
              {/if}
          {/if}
    
        
      
      
        </form>
        <svelte:fragment slot='footer'>
        
        <Button  class="w-1/2" color={title === 'add' || title === 'update'  ? 'blue' : 'red'}    on:click={save($user_form_state,title)}>{label_title}</Button>
       
        <Button  class="w-1/2" color='red' on:click={modalClose(title)}>닫기</Button>
       
        
        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
              
        <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

        {/if}
        {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
              
        <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />

        {/if}
      
        
        </svelte:fragment>
      

      </Modal>

    