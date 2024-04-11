
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper,Textarea} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {equipment_modal_state, equipment_form_state} from '$lib/store/equipment/state';
    import {common_alert_state, common_toast_state, common_equipment_state,common_company_filter_state} from '$lib/store/common/state';
    
    import {save,modalClose} from '$lib/store/equipment/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {businessNumber,phoneNumber,validEmail} from '$lib/module/common/function';
    import {handleSubmit} from '$lib/store/common/function';
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

 

    <Modal title={`설비 ${label_title}`} permanent={true} color={color} bind:open={$equipment_modal_state[title]['use']} size="xl" placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
         <form action="#" on:submit={handleSubmit} >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">

          <Label class="space-y-2">
            <span>사업장</span>
            <Select id="countrie" class="mt-2" bind:value={$equipment_form_state['company']} placeholder="">
                {#each $common_company_filter_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>

          <Label class="space-y-2">
            <span>설비명</span>
            <Input type="text" id="last_name" placeholder="설비명을 입력하세요" required bind:value={$equipment_form_state['name']}/>
            {#if $equipment_form_state['name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>
          <Label class="space-y-2">
            <span>용도</span>
            <Input type="text" id="last_name" placeholder="용도를 입력하세요" required bind:value={$equipment_form_state['purpose']}/>
          
          </Label>

          <Label class="space-y-2">
            <span>비고</span>
            <Textarea  id="last_name" rows="4"  placeholder="" required bind:value={$equipment_form_state['description']}/>
          </Label>
      
          {#if $equipment_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$equipment_form_state['used']} placeholder="">
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
          <Button  class="w-1/2"  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}    on:click={save($equipment_form_state,title)}>{label_title}</Button>
          <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
          {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
              
          <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />
  
          {/if}
          {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
                
          <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />
  
          {/if}
        
        </svelte:fragment>
    
        
     

      </Modal>

    