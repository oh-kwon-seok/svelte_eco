

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    import Util from '$lib/components/modal/stock/Util.svelte';

    import { Tabs, TabItem, Timeline, TimelineItem, Button,ButtonGroup,Dropdown,DropdownItem,Input,Label,Select,Search} from 'flowbite-svelte';
   
    import {url_state,cookie_state,common_item_state,table_list_state,common_toast_state,common_search_state,load_state} from '$lib/store/common/state';
    import {stock_modal_state} from '$lib/store/stock/state';
    
    import * as Icon from 'svelte-awesome-icons';
 
    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
    import {makeCustomTable,stockModalOpen} from '$lib/store/stock/function';
    
	import { afterUpdate, onMount } from 'svelte';
	import moment from 'moment';

    export let data;

 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        
        makeCustomTable(table_list_state,"stock",tableComponent,"select");

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/stock/stock'){
         
            makeCustomTable(table_list_state,"stock",tableComponent,"select");
        }
      
    })
     
 

 

    </script>

<style>
  @import 'tabulator-tables/dist/css/tabulator_modern.min.css';
  

  /* 나머지 스타일 정의 */
</style>


        
        {#if $common_toast_state['value'] === true}
         <Toast />
        {/if}

        
     
        <Header />

        <div class="grid grid-rows-16 grid-flow-col gap-1">
            <div class="row-span-16"> 
              <SideBar />
            </div>
            <div class="col-span-1 row-span-1"> 
              <Title title='재고 관리' subtitle='재고 관리'/>
            </div>

           

            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">재고 관리</span>

                
                      <SearchBar title="stock"/>
                      <div class='m-5'>
                        
                        <Button  color='red' on:click={() => stockModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>
                      
                      
                      
                      </div>


                 
                      <div id="example-table-theme" bind:this={tableComponent}></div>
                    </TabItem>
                   
                  
          
                  </Tabs>


                  {#if $stock_modal_state['title'] === 'update'}
                  <Util title="update" />
                  {:else if $stock_modal_state['title'] === 'check_delete'}
                    <Util  title="check_delete"/>
                  
                  {/if}


                <Footer />
            </div>
         
          </div>
       
        
        
    
    