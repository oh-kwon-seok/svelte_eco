<script>
	// @ts-nocheck
	import '../../../app.postcss';

	import { Navbar, NavBrand, NavHamburger, NavUl, NavLi, Chevron, MegaMenu   } from 'flowbite-svelte'
  import {MENU} from '$lib/module/common/constants'
  import { logout } from '$lib/store/common/function';

  
  let styles = {
    nav_link_style : '',
    nav_item_name : 'font-semibold dark:text-white',
    nav_item_help : 'text-sm font-light dark:text-gray-400',
    


  }
  

</script>
<main>
  <slot />
</main>

	<Navbar let:hidden let:toggle rounded >
        <NavBrand href="/">
            <img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">에코바이오 의학연구소</span>
        </NavBrand>
        <NavHamburger on:click{toggle} />
        <NavUl {hidden}>
            <NavLi class={styles['nav_link_style']}><Chevron class="text-xl " aligned>기준정보 관리</Chevron></NavLi>
            
            <MegaMenu full items={MENU.info} let:item>
              <a href={item.url} class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 h-full">
                <div class={styles['nav_item_name']}>{item.name}</div>
                <span class={styles['nav_item_help']}>{item.help}</span>
              </a>
            </MegaMenu>

            <NavLi class={styles['nav_link_style']}><Chevron aligned>거래처 관리</Chevron></NavLi>
            
            <MegaMenu full items={MENU.customer} let:item>
              <a href={item.url} class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 h-full">
                <div class={styles['nav_item_name']}>{item.name}</div>
                <span class={styles['nav_item_help']}>{item.help}</span>
              </a>
            </MegaMenu>

            <NavLi class={styles['nav_link_style']}><Chevron aligned>영업 관리</Chevron></NavLi>
            
            <MegaMenu full items={MENU.sale} let:item>
              <a href={item.url} class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 h-full">
                <div class={styles['nav_item_name']}>{item.name}</div>
                <span class={styles['nav_item_help']}>{item.help}</span>
              </a>
            </MegaMenu>

            <NavLi class={styles['nav_link_style']} on:click={() => logout()}>로그아웃</NavLi>
          
         
          
            
           
           
        </NavUl>
      </Navbar>


 


	
 