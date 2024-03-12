



<script>

	// @ts-nocheck
    import {  Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownWrapper, SidebarDropdownItem  } from 'flowbite-svelte'
    import { page } from '$app/stores';
    import { sineIn } from 'svelte/easing';
    import * as Icon from 'svelte-awesome-icons';
  
  let spanClass = 'flex-1 ml-3 whitespace-nowrap';
  $: activeUrl = $page.url.pathname
  $: mainPath = activeUrl.split('/')[1];
    // add your logic here
  
    
  


  import { menu_state } from '$lib/store/common/state';

  import { handleToggle } from '$lib/store/common/function';
  import { afterUpdate, onMount } from 'svelte';


  let transitionParams = {
    x: -320,
    duration: 100,
    easing: sineIn
  };
  // let text_style = 'font-heavy text-green-400 bg-green-100  hover:text-black '
  let text_style = 'font-heavy  hover:text-black '

  console.log('mainPath',mainPath,activeUrl,$page.url);


</script>






	<main>
		<slot />
	</main>

    <Sidebar >
        <SidebarWrapper divClass='overflow-y-auto py-4 px-3 bg-gray-50 rounded  h-screen'>
          <SidebarGroup >
            
            <SidebarItem class={text_style} label="Home" href='/home' active={activeUrl === '/home'} {spanClass}>
             
                <svelte:fragment slot="icon">
                    <Icon.HouseSolid size="20"/>
                </svelte:fragment>
            </SidebarItem>
 
          </SidebarGroup>

          <SidebarGroup border>
            <SidebarDropdownWrapper class={text_style} label="기준정보관리" isOpen={mainPath ==='info' ? true : false} transitionType="fly" {transitionParams} >
                <svelte:fragment slot="icon">
                    <Icon.DatabaseSolid size="20"/>
                </svelte:fragment>
                <SidebarDropdownItem class={text_style} label="직급  관리" href='/info/employment' active={activeUrl === '/info/employment'} on:click={handleToggle('employment')}/>
                <SidebarDropdownItem class={text_style} label="부서  관리" href='/info/department' active={activeUrl === '/info/department'} on:click={handleToggle('department')}/>
             
                <SidebarDropdownItem class={text_style} label="회원 관리" href='/info/user' active={activeUrl === '/info/user'} on:click={handleToggle('user')}/>

              <SidebarDropdownItem class={text_style} label="품목 관리" href='/info/item' active={activeUrl === '/info/item'} on:click={handleToggle('item')} />
              <SidebarDropdownItem class={text_style} label="거래처 관리" href='/info/company' active={activeUrl === '/info/company'} on:click={handleToggle('company')}/>

            </SidebarDropdownWrapper>
 
          </SidebarGroup>

          <SidebarGroup border>
            <SidebarDropdownWrapper class={text_style} label="거래처 관리" isOpen={mainPath ==='customer' ? true : false} transitionType="fly" {transitionParams} >
              <svelte:fragment slot="icon">
                <Icon.StoreSolid size="20"/>
            </svelte:fragment>
        
            </SidebarDropdownWrapper>
          </SidebarGroup>
       
        </SidebarWrapper>
      </Sidebar>

