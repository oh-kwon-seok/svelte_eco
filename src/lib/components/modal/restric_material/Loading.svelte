
<script>
// @ts-nocheck

	import { commaNumber } from '$lib/module/common/function';

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper,Spinner} from 'flowbite-svelte'
    

    import { InfoCircleSolid } from 'flowbite-svelte-icons';
 
    import {restric_material_modal_state, restric_material_form_state,restric_material_status_state} from '$lib/store/restric_material/state';
    export let title; 


    let open = true;
  

    </script>

 

    <Modal title={title} permanent={true} color={'blue'} bind:open={open} size="xs" placement={'center'}   >
        <div class="text-center">
            
          
            
           

            
            <InfoCircleSolid class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                
                {#if $restric_material_status_state['total_count'] > 0}
                    <span>{$restric_material_status_state['title']}</span>
                    <br/>
                    

                    {#if $restric_material_status_state['final_total_count'] > 0}
                    <span>데이터 수량 : {commaNumber($restric_material_status_state['final_total_count'])}</span>
                    <br/>
                    <span>최소 1분에서 5분 가량 걸릴 수 있습니다.</span>
                    
                    {:else}
                    <span>{Math.round($restric_material_status_state['ing_count'] / $restric_material_status_state['total_count'] * 1000) / 10}{"%"}</span>
                    <br/>
                   
                    {/if}
                {/if}
               
            
            </h3>
            <Spinner size={8} />
          </div>
  
    
      </Modal>

    