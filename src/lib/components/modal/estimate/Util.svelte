
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper, Textarea,Fileupload,Img,Datepicker} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
  
    import {estimate_modal_state, estimate_form_state} from '$lib/store/estimate/state';
    import CompanySearch from '$lib/components/modal/estimate/Company.svelte';
    import ItemSearch from '$lib/components/modal/estimate/Item.svelte';

    import BookmarkEstimateSearch from '$lib/components/modal/estimate/BookmarkEstimate.svelte';
    
    import {common_alert_state, common_toast_state,common_company_state,common_type_state, table_modal_state} from '$lib/store/common/state';
    import {fileButtonClick,handleSubmit} from '$lib/store/common/function';
    import {save,modalClose,estimateModalTable,estimateAddRow, estimateDeleteRow, estimateAllDeleteRow,itemSearchModalClose,bookmarkEstimateSearchModalOpen,companySearchModalOpen } from '$lib/store/estimate/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {onMount,afterUpdate } from 'svelte';
    import {item_modal_state} from '$lib/store/item/state';
    import {company_modal_state} from '$lib/store/company/state';
  
    import {bookmark_estimate_modal_state} from '$lib/store/bookmark_estimate/state';
    export let title;

    import { setCookie, getCookie, removeCookie } from '$lib/cookies';

  

    
    let label_title = '';


   
   
    if(title === 'add'){
      label_title = '추가';
    }else if(title === 'update'){
      label_title = '수정';
    }else if(title === 'delete'){
      label_title = '삭제';
    }else if(title === 'check_delete'){
      label_title = '선택 삭제';
    }else if(title === 'print'){
      label_title = '견적서 출력';
    }

    let color ; 


    if(title === 'add' ||  title === 'update'){
      color = "blue";

    }else if(title === 'check_delete'){
      color = "red";

    }else{
      color = "light";

    }

    let showModal = false;

    let tableComponent = "example-table-theme";

    afterUpdate(() => {
        if(title === 'add'){

        
          if($estimate_form_state['modal'] === false){
            estimateModalTable(table_modal_state,"estimate_sub",tableComponent,"info_select","add");
          }
      }
      if(title === 'update'){
      
        
      if($estimate_form_state['modal'] === false){
     
          estimateModalTable(table_modal_state,"estimate_sub",tableComponent,"info_select","update");
        }

     }
    });
    onMount(()=>{
      
 
       if(title === 'add'){
      
        
        if($estimate_form_state['modal'] === false){
         
            estimateModalTable(table_modal_state,"estimate_sub",tableComponent,"info_select","add");
          }

       } if(title === 'update'){
      
        
      if($estimate_form_state['modal'] === false){
        
          estimateModalTable(table_modal_state,"estimate_sub",tableComponent,"info_select","update");
        }

     }
     
  
   });



    

    </script>
      
    <style>
    
    /* .full-screen-modal {
      position: fixed;
      top: 0; 
      left: 0;
      width: 100vw;
    } */
    </style>

 
      
    <Modal  class="w-full" title={`견적 ${label_title}`} permanent={true} color={color}  bind:open={$estimate_modal_state[title]['use']} size="xl"  placement={'center'}   >
       
          <!-- grid grid-cols-2 gap-4 -->
        <form  action="#" on:submit={handleSubmit} >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4 ">
          

          <Label class="space-y-2">
            <span>거래처</span>
            <Input type="text" id="last_name" placeholder="거래처를 입력하세요" required bind:value={$estimate_form_state['customer_name']} on:click={() => {companySearchModalOpen('estimate_company_search')}}/>
            
            {#if $estimate_form_state['customer'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

          
          <Label class="space-y-2">
            <span>견적일자</span>

            <Input type="date"   id="last_name" placeholder="견적일자룰 입력하세요" required bind:value={$estimate_form_state['estimate_date']}/>
          </Label>
          <Label class="space-y-2">
            <span>유효기간</span>

            <Input type="text"   id="last_name" placeholder="유효기간을 입력하세요" required bind:value={$estimate_form_state['expire']}/>
          </Label>
          <Label class="space-y-2">
            <span>견적코드</span>
            <Input type="text" id="last_name" placeholder="견적코드를 입력하세요" required bind:value={$estimate_form_state['code']} />
            
            {#if $estimate_form_state['code'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>


    
          <Label class="space-y-2">
            <span>견적명</span>
            <Input type="text" id="last_name" placeholder="견적을 입력하세요" required bind:value={$estimate_form_state['name']} />
            
            {#if $estimate_form_state['name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>



          <Label class="space-y-2">
            <span>제품 사양</span>
            <Textarea type="text" id="last_name" rows="4"  bind:value={$estimate_form_state['product_spec']}/>
          </Label>
          <Label class="space-y-2">
            <span>납품 장소</span>
            <Textarea type="text" id="last_name" rows="4"  bind:value={$estimate_form_state['ship_place']}/>
          </Label>
          
          <Label class="space-y-2">
            <span>발주조건 및 기타 특이사항</span>
            <Textarea type="text" id="last_name" rows="4"  bind:value={$estimate_form_state['description']}/>
           
          </Label>

         
          {#if $estimate_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$estimate_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
      

          
          
          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
         
          </div>

          <div class="grid grid-cols-3 gap-4">
          
           <Button class="m-2 " outline color="blue" on:click={() => {bookmarkEstimateSearchModalOpen('estimate_bookmark_estimate_search')}}>자동견적 불러오기</Button>
              
     
      </div>

        
              
         
         
              <div class="grid grid-cols-1 gap-4">
                <p class="mb-4 font-semibold text-xl dark:text-white">레시피 리스트</p>
              
              </div>
              
          

              <div class="flex justify-start">
                <Button class="m-2 " outline color="blue" on:click={(e) =>estimateAddRow(e)}>행 추가</Button>
               
                <Button class="m-2" outline color="red" on:click={estimateDeleteRow}>행 삭제</Button>
                <Button class="m-2" outline color="purple" on:click={estimateAllDeleteRow}>전체 삭제</Button>
              
              </div>
              
         
          
            <div class="flex flex-row">
              <div  class="w-full" id="example-table-theme" bind:this={tableComponent}></div>
            </div>
           
           

            {#if $company_modal_state['title'] === 'estimate_company_search'}
            <CompanySearch title="estimate_company_search" />
          {/if}
             
            
          {#if $item_modal_state['title'] === 'estimate_item_search'}
              <ItemSearch title="estimate_item_search" />
          {/if}
          {#if $bookmark_estimate_modal_state['title'] === 'estimate_bookmark_estimate_search'}
            <BookmarkEstimateSearch title="estimate_bookmark_estimate_search" />
          {/if}

   


          {#if $common_alert_state['type'] === 'select' && $common_alert_state['value'] === true}
            
            <Alert  state={'select'} color={DATA_SELECT_ALERT.color} title={DATA_SELECT_ALERT['select'].title} content={DATA_SELECT_ALERT['select'].content} />

          {/if}
          

          <div class="grid grid-cols-6 gap-4">
           
          </div>
            {:else }
            {#if title === 'check_delete'}
            <div>선택한 항목을 삭제하시겠습니까?</div>
            {:else if title === 'print' }
            <div>선택한 항목을 출력하시겠습니까?</div>
            
            {/if}
          {/if}
    
    
      
      
        </form>
   <svelte:fragment slot='footer'> 
    <Button  color={color}  class="w-1/2" on:click={save($estimate_form_state,title)}>{label_title}</Button>
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
    {#if $common_alert_state['type'] === 'print' && $common_alert_state['value'] === true}
      <Alert  state={'print'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['print'].title} content={DATA_FAIL_ALERT['print'].content} />
    {/if}
        
      </svelte:fragment> 
       

      </Modal>
  

    