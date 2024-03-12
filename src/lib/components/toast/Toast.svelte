<script >
    // @ts-ignore
    import { Toast, Button } from 'flowbite-svelte';
    // @ts-ignore
    import { fly } from 'svelte/transition';
    // @ts-ignore
    import {onMount, } from 'svelte';
    import {common_toast_state} from '$lib/store/common/state';
    import {TOAST_SAMPLE} from '$lib/module/common/constants'

  
  
    $: counter = 2;
    
    // @ts-ignore
    const timeout = () => {
        if (--counter > 0)
      return setTimeout(timeout, 1000);
        
        common_toast_state.update(()=> TOAST_SAMPLE['success']);

    }

    onMount(() => {
      timeout();
	});


    
  </script>
  
    {#if $common_toast_state['type'] === 'success' && $common_toast_state['value'] === true}
        <Toast color="green" transition={fly} employment={'none'} params="{{x: 200}}"  bind:open={$common_toast_state['value']}>
            <svelte:fragment slot="icon">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Check icon</span>
              </svelte:fragment>
              데이터 등록에 성공했습니다.
            
        </Toast>
    {/if}
    {#if $common_toast_state['type'] === 'fail' && $common_toast_state['value'] === true}
        <Toast color="red" transition={fly} employment={'none'} params="{{x: 200}}"  bind:open={$common_toast_state['value']}>
            <svelte:fragment slot="icon">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Error icon</span>
              </svelte:fragment>
              데이터 등록에 실패했습니다.
        </Toast>
    {/if}





