



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
                <SidebarDropdownItem class={text_style} label="품목 구분 관리" href='/info/type' active={activeUrl === '/info/type'} on:click={handleToggle('type')} />
             
              <SidebarDropdownItem class={text_style} label="품목 관리" href='/info/item' active={activeUrl === '/info/item'} on:click={handleToggle('item')} />
               
              
              <SidebarDropdownItem class={text_style} label="거래처 관리" href='/info/company' active={activeUrl === '/info/company'} on:click={handleToggle('company')}/>
              <SidebarDropdownItem class={text_style} label="공장 관리" href='/info/factory' active={activeUrl === '/info/factory'} on:click={handleToggle('factory')}/>
                
              <SidebarDropdownItem class={text_style} label="설비 관리" href='/info/equipment' active={activeUrl === '/info/equipment'} on:click={handleToggle('equipment')}/>
              

              <SidebarDropdownItem class={text_style} label="화장품 원료성분정보 관리" href='/info/cosmetic_material' active={activeUrl === '/info/cosmetic_material'} on:click={handleToggle('cosmetic_material')}/>
              <SidebarDropdownItem class={text_style} label="사용제한 원료정보 관리" href='/info/restric_material' active={activeUrl === '/info/restric_material'} on:click={handleToggle('restric_material')}/>
              <SidebarDropdownItem class={text_style} label="사용제한 배합금지국가 관리" href='/info/restric_material_country' active={activeUrl === '/info/restric_material_country'} on:click={handleToggle('restric_material_country')}/>
            
              
              <SidebarDropdownItem class={text_style} label="공정 관리" href='/info/process' active={activeUrl === '/info/process'} on:click={handleToggle('process')}/>

              <SidebarDropdownItem class={text_style} label="생산레시피 관리" href='/info/bom' active={activeUrl === '/info/bom'} on:click={handleToggle('bom')}/>
        
              <SidebarDropdownItem class={text_style} label="자동견적레시피 관리" href='/info/bookmark_estimate' active={activeUrl === '/info/bookmark_estimate'} on:click={handleToggle('bookmark_estimate')}/>
        
            </SidebarDropdownWrapper>
 
          </SidebarGroup>

          <SidebarGroup border>
            <SidebarDropdownWrapper class={text_style} label="영업 관리" isOpen={mainPath ==='sales' ? true : false} transitionType="fly" {transitionParams} >
              <svelte:fragment slot="icon">
                <Icon.StoreSolid size="20"/>
            </svelte:fragment>
            <SidebarDropdownItem class={text_style} label="견적 관리" href='/sales/estimate' active={activeUrl === '/sales/estimate'} on:click={handleToggle('estimate')}/>
            <SidebarDropdownItem class={text_style} label="주문 관리" href='/sales/order' active={activeUrl === '/sales/order'} on:click={handleToggle('order')}/>
            </SidebarDropdownWrapper>
          </SidebarGroup>
          
          <SidebarGroup border>
            
            <SidebarDropdownWrapper class={text_style} label="재고 관리" isOpen={mainPath ==='stock' ? true : false} transitionType="fly" {transitionParams} >
              <svelte:fragment slot="icon">
                <Icon.TableCellsSolid size="20"/>
            </svelte:fragment>
            <SidebarDropdownItem class={text_style} label="입출고 관리" href='/stock/stock_inout' active={activeUrl === '/stock/stock_inout'} on:click={handleToggle('stock_inout')} />
           
            <SidebarDropdownItem class={text_style} label="재고 관리" href='/stock/stock' active={activeUrl === '/stock/stock'} on:click={handleToggle('stock')}/>
            <SidebarDropdownItem class={text_style} label="재고 수불부" href='/stock/stock_record' active={activeUrl === '/stock/stock_record'} on:click={handleToggle('stock_record')} />
            </SidebarDropdownWrapper>
          </SidebarGroup>
       
        </SidebarWrapper>
      </Sidebar>

