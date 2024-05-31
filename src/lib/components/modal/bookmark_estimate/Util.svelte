
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper, Textarea,Fileupload,Img} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
  
    import {bookmark_estimate_modal_state, bookmark_estimate_form_state} from '$lib/store/bookmark_estimate/state';

    import ItemSearch from '$lib/components/modal/bookmark_estimate/Item.svelte';
    import {common_alert_state, common_toast_state,common_company_state,common_type_state, table_modal_state} from '$lib/store/common/state';
    import {fileButtonClick,handleSubmit} from '$lib/store/common/function';
    import {save,modalClose,bookmarkEstimateModalTable,bookmarkEstimateAddRow, bookmarkEstimateDeleteRow, bookmarkEstimateAllDeleteRow,itemSearchModalClose } from '$lib/store/bookmark_estimate/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {onMount,afterUpdate } from 'svelte';
    import {item_modal_state} from '$lib/store/item/state';

    export let title;

    import { setCookie, getCookie, removeCookie } from '$lib/cookies';

  
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

    let color = title === 'add' || title === 'update' ? 'blue' : 'red'; 

    let showModal = false;

    let tableComponent = "example-table-theme";

    onMount(()=>{
      
  
       if(title === 'add'){
         if($bookmark_estimate_form_state['modal'] === false){
           // 여기에 테이블 그려야됌
         bookmarkEstimateModalTable(table_modal_state,"bookmark_estimate_sub",tableComponent,"info_select","add");
         
       
       }

       }if(title === 'update'){
         // 수정일때, 이따 작업
         if($bookmark_estimate_form_state['modal'] === false){
                bookmarkEstimateModalTable(table_modal_state,"bookmark_estimate_sub",tableComponent,"info_select","update");
             
            }
       }
      
   });

   afterUpdate(()=> {
      
    if(title === 'add'){
         if($bookmark_estimate_form_state['modal'] === false){
           // 여기에 테이블 그려야됌
         bookmarkEstimateModalTable(table_modal_state,"bookmark_estimate_sub",tableComponent,"info_select","add");
         
       }

       }if(title === 'update'){
         // 수정일때, 이따 작업
         if($bookmark_estimate_form_state['modal'] === false){
                bookmarkEstimateModalTable(table_modal_state,"bookmark_estimate_sub",tableComponent,"info_select","update");
             
            }
       }
    })

    

    </script>
      
    <style>
    
    /* .full-screen-modal {
      position: fixed;
      top: 0; 
      left: 0;
      width: 100vw;
    } */
    </style>

 
      
    <Modal  class="w-full" title={`자동견적 ${label_title}`} permanent={true} color={color}  bind:open={$bookmark_estimate_modal_state[title]['use']} size="xl"  placement={'center'}   >
       
          <!-- grid grid-cols-2 gap-4 -->
        <form  action="#" on:submit={handleSubmit} >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4 ">
    
          <Label class="space-y-2">
            <span>견적명</span>
            <Input type="text" id="last_name" placeholder="견적을 입력하세요" required bind:value={$bookmark_estimate_form_state['name']} />
            
            {#if $bookmark_estimate_form_state['name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>
          

        
        
          <Label class="space-y-2">
            <span>제품 사양</span>
            <Textarea type="text" id="last_name" rows="4"  bind:value={$bookmark_estimate_form_state['product_spec']}/>
          </Label>
          <Label class="space-y-2">
            <span>납품 장소</span>
            <Textarea type="text" id="last_name" rows="4"  bind:value={$bookmark_estimate_form_state['ship_place']}/>
          </Label>
          
          <Label class="space-y-2">
            <span>발주조건 및 기타 특이사항</span>
            <Textarea type="text" id="last_name" rows="4"  bind:value={$bookmark_estimate_form_state['description']}/>
           
          </Label>

         
          {#if $bookmark_estimate_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$bookmark_estimate_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
      

          
          
          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
         
          </div>

        
              
         
        
              <div class="grid grid-cols-1 gap-4">
                <p class="mb-4 font-semibold text-xl dark:text-white">레시피 리스트</p>
              
              </div>
              
          

              <div class="flex justify-start">
                <Button class="m-2 " outline color="blue" on:click={(e) =>bookmarkEstimateAddRow(e)}>행 추가</Button>
               
                <Button class="m-2" outline color="red" on:click={bookmarkEstimateDeleteRow}>행 삭제</Button>
                <Button class="m-2" outline color="purple" on:click={bookmarkEstimateAllDeleteRow}>전체 삭제</Button>
              
              </div>
              
         
          
            <div class="flex flex-row">
              <div  class="w-full" id="example-table-theme" bind:this={tableComponent}></div>
            </div>
           
           

          
             
            
          {#if $item_modal_state['title'] === 'bookmark_estimate_search'}
          <ItemSearch title="bookmark_estimate_search" />
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
    <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}  class="w-1/2" on:click={save($bookmark_estimate_form_state,title)}>{label_title}</Button>
    <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
    {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
        
    <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

    {/if}
    {#if $common_alert_state['type'] === 'code' && $common_alert_state['value'] === true}
        
    <Alert  state={'code'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['code'].title} content={DATA_FAIL_ALERT['code'].content} />

    {/if}
    {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
          
    <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />

    {/if}
        
      </svelte:fragment> 
       

      </Modal>
  

    