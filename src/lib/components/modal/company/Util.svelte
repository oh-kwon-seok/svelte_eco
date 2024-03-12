
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {company_modal_state, company_form_state} from '$lib/store/company/state';
    import {common_alert_state, common_toast_state, common_company_state} from '$lib/store/common/state';
    
    import {save,modalClose} from '$lib/store/company/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {businessNumber,phoneNumber,validEmail} from '$lib/module/common/function';
    
    export let title;
    
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

    let color = title === 'add' || title === 'update' ? 'blue' : 'red'; 


  

    </script>

 

    <Modal title={`거래처 ${label_title}`} permanent={true} color={color} bind:open={$company_modal_state[title]['use']} size="xl" placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
          
          <Label class="space-y-2">
            <span>사업자번호 {businessNumber($company_form_state.code)}</span>
            <Input maxlength="10" type="text" placeholder="거래처명을 입력하세요" required bind:value={$company_form_state['code']} on:input={businessNumber($company_form_state.code)}/>
            
            {#if $company_form_state['code'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

         
          <Label class="space-y-2">
            <span>거래처</span>
            <Input type="text" id="last_name" placeholder="매입처를 입력하세요" required bind:value={$company_form_state['name']}/>
            
            {#if $company_form_state['name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

          <Label class="space-y-2">
            <span>대표자</span>
            <Input type="text" id="last_name" placeholder="대표자를 입력하세요" required bind:value={$company_form_state['owner_name']}/>
         
          </Label>
        
          <Label class="space-y-2">
            <span>대표자 연락처 {phoneNumber($company_form_state.owner_phone)}</span>
            <Input maxlength="11" type="text" placeholder="연락처를 입력하세요" required bind:value={$company_form_state['owner_phone']} on:input={phoneNumber($company_form_state.owner_phone)}/>
          </Label>
          <Label class="space-y-2">
            <span>담당자</span>
            <Input type="text" id="last_name" placeholder="담당자를 입력하세요" required bind:value={$company_form_state['emp_name']}/>
         
          </Label>
          <Label class="space-y-2">
            <span>담당자 연락처 {phoneNumber($company_form_state.emp_phone)}</span>
            <Input maxlength="11" type="text" placeholder="연락처를 입력하세요" required bind:value={$company_form_state['emp_phone']} on:input={phoneNumber($company_form_state.emp_phone)}/>
          </Label>

          <Label class="space-y-2">
            <span>담당자 연락처 {phoneNumber($company_form_state.emp_phone)}</span>
            <Input maxlength="11" type="text" placeholder="연락처를 입력하세요" required bind:value={$company_form_state['emp_phone']} on:input={phoneNumber($company_form_state.emp_phone)}/>
          </Label>


          <Label class="space-y-2">
            <span>Fax 번호 {phoneNumber($company_form_state.fax)}</span>
            <Input maxlength="11" type="text" placeholder="Fax 번호를 입력하세요" required bind:value={$company_form_state['fax']} on:input={phoneNumber($company_form_state.fax)}/>
          </Label>

        


         
          <Label class="space-y-2">
            <span>구분</span>
            <Select id="countries" class="mt-2" bind:value={$company_form_state['type']} placeholder="">
              <option value={"매입"}>{"매입"}</option>    
              <option value={"매출"}>{"매출"}</option>
              <option value={"매입/매출"}>{"매입/매출"}</option>
              <option value={"사업장"}>{"사업장"}</option>
              

            </Select>
          </Label>
    



    
          {#if $company_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$company_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
         

          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
         
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
        
        <svelte:fragment slot="footer">
          <Button  class="w-1/2"  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}    on:click={save($company_form_state,title)}>{label_title}</Button>
          <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
          {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
              
          <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />
  
          {/if}
          {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
                
          <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />
  
          {/if}
        
        </svelte:fragment>
    
        
     

      </Modal>

    