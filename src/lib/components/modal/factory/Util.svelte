
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {factory_modal_state, factory_form_state} from '$lib/store/factory/state';
    import {common_alert_state, common_toast_state, common_factory_state,common_company_filter_state} from '$lib/store/common/state';
    
    import {save,modalClose,factorySubAddRow,factorySubDeleteRow,factorySubAllDeleteRow,factorySubSelectDeleteRow} from '$lib/store/factory/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {businessNumber,phoneNumber,validEmail} from '$lib/module/common/function';
    import { afterUpdate, onMount } from 'svelte';
    export let title;
    import {handleSubmit} from '$lib/store/common/function';
    let label_title = '';
    $: factorySubArray = $factory_form_state.factory_sub_array;
   
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

    afterUpdate(()=> {
        
      
          console.log('업데이트됌');
          factorySubArray =$factory_form_state.factory_sub_array;
        

        
      })

  

    </script>

 

    <Modal title={`공장 ${label_title}`} size={"xl"} permanent={true} color={color} bind:open={$factory_modal_state[title]['use']}  placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
         <form action="#"  >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">

          <Label class="space-y-2">
            <span>사업장</span>
            <Select id="countrie" class="mt-2" bind:value={$factory_form_state['company']} placeholder="">
                {#each $common_company_filter_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>

          <Label class="space-y-2">
            <span>공장명</span>
            <Input type="text" id="last_name" placeholder="공장을 입력하세요" required bind:value={$factory_form_state['name']}/>
            {#if $factory_form_state['name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>
          
          <Label class="space-y-2">
            <span>용도</span>
            <Input type="text" id="last_name" placeholder="용도를 입력하세요"  bind:value={$factory_form_state['status']}/>
          </Label>

          <Label class="space-y-2">
            <span>비고</span>
            <Input type="textarea"   id="last_name" placeholder="비고를 적어주세요"  bind:value={$factory_form_state['description']}/>
          </Label>

          {#if $factory_modal_state['title'] === 'update'}
          <Label class="space-y-2">
            <span>사용유무</span>
            <Select id="countries" class="mt-2" bind:value={$factory_form_state['used']} placeholder="">
                  <option value={0}>{"사용안함"}</option>
                  <option value={1}>{"사용"}</option>

              </Select>
          </Label>
        {/if}
      </div>

          <div class="grid grid-cols-1 gap-4">
            <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
            <p class="mb-4 font-semibold text-xl dark:text-white">창고 목록</p>
          </div>

        

          <div class="grid grid-cols-3 gap-4">
      
            <button  on:click={factorySubAddRow}>창고 추가</button>
            <button on:click={factorySubDeleteRow}>창고 삭제</button>
            <button on:click={factorySubAllDeleteRow}>창고 삭제</button>
         
        
            </div>

            
          <div class="grid grid-cols-4 gap-4">
              {#each factorySubArray as item,i} 
          
              <Label class="space-y-1">
                <span>창고명</span>
                <Input type="text"  id="last_name" placeholder="창고명을 입력하세요" bind:value={item['name']}/>
              
              
              </Label>
              <Label class="space-y-1">
                <span>용도</span>
                <Input type="text"  id="last_name" placeholder="용도를 입력하세요"  bind:value={item['status']}/>
              </Label>    
              
              <Label class="space-y-1">
                <span>비고</span>
                <Input type="textarea"  id="last_name" placeholder="비고를 입력하세요"  bind:value={item['description']}/>
              </Label>    

            
              <Label class="space-y-1">
                  <button on:click={()=> factorySubSelectDeleteRow(i)}>삭제</button>
              </Label>    
        
                
            {/each}

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
          <Button  class="w-1/2"  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}    on:click={save($factory_form_state,title)}>{label_title}</Button>
          <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
          {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
              
          <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />
  
          {/if}
          {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
                
          <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />
  
          {/if}
        
        </svelte:fragment>
    
        
     

      </Modal>

    