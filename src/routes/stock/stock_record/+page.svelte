

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem} from 'flowbite-svelte';
   
    import {url_state,cookie_state,common_item_state,table_list_state,common_toast_state,common_search_state,load_state} from '$lib/store/common/state';
 
    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
    import {makeCustomTable} from '$lib/store/stock/function';
    
	import { afterUpdate, onMount } from 'svelte';
	import moment from 'moment';

    export let data;

 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        
        makeCustomTable(table_list_state,"stock_record",tableComponent,"select");

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/stock_record/stock'){
         
            makeCustomTable(table_list_state,"stock_record",tableComponent,"select");
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
              <Title title='재고 관리' subtitle='재고 수불부'/>
            </div>

           

            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">재고 수불부</span>

                
                      <SearchBar title="stock"/>


                    

                      <div id="example-table-theme" bind:this={tableComponent}></div>
                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    