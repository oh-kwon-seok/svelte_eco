
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper,Textarea} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {restric_material_country_modal_state, restric_material_country_form_state} from '$lib/store/restric_material_country/state';
    import {common_alert_state, common_toast_state, common_restric_material_country_state} from '$lib/store/common/state';
    
    import {save,modalClose} from '$lib/store/restric_material_country/function';
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

 

    <Modal title={`사용제한 배합금지국가정보 ${label_title}`} permanent={true} color={color} bind:open={$restric_material_country_modal_state[title]['use']} size="xl" placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
         <form action="#" on:submit={handleSubmit} >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
          
        

      
          <Label class="space-y-2">
            <span>구분</span>
            <Textarea  id="last_name" rows="4" readOnly placeholder="" required bind:value={$restric_material_country_form_state['regulate_type']}/>       
          </Label>

          <Label class="space-y-2">
            <span>규제코드</span>
            <Textarea  id="last_name" rows="4" readOnly placeholder="" required bind:value={$restric_material_country_form_state['regl_code']}/>       
          </Label>

          <Label class="space-y-2">
            <span>성분코드</span>
            <Textarea  id="last_name" rows="4" readOnly placeholder="" required bind:value={$restric_material_country_form_state['ingr_code']}/>       
          </Label>
       
          <Label class="space-y-2">
            <span>배합제한국가</span>
            <Textarea  id="last_name" rows="4" readOnly placeholder="" required bind:value={$restric_material_country_form_state['country_name']}/>       
          </Label>
          <Label class="space-y-2">
            <span>고시성분명</span>
            <Textarea  id="last_name" rows="4" readOnly placeholder="" required bind:value={$restric_material_country_form_state['notice_ingr_name']}/>       
          </Label>
          <Label class="space-y-2">
            <span>단서조항</span>
            <Textarea  id="last_name" rows="4" readOnly placeholder="" required bind:value={$restric_material_country_form_state['provis_atrcl']}/>       
          </Label>
          <Label class="space-y-2">
            <span>제한사항</span>
            <Textarea  id="last_name" rows="4" readOnly placeholder="" required bind:value={$restric_material_country_form_state['limit_cond']}/>

          </Label>


        
        

        
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries"  disabled class="mt-2" bind:value={$restric_material_country_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
         
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
          

        {#if title !== 'update' && title !== 'add'}

          <Button  class="w-1/2"  color={'red'}    on:click={save($restric_material_country_form_state,title)}>{label_title}</Button>
        
        {/if}


          
          
          <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
          {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
              
          <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />
  
          {/if}
          {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
                
          <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />
  
          {/if}
        
        </svelte:fragment>
    
      </Modal>

    